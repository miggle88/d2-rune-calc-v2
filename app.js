'use strict';

// ─── Supabase ─────────────────────────────────────────────────────────────────

const { createClient } = window.supabase;
const sb = createClient(
  'https://piaijwyorebylqvoniyf.supabase.co',
  'sb_publishable_MuLfZ_LO7426dGi_boqyXQ_D5JJv2B1',
  {
    auth: {
      lock: async (_name, _timeout, fn) => fn(),
    }
  }
);

// ─── Loading ──────────────────────────────────────────────────────────────────

let toastTimer = null;
function showSaveToast() {
  const toast = document.getElementById('save-toast');
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2000);
}

function showLoading() {
  document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ─── Auth UI ──────────────────────────────────────────────────────────────────

function initAuth() {
  const overlay   = document.getElementById('auth-overlay');
  const form      = document.getElementById('auth-form');
  const emailEl   = document.getElementById('auth-email');
  const passEl    = document.getElementById('auth-password');
  const submitBtn = document.getElementById('auth-submit');
  const errorEl   = document.getElementById('auth-error');
  const tabs      = document.querySelectorAll('.auth-tab');
  const logoutBtn = document.getElementById('logout-btn');
  const userEmailEl = document.getElementById('user-email');

  let mode = 'signin';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      mode = tab.dataset.tab;
      submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
      errorEl.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';
    submitBtn.disabled = true;

    const email    = emailEl.value.trim();
    const password = passEl.value;

    let error;
    if (mode === 'signup') {
      ({ error } = await sb.auth.signUp({ email, password }));
      if (!error) {
        errorEl.style.color = '#5a9a5a';
        errorEl.textContent = 'Check your email to confirm your account.';
        submitBtn.disabled = false;
        return;
      }
    } else {
      ({ error } = await sb.auth.signInWithPassword({ email, password }));
    }

    submitBtn.disabled = false;
    if (error) {
      errorEl.style.color = '#884444';
      errorEl.textContent = error.message;
    }
  });

  logoutBtn.addEventListener('click', async () => {
    const { error } = await sb.auth.signOut();
    if (error) console.error('Logout error:', error.message);
  });

  sb.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      overlay.classList.add('hidden');
      userEmailEl.textContent = session.user.email;
      showLoading();
      try {
        const loadStart = Date.now();
        await loadInventory(session.user.id);
        const elapsed = Date.now() - loadStart;
        if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed));
      } finally {
        hideLoading();
      }
      renderRuneGrid();
      renderRunewordsPanel();
      renderUpgradesPanel();
      if (session.user.email === ADMIN_EMAIL) showAdminNav();
    } else {
      hideLoading();
      overlay.classList.remove('hidden');
      userEmailEl.textContent = '';
      passEl.value = '';
      hideAdminNav();
      for (const id of Object.keys(inventory)) inventory[id] = 0;
      renderRuneGrid();
      renderRunewordsPanel();
      renderUpgradesPanel();
    }
  });
}

// ─── Rune Data ───────────────────────────────────────────────────────────────

