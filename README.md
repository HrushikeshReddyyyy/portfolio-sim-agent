# Portfolio Sim Agent

An AI-powered investment portfolio management platform built with React and Vite. Track your stocks, visualize performance, and get AI-driven insights to optimize your investment strategy.

![Portfolio Sim Agent](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.12-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Live Demo

Visit the live application: [https://hrushikeshreddyyyy.github.io/portfolio-sim-agent/](https://hrushikeshreddyyyy.github.io/portfolio-sim-agent/)

## Features

### Free Tier
- **Unlimited Stock Tracking** - Add and manage stocks in your portfolio
- **24-Month Performance Chart** - Interactive bar chart with hover tooltips
- **Gains/Losses Calculation** - Real-time portfolio value tracking
- **Performance Insights** - Best and worst performing months analysis
- **3 Free AI Analyses/Month** - Get AI-powered portfolio recommendations

### Premium Tier ($19/month)
- **Unlimited AI Analyses** - No restrictions on portfolio analysis
- **Market-Based Recommendations** - Stock suggestions based on current market trends
- **Advanced Risk Analysis** - Comprehensive risk assessment
- **Sector Allocation Breakdown** - Detailed sector distribution visualization
- **Diversification Scoring** - 0-100 score for portfolio health
- **Personalized Recommendations** - Actionable advice for portfolio optimization

## Tech Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.0.12
- **Styling**: Pure CSS with component-scoped styles
- **Deployment**: GitHub Pages with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HrushikeshReddyyyy/portfolio-sim-agent.git
cd portfolio-sim-agent
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
portfolio-sim-agent/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── public/
│   └── index.html              # Entry HTML file
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation header
│   │   ├── Header.css
│   │   ├── Portfolio.jsx       # Stock management interface
│   │   ├── Portfolio.css
│   │   ├── PerformanceChart.jsx    # 24-month visualization
│   │   ├── PerformanceChart.css
│   │   ├── PerformanceInsights.jsx # Best/worst month analysis
│   │   ├── PerformanceInsights.css
│   │   ├── AIAnalysis.jsx      # AI portfolio analysis
│   │   ├── AIAnalysis.css
│   │   ├── StockRecommendations.jsx # Market recommendations
│   │   └── StockRecommendations.css
│   ├── utils/
│   │   ├── stockData.js        # Stock prices & calculations
│   │   └── aiAnalysis.js       # AI analysis engine
│   ├── App.jsx                 # Main application component
│   ├── App.css
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── vite.config.js             # Vite configuration
├── package.json
└── README.md
```

## How It Works

### Portfolio Tracking
Add stocks to your portfolio by entering the stock symbol, number of shares, and purchase price. The app calculates real-time gains/losses based on current market prices.

### Performance Visualization
The 24-month performance chart shows your portfolio's historical value with:
- Green bars for positive monthly changes
- Red bars for negative monthly changes
- Hover tooltips showing exact values and percentage changes

### AI Analysis
The AI analysis engine evaluates your portfolio and provides:
- **Risk Level Assessment** - Low, Moderate, or High risk classification
- **Diversification Score** - 0-100 score based on sector distribution
- **Sector Breakdown** - Visual representation of portfolio allocation
- **Actionable Recommendations** - Specific advice for improvement

### Stock Recommendations
Get AI-powered stock recommendations based on current market trends:
- AI & Machine Learning
- Cloud Computing
- Electric Vehicles
- Digital Payments
- Healthcare Innovation

## Available Stocks

The platform supports 20 popular stocks:

| Symbol | Company |
|--------|---------|
| AAPL | Apple Inc. |
| MSFT | Microsoft Corporation |
| GOOGL | Alphabet Inc. |
| AMZN | Amazon.com Inc. |
| NVDA | NVIDIA Corporation |
| TSLA | Tesla Inc. |
| META | Meta Platforms Inc. |
| JPM | JPMorgan Chase & Co. |
| V | Visa Inc. |
| JNJ | Johnson & Johnson |
| WMT | Walmart Inc. |
| PG | Procter & Gamble Co. |
| MA | Mastercard Inc. |
| UNH | UnitedHealth Group Inc. |
| HD | The Home Depot Inc. |
| DIS | The Walt Disney Company |
| PYPL | PayPal Holdings Inc. |
| NFLX | Netflix Inc. |
| ADBE | Adobe Inc. |
| CRM | Salesforce Inc. |

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Every push to the `main` or `master` branch triggers a new deployment.

### Manual Deployment

To deploy manually:

1. Build the project:
```bash
npm run build
```

2. The `dist/` folder can be deployed to any static hosting service.

### GitHub Pages Setup

1. Go to your repository Settings
2. Navigate to Pages
3. Under "Build and deployment", select "GitHub Actions"
4. The workflow will automatically deploy on push

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev/)
- Bundled with [Vite](https://vitejs.dev/)
- Deployed on [GitHub Pages](https://pages.github.com/)

---

Made with React + Vite
