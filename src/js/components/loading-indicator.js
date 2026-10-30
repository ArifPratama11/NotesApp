const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      background: rgba(34, 40, 49, 0.45);
      opacity: 0;
      visibility: hidden;
      transition:
        opacity 0.2s ease,
        visibility 0.2s;
    }
    :host([active]) {
      opacity: 1;
      visibility: visible;
    }
    .box {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.9rem 1.3rem;
      border-radius: 0.9rem;
      background: var(--color-white);
      color: var(--color-dark);
      box-shadow: 0 10px 30px rgba(23, 35, 45, 0.25);
    }
    .spinner {
      flex: none;
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid #d9dde2;
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .label {
      font-weight: 500;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none;
      }
      .spinner {
        animation-duration: 2.4s;
      }
    }
  </style>
  <div class="box" role="status" aria-live="polite">
    <span class="spinner" aria-hidden="true"></span>
    <span class="label"></span>
  </div>
`;

class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['label'];
  }

  #label;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#label = root.querySelector('.label');
  }

  connectedCallback() {
    this.#renderLabel();
  }

  attributeChangedCallback() {
    this.#renderLabel();
  }

  get active() {
    return this.hasAttribute('active');
  }

  show(label) {
    if (label) this.setAttribute('label', label);
    this.setAttribute('active', '');
  }

  hide() {
    this.removeAttribute('active');
  }

  #renderLabel() {
    this.#label.textContent = this.getAttribute('label') || 'Memuat…';
  }
}

customElements.define('loading-indicator', LoadingIndicator);