const RUNES = [
  { id: 'el',    name: 'El',    glyph: 'ᛖ' },
  { id: 'eld',   name: 'Eld',   glyph: 'ᛞ' },
  { id: 'tir',   name: 'Tir',   glyph: 'ᛏ' },
  { id: 'nef',   name: 'Nef',   glyph: 'ᚾ' },
  { id: 'eth',   name: 'Eth',   glyph: 'ᛖ' },
  { id: 'ith',   name: 'Ith',   glyph: 'ᛁ' },
  { id: 'tal',   name: 'Tal',   glyph: 'ᛏ' },
  { id: 'ral',   name: 'Ral',   glyph: 'ᚱ' },
  { id: 'ort',   name: 'Ort',   glyph: 'ᚩ' },
  { id: 'thul',  name: 'Thul',  glyph: 'ᚦ' },
  { id: 'amn',   name: 'Amn',   glyph: 'ᚨ' },
  { id: 'sol',   name: 'Sol',   glyph: 'ᛋ' },
  { id: 'shael', name: 'Shael', glyph: 'ᛊ' },
  { id: 'dol',   name: 'Dol',   glyph: 'ᛞ' },
  { id: 'hel',   name: 'Hel',   glyph: 'ᚺ' },
  { id: 'io',    name: 'Io',    glyph: 'ᛁ' },
  { id: 'lum',   name: 'Lum',   glyph: 'ᛚ' },
  { id: 'ko',    name: 'Ko',    glyph: 'ᚲ' },
  { id: 'fal',   name: 'Fal',   glyph: 'ᚠ' },
  { id: 'lem',   name: 'Lem',   glyph: 'ᛚ' },
  { id: 'pul',   name: 'Pul',   glyph: 'ᛈ' },  // index 20 — gem required from here
  { id: 'um',    name: 'Um',    glyph: 'ᚢ' },
  { id: 'mal',   name: 'Mal',   glyph: 'ᛗ' },
  { id: 'ist',   name: 'Ist',   glyph: 'ᛁ' },
  { id: 'gul',   name: 'Gul',   glyph: 'ᚷ' },
  { id: 'vex',   name: 'Vex',   glyph: 'ᚹ' },
  { id: 'ohm',   name: 'Ohm',   glyph: 'ᚩ' },
  { id: 'lo',    name: 'Lo',    glyph: 'ᛚ' },
  { id: 'sur',   name: 'Sur',   glyph: 'ᛋ' },
  { id: 'ber',   name: 'Ber',   glyph: 'ᛒ' },
  { id: 'jah',   name: 'Jah',   glyph: 'ᛃ' },
  { id: 'cham',  name: 'Cham',  glyph: 'ᚲ' },
  { id: 'zod',   name: 'Zod',   glyph: 'ᛉ' },
];

// ─── Runeword Data ───────────────────────────────────────────────────────────

