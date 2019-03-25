import React from 'react';
import Colors from '../constants/Colors';
import { Text } from 'react-native';

interface IProps {
    name: string;
    focused: boolean;
}

export default class TabBarIcon extends React.Component<IProps> {
  render() {
    return (
      <Text
        style={{ marginBottom: -2, color: this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault }}
      >{this.props.name}</Text>
    );
  }
}