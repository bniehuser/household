import React from 'react';
import { TextComponent } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <TextComponent>This is some Text on the Settings page</TextComponent>;
  }
}
