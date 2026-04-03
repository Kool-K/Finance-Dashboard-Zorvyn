import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, TrendingUp, Layers, ArrowUp } from 'lucide';

export default class Insights extends BaseComponent {
  constructor(elementId) {
    super(elementId);
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    const section = document.createElement('aside');
    section.className = 'insights';

    const title = document.createElement('h3');
    title.className = 'insights__title';
    title.textContent = 'Quick Insights';
    section.appendChild(title);

    // ── Highest Spending Category ──────────
    const topCategory = this._getHighestCategory();
    const catCard = this._createInsightCard({
      icon: Layers,
      label: 'Highest Spending',
      value: topCategory.name,
      detail: this._formatCurrency(topCategory.amount),
      accentClass: 'insights-card--rose',
    });
    section.appendChild(catCard);

    // ── Monthly Comparison ─────────────────
    const compCard = this._createInsightCard({
      icon: TrendingUp,
      label: 'Monthly Comparison',
      value: '+12% vs last month',
      detail: 'Income trending upward',
      accentClass: 'insights-card--emerald',
    });
    section.appendChild(compCard);

    // ── Savings Rate ───────────────────────
    const { totalIncome, totalExpense } = this._computeTotals();
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;
    const savCard = this._createInsightCard({
      icon: ArrowUp,
      label: 'Savings Rate',
      value: savingsRate + '%',
      detail: this._formatCurrency(totalIncome - totalExpense) + ' saved',
      accentClass: 'insights-card--indigo',
    });
    section.appendChild(savCard);

    this.element.appendChild(section);
  }

  /**
   * Build a single insight mini-card.
   */
  _createInsightCard({ icon, label, value, detail, accentClass }) {
    const card = document.createElement('div');
    card.className = 'insights-card ' + accentClass;

    const top = document.createElement('div');
    top.className = 'insights-card__top';

    const iconBadge = document.createElement('div');
    iconBadge.className = 'insights-card__icon';
    const iconEl = createElement(icon);
    iconBadge.appendChild(iconEl);

    const labelEl = document.createElement('span');
    labelEl.className = 'insights-card__label';
    labelEl.textContent = label;

    top.appendChild(iconBadge);
    top.appendChild(labelEl);

    const valueEl = document.createElement('p');
    valueEl.className = 'insights-card__value';
    valueEl.textContent = value;

    const detailEl = document.createElement('span');
    detailEl.className = 'insights-card__detail';
    detailEl.textContent = detail;

    card.appendChild(top);
    card.appendChild(valueEl);
    card.appendChild(detailEl);

    return card;
  }

  /**
   * Dynamically find the highest spending category from transactions.
   */
  _getHighestCategory() {
    const categoryMap = {};
    store.transactions.forEach((txn) => {
      if (txn.type === 'expense') {
        categoryMap[txn.category] = (categoryMap[txn.category] || 0) + txn.amount;
      }
    });

    let topName = '—';
    let topAmount = 0;
    for (const [name, amount] of Object.entries(categoryMap)) {
      if (amount > topAmount) {
        topName = name;
        topAmount = amount;
      }
    }

    return { name: topName, amount: topAmount };
  }

  _computeTotals() {
    let totalIncome = 0;
    let totalExpense = 0;
    store.transactions.forEach((txn) => {
      if (txn.type === 'income') totalIncome += txn.amount;
      else totalExpense += txn.amount;
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
