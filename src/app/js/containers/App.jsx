import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MuiThemeProvider, getMuiTheme } from 'material-ui/styles'
import * as MuiThemeOverrides from '../global/theme'
import * as actions from '../actions'
import Login from './Login'
import SignUp from './SignUp'
import Profile from './Profile'
import TabLayout from './TabLayout'
import Loader from '../components/Loader'


class App extends Component {
    componentDidMount() {
        // check if the user is authenticated already
        const originalPath = this.props.location.pathname
        const redirectPath = originalPath === '/login' || originalPath === '/signup'
            ? '/'
            : originalPath
        this.props.dispatchFetchUser(redirectPath, originalPath)
    }

    render() {
        const { location, user } = this.props
        if (user.isFetching) {
            return (
                <div className="u-flex-row u--center u-full">
                    <Loader />
                </div>
            )
        }
        if (!user.isAuthenticated &&
            !user.isFetching &&
            location.pathname !== '/login' &&
            location.pathname !== '/signup') {
            return <Redirect to="/login" />
        }

        return (
            <div className="app">
                <MuiThemeProvider muiTheme={getMuiTheme(MuiThemeOverrides)}>
                    <Switch>
                        <Route exact path="/login" component={ Login } />
                        <Route exact path="/signup" component={ SignUp } />
                        <Route exact path="/profile" component={ Profile } />
                        <Route path="/" component={TabLayout} />
                        <Redirect path="*" to="/" />
                    </Switch>
                </MuiThemeProvider>
            </div>
        )
    }
}

App.propTypes = {
    user: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        isAuthenticated: PropTypes.bool.isRequired,
    }),
    dispatchFetchUser: PropTypes.func.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }),
}

const mapStateToProps = ({ user }) => ({
    user,
})

export default withRouter(connect(mapStateToProps, actions)(App))
