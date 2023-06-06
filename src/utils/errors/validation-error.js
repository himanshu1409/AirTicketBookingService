const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error {
  constructor(error) {
    super();
    let explaination = [];
    errors.errors.forEach((err) => {
      explaination.push(err.message);
    });
    this.name = "ValidationError";
    this.message = "Not able to validate the data sent in the request";
    this.explaination = explaination;
    this.statusCode = statusCode.BAD_REQUEST;
  }
}

module.exports = ValidationError;
