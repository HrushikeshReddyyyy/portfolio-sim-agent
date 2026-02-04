// Stock Data Utility with Finnhub API Integration
// API Key should be moved to environment variables in production

const FINNHUB_API_KEY = 'd61sli1r01qgcobqoqe0d61sli1r01qgcobqoqeg';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Cache for stock prices to minimize API calls
const priceCache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

// Fallback mock stock price data
const mockStockPrices = {
  AAPL: { current: 185.92, name: 'Apple Inc.', change: 2.34, changePercent: 1.27 },
  GOOGL: { current: 141.80, name: 'Alphabet Inc.', change: -0.95, changePercent: -0.67 },
  MSFT: { current: 378.91, name: 'Microsoft Corp.', change: 4.52, changePercent: 1.21 },
  AMZN: { current: 178.25, name: 'Amazon.com Inc.', change: 1.87, changePercent: 1.06 },
  TSLA: { current: 248.50, name: 'Tesla Inc.', change: -3.21, changePercent: -1.28 },
  NVDA: { current: 721.33, name: 'NVIDIA Corp.', change: 12.45, changePercent: 1.76 },
  META: { current: 474.99, name: 'Meta Platforms', change: 5.67, changePercent: 1.21 },
  JPM: { current: 183.27, name: 'JPMorgan Chase', change: 1.23, changePercent: 0.68 },
  V: { current: 275.96, name: 'Visa Inc.', change: 2.11, changePercent: 0.77 },
  JNJ: { current: 156.74, name: 'Johnson & Johnson', change: -0.45, changePercent: -0.29 },
  WMT: { current: 162.35, name: 'Walmart Inc.', change: 0.89, changePercent: 0.55 },
  PG: { current: 158.92, name: 'Procter & Gamble', change: 1.02, changePercent: 0.65 },
  DIS: { current: 112.87, name: 'Walt Disney Co.', change: -1.34, changePercent: -1.17 },
  NFLX: { current: 478.23, name: 'Netflix Inc.', change: 6.78, changePercent: 1.44 },
  AMD: { current: 177.56, name: 'AMD Inc.', change: 3.21, changePercent: 1.84 },
  INTC: { current: 43.28, name: 'Intel Corp.', change: -0.67, changePercent: -1.52 },
  CRM: { current: 272.45, name: 'Salesforce Inc.', change: 2.34, changePercent: 0.87 },
  ORCL: { current: 123.67, name: 'Oracle Corp.', change: 1.56, changePercent: 1.28 },
  CSCO: { current: 48.92, name: 'Cisco Systems', change: 0.34, changePercent: 0.70 },
  ADBE: { current: 578.34, name: 'Adobe Inc.', change: 4.56, changePercent: 0.79 },
};

