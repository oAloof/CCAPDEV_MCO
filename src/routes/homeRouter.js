const express = require('express')
const router = express.Router();

// Temporary API to fetch posts
const fakeAPI = require('../db/tempDB.js')

router.get('/', (req, res) => {
    res.render('home', {
        posts: fakeAPI()
    })
})

module.exports = router;