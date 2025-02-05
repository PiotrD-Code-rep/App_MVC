const express = require('express');
const {
    getAllUserAPI,
    getUserIdAPI,
    postCreateUserAPI,
    putUpdateUserAPI,
    deleteUserAPI,
    // listUser,
    // showCreateFormUser,
    // createUser,
    // showEditFormUser,
    // updateUser,
    // deleteUser,
} = require('../controllers/UzytkowicyController');
const {verifyToken, isAdmin} = require('../middleware/auth');
const router = express.Router();

//api/Users
router.get('/Users',verifyToken, isAdmin, getAllUserAPI);                             // Pobieranie wszystkich 
router.get('/Users/:id',verifyToken, isAdmin, getUserIdAPI);                          // Pobieranie  po ID
router.post('/Users',verifyToken, isAdmin, postCreateUserAPI);                        // Tworzenie nowego 
router.put('/Users/:id',verifyToken, isAdmin, putUpdateUserAPI);                      // Aktualizacja 
router.delete('/Users/:id',verifyToken, isAdmin, deleteUserAPI);                      // Usuwanie 


// //AdminaPanel/Users
// router.get('/Users',verifyToken, isAdmin, listUser);
// router.get('/Users/create',verifyToken, isAdmin, showCreateFormUser);
// router.post('/Users/create',verifyToken, isAdmin, createUser);
// router.get('/Users/edit/:id',verifyToken, isAdmin, showEditFormUser);
// router.post('/Users/edit/:id',verifyToken, isAdmin, updateUser);
// router.get('/Users/delete/:id',verifyToken, isAdmin, deleteUser);

module.exports = router;