// ============================================================
// COOMES — script.js
// Blocs : burger · panier · rôle toggle · signup · login
//         filtre boutique · retour en haut · i18n
// ============================================================

// ─── 1. Menu burger ─────────────────────────────────────────
const burgerBtn  = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// ─── 2. Panier ──────────────────────────────────────────────
// Stockage en mémoire (sessionStorage pour persistance onglet)
function getCart() {
  try { return JSON.parse(sessionStorage.getItem('coomes_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  sessionStorage.setItem('coomes_cart', JSON.stringify(cart));
}

// Injecte l'icône panier dans .nav-actions si elle n'existe pas
function injectCartIcon() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions || document.getElementById('cartBtn')) return;

  const cartBtn = document.createElement('button');
  cartBtn.id = 'cartBtn';
  cartBtn.className = 'cart-btn';
  cartBtn.setAttribute('aria-label', 'Voir le panier');
  cartBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
    <span class="cart-count" id="cartCount">0</span>`;
  // Insérer avant le bouton burger
  const burger = navActions.querySelector('.burger');
  navActions.insertBefore(cartBtn, burger || null);

  // Injecter les styles du panier
  injectCartStyles();

  cartBtn.addEventListener('click', toggleCartSidebar);
}

function injectCartStyles() {
  if (document.getElementById('coomes-cart-style')) return;
  const style = document.createElement('style');
  style.id = 'coomes-cart-style';
  style.textContent = `
    .cart-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      border: 1.5px solid var(--sand-deep, #d4deca);
      background: transparent;
      cursor: pointer;
      transition: background 0.18s, border-color 0.18s;
      color: var(--ink, #1a2a14);
    }
    .cart-btn:hover { background: var(--sand, #f5efe0); border-color: var(--olive, #01796F); }
    .cart-count {
      position: absolute;
      top: -5px; right: -5px;
      background: var(--clay, #568203);
      color: #fff;
      font-size: 0.68rem;
      font-weight: 700;
      width: 18px; height: 18px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .cart-count.visible { opacity: 1; }

    /* Sidebar panier */
    .cart-sidebar {
      position: fixed;
      top: 0; right: -420px;
      width: 380px; max-width: 95vw;
      height: 100dvh;
      background: #fff;
      box-shadow: -4px 0 32px rgba(0,0,0,0.12);
      z-index: 500;
      display: flex; flex-direction: column;
      transition: right 0.3s ease;
      font-family: var(--font-body, 'Public Sans', sans-serif);
    }
    .cart-sidebar.open { right: 0; }
    .cart-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 499;
    }
    .cart-overlay.open { display: block; }

    .cart-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 22px;
      border-bottom: 1px solid #eee;
    }
    .cart-header h2 {
      font-family: var(--font-display, 'Fraunces', serif);
      font-size: 1.15rem;
      color: var(--forest, #006233);
      margin: 0;
    }
    .cart-close {
      width: 36px; height: 36px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 1.4px solid #ddd;
      cursor: pointer;
      transition: background 0.15s;
    }
    .cart-close:hover { background: #f5f5f5; }

    .cart-body { flex: 1; overflow-y: auto; padding: 16px 22px; }
    .cart-empty {
      text-align: center;
      padding: 60px 0;
      color: #7a8c6e;
      font-size: 0.95rem;
    }
    .cart-empty svg { margin: 0 auto 14px; opacity: 0.35; }

    .cart-item {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .cart-item-info { flex: 1; }
    .cart-item-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--ink, #1a2a14);
      margin-bottom: 4px;
    }
    .cart-item-coop { font-size: 0.78rem; color: #7a8c6e; }
    .cart-item-price { font-size: 0.88rem; font-weight: 700; color: var(--forest, #006233); }
    .cart-item-qty {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.85rem;
      margin-top: 6px;
    }
    .cart-item-qty button {
      width: 24px; height: 24px;
      border-radius: 50%;
      border: 1.2px solid #ccc;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-size: 1rem; line-height: 1;
      transition: background 0.15s;
    }
    .cart-item-qty button:hover { background: #f0f0f0; }
    .cart-item-remove {
      width: 28px; height: 28px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      color: #b44;
      transition: background 0.15s;
    }
    .cart-item-remove:hover { background: #fff0f0; }

    .cart-footer {
      padding: 18px 22px;
      border-top: 1px solid #eee;
    }
    .cart-total {
      display: flex; justify-content: space-between;
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 14px;
      color: var(--ink, #1a2a14);
    }
    .cart-footer .btn {
      width: 100%;
      padding: 14px;
      border-radius: 100px;
      font-size: 0.95rem;
      font-weight: 600;
      text-align: center;
      background: var(--pine, #0B6E4F);
      color: #fff;
      cursor: pointer;
      transition: background 0.18s;
    }
    .cart-footer .btn:hover { background: var(--forest, #006233); }
    .cart-footer .btn-ghost {
      display: block;
      margin-top: 10px;
      text-align: center;
      font-size: 0.85rem;
      color: var(--forest, #006233);
      text-decoration: underline;
      cursor: pointer;
      background: none;
      border-radius: 0;
    }

    /* Toast notification */
    .cart-toast {
      position: fixed;
      bottom: 28px; left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--pine, #0B6E4F);
      color: #fff;
      padding: 11px 22px;
      border-radius: 100px;
      font-size: 0.88rem;
      font-weight: 600;
      z-index: 600;
      opacity: 0;
      transition: opacity 0.25s, transform 0.25s;
      pointer-events: none;
      white-space: nowrap;
    }
    .cart-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* Bouton retour en haut */
    .back-to-top {
      position: fixed;
      bottom: 28px; right: 24px;
      width: 44px; height: 44px;
      border-radius: 50%;
      background: var(--forest, #006233);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s, transform 0.25s;
      z-index: 400;
      border: none;
    }
    .back-to-top.visible { opacity: 1; pointer-events: auto; }
    .back-to-top:hover { transform: translateY(-3px); }

    /* Connexion modal */
    .login-modal-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.42);
      z-index: 600;
      align-items: center; justify-content: center;
    }
    .login-modal-overlay.open { display: flex; }
    .login-modal {
      background: #fff;
      border-radius: 18px;
      padding: 36px;
      width: 380px; max-width: 94vw;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      position: relative;
      font-family: var(--font-body, 'Public Sans', sans-serif);
    }
    .login-modal h2 {
      font-family: var(--font-display, 'Fraunces', serif);
      color: var(--forest, #006233);
      font-size: 1.35rem;
      margin: 0 0 6px;
    }
    .login-modal p.sub { font-size: 0.88rem; color: #5c6a52; margin: 0 0 22px; }
    .login-modal .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .login-modal .field label { font-size: 0.83rem; font-weight: 600; color: var(--forest, #006233); }
    .login-modal .field input {
      font-family: inherit; font-size: 0.94rem;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1.4px solid #d4deca;
      background: #fafdf8;
      color: var(--ink, #1a2a14);
    }
    .login-modal .field input:focus { border-color: var(--olive, #01796F); outline: none; }
    .login-modal .btn-login {
      width: 100%;
      padding: 13px;
      border-radius: 100px;
      background: var(--pine, #0B6E4F);
      color: #fff;
      font-weight: 600;
      font-size: 0.94rem;
      cursor: pointer;
      border: none;
      transition: background 0.18s;
    }
    .login-modal .btn-login:hover { background: var(--forest, #006233); }
    .login-modal-close {
      position: absolute; top: 14px; right: 16px;
      width: 30px; height: 30px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: #7a8c6e;
      transition: background 0.15s;
      border: none; background: none;
    }
    .login-modal-close:hover { background: #f5f5f5; }
    .login-modal .switch-link {
      display: block;
      margin-top: 14px;
      text-align: center;
      font-size: 0.85rem;
      color: #5c6a52;
    }
    .login-modal .switch-link a {
      color: var(--forest, #006233);
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
    }
    .login-success {
      display: none;
      text-align: center;
      padding: 20px 0;
    }
    .login-success.show { display: block; }
    .login-success svg { margin: 0 auto 12px; color: var(--forest, #006233); }
    .login-success h3 { color: var(--forest, #006233); font-family: var(--font-display, serif); margin: 0 0 8px; }
    .login-success p { font-size: 0.88rem; color: #5c6a52; }
  `;
  document.head.appendChild(style);
}

// Crée la sidebar panier dans le DOM
function createCartSidebar() {
  if (document.getElementById('cartSidebar')) return;

  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'cartOverlay';
  overlay.addEventListener('click', closeCartSidebar);

  const sidebar = document.createElement('div');
  sidebar.className = 'cart-sidebar';
  sidebar.id = 'cartSidebar';
  sidebar.innerHTML = `
    <div class="cart-header">
      <h2>Votre panier</h2>
      <button class="cart-close" id="cartClose" aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    <div class="cart-body" id="cartBody"></div>
    <div class="cart-footer" id="cartFooter" style="display:none;">
      <div class="cart-total">
        <span>Total</span>
        <span id="cartTotal">0 MAD</span>
      </div>
      <button class="btn" onclick="checkoutMessage()">Passer la commande</button>
      <button class="btn-ghost" onclick="clearCart()">Vider le panier</button>
    </div>`;

  document.body.appendChild(overlay);
  document.body.appendChild(sidebar);

  document.getElementById('cartClose').addEventListener('click', closeCartSidebar);
}

// Toast notification
function showToast(msg) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.id = 'cartToast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function toggleCartSidebar() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
function closeCartSidebar() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = count;
    countEl.classList.toggle('visible', count > 0);
  }
  renderCartBody();
}

function renderCartBody() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!body) return;

  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Votre panier est vide.</p>
        <p style="font-size:0.82rem; margin-top:6px;">Ajoutez des produits depuis la boutique.</p>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  let total = 0;
  body.innerHTML = cart.map((item, idx) => {
    // Extraire le montant numérique
    const numericPrice = parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
    const lineTotal = numericPrice * item.qty;
    total += lineTotal;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-coop">${item.coop}</div>
          <div class="cart-item-qty">
            <button onclick="changeQty(${idx}, -1)" aria-label="Diminuer">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${idx}, 1)" aria-label="Augmenter">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item-price">${item.price}</div>
          <button class="cart-item-remove" onclick="removeItem(${idx})" aria-label="Supprimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>`;
  }).join('');

  if (totalEl) totalEl.textContent = total.toFixed(0) + ' MAD';
  if (footer) footer.style.display = 'block';
}

function addToCart(name, coop, price) {
  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, coop, price, qty: 1 });
  }
  saveCart(cart);
  updateCartUI();
  showToast('✓ ' + name + ' ajouté au panier');
}

function changeQty(idx, delta) {
  const cart = getCart();
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  updateCartUI();
}

function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  updateCartUI();
}

function clearCart() {
  saveCart([]);
  updateCartUI();
  showToast('Panier vidé');
}

function checkoutMessage() {
  closeCartSidebar();
  showToast('🚧 Paiement en ligne bientôt disponible — contactez-nous !');
}

// Attache les boutons "+" des cartes produit
function attachAddToCartButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = card.querySelector('.add-btn');
    if (!btn || btn.dataset.cartBound) return;
    btn.dataset.cartBound = '1';

    const name  = card.querySelector('.product-name')?.textContent.trim()  || 'Produit';
    const coop  = card.querySelector('.product-coop')?.textContent.trim()  || '';
    const price = card.querySelector('.product-price')?.textContent.trim() || '0 MAD';

    btn.addEventListener('click', () => addToCart(name, coop, price));
  });
}

// ─── 3. Bouton "Se connecter" ────────────────────────────────
function injectLoginButton() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions || document.getElementById('loginBtn')) return;

  const loginBtn = document.createElement('a');
  loginBtn.id = 'loginBtn';
  loginBtn.href = '#';
  loginBtn.className = 'btn btn-ghost-outline';
  loginBtn.setAttribute('data-i18n', 'nav_login');
  loginBtn.textContent = 'Se connecter';
  loginBtn.style.cssText = `
    display:inline-flex; align-items:center;
    padding:10px 20px; border-radius:100px;
    border:1.4px solid var(--sand-deep, #d4deca);
    font-weight:600; font-size:0.88rem;
    color:var(--forest, #006233);
    transition:background 0.18s, border-color 0.18s;
  `;
  loginBtn.addEventListener('mouseenter', () => { loginBtn.style.background = 'var(--sand, #f5efe0)'; });
  loginBtn.addEventListener('mouseleave', () => { loginBtn.style.background = ''; });

  // Insérer avant le bouton "Créer un compte"
  const createBtn = navActions.querySelector('.btn-primary');
  navActions.insertBefore(loginBtn, createBtn || null);

  loginBtn.addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });

  // Aussi dans le menu mobile
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu && !mobileMenu.querySelector('#loginBtnMobile')) {
    const mobileLogin = document.createElement('a');
    mobileLogin.id = 'loginBtnMobile';
    mobileLogin.href = '#';
    mobileLogin.textContent = 'Se connecter';
    mobileLogin.style.cssText = 'padding:12px 4px; font-weight:500; border-bottom:1px solid var(--sand-deep, #d4deca); display:block;';
    mobileLogin.addEventListener('click', (e) => { e.preventDefault(); openLoginModal(); });
    mobileMenu.insertBefore(mobileLogin, mobileMenu.firstChild);
  }
}

// Modal de connexion
function createLoginModal() {
  if (document.getElementById('loginModalOverlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'login-modal-overlay';
  overlay.id = 'loginModalOverlay';
  overlay.innerHTML = `
    <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
      <button class="login-modal-close" id="loginModalClose" aria-label="Fermer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div id="loginFormWrap">
        <h2 id="loginTitle">Se connecter</h2>
        <p class="sub">Accédez à votre espace client ou coopérative.</p>
        <form id="loginModalForm">
          <div class="field">
            <label for="lm-email">Email</label>
            <input id="lm-email" type="email" placeholder="vous@exemple.com" required>
          </div>
          <div class="field">
            <label for="lm-pass">Mot de passe</label>
            <input id="lm-pass" type="password" placeholder="Votre mot de passe" required>
          </div>
          <button type="submit" class="btn-login">Se connecter</button>
        </form>
        <span class="switch-link">Pas encore de compte ? <a href="creer-compte.html">Créer un compte</a></span>
      </div>
      <div class="login-success" id="loginSuccess">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="48" height="48">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12.5 L11 15.5 L16 9"/>
        </svg>
        <h3>Bienvenue !</h3>
        <p>Vous êtes connecté·e à votre espace COOMES.</p>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLoginModal(); });
  document.getElementById('loginModalClose').addEventListener('click', closeLoginModal);

  document.getElementById('loginModalForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulation connexion (UI demo)
    document.getElementById('loginFormWrap').style.display = 'none';
    document.getElementById('loginSuccess').classList.add('show');
    setTimeout(closeLoginModal, 2000);
  });

  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeLoginModal(); closeCartSidebar(); }
  });
}

function openLoginModal() {
  // Reset état
  const wrap = document.getElementById('loginFormWrap');
  const success = document.getElementById('loginSuccess');
  if (wrap) wrap.style.display = '';
  if (success) success.classList.remove('show');

  document.getElementById('loginModalOverlay')?.classList.add('open');
}
function closeLoginModal() {
  document.getElementById('loginModalOverlay')?.classList.remove('open');
}

// ─── 4. Rôle toggle (creer-compte) ──────────────────────────
const roleClient = document.getElementById('roleClient');
const roleCoop   = document.getElementById('roleCoop');
const signupForm = document.getElementById('signupForm');

if (roleClient && roleCoop && signupForm) {
  // Champs supplémentaires pour coopérative
  const coopFields = document.createElement('div');
  coopFields.id = 'coopFields';
  coopFields.style.display = 'none';
  coopFields.innerHTML = `
    <div class="field">
      <label for="su-coop-name">Nom de la coopérative</label>
      <input id="su-coop-name" type="text" placeholder="Ex : Coop. Tighanimine">
    </div>
    <div class="field">
      <label for="su-coop-region">Région</label>
      <input id="su-coop-region" type="text" placeholder="Ex : Souss-Massa">
    </div>
    <div class="field">
      <label for="su-coop-odco">N° ODCO (si disponible)</label>
      <input id="su-coop-odco" type="text" placeholder="Numéro d'enregistrement">
    </div>`;

  // Insérer avant le bouton submit
  const submitBtn = signupForm.querySelector('button[type="submit"]');
  if (submitBtn) signupForm.insertBefore(coopFields, submitBtn);

  roleClient.addEventListener('click', () => {
    roleClient.classList.add('active');
    roleCoop.classList.remove('active');
    coopFields.style.display = 'none';
  });
  roleCoop.addEventListener('click', () => {
    roleCoop.classList.add('active');
    roleClient.classList.remove('active');
    coopFields.style.display = 'block';
  });
}

// ─── 5. Formulaire signup ────────────────────────────────────
const signupSuccess = document.getElementById('signupSuccess');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (signupSuccess) signupSuccess.classList.add('show');
    signupForm.style.opacity = '0.4';
    signupForm.style.pointerEvents = 'none';
    showToast('✓ Compte créé — bienvenue chez COOMES !');
  });
}

// ─── 6. Formulaire connexion coopérative (espace-cooperative) ─
const coopLoginForm = document.getElementById('coopLoginForm');
if (coopLoginForm) {
  coopLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = coopLoginForm.querySelector('button[type="submit"]');
    if (btn) btn.textContent = 'Connexion en cours…';
    setTimeout(() => {
      showToast('✓ Connexion réussie — espace coopérative bientôt disponible');
      if (btn) btn.textContent = 'Se connecter';
      coopLoginForm.reset();
    }, 1200);
  });
}

// ─── 7. Filtre boutique ──────────────────────────────────────
const shopFilters = document.getElementById('shopFilters');
const shopGrid    = document.getElementById('shopGrid');
const noResults   = document.getElementById('noResults');
if (shopFilters && shopGrid) {
  shopFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    shopFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const cards = shopGrid.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach(card => {
      const match = filter === 'all'
        || card.dataset.cat === filter
        || card.dataset.region === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  });
}

// ─── 8. Bouton retour en haut ────────────────────────────────
function injectBackToTop() {
  if (document.getElementById('backToTop')) return;
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Retour en haut');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="20" height="20">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>`;
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 340);
  }, { passive: true });
}

// ─── 9. Régions → lien vers boutique filtrée ─────────────────
function attachRegionLinks() {
  const regionMap = {
    'Souss-Massa':         'boutique.html?region=Souss-Massa',
    'Drâa-Tafilalet':      'boutique.html?region=Dr%C3%A2a-Tafilalet',
    'Marrakech-Safi':      'boutique.html?region=Marrakech-Safi',
    'Fès-Meknès':          'boutique.html?region=F%C3%A8s-Mekn%C3%A8s',
    'Béni Mellal-Khénifra':'boutique.html?region=B%C3%A9ni%20Mellal-Kh%C3%A9nifra',
    'Oriental':            'boutique.html?region=Oriental',
  };

  document.querySelectorAll('.region-row').forEach(row => {
    const nameEl = row.querySelector('.region-name');
    if (!nameEl) return;
    const text = nameEl.textContent;
    for (const [key, url] of Object.entries(regionMap)) {
      if (text.includes(key)) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => { window.location.href = url; });
        break;
      }
    }
  });
}

// Lire le paramètre region depuis l'URL sur la page boutique
function applyRegionFilterFromURL() {
  if (!shopFilters) return;
  const params = new URLSearchParams(window.location.search);
  const region = params.get('region');
  if (!region) return;

  // Chercher le bouton filtre correspondant
  const btn = [...shopFilters.querySelectorAll('.filter-btn')]
    .find(b => b.dataset.filter === region);
  if (btn) {
    btn.click();
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ─── 10. Internationalisation ─────────────────────────────────
const TRANSLATIONS = {
  fr: {
    lang_choose: 'Langue :',
    nav_apropos: 'À propos',
    nav_boutique: 'Notre boutique',
    nav_regions: 'Les régions',
    nav_contact: 'Nous contacter',
    nav_compte: 'Créer un compte',
    nav_login: 'Se connecter',
    footer_tag: 'La marchandisation des produits des coopératives marocaines — terroir, économie sociale et solidaire, emballages recyclés.',
    footer_nav: 'Navigation', footer_legal: 'Légal', footer_coops: 'Coopératives',
    footer_mentions: 'Mentions légales', footer_cgv: 'Conditions de vente',
    footer_privacy: 'Politique de confidentialité', footer_rejoindre: 'Rejoindre COOMES',
    footer_charte: 'Charte qualité', footer_espace: 'Espace coopérative',
    footer_copy: '© 2026 COOMES — Plateforme marchande des coopératives marocaines.',
    footer_made: 'Conçu avec le vert des oliviers et des terres de l\'Atlas.',
    eyebrow_boutique: 'La boutique',
    hero_boutique_title: 'Produits du terroir, directs des coopératives.',
    hero_boutique_lead: 'Filtrez par catégorie ou région. Chaque produit affiche sa coopérative d\'origine — la traçabilité fait partie de la fiche, pas une mention en petit.',
    filter_all: 'Tout', filter_alimentaire: 'Alimentaire', filter_artisanat: 'Artisanat', filter_cosmetique: 'Cosmétique',
    no_results: 'Aucun produit ne correspond à ce filtre.', voir_catalogue: 'Voir tout le catalogue',
    eyebrow_avantages: 'Avantages membres', club_title: 'Le Club COOMES',
    eyebrow_regions: 'Les régions',
    hero_regions_title: 'Une carte tenue par les coopératives, pas par nous.',
    hero_regions_lead: 'Chaque région du catalogue correspond à des coopératives réelles. Survolez une ligne pour voir sa spécialité.',
    map_caption: 'Carte stylisée — repères illustratifs, non géographiquement précis.',
    reg_souss_spec: 'Argan, agrumes, élevage caprin', reg_draa_spec: 'Safran, dattes, plantes aromatiques',
    reg_marrakech_spec: 'Poterie, huile d\'olive, tissage', reg_fes_spec: 'Huile d\'olive, miel, fromage de chèvre',
    reg_beni_spec: 'Tapis, laine, miel de montagne', reg_oriental_spec: 'Céréales, couscous, figues séchées',
    reg_tanger_spec: 'Fromages, thé à la menthe, artisanat du Rif', reg_laayoune_spec: 'Produits de la mer, artisanat sahraoui',
    prod_argan: 'Huile d\'argan bio', prod_safran: 'Safran de Taliouine', prod_miel: 'Miel de thym de montagne',
    prod_tapis: 'Tapis Boucherouite (1 m²)', prod_poterie: 'Poterie de Safi, set 4 bols',
    prod_dattes: 'Dattes Mejhoul', prod_olive: 'Huile d\'olive extra vierge', prod_couscous: 'Couscous artisanal fin',
    prod_savon: 'Savon beldi à l\'eucalyptus', prod_ghassoul: 'Ghassoul de la Moulouya',
    prod_broderie: 'Nappe brodée de Fès', prod_figues: 'Figues séchées de Taourirt',
    contact_title: 'Une question, une coopérative à proposer ?',
    contact_lead: 'Que vous soyez client, coopérative ou spécialiste, écrivez-nous — une personne vous répond, pas un robot.',
    contact_name: 'Nom complet', contact_email: 'Email', contact_subject: 'Sujet', contact_message: 'Message',
    contact_opt1: 'Question client', contact_opt2: 'Devenir coopérative partenaire',
    contact_opt3: 'Presse & partenariats', contact_opt4: 'Autre',
    contact_send: 'Envoyer le message',
    contact_siege: 'Le siège COOMES',
    contact_adresse: 'Jamai, 2ᵉ étage, n° 09, Groupe d\'habitation 10E, Complexe Al Irfane, Tanger Médina, Tanger, 90030',
    contact_horaires: 'Lundi – Samedi : 9h – 22h',
  },
  ar: {
    lang_choose: 'اللغة:', nav_apropos: 'من نحن', nav_boutique: 'متجرنا',
    nav_regions: 'الجهات', nav_contact: 'اتصل بنا', nav_compte: 'إنشاء حساب', nav_login: 'تسجيل الدخول',
    footer_tag: 'تسويق منتجات التعاونيات المغربية — منتجات الأرض، الاقتصاد الاجتماعي والتضامني، التغليف المُعاد تدويره.',
    footer_nav: 'التنقل', footer_legal: 'قانوني', footer_coops: 'التعاونيات',
    footer_mentions: 'البيانات القانونية', footer_cgv: 'شروط البيع',
    footer_privacy: 'سياسة الخصوصية', footer_rejoindre: 'الانضمام إلى COOMES',
    footer_charte: 'ميثاق الجودة', footer_espace: 'فضاء التعاونية',
    footer_copy: '© 2026 COOMES — منصة تجارة التعاونيات المغربية.',
    footer_made: 'مصمم بخضرة الزيتون وتربة الأطلس.',
    eyebrow_boutique: 'المتجر', hero_boutique_title: 'منتجات الأرض، مباشرة من التعاونيات.',
    hero_boutique_lead: 'صفّي حسب الفئة أو الجهة. كل منتج يُبيّن تعاونيته الأصلية.',
    filter_all: 'الكل', filter_alimentaire: 'غذائي', filter_artisanat: 'صناعة تقليدية', filter_cosmetique: 'تجميل',
    no_results: 'لا توجد منتجات تطابق هذا الفلتر.', voir_catalogue: 'عرض الكتالوج الكامل',
    eyebrow_avantages: 'مزايا الأعضاء', club_title: 'نادي COOMES',
    eyebrow_regions: 'الجهات', hero_regions_title: 'خريطة تُحددها التعاونيات، لا نحن.',
    hero_regions_lead: 'كل جهة في الكتالوج تقابل تعاونيات حقيقية.',
    map_caption: 'خريطة توضيحية — معالم تقريبية غير جغرافية دقيقة.',
    reg_souss_spec: 'الأركان، الحمضيات، تربية الماعز', reg_draa_spec: 'الزعفران، التمور، النباتات العطرية',
    reg_marrakech_spec: 'الفخار، زيت الزيتون، النسيج', reg_fes_spec: 'زيت الزيتون، العسل، جبن الماعز',
    reg_beni_spec: 'الزرابي، الصوف، عسل الجبل', reg_oriental_spec: 'الحبوب، الكسكس، التين المجفف',
    reg_tanger_spec: 'الأجبان، شاي النعناع، حرف الريف', reg_laayoune_spec: 'منتجات البحر، الصناعة التقليدية الصحراوية',
    prod_argan: 'زيت الأركان العضوي', prod_safran: 'زعفران تالوين', prod_miel: 'عسل الزعتر الجبلي',
    prod_tapis: 'زربية بوشرويط (١ م²)', prod_poterie: 'فخار آسفي، مجموعة ٤ أكواب',
    prod_dattes: 'تمور المجهول', prod_olive: 'زيت زيتون بكر ممتاز', prod_couscous: 'كسكس حرفي ناعم',
    prod_savon: 'صابون بلدي بالإكاليبتوس', prod_ghassoul: 'غاسول من ملوية',
    prod_broderie: 'مفرش مطرز من فاس', prod_figues: 'تين مجفف من تاوريرت',
    contact_title: 'سؤال، أو تعاونية تريد اقتراحها؟',
    contact_lead: 'سواء كنت عميلاً، تعاونية أو متخصصاً، راسلنا — سيجيبك إنسان، لا روبوت.',
    contact_name: 'الاسم الكامل', contact_email: 'البريد الإلكتروني', contact_subject: 'الموضوع', contact_message: 'الرسالة',
    contact_opt1: 'سؤال عميل', contact_opt2: 'الانضمام كتعاونية شريكة',
    contact_opt3: 'الصحافة والشراكات', contact_opt4: 'أخرى',
    contact_send: 'إرسال الرسالة', contact_siege: 'مقر COOMES',
    contact_adresse: 'جماعي، الطابق الثاني، رقم 09، مجموعة سكنية 10E، مجمع الإرفان، مدينة طنجة، طنجة، 90030',
    contact_horaires: 'الاثنين – السبت: 9ص – 10م',
  },
  amz: {
    lang_choose: 'Tutlayt:', nav_apropos: 'Fell neɣ', nav_boutique: 'Adukan nneɣ',
    nav_regions: 'Timnaḍin', nav_contact: 'Mɣer-d', nav_compte: 'Rnu amiḍan', nav_login: 'Kcem',
    footer_tag: 'Timarna n tiwacunin timarokkiyin — akal, tiɣrit, iẓuran ilelliyen.',
    footer_nav: 'Asegzi', footer_legal: 'Asenqed', footer_coops: 'Tiwacunin',
    footer_mentions: 'Iɣalen n usenfar', footer_cgv: 'Isertanen n tezɣelt',
    footer_privacy: 'Tasertit n tɣellist', footer_rejoindre: 'Smuqel COOMES',
    footer_charte: 'Tafrant n unɣan', footer_espace: 'Tafṣut n twacunt',
    footer_copy: '© 2026 COOMES — Taɣult n tiwacunin timarokkiyin.',
    footer_made: 'Yettwarnu s azegzaw n uzemmur d umaḍal n Atalas.',
    eyebrow_boutique: 'Adukan', hero_boutique_title: 'Timarna n ukal, seg tiwacunin akk.',
    hero_boutique_lead: 'Suter s tafart neɣ tamaḍit. Yal amḍan isken twacunt-is.',
    filter_all: 'Akk', filter_alimentaire: 'Amesway', filter_artisanat: 'Tazreft', filter_cosmetique: 'Tissuta',
    no_results: 'Ulac imḍanen yemsaden s usfuri-a.', voir_catalogue: 'Wali akk katalug',
    eyebrow_avantages: 'Tifayidin n yimseqdacen', club_title: 'Club COOMES',
    eyebrow_regions: 'Timnaḍin', hero_regions_title: 'Takarḍa yellan deg ifassen n tiwacunin.',
    hero_regions_lead: 'Yal tamaḍit deg katalug tesɛa tiwacunin tiɣaranin.',
    map_caption: 'Takarḍa n usentel — war azal ajeɣrafi.',
    reg_souss_spec: 'Argan, iẓemmaṭen, tḥergumt', reg_draa_spec: 'Zafaran, tazart, tsuqsiwin',
    reg_marrakech_spec: 'Ifexaren, zzit, azetta', reg_fes_spec: 'Zzit, tamment, agrum n tafunast',
    reg_beni_spec: 'Izerbi, tazart, tamment n udurar', reg_oriental_spec: 'Iɣdiren, seksew, tazart tebḥart',
    reg_tanger_spec: 'Fromage, atay, tazreft n Arrif', reg_laayoune_spec: 'Illas n lbaḥer, tazreft n Sṣaḥra',
    prod_argan: 'Zzit n argan (bio)', prod_safran: 'Zafaran n Taliwint', prod_miel: 'Tamment n zitar n udurar',
    prod_tapis: 'Azerbi Boucherouite (1 m²)', prod_poterie: 'Ifexaren n Asfi, 4 n imezgunen',
    prod_dattes: 'Tazart Mejhoul', prod_olive: 'Zzit n zzitun iɣan', prod_couscous: 'Seksew n ufus',
    prod_savon: 'Samu abeldi s ikawilusin', prod_ghassoul: 'Ghassoul n Mulwiyya',
    prod_broderie: 'Afrux n uzetta n Fas', prod_figues: 'Tazart tebḥart seg Tawrirt',
    contact_title: 'Asteqsi, neɣ twacunt tettawaḍ?',
    contact_lead: 'Ma tellid anmahel, twacunt neɣ anelmad, aru-aɣ — yiwen n umdan ad k-yrreḍ.',
    contact_name: 'Isem aččuran', contact_email: 'Imayl', contact_subject: 'Asutra', contact_message: 'Izen',
    contact_opt1: 'Asteqsi n umseqdac', contact_opt2: 'Ad tiliḍ twacunt tamddakelt',
    contact_opt3: 'Tasertit & tmddakkal', contact_opt4: 'Nnig',
    contact_send: 'Azen izen', contact_siege: 'Ammas n COOMES',
    contact_adresse: 'Jamai, aklal wis 2, n° 09, Tawacunt 10E, Agraw Al Irfane, Tanger Médina, Tanger, 90030',
    contact_horaires: 'Asenaṭ – Asamas: 9h – 22h',
  }
};

function setLang(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'amz' ? 'zgh' : 'fr';
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  ['fr','ar','amz'].forEach(l => {
    const b = document.getElementById('btn-' + l);
    if (b) b.classList.toggle('active', l === lang);
  });
  localStorage.setItem('coomes_lang', lang);
}

// ─── Init globale ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Panier
  injectCartIcon();
  createCartSidebar();
  attachAddToCartButtons();
  updateCartUI();

  // Connexion
  injectLoginButton();
  createLoginModal();

  // UX
  injectBackToTop();
  attachRegionLinks();
  applyRegionFilterFromURL();

  // i18n au chargement
  const stored = localStorage.getItem('coomes_lang');
  if (stored && TRANSLATIONS[stored]) setLang(stored);
});
