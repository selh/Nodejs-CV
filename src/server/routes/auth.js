const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/auth/cas', (req, res, next) => {
    passport.authenticate('cas', {
        failureRedirect: '/login',
    }, (err, user, info) => {
        if (err) {
            console.error(err)
            if (process.env.NODE_ENV === 'production') {
                return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
            } else {
                return next(err)
            }
        } else if (!user) {
            console.log(info)
            return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent(info.errorMessage || 'Unknown Error')}`)
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.error(err)
                    if (process.env.NODE_ENV === 'production') {
                        return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
                    } else {
                        return next(err)
                    }
                } else {
                    req.session.source = 'cas'
                    res.cookie('JWT', user.generateJWT(), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' && !process.env.FAKE_PROD,
                        sameSite: 'lax',
                    })
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
})

router.get('/connect/cas', passport.authorize('cas-connect', {
    failureRedirect: '/profile',
}), (req, res) => {
    if (req.user && req.account) {
        console.log(req.account)
        req.user.updateCASID(req.account).then(() => {
            res.redirect(`/profile?extAuthSuccessMessage=${encodeURIComponent('Successfully linked to CAS')}`)
        }).catch((error) => {
            res.redirect(`/profile?extAuthErrorMessage=${encodeURIComponent(error.message)}`)
        })
    } else {
        res.redirect('/')
    }
})

router.delete('/connect/cas', (req, res, next) => {
    if (req.user) {
        if (!req.user.cas_id) {
            return res.status(400).json({ errorMessage: 'Not linked to CAS' })
        }
        req.user.updateCASID(null).then((savedUser) => {
            res.json(savedUser.publicJson())
        }).catch((error) => {
            res.status(500).json({ errorMessage: error.message })
        })
    } else {
        res.sendStatus(403)
    }
})

router.get('/auth/linkedin', passport.authenticate('linkedin', {
    failureRedirect: '/login',
}))

router.get('/auth/linkedin/callback', (req, res, next) => {
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
    }, (err, user, info) => {
        if (err) {
            console.error(err)
            if (process.env.NODE_ENV === 'production') {
                return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
            } else {
                return next(err)
            }
        } else if (!user) {
            return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent(info.errorMessage || 'Unknown Error')}`)
        } else {
            req.login(user, (err) => {
                if (err) {
                    console.error(err)
                    if (process.env.NODE_ENV === 'production') {
                        return res.redirect(`/login?extAuthErrorMessage=${encodeURIComponent('Internal Server Error')}`)
                    } else {
                        return next(err)
                    }
                } else {
                    req.session.source = 'linkedin'
                    res.cookie('JWT', user.generateJWT(), {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production' && !process.env.FAKE_PROD,
                        sameSite: 'lax',
                    })
                    res.redirect('/')
                }
            })
        }
    })(req, res, next)
})

router.get('/connect/linkedin', passport.authorize('linkedin-connect', {
    failureRedirect: '/profile',
}))

router.get('/connect/linkedin/callback', passport.authorize('linkedin-connect', {
    failureRedirect: '/profile',
}), (req, res, next) => {
    if (req.user && req.account) {
        req.user.updateLinkedinID(req.account.id).then(() => {
            res.redirect(`/profile?extAuthSuccessMessage=${encodeURIComponent('Successfully connected to LinkedIn')}`)
        }).catch((error) => {
            res.redirect(`/profile?extAuthErrorMessage=${encodeURIComponent(error.message)}`)
        })
    } else {
        res.redirect('/')
    }
})

router.delete('/connect/linkedin', (req, res, next) => {
    if (req.user) {
        if (!req.user.linkedin_id) {
            return res.status(400).json({ errorMessage: 'Not linked to LinkedIn' })
        }
        req.user.updateLinkedinID(null).then((savedUser) => {
            res.json(savedUser.publicJson())
        }).catch((error) => {
            res.status(500).json({ errorMessage: error.message })
        })
    } else {
        res.sendStatus(403)
    }
})

module.exports = router
