class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'note-date', 'note-archived'];
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

  setupActions() {
    const title = this.getAttribute('note-title') || '';
    const archived = this.getAttribute('note-archived') === 'true';
    const archiveButton = this._shadow.querySelector('.archive');
    const deleteButton = this._shadow.querySelector('.delete');
    const archiveText = archived ? 'Pulihkan' : 'Arsipkan';

    archiveButton.textContent = archiveText;
    archiveButton.setAttribute('aria-label', `${archiveText} catatan ${title}`);
    deleteButton.setAttribute('aria-label', `Hapus catatan ${title}`);

    const emit = (name) =>
      this.dispatchEvent(
        new CustomEvent(name, {
          bubbles: true,
          composed: true,
          detail: { id: this.getAttribute('note-id'), title, archived },
        })
      );
    archiveButton.addEventListener('click', () => emit('note-toggle-archive'));
    deleteButton.addEventListener('click', () => emit('note-delete'));
  }

  formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  render() {
    this._shadow.innerHTML = `
      <style>
        :host { display: block; }
        article {
          height: 100%;
          background: var(--color-white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          box-sizing: border-box;
          border-top: 5px solid var(--color-accent);
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        article:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(34, 40, 49, 0.16);
        }
        h3 {
          margin: 0;
          font-size: 1.05rem;
          color: var(--color-dark);
          overflow-wrap: anywhere;
        }
        time {
          font-size: 0.75rem;
          color: var(--color-accent-dark);
          font-weight: 500;
        }
        p {
          margin: 0;
          font-size: 0.9rem;
          color: var(--color-dark-soft);
          white-space: pre-line;
          overflow-wrap: anywhere;
        }
      :host([note-archived='true']) article {
          border-top-color: var(--color-dark-soft);
        }
        .actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 10px;
          box-sizing: border-box;
        }
        button {
          font: inherit;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 12px;
          border: 2px solid currentColor;
          border-radius: 8px;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .archive { color: var(--color-accent-dark); }
        .archive:hover { background: var(--color-accent-dark); color: var(--color-white); }
        .delete { color: var(--color-error); }
        .delete:hover { background: var(--color-error); color: var(--color-white); }
      </style>
      <article>
        <h3 class="title"></h3>
        <time class="date"></time>
        <p class="body"></p>
        <div class="actions">
          <button type="button" class="archive"></button>
          <button type="button" class="delete">Hapus</button>
        </div>
      </article>
    `;
    this.setupActions();
    const rawDate = this.getAttribute('note-date') || '';
    const time = this._shadow.querySelector('.date');
    time.textContent = this.formatDate(rawDate);
    time.setAttribute('datetime', rawDate);
    this._shadow.querySelector('.title').textContent =
      this.getAttribute('note-title') || '';
    this._shadow.querySelector('.body').textContent =
      this.getAttribute('note-body') || '';
  }
}

customElements.define('note-item', NoteItem);
