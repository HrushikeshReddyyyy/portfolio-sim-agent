import React, { useState } from 'react';
import { getStockPrice, formatCurrency, popularStocks } from '../utils/stockData';
import './Portfolio.css';

function Portfolio({ portfolio, setPortfolio }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');

  const handleAddStock = (e) => {
    e.preventDefault();
    setError('');

    const upperSymbol = symbol.toUpperCase().trim();

    if (!upperSymbol || !shares || !purchasePrice) {
      setError('Please fill in all fields');
      return;
    }

    if (portfolio.some(s => s.symbol.toUpperCase() === upperSymbol)) {
      setError('Stock already in portfolio');
      return;
    }

    const sharesNum = parseFloat(shares);
    const priceNum = parseFloat(purchasePrice);

    if (isNaN(sharesNum) || sharesNum <= 0) {
      setError('Invalid number of shares');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Invalid purchase price');
      return;
    }

    const newStock = {
      id: Date.now(),
      symbol: upperSymbol,
      shares: sharesNum,
      purchasePrice: priceNum,
      addedAt: new Date().toISOString()
    };

    setPortfolio([...portfolio, newStock]);
    setSymbol('');
    setShares('');
    setPurchasePrice('');
    setShowAddForm(false);
  };

  const handleRemoveStock = (id) => {
    setPortfolio(portfolio.filter(s => s.id !== id));
  };

  const handleQuickAdd = (stockSymbol) => {
    const price = getStockPrice(stockSymbol);
    setSymbol(stockSymbol);
    setPurchasePrice(price.current.toString());
    setShares('10');
    setShowAddForm(true);
  };

  return (
    <div className="portfolio-section">
      <div className="portfolio-header">
        <h2 className="section-title">YOUR PORTFOLIO</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ CANCEL' : '+ ADD STOCK'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-stock-form card animate-slide-up">
          <h3 className="form-title">ADD NEW STOCK</h3>
          <form onSubmit={handleAddStock}>
            <div className="form-grid">
              <div className="form-group">
                <label className="label">Stock Symbol</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  maxLength={5}
                />
              </div>
              <div className="form-group">
                <label className="label">Shares</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 10"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="label">Purchase Price ($)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="e.g., 150.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                ADD TO PORTFOLIO
              </button>
            </div>
          </form>

          <div className="quick-add">
            <p className="quick-add-label">QUICK ADD:</p>
            <div className="quick-add-buttons">
              {popularStocks.slice(0, 8).map(stock => (
                <button
                  key={stock}
                  className="btn btn-outline btn-sm"
                  onClick={() => handleQuickAdd(stock)}
                >
                  {stock}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {portfolio.length === 0 ? (
        <div className="portfolio-empty card">
          <div className="empty-icon">📈</div>
          <h3>No Stocks Yet</h3>
          <p>Add your first stock to start tracking your portfolio performance.</p>
          <button
            className="btn btn-gold"
            onClick={() => setShowAddForm(true)}
          >
            + ADD YOUR FIRST STOCK
          </button>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolio.map(stock => {
            const stockInfo = getStockPrice(stock.symbol);
            const currentValue = stockInfo.current * stock.shares;
            const costBasis = stock.purchasePrice * stock.shares;
            const gainLoss = currentValue - costBasis;
            const gainLossPercent = ((currentValue - costBasis) / costBasis) * 100;
            const isPositive = gainLoss >= 0;

            return (
              <div key={stock.id} className="stock-card card card-hover">
                <div className="stock-header">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveStock(stock.id)}
                    title="Remove stock"
                  >
                    ✕
                  </button>
                </div>
                <div className="stock-name">{stockInfo.name}</div>

                <div className="stock-details">
                  <div className="stock-row">
                    <span className="stock-label">Shares</span>
                    <span className="stock-value">{stock.shares}</span>
                  </div>
                  <div className="stock-row">
                    <span className="stock-label">Cost Basis</span>
                    <span className="stock-value">{formatCurrency(stock.purchasePrice)}</span>
                  </div>
                  <div className="stock-row">
                    <span className="stock-label">Current Price</span>
                    <span className="stock-value">{formatCurrency(stockInfo.current)}</span>
                  </div>
                </div>

                <div className="stock-footer">
                  <div className="stock-value-display">
                    <span className="value-current">{formatCurrency(currentValue)}</span>
                  </div>
                  <div className={`stock-gain-loss ${isPositive ? 'positive' : 'negative'}`}>
                    <span className="gain-loss-amount">
                      {isPositive ? '+' : ''}{formatCurrency(gainLoss)}
                    </span>
                    <span className="gain-loss-percent">
                      ({isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Portfolio;
