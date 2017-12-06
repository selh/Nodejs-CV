import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../../actions'
import SignUpForm from './SignUpForm'
import { Logo } from '../../global/icon'

class SignUp extends Component {
    componentWillUnmount() {
        this.props.dispatchClearFormMessages()
    }

    render() {
        const { errorMessage } = this.props.formMessage
        return (
            <div className="u-flex-column u--center-cross u-full">
                <Logo style={{width: '150px', height: 'auto'}} />
                <h2>Please fill the form to register</h2>
                {errorMessage && <span className="u-fail-text">{errorMessage}</span>}
                <SignUpForm
                    onSignUpSubmit={() => this.props.dispatchSignUp(this.props.form.values)}
                />
            </div>
        )
    }
}

SignUp.propTypes = {
    dispatchSignUp: PropTypes.func.isRequired,
    dispatchClearFormMessages: PropTypes.func.isRequired,
    form: PropTypes.object,
    formMessage: PropTypes.shape({
        errorMessage: PropTypes.string.isRequired,
    }).isRequired,
}

SignUp.defaultProps = {
    dispatchSignUp: () => {},
}

const mapStateToProps = (state) => ({
    form: state.form.signUpForm,
    formMessage: state.app.form,
})

export default connect(mapStateToProps, actions)(SignUp)
