// Modules
const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')

// MongoDB Models
const Post = require('../db/models/post.js')
const User = require('../db/models/user.js')

const router = express.Router()

// Constant for About Page
NPM_PACKAGES = ["@handlebars/allow-prototype-access","bcrypt","dotenv","express","express-flash","express-handlebars","express-session","mongoose","passport","passport-local","nodemon"]

router.get('/', async (req, res) => {
    const key = req.query.sort
    var param = {date: -1}
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
                param = {date: -1}
                break
    }}
    const posts = await Post.find({})
        .where('status').ne('Removed')
        .sort(param)
        .exec()

    const user_auth = req.user ?? false
    res.render('home', {
        title: 'Convo - Homepage',
        searchbar: true,
        posts: posts,
        user_auth: (user_auth? user_auth.username : false)
    })
})

router.get('/search', checkAuthenticated, async (req, res) => {
    let keyword = new RegExp(req.body.search, 'i')
    const posts = await Post.find({})
        .or([
            { forum: keyword },
            { username: keyword },
            { title: keyword },
            { content: keyword }
        ])
        .where('status').ne('Removed')
        .sort([['date', -1]])
        .exec()
        
    res.render('home', {
        title: 'Convo - Homepage',
        posts: posts,
        user_auth: req.user.username
    })
})

router.get('/about', (req, res) => {
    res.render('about', {
        packages: NPM_PACKAGES,
        user_auth: req.user.username
    })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { layout: false })
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) { return next(err) }
        res.redirect('/login')
    })
})

router.get('/signup', checkNotAuthenticated, (req, res) => {
    res.render('signup', { layout: false })
})

router.post('/signup', checkNotAuthenticated, async (req, res) => {
    // Check if username already exists
    const result = await User.findOne({"username": req.body.username})
    if (result) {
        res.send("User exists")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let user = new User({
            username: req.body.username,
            password: hashedPassword
        })

        try {
            user = await user.save()
            res.send("Success")
        } catch (e) {
            console.log(e)
        }
    }  
})

router.post('/upvote', checkAuthenticated, async (req, res) => {
    // Check whether post or comment
    if (req.body.type === "post") {
        // Add or remove post id from user posts array
        if (req.body.votes == 1) {
            req.user.upvoted_posts.push(req.body.postDataID)
            req.user.save()
        } else if (req.body.votes == -1) {
            const indexToRemove = req.user.upvoted_posts.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.upvoted_posts.splice(indexToRemove, 1);
                req.user.save()
            }
        } else if (req.body.votes == 2) {
            // Votes being == 2 means the post was downvoted and now just got upvoted
            // Remove post id from downvoted posts and add to upvoted posts
            const indexToRemove = req.user.downvoted_posts.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.downvoted_posts.splice(indexToRemove, 1);
            }
            req.user.upvoted_posts.push(req.body.postDataID)
            req.user.save()
        }
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
        // Add or remove comment id from user comments array
        if (req.body.votes == 1) {
            req.user.upvoted_comments.push(req.body.postDataID)
            req.user.save()
        } else if (req.body.votes == -1) {
            const indexToRemove = req.user.upvoted_comments.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.upvoted_comments.splice(indexToRemove, 1);
                req.user.save()
            }
        } else if (req.body.votes == 2) {
            // Votes being == 2 means the comment was downvoted and now just got upvoted
            // Remove comment id from downvoted comments and add to upvoted comments
            const indexToRemove = req.user.downvoted_comments.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.downvoted_comments.splice(indexToRemove, 1);
            }
            req.user.upvoted_comments.push(req.body.postDataID)
            req.user.save()
        }

        // Increment vote counter
        await Post.updateOne({_id: req.body.postDataID, "comments._id": req.body.commentDataID}, 
        {$inc: { "comments.$.votes": req.body.votes }})

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

router.post('/downvote', checkAuthenticated, async (req, res) => {
    // Check whether post or comment
    if (req.body.type === "post") {
        // Add or remove post id from user posts array
        if (req.body.votes == -1) {
            req.user.downvoted_posts.push(req.body.postDataID)
            req.user.save()
        } else if (req.body.votes == 1) {
            const indexToRemove = req.user.downvoted_posts.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.downvoted_posts.splice(indexToRemove, 1);
                req.user.save()
            }
        } else if (req.body.votes == -2) {
            // Votes being == -2 means the post was upvoted and now just got downvoted
            // Remove post id from upvoted posts and add to downvoted posts
            const indexToRemove = req.user.upvoted_posts.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.upvoted_posts.splice(indexToRemove, 1);
            }
            req.user.downvoted_posts.push(req.body.postDataID)
            req.user.save()
        }

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
        // Add or remove comment id from user comments array
        if (req.body.votes == -1) {
            req.user.downvoted_comments.push(req.body.postDataID)
            req.user.save()
        } else if (req.body.votes == 1) {
            const indexToRemove = req.user.downvoted_comments.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.downvoted_comments.splice(indexToRemove, 1);
                req.user.save()
            }
        } else if (req.body.votes == -2) {
            // Votes being == -2 means the comment was upvoted and now just got downvoted
            // Remove comment id from upvoted comments and add to downvoted comments
            const indexToRemove = req.user.upvoted_comments.findIndex(obj => obj._id == req.body.postDataID);
            // If the object with the given id exists in the array, remove it
            if (indexToRemove != -1) {
                req.user.upvoted_comments.splice(indexToRemove, 1);
            }
            req.user.downvoted_comments.push(req.body.postDataID)
            req.user.save()
        }

        // Increment vote counter
        await Post.updateOne({_id: req.body.postDataID, "comments._id": req.body.commentDataID}, 
        {$inc: { "comments.$.votes": req.body.votes }})

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

// Middleware for checking User authentication
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return res.redirect('/') }
    next()
}

module.exports = router