// FarmLab - Agriculture Portal Frontend

// Initialize socket connection
let socket;
try {
  socket = io();
} catch (e) {
  console.error('Socket.IO not available:', e);
}

// State
let sessionId = localStorage.getItem('farmlab_session') || generateSessionId();
let currentCategory = 'all';
let posts = [];
let likedPosts = JSON.parse(localStorage.getItem('farmlab_liked') || '[]');

localStorage.setItem('farmlab_session', sessionId);

function generateSessionId() {
  return 'farmer_' + Math.random().toString(36).substring(2, 11);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('FarmLab initializing...');
  initTheme();
  setupEventListeners();
  
  // Load ALL data in single API call (much faster!)
  loadAllData();
});

// Single API call to load everything
async function loadAllData() {
  try {
    var res = await fetch('/api/init');
    if (!res.ok) throw new Error('API error');
    
    var data = await res.json();
    
    // Render all at once
    if (data.daily) renderDailyPost(data.daily);
    if (data.marketPrices) renderMarketPrices(data.marketPrices);
    if (data.stats) {
      document.getElementById('stat-posts').textContent = data.stats.totalPosts || 0;
      document.getElementById('stat-likes').textContent = data.stats.totalLikes || 0;
      document.getElementById('stat-views').textContent = data.stats.totalViews || 0;
    }
    if (data.posts) {
      posts = data.posts;
      renderPosts(posts);
    }
    if (data.trending) renderTrending(data.trending);
    if (data.ads) renderAds(data.ads);
    
    console.log('All data loaded!');
  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('posts-feed').innerHTML = '<div class="loading">डेटा लोड करने में समस्या</div>';
  }
}

// Render ads helper
function renderAds(ads) {
  ads.forEach(function(ad) {
    var container = document.getElementById('ad-' + ad.position);
    if (container && ad.imageUrl) {
      container.innerHTML = '<a href="' + (ad.linkUrl || '#') + '" target="_blank">' +
        '<img src="' + ad.imageUrl + '" alt="' + ad.title + '">' +
        '</a>';
    }
  });
}

// Theme Management
function initTheme() {
  const saved = localStorage.getItem('farmlab_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  console.log('Theme set to:', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('farmlab_theme', next);
  console.log('Theme toggled to:', next);
}

// Event Listeners
function setupEventListeners() {
  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  // Category filters
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      loadPosts(currentCategory === 'all' ? null : currentCategory);
    });
  });
}

// Socket Events (if available)
if (socket) {
  socket.on('viewerCount', function(count) {
    const el = document.getElementById('viewer-count');
    if (el) el.textContent = count;
  });

  socket.on('newPost', function(post) {
    posts.unshift(post);
    if (currentCategory === 'all' || currentCategory === post.category) {
      renderPosts(posts);
    }
    showToast('नई पोस्ट आई है! 🌾');
  });

  socket.on('postLiked', function(data) {
    const likeEl = document.querySelector('[data-post-id="' + data.postId + '"] .like-count');
    if (likeEl) likeEl.textContent = data.likes;
  });
}


// ============ API CALLS ============

async function loadPosts(category) {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;
  
  try {
    const url = category ? '/api/posts?category=' + category : '/api/posts';
    console.log('Loading posts from:', url);
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    
    const data = await res.json();
    console.log('Posts loaded:', data.length);
    
    posts = data;
    renderPosts(posts);
  } catch (err) {
    console.error('Error loading posts:', err);
    feed.innerHTML = '<div class="loading">पोस्ट लोड करने में समस्या हुई। पेज रिफ्रेश करें।</div>';
  }
}

async function loadDailyPost() {
  try {
    const res = await fetch('/api/posts/daily');
    if (!res.ok) return;
    
    const post = await res.json();
    if (post) renderDailyPost(post);
  } catch (err) {
    console.error('Error loading daily post:', err);
  }
}

async function loadMarketPrices() {
  try {
    const res = await fetch('/api/market-prices');
    if (!res.ok) return;
    
    const prices = await res.json();
    renderMarketPrices(prices);
  } catch (err) {
    console.error('Error loading market prices:', err);
  }
}

