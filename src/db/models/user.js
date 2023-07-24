const mongoose = require('mongoose')
const Post = require('./post.js')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    usertag: {
        type: String,
        default: "New User"
    },
    // TODO: Password encryption
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Hello World!"
    },
    pfpic: {
        data: Buffer,
        contentType: String
    },
    posts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post" 
    }]
}) 

module.exports = mongoose.model('User', userSchema)