import axios from 'axios'
import types from './types'

const axiosWithCSRF = axios.create({
    baseURL: '/',
    xsrfCookieName: '_csrfToken',
})

export const dispatchDisconnectCAS = () => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.delete('/connect/cas')
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch({
            type: types.FORM_SUCCESS,
            payload: 'Disconnected from CAS',
        })
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
    }
}

export const dispatchDisconnectLinkedIn = () => async (dispatch) => {
    try {
        const res = await axiosWithCSRF.delete('/connect/linkedin')
        dispatch({
            type: types.LOGIN_SUCCESS,
            payload: {
                info: res.data,
            },
        })
        dispatch({
            type: types.FORM_SUCCESS,
            payload: 'Disconnected from LinkedIn',
        })
    } catch (error) {
        dispatch({
            type: types.FORM_ERROR,
            payload: error.response.data.errorMessage,
        })
    }
}
