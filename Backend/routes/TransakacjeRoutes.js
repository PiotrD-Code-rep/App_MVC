const express = require('express');
const {
    getAllTransactionAPI,
    getTransactionIdAPI,
    // postCreateTransactionAPI,
    putUpdateTransactionAPI,
    deleteTransactionAPI
} = require('../controllers/TransakacjeController');
const {verifyToken, isAdmin} = require('../middleware/auth');

const router = express.Router();

// Definiowanie tras
router.get('/Transactions',verifyToken, isAdmin, getAllTransactionAPI);               // Pobieranie wszystkich 
router.get('/Transactions/:id',verifyToken, isAdmin, getTransactionIdAPI);                    // Pobieranie  po ID
// router.post('/Transactions',verifyToken, isAdmin, postCreateTransactionAPI);               // Tworzenie nowego 
router.put('/Transactions/:id',verifyToken, isAdmin, putUpdateTransactionAPI);             // Aktualizacja 
router.delete('/Transactions/:id',verifyToken, isAdmin, deleteTransactionAPI);                      // Usuwanie 

module.exports = router;