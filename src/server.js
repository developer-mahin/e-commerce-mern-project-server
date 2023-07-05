const colors = require("colors");
require("dotenv").config();
const port = process.env.PORT || 5000
const mongoose = require('mongoose');

const app = require("./app")

mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Database connect successfully".blue.bold)
})



app.listen(port, () => {
    console.log(`Server is running successfully http://localhost:5000/`.white.bold)
})