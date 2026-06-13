import { api } from '../services/api.js';
const { useState, useEffect, useRef } = React;

export default function CategoryBreakdownChart({ isLiveMode }) {
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
        const stats = await api.getCategoryStats();
        setData(stats);
      } catch (err) {
        setError(err.message || 'Error loading category statistics');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isLiveMode]);

  // Instantiate and update Chart.js Doughnut Chart
  useEffect(() => {
    if (loading || error || data.length === 0 || !canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    
    // Custom curated color palette for slices
    const backgroundColors = [
      'rgba(59, 130, 246, 0.75)',  // Blue
      'rgba(16, 185, 129, 0.75)',  // Emerald
      'rgba(245, 158, 11, 0.75)',  // Amber
      'rgba(244, 63, 94, 0.75)',   // Rose
      'rgba(139, 92, 246, 0.75)'   // Purple
    ];
    
    const borderColors = [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(244, 63, 94, 1)',
      'rgba(139, 92, 246, 1)'
    ];

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.category),
        datasets: [{
          data: data.map(d => d.totalCollected),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              padding: 15,
              font: {
                family: 'Inter',
                size: 11
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                let value = context.parsed || 0;
                
                // Calculate percentage
                let sum = context.dataset.data.reduce((a, b) => a + b, 0);
                let percentage = ((value / sum) * 100).toFixed(1);
                
                return ` ${label}: Rs. ${value.toLocaleString('en-US')} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

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
          React.createElement('i', { className: 'fa-solid fa-chart-pie' }),
          'Category Breakdown'
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