// Comprehensive stock database for search
const stockDatabase = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Technology' },
  GOOG: { name: 'Alphabet Inc. Class C', sector: 'Technology' },
  MSFT: { name: 'Microsoft Corp.', sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer' },
  TSLA: { name: 'Tesla Inc.', sector: 'Automotive' },
  NVDA: { name: 'NVIDIA Corp.', sector: 'Technology' },
  META: { name: 'Meta Platforms', sector: 'Technology' },
  JPM: { name: 'JPMorgan Chase', sector: 'Financial' },
  V: { name: 'Visa Inc.', sector: 'Financial' },
  JNJ: { name: 'Johnson & Johnson', sector: 'Healthcare' },
  WMT: { name: 'Walmart Inc.', sector: 'Retail' },
  PG: { name: 'Procter & Gamble', sector: 'Consumer' },
  DIS: { name: 'Walt Disney Co.', sector: 'Entertainment' },
  NFLX: { name: 'Netflix Inc.', sector: 'Entertainment' },
  AMD: { name: 'AMD Inc.', sector: 'Technology' },
  INTC: { name: 'Intel Corp.', sector: 'Technology' },
  CRM: { name: 'Salesforce Inc.', sector: 'Technology' },
  ORCL: { name: 'Oracle Corp.', sector: 'Technology' },
  CSCO: { name: 'Cisco Systems', sector: 'Technology' },
  ADBE: { name: 'Adobe Inc.', sector: 'Technology' },
  PYPL: { name: 'PayPal Holdings', sector: 'Financial' },
  NFLX: { name: 'Netflix Inc.', sector: 'Entertainment' },
  UBER: { name: 'Uber Technologies', sector: 'Technology' },
  LYFT: { name: 'Lyft Inc.', sector: 'Technology' },
  SQ: { name: 'Block Inc.', sector: 'Financial' },
  SHOP: { name: 'Shopify Inc.', sector: 'Technology' },
  SNAP: { name: 'Snap Inc.', sector: 'Technology' },
  TWTR: { name: 'Twitter Inc.', sector: 'Technology' },
  SPOT: { name: 'Spotify Technology', sector: 'Entertainment' },
  ZM: { name: 'Zoom Video', sector: 'Technology' },
  DOCU: { name: 'DocuSign Inc.', sector: 'Technology' },
  ROKU: { name: 'Roku Inc.', sector: 'Technology' },
  PINS: { name: 'Pinterest Inc.', sector: 'Technology' },
  COIN: { name: 'Coinbase Global', sector: 'Financial' },
  HOOD: { name: 'Robinhood Markets', sector: 'Financial' },
  PLTR: { name: 'Palantir Technologies', sector: 'Technology' },
  SNOW: { name: 'Snowflake Inc.', sector: 'Technology' },
  DDOG: { name: 'Datadog Inc.', sector: 'Technology' },
  NET: { name: 'Cloudflare Inc.', sector: 'Technology' },
  CRWD: { name: 'CrowdStrike Holdings', sector: 'Technology' },
  ZS: { name: 'Zscaler Inc.', sector: 'Technology' },
  OKTA: { name: 'Okta Inc.', sector: 'Technology' },
  MDB: { name: 'MongoDB Inc.', sector: 'Technology' },
  ABNB: { name: 'Airbnb Inc.', sector: 'Travel' },
  BA: { name: 'Boeing Co.', sector: 'Aerospace' },
  CAT: { name: 'Caterpillar Inc.', sector: 'Industrial' },
  CVX: { name: 'Chevron Corp.', sector: 'Energy' },
  XOM: { name: 'Exxon Mobil', sector: 'Energy' },
  KO: { name: 'Coca-Cola Co.', sector: 'Consumer' },
  PEP: { name: 'PepsiCo Inc.', sector: 'Consumer' },
  MCD: { name: 'McDonald\'s Corp.', sector: 'Consumer' },
  NKE: { name: 'Nike Inc.', sector: 'Consumer' },
  SBUX: { name: 'Starbucks Corp.', sector: 'Consumer' },
  HD: { name: 'Home Depot', sector: 'Retail' },
  LOW: { name: 'Lowe\'s Companies', sector: 'Retail' },
  TGT: { name: 'Target Corp.', sector: 'Retail' },
  COST: { name: 'Costco Wholesale', sector: 'Retail' },
  UNH: { name: 'UnitedHealth Group', sector: 'Healthcare' },
  PFE: { name: 'Pfizer Inc.', sector: 'Healthcare' },
  MRK: { name: 'Merck & Co.', sector: 'Healthcare' },
  ABBV: { name: 'AbbVie Inc.', sector: 'Healthcare' },
  LLY: { name: 'Eli Lilly & Co.', sector: 'Healthcare' },
  TMO: { name: 'Thermo Fisher Scientific', sector: 'Healthcare' },
  ABT: { name: 'Abbott Laboratories', sector: 'Healthcare' },
  BMY: { name: 'Bristol-Myers Squibb', sector: 'Healthcare' },
  GILD: { name: 'Gilead Sciences', sector: 'Healthcare' },
  AMGN: { name: 'Amgen Inc.', sector: 'Healthcare' },
  BIIB: { name: 'Biogen Inc.', sector: 'Healthcare' },
  REGN: { name: 'Regeneron Pharma', sector: 'Healthcare' },
  VRTX: { name: 'Vertex Pharmaceuticals', sector: 'Healthcare' },
  ISRG: { name: 'Intuitive Surgical', sector: 'Healthcare' },
  MRNA: { name: 'Moderna Inc.', sector: 'Healthcare' },
  BRK: { name: 'Berkshire Hathaway', sector: 'Financial' },
  BAC: { name: 'Bank of America', sector: 'Financial' },
  WFC: { name: 'Wells Fargo & Co.', sector: 'Financial' },
  C: { name: 'Citigroup Inc.', sector: 'Financial' },
  GS: { name: 'Goldman Sachs', sector: 'Financial' },
  MS: { name: 'Morgan Stanley', sector: 'Financial' },
  AXP: { name: 'American Express', sector: 'Financial' },
  MA: { name: 'Mastercard Inc.', sector: 'Financial' },
  BLK: { name: 'BlackRock Inc.', sector: 'Financial' },
  SCHW: { name: 'Charles Schwab', sector: 'Financial' },
  SPGI: { name: 'S&P Global Inc.', sector: 'Financial' },
  ICE: { name: 'Intercontinental Exchange', sector: 'Financial' },
  CME: { name: 'CME Group Inc.', sector: 'Financial' },
  T: { name: 'AT&T Inc.', sector: 'Telecom' },
  VZ: { name: 'Verizon Communications', sector: 'Telecom' },
  TMUS: { name: 'T-Mobile US', sector: 'Telecom' },
  GOLD: { name: 'Barrick Gold Corp.', sector: 'Mining' },
  NEM: { name: 'Newmont Corp.', sector: 'Mining' },
  FCX: { name: 'Freeport-McMoRan', sector: 'Mining' },
  F: { name: 'Ford Motor Co.', sector: 'Automotive' },
  GM: { name: 'General Motors', sector: 'Automotive' },
  RIVN: { name: 'Rivian Automotive', sector: 'Automotive' },
  LCID: { name: 'Lucid Group', sector: 'Automotive' },
  NIO: { name: 'NIO Inc.', sector: 'Automotive' },
  LI: { name: 'Li Auto Inc.', sector: 'Automotive' },
  XPEV: { name: 'XPeng Inc.', sector: 'Automotive' },
};

