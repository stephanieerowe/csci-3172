/**
 * Unit Tests — RecipeUtils (client-side utility functions)
 * CSCI 3172 Lab 5
 *
 * All functions in js/utils.js are pure (no DOM, no network) so they can be
 * tested in isolation with no mocking required.
 *
 * Run:  npm test   (from labs/lab5/)
 */

const RecipeUtils = require('../js/utils.js');

// ── parseIngredients ──────────────────────────────────────────────────────────
describe('RecipeUtils.parseIngredients', () => {

  test('returns an empty array for an empty string', () => {
    expect(RecipeUtils.parseIngredients('')).toEqual([]);
  });

  test('returns an empty array for null / undefined input', () => {
    expect(RecipeUtils.parseIngredients(null)).toEqual([]);
    expect(RecipeUtils.parseIngredients(undefined)).toEqual([]);
  });

  test('parses a single ingredient', () => {
    expect(RecipeUtils.parseIngredients('chicken')).toEqual(['chicken']);
  });

  test('parses multiple comma-separated ingredients', () => {
    expect(RecipeUtils.parseIngredients('chicken, rice, garlic'))
      .toEqual(['chicken', 'rice', 'garlic']);
  });

  test('trims surrounding whitespace from each ingredient', () => {
    expect(RecipeUtils.parseIngredients('  chicken ,  rice '))
      .toEqual(['chicken', 'rice']);
  });

  test('converts ingredient names to lowercase', () => {
    expect(RecipeUtils.parseIngredients('Chicken,RICE'))
      .toEqual(['chicken', 'rice']);
  });

  test('deduplicates repeated ingredients', () => {
    expect(RecipeUtils.parseIngredients('chicken, chicken, rice'))
      .toEqual(['chicken', 'rice']);
  });

  test('filters out empty tokens (double commas, trailing commas)', () => {
    expect(RecipeUtils.parseIngredients('chicken,,rice,'))
      .toEqual(['chicken', 'rice']);
  });

});

// ── buildQueryParams ──────────────────────────────────────────────────────────
describe('RecipeUtils.buildQueryParams', () => {

  test('defaults number to 8 when not provided', () => {
    const p = RecipeUtils.buildQueryParams({});
    expect(p.get('number')).toBe('8');
  });

  test('sets the number parameter', () => {
    const p = RecipeUtils.buildQueryParams({ number: 12 });
    expect(p.get('number')).toBe('12');
  });

  test('includes includeIngredients when ingredients are provided', () => {
    const p = RecipeUtils.buildQueryParams({ ingredients: ['chicken', 'rice'] });
    expect(p.get('includeIngredients')).toBe('chicken,rice');
  });

  test('omits includeIngredients when ingredients array is empty', () => {
    const p = RecipeUtils.buildQueryParams({ ingredients: [] });
    expect(p.has('includeIngredients')).toBe(false);
  });

  test('includes diet when diet values are provided', () => {
    const p = RecipeUtils.buildQueryParams({ diets: ['vegetarian', 'gluten free'] });
    expect(p.get('diet')).toBe('vegetarian,gluten free');
  });

  test('omits diet when diets array is empty', () => {
    const p = RecipeUtils.buildQueryParams({ diets: [] });
    expect(p.has('diet')).toBe(false);
  });

  test('includes intolerances when provided', () => {
    const p = RecipeUtils.buildQueryParams({ intolerances: ['gluten', 'dairy'] });
    expect(p.get('intolerances')).toBe('gluten,dairy');
  });

  test('clamps number to at least 1 when given 0 or negative', () => {
    expect(RecipeUtils.buildQueryParams({ number: 0  }).get('number')).toBe('1');
    expect(RecipeUtils.buildQueryParams({ number: -5 }).get('number')).toBe('1');
  });

  test('clamps number to 100 when given a value above 100', () => {
    expect(RecipeUtils.buildQueryParams({ number: 999 }).get('number')).toBe('100');
  });

  test('handles a non-numeric number gracefully, falling back to 8', () => {
    expect(RecipeUtils.buildQueryParams({ number: 'banana' }).get('number')).toBe('8');
  });

});

