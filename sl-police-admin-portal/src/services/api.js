// API Service Layer for SL Police Admin Portal
const API_BASE_URL = 'http://localhost:8080';

// Initialize mock data in LocalStorage if not already present
const INITIAL_MOCK_DATA = {
  statsOverview: {
    totalCollected: 148500,
    totalFinesPaid: 93,
    pendingFinesCount: 22,
    totalFinesIssued: 115
  },
  statsDistrict: [
    { district: 'Colombo', totalCollected: 62000 },
    { district: 'Gampaha', totalCollected: 38500 },
    { district: 'Kandy', totalCollected: 24000 },
    { district: 'Galle', totalCollected: 16000 },
    { district: 'Kurunegala', totalCollected: 8000 }
  ],
  statsCategory: [
    { category: 'Speeding', totalCollected: 73500 },
    { category: 'Reckless Driving', totalCollected: 45000 },
    { category: 'No License', totalCollected: 20000 },
    { category: 'Wrong Way', totalCollected: 10000 }
  ],
  fines: [
    { id: 101, referenceNumber: 'REF90811', categoryId: '1', categoryName: 'Speeding', amount: 1500, officerBadgeNumber: 'OB2091', location: 'Colombo 03', status: 'PAID', timestamp: '2026-06-12T14:32:00Z' },
    { id: 102, referenceNumber: 'REF90812', categoryId: '2', categoryName: 'Reckless Driving', amount: 3000, officerBadgeNumber: 'OB1184', location: 'Gampaha Town', status: 'PAID', timestamp: '2026-06-12T16:15:00Z' },
    { id: 103, referenceNumber: 'REF90813', categoryId: '3', categoryName: 'No License', amount: 2500, officerBadgeNumber: 'OB2091', location: 'Colombo 07', status: 'PENDING', timestamp: '2026-06-13T09:10:00Z' },
    { id: 104, referenceNumber: 'REF90814', categoryId: '1', categoryName: 'Speeding', amount: 1500, officerBadgeNumber: 'OB3921', location: 'Kandy Center', status: 'PAID', timestamp: '2026-06-13T10:05:00Z' },
    { id: 105, referenceNumber: 'REF90815', categoryId: '4', categoryName: 'Wrong Way', amount: 2000, officerBadgeNumber: 'OB9283', location: 'Galle Highway', status: 'PENDING', timestamp: '2026-06-13T11:40:00Z' },
    { id: 106, referenceNumber: 'REF90816', categoryId: '1', categoryName: 'Speeding', amount: 1500, officerBadgeNumber: 'OB1184', location: 'Negombo Beach Rd', status: 'PAID', timestamp: '2026-06-13T12:20:00Z' }
  ],
  officers: [
    { id: 1, badgeNumber: 'OB2091', phoneNumber: '+94771234567', district: 'Colombo' },
    { id: 2, badgeNumber: 'OB1184', phoneNumber: '+94777654321', district: 'Gampaha' },
    { id: 3, badgeNumber: 'OB3921', phoneNumber: '+94718882211', district: 'Kandy' },
    { id: 4, badgeNumber: 'OB9283', phoneNumber: '+94723334455', district: 'Galle' }
  ],
  categories: [
    { id: 1, name: 'Speeding', amount: 1500 },
    { id: 2, name: 'Reckless Driving', amount: 3000 },
    { id: 3, name: 'No License', amount: 2500 },
    { id: 4, name: 'Wrong Way', amount: 2000 }
  ]
};

const getStorageItem = (key, fallback) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed initial mock database if empty
if (!localStorage.getItem('mock_db_initialized')) {
  setStorageItem('mock_stats_overview', INITIAL_MOCK_DATA.statsOverview);
  setStorageItem('mock_stats_district', INITIAL_MOCK_DATA.statsDistrict);
  setStorageItem('mock_stats_category', INITIAL_MOCK_DATA.statsCategory);
  setStorageItem('mock_fines', INITIAL_MOCK_DATA.fines);
  setStorageItem('mock_officers', INITIAL_MOCK_DATA.officers);
  setStorageItem('mock_categories', INITIAL_MOCK_DATA.categories);
  localStorage.setItem('mock_db_initialized', 'true');
}

