// ── Styles ──────────────────────────────────
import './styles/variables.css';
import './styles/sidebar.css';
import './styles/header.css';
import './styles/summary-cards.css';
import './styles/charts.css';
import './styles/transactions.css';
import './styles/insights.css';
import './styles/modal.css';
import './styles/footer.css';
import './style.css';

// ── State ───────────────────────────────────
import store from './store/store.js';

// ── Components ──────────────────────────────
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import SummaryCards from './components/SummaryCards.js';
import BalanceChart from './components/BalanceChart.js';
import SpendingChart from './components/SpendingChart.js';
import TransactionList from './components/TransactionList.js';
import Insights from './components/Insights.js';
import AddTransactionModal from './components/AddTransactionModal.js';
import Footer from './components/Footer.js';

// ── Build App Shell ─────────────────────────
function buildAppShell() {
  const app = document.getElementById('app');

  // Sidebar
  const sidebarEl = document.createElement('div');
  sidebarEl.id = 'sidebar-root';

  // Main content area
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';

  // Header
  const headerEl = document.createElement('div');
  headerEl.id = 'header-root';

  // Content body
  const contentBody = document.createElement('div');
  contentBody.className = 'content-body';

  // Summary cards
  const summaryEl = document.createElement('div');
  summaryEl.id = 'summary-root';

  // Balance Trend — full width
  const balanceChartEl = document.createElement('div');
  balanceChartEl.id = 'balance-chart-root';
  balanceChartEl.className = 'dashboard-fullrow';

  // Spending + Insights — 50/50 row
  const splitRow = document.createElement('div');
  splitRow.className = 'dashboard-split-row';
  splitRow.id = 'split-row-root';

  const spendingEl = document.createElement('div');
  spendingEl.id = 'spending-chart-root';
  spendingEl.className = 'dashboard-split-row__left';

  const insightsEl = document.createElement('div');
  insightsEl.id = 'insights-root';
  insightsEl.className = 'dashboard-split-row__right';

  splitRow.appendChild(spendingEl);
  splitRow.appendChild(insightsEl);

  // Transaction list
  const txnEl = document.createElement('div');
  txnEl.id = 'transactions-root';

  // Modal root (overlay — lives outside content flow)
  const modalEl = document.createElement('div');
  modalEl.id = 'modal-root';

  // Assemble content body
  contentBody.appendChild(summaryEl);
  contentBody.appendChild(balanceChartEl);
  contentBody.appendChild(splitRow);
  contentBody.appendChild(txnEl);

  // Placeholder root
  const placeholderEl = document.createElement('div');
  placeholderEl.id = 'placeholder-root';
  placeholderEl.className = 'placeholder-view';
  
  const placeholderContent = document.createElement('div');
  placeholderContent.className = 'placeholder-view__content';
  
  const placeholderTitle = document.createElement('h2');
  placeholderTitle.textContent = 'Module Under Development';
  
  const placeholderDesc = document.createElement('p');
  placeholderDesc.textContent = 'The ';
  
  const placeholderNameSpan = document.createElement('span');
  placeholderNameSpan.id = 'placeholder-name';
  placeholderNameSpan.style.fontWeight = 'bold';
  
  placeholderDesc.appendChild(placeholderNameSpan);
  placeholderDesc.appendChild(document.createTextNode(' module is currently a work in progress.'));
  
  const backBtn = document.createElement('button');
  backBtn.className = 'txn-add-btn';
  backBtn.style.marginTop = '24px';
  backBtn.style.display = 'inline-flex';
  backBtn.textContent = 'Back to Dashboard';
  backBtn.addEventListener('click', () => {
    store.currentView = 'overview';
  });
  
  placeholderContent.appendChild(placeholderTitle);
  placeholderContent.appendChild(placeholderDesc);
  placeholderContent.appendChild(backBtn);
  placeholderEl.appendChild(placeholderContent);

  contentBody.appendChild(placeholderEl);

  // Footer
  const footerEl = document.createElement('div');
  footerEl.id = 'footer-root';

  mainContent.appendChild(headerEl);
  mainContent.appendChild(contentBody);
  mainContent.appendChild(footerEl);

  app.appendChild(sidebarEl);

  // Mobile sidebar overlay backdrop
  const sidebarOverlay = document.createElement('div');
  sidebarOverlay.className = 'sidebar-overlay';
  sidebarOverlay.addEventListener('click', () => {
    const sidebarEl = document.querySelector('.sidebar');
    if (sidebarEl) sidebarEl.classList.remove('sidebar--open');
    sidebarOverlay.classList.remove('sidebar-overlay--open');
  });
  app.appendChild(sidebarOverlay);

  app.appendChild(mainContent);
  app.appendChild(modalEl);
}

// ── Initialize ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildAppShell();

  const sidebar = new Sidebar('sidebar-root');
  const header = new Header('header-root');
  const summaryCards = new SummaryCards('summary-root');
  const balanceChart = new BalanceChart('balance-chart-root');
  const spendingChart = new SpendingChart('spending-chart-root');
  const insights = new Insights('insights-root');
  const modal = new AddTransactionModal('modal-root');
  const transactionList = new TransactionList('transactions-root', modal);
  const footer = new Footer('footer-root');

  // Initialize theme
  if (store.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // View Switcher logic
  function updateView() {
    const isOverview = store.currentView === 'overview';
    const isTransactions = store.currentView === 'transactions';
    const isPlaceholder = !isOverview && !isTransactions;

    document.getElementById('summary-root').style.display = isOverview ? 'block' : 'none';
    document.getElementById('balance-chart-root').style.display = isOverview ? 'block' : 'none';
    document.getElementById('split-row-root').style.display = isOverview ? 'grid' : 'none';
    document.getElementById('transactions-root').style.display = isOverview || isTransactions ? 'block' : 'none';
    
    const placeholderEl = document.getElementById('placeholder-root');
    if (placeholderEl) {
      placeholderEl.style.display = isPlaceholder ? 'flex' : 'none';
      if (isPlaceholder) {
        document.getElementById('placeholder-name').textContent = store.currentView.charAt(0).toUpperCase() + store.currentView.slice(1);
      }
    }
  }

  // Initial view
  updateView();

  document.addEventListener('stateChange', (e) => {
    if (e.detail.property === 'currentView') {
      updateView();
    }
    if (e.detail.property === 'darkMode') {
      if (store.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  });

  sidebar.mount();
  header.mount();
  summaryCards.mount();
  balanceChart.mount();
  spendingChart.mount();
  insights.mount();
  modal.mount();
  transactionList.mount();
  footer.mount();

  console.log('[Zorvyn] Dashboard mounted', { role: store.userRole });
});
