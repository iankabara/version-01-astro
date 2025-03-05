import Chart from 'chart.js/auto';
import { updateDebtDisplay, getDebtIncrease, setupThemeToggle, setDebt, getDebtByYear } from './debtLogic.js';

async function setupChart() {
    const ctx = document.getElementById('debtChart')?.getContext('2d');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }

    const labels = ['2000', '2005', '2010', '2015', '2020', '2025'];
    const debtChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Debt (trillion KES)',
                data: [
                    getDebtByYear(2000) / 1e12,
                    getDebtByYear(2005) / 1e12,
                    getDebtByYear(2010) / 1e12,
                    getDebtByYear(2015) / 1e12,
                    getDebtByYear(2020) / 1e12,
                    getDebt() / 1e12
                ],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: false, title: { display: true, text: 'Trillion KES', color: '#fff' } },
                x: { title: { display: true, text: 'Year', color: '#fff' } }
            },
            plugins: {
                legend: { labels: { color: '#fff' } },
                tooltip: { enabled: true }
            }
        }
    });

    setInterval(() => {
        debtChart.data.datasets[0].data[5] = getDebt() / 1e12;
        debtChart.update();
    }, 1000);
}

async function init() {
    updateDebtDisplay(); // Show initial data immediately
    setupThemeToggle();
    await setupChart();

    setInterval(() => {
        const newDebt = getDebt() + getDebtIncrease('daily');
        setDebt(newDebt);
        updateDebtDisplay();
    }, 24 * 60 * 60 * 1000); // Update debt daily

    setInterval(updateDebtDisplay, 60 * 60 * 1000); // Update exchange rate hourly
}

init();