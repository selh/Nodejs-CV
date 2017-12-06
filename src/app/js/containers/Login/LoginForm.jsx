import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import LoginField from '../../components/FormField'
import RaisedButton from 'material-ui/RaisedButton'
import ExternalAuthButton from '../../components/ExternalAuthButton'
import formFields from './formFields'


class LoginForm extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.props.onLoginSubmit)}>
                {formFields.map(({ name, type, label, autoComplete, autoFocus }) => (
                    <Field
                        key={`login-field-${name}`}
                        name={name} type={type}
                        component={LoginField}
                        label={label}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        className="u-full-width"
                    />
                ))}
                <RaisedButton type="submit" className="u-margin-v-md u-full-width" label="Login" />
                <ExternalAuthButton
                    label="Login with CAS"
                    path="/auth/cas/"
                    color="#A6192E"
                    labelColor="#fff"
                    fullWidth={true}
                />
                <ExternalAuthButton
                    label="Login with LinkedIn"
                    path="/auth/linkedin"
                    color="#0077B5"
                    labelColor="#fff"
                    fullWidth={true}
                />
                <div className="u-padding-v-md">
                    <span>New to our app?</span>
                    <Link to="/signup" className="u-padding-h-md">
                        Sign Up Here
                    </Link>
                </div>
            </form>
        )
    }
}

LoginForm.propTypes = {
    onLoginSubmit: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
}

LoginField.defaultProps = {
    onLoginSubmit: () => { },
}

const validate = (values) => {
    const errors = {}
    _.each(formFields, ({ name }) => {
        if (!values[name]) {
            errors[name] = 'You must provide a value'
        }
    })

    return errors
}

// allows the form to connect the redux stores
export default reduxForm({
    validate,
    form: 'loginForm',
})(LoginForm)
