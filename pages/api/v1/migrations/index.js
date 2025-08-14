import controller from "infra/controller";
import migrator from "models/migrator";
import { createRouter } from "next-connect";

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  return response
    .status(migratedMigrations.length > 0 ? 201 : 200)
    .json(migratedMigrations);
}

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
