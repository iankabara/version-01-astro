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

async function fetchDebtData() {
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

async function getExchangeRate() {
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

    document.getElementById('debt').textContent = `${formatNumber(debt / 1e12)} trillion KES`;
    document.getElementById('debt-2000').textContent = `${formatNumber(debt2000 / 1e9)} billion KES`;
    document.getElementById('debt-2005').textContent = `${formatNumber(debt2005 / 1e9)} billion KES`;
    document.getElementById('debt-2010').textContent = `${formatNumber(debt2010 / 1e12)} trillion KES`;
    document.getElementById('debt-2015').textContent = `${formatNumber(debt2015 / 1e12)} trillion KES`;
    document.getElementById('debt-2020').textContent = `${formatNumber(debt2020 / 1e12)} trillion KES`;
    document.getElementById('debt-breakdown').textContent = `Ext: ${formatNumber(externalDebt / 1e12)}T | Int: ${formatNumber(internalDebt / 1e12)}T`;
    document.getElementById('per-citizen-2000').textContent = `${formatNumber(debt2000 / pop2000)} KES`;
    document.getElementById('per-citizen-2005').textContent = `${formatNumber(debt2005 / pop2005)} KES`;
    document.getElementById('per-citizen-2010').textContent = `${formatNumber(debt2010 / pop2010)} KES`;
    document.getElementById('per-citizen-2015').textContent = `${formatNumber(debt2015 / pop2015)} KES`;
    document.getElementById('per-citizen-2020').textContent = `${formatNumber(debt2020 / pop2020)} KES`;
    document.getElementById('per-citizen-2025').textContent = `${formatNumber(perCitizen2025)} KES`;
    document.getElementById('deficit-2000').textContent = `+${formatNumber(deficit2000 / 1e9)} billion KES`;
    document.getElementById('deficit-2005').textContent = `-${formatNumber(deficit2005 / 1e9)} billion KES`;
    document.getElementById('deficit-2010').textContent = `-${formatNumber(deficit2010 / 1e9)} billion KES`;
    document.getElementById('deficit-2015').textContent = `-${formatNumber(deficit2015 / 1e9)} billion KES`;
    document.getElementById('deficit-2020').textContent = `-${formatNumber(deficit2020 / 1e9)} billion KES`;
    document.getElementById('deficit-2025').textContent = `-${formatNumber(deficit2025 / 1e9)} billion KES`;
    document.getElementById('rate-2000').textContent = `${rate2000} KES/USD`;
    document.getElementById('rate-2005').textContent = `${rate2005} KES/USD`;
    document.getElementById('rate-2010').textContent = `${rate2010} KES/USD`;
    document.getElementById('rate-2015').textContent = `${rate2015} KES/USD`;
    document.getElementById('rate-2020').textContent = `${rate2020} KES/USD`;
    document.getElementById('rate-2025').textContent = `${formatNumber(exchangeRate)} KES/USD`;
    document.getElementById('debt-usd').textContent = `~${formatNumber(debt / exchangeRate / 1e9)} billion USD`;
    document.getElementById('debt-per-citizen').textContent = `~${formatNumber(debt / pop2025)} KES per citizen`;
    document.getElementById('date').textContent = debtData.date;
    document.getElementById('daily-increase').textContent = `${formatNumber(getDebtIncrease('daily'))} KES`;
    document.getElementById('hourly-increase').textContent = `${formatNumber(getDebtIncrease('hourly'))} KES`;
    document.getElementById('per-minute').textContent = `${formatNumber(getDebtIncrease('minute'))} KES`;
    document.getElementById('per-second').textContent = `${formatNumber(getDebtIncrease('second'))} KES`;
    document.getElementById('annual-growth-rate').textContent = `${(annualGrowthRate * 100).toFixed(2)}% (projected annual growth)`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await fetchDebtData();
    await updateDebtDisplay();
    setInterval(() => {
        debt += getDebtIncrease('second');
        updateDebtDisplay();
    }, 1000);
});