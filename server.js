const express = require('express')
const { engine } = require('express-handlebars')

async function main() {
    const app = express()

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

    // Routes
    const homeRouter = require('./src/routes/homeRouter.js')
    const postRouter = require('./src/routes/postRouter.js')

    app.use('/', homeRouter);
    app.use('/posts', postRouter);

    app.listen(3000, () => {
        console.log("Express app now listening...");
    });
}

main();