import React from 'react';
// seriously?  have to fake Icon in Expo for Typescript
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface IProps {
    name: string;
    focused: boolean;
}

export default class TabBarIcon extends React.Component<IProps> {
  render() {
    return (
      <FontAwesome
        name={this.props.name}
        size={24}
        style={{ marginBottom: -2 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}