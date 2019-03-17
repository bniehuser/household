import React from 'react';
import { Text } from 'react-native';

interface IProps {
  style: any;
}

export class MonoText extends React.Component<IProps> {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
  }
}

export class HHText extends React.Component<IProps> {
    render() {
        return <Text {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
    }
}
