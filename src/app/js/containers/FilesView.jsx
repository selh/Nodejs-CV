import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import FileBlock from '../components/FileBlock'
import * as actions from '../actions'
import Loader from '../components/Loader'

class Files extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        this.props.dispatchFetchFiles(() => {
            this.setState({ isLoading: false })
        })
    }

    onClickHandler() {
        this.props.dispatchOnClickCreateFile()
    }

    renderAddButton() {
        return (
            <Link
                to="/files/new"
                className="c-file-block"
                onClick={this.onClickHandler.bind(this)}
            >
                <i className="material-icons md-xxl">note_add</i>
            </Link>
        )
    }

    renderFiles() {
        return this.props.files.map(({ title, docId }, index) => {
            return (
                <FileBlock
                    key={`file-block-${title}-${index}`}
                    id={docId}
                    name={title}
                />
            )
        })
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div className="t-view-container">
                <div className="c-files-list">
                    {this.renderAddButton()}
                    {this.renderFiles()}
                </div>
            </div>
        )
    }
}

Files.propTypes = {
    files: PropTypes.array.isRequired,
    dispatchFetchFiles: PropTypes.func.isRequired,
    dispatchOnClickCreateFile: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    files: app.files,
})

export default connect(mapStateToProps, actions)(Files)
