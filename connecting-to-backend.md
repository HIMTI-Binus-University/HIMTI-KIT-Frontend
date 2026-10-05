# 📋 Panduan Integrasi HIMTI-KIT Frontend ke Backend

Dokumen ini berisi panduan lengkap, spesifikasi kontrak API, dan daftar file yang perlu diubah untuk menghubungkan portal publik **`HIMTI-KIT-Frontend`** ke **`HIMTI-Internal-Backend`** (`http://localhost:8000`).

---

## 1. Arsitektur & Alur Data

```text
[ HIMTI-Internal-Frontend ] (Port 3000)
       │
       │ Admin mengatur Appearance, upload Modul Catatan, Software, & NIM Mahasiswa
       ▼
[ HIMTI-Internal-Backend ] (Port 8000 / PostgreSQL)
       ▲
       │ Mahasiswa Baru (Maba) membaca data & validasi NIM secara publik (tanpa token auth)
       │
[ HIMTI-KIT-Frontend ] (Port 3001)
```

1. **Frontend ke Frontend:** Tidak ada komunikasi langsung antar-frontend via network. Keduanya tersinkronisasi melalui database di backend.
2. **Endpoint Publik:** Semua endpoint untuk portal maba di backend bersifat **publik** (tidak perlu login admin atau header bearer token).

---

## 2. Setup Awal & Konfigurasi Lingkungan

### A. Buat file `.env` di root folder `HIMTI-KIT-Frontend`
Salin dari `.env.example` dan sesuaikan port backend ke `8000`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_URL=http://localhost:3001
```

### B. Ubah port di `vite.config.ts`
Ubah port development ke `3001` agar tidak bentrok dengan Internal Frontend (port `3000`):
```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
  server: { port: 3001 }, // <-- Ubah ke 3001
});
```

---

## 3. Konstanta Endpoint & Tipe Data

### A. Tambahkan Endpoint di `src/constants/api.ts`
```ts
export const apiPaths = {
  appearance: "/api/himti-kit/appearance",
  validateNim: "/api/himti-kit/attendees/validate/:nim",
  resources: "/api/himti-kit/resources",
  software: "/api/himti-kit/software",
} as const;
```

### B. Buat file tipe data `src/types/himti-kit.ts`
```ts
export interface HimtiKitAppearance {
  accentColor: string;
  backgroundImageUrl: string;
  overlayEnabled: boolean;
  overlayDarkness: number; // Nilai 0 - 100 (%)
  blurEnabled: boolean;
  blurIntensity: number; // Nilai 0 - 24 (px)
  updatedAt?: string;
}

export interface StudentValidationResponse {
  eligible: boolean;
  name?: string;
}

