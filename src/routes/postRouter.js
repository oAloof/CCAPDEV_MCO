const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')

router.get('/new', checkAuthenticated, async (req, res) => {
    res.render('posts/new', { 
        layout: 'create-post', 
        user_auth: req.user.username 
    })
})

router.post('/new', async (req, res) => {
    
    let post = new Post({
        forum: req.body.forumbox,
        username: req.user.username || "Anonymous",
        title: req.body.titlebox,
        content: req.body.textbox
    })

    try {
        post = await post.save()
        // Add new post to user's posts array
        req.user.posts.push(post._id)
        req.user.save()
        // const posts = await Post.find({}).exec()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', checkAuthenticated, async (req, res) => {
    const post = await Post.findById(req.params.id).lean().exec()
    if (post == null) res.redirect('/')
    res.render('posts/view', {
        title: post.title,
        post: post,
        layout: "post-view",
        user_auth: req.user.username
    })
})

// This updates the database and refreshes comment display on a post.
router.post('/:id', async(req, res) => {
    if (req.user) {
        var pushed_comment = {"author": req.user.username,"body": req.body.commentArea}
    } else {
        var pushed_comment = {"body": req.body.commentArea}
    }
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,
            { $push: {"comments": pushed_comment} },
            { returnDocument: "after" })
            
        res.redirect('/posts/'+ req.params.id)
    } catch (e) {
        console.log(e)
        res.status(500)
    }
})

// Middleware for checking User authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

module.exports = router

