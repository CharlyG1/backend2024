const { Router } = require("express");
const {
  getAllProducts,
  getProductsById,
  createProducts,
  updateProducts,
  deleteProduct,
} = require("../controllers/products");

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductsById);
router.post("/", createProducts);
router.put("/:id", updateProducts);
router.delete("/:id", deleteProduct);

module.exports = router;
