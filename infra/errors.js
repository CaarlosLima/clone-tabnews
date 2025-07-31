export class InternalServerError extends Error {
  constructor({ cause, statusCode = 500 }) {
    super("Internal Server Error", { cause });
    this.name = "InternalServerError";
    this.action = "Please, contact the support team.";
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class MethodNotAllowError extends Error {
  constructor() {
    super("The method is not allowed for this endpoint.");
    this.name = "MethodNotAllowError";
    this.action =
      "Verify if the HTTP method is correct and allowed for this endpoint.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Service currently unavailable", { cause });
    this.name = "ServiceError";
    this.action = "Verify if the service is available";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      statusCode: this.statusCode,
    };
  }
}
