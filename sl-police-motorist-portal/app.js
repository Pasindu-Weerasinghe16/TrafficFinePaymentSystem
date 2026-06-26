const API = 'http://localhost:8081/api';
let token = localStorage.getItem('mToken');
let payingFineId = null;

function authH() { return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }; }

/* ---- PAGES ---- */
function showPage(p) {
  document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
  document.getElementById(`page-${p}`).classList.add('active');
}

function updateNav() {
  const u = JSON.parse(localStorage.getItem('mUser') || 'null');
  if (u) {
    document.getElementById('nav-login-btn').style.display = 'none';
    document.getElementById('nav-user-info').style.display = 'flex';
    document.getElementById('nav-username').textContent = `👤 ${u.fullName||u.username}`;
  } else {
    document.getElementById('nav-login-btn').style.display = '';
    document.getElementById('nav-user-info').style.display = 'none';
  }
}

function logout() { localStorage.removeItem('mToken'); localStorage.removeItem('mUser'); token = null; updateNav(); showPage('search'); }

/* ---- LOGIN ---- */
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('login-err');
  try {
    const r = await fetch(`${API}/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: document.getElementById('l-user').value, password: document.getElementById('l-pass').value })
    });
    if (!r.ok) throw new Error('Invalid credentials');
    const d = await r.json();
    token = d.token; localStorage.setItem('mToken', token); localStorage.setItem('mUser', JSON.stringify(d));
    updateNav(); showPage('search');
  } catch(ex) { err.textContent = ex.message; }
});

/* ---- REGISTER ---- */
document.getElementById('reg-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('reg-err');
  try {
    const r = await fetch(`${API}/auth/register`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username: document.getElementById('r-user').value,
        password: document.getElementById('r-pass').value, fullName: document.getElementById('r-name').value,
        email: document.getElementById('r-email').value, phone: document.getElementById('r-phone').value })
    });
    if (!r.ok) { const d = await r.json(); throw new Error(d.message||'Registration failed'); }
    const d = await r.json();
    token = d.token; localStorage.setItem('mToken', token); localStorage.setItem('mUser', JSON.stringify(d));
    updateNav(); showPage('search');
  } catch(ex) { err.textContent = ex.message; }
});

/* ---- SEARCH FINES ---- */
async function searchFines() {
  const v = document.getElementById('vehicle-input').value.trim().toUpperCase();
  const results = document.getElementById('search-results');
  if (!v) { results.innerHTML = '<div class="info-box">Please enter a vehicle number.</div>'; return; }
  results.innerHTML = '<div class="loading">🔍 Searching…</div>';
  try {
    const r = await fetch(`${API}/fines/vehicle/${encodeURIComponent(v)}`);
    const fines = await r.json();
    if (!fines.length) { results.innerHTML = `<div class="info-box success-box">✅ No outstanding fines found for <strong>${v}</strong></div>`; return; }
    const pending = fines.filter(f => f.status === 'PENDING');
    const paid = fines.filter(f => f.status !== 'PENDING');
    results.innerHTML = `
      <div class="results-header"><h3>Fines for <span class="vehicle-tag">${v}</span></h3>
      <p>${pending.length} pending, ${paid.length} paid/cancelled</p></div>
      ${fines.map(f => fineCard(f)).join('')}
    `;
  } catch(ex) { results.innerHTML = `<div class="info-box error-box">⚠️ Error: ${ex.message}</div>`; }
}

function fineCard(f) {
  const isPending = f.status === 'PENDING';
  return `<div class="fine-card ${isPending?'pending':'settled'}">
    <div class="fine-card-header">
      <div>
        <div class="fine-id">Fine #${f.id}</div>
        <div class="fine-vehicle">🚗 ${f.vehicleNumber}</div>
      </div>
      <div class="text-right">
        <div class="fine-amount">LKR ${Number(f.amount).toLocaleString()}</div>
        <span class="badge badge-${f.status.toLowerCase()}">${f.status}</span>
      </div>
    </div>
    <div class="fine-details">
      <div class="fine-detail"><span>📍</span>${f.location||'—'}</div>
      <div class="fine-detail"><span>📝</span>${f.description}</div>
      <div class="fine-detail"><span>📅</span>Issued: ${new Date(f.issueDate).toLocaleDateString()}</div>
      ${f.dueDate?`<div class="fine-detail"><span>⏰</span>Due: ${f.dueDate}</div>`:''}
    </div>
    ${isPending ? `<div class="fine-card-footer"><button class="btn btn-success btn-lg" onclick="openPayModal(${f.id},${f.amount})">💳 Pay Now — LKR ${Number(f.amount).toLocaleString()}</button></div>` : ''}
  </div>`;
}

/* ---- PAYMENT ---- */
function openPayModal(fineId, amount) {
  if (!token) { showPage('login'); return; }
  payingFineId = fineId;
  document.getElementById('pay-fine-info').innerHTML = `<div class="pay-info-box">Fine #${fineId} — <strong>LKR ${Number(amount).toLocaleString()}</strong></div>`;
  document.getElementById('pay-err').textContent = '';
  document.getElementById('pay-modal').classList.add('active');
}

function closePayModal(e) {
  if (!e || e.target === document.getElementById('pay-modal'))
    document.getElementById('pay-modal').classList.remove('active');
}

document.getElementById('p-card').addEventListener('input', e => {
  let v = e.target.value.replace(/\D/g,'').substring(0,16);
  e.target.value = v.replace(/(\d{4})/g,'$1 ').trim();
});

document.getElementById('pay-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('pay-err');
  err.textContent = '';
  try {
    const r = await fetch(`${API}/payments`, {
      method:'POST', headers: authH(),
      body: JSON.stringify({ fineId: payingFineId, paymentMethod: 'CARD',
        cardNumber: document.getElementById('p-card').value,
        cardHolder: document.getElementById('p-holder').value,
        expiry: document.getElementById('p-expiry').value,
        cvv: document.getElementById('p-cvv').value })
    });
    if (!r.ok) { const d = await r.json(); throw new Error(d.message||'Payment failed'); }
    const d = await r.json();
    document.getElementById('pay-modal').classList.remove('active');
    document.getElementById('success-msg').textContent =
      `Payment of LKR ${Number(d.amount).toLocaleString()} processed. Transaction ID: ${d.transactionId}`;
    showPage('success');
  } catch(ex) { err.textContent = ex.message; }
});

/* ---- INIT ---- */
updateNav();
document.getElementById('vehicle-input').addEventListener('keydown', e => { if(e.key==='Enter') searchFines(); });
