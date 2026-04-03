import BaseComponent from './BaseComponent.js';

export default class Footer extends BaseComponent {
  constructor(elementId) {
    super(elementId);
  }

  render() {
    if (!this.element) return;
    this.element.textContent = '';

    const footer = document.createElement('footer');
    footer.className = 'app-footer';
    footer.id = 'app-footer';

    // ── Left: Copyright ────────────────────
    const left = document.createElement('div');
    left.className = 'app-footer__left';

    const copy = document.createElement('span');
    copy.className = 'app-footer__copy';
    copy.textContent = '\u00A9 ' + new Date().getFullYear() + ' Zorvyn Inc. All rights reserved.';
    left.appendChild(copy);

    // ── Center: System Status ──────────────
    const center = document.createElement('div');
    center.className = 'app-footer__center';

    const statusBadge = document.createElement('div');
    statusBadge.className = 'app-footer__status';

    const dot = document.createElement('span');
    dot.className = 'app-footer__status-dot';

    const statusText = document.createElement('span');
    statusText.className = 'app-footer__status-text';
    statusText.textContent = 'All Systems Operational';

    statusBadge.appendChild(dot);
    statusBadge.appendChild(statusText);
    center.appendChild(statusBadge);

    // ── Right: Version & Signature ─────────
    const right = document.createElement('div');
    right.className = 'app-footer__right';

    const version = document.createElement('span');
    version.className = 'app-footer__version';
    version.textContent = 'Dashboard v1.0.4';

    const sep = document.createElement('span');
    sep.className = 'app-footer__sep';
    sep.textContent = '|';

    const link = document.createElement('a');
    link.className = 'app-footer__link';
    link.href = 'https://kool-k.github.io/Ketaki_Kulkarni_Portfolio/';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Ketaki Kulkarni';

    right.appendChild(version);
    right.appendChild(sep);
    right.appendChild(link);

    // ── Assemble ───────────────────────────
    footer.appendChild(left);
    footer.appendChild(center);
    footer.appendChild(right);

    this.element.appendChild(footer);
  }
}
