import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as actions from '../actions'


class FileBlock extends PureComponent {
    onClickHandler() {
        this.props.dispatchSelectFile(this.props.id, this.props.name)
    }

    render() {
        return (
            <Link
                to={`/files/${this.props.id}`}
                className="c-file-block"
                onClick={this.onClickHandler.bind(this)}
            >
                <div className="c-file-block__container">
                    <p>{this.props.name}</p>
                    <i className="material-icons md-lg">insert_drive_file</i>
                </div>
            </Link>
        )
    }
}

FileBlock.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    dispatchSelectFile: PropTypes.func.isRequired,
}

FileBlock.defaultProps = {
    name: 'File',
}

export default connect(null, actions)(FileBlock)
