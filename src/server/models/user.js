const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { check } = require('express-validator/check')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

const { sqlInsert, sqlSelect } = require('../db')
const config = require('../config')
const keys = require('../config/keys')
const uuidv1 = require('uuid/v1')

const BCRYPT_HASHING_ROUNDS = 10

const FIND_USER_BY_EMAIL_SQL       = 'SELECT uuid, username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM users WHERE email_address = ? LIMIT 1'
const FIND_USER_BY_USERNAME_SQL    = 'SELECT uuid, username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM users WHERE username = ? LIMIT 1'
const FIND_USER_BY_CAS_ID_SQL      = 'SELECT uuid, username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM users WHERE cas_id = ? LIMIT 1'
const FIND_USER_BY_LINKEDIN_ID_SQL = 'SELECT uuid, username, cas_id, email_address, firstname, lastname, linkedin_id, password FROM users WHERE linkedin_id = ? LIMIT 1'
const INSERT_USER_SQL              = 'INSERT INTO users (uuid, password, email_address, firstname, lastname, cas_id, linkedin_id, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
//const UPSERT_USER_SQL              = 'UPDATE users SET password = ?, email_address = ?, firstname = ?, lastname = ?, cas_id = ?, linkedin_id = ? WHERE username = ?'
const UPDATE_PROFILE_SQL           = 'UPDATE users SET email_address = ?, firstname = ?, lastname = ? WHERE uuid = ?'
const UPDATE_CAS_ID_SQL            = 'UPDATE users SET cas_id = ? WHERE uuid = ?'
const UPDATE_LINKEDIN_IN_SQL       = 'UPDATE users SET linkedin_id = ? WHERE uuid = ?'
const UPDATE_PASSWORD_SQL          = 'UPDATE users SET password = ? WHERE uuid = ?'

const UserCreatePasswordValidation = [
    check('password', 'must contain at least one lowercase, uppercase, number, and symbol')
        .matches(/[a-z]/).matches(/[A-Z]/).matches(/\d/).matches(/\W/)
        .isLength({min: 8}).withMessage('must be at least 8 characters long'),
    check('confirmPassword', 'must be present and match Password').exists() // Can't seem to match against other param with express-validator
]

const UserUpdatePasswordValidation = _.concat(UserCreatePasswordValidation, [
    check('currentPassword', 'must be present').exists()
])

const UserUpdateProfileValidation = [
    check('email').isEmail().withMessage('must be a valid Email').trim() //.normalizeEmail()
        .custom((value, { req }) => {
            if (req &&
                req.user &&
                req.user.email_address === value) { // if is unchanged
                return true
            }
            return User.findOneByEmail(value).then((user) => {
                if (user) { // another user
                    throw new Error('must be a valid Email')
                }
                return true
            })
        }),
    check('firstname').trim().escape(), // Have these to whitelist in the params
    check('lastname').trim().escape()
]

const UserCreationValidation = _.concat(UserUpdateProfileValidation, UserCreatePasswordValidation, [
    check('username').matches(/^[a-z\d\-_]+$/i).withMessage('can only contain alphanumerics, -, and _')
        .isLength({min: 3}).withMessage('must be at least 3 characters long')
        .custom(value => { return User.findOneByUsername(value).then((user) => {
            if (user) { throw new Error('must be a unique username') }
            return true
        })})
])

class User {
    constructor(props) {
        if (props) {
            this.uuid = props.uuid
            this.username = props.username
            this.password = props.password
            this.email_address = props.email_address
            this.cas_id = props.cas_id
            this.linkedin_id = props.linkedin_id
            this.firstname = props.firstname
            this.lastname = props.lastname
        }
    }

    publicJson() {
        return {
            userId: this.uuid,
            username: this.username,
            email: this.email_address,
            firstname: this.firstname,
            lastname: this.lastname,
            avatarUrl: this.avatarURL(),
            hasCAS: !!this.cas_id,
            hasLinkedIn: !!this.linkedin_id,
        }
    }

