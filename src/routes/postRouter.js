const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')

router.get('/new', async (req, res) => {
    res.render('posts/new', { layout: 'create-post' })
})

router.post('/new', async (req, res) => {
    
    let post = new Post({
        forum: req.body.forumbox,
        username: "Anonymous", //needs sessions
        title: req.body.titlebox,
        content: req.body.textbox,
    })

    try {
        post = await post.save()
        const posts = await Post.find({}).exec()
        res.render('home', {
            title: 'Convo - Homepage',
            posts: posts
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean().exec()
    if (post == null) res.redirect('/')
    res.render('posts/view', {
        title: post.title,
        post: post,
        layout: "post-view"
    })
})

// This updates the database and refreshes comment display on a post.
router.post('/:id', async(req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,
            { $push: {"comments": {"body": req.body.commentArea}} },
            { returnDocument: "after" })
            
        res.render('posts/view', {
            title: post.title,
            post: post,
            layout: "post-view"
        })
    } catch (e) {
        console.log(e)
        res.status(500)
    }
})

module.exports = router

