const express = require('express')
const router = express.Router();
const Post = require('../db/models/post.js')

router.get('/new', (req, res) => {
    res.render('posts/new', { layout: false })
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean().exec()
    if (post == null) res.redirect('/')
    // FIX: Make it so that the full text is seen
    res.render('posts/view', {
        title: post.title,
        post: post,
        layout: "post-view"
    })
})

router.post('/:id', async (req, res) => {
    let comment = {author: "User", body: req.body.comment-area}

    Post.findByIdAndUpdate(req.params.id,
        { "$push": { "childrens": employee._id } },
        { "new": true, "upsert": true },
    );
})

module.exports = router;