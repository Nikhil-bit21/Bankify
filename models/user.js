const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    pin:{
        type:String,
        required:true,
    }
});

userSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password') && !person.isModified('pin')) return next();
    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        const hashedPin = await bcrypt.hash(person.pin, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        person.pin = hashedPin;
        next();
    }catch(err){
        return next(err);
    }
})

userSchema.methods.comparePassword = async function(UserPassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(UserPassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

userSchema.methods.comparePin = async function(UserPin){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(UserPin, this.pin);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;