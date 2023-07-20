const mongoose = require('mongoose')
const Post = require('./post.js')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    // TODO: Password encryption, if there's time
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Hello World!"
    },
    posts: [{ type: Post }]
}) 

module.exports = mongoose.model('User', userSchema)