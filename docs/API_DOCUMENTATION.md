# API Documentation

Lofish Market API menggunakan **Scalar** untuk interactive API documentation dengan OpenAPI 3.1 specification.

## Akses Dokumentasi

Setelah server berjalan, akses dokumentasi di:

```
http://localhost:3000/api-docs
```

## Fitur Dokumentasi

- ✅ **Interactive API Explorer** - Test API langsung dari browser
- ✅ **Authentication Support** - Input Bearer token untuk test authenticated endpoints
- ✅ **Request/Response Examples** - Contoh lengkap untuk setiap endpoint
- ✅ **Schema Definitions** - Model data yang jelas dan terstruktur
- ✅ **Try It Out** - Execute API calls langsung dari dokumentasi
- ✅ **Modern UI** - Interface yang clean dan mudah digunakan

## OpenAPI Specification

File OpenAPI spec tersedia di: `openapi.yaml`

Spec ini dapat digunakan untuk:

- Generate client SDK (berbagai bahasa)
- Import ke Postman/Insomnia
- API testing automation
- Contract testing

## Endpoint Groups

### 🔐 Authentication

- `POST /login` - User authentication

### 💰 Transactions

- `GET /transaction/selling/list` - List transactions (with pagination & filters)
- `GET /transaction/selling/byid/:id` - Get transaction details
- `POST /transaction/selling/create` - Create new transaction

### 🔔 Webhooks

- `POST /webhook/xendit` - Xendit payment notifications

## Menggunakan Dokumentasi

### 1. Authenticate

1. Buka dokumentasi di `/api-docs`
2. Klik endpoint `POST /login`
3. Klik "Try It Out"
4. Input credentials:
   ```json
   {
   	"username": "your_username",
   	"password": "your_password"
   }
   ```
5. Copy token dari response

### 2. Test Authenticated Endpoints

1. Klik tombol "Authorize" di top-right
2. Paste token: `Bearer YOUR_TOKEN_HERE`
3. Sekarang semua endpoint bisa di-test dengan authentication

### 3. Explore Endpoints

- Klik endpoint untuk melihat detail
- Lihat request/response schema
- Test langsung dengan "Try It Out"

## Update Dokumentasi

Untuk menambah atau update endpoint:

1. Edit file `openapi.yaml`
2. Tambahkan path baru atau update yang sudah ada
3. Restart server
4. Dokumentasi akan auto-update

### Contoh Menambah Endpoint Baru

```yaml
paths:
  /your-new-endpoint:
    get:
      tags:
        - YourTag
      summary: Your endpoint summary
      description: Detailed description
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: string
```

## Tips

- **Dark Mode**: Scalar otomatis detect system theme
- **Search**: Gunakan Ctrl+K untuk quick search
- **Copy**: Klik code examples untuk auto-copy
- **Export**: Download OpenAPI spec untuk digunakan di tools lain

## Resources

- [Scalar Documentation](https://github.com/scalar/scalar)
- [OpenAPI 3.1 Spec](https://spec.openapis.org/oas/v3.1.0)
- [Lofish Market API Spec](./openapi.yaml)
