/* SL Police Motorist Portal - live against the monolith API through NGINX. */
const API = 'http://localhost:8088/api';

let currentFine = null;

function showPage(p) {
  document.querySelectorAll('.page').forEach(e => e.classList.remove('active'));
  document.getElementById(`page-${p}`).classList.add('active');
}

const money = v => 'LKR ' + Number(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2});

function setMessage(el, text, ok) {
  el.textContent = text;
  el.className = ok ? 'success-msg' : 'err-msg';
}

/* ---- LOOK UP A FINE ---- */
document.getElementById('search-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('search-err');
  const results = document.getElementById('search-results');
  setMessage(err, '', false);
  results.innerHTML = '';

  const referenceNumber = document.getElementById('s-reference').value.trim();
  const categoryId = document.getElementById('s-category').value.trim();
  const officerBadge = document.getElementById('s-badge').value.trim();

  if (!referenceNumber || !categoryId || !officerBadge) {
    setMessage(err, 'Please fill in all three fields from your ticket.', false);
    return;
  }
  if (!/^\d+$/.test(categoryId) || Number(categoryId) <= 0) {
    setMessage(err, 'Category ID must be a positive number.', false);
    return;
  }

  const btn = document.getElementById('search-btn');
  btn.disabled = true; btn.textContent = 'Checking…';

  try {
    const qs = `referenceNumber=${encodeURIComponent(referenceNumber)}`
             + `&categoryId=${encodeURIComponent(categoryId)}`
             + `&officerBadge=${encodeURIComponent(officerBadge)}`;
    const r = await fetch(`${API}/fines/validate?${qs}`);
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.error || `Could not validate this fine (${r.status})`);

    currentFine = { ...body, referenceNumber, categoryId: Number(categoryId), officerBadge };
    renderFine(currentFine);
  } catch(ex) {
    setMessage(err, ex.message, false);
  } finally {
    btn.disabled = false; btn.textContent = 'Check Fine';
  }
});

function renderFine(f) {
  document.getElementById('search-results').innerHTML = `
    <div class="fine-card ${f.isAlreadyPaid ? 'settled' : 'pending'}">
      <div class="fine-card-header">
        <div>
          <div class="fine-id">${f.categoryName}</div>
          <div class="fine-vehicle">Ref: ${f.referenceNumber}</div>
        </div>
        <div class="text-right">
          <div class="fine-amount">${money(f.amount)}</div>
          <span class="badge badge-${f.isAlreadyPaid ? 'paid' : 'pending'}">
            ${f.isAlreadyPaid ? 'ALREADY PAID' : 'PAYMENT DUE'}
          </span>
        </div>
      </div>
      <div class="fine-details">
        <div class="fine-detail"><span>👮</span>Officer badge: ${f.officerBadge}</div>
        <div class="fine-detail"><span>🏷️</span>Category ID: ${f.categoryId}</div>
      </div>
      ${f.isAlreadyPaid
        ? `<div class="info-box success-box">✅ This fine has already been settled. No further payment is required.</div>`
        : `<div class="fine-card-footer"><button class="btn btn-success btn-lg" onclick="openPayModal()">💳 Pay Now — ${money(f.amount)}</button></div>`}
    </div>`;
}

/* ---- PAYMENT ---- */
function openPayModal() {
  if (!currentFine || currentFine.isAlreadyPaid) return;
  document.getElementById('pay-fine-info').innerHTML =
    `<div class="pay-info-box">${currentFine.referenceNumber} — ${currentFine.categoryName} — <strong>${money(currentFine.amount)}</strong></div>`;
  setMessage(document.getElementById('pay-err'), '', false);
  document.getElementById('pay-modal').classList.add('active');
}

function closePayModal(e) {
  if (!e || e.target === document.getElementById('pay-modal'))
    document.getElementById('pay-modal').classList.remove('active');
}

document.getElementById('p-card').addEventListener('input', e => {
  const digits = e.target.value.replace(/\D/g, '').substring(0, 16);
  e.target.value = digits.replace(/(\d{4})/g, '$1 ').trim();
});

document.getElementById('p-expiry').addEventListener('input', e => {
  const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
  e.target.value = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
});

document.getElementById('pay-form').addEventListener('submit', async e => {
  e.preventDefault();
  const err = document.getElementById('pay-err');
  setMessage(err, '', false);

  const location = document.getElementById('p-location').value.trim();
  const card = document.getElementById('p-card').value.replace(/\s/g, '');
  const expiry = document.getElementById('p-expiry').value.trim();
  const cvv = document.getElementById('p-cvv').value.trim();

  if (!location) { setMessage(err, 'Please enter the violation location.', false); return; }
  if (!/^\d{12,19}$/.test(card)) { setMessage(err, 'Enter a valid card number (12-19 digits).', false); return; }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) { setMessage(err, 'Expiry must use MM/YY format.', false); return; }
  if (!/^\d{3,4}$/.test(cvv)) { setMessage(err, 'Enter a valid CVV (3-4 digits).', false); return; }

  const btn = document.getElementById('pay-btn');
  btn.disabled = true; btn.textContent = 'Processing…';

  try {
    const r = await fetch(`${API}/payments`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        referenceNumber: currentFine.referenceNumber,
        categoryId: currentFine.categoryId,
        officerBadgeNumber: currentFine.officerBadge,
        location,
        paymentDetails: { method: 'CARD', cardNumber: card, expiry, cvv }
      })
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.error || `Payment failed (${r.status})`);
    if (!body.success) throw new Error(body.message || 'Payment was not accepted.');

    document.getElementById('pay-modal').classList.remove('active');
    document.getElementById('success-msg').innerHTML =
      `Receipt <strong>${body.receiptNumber}</strong><br/>`
      + `${money(currentFine.amount)} paid for reference <strong>${currentFine.referenceNumber}</strong>.<br/>`
      + `<span class="muted">${body.message || ''}</span>`;
    showPage('success');
    document.getElementById('pay-form').reset();
  } catch(ex) {
    setMessage(err, ex.message, false);
  } finally {
    btn.disabled = false; btn.textContent = '💳 Pay Now';
  }
});

function startOver() {
  currentFine = null;
  document.getElementById('search-form').reset();
  document.getElementById('search-results').innerHTML = '';
  setMessage(document.getElementById('search-err'), '', false);
  showPage('search');
}
