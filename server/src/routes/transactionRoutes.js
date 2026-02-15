const express = require('express');
const router = express.Router();
const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTransactions)
    .post(protect, createTransaction);

router.route('/:id')
    .get(protect, getTransaction)
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
