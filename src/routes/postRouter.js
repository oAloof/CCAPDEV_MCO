const express = require('express')
const router = express.Router();
const Post = require('../db/models/post.js')

router.get('/new', async (req, res) => {
    res.render('posts/new', { layout: false })
    
    //making a new post file to be added to the database
    /*
    let post = new Post({
        votes: 0, //default value for new post
        forum: "@starwars", //default value for now, no portion for forum yet
        username: "stinkypoopy420", //default value for now, needs login and stuff 
        title: req.body.titlebox,
        content: req.body.textbox,
    })

    try {
        post = await post.save()
        alert("Post inserted into DB!")
    } catch (e) {
        console.log(e)
        res.render('posts/new', { post: post })
    }
    */
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


module.exports = router;