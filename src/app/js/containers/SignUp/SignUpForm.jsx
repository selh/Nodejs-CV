import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import SignUpField from '../../components/FormField'
import RaisedButton from 'material-ui/RaisedButton'
import formFields from './formFields'
import { validateEmail } from '../../global/common'


class SignUpForm extends Component {
    render() {
        return (
            <form className="u-flex-column u--center u-half-width" onSubmit={this.props.handleSubmit(this.props.onSignUpSubmit)}>
                {formFields.map(({ name, type, label, autoComplete }) => (
                    <Field
                        key={`signup-field-${name}`}
                        name={name}
                        type={type}
                        component={SignUpField}
                        label={label}
                        autoComplete={autoComplete}
                        style={{ width: '400px' }}
                    />
                ))}
                <RaisedButton
                    type="submit"
                    className="u-margin-v-md"
                    label="Create an account"
                    style={{ width: '400px' }}
                />
                <div className="u-padding-v-md">
                    <span>Already a member?</span>
                    <Link to="/login" className="u-padding-h-md">
                        Login Here
                    </Link>
                </div>
            </form>
        )
    }
}

SignUpForm.propTypes = {
    onSignUpSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

SignUpField.defaultProps = {
    onSignUpSubmit: () => {},
}

const validate = (values) => {
    const errors = {}

    errors.email = !validateEmail(values.email) && 'You must provide a valid email'

    _.each(formFields, ({ name }) => {
        if (!errors[name] && !values[name]) {
            errors[name] = 'You must provide a value'
        }
    })
    if (!errors.username) {
        if (values.username.length < 3) {
            errors.username = 'Username must be at least 3 characters long'
        } else if (!/^[a-z\d\-_]+$/i.test(values.username)) {
            errors.username = 'Username can only contain alphanumerics, -, and _'
        }
    }
    if (!errors.firstname) {
        if (!/^[a-z\d\- ]+$/i.test(values.firstname)) {
            errors.firstname = 'Username can only contain alphanumerics, -, and spaces'
        }
    }
    if (!errors.lastname) {
        if (!/^[a-z\d\- ]+$/i.test(values.lastname)) {
            errors.lastname = 'Username can only contain alphanumerics, -, and spaces'
        }
    }
    if (!errors.password) {
        if (values.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/.test(values.password)) {
            errors.password = 'Password must contain at least one lowercase, uppercase, number, and symbol'
        }
    }
    if (!errors.confirmPassword) {
        if (values.confirmPassword !== values.password) {
            errors.confirmPassword = 'Passwords do not match'
        }
    }

    return errors
}

// allows the form to connect the redux stores
export default reduxForm({
    validate,
    form: 'signUpForm',
})(SignUpForm)
