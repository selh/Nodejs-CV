import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'


class PathLink extends PureComponent {
    renderPath() {
        const { pathname } = this.props
        if (pathname === '/') {
            return <span>CV Dump</span>
        }
        const locations = pathname.split(/(\/)/)
        // remove '' and first '/'
        locations.splice(0, 2)
        return locations.map((item, index) => {
            if (item === '/') {
                return (
                    <span key={`c-path-${index}`} className="c-path-title__slash">
                        /
                    </span>
                )
            } else {
                const dest = `/${locations.slice(0, index + 1).join('')}`
                const path = item.length > 15
                    ? `${item.substring(0, 15)}...`
                    : item
                return (
                    <Link
                        to={dest}
                        className="c-path-title__locations"
                        key={`c-path-${index}`}
                    >
                        <span>{path}</span>
                    </Link>
                )
            }
        })
    }

    render() {
        return (
            <div className="c-path-title">
                {this.renderPath()}
            </div>
        )
    }
}

PathLink.propTypes = {
    pathname: PropTypes.string.isRequired,
}

export default PathLink
