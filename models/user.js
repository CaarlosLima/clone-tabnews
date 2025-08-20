import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username)
  await validateUniqueEmail(userInputValues.email)

  const newUser = await runInsertQuery(userInputValues)
  return newUser

  async function validateUniqueUsername(username) {
    const existingUser = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
      ;`,
      values: [username],
    });

    if (existingUser.rowCount > 0) {
      throw new ValidationError({
        message: "Username already in use",
        action: "Use a different username",
      });
    }
  }

  async function validateUniqueEmail(email) {
    const existingUser = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
      ;`,
      values: [email],
    });

    if (existingUser.rowCount > 0) {
      throw new ValidationError({
        message: "Email already in use",
        action: "Use a different email",
      });
    }
  }

  async function runInsertQuery(params) {
    const { username, email, password } = params;

    const results = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING *
      ;`,
      values: [username, email, password],
    });

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user;
