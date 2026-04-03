
const mongoose = require('mongoose');


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("Database Environment Variable Not Loaded.")

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Database Connected ✅");

    } catch (error) {

        console.error(error.message);
        process.exit(1);

    }
}


module.exports = connectDB;