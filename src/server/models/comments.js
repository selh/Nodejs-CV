const { sqlInsert, sqlSelect } = require('../db')
const uuidv1 = require('uuid/v1')
const _ = require('lodash')


//Makes comments into a ready display form
const parseCommentOutput = (rows) => {
    return _.map(rows, function (entries) {
        //convert blob to string
        return {
            username: entries.username,
            content: entries.comment,
            createdAt: entries.created_at,
        }
    })
}

class Comments {
    constructor(props) {
        if (props) {
            this.uuid       = props.uuid
            this.username   = props.username
            this.userId     = props.userId
            this.documentId = props.documentId
            this.timeStamp  = props.timeStamp
            this.content    = props.content ? props.content : ''
        }
    }
    //checks if document exists
    validateDocument() {
        const getDocumentQuery = 'SELECT title FROM documents WHERE uuid = ? '
        return new Promise((resolve, reject) => {
            sqlSelect(getDocumentQuery, [this.documentId], (err, result) => {
                if (err) {
                    return resolve({ error: err, message: 'No such document' })
                }
                if (result) {
                    console.log(result)
                    return resolve(result[0].title)
                }
            })
        })

    }
    //checks if user exists ,returns iD
    create() {
        const createQuery = 'INSERT INTO comments (uuid, user_id, document_id, comment, created_at) VALUES (?, ?, ?, ?, ?)'
        return new Promise((resolve, reject) => {
            // validate user first
            this.uuid = uuidv1()
            sqlInsert(createQuery, [ this.uuid, this.userId, this.documentId, this.content, this.timeStamp], (err, result) => {
                if (err) {
                    console.log(err)
                    return reject({ params: [this.username, this.content, this.timeStamp], error: err })
                }
                return resolve({ message: 'comment uploaded', data: result })
            })
        })
    }

    static loadComments(docId) {
        const fetchQuery = 'SELECT t.username, c.comment, c.created_at FROM comments c JOIN users t ON t.uuid = c.user_id WHERE c.document_id = ? order by c.created_at asc'
        return new Promise((resolve, reject) => {
            sqlSelect(fetchQuery, [docId], (err, success) => {
                if (err) {
                    console.log(err)
                    return resolve({ message: 'No comments' })
                }
                else {
                    return resolve(parseCommentOutput(success))
                }
            })
        })
    }

}

module.exports =  Comments
