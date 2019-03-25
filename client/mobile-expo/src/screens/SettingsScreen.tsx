import React from 'react';
import Colors from '../constants/Colors';
// import { Text, View } from 'react-native';
const { ExpoConfigView } = require('@expo/samples');

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
      headerStyle: {
          backgroundColor: '#000',
      },
      headerTintColor: Colors.tintColor,
      headerTitleStyle: {
          fontFamily: 'montserrat-bold',
      },

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
