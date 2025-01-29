const express = require("express");
const { handleGetUser } = require("../controllers/user");

const router = express.Router();

router.route("/:mobileNumber").get(handleGetUser);

module.exports = router;
