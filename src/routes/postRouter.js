const express = require('express')
const router = express.Router();
const Post = require('../db/models/post.js')

router.get('/new', (req, res) => {
    res.render('posts/new', { layout: false })
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).lean().exec()
    if (post == null) res.redirect('/')
    res.send("Success!")
})

module.exports = router;