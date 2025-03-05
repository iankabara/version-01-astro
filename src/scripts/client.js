import Chart from 'chart.js/auto';

// Debt Logic
let debt = 11e12; // Start with BASE_DEBT immediately
let debtData = { debt: '11.00 trillion KES', date: new Date().toISOString().split('T')[0] }; // Initial approximate value
const BASE_DEBT = 11e12; // Constant: 11T KES (~83.33B USD at 132 KES/USD) for March 05, 2025
const debt2000 = 0.346875e12;
const debt2005 = 0.69375e12;
const debt2010 = 1.3875e12;
const debt2015 = 2.775e12;
const debt2020 = 5.55e12;
const pop2000 = 30700000;
const pop2005 = 35600000;
const pop2010 = 40500000;
const pop2015 = 46100000;
const pop2020 = 51400000;
const pop2025 = 57000000; // ~57M for 2025
const deficit2000 = 7.57e9;
const deficit2005 = -64.5e9;
const deficit2010 = -147.8e9;
const deficit2015 = -506.7e9;
const deficit2020 = -478.3e9;
const deficit2025 = -831e9;
const externalDebtRatio = 0.5;
let exchangeRate = 132; // March 2025 estimate
const rate2000 = 76;
const rate2005 = 73;
const rate2010 = 81;
const rate2015 = 102;
const rate2020 = 109;
const annualGrowthRate = 0.05; // 5% annual growth
const dailyGrowthRate = annualGrowthRate / 365; // ~0.0137% daily

async function fetchDebtData() {
    try {
        const response = await fetch('https://api.worldbank.org/v2/country/KE/indicator/DT.DOD.DECT.CD?format=json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        console.log("World Bank API Response:", data);

        const latestDebt = data[1]?.[0]?.value; // Debt in USD (millions)
        const latestDate = data[1]?.[0]?.date;

        console.log("Latest Debt (M USD):", latestDebt);
        console.log("Latest Date:", latestDate);

        if (latestDebt && latestDate && latestDate === '2025' && typeof latestDebt === 'number' && !isNaN(latestDebt)) {
            const debtInKES = latestDebt * exchangeRate * 1e6; // Convert M USD to KES
            debt = Math.min(debtInKES, 15e12); // Cap at 15T KES
            debtData = { debt: `${(debt / 1e12).toFixed(2)} trillion KES`, date: latestDate };
            console.log("Updated with API data:", debtData);
            await updateDebtDisplay(); // Update UI with API data
        } else {
            console.log("API data not from 2025, retaining approximate value");
        }
    } catch (error) {
        console.error('API fetch failed, retaining approximate debt:', error.message);
    }
}

async function getExchangeRate() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        exchangeRate = data.rates.KES;
        console.log("Exchange Rate API Response:", exchangeRate);
    } catch (e) {
        console.error('Failed to fetch exchange rate:', e);
        exchangeRate = 132;
    }
}

function getDebtIncrease(timeframe) {
    const dailyIncrease = debt * dailyGrowthRate; // Base daily increase (~1.51B KES for 11T)
    switch (timeframe) {
        case 'daily': return dailyIncrease; // ~1.51B KES
        case 'hourly': return dailyIncrease / 24; // ~62.78M KES
        case 'minute': return dailyIncrease / (24 * 60); // ~1.05M KES
        case 'second': return dailyIncrease / (24 * 60 * 60); // ~17,440 KES
        default: return 0;
    }
}

function formatNumber(number) {
    return number ? new Intl.NumberFormat('en-US').format(Math.abs(number).toFixed(2)) : 'N/A';
}

