const express = require('express')
const router = express.Router()
const { Document } = require('../models/document')
const { User } = require('../models/user')
const requireLogin = require('../middlewares/requireLogin')


router.use(requireLogin)


router.get('/', (req, res) => {
    const user_email = req.user.email_address
    const user_id = req.user.uuid
    Document.LoadSharedDocumentsByUserEmail(user_email, user_id).then((result, err) => {
        if (err) {
            console.error(err)
            res.send({ message: 'Something went wrong loading shared files' })
        }
        else {
            res.send(result)
        }
    }).catch((exception) => {
        console.error(exception)
        res.send({ message: 'Something went wrong loading shared files' })
    })

})

//post request has ownerId, document Id and user_email , which can be an array
//share with another user with given email

/*
{
    docId: 1,
    shareWith: ["test2@email.com","test3@email.com"]
}
*/
router.post('/share', (req, res) => {

    if (!req.body.shareWith) {
        //if theres no specified user to share with, or it is empty
        res.send({ message: 'There is no one to share with' })
        // Check if target exists
    } else {
        validateUsers(req.body.shareWith).then((success, error) => {
            let pass = true
            if (error) {
                throw Error('No such email')
            }
            if (success) {
                success.forEach((check) => {
                    if (check == null) {
                        pass=false
                    }
                })
                //create share_objects
                if(pass){
                    Document.shareFile(
                        req.user.uuid,
                        req.body.docId,
                        req.body.shareWith)
                        .then((success, err) => {
                            if (err) {
                                res.send({ message: 'THe user does not exists' })
                            }
                            if (success) {
                                res.send(success)
                            }
                        })
                } else {
                    res.send({message:'no such user'})
                }
            }
        })
            .catch((error) =>{
                console.log(error)
                res.sendStatus(403).send({ message:error})
            })
    }
})

function validateUsers(emailArray) {
    let validateTasks = []
    emailArray.forEach((email) => {
        validateTasks.push(User.findOneByEmail(email))
    })

    return Promise.all(validateTasks)
}

module.exports = router
