import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'


/**
 * Form Field
 * @param {string} label: label for the input
 * @param {object} input: event handlers
 * @param {string} type: input element's type
 * @param {string} autoComplete: input element's attribute
 * @param {object} meta: meta info of the input field from redux-form
 * @param {object} style: in-line style of the field
 * @param {string} className: classname of the field
 */
class Field extends PureComponent {
    render() {
        const {
            input,
            label,
            type,
            autoComplete,
            meta: { touched, error },
            style,
            className,
            autoFocus,
        } = this.props
        return (
            <div className="u-flex-row u--center u-margin-v-sm">
                <TextField
                    {...input}
                    floatingLabelText={label}
                    type={type}
                    errorText={touched && error}
                    autoComplete={autoComplete}
                    style={style}
                    className={className}
                    autoFocus={autoFocus}
                />
            </div>
        )
    }
}

Field.propTypes = {
    label: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string.isRequired,
    meta: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
    autoFocus: PropTypes.bool,
}

export default Field
