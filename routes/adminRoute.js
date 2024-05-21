const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('./../jwt');
const Admin = require('../models/admin');
const User = require('./../models/user')
const Account = require('./../models/account');

// const checkAdminRole = async (userID) => {
//     try {
//         // Try to find the user in the User schema
//         const user = await User.findById(userID);
//         if (user) {
//             // User is found in the User schema, so they are not an admin
//             return false;
//         } else {
//             // User is not found in the User schema, check if they are an admin
//             const admin = await Admin.findById(userID);
//             if (admin) {
//                 // User is found in the Admin schema, so they are an admin
//                 return true;
//             } else {
//                 // User is not found in either schema
//                 return false;
//             }
//         }
//     } catch (err) {
//         // Error occurred during database query
//         console.error(err);
//         return false;
//     }
// }


router.post('/', jwtAuthMiddleware, async (req, res) =>{
    try {
        // Check if the user has admin role
        if (!(await req.user.isAdmin)) {
            return res.status(403).json({message: 'User does not have admin role'});
        }

        // Assuming the request body contains the user data
        const userData = req.body;

        // Create a new User document using the Mongoose model
        const newUser = new User(userData);

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Count the number of documents in the Account collection
        const count = await Account.countDocuments();

        // Increment currentAccountNumber and use it as the new account number
        const currentAccountNumber = 1000 + count + 1;

        // Create a new Account document for the user
        const newAccount = new Account({
            accountNumber: currentAccountNumber,
            User: savedUser._id, // Reference the saved user by its _id
            pin: savedUser.pin // Assuming pin is provided in the user data
        });

        // Save the new account to the database
        const savedAccount = await newAccount.save();

        // Send response with the saved user and account
        res.status(200).json({user: savedUser, account: savedAccount});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


// router.put('/:propertyID', jwtAuthMiddleware, async (req, res)=>{
//     try{
//         if(!checkAdminRole(req.user.id))
//             return res.status(403).json({message: 'user does not have admin role'});
        
//         const PropertyID = req.params.propertyID; // Extract the id from the URL parameter
//         const updatedPropertyData = req.body; // Updated data for the person

//         const response = await Candidate.findByIdAndUpdate(PropertyID, updatedPropertyData , {
//             new: true, // Return the updated document
//             runValidators: true, // Run Mongoose validation
//         })

//         if (!response) {
//             return res.status(404).json({ error: 'Property not found' });
//         }

//         console.log('Property data updated');
//         res.status(200).json(response);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// router.delete('/:propertyID', jwtAuthMiddleware, async (req, res)=>{
//     try{
//         if(!checkAdminRole(req.user.id))
//             return res.status(403).json({message: 'user does not have admin role'});
        
//         const propertyID = req.params.propertyID; // Extract the id from the URL parameter

//         const response = await Property.findByIdAndDelete(propertyID);

//         if (!response) {
//             return res.status(404).json({ error: 'Property not found' });
//         }

//         console.log('Property deleted');
//         res.status(200).json(response);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }
// })

// let's start voting
router.get('/:userID', jwtAuthMiddleware, async (req, res)=>{
    
    const userId = req.params.userID;

    try{

        // Check if the user has admin role
        if (!(await req.user.isAdmin)) {
            return res.status(403).json({message: 'User does not have admin role'});
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }

        // Find the accounts that reference the specified user
        const accounts = await Account.find({ User: user._id });
        if (!accounts || accounts.length === 0) {
            return res.status(404).json({ message: 'Accounts not found' });
        }
        return res.status(200).json({account : accounts });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/', jwtAuthMiddleware , async (req, res) => {
    try {
        
        // Check if the user has admin role
        if (!(await req.user.isAdmin)) {
            return res.status(403).json({message: 'User does not have admin role'});
        }

        const Users = await User.find({});

        res.status(200).json(Users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;