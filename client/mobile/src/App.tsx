import React from "react";
import { TouchableOpacity, View, Text, ImageBackground } from "react-native";
import { RNCamera as Camera, TrackedTextFeature } from "react-native-camera";
// @ts-ignore-next-line
import RNTextDetector from "react-native-text-detector";

import style, { screenHeight, screenWidth } from "./styles";
import { IReceipt, IReceiptItem } from './interface/receipt';
import Receipt from './components/Receipt';

const PICTURE_OPTIONS = {
    quality: 1,
    fixOrientation: false,
    forceUpOrientation: false
};

interface IProps {}

interface IState {
    loading: boolean;
    image: string|null;
    error: string|null;
    visionResp: any[];
    receipt?: IReceipt;
    capture: boolean;
}

interface IRNCameraRender {
    camera: Camera;
    status: string;
}

interface ITextRecognizedResponse {
    textBlocks: TrackedTextFeature[];
}

export default class App extends React.Component<IProps, IState> {

    camera?: Camera;

    constructor(props: IProps) {
        super(props);
        this.state = {
            loading: false,
            image: null,
            error: null,
            visionResp: [],
            capture: false,
        };
    }

    /**
     * reset
     *
     * Handles error situation at any stage of the process
     *
     * @param {string} [error="OTHER"]
     * @memberof App
     */
    reset(error:string = "OTHER") {
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
    takePicture = async (camera: Camera) => {
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
    processImage = async (uri: string, imageProperties: any): Promise<void> => {
        const visionResp = await RNTextDetector.detectFromUri(uri);
        console.log(visionResp);
        if (!(visionResp && visionResp.length > 0)) {
            console.warn("No Text Matched...");
            this.reset("UNMATCHED");
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
    mapVisionRespToScreen = (visionResp: any[], imageProperties: any) => {
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

    processRecognizedText(textBlocks: TrackedTextFeature[]) {
        console.log(textBlocks.map(b => b.value));
        let receipt = this.state.receipt;
        if(receipt === undefined) {
            receipt = { location: 'unknown', name: '', info: '', total: 0, items: [] };
        }
        // blocks to line entries
        const bits = textBlocks.reduce((a: Array<TrackedTextFeature & IMarking>, c: TrackedTextFeature) => a.concat(c.components), []);
        const bitHeights = bits.reduce((a, c) => {a.push(c.bounds.size.height); return a; },[] as number[]);
        const avgBitHeight = bitHeights.reduce((a, c) => a + c, 0) / bitHeights.length;
        let lines: Array<TrackedTextFeature & IMarking>[] = [];
        bits.forEach(testBit => {
            if(!testBit.found) {
                testBit.found = true;
                const testY = testBit.bounds.origin.y;
                const line = [testBit];
                bits.forEach(matchBit => {
                    if(!matchBit.found && Math.abs(matchBit.bounds.origin.y - testY) < avgBitHeight/2) {
                        matchBit.found = true;
                        line.push(matchBit);
                    }

                });
                lines.push(line);
            }
        });
        let currentItem: IReceiptItem|undefined;
        lines.sort((a, b) => a[0].bounds.origin.y - b[0].bounds.origin.y).forEach(l => {
            if(!receipt) { throw "SOMEHOW, NO RECEIPT"; }
            const fields = l.sort((a, b) => a.bounds.origin.x - b.bounds.origin.x);
            let m = fields[fields.length-1].value.match(/([0-9]*\.[0-9]{2})/);
            if(m) {
                currentItem = { text: fields.map(f => f.value.replace(/^([ *#~!]?)(.+?)([ *#~!])?$/, "$2")).join('~~'), total: parseFloat(m[1]) };
                if(currentItem.text.match(/(TOTAL|AMOUNT) ?(DUE)?/i)) {
                    receipt = { ...receipt, total: currentItem.total };
                } else {
                    const foundItem = receipt.items.find(i => currentItem ? i.text === currentItem.text : false);
                    if(!foundItem) {
                        receipt = {...receipt, items: [...receipt.items, currentItem] };
                    } else {
                        currentItem = foundItem;
                    }
                }
            } else {
                // probably just an informational line.  if it's really big text let's try to use it as a name
                if(fields.length === 1) {
                    if(fields[0].bounds.size.height > avgBitHeight*1.25) {
                        receipt = { ...receipt, name: fields[0].value, location: fields[0].value};
                    } else {
                        receipt = { ...receipt, info: receipt.info + fields[0].value + "\n" };
                    }
                } else {
                    // line with multiple bits of info; do nothing for now
                }
            }
        });
        // probably SLOW AS HELL
        console.log('new receipt should be', receipt);
        this.setState({receipt});

    }

    /**
     * React Native render function
     *
     * @returns ReactNode or null
     * @memberof App
     */
    render() {
        return (
            <View style={[style.screen, {display:'flex',flexDirection:'row'}]}>
                {!this.state.image ? (
                    <>
                    <Camera
                        ref={(cam: Camera) => { this.camera = cam; }}
                        key="camera"
                        style={style.leftHalf}
                        playSoundOnCapture
                        onTextRecognized={({ textBlocks }: ITextRecognizedResponse) => this.state.capture && this.processRecognizedText(textBlocks)}
                    >
                        {({ camera, status }: IRNCameraRender) => {
                            if (status !== "READY") {
                                return null;
                            }
                            return (
                                <View style={style.buttonContainer}>
                                    <TouchableOpacity
                                        onPress={() => this.setState({capture: !this.state.capture})}
                                        style={[style.button, {backgroundColor:this.state.capture ? 'green' : 'white'}]}
                                    />
                                </View>
                            );
                        }}
                    </Camera>
                    {/*<View style={style.leftHalf}>*/}
                        {/*<Text>This is the left half -- let's see it</Text>*/}
                    {/*</View>*/}
                    <View style={style.rightHalf}>
                        {/*<Text>This is the right half -- no really</Text>*/}
                        {this.state.receipt && <Receipt receipt={this.state.receipt}/>}
                    </View>
                    </>
                ) : null}
                {this.state.image ? (
                    <ImageBackground
                        source={{ uri: this.state.image }}
                        style={style.imageBackground}
                        key="image"
                        resizeMode="cover"
                    >
                        {this.state.visionResp.map(item => {
                            return (
                                <TouchableOpacity
                                    style={[style.boundingRect, item.position]}
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

interface IMarking {
    found?: boolean;
}