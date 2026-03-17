const BASE_URL = "http://localhost:8080/employees";

// Navigation and UI functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Add active class to clicked nav item
    const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }

    // Update header title
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'employees': 'Employee Management',
            'summary': 'Payroll Summary',
            'bonus-calculator': 'Bonus Calculator'
        };
        headerTitle.textContent = titles[sectionName] || 'Dashboard';
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function addEmployee(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;
    const bonus = document.getElementById("bonus").value;

    if(!name || !department || !salary || !bonus){
        showNotification("Please fill all fields", "error");
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading">Adding...</span>';
    submitBtn.disabled = true;

    fetch(BASE_URL + "/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            department: department,
            baseSalary: parseFloat(salary),
            bonus: parseFloat(bonus)
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        showNotification("Employee Added Successfully", "success");
        clearForm();
        loadEmployees();
        loadSummary();
        updateStats();
    })
    .catch(error => {
        console.error('Error adding employee:', error);
        showNotification("Error adding employee: " + error.message, "error");
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("department").value = "";
    document.getElementById("salary").value = "";
    document.getElementById("bonus").value = "";
}

function loadEmployees() {
    const tableBody = document.querySelector("#employeeTable tbody");
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Loading employees...</td></tr>';

    fetch(BASE_URL + "/all")
    .then(response => response.json())
    .then(employees => {
        tableBody.innerHTML = "";

        if (employees.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No employees found</td></tr>';
            return;
        }

        employees.forEach(emp => {
            const total = emp.baseSalary + emp.bonus;
            const row = `
                <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>$${emp.baseSalary.toLocaleString()}</td>
                    <td>$${emp.bonus.toLocaleString()}</td>
                    <td>$${total.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-secondary" onclick="editEmployee(${emp.id})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error(error);
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--error-color);">Error loading employees</td></tr>';
        showNotification("Error loading employees", "error");
    });
}

function loadSummary() {
    const summaryElement = document.getElementById("detailedSummary");

    fetch(BASE_URL + "/payroll-summary")
    .then(response => response.json())
    .then(data => {
        summaryElement.innerHTML = `
            <p><strong>Total Employees:</strong> ${data.totalEmployees}</p>
            <p><strong>Total Payroll:</strong> $${data.totalPayroll.toLocaleString()}</p>
            <p><strong>Average Salary:</strong> $${data.averageSalary.toLocaleString()}</p>
            <p><strong>Highest Salary:</strong> $${data.highestSalary.toLocaleString()}</p>
        `;

        // Update dashboard stats
        updateStats(data);
    })
    .catch(error => {
        console.error(error);
        summaryElement.innerHTML = '<p style="color: var(--error-color);">Error loading summary</p>';
        showNotification("Error loading summary", "error");
    });
}

function updateStats(data = null) {
    if (!data) {
        // Load fresh data if not provided
        fetch(BASE_URL + "/payroll-summary")
        .then(response => response.json())
        .then(freshData => {
            updateDashboardStats(freshData);
        })
        .catch(error => {
            console.error("Error updating stats:", error);
        });
    } else {
        updateDashboardStats(data);
    }
}

function updateDashboardStats(data) {
    const totalEmployeesEl = document.getElementById('totalEmployees');
    const totalPayrollEl = document.getElementById('totalPayroll');
    const averageSalaryEl = document.getElementById('averageSalary');

    if (totalEmployeesEl) totalEmployeesEl.textContent = data.totalEmployees || '--';
    if (totalPayrollEl) totalPayrollEl.textContent = data.totalPayroll ? `$${data.totalPayroll.toLocaleString()}` : '--';
    if (averageSalaryEl) averageSalaryEl.textContent = data.averageSalary ? `$${data.averageSalary.toLocaleString()}` : '--';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>${message}</span>
        </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function editEmployee(id) {
    // This would open an edit modal - for now just show a notification
    showNotification(`Edit functionality for employee ${id} would open here`, 'info');
}

function calculateBonus(event) {
    event.preventDefault();

    const baseSalary = parseFloat(document.getElementById('baseSalary').value);
    const bonusType = document.getElementById('bonusType').value;
    const multiplier = parseFloat(document.getElementById('multiplier').value);

    if (!baseSalary || !bonusType || !multiplier) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    if (baseSalary <= 0) {
        showNotification('Base salary must be greater than 0', 'error');
        return;
    }

    if (multiplier < 0) {
        showNotification('Multiplier cannot be negative', 'error');
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading">Calculating...</span>';
    submitBtn.disabled = true;

    const requestData = {
        baseSalary: baseSalary,
        bonusType: bonusType,
        multiplier: multiplier
    };

    fetch(BASE_URL + '/calculate-bonus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayBonusResult(data);
        showNotification('Bonus calculated successfully!', 'success');
    })
    .catch(error => {
        console.error('Error calculating bonus:', error);
        showNotification('Error calculating bonus. Please try again.', 'error');
        showBonusError();
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function displayBonusResult(data) {
    const resultContainer = document.getElementById('bonusResult');

    const resultHTML = `
        <div class="bonus-result-display">
            <div class="result-summary">
                <h4>Bonus Calculation Result</h4>
                <p>Total Salary: <strong>$${data.totalSalary.toLocaleString()}</strong></p>
            </div>
            <div class="result-breakdown">
                <div class="result-item">
                    <div class="label">Base Salary</div>
                    <div class="value">$${data.baseSalary.toLocaleString()}</div>
                </div>
                <div class="result-item">
                    <div class="label">Bonus Type</div>
                    <div class="value">${data.bonusType.charAt(0).toUpperCase() + data.bonusType.slice(1)}</div>
                </div>
                <div class="result-item">
                    <div class="label">Multiplier</div>
                    <div class="value">${data.multiplier}${data.bonusType === 'percentage' ? '%' : data.bonusType === 'performance' ? '' : ''}</div>
                </div>
                <div class="result-item">
                    <div class="label">Calculated Bonus</div>
                    <div class="value">$${data.calculatedBonus.toLocaleString()}</div>
                </div>
            </div>
        </div>
    `;

    resultContainer.innerHTML = resultHTML;
}

function showBonusError() {
    const resultContainer = document.getElementById('bonusResult');
    resultContainer.innerHTML = `
        <div class="result-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m15 9-6 6"></path>
                <path d="m9 9 6 6"></path>
            </svg>
            <p style="color: var(--error-color);">Error calculating bonus. Please try again.</p>
        </div>
    `;
}

function clearBonusForm() {
    document.getElementById('baseSalary').value = '';
    document.getElementById('bonusType').value = '';
    document.getElementById('multiplier').value = '';

    const resultContainer = document.getElementById('bonusResult');
    resultContainer.innerHTML = `
        <div class="result-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <p>Enter values and click "Calculate Bonus" to see results</p>
        </div>
    `;

    // Reset multiplier help text
    updateMultiplierHelp();
}

function updateMultiplierHelp() {
    const bonusType = document.getElementById('bonusType').value;
    const helpElement = document.getElementById('multiplierHelp');

    const helpTexts = {
        'percentage': 'Enter percentage (e.g., 10 for 10%)',
        'fixed': 'Enter fixed bonus amount (e.g., 5000)',
        'tiered': 'Multiplier ignored - automatic tier calculation',
        'performance': 'Enter performance score (e.g., 85 for 85%)',
        '': 'Select bonus type first'
    };

    helpElement.textContent = helpTexts[bonusType] || helpTexts[''];
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation event listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }

    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');

        if (window.innerWidth <= 1024 &&
            !sidebar.contains(e.target) &&
            e.target !== menuToggle &&
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });

    // Quick action buttons - handle both navigation and function calls
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            const onclick = this.getAttribute('onclick');

            if (section) {
                showSection(section);
            } else if (onclick) {
                // Execute the onclick function
                const funcName = onclick.match(/(\w+)\(\)/)?.[1];
                if (funcName && window[funcName]) {
                    window[funcName]();
                }
            }
        });
    });

    // Bonus type change listener
    const bonusTypeSelect = document.getElementById('bonusType');
    if (bonusTypeSelect) {
        bonusTypeSelect.addEventListener('change', updateMultiplierHelp);
    }

    // Initialize multiplier help text
    updateMultiplierHelp();

    // Initialize the app - show dashboard by default
    showSection('dashboard');
    loadEmployees();
    loadSummary();
    updateStats();
});

// Handle window resize for sidebar
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 1024) {
        sidebar.classList.remove('show');
    }
});