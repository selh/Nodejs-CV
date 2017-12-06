import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as qs from 'query-string'

import * as actions from '../../actions'
import LoginForm from './LoginForm'
import { Logo } from '../../global/icon'


class Login extends Component {
    constructor(props) {
        super(props)
        const queryString = qs.parse(props.location.search)
        this.state = {
            user: {
                errorMessage: queryString.extAuthErrorMessage || '',
            },
        }
    }

    componentWillUnmount() {
        this.props.dispatchClearFormMessages()
    }

    render() {
        const { isAuthenticated } = this.props.user
        const errorMessage = this.props.formMessage.errorMessage || this.state.user.errorMessage

        return (
            <div className="u-flex-column u--center-cross u-full">
                <Logo style={{width: '150px', height: 'auto'}} />
                <h2>Please login before use</h2>
                {!isAuthenticated && errorMessage && <span className="u-fail-text">{errorMessage}</span>}
                <LoginForm onLoginSubmit={() => this.props.dispatchLogin(this.props.form.values)} />
            </div>
        )
    }
}

Login.propTypes = {
    dispatchLogin: PropTypes.func.isRequired,
    dispatchClearFormMessages: PropTypes.func.isRequired,
    form: PropTypes.object,
    user: PropTypes.shape({
        isAuthenticated: PropTypes.bool,
    }).isRequired,
    formMessage: PropTypes.shape({
        errorMessage: PropTypes.string.isRequired,
    }).isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = (state) => ({
    form: state.form.loginForm,
    user: state.user,
    formMessage: state.app.form,
})

export default connect(mapStateToProps, actions)(Login)
