import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import _ from 'lodash'
import PasswordField from '../../components/FormField'
import RaisedButton from 'material-ui/RaisedButton'
import passwordFields from './passwordFields'


class PasswordForm extends Component {
    render() {
        return (
            <form className="c-profile-form u-half-width u-padding-h-lg" onSubmit={this.props.handleSubmit(this.props.onUpdateSubmit)}>
                {passwordFields.map(({ name, type, label, autoComplete }) => (
                    <Field
                        key={`profile-field-${name}`}
                        name={name}
                        type={type}
                        component={PasswordField}
                        label={label}
                        autoComplete={autoComplete}
                    />
                ))}
                <RaisedButton type="submit" className="u-margin-v-md" style={{ width: '260px' }} label="Update Password" />
            </form>
        )
    }
}

PasswordForm.propTypes = {
    onUpdateSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

const validate = (values) => {
    const errors = {}

    _.each(passwordFields, ({ name }) => {
        if (!errors[name] && !values[name]) {
            errors[name] = 'You must provide a value'
        }
    })
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
    form: 'passwordForm',
})(PasswordForm)
