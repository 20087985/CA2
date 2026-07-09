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