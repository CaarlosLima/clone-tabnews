import controller from "infra/controller";
import database from "infra/database";
import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  dryRun: true,
  migrationsTable: "pg_migrations",
  verbose: true,
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return response
      .status(migratedMigrations.length > 0 ? 201 : 200)
      .json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
