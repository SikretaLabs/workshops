const mongoose = require('mongoose');

const logdataSchema = new mongoose.Schema({
    event: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('logging', logdataSchema)