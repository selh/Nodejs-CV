import axios from 'axios'
import types from './types'
import { push } from 'react-router-redux'
import SocketHandler from '../global/socketsHandler'

axios.defaults.baseURL = '/api'

const axiosWithCSRF = axios.create({
    xsrfCookieName: '_csrfToken',
})

const redirect403 = (error, dispatch) => {
    if (error.response.status === 403) {
        dispatch(push('/403'))
    }
}

export const dispatchFetchUser = (redirectPath, originalPath) => async (dispatch) => {
    try {
        dispatch({
            type: types.FETCH_REQUEST,
            payload: {
                isFetching: true,
            },
        })

        const res = await axios.get('/currentUser')
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: res.data,
            },
        })
        dispatch(push(redirectPath))
    } catch (error) {
        dispatch({
            type: types.FETCH_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
            },
        })
        if (originalPath !== '/login' && originalPath !== '/signup') {
            dispatch(push('/login'))
        }
    }
}

export const dispatchLogin = ({ username, password }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/login', { username, password })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                info: res.data,
            },
        })

        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.LOGIN_FAILURE,
            payload: {
                isFetching: false,
                isAuthenticated: false,
                errorMessage: error.response.data.errorMessage || 'Unknown Error',
            },
        })
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage || 'Unknown Error',
        })
        dispatch(push('/login'))
    }
}

export const dispatchSignUp = ({ username, firstname, lastname, email, password, confirmPassword }) => async (dispatch) => {
    try {

        const res = await axiosWithCSRF.post('/register', { username, firstname, lastname, email, password, confirmPassword })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                isAuthenticated: true,
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/signup'))
    }
}

export const dispatchClearFormMessages = () => ({
    type: types.FORM_MESSAGES_CLEAR,
})

export const dispatchFetchFiles = (callback) => async (dispatch) => {
    try {
        const res = await axios.get('/files')
        dispatch({
            type: types.FETCH_FILES_SUCCESS,
            payload: res.data,
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_FILES_FAILURE,
            payload: error.response.data,
        })
        callback()
        redirect403(error, dispatch)
    }
}

// collections
export const dispatchFetchSharedFiles = (callback) => async (dispatch) => {
    try {

        const res = await axios.get('/shared')

        dispatch({
            type: types.FETCH_SHARES_SUCCESS,
            payload: res.data,
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_SHARES_FAILURE,
            payload: error.response.data,
        })
        callback()
        redirect403(error, dispatch)
    }
}


// single file
export const dispatchFetchSharedFile = (id, callback) => async (dispatch) => {
    try {

        const comment = await axios.get(`/comment/${id}`)

        dispatch({
            type: types.FETCH_SHARE_FILE_SUCCESS,
            payload: {
                doc_id: id,
                comments: comment.data,
                pdfUrl: `/api/files/pdf/${id}`,
            },
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_SHARE_FILE_FAILURE,
            payload: error.response.data,
        })
        callback()
        redirect403(error, dispatch)
    }
}


export const dispatchFetchFile = (id, callback) => async (dispatch) => {
    try {

        const blocks = id === ''
            ? { data: [] }
            : await axios.get(`/files/${id}`)
        const availableBlocks = await axios.get('/blocks')

        dispatch({
            type: types.FETCH_FILE_SUCCESS,
            payload: {
                blocks : blocks.data,
                availableBlocks: availableBlocks.data,
            },
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: error.response.data,
        })
        callback()
        redirect403(error, dispatch)
    }
}

export const dispatchSelectFile = (id, title) => ({
    type: types.SELECT_FILE,
    payload: {
        id,
        title,
    },
})

export const dispatchAddBlockToSelectedFile = (value, id) => ({
    type: types.ADD_BLOCK_TO_SELECTED_FILE,
    payload: {
        value,
        id,
    },
})

export const dispatchRemoveBlockFromSelectedFile = (blockOrder) => ({
    type: types.REMOVE_BLOCK_FROM_SELECTED_FILE,
    payload: blockOrder,
})

