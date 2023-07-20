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

router.post('/', async (req, res) => {
    const posts = await Post.find().lean().exec()
    res.render('home', {
        title: "Convo - Homepage",
        posts: posts
    })
})

router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

router.get('/signup', (req, res) => {
    res.render('signup', { layout: false })
})

// TEMPORARY CODE: REMOVE ALL LINES BELOW THIS 
// (except module.export)
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