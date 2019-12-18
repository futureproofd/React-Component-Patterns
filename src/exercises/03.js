// Flexible Compound Components with context

import React from 'react'
import {Switch} from '../switch'

// Right now our component can only clone and pass props to immediate children.
// So we need some way for our compound components to implicitly accept the on
// state and toggle method regardless of where they're rendered within the
// Toggle component's "posterity" :)
//
// The way we do this is through context. React.createContext is the API we
// want.
// 🐨 create a ToggleContext with React.createContext here
const ToggleContext = React.createContext()

// calling the ToggleContext.Consumer outside of a Provider will throw an error
// we want to ensure we're calling it wihin the Provider on the Toggle component
// here's a helper function:
function ToggleConsumer(props) {
  return (
    <ToggleContext.Consumer>
      {context => {
        if (!context) {
          throw new Error(
            'Toggle compound components must be rendered within the Toggle component',
          )
        }
        return props.children(context)
      }}
    </ToggleContext.Consumer>
  )
}

class Toggle extends React.Component {
  // 🐨 each of these compound components will need to be changed to use
  // ToggleContext.Consumer and rather than getting `on` and `toggle`
  // from props, it'll get it from the ToggleContext.Consumer value.
  static On = ({children}) => (
    <ToggleConsumer>
      {contextValue => (contextValue.on ? children : null)}
    </ToggleConsumer>
  )
  static Off = ({children}) => (
    <ToggleConsumer>
      {contextValue => (contextValue.on ? null : children)}
    </ToggleConsumer>
  )
  static Button = props => (
    <ToggleConsumer>
      {contextValue => (
        <Switch
          on={contextValue.on}
          onClick={contextValue.toggle}
          {...props}
        />
      )}
    </ToggleConsumer>
  )
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )

  state = {on: false, toggle: this.toggle}

  render() {
    // Because this.props.children is _immediate_ children only, we need
    // to 🐨 remove this map function (last lesson) and render our context provider with
    // this.props.children as the children of the provider. Then we'll
    // expose the `on` state and `toggle` method as properties in the context
    // value (the value prop).
    return (
      <ToggleContext.Provider value={this.state}>
        {this.props.children}
      </ToggleContext.Provider>
    )
  }
}

// 💯 Extra credit: avoid unecessary re-renders of the consumers by not
// creating a new `value` object every render (when provider value changes) and instead
// passing an object which only changes when the state changes.
// we accomplish this by passing all of state (plus the toggle function) to the provider value
// so it only updates when our state changes, not on every render (normally you wouldn't add an
// event handler to state like this)

// Don't make changes to the Usage component
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
