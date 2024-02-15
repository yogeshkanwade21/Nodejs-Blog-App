const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const Blog = require('../models/blog');
const Comment = require('../models/comments');

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
    if (req.user)  {
        return res.render('addBlog', {
            user : req.user
        });
    }

    return res.redirect('/user/signin');
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
    res.redirect(`/blog/${blog._id}`);
})

router.get('/:blogId', async (req, res) => {
    const blog = await Blog.findById(req.params.blogId).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.blogId}).populate('commentedBy').sort({createdAt: -1});
    // console.log(comments);
    return res.render('blog', {
        blog,
        comments,
        user: req.user
    })
})

// comments
router.post('/comment/:blogId', async (req, res) => {
    const { content } = req.body;
    const blogId = req.params.blogId;
    const commentedBy = req.user._id;
    const comment = await Comment.create({
        content,
        commentedBy,
        blogId,
    });
    // console.log(comment);
    return res.redirect(`/blog/${req.params.blogId}`);
})

// delete blog from user profile page
router.delete('/:blogId', async (req, res) => {
    const blogToBeDeleted = req.params.blogId;
    console.log(blogToBeDeleted);
    try {
        const result = await Blog.deleteOne({ _id: blogToBeDeleted });

        if (result.deletedCount > 0) {
            console.log('route: deleted successfully');
            res.status(200).json({ message: 'Blog deleted successfully' });
        } else {
            console.log('no matching blog found');
            res.status(404).json({ message: 'No matching blog found' });
        }
    } catch (error) {
        console.log('catch block of delete blog route: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
module.exports = router;