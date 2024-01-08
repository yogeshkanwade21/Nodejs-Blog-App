const { Router } = require('express');
const User = require('../models/user');
const router = Router();

router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie('token', token).redirect('/home');
    } catch (error) {
        console.error('catch block of route, error is: ', error.message);
        console.error('redirecting to login page');

        return res.render('signin', {
            error: error.message,
        });
    }
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect('/home');
})

module.exports = router;