
const express= require('express');

// const app= express(); --> Moved into socket.js
const { app, server } = require('./socket/socket');
const mongoose= require('mongoose');
const path= require('path');
const https= require('https');
// const __dirname= path.resolve();
const dotenv= require('dotenv');
dotenv.config({path: './.env'});
const cookieParser= require('cookie-parser');
const cors= require('cors');
const bodyParser= require('body-parser');

const corsOptions = {
    origin: process.env.CLIENT_URL, // Specify the exact origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'Cache-Control' ]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Cache-Control');
    next();
});

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded( {extended: false } ));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'userPic')));

app.use(express.static(path.join(process.cwd(), "Client", "dist")));
app.use(express.static(path.join(process.cwd())));

const PORT= process.env.PORT || 3000;

const connectionString= process.env.DB_CONNECTION_STRING;
mongoose.connect(connectionString);

const db= mongoose.connection;
db.on('error', err => {
    console.log('Connection Failed: ', err);
});
db.once('open', () => {
    console.log('[Database Connection Successful]');
});

const userRouter= require('./routes/userRouter');
const candidateRouter= require('./routes/candidateRouter');
const recruiterRouter= require('./routes/recruiterRouter');
const messageRouter= require('./routes/messageRouter');
const feedRouter= require('./routes/feedRouter');

app.get('/api/keep-alive', (req, res) => {
    res.send('Pinging from server');
});

app.use('/api/user', userRouter);
app.use('/api/candidate', candidateRouter);
app.use('/api/recruiter', recruiterRouter);
app.use('/api/message', messageRouter);
app.use('/api/feed', feedRouter);

function keepAlive(){
    setInterval(() => {
        https.get(`${process.env.SERVER_URL}/api/keep-alive`, (res) => {
            console.log(`Server is alive: ${res.statusCode}`)
        }).on('error', (e) => {
            console.log(`Error pinging server: ${e.message}`);
        });
    }, 2000);
}

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(process.cwd(), "sitemap.xml"));
})

app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), "Client", "dist", "index.html"));
});

server.listen(PORT, () => {
    console.log(`[Listening on port ${PORT}]`);
    keepAlive();
});