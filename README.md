# DevTime ⏱️

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

> **DevTime** adalah platform productivity tracker dan analitik koding mandiri (self-hosted WakaTime alternative) yang dibuat untuk memantau aktivitas ngoding harian, waktu pengerjaan proyek, statistik bahasa pemrograman, dan framework secara akurat, real-time, serta 100% aman menjaga privasi kode.

---

## 💡 Apa yang Dibuat di Proyek Ini?

Aplikasi ini terdiri dari ekosistem lengkap berbasis Turborepo / Monorepo:

### 1. 🖥️ Web Dashboard (Next.js 16 + Tailwind CSS)
- **Ringkasan & Indikator Waktu**: Menampilkan durasi aktif koding dengan filter periode (*Hari Ini*, *7 Hari Terakhir*, dan *Total Sepanjang Waktu*).
- **Live Stream Activity**: Log feed real-time berkas aktif yang sedang diedit dan deteksi detak jantung koding (*heartbeats*).
- **Breakdown Proyek, Bahasa, & Framework**: Agregasi persentase penggunaan bahasa koding dan identifikasi stack otomatis.
- **Manajemen API Key & Autentikasi**: Sistem login, register anti-bruteforce, dan pembuatan API Key dengan hashing SHA-256 serta dialog konfirmasi aksi (logout & hapus key).
- **Dukungan Dua Bahasa (Bilingual)**: Toggle instan Bahasa Indonesia & English dengan gaya visual minimalis modern.
- **Pusat Unduhan Extension**: Halaman rilis resmi untuk mengunduh berkas extension VS Code `.vsix` beserta panduan pasangnya.

### 2. 🔌 VS Code Extension (`@devtime/vscode`)
- **Pelacakan Heartbeat Otomatis**: Mendeteksi pengetikan (*keystrokes*), perubahan berkas, dan fokus editor.
- **Auto-Detection Cerdas**: Mengenali bahasa file dan framework proyek secara otomatis (Next.js, Vite, React, Vue, Express, Nest, Prisma, dll).
- **Git Branch & Repository Tracker**: Mengaitkan aktivitas ngoding langsung dengan nama repositori dan branch git aktif.
- **Offline Sync Queue**: Menyimpan data koding secara lokal saat offline dan mengirimkannya otomatis saat internet tersambung kembali.

### 3. 🛡️ Keamanan & Algoritma Anti-DDoS
- **In-Memory Rate Limiting**: Proteksi endpoint auth register & login dari serangan brute-force / spam request berdasarkan IP.
- **Algoritma Heartbeat 5-Menit**: Menghitung durasi koding secara adil dengan batas toleransi inaktivitas 5 menit sehingga tidak terjadi *overcounting* saat ditinggal istirahat.
- **Zero Source-Code Leak**: Extension hanya mengirimkan metadata berkas (nama file, project, bahasa, timestamp), tidak pernah mengunggah isi kode.

---

## 📦 Panduan Penggunaan Extension VS Code

1. **Unduh File `.vsix`**:
   Ambil file binary `devtime-vscode-0.1.0.vsix` dari halaman `/download` pada dashboard.
2. **Pasang di VS Code**:
   - Buka VS Code.
   - Tekan `Ctrl + Shift + P` (atau `Cmd + Shift + P` di macOS).
   - Ketik dan pilih **`Extensions: Install from VSIX...`**.
   - Pilih berkas `.vsix` yang telah diunduh.
3. **Hubungkan dengan API Key**:
   - Buka web dashboard -> masuk ke menu **Pengaturan > Kunci API**.
   - Buat key baru, lalu di VS Code tekan `Ctrl + Shift + P` -> pilih **`DevTime: Set API Key`**.
   - Masukkan token API Key Anda. Selesai!

---

## 🛠️ Menjalankan Proyek Secara Lokal

```bash
# 1. Clone repositori
git clone https://github.com/danu-dev/devtime.git
cd devtime

# 2. Install dependensi
npm install

# 3. Inisialisasi database (Prisma)
npm run db:generate
npm run db:migrate

# 4. Jalankan aplikasi web
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
