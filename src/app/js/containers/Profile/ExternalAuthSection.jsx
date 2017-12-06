import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import * as extauth from '../../actions/extauth'
import ExternalAuthButton from '../../components/ExternalAuthButton'

class ExternalAuthSection extends Component {
    renderCASButton() {
        return this.props.user.info.hasCAS ? (
            <RaisedButton
                className="u-margin-v-md"
                style={{ width: '260px' }}
                label="Disconnect from CAS"
                backgroundColor="#A6192E"
                labelColor="#fff"
                onClick={this.props.dispatchDisconnectCAS}
            />
        ) : (
            <ExternalAuthButton
                label="Connect to CAS"
                path="/connect/cas/"
                color="#A6192E"
                labelColor="#fff"
                style={{ width: '260px' }}
            />
        )
    }

    renderLinkedInButton() {
        return this.props.user.info.hasLinkedIn ? (
            <RaisedButton
                className="u-margin-v-md"
                style={{ width: '260px' }}
                label="Disconnect from LinkedIn"
                backgroundColor="#A6192E"
                labelColor="#fff"
                onClick={this.props.dispatchDisconnectLinkedIn}
            />
        ) : (
            <ExternalAuthButton
                label="Connect to LinkedIn"
                path="/connect/linkedin"
                color="#0077B5"
                labelColor="#fff"
                style={{ width: '260px' }}
            />
        )
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.renderCASButton()}
                {this.renderLinkedInButton()}
            </div>
        )
    }
}

ExternalAuthSection.propTypes = {
    className: PropTypes.string.isRequired,
    dispatchDisconnectLinkedIn: PropTypes.func.isRequired,
    dispatchDisconnectCAS: PropTypes.func.isRequired,
    user: PropTypes.shape({
        info: PropTypes.shape({
            hasCAS: PropTypes.bool.isRequired,
            hasLinkedIn: PropTypes.bool.isRequired,
        }),
    }),
}

const mapStateToProps = (state) => ({
    user: state.user,
})

export default connect(mapStateToProps, extauth)(ExternalAuthSection)
