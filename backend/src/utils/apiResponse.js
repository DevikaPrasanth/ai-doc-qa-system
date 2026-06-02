const sendSuccess = (res, message, data = {}) =>
  res.json({
    success: true,
    message,
    data,
  });

const sendError = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: false,
    message,
    data,
  });

module.exports = {
  sendSuccess,
  sendError,
};
