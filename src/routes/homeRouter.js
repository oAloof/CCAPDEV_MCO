const express = require('express')
const router = express.Router()
const Post = require('../db/models/post.js')
const User = require('../db/models/user.js')

router.get('/', async (req, res) => {
    const key = req.query.sort
    var param = {}
    if (key !== undefined) {
        switch (key) {
            case "new": 
                param = {date: -1}
                break
            case "hot": 
                param = {dates: -1, votes: -1}
                break
            case "top": 
                param = {votes: -1}
                break
            default: 
                param = { _id: 1 }
                break
    }}
    const posts = await Post.find({})
        .sort(param)
        .exec()
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
        await Post.findOneAndUpdate({_id: req.body.postDataID}, {$inc: { votes: req.body.votes }})
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

router.post('/downvote', async (req, res) => {
    // Check whether post or comment
    if (req.body.type === "post") {
        // Increment vote counter
        await Post.findOneAndUpdate({_id: req.body.postDataID}, {$inc: { votes: req.body.votes }})
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
        {$inc: { "comments.$.votes": -1 }})

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

module.exports = router