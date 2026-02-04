import React from 'react';
import './Header.css';

function Header({ currentView, setCurrentView, portfolioValue }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <h1 className="header-logo">
            <span className="logo-icon">📊</span>
            PORTFOLIO SIM
          </h1>
          <span className="header-tagline">AI-POWERED</span>
        </div>

        <nav className="header-nav">
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'analysis' ? 'active' : ''}`}
            onClick={() => setCurrentView('analysis')}
          >
            AI Analysis
          </button>
          <button
            className={`nav-btn ${currentView === 'recommendations' ? 'active' : ''}`}
            onClick={() => setCurrentView('recommendations')}
          >
            Recommendations
          </button>
        </nav>

        <div className="header-value">
          <span className="value-label">PORTFOLIO VALUE</span>
          <span className="value-amount">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(portfolioValue)}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;
