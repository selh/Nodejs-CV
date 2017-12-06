const express = require('express')
const router = express.Router()
const Tracking = require('../models/tracking')
const requireLogin = require('../middlewares/requireLogin')

router.use(requireLogin)

router.get('/', (req, res) => {
    Tracking.loadTracking(req.user.uuid)
        .then((result, err) => {
            if (err) {
                res.send({ message: 'cant find trackings' })
            }
            if (result) {
                res.send(result)
            }
        })
        .catch((exception) => {
            console.log(exception)
            res.send({ message: 'something went wrong fetching trackings' })
        })
})

router.post('/create', (req, res) => {
    if (validateJson(req.body)) {
        let newTracking = new Tracking({
            userId: req.user.uuid,
            companyName: req.body.companyName,
            jobTitle: req.body.jobTitle,
        })
        const errorMessage = 'Something went wrong when creating the tracking. Please try again'
        newTracking.create()
            .then(result => {
                res.send(result)
            }, error => {
                console.log(error)
                res.status(500).send({ message: errorMessage })
            })
            .catch((error) => {
                console.log(error)
                res.status(500).send({ message: errorMessage })
            })

    } else {
        res.send({ message: 'Not valid tracking' })
    }
})

function validateJson(reqData) {
    if (!reqData.companyName || !reqData.jobTitle ) {
        return false
    } else {
        return true
    }
}
module.exports = router
