const express = require('express');
const {
    getAllProductAPI,
    getProductIdAPI,
    postCreateProductAPI,
    putUpdateProductAPI,
    deleteProductAPI,
    // listProduct,
    // showCreateFormProduct,
    // createProduct,
    // showEditFormProduct,
    // updateProduct,
    // deleteProduct
} = require('../controllers/ProduktyController');
const {verifyToken, isAdmin} = require('../middleware/auth');
const router = express.Router();

const upload = require('../middleware/upload');
//api/products
router.get('/products',verifyToken, isAdmin, getAllProductAPI);                                                             // Pobieranie wszystkich 
router.get('/products/:id',verifyToken, isAdmin, getProductIdAPI);                                                          // Pobieranie  po ID
router.post('/products',verifyToken, isAdmin,upload.array('zdjecia_produktu', 5), postCreateProductAPI);                    // Tworzenie nowego 
router.put('/products/:id',verifyToken, isAdmin,upload.array('zdjecia_produktu', 5), putUpdateProductAPI);                  // Aktualizacja 
router.delete('/products/:id',verifyToken, isAdmin, deleteProductAPI);                                                      // Usuwanie 

//adminPanel/products
// router.get('/products',verifyToken, isAdmin, listProduct);
// router.get('/products/create',verifyToken, isAdmin, showCreateFormProduct);
// router.post('/products/create',verifyToken, isAdmin, createProduct);
// router.get('/products/edit/:id',verifyToken, isAdmin, showEditFormProduct);
// router.post('/products/edit/:id',verifyToken, isAdmin, updateProduct);
// router.get('/products/delete/:id',verifyToken, isAdmin, deleteProduct);

module.exports = router;