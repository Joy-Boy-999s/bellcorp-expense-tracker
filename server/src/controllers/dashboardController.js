const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Total Expenses
    const totalExpensesResult = await Transaction.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalExpenses = totalExpensesResult.length > 0 ? totalExpensesResult[0].total : 0;

    // 2. Category Breakdown
    const categoryBreakdown = await Transaction.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
    ]);

    // 3. Recent Transactions (Last 5)
    const recentTransactions = await Transaction.find({ user: userId })
        .sort({ date: -1 })
        .limit(5);

    res.status(200).json({
        totalExpenses,
        categoryBreakdown,
        recentTransactions,
    });
});

module.exports = {
    getDashboardSummary,
};