async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    
    const stats = await res.json();
    
    const postsEl = document.getElementById('stat-posts');
    const likesEl = document.getElementById('stat-likes');
    const viewsEl = document.getElementById('stat-views');
    
    if (postsEl) postsEl.textContent = stats.totalPosts || 0;
    if (likesEl) likesEl.textContent = stats.totalLikes || 0;
    if (viewsEl) viewsEl.textContent = stats.totalViews || 0;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

async function loadTrending() {
  try {
    const res = await fetch('/api/posts/trending?limit=5');
    if (!res.ok) return;
    
    const trending = await res.json();
    renderTrending(trending);
  } catch (err) {
    console.error('Error loading trending:', err);
  }
}

async function loadAds() {
  try {
    const res = await fetch('/api/ads');
    if (!res.ok) return;
    
    const ads = await res.json();
    
    ads.forEach(function(ad) {
      const container = document.getElementById('ad-' + ad.position);
      if (container && ad.imageUrl) {
        container.innerHTML = '<a href="' + (ad.linkUrl || '#') + '" target="_blank" title="' + ad.title + '">' +
          '<img src="' + ad.imageUrl + '" alt="' + ad.title + '">' +
          '</a>';
      }
    });
  } catch (err) {
    console.error('Error loading ads:', err);
  }
}


// ============ RENDER FUNCTIONS ============

function renderDailyPost(post) {
  const el = document.getElementById('daily-post');
  if (!el || !post) return;
  
  el.innerHTML = 
    '<div class="tip-icon">&#128161;</div>' +
    '<h2 class="tip-title">' + escapeHtml(post.title) + '</h2>' +
    '<p class="tip-content">' + escapeHtml(post.content) + '</p>' +
    '<div class="tip-footer">' +
      '<span class="tip-author">— ' + escapeHtml(post.author) + '</span>' +
      '<span class="tip-views">&#128065; ' + (post.views || 0) + ' views</span>' +
    '</div>';
}

function renderMarketPrices(prices) {
  const el = document.getElementById('market-prices-list');
  if (!el || !prices) return;
  
  if (prices.length === 0) {
    el.innerHTML = '<p>कोई मंडी भाव उपलब्ध नहीं</p>';
    return;
  }
  
  var html = '';
  prices.forEach(function(p) {
    var changeClass = p.change >= 0 ? 'up' : 'down';
    var changeSymbol = p.change >= 0 ? '↑' : '↓';
    
    html += '<div class="price-card">' +
      '<div class="price-commodity">' + escapeHtml(p.commodity) + '</div>' +
      '<div class="price-value">₹' + (p.price || 0).toLocaleString() + '</div>' +
      '<div class="price-unit">प्रति ' + escapeHtml(p.unit || 'क्विंटल') + '</div>' +
      '<div class="price-change ' + changeClass + '">' +
        changeSymbol + ' ₹' + Math.abs(p.change || 0) +
      '</div>' +
      '<div class="price-market">📍 ' + escapeHtml(p.market) + '</div>' +
    '</div>';
  });
  
  el.innerHTML = html;
}

function renderPosts(postsArray) {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;
  
  if (!postsArray || postsArray.length === 0) {
    feed.innerHTML = '<div class="loading">कोई पोस्ट नहीं मिली</div>';
    return;
  }
  
  var html = '';
  postsArray.forEach(function(post) {
    html += createPostCardHTML(post);
  });
  
  feed.innerHTML = html;
}

