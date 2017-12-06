import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Tabs, Tab } from '../components/Tabs'
import NotFound from '../components/NotFound'
import File from '../components/File'
import ShareFile from '../components/ShareFile'
import FilesView from './FilesView'
import SharedView from './SharedView'
import BlocksView from './BlocksView'
import TrackingView from './TrackingView'
import StatusBar from './StatusBar'
import NoPermission from '../components/NoPermission'
import * as actions from '../actions'

const routes = [
    {
        path: '/files',
        label: 'Files',
        component: FilesView,
    },
    {
        path: '/shared',
        label: 'Shared',
        component: SharedView,
    },
    {
        path: '/blocks',
        label: 'Blocks',
        component: BlocksView,
        exact: true,
    },
    {
        path: '/tracking',
        label: 'Tracking',
        component: TrackingView,
        exact: true,
    }
]

class TabLayout extends Component {
    constructor() {
        super()

        this.state = {
            tabIndex: 0,
        }
    }

    componentDidMount() {
        this.checkTabIndex(this.props.location.pathname)
    }

    componentWillReceiveProps(nextProps) {
        this.checkTabIndex(nextProps.location.pathname)
    }

    checkTabIndex(pathname) {
        const endIndex = pathname.indexOf('/', 1)
        const path = endIndex === -1 ? pathname.substring(1) : pathname.substring(1, endIndex)
        const index = routes.findIndex((item) => {
            return item.path.substring(1) === path
        })

        if (index !== -1) {
            this.setState({ tabIndex: index })
        }
    }

    renderTabBar() {
        return routes.map(({ path, label }) => {
            return <Tab key={`Nav-tab-${label}`} path={path} label={label} />
        })
    }

    render() {
        return (
            <div className="u-flex-column u--center-cross u-full">
                <StatusBar />
                <div className="t-tab-tabbar">
                    <Tabs startIndex={this.state.tabIndex}>{this.renderTabBar()}</Tabs>
                </div>
                <Switch>
                    <Route path="/files/:id" component={File} />
                    <Route path="/shared/:id" component={ShareFile} />
                    {routes.map(({ path, component, exact, label })=> {
                        return <Route key={`routes-${label}`} path={path} component={component} exact={exact} />
                    })}
                    <Redirect exact path="/" to="/files" />
                    <Route exact path="/403" component={NoPermission} />
                    <Route path="*" component={ NotFound } />
                </Switch>
            </div>
        )
    }
}

TabLayout.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
}

export default withRouter(connect(null, actions)(TabLayout))
