import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, LayoutDashboard, ArrowLeftRight, PieChart, Settings, HelpCircle, LogOut, ChevronLeft } from 'lucide';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, active: true },
  { label: 'Transactions', icon: ArrowLeftRight, active: false },
  { label: 'Analytics', icon: PieChart, active: false },
  { label: 'Settings', icon: Settings, active: false },
];

const BOTTOM_ITEMS = [
  { label: 'Help & Support', icon: HelpCircle },
  { label: 'Log Out', icon: LogOut },
];

export default class Sidebar extends BaseComponent {
  constructor(elementId) {
    super(elementId);
    this.activeIndex = 0;
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    // ── Brand ──────────────────────────────
    const brandWrapper = document.createElement('div');
    brandWrapper.className = 'sidebar__brand';

    const logoMark = document.createElement('div');
    logoMark.className = 'sidebar__logo-mark';
    logoMark.style.cursor = 'pointer';
    logoMark.addEventListener('click', () => {
      store.currentView = 'overview';
      this.render();
    });

    const logoImg = document.createElement('img');
    logoImg.src = '/zorvynLogo.png';
    logoImg.alt = 'Zorvyn Logo';
    logoImg.style.width = '32px';
    logoImg.style.height = '32px';
    logoImg.style.objectFit = 'contain';
    logoMark.appendChild(logoImg);

    const brandText = document.createElement('div');
    brandText.className = 'sidebar__brand-text';

    const brandName = document.createElement('span');
    brandName.className = 'sidebar__brand-name';
    brandName.textContent = 'Zorvyn';

    const brandSub = document.createElement('span');
    brandSub.className = 'sidebar__brand-sub';
    brandSub.textContent = 'Architectural Ledger';

    brandText.appendChild(brandName);
    brandText.appendChild(brandSub);
    brandWrapper.appendChild(logoMark);
    brandWrapper.appendChild(brandText);

    // Collapse button
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar__collapse-btn';
    const collapseIcon = createElement(ChevronLeft);
    collapseBtn.appendChild(collapseIcon);
    collapseBtn.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('sidebar--collapsed');
      document.getElementById('app').classList.toggle('app--collapsed');
    });
    brandWrapper.appendChild(collapseBtn);

    // ── Divider ────────────────────────────
    const divider = document.createElement('div');
    divider.className = 'sidebar__divider';

    // ── Navigation (top) ───────────────────
    const navSection = document.createElement('nav');
    navSection.className = 'sidebar__nav';

    const navLabel = document.createElement('span');
    navLabel.className = 'sidebar__section-label';
    navLabel.textContent = 'MENU';
    navSection.appendChild(navLabel);

    NAV_ITEMS.forEach((item, index) => {
      const link = this._createNavItem(item, store.currentView === item.label.toLowerCase());
      link.addEventListener('click', (e) => {
        e.preventDefault();
        store.currentView = item.label.toLowerCase();

        // Close mobile drawer on click
        const sidebarEl = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebarEl) sidebarEl.classList.remove('sidebar--open');
        if (overlay) overlay.classList.remove('sidebar-overlay--open');

        this.render();
      });
      navSection.appendChild(link);
    });

    // ── Navigation (bottom) ────────────────
    const bottomNav = document.createElement('div');
    bottomNav.className = 'sidebar__bottom';

    const bottomDivider = document.createElement('div');
    bottomDivider.className = 'sidebar__divider';
    bottomNav.appendChild(bottomDivider);

    BOTTOM_ITEMS.forEach((item) => {
      const link = this._createNavItem(item, store.currentView === item.label.toLowerCase());
      if (item.label === 'Log Out') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          alert('Feature for demo purposes only.');
        });
      } else {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          store.currentView = item.label.toLowerCase();
          const sidebarEl = document.querySelector('.sidebar');
          const overlay = document.querySelector('.sidebar-overlay');
          if (sidebarEl) sidebarEl.classList.remove('sidebar--open');
          if (overlay) overlay.classList.remove('sidebar-overlay--open');
          this.render();
        });
      }
      bottomNav.appendChild(link);
    });

    // ── Assemble ───────────────────────────
    sidebar.appendChild(brandWrapper);
    sidebar.appendChild(divider);
    sidebar.appendChild(navSection);
    sidebar.appendChild(bottomNav);
    this.element.appendChild(sidebar);
  }

  /**
   * Create a single nav link element.
   */
  _createNavItem(item, isActive) {
    const link = document.createElement('a');
    link.className = 'sidebar__link' + (isActive ? ' sidebar__link--active' : '');
    link.href = '#';
    link.setAttribute('data-nav', item.label.toLowerCase());

    // Lucide icon via createElement
    const iconNode = createElement(item.icon);
    iconNode.classList.add('sidebar__icon');
    link.appendChild(iconNode);

    const label = document.createElement('span');
    label.textContent = item.label;
    link.appendChild(label);

    if (isActive) {
      const indicator = document.createElement('span');
      indicator.className = 'sidebar__active-indicator';
      link.appendChild(indicator);
    }

    return link;
  }
}
