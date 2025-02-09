const express = require('express');
const router = express.Router();
const {getMainPage} = require('../controllers/HomeController');
// const {postLogowanie,postRejestracja,postLogout,postWhoami} = require('../controllers/UzytkowicyController');
const {getLogin, postLogin, getRegister, postRegister, getLogout} = require('../controllers/UzytkowicyController');
const {verifyToken, isAdmin} = require('../middleware/auth');

// Strona główna
router.get('/', getMainPage);
//Widok logowania
router.get('/login', getLogin);
router.post('/login', postLogin);
// Ścieżki do rejestracji
router.get('/register', getRegister);
router.post('/register', postRegister);
// Wylogowanie
router.get('/logout', getLogout);


module.exports = router;