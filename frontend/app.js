const API_URL = "http://34.105.141.153:8000/api";
let localInventoryCache = []; 
let isRegisterMode = false;


let currentPage = 1;
const recordsPerPage = 5;
let globalInventory = [];

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = sessionStorage.getItem('staffUser');
    const isAuthPage = document.getElementById('authForm') !== null;

    if (!savedUser) {
        if (!isAuthPage) {
            window.location.href = 'index.html';
            return;
        }
    } else {
        showApp(savedUser);
    }
});

if (document.getElementById('authForm')) {
    document.getElementById('authForm').addEventListener('submit', handleAuth);
}
if (document.getElementById('bakeryForm')) {
    document.getElementById('bakeryForm').addEventListener('submit', addBatch);
}

function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('authTitle').innerText = isRegisterMode ? "📝 Register Staff Account" : "🥐 Bread 41 Staff Login";
    document.getElementById('authSubmitBtn').innerText = isRegisterMode ? "Register Account" : "Access Production Logs";
    document.getElementById('authToggleLink').innerText = isRegisterMode ? "Already registered? Login" : "New baker? Create account";
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
    if (document.getElementById('authScreen')) {
        document.getElementById('authScreen').style.display = 'none';
    }
    if (document.getElementById('appContainer')) {
        document.getElementById('appContainer').style.display = 'block';
    }
    if (document.getElementById('currentStaffLabel')) {
        document.getElementById('currentStaffLabel').innerText = username;
    }
    fetchInventory();
}

function logout() {
    sessionStorage.removeItem('staffUser');
    window.location.href = 'index.html';
}

async function fetchInventory() {
    try {
        const response = await fetch(`${API_URL}/inventory`);
        localInventoryCache = await response.json(); 
        renderPageSpecificData(localInventoryCache);
    } catch (err) {
        console.error("Failed to connect with API:", err);
    }
}



function filterInventory() {
    const searchString = document.getElementById('searchInput').value.toLowerCase();
    const filteredResults = localInventoryCache.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchString);
        const isNotExpired = Math.ceil((new Date(item.expiryDate) - new Date().setHours(0,0,0,0)) / 86400000) >= 0;
        return matchesSearch && isNotExpired;
    });
    
    const inventoryBody = document.getElementById('inventoryTableBody');
    if (inventoryBody) {
        inventoryBody.innerHTML = '';
        filteredResults.forEach(item => {
            const expiryDate = new Date(item.expiryDate);
            const daysLeft = Math.ceil((expiryDate - new Date().setHours(0,0,0,0)) / 86400000) >= 0;
            let statusLabel = daysLeft === 0 ? '⚠️ Expires Today!' : (daysLeft <= 2 ? `⏳ ${daysLeft} Days Left` : '✅ Safe / Fresh');
            let rowAlertClass = daysLeft === 0 ? 'status-critical' : (daysLeft <= 2 ? 'status-warning' : 'status-fresh');

            const tr = document.createElement('tr'); 
            tr.className = rowAlertClass;
            tr.innerHTML = `<td><strong>${item.itemName}</strong></td><td><span class="category-tag">${item.category}</span></td><td>${item.expiryDate}</td><td><span class="badge">${statusLabel}</span></td><td><button class="delete-btn" onclick="deleteItem(${item.id})">Remove</button></td>`;
            inventoryBody.appendChild(tr);
        });
    }
}

async function addBatch(e) {
    e.preventDefault();
    const itemNameInput = document.getElementById('itemName').value.trim();
    const categoryInput = document.getElementById('category').value;
    const expiryDateInput = document.getElementById('expiryDate').value;

    const payload = { itemName: itemNameInput, category: categoryInput, expiryDate: expiryDateInput };
    
    const response = await fetch(`${API_URL}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) { 
        document.getElementById('bakeryForm').reset(); 
        fetchInventory(); 
    }
}

async function deleteItem(id) {
    const response = await fetch(`${API_URL}/inventory?id=${id}`, { method: 'DELETE' });
    if (response.ok) fetchInventory();
}

function renderPageSpecificData(items) {
    const inventoryBody = document.getElementById('inventoryTableBody');
    const wasteBody = document.getElementById('wasteTableBody');
    
    if (inventoryBody) inventoryBody.innerHTML = ''; 
    if (wasteBody) wasteBody.innerHTML = '';

    const today = new Date(); 
    today.setHours(0, 0, 0, 0);


    let activeItems = [];
    let wasteCount = 0;
    let activeCount = 0;

    items.forEach(item => {
        const expiryDate = new Date(item.expiryDate); 
        expiryDate.setHours(0,0,0,0);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / 86400000);

        if (daysLeft < 0) {
            wasteCount++;
            if (wasteBody) {
                const tr = document.createElement('tr'); 
                tr.className = 'status-expired';
                tr.innerHTML = `<td><strong>${item.itemName}</strong></td><td><span class="category-tag">${item.category}</span></td><td>${item.expiryDate}</td><td><button class="delete-btn" onclick="deleteItem(${item.id})">Dispose</button></td>`;
                wasteBody.appendChild(tr);
            }
        } else {
            activeCount++;
            activeItems.push({ ...item, daysLeft });
        }
    });


    if (document.getElementById('countFresh')) document.getElementById('countFresh').innerText = activeCount;
    if (document.getElementById('countWaste')) document.getElementById('countWaste').innerText = wasteCount;


    if (inventoryBody) {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const pageItems = activeItems.slice(startIndex, endIndex);

        pageItems.forEach(item => {
            let statusLabel = item.daysLeft === 0 ? '⚠️ Expires Today!' : (item.daysLeft <= 2 ? `⏳ ${item.daysLeft} Days Left` : '✅ Safe / Fresh');
            let rowAlertClass = item.daysLeft === 0 ? 'status-critical' : (item.daysLeft <= 2 ? 'status-warning' : 'status-fresh');

            const tr = document.createElement('tr'); 
            tr.className = rowAlertClass;
            tr.innerHTML = `<td><strong>${item.itemName}</strong></td><td><span class="category-tag">${item.category}</span></td><td>${item.expiryDate}</td><td><span class="badge">${statusLabel}</span></td><td><button class="delete-btn" onclick="deleteItem(${item.id})">Remove</button></td>`;
            inventoryBody.appendChild(tr);
        });

  
        if (document.getElementById("pageNumber")) {
            document.getElementById("pageNumber").innerText = `Page ${currentPage}`;
            document.getElementById("prevBtn").disabled = currentPage === 1;
            document.getElementById("nextBtn").disabled = endIndex >= activeItems.length;
        }
    }
}


function changePage(direction) {
    currentPage += direction;
    renderPageSpecificData(localInventoryCache);
}