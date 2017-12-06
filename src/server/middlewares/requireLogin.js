module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(403).send({
            errorMessage: 'You must be logged in',
        })
    }
    next()
}
