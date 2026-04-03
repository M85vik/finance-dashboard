

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.routes');



const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors())

app.get("/", (req,res)=>{
    
    res.send("Server is Live ✅");
    
})


// Auth Routes 
app.use('/api/auth', authRoutes);


module.exports = app;
