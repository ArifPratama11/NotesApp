import '../styles/style.css';
import './components/app-bar.js';
import './components/app-footer.js';
import './components/loading-indicator.js';
import './components/note-form.js';
import './components/note-item.js';
import './components/note-list.js';
import NotesApi from './data/notes-api.js';
import { confirmDelete, showError, showToast } from './utils/feedback.js';
import { animateEnter, animateListIn } from './utils/motion.js';

const form = document.querySelector('note-form');
const loader = document.querySelector('loading-indicator');
const activeList = document.getElementById('active-notes');
const archivedList = document.getElementById('archived-notes');
const activeCount = document.getElementById('notes-count');
const archivedCount = document.getElementById('archived-count');

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
let pendingRequests = 0;

// Indikator loading tampil selama ada request HTTP yang berjalan.
async function withLoading(label, task) {
  pendingRequests += 1;
  loader.show(label);
  try {
    return await task();
  } finally {
    pendingRequests -= 1;
    if (pendingRequests === 0) loader.hide();
  }
}

// Ambil catatan aktif dan arsip dari API, lalu tampilkan.
async function refreshNotes() {
  const [active, archived] = await Promise.all([
    NotesApi.getNotes(),
    NotesApi.getArchivedNotes(),
  ]);
  activeList.notes = [...active].sort(byNewest);
  archivedList.notes = [...archived].sort(byNewest);
  activeCount.textContent = active.length;
  archivedCount.textContent = archived.length;
}

// Jalankan satu aksi ke API lalu muat ulang daftar. Mengembalikan true jika berhasil.
async function runAction(label, task, { success, failure }) {
  try {
    await withLoading(label, async () => {
      await task();
      await refreshNotes();
    });
    showToast(success);
    return true;
  } catch (error) {
    showError(error, failure);
    return false;
  }
}

form.addEventListener('note-added', async ({ detail }) => {
  const saved = await runAction('Menyimpan catatan…', () => NotesApi.createNote(detail), {
    success: 'Catatan berhasil disimpan.',
    failure: 'Catatan gagal disimpan',
  });

  if (saved) {
    form.reset();
    animateEnter(activeList.querySelector('note-item'));
  } else {
    form.updateSubmitState(); // buka kembali tombol; isi formulir tetap utuh
  }
});

document.addEventListener('note-delete', async ({ detail: { id, title } }) => {
  if (!(await confirmDelete(title))) return;
  runAction('Menghapus catatan…', () => NotesApi.deleteNote(id), {
    success: 'Catatan berhasil dihapus.',
    failure: 'Catatan gagal dihapus',
  });
});

document.addEventListener('note-toggle-archive', ({ detail: { id, archived } }) => {
  runAction(
    archived ? 'Memulihkan catatan…' : 'Mengarsipkan catatan…',
    () => (archived ? NotesApi.unarchiveNote(id) : NotesApi.archiveNote(id)),
    {
      success: archived ? 'Catatan dipulihkan.' : 'Catatan dipindahkan ke arsip.',
      failure: archived ? 'Catatan gagal dipulihkan' : 'Catatan gagal diarsipkan',
    }
  );
});

async function init() {
  try {
    await withLoading('Memuat catatan…', refreshNotes);
    animateListIn([...document.querySelectorAll('note-item')]);
  } catch (error) {
    showError(error, 'Gagal memuat catatan');
  }
}

init();
