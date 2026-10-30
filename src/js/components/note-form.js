class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._rules = {
      title: { min: 3, max: 50, label: 'Judul' },
      body: { min: 10, max: 500, label: 'Isi catatan' },
    };
    this._touched = { title: false, body: false };
  }

  connectedCallback() {
    this.render();
    this.bindEvents();
  }

  render() {
    this._shadow.innerHTML = `
      <style>
        :host { display: block; }
        form {
          background: var(--color-white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .field { display: flex; flex-direction: column; gap: 6px; }
        label { font-weight: 600; font-size: 0.9rem; }
        input, textarea {
          font: inherit;
          font-size: 0.95rem;
          padding: 10px 12px;
          border: 2px solid #d9dde2;
          border-radius: 10px;
          background: #fafafa;
          color: var(--color-dark);
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        textarea { min-height: 140px; resize: vertical; }
        input:focus, textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(0, 173, 181, 0.2);
        }
        .invalid input, .invalid textarea { border-color: var(--color-error); }
        .valid input, .valid textarea { border-color: var(--color-success); }
        .meta {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.78rem;
          min-height: 1.2em;
        }
        .error { color: var(--color-error); }
        .counter { color: var(--color-dark-soft); margin-left: auto; }
        button {
          font: inherit;
          font-weight: 600;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: var(--color-accent);
          color: var(--color-white);
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        button:hover:not(:disabled) { background: var(--color-accent-dark); }
        button:active:not(:disabled) { transform: scale(0.98); }
        button:disabled { background: #b5bcc4; cursor: not-allowed; }
      </style>
      <form novalidate>
        <div class="field" data-field="title">
          <label for="title">Judul</label>
          <input id="title" name="title" type="text" maxlength="50"
                 placeholder="Contoh: Daftar belanja" autocomplete="off" required />
          <div class="meta">
            <span class="error" aria-live="polite"></span>
            <span class="counter">0/50</span>
          </div>
        </div>

        <div class="field" data-field="body">
          <label for="body">Isi Catatan</label>
          <textarea id="body" name="body" maxlength="500"
                    placeholder="Tulis catatanmu di sini..." required></textarea>
          <div class="meta">
            <span class="error" aria-live="polite"></span>
            <span class="counter">0/500</span>
          </div>
        </div>

        <button type="submit" disabled>Tambah Catatan</button>
      </form>
    `;
  }

  bindEvents() {
    this._form = this._shadow.querySelector('form');
    this._submit = this._shadow.querySelector('button');
    this._inputs = {
      title: this._shadow.querySelector('#title'),
      body: this._shadow.querySelector('#body'),
    };

    Object.keys(this._inputs).forEach((name) => {
      const input = this._inputs[name];
      // Realtime validation: setiap ketikan langsung divalidasi
      input.addEventListener('input', () => {
        this._touched[name] = true;
        this.validateField(name);
        this.updateSubmitState();
      });
      input.addEventListener('blur', () => {
        this._touched[name] = true;
        this.validateField(name);
      });
    });

    this._form.addEventListener('submit', (event) => {
      event.preventDefault();
      Object.keys(this._inputs).forEach((n) => {
        this._touched[n] = true;
        this.validateField(n);
      });
      if (!this.isFormValid()) return;

      this.dispatchEvent(
        new CustomEvent('note-added', {
          bubbles: true,
          composed: true,
          detail: {
            title: this._inputs.title.value.trim(),
            body: this._inputs.body.value.trim(),
          },
        })
      );
      this._submit.disabled = true; // dikunci sampai request selesai
    });
  }

  getError(name) {
    const { min, max, label } = this._rules[name];
    const value = this._inputs[name].value.trim();
    if (!value) return `${label} wajib diisi.`;
    if (value.length < min) return `${label} minimal ${min} karakter.`;
    if (value.length > max) return `${label} maksimal ${max} karakter.`;
    return '';
  }

  validateField(name) {
    const field = this._shadow.querySelector(`[data-field="${name}"]`);
    const error = this.getError(name);
    const length = this._inputs[name].value.length;

    field.querySelector('.counter').textContent = `${length}/${this._rules[name].max}`;
    field.classList.remove('valid', 'invalid');

    if (this._touched[name]) {
      field.querySelector('.error').textContent = error;
      field.classList.add(error ? 'invalid' : 'valid');
    }
    return !error;
  }

  isFormValid() {
    return Object.keys(this._inputs).every((n) => !this.getError(n));
  }

  updateSubmitState() {
    this._submit.disabled = !this.isFormValid();
  }

  reset() {
    this._form.reset();
    this._touched = { title: false, body: false };
    Object.keys(this._inputs).forEach((n) => {
      const field = this._shadow.querySelector(`[data-field="${n}"]`);
      field.classList.remove('valid', 'invalid');
      field.querySelector('.error').textContent = '';
      field.querySelector('.counter').textContent = `0/${this._rules[n].max}`;
    });
    this.updateSubmitState();
    this._inputs.title.focus();
  }
}

customElements.define('note-form', NoteForm);
