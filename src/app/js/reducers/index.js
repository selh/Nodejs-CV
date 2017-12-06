import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as reduxFormReducer } from 'redux-form'
import userReducer from './userReducer'
import fileReducer from './fileReducer'
import selectedFileReducer from './selectedFileReducer'
import formReducer from './formReducer'
import sharedFilesReducer from './sharedFilesReducer'
import notificationReducer from './notificationReducer'
import blockReducer from './blockReducer'
import trackingReducer from './trackingReducer'


export const initialState = {}

// define app-level reducer
const appReducer = combineReducers({
    blocks: blockReducer,
    files: fileReducer,
    selectedFile: selectedFileReducer,
    form: formReducer,
    sharedFiles: sharedFilesReducer,
    notifications: notificationReducer,
    tracking: trackingReducer,
})

// combined reducer
export default combineReducers({
    app: appReducer,
    form: reduxFormReducer,
    user: userReducer,
    routing,
})
