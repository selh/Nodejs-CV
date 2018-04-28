const { sqlInsert, sqlSelect } = require('../db')
const uuidv1 = require('uuid/v1')

const EDIT_BLOCK_SQL = 'UPDATE blocks SET summary=?, label=? WHERE uuid=?'
const CREATE_BLOCK_SQL = 'INSERT INTO blocks (uuid, user_id, label, type, summary) VALUES (?, ?, ?, ?, ?)'
const GET_BLOCKS_SQL = 'SELECT * FROM blocks WHERE user_id = ?'

class Block {
    constructor(props) {
        if (props) {
            this.uuid = props.uuid
            this.label = props.label ? props.label : 'untitled'
            this.type = props.type
            this.user_id = props.user_id
            this.summary = props.summary ? props.summary : ''
            this.updated_at = props.updated_at
            this.created_at = props.created_at
        }
    }

    SQLValueArray() {
        return [this.uuid, this.user_id, this.label, this.type, this.summary]
    }

    save() {
        return new Promise((resolve, reject) => {
            sqlInsert(CREATE_BLOCK_SQL, this.SQLValueArray(), (err, result) => {
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

    create() {
        return new Promise((resolve, reject) => {
            this.uuid = uuidv1()
            this.save().then((savedblock) => {
                resolve(savedblock)
            }).catch((error) => {
                console.error(`[block][Error] Failed to create Block: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }

    static edit(props) {
        return new Promise((resolve, reject) => {
            sqlInsert(EDIT_BLOCK_SQL, [props.summary, props.label, props.uuid], (err, result) => {
                if (err) {
                    console.log(err)
                    console.error(`[block][Error] Failed to create Block: ${err.message}`)
                    return reject(null)
                }
                if (result) {
                    return resolve(props)
                }
            })
        })
    }

    static LoadBlocksByUserId(userId) {
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_SQL, [userId], (err, blocks) => {
                if (err) {
                    console.log(err)
                    return resolve({ message: 'No blocks' })
                }
                else {
                    return resolve(blocks)
                }
            })
        })
    }
}

module.exports = { Block }
