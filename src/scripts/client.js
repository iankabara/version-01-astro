import Chart from 'chart.js/auto';
import { updateDebtDisplay, getDebtIncrease, setupThemeToggle, setDebt, getDebtByYear, getDebt } from './debtLogic.js';

// Ensure DOM is ready before running init
document.addEventListener('DOMContentLoaded', init);

async function setupChart() {
    const ctx = document.getElementById('debtChart')?.getContext('2d');
    const fallbackEl = document.getElementById('chart-fallback');
    
    if (!ctx) {
        console.error('Chart canvas not found');
        if (fallbackEl) fallbackEl.classList.remove('hidden');
        return;
    }

    // Define years from kenyaNationalDebt plus live 2025
    const labels = ['2000', '2005', '2010', '2015', '2020', '2021', '2022', '2023', '2024', '2025'];
    const data = [
        getDebtByYear(2000) / 1e12,
        getDebtByYear(2005) / 1e12,
        getDebtByYear(2010) / 1e12,
        getDebtByYear(2015) / 1e12,
        getDebtByYear(2020) / 1e12,
        getDebtByYear(2021) / 1e12,
        getDebtByYear(2022) / 1e12,
        getDebtByYear(2023) / 1e12,
        getDebtByYear(2024) / 1e12,
        getDebt() / 1e12 // Live 2025
    ];

    console.log('Chart Labels:', labels);
    console.log('Chart Data:', data);

    try {
        const debtChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Debt (trillion KES)',
                    data: data,
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
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Trillion KES', color: '#fff' },
                        ticks: { color: '#fff' }
                    },
                    x: {
                        title: { display: true, text: 'Year', color: '#fff' },
                        ticks: { color: '#fff', maxRotation: 45, minRotation: 45 }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } },
                    tooltip: { enabled: true }
                }
            }
        });

        setInterval(() => {
            debtChart.data.datasets[0].data[9] = getDebt() / 1e12; // Update 2025
            debtChart.update();
        }, 1000);
    } catch (error) {
        console.error('Chart initialization failed:', error);
        if (fallbackEl) fallbackEl.classList.remove('hidden');
    }
}

async function init() {
    console.log('Initializing Debt Clock');
    await updateDebtDisplay(); // Show initial data immediately
    setupThemeToggle();
    await setupChart();

    setInterval(() => {
        const newDebt = getDebt() + getDebtIncrease('daily');
        setDebt(newDebt);
        updateDebtDisplay();
    }, 24 * 60 * 60 * 1000); // Update debt daily

    setInterval(updateDebtDisplay, 60 * 60 * 1000); // Update exchange rate hourly
}