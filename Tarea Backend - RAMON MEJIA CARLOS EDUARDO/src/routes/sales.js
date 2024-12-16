const { Router } = require("express");
const {
  getAllSales,
  getSalesById,
  createSales,
  updateSales,
  deleteSales,
} = require("../controllers/sales");

const router = Router();

router.get("/", getAllSales);
router.get("/:id", getSalesById);
router.post("/", createSales);
router.put("/:id", updateSales);
router.delete("/:id", deleteSales);

module.exports = router;
