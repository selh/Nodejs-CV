import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'


class Tab extends Component {
    render() {
        const classnames = classNames(
            'c-tab-item',
            'u-flex-col',
            'u--center',
            {
                'c-tab-item--active': this.props.active,
            }
        )
        return (
            <div className={classnames} onClick={this.props.onClick}>
                <label>
                    {this.props.label}
                </label>
            </div>
        )
    }
}

Tab.propTypes = {
    label: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
}

Tab.defaultProps = {
    label: '',
    active: false,
}



class Tabs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedIndex: this.props.startIndex,
        }
    }

    componentWillReceiveProps({ startIndex }) {
        this.setState({ selectedIndex: startIndex })
    }

    onTabSelect(selectedIndex) {
        this.setState({ selectedIndex })
    }

    renderTabs() {
        return this.props.children.map((item, index) => (
            <Link key={`tab-bar-item-${index}`} to={item.props.path}>
                <Tab
                    active={this.state.selectedIndex === index}
                    index={index}
                    label={item.props.label}
                    onClick={() => {this.onTabSelect(index)}}
                />
            </Link>
        ), this)
    }

    render() {
        const sliderStyle = {
            '--tab-number': this.props.children.length,
            left: `${this.state.selectedIndex / this.props.children.length * 100}%`,
        }
        return (
            <nav className="c-tab-bar u-flex-row u--center" data-index={this.state.selectedIndex}>
                {this.renderTabs()}
                <span className={'c-tab-slider'} style={sliderStyle}></span>
            </nav>
        )
    }
}

Tabs.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    startIndex: PropTypes.number.isRequired,
}

export { Tab, Tabs }
