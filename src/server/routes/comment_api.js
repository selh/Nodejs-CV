const express = require('express')
const router = express.Router()
const Comments = require('../models/comments')
const { Document } = require('../models/document')
const requireLogin = require('../middlewares/requireLogin')

router.use(requireLogin)

router.get('/:docId', (req, res) => {
    const docId = req.params.docId
    console.log('Checking permissions for user')
    //Just validate first, if it checkouts , carry on loading comments, else load error
    Document.VaildateSharedDocumentPermission(docId, req.user.email_address).then((result, err) => {
        if (err) {
            res.status(403).send({ message: 'you do not have permission to view this file' })
        }
        if (result) {
            console.log('You have permission')
            Comments.loadComments(docId).then((result, err) => {
                if (err) {
                    res.status(400).send({ message: 'cant find comments' })
                    return
                }
                if (result) {
                    res.send(result)
                    return
                }
            })
                .catch((exception) => {
                    console.log(exception)
                    res.status(500).send({ message: 'something went wrong fetching comments' })
                })

        } else {
            console.log('You dont have permission')
            res.status(403).send({ message: 'you do not have permission to view this file' })
        }
    })
        .catch((exception) => {
            console.log(exception)
            res.status(500).send({ message: 'something went wrong fetching comments' })
        })

})

router.post('/create', (req, res) => {
    //let newComment = {data: this.state.newInput , date:this.getCurrentTime() , author: that.state.currentUser.username ,docId:that.state.currentDoc}
    if (validateJson(req.body)) {
        let newComment = new Comments({
            username: req.body.username,
            userId: req.user.uuid,
            documentId: req.body.docId,
            content: req.body.content,
            timeStamp: req.body.createdAt,
        })

        Document.VaildateSharedDocumentPermission(newComment.documentId, req.user.email_address)
            .then((valid, err) => {
                if(err){
                    res.status(500).send({message:'Error commenting'})
                }

                if (valid) {
                    newComment.validateDocument().then((result, err) => {
                        if (err) {
                            res.send({ message: 'there is no such document' })
                        }
                        else {
                            newComment.create().then((err, result) => {
                                if (err) {
                                    res.send(err)
                                }
                                console.log('created comments')
                                res.send({ createdAt: 'comment created', data: result })
                            })
                        }
                    })
                    .catch((exception) => {
                        res.send({ error: exception })
                    })
                } else {
                    res.status(403).send({message: 'You don\'t have permission'})
                }
            })
    } else {
        res.send({ message: 'Not valid comment' })
    }
})

function validateJson(reqData) {
    if (!reqData.content || !reqData.username || !reqData.docId) {
        return false
    } else {
        return true
    }

}
module.exports = router
