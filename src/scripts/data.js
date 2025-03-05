// Debt Data from your JSON source
const kenyaNationalDebt = [
    { year: 2000, amountKES: 346875000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2005, amountKES: 693750000000, source: "National Treasury Economic Survey" },
    { year: 2010, amountKES: 1387500000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2015, amountKES: 2775000000000, source: "National Treasury Economic Survey" },
    { year: 2020, amountKES: 5550000000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2021, amountKES: 7700000000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2022, amountKES: 8600000000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2023, amountKES: 10100000000000, source: "Central Bank of Kenya (CBK) Annual Report" },
    { year: 2024, amountKES: 11000000000000, source: "National Treasury Budget Statement" }
];

// Population Data
const populationData = [
    { year: 2000, population: 30700000, source: "Kenya National Bureau of Statistics (KNBS) Census" },
    { year: 2005, population: 35600000, source: "Kenya National Bureau of Statistics (KNBS) Census" },
    { year: 2010, population: 40500000, source: "Kenya National Bureau of Statistics (KNBS) Census" },
    { year: 2015, population: 46100000, source: "Kenya National Bureau of Statistics (KNBS) Census" },
    { year: 2020, population: 51400000, source: "Kenya National Bureau of Statistics (KNBS) Census" },
    { year: 2025, population: 57000000, source: "Kenya National Bureau of Statistics (KNBS) Projections" }
];

// Exchange Rate Data (historical)
const exchangeRateData = [
    { year: 2000, rate: 76, source: "Central Bank of Kenya (CBK) Historical Exchange Rate Data" },
    { year: 2005, rate: 73, source: "Central Bank of Kenya (CBK) Historical Exchange Rate Data" },
    { year: 2010, rate: 81, source: "Central Bank of Kenya (CBK) Historical Exchange Rate Data" },
    { year: 2015, rate: 102, source: "Central Bank of Kenya (CBK) Historical Exchange Rate Data" },
    { year: 2020, rate: 109, source: "Central Bank of Kenya (CBK) Historical Exchange Rate Data" }
];

// Deficit Data
const deficitData = [
    { year: 2000, amountKES: 7570000000, source: "National Treasury Budget Statement" },
    { year: 2005, amountKES: -64500000000, source: "National Treasury Budget Statement" },
    { year: 2010, amountKES: -147800000000, source: "National Treasury Budget Statement" },
    { year: 2015, amountKES: -506700000000, source: "National Treasury Budget Statement" },
    { year: 2020, amountKES: -478300000000, source: "National Treasury Budget Statement" },
    { year: 2025, amountKES: -831000000000, source: "National Treasury Budget Statement" }
];

// State
let debt = kenyaNationalDebt.find(d => d.year === 2024).amountKES; // Start with 2024 value (11T KES)
let debtData = { debt: `${(debt / 1e12).toFixed(2)} trillion KES`, date: new Date().toISOString().split('T')[0] };
let exchangeRate = 132; // Initial estimate, updated dynamically

// Constants
export const externalDebtRatio = 0.5;
export const annualGrowthRate = 0.05; // 5% annual growth
export const dailyGrowthRate = annualGrowthRate / 365; // ~0.0137% daily

// Exported data getters
export function getDebt() {
    return debt;
}

export function setDebt(newDebt) {
    debt = newDebt;
}

export function getDebtData() {
    return debtData;
}

export function setDebtData(newDebtData) {
    debtData = newDebtData;
}

export function getExchangeRate() {
    return exchangeRate;
}

export function getDebtByYear(year) {
    return kenyaNationalDebt.find(d => d.year === year)?.amountKES || 0;
}

export function getPopulationByYear(year) {
    return populationData.find(p => p.year === year)?.population || 0;
}

export function getDeficitByYear(year) {
    return deficitData.find(d => d.year === year)?.amountKES || 0;
}

export function getExchangeRateByYear(year) {
    return exchangeRateData.find(r => r.year === year)?.rate || 0;
}

// Dynamic exchange rate fetch
export async function fetchExchangeRate() {
    try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        exchangeRate = data.rates.KES;
        console.log("Exchange Rate API Response:", exchangeRate);
    } catch (e) {
        console.error('Failed to fetch exchange rate, using fallback:', e);
        exchangeRate = 132;
    }
}