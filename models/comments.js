const { Schema, model } = require('mongoose');
const Blog = require('./blog');
const User = require('./user');

const commentSchema = new Schema({
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: User,
    },
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: Blog,
    },
},
    {timestamps: true}
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;