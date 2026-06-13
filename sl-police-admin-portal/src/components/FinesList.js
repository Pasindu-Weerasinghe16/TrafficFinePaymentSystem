import { api } from '../services/api.js';
const { useState, useEffect } = React;

export default function FinesList({ isLiveMode }) {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(8);

  // Filters State
  const [statusFilter, setStatusFilter] = useState(''); // Empty string means ALL
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Fine for Details Modal
  const [selectedFine, setSelectedFine] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Load Fines on filter/page change
  useEffect(() => {
    async function loadFines() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.getFines(page, pageSize, statusFilter);
        setFines(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } catch (err) {
        setError(err.message || 'Error loading fines');
      } finally {
        setLoading(false);
      }
    }
    loadFines();
  }, [page, statusFilter, isLiveMode]);

  // Reset page when filter changes
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  // View specific fine details
  const handleViewDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const fine = await api.getFineById(id);
      setSelectedFine(fine);
    } catch (err) {
      alert('Failed to load fine details: ' + err.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter local files matching search query
  const filteredFines = fines.filter(f => {
    const query = searchQuery.toLowerCase();
    return (
      f.referenceNumber.toLowerCase().includes(query) ||
      f.officerBadgeNumber.toLowerCase().includes(query) ||
      f.location.toLowerCase().includes(query) ||
      f.categoryName.toLowerCase().includes(query)
    );
  });

  return (
    React.createElement('div', { className: 'page-container fade-in' },
      
      // Main Table Card
      React.createElement('div', { className: 'table-card glass-panel' },
        
        // Header (search and filters)
        React.createElement('div', { className: 'table-header' },
          
          // Search box
          React.createElement('div', { className: 'table-search-box' },
            React.createElement('i', { className: 'fa-solid fa-magnifying-glass' }),
            React.createElement('input', {
              type: 'text',
              className: 'form-control',
              placeholder: 'Search by Ref #, Badge, or Location...',
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value)
            })
          ),

          // Status Filters
          React.createElement('div', { className: 'table-filters' },
            React.createElement('button', {
              className: `btn ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`,
              onClick: () => handleStatusFilterChange('')
            }, 'All'),
            React.createElement('button', {
              className: `btn ${statusFilter === 'PAID' ? 'btn-primary' : 'btn-secondary'}`,
              onClick: () => handleStatusFilterChange('PAID')
            }, 'Paid'),
            React.createElement('button', {
              className: `btn ${statusFilter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`,
              onClick: () => handleStatusFilterChange('PENDING')
            }, 'Pending')
          )
        ),

        // Table List
        React.createElement('div', { className: 'table-container' },
          loading ? (
            React.createElement('div', { style: { display: 'flex', justifyContent: 'center', padding: '3rem' } },
              React.createElement('div', { className: 'loader-spinner' })
            )
          ) : error ? (
            React.createElement('p', { style: { color: 'var(--accent-rose)', padding: '2rem', textAlign: 'center' } }, error)
          ) : filteredFines.length === 0 ? (
            React.createElement('p', { style: { color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' } }, 'No traffic fine records found matching the criteria.')
          ) : (
            React.createElement('table', null,
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Reference Number'),
                  React.createElement('th', null, 'Category'),
                  React.createElement('th', null, 'Fine Amount'),
                  React.createElement('th', null, 'Officer Badge'),
                  React.createElement('th', null, 'Location'),
                  React.createElement('th', null, 'Status'),
                  React.createElement('th', null, 'Actions')
                )
              ),
              React.createElement('tbody', null,
                filteredFines.map(fine => 
                  React.createElement('tr', { key: fine.id },
                    React.createElement('td', { style: { fontWeight: '600', color: 'var(--text-primary)' } }, fine.referenceNumber),
                    React.createElement('td', null, fine.categoryName),
                    React.createElement('td', null, `Rs. ${fine.amount.toLocaleString('en-US')}`),
                    React.createElement('td', null, fine.officerBadgeNumber),
                    React.createElement('td', null, fine.location),
                    React.createElement('td', null, 
                      React.createElement('span', { 
                        className: `badge ${fine.status === 'PAID' ? 'badge-paid' : 'badge-pending'}` 
                      }, fine.status)
                    ),
                    React.createElement('td', null, 
                      React.createElement('button', {
                        className: 'btn btn-secondary btn-sm',
                        style: { padding: '0.35rem 0.75rem', fontSize: '0.8rem' },
                        onClick: () => handleViewDetails(fine.id),
                        disabled: loadingDetails
                      }, 'Details')
                    )
                  )
                )
              )
            )
          )
        ),

        // Pagination controls
        !loading && !error && totalPages > 1 && React.createElement('div', { className: 'pagination' },
          React.createElement('span', null, `Showing page ${page + 1} of ${totalPages} (${totalElements} total elements)`),
          React.createElement('div', { className: 'pagination-buttons' },
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => setPage(p => Math.max(0, p - 1)),
              disabled: page === 0
            }, 'Previous'),
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => setPage(p => Math.min(totalPages - 1, p + 1)),
              disabled: page === totalPages - 1
            }, 'Next')
          )
        )
      ),

      // Fine Details Modal
      selectedFine && React.createElement('div', { className: 'modal-overlay', onClick: () => setSelectedFine(null) },
        React.createElement('div', { className: 'modal-content glass-panel', onClick: (e) => e.stopPropagation() },
          
          React.createElement('div', { className: 'modal-header' },
            React.createElement('h3', { className: 'modal-title' }, 'Traffic Fine Details'),
            React.createElement('button', { className: 'modal-close', onClick: () => setSelectedFine(null) }, '×')
          ),

          React.createElement('div', { className: 'detail-grid' },
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Reference Code'),
              React.createElement('span', { className: 'detail-value', style: { fontWeight: '600' } }, selectedFine.referenceNumber)
            ),
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Current Status'),
              React.createElement('span', { className: 'detail-value' }, 
                React.createElement('span', { className: `badge ${selectedFine.status === 'PAID' ? 'badge-paid' : 'badge-pending'}` }, selectedFine.status)
              )
            ),
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Fine Category'),
              React.createElement('span', { className: 'detail-value' }, selectedFine.categoryName)
            ),
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Fine Amount'),
              React.createElement('span', { className: 'detail-value-large' }, `Rs. ${selectedFine.amount.toLocaleString('en-US')}`)
            ),
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Reporting Officer'),
              React.createElement('span', { className: 'detail-value' }, `Badge #${selectedFine.officerBadgeNumber}`)
            ),
            React.createElement('div', { className: 'detail-item' },
              React.createElement('span', { className: 'detail-label' }, 'Incident Location'),
              React.createElement('span', { className: 'detail-value' }, selectedFine.location)
            ),
            React.createElement('div', { className: 'detail-item', style: { gridColumn: 'span 2' } },
              React.createElement('span', { className: 'detail-label' }, 'Date/Time Issued'),
              React.createElement('span', { className: 'detail-value' }, new Date(selectedFine.timestamp).toLocaleString())
            )
          ),

          React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' } },
            React.createElement('button', { className: 'btn btn-secondary', onClick: () => setSelectedFine(null) }, 'Close Details')
          )
        )
      )
    )
  );
}
