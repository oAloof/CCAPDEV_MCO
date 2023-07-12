const express = require('express')

async function main() {
    const app = express()

    app.use(express.static(__dirname + '/public'))

    // Using EJS for now, HBS will be implemented later
    app.set('view engine', 'ejs')
    app.set('views', './src/views')

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