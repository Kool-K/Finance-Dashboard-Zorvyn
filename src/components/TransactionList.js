import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, ArrowUpRight, ArrowDownRight, Plus, Filter, Inbox, Search } from 'lucide';

const FILTER_OPTIONS = ['All', 'Income', 'Expense'];

export default class TransactionList extends BaseComponent {
  constructor(elementId, modal) {
    super(elementId);
    this.modal = modal; // reference to AddTransactionModal
  }

  render() {
    if (!this.element) return;

    if (!this._isInitialized) {
      this.element.textContent = '';
      this._buildShell();
      this._isInitialized = true;
    }

    this._updateBody();
  }

  _buildShell() {
    const section = document.createElement('section');
    section.className = 'txn-section';

    // ── Header row ─────────────────────────
    const header = document.createElement('div');
    header.className = 'txn-section__header';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'txn-section__header-left';

    const title = document.createElement('h3');
    title.className = 'txn-section__title';
    title.textContent = 'Recent Transactions';

    this.countEl = document.createElement('span');
    this.countEl.className = 'txn-section__count';
    this.countEl.textContent = store.transactions.length + ' total';

    headerLeft.appendChild(title);
    headerLeft.appendChild(this.countEl);

    const headerRight = document.createElement('div');
    headerRight.className = 'txn-section__header-right';

    // Search bar
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'txn-search';

    const searchIconEl = createElement(Search);
    searchIconEl.classList.add('txn-search__icon');
    searchWrapper.appendChild(searchIconEl);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'txn-search__input';
    searchInput.placeholder = 'Search transactions…';
    searchInput.value = store.filters.search;
    searchInput.addEventListener('input', (e) => {
      store.filters = { ...store.filters, search: e.target.value };
    });
    searchWrapper.appendChild(searchInput);

    headerRight.appendChild(searchWrapper);

    // Filter pills
    this.filterGroup = document.createElement('div');
    this.filterGroup.className = 'txn-filter-group';

    const filterIconEl = createElement(Filter);
    filterIconEl.classList.add('txn-filter-group__icon');
    this.filterGroup.appendChild(filterIconEl);

    this._renderFilterBtns();

    headerRight.appendChild(this.filterGroup);

    // Admin-only: Add Transaction button
    this.addBtnContainer = document.createElement('div');
    this.addBtnContainer.className = 'txn-add-btn-container';
    this._renderAddBtn();
    headerRight.appendChild(this.addBtnContainer);

    header.appendChild(headerLeft);
    header.appendChild(headerRight);

    section.appendChild(header);

    // Dynamic Body Container
    this.bodyContainer = document.createElement('div');
    section.appendChild(this.bodyContainer);

    this.element.appendChild(section);
  }

