const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email :{
        type : String,
        required : [true, 'Email is required'],
        unique : true,
        validate : {
            validator: function(v) { 
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password : {
        type : String,
        required : [true, 'Password is required'],
        minlength : [6, 'Password must be at least 6 characters long']
    },
    address : {
        type : String,
        required : [true, 'Library address is required']
    },
    libraryId : {
        type : String,
        required : [true, 'Library ID is required'],
        unique : true
    },
    contact : {
        type : String,
        required : [true, 'Contact number is required'],
        validate : {
            validator: function(v) { 
                return /^\+?\d{7,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid contact number!`
        }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is new or modified
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords later
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
