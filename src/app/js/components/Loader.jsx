import React, { PureComponent } from 'react'

class Loader extends PureComponent {
    render() {
        return (
            <div className="u-flex-row u--center u-full-width u-full-height">
                <div className="c-cube-grid">
                    <div className="c-cube c-cube1"></div>
                    <div className="c-cube c-cube2"></div>
                    <div className="c-cube c-cube3"></div>
                    <div className="c-cube c-cube4"></div>
                    <div className="c-cube c-cube5"></div>
                    <div className="c-cube c-cube6"></div>
                    <div className="c-cube c-cube7"></div>
                    <div className="c-cube c-cube8"></div>
                    <div className="c-cube c-cube9"></div>
                </div>
            </div>
        )
    }
}

export default Loader
