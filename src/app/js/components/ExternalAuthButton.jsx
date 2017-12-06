import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import RaisedButton from 'material-ui/RaisedButton'

class ExternalAuthButton extends PureComponent {
    openExternalAuth() {
        window.location = this.props.path
    }

    render() {
        const classnames = classNames(
            'u-margin-v-md',
            { 'u-full-width': this.props.fullWidth }
        )
        return (
            <RaisedButton
                className={classnames}
                backgroundColor={this.props.color}
                icon={this.props.icon}
                label={this.props.label}
                labelColor={this.props.labelColor}
                style={this.props.style}
                onClick={this.openExternalAuth.bind(this)}
            />
        )
    }
}

ExternalAuthButton.propTypes = {
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    labelColor: PropTypes.string,
    icon: PropTypes.element,
    fullWidth: PropTypes.bool,
    style: PropTypes.object,
}

export default ExternalAuthButton
