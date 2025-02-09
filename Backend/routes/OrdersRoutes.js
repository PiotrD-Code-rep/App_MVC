const express = require('express');
const router = express.Router();
const {postOrders} = require('../controllers/OrdersController');
const {verifyToken, isAdmin, forceToLogin} = require('../middleware/auth');

router.get('/',forceToLogin,verifyToken ,postOrders);
// router.get('/:id', getProduktById);

module.exports = router;