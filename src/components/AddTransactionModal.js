import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, X } from 'lucide';

const CATEGORIES = ['Revenue', 'Operations', 'Payroll', 'Software', 'Marketing', 'Utilities', 'Other'];

export default class AddTransactionModal extends BaseComponent {
  constructor(elementId) {
    super(elementId);
    this.isOpen = false;
  }

  /** Open the modal */
  open() {
    this.isOpen = true;
    this.render();
  }

  /** Close the modal */
  close() {
    this.isOpen = false;
    this.render();
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    if (!this.isOpen) return;

    // ── Backdrop ───────────────────────────
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    // ── Modal Card ─────────────────────────
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'add-transaction-modal';

    // Header
    const header = document.createElement('div');
    header.className = 'modal__header';

    const title = document.createElement('h2');
    title.className = 'modal__title';
    title.textContent = 'Add Transaction';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.setAttribute('aria-label', 'Close modal');
    const closeIcon = createElement(X);
    closeBtn.appendChild(closeIcon);
    closeBtn.addEventListener('click', () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Form
    const form = document.createElement('form');
    form.className = 'modal__form';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit(form);
    });

    // Title field
    form.appendChild(this._createField('text', 'txn-title', 'Title', 'e.g. Office Rent Payment'));

    // Amount field
    form.appendChild(this._createField('number', 'txn-amount', 'Amount ($)', '0.00'));

    // Category select
    const catGroup = document.createElement('div');
    catGroup.className = 'modal__field';

    const catLabel = document.createElement('label');
    catLabel.className = 'modal__label';
    catLabel.setAttribute('for', 'txn-category');
    catLabel.textContent = 'Category';

    const catSelect = document.createElement('select');
    catSelect.className = 'modal__input';
    catSelect.id = 'txn-category';
    catSelect.required = true;

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Select category…';
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    catSelect.appendChild(defaultOpt);

    CATEGORIES.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });

    catGroup.appendChild(catLabel);
    catGroup.appendChild(catSelect);
    form.appendChild(catGroup);

    // Type toggle (Income / Expense)
    const typeGroup = document.createElement('div');
    typeGroup.className = 'modal__field';

    const typeLabel = document.createElement('label');
    typeLabel.className = 'modal__label';
    typeLabel.textContent = 'Type';

    const typeToggle = document.createElement('div');
    typeToggle.className = 'modal__type-toggle';

    const incomeBtn = document.createElement('button');
    incomeBtn.type = 'button';
    incomeBtn.className = 'modal__type-btn modal__type-btn--active';
    incomeBtn.textContent = 'Income';
    incomeBtn.dataset.type = 'income';

    const expenseBtn = document.createElement('button');
    expenseBtn.type = 'button';
    expenseBtn.className = 'modal__type-btn';
    expenseBtn.textContent = 'Expense';
    expenseBtn.dataset.type = 'expense';

    [incomeBtn, expenseBtn].forEach((btn) => {
      btn.addEventListener('click', () => {
        incomeBtn.classList.toggle('modal__type-btn--active', btn === incomeBtn);
        expenseBtn.classList.toggle('modal__type-btn--active', btn === expenseBtn);
      });
    });

    typeToggle.appendChild(incomeBtn);
    typeToggle.appendChild(expenseBtn);
    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(typeToggle);
    form.appendChild(typeGroup);

    // Submit
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'modal__submit';
    submitBtn.textContent = 'Add Transaction';
    form.appendChild(submitBtn);

    modal.appendChild(header);
    modal.appendChild(form);
    backdrop.appendChild(modal);
    this.element.appendChild(backdrop);

    // Focus first input
    requestAnimationFrame(() => {
      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }

  /**
   * Create a text/number input field group.
   */
  _createField(type, id, labelText, placeholder) {
    const group = document.createElement('div');
    group.className = 'modal__field';

    const label = document.createElement('label');
    label.className = 'modal__label';
    label.setAttribute('for', id);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = type;
    input.className = 'modal__input';
    input.id = id;
    input.placeholder = placeholder;
    input.required = true;
    if (type === 'number') {
      input.step = '0.01';
      input.min = '0.01';
    }

    group.appendChild(label);
    group.appendChild(input);
    return group;
  }

  /**
   * Handle form submission — add new transaction to store.
   */
  _handleSubmit(form) {
    const titleVal = form.querySelector('#txn-title').value.trim();
    const amountVal = parseFloat(form.querySelector('#txn-amount').value);
    const categoryVal = form.querySelector('#txn-category').value;
    const activeTypeBtn = form.querySelector('.modal__type-btn--active');
    const typeVal = activeTypeBtn ? activeTypeBtn.dataset.type : 'income';

    if (!titleVal || isNaN(amountVal) || amountVal <= 0 || !categoryVal) return;

    const newTxn = {
      id: 'txn-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: titleVal,
      category: categoryVal,
      amount: amountVal,
      type: typeVal,
    };

    // Push to a new array to trigger the Proxy setter
    store.transactions = [...store.transactions, newTxn];

    // Update balance
    if (typeVal === 'income') {
      store.balance = store.balance + amountVal;
    } else {
      store.balance = store.balance - amountVal;
    }

    this.close();
  }
}
