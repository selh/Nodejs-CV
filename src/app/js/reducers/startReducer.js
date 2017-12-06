import types from '../actions/types'

const initState = {
    isFetching: false,
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_REQUEST:
            return {
                isFetching: true,
            }
        default:
            return state
    }
}
