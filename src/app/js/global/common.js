import { store } from '../store'

// http://emailregex.com/
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line

/**
 * validate an array of emails
 * @param {array} emails
 * @returns {bool} true if all the emails are valid, false otherwise
 */
export const validateEmails = (emails) => {
    const invalidEmails = emails
        .split(',')
        .map((email) => {
            return email.trim()
        })
        .filter((email) => {
            return re.test(email) === false
        })

    return !invalidEmails.length
}

/**
 * validate an email
 * @param {string} email
 * @returns {bool} true if the email is validate, false otherwise
 */
export const validateEmail = (email) => (email && re.test(email.trim()) === true)



export const getDisplayName = () => {
    const { user: { info } } = store.getState()
    return info.username || info.email.split('@')[0]
}
