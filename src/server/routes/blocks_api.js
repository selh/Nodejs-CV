const express = require('express')
const router = express.Router()
const { Block } = require('../models/block')
const requireLogin = require('../middlewares/requireLogin')
router.use(requireLogin)

router.get('/', (req, res) => {
    const user_id = req.user.uuid
    Block.LoadBlocksByUserId(user_id).then((result, err) => {
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

router.post('/create', (req, res) => {
    Block.GetNewUuid().then((result, err) => {
        if (err || !result || !result.uuid) {
            console.error(err)
            res.send(err)
            res.status(400).send()
            throw (err)
        }
        else {
            let newBlock = new Block({
                uuid: result.uuid,
                user_id: req.user.uuid,
                label: req.body.label,
                type: req.body.type,
            })
            newBlock.create().then((err, newBlock) => {
                if (err) {
                    res.send(err)
                }
                res.send(newBlock)
            })
        }
    })
})

router.post('/edit', (req, res) => {
    Block.edit(req.body).then((editedBlock, err) => {
        if (err) {
            console.log('err: ' + err)
            res.send(err)
            throw (err)
        } else {
            res.send(editedBlock)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message: 'Something went wrong loading blocks' })
    })
})

module.exports = router
