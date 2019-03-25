import React, { Component } from "react";
import { TouchableOpacity, View, ImageBackground } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";

import styles, { screenHeight, screenWidth } from "../style";

const PICTURE_OPTIONS = {
    quality: 1,
    fixOrientation: true,
    forceUpOrientation: true
};

export default class App extends React.Component {
    state = {
        loading: false,
        image: null,
        error: null,
        visionResp: []
    };

    camera: any;

    /**
     * reset
     *
     * Handles error situation at any stage of the process
     *
     * @param {string} [error="OTHER"]
     * @memberof App
     */
    reset(error = "OTHER") {
        this.setState(
            {
                loading: false,
                image: null,
                error
            },
            () => {
                // setTimeout(() => this.camera.startPreview(), 500);
            }
        );
    }

    /**
     * takePicture
     *
     * Responsible for getting image from react native camera and
     * starting image processing.
     *
     * @param {*} camera
     * @author Zain Sajjad
     */
    takePicture = async camera => {
        this.setState({
            loading: true
        });
        try {
            const data = await camera.takePictureAsync(PICTURE_OPTIONS);
            if (!data.uri) {
                throw "OTHER";
            }
            this.setState(
                {
                    image: data.uri
                },
                () => {
                    console.log(data.uri);
                    this.processImage(data.uri, {
                        height: data.height,
                        width: data.width
                    });
                }
            );
        } catch (e) {
            console.warn(e);
            this.reset(e);
        }
    };

    /**
     * processImage
     *
     * Responsible for getting image from react native camera and
     * starting image processing.
     *
     * @param {string} uri              Path for the image to be processed
     * @param {object} imageProperties  Other properties of image to be processed
     * @memberof App
     * @author Zain Sajjad
     */
    processImage = async (uri, imageProperties) => {
        const visionResp = await RNTextDetector.detectFromUri(uri);
        console.log(visionResp);
        if (!(visionResp && visionResp.length > 0)) {
            throw "UNMATCHED";
        }
        this.setState({
            visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
        });
    };

    /**
     * mapVisionRespToScreen
     *
     * Converts RNTextDetectors response in representable form for
     * device's screen in accordance with the dimensions of image
     * used to processing.
     *
     * @param {array}  visionResp       Response from RNTextDetector
     * @param {object} imageProperties  Other properties of image to be processed
     * @memberof App
     */
    mapVisionRespToScreen = (visionResp, imageProperties) => {
        const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
        const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

        return visionResp.map(item => {
            return {
                ...item,
                position: {
                    width: item.bounding.width * IMAGE_TO_SCREEN_X,
                    left: item.bounding.left * IMAGE_TO_SCREEN_X,
                    height: item.bounding.height * IMAGE_TO_SCREEN_Y,
                    top: item.bounding.top * IMAGE_TO_SCREEN_Y
                }
            };
        });
    };

    /**
     * React Native render function
     *
     * @returns ReactNode or null
     * @memberof App
     */
    render() {
        return (
            <View style={styles.screen}>
                {!this.state.image ? (
                    <Camera
                        ref={cam => {
                            this.camera = cam;
                        }}
                        key="camera"
                        style={styles.camera}
                        playSoundOnCapture
                    >
                        {({ camera, status }) => {
                            if (status !== "READY") {
                                return null;
                            }
                            return (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => this.takePicture(camera)}
                                        style={styles.button}
                                    />
                                </View>
                            );
                        }}
                    </Camera>
                ) : null}
                {this.state.image ? (
                    <ImageBackground
                        source={{ uri: this.state.image }}
                        style={styles.imageBackground}
                        key="image"
                        resizeMode="cover"
                    >
                        {this.state.visionResp.map(item => {
                            return (
                                <TouchableOpacity
                                    style={[styles.boundingRect, item.position]}
                                    key={item.text}
                                />
                            );
                        })}
                    </ImageBackground>
                ) : null}
            </View>
        );
    }
}

// import React from "react";
// import Colors from '../constants/Colors';
// import { View, Text } from "react-native";
// // import { Text, View } from 'react-native';
//
// export default class SettingsScreen extends React.Component {
//   static navigationOptions = {
//     title: 'app.json',
//       headerStyle: {
//           backgroundColor: '#000',
//       },
//       headerTintColor: Colors.tintColor,
//       headerTitleStyle: {
//           fontFamily: 'montserrat-bold',
//       },
//
//   };
//
//   render() {
//     /* Go ahead and delete ExpoConfigView and replace it with your
//      * content, we just wanted to give you a quick view of your config */
//     return (
//         <View>
//           <Text>This is some Text on the Settings page</Text>
//         </View>
//     );
//   }
// }
