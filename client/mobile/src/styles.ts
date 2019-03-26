/**
 *
 * Styles for CameraRedemption Screen
 *
 */

import { StyleSheet } from 'react-native';

import Colors from "./theme/Colors";
import Dimensions from "./theme/Dimensions";
export const screenHeight = Dimensions.screenHeight;
export const screenWidth = Dimensions.screenWidth;
const styles = StyleSheet.create({
    screen: {
        backgroundColor: Colors.black,
        flex: 1
    },
    camera: {
        position: "absolute",
        width: Dimensions.screenWidth/3,
        height: Dimensions.screenHeight,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        flex: 1
    },
    leftHalf: {
        width: Dimensions.screenWidth/3,
        height: Dimensions.screenHeight,
        alignItems: "center",
        alignSelf: "flex-start",
        justifyContent: "center",
        flex: 1,
    },
    rightHalf: {
        width: Dimensions.screenWidth/3,
        height: Dimensions.screenHeight,
        alignItems: "center",
        alignSelf: "flex-end",
        justifyContent: "center",
        flex: 1,
        backgroundColor: 'white',
        color: 'black'
    },
    imageBackground: {
        position: "absolute",
        width: Dimensions.screenWidth,
        height: Dimensions.screenHeight,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        top: 0,
        left: 0
    },
    buttonContainer: {
        width: 70,
        height: 70,
        backgroundColor: Colors.white,
        borderRadius: 35,
        position: "absolute",
        bottom: 36,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    button: {
        width: 64,
        height: 64,
        backgroundColor: Colors.white,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: Colors.black
    },
    boundingRect: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FF6600"
    }
});

export default styles;