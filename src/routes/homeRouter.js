const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')
const User = require('../db/models/user.js')

router.get('/', async (req, res) => {
    const posts = await Post.find().lean().exec()
    res.render('home', {
        title: 'Convo - Homepage',
        posts: posts
    })
})

router.post('/', async (req, res) => {
    let keyword = new RegExp(req.body.search, 'i')
    const posts = await Post.find({})
        .or([
            { forum: keyword },
            { username: keyword },
            { title: keyword },
            { content: keyword }
        ])
        .sort([['date', -1]])
        .exec()
    res.render('home', {
        title: 'Convo - Homepage',
        posts: posts
    })
})

router.get('/login', (req, res) => {
    res.render('login', { layout: false })
})

router.get('/signup', (req, res) => {
    res.render('signup', { layout: false })
})

router.post('/signup', async (req, res) => {
    let user = new User({
        username: req.body.username,
        password: req.body.password
    })

    try {
        user = await user.save()
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

router.post('/upvote', async (req, res) => {
    // Check whether post or comment
    if (req.body.type === "post") {
        await Post.findOneAndUpdate({_id: req.body.postDataID}, {$inc: { votes: 1 }})
    } else {
        const post = await Post.updateOne({_id: req.body.postDataID, "comments._id": req.body.commentDataID}, 
        {$inc: { "comments.$.votes": 1 }},
        { returnDocument: "after" })

        console.log(await Post.find({_id: req.body.postDataID, "comments._id": req.body.commentDataID}).select("comments") );
        // const updated_voteCount = await Post.find({})
        res.send({data: "hello"})
    }
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

module.exports = router