// Stock name mapping (for backward compatibility)
const stockNames = Object.fromEntries(
  Object.entries(stockDatabase).map(([symbol, data]) => [symbol, data.name])
);

// Fetch real-time stock quote from Finnhub
export async function fetchStockQuote(symbol) {
  const upperSymbol = symbol.toUpperCase();

  // Check cache first
  const cached = priceCache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${upperSymbol}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Finnhub returns: c (current), d (change), dp (change percent), h (high), l (low), o (open), pc (previous close)
    if (data && data.c && data.c > 0) {
      const stockData = {
        current: data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        name: stockNames[upperSymbol] || `${upperSymbol} Stock`,
        isLive: true
      };

      // Cache the result
      priceCache.set(upperSymbol, {
        data: stockData,
        timestamp: Date.now()
      });

      return stockData;
    }

    throw new Error('Invalid data received');
  } catch (error) {
    console.warn(`Failed to fetch live data for ${upperSymbol}, using mock data:`, error.message);
    // Fall back to mock data
    return getStockPrice(upperSymbol);
  }
}

// Fetch multiple stock quotes at once
export async function fetchMultipleQuotes(symbols) {
  const results = {};

  // Fetch all quotes in parallel with rate limiting
  const promises = symbols.map(async (symbol, index) => {
    // Add small delay to avoid rate limiting (Finnhub free tier: 60 calls/min)
    await new Promise(resolve => setTimeout(resolve, index * 100));
    const data = await fetchStockQuote(symbol);
    results[symbol.toUpperCase()] = data;
  });

  await Promise.all(promises);
  return results;
}

// Fetch company profile from Finnhub
export async function fetchCompanyProfile(symbol) {
  const upperSymbol = symbol.toUpperCase();

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/profile2?symbol=${upperSymbol}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      name: data.name || stockNames[upperSymbol] || upperSymbol,
      ticker: data.ticker,
      country: data.country,
      currency: data.currency,
      exchange: data.exchange,
      industry: data.finnhubIndustry,
      logo: data.logo,
      marketCap: data.marketCapitalization,
      weburl: data.weburl
    };
  } catch (error) {
    console.warn(`Failed to fetch profile for ${upperSymbol}:`, error.message);
    return {
      name: stockNames[upperSymbol] || `${upperSymbol} Stock`,
      ticker: upperSymbol
    };
  }
}

// Fetch market news from Finnhub
export async function fetchMarketNews(category = 'general') {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/news?category=${category}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.slice(0, 10).map(article => ({
      headline: article.headline,
      summary: article.summary,
      source: article.source,
      url: article.url,
      image: article.image,
      datetime: new Date(article.datetime * 1000)
    }));
  } catch (error) {
    console.warn('Failed to fetch market news:', error.message);
    return [];
  }
}

