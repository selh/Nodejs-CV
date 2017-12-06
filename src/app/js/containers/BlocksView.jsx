import React, { Component } from 'react'
import { connect } from 'react-redux'
import RichTextEditor, { createEmptyValue } from 'react-rte'
import PropTypes from 'prop-types'
import * as actions from '../actions'
import { RaisedButton, TextField } from 'material-ui'

class TextEditor extends Component {
    constructor(props) {
        super(props)
        this.saveData = this.saveData.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeSource = this.onChangeSource.bind(this)
        this.updateData = this.updateData.bind(this)
        this.state = {
            value: createEmptyValue(),
            format: 'markdown',
            readOnly: false,
            titleInput: 'Untitled',
        }
    }

    render() {
        if (!this.currentBlock) {
            return (
                <div className="c-blocks-editor">
                    <h3>Please Select One Block on the Left Column to Edit</h3>
                </div>
            )
        }

        let { value, titleInput } = this.state

        return (
            <div className="c-blocks-editor">
                <h3>Edit Block</h3>
                <div className="u-flex-row u--center-cross u--space-between u-full-width u-padding-v-md">
                    <TextField
                        hintText="New Block Name"
                        defaultValue={titleInput}
                        ref={ref => this.titleNode = ref}
                    />
                    <RaisedButton
                        label="Save"
                        labelColor="#fff"
                        backgroundColor="#2286c3"
                        onClick={this.saveData}
                    />
                </div>
                <RichTextEditor
                    className="u-full"
                    value={value}
                    onChange={this.onChange}
                    placeholder="Tell a story"
                    readOnly={this.state.readOnly}
                />
            </div>
        )
    }

    onChange(value) {
        this.setState({ value })
    }

    onChangeSource(event) {
        const source = event.target.value
        const oldValue = this.state.value
        this.setState({
            value: oldValue.setContentFromString(source, this.state.format),
        })
    }

    updateData(block) {
        let { value, format } = this.state
        this.currentBlock = block
        if (this.titleNode) {
            this.titleNode.input.value = block.label
            this.setState({
                value: value.setContentFromString(this.currentBlock.summary, format),
            })
        } else {
            this.setState({
                value: value.setContentFromString(this.currentBlock.summary, format),
                titleInput: block.label,
            })
        }
    }

    saveData() {
        let { value, format } = this.state
        this.currentBlock.summary = value.toString(format)
        this.currentBlock.label = this.titleNode.getValue()
        this.props.saveBlock(this.currentBlock)
    }
}

TextEditor.propTypes = {
    saveBlock: PropTypes.func.isRequired,
}

const BlockParentComponent = props => (
    <div>
        <RaisedButton
            label="Add"
            labelColor="#fff"
            backgroundColor="#2286c3"
            className="u-margin-v-md"
            onClick={props.addChild}
        />
        {props.children}
    </div>
)

BlockParentComponent.propTypes = {
    addChild: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired,
}

const BlockChildComponent = props => (
    <RaisedButton
        label={`${props.block.label}`}
        className="u-padding-md u-full-width"
        onClick={props.onClick.bind(this, props.block)}
    />
)


BlockChildComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    block: PropTypes.object.isRequired,
}

class Blocks extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
        this.addChild = this.addChild.bind(this)
        this.onChangeSource = this.onChangeSource.bind(this)
        this.saveBlock = this.saveBlock.bind(this)
        this.state = {
            oldblocks: [],
            inputValue: '',
        }

    }

    componentDidMount() {
        this.props.dispatchFetchBlocks()
    }

    saveBlock(block){
        this.props.dispatchEditBlock(block)
    }

    handleClick(block) {
        this.editorRef.updateData(block)
    }

    addChild(newType) {
        let newName = this.state.inputValue
        this.props.dispatchCreateBlock({
            label: newName,
            type: newType,
        })
    }

    onChangeSource(event) {
        const source = event.target.value
        this.setState({
            inputValue: source,
        })
    }

    render() {
        // const HeadersChildren = this.props.blocks.map((block, index) => {
        //     if (block.type == 'headers') {
        //         return <BlockChildComponent
        //             key={index}
        //             onClick={this.handleClick}
        //             block={block}
        //         />
        //     }
        // })

        const SkillsChildren = this.props.blocks.map((block, index) => {
            if (block.type == 'skills') {
                return <BlockChildComponent
                    key={index}
                    onClick={this.handleClick}
                    block={block}
                />
            }
        })

        return (
            <div className="c-file-container">
                <div className="c-blocks-list">
                    <h3>All Your Blocks</h3>
                    {/* <div>Headers</div>
                    <BlockParentComponent addChild={this.addChild.bind(this, 'headers')}>
                        {HeadersChildren}
                    </BlockParentComponent>
                    <div>Skills</div> */}
                    <BlockParentComponent addChild={this.addChild.bind(this, 'skills')}>
                        {SkillsChildren}
                    </BlockParentComponent>
                </div>
                <TextEditor
                    saveBlock={this.saveBlock.bind(this)}
                    ref={(editor) => { this.editorRef = editor }}
                />
            </div>
        )
    }
}

Blocks.propTypes = {
    blocks: PropTypes.array.isRequired,
    dispatchCreateBlock: PropTypes.func.isRequired,
    dispatchEditBlock: PropTypes.func.isRequired,
    dispatchFetchBlocks: PropTypes.func.isRequired,
}

const mapStateToProps = ({ app }) => ({
    blocks: app.blocks,
})


export default connect(mapStateToProps, actions)(Blocks)
