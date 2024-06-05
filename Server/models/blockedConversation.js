
const mongoose= require('mongoose');
const User= require('./userModel');

const conversationSchema= new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true});

const Blockedconversation = mongoose.models.Blockedconversation || mongoose.model('Blockedconversation', conversationSchema);

module.exports= Blockedconversation;