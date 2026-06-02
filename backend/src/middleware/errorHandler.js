const multer = require("multer");
const { sendError } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendError(res, 400, "File is too large. Maximum size is 10MB");
    }

    return sendError(res, 400, "Unable to upload file");
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : err.publicMessage || "Internal server error";

  return sendError(res, statusCode, message);
};

module.exports = errorHandler;
