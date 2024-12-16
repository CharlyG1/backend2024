const { Router } = require('express');
const { 
    getAllPurchases, 
    getPurchaseById, 
    createPurchase, 
    updatePurchase, 
    deletePurchase 
} = require('../controllers/purchases');

const router = Router();

router.get('/', getAllPurchases);
router.get('/:id', getPurchaseById);
router.post('/', createPurchase);
router.put('/:id', updatePurchase);
router.delete('/:id', deletePurchase);

module.exports = router;
