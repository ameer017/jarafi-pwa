const express = require("express");
const { setPIN } = require("../handler/pinHandler");
const router = express.Router();

router.post("/set-pin", setPIN);

module.exports = router;
