import database from 'infra/database';
import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    dryRun: true,
    migrationsTable: "pg_migrations",
    verbose: true,
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);

    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({ ...defaultMigrationOptions, dryRun: false });

    await dbClient.end();

    return response.status(migratedMigrations.length > 0 ? 201 : 200).json(migratedMigrations);
  }

  return response.status(405).end();
}
