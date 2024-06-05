const mongoose = require('mongoose');
const validator= require('validator');
const bcrypt= require('bcryptjs'); // password encryption
const crypto= require('crypto'); // random token generate

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'User must have a name']
    },
    email: { 
        type: String, 
        required: [true, 'User must have a email'],
        unique: [true, 'This email is already in use, please use another email']
    },
    age: {
        type: Number,
        required: [true, 'User must have a age'],
    },
    photo: {
        type: String,
        default: 'default.jpeg'
    },
    password: { 
        type: String, 
        required: [true, 'User must have a password'],
        minLength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please provide a confirm password'],
        minLength: 8,
        validate: {
            // This function will not work on update. Validation will only work on CREATE and SAVE
            // To check wheather password is equal to confirm password
            validator: function(el){
                return (el === this.password );
            },
            message: 'Password is not matching....'
        }
    },
    role: { 
        type: String, 
        enum: ['candidate', 'recruiter', 'admin'],
        required: [true, 'Role is required'],
    },
    // No matter right swipe or left swipe, push it here
    visitedID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    // In case of right swipe, push it here.
    // In case of match after right swipe, remove it from here and push it in matchedID array
    rightSwipedID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    // required for chatting/messeging (retrieving conversation list)
    // When someone sent his/her first message, I'll remove it from here and push it in messageID array
    matchedID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    // Basically it's array of ID with which conversations are going on (used to retrieve conversationList)
    // when I'll block someone, I'll remove his/her ID from here 
    messageID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    blockedID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date ,
    active: { // active user (who has not deleted (deactivated) his/her account)
        type: Boolean,
        default: true,
        select: false // we can't display this info
    }
});



// pre' 'save' document middleware, that will hash pwd just before saving
userSchema.pre('save', async function(next) {
    // only encrypt password if password is modified
    if(this.isModified('password') === true) {
        this.password = await bcrypt.hash(this.password, 12); 

        this.confirmPassword= undefined;   // Delete 'passwordConfirm' field
    }

    next();
});


// what happen if user changed their pwd after token is isuued
userSchema.methods.changePwdAfter= function(JWT_timestamp) {
    if(this.passwordChangedAt){
        const changeTimeStamp= parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWT_timestamp < changeTimeStamp; // agar token issue hone ke baad password change kiya gya --> Deny access (true)
    }

    return false; // allow accesss
}

userSchema.methods.createPwdResetToken= function() {
    const resetToken= crypto.randomBytes(32).toString('hex'); 

    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() +10*60*1000; // ms (10 min after current time)

    return resetToken; // user ko actual reset token 
}

userSchema.pre(/^find/, function(next, req) {
    this.find( { active: {$ne: false}} );  // Activated user are those whose active status is undefined or not false
    
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports= User;