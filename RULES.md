# Backend Rules & Guidelines

## Database Architecture: Two-Tier System

The database is managed using a strict **two-tier system** to keep schema changes, critical data,
and non-critical seed data cleanly separated.

| Tier | Directory | Tracking Table | Run Command | What goes here |
|---|---|---|---|---|
| **Migrations** | `db/migrations/` | `migrations` | `npm run migration` | Schema changes (CREATE/ALTER/DROP) + **critical seed data** |
| **Seeders** | `db/seeder/` | `seeders` | `npm run seeder:run` | Non-critical / demo data |

### Critical Data → `db/migrations/`

**Critical data** is data the application cannot function without. It is seeded as part of the
main migration flow and is version-controlled alongside schema changes.

Examples of critical data:
- Roles (`role` table) — e.g., ADMN, KSR, SPVR, GDNG, KURI, TMBG
- Default users (`user` table) — e.g., admin, kasir, supervisor
- Permissions (`permission` table) and their assignments (`has_permit`)
- Payment methods (`payment_method` table)
- Size and category lookups (`size`, `category`)

To add or modify critical data, create a new migration:

```bash
npm run migration:create <MigrationName>
```

Then run it:

```bash
npm run migration
```

### Non-Critical Data → `db/seeder/`

**Non-critical data** is demo or initial operational data that can be re-created or reset.
It is tracked in a **separate `seeders` table** in the database, completely independent of
the `migrations` tracking table.

Examples of non-critical data:
- Products, grades, services, suppliers
- Market/outlet profiles (for development)
- Prices and stock entries

To create a new seeder, **do not** create the file manually. Use:

```bash
npm run seeder:create <SeederName>
```

**Example:**
```bash
npm run seeder:create seedProduct
```

This scaffolds a new file inside `db/seeder/` (e.g., `1777254902574-seedProduct.js`).

To run all pending seeders:

```bash
npm run seeder:run
```

> ⚠️ **Do NOT place schema-altering SQL (ALTER TABLE, DROP COLUMN, etc.) in seeder files.**
> Seeder files are for data (`INSERT`) only. Schema changes belong in `db/migrations/`.

## AI Agent Instructions: Database Schema & Migrations

For any AI Agent operating in this repository, **when dealing with database creation, modifications, or interpreting the schema**:
1. Always refresh the schema reference by executing `node scripts/dump_schema_to_md.js`.
2. Do not attempt to guess or rely solely on TypeORM entity definitions for the source of truth, as migrations may have made direct structural alterations.
3. Read the generated output from `DATABASE_SCHEMA.md` in the backend folder to get the 100% accurate, up-to-date representation of tables, foreign keys, columns, types, and length.

## Routing Guidelines

To maintain a clean and modular architecture, follow these rules for routing:

1. **Production Routes**: All production routes must be defined in module-specific files within the `routes/` directory (e.g., `routes/product.js`, `routes/user.js`).
2. **Mounting**: Ensure module-specific routers are correctly mounted with appropriate prefixes in `app.js`.
3. **Legacy/Testing Routes**: The file `routes/index.js` is reserved **only for testing** or legacy support. **Do not** add production-level logic or primary entity routes to this file.
4. **Multipart Parsing**: For any route that expects `multipart/form-data` (e.g., for image uploads), you **must** include the Multer middleware (e.g., `upload.single('image')`) to ensure `req.body` is correctly parsed.
