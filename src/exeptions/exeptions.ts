export class BaseError extends Error {
    statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
  
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = Error.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this);
    }
  }
  
  export class NotFoundError extends BaseError {
    propertyName: string;
  
    constructor(propertyName: string) {
      super(404, `Property '${propertyName}' not found.`);
  
      this.propertyName = propertyName;
    }
  }

  export class BadRequestError extends BaseError {
    errorMessage: string;
  
    constructor(errorMessage: string) {
      super(400, errorMessage);
  
      this.errorMessage = errorMessage;
    }
  }

  export class UnauthorizedError extends BaseError {
    constructor() {
      super(401, 'User not authorized');
    }
  }
  
  export class ForbiddenError extends BaseError {
    constructor() {
      super(403, 'The client does not have access rights to the content');
    }
  }