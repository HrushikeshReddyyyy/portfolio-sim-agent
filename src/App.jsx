import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Portfolio from './components/Portfolio';
import PerformanceChart from './components/PerformanceChart';
import PerformanceInsights from './components/PerformanceInsights';
import AIAnalysis from './components/AIAnalysis';
import StockRecommendations from './components/StockRecommendations';
import { calculatePortfolioValue, generatePerformanceData } from './utils/stockData';
import './App.css';

// Sample portfolio data for demo
const SAMPLE_PORTFOLIO = [
  { id: 1, symbol: 'AAPL', shares: 25, purchasePrice: 150.00, addedAt: '2024-01-15' },
  { id: 2, symbol: 'MSFT', shares: 15, purchasePrice: 340.00, addedAt: '2024-02-20' },
  { id: 3, symbol: 'NVDA', shares: 10, purchasePrice: 450.00, addedAt: '2024-03-10' },
];

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [portfolio, setPortfolio] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Calculate portfolio value
  const portfolioValue = calculatePortfolioValue(portfolio);

  // Update performance data when portfolio changes
  useEffect(() => {
    if (portfolio.length > 0) {
      setPerformanceData(generatePerformanceData(portfolio));
    } else {
      setPerformanceData([]);
    }
  }, [portfolio]);

  const handleGetStarted = (useSample = false) => {
    if (useSample) {
      setPortfolio(SAMPLE_PORTFOLIO);
    }
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="app">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        portfolioValue={portfolioValue}
      />

      <main className="main-content">
        <div className="container">
          {currentView === 'dashboard' && (
            <>
              <Portfolio
                portfolio={portfolio}
                setPortfolio={setPortfolio}
              />

              <PerformanceChart
                performanceData={performanceData}
              />

              <PerformanceInsights
                performanceData={performanceData}
              />
            </>
          )}

          {currentView === 'analysis' && (
            <AIAnalysis
              portfolio={portfolio}
              performanceData={performanceData}
              analysisCount={analysisCount}
              setAnalysisCount={setAnalysisCount}
              isPremium={isPremium}
            />
          )}

          {currentView === 'recommendations' && (
            <StockRecommendations
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              isPremium={isPremium}
            />
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="footer-logo">📊 PORTFOLIO SIM AGENT</span>
              <span className="footer-tagline">AI-Powered Investment Tracking</span>
            </div>
            <div className="footer-links">
              <button
                className="footer-link"
                onClick={() => setIsPremium(!isPremium)}
              >
                {isPremium ? '⭐ Premium Active' : 'Try Premium'}
              </button>
              <span className="footer-divider">|</span>
              <span className="footer-copy">© 2024 Portfolio Sim Agent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Landing Page Component
function LandingPage({ onGetStarted }) {
  return (
    <div className="landing">
      <div className="landing-hero">
        <div className="container">
          <div className="hero-badge">AI-POWERED</div>
          <h1 className="hero-title">
            PORTFOLIO<br />
            <span className="hero-highlight">SIM AGENT</span>
          </h1>
          <p className="hero-subtitle">
            Track, analyze, and optimize your investments with artificial intelligence.
            Beautiful charts. Powerful insights. Simple pricing.
          </p>

          <div className="hero-cta">
            <button
              className="btn btn-gold btn-lg"
              onClick={() => onGetStarted(true)}
            >
              🚀 TRY WITH SAMPLE DATA
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onGetStarted(false)}
            >
              START FRESH
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">$19</span>
              <span className="stat-label">/month for Premium</span>
            </div>
            <div className="stat">
              <span className="stat-number">24</span>
              <span className="stat-label">Months of Data</span>
            </div>
            <div className="stat">
              <span className="stat-number">∞</span>
              <span className="stat-label">Stocks to Track</span>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-features">
        <div className="container">
          <h2 className="features-title">WHAT YOU GET</h2>

          <div className="features-grid">
            <div className="feature-card card card-hover">
              <div className="feature-icon">📊</div>
              <h3>Portfolio Tracking</h3>
              <p>Add unlimited stocks. See real-time gains and losses. Beautiful visual display.</p>
              <span className="feature-badge free">FREE</span>
            </div>

            <div className="feature-card card card-hover">
              <div className="feature-icon">📈</div>
              <h3>Interactive Charts</h3>
              <p>24 months of performance. Hover for GOLD highlights. Smooth animations.</p>
              <span className="feature-badge free">FREE</span>
            </div>

            <div className="feature-card card card-hover">
              <div className="feature-icon">🎯</div>
              <h3>Timing Insights</h3>
              <p>See your BEST and WORST months. Monthly breakdown with color coding.</p>
              <span className="feature-badge free">FREE</span>
            </div>

            <div className="feature-card card card-hover">
              <div className="feature-icon">🤖</div>
              <h3>AI Analysis</h3>
              <p>Get strategic recommendations. Diversification scores. Risk assessment.</p>
              <span className="feature-badge limited">3 FREE</span>
            </div>

            <div className="feature-card card card-hover">
              <div className="feature-icon">💎</div>
              <h3>Stock Picks</h3>
              <p>AI-powered recommendations based on market trends and current news.</p>
              <span className="feature-badge premium">PREMIUM</span>
            </div>

            <div className="feature-card card card-hover">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Under 75KB total. No bloat. No tracking. Just pure performance.</p>
              <span className="feature-badge free">FREE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="landing-pricing">
        <div className="container">
          <h2 className="pricing-title">SIMPLE PRICING</h2>

          <div className="pricing-cards">
            <div className="pricing-card card">
              <div className="pricing-name">FREE</div>
              <div className="pricing-price">
                <span className="price-currency">$</span>
                <span className="price-amount">0</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li>✓ Unlimited stock tracking</li>
                <li>✓ Interactive 24-month chart</li>
                <li>✓ Performance timing insights</li>
                <li>✓ 3 AI analyses per month</li>
                <li className="disabled">✗ Stock recommendations</li>
                <li className="disabled">✗ Advanced risk analysis</li>
              </ul>
              <button className="btn btn-outline btn-lg" onClick={() => onGetStarted(false)}>
                GET STARTED
              </button>
            </div>

            <div className="pricing-card card premium-card">
              <div className="pricing-popular">MOST POPULAR</div>
              <div className="pricing-name">PREMIUM</div>
              <div className="pricing-price">
                <span className="price-currency">$</span>
                <span className="price-amount">19</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li>✓ Everything in Free</li>
                <li>✓ Unlimited AI analyses</li>
                <li>✓ Market stock recommendations</li>
                <li>✓ Advanced risk analysis</li>
                <li>✓ Export reports (PDF)</li>
                <li>✓ Priority support</li>
              </ul>
              <button className="btn btn-gold btn-lg" onClick={() => onGetStarted(true)}>
                START FREE TRIAL
              </button>
            </div>
          </div>

          <p className="pricing-note">
            Compare to: Financial advisors ($500-5,000/mo) • Morningstar ($249/mo) • Bloomberg ($2,000/mo)
          </p>
        </div>
      </div>

      <div className="landing-cta">
        <div className="container">
          <h2>READY TO START?</h2>
          <p>Join thousands of investors who trust Portfolio Sim Agent</p>
          <button className="btn btn-gold btn-lg" onClick={() => onGetStarted(true)}>
            🚀 LAUNCH APP NOW
          </button>
        </div>
      </div>

      <footer className="landing-footer">
        <div className="container">
          <span>© 2024 Portfolio Sim Agent • AI-Powered Investment Tracking</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
