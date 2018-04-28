const { sqlInsert, sqlSelect } = require('../db')
const uuidv1 = require('uuid/v1')

//Makes comments into a ready display form
const parseTracking = (rows) => {
    return rows.map((entry) => {
        //convert blob to string
        return {
            companyName: entry.company_name,
            jobTitle: entry.job_title,
            createdAt: entry.created_at,
        }
    })
}


class Tracking {
    constructor(props) {
        if (props) {
            this.userId      = props.userId
            this.companyName = props.companyName
            this.jobTitle    = props.jobTitle
        }
    }

    //checks if user exists ,returns iD
    create() {
        const createQuery = 'INSERT INTO app_tracker (uuid, user_id, company_name, job_title, created_at) VALUES (?, ?, ?, ?, NOW())'
        return new Promise((resolve, reject) => {
            // validate user first
            sqlInsert(
                createQuery,
                [ uuidv1(), this.userId, this.companyName, this.jobTitle],
                (err) => {
                    if (err) {
                        console.log(err)
                        return reject(err)
                    }
                    return resolve({ message: 'Tracking updated' })
                }
            )
        })
    }

    static loadTracking(userId) {
        const fetchQuery = 'SELECT * from app_tracker t WHERE t.user_id = ?'
        return new Promise((resolve, reject) => {
            sqlSelect(fetchQuery, [userId], (err, success) => {
                if (err) {
                    console.log(err)
                    return resolve({ message: 'No trackings' })
                }
                else {
                    return resolve(parseTracking(success))
                }
            })
        })
    }
}

module.exports = Tracking
