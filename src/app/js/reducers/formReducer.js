import types from '../actions/types'

const initState = {
    errorMessage: '',
    message: '',
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.FORM_ERROR:
            return {
                errorMessage: action.payload,
                message: '',
            }
        case types.FORM_MESSAGES_CLEAR:
            return {
                errorMessage: '',
                message: '',
            }
        case types.FORM_SUCCESS:
            return {
                errorMessage: '',
                message: action.payload,
            }
        default:
            return state
    }
}
