// AI Analysis Engine for Portfolio Sim Agent
// In production, this would connect to a real AI API

import { getStockPrice, formatCurrency, formatPercent } from './stockData';

// Simulate AI analysis delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Stock sector classifications
const stockSectors = {
  AAPL: 'Technology',
  GOOGL: 'Technology',
  MSFT: 'Technology',
  AMZN: 'Consumer Discretionary',
  TSLA: 'Consumer Discretionary',
  NVDA: 'Technology',
  META: 'Technology',
  JPM: 'Financial',
  V: 'Financial',
  JNJ: 'Healthcare',
  WMT: 'Consumer Staples',
  PG: 'Consumer Staples',
  DIS: 'Communication Services',
  NFLX: 'Communication Services',
  AMD: 'Technology',
  INTC: 'Technology',
  CRM: 'Technology',
  ORCL: 'Technology',
  CSCO: 'Technology',
  ADBE: 'Technology',
};

// Analyze portfolio diversification
function analyzeDiversification(portfolio) {
  const sectorAllocation = {};
  let totalValue = 0;

  portfolio.forEach(stock => {
    const price = getStockPrice(stock.symbol).current;
    const value = price * stock.shares;
    const sector = stockSectors[stock.symbol.toUpperCase()] || 'Other';

    sectorAllocation[sector] = (sectorAllocation[sector] || 0) + value;
    totalValue += value;
  });

  // Convert to percentages
  const sectorPercentages = {};
  Object.keys(sectorAllocation).forEach(sector => {
    sectorPercentages[sector] = (sectorAllocation[sector] / totalValue) * 100;
  });

  return { sectorAllocation, sectorPercentages, totalValue };
}

// Generate AI portfolio analysis
export async function analyzePortfolio(portfolio, performanceData) {
  // Simulate AI processing time
  await delay(1500 + Math.random() * 1000);

  if (!portfolio || portfolio.length === 0) {
    return {
      summary: "No stocks in portfolio to analyze.",
      recommendations: [],
      riskLevel: 'N/A',
      diversificationScore: 0
    };
  }

  const { sectorPercentages, totalValue } = analyzeDiversification(portfolio);
  const sectors = Object.keys(sectorPercentages);

  // Calculate diversification score (0-100)
  // More sectors = better diversification
  // More even distribution = better diversification
  const sectorCount = sectors.length;
  const idealPerSector = 100 / Math.max(sectorCount, 5);
  const deviationSum = sectors.reduce((sum, sector) => {
    return sum + Math.abs(sectorPercentages[sector] - idealPerSector);
  }, 0);
  const diversificationScore = Math.max(0, Math.min(100, 100 - deviationSum / 2 + sectorCount * 5));

  // Determine risk level
  let riskLevel = 'Moderate';
  const techWeight = sectorPercentages['Technology'] || 0;
  if (techWeight > 60) riskLevel = 'High';
  else if (techWeight > 40) riskLevel = 'Moderate-High';
  else if (sectorCount >= 4) riskLevel = 'Moderate-Low';
  else if (sectorCount >= 5) riskLevel = 'Low';

  // Generate performance insights
  let performanceInsight = '';
  if (performanceData && performanceData.length > 1) {
    const recentMonths = performanceData.slice(-6);
    const positiveMonths = recentMonths.filter(m => m.changePercent > 0).length;

    if (positiveMonths >= 5) {
      performanceInsight = 'Your portfolio has shown strong momentum with 5+ positive months recently.';
    } else if (positiveMonths >= 3) {
      performanceInsight = 'Your portfolio has shown steady performance with mixed results over the past 6 months.';
    } else {
      performanceInsight = 'Your portfolio has faced headwinds recently. Consider reviewing underperformers.';
    }
  }

  // Generate recommendations
  const recommendations = [];

  // Diversification recommendations
  if (techWeight > 50) {
    recommendations.push({
      type: 'diversification',
      priority: 'high',
      title: 'High Tech Concentration',
      description: `${techWeight.toFixed(1)}% of your portfolio is in Technology. Consider diversifying into Healthcare, Consumer Staples, or Financials to reduce sector-specific risk.`
    });
  }

  if (sectorCount < 3) {
    recommendations.push({
      type: 'diversification',
      priority: 'high',
      title: 'Limited Sector Exposure',
      description: `You're invested in only ${sectorCount} sector(s). Aim for at least 4-5 sectors for better risk management.`
    });
  }

  // Position sizing recommendations
  portfolio.forEach(stock => {
    const price = getStockPrice(stock.symbol).current;
    const value = price * stock.shares;
    const weight = (value / totalValue) * 100;

    if (weight > 30) {
      recommendations.push({
        type: 'position',
        priority: 'medium',
        title: `Large Position in ${stock.symbol}`,
        description: `${stock.symbol} represents ${weight.toFixed(1)}% of your portfolio. Consider trimming to below 20% to reduce single-stock risk.`
      });
    }
  });

  // General advice
  if (portfolio.length < 5) {
    recommendations.push({
      type: 'general',
      priority: 'medium',
      title: 'Build Your Portfolio',
      description: `With only ${portfolio.length} stock(s), your portfolio is quite concentrated. Consider adding 5-10 more positions across different sectors.`
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'positive',
      priority: 'low',
      title: 'Well-Balanced Portfolio',
      description: 'Your portfolio shows good diversification and reasonable position sizing. Continue monitoring and rebalancing quarterly.'
    });
  }

  // Generate summary
  const summary = generateSummary(portfolio, sectorPercentages, riskLevel, diversificationScore, performanceInsight);

  return {
    summary,
    recommendations,
    riskLevel,
    diversificationScore: Math.round(diversificationScore),
    sectorBreakdown: sectorPercentages,
    totalValue,
    analyzedAt: new Date().toISOString()
  };
}

