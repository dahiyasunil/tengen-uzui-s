const fs = require("fs");

const logReq = (fileName) => {
  return (req, res, next) => {
    fs.appendFile(
      "log.txt",
      `${Date.now()} ${req.ip} ${req.method} ${req.path}\n`,
      (err, data) => {
        if (err) {
          console.log(`Error: \n ${err}`);
        } else {
          next();
        }
      },
    );
  };
};

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({
    message,
    error: { err },
  });
};

module.exports = { logReq, errorHandler };
