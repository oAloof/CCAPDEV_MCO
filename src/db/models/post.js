const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    votes: {
        type: Number, 
        default: 0
    },
    forum: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{ author: String, body: String, date: Date, votes: Number}]
})

module.exports = mongoose.model('Post', postSchema)