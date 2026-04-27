# Backend Rules & Guidelines

## Database Seeding

To create a new seeder, **do not** create the file manually to ensure correct formatting and timestamp ordering. Instead, use the built-in npm script which wraps the TypeORM CLI:

```bash
npm run seeder:create <SeederName>
```

**Example:**
```bash
npm run seeder:create seedProduct
```

This will automatically scaffold a new template file inside the `db/seeder` directory (e.g., `1777254902574-seedProduct.js`) that implements the `MigrationInterface` with empty `up()` and `down()` methods ready for your data.

### Running Seeders

To execute the seeders into the database, use:

```bash
npm run seeder:run
```

This uses a dedicated configuration (`config/typeorm-seeder-cli.js`) which isolates seeder execution from main schema migrations by recording them in a separate `seeders` table.

## AI Agent Instructions: Database Schema & Migrations

For any AI Agent operating in this repository, **when dealing with database creation, modifications, or interpreting the schema**:
1. Always refresh the schema reference by executing `node scripts/dump_schema_to_md.js`.
2. Do not attempt to guess or rely solely on TypeORM entity definitions for the source of truth, as migrations may have made direct structural alterations.
3. Read the generated output from `DATABASE_SCHEMA.md` in the backend folder to get the 100% accurate, up-to-date representation of tables, foreign keys, columns, types, and length.
