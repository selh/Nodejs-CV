import types from '../actions/types'

/**
 * Initial State of the files
 * Array of File Object
 *      @property {string} user_id
 *      @property {string} doc_id
 *      @property {string} title
 *      @property {array} comments
 *
 * @example
 *  doc_id: '1'
 *  user_id: '123123'
 *  title: 'File name 1'
 *  comments: ['first', 'seconds comment']
 */
const initState = []


export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_SHARES_SUCCESS:
            return [ ...action.payload.files ]
        case types.FETCH_SHARES_FAILURE:
            return []
        default:
            return state
    }
}
