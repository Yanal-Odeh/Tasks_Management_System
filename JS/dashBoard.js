// Function to update date & time dynamically
function updateDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('datetime').textContent = formattedDate;
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime();





// Chart.js: Simple Bar Chart
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Projects', 'Students', 'Tasks', 'Finished'],
        datasets: [{
            label: 'Count',
            data: [5, 20, 10, 2],
            backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true }
        }
    }
});



