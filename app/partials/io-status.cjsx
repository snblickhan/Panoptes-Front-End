React = require 'react'
apiClient = require '../api/client'

module.exports = React.createClass
  displayName: 'IOStatus'

  getDefaultProps: ->
    target: apiClient
    style:
      background: 'rgba(0, 0, 0, 0.5)'
      borderRadius: '0 0 0.3em 0.3em'
      color: 'white'
      fontSize: '11px'
      fontWeight: 'bold'
      left: '50%'
      padding: '0 1.5em'
      position: 'fixed'
      textTransform: 'uppercase'
      top: 0
      transform: 'translateX(-50%)'

  getInitialState: ->
    reads: @props.target.reads
    writes: @props.target.writes

  componentDidMount: ->
    console.log 'IOStatus componentDidMount'
    @props.target.listen 'change', @handleTargetChange

  componentWillReceiveProps: (nextProps) ->
    console.log 'IOStatus componentWillReceiveProps'
    @props.target.stopListening 'change', @handleTargetChange
    nextProps.target.listen 'change', @handleTargetChange

  componentWillUnmount: ->
    console.log 'IOStatus componentWillUnmount'
    @props.target.stopListening 'change', @handleTargetChange

  handleTargetChange: ->
    setTimeout => # TODO: I have no idea why this is necessary.
      {reads, writes} = @props.target
      console.log 'IOStatus handleTargetChange', this, {reads, writes}
      @setState {reads, writes}

  render: ->
    {reads, writes} = @state

    console.log 'IOStatus render', {reads, writes}

    rootStyle =
      pointerEvents: 'none'
      zIndex: 1
    if reads is 0 and writes is 0
      rootStyle.display = 'none'

    <span style={rootStyle}>
      <span className="io-status" style={@props.style}>
        <span style={visibility: 'hidden' if reads is 0 and writes is 0}>
          <i className="fa fa-spinner fa-spin fa-fw"></i>
        </span>
        {' '}
        Loading
        &ensp;
        <span style={opacity: 0.3 if reads is 0}>
          <i className="fa fa-chevron-down fa-fw"></i>
          {reads}
        </span>
        &ensp;
        <span style={opacity: 0.3 if writes is 0}>
          <i className="fa fa-chevron-up fa-fw"></i>
          {writes}
        </span>
      </span>
    </span>
