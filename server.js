const dotenv = require('dotenv').config()

// Packages
const express = require('express')
const Handlebars = require('handlebars')
const mongoose = require('mongoose')

// Functions from Packages
const { engine } = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

async function main() {
    const port = process.env.SERVER_PORT
    const db_url = process.env.DB_URL

    const app = express()
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

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

    console.log(port, db_url);

    app.listen(port, () => {
        console.log("Express app now listening...")
        mongoose.connect(db_url)
        console.log("Connected to database.")
    });
}

main();