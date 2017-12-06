import types from '../actions/types'

const initState = []

export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_BLOCKS_SUCCESS:
            return [ ...action.payload ]
        case types.FETCH_BLOCKS_FAILURE:
            return []
        case types.CREATE_BLOCK_SUCCESS: {
            return [
                action.payload,
                ...state
            ]
        }
        case types.FETCH_BLOCK_FALURE:
            return []
        default:
            return state
    }
}
