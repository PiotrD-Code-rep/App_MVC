const express = require('express');
const router = express.Router();
const {getAdminPage} = require('../controllers/HomeController');
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

const {
    listOrder,
    showCreateFormOrder,
    createOrder,
    showEditFormOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/ZamowieanieController');

const {
    listTransaction,
    showCreateFormTransaction,
    createTransaction,
    showEditFormTransaction,
    updateTransaction,
    deleteTransaction
} = require('../controllers/TransakacjeController');


const {verifyToken, isAdmin} = require('../middleware/auth');
const upload = require('../middleware/upload');

//AdminPanel
router.get('/AdminPanel',verifyToken, isAdmin, getAdminPage);

//AdminaPanel/Products
router.get('/AdminPanel/products',verifyToken, isAdmin, listProduct);
router.get('/AdminPanel/products/create',verifyToken, isAdmin, showCreateFormProduct);
router.post('/AdminPanel/products/create',verifyToken, isAdmin, upload.array('zdjecia_produktu', 5), createProduct);
router.get('/AdminPanel/products/edit/:id',verifyToken, isAdmin, showEditFormProduct);
router.post('/AdminPanel/products/edit/:id',verifyToken, isAdmin,upload.array('zdjecia_produktu', 5), updateProduct);
router.get('/AdminPanel/products/delete/:id',verifyToken, isAdmin, deleteProduct);

//AdminPanel/Categories
router.get('/AdminPanel/categories',verifyToken, isAdmin, listCategory); 
router.get('/AdminPanel/categories/create',verifyToken, isAdmin, showCreateFormCategory);
router.post('/AdminPanel/categories/create',verifyToken, isAdmin, createCategory);
router.get('/AdminPanel/categories/edit/:id',verifyToken, isAdmin, showEditFormCategory);
router.post('/AdminPanel/categories/edit/:id',verifyToken, isAdmin, updateCategory);
router.get('/AdminPanel/categories/delete/:id',verifyToken, isAdmin, deleteCategory);

//AdminaPanel/Users
router.get('/AdminPanel/Users',verifyToken, isAdmin, listUser);
router.get('/AdminPanel/Users/create',verifyToken, isAdmin, showCreateFormUser);
router.post('/AdminPanel/Users/create',verifyToken, isAdmin, createUser);
router.get('/AdminPanel/Users/edit/:id',verifyToken, isAdmin, showEditFormUser);
router.post('/AdminPanel/Users/edit/:id',verifyToken, isAdmin, updateUser);
router.get('/AdminPanel/Users/delete/:id',verifyToken, isAdmin, deleteUser);

//AdminaPanel/Orders
router.get('/AdminPanel/Orders',verifyToken, isAdmin, listOrder);
router.get('/AdminPanel/Orders/create',verifyToken, isAdmin, showCreateFormOrder);
router.post('/AdminPanel/Orders/create',verifyToken, isAdmin, createOrder);
router.get('/AdminPanel/Orders/edit/:id',verifyToken, isAdmin, showEditFormOrder);
router.post('/AdminPanel/Orders/edit/:id',verifyToken, isAdmin, updateOrder);
router.get('/AdminPanel/Orders/delete/:id',verifyToken, isAdmin, deleteOrder);

//AdminaPanel/Transaction
router.get('/AdminPanel/Transactions',verifyToken, isAdmin, listTransaction);
router.get('/AdminPanel/Transactions/create',verifyToken, isAdmin, showCreateFormTransaction);
router.post('/AdminPanel/Transactions/create',verifyToken, isAdmin, createTransaction);
router.get('/AdminPanel/Transactions/edit/:id',verifyToken, isAdmin, showEditFormTransaction);
router.post('/AdminPanel/Transactions/edit/:id',verifyToken, isAdmin, updateTransaction);
router.get('/AdminPanel/Transactions/delete/:id',verifyToken, isAdmin, deleteTransaction);


module.exports = router;