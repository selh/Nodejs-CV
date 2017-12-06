const express = require('express')
const router = express.Router()
const { DocumentBlock } = require('../models/documentblock')
const requireLogin = require('../middlewares/requireLogin')


router.use(requireLogin)


router.get('/', (req, res) => {
    const user_id = req.user.uuid
    DocumentBlock.LoadDocBlocksByUserId(user_id).then((result, err) => {
        if (err) {
            console.error(err)
            res.send({ message: 'Something went wrong loading blocks' })
        }
        else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message: 'Something went wrong loading blocks' })
    })
})

module.exports = router
