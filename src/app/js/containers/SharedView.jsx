import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import ShareBlock from '../components/ShareBlock'
import Loader from '../components/Loader'


class SharedView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
    }
    componentDidMount() {
        this.props.dispatchFetchSharedFiles(() => {
            this.setState({ isLoading: false })
        })
    }

    renderSharedWith() {
        const user_id = this.props.user.info.userId
        const files = this.props.sharedFiles.filter(({ userId }) => userId !== user_id )
        return files.map(({docId, title}, index) => (
            <ShareBlock
                key={`file-block-shared-with-${index}`}
                id={docId}
                name={title}
            />
        ))
    }

    renderSharedTo() {
        const user_id = this.props.user.info.userId
        const files = this.props.sharedFiles.filter(({ userId }) => userId === user_id )
        return files.map(({docId, title}, index) => (
            <ShareBlock
                key={`file-block-shared-to-${index}`}
                id={docId}
                name={title}
            />
        ))
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div className="t-view-container">
                <h2>Files I Shared with People</h2>
                <div className="c-files-list">
                    {this.renderSharedTo()}
                </div>
                <h2>Files Shared with Me</h2>
                <div className="c-files-list">
                    {this.renderSharedWith()}
                </div>
            </div>
        )
    }
}

SharedView.propTypes = {
    user: PropTypes.shape({
        info: PropTypes.shape({
            userId: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    sharedFiles: PropTypes.arrayOf(PropTypes.shape({
        userId: PropTypes.string.isRequired,
        docId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    dispatchFetchSharedFiles: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app, user }) => ({
    sharedFiles: app.sharedFiles,
    user,
})

export default connect(mapStateToProps, actions)(SharedView)
