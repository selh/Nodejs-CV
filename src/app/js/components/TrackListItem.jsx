import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableRowColumn } from 'material-ui'
import moment from 'moment'

const rowStyle = {
    fontSize: '1em',
}

class TrackListItem extends PureComponent {
    render() {
        const { job, company, createdAt } = this.props
        return (
            <TableRow>
                <TableRowColumn style={rowStyle}>
                    <p>{company}</p>
                </TableRowColumn>
                <TableRowColumn style={rowStyle}>
                    <p>{job}</p>
                </TableRowColumn>
                <TableRowColumn style={rowStyle}>
                    <p>{moment(createdAt).format('YYYY-MM-DD')}</p>
                </TableRowColumn>
            </TableRow>
        )
    }
}

TrackListItem.propTypes = {
    job: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
}

export default TrackListItem
