const backendURL = "https://hospitalments.onrender.com/api/items"

// Helper function to fetch data from the API
async function fetchData(url, options = {}) {
    const response = await fetch(${backendURL}${url}, options);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
}

// Add Item Form Submission
document.getElementById("itemForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const quantity = document.getElementById("quantity").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const arrivalDate = document.getElementById("arrival-date").value;

    try {
        const newItem = { name, category, quantity, expiryDate, arrivalDate };
        await fetchData("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
        });
        alert("Item added successfully!");
        e.target.reset();
        loadAllItems();
    } catch (error) {
        console.error("Error adding item:", error);
    }
});

// Load all items and display them
async function loadAllItems() {
    try {
        const items = await fetchData("/api/items");
        displayItems(items, "allItemsContainer");
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

// Load expired items and display them
async function loadExpiredItems() {
    try {
        const expiredItems = await fetchData("/api/items/expired");
        displayItems(expiredItems, "expiredItemsContainer");
    } catch (error) {
        console.error("Error loading expired items:", error);
    }
}

// Display items in a given container
function displayItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear existing content

    if (items.length === 0) {
        container.innerHTML = "<p>No items found.</p>";
        return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Expiry Date</th>
            <th>Arrival Date</th>
        </tr>
    `;

    items.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${new Date(item.expiryDate).toLocaleDateString()}</td>
            <td>${new Date(item.arrivalDate).toLocaleDateString()}</td>
        `;
        if (new Date(item.expiryDate) < new Date()) {
            row.style.backgroundColor = "#ffd1d1"; // Highlight expired items
        }
        table.appendChild(row);
    });
    container.appendChild(table);
}

// Filter/Search Form Submission
document.getElementById("filterForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const searchName = document.getElementById("searchName").value.toLowerCase();
    const searchCategory = document.getElementById("searchCategory").value;

    try {
        const items = await fetchData("/api/items");
        const filteredItems = items.filter((item) => {
            const nameMatch = item.name.toLowerCase().includes(searchName);
            const categoryMatch = searchCategory ? item.category === searchCategory : true;
            return nameMatch && categoryMatch;
        });
        displayItems(filteredItems, "filteredItemsContainer");
    } catch (error) {
        console.error("Error filtering items:", error);
    }
});

// Initial load of items
loadAllItems();
loadExpiredItems();
