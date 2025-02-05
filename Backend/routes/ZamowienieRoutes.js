const express = require('express');
const {
    getWszystkieZamowieanie_Pozycja,
    getZamowieanie_PozycjaId,
    postTworzenieZamowieanie_Pozycja,
    putAktualizacjaZamowieanie_Pozycja,
    deleteZamowieanie_Pozycja
} = require('../controllers/ZamowieanieController');
const {verifyToken, isAdmin} = require('../middleware/auth');

const router = express.Router();

// Definiowanie tras
router.get('/',verifyToken, isAdmin, getWszystkieZamowieanie_Pozycja);               // Pobieranie wszystkich 
router.get('/:id',verifyToken, isAdmin, getZamowieanie_PozycjaId);                    // Pobieranie  po ID
router.post('/',verifyToken, isAdmin, postTworzenieZamowieanie_Pozycja);               // Tworzenie nowego 
router.put('/:id',verifyToken, isAdmin, putAktualizacjaZamowieanie_Pozycja);             // Aktualizacja 
router.delete('/:id',verifyToken, isAdmin, deleteZamowieanie_Pozycja);                      // Usuwanie 

module.exports = router;