/* SL Police Admin Portal - live against the monolith API through NGINX. */
const API = 'http://localhost:8088/api';

let token = localStorage.getItem('token');
let finesPage = 0;
const FINES_PAGE_SIZE = 10;

/* ---- AUTH ---- */
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('login-error');
  err.textContent = '';
  try {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username: document.getElementById('login-username').value,
                             password: document.getElementById('login-password').value })
    });
    if (!r.ok) throw new Error('Invalid username or password');
    const d = await r.json();
    token = d.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(d));
    showApp();
  } catch(ex) { err.textContent = ex.message; }
});

/* The stylesheet has no show/hide rules, so visibility is driven from here.
   .login-container and .dashboard-wrapper are both flex layouts. */
function showScreen(name) {
  document.getElementById('page-login').style.display = name === 'login' ? 'flex' : 'none';
  document.getElementById('page-app').style.display = name === 'app' ? 'flex' : 'none';
}

function logout() {
  localStorage.clear(); token = null;
  showScreen('login');
}

function authHeaders() { return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }; }

/* A rejected token means the session is over - bounce back to the login page. */
async function apiGet(path) {
  const r = await fetch(`${API}${path}`, { headers: authHeaders() });
  if (r.status === 401 || r.status === 403) { logout(); throw new Error('Session expired, please sign in again'); }
  if (!r.ok) throw new Error(`Request failed (${r.status})`);
  return r.json();
}

async function apiPost(path, body) {
  const r = await fetch(`${API}${path}`, { method:'POST', headers: authHeaders(), body: JSON.stringify(body) });
  if (r.status === 401 || r.status === 403) { logout(); throw new Error('Session expired, please sign in again'); }
  const payload = await r.json().catch(() => ({}));
  // The API explains rejections in an "error" field - show that rather than a bare status.
  if (!r.ok) throw new Error(payload.error || `Request failed (${r.status})`);
  return payload;
}

/* ---- PAGES ---- */
function showApp() {
  showScreen('app');
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  document.getElementById('nav-user').textContent = u.username ? `${u.username} · ${u.role}` : '';
  showTab('dashboard');
}

const TAB_TITLES = {
  dashboard: 'Dashboard',
  fines: 'Traffic Fines',
  officers: 'Officers',
  categories: 'Fine Categories'
};

function showTab(tab) {
  Object.keys(TAB_TITLES).forEach(name => {
    document.getElementById(`tab-${name}`).style.display = name === tab ? 'flex' : 'none';
  });
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
  document.getElementById('page-title').textContent = TAB_TITLES[tab];

  if (tab === 'dashboard') loadDashboard();
  if (tab === 'fines') { finesPage = 0; loadFineFormOptions(); loadFines(); }
  if (tab === 'officers') loadOfficers();
  if (tab === 'categories') loadCategories();
}

const money = v => 'LKR ' + Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2});

/* ---- DASHBOARD ---- */
async function loadDashboard() {
  try {
    const s = await apiGet('/admin/stats/overview');
    document.getElementById('stat-paid').textContent = s.totalFinesPaid ?? '—';
    document.getElementById('stat-pending').textContent = s.pendingFines ?? '—';
    document.getElementById('stat-total').textContent = (s.totalFinesPaid || 0) + (s.pendingFines || 0);
    document.getElementById('stat-revenue').textContent = money(s.totalCollections);

    const districts = await apiGet('/admin/stats/district');
    document.getElementById('district-table').innerHTML = renderStatTable(districts, 'district', 'District');

    const categories = await apiGet('/admin/stats/category');
    document.getElementById('category-table').innerHTML = renderStatTable(categories, 'category', 'Category');
  } catch(e) { console.error(e); }
}

