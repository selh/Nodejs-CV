import types from '../actions/types'

/**
 * Initial State of the files
 * Array of File Object
 *      @property {string} doc_id
 *      @property {string} title
 *      @property {array} comments
 *      @property {array} blocks
 *      @property {number} version
 *
 * @example
 *  doc_id: '1'
 *  title: 'File name 1'
 *  comments: ['first', 'seconds comment']
 *  blocks: ['_markdown_']
 *  version: 1
 */
const initState = []

export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_FILES_SUCCESS: {
            const files = [...action.payload.files]
            return files
        }
        case types.FETCH_FILES_FAILURE:
            return []
        default:
            return state
    }
}
