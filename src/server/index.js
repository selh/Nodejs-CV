const PUBLIC_DIR = `${__dirname}/../public`
const SocketListener = require('./handlers/socketListener')
//node module dependency
const express = require('express')
const app = express()
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')

const config = require('./config')
const keys = require('./config/keys')
const server = require('http').Server(app)
const PORT = process.env.PORT || 9999

app.use(logger('common'))

if (process.env.NODE_ENV !== 'production') {
    // Hot reload in development
    require('./handlers/webpack')(app)
}

if (process.env.NODE_ENV === 'production') {// Only use these in production
    app.set('trust proxy', 'loopback')
    app.use(require('helmet')({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['\'self\''],
                styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
                imgSrc: ['\'self\'', 'data:', 'https://www.gravatar.com'],
                connectSrc: ['\'self\'', config.server.wsFqdn],
                fontSrc: ['\'self\'', 'data:', 'https://fonts.gstatic.com'],
                objectSrc: ['\'none\''],
            },
        },
    }))
    app.use(require('compression')())
}

// Static Assets
// ---
const sendFile = (rootDir, relPath, response) => {
    response.sendFile(relPath, { root: rootDir })
}
app.get('/:filename(main.js|styles.css|pdf.worker.js)', (request, response) => {
    sendFile(PUBLIC_DIR, request.url, response)
})

app.get(['/assets/:filename', '/assets/*/:filename'], (request, response) => {
    sendFile(PUBLIC_DIR, request.url, response)
})

// Bring in these middlewares after assets
app.use(cookieParser({
    secret: keys.cookieKey,
}))
app.use(
    cookieSession({
        maxAge: 24 * 60 * 60 * 1000,   // in ms, 1 day
        keys: [keys.cookieKey],
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' && !process.env.FAKE_PROD,
    })
)
app.use(bodyParser.json())
app.use(require('csurf')({}))
app.use(function (req, res, next) {
    res.cookie('_csrfToken', req.csrfToken(), { sameSite: 'lax' })
    next()
})
require('./handlers/passport')(app)

// routes setup
require('./routes')(app)

app.get('*', (request, response) => {
    sendFile(PUBLIC_DIR, 'index.html', response)
})

server.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`[ OK ] App is listening on port: ${PORT} 👂`)
    console.log(`http://localhost:${PORT}`)
    new SocketListener(server)
})
