import React from 'react'
import styled from 'styled-components'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

import * as Components from '../../components'

import { fonts, colors, spacing } from '../../tokens'
import uniqueId from '../../components/_helpers/uniqueId'
import Props from './props'
import getPropString from './prop-string'

const Container = styled.div`
  margin: ${spacing.medium} 0;

  & .react-live {
    position: relative;
  }
  & .react-live-preview {
    white-space: normal;
    border: 1px solid ${colors.base.grayLight};
    border-bottom-width: ${props => (props.codeVisible ? 0 : '1px')};
    border-radius: 3px 3px ${props => (props.codeVisible ? '0 0' : '3px 3px')};
    padding: 40px;
  }

  & .prism-code {
    padding: ${spacing.small} ${spacing.medium};
    background: #20222b;
    overflow-x: auto;
    font-family: ${fonts.family.code};
    border: 1px solid ${colors.base.grayLightest};
    border-top-width: 0;
    border-radius: 0 0 3px 3px;
  }

  & .react-live-error {
    color: ${colors.base.orange};
    padding: 5px;
  }
`

const CodeWrapper = styled.div`
  overflow: hidden;
  max-height: ${props => 25 * (props.code.split('\n').length + 1)}px;
  transition: max-height 0.5s ease;

  &.hide {
    max-height: 0;
  }
`

const CodeToggle = styled.div`
  color: ${colors.base.grayDark};
  text-align: right;
  font-size: 12px;

  cursor: pointer;
  padding: ${spacing.xsmall} 0;
`

const Copy = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  color: ${colors.base.white};
  padding: ${spacing.small};
  cursor: pointer;
  &:hover {
    color: ${colors.base.blue};
  }
`

class Playground extends React.Component {
  constructor(props) {
    super(props)
    let showProps = props.language === 'lang-jsx'

    this.state = {
      showProps,
      codeVisible: showProps,
      uniqueId: uniqueId('code'),
      code: this.props.code
    }
  }
  toggleCode() {
    this.setState({ codeVisible: !this.state.codeVisible })
  }
  copyCode() {
    const copyText = document.querySelector('#' + this.state.uniqueId)
    copyText.select()
    document.execCommand('copy')
  }
  onPropsChange(propData) {
    const propString = getPropString(propData)
    this.setState({ code: this.props.code.replace(' {props}', propString) })
  }
  render() {
    const code = this.state.code

    return (
      <Container codeVisible={this.state.codeVisible}>
        <input
          id={this.state.uniqueId}
          value={code}
          style={{ opacity: 0, height: 0, display: 'none' }}
          onChange={() => {}}
        />
        <LiveProvider code={code} scope={Components}>
          <LivePreview />
          <LiveError />
          {/* {this.state.codeVisible ? <LiveEditor /> : null} */}
          <CodeWrapper className={!this.state.codeVisible && 'hide'} code={code}>
            <LiveEditor />
          </CodeWrapper>
          {this.state.codeVisible ? (
            <Copy onClick={this.copyCode.bind(this)}>
              <Components.Icon name="copy" />
            </Copy>
          ) : null}
        </LiveProvider>
        <CodeToggle codeVisible={this.state.codeVisible} onClick={this.toggleCode.bind(this)}>
          {this.state.codeVisible ? 'Hide Code' : 'Show Code'}
        </CodeToggle>
        {this.state.showProps && (
          <Props
            propData={this.props.component.props}
            onPropsChange={this.onPropsChange.bind(this)}
          />
        )}
      </Container>
    )
  }
}

export default Playground
