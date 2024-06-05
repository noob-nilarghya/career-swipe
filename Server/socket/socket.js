const { Server } = require('socket.io');
const http = require('http');
const express= require('express');
const dotenv= require('dotenv');
dotenv.config({path: './.env'});
const cookieParser= require('cookie-parser');
const cors= require('cors');
const bodyParser= require('body-parser');

const app= express();
const corsOptions = {
    origin: process.env.CLIENT_URL, // Specify the exact origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'Cache-Control' ]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded( {extended: false } ));
app.use(bodyParser.json());

const server= http.createServer(app);

const io= new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // Specify the exact origin
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'Cache-Control' ]
    },
});


const getRecieverSocketId= (recieverId) => {
    return userSocketMap[recieverId];
}

// to keep a track of online users
const userSocketMap= {}; // map [userID --> socketID]

// io.on is used to listen to events. Can be used in both client and server
io.on('connection', (socket) => {
    console.log('User Connected: ', socket.id);

    const userId= socket.handshake.query.userId;
    if(userId != "undefined"){
        userSocketMap[userId]= socket.id;
    }

    // io.emit is used to send message to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // we will get userId of all connected users

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


// export app, io, server
module.exports= {app, io, server, getRecieverSocketId};