export const dispatchMoveBlockFromSelectedFile = (blockOrder, delta) => ({
    type: types.MOVE_BLOCK_FROM_SELECTED_FILE,
    payload: {
        blockOrder,
        delta,
    },
})

export const dispatchCreateComment = (comment) => async (dispatch) => {
    try {

        await axiosWithCSRF.post('/comment/create', comment)

        dispatch({
            type: types.CREATE_COMMENT_SUCCESS,
            payload: {
                id: comment.docId,
                comment,
            },
        })
        SocketHandler.emitEvent(
            'comments',
            'comment',
            {
                roomId: comment.docId,
                comment,
            }
        )
        //if target user is inside the room, we dont need to create notification

    } catch (error) {
        console.error(error)
    }
}


export const dispatchReceiveComment = (comment) => ({
    type: types.RECEIVE_COMMENT,
    payload: {
        id: comment.docId,
        comment,
    },
})

export const dispatchOnClickCreateFile = () => ({
    type: types.CREATING_NEW_FILE,
})

export const dispatchDownloadFile = (doc_id, callback) => async (dispatch) => {
    try {
        const link = document.createElement('a')
        link.href = `/api/files/download/${doc_id}`
        link.click()

        dispatch({
            type: types.DOWNLOAD_PDF_SUCCESS,
        })
        callback('Download Finished')
    } catch (error) {
        dispatch({
            type: types.DOWNLOAD_PDF_FAILURE,
            payload: error.response.data,
        })
        callback('Download Failed')
    }
}

export const dispatchCreateFile = ({ title , blocks, created_at }, callback) => async (dispatch) => {
    try {
        // returns the id of the newly created document

        await axiosWithCSRF.post('/files/create', JSON.stringify({ title, blocks, created_at }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        dispatch({
            type: types.CREATE_FILE_SUCCESS,
            payload: title,
        })

        callback('File created')
    } catch (error) {
        dispatch({
            type: types.CREATE_FILE_FAILURE,
            payload: error.response.data,
        })
        callback('File create failed')
    }
}

export const dispatchUpdateFile = (id, title, blocks, callback) => async (dispatch) => {
    try {

        await axiosWithCSRF.post(`/files/savepdf/${id}`, JSON.stringify({ id, title, blocks }), {
            headers: {
                'Content-Type': 'application/json',
            },
        })

        dispatch({
            type: types.UPDATE_FILE_SUCCESS,
            payload: title,
        })
        callback('File updated')
    } catch (error) {
        dispatch({
            type: types.UPDATE_FILE_FAILURE,
            payload: error.response.data,
        })
        callback('File update failed')
    }
}


export const dispatchLogOut = () => async (dispatch) => {
    try {
        await axiosWithCSRF.post('/logout')

        dispatch({
            type: types.LOGOUT,
            payload: {
                isAuthenticated: false,
                info: {},
            },
        })
    } catch (error) {
        // Unknown error
        console.error(error)
        dispatch(push('/'))
    }
}


export const dispatchUpdate = ({ email, firstname, lastname }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/users/profile', { email, firstname, lastname })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/profile'))
    }
}

export const dispatchUpdatePassword = ({ currentPassword, password, confirmPassword }) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/users/updatePassword', { currentPassword, password, confirmPassword })
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch(push('/'))
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
        dispatch(push('/profile'))
    }
}

