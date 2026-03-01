'use strict';

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

// ─── LocalStorage ─────────────────────────────────────────────────────────────

function saveInventory() {
  localStorage.setItem('d2-rune-inventory', JSON.stringify(inventory));
}

function loadInventory() {
  const saved = localStorage.getItem('d2-rune-inventory');
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    for (const id of Object.keys(inventory)) {
      if (typeof parsed[id] === 'number') inventory[id] = parsed[id];
    }
  } catch (e) {
    // ignore corrupt data
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

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadInventory();
  renderRuneGrid();
  renderRunewordsPanel();
  renderUpgradesPanel();
  initFilters();
  initSlotFilter();
});
