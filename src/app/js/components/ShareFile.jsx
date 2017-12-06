import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import Loader from './Loader'
import CommentBox from '../containers/comments/CommentBox'
import { Document, Page, setOptions } from 'react-pdf'

/**
 * FILE NOT READY
 */

class ShareFile extends PureComponent {
    constructor(props) {
        super(props)

        setOptions({
            workerSrc: '/pdf.worker.js',
        })

        this.state = {
            isLoading: true,
            numPages: 1,
            pageNumber: 1,
        }
    }

    componentDidMount() {
        const id = this.getDocumentId()
        this.props.dispatchFetchSharedFile(id, () => {
            this.setState({ isLoading: false })
        })
    }

    getDocumentId() {
        // if user refresh on the file, then selectedFile would be empty
        const lastIndex = this.props.location.pathname.lastIndexOf('/')
        return this.props.selectedFile.id || this.props.location.pathname.substring(lastIndex + 1)
    }

    onDocumentLoad({ numPages }) {
        this.setState({
            numPages,
            isLoading: false,
        })
    }

    onLoadError(error) {
        if ((error.message || error) === 'cancelled') {
            console.log(`[PDF render] ${error.message}`)
            return
        }
    }

    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        const { pageNumber, numPages } = this.state
        return (
            <div className="c-file-container">
                <div className="c-file-content">
                    <Document
                        file={{ url: this.props.selectedFile.pdfUrl }}
                        onLoadSuccess={this.onDocumentLoad.bind(this)}
                        onLoadError={this.onLoadError.bind(this)}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>Page {pageNumber} of {numPages}</p>
                </div>
                <div className="c-file-comments">
                    <h3>Your Comments</h3>
                    <CommentBox docId={this.getDocumentId()} />
                </div>
            </div>
        )
    }
}

ShareFile.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    dispatchFetchSharedFile: PropTypes.func.isRequired,
    selectedFile: PropTypes.shape({
        id: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        pdfUrl: PropTypes.string,
    }),
}

const mapStateToProps = ({ app }) => ({
    selectedFile: app.selectedFile,
})


export default withRouter(connect(mapStateToProps, actions)(ShareFile))