const RUNEWORDS = [
  // Meta / Top Tier
  { name: 'Enigma',            runes: ['jah','ith','ber'],                sockets: 3, itemTypes: ['Body Armor'],             ladderOnly: true  },
  { name: 'Infinity',          runes: ['ber','mal','ber','ist'],           sockets: 4, itemTypes: ['Polearm','Spear'],         ladderOnly: true  },
  { name: 'Grief',             runes: ['eth','tir','lo','mal','ral'],      sockets: 5, itemTypes: ['Sword','Axe'],             ladderOnly: true  },
  { name: 'Fortitude',         runes: ['el','sol','dol','lo'],             sockets: 4, itemTypes: ['Body Armor','Weapon'],     ladderOnly: true  },
  { name: 'Call to Arms',      runes: ['amn','ral','mal','ist','ohm'],     sockets: 5, itemTypes: ['Weapon'],                  ladderOnly: true  },
  { name: 'Beast',             runes: ['ber','tir','um','mal','lum'],      sockets: 5, itemTypes: ['Axe','Scepter','Hammer'],  ladderOnly: true  },
  { name: 'Faith',             runes: ['ohm','jah','lem','eld'],           sockets: 4, itemTypes: ['Bow','Crossbow'],          ladderOnly: true  },
  { name: 'Breath of the Dying', runes: ['vex','hel','el','eld','zod','eth'], sockets: 6, itemTypes: ['Weapon'],              ladderOnly: false },
  { name: 'Death',             runes: ['hel','el','vex','ort','gul'],      sockets: 5, itemTypes: ['Sword','Axe'],             ladderOnly: true  },
  { name: 'Exile',             runes: ['vex','ohm','ist','dol'],           sockets: 4, itemTypes: ['Paladin Shield'],          ladderOnly: true  },

  // High Tier
  { name: 'Chains of Honor',   runes: ['dol','um','ber','ist'],            sockets: 4, itemTypes: ['Body Armor'],             ladderOnly: true  },
  { name: 'Delirium',          runes: ['lem','ist','io'],                  sockets: 3, itemTypes: ['Helm'],                   ladderOnly: true  },
  { name: 'Dream',             runes: ['io','jah','pul'],                  sockets: 3, itemTypes: ['Helm','Shield'],          ladderOnly: true  },
  { name: 'Dragon',            runes: ['sur','lo','sol'],                  sockets: 3, itemTypes: ['Body Armor','Shield'],    ladderOnly: true  },
  { name: 'Ice',               runes: ['amn','shael','jah','lo'],          sockets: 4, itemTypes: ['Bow','Crossbow'],         ladderOnly: true  },
  { name: 'Wind',              runes: ['sur','el'],                        sockets: 2, itemTypes: ['Melee Weapon'],           ladderOnly: true  },
  { name: 'Voice of Reason',   runes: ['lem','ko','el','eld'],             sockets: 4, itemTypes: ['Sword','Mace'],           ladderOnly: true  },

  // Mid / Accessible
  { name: 'Spirit',            runes: ['tal','thul','ort','amn'],          sockets: 4, itemTypes: ['Sword','Shield'],         ladderOnly: true  },
  { name: 'Insight',           runes: ['ral','tir','tal','sol'],           sockets: 4, itemTypes: ['Polearm','Staff'],        ladderOnly: true  },
  { name: 'Lore',              runes: ['ort','sol'],                       sockets: 2, itemTypes: ['Helm'],                   ladderOnly: false },
  { name: 'Stealth',           runes: ['tal','eth'],                       sockets: 2, itemTypes: ['Body Armor'],             ladderOnly: false },
  { name: 'Leaf',              runes: ['tir','ral'],                       sockets: 2, itemTypes: ['Staff'],                  ladderOnly: false },
  { name: 'Rhyme',             runes: ['shael','eth'],                     sockets: 2, itemTypes: ['Shield'],                 ladderOnly: false },
  { name: "Ancient's Pledge",  runes: ['ral','ort','tal'],                 sockets: 3, itemTypes: ['Shield'],                 ladderOnly: false },
  { name: 'Smoke',             runes: ['nef','lum'],                       sockets: 2, itemTypes: ['Body Armor'],             ladderOnly: false },
  { name: 'Lionheart',         runes: ['hel','lum','fal'],                 sockets: 3, itemTypes: ['Body Armor'],             ladderOnly: false },
  { name: 'Treachery',         runes: ['shael','thul','lem'],              sockets: 3, itemTypes: ['Body Armor'],             ladderOnly: true  },
  { name: 'Principle',         runes: ['ral','gul','eld'],                 sockets: 3, itemTypes: ['Body Armor'],             ladderOnly: false },
  { name: 'Duress',            runes: ['shael','um','thul'],               sockets: 3, itemTypes: ['Body Armor'],             ladderOnly: true  },
  { name: 'Obedience',         runes: ['hel','ko','thul','eth','fal'],     sockets: 5, itemTypes: ['Polearm'],                ladderOnly: true  },
];

// ─── State ───────────────────────────────────────────────────────────────────

const inventory = {};
for (const rune of RUNES) inventory[rune.id] = 0;

let activeFilter = 'all';
let activeSlotFilter = 'all';
let saveDebounceTimer = null;

// ─── Inventory Persistence ────────────────────────────────────────────────────

