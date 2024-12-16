const { Router } = require('express');
const { getAllUsers, createUser, getUser, updateUser, destroyUser } = require('../controllers/users');

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', destroyUser);

module.exports = router;