// Admin Panel JavaScript for admin.html

// Admin login state
let isAdminLoggedIn = false;

// Get backend URL
function getBackendUrl() {
    const isLocalDev = window.location.hostname === 'localhost' 
        || window.location.hostname === '127.0.0.1'
        || window.location.protocol === 'file:'
        || !window.location.hostname;
    
    return isLocalDev ? 'http://localhost:3000' : 'https://pcjohncorp-backend.onrender.com';
}

// Handle admin login
async function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const messageDiv = document.getElementById('adminLoginMessage');
    
    try {
        const response = await fetch(`${getBackendUrl()}/api/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            isAdminLoggedIn = true;
            // Hide login, show panel
            document.getElementById('adminLoginDirect').classList.add('hide');
            document.getElementById('adminPanelDirect').classList.add('show');
            loadPhoneNumbers();
        } else {
            showAdminMessage(messageDiv, data.message || 'Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAdminMessage(messageDiv, 'Login failed. Please try again.', 'error');
    }
}

// Logout admin
function logoutAdmin() {
    isAdminLoggedIn = false;
    // Hide panel, show login
    document.getElementById('adminPanelDirect').classList.remove('show');
    document.getElementById('adminLoginDirect').classList.remove('hide');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('phoneList').innerHTML = '';
    document.getElementById('adminStatus').innerHTML = '';
    document.getElementById('adminStatus').style.display = 'none';
}

// Load phone numbers
async function loadPhoneNumbers() {
    const phoneListDiv = document.getElementById('phoneList');
    const statusDiv = document.getElementById('adminStatus');
    
    try {
        showAdminStatus(statusDiv, 'Loading phone numbers...', 'info');
        
        const response = await fetch(`${getBackendUrl()}/api/admin/phone-numbers`);
        const data = await response.json();
        
        if (response.ok && data.success) {
            phoneListDiv.innerHTML = '';
            
            if (data.phoneNumbers.length === 0) {
                phoneListDiv.innerHTML = '<p>No phone numbers configured. Add phone numbers using the form above.</p>';
                showAdminStatus(statusDiv, 'No phone numbers found', 'warning');
                return;
            }
            
            data.phoneNumbers.forEach((phone, index) => {
                const phoneItem = document.createElement('div');
                phoneItem.className = 'phone-item';
                phoneItem.innerHTML = `
                    <input type="checkbox" id="phone-${index}" value="${phone}" class="phone-checkbox">
                    <label for="phone-${index}">${phone}</label>
                    <button type="button" class="btn-delete" onclick="deletePhoneNumber('${phone}')" title="Delete">🗑️</button>
                `;
                phoneListDiv.appendChild(phoneItem);
            });
            
            showAdminStatus(statusDiv, `Loaded ${data.phoneNumbers.length} phone number(s)`, 'success');
        } else {
            showAdminStatus(statusDiv, data.message || 'Failed to load phone numbers', 'error');
        }
    } catch (error) {
        console.error('Error loading phone numbers:', error);
        showAdminStatus(statusDiv, 'Failed to load phone numbers', 'error');
    }
}

// Select all phone numbers
function selectAllNumbers() {
    const checkboxes = document.querySelectorAll('.phone-checkbox');
    checkboxes.forEach(cb => cb.checked = true);
}

// Deselect all phone numbers
function deselectAllNumbers() {
    const checkboxes = document.querySelectorAll('.phone-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
}

// Call selected numbers
async function callSelectedNumbers() {
    const checkboxes = document.querySelectorAll('.phone-checkbox:checked');
    const selectedPhones = Array.from(checkboxes).map(cb => cb.value);
    const statusDiv = document.getElementById('adminStatus');
    const callBtn = document.getElementById('callSelectedBtn');
    
    if (selectedPhones.length === 0) {
        showAdminStatus(statusDiv, 'Please select at least one phone number', 'warning');
        return;
    }
    
    callBtn.disabled = true;
    callBtn.textContent = 'Calling...';
    showAdminStatus(statusDiv, `Initiating calls to ${selectedPhones.length} number(s)...`, 'info');
    
    try {
        const response = await fetch(`${getBackendUrl()}/api/admin/bulk-call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumbers: selectedPhones })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            const summary = data.summary;
            showAdminStatus(statusDiv, 
                `✅ ${summary.success} call(s) initiated. ${summary.failed} failed.`, 
                summary.failed > 0 ? 'warning' : 'success'
            );
            
            // Show detailed results
            if (data.results) {
                const failed = data.results.filter(r => !r.success);
                if (failed.length > 0) {
                    const failedList = failed.map(r => `${r.phone}: ${r.error}`).join('<br>');
                    showAdminStatus(statusDiv, 
                        `${statusDiv.innerHTML}<br><strong>Failed:</strong><br>${failedList}`, 
                        'warning'
                    );
                }
            }
        } else {
            showAdminStatus(statusDiv, data.message || 'Failed to initiate calls', 'error');
        }
    } catch (error) {
        console.error('Bulk call error:', error);
        showAdminStatus(statusDiv, 'Failed to initiate calls. Please try again.', 'error');
    } finally {
        callBtn.disabled = false;
        callBtn.textContent = '📞 Call Selected';
    }
}

// Show admin message
function showAdminMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
}

// Show admin status
function showAdminStatus(element, message, type) {
    if (!element) return;
    element.innerHTML = message;
    element.className = `admin-status ${type}`;
    element.style.display = 'block';
}

// Add phone number
async function addPhoneNumber() {
    const phoneInput = document.getElementById('newPhoneNumber');
    const phoneNumber = phoneInput.value.trim();
    const messageDiv = document.getElementById('addNumberMessage');
    
    if (!phoneNumber) {
        showAdminMessage(messageDiv, 'Please enter a phone number', 'error');
        return;
    }
    
    // Basic validation
    const cleanedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!cleanedPhone.match(/^\+?\d{10,15}$/)) {
        showAdminMessage(messageDiv, 'Invalid phone number format. Use format: +1234567890', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${getBackendUrl()}/api/admin/phone-numbers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber: phoneNumber })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAdminMessage(messageDiv, 'Phone number added successfully!', 'success');
            phoneInput.value = '';
            // Reload phone numbers list
            loadPhoneNumbers();
        } else {
            showAdminMessage(messageDiv, data.message || 'Failed to add phone number', 'error');
        }
    } catch (error) {
        console.error('Error adding phone number:', error);
        showAdminMessage(messageDiv, 'Failed to add phone number. Please try again.', 'error');
    }
}

// Delete phone number
async function deletePhoneNumber(phoneNumber) {
    if (!confirm(`Are you sure you want to delete ${phoneNumber}?`)) {
        return;
    }
    
    const statusDiv = document.getElementById('adminStatus');
    
    try {
        const response = await fetch(`${getBackendUrl()}/api/admin/phone-numbers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber: phoneNumber })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showAdminStatus(statusDiv, `Phone number ${phoneNumber} deleted successfully`, 'success');
            // Reload phone numbers list
            loadPhoneNumbers();
        } else {
            showAdminStatus(statusDiv, data.message || 'Failed to delete phone number', 'error');
        }
    } catch (error) {
        console.error('Error deleting phone number:', error);
        showAdminStatus(statusDiv, 'Failed to delete phone number. Please try again.', 'error');
    }
}