export interface KitResource {
  id: string;
  title: string;
  description?: string;
  major: string;
  downloadUrl: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KitSoftware {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  coverImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Layer Service / API Client

### Buat file `src/api/himti-kit.ts`
Gunakan instance `apiClient` yang sudah ada di `src/config/api-client.ts`:

```ts
import apiClient from "@/config/api-client";
import { apiPaths } from "@/constants/api";
import type {
  HimtiKitAppearance,
  StudentValidationResponse,
  KitResource,
  KitSoftware,
} from "@/types/himti-kit";

// 1. Fetch Tema & Tampilan Website (Background, Overlay, Blur, Accent Color)
export const getAppearance = async (): Promise<HimtiKitAppearance> => {
  const { data } = await apiClient.get<{ success: boolean; data: HimtiKitAppearance }>(
    apiPaths.appearance
  );
  return data.data;
};

// 2. Validasi NIM Mahasiswa di Gate/Login
export const validateNim = async (nim: string): Promise<StudentValidationResponse> => {
  const url = apiPaths.validateNim.replace(":nim", encodeURIComponent(nim.trim()));
  const { data } = await apiClient.get<{ success: boolean; data: StudentValidationResponse }>(url);
  return data.data;
};

// 3. Fetch Modul Catatan Kuliah (Resources)
export const getResources = async (params?: {
  major?: string;
  search?: string;
}): Promise<KitResource[]> => {
  const { data } = await apiClient.get<{ success: boolean; data: KitResource[] }>(
    apiPaths.resources,
    { params }
  );
  return data.data;
};

// 4. Fetch Software Perkuliahan
export const getSoftware = async (params?: { search?: string }): Promise<KitSoftware[]> => {
  const { data } = await apiClient.get<{ success: boolean; data: KitSoftware[] }>(
    apiPaths.software,
    { params }
  );
  return data.data;
};
```

---

## 5. Implementasi & Perubahan di Halaman

### A. Gate / Login (`src/pages/login/index.tsx`)
1. **Dynamic Background & Style:**
   - Panggil `getAppearance()` saat komponen dimuat (`useEffect` atau React Query).
   - Pasang gambar latar belakang menggunakan `appearance.backgroundImageUrl`.
   - Pasang filter overlay:
     - Backdrop blur: `appearance.blurEnabled ? `${appearance.blurIntensity}px` : '0px'`
     - Darkness overlay: `appearance.overlayEnabled ? appearance.overlayDarkness / 100 : 0`
   - Pasang warna aksen tombol: `style={{ backgroundColor: appearance.accentColor }}`.
2. **Validasi NIM saat Form Submit:**
   - Panggil `validateNim(nim)`.
   - Jika `response.eligible === true`:
     - Simpan data sesi/NIM (misal di `localStorage` atau React state):
       ```ts
       localStorage.setItem("student_nim", nim);
       if (response.name) localStorage.setItem("student_name", response.name);
       ```
     - Arahkan maba ke halaman `/kit` (`navigate("/kit")`).
   - Jika `response.eligible === false`:
     - Tampilkan pesan error di bawah form:
       *"NIM Anda tidak terdaftar sebagai peserta HIMTI-KIT. Silakan hubungi panitia."*

### B. Halaman Modul / Notes (`src/pages/resources-page/index.tsx`)
1. Hapus mock array statis `const resources = [...]`.
2. Panggil `getResources()`:
   - Tampilkan daftar modul berdasarkan respons backend.
   - Petakan field backend ke card komponen:
     - `title` &rarr; Judul Modul
     - `description` &rarr; Deskripsi Singkat
     - `downloadUrl` &rarr; Link Download File/Drive
     - `coverImageUrl` &rarr; Thumbnail Gambar
     - `major` &rarr; Tag Jurusan (misal: Computer Science, Data Science, dll.)

### C. Halaman Software (`src/pages/softwares-page/index.tsx`)
1. Hapus mock array statis `const softwares = [...]`.
2. Panggil `getSoftware()`:
   - Petakan field backend:
     - `name` &rarr; Judul Software
     - `description` &rarr; Deskripsi Kegunaan
     - `downloadUrl` &rarr; Link Download Resmi
     - `coverImageUrl` &rarr; Logo/Icon Software

---

## 6. Cheatsheet Kontrak API Backend

| Fitur | Method | URL Endpoint | Query Params / Body | Contoh Respons Backend |
| :--- | :--- | :--- | :--- | :--- |
| **Appearance** | `GET` | `/api/himti-kit/appearance` | Tidak ada | `{ "success": true, "data": { "accentColor": "#0284c7", "backgroundImageUrl": "https://images.unsplash.com/...", "overlayEnabled": true, "overlayDarkness": 65, "blurEnabled": true, "blurIntensity": 4 } }` |
| **Validasi NIM** | `GET` | `/api/himti-kit/attendees/validate/:nim` | `:nim` (path param) | **Jika Terdaftar:**<br>`{ "success": true, "data": { "eligible": true, "name": "Budi Santoso" } }`<br><br>**Jika Tidak Terdaftar:**<br>`{ "success": true, "data": { "eligible": false } }` |
| **Resources (Modul)** | `GET` | `/api/himti-kit/resources` | `?major=COMPUTER_SCIENCE&search=algo` *(opsional)* | `{ "success": true, "data": [ { "id": "res-1", "title": "Data Structures", "major": "COMPUTER_SCIENCE", "downloadUrl": "https://...", "coverImageUrl": "https://..." } ] }` |
| **Software** | `GET` | `/api/himti-kit/software` | `?search=vscode` *(opsional)* | `{ "success": true, "data": [ { "id": "soft-1", "name": "Visual Studio Code", "description": "Code Editor", "downloadUrl": "https://...", "coverImageUrl": "https://..." } ] }` |

---

## 7. Checklist Pengujian (Testing)

- [v] Backend berjalan di `http://localhost:8000`.
- [v] File `.env` sudah dibuat dengan `VITE_API_BASE_URL=http://localhost:8000`.
- [v] Server dijalankan dengan `npm run dev` di `HIMTI-KIT-Frontend` &rarr; buka `http://localhost:3001`.
- [ ] Halaman login menampilkan background image dan warna aksen sesuai yang diatur dari Admin Dashboard.
- [ ] Masukkan NIM yang terdaftar &rarr; lolos ke `/kit`. Masukkan NIM asal &rarr; muncul pesan penolakan.
- [ ] Halaman `/kit` (notes) dan `/software` menampilkan data riil dari database.