// Search stocks by symbol or name
export function searchStocks(query) {
  if (!query || query.length < 1) return [];

  const upperQuery = query.toUpperCase();
  const lowerQuery = query.toLowerCase();

  const results = Object.entries(stockDatabase)
    .filter(([symbol, data]) => {
      return symbol.includes(upperQuery) ||
             data.name.toLowerCase().includes(lowerQuery);
    })
    .map(([symbol, data]) => ({
      symbol,
      name: data.name,
      sector: data.sector
    }))
    .slice(0, 10); // Limit to 10 results

  return results;
}

// Fetch stock symbol suggestions from Finnhub
export async function fetchSymbolSearch(query) {
  if (!query || query.length < 1) return [];

  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(query)}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.result) {
      return data.result
        .filter(item => item.type === 'Common Stock')
        .slice(0, 10)
        .map(item => ({
          symbol: item.symbol,
          name: item.description,
          sector: stockDatabase[item.symbol]?.sector || 'Unknown'
        }));
    }

    return [];
  } catch (error) {
    console.warn('Failed to search symbols:', error.message);
    // Fall back to local search
    return searchStocks(query);
  }
}

// Fetch historical candle data (last 30 days)
export async function fetchHistoricalPrices(symbol, days = 30) {
  const upperSymbol = symbol.toUpperCase();

  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - (days * 24 * 60 * 60);

    const response = await fetch(
      `${FINNHUB_BASE_URL}/stock/candle?symbol=${upperSymbol}&resolution=D&from=${from}&to=${now}&token=${FINNHUB_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.s === 'ok' && data.c && data.c.length > 0) {
      // Transform candle data into array of price objects
      const prices = data.t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000),
        dateStr: new Date(timestamp * 1000).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));

      return {
        symbol: upperSymbol,
        name: stockNames[upperSymbol] || `${upperSymbol} Stock`,
        prices,
        currentPrice: prices[prices.length - 1]?.close || 0,
        highPrice: Math.max(...data.h),
        lowPrice: Math.min(...data.l),
        avgPrice: data.c.reduce((a, b) => a + b, 0) / data.c.length,
        isLive: true
      };
    }

    throw new Error('No candle data available');
  } catch (error) {
    console.warn(`Failed to fetch historical data for ${upperSymbol}:`, error.message);

    // Generate mock historical data
    return generateMockHistoricalPrices(upperSymbol, days);
  }
}

// Generate mock historical prices as fallback
function generateMockHistoricalPrices(symbol, days) {
  const basePrice = mockStockPrices[symbol]?.current || 100;
  const prices = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = (Math.random() - 0.5) * 0.04; // ±2% daily volatility
    const trend = (days - i) * 0.001; // Slight upward trend
    const price = basePrice * (0.95 + trend + volatility);

    prices.push({
      date,
      dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: price * (1 + (Math.random() - 0.5) * 0.01),
      high: price * (1 + Math.random() * 0.02),
      low: price * (1 - Math.random() * 0.02),
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }

  const closes = prices.map(p => p.close);

  return {
    symbol,
    name: stockNames[symbol] || `${symbol} Stock`,
    prices,
    currentPrice: prices[prices.length - 1]?.close || basePrice,
    highPrice: Math.max(...closes),
    lowPrice: Math.min(...closes),
    avgPrice: closes.reduce((a, b) => a + b, 0) / closes.length,
    isLive: false
  };
}

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

// Synchronous version for immediate UI rendering (uses cache/mock)
export function getStockPrice(symbol) {
  const upperSymbol = symbol.toUpperCase();

  // Check cache first
  const cached = priceCache.get(upperSymbol);
  if (cached) {
    return cached.data;
  }

  // Return mock data
  if (mockStockPrices[upperSymbol]) {
    return mockStockPrices[upperSymbol];
  }

  // Generate a random price for unknown stocks
  return {
    current: Math.round((50 + Math.random() * 200) * 100) / 100,
    change: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
    changePercent: Math.round((Math.random() - 0.5) * 5 * 100) / 100,
    name: `${upperSymbol} Stock`,
    isLive: false
  };
}

export function calculatePortfolioValue(portfolio) {
  return portfolio.reduce((total, stock) => {
    const price = getStockPrice(stock.symbol);
    return total + (price.current * stock.shares);
  }, 0);
}

// Async version that fetches live prices
export async function calculatePortfolioValueLive(portfolio) {
  let total = 0;

  for (const stock of portfolio) {
    const price = await fetchStockQuote(stock.symbol);
    total += price.current * stock.shares;
  }

  return total;
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

export function formatLargeNumber(value) {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return formatCurrency(value);
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

export const popularStocks = Object.keys(mockStockPrices);

export default mockStockPrices;
