const dotenv = require('dotenv').config()

// Packages
const express = require('express')
const Handlebars = require('handlebars')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

// Functions from Packages
const { engine } = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

async function main() {
    const port = process.env.SERVER_PORT
    const db_url = process.env.DB_URL

    // Initializing the passport
    const User = require('./src/db/models/user.js')
    const initializePassport = require('./passport-config.js')
    initializePassport(
        passport, 
        name => { return User.findOne({username: name}) },
        id => { return User.findOne({_id: id}) }
    )

    const app = express()
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())

    // Static Links (for our stylesheets)
    app.use(express.static(__dirname + '/public'))

    // Handlebars
    app.set('view engine', 'hbs')
    app.set('views', `${__dirname}/src/views`)
    app.engine('hbs', engine({
        layoutsDir: `${__dirname}/src/views/layout`,
        partialsDir: `${__dirname}/src/views/partial`,
        extname: 'hbs',
        defaultLayout: 'index',
        helpers: require('./src/views/handlebars-helpers').helpers,
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    }))

    // Routes
    const homeRouter = require('./src/routes/homeRouter.js')
    const postRouter = require('./src/routes/postRouter.js')
    const userRouter = require('./src/routes/userRouter.js')

    app.use('/', homeRouter);
    app.use('/posts', postRouter);
    app.use('/users', userRouter)

    app.listen(port, () => {
        console.log("Express app now listening...")
        mongoose.connect(db_url)
        console.log("Connected to database.")
    });
}

main();