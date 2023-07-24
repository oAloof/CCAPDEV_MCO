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
        default: new Date()
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: [{ 
        author: { 
            type: String,
            default: 'Anonymous'
        }, 
        body: {
            type: String,
            required: true
        }, 
        date: {
            type: Date,
            default: new Date()
        }, 
        votes: {
            type: Number,
            default: 0
        }}]
})

module.exports = mongoose.model('Post', postSchema)