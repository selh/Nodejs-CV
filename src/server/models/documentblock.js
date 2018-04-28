const { sqlInsert, sqlSelect, sqlDelete } = require('../db')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const CREATE_DOC_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'
const GET_BLOCKS_BY_DOCID_SQL = 'SELECT dbs.block_id, dbs.block_order, b.summary FROM blocks b JOIN document_blocks dbs ON dbs.block_id = b.uuid WHERE dbs.document_id = ? ORDER BY block_order ASC'
const GET_BLOCKS_SUMMARY_BY_DOCID_SQL = 'SELECT b.summary FROM blocks b JOIN document_blocks dbs ON dbs.block_id = b.uuid WHERE dbs.document_id = ? ORDER BY block_order ASC'
//const UPDATE_DOCUMENT_BY_DOCID_SQL = 'UPDATE document_blocks dbs set block_order = ? WHERE document_id = ? AND block_id = ?'
const DELETE_DOCUMENT_BLOCKS_BY_DOCID_SQL = 'DELETE FROM document_blocks WHERE document_id = ?'
const INSERT_BLOCKS_BY_ID_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES '
const GET_BLOCKS_BY_USERID = 'SELECT uuid, label, summary, created_at FROM blocks b where user_id = ?'
//const CREATE_BLOCK_SQL = 'INSERT INTO document_blocks (document_id, block_id, block_order) VALUES (?, ?, ?)'



/*This will be visible to public*/
const ParseDocBlockSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            blockId    : entries.block_id,
            blockOrder : entries.block_order,
            summary    : entries.summary,
        }
    })
}

/*This will be visible to public*/
const ParseBlockSQL = (rows) => {
    return _.map(rows, function (entries) {
        return {
            blockId : entries.uuid,
            summary  : entries.summary,
        }
    })
}

class DocumentBlock {
    constructor(props) {
        if (props) {
            this.uuid        = props.uuid
            this.block_id    = props.block_id
            this.blockOrder  = props.block_order
            this.summary     = props.summary
            this.document_id = props.document_id
        }
    }

    SQLValueArray() {
        return [ this.document_id, this.block_id, this.block_order ]
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
            const block = new DocumentBlock()
            block.uuid  = uuidv1()
            block.label = props.label
            block.type  = props.type
            block.user_id = props.user_id
            block.summary = props.summary
            block.updated_at = props.updated_at
            block.created_at = props.created_at
            block.save().then((savedblock) => {
                resolve(savedblock)
            }).catch((error) => {
                console.error(`[block][Error] Failed to create Block: ${error.message}`)
                reject(new Error('Internal Server Error'))
            })
        })
    }


    static GetDocumentBlocks(doc_id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_BY_DOCID_SQL, [ doc_id ], (err, blocks) => {
                if (err) { console.error(err); return reject(null) }
                resolve(ParseDocBlockSQL(blocks))
            })
        })
    }

    static GetDocumentBlocksSummary(doc_id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_SUMMARY_BY_DOCID_SQL, [ doc_id ], (err, blocks) => {
                if (err) { console.error(err); return reject(null) }
                resolve(ParseDocBlockSQL(blocks))
            })
        })
    }

    static LoadDocBlocksByUserId(user_id){
        return new Promise((resolve, reject) => {
            sqlSelect(GET_BLOCKS_BY_USERID, [ user_id ], (err, blocks) => {
                if (err) { console.error(err); return reject(null) }
                resolve(ParseBlockSQL(blocks))
            })
        })
    }

    static UpdateDocumentBlocks(doc_id, blocks){
        return new Promise((resolve, reject) => {


            let INSERT_SQL = ''
            let insert_params = []
            let limit = (blocks.length-1) < 10 ? (blocks.length-1) : 10
            let i = 0

            if( blocks.length > 0 ){
                INSERT_SQL += INSERT_BLOCKS_BY_ID_SQL

                while( i < limit ){
                    INSERT_SQL += ' (?,?,?),'
                    insert_params.push(doc_id, blocks[i].id, blocks[i].blockOrder)
                    i++
                }

                insert_params.push(doc_id, blocks[i].id, blocks[i].blockOrder)
                INSERT_SQL += ' (?,?,?)'
            }
            console.log(DELETE_DOCUMENT_BLOCKS_BY_DOCID_SQL + doc_id)
            sqlDelete(DELETE_DOCUMENT_BLOCKS_BY_DOCID_SQL, [doc_id], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(null)
                }
                if( blocks.length < 1 ){
                    return resolve(null)
                }
                if ( result ){
                    sqlInsert(INSERT_SQL, insert_params, (err, result) => {
                        if (err) {
                            console.error(err)
                            return reject(null)
                        }
                        resolve(result)
                    })
                }
            })
        })
    }

}


module.exports = { DocumentBlock }
