
const mongoose= require('mongoose');
const User= require('./userModel');

const conversationSchema= new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messageID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
}, {timestamps: true});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

module.exports= Conversation;