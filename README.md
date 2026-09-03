# DevTime ⏱️

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![VS Code](https://img.shields.io/badge/VS%20Code-Extension-blue?logo=visualstudiocode)](https://code.visualstudio.com/)

> **DevTime** adalah open-source developer metrics tracker & productivity dashboard (alternatif WakaTime self-hosted) yang memantau durasi ngoding, project aktif, bahasa pemrograman, dan framework secara akurat, real-time, dan 100% aman mengutamakan privasi.

---

## ✨ Fitur Utama

- 🔥 **Indikator Lama Ngoding**: Filter periode Hari Ini, 7 Hari Terakhir, dan Total Waktu.
- ⚡ **Live Heartbeat Stream**: Transmisi real-time buffer aktif & pengetikan langsung dari VS Code.
- 🛠️ **Smart Framework & Language Detection**: Auto-detect Next.js, React, Vite, Vue, Express, Nest, Prisma, dsb.
- 🌐 **Bilingual (ID / EN)**: Switch bahasa Indonesia & English secara instan dengan tema gelap modern.
- 🛡️ **Anti-DDoS & Keamanan Tingkat Tinggi**: Rate limiter in-memory per-IP di register & login, bcrypt password hash 12 rounds, serta token API Key SHA-256.
- 🔒 **Privacy-First (No Source Code Leak)**: DevTime tidak pernah mengunggah isi kode berkas, hanya metadata dasar & timestamp.
- 🔌 **VS Code Extension Offline-Ready**: Antrean offline retry queue otomatis menyinkronkan data saat internet kembali online.

---

## 📦 Cara Pasang Extension di VS Code

1. **Unduh File `.vsix`**:
   Download dari halaman `/download` web dashboard atau melalui [GitHub Releases](../../releases).
2. **Install di VS Code**:
   - Buka VS Code.
   - Tekan `Ctrl+Shift+P` (atau `Cmd+Shift+P` di macOS), ketik `Extensions: Install from VSIX...`.
   - Pilih file `devtime-vscode-0.1.0.vsix`.
3. **Hubungkan API Key**:
   - Buka dashboard DevTime -> menu **Pengaturan > Kunci API**.
   - Buat key baru, lalu di VS Code tekan `Ctrl+Shift+P` -> pilih `DevTime: Set API Key`.
   - Paste API key Anda. Selesai!

---

## 🚀 Jalankan Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/danu/devtime.git
cd devtime

# 2. Install dependencies
npm install

# 3. Setup Database & Prisma
npm run db:generate
npm run db:migrate

# 4. Jalankan Web Dashboard
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## ☁️ Deployment ke Vercel (Auto Update via GitHub)

1. Push repository ke GitHub.
2. Buka [Vercel Dashboard](https://vercel.com/new).
3. Import repository GitHub `devtime`.
4. Atur **Root Directory** ke `apps/web`.
5. Tambahkan Environment Variable:
   - `DATABASE_URL`: `file:./dev.db` (atau gunakan Postgres/Turso/Neon untuk cloud production).
6. Klik **Deploy**. Setiap kali ada push/merge ke branch `main`, Vercel akan otomatis melakukan auto-build & update.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
