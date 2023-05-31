const mongoose = require('mongoose');

const postsdataSchema = new mongoose.Schema({
    published: {
        required: true,
        type: Boolean
    },
    title: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    },
    author: {
        required: true,
        type: String
    },
    authorId: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('posts', postsdataSchema)