function renderStatTable(rows, key, label) {
  if (!rows || !rows.length) return '<div class="empty">No collections recorded yet</div>';
  return `<table class="data-table">
    <thead><tr><th>${label}</th><th>Total Collected</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td><strong>${r[key]}</strong></td><td>${money(r.totalCollected)}</td></tr>`).join('')}</tbody>
  </table>`;
}

/* ---- FINES ---- */
async function loadFines() {
  try {
    const status = document.getElementById('filter-status').value;
    const qs = `?page=${finesPage}&size=${FINES_PAGE_SIZE}` + (status ? `&status=${status}` : '');
    const page = await apiGet(`/admin/fines${qs}`);
    document.getElementById('fines-table').innerHTML = renderFinesTable(page.content);
    document.getElementById('fines-pageinfo').textContent =
      page.totalElements ? `Page ${page.number + 1} of ${page.totalPages} — ${page.totalElements} fines` : '';
    document.getElementById('fines-prev').disabled = page.first;
    document.getElementById('fines-next').disabled = page.last;
  } catch(e) {
    document.getElementById('fines-table').innerHTML = `<div class="empty">${e.message}</div>`;
  }
}

function pageFines(delta) {
  finesPage = Math.max(0, finesPage + delta);
  loadFines();
}

/* Changing the status filter restarts paging from the first page. */
function filterFines() {
  finesPage = 0;
  loadFines();
}

function renderFinesTable(fines) {
  if (!fines || !fines.length) return '<div class="empty">No fines found</div>';
  return `<table class="data-table">
    <thead><tr><th>Reference</th><th>Category</th><th>Amount</th><th>Officer</th><th>Location</th><th>Status</th><th>Issued</th></tr></thead>
    <tbody>
    ${fines.map(f => `<tr>
      <td><strong>${f.referenceNumber}</strong></td>
      <td>${f.category ? f.category.name : '—'}</td>
      <td>${f.category ? money(f.category.amount) : '—'}</td>
      <td>${f.officer ? `${f.officer.badgeNumber} <span class="muted">(${f.officer.district})</span>` : '—'}</td>
      <td>${f.location || '—'}</td>
      <td><span class="badge badge-${(f.status||'').toLowerCase()}">${f.status}</span></td>
      <td>${f.issuedAt ? new Date(f.issuedAt).toLocaleDateString() : '—'}</td>
    </tr>`).join('')}
    </tbody></table>`;
}

/* ---- ISSUE FINE ---- */
/* The dropdowns are filled from the live catalogue so an issued fine can never
   reference a category or badge the payment step would later reject. */
async function loadFineFormOptions() {
  try {
    const [categories, officers] = await Promise.all([
      apiGet('/admin/categories'),
      apiGet('/admin/officers')
    ]);
    document.getElementById('f-category').innerHTML = categories
      .map(c => `<option value="${c.id}">${c.name} — ${money(c.amount)}</option>`).join('');
    document.getElementById('f-officer').innerHTML = officers
      .map(o => `<option value="${o.badgeNumber}">${o.badgeNumber} — ${o.district}</option>`).join('');
  } catch(e) {
    document.getElementById('fine-msg').textContent = e.message;
  }
}

document.getElementById('fine-form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('fine-msg');
  msg.textContent = ''; msg.className = 'error-msg';
  try {
    const fine = await apiPost('/admin/fines', {
      referenceNumber: document.getElementById('f-reference').value.trim(),
      categoryId: Number(document.getElementById('f-category').value),
      officerBadgeNumber: document.getElementById('f-officer').value,
      location: document.getElementById('f-location').value.trim()
    });
    msg.textContent = `✅ Fine ${fine.referenceNumber} issued — motorists can now pay it`;
    msg.className = 'success-msg';
    document.getElementById('fine-form').reset();
    finesPage = 0;
    loadFines();
  } catch(ex) { msg.textContent = ex.message; }
});

/* ---- OFFICERS ---- */
async function loadOfficers() {
  try {
    const officers = await apiGet('/admin/officers');
    document.getElementById('officers-table').innerHTML = !officers.length
      ? '<div class="empty">No officers registered</div>'
      : `<table class="data-table">
          <thead><tr><th>Badge</th><th>District</th><th>Phone</th></tr></thead>
          <tbody>${officers.map(o => `<tr><td><strong>${o.badgeNumber}</strong></td><td>${o.district}</td><td>${o.phoneNumber}</td></tr>`).join('')}</tbody>
        </table>`;
  } catch(e) {
    document.getElementById('officers-table').innerHTML = `<div class="empty">${e.message}</div>`;
  }
}

document.getElementById('officer-form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('officer-msg');
  msg.textContent = ''; msg.className = 'error-msg';
  try {
    await apiPost('/admin/officers', {
      badgeNumber: document.getElementById('o-badge').value.trim(),
      district: document.getElementById('o-district').value.trim(),
      phoneNumber: document.getElementById('o-phone').value.trim()
    });
    msg.textContent = '✅ Officer registered';
    msg.className = 'success-msg';
    document.getElementById('officer-form').reset();
    loadOfficers();
  } catch(ex) { msg.textContent = ex.message; }
});

/* ---- CATEGORIES ---- */
async function loadCategories() {
  try {
    const categories = await apiGet('/admin/categories');
    document.getElementById('categories-table').innerHTML = !categories.length
      ? '<div class="empty">No categories defined</div>'
      : `<table class="data-table">
          <thead><tr><th>ID</th><th>Category</th><th>Amount</th></tr></thead>
          <tbody>${categories.map(c => `<tr><td>#${c.id}</td><td><strong>${c.name}</strong></td><td>${money(c.amount)}</td></tr>`).join('')}</tbody>
        </table>`;
  } catch(e) {
    document.getElementById('categories-table').innerHTML = `<div class="empty">${e.message}</div>`;
  }
}

document.getElementById('category-form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('category-msg');
  msg.textContent = ''; msg.className = 'error-msg';
  try {
    await apiPost('/admin/categories', {
      name: document.getElementById('c-name').value.trim(),
      amount: Number(document.getElementById('c-amount').value)
    });
    msg.textContent = '✅ Category created';
    msg.className = 'success-msg';
    document.getElementById('category-form').reset();
    loadCategories();
  } catch(ex) { msg.textContent = ex.message; }
});

/* ---- INIT ---- */
if (token) showApp(); else showScreen('login');
