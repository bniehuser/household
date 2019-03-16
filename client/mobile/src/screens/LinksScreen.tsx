import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
const { ExpoLinksView } = require('@expo/samples');

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  render() {
    return (
      <ScrollView style={styles.container}>
          <Text>This is some Text on the Links page</Text>
        <ExpoLinksView/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
