// FarmLab Admin Panel JavaScript

// API Configuration
const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';

let token = localStorage.getItem('farmlab_admin_token');
let categories = [];

// Check auth on load
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
    loadDashboard();
  }
  setupEventListeners();
});

function setupEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      switchSection(section);
    });
  });
  
  // Forms
  document.getElementById('post-form').addEventListener('submit', handlePostSubmit);
  document.getElementById('market-form').addEventListener('submit', handleMarketSubmit);
  document.getElementById('ad-form').addEventListener('submit', handleAdSubmit);
}

// API Helper
async function api(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${API_URL}/admin${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });
  
  if (res.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }
  
  return res.json();
}

// Auth
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  
  try {
    const data = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(r => r.json());
    
    if (data.token) {
      token = data.token;
      localStorage.setItem('farmlab_admin_token', token);
      document.getElementById('admin-name').textContent = data.admin.name;
      showDashboard();
      loadDashboard();
      showToast('Welcome back!', 'success');
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (err) {
    showToast('Login failed', 'error');
  }
}

function logout() {
  token = null;
  localStorage.removeItem('farmlab_admin_token');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('admin-dashboard').classList.remove('hidden');
}


// Navigation
function switchSection(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${section}`).classList.add('active');
  
  const titles = { dashboard: 'Dashboard', posts: 'Manage Posts', market: 'Market Prices', ads: 'Advertisements' };
  document.getElementById('page-title').textContent = titles[section];
  
  // Load data for section
  if (section === 'dashboard') loadDashboard();
  else if (section === 'posts') loadPosts();
  else if (section === 'market') loadMarketPrices();
  else if (section === 'ads') loadAds();
}

// Dashboard
async function loadDashboard() {
  try {
    const data = await api('/dashboard');
    categories = data.categories || [];
    
    document.getElementById('dash-posts').textContent = data.stats.totalPosts;
    document.getElementById('dash-likes').textContent = data.stats.totalLikes;
    document.getElementById('dash-views').textContent = data.stats.totalViews;
    document.getElementById('dash-viewers').textContent = data.stats.currentViewers || 0;
    
    // Recent posts
    const container = document.getElementById('recent-posts-list');
    container.innerHTML = data.recentPosts.map(p => `
      <div style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <strong>${p.title}</strong>
        <div style="font-size: 13px; color: #666;">
          ${p.category} • ${p.views} views • ${p.likes} likes
        </div>
      </div>
    `).join('');
    
    // Populate category dropdown
    populateCategoryDropdown();
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

function populateCategoryDropdown() {
  const select = document.getElementById('post-category');
  select.innerHTML = categories.map(c => 
    `<option value="${c.name}">${c.icon} ${c.label}</option>`
  ).join('');
}

// Posts CRUD
async function loadPosts() {
  try {
    const posts = await api('/posts');
    const tbody = document.getElementById('posts-table-body');
    tbody.innerHTML = posts.map(p => `
      <tr>
        <td><strong>${p.title}</strong>${p.is_daily ? ' ⭐' : ''}</td>
        <td>${p.category}</td>
        <td>${p.author}</td>
        <td>${p.views}</td>
        <td>${p.likes}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editPost('${p.id}')">Edit</button>
          <button class="delete-btn" onclick="deletePost('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load posts', 'error');
  }
}

function showPostModal(post = null) {
  populateCategoryDropdown();
  document.getElementById('post-modal-title').textContent = post ? 'Edit Post' : 'New Post';
  document.getElementById('post-id').value = post?.id || '';
  document.getElementById('post-title').value = post?.title || '';
  document.getElementById('post-content').value = post?.content || '';
  document.getElementById('post-category').value = post?.category || 'general';
  document.getElementById('post-author').value = post?.author || 'FarmLab Team';
  document.getElementById('post-is-daily').checked = post?.is_daily || false;
  document.getElementById('post-modal').classList.remove('hidden');
}

async function editPost(id) {
  const posts = await api('/posts');
  const post = posts.find(p => p.id === id);
  if (post) showPostModal(post);
}

async function handlePostSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('post-id').value;
  const data = {
    title: document.getElementById('post-title').value,
    content: document.getElementById('post-content').value,
    category: document.getElementById('post-category').value,
    author: document.getElementById('post-author').value,
    isDaily: document.getElementById('post-is-daily').checked
  };
  
  try {
    if (id) {
      await api(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      showToast('Post updated!', 'success');
    } else {
      await api('/posts', { method: 'POST', body: JSON.stringify(data) });
      showToast('Post created!', 'success');
    }
    closeModal('post-modal');
    loadPosts();
  } catch (err) {
    showToast('Failed to save post', 'error');
  }
}

