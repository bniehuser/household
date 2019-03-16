import React from 'react';
// seriously?  have to fake Icon in Expo for Typescript
const { Icon } = require('expo');
import Colors from '../constants/Colors';

interface IProps {
    name: string;
    focused: boolean;
}

export default class TabBarIcon extends React.Component<IProps> {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}