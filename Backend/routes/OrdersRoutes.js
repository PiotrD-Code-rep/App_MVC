const express = require('express');
const router = express.Router();
const {postOrders} = require('../controllers/OrdersController');
const {verifyToken, isAdmin} = require('../middleware/auth');

router.get('/', postOrders);
// router.get('/:id', getProduktById);

module.exports = router;