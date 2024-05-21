const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Admin = require('../models/admin');

const {jwtAuthMiddleware, generateToken} = require('../jwt');

// // POST route to add a person
// router.post('/signup', async (req, res) =>{
//     try{
//         const data = req.body 

//         // Check if there is already an admin user
//         const adminUser = await User.findOne({ role: 'admin' });
//         if (data.role === 'admin' && adminUser) {
//             return res.status(400).json({ error: 'Admin user already exists' });
//         }

//         // Create a new User document using the Mongoose model
//         const newUser = new User(data);

//         // Save the new user to the database
//         const response = await newUser.save();
//         console.log('data saved');

//         const payload = {
//             id: response.id
//         }
//         // console.log(JSON.stringify(payload));
//         const token = generateToken(payload);

//         res.status(200).json({response: response, token: token});
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// Login Route
router.post('/login', async (req, res) => {
    try {
        // Extract mobile and password from request body
        const { mobile, password } = req.body;

        // Check if mobile or password is missing
        if (!mobile || !password) {
            return res.status(400).json({ error: 'Mobile and password are required' });
        }

        // Check if the mobile number exists in the user database
        const user = await User.findOne({ mobile: mobile });

        // If user exists and password matches, generate token and return
        if (user && await user.comparePassword(password)) {
            const payload = {
                id: user.id,
                isAdmin: false // Indicate that the user is not an admin
            };
            const token = generateToken(payload);
            return res.json({ token });
        }

        // Check if the mobile number exists in the admin database
        const admin = await Admin.findOne({ mobile: mobile });

        // If admin exists and password matches, generate token and return
        if (admin && await admin.comparePassword(password)) {
            const payload = {
                id: admin.id,
                isAdmin: true // Indicate that the user is an admin
            };
            const token = generateToken(payload);
            return res.json({ token });
        }

        // If neither user nor admin exists or password does not match, return error
        return res.status(401).json({ error: 'Invalid mobile number or password' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Profile route
// router.get('/profile', jwtAuthMiddleware, async (req, res) => {
//     try{
//         const userData = req.user;
//         const userId = userData.id;
//         const user = await User.findById(userId);
//         res.status(200).json({user});
//     }catch(err){
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
//     try {
//         const userId = req.user.id; // Extract the id from the token
//         const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

//         // Check if currentPassword and newPassword are present in the request body
//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
//         }

//         // Find the user by userID
//         const user = await User.findById(userId);

//         // If user does not exist or password does not match, return error
//         if (!user || !(await user.comparePassword(currentPassword))) {
//             return res.status(401).json({ error: 'Invalid current password' });
//         }

//         // Update the user's password
//         user.password = newPassword;
//         await user.save();

//         console.log('password updated');
//         res.status(200).json({ message: 'Password updated' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;