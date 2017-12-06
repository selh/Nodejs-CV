import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import Loader from '../components/Loader'
import TrackListItem from '../components/TrackListItem'
import {
    Table,
    TableRow,
    TableHeader,
    TableHeaderColumn,
    TableBody,
    RaisedButton,
    TextField,
    Snackbar
} from 'material-ui'

const style = {
    backgroundColor: 'transparent',
}

const rowStyle = {
    fontSize: '1em',
}

class Tracking extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            companyErrorMessage: '',
            titleErrorMessage: '',
        }
    }

    componentDidMount() {
        this.props.dispatchFetchTracking(() => this.setState({ isLoading: false }))
    }

    renderJobs() {
        return this.props.tracking.trackings.map(({ jobTitle, companyName, createdAt }, index) => {
            return (
                <TrackListItem
                    key={`tracking-job-${jobTitle}-${index}`}
                    job={jobTitle}
                    company={companyName}
                    createdAt={createdAt}
                />
            )
        })
    }

    onSave() {
        this.setState({ isLoading: true })
        let hasError = false
        let companyErrorMessage = ''
        let titleErrorMessage = ''
        const companyName = this.companyNode.getValue().trim()
        const jobTitle = this.titleNode.getValue().trim()
        if (companyName === '') {
            hasError = true
            companyErrorMessage = 'Please provide a value'
        } else if (companyName.length > 20) {
            hasError = true
            companyErrorMessage = 'Company name must be shorter than 20 characters'
        }
        if (jobTitle === '') {
            hasError = true
            titleErrorMessage = 'Please provide a value'
        } else if (jobTitle.length > 20) {
            hasError = true
            titleErrorMessage = 'Job title must be shorter than 20 characters'
        }
        if (hasError) {
            this.setState({
                companyErrorMessage,
                titleErrorMessage,
                isLoading: false,
            })
        } else {
            this.props.dispatchSaveTracking({ companyName, jobTitle }, () =>
                this.setState({
                    isLoading: false,
                    companyErrorMessage: '',
                    titleErrorMessage: '',
                })
            )
        }
    }

    renderMessage() {
        return (
            <Snackbar
                open={this.props.tracking.errorMessage !== ''}
                message={this.props.tracking.errorMessage}
                autoHideDuration={2000}
                bodyStyle={{ width: '100%' }}
            />
        )
    }


    render() {
        if (this.state.isLoading) {
            return <Loader />
        }
        return (
            <div className="u-flex-column u--center u--no-shrink u-full-width u-padding-h-xl">
                <h2 className="u-flex-row u--center u-full-width">Application Status</h2>
                <div className="c-new-tracking-item">
                    <h3>Add a new job status</h3>
                    <TextField
                        className="c-track-item__company"
                        id={'track-item-new-company'}
                        hintText="Company Name"
                        ref={ref => this.companyNode = ref}
                        errorText={this.state.companyErrorMessage}
                    />
                    <TextField
                        className="c-track-item__title"
                        id={'track-item-new-title'}
                        hintText="Job Title"
                        ref={ref => this.titleNode = ref}
                        errorText={this.state.titleErrorMessage}
                    />
                    <RaisedButton
                        label="Add"
                        labelColor="#fff"
                        backgroundColor="#2286c3"
                        onClick={this.onSave.bind(this)}
                    />
                </div>
                <Table style={style}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn style={rowStyle}>Company</TableHeaderColumn>
                            <TableHeaderColumn style={rowStyle}>Job Title</TableHeaderColumn>
                            <TableHeaderColumn style={rowStyle}>Applied Date</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {this.renderJobs()}
                    </TableBody>
                </Table>
                {this.renderMessage()}
            </div>
        )
    }
}

Tracking.propTypes = {
    dispatchFetchTracking: PropTypes.func.isRequired,
    dispatchSaveTracking: PropTypes.func.isRequired,
    tracking: PropTypes.shape({
        trackings: PropTypes.array.isRequired,
        errorMessage: PropTypes.string.isRequired,
    }).isRequired,
}

const mapStateToProps = (state) => ({
    tracking: state.app.tracking,
})

export default connect(mapStateToProps, actions)(Tracking)
