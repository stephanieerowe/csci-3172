/**
 * RecipeFind — Netlify Serverless Function
 * CSCI 3172 Lab 5
 *
 * Acts as a secure server-side proxy to the Spoonacular API.
 * The API key is stored in Netlify environment variables (SPOONACULAR_API_KEY)
 * and never exposed to the client.
 *
 * Endpoint: GET /.netlify/functions/recipes
 * Query params (all optional):
 *   includeIngredients  — comma-separated ingredient names
 *   diet                — comma-separated Spoonacular diet labels
 *   intolerances        — comma-separated intolerance labels
 *   number              — number of results (default 8, max 24)
 */

exports.handler = async function (event) {

  // ── Only allow GET ──────────────────────────────────────────────────────────
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: Object.assign(jsonHeaders(), { Allow: 'GET' }),
      body: JSON.stringify({ error: 'Method not allowed.' })
    };
  }

  // ── Require API key ─────────────────────────────────────────────────────────
  var API_KEY = process.env.SPOONACULAR_API_KEY;
  if (!API_KEY) {
    console.error('[recipes fn] SPOONACULAR_API_KEY environment variable is not set.');
    return errorResponse(500,
      'API key is not configured. Set SPOONACULAR_API_KEY in Netlify environment variables.');
  }

  // ── Sanitize & validate inputs ──────────────────────────────────────────────
  var query            = event.queryStringParameters || {};
  var includeIngredients = sanitizeParam(query.includeIngredients);
  var diet             = sanitizeParam(query.diet);
  var intolerances     = sanitizeParam(query.intolerances);
  var number           = clamp(parseInt(query.number, 10) || 8, 1, 24);

  // ── Build Spoonacular request ───────────────────────────────────────────────
  var params = new URLSearchParams({
    apiKey:               API_KEY,
    number:               number,
    addRecipeInformation: 'true',
    fillIngredients:      'true'
  });

  if (includeIngredients) params.set('includeIngredients', includeIngredients);
  if (diet)               params.set('diet',               diet);
  if (intolerances)       params.set('intolerances',       intolerances);

  var spoonUrl = 'https://api.spoonacular.com/recipes/complexSearch?' + params.toString();

  try {
    var response = await fetch(spoonUrl);

    if (!response.ok) {
      var errText = await response.text().catch(function () { return ''; });
      console.error('[recipes fn] Spoonacular responded with', response.status, errText);

      if (response.status === 401 || response.status === 403) {
        return errorResponse(401, 'Invalid or expired API key. Verify your Spoonacular API key.');
      }
      if (response.status === 402) {
        return errorResponse(402, 'Daily API quota exceeded. Please try again tomorrow.');
      }
      return errorResponse(response.status, 'Failed to fetch recipes from Spoonacular.');
    }

    var data = await response.json();
    return {
      statusCode: 200,
      headers: jsonHeaders(),
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('[recipes fn] Unexpected error:', err);
    return errorResponse(500, 'An unexpected server error occurred. Please try again.');
  }
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Standard JSON response headers including basic security headers. */
function jsonHeaders() {
  return {
    'Content-Type':           'application/json',
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff'
  };
}

/** Build a consistent error response object. */
function errorResponse(status, message) {
  return {
    statusCode: status,
    headers: jsonHeaders(),
    body: JSON.stringify({ error: message })
  };
}

/**
 * Sanitize a query-string parameter.
 * Allows only letters, digits, spaces, commas, and hyphens.
 * Limits length to prevent excessively large inputs.
 *
 * @param {string|undefined} value
 * @returns {string|null}
 */
function sanitizeParam(value) {
  if (!value || typeof value !== 'string') return null;
  var cleaned = value.replace(/[^a-zA-Z0-9 ,\-]/g, '').trim().slice(0, 500);
  return cleaned || null;
}

/**
 * Clamp a number to [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
