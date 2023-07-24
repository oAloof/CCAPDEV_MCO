const express = require('express')
const router = express.Router()
const User = require('../db/models/user.js')

router.get('/:username', async (req, res) => {
    const user = await User.findOne({})
        .where('username').equals(req.params.username)
        .exec()
    if (user == null) res.redirect('back')
    res.render('users/view', {
        username: user.username,
        user: user,
        layout: 'profile'
    })
})

module.exports = router