// State Initializers

import React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn && fn(...args))

class Toggle extends React.Component {
  // 🐨 We're going to need some static defaultProps here to allow
  // people to pass a `initialOn` prop.
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
  }
  // 🐨 Rather than initializing state to have on as false,
  // set on to this.props.initialOn
  initialState = {on: this.props.initialOn}
  state = this.initialState

  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )

  // 🐨 now let's add a reset method here that resets the state
  // to the initial state. Then add a callback that calls
  // this.props.onReset with the `on` state.
  reset = () =>
    this.setState(this.initialState, () =>
      this.props.onReset(this.state.on),
    )

  getTogglerProps = ({onClick, ...props} = {}) => {
    return {
      'aria-pressed': this.state.on,
      onClick: callAll(onClick, this.toggle),
      ...props,
    }
  }
  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      // 🐨 now let's include the reset method here
      // so folks can use that in their implementation.
      reset: this.reset,
      getTogglerProps: this.getTogglerProps,
    }
  }
  render() {
    return this.props.children(this.getStateAndHelpers())
  }
}

// Don't make changes to the Usage component.
// note: user provides initialOn to initialize state
function Usage({
  initialOn = true,
  onToggle = (...args) => console.log('onToggle', ...args),
  onReset = (...args) =>
    console.log('user provided onReset', ...args),
}) {
  return (
    <Toggle
      initialOn={initialOn}
      onToggle={onToggle}
      onReset={onReset}
    >
      {({getTogglerProps, on, reset}) => (
        <div>
          <Switch {...getTogglerProps({on})} />
          <hr />
          <button onClick={() => reset()}>Reset</button>
        </div>
      )}
    </Toggle>
  )
}
Usage.title = 'State Initializers'

export {Toggle, Usage as default}
