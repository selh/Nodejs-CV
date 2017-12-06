const { sqlInsert, sqlSelect ,sqlDelete} = require('../db')
const _ = require('lodash')
const { User } = require('./user')
const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, sender, type, created_at) VALUES (?, ?, ?, ?, ?,?)'

class Notifications {
    constructor(props) {
        if (props) {
            this.documentId = props.documentId ? props.documentId : null
            this.timeStamp = props.timeStamp ? props.timeStamp : ''
            this.type = props.type ? props.type : 'system'
            this.sender = props.sender ? props.sender: ''
            this.email = props.email ? props.email : ''
            //only set for shares
            this.targets = props.targets ? props.targets: ''

        }
    //checks if document exists

    //checks if user exists ,returns iD
    }


    create() {
        // might query using username instead ?
        return new Promise ((resolve,reject)=>{
            //because we are spawning multiple notifications for sharing, we need to iterate a list of targets

            if(this.type =='share') {
                return resolve(this.createShareNotification())
            }

            if(this.type=='comment') {

                this.getUUid().then((success,err)=>{
                    if(success){
                        return resolve(this.createCommentNotification(success))
                    }
                    if(err){
                        reject(null)
                    }
                })

            }

        })
    }

    getUUid () {
        const newId = 'SELECT UUID() AS uuid'
        return new Promise((resolve, reject) =>{
            sqlSelect(newId,null, (err,result)=>{
                if(err){
                    return reject(null)
                }
                if(result){

                    return resolve(result[0].uuid)
                }
            })
        })


    }


    createShareNotification(){
        //creates a notification object for each user inside the targetslist, with sender = owner of document
        return new Promise ((resolve,reject) => {
            this.getDocOwner(this.documentId).then((docOwner,err) => {
                if (err) {
                    return resolve({ message: err })
                }

                if(docOwner){
                    //set the sender as doc owner
                    this.sender = docOwner[0].username
                    //get uuids from targets
                    this.parseTargets().then( (sendTo,err) =>{
                        //should get an array of users
                        if(err){
                            reject(new Error('fail to get users'))
                        }

                        if(sendTo){
                            //list of users to notify
                            //we want a uuid for each new user
                            this.bulkCreateUUIds(sendTo).then((uuidArray,error) =>{
                                if(error) {
                                    return reject (new Error(error))
                                }

                                if(uuidArray){
                                    let results = this.bulkCreateNotifications(sendTo,uuidArray).then((shareNotifications,err)=>{
                                        if(shareNotifications){
                                            return resolve(shareNotifications)
                                        }
                                        if(err){
                                            return reject(new Error(err))
                                        }
                                    })
                                    return results
                                }

                            })
                        }
                    })
                }
            })
        })

    }



    parseTargets(){
        let targetIds = this.targets.map((target)=>{
            return User.findOneByEmail(target)
        })
        return Promise.all(targetIds)
    }

    bulkCreateUUIds(emails){
        return Promise.all(
            emails.map(() => {
                return this.getUUid()
            }))
    }

    bulkCreateNotifications(sendTo,uuidArray){
        return Promise.all(
            sendTo.map((newShare,index) => {
                if(newShare !=null ) {
                    return  new Promise ((resolve,reject) => {
                        sqlInsert(createQuery, [uuidArray[index],newShare.uuid, this.documentId,this.sender, this.type,this.timeStamp], (err, result) => {
                            if (err) {
                                console.log(err)
                                return reject(new Error(err))
                            }
                            if(result){
                                return resolve({
                                    uuid:uuidArray[index],
                                    target: newShare.username,
                                    type:this.type,
                                    sender:this.sender,
                                    documentId: this.documentId,
                                    timeStamp:this.timeStamp,
                                })
                            }
                        })

                    })
                }
            })
        )

    }


    createCommentNotification(uuid) {
        const createQuery = 'INSERT INTO notifications (uuid, user_id, document_id, sender, type, created_at) VALUES (?, ?, ?, ?, ?,?)'

        return new Promise((resolve, reject) => {
            // notifications has to have userid, docid and a type of notification
            if( !this.documentId || !this.type) {
                return reject({message:'Missing userID and docID'})
            }

            this.getDocOwner(this.documentId).then ((success, err) => {
                if (err) {
                    return resolve({ message: err })
                }
                if (success) {

                    let userId = success[0].uuid
                    let username = success[0].username

                    if(username == this.sender) {
                        //No need to emit your own notification
                        return reject({message:'Cannot create notifcation for yourself'})

                    } else {
                        //go ahead and create the notification
                        sqlInsert(createQuery, [uuid,userId, this.documentId,this.sender, this.type,this.timeStamp], (err, result) => {
                            if (err) {
                                console.log(err)
                                return resolve({ params: [username, this.documentId, this.type, this.timeStamp], error: err })
                            }
                            if(result){
                                return resolve({
                                    uuid:uuid,
                                    target: success[0].username,
                                    type:this.type,
                                    sender:this.sender,
                                    documentId: this.documentId,
                                    timeStamp:this.timeStamp,
                                })
                            }
                        })
                    }
                }
            })
        })
    }

    load() {
        let that = this
        const fetchNotificationQuery = 'SELECT notifications.uuid, notifications.user_id, type, sender, notifications.created_at, document_id, title FROM notifications  LEFT JOIN documents ON notifications.document_id = documents.uuid WHERE notifications.user_id = ? ORDER BY notifications.created_at DESC'
        return new Promise((resolve, reject) => {
            User.findOneByEmail(this.email).then( (success, err) => {
                if (err) {
                    //console.log(err)
                    return reject(new Error('cant email'))
                }
                if (success) {
                    console.log(success)
                    let uuid = success.uuid
                    sqlSelect(fetchNotificationQuery, [uuid], (err, result) => {
                        if(err) {
                            console.log(err)
                            return reject(new Error('cant fetch notification'))
                        }
                        if(result){
                            console.log(result)
                            return resolve({notifications:that.parseOutput(result)})
                        }
                    })
                } else {
                    return reject(new Error('no such email'))
                }
            })
        })
    }

    delete(id){
        const deleteNotification = 'DELETE FROM notifications WHERE uuid = ?'
        return new Promise((resolve, reject)=> {
            sqlDelete(deleteNotification,[id],(err,result) => {
                if(err) {
                    console.log(err)
                    return reject({message:'fail to fetch notifications'})
                }
                if(result){
                    console.log(result)
                    return resolve({result})
                }
            })
        })
    }

    parseOutput(rows) {
        let that= this
        return _.map(rows, function (entries) {
            //convert blob to string
            return {
                email: that.email,
                type: entries.type,
                timeStamp: entries.created_at,
                document_id:entries.document_id,
                file: entries.title,
                uuid:entries.uuid,
                sender: entries.sender,
            }
        })
    }

    getDocOwner(doc_id) {
        const FIND_DOC_OWNER = 'SELECT users.uuid, username FROM documents, users where documents.uuid = ? AND documents.user_id = users.uuid'
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_DOC_OWNER, [ doc_id ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result/** || result**/) { // Check valid result ... ?
                    return reject(new Error('Unknown Error'))
                }
                return resolve(result)
            })
        })
    }



}

module.exports = Notifications
