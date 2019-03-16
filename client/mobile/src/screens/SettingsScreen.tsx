import React from 'react';
// import { Text, View } from 'react-native';
const { ExpoConfigView } = require('@expo/samples');

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
        <ExpoConfigView/>
        // <View>
        //   <Text>This is some Text on the Settings page</Text>
        // </View>
    );
  }
}
