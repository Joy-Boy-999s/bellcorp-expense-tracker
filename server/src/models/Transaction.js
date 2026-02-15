const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ title: 'text', notes: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);
