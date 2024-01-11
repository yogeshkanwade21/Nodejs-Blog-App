const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const Blog = require('../models/blog');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/blogCoverImages/`));
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      }
    });

    const upload = multer({ storage });

router.get('/add-new', (req, res) => {
    res.render('addBlog');
})

router.post('/', upload.single("coverImage") , async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImage: `/blogCoverImages/${req.file.filename}`
    })
    // console.log(blog);
    res.redirect(`/home`);
})

module.exports = router;