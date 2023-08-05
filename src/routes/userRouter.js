const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')
const User = require('../db/models/user.js')

router.get('/:username', async (req, res) => {
    const user = await User.findOne({})
        .where('username').equals(req.params.username)
        .exec()
    let posts = user.posts
    const postsToRender = []
    for (let postID of posts) {
        postsToRender.push(await Post.findById(postID))
    }
    res.render('users/view', {
        username: user.username,
        user: user,
        posts: postsToRender,
        layout: 'profile',
        user_auth: req.user.username
    })
})

module.exports = router