/**
 * <note-list> memakai light DOM supaya layout CSS Grid
 * didefinisikan di style.css (note-list { display: grid }).
 */
class NoteList extends HTMLElement {
  constructor() {
    super();
    this._notes = [];
  }

  set notes(value) {
    this._notes = Array.isArray(value) ? value : [];
    this._loaded = true;
    this.render();
  }

  get notes() {
    return this._notes;
  }

  connectedCallback() {
    if (!this._loaded) return;
    this.render();
  }

  render() {
    this.innerHTML = '';

    if (this._notes.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = this.getAttribute('empty-text') || 'Belum ada catatan.';
      this.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    this._notes.forEach((note) => {
      const item = document.createElement('note-item');
      item.setAttribute('note-id', note.id);
      item.setAttribute('note-title', note.title);
      item.setAttribute('note-body', note.body);
      item.setAttribute('note-date', note.createdAt);
      item.setAttribute('note-archived', String(note.archived));
      fragment.appendChild(item);
    });
    this.appendChild(fragment);
  }
}

customElements.define('note-list', NoteList);
