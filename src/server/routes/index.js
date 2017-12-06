const db = require('../db')
const passport = require('passport')

module.exports = (app) => {
    app.use('/api', require('./api'))
    app.use(require('./auth'))
    // Development Testing Routes
    if (process.env.NODE_ENV === 'development') {
        app.get(
            '/test',
            passport.authenticate('jwt', { session: false }),
            (req, res) => {
                res.send(req.user)
            }
        )

        //Lets have this our main API routing?
        app.post(
            '/select',
            (req, res) => {
                db.sqlSelect('select * from users;', [], function(err, result){
                    if (err){
                        res.send(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }
        )

        app.post(
            '/insert',
            (req, res) => {
                let query = 'INSERT INTO users (uuid, username, firstname, lastname, email_address, password)' +
                        'VALUES (uuid(), ?, ?, ?, ?, ?);'
                let params = ['tommy', 'Tom', 'Abbot', 'tom@email.com', 'password']

                db.sqlSelect(query, params, function(err, result){
                    if (err){
                        res.send(err)
                    }
                    else{
                        res.send(result)
                    }
                })
            }

        )
    }
}
