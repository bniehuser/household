import React from 'react';
// seriously?  have to fake Icon in Expo for Typescript
// import { Icon } from 'expo';

import Colors from '../constants/Colors';
import { TextComponent } from 'react-native';

interface IProps {
    name: string;
    focused: boolean;
}

export default class TabBarIcon extends React.Component<IProps> {
  render() {
    return (
        <TextComponent style={{backgroundColor:this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}}>Would be an icon</TextComponent>
      // <Icon.Ionicons
      //   name={this.props.name}
      //   size={26}
      //   style={{ marginBottom: -3 }}
      //   color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      // />
    );
  }
}