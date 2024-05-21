const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('./../jwt');
const Admin = require('../models/admin');
const User = require('./../models/user')
const Account = require('./../models/account');

router.post('/deposit', jwtAuthMiddleware, async (req, res) => {
    try {

        if ((await req.user.isAdmin)) {
            return res.status(403).json({message: 'Admin has not allowed these operations'});
        }

        const userData = req.body;
        const userPin = userData.userPin; // Ensure this matches the sent JSON structure
        const userAccountNumber = userData.userAccountNumber; // Accessing "userAccountNumber"
        const amount = userData.amount; // Accessing "amount"

        if (!userPin || isNaN(userAccountNumber) || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Fetch the account
        const account = await Account.findOne({ accountNumber: userAccountNumber });

        if (!account) {
            return res.status(401).json({ message: 'Invalid account number' });
        }

        // Log the values before comparison
        // console.log(`Comparing PIN: provided(${userPin}), stored(${account.pin})`);

        if (!await account.comparePin(userPin)) {
            return res.status(401).json({ message: 'Invalid account PIN' });
        }

        account.balance += amount;

        account.transactions.push({
            modeOfPayment: 'cash',
            type: 'credit',
            amount: amount,
            timestamp: new Date()
        });

        await account.save();

        res.status(200).json({ account: account });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', jwtAuthMiddleware, async (req, res) => {
    const userId = req.user.id;

        try {
            // Find the account associated with the given user ID
            const account = await Account.findOne({ User: userId });

            if (!account) {
                return res.status(404).json({ message: 'Account not found for the given user' });
            }

            // Proceed with your logic if the account is found
            res.status(200).json({ account: account });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }

});




module.exports = router;