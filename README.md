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

-  Hapus komentar pada testing delete yang berhasil pada tiap file testing (users.spec.js, accounts.spec.js, transactions.spec.js).

- Jalankan perintah test untuk setiap modul.

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