async function saveInventory() {
  const { data: { session }, error: sessionError } = await sb.auth.getSession();
  console.log('[save] session:', session?.user?.id ?? 'none', sessionError ?? '');
  if (!session?.user) return;
  const { error } = await sb.from('rune_stash').upsert(
    { user_id: session.user.id, inventory: { ...inventory }, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
  if (error) console.error('[save] failed:', error.message, error);
  else showSaveToast();
}

async function loadInventory(userId) {
  for (const id of Object.keys(inventory)) inventory[id] = 0;
  const { data, error } = await sb.from('rune_stash')
    .select('inventory')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('Load failed:', error.message);
  if (data?.inventory) {
    for (const id of Object.keys(inventory)) {
      if (typeof data.inventory[id] === 'number') inventory[id] = data.inventory[id];
    }
  }
}

// ─── Upgrade Recipes ──────────────────────────────────────────────────────────

function getUpgradeRecipe(runeIndex) {
  if (runeIndex >= RUNES.length - 1) return null;
  return {
    input:      RUNES[runeIndex].id,
    inputCount: runeIndex >= 20 ? 2 : 3,
    requiresGem: runeIndex >= 20,
    output:     RUNES[runeIndex + 1].id,
  };
}

function calculateUpgradeTimes(runeIndex) {
  const recipe = getUpgradeRecipe(runeIndex);
  if (!recipe) return 0;
  return Math.floor((inventory[recipe.input] || 0) / recipe.inputCount);
}

// ─── Runeword Status ──────────────────────────────────────────────────────────

function calculateRunewordStatus(runeword) {
  const needed = {};
  for (const r of runeword.runes) needed[r] = (needed[r] || 0) + 1;

  let shortTypes = 0;
  for (const [runeId, count] of Object.entries(needed)) {
    if ((inventory[runeId] || 0) < count) shortTypes++;
  }

  if (shortTypes === 0) return 'can-make';
  if (shortTypes <= 2) return 'close';
  return 'cannot-make';
}

// ─── Render: Rune Grid ────────────────────────────────────────────────────────

function renderRuneGrid() {
  const grid = document.getElementById('rune-grid');
  grid.innerHTML = '';

  for (const rune of RUNES) {
    const cell = document.createElement('div');
    cell.className = 'rune-cell';
    cell.dataset.runeId = rune.id;
    if (inventory[rune.id] > 0) cell.classList.add('has-runes');

    cell.innerHTML = `
      <span class="rune-glyph">${rune.glyph}</span>
      <span class="rune-name">${rune.name}</span>
      <div class="rune-qty-wrap">
        <input
          class="rune-qty"
          type="number"
          min="0"
          value="${inventory[rune.id]}"
          data-rune-id="${rune.id}"
          title="${rune.name}"
        >
      </div>
    `;

    const input = cell.querySelector('.rune-qty');
    input.addEventListener('input', () => handleInventoryChange(rune.id, input));
    input.addEventListener('focus', () => input.select());

    grid.appendChild(cell);
  }
}

function handleInventoryChange(runeId, input) {
  const val = Math.max(0, parseInt(input.value, 10) || 0);
  inventory[runeId] = val;

  const cell = input.closest('.rune-cell');
  cell.classList.toggle('has-runes', val > 0);

  renderRunewordsPanel();
  renderUpgradesPanel();

  clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(saveInventory, 300);
}

// ─── Render: Runewords Panel ──────────────────────────────────────────────────

function renderRunewordsPanel() {
  const container = document.getElementById('runewords-list');

  const withStatus = RUNEWORDS.map(rw => ({
    rw,
    status: calculateRunewordStatus(rw),
  }));

  const order = { 'can-make': 0, 'close': 1, 'cannot-make': 2 };
  withStatus.sort((a, b) => {
    const statusDiff = order[a.status] - order[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.rw.name.localeCompare(b.rw.name);
  });

  const filtered = withStatus
    .filter(({ status }) => activeFilter === 'all' || status === activeFilter)
    .filter(({ rw }) => activeSlotFilter === 'all' || rw.itemTypes.includes(activeSlotFilter));

  container.innerHTML = '';

  for (const { rw, status } of filtered) {
    const needed = {};
    for (const r of rw.runes) needed[r] = (needed[r] || 0) + 1;

    const runeBadges = rw.runes.map(runeId => {
      const have = (inventory[runeId] || 0) >= (needed[runeId] || 0);
      return `<span class="rune-badge ${have ? 'have' : 'missing'}">${runeId.charAt(0).toUpperCase() + runeId.slice(1)}</span>`;
    }).join('');

    const ladderTag = rw.ladderOnly
      ? '<span class="rw-ladder">[Ladder]</span>'
      : '';

    const card = document.createElement('div');
    card.className = `runeword-card ${status}`;
    card.innerHTML = `
      <div class="rw-header">
        <span class="rw-name">${rw.name}${ladderTag}</span>
        <span class="rw-meta">${rw.itemTypes.join(', ')}<br>${rw.sockets}-Socket</span>
      </div>
      <div class="rw-runes">${runeBadges}</div>
    `;
    container.appendChild(card);
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim);font-size:0.75rem;padding:8px 0;">None found.</p>';
  }
}

// ─── Render: Upgrades Panel ───────────────────────────────────────────────────

function renderUpgradesPanel() {
  const container = document.getElementById('upgrades-list');
  container.innerHTML = '';

  for (let i = 0; i < RUNES.length - 1; i++) {
    const recipe = getUpgradeRecipe(i);
    const times = calculateUpgradeTimes(i);
    const canUpgrade = times > 0;

    const gemNote = recipe.requiresGem
      ? '<span class="upgrade-gem">+ Gem</span>'
      : '';

    const timesHtml = canUpgrade
      ? `<span class="upgrade-times positive">${times}x</span>`
      : `<span class="upgrade-times zero">0x</span>`;

    const row = document.createElement('div');
    row.className = `upgrade-row ${canUpgrade ? 'can-upgrade' : 'cannot-upgrade'}`;
    row.innerHTML = `
      <span class="upgrade-rune-from">${RUNES[i].name}</span>
      <span class="upgrade-count">×${recipe.inputCount}</span>
      ${gemNote}
      <span class="upgrade-arrow">→</span>
      <span class="upgrade-rune-to">${RUNES[i + 1].name}</span>
      ${timesHtml}
    `;
    container.appendChild(row);
  }
}

// ─── Filter Buttons ───────────────────────────────────────────────────────────

function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderRunewordsPanel();
    });
  });
}

