const API_URL = 'http://localhost:8000/api/inventory';
let localInventoryCache = []; 


document.addEventListener('DOMContentLoaded', fetchInventory);
document.getElementById('bakeryForm').addEventListener('submit', addBatch);

function switchTab(event, tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active-content'));
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active-content');
    event.currentTarget.classList.add('active');
}
async function fetchInventory() {
    try {
        const response = await fetch(API_URL);
        localInventoryCache = await response.json(); 
        renderTable(localInventoryCache);
    } catch (err) {
        console.error("Failed to connect with backend service API:", err);
    }
}
function renderTable(items) {
    const inventoryBody = document.getElementById('inventoryTableBody');
    const wasteBody = document.getElementById('wasteTableBody');
    
    inventoryBody.innerHTML = ''; 
    wasteBody.innerHTML = '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeCount = 0;
    let wasteCount = 0;

    items.forEach(item => {
        const expiryDate = new Date(item.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            wasteCount++;
            const tr = document.createElement('tr');
            tr.className = 'status-expired';
            tr.innerHTML = `
                <td><strong>${item.itemName}</strong></td>
                <td><span class="category-tag">${item.category}</span></td>
                <td>${item.expiryDate}</td>
                <td><button class="delete-btn" onclick="deleteItem(${item.id})">Dispose</button></td>
            `;
            wasteBody.appendChild(tr);
        } else {
            activeCount++;
            let statusLabel = '';
            let rowAlertClass = '';

            if (daysLeft === 0) {
                statusLabel = 'Critical: Expires Today!';
                rowAlertClass = 'status-critical';
            } else if (daysLeft <= 2) {
                statusLabel = `⏳ Use First (${daysLeft} Days Left)`;
                rowAlertClass = 'status-warning';
            } else {
                statusLabel = 'Safe / Fresh';
                rowAlertClass = 'status-fresh';
            }

            const tr = document.createElement('tr');
            tr.className = rowAlertClass;
            tr.innerHTML = `
                <td><strong>${item.itemName}</strong></td>
                <td><span class="category-tag">${item.category}</span></td>
                <td>${item.expiryDate}</td>
                <td><span class="badge">${statusLabel}</span></td>
                <td><button class="delete-btn" onclick="deleteItem(${item.id})">Remove</button></td>
            `;
            inventoryBody.appendChild(tr);
        }
    });
    document.getElementById('countFresh').innerText = activeCount;
    document.getElementById('countWaste').innerText = wasteCount;
}

function filterInventory() {
    const searchString = document.getElementById('searchInput').value.toLowerCase();
    const targetCategory = document.getElementById('filterCategory').value;

    const filteredResults = localInventoryCache.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchString);
        const matchesCategory = (targetCategory === 'ALL' || item.category === targetCategory);
        return matchesSearch && matchesCategory && (Math.ceil((new Date(item.expiryDate) - new Date().setHours(0,0,0,0)) / 86400000) >= 0);
    });

    renderTable(filteredResults);
}

async function addBatch(e) {
    e.preventDefault();
    const payload = {
        itemName: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        expiryDate: document.getElementById('expiryDate').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            document.getElementById('bakeryForm').reset();
            fetchInventory(); 
        }
    } catch (err) {
        console.error("Error logging batch entry:", err);
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchInventory(); 
        }
    } catch (err) {
        console.error("Error removing batch item:", err);
    }
}