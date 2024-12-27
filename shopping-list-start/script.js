const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach(item => addItemtoDOM(item));
	checkUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validate input
	if (newItem === "") {
		alert("Please add an item");
		return
	}

	//Check if in edit mode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector(".edit-mode");

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove("edit-mode");
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExists(newItem)) {
			alert("Item already exists");
			return;
		}
	}

	// Create item DOM element
	addItemtoDOM(newItem);

	// Add item to local storage
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = "";
}

function addItemtoDOM(item) {
	// Create list item
	const li = document.createElement("li");
	li.appendChild(document.createTextNode(item));

	const button = createButton("remove-item btn-link text-red");
	li.appendChild(button);

	// Add li to DOM
	itemList.appendChild(li);
}

function createButton(classes) {
	const button = document.createElement("button");
	button.className = classes;
	const icon = createIcon("fas fa-trash");
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement("i");
	icon.className = classes;
	return icon;
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	itemsFromStorage.push(item);;

	//Convert to JSON string and set to local storage
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(item) {
	let itemsFromStorage;

	if (localStorage.getItem("items") === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem("items"));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains("remove-item")) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target)
	}
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
	isEditMode = true;

	itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit-mode"));
	item.classList.add("edit-mode");
	formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
	formBtn.style.backgroundColor = "#228b22"

	itemInput.value = item.textContent;

}

function removeItem(item) {
	if (confirm("Are you sure?")) {
		// Remove item from DOM
		item.remove();

		// Remove item from local storage
		removeItemFromStorage(item.textContent);

		checkUI();
	}

}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removeChild
	itemsFromStorage = itemsFromStorage.filter((i) => i != item);

	//Re-set to local storage
	localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	// Clear items from local storage
	localStorage.removeItem("items");

	checkUI();
}

function filterItems(e) {
	const items = itemList.querySelectorAll("li");
	const text = e.target.value.toLowerCase();

	items.forEach(item => {
		const itemName = item.firstChild.textContent.toLowerCase();

		if (itemName.indexOf(text) != -1) {
			item.style.display = "flex";
		} else {
			item.style.display = "none";
		}
	});
}

function checkUI() {
	itemInput.value = "";

	const items = itemList.querySelectorAll("li");
	if (items.length === 0) {
		clearBtn.style.display = "none";
		itemFilter.style.display = "none";
	} else {
		clearBtn.style.display = "block";
		itemFilter.style.display = "block";
	}

	formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = "#333"

	isEditMode = false;
}

// Initialize app
function init() {
	// Event Listeners
	itemForm.addEventListener("submit", onAddItemSubmit);
	itemList.addEventListener("click", onClickItem);
	clearBtn.addEventListener("click", clearItems);
	itemFilter.addEventListener("input", filterItems);
	document.addEventListener("DOMContentLoaded", displayItems);

	checkUI();
}


// Local Storage/Session Storage are window properties that allow you to store data in the browser. The data is stored in key-value pairs and is saved even after the browser is closed. The difference between the two is that local storage data is stored indefinitely, while session storage data is cleared when the browser is closed.

init();