export const dispatchGetPdf = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/file/pdf/${id}`)

        dispatch({
            type: types.FETCH_FILE_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: error.response.data,
        })
    }
}

export const dispatchFetchNotifications = () => async (dispatch) => {
    try {
        let path = '/notifications/load'
        const newAlerts = await axios.get(path)
        console.log(newAlerts)
        dispatch({
            type: types.FETCH_NOTIFICATION_SUCCESS,
            payload: newAlerts.data.notifications,
        })

    } catch (error) {
        dispatch({
            type: types.FETCH_FILE_FAILURE,
            payload: [],
        })
    }
}

//Fired when user receives a notification
export const dispatchReceiveNotification = (msg) => ({
    type: types.RECEIVE_NOTIFICATION,
    payload: {
        newNotice: msg,
    },
})

export const dispatchSendNotification = (data) => async (dispatch) => {
    try {
        //Store notification in db

        let postParams =  {
            documentId: data.docId,
            timeStamp: data.createdAt,
            type: data.type,
        }

        if(data.type == 'comment') {
            postParams.sender = data.sender
            console.log(postParams)
        }
        if(data.type =='share') {
            postParams.targets = data.targets
            console.log(postParams)
        }

        let success = await axiosWithCSRF.post(
            '/notifications/create',
            postParams
        )

        if (data.type =='comment') {
            SocketHandler.emitEvent(
                'notifications',
                'getNotifications',

                {
                    target: success.data.target,
                    type: data.type,
                    timeStamp: data.createdAt,
                    sender: data.sender,
                    document_id: data.docId,
                    content: data.content,
                    uuid: success.data.uuid,
                }
            )
        }

        if(data.type =='share') {
            success.data.forEach((notice)=>{
                SocketHandler.emitEvent(
                    'notifications',
                    'getNotifications',

                    {
                        target: notice.target,
                        type: data.type,
                        timeStamp: data.createdAt,
                        sender: data.sender,
                        document_id: data.docId,
                        content: data.content,
                        uuid: notice.uuid,
                    }
                )
            })
        }

        dispatch({
            type: types.SEND_NOTIFICATION_SUCCESS,
            payload: {
                newNotice: 'msg',
            },
        })
    } catch (error) {
        console.error(error)
    }
}

//Deletes notification from db
export const dispatchResolveNotification = (id) => async (dispatch) => {
    try {
        //call delete on server
        await axiosWithCSRF.post('/notifications/delete', { id: id })
        //update state by removing notification from old state
        dispatch({
            type: types.RESOLVE_NOTIFICATION,
            payload: {
                removed: id,
            },
        })
    } catch (error) {
        console.error(error)
    }
}

export const dispatchShareFile = (docId,emails) => async(dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/shared/share',{docId:docId,shareWith:emails})
        dispatch({
            type: types.SHARE_FILE_SUCCESS,
            payload: res.data,
        })

    } catch (error) {
        dispatch({
            type: types.SHARE_FILE_FAILURE,
            payload: error.response.data,
        })
    }
}

export const dispatchFetchBlocks = () => async (dispatch) => {
    try {

        const res = await axios.get('/blocksapi')
        dispatch({
            type: types.FETCH_BLOCKS_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.FETCH_BLOCKS_FALURE,
            payload: error.data,
        })
    }
}

export const dispatchCreateBlock = (block) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/blocksapi/create', block)
        dispatch({
            type: types.CREATE_BLOCK_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.CREATE_BLOCK_FAILURE,
            payload: error.data,
        })
    }
}

export const dispatchEditBlock = (block) => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.post('/blocksapi/edit', block)
        dispatch({
            type: types.EDIT_BLOCK_SUCCESS,
            payload: res.data,
        })
    } catch (error) {
        dispatch({
            type: types.EDIT_BLOCK_FAILURE,
            payload: error.data,
        })
    }
}

export const dispatchFetchTracking = (callback) => async(dispatch) => {
    try {
        const res = await axios.get('/tracking')

        dispatch({
            type: types.FETCH_TRACKING_SUCCESS,
            payload: res.data,
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.FETCH_TRACKING_FAILURE,
            payload: error.response.data.message,
        })
        callback()
    }
}

export const dispatchSaveTracking = (data, callback)  => async(dispatch) => {
    try {
        await axiosWithCSRF.post('/tracking/create', data)

        dispatch({
            type: types.CREATE_TRACKING_SUCCESS,
            payload: data,
        })
        callback()
    } catch (error) {
        dispatch({
            type: types.CREATE_TRACKING_FAILURE,
            payload: error.response.data.message,
        })
        callback()
    }
}
