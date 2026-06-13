import { api } from '../services/api.js';
const { useState, useEffect, useRef } = React;

export default function DistrictStatsChart({ isLiveMode }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const stats = await api.getDistrictStats();
        setData(stats);
      } catch (err) {
        setError(err.message || 'Error loading district statistics');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isLiveMode]);

  // Handle Chart.js instantiation and updates
  useEffect(() => {
    if (loading || error || data.length === 0 || !canvasRef.current) return;

    // Destroy previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Gradient styling for the bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.85)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.15)');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.district),
        datasets: [{
          label: 'Revenue Collected (Rs.)',
          data: data.map(d => d.totalCollected),
          backgroundColor: gradient,
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: 'rgba(59, 130, 246, 0.95)',
          hoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                let value = context.parsed.y;
                return `Rs. ${value.toLocaleString('en-US')}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter',
                size: 11
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
              drawTicks: false
            },
            border: {
              dash: [4, 4]
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Inter',
                size: 11
              },
              callback: (value) => {
                if (value >= 1000) return `Rs. ${(value / 1000).toFixed(0)}k`;
                return `Rs. ${value}`;
              }
            }
          }
        }
      }
    });

    // Clean up chart on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, loading, error]);

  return (
    React.createElement('div', { className: 'chart-card glass-panel fade-in' },
      React.createElement('div', { className: 'chart-header' },
        React.createElement('h3', { className: 'chart-title' },
          React.createElement('i', { className: 'fa-solid fa-map-location-dot' }),
          'Collections by District'
        )
      ),
      React.createElement('div', { className: 'chart-wrapper' },
        loading && React.createElement('div', { className: 'loader-spinner' }),
        error && React.createElement('p', { style: { color: 'var(--accent-rose)' } }, error),
        !loading && !error && React.createElement('canvas', { ref: canvasRef })
      )
    )
  );
}
