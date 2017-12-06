import types from '../actions/types'
import moment from 'moment'

const initialState = {
    trackings: [],
    errorMessage: '',
}

export default (state=initialState, action) => {
    switch(action.type) {
        case types.FETCH_TRACKING_SUCCESS:
            return {
                trackings: [ ...action.payload ],
                errorMessage: '',
            }
        case types.FETCH_TRACKING_FAILURE:
            return {
                trackings: [],
                errorMessage: action.payload,
            }
        case types.CREATE_TRACKING_SUCCESS: {
            const newItem = {
                ...action.payload,
                createdAt: moment().format('YYYY-MM-DD'),
            }
            const newTrackings = [
                ...state.trackings,
                newItem
            ]
            return {
                trackings: newTrackings,
                errorMessage: '',
            }
        }
        case types.CREATE_TRACKING_FAILURE:
            return {
                ...state,
                errorMessage: action.payload,
            }
        default:
            return state
    }
}
