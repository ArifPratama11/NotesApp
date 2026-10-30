const BASE_URL = 'https://notes-api.dicoding.dev/v2';
const REQUEST_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, { cause });
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || payload?.status !== 'success') {
      throw new ApiError(
        payload?.message || `Permintaan gagal (HTTP ${response.status}).`,
        { status: response.status }
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    const timedOut = error.name === 'AbortError';
    throw new ApiError(
      timedOut
        ? 'Server terlalu lama merespons. Coba lagi beberapa saat lagi.'
        : 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      { cause: error }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

const noteUrl = (id) => `/notes/${encodeURIComponent(id)}`;

const NotesApi = {
  async getNotes() {
    const { data } = await request('/notes');
    return data;
  },

  async getArchivedNotes() {
    const { data } = await request('/notes/archived');
    return data;
  },

  async createNote({ title, body }) {
    const { data } = await request('/notes', {
      method: 'POST',
      body: { title, body },
    });
    return data;
  },

  async deleteNote(id) {
    await request(noteUrl(id), { method: 'DELETE' });
  },

  async archiveNote(id) {
    await request(`${noteUrl(id)}/archive`, { method: 'POST' });
  },

  async unarchiveNote(id) {
    await request(`${noteUrl(id)}/unarchive`, { method: 'POST' });
  },
};

export default NotesApi;