export const api = {
  // Mode Check
  isLiveMode() {
    return localStorage.getItem('admin_use_live_api') === 'true';
  },

  setLiveMode(useLive) {
    localStorage.setItem('admin_use_live_api', useLive ? 'true' : 'false');
  },

  // Get Auth Token
  getToken() {
    return localStorage.getItem('admin_jwt_token');
  },

  setToken(token) {
    localStorage.setItem('admin_jwt_token', token);
  },

  clearToken() {
    localStorage.removeItem('admin_jwt_token');
  },

  // Helper for auth headers
  getHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // Authenticate Admin
  async login(username, password) {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      const data = await response.json();
      this.setToken(data.token);
      return data;
    } else {
      // Mock Authentication
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
      if (username === 'admin' && password === 'admin123') {
        const token = 'mock-jwt-token-string-' + Math.random().toString(36).substring(2);
        this.setToken(token);
        return { token };
      } else {
        throw new Error('Invalid admin credentials. Use admin / admin123');
      }
    }
  },

  // Get Analytics Overview
  async getOverviewStats() {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats/overview`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load overview statistics');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageItem('mock_stats_overview');
    }
  },

  // Get District Collections
  async getDistrictStats() {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats/district`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load district statistics');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageItem('mock_stats_district');
    }
  },

  // Get Category Collections
  async getCategoryStats() {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats/category`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load category statistics');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageItem('mock_stats_category');
    }
  },

  // Fines Management (with pagination)
  async getFines(page = 0, size = 10, status = '') {
    if (this.isLiveMode()) {
      let url = `${API_BASE_URL}/api/admin/fines?page=${page}&size=${size}`;
      if (status) url += `&status=${status}`;
      const response = await fetch(url, { headers: this.getHeaders() });
      if (!response.ok) throw new Error('Failed to load fines list');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      let fines = getStorageItem('mock_fines');
      
      // Filter by status if provided
      if (status) {
        fines = fines.filter(f => f.status.toUpperCase() === status.toUpperCase());
      }
      
      // Paginate mock data
      const start = page * size;
      const paginatedContent = fines.slice(start, start + size);
      const totalPages = Math.ceil(fines.length / size);
      
      return {
        content: paginatedContent,
        totalPages: totalPages,
        totalElements: fines.length,
        number: page,
        size: size
      };
    }
  },

  // Get Specific Fine Detail
  async getFineById(id) {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/fines/${id}`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load fine details');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 200));
      const fines = getStorageItem('mock_fines');
      const fine = fines.find(f => f.id === parseInt(id));
      if (!fine) throw new Error('Fine not found');
      return fine;
    }
  },

  // Officers Management
  async getOfficers() {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/officers`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load officers');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageItem('mock_officers');
    }
  },

  async createOfficer(badgeNumber, phoneNumber, district) {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/officers`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ badgeNumber, phoneNumber, district })
      });
      if (!response.ok) throw new Error('Failed to register officer');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const officers = getStorageItem('mock_officers');
      const newOfficer = {
        id: officers.length ? Math.max(...officers.map(o => o.id)) + 1 : 1,
        badgeNumber,
        phoneNumber,
        district
      };
      officers.unshift(newOfficer); // Insert at the top of the list
      setStorageItem('mock_officers', officers);
      return newOfficer;
    }
  },

  // Categories Management
  async getCategories() {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        headers: this.getHeaders()
      });
      if (!response.ok) throw new Error('Failed to load fine categories');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getStorageItem('mock_categories');
    }
  },

  async createCategory(name, amount) {
    if (this.isLiveMode()) {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ name, amount: parseFloat(amount) })
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      const categories = getStorageItem('mock_categories');
      const newCategory = {
        id: categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name,
        amount: parseFloat(amount)
      };
      categories.unshift(newCategory);
      setStorageItem('mock_categories', categories);
      return newCategory;
    }
  }
};
