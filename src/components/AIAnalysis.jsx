import React, { useState } from 'react';
import { analyzePortfolio } from '../utils/aiAnalysis';
import { formatCurrency } from '../utils/stockData';
import './AIAnalysis.css';

function AIAnalysis({ portfolio, performanceData, analysisCount, setAnalysisCount, isPremium }) {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const FREE_LIMIT = 3;
  const remainingAnalyses = FREE_LIMIT - analysisCount;

  const handleAnalyze = async () => {
    if (!isPremium && analysisCount >= FREE_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzePortfolio(portfolio, performanceData);
      setAnalysis(result);
      if (!isPremium) {
        setAnalysisCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'diversification': return '🎯';
      case 'position': return '⚖️';
      case 'general': return '💡';
      case 'positive': return '✅';
      default: return '📌';
    }
  };

  return (
    <div className="analysis-section">
      <div className="analysis-header">
        <div>
          <h2 className="section-title">AI PORTFOLIO ANALYSIS</h2>
          {!isPremium && (
            <p className="analysis-limit">
              {remainingAnalyses > 0
                ? `${remainingAnalyses} free ${remainingAnalyses === 1 ? 'analysis' : 'analyses'} remaining`
                : 'Free analyses used up'
              }
            </p>
          )}
          {isPremium && (
            <p className="premium-badge">⭐ PREMIUM - Unlimited Analyses</p>
          )}
        </div>
        <button
          className={`btn ${isLoading ? 'btn-outline' : 'btn-gold'} btn-lg`}
          onClick={handleAnalyze}
          disabled={isLoading || portfolio.length === 0}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              ANALYZING...
            </>
          ) : (
            '🤖 ANALYZE MY PORTFOLIO'
          )}
        </button>
      </div>

      {portfolio.length === 0 && (
        <div className="analysis-empty card">
          <p>Add stocks to your portfolio to enable AI analysis.</p>
        </div>
      )}

      {analysis && (
        <div className="analysis-results animate-slide-up">
          <div className="analysis-summary card">
            <div className="summary-header">
              <h3>ANALYSIS SUMMARY</h3>
              <span className="analysis-date">
                Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}
              </span>
            </div>
            <div className="summary-content">
              {analysis.summary.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={i}>{line.replace(/\*\*/g, '')}</h4>;
                }
                if (line.startsWith('**')) {
                  const parts = line.split('**');
                  return (
                    <p key={i}>
                      <strong>{parts[1]}</strong>
                      {parts[2]}
                    </p>
                  );
                }
                return line ? <p key={i}>{line}</p> : <br key={i} />;
              })}
            </div>
          </div>

          <div className="analysis-metrics">
            <div className="metric-card card">
              <div className="metric-icon">🎯</div>
              <div className="metric-label">DIVERSIFICATION</div>
              <div className="metric-value">{analysis.diversificationScore}/100</div>
              <div className="metric-bar">
                <div
                  className="metric-fill"
                  style={{
                    width: `${analysis.diversificationScore}%`,
                    backgroundColor: analysis.diversificationScore >= 70
                      ? 'var(--color-green)'
                      : analysis.diversificationScore >= 40
                        ? 'var(--color-gold)'
                        : 'var(--color-red)'
                  }}
                ></div>
              </div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon">⚠️</div>
              <div className="metric-label">RISK LEVEL</div>
              <div className={`metric-value risk-${analysis.riskLevel.toLowerCase().replace(/[^a-z]/g, '')}`}>
                {analysis.riskLevel}
              </div>
            </div>

            <div className="metric-card card">
              <div className="metric-icon">💰</div>
              <div className="metric-label">TOTAL VALUE</div>
              <div className="metric-value">{formatCurrency(analysis.totalValue)}</div>
            </div>
          </div>

          {analysis.sectorBreakdown && Object.keys(analysis.sectorBreakdown).length > 0 && (
            <div className="sector-breakdown card">
              <h3>SECTOR ALLOCATION</h3>
              <div className="sector-bars">
                {Object.entries(analysis.sectorBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([sector, percent]) => (
                    <div key={sector} className="sector-item">
                      <div className="sector-header">
                        <span className="sector-name">{sector}</span>
                        <span className="sector-percent">{percent.toFixed(1)}%</span>
                      </div>
                      <div className="sector-bar">
                        <div
                          className="sector-fill"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="recommendations">
              <h3 className="recommendations-title">AI RECOMMENDATIONS</h3>
              <div className="recommendations-grid">
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`recommendation-card card ${getPriorityColor(rec.priority)}`}
                  >
                    <div className="rec-header">
                      <span className="rec-icon">{getTypeIcon(rec.type)}</span>
                      <span className={`rec-priority ${rec.priority}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="rec-title">{rec.title}</h4>
                    <p className="rec-description">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>✕</button>
            <div className="modal-icon">⭐</div>
            <h2 className="modal-title">UPGRADE TO PREMIUM</h2>
            <p className="modal-subtitle">Unlock unlimited AI analyses and more!</p>

            <div className="premium-features">
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Unlimited AI Portfolio Analyses
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Market-Based Stock Recommendations
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Advanced Risk Analysis
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Export Reports (PDF)
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Priority Support
              </div>
            </div>

            <div className="premium-price">
              <span className="price-amount">$19</span>
              <span className="price-period">/month</span>
            </div>

            <button className="btn btn-gold btn-lg upgrade-btn">
              UPGRADE NOW
            </button>

            <p className="modal-note">Cancel anytime. No commitments.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIAnalysis;
