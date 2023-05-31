const mongoose = require('mongoose');

const categoriesdataSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('categories', categoriesdataSchema)