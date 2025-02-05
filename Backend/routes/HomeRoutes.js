const express = require('express');
const router = express.Router();
const {getStronaGlowna} = require('../controllers/HomeController');
const {postLogowanie,postRejestracja,postLogout,postWhoami} = require('../controllers/UzytkowicyController');
const {verifyToken, isAdmin} = require('../middleware/auth');

router.get('/', getStronaGlowna);
router.post('/logowanie', postLogowanie);
router.post('/rejestracja', postRejestracja);
router.post('/logout', postLogout);
router.post('/whoami',verifyToken, postWhoami);

module.exports = router;