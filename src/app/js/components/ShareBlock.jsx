import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as actions from '../actions'


class ShareBlock extends PureComponent {
    onClickHandler() {
        this.props.dispatchSelectFile(this.props.id)
    }

    render() {
        return (
            <Link
                to={`/shared/${this.props.id}`}
                className="c-file-block"
                onClick={this.onClickHandler.bind(this)}
            >
                <div>
                    <div className="u-padding-v-md">{this.props.name}</div>
                    <i className="material-icons md-lg">insert_drive_file</i>
                </div>
            </Link>
        )
    }
}

ShareBlock.propTypes = {
    dispatchSelectFile: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    isAdd: PropTypes.bool,
}

ShareBlock.defaultProps = {
    name: 'File',
    isAdd: false,
}

export default connect(null, actions)(ShareBlock)
