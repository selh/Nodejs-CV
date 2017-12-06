import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ProfileField from '../../components/FormField'
import RaisedButton from 'material-ui/RaisedButton'
import profileFields from './profileFields'
import { validateEmail } from '../../global/common'


class ProfileForm extends Component {
    render() {
        return (
            <form className="c-profile-form u-half-width u-padding-h-lg" onSubmit={this.props.handleSubmit(this.props.onUpdateSubmit)}>
                {profileFields.map(({ name, type, label, autoComplete }) => (
                    <Field
                        key={`profile-field-${name}`}
                        name={name}
                        type={type}
                        component={ProfileField}
                        label={label}
                        autoComplete={autoComplete}
                    />
                ))}
                <RaisedButton type="submit" className="u-margin-v-md" style={{ width: '260px' }} label="Update Profile" />
            </form>
        )
    }
}

ProfileForm.propTypes = {
    onUpdateSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

const validate = (values) => {
    const errors = {}

    errors.email = !validateEmail(values.email) && 'You must provide a valid email'

    _.each(profileFields, ({ name }) => {
        if (!errors[name] && !values[name]) {
            errors[name] = 'You must provide a value'
        }
    })
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

    return errors
}

// allows the form to connect the redux stores
export default reduxForm({
    validate,
    form: 'profileForm',
})(ProfileForm)
