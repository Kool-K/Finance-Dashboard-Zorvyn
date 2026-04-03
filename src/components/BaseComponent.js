// Base Component — all UI components extend this class
export default class BaseComponent {
  constructor(elementId) {
    this.elementId = elementId;
    this.element = null;

    // Listen for store changes and re-render
    document.addEventListener('stateChange', (e) => {
      this.onStateChange(e.detail);
      this.render();
    });
  }

  /**
   * Override in subclass to return HTML string or manipulate this.element.
   */
  render() {
    // Default no-op — subclasses implement their own rendering logic
  }

  /**
   * Hook for subclasses to react to specific state changes.
   * @param {{ property: string, value: any, oldValue: any }} detail
   */
  onStateChange(detail) {
    // Optional override in subclasses
  }

  /**
   * Attach the component to the DOM by its elementId.
   * If the target element exists, store a reference and trigger initial render.
   */
  mount() {
    this.element = document.getElementById(this.elementId);

    if (!this.element) {
      console.warn(
        `[BaseComponent] Element with id "${this.elementId}" not found in the DOM.`
      );
      return;
    }

    this.render();
  }
}
