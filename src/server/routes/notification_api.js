const express = require('express')
const router = express.Router()
const Notifications = require('../models/notifications')
const requireLogin = require('../middlewares/requireLogin')
router.use(requireLogin)
//Called after login? or along with login?
router.get('/load', (req, res) => {

    new Notifications({ email: req.user.email_address }).load().then((result, err) => {
        if (result) {
            res.send(result)
        }

        if (err) {
            res.send({ message: 'no notifications' })
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: exception })
        })
})

//end point for sharing notifications




router.post('/create', (req, res) => {


    let newNotification = parseNotificationType(req)

    new Notifications(newNotification).create().then((result, err) => {
        if (err) {
            res.sendStatus(401)
        }

        if (result) {
            res.send(result)
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: exception })
        })
})

router.post('/delete', (req, res) => {

    new Notifications().delete(req.body.id).then((result, err) => {
        if (err) {
            res.sendStatus(500)
        }
        if (result) {
            res.sendStatus(200)
        }
    })


})

function parseNotificationType(req) {
    if (req.body.type == 'comment') {
        return {
            sender: req.body.sender,
            documentId: req.body.documentId,
            timeStamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            type: req.body.type,
        }
    }

    if (req.body.type == 'share') {
        return {
            documentId: req.body.documentId,
            timeStamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            type: req.body.type,
            targets: req.body.targets,
        }
    }

}

module.exports = router
