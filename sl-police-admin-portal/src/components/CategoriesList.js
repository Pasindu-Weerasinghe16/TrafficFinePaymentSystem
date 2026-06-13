import { api } from '../services/api.js';
const { useState, useEffect } = React;

export default function CategoriesList({ isLiveMode }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal form state
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load fine categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, [isLiveMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Simple validation
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setSubmitError('Base amount must be a positive number.');
      setSubmitting(false);
      return;
    }

    try {
      await api.createCategory(categoryName, parsedAmount);
      // Reset form
      setCategoryName('');
      setAmount('');
      setShowModal(false);
      // Reload list
      loadCategories();
    } catch (err) {
      setSubmitError(err.message || 'Failed to create fine category');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder: 'Search by Category Name...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            })
          ),

          React.createElement('button', {
            className: 'btn btn-primary',
            onClick: () => setShowModal(true)
          },
            React.createElement('i', { className: 'fa-solid fa-folder-plus' }),
            'Add Category'
          )
        ),

        // Categories Table List
        React.createElement('div', { className: 'table-container' },
          loading ? (
            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '3rem' } },
              React.createElement('div', { className: 'loader-spinner' })
            )
          ) : error ? (
            React.createElement('p', { style: { color: 'var(--accent-rose)', padding: '2rem', textAlign: 'center' } }, error)
          ) : filteredCategories.length === 0 ? (
            React.createElement('p', { style: { color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' } }, 'No fine categories configured.')
          ) : (
            React.createElement('table', null,
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Category ID'),
                  React.createElement('th', null, 'Violation Category'),
                  React.createElement('th', null, 'Base Fine Amount'),
                  React.createElement('th', null, 'Actions')
                )
              ),
              React.createElement('tbody', null,
                filteredCategories.map(category => 
                  React.createElement('tr', { key: category.id },
                    React.createElement('td', null, category.id),
                    React.createElement('td', { style: { fontWeight: '600', color: 'var(--text-primary)' } }, category.name),
                    React.createElement('td', { style: { color: 'var(--accent-blue)', fontWeight: '600' } }, `Rs. ${category.amount.toLocaleString('en-US')}`),
                    React.createElement('td', null,
                      React.createElement('button', {
                        className: 'btn btn-danger btn-sm',
                        style: { marginLeft: '0.5rem' },
                        onClick: () => handleDeleteCategory(category.id)
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

      // Creation Modal Dialog
      showModal && React.createElement('div', { className: 'modal-overlay', onClick: () => setShowModal(false) },
        React.createElement('div', { className: 'modal-content glass-panel', onClick: (e) => e.stopPropagation() },
          
          React.createElement('div', { className: 'modal-header' },
            React.createElement('h3', { className: 'modal-title' }, 'Add Fine Category'),
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
              React.createElement('label', { className: 'form-label' }, 'Violation Category Name'),
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                placeholder: 'e.g. Speeding, No Seatbelt',
                value: categoryName,
                onChange: (e) => setCategoryName(e.target.value),
                required: true,
                disabled: submitting
              })
            ),
            
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', { className: 'form-label' }, 'Base Fine Amount (LKR)'),
              React.createElement('input', {
                type: 'number',
                className: 'form-control',
                placeholder: 'e.g. 1500',
                value: amount,
                onChange: (e) => setAmount(e.target.value),
                required: true,
                disabled: submitting
              })
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
              }, submitting ? 'Adding...' : 'Add Category')
            )
          )
        )
      )
    )
  );
}
