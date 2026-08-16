# Sistem Produksi Konveksi

Aplikasi Sistem Produksi Konveksi merupakan aplikasi berbasis web yang digunakan untuk membantu pengelolaan proses produksi, mulai dari pengelolaan customer, produk, order, hingga proses produksi seperti Cutting, Sewing, QC, Finishing, Packing, serta pengelolaan barang reject dan rework.

Project ini menggunakan arsitektur **REST API Backend** dengan Laravel dan **Frontend** menggunakan React.js.

---

## Fitur Utama

### Authentication
- Login
- Logout
- Mendapatkan informasi user yang sedang login
- Authentication menggunakan Laravel Sanctum
- Role-based access control

### Customer
- Melihat daftar customer
- Melihat detail customer
- Menambahkan customer
- Mengubah customer
- Menghapus customer

### Product
- Melihat daftar produk
- Melihat detail produk
- Menambahkan produk
- Mengubah produk
- Menghapus produk

### Order
- Melihat daftar order
- Melihat detail order
- Membuat order
- Mengubah order
- Menghapus order

### Production
- Melihat daftar order yang sedang diproduksi
- Melihat detail progress produksi
- Update progress produksi
- Tracking quantity produksi
- Tracking good quantity
- Tracking reject quantity
- Status produksi

### Rework
- Mengirim barang reject dari QC ke tahap produksi sebelumnya
- Mencatat quantity barang yang dikirim untuk rework
- Memproses barang rework
- Mencatat hasil good dan reject setelah rework
- Menghitung quantity yang masih menunggu proses rework
- Menyimpan histori rework

### Production History
- Riwayat proses produksi
- Riwayat pengiriman barang ke rework
- Riwayat proses rework
- Informasi user yang memproses
- Quantity, good quantity, dan reject quantity

### Dashboard
- Informasi produksi
- Monitoring order
- Monitoring order yang sedang berjalan
- Monitoring order overdue

---

# Teknologi yang Digunakan

## Backend

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- MySQL
- REST API

## Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- Vite

## Development Tools

- Git
- GitHub
- Postman
- XAMPP / MySQL

---

# Requirement

Sebelum menjalankan project, pastikan perangkat sudah memiliki:

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM
- MySQL
- Git

Untuk memastikan versi:

```bash
php -v
composer -V
node -v
npm -v