async function deletePost(id) {
  if (!confirm('Delete this post?')) return;
  try {
    await api(`/posts/${id}`, { method: 'DELETE' });
    showToast('Post deleted', 'success');
    loadPosts();
  } catch (err) {
    showToast('Failed to delete', 'error');
  }
}


// Market Prices CRUD
async function loadMarketPrices() {
  try {
    const prices = await api('/market-prices');
    const tbody = document.getElementById('market-table-body');
    tbody.innerHTML = prices.map(p => `
      <tr>
        <td><strong>${p.commodity}</strong></td>
        <td>₹${p.price.toLocaleString()}/${p.unit}</td>
        <td>${p.market}</td>
        <td class="${p.change >= 0 ? 'text-success' : 'text-danger'}">
          ${p.change >= 0 ? '↑' : '↓'} ₹${Math.abs(p.change)}
        </td>
        <td class="actions">
          <button class="edit-btn" onclick="editMarketPrice('${p.id}', ${p.price})">Update Price</button>
          <button class="delete-btn" onclick="deleteMarketPrice('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load prices', 'error');
  }
}

function showMarketModal(data = null) {
  document.getElementById('market-modal-title').textContent = data ? 'Update Price' : 'Add Market Price';
  document.getElementById('market-id').value = data?.id || '';
  document.getElementById('market-commodity').value = data?.commodity || '';
  document.getElementById('market-price').value = data?.price || '';
  document.getElementById('market-name').value = data?.market || '';
  document.getElementById('market-unit').value = data?.unit || 'क्विंटल';
  document.getElementById('market-modal').classList.remove('hidden');
}

function editMarketPrice(id, currentPrice) {
  const newPrice = prompt('Enter new price:', currentPrice);
  if (newPrice && !isNaN(newPrice)) {
    api(`/market-prices/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify({ price: parseFloat(newPrice) }) 
    }).then(() => {
      showToast('Price updated!', 'success');
      loadMarketPrices();
    }).catch(() => showToast('Update failed', 'error'));
  }
}

async function handleMarketSubmit(e) {
  e.preventDefault();
  const data = {
    commodity: document.getElementById('market-commodity').value,
    price: parseFloat(document.getElementById('market-price').value),
    market: document.getElementById('market-name').value,
    unit: document.getElementById('market-unit').value
  };
  
  try {
    await api('/market-prices', { method: 'POST', body: JSON.stringify(data) });
    showToast('Price added!', 'success');
    closeModal('market-modal');
    loadMarketPrices();
  } catch (err) {
    showToast('Failed to add price', 'error');
  }
}

async function deleteMarketPrice(id) {
  if (!confirm('Delete this price entry?')) return;
  try {
    await api(`/market-prices/${id}`, { method: 'DELETE' });
    showToast('Deleted', 'success');
    loadMarketPrices();
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}

// Ads CRUD
async function loadAds() {
  try {
    const ads = await api('/ads');
    const tbody = document.getElementById('ads-table-body');
    tbody.innerHTML = ads.map(a => `
      <tr>
        <td><strong>${a.title}</strong></td>
        <td>${a.position}</td>
        <td>${a.advertiser || '-'}</td>
        <td><span class="badge ${a.is_active ? 'badge-success' : 'badge-danger'}">${a.is_active ? 'Active' : 'Inactive'}</span></td>
        <td class="actions">
          <button class="edit-btn" onclick="toggleAd('${a.id}', ${!a.is_active})">${a.is_active ? 'Disable' : 'Enable'}</button>
          <button class="delete-btn" onclick="deleteAd('${a.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load ads', 'error');
  }
}

function showAdModal() {
  document.getElementById('ad-form').reset();
  document.getElementById('ad-id').value = '';
  document.getElementById('ad-modal').classList.remove('hidden');
}

async function handleAdSubmit(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('ad-title').value,
    description: document.getElementById('ad-description').value,
    imageUrl: document.getElementById('ad-image').value,
    linkUrl: document.getElementById('ad-link').value,
    position: document.getElementById('ad-position').value,
    advertiser: document.getElementById('ad-advertiser').value
  };
  
  try {
    await api('/ads', { method: 'POST', body: JSON.stringify(data) });
    showToast('Ad created!', 'success');
    closeModal('ad-modal');
    loadAds();
  } catch (err) {
    showToast('Failed to create ad', 'error');
  }
}

async function toggleAd(id, isActive) {
  try {
    await api(`/ads/${id}`, { method: 'PUT', body: JSON.stringify({ isActive }) });
    showToast('Ad updated', 'success');
    loadAds();
  } catch (err) {
    showToast('Update failed', 'error');
  }
}

async function deleteAd(id) {
  if (!confirm('Delete this ad?')) return;
  try {
    await api(`/ads/${id}`, { method: 'DELETE' });
    showToast('Ad deleted', 'success');
    loadAds();
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}

// Utilities
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
