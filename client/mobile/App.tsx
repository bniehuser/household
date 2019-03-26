import App from "./src/App";
export default App;
// import React from "react";
// import { TouchableOpacity, View, ImageBackground } from "react-native";
// import { RNCamera as Camera, TrackedTextFeature } from "react-native-camera";
// // @ts-ignore-next-line
// import RNTextDetector from "react-native-text-detector";
//
// import style, { screenHeight, screenWidth } from "./src/styles";
//
// const PICTURE_OPTIONS = {
//     quality: 1,
//     fixOrientation: false,
//     forceUpOrientation: false
// };
//
// interface IProps {}
//
// interface IState {
//     loading: boolean;
//     image: string|null;
//     error: string|null;
//     visionResp: any[];
// }
//
// export default class App extends React.Component<IProps, IState> {
//
//     camera?: Camera;
//
//     constructor(props: IProps) {
//         super(props);
//         this.state = {
//             loading: false,
//             image: null,
//             error: null,
//             visionResp: []
//         };
//     }
//
//     /**
//      * reset
//      *
//      * Handles error situation at any stage of the process
//      *
//      * @param {string} [error="OTHER"]
//      * @memberof App
//      */
//     reset(error:string = "OTHER") {
//         this.setState(
//             {
//                 loading: false,
//                 image: null,
//                 error
//             },
//             () => {
//                 // setTimeout(() => this.camera.startPreview(), 500);
//             }
//         );
//     }
//
//     /**
//      * takePicture
//      *
//      * Responsible for getting image from react native camera and
//      * starting image processing.
//      *
//      * @param {*} camera
//      * @author Zain Sajjad
//      */
//     takePicture = async (camera: Camera) => {
//         this.setState({
//             loading: true
//         });
//         try {
//             const data = await camera.takePictureAsync(PICTURE_OPTIONS);
//             if (!data.uri) {
//                 throw "OTHER";
//             }
//             this.setState(
//                 {
//                     image: data.uri
//                 },
//                 () => {
//                     console.log(data.uri);
//                     this.processImage(data.uri, {
//                         height: data.height,
//                         width: data.width
//                     });
//                 }
//             );
//         } catch (e) {
//             console.warn(e);
//             this.reset(e);
//         }
//     };
//
//     /**
//      * processImage
//      *
//      * Responsible for getting image from react native camera and
//      * starting image processing.
//      *
//      * @param {string} uri              Path for the image to be processed
//      * @param {object} imageProperties  Other properties of image to be processed
//      * @memberof App
//      * @author Zain Sajjad
//      */
//     processImage = async (uri: string, imageProperties: any): Promise<void> => {
//         const visionResp = await RNTextDetector.detectFromUri(uri);
//         console.log(visionResp);
//         if (!(visionResp && visionResp.length > 0)) {
//             console.warn("No Text Matched...");
//             this.reset("UNMATCHED");
//         }
//         this.setState({
//             visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
//         });
//     };
//
//     /**
//      * mapVisionRespToScreen
//      *
//      * Converts RNTextDetectors response in representable form for
//      * device's screen in accordance with the dimensions of image
//      * used to processing.
//      *
//      * @param {array}  visionResp       Response from RNTextDetector
//      * @param {object} imageProperties  Other properties of image to be processed
//      * @memberof App
//      */
//     mapVisionRespToScreen = (visionResp: any[], imageProperties: any) => {
//         const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
//         const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;
//
//         return visionResp.map(item => {
//             return {
//                 ...item,
//                 position: {
//                     width: item.bounding.width * IMAGE_TO_SCREEN_X,
//                     left: item.bounding.left * IMAGE_TO_SCREEN_X,
//                     height: item.bounding.height * IMAGE_TO_SCREEN_Y,
//                     top: item.bounding.top * IMAGE_TO_SCREEN_Y
//                 }
//             };
//         });
//     };
//
//     /**
//      * React Native render function
//      *
//      * @returns ReactNode or null
//      * @memberof App
//      */
//     render() {
//         return (
//             <View style={style.screen}>
//                 {!this.state.image ? (
//                     <Camera
//                         ref={(cam: Camera) => {
//                             this.camera = cam;
//                         }}
//                         key="camera"
//                         style={style.camera}
//                         playSoundOnCapture
//                         onTextRecognized={({ textBlocks}) => console.log(textBlocks.map(b => b.value))}
//                     >
//                         {({ camera, status }) => {
//                             if (status !== "READY") {
//                                 return null;
//                             }
//                             return (
//                                 <View style={style.buttonContainer}>
//                                     <TouchableOpacity
//                                         onPress={() => this.takePicture(camera)}
//                                         style={style.button}
//                                     />
//                                 </View>
//                             );
//                         }}
//                     </Camera>
//                 ) : null}
//                 {this.state.image ? (
//                     <ImageBackground
//                         source={{ uri: this.state.image }}
//                         style={style.imageBackground}
//                         key="image"
//                         resizeMode="cover"
//                     >
//                         {this.state.visionResp.map(item => {
//                             return (
//                                 <TouchableOpacity
//                                     style={[style.boundingRect, item.position]}
//                                     key={item.text}
//                                 />
//                             );
//                         })}
//                     </ImageBackground>
//                 ) : null}
//             </View>
//         );
//     }
// }