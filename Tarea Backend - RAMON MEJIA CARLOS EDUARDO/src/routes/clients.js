const { Router } = require("express");
const {
  getAllClients,
  getClientsByRfc,
  createClients,
  updateClients,
  deleteClients,
} = require("../controllers/clients");

const router = Router();

router.get("/", getAllClients);
router.get("/:rfc", getClientsByRfc);
router.post("/", createClients);
router.put("/:rfc", updateClients);
router.delete("/:rfc", deleteClients);

module.exports = router;
