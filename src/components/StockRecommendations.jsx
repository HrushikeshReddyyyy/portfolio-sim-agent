import React, { useState } from 'react';
import { getStockRecommendations } from '../utils/aiAnalysis';
import { formatCurrency } from '../utils/stockData';
import './StockRecommendations.css';

function StockRecommendations({ portfolio, setPortfolio, isPremium }) {
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleGetRecommendations = async () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const result = await getStockRecommendations(portfolio);
      setRecommendations(result);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
    setIsLoading(false);
  };

  const handleAddToPortfolio = (stock) => {
    const newStock = {
      id: Date.now(),
      symbol: stock.symbol,
      shares: 10,
      purchasePrice: stock.price,
      addedAt: new Date().toISOString()
    };
    setPortfolio([...portfolio, newStock]);
  };

  const isInPortfolio = (symbol) => {
    return portfolio.some(s => s.symbol.toUpperCase() === symbol.toUpperCase());
  };

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <div>
          <h2 className="section-title">MARKET-BASED RECOMMENDATIONS</h2>
          <p className="recommendations-subtitle">
            AI-powered stock picks based on current market trends
          </p>
        </div>
        <button
          className={`btn ${isLoading ? 'btn-outline' : 'btn-gold'} btn-lg`}
          onClick={handleGetRecommendations}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              ANALYZING MARKET...
            </>
          ) : (
            '💎 GET RECOMMENDATIONS'
          )}
        </button>
      </div>

      {!isPremium && !recommendations && (
        <div className="premium-required card">
          <div className="premium-icon">🔒</div>
          <h3>PREMIUM FEATURE</h3>
          <p>Upgrade to Premium to unlock AI-powered stock recommendations based on current market trends and news.</p>
          <button className="btn btn-gold" onClick={() => setShowUpgradeModal(true)}>
            UNLOCK FOR $19/MONTH
          </button>
        </div>
      )}

      {recommendations && (
        <div className="recommendations-results animate-slide-up">
          <div className="trend-card card">
            <div className="trend-badge">📈 CURRENT MARKET TREND</div>
            <h3 className="trend-title">{recommendations.trend}</h3>
            <p className="trend-time">
              Updated: {new Date(recommendations.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="stock-recommendations">
            {recommendations.recommendations.map((stock, index) => (
              <div key={index} className="stock-rec-card card card-hover">
                <div className="stock-rec-header">
                  <div className="stock-rec-symbol">{stock.symbol}</div>
                  <div className="stock-rec-price">{formatCurrency(stock.price)}</div>
                </div>
                <div className="stock-rec-name">{stock.name}</div>
                <div className="stock-rec-reason">
                  <span className="reason-label">WHY BUY:</span>
                  <p>{stock.reason}</p>
                </div>
                <button
                  className={`btn ${isInPortfolio(stock.symbol) ? 'btn-outline' : 'btn-success'} add-stock-btn`}
                  onClick={() => handleAddToPortfolio(stock)}
                  disabled={isInPortfolio(stock.symbol)}
                >
                  {isInPortfolio(stock.symbol) ? '✓ IN PORTFOLIO' : '+ ADD TO PORTFOLIO'}
                </button>
              </div>
            ))}
          </div>

          <div className="disclaimer card">
            <p>
              <strong>⚠️ Disclaimer:</strong> These recommendations are for educational purposes only
              and should not be considered financial advice. Always do your own research before
              making investment decisions.
            </p>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUpgradeModal(false)}>✕</button>
            <div className="modal-icon">💎</div>
            <h2 className="modal-title">UPGRADE TO PREMIUM</h2>
            <p className="modal-subtitle">Get AI stock recommendations based on market trends!</p>

            <div className="premium-features">
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Market trend analysis
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                3 stock picks per request
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Detailed reasons for each pick
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                One-click add to portfolio
              </div>
              <div className="premium-feature">
                <span className="feature-check">✓</span>
                Unlimited AI analyses
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

export default StockRecommendations;
