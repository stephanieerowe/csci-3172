/**
 * Unit Tests — Netlify Serverless Function (netlify/functions/recipes.js)
 * CSCI 3172 Lab 5
 *
 * The global `fetch` is replaced with a Jest mock so no real HTTP requests
 * are ever made.  Each test group sets up a fresh mock response, fully
 * isolating the handler logic from external dependencies.
 *
 * Run:  npm test   (from labs/lab5/)
 */

// ── Mock global fetch ─────────────────────────────────────────────────────────
global.fetch = jest.fn();

const { handler } = require('../netlify/functions/recipes');

// ── Test helpers ──────────────────────────────────────────────────────────────

/**
 * Build a minimal Netlify event object.
 * @param {Object} [queryParams={}]
 * @param {string} [method='GET']
 */
function makeEvent(queryParams = {}, method = 'GET') {
  return { httpMethod: method, queryStringParameters: queryParams };
}

/** Configure fetch to resolve with a successful JSON payload. */
function mockFetchSuccess(data) {
  global.fetch.mockResolvedValueOnce({
    ok:   true,
    json: async () => data
  });
}

/** Configure fetch to resolve with an error HTTP status. */
function mockFetchError(status, textBody = '') {
  global.fetch.mockResolvedValueOnce({
    ok:     false,
    status: status,
    text:   async () => textBody
  });
}

// ── Setup / teardown ──────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  process.env.SPOONACULAR_API_KEY = 'test-key-abc123';
});

afterAll(() => {
  delete process.env.SPOONACULAR_API_KEY;
});

// ── API key validation ────────────────────────────────────────────────────────
describe('recipes handler — API key validation', () => {

  test('returns HTTP 500 when SPOONACULAR_API_KEY is not set', async () => {
    delete process.env.SPOONACULAR_API_KEY;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toMatch(/API key/i);
  });

});

// ── HTTP method restriction ───────────────────────────────────────────────────
describe('recipes handler — HTTP method restriction', () => {

  test('returns HTTP 405 for POST requests', async () => {
    const result = await handler(makeEvent({}, 'POST'));
    expect(result.statusCode).toBe(405);
  });

  test('returns HTTP 405 for DELETE requests', async () => {
    const result = await handler(makeEvent({}, 'DELETE'));
    expect(result.statusCode).toBe(405);
  });

  test('returns HTTP 405 for PUT requests', async () => {
    const result = await handler(makeEvent({}, 'PUT'));
    expect(result.statusCode).toBe(405);
  });

});

// ── Successful responses ──────────────────────────────────────────────────────
describe('recipes handler — successful responses', () => {

  test('returns HTTP 200 with recipe data forwarded from Spoonacular', async () => {
    const mockData = { results: [{ id: 1, title: 'Pasta Primavera' }], totalResults: 1 };
    mockFetchSuccess(mockData);

    const result = await handler(makeEvent({ number: '4' }));
    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body.results).toHaveLength(1);
    expect(body.results[0].title).toBe('Pasta Primavera');
  });

  test('includes Content-Type: application/json header', async () => {
    mockFetchSuccess({ results: [] });
    const result = await handler(makeEvent());
    expect(result.headers['Content-Type']).toBe('application/json');
  });

  test('includes X-Content-Type-Options header', async () => {
    mockFetchSuccess({ results: [] });
    const result = await handler(makeEvent());
    expect(result.headers['X-Content-Type-Options']).toBe('nosniff');
  });

});

// ── Spoonacular API error handling ────────────────────────────────────────────
describe('recipes handler — Spoonacular error handling', () => {

  test('returns HTTP 401 and an informative message for an invalid API key', async () => {
    mockFetchError(401, 'Unauthorized');
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(401);
    const body = JSON.parse(result.body);
    expect(body.error).toMatch(/api key/i);
  });

  test('returns HTTP 402 and a quota message when the free-tier quota is exceeded', async () => {
    mockFetchError(402, 'Payment Required');
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(402);
    const body = JSON.parse(result.body);
    expect(body.error).toMatch(/quota/i);
  });

  test('returns the same status code for other Spoonacular server errors', async () => {
    mockFetchError(503, 'Service Unavailable');
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(503);
  });

  test('returns HTTP 500 when fetch itself throws a network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toMatch(/unexpected/i);
  });

});

// ── Input sanitization ────────────────────────────────────────────────────────
describe('recipes handler — input sanitization', () => {

  test('clamps a number above 24 down to 24', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({ number: '999' }));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('number=24');
  });

  test('clamps a number below 1 up to 1', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({ number: '-3' }));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('number=1');
  });

  test('uses default of 8 when number is not provided', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({}));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('number=8');
  });

  test('strips disallowed characters from the ingredients parameter', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({ includeIngredients: 'chicken<script>alert(1)</script>' }));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).not.toContain('<script>');
    expect(calledUrl).toContain('chicken');
  });

  test('excludes includeIngredients from the upstream URL when not provided', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({}));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).not.toContain('includeIngredients');
  });

  test('passes diet and intolerances through to Spoonacular when valid', async () => {
    mockFetchSuccess({ results: [] });
    await handler(makeEvent({ diet: 'vegetarian', intolerances: 'gluten,dairy' }));
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('diet=vegetarian');
    expect(calledUrl).toContain('intolerances=gluten%2Cdairy');
  });

  test('does not include the API key in the response body', async () => {
    mockFetchSuccess({ results: [] });
    const result = await handler(makeEvent());
    expect(result.body).not.toContain('test-key-abc123');
  });

});
