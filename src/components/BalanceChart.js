import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BALANCE_DATA = [980000, 1020000, 1055000, 1010000, 1095000, 1130000, 1085000, 1140000, 1175000, 1210000, 1230000, 1248500];

export default class BalanceChart extends BaseComponent {
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
    card.id = 'chart-line-card';

    const header = document.createElement('div');
    header.className = 'chart-card__header';

    const title = document.createElement('h3');
    title.className = 'chart-card__title';
    title.textContent = 'Balance Trend';

    const sub = document.createElement('span');
    sub.className = 'chart-card__subtitle';
    sub.textContent = 'Last 12 months';

    header.appendChild(title);
    header.appendChild(sub);
    card.appendChild(header);

    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'chart__canvas-wrap';

    const canvas = document.createElement('canvas');
    canvas.id = 'chart-balance-trend';
    canvasWrap.appendChild(canvas);
    card.appendChild(canvasWrap);

    this.element.appendChild(card);

    requestAnimationFrame(() => this._initChart(canvas));
  }

  _initChart(canvas) {
    const ctx = canvas.getContext('2d');
    const isDark = store.darkMode;

    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    if (isDark) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    } else {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    }

    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
    const tickColor = isDark ? '#94A3B8' : '#334155';
    const tooltipBg = isDark ? '#1e293b' : '#0f172a';

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: [{
          label: 'Balance',
          data: BALANCE_DATA,
          borderColor: '#10b981',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#10b981',
          pointHoverBorderColor: isDark ? '#0f172a' : '#fff',
          pointHoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 4, right: 4, top: 4, bottom: 0 },
        },
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'Inter', size: 12 },
            titleColor: '#E2E8F0',
            bodyColor: '#E2E8F0',
            padding: 10,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(ctx.parsed.y),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: tickColor, font: { family: 'Inter', size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: { family: 'Inter', size: 11 },
              callback: (val) => '$' + (val / 1000) + 'k',
              maxTicksLimit: 5,
            },
            border: { display: false },
          },
        },
      },
    });
  }
}
