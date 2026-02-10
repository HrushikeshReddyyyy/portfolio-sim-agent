# Portfolio Sim Agent

**AI-Powered Investment Portfolio Management Platform**

Track, analyze, and optimize your stock investments with artificial intelligence. Beautiful interactive charts, powerful timing insights, and strategic recommendations.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-gold?style=for-the-badge)](https://hrushikeshreddyyyy.github.io/portfolio-sim-agent/)
[![License](https://img.shields.io/badge/license-MIT-black)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Bundle Size](https://img.shields.io/badge/bundle-~60KB_gzipped-green)](#tech-stack)

---

## Live Demo

**[https://hrushikeshreddyyyy.github.io/portfolio-sim-agent/](https://hrushikeshreddyyyy.github.io/portfolio-sim-agent/)**

Try the app with sample data or add your own stocks to see:
- Interactive charts with gold hover effects
- AI-powered portfolio analysis
- Performance timing insights

---

## Features

### Portfolio Tracking
- Add stocks with symbol, shares, and purchase price
- Real-time gain/loss calculations
- Beautiful card-based visual display
- Quick-add buttons for popular stocks
- Stock search with autocomplete suggestions
- 30-day price history with mini chart
- **In Development**: Unlimited stocks support (currently limited)
- **In Development**: Portfolio value aggregation improvements

### Interactive Performance Chart
- 24 months of historical performance
- **Hover effect**: Bars turn GOLD when hovered
- Smooth tooltip follows your cursor
- Shows exact value and date
- Click any bar for details

### Performance Timing Insights
- **Best Month**: See when you gained the most
- **Worst Month**: See when you lost the most
- Monthly breakdown with color coding (green = profit, red = loss)
- Percentage and dollar amount changes

### AI Portfolio Analysis
- One-click portfolio analysis
- Diversification score (0-100)
- Risk level assessment
- Sector allocation breakdown
- Actionable recommendations
- 3 free analyses per month

### Market-Based Stock Recommendations (Premium)
- AI analyzes current market trends
- Suggests 3 stocks to buy
- Each pick includes reasoning
- One-click add to portfolio

### Real-Time Stock Data
- Finnhub API integration for live prices
- "LIVE" badge indicates real-time data
- Automatic fallback to mock data if API unavailable
- 60-second price caching to minimize API calls

---

## Tech Stack

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Custom CSS** - Brutalist design system
- **No external UI libraries** - Lightweight and fast

**Bundle Size**: ~60KB gzipped

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/HrushikeshReddyyyy/portfolio-sim-agent.git
cd portfolio-sim-agent

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to GitHub Pages

This project includes a GitHub Actions workflow for automatic deployment.

**Automatic Deployment (Recommended):**

1. Push your code to the `main` branch
2. Go to your repository Settings > Pages
3. Under "Build and deployment", select "GitHub Actions"
4. The workflow will automatically build and deploy on every push

**Manual Deployment:**

```bash
# Build the project
npm run build

# The dist/ folder can be deployed to any static hosting:
# - GitHub Pages
# - Netlify
# - Vercel
# - Any static file server
```

**Your live site will be available at:**
```
https://<username>.github.io/portfolio-sim-agent/
```

---

## Project Structure

```
portfolio-sim-agent/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar with portfolio value
│   │   ├── Header.css
│   │   ├── Portfolio.jsx       # Stock cards and add form
│   │   ├── Portfolio.css
│   │   ├── PerformanceChart.jsx    # Interactive 24-month chart
│   │   ├── PerformanceChart.css
│   │   ├── PerformanceInsights.jsx # Best/worst month insights
│   │   ├── PerformanceInsights.css
│   │   ├── AIAnalysis.jsx      # AI portfolio analysis
│   │   ├── AIAnalysis.css
│   │   ├── StockRecommendations.jsx # Market-based stock picks
│   │   └── StockRecommendations.css
│   ├── utils/
│   │   ├── stockData.js        # Stock prices and calculations
│   │   └── aiAnalysis.js       # AI analysis engine
│   ├── App.jsx                 # Main app component
│   ├── App.css                 # App and landing page styles
│   ├── index.css               # Global styles and design system
│   └── main.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Design System

Portfolio Sim Agent uses a **Brutalist Design** aesthetic:

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Primary, borders, text |
| White | `#ffffff` | Backgrounds, cards |
| Gold | `#ffd700` | Highlights, hover states, premium |
| Green | `#00cc00` | Positive values, gains |
| Red | `#ff0000` | Negative values, losses |

### Typography
- **Font**: Inter (with Arial Black fallback)
- **Weights**: 400, 600, 700, 900
- **Style**: Uppercase headers, tight letter-spacing

### Components
- **Borders**: 6px solid black (thick), 4px (medium), 2px (thin)
- **Shadows**: 8px offset brutal shadow on hover
- **Animations**: Slide-up, scale, color transitions

---

## Pricing Model

### Free Tier
- Unlimited portfolio tracking
- Full interactive chart access
- Performance timing insights
- 3 AI analyses per month

### Premium ($19/month)
- Everything in Free
- Unlimited AI analyses
- Market-based stock recommendations
- Advanced risk analysis
- Export reports (PDF)
- Priority support

---

## Screenshots

### Landing Page
Clean, bold hero section with feature highlights and pricing.

### Dashboard
Portfolio cards showing stocks with gain/loss, interactive chart, and insights.

### AI Analysis
Diversification score, risk assessment, sector breakdown, and recommendations.

---

## API Integration

### Currently Integrated
- **Stock Prices**: Finnhub API (real-time quotes, historical data, company profiles)

### Future Integrations (In Development)
- **AI Analysis**: OpenAI GPT-4 or Claude API for smarter recommendations
- **Payments**: Stripe or PayPal for Premium subscriptions
- **Auth**: Firebase Auth or Auth0 for user accounts
- **Portfolio Sync**: Cloud storage for multi-device access

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Design inspired by brutalist web design principles
- Stock data structure based on common brokerage APIs
- AI analysis patterns modeled after professional portfolio tools

---

**Built with React and passion for beautiful, functional design.**
