import { api } from '../services/api.js';
const { useState, useEffect } = React;

export default function OfficersList({ isLiveMode }) {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal registration form state
  const [showModal, setShowModal] = useState(false);
  const [badgeNumber, setBadgeNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function loadOfficers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOfficers();
      setOfficers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load officers list');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOfficers();
  }, [isLiveMode]);

  const handleDeleteOfficer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;
    try {
      await api.deleteOfficer(id);
      // Refresh list
      loadOfficers();
    } catch (err) {
      setSubmitError(err.message || 'Failed to delete officer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Simple validation
    if (!badgeNumber.startsWith('OB')) {
      setSubmitError('Officer badge number must start with "OB" (e.g. OB2091).');
      setSubmitting(false);
      return;
    }
    if (!phoneNumber.startsWith('+94') || phoneNumber.length !== 12) {
      setSubmitError('Phone number must match Sri Lankan format "+94771234567" (12 characters).');
      setSubmitting(false);
      return;
    }

    try {
      await api.createOfficer(badgeNumber, phoneNumber, district);
      // Reset form
      setBadgeNumber('');
      setPhoneNumber('');
      setDistrict('');
      setShowModal(false);
      // Reload list
      loadOfficers();
    } catch (err) {
      setSubmitError(err.message || 'Failed to register officer');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOfficers = officers.filter(o => 
    o.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.phoneNumber.includes(searchQuery)
  );

  return (
    React.createElement('div', { className: 'page-container fade-in' },
      
      // Main Card
      React.createElement('div', { className: 'table-card glass-panel' },
        
        // Header
        React.createElement('div', { className: 'table-header' },
          
          React.createElement('div', { className: 'table-search-box' },
            React.createElement('i', { className: 'fa-solid fa-magnifying-glass' }),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Search by Badge # or District...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            })
          ),

          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: () => setShowModal(true)
          },
            React.createElement('i', { className: 'fa-solid fa-user-plus' }),
            'Register Officer'
          )
        ),

        // Officers Table List
        React.createElement('div', { className: 'table-container' },
          loading ? (
            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '3rem' } },
              React.createElement('div', { className: 'loader-spinner' })
            )
          ) : error ? (
            React.createElement('p', { style: { color: 'var(--accent-rose)', padding: '2rem', textAlign: 'center' } }, error)
          ) : filteredOfficers.length === 0 ? (
            React.createElement('p', { style: { color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' } }, 'No traffic police officers registered.')
          ) : (
            React.createElement('table', null,
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Officer ID'),
                  React.createElement('th', null, 'Badge Number'),
                  React.createElement('th', null, 'Contact Number'),
                  React.createElement('th', null, 'District Jurisdiction'),
                  React.createElement('th', null, 'Actions')
                )
              ),
              React.createElement('tbody', null,
                filteredOfficers.map(officer => 
                  React.createElement('tr', { key: officer.id },
                    React.createElement('td', null, officer.id),
                    React.createElement('td', { style: { fontWeight: '600', color: 'var(--text-primary)' } }, officer.badgeNumber),
                    React.createElement('td', null, officer.phoneNumber),
                    React.createElement('td', null, officer.district),
                    React.createElement('td', null,
                      React.createElement('button', {
                        className: 'btn btn-danger btn-sm',
                        style: { marginLeft: '0.5rem' },
                        onClick: () => handleDeleteOfficer(officer.id)
                      },
                        React.createElement('i', { className: 'fa-solid fa-trash' })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Registration Modal Dialog
      showModal && React.createElement('div', { className: 'modal-overlay', onClick: () => setShowModal(false) },
        React.createElement('div', { className: 'modal-content glass-panel', onClick: (e) => e.stopPropagation() },
          
          React.createElement('div', { className: 'modal-header' },
            React.createElement('h3', { className: 'modal-title' }, 'Register New Traffic Officer'),
            React.createElement('button', { className: 'modal-close', onClick: () => setShowModal(false) }, '×')
          ),

          submitError && React.createElement('div', { 
            style: { 
              padding: '0.75rem', 
              borderRadius: '8px', 
              background: 'rgba(244, 63, 94, 0.12)', 
              border: '1px solid rgba(244, 63, 94, 0.25)', 
              color: '#f43f5e',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            } 
          }, 
            React.createElement('i', { className: 'fa-solid fa-circle-exclamation', style: { marginRight: '0.5rem' } }),
            submitError
          ),

          React.createElement('form', { onSubmit: handleSubmit },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Badge Number (Format: OBXXXX)'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                placeholder: 'e.g. OB5544',
                value: badgeNumber,
                onChange: (e) => setBadgeNumber(e.target.value.toUpperCase()),
                required: true,
                disabled: submitting
              })
            ),
            
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Phone Number (Format: +9477XXXXXXX)'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                placeholder: 'e.g. +94771234567',
                value: phoneNumber,
                onChange: (e) => setPhoneNumber(e.target.value),
                required: true,
                disabled: submitting
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'District Jurisdiction'),
              React.createElement('select', {
                className: 'form-control',
                value: district,
                onChange: (e) => setDistrict(e.target.value),
                required: true,
                disabled: submitting
              },
                React.createElement('option', { value: '' }, '-- Select District --'),
                ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kurunegala', 'Kalutara', 'Jaffna', 'Matara', 'Ratnapura'].map(d => 
                  React.createElement('option', { key: d, value: d }, d)
                )
              )
            ),

            React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' } },
              React.createElement('button', { 
                type: 'button', 
                className: 'btn btn-secondary', 
                onClick: () => setShowModal(false),
                disabled: submitting
              }, 'Cancel'),
              React.createElement('button', { 
                type: 'submit', 
                className: 'btn btn-primary',
                disabled: submitting
              }, submitting ? 'Registering...' : 'Register Officer')
            )
          )
        )
      )
    )
  );
}
