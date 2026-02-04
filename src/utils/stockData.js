// Mock stock price data - In production, this would come from a real API
const stockPrices = {
  AAPL: { current: 185.92, name: 'Apple Inc.' },
  GOOGL: { current: 141.80, name: 'Alphabet Inc.' },
  MSFT: { current: 378.91, name: 'Microsoft Corp.' },
  AMZN: { current: 178.25, name: 'Amazon.com Inc.' },
  TSLA: { current: 248.50, name: 'Tesla Inc.' },
  NVDA: { current: 721.33, name: 'NVIDIA Corp.' },
  META: { current: 474.99, name: 'Meta Platforms' },
  JPM: { current: 183.27, name: 'JPMorgan Chase' },
  V: { current: 275.96, name: 'Visa Inc.' },
  JNJ: { current: 156.74, name: 'Johnson & Johnson' },
  WMT: { current: 162.35, name: 'Walmart Inc.' },
  PG: { current: 158.92, name: 'Procter & Gamble' },
  DIS: { current: 112.87, name: 'Walt Disney Co.' },
  NFLX: { current: 478.23, name: 'Netflix Inc.' },
  AMD: { current: 177.56, name: 'AMD Inc.' },
  INTC: { current: 43.28, name: 'Intel Corp.' },
  CRM: { current: 272.45, name: 'Salesforce Inc.' },
  ORCL: { current: 123.67, name: 'Oracle Corp.' },
  CSCO: { current: 48.92, name: 'Cisco Systems' },
  ADBE: { current: 578.34, name: 'Adobe Inc.' },
};

// Generate monthly performance data (24 months)
export function generatePerformanceData(portfolio) {
  const months = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // Generate realistic-looking performance data
    // Base it on actual portfolio value with some variance
    const baseValue = calculatePortfolioValue(portfolio);
    const monthIndex = 23 - i;

    // Create a growth trend with volatility
    const trend = 1 + (monthIndex * 0.008); // ~0.8% monthly growth trend
    const volatility = (Math.random() - 0.5) * 0.12; // ±6% volatility
    const seasonality = Math.sin(monthIndex * 0.5) * 0.03; // Slight seasonal pattern

    const multiplier = trend + volatility + seasonality;
    const value = baseValue * multiplier * 0.85; // Start lower than current

    months.push({
      date: monthName,
      fullDate: date,
      value: Math.round(value * 100) / 100,
      month: date.getMonth(),
      year: date.getFullYear()
    });
  }

  // Calculate month-over-month changes
  for (let i = 1; i < months.length; i++) {
    const change = months[i].value - months[i - 1].value;
    const changePercent = (change / months[i - 1].value) * 100;
    months[i].change = Math.round(change * 100) / 100;
    months[i].changePercent = Math.round(changePercent * 100) / 100;
  }

  // First month has no previous comparison
  months[0].change = 0;
  months[0].changePercent = 0;

  return months;
}

export function getStockPrice(symbol) {
  const upperSymbol = symbol.toUpperCase();
  if (stockPrices[upperSymbol]) {
    return stockPrices[upperSymbol];
  }
  // Generate a random price for unknown stocks
  return {
    current: Math.round((50 + Math.random() * 200) * 100) / 100,
    name: `${upperSymbol} Stock`
  };
}

export function calculatePortfolioValue(portfolio) {
  return portfolio.reduce((total, stock) => {
    const price = getStockPrice(stock.symbol);
    return total + (price.current * stock.shares);
  }, 0);
}

export function calculatePortfolioGainLoss(portfolio) {
  return portfolio.reduce((total, stock) => {
    const currentPrice = getStockPrice(stock.symbol).current;
    const costBasis = stock.purchasePrice * stock.shares;
    const currentValue = currentPrice * stock.shares;
    return total + (currentValue - costBasis);
  }, 0);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Find best and worst performing months
export function getPerformanceInsights(performanceData) {
  if (!performanceData || performanceData.length < 2) {
    return { best: null, worst: null };
  }

  const monthsWithChange = performanceData.filter(m => m.changePercent !== undefined && m.changePercent !== 0);

  if (monthsWithChange.length === 0) {
    return { best: null, worst: null };
  }

  const best = monthsWithChange.reduce((max, month) =>
    month.changePercent > max.changePercent ? month : max
  );

  const worst = monthsWithChange.reduce((min, month) =>
    month.changePercent < min.changePercent ? month : min
  );

  return { best, worst };
}

export const popularStocks = Object.keys(stockPrices);

export default stockPrices;
