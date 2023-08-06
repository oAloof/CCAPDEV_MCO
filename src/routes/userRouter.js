const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')
const User = require('../db/models/user.js')

router.get('/:username', checkAuthenticated, async (req, res) => {
    const user = await User.findOne({})
        .where('username').equals(req.params.username)
        .exec()

    const posts = await Post.find({ _id: { $in: user.posts } })

    res.render('users/view', {
        username: user.username,
        user: user,
        posts: true,
        toRender: posts,
        layout: 'profile',
        user_auth: req.user.username
    })
})

router.get('/sort', checkAuthenticated, async (req, res) => {
    const user = await User.findOne({})
        .where('username').equals(req.params.username)
        .exec()
    
    const sort = req.query.by

    var idArray 
    switch(sort) {
        case "posts":
            idArray = user.posts
            break
        case "comments":
            idArray = user.comments
            break
        case "upvotedPosts":
            idArray = user.upvoted_posts
            break
        case "downvotedPosts":
            idArray = user.downvoted_posts
            break
    }

    var toRender = []
    if (sort == "comments") {
        const posts = await Post.find({"comments._id": idArray})
        for (let post of posts) {
            let comments = post.comments
            for (let comment of comments) {
                if (idArray.includes(comment._id)) {
                    toRender.push(comment)
                    break
                }
            }
        }
    } else {
        for (let id of idArray) {
            toRender.push(await Post.findById(id))
        }
    }

    var isPost = (sort == "comments")? false: true

    res.render('users/view', {
        username: user.username,
        user: user,
        posts: isPost,
        toRender: toRender,
        layout: 'profile',
        user_auth: req.user.username
    })
})

// Middleware for checking User authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

module.exports = router