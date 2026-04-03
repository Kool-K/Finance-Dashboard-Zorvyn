import BaseComponent from './BaseComponent.js';
import store from '../store/store.js';
import { createElement, Bell, Shield, Eye, Menu, Moon, Sun } from 'lucide';

export default class Header extends BaseComponent {
  constructor(elementId) {
    super(elementId);
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    const header = document.createElement('header');
    header.className = 'header';

    // ── Left: Hamburger + Page title ───────
    const left = document.createElement('div');
    left.className = 'header__left';

    // Hamburger (mobile only)
    const hamburger = document.createElement('button');
    hamburger.className = 'header__hamburger';
    hamburger.id = 'btn-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle sidebar');
    const menuIcon = createElement(Menu);
    hamburger.appendChild(menuIcon);
    hamburger.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      const overlay = document.querySelector('.sidebar-overlay');
      if (sidebar) sidebar.classList.toggle('sidebar--open');
      if (overlay) overlay.classList.toggle('sidebar-overlay--open');
    });

    const titleWrap = document.createElement('div');
    titleWrap.className = 'header__title-wrap';

    const greeting = document.createElement('h1');
    greeting.className = 'header__title';
    greeting.textContent = 'Dashboard Overview';

    const subtitle = document.createElement('p');
    subtitle.className = 'header__subtitle';
    subtitle.textContent = this._getGreeting();

    titleWrap.appendChild(greeting);
    titleWrap.appendChild(subtitle);

    left.appendChild(hamburger);
    left.appendChild(titleWrap);

    // ── Right: Actions ─────────────────────
    const right = document.createElement('div');
    right.className = 'header__right';

    // Dark mode toggle
    const themeBtn = document.createElement('button');
    themeBtn.className = 'header__icon-btn';
    themeBtn.setAttribute('aria-label', 'Toggle dark mode');
    const themeIcon = store.darkMode ? Sun : Moon;
    const themeIconEl = createElement(themeIcon);
    themeBtn.appendChild(themeIconEl);

    themeBtn.addEventListener('click', () => {
      store.darkMode = !store.darkMode;
    });

    // Notification bell
    const bellBtn = document.createElement('button');
    bellBtn.className = 'header__icon-btn';
    bellBtn.id = 'btn-notifications';
    bellBtn.setAttribute('aria-label', 'Notifications');
    const bellIconEl = createElement(Bell);
    bellBtn.appendChild(bellIconEl);

    if (store.hasNotifications) {
      const badge = document.createElement('span');
      badge.className = 'header__notif-badge';
      badge.textContent = '3';
      bellBtn.appendChild(badge);
    }

    bellBtn.addEventListener('click', () => {
      if (store.hasNotifications) {
        store.hasNotifications = false;
      }
    });


    // ── Role Toggle ────────────────────────
    const toggle = document.createElement('button');
    toggle.className = 'header__role-toggle';
    toggle.id = 'btn-role-toggle';

    const roleIcon = store.userRole === 'Admin' ? Shield : Eye;
    const roleIconEl = createElement(roleIcon);
    roleIconEl.classList.add('header__role-icon');
    toggle.appendChild(roleIconEl);

    const roleLabel = document.createElement('span');
    roleLabel.className = 'header__role-label';
    roleLabel.textContent = store.userRole;
    toggle.appendChild(roleLabel);

    const togglePill = document.createElement('span');
    togglePill.className =
      'header__toggle-pill' +
      (store.userRole === 'Admin' ? ' header__toggle-pill--admin' : '');

    const toggleCircle = document.createElement('span');
    toggleCircle.className = 'header__toggle-circle';
    togglePill.appendChild(toggleCircle);
    toggle.appendChild(togglePill);

    toggle.addEventListener('click', () => {
      store.userRole = store.userRole === 'Admin' ? 'Viewer' : 'Admin';
    });

    // ── Avatar ─────────────────────────────
    const avatar = document.createElement('div');
    avatar.className = 'header__avatar';
    avatar.textContent = 'ZV';

    // ── Admin Pill ─────────────────────────
    if (store.userRole === 'Admin') {
      const adminPill = document.createElement('div');
      adminPill.className = 'header__admin-pill';
      adminPill.textContent = 'Active Session: Administrator';
      left.appendChild(adminPill); // Append it to the left side
    }

    // ── Assemble ───────────────────────────
    right.appendChild(themeBtn);
    right.appendChild(bellBtn);
    right.appendChild(toggle);
    right.appendChild(avatar);

    header.appendChild(left);
    header.appendChild(right);
    this.element.appendChild(header);
  }

  _getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning — here\'s your financial snapshot.';
    if (hour < 17) return 'Good afternoon — here\'s your financial snapshot.';
    return 'Good evening — here\'s your financial snapshot.';
  }
}
