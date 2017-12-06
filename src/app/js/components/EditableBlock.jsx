import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import RichTextEditor from 'react-rte'
import * as actions from '../actions'


class EditableBlock extends PureComponent {
    renderButton() {
        const { blockOrder, isEditing } = this.props
        if (blockOrder !== -1 && isEditing) {
            // in the file section => need up, down, remove button
            return (
                <div className="c-editable-block__buttons">
                    <i
                        className="material-icons"
                        onClick={()=>{this.props.dispatchMoveBlockFromSelectedFile(blockOrder, -1)}}
                    >arrow_upward</i>
                    <i
                        className="material-icons"
                        onClick={()=>{this.props.dispatchMoveBlockFromSelectedFile(blockOrder, 1)}}
                    >arrow_downward</i>
                    <i
                        className="material-icons"
                        onClick={()=>{this.props.dispatchRemoveBlockFromSelectedFile(blockOrder)}}
                    >remove</i>
                </div>
            )
        } else if (blockOrder === -1) {
            // in the available section => need add button
            return (
                <div className="c-editable-block__button">
                    <i
                        className="material-icons"
                        onClick={()=>{this.props.dispatchAddBlockToSelectedFile(this.props.value, this.props.id)}}
                    >
                        add
                    </i>
                </div>
            )
        }
    }
    render() {
        return (
            <div className="c-editable-block-container">
                {this.renderButton()}
                <RichTextEditor
                    value={RichTextEditor.createValueFromString(this.props.value, 'markdown')}
                    readOnly={true}
                    className="c-block-editor"
                />
            </div>
        )
    }
}

EditableBlock.propTypes = {
    value: PropTypes.string.isRequired,
    blockOrder: PropTypes.number,
    id: PropTypes.string.isRequired,
    isEditing: PropTypes.bool,
    dispatchAddBlockToSelectedFile: PropTypes.func.isRequired,
    dispatchRemoveBlockFromSelectedFile: PropTypes.func.isRequired,
    dispatchMoveBlockFromSelectedFile: PropTypes.func.isRequired,
}

EditableBlock.defaultProps = {
    blockOrder: -1,
    isEditing: false,
}

export default connect(null, actions)(EditableBlock)
