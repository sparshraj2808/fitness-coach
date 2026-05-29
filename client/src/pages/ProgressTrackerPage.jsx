/* ProgressTrackerPage.jsx - Custom SVG-drawn premium telemetry analytics dashboard */
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

export default function ProgressTrackerPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null); // { chartType, index, x, y, value, label }

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await api.getTrackerHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Rendering Analytics Deck...</p>
      </div>
    );
  }

  // Define sizing constants for custom SVG graphics
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 30;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // --- CHART 1: Weight Progression SVG (Line Graph) ---
  const weights = history.map(h => h.weight || 70);
  const maxWeight = Math.max(...weights) + 2;
  const minWeight = Math.min(...weights) - 2;
  const weightRange = maxWeight - minWeight;

  const weightPoints = history.map((item, idx) => {
    const x = padding + (idx * (graphWidth / 6));
    const y = chartHeight - padding - (((item.weight || 70) - minWeight) / weightRange) * graphHeight;
    return { x, y, val: item.weight, label: item.label };
  });

  const weightPath = weightPoints.reduce((path, p, idx) => {
    return path + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '');

  // --- CHART 2: Calorie Balance SVG (Dual Bar Graph) ---
  const maxCal = Math.max(...history.map(h => Math.max(h.consumed, h.burned, 2000)));

  return (
    <div className="main-content">
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>📊 Core Biometric Telemetry</h1>
        <p style={styles.pageSubtitle}>Review 7-day linear logs for weight indexes, active exercise burns, and hydration levels.</p>
      </div>

      <div style={styles.chartsGrid}>
        {/* Weight Line Chart */}
        <div className="cyber-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>⚖️ Weight Progression Curve</h3>
          <p style={styles.chartSub}>Linear weight progression monitored over the last 7 calendar days</p>

          <div style={styles.svgContainer}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={styles.svg}>
              <defs>
                {/* Neon Cyan Glow Filter */}
                <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Gradient for Line Area fill */}
                <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--text-neon-cyan)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--text-neon-cyan)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * graphHeight;
                const gridVal = maxWeight - ratio * weightRange;
                return (
                  <g key={idx}>
                    <line 
                      x1={padding} 
                      y1={y} 
                      x2={chartWidth - padding} 
                      y2={y} 
                      stroke="rgba(255, 255, 255, 0.05)" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padding - 5} 
                      y={y + 3} 
                      fill="var(--text-muted)" 
                      fontSize="8" 
                      textAnchor="end"
                    >
                      {gridVal.toFixed(0)}kg
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area fill under line */}
              {weightPoints.length > 0 && (
                <path
                  d={`${weightPath} L ${weightPoints[weightPoints.length - 1].x} ${chartHeight - padding} L ${weightPoints[0].x} ${chartHeight - padding} Z`}
                  fill="url(#cyanAreaGrad)"
                />
              )}

              {/* Glowing Line */}
              <path
                d={weightPath}
                fill="none"
                stroke="var(--text-neon-cyan)"
                strokeWidth="3"
                filter="url(#cyanGlow)"
              />

              {/* Node points */}
              {weightPoints.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill="var(--bg-primary)"
                  stroke="var(--text-neon-cyan)"
                  strokeWidth="2.5"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredNode({ chartType: 'weight', index: idx, x: p.x, y: p.y - 12, value: `${p.val} kg`, label: p.label })}
                  onMouseLeave={() => setHoveredNode(null)}
                />
              ))}

              {/* X Axis Labels */}
              {weightPoints.map((p, idx) => (
                <text 
                  key={idx} 
                  x={p.x} 
                  y={chartHeight - padding + 15} 
                  fill="var(--text-muted)" 
                  fontSize="9" 
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              ))}
            </svg>
            
            {/* Tooltip Overlay */}
            {hoveredNode?.chartType === 'weight' && (
              <div style={{ ...styles.tooltip, left: `${(hoveredNode.x / chartWidth) * 100}%`, top: `${(hoveredNode.y / chartHeight) * 100}%` }}>
                {hoveredNode.label}: <strong>{hoveredNode.value}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Calories Bar Chart */}
        <div className="cyber-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🍳 Daily Calorie Balance</h3>
          <p style={styles.chartSub}>Comparison of intake calories consumed vs active calories burned</p>

          <div style={styles.svgContainer}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={styles.svg}>
              {/* Horizontal gridlines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = padding + ratio * graphHeight;
                const gridVal = maxCal - ratio * maxCal;
                return (
                  <g key={idx}>
                    <line 
                      x1={padding} 
                      y1={y} 
                      x2={chartWidth - padding} 
                      y2={y} 
                      stroke="rgba(255, 255, 255, 0.05)" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padding - 5} 
                      y={y + 3} 
                      fill="var(--text-muted)" 
                      fontSize="8" 
                      textAnchor="end"
                    >
                      {gridVal.toFixed(0)}
                    </text>
                  </g>
                );
              })}

              {/* Render Bars */}
              {history.map((item, idx) => {
                const colWidth = graphWidth / 7;
                const groupCenterX = padding + (idx * colWidth) + (colWidth / 2);
                
                // Consumed Bar (Cyan)
                const cHeight = (item.consumed / maxCal) * graphHeight;
                const cX = groupCenterX - 10;
                const cY = chartHeight - padding - cHeight;

                // Burned Bar (Green)
                const bHeight = (item.burned / maxCal) * graphHeight;
                const bX = groupCenterX + 2;
                const bY = chartHeight - padding - bHeight;

                return (
                  <g key={idx}>
                    {/* Consumed */}
                    <rect
                      x={cX}
                      y={cY}
                      width="8"
                      height={Math.max(2, cHeight)}
                      fill="var(--text-neon-cyan)"
                      rx="2"
                      style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                      onMouseEnter={() => setHoveredNode({ chartType: 'cal', index: idx, x: cX + 4, y: cY - 12, value: `🍳 Consumed: ${item.consumed} kcal`, label: item.label })}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    {/* Burned */}
                    <rect
                      x={bX}
                      y={bY}
                      width="8"
                      height={Math.max(2, bHeight)}
                      fill="var(--text-neon-lime)"
                      rx="2"
                      style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                      onMouseEnter={() => setHoveredNode({ chartType: 'cal', index: idx + 7, x: bX + 4, y: bY - 12, value: `🔥 Burned: ${item.burned} kcal`, label: item.label })}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                    
                    {/* X Axis label */}
                    <text 
                      x={groupCenterX} 
                      y={chartHeight - padding + 15} 
                      fill="var(--text-muted)" 
                      fontSize="9" 
                      textAnchor="middle"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Tooltip Overlay */}
            {hoveredNode?.chartType === 'cal' && (
              <div style={{ ...styles.tooltip, left: `${(hoveredNode.x / chartWidth) * 100}%`, top: `${(hoveredNode.y / chartHeight) * 100}%` }}>
                {hoveredNode.label}: <strong style={{fontSize: '0.7rem'}}>{hoveredNode.value}</strong>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: 'var(--text-neon-cyan)' }}></span>
              <span>Consumed (kcal)</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: 'var(--text-neon-lime)' }}></span>
              <span>Burned (kcal)</span>
            </div>
          </div>
        </div>

        {/* Hydration Bar Chart */}
        <div className="cyber-card" style={{ ...styles.chartCard, gridColumn: 'span 2' }}>
          <h3 style={styles.chartTitle}>💧 Weekly Hydration Intake</h3>
          <p style={styles.chartSub}>Overview of logged water fluid milliliters vs daily target (2.5L)</p>
          
          <div style={styles.waterHistoryDeck}>
            {history.map((item, idx) => {
              const target = 2500;
              const percent = Math.min(100, Math.round((item.water / target) * 100));
              return (
                <div key={idx} style={styles.waterDeckCol}>
                  <div style={styles.deckBarTrack}>
                    <div style={{ ...styles.deckBarFill, height: `${percent}%` }}></div>
                  </div>
                  <strong style={{ ...styles.deckBarVal, color: percent >= 100 ? 'var(--text-neon-cyan)' : 'var(--text-primary)' }}>
                    {item.water}ml
                  </strong>
                  <span style={styles.deckBarLabel}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid var(--bg-tertiary)',
    borderTopColor: 'var(--neon-blue)',
    borderRadius: 'var(--border-radius-full)',
    animation: 'rotate 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontFamily: 'Outfit, sans-serif',
    color: 'var(--text-secondary)',
  },
  pageHeader: {
    marginBottom: '2.5rem',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: '800',
  },
  pageSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '0.2rem',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem',
  },
  chartCard: {
    padding: '2rem',
    position: 'relative',
  },
  chartTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  chartSub: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  svgContainer: {
    position: 'relative',
    width: '100%',
  },
  svg: {
    width: '100%',
    height: 'auto',
    overflow: 'visible',
  },
  tooltip: {
    position: 'absolute',
    background: 'rgba(6, 10, 19, 0.95)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.35rem 0.65rem',
    fontSize: '0.75rem',
    pointerEvents: 'none',
    color: 'var(--text-primary)',
    transform: 'translate(-50%, -100%)',
    zIndex: 100,
    whiteSpace: 'nowrap',
    boxShadow: 'var(--glass-shadow)',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '1rem',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: 'var(--border-radius-full)',
  },
  waterHistoryDeck: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1rem',
    marginTop: '1.5rem',
    background: 'rgba(255,255,255,0.01)',
    padding: '1.5rem',
    borderRadius: 'var(--border-radius-lg)',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  waterDeckCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  deckBarTrack: {
    width: '32px',
    height: '140px',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--border-radius-md)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    border: '1px solid rgba(255,255,255,0.03)',
  },
  deckBarFill: {
    width: '100%',
    background: 'linear-gradient(180deg, var(--text-neon-cyan) 0%, rgba(0,80,255,0.8) 100%)',
    boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
    borderRadius: 'var(--border-radius-sm)',
    transition: 'height var(--transition-slow) ease-out',
  },
  deckBarVal: {
    fontSize: '0.8rem',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '700',
    marginTop: '0.5rem',
  },
  deckBarLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    marginTop: '0.15rem',
  }
};
