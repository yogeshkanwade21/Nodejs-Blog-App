const { Router } = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');
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
        // console.log(token);
        res.cookie("token", token);
        res.redirect('/home');
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

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect('/home');
})

router.get('/profile/:userId', async (req, res) => {
    if(req.user){
        const ownUser = await User.findOne({ _id: req.user._id});
        const visitingUser = await User.findOne({ _id: req.params.userId});
        if (ownUser._id.toString() === visitingUser._id.toString()) {
            const blogs = await Blog.find({ createdBy: ownUser._id}).sort({'createdAt': -1});
            const profileBlogs = blogs.map((blog, index) => (
                {
                    number: index + 1,
                    title: blog.title,
                    createdAt: blog.createdAt,
                    _id: blog._id
                }
            ));
            console.log('dynamicBlogs here', profileBlogs);
            return res.render('profile', {
                user: ownUser,
                blogs: profileBlogs
        })
        }
        return res.render('profile', {
            user: visitingUser,
            blogs: null,
        })

    } else {
        res.redirect('/home');
    }

})

module.exports = router;