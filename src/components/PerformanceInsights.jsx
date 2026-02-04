import React from 'react';
import { formatCurrency, getPerformanceInsights } from '../utils/stockData';
import './PerformanceInsights.css';

function PerformanceInsights({ performanceData }) {
  if (!performanceData || performanceData.length < 2) {
    return null;
  }

  const { best, worst } = getPerformanceInsights(performanceData);

  // Get monthly breakdown (last 12 months)
  const recentMonths = performanceData.slice(-12).reverse();

  return (
    <div className="insights-section">
      <h2 className="section-title">PERFORMANCE TIMING INSIGHTS</h2>

      <div className="insights-highlights">
        {best && (
          <div className="highlight-card card best">
            <div className="highlight-badge">🏆 BEST MONTH</div>
            <div className="highlight-date">{best.date}</div>
            <div className="highlight-change positive">
              +{best.changePercent.toFixed(2)}%
            </div>
            <div className="highlight-value">
              Portfolio reached {formatCurrency(best.value)}
            </div>
            <div className="highlight-amount positive">
              +{formatCurrency(best.change)}
            </div>
          </div>
        )}

        {worst && (
          <div className="highlight-card card worst">
            <div className="highlight-badge">📉 WORST MONTH</div>
            <div className="highlight-date">{worst.date}</div>
            <div className="highlight-change negative">
              {worst.changePercent.toFixed(2)}%
            </div>
            <div className="highlight-value">
              Portfolio dropped to {formatCurrency(worst.value)}
            </div>
            <div className="highlight-amount negative">
              {formatCurrency(worst.change)}
            </div>
          </div>
        )}
      </div>

      <div className="monthly-breakdown">
        <h3 className="breakdown-title">MONTHLY BREAKDOWN (LAST 12 MONTHS)</h3>
        <div className="breakdown-grid">
          {recentMonths.map((month, index) => {
            const isPositive = month.changePercent >= 0;
            return (
              <div
                key={index}
                className={`month-card card card-hover ${isPositive ? 'positive' : 'negative'}`}
              >
                <div className="month-date">{month.date}</div>
                <div className="month-value">{formatCurrency(month.value)}</div>
                {month.changePercent !== 0 && (
                  <div className={`month-change ${isPositive ? 'text-green' : 'text-red'}`}>
                    {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{month.changePercent.toFixed(2)}%
                  </div>
                )}
                {month.change !== 0 && (
                  <div className="month-amount">
                    {isPositive ? '+' : ''}{formatCurrency(month.change)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PerformanceInsights;
