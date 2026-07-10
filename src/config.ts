// ============================================================
// CONFIG - GANTI KONTEN DI SINI
// Semua konten personalisasi dikumpulkan di file ini
// ============================================================

// BASE_URL otomatis menyesuaikan: '/' di dev, '/nama-repo/' di GitHub Pages
const base = import.meta.env.BASE_URL;

export const CONFIG = {
  // Nama penerima
  recipientName: "Shelsilia Tiara",

  // Login credentials (username bebas, password harus cocok)
  login: {
    username: "shelsilia",
    password: "sayang",
  },

  // Foto untuk galeri polaroid (minimal 2, maksimal sesuai kebutuhan)
  photos: [
    `${base}photo1.jpg`,
    `${base}photo2.jpg`,
    `${base}photo3.jpg`,
    `${base}photo4.jpg`,
  ],

  // Background foto untuk scene surat
  letterBackground: `${base}letter-bg.jpg`,

  // Musik — file ada di public/music/
  musicPlaylist: [
    {
      title: "Selamat Ulang Tahun",
      artist: "Jamrud",
      src: `${base}music/jamrud.mp3`,
    },
    {
      title: "Semua Aku Dirayakan",
      artist: "Nadin Amizah",
      src: `${base}music/nadin.mp3`,
    },
    {
      title: "You're Gonna Live Forever in Me",
      artist: "John Mayer",
      src: `${base}music/johnmayer.mp3`,
    },
  ],

  // Teks surat
  letterTitle: "Untuk Shelsilia Tiara",
  letterContent: `Di hari yang spesial ini, aku ingin kamu tahu betapa berartinya dirimu bagiku. Setiap senyummu adalah cahaya yang menerangi hariku, setiap tawamu adalah musik indah yang mengisi hidupku.\n\nSemoga di usiamu yang bertambah ini, kamu semakin menjadi pribadi yang luar biasa. Semoga semua impianmu perlahan menjadi nyata, semoga cinta dan kebahagiaan selalu menyertaimu di setiap langkah.\n\nAku bersyukur bisa mengenalmu, bersyukur atas setiap momen indah yang telah kita lewati bersama. Kamu adalah hadiah terindah yang pernah kumiliki.\n\nSelamat ulang tahun, sayangku. Aku mencintaimu, hari ini, esok, dan selamanya.`,
  letterClosing: "Dengan segenap cintaku,",
  letterSender: "[Nama Kamu]",
};
