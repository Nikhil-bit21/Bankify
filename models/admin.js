const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age : {
        type:Number,
        required:true,
    },
    mobile: {
        type: String,
        require:true,
        unique:true,
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

// adminSchema.pre('save', async function(next){
//     const person = this;

//     // Hash the password only if it has been modified (or is new)
//     if(!person.isModified('password')) return next();
//     try{
//         // hash password generation
//         const salt = await bcrypt.genSalt(10);

//         // hash password
//         const hashedPassword = await bcrypt.hash(person.password, salt);
        
//         // Override the plain password with the hashed one
//         person.password = hashedPassword;
//         next();
//     }catch(err){
//         return next(err);
//     }
// })

adminSchema.methods.comparePassword = async function(UserPassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        // const isMatch = await bcrypt.compare(UserPassword, this.password);
        return UserPassword === this.password;
    }catch(err){
        throw err;
    }
}

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;