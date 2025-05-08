const express = require("express");
const { setPIN, retrievePin } = require("../handler/pinHandler");
const router = express.Router();

router.post("/set-pin", setPIN);
router.get("/get-pin/:id", retrievePin);

module.exports = router;