    generateJWT() {
        return jwt.sign({ user: this.publicJson() }, keys.jwtSecret, {
            expiresIn: 60*24,
            issuer: config.server.fqdn,
            audience: config.server.fqdn,
        })
    }

    avatarURL(size=256, fallback='identicon') {
        const hash = crypto.createHash('md5').update(this.email_address).digest('hex')
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallback}&r=g`
    }

    // Not strictly necessary unless we want differing field names in UI.
    static mapFrontEndFieldsToDB(props) {
        if (props.email) {
            props.email_address = props.email
            delete props.email
        }
        return props
    }

    setPassword(password) {
        return bcrypt.hash(password, BCRYPT_HASHING_ROUNDS).then((hash) => {
            if (hash) {
                this.password = hash
                return true
            } else {
                return false
            }
        }).catch((error) => {
            console.error(`Failed to hash a password: ${error}`)
            return false
        })
    }

    // This is used for SQL so DO NOT CHANGE THE ORDER without
    // changing the prepared query UPSERT_USER_SQL.
    // username is the primary key and hence used in the WHERE clause
    SQLValueArray() {
        return [
            this.uuid,
            this.password,
            this.email_address,
            this.firstname,
            this.lastname,
            this.cas_id,
            this.linkedin_id,
            this.username
        ]
    }

    save() {
        return new Promise((resolve, reject) => {
            sqlInsert(INSERT_USER_SQL, this.SQLValueArray(), (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }
                return resolve(this)
            })
        })
    }

    updatePassword(props) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(props.currentPassword, this.password).catch((err) => {
                console.error(err)
                return reject(new Error('Internal Server Error'))
            }).then((result) => {
                if (!result) {
                    return reject(new Error('Incorrect Current Password'))
                }
                if (props.confirmPassword !== props.password) {
                    return reject(new Error('Passwords do not match'))
                }
                this.setPassword(props.password).then((success) => {
                    if (success) {
                        sqlInsert(UPDATE_PASSWORD_SQL, [
                            this.password,
                            this.uuid
                        ], (err, result) => {
                            if (err) {
                                console.error(err)
                                return reject(new Error('Database Error'))
                            }
                            if (!result) {
                                return reject(new Error('Unknown Error'))
                            }
                            return resolve(this)
                        })
                    } else {
                        reject(new Error('Internal Server Error'))
                    }
                })
            })
        })
    }

    updateCASID(cas_id) {
        return new Promise((resolve, reject) => {
            sqlInsert(UPDATE_CAS_ID_SQL, [ cas_id, this.uuid ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }
                this.cas_id = cas_id
                return resolve(this)
            })
        })
    }

    updateLinkedinID(linkedin_id) {
        return new Promise((resolve, reject) => {
            sqlInsert(UPDATE_LINKEDIN_IN_SQL, [ linkedin_id, this.uuid ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }
                this.linkedin_id = linkedin_id
                return resolve(this)
            })
        })
    }

    updateProfile(props) {
        props = User.mapFrontEndFieldsToDB(props)
        return new Promise((resolve, reject) => {
            sqlInsert(UPDATE_PROFILE_SQL, [
                props.email_address,
                props.firstname,
                props.lastname,
                this.uuid
            ], (err, result) => {
                if (err) {
                    console.error(err)
                    return reject(new Error('Database Error'))
                }
                if (!result) {
                    return reject(new Error('Unknown Error'))
                }
                this.email_address = props.email_address
                this.firstname = props.firstname
                this.lastname = props.lastname
                return resolve(this)
            })
        })
    }

    static findOneByEmail(email_address) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_USER_BY_EMAIL_SQL, [ email_address ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for Email ${email_address}`)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByUsername(username) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_USER_BY_USERNAME_SQL, [ username ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for Username ${username}`)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByCASID(cas_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_USER_BY_CAS_ID_SQL, [ cas_id ], (err, users) => {
                if (err) { console.error(err); return resolve(null) }
                if (users.length < 1) { return resolve(null) }
                if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for CAS ID ${cas_id}`)
                    return resolve(null)
                }
                resolve(new User(users[0]))
            })
        })
    }

    static findOneByLinkedInID(linkedin_id) {
        return new Promise((resolve, reject) => {
            sqlSelect(FIND_USER_BY_LINKEDIN_ID_SQL, [ linkedin_id ], (err, users) => {
                if (err) { console.error(err); return resolve({ user: null }) }
                if (users.length < 1) { return resolve({ creatable: true }) }
                if (users.length > 1) {
                    console.error(`[User] DATABASE INCONSISTENCY! Found more than one user for LinkedIn ID ${linkedin_id}`)
                    return resolve({ user: null })
                }
                resolve({ user: new User(users[0]) })
            })
        })
    }

    static passwordLogin(username, password) {
        return new Promise((resolve, reject) => {
            this.findOneByUsername(username).then((user) => {
                // User created via LinkedIn, don't let password login
                // unless set manually.
                if (!user || user.password.trim() === '') {
                    return resolve(null)
                }
                return bcrypt.compare(password, user.password).catch((err) => {
                    console.error(err)
                    resolve(null)
                }).then((result) => {
                    if (result) {
                        return resolve(user)
                    }
                    resolve(null)
                })
            })
        })
    }

    // Assuming parameters has been validated by UserValidation
    static create(props) {
        props = this.mapFrontEndFieldsToDB(props)
        return new Promise((resolve, reject) => {
            if (props.confirmPassword !== props.password) {
                return reject(new Error('Passwords do not match'))
            }
            const user = new User()
            user.uuid = uuidv1()
            user.username = props.username
            user.email_address = props.email_address
            user.cas_id = props.cas_id
            user.linkedin_id = props.linkedin_id
            user.firstname = props.firstname
            user.lastname = props.lastname
            user.setPassword(props.password).then((passwordSet) => {
                if (passwordSet) {
                    user.save().then((savedUser) => {
                        // Must get UUID
                        resolve(User.findOneByEmail(savedUser.email_address))
                    }).catch((error) => {
                        console.error(`[User][Error] Failed to create User: ${error.message}`)
                        reject(new Error('Internal Server Error'))
                    })
                } else {
                    console.error('[User][Error] Could not create User due to password error')
                    reject(new Error('Internal Server Error'))
                }
            })
        })
    }

    // Assuming no prior validation
    static createFromLinkedIn(props) {
        return new Promise((resolve, reject) => {
            let { linkedin_id, email_address, firstname, lastname } = props
            const validParams = (linkedin_id && linkedin_id.length > 0) &&
                (email_address && validator.isEmail(email_address)) &&
                (firstname && firstname.length > 0) &&
                (lastname && lastname.length > 0)

            if (!validParams) {
                return reject(new Error('Invalid Parameters'))
            }

            User.findOneByEmail(email_address).then((user) => {
                if (user) {
                    return reject(new Error('You already have account with this email'))
                } else {
                    const user = new User({
                        uuid: uuidv1(),
                        username: email_address.split('@')[0],
                        email_address: email_address,
                        linkedin_id: linkedin_id,
                        firstname: firstname,
                        lastname: lastname,
                        password: '',
                    })
                    user.save().then((savedUser) => {
                        // Must get UUID
                        resolve(User.findOneByEmail(savedUser.email_address))
                    }).catch((error) => {
                        console.error(`[User][Error] Failed to create User: ${error.message}`)
                        reject(new Error('Internal Server Error'))
                    })
                }
            }).catch((err) => {
                console.error(err)
                reject(new Error('Internal Server Error'))
            })
        })
    }
}

module.exports = {
    User,
    UserCreationValidation,
    UserUpdatePasswordValidation,
    UserUpdateProfileValidation,
}
