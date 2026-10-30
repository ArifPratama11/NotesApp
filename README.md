<<<<<<< HEAD
# Notes App — Integrasi RESTful API

Aplikasi catatan berbasis Web Component yang menyimpan data di
[Dicoding Notes API v2](https://notes-api.dicoding.dev/v2) dan dibundel dengan webpack.

## Menjalankan

Butuh Node.js 18.12 atau lebih baru.

    npm install
    npm run start-dev   # development di http://localhost:8080
    npm run build       # production, hasil di folder dist/
    npm run format      # rapikan kode dengan Prettier

## Fitur

- Menampilkan, menambah, dan menghapus catatan lewat Fetch API, dengan indikator loading.
- Arsip: arsipkan dan pulihkan catatan; daftar aktif dan arsip tampil terpisah.
- Pesan sukses dan error lewat SweetAlert2.
- Animasi daftar dengan anime.js (mati otomatis bila pengguna memilih reduced motion).
- Form dengan validasi real-time (dari submission sebelumnya).

## Struktur

    src/
      index.html            template untuk html-webpack-plugin
      styles/style.css
      js/
        app.js              controller: event, state, alur request
        data/notes-api.js   semua pemanggilan Fetch API
        components/         app-bar, app-footer, note-form, note-item, note-list, loading-indicator
        utils/              feedback.js (SweetAlert2), motion.js (anime.js)
    webpack.common.js / webpack.dev.js / webpack.prod.js
=======
# NotesApp
>>>>>>> a749be8328e3303f65c7e6c0882b110168b8559a
