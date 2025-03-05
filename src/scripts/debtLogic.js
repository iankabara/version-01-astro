export let debt = 0;
export let debtData = { debt: '0 trillion KES', date: '' };
export const debt2000 = 0.346875e12;
export const debt2005 = 0.69375e12;
export const debt2010 = 1.3875e12;
export const debt2015 = 2.775e12;
export const debt2020 = 5.55e12;
export const pop2000 = 30700000;
export const pop2005 = 35600000;
export const pop2010 = 40500000;
export const pop2015 = 46100000;
export const pop2020 = 51400000;
export const pop2025 = 55000000;
export const deficit2000 = 7.57e9;
export const deficit2005 = -64.5e9;
export const deficit2010 = -147.8e9;
export const deficit2015 = -506.7e9;
export const deficit2020 = -478.3e9;
export const deficit2025 = -831e9;
export const externalDebtRatio = 0.5;
export let exchangeRate = 129;
export const rate2000 = 76;
export const rate2005 = 73;
export const rate2010 = 81;
export const rate2015 = 102;
export const rate2020 = 109;
export const annualGrowthRate = 0.05;
export const secondsInYear = 365 * 24 * 60 * 60;
export const growthRatePerSecond = annualGrowthRate / secondsInYear;

export async function fetchDebtData() {
    try {
        const response = await fetch('https://api.worldbank.org/v2/country/KE/indicator/DT.DOD.DECT.CD?format=json');
        const data = await response.json();
        const latestDebt = data[1]?.[0]?.value;
        console.log("World Bank API Response:", data);
        if (latestDebt) {
            debtData = { debt: `${(latestDebt * exchangeRate / 1e9).toFixed(2)} trillion KES`, date: data[1][0].date };
            debt = parseFloat(debtData.debt.split(' ')[0]) * 1e12;
        } else {
            throw new Error('No debt data available');
        }
    } catch (error) {
        console.error('Failed to fetch World Bank data:', error);
        debt = 11e12;
        debtData = { debt: '11.00 trillion KES', date: '2025-03-04' };
    }
}

export async function getExchangeRate() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        exchangeRate = data.rates.KES;
        console.log("Exchange Rate API Response:", exchangeRate);
    } catch (e) {
        console.error('Failed to fetch exchange rate:', e);
        exchangeRate = 129;
    }
}

export function getDebtIncrease(timeframe) {
    const baseIncrease = debt * growthRatePerSecond;
    switch (timeframe) {
        case 'daily': return baseIncrease * (24 * 60 * 60);
        case 'hourly': return baseIncrease * (60 * 60);
        case 'minute': return baseIncrease * 60;
        case 'second': return baseIncrease;
        default: return 0;
    }
}

export function formatNumber(number) {
    return number ? new Intl.NumberFormat('en-US').format(Math.abs(number).toFixed(0)) : 'N/A';
}

export async function updateDebtDisplay() {
    await getExchangeRate();
    const externalDebt = debt * externalDebtRatio;
    const internalDebt = debt * (1 - externalDebtRatio);
    const perCitizen2025 = debt / pop2025;

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
    if (debtPerCitizenEl) debtPerCitizenEl.textContent = `~${formatNumber(debt / pop2025)} KES per citizen`;
    if (dateEl) dateEl.textContent = debtData.date;
    if (dailyIncreaseEl) dailyIncreaseEl.textContent = `${formatNumber(getDebtIncrease('daily'))} KES`;
    if (hourlyIncreaseEl) hourlyIncreaseEl.textContent = `${formatNumber(getDebtIncrease('hourly'))} KES`;
    if (minuteIncreaseEl) minuteIncreaseEl.textContent = `${formatNumber(getDebtIncrease('minute'))} KES`;
    if (secondIncreaseEl) secondIncreaseEl.textContent = `${formatNumber(getDebtIncrease('second'))} KES`;
    if (growthRateEl) growthRateEl.textContent = `${(annualGrowthRate * 100).toFixed(2)}% (projected annual growth)`;
}

export async function init() {
    await fetchDebtData();
    await updateDebtDisplay();
    setInterval(() => {
        debt += getDebtIncrease('second');
        updateDebtDisplay();
    }, 1000);
}