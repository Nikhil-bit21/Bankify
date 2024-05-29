const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const axios = require('axios');

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
const PORT = process.env.PORT || 3000;

const adminRoute = require('./routes/adminRoute');
const loginRoute = require('./routes/loginRoute')
const userRoute = require('./routes/userRoute');

// app.get('/', async (req,res)=>{
//     try {
//         res.redirect('https://nikhilbit21.notion.site/Rentify-Application-3b693b17a9d249c2b1201b3a1e2e7342');
//         // res.status(200).json({ message: `Find all the endpoint details at https://github.com/Nikhil-bit21/Rentify-api` });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

app.get('/', async (req, res) => {
    try {
        const url = 'https://nikhilbit21.notion.site/Bankify-Application-1e214b54a8df4ecfae093b3e0da9058e?pvs=74';
        
        // Make a HEAD request to check if the page is available
        const response = await axios.head(url);
        
        if (response.status === 200) {
            // Page is available, redirect to it
            res.redirect(url);
        } else {
            // Page is not available, send the JSON message
            res.status(200).json({ message: `Find all the endpoint details at https://github.com/Nikhil-bit21/Bankify` });
        }
    } catch (err) {
        // if (err.response && err.response.status === 404) {
            // Notion page not found, send the JSON message
            res.status(200).json({ error_message: `Find all the endpoint details at https://github.com/Nikhil-bit21/Bankify` });
        // } else {
            // Some other error occurred
            console.error(err);
        //     res.status(500).json({ error: 'Internal Server Error' });
        // }
    }
});

app.use('/bank' , loginRoute);
app.use('/bank/admin' , adminRoute);
app.use('/bank/user' , userRoute);

app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})