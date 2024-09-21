const express = require("express");
const {
  searchClients,
  addClient,
} = require("../controllers/clienti.controller");
const router = express.Router();

router.get("/", searchClients);
router.post("/", addClient);
module.exports = router;
