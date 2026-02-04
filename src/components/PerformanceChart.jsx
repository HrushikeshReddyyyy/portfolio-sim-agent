import React, { useState, useRef } from 'react';
import { formatCurrency } from '../utils/stockData';
import './PerformanceChart.css';

function PerformanceChart({ performanceData, onMonthSelect }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);

  if (!performanceData || performanceData.length === 0) {
    return (
      <div className="chart-section">
        <h2 className="section-title">24-MONTH PERFORMANCE</h2>
        <div className="chart-empty card">
          <p>Add stocks to see your performance chart</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...performanceData.map(d => d.value));
  const minValue = Math.min(...performanceData.map(d => d.value));
  const range = maxValue - minValue;

  const handleMouseMove = (e, index) => {
    const chartRect = chartRef.current?.getBoundingClientRect();
    if (chartRect) {
      setTooltipPosition({
        x: e.clientX - chartRect.left,
        y: e.clientY - chartRect.top - 10
      });
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleBarClick = (month) => {
    if (onMonthSelect) {
      onMonthSelect(month);
    }
  };

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h2 className="section-title">24-MONTH PERFORMANCE</h2>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-color legend-positive"></span>
            Gain
          </span>
          <span className="legend-item">
            <span className="legend-color legend-negative"></span>
            Loss
          </span>
          <span className="legend-item">
            <span className="legend-color legend-hover"></span>
            Hover
          </span>
        </div>
      </div>

      <div className="chart-container card" ref={chartRef}>
        <div className="chart-y-axis">
          <span className="y-label">{formatCurrency(maxValue)}</span>
          <span className="y-label">{formatCurrency((maxValue + minValue) / 2)}</span>
          <span className="y-label">{formatCurrency(minValue)}</span>
        </div>

        <div className="chart-bars">
          {performanceData.map((month, index) => {
            const height = range > 0
              ? ((month.value - minValue) / range) * 100
              : 50;
            const isPositive = month.changePercent >= 0;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className={`chart-bar-wrapper ${isHovered ? 'hovered' : ''}`}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleBarClick(month)}
              >
                <div
                  className={`chart-bar ${isHovered ? 'bar-gold' : isPositive ? 'bar-positive' : 'bar-negative'}`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                  <div className="bar-glow"></div>
                </div>
                <span className="bar-label">{month.date.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>

        {hoveredIndex !== null && performanceData[hoveredIndex] && (
          <div
            className="chart-tooltip animate-slide-up"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`
            }}
          >
            <div className="tooltip-date">{performanceData[hoveredIndex].date}</div>
            <div className="tooltip-value">
              {formatCurrency(performanceData[hoveredIndex].value)}
            </div>
            {performanceData[hoveredIndex].changePercent !== 0 && (
              <div className={`tooltip-change ${performanceData[hoveredIndex].changePercent >= 0 ? 'positive' : 'negative'}`}>
                {performanceData[hoveredIndex].changePercent >= 0 ? '+' : ''}
                {performanceData[hoveredIndex].changePercent.toFixed(2)}%
              </div>
            )}
          </div>
        )}
      </div>

      <div className="chart-stats">
        <div className="stat-card card">
          <span className="stat-label">HIGHEST VALUE</span>
          <span className="stat-value">{formatCurrency(maxValue)}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">LOWEST VALUE</span>
          <span className="stat-value">{formatCurrency(minValue)}</span>
        </div>
        <div className="stat-card card">
          <span className="stat-label">CURRENT VALUE</span>
          <span className="stat-value">
            {formatCurrency(performanceData[performanceData.length - 1]?.value || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;
