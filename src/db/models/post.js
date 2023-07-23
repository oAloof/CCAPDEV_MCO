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
    comments: [{ body: String, date: Date}]
})

module.exports = mongoose.model('Post', postSchema)