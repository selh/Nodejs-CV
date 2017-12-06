const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { validationResult } = require('express-validator/check')
const { matchedData } = require('express-validator/filter')

const requireLogin = require('../middlewares/requireLogin')
const { UserUpdateProfileValidation, UserUpdatePasswordValidation } = require('../models/user')

router.use(requireLogin)

router.post('/profile', UserUpdateProfileValidation, (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage:  _.map(errors.mapped(),
                (value, key) => `${_.upperFirst(key)} ${value.msg}`
            ).join('. '),
        })
    }

    req.user.updateProfile(matchedData(req)).then((savedUser) => {
        res.json(savedUser.publicJson())
    }).catch((error) => {
        res.status(400).json({ errorMessage: error.message })
    })
})

router.post('/updatePassword', UserUpdatePasswordValidation, (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errorMessage: _.map(errors.mapped(),
                (value, key) => `${_.upperFirst(key)} ${value.msg}`
            ).join('. '),
        })
    }

    req.user.updatePassword(matchedData(req)).then((savedUser) => {
        res.json(savedUser.publicJson())
    }).catch((error) => {
        res.status(400).json({ errorMessage: error.message })
    })
})

module.exports = router
