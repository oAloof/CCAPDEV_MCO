const express = require('express')
const { engine } = require('express-handlebars')
const mongoose = require('mongoose')

async function main() {
    const app = express()
    app.use(express.urlencoded({ extended: false }))

    // Static Links (for our stylesheets)
    app.use(express.static(__dirname + '/public'))

    // Handlebars
    app.set('view engine', 'hbs')
    app.set('views', `${__dirname}/src/views`)
    app.engine('hbs', engine({
        layoutsDir: `${__dirname}/src/views/layout`,
        partialsDir: `${__dirname}/src/views/partial`,
        extname: 'hbs',
        defaultLayout: 'index'
    }))

    // DB Models
    const Post = require(`${__dirname}/src/db/models/post.js`)

    // Routes
    const homeRouter = require('./src/routes/homeRouter.js')
    const postRouter = require('./src/routes/postRouter.js')

    app.use('/', homeRouter);
    app.use('/posts', postRouter);

    app.listen(3000, () => {
        console.log("Express app now listening...")
        mongoose.connect('mongodb://0.0.0.0/posts')
        console.log("Connected to database.")
    });
}

/** TODO-LIST:
 *  Implement function to calculate difference from posting date to Date.now
 *  - need this for "XX days ago" in post blocks
 *  Implement the search functionality
 *  Implement the vote arrow functions
 *  - should change the value on site and in mongoDB as well
 */
main();