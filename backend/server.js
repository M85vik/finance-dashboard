const dotenv = require('dotenv');
dotenv.config();

const app = require("./app.js");


const PORT = process.env.PORT;

if (!PORT) throw new Error("Port Environment Variable Not Loaded");

app.listen(PORT, () => {
    console.log(`Server is Listening at http://localhost:${PORT}/`);

})