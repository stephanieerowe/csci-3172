/**
 * RecipeFind — Utility Functions
 * CSCI 3172 Lab 5
 *
 * Pure, side-effect-free helper functions used by both the client-side
 * application and the unit-test suite. Exported for Node/Jest via the
 * conditional at the bottom; exposed as the global `RecipeUtils` in the browser.
 */

const RecipeUtils = {

  /**
   * Parse a raw ingredient input string into a clean, deduplicated array.
   * Splits on commas, trims whitespace, lowercases, and removes empty tokens.
   *
   * @param {string} input - Raw text (e.g. "Chicken, rice , GARLIC")
   * @returns {string[]}
   */
  parseIngredients: function (input) {
    if (!input || typeof input !== 'string') return [];
    return [
      ...new Set(
        input
          .split(',')
          .map(function (s) { return s.trim().toLowerCase(); })
          .filter(function (s) { return s.length > 0; })
      )
    ];
  },

  /**
   * Build a URLSearchParams object for the recipe-search API endpoint.
   *
   * @param {Object}   options
   * @param {string[]} [options.ingredients=[]]   - Ingredient names
   * @param {string[]} [options.diets=[]]         - Spoonacular diet labels
   * @param {string[]} [options.intolerances=[]]  - Spoonacular intolerance labels
   * @param {number}   [options.number=8]         - Result count (clamped 1–100)
   * @returns {URLSearchParams}
   */
  buildQueryParams: function (options) {
    var ingredients  = (options && options.ingredients)  || [];
    var diets        = (options && options.diets)        || [];
    var intolerances = (options && options.intolerances) || [];
    var rawNumber    = (options && options.number !== undefined) ? options.number : 8;
    var parsed       = Number(rawNumber);
    var number       = Math.max(1, Math.min(100, isNaN(parsed) ? 8 : parsed));

    var params = new URLSearchParams();
    params.set('number', number);

    if (ingredients.length  > 0) params.set('includeIngredients', ingredients.join(','));
    if (diets.length        > 0) params.set('diet',               diets.join(','));
    if (intolerances.length > 0) params.set('intolerances',       intolerances.join(','));

    return params;
  },

  /**
   * Format a duration in minutes into a human-readable string.
   *
   * @param {number} minutes
   * @returns {string} e.g. "45 min", "1 hr", "1 hr 30 min", or "N/A"
   */
  formatTime: function (minutes) {
    if (!minutes || minutes <= 0) return 'N/A';
    var hrs  = Math.floor(minutes / 60);
    var mins = minutes % 60;
    if (hrs  === 0) return mins + ' min';
    if (mins === 0) return hrs + ' hr';
    return hrs + ' hr ' + mins + ' min';
  },

  /**
   * Escape HTML special characters to prevent XSS when inserting
   * user-controlled or API-sourced text via innerHTML.
   * Prefer textContent where possible; use this only when innerHTML is required.
   *
   * @param {string} str
   * @returns {string}
   */
  sanitizeText: function (str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#039;');
  },

  /**
   * Validate that a string is a safe http/https URL before using it as an
   * image source. Blocks javascript: and data: URLs.
   *
   * @param {string} url
   * @returns {boolean}
   */
  isValidImageUrl: function (url) {
    if (!url || typeof url !== 'string') return false;
    try {
      var parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch (_) {
      return false;
    }
  },

  /**
   * Capitalize the first character of a string.
   *
   * @param {string} str
   * @returns {string}
   */
  capitalize: function (str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

};

// Dual-mode export: CommonJS (Jest/Node) and browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecipeUtils;
}
