const express = require('express')
const router = express.Router()

router.use(require('./sessions'))
router.use('/comment', require('./comment_api'))
router.use('/files', require('./files_api'))
router.use('/users', require('./users'))
router.use('/notifications',require('./notification_api'))
router.use('/shared', require('./shared_api'))
router.use('/blocksapi',require('./blocks_api'))
router.use('/blocks', require('./documentblocks_api'))
router.use('/tracking', require('./tracking'))

module.exports = router
