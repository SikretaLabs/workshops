const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    subscribers: {
        type: String
    },
    ccnumber: {
        type: String
    },
    ccexp: {
        type: String
    },
    cvc: {
        type: String
    },
    level: {
        type: String
    }
})

module.exports = mongoose.model('users', dataSchema)