function createPostCardHTML(post) {
  var isLiked = likedPosts.indexOf(post.id) !== -1;
  
  var categoryLabels = {
    'daily-tip': 'डेली टिप',
    'market-price': 'मंडी भाव',
    'weather-alert': 'मौसम',
    'government-scheme': 'सरकारी योजना',
    'pest-control': 'कीट नियंत्रण',
    'crop-advice': 'फसल सलाह',
    'irrigation': 'सिंचाई',
    'organic-farming': 'जैविक खेती',
    'fertilizer': 'खाद',
    'equipment': 'उपकरण',
    'success-story': 'सफलता',
    'animal-husbandry': 'पशुपालन',
    'general': 'सामान्य'
  };
  
  var categoryLabel = categoryLabels[post.category] || post.category || 'सामान्य';
  var heartIcon = isLiked ? '<span style="color:#E53935;">&#9829;</span>' : '<span>&#9825;</span>';
  
  return '<div class="post-card" data-post-id="' + post.id + '">' +
    '<div class="post-header">' +
      '<span class="post-category">' + categoryLabel + '</span>' +
      '<span class="post-date">' + formatDate(post.createdAt) + '</span>' +
    '</div>' +
    '<h3 class="post-title">' + escapeHtml(post.title) + '</h3>' +
    '<p class="post-content">' + escapeHtml(post.content) + '</p>' +
    '<div class="post-footer">' +
      '<span class="post-author">— ' + escapeHtml(post.author) + '</span>' +
      '<div class="post-actions">' +
        '<button class="like-btn' + (isLiked ? ' liked' : '') + '" onclick="likePost(\'' + post.id + '\')">' +
          heartIcon + ' <span class="like-count">' + (post.likes || 0) + '</span>' +
        '</button>' +
        '<span class="view-count">&#128065; ' + (post.views || 0) + '</span>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderTrending(postsArray) {
  const el = document.getElementById('trending-list');
  if (!el || !postsArray) return;
  
  if (postsArray.length === 0) {
    el.innerHTML = '<p>कोई ट्रेंडिंग पोस्ट नहीं</p>';
    return;
  }
  
  var html = '';
  postsArray.slice(0, 5).forEach(function(p) {
    var content = (p.content || '').substring(0, 80);
    html += '<div class="trending-item">' +
      '<div class="trending-content">' + escapeHtml(content) + '...</div>' +
      '<div class="trending-meta">' +
        '<span>&#128065; ' + (p.views || 0) + '</span>' +
        '<span>&#9829; ' + (p.likes || 0) + '</span>' +
      '</div>' +
    '</div>';
  });
  
  el.innerHTML = html;
}


// ============ UTILITY FUNCTIONS ============

function formatDate(dateStr) {
  if (!dateStr) return '';
  
  try {
    var date = new Date(dateStr);
    var now = new Date();
    var diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'अभी';
    if (diff < 3600) return Math.floor(diff / 60) + ' मिनट पहले';
    if (diff < 86400) return Math.floor(diff / 3600) + ' घंटे पहले';
    if (diff < 604800) return Math.floor(diff / 86400) + ' दिन पहले';
    
    return date.toLocaleDateString('hi-IN');
  } catch (e) {
    return '';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// ============ ACTIONS ============

function likePost(postId) {
  if (likedPosts.indexOf(postId) !== -1) {
    showToast('आपने पहले ही लाइक किया है');
    return;
  }
  
  // Emit to socket
  if (socket) {
    socket.emit('likePost', { postId: postId, sessionId: sessionId });
  }
  
  // Update local state
  likedPosts.push(postId);
  localStorage.setItem('farmlab_liked', JSON.stringify(likedPosts));
  
  // Update UI
  var btn = document.querySelector('[data-post-id="' + postId + '"] .like-btn');
  if (btn) {
    btn.classList.add('liked');
    var countEl = btn.querySelector('.like-count');
    var currentCount = countEl ? (parseInt(countEl.textContent) || 0) : 0;
    var newCount = currentCount + 1;
    btn.innerHTML = '<span style="color:#E53935;">&#9829;</span> <span class="like-count">' + newCount + '</span>';
  }
  
  showToast('धन्यवाद!');
}

// ============ SHARE FUNCTIONS ============

function shareWhatsApp() {
  var text = 'FarmLab - किसानों के लिए कृषि पोर्टल। दैनिक टिप्स, मंडी भाव और बहुत कुछ!';
  var url = window.location.href;
  window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank');
}

function shareFacebook() {
  var url = window.location.href;
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url), '_blank');
}
