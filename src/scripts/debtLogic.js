import { 
    getDebt, setDebt, getDebtData, setDebtData, getExchangeRate, fetchExchangeRate,
    externalDebtRatio, dailyGrowthRate, annualGrowthRate, getDebtByYear,
    getPopulationByYear, getDeficitByYear, getExchangeRateByYear
} from './data.js';

// Debt increase calculations
export function getDebtIncrease(timeframe) {
    const dailyIncrease = getDebt() * dailyGrowthRate;
    switch (timeframe) {
        case 'daily': return dailyIncrease;
        case 'hourly': return dailyIncrease / 24;
        case 'minute': return dailyIncrease / (24 * 60);
        case 'second': return dailyIncrease / (24 * 60 * 60);
        default: return 0;
    }
}

// Number formatting
export function formatNumber(number) {
    return number ? new Intl.NumberFormat('en-US').format(Math.abs(number).toFixed(2)) : 'N/A';
}

// Update debt display
export async function updateDebtDisplay() {
    await fetchExchangeRate(); // Update exchange rate dynamically
    const debt = getDebt();
    const externalDebt = debt * externalDebtRatio;
    const internalDebt = debt * (1 - externalDebtRatio);
    const perCitizen2025 = debt / getPopulationByYear(2025);
    const currentDate = getDebtData().date;

    if (debt > 20e12) {
        console.warn('Debt exceeded 20T KES, resetting to 2024 base');
        setDebt(getDebtByYear(2024));
        setDebtData({ debt: `${(getDebt() / 1e12).toFixed(2)} trillion KES`, date: new Date().toISOString().split('T')[0] });
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
    if (debt2000El) debt2000El.textContent = `${formatNumber(getDebtByYear(2000) / 1e9)} billion KES`;
    if (debt2005El) debt2005El.textContent = `${formatNumber(getDebtByYear(2005) / 1e9)} billion KES`;
    if (debt2010El) debt2010El.textContent = `${formatNumber(getDebtByYear(2010) / 1e12)} trillion KES`;
    if (debt2015El) debt2015El.textContent = `${formatNumber(getDebtByYear(2015) / 1e12)} trillion KES`;
    if (debt2020El) debt2020El.textContent = `${formatNumber(getDebtByYear(2020) / 1e12)} trillion KES`;
    if (debtBreakdownEl) debtBreakdownEl.textContent = `Ext: ${formatNumber(externalDebt / 1e12)}T | Int: ${formatNumber(internalDebt / 1e12)}T`;
    if (perCitizen2000El) perCitizen2000El.textContent = `${formatNumber(getDebtByYear(2000) / getPopulationByYear(2000))} KES`;
    if (perCitizen2005El) perCitizen2005El.textContent = `${formatNumber(getDebtByYear(2005) / getPopulationByYear(2005))} KES`;
    if (perCitizen2010El) perCitizen2010El.textContent = `${formatNumber(getDebtByYear(2010) / getPopulationByYear(2010))} KES`;
    if (perCitizen2015El) perCitizen2015El.textContent = `${formatNumber(getDebtByYear(2015) / getPopulationByYear(2015))} KES`;
    if (perCitizen2020El) perCitizen2020El.textContent = `${formatNumber(getDebtByYear(2020) / getPopulationByYear(2020))} KES`;
    if (perCitizen2025El) perCitizen2025El.textContent = `${formatNumber(perCitizen2025)} KES`;
    if (deficit2000El) deficit2000El.textContent = `+${formatNumber(getDeficitByYear(2000) / 1e9)} billion KES`;
    if (deficit2005El) deficit2005El.textContent = `-${formatNumber(Math.abs(getDeficitByYear(2005)) / 1e9)} billion KES`;
    if (deficit2010El) deficit2010El.textContent = `-${formatNumber(Math.abs(getDeficitByYear(2010)) / 1e9)} billion KES`;
    if (deficit2015El) deficit2015El.textContent = `-${formatNumber(Math.abs(getDeficitByYear(2015)) / 1e9)} billion KES`;
    if (deficit2020El) deficit2020El.textContent = `-${formatNumber(Math.abs(getDeficitByYear(2020)) / 1e9)} billion KES`;
    if (deficit2025El) deficit2025El.textContent = `-${formatNumber(Math.abs(getDeficitByYear(2025)) / 1e9)} billion KES`;
    if (rate2000El) rate2000El.textContent = `${getExchangeRateByYear(2000)} KES/USD`;
    if (rate2005El) rate2005El.textContent = `${getExchangeRateByYear(2005)} KES/USD`;
    if (rate2010El) rate2010El.textContent = `${getExchangeRateByYear(2010)} KES/USD`;
    if (rate2015El) rate2015El.textContent = `${getExchangeRateByYear(2015)} KES/USD`;
    if (rate2020El) rate2020El.textContent = `${getExchangeRateByYear(2020)} KES/USD`;
    if (rate2025El) rate2025El.textContent = `${formatNumber(getExchangeRate())} KES/USD`;
    if (debtUsdEl) debtUsdEl.textContent = `~${formatNumber(debt / getExchangeRate() / 1e9)} billion USD`;
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

// Theme toggle logic
export function setupThemeToggle() {
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