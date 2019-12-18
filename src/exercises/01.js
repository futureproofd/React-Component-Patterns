// Building the toggle component

import React from 'react'
import {Switch} from '../switch'
// 🐨 uncomment this import to get the switch component.
// It takes an `onClick` and an `on` prop
// import {Switch} from '../switch'

class Toggle extends React.Component {
  // 🐨 this toggle component is going to need to have state for `on`
  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => {
        this.props.onToggle(this.state.on)
      },
    )
  // 💯 Use a state updater function for `newState` to avoid issues with batching
  render() {
    return <Switch on={this.state.on} onClick={this.toggle} />
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return <Toggle onToggle={onToggle} />
}
Usage.title = 'Build Toggle'

export {Toggle, Usage as default}
