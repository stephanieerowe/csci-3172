# Lab 3 – Inventory Management System

This lab is an individual assignment that implements a client-side Inventory Management System using JavaScript, HTML, and CSS. The application allows users to add, remove, search, and list inventory items stored as objects inside an array. Additional functionality includes calculating total inventory value, grouping items by category using a Map, detecting duplicate items using a Set, and applying discounts dynamically to item prices. All functionality is handled through DOM manipulation and event listeners without any backend services.

- **Date Created**: 05 Feb 2026  
- **Last Modification Date**: 10 Feb 2026  
* *Lab Timberlea URL*: <https://web.cs.dal.ca/~srowe/csci3172/labs/lab3/>
* *Lab Gitlab URL*: <https://git.cs.dal.ca/srowe/csci-3172/-/tree/main/labs/lab3?ref_type=heads>


## Authors

- Stephanie Rowe (serowe@dal.ca) – Developer  


## Built With

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) – Used to structure the web application  
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) – Used for styling and layout (grid, responsive design, visual effects)  
- [JavaScript (ES6)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) – Used to implement inventory logic, DOM manipulation, Map/Set features, and event handling  


## Sources Used

No external code was copied directly for this assignment. All logic for inventory management, DOM rendering, grouping with Map, duplicate detection with Set, and discount application was written specifically for this lab using standard JavaScript documentation as reference.

General documentation references:

- MDN Web Docs – JavaScript Array Methods  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array  

- MDN Web Docs – Map  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map  

- MDN Web Docs – Set  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set  

These resources were used to understand proper usage of:
- `Array.prototype.filter`
- `Array.prototype.reduce`
- `Array.prototype.find`
- `Map` for grouping items
- `Set` for detecting duplicates  

No external templates or frameworks were used.


## Artificial Intelligence Tools Used

- [ChatGPT](https://openai.com/chatgpt) – Used to assist with code explanation, debugging, commenting, and formatting documentation  


### Prompt Used on ChatGPT

my inventory items are not displaying after adding them, can you help me debug my addItem and renderInventory functions?


# Response:

If your inventory items are not displaying after adding them, the issue is usually one of these:

1. addItem() is not updating the inventory array correctly
2. renderInventory() is not being called after updating
3. the DOM container is not being cleared or appended correctly

Here is a corrected version of addItem():

function addItem(item) {
  const index = inventory.findIndex(
    (it) => normalize(it.name) === normalize(item.name)
  );

  if (index !== -1) {
    inventory[index] = item;
  } else {
    inventory.push(item);
  }

  listItems(); // re-render inventory after update
}

Make sure listItems() calls renderInventory():

function listItems() {
  renderInventory(inventory);
  updateTotalValue();
  renderCategories();
  highlightDuplicates();
}

Also verify renderInventory() clears the container before appending new elements:

function renderInventory(items) {
  const host = document.getElementById("inventory");
  host.innerHTML = ""; // clear old items

  if (!items.length) {
    const empty = document.createElement("p");
    empty.textContent = "No items found.";
    host.appendChild(empty);
    return;
  }

  for (const item of items) {
    const card = document.createElement("div");
    card.className = "item";
    card.dataset.itemName = item.name;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const meta = document.createElement("div");
    meta.textContent = `$${item.price.toFixed(2)} • Qty: ${item.quantity}`;

    card.appendChild(title);
    card.appendChild(meta);

    host.appendChild(card);
  }
}

This ensures:
- inventory is updated properly
- the UI re-renders after changes
- old DOM elements are cleared before drawing new ones
