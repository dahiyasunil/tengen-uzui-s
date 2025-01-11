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
      }
    );
  };
};

module.exports = { logReq };
