const API_URL = 'http://localhost:8000/api';
let localInventoryCache = []; 
let isRegisterMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = sessionStorage.getItem('staffUser');
    if (savedUser) {
        showApp(savedUser);
    }
});

document.getElementById('authForm').addEventListener('submit', handleAuth);
document.getElementById('bakeryForm').addEventListener('submit', addBatch);

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('authTitle').innerText = isRegisterMode ? "📝 Register Staff Account" : "🧁 FreshTrack Staff Login";
    document.getElementById('authSubmitBtn').innerText = isRegisterMode ? "Register Account" : "Access Dashboard";
    document.getElementById('authToggleLink').innerText = isRegisterMode ? "Already registered? Login" : "New staff? Create account";
}

async function handleAuth(e) {
    e.preventDefault();
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;
    const endpoint = isRegisterMode ? '/register' : '/login';

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.ok) {
            if (isRegisterMode) {
                alert("Registration complete! Please login.");
                toggleAuthMode();
            } else {
                sessionStorage.setItem('staffUser', data.username);
                showApp(data.username);
            }
        } else {
            alert(data.message || "Authentication failed");
        }
    } catch (err) {
        console.error("Auth error:", err);
    }
}

function showApp(username) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    document.getElementById('currentStaffLabel').innerText = username;
    fetchInventory();
}

function logout() {
    sessionStorage.removeItem('staffUser');
    window.location.reload();
}

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
        const response = await fetch(`${API_URL}/inventory`);
        localInventoryCache = await response.json(); 
        renderTable(localInventoryCache);
    } catch (err) {
        console.error("Failed to connect with API:", err);
    }
}

function renderTable(items) {
    const inventoryBody = document.getElementById('inventoryTableBody');
    const wasteBody = document.getElementById('wasteTableBody');
    inventoryBody.innerHTML = ''; wasteBody.innerHTML = '';

    const today = new Date(); today.setHours(0, 0, 0, 0);
    let activeCount = 0; let wasteCount = 0;

    items.forEach(item => {
        const expiryDate = new Date(item.expiryDate); expiryDate.setHours(0,0,0,0);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / 86400000);

        if (daysLeft < 0) {
            wasteCount++;
            const tr = document.createElement('tr'); tr.className = 'status-expired';
            tr.innerHTML = `<td><strong>${item.itemName}</strong></td><td><span class="category-tag">${item.category}</span></td><td>${item.expiryDate}</td><td><button class="delete-btn" onclick="deleteItem(${item.id})">Dispose</button></td>`;
            wasteBody.appendChild(tr);
        } else {
            activeCount++;
            let statusLabel = daysLeft === 0 ? 'Expires Today!' : (daysLeft <= 2 ? `${daysLeft} Days Left` : 'Safe / Fresh');
            let rowAlertClass = daysLeft === 0 ? 'status-critical' : (daysLeft <= 2 ? 'status-warning' : 'status-fresh');

            const tr = document.createElement('tr'); tr.className = rowAlertClass;
            tr.innerHTML = `<td><strong>${item.itemName}</strong></td><td><span class="category-tag">${item.category}</span></td><td>${item.expiryDate}</td><td><span class="badge">${statusLabel}</span></td><td><button class="delete-btn" onclick="deleteItem(${item.id})">Remove</button></td>`;
            inventoryBody.appendChild(tr);
        }
    });
    document.getElementById('countFresh').innerText = activeCount;
    document.getElementById('countWaste').innerText = wasteCount;
}

function filterInventory() {
    const searchString = document.getElementById('searchInput').value.toLowerCase();
    const filteredResults = localInventoryCache.filter(item => item.itemName.toLowerCase().includes(searchString));
    renderTable(filteredResults);
}

async function addBatch(e) {
  async function addBatch(e) {
    e.preventDefault();
    
    const itemNameInput = document.getElementById('itemName').value.trim();
    const categoryInput = document.getElementById('category').value;
    const expiryDateInput = document.getElementById('expiryDate').value;

  



    const selectedDate = new Date(expiryDateInput);
    const maxFutureWindow = new Date();
    maxFutureWindow.setFullYear(maxFutureWindow.getFullYear() + 1);

    if (selectedDate > maxFutureWindow) {
        alert("System Constraint Error: Expiration target cannot be further than 1 year in the future.");
        return;
    }

    const payload = {
        itemName: itemNameInput,
        category: categoryInput,
        expiryDate: expiryDateInput
    };
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) { document.getElementById('bakeryForm').reset(); fetchInventory(); }
}

async function deleteItem(id) {
    const response = await fetch(`${API_URL}/inventory?id=${id}`, { method: 'DELETE' });
    if (response.ok) fetchInventory();
}