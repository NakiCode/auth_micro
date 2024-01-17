class errGenerate extends Error {
    constructor(name, message, statusCode) {
      super(message);
      this.name = name;
      this.message = message;
      this.statusCode = statusCode;
      this.status = "fail";
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
}

export default errGenerate;