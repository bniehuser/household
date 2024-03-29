import React from 'react';
import {
  // Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  // TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
// import { WebBrowser } from 'expo';
//
// import { MonoText } from '../components/StyledText';
// import Colors from "../constants/Colors";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>

            <View style={{display:'flex', flexDirection:'row', color: '#ddd', marginTop:20, padding:10}}>
                <View style={{flex:.5, textAlign: 'right'}}>
                    <FontAwesome
                        name={'home'}
                        size={26}
                        style={[{ marginBottom: -3, padding: 1 }, styles.house]}
                    />
                    <Text style={[styles.getStartedText, styles.house, { fontFamily: 'montserrat-bold', fontSize: 21 }]}>house</Text>
                </View>
                <View style={{flex:.5, textAlign: 'left'}}>
                    <FontAwesome
                        name={'hand-grab-o'}
                        size={25}
                        style={[{ marginBottom: -3, padding: 1 }, styles.hold]}
                    />
                    <Text style={[styles.getStartedText, styles.hold, { fontFamily: 'montserrat-bold', fontSize: 21 }]}>hold</Text>
                </View>
            </View>
          <ScrollView style={[styles.container, {borderRadius:15, backgroundColor:'#dddddd'}]} contentContainerStyle={styles.contentContainer}>

            <View style={{padding:10}}>
          <Text>This is some content on the home screen, maybe?</Text>
            </View>


        </ScrollView>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
      color: '#ddd',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
  },
    house: {
    color: '#70D1FE',
        textAlign: 'right',
    },
    hold: {
        color: '#FED90F',
        textAlign: 'left',
    },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3, width: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
