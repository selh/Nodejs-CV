//not sure where to put this file
const rand  = require('randomstring')
const mdpdf = require('markdown-pdf')
const { Document } = require('../models/document')
const { DocumentBlock } = require('../models/documentblock')
const fs = require('fs')
//path to where file system is located
let fs_path = process.env.FILESYSTEM_PATH || '/home/seleena/Documents/files/'


/* returns file path: append filename to this*/
function genFilePath(){
    const options = {
        length: 1,
        charset: '123',
    }
    let path = rand.generate(options) + '/' +
               rand.generate(options) + '/' +
               rand.generate(options) + '/'
    return path
}

function genFilename(){

    let filename = rand.generate(6) + '.pdf'
    return filename
}


module.exports = {

    /*Checks that file belongs to user and file path not already created*/
    generatePDF: function(doc_id) {
        return new Promise(function(resolve, reject){

            let update_flag = false
            let filename = ''
            let filepath = ''
            let md = ''

            Document.FindFilepathByDocid(doc_id).then((res, err) => {
                if (err){
                    throw(err)
                }
                //filepath already exists
                else if ( res != undefined && (res[0].filename != null || res[0].filepath != null) ){

                    filename = res[0].filename
                    filepath = res[0].filepath
                }
                //create new filepath
                else{

                    update_flag = true
                    filename    = genFilename()
                    filepath    = genFilePath()

                }
                return DocumentBlock.GetDocumentBlocksSummary(doc_id)

            }).then((blocks, err) => {
                if (err){
                    throw(err)
                }
                else{
                    md = blocks.map(item => {return item.summary}).join(' \n ')

                    if (update_flag) {
                        console.log(filepath+filename)
                        Document.UpdateDocumentFilepath(doc_id, filepath, filename)
                    }
                }
            }).then((result, err) => {
                if (err){
                    console.error(err)
                    throw(err)
                }
                else{
                    let full_path_pdf = fs_path + filepath + filename
                    mdpdf().from.string(md).to(full_path_pdf, function(){
                        console.log('PDF File created')
                    })
                    resolve(result)
                }
            }).catch((exception) => {
                console.error(exception)
                reject({ error_message : 'Error'})
            })
        })
    },


    retrievePDF: function(doc_id) {
        return new Promise((resolve, reject) => {
            Document.FindFilepathByDocid(doc_id).then((filepath, err) => {
                if (err){
                    throw(err)
                }
                else{
                    if ( filepath != undefined || filepath.length > 0 ){ //test this when pdf render works
                        let full_path_pdf = fs_path + filepath[0].filepath + filepath[0].filename
                        fs.readFile(full_path_pdf, function (error, result){
                            if (error){
                                throw(error)
                            }
                            else{
                                resolve(result)
                            }
                        })
                    }
                }
            }).catch((error) => {
                console.error(error)
                reject({ error_message : 'Error retrieving pdf file'})
            })
        })
    },

    retrievePDFpath: function(doc_id) {
        return new Promise((resolve, reject) => {
            Document.FindFilepathByDocid(doc_id).then((filepath, err) => {
                if (err){
                    throw(err)
                }
                else{
                    if ( filepath != undefined || filepath.length > 0 ){ //test this when pdf render works
                        let full_path_pdf = fs_path + filepath[0].filepath + filepath[0].filename
                        return resolve(full_path_pdf)
                    }
                    else{
                        return reject(null)
                    }
                }
            }).catch((error) => {
                console.error(error)
                reject({ error_message : 'Error retrieving pdf file'})
            })
        })
    },
}
