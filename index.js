const express = require('express');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkAuthenticationCookie } = require('./middlewares/authentication');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');

// Middleware to parse the request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkAuthenticationCookie("token"));

// connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/blog-app')
    .then(() => {
        console.log('mongodb connection established');
    })
    .catch(err => console.log(err.message));

// Home route
app.get('/home', (req, res) => {
        return res.render('home', { user: req.user });
})

// user routes
app.use('/user', userRouter);

// server configuration
const server = app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
})

server.on('error', (err)=> {
    console.log(`error: ${err.message}`);
});