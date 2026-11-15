# PostgreSQL integration tests

The directory integration suite uses a real PostgreSQL database. It never falls back to `DATABASE_URL`; set `ATHAR_TEST_DATABASE_URL` explicitly to a dedicated disposable database whose name ends in `_test` or `-test`. The suite refuses to use the configured application database and does not drop schemas, tables, or platform records. Its fixed `athar-integration-*` fixtures are upserted, so reruns are repeatable; use a fresh disposable database when you need a clean slate.

Run the migrations against that disposable database, then run the suite:

```sh
DATABASE_URL="$ATHAR_TEST_DATABASE_URL" corepack pnpm db:migrate
corepack pnpm test:db:integration
```

PowerShell equivalent:

```powershell
$env:DATABASE_URL = $env:ATHAR_TEST_DATABASE_URL
corepack pnpm db:migrate
Remove-Item Env:DATABASE_URL
corepack pnpm test:db:integration
```

If `ATHAR_TEST_DATABASE_URL` is not set, the PostgreSQL suite is reported as skipped. Contract, migration-journal, seed-safety, and API error-envelope tests remain runnable without PostgreSQL. Never point this suite at a development or production database.
