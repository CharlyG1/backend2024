const { Router } = require("express");
const {
  getAllSuppliers,
  getSupplierByRFC,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/suppliers");

const router = Router();

router.get("/", getAllSuppliers);
router.get("/:rfc", getSupplierByRFC);
router.post("/", createSupplier);
router.put("/:rfc", updateSupplier);
router.delete("/:rfc", deleteSupplier);

module.exports = router;
