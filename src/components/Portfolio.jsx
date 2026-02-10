import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getStockPrice,
  fetchStockQuote,
  fetchHistoricalPrices,
  searchStocks,
  formatCurrency,
  popularStocks
} from '../utils/stockData';
import './Portfolio.css';

// Debounce hook for search optimization
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function Portfolio({ portfolio, setPortfolio }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [error, setError] = useState('');
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(false);

  // New states for search and history
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchRef = useRef(null);
  const debouncedSymbol = useDebounce(symbol, 200); // 200ms debounce for search

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch live prices when portfolio changes - PARALLEL fetching
  useEffect(() => {
    if (portfolio.length === 0) return;

    let isMounted = true;

    const fetchLivePrices = async () => {
      setLoading(true);

      try {
        // Fetch all prices in PARALLEL instead of sequential
        const promises = portfolio.map(async (stock) => {
          try {
            const data = await fetchStockQuote(stock.symbol);
            return { symbol: stock.symbol.toUpperCase(), data };
          } catch (err) {
            console.warn(`Failed to fetch ${stock.symbol}:`, err);
            return { symbol: stock.symbol.toUpperCase(), data: getStockPrice(stock.symbol) };
          }
        });

        const results = await Promise.all(promises);

        if (isMounted) {
          const prices = {};
          results.forEach(({ symbol, data }) => {
            prices[symbol] = data;
          });
          setLivePrices(prices);
        }
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLivePrices();

    const interval = setInterval(fetchLivePrices, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [portfolio.length]);

  // Search stocks when debounced symbol changes (prevents lag)
  useEffect(() => {
    if (debouncedSymbol.length >= 1) {
      const results = searchStocks(debouncedSymbol);
      setSearchResults(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [debouncedSymbol]);

  // Handle stock selection from suggestions - memoized for performance
  const handleSelectStock = useCallback(async (stock) => {
    if (loadingHistory) return; // Prevent double-clicks

    setSymbol(stock.symbol);
    setSelectedStock(stock);
    setShowSuggestions(false);
    setLoadingHistory(true);
    setPriceHistory(null);

    try {
      const history = await fetchHistoricalPrices(stock.symbol, 30);
      setPriceHistory(history);

      // Auto-fill with current price
      if (history.currentPrice) {
        setPurchasePrice(history.currentPrice.toFixed(2));
      }
    } catch (err) {
      console.error('Failed to fetch price history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [loadingHistory]);

  // Handle clicking on a historical price - memoized
  const handleSelectPrice = useCallback((price) => {
    setPurchasePrice(price.close.toFixed(2));
  }, []);

  const handleAddStock = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return; // Prevent double submission

    setError('');
    setIsSubmitting(true);

    const upperSymbol = symbol.toUpperCase().trim();

    if (!upperSymbol || !shares || !purchasePrice) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (portfolio.some(s => s.symbol.toUpperCase() === upperSymbol)) {
      setError('Stock already in portfolio');
      setIsSubmitting(false);
      return;
    }

    const sharesNum = parseFloat(shares);
    const priceNum = parseFloat(purchasePrice);

    if (isNaN(sharesNum) || sharesNum <= 0) {
      setError('Invalid number of shares');
      setIsSubmitting(false);
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Invalid purchase price');
      setIsSubmitting(false);
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
    setSelectedStock(null);
    setPriceHistory(null);
    setIsSubmitting(false);

    // Fetch live price in background (non-blocking)
    fetchStockQuote(upperSymbol)
      .then(data => {
        setLivePrices(prev => ({ ...prev, [upperSymbol]: data }));
      })
      .catch(err => {
        console.warn(`Failed to fetch ${upperSymbol}:`, err);
      });
  }, [symbol, shares, purchasePrice, portfolio, setPortfolio, isSubmitting]);

  const handleRemoveStock = useCallback((id) => {
    setPortfolio(prev => prev.filter(s => s.id !== id));
  }, [setPortfolio]);

  const handleQuickAdd = useCallback(async (stockSymbol) => {
    if (loadingHistory) return; // Prevent double-clicks

    setSymbol(stockSymbol);
    setShowSuggestions(false);
    setLoadingHistory(true);
    setShowAddForm(true);

    try {
      const [history, quote] = await Promise.all([
        fetchHistoricalPrices(stockSymbol, 30),
        fetchStockQuote(stockSymbol)
      ]);

      setPriceHistory(history);
      setSelectedStock({ symbol: stockSymbol, name: quote.name });
      setPurchasePrice(quote.current.toFixed(2));
      setShares('10');
    } catch (err) {
      const price = getStockPrice(stockSymbol);
      setPurchasePrice(price.current.toString());
      setShares('10');
    } finally {
      setLoadingHistory(false);
    }
  }, [loadingHistory]);

  // Memoized price getter
  const getPrice = useCallback((symbol) => {
    const upperSymbol = symbol.toUpperCase();
    return livePrices[upperSymbol] || getStockPrice(symbol);
  }, [livePrices]);

  const handleCancelForm = useCallback(() => {
    setShowAddForm(false);
    setSymbol('');
    setShares('');
    setPurchasePrice('');
    setSelectedStock(null);
    setPriceHistory(null);
    setError('');
    setIsSubmitting(false);
  }, []);

  return (
    <div className="portfolio-section">
      <div className="portfolio-header">
        <div>
          <h2 className="section-title">YOUR PORTFOLIO</h2>
          {loading && <span className="loading-indicator">Fetching live prices...</span>}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => showAddForm ? handleCancelForm() : setShowAddForm(true)}
        >
          {showAddForm ? '✕ CANCEL' : '+ ADD STOCK'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-stock-form card animate-slide-up">
          <h3 className="form-title">ADD NEW STOCK</h3>
          <form onSubmit={handleAddStock}>
            <div className="form-grid">
              <div className="form-group" ref={searchRef}>
                <label className="label">Stock Symbol</label>
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="input"
                    placeholder="Search stocks (e.g., AAPL, Tesla)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    onFocus={() => symbol.length >= 1 && setShowSuggestions(searchResults.length > 0)}
                    autoComplete="off"
                  />
                  {showSuggestions && searchResults.length > 0 && (
                    <div className="search-suggestions">
                      {searchResults.map((stock) => (
                        <div
                          key={stock.symbol}
                          className="suggestion-item"
                          onClick={() => handleSelectStock(stock)}
                        >
                          <span className="suggestion-symbol">{stock.symbol}</span>
                          <span className="suggestion-name">{stock.name}</span>
                          <span className="suggestion-sector">{stock.sector}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

            {/* Price History Section */}
            {(loadingHistory || priceHistory) && (
              <div className="price-history-section">
                <h4 className="history-title">
                  {selectedStock ? `${selectedStock.symbol} - Last 30 Days` : 'Price History'}
                  {priceHistory?.isLive && <span className="live-badge">LIVE</span>}
                </h4>

                {loadingHistory ? (
                  <div className="history-loading">
                    <div className="spinner"></div>
                    <span>Loading price history...</span>
                  </div>
                ) : priceHistory && (
                  <>
                    {/* Price Stats */}
                    <div className="price-stats">
                      <div className="price-stat">
                        <span className="stat-label">Current</span>
                        <span className="stat-value">{formatCurrency(priceHistory.currentPrice)}</span>
                      </div>
                      <div className="price-stat">
                        <span className="stat-label">30D High</span>
                        <span className="stat-value text-green">{formatCurrency(priceHistory.highPrice)}</span>
                      </div>
                      <div className="price-stat">
                        <span className="stat-label">30D Low</span>
                        <span className="stat-value text-red">{formatCurrency(priceHistory.lowPrice)}</span>
                      </div>
                      <div className="price-stat">
                        <span className="stat-label">Avg</span>
                        <span className="stat-value">{formatCurrency(priceHistory.avgPrice)}</span>
                      </div>
                    </div>

                    {/* Mini Price Chart */}
                    <div className="mini-chart">
                      {priceHistory.prices.slice(-20).map((price, index) => {
                        const minPrice = priceHistory.lowPrice;
                        const maxPrice = priceHistory.highPrice;
                        const range = maxPrice - minPrice || 1;
                        const heightPercent = ((price.close - minPrice) / range) * 100;
                        const isSelected = purchasePrice === price.close.toFixed(2);

                        return (
                          <div
                            key={index}
                            className={`chart-bar-mini ${isSelected ? 'selected' : ''}`}
                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                            onClick={() => handleSelectPrice(price)}
                            title={`${price.dateStr}: ${formatCurrency(price.close)}`}
                          >
                            <div className="bar-tooltip">
                              <div>{price.dateStr}</div>
                              <div>{formatCurrency(price.close)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Price List */}
                    <div className="price-list">
                      <p className="price-list-hint">Click a date to select purchase price:</p>
                      <div className="price-grid">
                        {priceHistory.prices.slice(-10).reverse().map((price, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`price-item ${purchasePrice === price.close.toFixed(2) ? 'selected' : ''}`}
                            onClick={() => handleSelectPrice(price)}
                          >
                            <span className="price-date">{price.dateStr}</span>
                            <span className="price-value">{formatCurrency(price.close)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <div className="form-actions">
              <button
                type="submit"
                className={`btn btn-success ${isSubmitting ? 'btn-loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ADDING...' : 'ADD TO PORTFOLIO'}
              </button>
            </div>
          </form>

          <div className="quick-add">
            <p className="quick-add-label">QUICK ADD:</p>
            <div className="quick-add-buttons">
              {popularStocks.slice(0, 8).map(stock => (
                <button
                  key={stock}
                  type="button"
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
            const stockInfo = getPrice(stock.symbol);
            const currentValue = stockInfo.current * stock.shares;
            const costBasis = stock.purchasePrice * stock.shares;
            const gainLoss = currentValue - costBasis;
            const gainLossPercent = ((currentValue - costBasis) / costBasis) * 100;
            const isPositive = gainLoss >= 0;
            const dayChange = stockInfo.change || 0;
            const dayChangePercent = stockInfo.changePercent || 0;

            return (
              <div key={stock.id} className="stock-card card card-hover">
                <div className="stock-header">
                  <div className="stock-symbol">
                    {stock.symbol}
                    {stockInfo.isLive && <span className="live-badge">LIVE</span>}
                  </div>
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
                    <span className="stock-value">
                      {formatCurrency(stockInfo.current)}
                      {dayChange !== 0 && (
                        <span className={`day-change ${dayChange >= 0 ? 'positive' : 'negative'}`}>
                          {' '}({dayChange >= 0 ? '+' : ''}{dayChangePercent.toFixed(2)}%)
                        </span>
                      )}
                    </span>
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
