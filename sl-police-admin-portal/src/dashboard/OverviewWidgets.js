import { api } from '../services/api.js';
const { useState, useEffect } = React;

export default function OverviewWidgets({ isLiveMode }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getOverviewStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Error loading statistics');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [isLiveMode]);

  if (loading) {
    return (
      React.createElement('div', { className: 'metrics-grid' },
        [1, 2, 3].map(i => 
          React.createElement('div', { key: i, className: 'metric-card glass-panel', style: { height: '110px' } },
            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' } },
              React.createElement('div', { style: { height: '14px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' } }),
              React.createElement('div', { style: { height: '28px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' } })
            )
          )
        )
      )
    );
  }

  if (error) {
    return (
      React.createElement('div', { 
        style: { 
          padding: '1.5rem', 
          background: 'rgba(244, 63, 94, 0.08)', 
          border: '1px solid rgba(244, 63, 94, 0.2)', 
          borderRadius: '12px',
          color: '#f43f5e'
        } 
      },
        React.createElement('p', null, `Failed to load dashboard metrics: ${error}`)
      )
    );
  }

  // Format amount as Sri Lankan Rupees (Rs. 148,500)
  const formatRupees = (amount) => {
    return 'Rs. ' + Number(amount).toLocaleString('en-US');
  };

  return (
    React.createElement('div', { className: 'metrics-grid' },
      
      // Card 1: Total Collected Revenue
      React.createElement('div', { className: 'metric-card glass-panel glass-panel-hover metric-blue fade-in' },
        React.createElement('div', { className: 'metric-info' },
          React.createElement('h3', null, 'Total Collected Revenue'),
          React.createElement('div', { className: 'metric-value' }, formatRupees(stats.totalCollected))
        ),
        React.createElement('div', { className: 'metric-icon' },
          React.createElement('i', { className: 'fa-solid fa-money-bill-trend-up' })
        )
      ),

      // Card 2: Total Paid Fines (Count)
      React.createElement('div', { className: 'metric-card glass-panel glass-panel-hover metric-emerald fade-in' },
        React.createElement('div', { className: 'metric-info' },
          React.createElement('h3', null, 'Total Paid Fines'),
          React.createElement('div', { className: 'metric-value' }, stats.totalFinesPaid)
        ),
        React.createElement('div', { className: 'metric-icon' },
          React.createElement('i', { className: 'fa-solid fa-circle-check' })
        )
      ),

      // Card 3: Total Pending Fines (Count)
      React.createElement('div', { className: 'metric-card glass-panel glass-panel-hover metric-amber fade-in' },
        React.createElement('div', { className: 'metric-info' },
          React.createElement('h3', null, 'Total Pending Fines'),
          React.createElement('div', { className: 'metric-value' }, stats.pendingFinesCount)
        ),
        React.createElement('div', { className: 'metric-icon' },
          React.createElement('i', { className: 'fa-solid fa-clock' })
        )
      )
      
    )
  );
}