// ── formatTime ────────────────────────────────────────────────────────────────
describe('RecipeUtils.formatTime', () => {

  test('returns "N/A" for 0', () => {
    expect(RecipeUtils.formatTime(0)).toBe('N/A');
  });

  test('returns "N/A" for null / undefined', () => {
    expect(RecipeUtils.formatTime(null)).toBe('N/A');
    expect(RecipeUtils.formatTime(undefined)).toBe('N/A');
  });

  test('returns "N/A" for negative values', () => {
    expect(RecipeUtils.formatTime(-10)).toBe('N/A');
  });

  test('formats minutes only (less than 60)', () => {
    expect(RecipeUtils.formatTime(45)).toBe('45 min');
    expect(RecipeUtils.formatTime(30)).toBe('30 min');
  });

  test('formats whole hours with no remainder', () => {
    expect(RecipeUtils.formatTime(60)).toBe('1 hr');
    expect(RecipeUtils.formatTime(120)).toBe('2 hr');
  });

  test('formats hours and minutes together', () => {
    expect(RecipeUtils.formatTime(90)).toBe('1 hr 30 min');
    expect(RecipeUtils.formatTime(75)).toBe('1 hr 15 min');
  });

});

// ── sanitizeText ──────────────────────────────────────────────────────────────
describe('RecipeUtils.sanitizeText', () => {

  test('returns an empty string for null / empty input', () => {
    expect(RecipeUtils.sanitizeText(null)).toBe('');
    expect(RecipeUtils.sanitizeText('')).toBe('');
  });

  test('escapes < and > to prevent HTML injection', () => {
    expect(RecipeUtils.sanitizeText('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });

  test('escapes double and single quotes', () => {
    expect(RecipeUtils.sanitizeText('say "hi"')).toBe('say &quot;hi&quot;');
    expect(RecipeUtils.sanitizeText("it's")).toBe('it&#039;s');
  });

  test('escapes ampersands', () => {
    expect(RecipeUtils.sanitizeText('salt & pepper')).toBe('salt &amp; pepper');
  });

  test('neutralises a classic XSS payload', () => {
    expect(RecipeUtils.sanitizeText('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  test('leaves safe plain text unchanged', () => {
    expect(RecipeUtils.sanitizeText('Chicken Tikka Masala')).toBe('Chicken Tikka Masala');
  });

});

// ── isValidImageUrl ───────────────────────────────────────────────────────────
describe('RecipeUtils.isValidImageUrl', () => {

  test('returns true for a valid https URL', () => {
    expect(RecipeUtils.isValidImageUrl('https://spoonacular.com/recipeImages/1.jpg'))
      .toBe(true);
  });

  test('returns true for a valid http URL', () => {
    expect(RecipeUtils.isValidImageUrl('http://example.com/image.png')).toBe(true);
  });

  test('returns false for null', () => {
    expect(RecipeUtils.isValidImageUrl(null)).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(RecipeUtils.isValidImageUrl('')).toBe(false);
  });

  test('returns false for a plain string that is not a URL', () => {
    expect(RecipeUtils.isValidImageUrl('not-a-url')).toBe(false);
  });

  test('returns false for a javascript: URL (XSS vector)', () => {
    expect(RecipeUtils.isValidImageUrl('javascript:alert(1)')).toBe(false);
  });

  test('returns false for a data: URL', () => {
    expect(RecipeUtils.isValidImageUrl('data:image/png;base64,abc')).toBe(false);
  });

});

// ── capitalize ────────────────────────────────────────────────────────────────
describe('RecipeUtils.capitalize', () => {

  test('capitalizes the first letter of a lowercase word', () => {
    expect(RecipeUtils.capitalize('vegetarian')).toBe('Vegetarian');
  });

  test('does not change an already-capitalized string', () => {
    expect(RecipeUtils.capitalize('Vegan')).toBe('Vegan');
  });

  test('returns an empty string for null / empty input', () => {
    expect(RecipeUtils.capitalize(null)).toBe('');
    expect(RecipeUtils.capitalize('')).toBe('');
  });

  test('handles a single character', () => {
    expect(RecipeUtils.capitalize('v')).toBe('V');
  });

});
