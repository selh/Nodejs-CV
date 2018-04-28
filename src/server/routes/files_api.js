const express = require('express')
const router  = express.Router()
const { Document } = require('../models/document')
const { DocumentBlock } = require('../models/documentblock')
const requireLogin = require('../middlewares/requireLogin')
const accessFS = require('../fs')

router.use(requireLogin)

/**
 * returns the collection of files base on user session
 */
router.get('/', (req, res) => {
    const user_id = req.user.uuid
    if( user_id ){
        Document.LoadDocumentsByUserId(user_id).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong loading files' })
            }
            else{
                res.send(result)
            }
        }).catch((exception) => {
            console.error(exception)
            res.send({ message : 'Something went wrong loading files' })
        })
    }
    else{
        res.status(403).send({ message : 'User is not authorized'})
    }
})

/**
 * returns file with `id` for the user
 */

router.get('/:id', (req, res) => {
    const user_id = req.user.uuid
    const doc_id     = req.params.id
    Document.VaildateDocumentPermission(doc_id, user_id).then((result, err) => {
        if( err ){
            throw(err)
        }
        else{
            if ( result ){
                return DocumentBlock.GetDocumentBlocks(doc_id)
            }
            else{
                res.status(403).send({ message : 'User does not have permission to view' })
                throw(err)
            }
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.status(403).send({ message : 'Something went wrong loading files' })
        } else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        if ( !res.headersSent ){
            res.status(500).send({ message : 'Something went wrong loading files' })
        }
    })
})


router.post('/update/:doc_id', (req, res) => {
    const user_id = req.user.uuid
    if (user_id) {
        Document.LoadDocumentsByUserId(user_id).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong loading files' })
            } else {
                res.send(result)
            }
        }).catch((exception) => {
            console.error(exception)
            res.send({ message : 'Something went wrong loading files' })
        })
    }
})


router.post('/create', (req, res) => {

    const user_id = req.user.uuid
    const title   = req.body.title != '' ? req.body.title : 'Untitled'
    const blocks  = req.body.blocks
    let doc_id    = ''

    if( user_id && blocks != undefined ){
        let new_doc = {
                        title   : title,
                        version : 1,
                        user_id : user_id,
                      }
        Document.create(new_doc).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong creating file' })
                throw(err)
            }
            else{
                // console.log(result)
                doc_id = result.uuid
                return DocumentBlock.UpdateDocumentBlocks(doc_id, blocks)
            }
        }).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong saving the document' })
                throw(err)
            }
            else{

                return accessFS.generatePDF(doc_id)
            }
        }).then((result, err) => {
            if (err){
                console.error(err)
                res.send({ message : 'Something went wrong saving the pdf' })
                throw(err)
            }
            else{
                // console.log("doc_id:" , doc_id)
                res.send(doc_id) //send doc_id -> uuid back to client
            }
        }).catch((exception) => {
            console.error(exception)
            res.send({ message : 'Something went wrong creating files' })
        })
    }
    else{
        res.status(403).send({ message : 'User is not authorized to create document'})
    }
})

router.get('/pdf/:id', function(req, res){

    const doc_id     = req.params.id
    const user_email = req.user.email_address

    Document.VaildateSharedDocumentPermission(doc_id, user_email).then((result, err) => {
        if (err){
            throw(err)
        }
        else if (result){
            return accessFS.retrievePDF(doc_id)
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong loading the pdf' })
        }
        else{
            res.type('pdf')
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message : 'Something went wrong loading the pdf' })
    })
})


router.get('/download/:id', (req, res) => {
    const doc_id     = req.params.id
    const user_id = req.user.uuid
    Document.VaildateDocumentPermission(doc_id, user_id).then((result, err) => {
        if (err){
            throw(err)
        }
        else if (result){
            return accessFS.retrievePDFpath(doc_id)
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong loading the pdf' })
        }
        else{
            console.log(result)
            res.status(200).download(result, 'Resume.pdf')
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message : 'Something went wrong loading the pdf' })
    })
})

router.post('/savepdf/:id', (req, res) => {

    const user_id = req.user.uuid
    const doc_id  = req.params.id
    const blocks  = req.body.blocks
    const title   = req.body.title != '' ? req.body.title : 'Untitled'

    Document.VaildateDocumentPermission(doc_id, user_id).then((result, err) => {
        if (err){
            throw(err)
        }
        else if (result && blocks != undefined){

            return DocumentBlock.UpdateDocumentBlocks(doc_id, blocks)
        }
        else{
            res.send({ message: 'User is not authorized to access this document'})
            throw(err)
        }
    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong saving the document' })
            throw(err)
        }
        else{

            return Document.UpdateTitleByDocid(doc_id, title)
        }

    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong updating the title' })
            throw(err)
        }
        else{
            return accessFS.generatePDF(doc_id)
        }

    }).then((result, err) => {
        if (err){
            console.error(err)
            res.send({ message : 'Something went wrong saving the pdf' })
            throw(err)
        }
        else{
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message : 'Something went wrong saving the document' })
    })

})

module.exports = router