async function updateDebtDisplay() {
    await getExchangeRate();
    const externalDebt = debt * externalDebtRatio;
    const internalDebt = debt * (1 - externalDebtRatio);
    const perCitizen2025 = debt / pop2025;
    const currentDate = debtData.date;

    if (debt > 20e12) {
        console.warn('Debt exceeded 20T KES, resetting to base');
        debt = BASE_DEBT;
    }

    if (perCitizen2025 > 1000000) console.error('Per-citizen debt for 2025 exceeds 1M KES:', perCitizen2025);

    const debtEl = document.getElementById('debt');
    const debt2000El = document.getElementById('debt-2000');
    const debt2005El = document.getElementById('debt-2005');
    const debt2010El = document.getElementById('debt-2010');
    const debt2015El = document.getElementById('debt-2015');
    const debt2020El = document.getElementById('debt-2020');
    const debtBreakdownEl = document.getElementById('debt-breakdown');
    const perCitizen2000El = document.getElementById('per-citizen-2000');
    const perCitizen2005El = document.getElementById('per-citizen-2005');
    const perCitizen2010El = document.getElementById('per-citizen-2010');
    const perCitizen2015El = document.getElementById('per-citizen-2015');
    const perCitizen2020El = document.getElementById('per-citizen-2020');
    const perCitizen2025El = document.getElementById('per-citizen-2025');
    const deficit2000El = document.getElementById('deficit-2000');
    const deficit2005El = document.getElementById('deficit-2005');
    const deficit2010El = document.getElementById('deficit-2010');
    const deficit2015El = document.getElementById('deficit-2015');
    const deficit2020El = document.getElementById('deficit-2020');
    const deficit2025El = document.getElementById('deficit-2025');
    const rate2000El = document.getElementById('rate-2000');
    const rate2005El = document.getElementById('rate-2005');
    const rate2010El = document.getElementById('rate-2010');
    const rate2015El = document.getElementById('rate-2015');
    const rate2020El = document.getElementById('rate-2020');
    const rate2025El = document.getElementById('rate-2025');
    const debtUsdEl = document.getElementById('debt-usd');
    const debtPerCitizenEl = document.getElementById('debt-per-citizen');
    const dateEl = document.getElementById('date');
    const dailyIncreaseEl = document.getElementById('daily-increase');
    const hourlyIncreaseEl = document.getElementById('hourly-increase');
    const minuteIncreaseEl = document.getElementById('per-minute');
    const secondIncreaseEl = document.getElementById('per-second');
    const growthRateEl = document.getElementById('annual-growth-rate');

    if (debtEl) debtEl.textContent = `${formatNumber(debt / 1e12)} trillion KES`;
    if (debt2000El) debt2000El.textContent = `${formatNumber(debt2000 / 1e9)} billion KES`;
    if (debt2005El) debt2005El.textContent = `${formatNumber(debt2005 / 1e9)} billion KES`;
    if (debt2010El) debt2010El.textContent = `${formatNumber(debt2010 / 1e12)} trillion KES`;
    if (debt2015El) debt2015El.textContent = `${formatNumber(debt2015 / 1e12)} trillion KES`;
    if (debt2020El) debt2020El.textContent = `${formatNumber(debt2020 / 1e12)} trillion KES`;
    if (debtBreakdownEl) debtBreakdownEl.textContent = `Ext: ${formatNumber(externalDebt / 1e12)}T | Int: ${formatNumber(internalDebt / 1e12)}T`;
    if (perCitizen2000El) perCitizen2000El.textContent = `${formatNumber(debt2000 / pop2000)} KES`;
    if (perCitizen2005El) perCitizen2005El.textContent = `${formatNumber(debt2005 / pop2005)} KES`;
    if (perCitizen2010El) perCitizen2010El.textContent = `${formatNumber(debt2010 / pop2010)} KES`;
    if (perCitizen2015El) perCitizen2015El.textContent = `${formatNumber(debt2015 / pop2015)} KES`;
    if (perCitizen2020El) perCitizen2020El.textContent = `${formatNumber(debt2020 / pop2020)} KES`;
    if (perCitizen2025El) perCitizen2025El.textContent = `${formatNumber(perCitizen2025)} KES`;
    if (deficit2000El) deficit2000El.textContent = `+${formatNumber(deficit2000 / 1e9)} billion KES`;
    if (deficit2005El) deficit2005El.textContent = `-${formatNumber(deficit2005 / 1e9)} billion KES`;
    if (deficit2010El) deficit2010El.textContent = `-${formatNumber(deficit2010 / 1e9)} billion KES`;
    if (deficit2015El) deficit2015El.textContent = `-${formatNumber(deficit2015 / 1e9)} billion KES`;
    if (deficit2020El) deficit2020El.textContent = `-${formatNumber(deficit2020 / 1e9)} billion KES`;
    if (deficit2025El) deficit2025El.textContent = `-${formatNumber(deficit2025 / 1e9)} billion KES`;
    if (rate2000El) rate2000El.textContent = `${rate2000} KES/USD`;
    if (rate2005El) rate2005El.textContent = `${rate2005} KES/USD`;
    if (rate2010El) rate2010El.textContent = `${rate2010} KES/USD`;
    if (rate2015El) rate2015El.textContent = `${rate2015} KES/USD`;
    if (rate2020El) rate2020El.textContent = `${rate2020} KES/USD`;
    if (rate2025El) rate2025El.textContent = `${formatNumber(exchangeRate)} KES/USD`;
    if (debtUsdEl) debtUsdEl.textContent = `~${formatNumber(debt / exchangeRate / 1e9)} billion USD`;
    if (debtPerCitizenEl) debtPerCitizenEl.textContent = `~${formatNumber(perCitizen2025)} KES per citizen`;
    if (dateEl) dateEl.textContent = currentDate;
    if (dailyIncreaseEl) dailyIncreaseEl.textContent = `${formatNumber(getDebtIncrease('daily'))} KES`;
    if (hourlyIncreaseEl) hourlyIncreaseEl.textContent = `${formatNumber(getDebtIncrease('hourly'))} KES`;
    if (minuteIncreaseEl) minuteIncreaseEl.textContent = `${formatNumber(getDebtIncrease('minute'))} KES`;
    if (secondIncreaseEl) secondIncreaseEl.textContent = `${formatNumber(getDebtIncrease('second'))} KES`;
    if (growthRateEl) growthRateEl.textContent = `${(annualGrowthRate * 100).toFixed(2)}% (projected annual growth)`;

    // Remove loading animations
    const loadingElements = ['debt-loading', 'per-citizen-loading', 'rate-loading'];
    loadingElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('opacity-0');
            setTimeout(() => el.classList.add('hidden'), 300);
        }
    });
    const pulsingElements = ['debt', 'per-citizen-2025', 'rate-2025', 'date', 'debt-usd', 'debt-per-citizen', 'daily-increase', 'hourly-increase', 'per-minute', 'per-second', 'annual-growth-rate'];
    pulsingElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('animate-pulse');
    });
}

