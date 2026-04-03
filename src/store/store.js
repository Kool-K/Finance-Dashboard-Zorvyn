// Reactive State Store with localStorage persistence
const STORAGE_KEY = 'zorvyn_store';

// ── Default mock data ─────────────────────────
const defaultData = {
  userRole: 'Viewer',
  balance: 1248500.00,
  transactions: [
    {
      id: 'txn-001',
      date: '2026-03-28',
      title: 'Quarterly Revenue Deposit',
      category: 'Revenue',
      amount: 485000.00,
      type: 'income',
    },
    {
      id: 'txn-002',
      date: '2026-03-25',
      title: 'Cloud Infrastructure — AWS',
      category: 'Operations',
      amount: 32450.00,
      type: 'expense',
    },
    {
      id: 'txn-003',
      date: '2026-03-22',
      title: 'Client Payment — Acme Corp',
      category: 'Revenue',
      amount: 127800.00,
      type: 'income',
    },
    {
      id: 'txn-004',
      date: '2026-03-18',
      title: 'Payroll Processing — March',
      category: 'Payroll',
      amount: 215000.00,
      type: 'expense',
    },
    {
      id: 'txn-005',
      date: '2026-03-15',
      title: 'Software Licenses Renewal',
      category: 'Software',
      amount: 8750.00,
      type: 'expense',
    },
  ],
  filters: {
    type: 'All',
    search: '',
  },
  currentView: 'overview',
  darkMode: true,
  hasNotifications: true,
};

// ── Load persisted state or fall back to defaults ──
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge to ensure any new keys from defaults are present
      return { ...defaultData, ...parsed };
    }
  } catch (err) {
    console.warn('[Store] Failed to load from localStorage, using defaults', err);
  }
  return { ...defaultData };
}

// ── Persist to localStorage ────────────────────
function saveState(data) {
  try {
    // Only persist meaningful data, not filters
    const toSave = {
      userRole: data.userRole,
      balance: data.balance,
      transactions: data.transactions,
      currentView: data.currentView,
      darkMode: data.darkMode,
      hasNotifications: data.hasNotifications,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn('[Store] Failed to save to localStorage', err);
  }
}

// ── Create reactive Proxy ──────────────────────
const stateData = loadState();

const store = new Proxy(stateData, {
  set(target, property, value) {
    const oldValue = target[property];
    target[property] = value;

    console.log(
      `%c[Store] %c${property} %cupdated`,
      'color: #10b981; font-weight: bold;',
      'color: #f8fafc;',
      'color: #94a3b8;',
      { old: oldValue, new: value }
    );

    // Persist after every change
    saveState(target);

    document.dispatchEvent(
      new CustomEvent('stateChange', {
        detail: { property, value, oldValue },
      })
    );

    return true;
  },
});

export default store;
