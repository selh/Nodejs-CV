import types from '../actions/types'

const initState = []


export default (state = initState, action) => {
    switch (action.type) {
        case types.FETCH_NOTIFICATION_SUCCESS:
            return [...action.payload]

        case types.SEND_NOTIFICATION_SUCCESS:
            return state

        case types.RECEIVE_NOTIFICATION:
            return [action.payload.newNotice, ...state]
        case types.RESOLVE_NOTIFICATION:
            state = state.filter((notice) => { return notice.uuid != action.payload.removed })
            return state
        default:
            return state
    }
}
