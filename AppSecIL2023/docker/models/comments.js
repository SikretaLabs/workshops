const mongoose = require('mongoose');

const commentsdataSchema = new mongoose.Schema({
    msg: {
        required: true,
        type: String
    },
    postId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    author: {
        required: true,
        type: String
    },
    authorId: {
        required: true,
        type: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('comments', commentsdataSchema)