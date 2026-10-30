class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['app-title', 'subtitle'];
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
    const title = this.getAttribute('app-title') || 'Notes App';
    const subtitle = this.getAttribute('subtitle') || '';

    this._shadow.innerHTML = `
      <style>
        :host {
          display: block;
          background: linear-gradient(135deg, var(--color-dark), var(--color-dark-soft));
          color: var(--color-white);
          box-shadow: var(--shadow);
        }
        .bar {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--color-accent);
          display: grid;
          place-items: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        h1 { margin: 0; font-size: 1.5rem; line-height: 1.2; }
        p { margin: 0; font-size: 0.85rem; opacity: 0.75; }
        @media (max-width: 480px) {
          h1 { font-size: 1.25rem; }
        }
      </style>
      <header class="bar">
        <div class="logo" aria-hidden="true">&#128221;</div>
        <div>
          <h1></h1>
          <p></p>
        </div>
      </header>
    `;
    this._shadow.querySelector('h1').textContent = title;
    const p = this._shadow.querySelector('p');
    p.textContent = subtitle;
    p.hidden = !subtitle;
  }
}

customElements.define('app-bar', AppBar);
