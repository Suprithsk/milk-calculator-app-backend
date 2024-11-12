const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors')
const userRouter=require('./routes/authRoutes')
const milkRouter=require('./routes/milkRoutes')
const userMiddleware=require('./middlewares/userMiddleware')
require('dotenv').config(); 
app.use(bodyParser.json());


app.use(cors());
app.use(bodyParser.json());
app.use("/milk",userMiddleware.userMiddleware,  milkRouter)
app.use("/user", userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB',process.env.MONGODB_URL);
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});