const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
const PORT = process.env.PORT || 3000;

const adminRoute = require('./routes/adminRoute');
const loginRoute = require('./routes/loginRoute')
const userRoute = require('./routes/userRoute');

app.use('/bank' , loginRoute);
app.use('/bank/admin' , adminRoute);
app.use('/bank/user' , userRoute);

app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})