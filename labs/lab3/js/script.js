"use strict";

/*
 inventory item structure:
 each item is stored as an object with these properties:
 - name: string
 - type: string
 - price: number
 - quantity: number
 - description: string
*/

// starter inventory with 8 items (meets lab requirement)
const inventory = [
  { name: "Moonlit Potion", type: "potion", price: 14.99, quantity: 7, description: "Glows faintly in darkness." },
  { name: "Oak Wand", type: "wand", price: 39.5, quantity: 3, description: "Reliable wand for beginners." },
  { name: "Silver Tuning Fork", type: "instrument", price: 9.0, quantity: 12, description: "Concert pitch tuner." },
  { name: "Dragon Ink", type: "ink", price: 7.25, quantity: 20, description: "Permanent, slightly smoky scent." },
  { name: "Traveler's Lute", type: "instrument", price: 129.99, quantity: 2, description: "Warm sound, compact body." },
  { name: "Phoenix Feather", type: "ingredient", price: 59.0, quantity: 1, description: "Rare crafting component." },
  { name: "Herbal Salve", type: "potion", price: 11.75, quantity: 5, description: "Soothes minor burns." },
  { name: "Candle of Calm", type: "charm", price: 6.5, quantity: 9, description: "Soft lavender scent." },
];

// ---------- helper functions ----------

// normalizes strings for comparison (trim + lowercase)
function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

// formats a number as currency with two decimals
function formatMoney(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

// displays validation or input errors in the ui
function showError(message) {
  const el = document.getElementById("form-error");
  el.textContent = message || "";
}

// ---------- required lab functions ----------

// adds a new item or updates an existing one
function addItem(item) {
  // find index of item with same name (case-insensitive)
  const index = inventory.findIndex(
    (it) => normalize(it.name) === normalize(item.name)
  );

  if (index !== -1) {
    // if item exists, overwrite it
    inventory[index] = item;
  } else {
    // otherwise, add new item to inventory
    inventory.push(item);
  }

  // refresh display after adding
  listItems();
}

// removes an item from inventory by name
function removeItem(itemName) {
  const index = inventory.findIndex(
    (it) => normalize(it.name) === normalize(itemName)
  );

  // only remove if item exists
  if (index !== -1) {
    inventory.splice(index, 1);
    listItems();
  }
}

// returns a single item by name
function getItem(itemName) {
  const target = normalize(itemName);
  return inventory.find((it) => normalize(it.name) === target) || null;
}

// displays all inventory items
function listItems() {
  renderInventory(inventory);
  updateTotalValue();
  renderCategories();     // bonus feature
  highlightDuplicates();  // bonus feature
}

// searches inventory by name or type
function searchItems(query) {
  const q = normalize(query);

  // if search is empty, show everything
  if (!q) {
    listItems();
    return;
  }

  // filter items that match search text
  const results = inventory.filter((it) => {
    return normalize(it.name).includes(q) || normalize(it.type).includes(q);
  });

  renderInventory(results);
  updateTotalValue(results);
}

// calculates total inventory value
function calculateTotalValue(items = inventory) {
  return items.reduce(
    (sum, it) => sum + Number(it.price) * Number(it.quantity),
    0
  );
}

// ---------- bonus features ----------

// groups inventory items by category using a map
function groupByCategory() {
  const map = new Map();

  for (const item of inventory) {
    const key = normalize(item.type) || "uncategorized";

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(item);
  }

  return map;
}

// finds duplicate item names using a set
function findDuplicates() {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of inventory) {
    const key = normalize(item.name);

    if (seen.has(key)) {
      duplicates.add(key);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

// applies a percentage discount to all items
function applyDiscount(discountPercentage) {
  // validate discount range
  if (!Number.isFinite(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
    alert("discount must be between 0 and 100");
    return;
  }

  const factor = 1 - discountPercentage / 100;

  // update each item price
  for (const item of inventory) {
    item.price = Number((item.price * factor).toFixed(2));
  }

  listItems();
}

// ---------- dom rendering ----------

// renders inventory cards to the page
function renderInventory(items) {
  const host = document.getElementById("inventory");
  host.innerHTML = "";

  // show message if no items exist
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No items found.";
    host.appendChild(empty);
    return;
  }

  // create a card for each item
  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item";
    card.dataset.itemName = item.name;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = item.type;

    const meta = document.createElement("div");
    meta.className = "small";
    meta.textContent = `${formatMoney(item.price)} • Qty: ${item.quantity}`;

    const desc = document.createElement("p");
    desc.className = "small";
    desc.textContent = item.description;

    const actions = document.createElement("div");
    actions.className = "actions";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeItem(item.name));

    actions.appendChild(removeBtn);

    card.append(title, pill, meta, desc, actions);
    host.appendChild(card);
  }
}

// updates total inventory value in ui
function updateTotalValue(items = inventory) {
  const total = calculateTotalValue(items);
  document.getElementById("total-value").textContent = formatMoney(total);
}

// renders category grouping section
function renderCategories() {
  const host = document.getElementById("categories");
  host.innerHTML = "";

  const grouped = groupByCategory();

  for (const [type, items] of grouped.entries()) {
    const box = document.createElement("div");
    box.className = "item";

    const title = document.createElement("h3");
    title.textContent = type;

    const list = document.createElement("p");
    list.className = "small";
    list.textContent = items.map((i) => i.name).join(", ");

    box.append(title, list);
    host.appendChild(box);
  }
}

// highlights duplicate items visually
function highlightDuplicates() {
  const duplicates = findDuplicates();
  const cards = document.querySelectorAll(".item[data-item-name]");

  cards.forEach((card) => {
    const key = normalize(card.dataset.itemName);
    card.classList.toggle("duplicate", duplicates.has(key));
  });
}

// ---------- form + event handling ----------

// reads and validates form input
function readFormItem() {
  const name = document.getElementById("name").value;
  const type = document.getElementById("type").value;
  const price = Number(document.getElementById("price").value);
  const quantity = Number(document.getElementById("quantity").value);
  const description = document.getElementById("description").value;

  if (!normalize(name) || !normalize(type) || !normalize(description)) {
    throw new Error("name, type, and description are required");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("price must be a number greater than or equal to 0");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("quantity must be a whole number 0 or greater");
  }

  return {
    name: name.trim(),
    type: type.trim(),
    price,
    quantity,
    description: description.trim(),
  };
}

// initialize app once page loads
document.addEventListener("DOMContentLoaded", () => {
  // initial inventory display
  listItems();

  // handle add item form
  document.getElementById("add-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

    try {
      const item = readFormItem();
      addItem(item);
      e.target.reset();
    } catch (err) {
      showError(err.message);
    }
  });

  // handle search button
  document.getElementById("search-btn").addEventListener("click", () => {
    searchItems(document.getElementById("search").value);
  });

  // clear search results
  document.getElementById("clear-search-btn").addEventListener("click", () => {
    document.getElementById("search").value = "";
    listItems();
  });

  // list all inventory items
  document.getElementById("list-btn").addEventListener("click", listItems);

  // apply discount button
  document.getElementById("discount-btn").addEventListener("click", () => {
    applyDiscount(Number(document.getElementById("discount").value));
  });
});
