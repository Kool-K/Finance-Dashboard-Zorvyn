import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, Wallet, TrendingUp, TrendingDown } from 'lucide';

export default class SummaryCards extends BaseComponent {
  constructor(elementId) {
    super(elementId);
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    const wrapper = document.createElement('section');
    wrapper.className = 'summary-cards';

    const { totalIncome, totalExpense } = this._computeTotals();
    const balance = store.balance;

    const cards = [
      {
        id: 'card-balance',
        title: 'Total Balance',
        value: balance,
        icon: Wallet,
        accentClass: 'summary-card--balance',
        trend: '+12.5%',
        trendUp: true,
      },
      {
        id: 'card-income',
        title: 'Monthly Income',
        value: totalIncome,
        icon: TrendingUp,
        accentClass: 'summary-card--income',
        trend: '+8.2%',
        trendUp: true,
      },
      {
        id: 'card-expenses',
        title: 'Monthly Expenses',
        value: totalExpense,
        icon: TrendingDown,
        accentClass: 'summary-card--expense',
        trend: '-3.1%',
        trendUp: false,
      },
    ];

    cards.forEach((cardData) => {
      wrapper.appendChild(this._createCard(cardData));
    });

    this.element.appendChild(wrapper);
  }

  _createCard({ id, title, value, icon, accentClass, trend, trendUp }) {
    const card = document.createElement('article');
    card.className = 'summary-card ' + accentClass;
    card.id = id;

    // Top row: icon badge + trend
    const top = document.createElement('div');
    top.className = 'summary-card__top';

    const iconBadge = document.createElement('div');
    iconBadge.className = 'summary-card__icon-badge';
    const iconEl = createElement(icon);
    iconBadge.appendChild(iconEl);

    const trendBadge = document.createElement('span');
    trendBadge.className =
      'summary-card__trend' +
      (trendUp ? ' summary-card__trend--up' : ' summary-card__trend--down');
    trendBadge.textContent = trend;

    top.appendChild(iconBadge);
    top.appendChild(trendBadge);

    // Title
    const titleEl = document.createElement('p');
    titleEl.className = 'summary-card__title';
    titleEl.textContent = title;

    // Value
    const valueEl = document.createElement('h2');
    valueEl.className = 'summary-card__value';
    valueEl.textContent = this._formatCurrency(value);

    // Sparkline bar (decorative)
    const sparkline = document.createElement('div');
    sparkline.className = 'summary-card__sparkline';
    for (let i = 0; i < 7; i++) {
      const bar = document.createElement('span');
      bar.className = 'summary-card__spark-bar';
      const height = 20 + Math.random() * 80;
      bar.style.height = height + '%';
      sparkline.appendChild(bar);
    }

    card.appendChild(top);
    card.appendChild(titleEl);
    card.appendChild(valueEl);
    card.appendChild(sparkline);

    return card;
  }

  _computeTotals() {
    let totalIncome = 0;
    let totalExpense = 0;

    store.transactions.forEach((txn) => {
      if (txn.type === 'income') {
        totalIncome += txn.amount;
      } else {
        totalExpense += txn.amount;
      }
    });

    return { totalIncome, totalExpense };
  }

  _formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  }
}
