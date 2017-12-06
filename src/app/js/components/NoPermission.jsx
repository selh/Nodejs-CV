import React, { PureComponent } from 'react'

class NoPermission extends PureComponent {
    render() {
        return (
            <div>
                <h3>403 You do not have permission to access</h3>
                <p>We are sorry but you need permission to view the page.</p>
            </div>
        )
    }
}

export default NoPermission
