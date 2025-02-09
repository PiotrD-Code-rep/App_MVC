const express = require('express');
const {
    getAllOrderAPI,
    getOrderIdAPI,
    postCreateOrderAPI,
    putUpdateOrderAPI,
    deleteOrderAPI
} = require('../controllers/ZamowieanieController');
const {verifyToken, isAdmin} = require('../middleware/auth');

const router = express.Router();

// api/Orders
router.get('/Orders',verifyToken, isAdmin, getAllOrderAPI);               // Pobieranie wszystkich 
router.get('/Orders/:id',verifyToken, isAdmin, getOrderIdAPI);                    // Pobieranie  po ID
router.post('/Orders',verifyToken, isAdmin, postCreateOrderAPI);               // Tworzenie nowego 
router.put('/Orders/:id',verifyToken, isAdmin,putUpdateOrderAPI);             // Aktualizacja 
router.delete('/Orders/:id',verifyToken, isAdmin, deleteOrderAPI);                      // Usuwanie 

module.exports = router;