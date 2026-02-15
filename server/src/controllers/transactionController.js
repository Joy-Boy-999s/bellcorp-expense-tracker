const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get transactions with advanced filtering
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search,
        category,
        minAmount,
        maxAmount,
        startDate,
        endDate,
    } = req.query;

    const query = { user: req.user.id };

    // Search (Text index on title and notes)
    if (search) {
        query.$text = { $search: search };
    }

    // Filter by Category
    if (category) {
        query.category = category;
    }

    // Filter by Amount Range
    if (minAmount || maxAmount) {
        query.amount = {};
        if (minAmount) query.amount.$gte = Number(minAmount);
        if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Filter by Date Range
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const count = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    res.status(200).json({
        data: transactions,
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / limit),
    });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
    const { title, amount, category, date, notes } = req.body;

    if (!title || !amount || !category) {
        res.status(400);
        throw new Error('Please add title, amount and category');
    }

    const transaction = await Transaction.create({
        user: req.user.id,
        title,
        amount,
        category,
        date: date || Date.now(),
        notes,
    });

    res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the transaction user
    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }

    if (transaction.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    res.status(200).json(transaction);
});


module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
};