  _renderFilterBtns() {
    // Clear old buttons
    Array.from(this.filterGroup.querySelectorAll('.txn-filter-btn')).forEach(btn => btn.remove());
    
    FILTER_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'txn-filter-btn' + (store.filters.type === opt ? ' txn-filter-btn--active' : '');
      btn.textContent = opt;
      btn.id = 'filter-' + opt.toLowerCase();
      btn.addEventListener('click', () => {
        store.filters = { ...store.filters, type: opt };
      });
      this.filterGroup.appendChild(btn);
    });
  }

  _renderAddBtn() {
    this.addBtnContainer.textContent = '';
    if (store.userRole === 'Admin') {
      const addBtn = document.createElement('button');
      addBtn.className = 'txn-add-btn';
      addBtn.id = 'btn-add-transaction';

      const plusIcon = createElement(Plus);
      addBtn.appendChild(plusIcon);

      const addLabel = document.createElement('span');
      addLabel.textContent = 'Add Transaction';
      addBtn.appendChild(addLabel);

      addBtn.addEventListener('click', () => {
        if (this.modal) this.modal.open();
      });

      this.addBtnContainer.appendChild(addBtn);
    }
  }

  _updateBody() {
    // Update count summary
    if (this.countEl) {
      this.countEl.textContent = store.transactions.length + ' total';
    }
    
    // Update active state of filter pills
    if (this.filterGroup) {
      this._renderFilterBtns();
    }
    
    // Update Add button visibility
    if (this.addBtnContainer) {
      this._renderAddBtn();
    }

    if (!this.bodyContainer) return;
    this.bodyContainer.textContent = '';

    const filtered = this._getFilteredTransactions();

    if (filtered.length === 0) {
      // ── Empty State ──────────────────────
      const empty = document.createElement('div');
      empty.className = 'txn-empty';

      const emptyIconWrap = document.createElement('div');
      emptyIconWrap.className = 'txn-empty__icon';
      const inboxIcon = createElement(Inbox);
      emptyIconWrap.appendChild(inboxIcon);

      const emptyTitle = document.createElement('p');
      emptyTitle.className = 'txn-empty__title';
      emptyTitle.textContent = 'No transactions found';

      const emptyDesc = document.createElement('p');
      emptyDesc.className = 'txn-empty__desc';

      if (store.filters.search) {
        emptyDesc.textContent = 'No results for "' + store.filters.search + '". Try a different search term.';
      } else if (store.filters.type !== 'All') {
        emptyDesc.textContent = 'No ' + store.filters.type.toLowerCase() + ' transactions to display.';
      } else {
        emptyDesc.textContent = 'Your transactions will appear here.';
      }

      empty.appendChild(emptyIconWrap);
      empty.appendChild(emptyTitle);
      empty.appendChild(emptyDesc);

      this.bodyContainer.appendChild(empty);
    } else {
      const tableWrap = document.createElement('div');
      tableWrap.className = 'table-container';

      const table = document.createElement('table');
      table.className = 'txn-table';
      table.id = 'transactions-table';

      // Table head
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      const columns = ['Transaction', 'Category', 'Date', 'Amount', 'Status'];
      columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      table.appendChild(thead);

      // Table body
      const tbody = document.createElement('tbody');
      filtered.forEach((txn) => tbody.appendChild(this._createRow(txn)));
      table.appendChild(tbody);
      tableWrap.appendChild(table);

      this.bodyContainer.appendChild(tableWrap);
    }
  }

  _createRow(txn) {
    const tr = document.createElement('tr');
    tr.className = 'txn-row';

    // Transaction (icon + title)
    const tdTitle = document.createElement('td');
    const titleWrap = document.createElement('div');
    titleWrap.className = 'txn-row__title-wrap';

    const iconBadge = document.createElement('div');
    iconBadge.className = 'txn-row__icon ' + (txn.type === 'income' ? 'txn-row__icon--income' : 'txn-row__icon--expense');
    const arrowIcon = txn.type === 'income' ? ArrowUpRight : ArrowDownRight;
    const iconEl = createElement(arrowIcon);
    iconBadge.appendChild(iconEl);

    const nameEl = document.createElement('span');
    nameEl.className = 'txn-row__name';
    nameEl.textContent = txn.title;

    titleWrap.appendChild(iconBadge);
    titleWrap.appendChild(nameEl);
    tdTitle.appendChild(titleWrap);

    // Category
    const tdCat = document.createElement('td');
    const catBadge = document.createElement('span');
    catBadge.className = 'txn-row__category';
    catBadge.textContent = txn.category;
    tdCat.appendChild(catBadge);

    // Date
    const tdDate = document.createElement('td');
    tdDate.className = 'txn-row__date';
    tdDate.textContent = this._formatDate(txn.date);

    // Amount
    const tdAmount = document.createElement('td');
    const amountEl = document.createElement('span');
    amountEl.className = 'txn-row__amount ' + (txn.type === 'income' ? 'txn-row__amount--income' : 'txn-row__amount--expense');
    const sign = txn.type === 'income' ? '+' : '-';
    amountEl.textContent = sign + this._formatCurrency(txn.amount);
    tdAmount.appendChild(amountEl);

    // Status
    const tdStatus = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = 'txn-row__status';
    statusBadge.textContent = 'Completed';
    tdStatus.appendChild(statusBadge);

    tr.appendChild(tdTitle);
    tr.appendChild(tdCat);
    tr.appendChild(tdDate);
    tr.appendChild(tdAmount);
    tr.appendChild(tdStatus);

    return tr;
  }

  /**
   * Apply type + search filters to store.transactions.
   */
  _getFilteredTransactions() {
    const { type, search } = store.filters;

    return store.transactions.filter((txn) => {
      if (type !== 'All' && txn.type !== type.toLowerCase()) return false;

      if (search && search.length > 0) {
        const q = search.toLowerCase();
        return (
          txn.title.toLowerCase().includes(q) ||
          txn.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }

  _formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }

  _formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