function initSlotFilter() {
  const select = document.getElementById('slot-filter');

  const slotTypes = [...new Set(RUNEWORDS.flatMap(rw => rw.itemTypes))].sort();
  for (const slot of slotTypes) {
    const opt = document.createElement('option');
    opt.value = slot;
    opt.textContent = slot;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => {
    activeSlotFilter = select.value;
    renderRunewordsPanel();
  });
}

// ─── Admin Nav / View Switching ───────────────────────────────────────────────

const ADMIN_EMAIL = 'mtr293@gmail.com';

function initAdminNav() {
  const nav  = document.getElementById('admin-nav');
  const btns = nav.querySelectorAll('.nav-btn');
  const headerTitle = document.querySelector('#main-header h1');
  const headerSubtitle = document.querySelector('#main-header .subtitle');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      const isStash = view === 'stash';
      document.getElementById('view-stash').classList.toggle('hidden', !isStash);
      document.getElementById('view-feedback').classList.toggle('hidden', isStash);
      headerTitle.classList.toggle('hidden', !isStash);
      headerSubtitle.classList.toggle('hidden', !isStash);
      if (!isStash) loadAdminFeedback();
    });
  });
}

function showAdminNav() {
  document.getElementById('admin-nav').classList.remove('hidden');
}

function hideAdminNav() {
  const nav = document.getElementById('admin-nav');
  nav.classList.add('hidden');
  nav.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'stash'));
  document.getElementById('view-stash').classList.remove('hidden');
  document.getElementById('view-feedback').classList.add('hidden');
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function initFeedback() {
  const feedbackBtn    = document.getElementById('feedback-btn');
  const overlay        = document.getElementById('feedback-overlay');
  const form           = document.getElementById('feedback-form');
  const messageEl      = document.getElementById('feedback-message');
  const cancelBtn      = document.getElementById('feedback-cancel');
  const submitBtn      = document.getElementById('feedback-submit');
  const errorEl        = document.getElementById('feedback-error');

  feedbackBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    messageEl.focus();
  });

  cancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    messageEl.value = '';
    errorEl.textContent = '';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      messageEl.value = '';
      errorEl.textContent = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    errorEl.textContent = '';

    const { data: { session } } = await sb.auth.getSession();
    const category = document.getElementById('feedback-category').value;
    const { error } = await sb.from('feedback').insert({
      user_id:    session?.user?.id ?? null,
      user_email: session?.user?.email ?? 'anonymous',
      category,
      message:    messageEl.value.trim(),
    });

    submitBtn.disabled = false;
    if (error) {
      errorEl.textContent = 'Failed to send. Please try again.';
      console.error('Feedback error:', error.message);
    } else {
      overlay.classList.add('hidden');
      messageEl.value = '';
      const toast = document.getElementById('save-toast');
      const orig = toast.textContent;
      toast.textContent = 'Feedback Sent!';
      toast.classList.add('visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('visible');
        toast.textContent = orig;
      }, 2000);
    }
  });
}

