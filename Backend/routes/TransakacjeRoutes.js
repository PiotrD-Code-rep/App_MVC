const express = require('express');
const {
    getWszystkieTransakcje,
    getTransakcjeId,
    postTworzenieTransakcje,
    putAktualizacjaTransakcje,
    deleteTransakcje
} = require('../controllers/TransakacjeController');
const {verifyToken, isAdmin} = require('../middleware/auth');

const router = express.Router();

// Definiowanie tras
router.get('/',verifyToken, isAdmin, getWszystkieTransakcje);               // Pobieranie wszystkich 
router.get('/:id',verifyToken, isAdmin, getTransakcjeId);                    // Pobieranie  po ID
router.post('/',verifyToken, isAdmin, postTworzenieTransakcje);               // Tworzenie nowego 
router.put('/:id',verifyToken, isAdmin, putAktualizacjaTransakcje);             // Aktualizacja 
router.delete('/:id',verifyToken, isAdmin, deleteTransakcje);                      // Usuwanie 

module.exports = router;