function generateSummary(portfolio, sectorPercentages, riskLevel, score, performanceInsight) {
  const stockCount = portfolio.length;
  const sectorCount = Object.keys(sectorPercentages).length;
  const topSector = Object.entries(sectorPercentages)
    .sort((a, b) => b[1] - a[1])[0];

  let summary = `**Portfolio Overview**\n\n`;
  summary += `Your portfolio contains ${stockCount} stock${stockCount !== 1 ? 's' : ''} across ${sectorCount} sector${sectorCount !== 1 ? 's' : ''}. `;
  summary += `The largest allocation is ${topSector[0]} at ${topSector[1].toFixed(1)}%.\n\n`;

  summary += `**Risk Assessment:** ${riskLevel}\n`;
  summary += `**Diversification Score:** ${Math.round(score)}/100\n\n`;

  if (performanceInsight) {
    summary += `**Performance:** ${performanceInsight}\n\n`;
  }

  if (score < 50) {
    summary += `Your diversification score indicates room for improvement. Consider spreading investments across more sectors.`;
  } else if (score < 75) {
    summary += `Your portfolio has decent diversification but could benefit from more balance between sectors.`;
  } else {
    summary += `Your portfolio is well-diversified. Maintain this balance while monitoring individual positions.`;
  }

  return summary;
}

// Market news-based stock recommendations
const marketTrends = [
  {
    trend: 'AI & Machine Learning Boom',
    stocks: [
      { symbol: 'NVDA', reason: 'Leading GPU manufacturer powering AI infrastructure' },
      { symbol: 'MSFT', reason: 'Major AI investments through OpenAI partnership' },
      { symbol: 'GOOGL', reason: 'Developing advanced AI models and cloud AI services' }
    ]
  },
  {
    trend: 'Cloud Computing Growth',
    stocks: [
      { symbol: 'AMZN', reason: 'AWS dominates cloud infrastructure market' },
      { symbol: 'MSFT', reason: 'Azure growing rapidly in enterprise market' },
      { symbol: 'CRM', reason: 'Leading cloud-based enterprise software' }
    ]
  },
  {
    trend: 'Electric Vehicle Revolution',
    stocks: [
      { symbol: 'TSLA', reason: 'Market leader in EVs with expanding production' },
      { symbol: 'NVDA', reason: 'Automotive AI chips for autonomous driving' },
      { symbol: 'AAPL', reason: 'Rumored EV project and CarPlay expansion' }
    ]
  },
  {
    trend: 'Digital Payments Expansion',
    stocks: [
      { symbol: 'V', reason: 'Global payments leader benefiting from cashless trend' },
      { symbol: 'JPM', reason: 'Major fintech investments and digital banking' },
      { symbol: 'AAPL', reason: 'Apple Pay growth and financial services expansion' }
    ]
  },
  {
    trend: 'Healthcare Innovation',
    stocks: [
      { symbol: 'JNJ', reason: 'Diversified healthcare leader with strong pipeline' },
      { symbol: 'GOOGL', reason: 'Healthcare AI and Verily life sciences' },
      { symbol: 'AMZN', reason: 'Amazon Pharmacy and One Medical expansion' }
    ]
  }
];

export async function getStockRecommendations(existingPortfolio = []) {
  await delay(1000 + Math.random() * 500);

  // Select a random market trend
  const trendIndex = Math.floor(Math.random() * marketTrends.length);
  const selectedTrend = marketTrends[trendIndex];

  // Filter out stocks already in portfolio
  const existingSymbols = existingPortfolio.map(s => s.symbol.toUpperCase());
  const newRecommendations = selectedTrend.stocks
    .filter(s => !existingSymbols.includes(s.symbol))
    .slice(0, 3);

  // If all stocks from trend are owned, pick from another trend
  if (newRecommendations.length === 0) {
    for (const trend of marketTrends) {
      const available = trend.stocks.filter(s => !existingSymbols.includes(s.symbol));
      if (available.length > 0) {
        return {
          trend: trend.trend,
          recommendations: available.slice(0, 3).map(stock => ({
            ...stock,
            price: getStockPrice(stock.symbol).current,
            name: getStockPrice(stock.symbol).name
          })),
          generatedAt: new Date().toISOString()
        };
      }
    }
  }

  return {
    trend: selectedTrend.trend,
    recommendations: newRecommendations.map(stock => ({
      ...stock,
      price: getStockPrice(stock.symbol).current,
      name: getStockPrice(stock.symbol).name
    })),
    generatedAt: new Date().toISOString()
  };
}
