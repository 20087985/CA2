const API_URL = 'http://localhost:8000/api/inventory';

document.addEventListener('DOMContentLoaded', fetchInventory);
document.getElementById('bakeryForm').addEventListener('submit', addBatch);

async function fetchInventory() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTable(data);
    } catch (err) {
        console.error("Failed to connect with backend service API:", err);
    }
}


function renderTable(items) {
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = ''; 

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    items.forEach(item => {
        const expiryDate = new Date(item.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let statusLabel = '';
        let rowAlertClass = '';

        if (daysLeft < 0) {
            statusLabel = 'Waste (Expired)';
            rowAlertClass = 'status-expired';
        } else if (daysLeft === 0) {
            statusLabel = 'Critical: Expires Today!';
            rowAlertClass = 'status-critical';
        } else if (daysLeft <= 2) {
            statusLabel = `⏳ Use First (${daysLeft} Days Left)`;
            rowAlertClass = 'status-warning';
        } else {
            statusLabel = '✅ Safe / Fresh';
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
        tableBody.appendChild(tr);
    });
}