const API = 'http://localhost:8081/api';
let token = localStorage.getItem('token');
let allFines = [];

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
    if (!r.ok) throw new Error('Invalid credentials');
    const d = await r.json();
    token = d.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(d));
    showApp();
  } catch(ex) { err.textContent = ex.message; }
});

function logout() {
  localStorage.clear(); token = null;
  document.getElementById('page-login').classList.add('active');
  document.getElementById('page-app').classList.remove('active');
}

function authHeaders() { return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }; }

/* ---- PAGES ---- */
function showApp() {
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active');
  const u = JSON.parse(localStorage.getItem('user') || '{}');
  document.getElementById('nav-user').textContent = u.fullName || u.username || '';
  loadDashboard();
}

function showTab(tab) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  event.currentTarget.classList.add('active');
  if (tab === 'dashboard') loadDashboard();
  if (tab === 'fines') loadFines();
}

/* ---- DASHBOARD ---- */
async function loadDashboard() {
  try {
    const r = await fetch(`${API}/dashboard/stats`, { headers: authHeaders() });
    const d = await r.json();
    document.getElementById('stat-total').textContent = d.total;
    document.getElementById('stat-pending').textContent = d.pending;
    document.getElementById('stat-paid').textContent = d.paid;
    document.getElementById('stat-revenue').textContent = 'LKR ' + Number(d.revenue||0).toLocaleString();
    const fR = await fetch(`${API}/fines`, { headers: authHeaders() });
    const fines = await fR.json();
    const recent = fines.slice(-5).reverse();
    document.getElementById('recent-fines-table').innerHTML = renderFinesTable(recent, true);
  } catch(e) { console.error(e); }
}

/* ---- FINES ---- */
async function loadFines() {
  try {
    const r = await fetch(`${API}/fines`, { headers: authHeaders() });
    allFines = await r.json();
    renderAllFines();
  } catch(e) { console.error(e); }
}

function filterFines() {
  const search = document.getElementById('search-vehicle').value.toUpperCase();
  const status = document.getElementById('filter-status').value;
  const filtered = allFines.filter(f =>
    (!search || f.vehicleNumber.includes(search)) &&
    (!status || f.status === status)
  );
  document.getElementById('fines-table').innerHTML = renderFinesTable(filtered, false);
}

function renderAllFines() {
  document.getElementById('fines-table').innerHTML = renderFinesTable(allFines, false);
}

function renderFinesTable(fines, compact) {
  if (!fines.length) return '<div class="empty">No fines found</div>';
  return `<table class="data-table">
    <thead><tr><th>ID</th><th>Vehicle</th><th>Amount</th><th>Location</th><th>Status</th><th>Date</th>${compact?'':'<th>Actions</th>'}</tr></thead>
    <tbody>
    ${fines.map(f => `<tr>
      <td>#${f.id}</td>
      <td><strong>${f.vehicleNumber}</strong></td>
      <td>LKR ${Number(f.amount).toLocaleString()}</td>
      <td>${f.location||'—'}</td>
      <td><span class="badge badge-${f.status.toLowerCase()}">${f.status}</span></td>
      <td>${new Date(f.issueDate).toLocaleDateString()}</td>
      ${compact?'':`<td>
        <button class="btn btn-xs" onclick="viewFine(${f.id})">View</button>
        ${f.status==='PENDING'?`<button class="btn btn-xs btn-danger" onclick="cancelFine(${f.id})">Cancel</button>`:''}
      </td>`}
    </tr>`).join('')}
    </tbody></table>`;
}

/* ---- VIEW FINE ---- */
async function viewFine(id) {
  const r = await fetch(`${API}/fines/${id}`, { headers: authHeaders() });
  const f = await r.json();
  const payments = await (await fetch(`${API}/payments/fine/${id}`, { headers: authHeaders() })).json();
  document.getElementById('modal-content').innerHTML = `
    <h2>Fine #${f.id}</h2>
    <div class="detail-grid">
      <div class="detail-item"><span>Vehicle</span><strong>${f.vehicleNumber}</strong></div>
      <div class="detail-item"><span>Amount</span><strong>LKR ${Number(f.amount).toLocaleString()}</strong></div>
      <div class="detail-item"><span>Status</span><span class="badge badge-${f.status.toLowerCase()}">${f.status}</span></div>
      <div class="detail-item"><span>Location</span><strong>${f.location||'—'}</strong></div>
      <div class="detail-item"><span>Issue Date</span><strong>${new Date(f.issueDate).toLocaleString()}</strong></div>
      <div class="detail-item"><span>Due Date</span><strong>${f.dueDate||'—'}</strong></div>
      <div class="detail-item full-span"><span>Description</span><strong>${f.description}</strong></div>
    </div>
    ${payments.length ? `<h3 style="margin-top:1rem">Payment History</h3>
    <table class="data-table"><thead><tr><th>Transaction</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead><tbody>
    ${payments.map(p=>`<tr><td>${p.transactionId}</td><td>LKR ${Number(p.amount).toLocaleString()}</td><td>${p.paymentMethod}</td><td>${new Date(p.paidAt).toLocaleString()}</td></tr>`).join('')}
    </tbody></table>` : ''}
    ${f.status==='PENDING'?`<button class="btn btn-danger mt-2" onclick="cancelFine(${f.id},true)">Cancel Fine</button>`:''}
  `;
  document.getElementById('modal').classList.add('active');
}

async function cancelFine(id, fromModal) {
  if (!confirm('Cancel this fine?')) return;
  await fetch(`${API}/fines/${id}/cancel`, { method:'PUT', headers: authHeaders() });
  closeModal(); loadFines(); loadDashboard();
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('active');
  }
}

/* ---- ISSUE FINE ---- */
document.getElementById('issue-form').addEventListener('submit', async e => {
  e.preventDefault();
  const msg = document.getElementById('issue-msg');
  msg.textContent = '';
  msg.className = 'error-msg';
  try {
    const r = await fetch(`${API}/fines`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({
        vehicleNumber: document.getElementById('f-vehicle').value,
        amount: document.getElementById('f-amount').value,
        location: document.getElementById('f-location').value,
        dueDate: document.getElementById('f-due').value || null,
        description: document.getElementById('f-desc').value
      })
    });
    if (!r.ok) throw new Error('Failed to issue fine');
    msg.textContent = '✅ Fine issued successfully!';
    msg.className = 'success-msg';
    document.getElementById('issue-form').reset();
  } catch(ex) { msg.textContent = ex.message; }
});

/* ---- INIT ---- */
if (token) showApp();