// Theme Toggle
function setupThemeToggle() {
    const body = document.getElementById('body');
    const toggleButton = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    if (body && toggleButton && sunIcon && moonIcon) {
        toggleButton.addEventListener('click', () => {
            body.classList.toggle('dark');
            body.classList.toggle('bg-gray-900');
            body.classList.toggle('text-white');
            body.classList.toggle('bg-white');
            body.classList.toggle('text-gray-900');
            sunIcon.classList.toggle('hidden');
            moonIcon.classList.toggle('hidden');
        });
    } else {
        console.error('Theme toggle elements not found in DOM');
    }
}

// Chart Setup
function setupChart() {
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
                    debt2000 / 1e12,
                    debt2005 / 1e12,
                    debt2010 / 1e12,
                    debt2015 / 1e12,
                    debt2020 / 1e12,
                    debt / 1e12
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
        debtChart.data.datasets[0].data[5] = debt / 1e12;
        debtChart.update();
    }, 1000);
}

// Initialize Everything
async function init() {
    // Show approximate value immediately
    updateDebtDisplay(); // Synchronous initial render with BASE_DEBT
    setupThemeToggle();
    setupChart();

    // Fetch API data asynchronously after initial render
    await fetchDebtData();

    setInterval(() => {
        debt += getDebtIncrease('daily');
        updateDebtDisplay();
    }, 24 * 60 * 60 * 1000); // Update daily
}

// Run initialization
init();