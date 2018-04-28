const { sqlInsert, sqlSelect, sqlUpdate } = require('../db')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const CREATE_DOC_SQL = 'INSERT INTO documents (uuid, created_at, title, user_id, version) VALUES (?, NOW(), ?, ?, ?)'
const FIND_RECENT_BY_USERID = 'SELECT uuid, title, created_at FROM documents where user_id = ?'
//const FIND_RECENT_BY_USERID_DOCID = 'SELECT uuid, user_id, title, created_at, comments, blocks FROM documents where user_id = ? AND uuid = ? AND version = 1'
//const FIND_FILEPATH = 'SELECT filepath, filename from documents where uuid = ?'
const FIND_FILEPATH_BY_DOCID = 'SELECT filepath, filename from documents where uuid = ?'

const UPDATE_FILEPATH = 'UPDATE documents SET filepath = ?, filename = ? WHERE uuid = ?'
const UPDATE_TITLE_BY_DOC_ID = 'UPDATE documents set title = ? WHERE uuid = ?'
const FIND_SHARED_BY_USEREMAIL = 'SELECT d.uuid, s.owner_id, s.user_email, d.title, d.created_at FROM shared_files s JOIN documents d ON s.document_id = d.uuid WHERE s.user_email = ? OR s.owner_id = ?'
const CHECK_USER_PERMISSION_ON_DOC = 'SELECT user_id from documents where uuid = ?'
const CHECK_USER_PERMISSION_ON_SHARED_DOC = 'SELECT u.email_address, s.user_email from shared_files s join users u on u.uuid = s.owner_id WHERE document_id = ? '

/*This will be visible to public*/
const ParseDocSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            title: entries.title,
            docId: entries.uuid,
            filename: entries.filename,
            filepath: entries.filepath,
            userId: entries.owner_id,
        }
    })
}

class Document {
    constructor(props) {
        if (props) {
            this.doc_id   = props.uuid
            this.title    = props.title ? props.title : 'untitled'
            this.user_id  = props.user_id
            this.version  = props.version
            this.filepath = props.filepath ? props.filepath : ''
            this.filename = props.filename ? props.filename : ''
        }
    }

    SQLValueArray() {
        return [this.uuid, this.title, this.user_id, this.version]
    }

    save() {
        return new Promise((resolve, reject) => {

            sqlInsert(CREATE_DOC_SQL, this.SQLValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }

                return resolve(this)
            })
        })
    }

    static create(props) {

        return new Promise((resolve, reject) => {
            const doc = new Document()
            doc.uuid  = uuidv1()
            doc.title = props.title
            doc.version = props.version
            doc.user_id = props.user_id
            doc.save().then((savedDoc) => {
                resolve(savedDoc)
            }).catch((error) => {
                console.error(`[Doc][Error] Failed to create Document: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }

    static LoadDocumentsByUserId(user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_RECENT_BY_USERID, [user_id], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }


    static LoadSharedDocumentsByUserEmail(user_email, user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_SHARED_BY_USEREMAIL, [user_email, user_id], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                let userFiles = { 'files': ParseDocSQL(documents) }
                resolve(userFiles)
            })
        })
    }


    static UpdateTitleByDocid(doc_id, title) {

        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_TITLE_BY_DOC_ID, [title, doc_id], (err, res) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(res)
            })
        })
    }

    static FindFilepathByDocid(doc_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_FILEPATH_BY_DOCID, [doc_id], (err, documents) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(documents)
            })
        })
    }

    /*Should only be called when first creating pdf*/
    static UpdateDocumentFilepath(doc_id, filepath, filename) {
        return new Promise((resolve, reject) => {
            sqlUpdate(UPDATE_FILEPATH, [filepath, filename, doc_id], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                resolve(result)
            })
        })
    }

    //validate user permitted to save
    static VaildateDocumentPermission(doc_id, user_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(CHECK_USER_PERMISSION_ON_DOC, [doc_id], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }
                if (result.length <= 0 || result[0].user_id != user_id) {
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }

    static VaildateSharedDocumentPermission(doc_id, user_email) {
        return new Promise((resolve, reject) => {
            sqlSelect(CHECK_USER_PERMISSION_ON_SHARED_DOC, [doc_id], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(err)
                }

                let vals = result.map(email => email.email_address === user_email || email.user_email === user_email)

                if (result.length <= 0 || vals.find(val => val == true) == undefined) {
                    resolve(false)
                }
                else {
                    resolve(true)
                }
            })
        })
    }



    // removes emails that are already shared with a certain file
    static shareFile(ownerId, doc_id, emails) {
        console.log('FILTERING')
        const shareQuery = ' INSERT INTO shared_files ( owner_id, user_email, document_id) VALUES ( ?, ?, ?)'
        const filterQuery = ' SELECT user_email FROM shared_files WHERE user_email = ? and document_id = ?'
        let filtered = emails.map((email) => {
            return new Promise((resolve, reject) => {
                sqlSelect(filterQuery, [email, doc_id], (err, result) => {
                    console.log(result.length)
                    if (err) {
                        console.log(err)
                        return reject(new Error('SOmething went terribly wrong'))
                    }
                    //found duplicate, handle it
                    if (result.length > 0) {
                        console.log('found ducplicate')
                        return
                    } else {
                        console.log('found no ducplicate')
                        sqlInsert(shareQuery, [ownerId, email, doc_id], (err, result) => {
                            if (err) {
                                console.log(err)
                                return reject(new Error('fail to create'))
                            }
                            if (!result/** || result**/) { // Check valid result ... ?
                                return reject(new Error('Unknown Error'))
                            }
                            console.log(result)
                            return resolve({ docId: doc_id, sent_email: email })
                        })
                    }

                })
            })
        })
        return Promise.all(filtered)

    }
}



module.exports = { Document }
