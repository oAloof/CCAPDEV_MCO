const express = require('express')
const router = express.Router();
const Post = require('../db/models/post.js')

router.get('/', async (req, res) => {
    const posts = await Post.find().lean().exec()
    res.render('home', {
        title: "Convo - Homepage",
        posts: posts
    })
})

router.get('/db', (req, res) => {
    res.render('temp', { post: new Post() })
})

router.post('/db', async (req, res) => {
    let post = new Post({
        votes: req.body.votes,
        forum: req.body.forum,
        username: req.body.username,
        title: req.body.title,
        content: req.body.content,
    })

    try {
        post = await post.save()
        alert("Post inserted into DB!")
    } catch (e) {
        console.log(e)
        res.render('temp', { post: post })
    }
})

module.exports = router;