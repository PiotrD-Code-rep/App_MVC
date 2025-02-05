const express = require('express');
const router = express.Router();
const {
    listProduct,
    showCreateFormProduct,
    createProduct,
    showEditFormProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/ProduktyController');

const {
    listCategory,
    showCreateFormCategory,
    createCategory,
    showEditFormCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/KatygorieController');

const {
    listUser,
    showCreateFormUser,
    createUser,
    showEditFormUser,
    updateUser,
    deleteUser
} = require('../controllers/UzytkowicyController');



const {verifyToken, isAdmin} = require('../middleware/auth');
const upload = require('../middleware/upload');

//AdminaPanel/Products
router.get('/products',verifyToken, isAdmin, listProduct);
router.get('/products/create',verifyToken, isAdmin, showCreateFormProduct);
router.post('/products/create',verifyToken, isAdmin, upload.array('zdjecia_produktu', 5), createProduct);
router.get('/products/edit/:id',verifyToken, isAdmin, showEditFormProduct);
router.post('/products/edit/:id',verifyToken, isAdmin,upload.array('zdjecia_produktu', 5), updateProduct);
router.get('/products/delete/:id',verifyToken, isAdmin, deleteProduct);

//AdminPanel/Categories
router.get('/categories',verifyToken, isAdmin, listCategory); 
router.get('/categories/create',verifyToken, isAdmin, showCreateFormCategory);
router.post('/categories/create',verifyToken, isAdmin, createCategory);
router.get('/categories/edit/:id',verifyToken, isAdmin, showEditFormCategory);
router.post('/categories/edit/:id',verifyToken, isAdmin, updateCategory);
router.get('/categories/delete/:id',verifyToken, isAdmin, deleteCategory);

//AdminaPanel/Users
router.get('/Users',verifyToken, isAdmin, listUser);
router.get('/Users/create',verifyToken, isAdmin, showCreateFormUser);
router.post('/Users/create',verifyToken, isAdmin, createUser);
router.get('/Users/edit/:id',verifyToken, isAdmin, showEditFormUser);
router.post('/Users/edit/:id',verifyToken, isAdmin, updateUser);
router.get('/Users/delete/:id',verifyToken, isAdmin, deleteUser);

//AdminaPanel/Transaction
// router.get('/Transactions',verifyToken, isAdmin, listTransaction);
// router.get('/Transactions/create',verifyToken, isAdmin, showCreateFormTransaction);
// router.post('/Transactions/create',verifyToken, isAdmin, createTransaction);
// router.get('/Transactions/edit/:id',verifyToken, isAdmin, showEditFormTransaction);
// router.post('/Transactions/edit/:id',verifyToken, isAdmin, updateTransaction);
// router.get('/Transactions/delete/:id',verifyToken, isAdmin, deleteTransaction);

//AdminaPanel/Orders_Items
// router.get('/Orders_Items',verifyToken, isAdmin, listOrder_Item);
// router.get('/Orders_Items/create',verifyToken, isAdmin, showCreateFormOrder_Item);
// router.post('/Orders_Items/create',verifyToken, isAdmin, createOrder_Item);
// router.get('/Orders_Items/edit/:id',verifyToken, isAdmin, showEditFormOrder_Item);
// router.post('/Orders_Items/edit/:id',verifyToken, isAdmin, updateOrder_Item);
// router.get('/Orders_Items/delete/:id',verifyToken, isAdmin, deleteOrder_Item);

module.exports = router;