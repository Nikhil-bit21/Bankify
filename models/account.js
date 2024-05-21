const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: Number,
        required: true
    },
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pin: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [{
        modeOfPayment: {
            type: String,
            enum: ['cash', 'upi'],
            required: true
        },
        type: {
            type: String,
            enum: ['credit', 'debit'],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// accountSchema.pre('save', async function(next){
//     const person = this;

//     // Hash the password only if it has been modified (or is new)
//     if(!person.isModified('pin')) return next();
//     try{
//         // hash password generation
//         const salt = await bcrypt.genSalt(10);

//         const hashedPin = await bcrypt.hash(person.pin, salt);

//         person.pin = hashedPin;
//         next();
//     }catch(err){
//         return next(err);
//     }
// })


accountSchema.methods.comparePin = async function(UserPin){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(UserPin, this.pin);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;