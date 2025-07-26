// Global Chart instances
let categoryBarChart;
let expensePieChart;

// Data structure to hold expense totals for both charts
const expenseDataForCharts = {
  Food: 0,
  Transport: 0,
  Shopping: 0,
  Health: 0,
  Other: 0
};

// Data structure to hold future planned expenses
const futureExpenses = []; // Array to store objects like { title, amount, date }

// Define fixed colors for chart categories
const chartColors = {
  Food: '#4C8BF5',    // Blue
  Transport: '#38D9A9', // Green
  Shopping: '#FF6384', // Red-ish
  Health: '#FFCE56',  // Yellow
  Other: '#9966FF'    // Purple
};

function showSignUp() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("account-page").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  // Show floating animations on signup page
  document.querySelector(".floating-animations").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("account-page").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  // Show floating animations on login page
  document.querySelector(".floating-animations").classList.remove("hidden");
}

function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  console.log("Login attempted with:", username, password);

  if (username && password) {
    document.getElementById("account-page").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    // Hide floating animations when navigating to dashboard
    document.querySelector(".floating-animations").classList.add("hidden");
    console.log("Navigated to dashboard.");
    // Initial render of future expenses after login
    renderFutureExpenses();
  } else {
    alert("Please enter username and password.");
  }
}

// --- NEW LOGOUT FUNCTION ---
function logout() {
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("account-page").classList.remove("hidden");
  // Show floating animations again on the login page
  document.querySelector(".floating-animations").classList.remove("hidden");
  console.log("Logged out. Redirected to login page.");

  // Optionally, clear login form fields
  document.getElementById("login-username").value = '';
  document.getElementById("login-password").value = '';
}
// --- END NEW LOGOUT FUNCTION ---


function signup() {
  const email = document.getElementById("signup-email").value;
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  if (email && username && password) {
    alert("Account created! You can now log in.");
    showLogin();
  } else {
    alert("Please fill out all fields.");
  }
}

function addExpense() {
  const title = document.getElementById("title").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (title && !isNaN(amount) && category) {
    const tableBody = document.getElementById("expense-table-body");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="border px-4 py-2">${title}</td>
      <td class="border px-4 py-2">₹${amount.toFixed(2)}</td>
      <td class="border px-4 py-2">${category}</td>
      <td class="border px-4 py-2">
        <button onclick="deleteExpense(this, ${amount}, '${category}')"
                        class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);

    if (expenseDataForCharts.hasOwnProperty(category)) {
      expenseDataForCharts[category] += amount;
    } else {
      expenseDataForCharts['Other'] += amount;
    }

    updatePieChart();
    updateBarChart();

    document.getElementById("title").value = '';
    document.getElementById("amount").value = '';
    document.getElementById("category").value = '';
  } else {
      alert("Please fill out all fields (Title, Amount, and Category).");
  }
}

function deleteExpense(buttonElement, amount, category) {
    const row = buttonElement.closest('tr');
    if (row) {
        row.remove();

        if (expenseDataForCharts.hasOwnProperty(category)) {
            expenseDataForCharts[category] -= amount;
            if (expenseDataForCharts[category] < 0) {
                expenseDataForCharts[category] = 0;
            }
        }
        updatePieChart();
        updateBarChart();
    }
}

function updatePieChart() {
    const categories = Object.keys(expenseDataForCharts);
    const dataValues = Object.values(expenseDataForCharts);
    const backgroundColors = categories.map(cat => chartColors[cat] || '#CCCCCC');

    expensePieChart.data.labels = categories;
    expensePieChart.data.datasets[0].data = dataValues;
    expensePieChart.data.datasets[0].backgroundColor = backgroundColors;
    expensePieChart.update();
}

function updateBarChart() {
    const categories = Object.keys(expenseDataForCharts);
    const dataValues = Object.values(expenseDataForCharts);
    const backgroundColors = categories.map(cat => chartColors[cat] || '#CCCCCC');

    categoryBarChart.data.labels = categories;
    categoryBarChart.data.datasets[0].data = dataValues;
    categoryBarChart.data.datasets[0].backgroundColor = backgroundColors;
    categoryBarChart.update();
}

// --- FUNCTIONS FOR FUTURE EXPENSES (unchanged) ---

function addFutureExpense() {
    const title = document.getElementById("future-title").value;
    const amount = parseFloat(document.getElementById("future-amount").value);
    const date = document.getElementById("future-date").value; // Format YYYY-MM-DD

    if (title && !isNaN(amount) && date) {
        futureExpenses.push({ title, amount, date });
        renderFutureExpenses(); // Update the table
        // Clear form fields
        document.getElementById("future-title").value = '';
        document.getElementById("future-amount").value = '';
        document.getElementById("future-date").value = '';
    } else {
        alert("Please fill out all fields (Planned Expense, Amount, and Due Date).");
    }
}

function deleteFutureExpense(index) {
    futureExpenses.splice(index, 1); // Remove the item at the given index
    renderFutureExpenses(); // Re-render the table
}

function renderFutureExpenses() {
    const tableBody = document.getElementById("future-expense-table-body");
    tableBody.innerHTML = ''; // Clear existing rows

    // Sort future expenses by date (optional, but good for planning)
    futureExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

    futureExpenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        row.innerHTML = `
            <td class="border px-2 py-2">${expense.title}</td>
            <td class="border px-2 py-2">₹${expense.amount.toFixed(2)}</td>
            <td class="border px-2 py-2">${formattedDate}</td>
            <td class="border px-2 py-2">
                <button onclick="deleteFutureExpense(${index})"
                                class="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">Remove</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


window.onload = function () {
  // Initialize Bar Chart
  const ctx1 = document.getElementById('categoryBarChart').getContext('2d');
  categoryBarChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: Object.keys(expenseDataForCharts),
      datasets: [{
        label: 'Total Spent',
        data: Object.values(expenseDataForCharts),
        backgroundColor: Object.keys(expenseDataForCharts).map(cat => chartColors[cat]),
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      }
    }
  });

  // Initialize Pie Chart
  const ctxPie = document.getElementById('expensePieChart').getContext('2d');
  expensePieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
      labels: Object.keys(expenseDataForCharts),
      datasets: [{
        data: Object.values(expenseDataForCharts),
        backgroundColor: Object.keys(expenseDataForCharts).map(cat => chartColors[cat])
      }]
    },
    options: {
      responsive: true,
      plugins: {
          legend: {
              position: 'top',
          },
          tooltip: {
              callbacks: {
                  label: function(context) {
                      let label = context.label || '';
                      if (label) {
                          label += ': ';
                      }
                      if (context.parsed !== null) {
                          label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                      }
                      return label;
                  }
              }
          }
      }
    }
  });

  updatePieChart();
  updateBarChart();

  // Ensure animations are visible initially if on the login page (which is the default)
  document.querySelector(".floating-animations").classList.remove("hidden");

  // Initial render of future expenses when page loads (if user is already on dashboard)
  renderFutureExpenses();
};