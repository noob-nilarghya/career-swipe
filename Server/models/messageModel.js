
const mongoose= require('mongoose');

const messageSchema= new mongoose.Schema({
    senderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender ID is required']
    },
    recieverID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reciever ID is required']
    },
    messageContent: {
        type: String,
        required: [true, 'Message content is required']
    }
}, {timestamps: true});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

module.exports= Message;