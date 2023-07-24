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
        // Increment vote counter
        await Post.findOneAndUpdate({_id: req.body.postDataID}, {$inc: { votes: 1 }})
        // Retrieve the new vote count
        var postComments = await Post.find({_id: req.body.postDataID});
        var newVote_count = 0
        postComments.forEach((document) => {
            if (document._id == req.body.postDataID) {
                newVote_count = document.votes
                return
            }
        })
         // Send data back to client
         res.send({votes: newVote_count})
    } else {
        // Increment vote counter
        await Post.updateOne({_id: req.body.postDataID, "comments._id": req.body.commentDataID}, 
        {$inc: { "comments.$.votes": 1 }})

        // Retrieve the new vote count
        var postComments = await Post.find({_id: req.body.postDataID});
        
        var newVote_count = 0
        postComments.forEach((document) => {
            const comments = document.comments
            comments.forEach((comment) => {
                if (comment._id == req.body.commentDataID) {
                    newVote_count = comment.votes
                    return
                }
            })
        })

        // Send data back to client
        res.send({votes: newVote_count})
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