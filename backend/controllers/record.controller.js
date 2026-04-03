const Record = require("../models/record.model.js");

const createRecord = async (req, res) => {
    try {

        const { amount, type, category, date, notes } = req.body

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid Amount" });

        }

        const record = await Record.create({
            userId: req.user.id,
            amount,
            type,
            category,
            date,
            notes
        });

        res.status(201).json(record);

    } catch (error) {

        console.error("Error Creating Record, ", error);
        res.status(500).json({ message: error.message });
    }
}

const getRecords = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        let filter = {
            isDeleted: false,
            userId: req.user.id
        };

        if (type) filter.type = type;
        if (category) filter.category = category;

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const records = await Record.find(filter).sort({ date: -1 });

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✏️ Update Record (Admin + Analyst)
const updateRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Only owner can update
        if (record.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        Object.assign(record, req.body);

        await record.save();

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ❌ Soft Delete (Admin only)
const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: "Record not found" });
        }

        record.isDeleted = true;
        await record.save();

        res.json({ message: "Record deleted" });
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createRecord, deleteRecord, getRecords, updateRecord }