let adminFeedbackData = [];
let activeAdminFilter = 'all';

function renderAdminFeedback() {
  const list = document.getElementById('admin-feedback-list');
  const items = activeAdminFilter === 'all'
    ? adminFeedbackData
    : adminFeedbackData.filter(i => i.category === activeAdminFilter);

  if (!items.length) {
    list.innerHTML = '<p class="admin-empty">No feedback found.</p>';
    return;
  }

  list.innerHTML = '';
  for (const item of items) {
    const date = new Date(item.created_at).toLocaleString();
    const card = document.createElement('div');
    card.className = 'admin-feedback-card';
    const statuses = ['open', 'in-progress', 'completed', 'canceled'];
    const statusOptions = statuses.map(s =>
      `<option value="${s}" ${item.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    card.innerHTML = `
      <div class="admin-feedback-meta">
        <span>${item.user_email} &mdash; ${date} &mdash; <span class="admin-feedback-category">${item.category}</span></span>
        <div class="admin-feedback-actions">
          <select class="feedback-status-select status-${item.status}" data-id="${item.id}">${statusOptions}</select>
          <button class="feedback-remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
      <div class="admin-feedback-msg">${item.message}</div>
    `;

    card.querySelector('.feedback-status-select').addEventListener('change', async (e) => {
      const select = e.target;
      const newStatus = select.value;
      select.className = `feedback-status-select status-${newStatus}`;
      const { error } = await sb.from('feedback')
        .update({ status: newStatus })
        .eq('id', select.dataset.id);
      if (error) console.error('Status update failed:', error.message);
      item.status = newStatus;
    });

    card.querySelector('.feedback-remove-btn').addEventListener('click', () => {
      showConfirmDelete(item.id);
    });

    list.appendChild(card);
  }
}

function initAdminFilters() {
  const btns = document.querySelectorAll('.admin-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAdminFilter = btn.dataset.category;
      renderAdminFeedback();
    });
  });
}

async function loadAdminFeedback() {
  const list = document.getElementById('admin-feedback-list');
  list.innerHTML = '<p class="admin-empty">Loading...</p>';

  const { data, error } = await sb.from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    list.innerHTML = '<p class="admin-empty">Failed to load feedback.</p>';
    return;
  }

  adminFeedbackData = data ?? [];
  renderAdminFeedback();
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────

let pendingDeleteId = null;

function showConfirmDelete(id) {
  pendingDeleteId = id;
  document.getElementById('confirm-delete-overlay').classList.remove('hidden');
}

function initConfirmDelete() {
  const overlay   = document.getElementById('confirm-delete-overlay');
  const cancelBtn = document.getElementById('confirm-delete-cancel');
  const okBtn     = document.getElementById('confirm-delete-ok');

  cancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    pendingDeleteId = null;
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      pendingDeleteId = null;
    }
  });

  okBtn.addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    okBtn.disabled = true;
    const { error } = await sb.from('feedback').delete().eq('id', pendingDeleteId);
    okBtn.disabled = false;
    if (error) {
      console.error('Delete failed:', error.message);
    } else {
      adminFeedbackData = adminFeedbackData.filter(i => i.id !== pendingDeleteId);
      renderAdminFeedback();
    }
    overlay.classList.add('hidden');
    pendingDeleteId = null;
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initAdminNav();
  initAdminFilters();
  initFeedback();
  initConfirmDelete();
  renderRuneGrid();
  renderRunewordsPanel();
  renderUpgradesPanel();
  initFilters();
  initSlotFilter();
});
