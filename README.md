# Basic Banking System API

API ini memungkinkan Anda untuk mengelola pengguna, akun bank, dan transaksi dalam sebuah sistem perbankan dasar.

## Instalasi

1. Clone repositori ini ke dalam komputer Anda.
2. Buka terminal dan arahkan ke direktori proyek.
3. Jalankan perintah `yarn install` untuk menginstal semua dependensi.

## Penggunaan

Pastikan Anda telah mengatur variabel lingkungan yang diperlukan sebelum menggunakan API ini. Anda dapat menemukan contoh variabel lingkungan yang diperlukan dalam file `.env.example`.

### Menjalankan Server

Untuk menjalankan server, jalankan perintah:

```bash
yarn dev
```

# Panduan Testing

## Testing Secara Urut dan Bersamaan
Untuk melakukan testing secara urut dan bersamaan, jalankan perintah:
```bash
yarn test:sequential
```

## Testing Secara Terpisah

Jika ingin melakukan testing secara terpisah, jalankan perintah untuk setiap modul:

### Testing Users:

    ```bash
    yarn test:users  
    ```
### Testing Accounts:

    ```bash
    yarn test:accounts 
    ```
### Testing Transactions:

    ```bash
    yarn test:transactions
    ```

## Testing Delete

Jika ingin melakukan testing delete pada setiap modul (users, accounts, transactions), ikuti langkah-langkah berikut:

1.  Hapus komentar pada testing delete yang berhasil pada tiap file testing (users.spec.js, accounts.spec.js, transactions.spec.js).

2. Jalankan perintah test untuk setiap modul.

### Testing Users:

    ```bash
    yarn test:users  
    ```
### Testing Accounts:

    ```bash
    yarn test:accounts 
    ```
### Testing Transactions:

    ```bash
    yarn test:transactions
    ```
