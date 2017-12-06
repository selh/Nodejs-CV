import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Logo, Avatar } from '../global/icon'
import * as actions from '../actions'
import PathLink from '../components/PathLink'
import { Paper, Menu, MenuItem } from 'material-ui'
import { getDisplayName } from '../global/common'
import NotificationView from './NotificationView'


class StatusBar extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            showMenu: false,
        }
    }

    renderLogo() {
        return (
            <Link className="c-status-bar__logo" to="/">
                <Logo style={{ width: '65px', height: 'auto' }} />
            </Link>
        )
    }

    renderMenu() {
        if (this.state.showMenu) {
            const style= {
                display: 'inline-block',
                fontSize: '16px',
                position: 'absolute',
                top: 'var(--status-bar-height)',
                right: '10px',
                zIndex: '100',
            }
            return (
                <Paper style={style}>
                    <Menu>
                        <MenuItem
                            containerElement={<Link to="/profile" />}
                            primaryText="Profile"
                        />
                        <MenuItem primaryText="Sign out" onClick={this.props.dispatchLogOut}/>
                    </Menu>
                </Paper>
            )
        }
    }

    renderUser() {
        return (
            <div
                className="c-status-bar__user"
                onClick={() => {this.setState({ showMenu: !this.state.showMenu })}}
            >
                <Avatar
                    url={this.props.user.info.avatarUrl}
                    style={{ width: 40, height: 'auto'}}
                />
                <label className="u-margin-h-md">{getDisplayName()}</label>
                <i className="material-icons">
                    expand_more
                </i>
                {this.renderMenu()}
            </div>
        )
    }

    render() {
        return (
            <div className="c-status-bar">
                <PathLink pathname={this.props.location.pathname}/>
                {this.renderLogo()}
                <div className="c-status-bar__notification">
                    <NotificationView />
                    {this.renderUser()}
                </div>

            </div>
        )
    }
}

StatusBar.propTypes = {
    user: PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        info: PropTypes.shape({
            username: PropTypes.string,
            email: PropTypes.string.isRequired,
            avatarUrl: PropTypes.string.isRequired,
        }).isRequired,
    }),
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
    dispatchLogOut: PropTypes.func.isRequired,
}


const mapStateToProps = ({ user }) => ({
    user,
})


export default withRouter(connect(mapStateToProps, actions)(StatusBar))
