const Record = require('../models/record.model.js');
const mongoose = require('mongoose');

// 📊 Summary (income, expense, balance)
exports.getSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Record.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0, expense = 0;

        result.forEach(item => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expense = item.total;
        });



        res.json({
            data: {
                totalIncome: income,
                totalExpense: expense,
                netBalance: income - expense
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// 📊 Category-wise spending
exports.getCategoryBreakdown = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await Record.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    isDeleted: false,
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.json({ data });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 📈 Monthly income vs expense
exports.getMonthlyTrends = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await Record.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" },
                        type: "$type"
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        res.json({ data });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🕒 Latest 5 records
exports.getRecentActivity = async (req, res) => {
    try {
        const userId = req.user.id;

        const records = await Record.find({
            userId,
            isDeleted: false
        })
            .sort({ date: -1 })
            .limit(5);

        res.json({
            data: records
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};