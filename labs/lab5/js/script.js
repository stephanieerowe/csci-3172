/**
 * RecipeFind — Main Client Script
 * CSCI 3172 Lab 5
 *
 * Handles all DOM interactions, ingredient-tag management, form submission,
 * fetch calls to the Netlify serverless function, and dynamic rendering of
 * recipe cards and the recipe-detail modal.
 *
 * Depends on: RecipeUtils (js/utils.js) and Bootstrap 5 (bootstrap.bundle.min.js)
 */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  /** @type {string[]} Currently added ingredient tags */
  var ingredients = [];

  // ── DOM References ─────────────────────────────────────────────────────────
  var form = document.getElementById('recipe-form');
  var ingredientInput = document.getElementById('ingredients-input');
  var tagContainer = document.getElementById('ingredient-tags');
  var searchBtn = document.getElementById('search-btn');
  var clearBtn = document.getElementById('clear-btn');
  var loadingState = document.getElementById('loading-state');
  var errorState = document.getElementById('error-state');
  var errorMessage = document.getElementById('error-message');
  var resultsSection = document.getElementById('results-section');
  var recipeGrid = document.getElementById('recipe-grid');
  var emptyState = document.getElementById('empty-state');
  var resultsBadge = document.getElementById('results-count-badge');
  var modalEl = document.getElementById('recipeModal');
  var modalTitle = document.getElementById('recipeModalLabel');
  var modalBody = document.getElementById('modal-content-body');
  var modalSourceLink = document.getElementById('modal-source-link');

  var bsModal = new bootstrap.Modal(modalEl);

  // ── Ingredient Tag Management ──────────────────────────────────────────────

  /**
   * Add an ingredient to the list (if not already present) and re-render tags.
   * @param {string} value
   */
  function addIngredient(value) {
    var cleaned = value.trim().toLowerCase().replace(/,/g, '');
    if (!cleaned || ingredients.indexOf(cleaned) !== -1) return;
    ingredients.push(cleaned);
    renderTags();
  }

  /**
   * Remove an ingredient from the list and re-render tags.
   * @param {string} value
   */
  function removeIngredient(value) {
    ingredients = ingredients.filter(function (i) { return i !== value; });
    renderTags();
  }

  /** Render the current ingredient array as interactive tag chips. */
  function renderTags() {
    tagContainer.innerHTML = '';
    ingredients.forEach(function (ingredient) {
      var tag = document.createElement('span');
      tag.className = 'ingredient-tag';
      tag.setAttribute('role', 'listitem');
      tag.setAttribute('tabindex', '0');
      tag.setAttribute('aria-label', ingredient + ' — press Enter or Space to remove');

      var textNode = document.createTextNode(ingredient + '\u00A0');
      var removeSpan = document.createElement('span');
      removeSpan.className = 'remove-tag';
      removeSpan.setAttribute('aria-hidden', 'true');
      removeSpan.textContent = '×';

      tag.appendChild(textNode);
      tag.appendChild(removeSpan);

      tag.addEventListener('click', function () { removeIngredient(ingredient); });
      tag.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          removeIngredient(ingredient);
        }
      });

      tagContainer.appendChild(tag);
    });
  }

  // Focus the text input when clicking anywhere on the wrapper
  document.querySelector('.ingredient-input-wrapper').addEventListener('click', function () {
    ingredientInput.focus();
  });

  ingredientInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      var val = this.value.replace(/,/g, '').trim();
      if (val) { addIngredient(val); this.value = ''; }
    } else if (e.key === 'Backspace' && this.value === '' && ingredients.length > 0) {
      // Remove last tag on backspace when input is empty
      removeIngredient(ingredients[ingredients.length - 1]);
    }
  });

  // Commit any text left in the field when the user tabs or clicks away
  ingredientInput.addEventListener('blur', function () {
    var val = this.value.replace(/,/g, '').trim();
    if (val) { addIngredient(val); this.value = ''; }
  });

  // ── Clear Button ────────────────────────────────────────────────────────────
  clearBtn.addEventListener('click', function () {
    ingredients = [];
    renderTags();
    ingredientInput.value = '';
    document.querySelectorAll('input[name="diet"], input[name="intolerance"]')
      .forEach(function (cb) { cb.checked = false; });
    document.getElementById('results-count').value = '8';
    hideAll();
    ingredientInput.focus();
  });

  // ── UI State Helpers ────────────────────────────────────────────────────────

  function hideAll() {
    loadingState.classList.add('d-none');
    errorState.classList.add('d-none');
    resultsSection.classList.add('d-none');
    emptyState.classList.add('d-none');
  }

  function showLoading() {
    hideAll();
    loadingState.classList.remove('d-none');
    searchBtn.disabled = true;
    searchBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Searching\u2026';
  }

  function showError(msg) {
    hideAll();
    errorMessage.textContent = msg;
    errorState.classList.remove('d-none');
    resetSearchBtn();
  }

  function showResults(recipes) {
    hideAll();
    if (!recipes || recipes.length === 0) {
      emptyState.classList.remove('d-none');
    } else {
      renderRecipeGrid(recipes);
      resultsSection.classList.remove('d-none');
      resultsBadge.textContent =
        recipes.length + ' recipe' + (recipes.length !== 1 ? 's' : '') + ' found';
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    resetSearchBtn();
  }

  function resetSearchBtn() {
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="bi bi-search" aria-hidden="true"></i> Find Recipes';
  }

  // ── Recipe Card Rendering ───────────────────────────────────────────────────

  /**
   * Render the full grid of recipe cards.
   * @param {Object[]} recipes - Array of Spoonacular recipe objects
   */
  function renderRecipeGrid(recipes) {
    recipeGrid.innerHTML = '';
    recipes.forEach(function (recipe) {
      var col = document.createElement('div');
      col.className = 'col';
      col.setAttribute('role', 'listitem');
      col.innerHTML = buildRecipeCardHTML(recipe);

      col.querySelector('.btn-view-recipe').addEventListener('click', function () {
        openRecipeModal(recipe);
      });

      // Allow keyboard activation of the whole card
      col.querySelector('.recipe-card').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') openRecipeModal(recipe);
      });

      recipeGrid.appendChild(col);
    });
  }

  /**
   * Build the inner HTML for a single recipe card.
   * Uses RecipeUtils.sanitizeText on all API-sourced strings.
   *
   * @param {Object} recipe
   * @returns {string}
   */
  function buildRecipeCardHTML(recipe) {
    var title    = RecipeUtils.sanitizeText(recipe.title || 'Untitled Recipe');
    var time     = RecipeUtils.formatTime(recipe.readyInMinutes);
    var servings = recipe.servings
      ? recipe.servings + ' serving' + (recipe.servings !== 1 ? 's' : '')
      : 'N/A';

    var imgSrc  = RecipeUtils.isValidImageUrl(recipe.image) ? recipe.image : null;
    var imgHTML = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + title + '" class="recipe-card-img" loading="lazy">'
      : '<div class="recipe-card-img-placeholder" aria-hidden="true">'
        + '<i class="bi bi-egg-fried" style="font-size:3rem;color:#e67e22;opacity:0.35;"></i>'
        + '</div>';

    var diets = (recipe.diets || []).slice(0, 3);
    var dietHTML = diets.length > 0
      ? '<div class="diet-badges" aria-label="Dietary labels">'
        + diets.map(function (d) {
            return '<span class="diet-badge">'
              + RecipeUtils.sanitizeText(RecipeUtils.capitalize(d))
              + '</span>';
          }).join('')
        + '</div>'
      : '';

    return '<article class="recipe-card" tabindex="0" aria-label="' + title + '">'
      + imgHTML
      + '<div class="recipe-card-body">'
      +   '<h3 class="recipe-card-title">' + title + '</h3>'
      +   '<div class="recipe-meta">'
      +     '<span class="recipe-meta-item">'
      +       '<i class="bi bi-clock" aria-hidden="true"></i>'
      +       '<span>' + time + '</span>'
      +     '</span>'
      +     '<span class="recipe-meta-item">'
      +       '<i class="bi bi-people" aria-hidden="true"></i>'
      +       '<span>' + servings + '</span>'
      +     '</span>'
      +   '</div>'
      +   dietHTML
      +   '<button class="btn-view-recipe" type="button" aria-label="View details for ' + title + '">'
      +     'View Recipe <i class="bi bi-arrow-right" aria-hidden="true"></i>'
      +   '</button>'
      + '</div>'
      + '</article>';
  }

  // ── Recipe Detail Modal ─────────────────────────────────────────────────────

  /**
   * Populate and open the Bootstrap modal with full recipe details.
   * @param {Object} recipe
   */
  function openRecipeModal(recipe) {
    var title = RecipeUtils.sanitizeText(recipe.title || 'Recipe Details');
    modalTitle.textContent = title;

    var imgSrc  = RecipeUtils.isValidImageUrl(recipe.image) ? recipe.image : null;
    var imgHTML = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + title + '" class="modal-recipe-img">'
      : '';

    // Strip HTML tags from the Spoonacular summary (it contains <a> links)
    var summaryText = recipe.summary ? stripHtml(recipe.summary).slice(0, 400) + '…' : '';
    var summaryHTML = summaryText
      ? '<p class="text-muted mb-3">' + RecipeUtils.sanitizeText(summaryText) + '</p>'
      : '';

    var diets = recipe.diets || [];
    var dietsHTML = diets.length > 0
      ? '<div class="mb-3"><strong>Dietary Labels:</strong>'
        + '<div class="diet-badges mt-1">'
        + diets.map(function (d) {
            return '<span class="diet-badge">'
              + RecipeUtils.sanitizeText(RecipeUtils.capitalize(d))
              + '</span>';
          }).join('')
        + '</div></div>'
      : '';

    var rawIngredients = recipe.extendedIngredients || recipe.usedIngredients || [];
    var ingredientsHTML = rawIngredients.length > 0
      ? '<div class="mb-3"><strong>Ingredients:</strong>'
        + '<ul class="ingredient-list" aria-label="Ingredients list">'
        + rawIngredients.map(function (i) {
            return '<li>' + RecipeUtils.sanitizeText(i.original || i.name || '') + '</li>';
          }).join('')
        + '</ul></div>'
      : '';

    var metaHTML = (recipe.readyInMinutes || recipe.servings)
      ? '<div class="d-flex gap-3 mb-3">'
        + (recipe.readyInMinutes
            ? '<span><i class="bi bi-clock me-1" aria-hidden="true"></i>'
              + RecipeUtils.formatTime(recipe.readyInMinutes) + '</span>'
            : '')
        + (recipe.servings
            ? '<span><i class="bi bi-people me-1" aria-hidden="true"></i>'
              + recipe.servings + ' serving' + (recipe.servings !== 1 ? 's' : '') + '</span>'
            : '')
        + '</div>'
      : '';

    modalBody.innerHTML = imgHTML + metaHTML + summaryHTML + dietsHTML + ingredientsHTML;

    var sourceUrl = recipe.sourceUrl || recipe.spoonacularSourceUrl || '';
    if (sourceUrl && RecipeUtils.isValidImageUrl(sourceUrl)) {
      modalSourceLink.href = sourceUrl;
      modalSourceLink.style.display = '';
    } else {
      modalSourceLink.style.display = 'none';
    }

    bsModal.show();
  }

  /**
   * Remove all HTML tags from a string (used to sanitize Spoonacular summaries).
   * @param {string} html
   * @returns {string}
   */
  function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }

  // ── Form Submission & API Call ──────────────────────────────────────────────

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Commit any ingredient still typed but not yet tagged
    var pending = ingredientInput.value.replace(/,/g, '').trim();
    if (pending) { addIngredient(pending); ingredientInput.value = ''; }

    var diets = Array.from(
      document.querySelectorAll('input[name="diet"]:checked')
    ).map(function (cb) { return cb.value; });

    var intolerances = Array.from(
      document.querySelectorAll('input[name="intolerance"]:checked')
    ).map(function (cb) { return cb.value; });

    var number = parseInt(document.getElementById('results-count').value, 10) || 8;

    if (ingredients.length === 0 && diets.length === 0 && intolerances.length === 0) {
      showError('Please add at least one ingredient or select a dietary preference before searching.');
      return;
    }

    var params = RecipeUtils.buildQueryParams({ ingredients: ingredients, diets: diets, intolerances: intolerances, number: number });

    showLoading();

    fetch('/.netlify/functions/recipes?' + params.toString())
      .then(function (response) {
        if (!response.ok) {
          return response.json().catch(function () { return {}; }).then(function (errData) {
            throw new Error(errData.error || 'Server error (' + response.status + '). Please try again.');
          });
        }
        return response.json();
      })
      .then(function (data) {
        showResults(data.results || []);
      })
      .catch(function (err) {
        if (err instanceof TypeError) {
          showError('Unable to connect to the server. Please check your internet connection and try again.');
        } else {
          showError(err.message || 'An unexpected error occurred. Please try again.');
        }
        console.error('[RecipeFind] fetch error:', err);
      });
  });

})();
