const mysql      = require('mysql')
const parsedJSON = require('./secrets.json')
const sqlstring  = require('sqlstring')

const options = {
    connectionLimit : 50,
    host            : 'mysql',
    user            : parsedJSON.user,
    password        : parsedJSON.password,
    database        : parsedJSON.database,
}

const pool = mysql.createPool(options)

module.exports = {

    sqlInsert: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }
            else {
                connection.query(sanitized, function(error, results){
                    connection.release()
                    if (error) {
                        callback(error, null)
                    }
                    else {
                        callback(null, results)
                    }
                })
            }
        })
    },

    sqlUpdate: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }
            else {
                connection.query(sanitized, function(error, results){
                    connection.release()
                    if (error) {
                        callback(error, null)
                    }
                    else {
                        callback(null, results)
                    }
                })
            }
        })
    },

    sqlDelete: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)
        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }
            else {
                connection.query(sanitized, function(error, results){
                    connection.release()
                    if (error) {
                        callback(error, null)
                    }
                    else {
                        callback(null, results)
                    }
                })
            }
        })
    },

    sqlSelect: function(sql, params, callback) {

        const sanitized = sqlstring.format(sql, params)

        pool.getConnection(function(err, connection){

            if (err){
                callback(err, null)
            }
            else {
                connection.query(sanitized, function(error, results){
                    connection.release()
                    if (error) {
                        callback(error, null)
                    }
                    else {
                        callback(null, results)
                    }
                })
            }
        })
    },

    //WIP: PAGING
    // sqlPage: function(sql, params, offset=0, limit=5, callback) {

    //     const sanitized = sqlstring.format(sql, params)
    //     pool.getConnection(function(err, connection){

    //         connection.query(sanitized, function(error, results, fields){
    //             connection.release()
    //             callback(null, results)

    //             if (error) {
    //                 callback(err, null)
    //             }
    //         })
    //     })
    // },

}
