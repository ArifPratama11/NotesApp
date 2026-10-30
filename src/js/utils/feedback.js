import Swal from 'sweetalert2';
import { ApiError } from '../data/notes-api.js';

const COLORS = {
  brand: '#008c93',
  danger: '#e5484d',
  neutral: '#393e46',
};

const truncate = (text, max = 60) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

// Pesan dari ApiError sudah ramah pengguna; error lain (bug) tidak ditampilkan mentah.
export function getErrorMessage(error) {
  return error instanceof ApiError
    ? error.message
    : 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
}

// titleText/text dipakai (bukan title/html) agar teks dari API tidak dirender sebagai HTML.
export function showError(error, title = 'Terjadi kesalahan') {
  return Swal.fire({
    icon: 'error',
    titleText: title,
    text: getErrorMessage(error),
    confirmButtonText: 'Mengerti',
    confirmButtonColor: COLORS.brand,
  });
}

export function showToast(message, icon = 'success') {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    titleText: message,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
}

export async function confirmDelete(noteTitle) {
  const result = await Swal.fire({
    icon: 'warning',
    titleText: 'Hapus catatan ini?',
    text: `"${truncate(noteTitle)}" akan dihapus permanen dan tidak bisa dikembalikan.`,
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: COLORS.danger,
    cancelButtonColor: COLORS.neutral,
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
}
