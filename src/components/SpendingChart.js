import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const COLORS = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  sky: '#0ea5e9',
  slate900: '#0f172a',
};

const SPENDING_DATA = [
  { label: 'Operations', value: 32450, color: COLORS.indigo },
  { label: 'Payroll', value: 215000, color: COLORS.emerald },
  { label: 'Software', value: 8750, color: COLORS.amber },
  { label: 'Marketing', value: 18300, color: COLORS.rose },
  { label: 'Utilities', value: 6200, color: COLORS.sky },
];

export default class SpendingChart extends BaseComponent {
  constructor(elementId) {
    super(elementId);
    this.chart = null;
    this.hasRendered = false;
  }

  render() {
    if (!this.element) return;
    if (this.hasRendered) return;
    this.hasRendered = true;

    this.element.textContent = '';

    const card = document.createElement('div');
    card.className = 'chart-card';
    card.id = 'chart-donut-card';

    const header = document.createElement('div');
    header.className = 'chart-card__header';

    const title = document.createElement('h3');
    title.className = 'chart-card__title';
    title.textContent = 'Spending Breakdown';

    const sub = document.createElement('span');
    sub.className = 'chart-card__subtitle';
    sub.textContent = 'By category';

    header.appendChild(title);
    header.appendChild(sub);
    card.appendChild(header);

    // Donut canvas
    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'chart__canvas-wrap chart__canvas-wrap--donut';

    const canvas = document.createElement('canvas');
    canvas.id = 'chart-spending-breakdown';
    canvasWrap.appendChild(canvas);
    card.appendChild(canvasWrap);

    // Legend
    const legendList = document.createElement('ul');
    legendList.className = 'chart__legend';
    const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

    SPENDING_DATA.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'chart__legend-item';

      const dot = document.createElement('span');
      dot.className = 'chart__legend-dot';
      dot.style.backgroundColor = item.color;

      const label = document.createElement('span');
      label.className = 'chart__legend-label';
      label.textContent = item.label;

      const val = document.createElement('span');
      val.className = 'chart__legend-value';
      val.textContent = fmt.format(item.value);

      li.appendChild(dot);
      li.appendChild(label);
      li.appendChild(val);
      legendList.appendChild(li);
    });
    card.appendChild(legendList);

    this.element.appendChild(card);

    requestAnimationFrame(() => this._initChart(canvas));
  }

  _initChart(canvas) {
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: SPENDING_DATA.map((d) => d.label),
        datasets: [{
          data: SPENDING_DATA.map((d) => d.value),
          backgroundColor: SPENDING_DATA.map((d) => d.color),
          borderColor: store.darkMode ? '#0f172a' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 8, right: 8, top: 8, bottom: 8 },
        },
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: store.darkMode ? '#1e293b' : COLORS.slate900,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'Inter', size: 12 },
            titleColor: '#E2E8F0',
            bodyColor: '#E2E8F0',
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const val = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(ctx.parsed);
                return ' ' + ctx.label + ': ' + val;
              },
            },
          },
        },
      },
    });
  }
}
