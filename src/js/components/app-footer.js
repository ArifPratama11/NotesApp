class AppFooter extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    this._shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--color-dark);
          color: var(--color-light);
          text-align: center;
          padding: 18px 16px;
          font-size: 0.85rem;
        }
      </style>
      <footer><span></span></footer>
    `;
    this._shadow.querySelector('span').innerHTML =
      this.getAttribute('text') || 'Notes App';
  }
}

customElements.define('app-footer', AppFooter);
