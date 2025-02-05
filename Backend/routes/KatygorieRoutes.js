const express = require('express');
const {
    getAllCategoryAPI,
    getCategoryIdAPI,
    postCreateCategoryAPI,
    putUpdateCategoryAPI,
    deleteCategoryAPI,
    // listCategory,
    // showCreateFormCategory,
    // createCategory,
    // showEditFormCategory,
    // updateCategory,
    // deleteCategory
} = require('../controllers/KatygorieController');
const {verifyToken, isAdmin} = require('../middleware/auth');
const router = express.Router();

//api/categories
router.get('/categories',verifyToken, isAdmin, getAllCategoryAPI);                       // Pobieranie wszystkich 
router.get('/categories/:id',verifyToken, isAdmin, getCategoryIdAPI);                    // Pobieranie po ID
router.post('/categories',verifyToken, isAdmin, postCreateCategoryAPI);                  // Tworzenie nowego 
router.put('/categories/:id',verifyToken, isAdmin, putUpdateCategoryAPI);                // Aktualizacja 
router.delete('/categories/:id',verifyToken, isAdmin, deleteCategoryAPI);                // Usuwanie 


//adminPanel/categories
// router.get('/categories',verifyToken, isAdmin, listCategory); 
// router.get('/categories/create',verifyToken, isAdmin, showCreateFormCategory);
// router.post('/categories/create',verifyToken, isAdmin, createCategory);
// router.get('/categories/edit/:id',verifyToken, isAdmin, showEditFormCategory);
// router.post('/categories/edit/:id',verifyToken, isAdmin, updateCategory);
// router.get('/categories/delete/:id',verifyToken, isAdmin, deleteCategory);



module.exports = router;