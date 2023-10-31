import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
    AutoFocus,
    Camera,
    CameraType,
    FlashMode,
    getCameraPermissionsAsync,
    requestCameraPermissionsAsync
} from 'expo-camera';
import {useAuthContext} from "@context/AuthContext";
import {BASE_URL, createAxiosInstance} from "@config/axiosConfig";
import * as MediaLibrary from 'expo-media-library';
import {useToast} from "@context/ToastContext";
import {useLoadingContext} from "@context/LoadingContext";
import {THEME} from "@theme/theme";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {Entypo, Ionicons} from '@expo/vector-icons';
import * as Location from 'expo-location';

export default function HomeScreen() {
    const cameraRef = useRef<Camera | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isTipToFollow, setIsTipToFollow] = useState(true);
    const [instructions, setInstructions] = useState([]);
    const authContext = useAuthContext();
    const axiosInstance = createAxiosInstance(authContext, BASE_URL.ECO_PAINT);
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = useState(FlashMode.off);
    const [autoFocus, setAutoFocus] = useState(AutoFocus.auto);

    const [location, setLocation] = useState<Location.LocationObject>({
        coords: {
            latitude: 0,
            longitude: 0
        }
    } as Location.LocationObject);
    const {showToast} = useToast();
    const {hideLoading} = useLoadingContext();
    const navigation = useNavigation();

    const requestCameraPermission = async () => {
        const {status: camaraStatus} = await Camera.getCameraPermissionsAsync();
        const {status: mediaStatus} = await MediaLibrary.getPermissionsAsync();
        const {status: locationStatus} = await Location.getBackgroundPermissionsAsync();

        if (camaraStatus !== 'granted') {
            const {status} = await Camera.requestCameraPermissionsAsync();

            setIsCameraReady(status === 'granted');
        } else {
            setIsCameraReady(true);
        }

        if (locationStatus !== 'granted') {
            await Location.requestBackgroundPermissionsAsync();
        }

        if (mediaStatus !== 'granted') {
            await MediaLibrary.requestPermissionsAsync();
        }
    };

    const toggleFlashMode = () => {
        setFlashMode(
            flashMode === FlashMode.off
                ? FlashMode.torch
                : FlashMode.off
        );
    };

    const toggleAutoFocus = () => {
        setAutoFocus(
            autoFocus === AutoFocus.on
                ? AutoFocus.off
                : AutoFocus.on
        );
    };

    const takePictureAndUpload = async () => {
        console.log('takePictureAndUpload');
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);

            let photo = {
                uri: data.uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };

            const asset = await MediaLibrary.createAssetAsync(data.uri);

            if (!asset) {
                throw new Error('Could not create asset');
            }

            const album = await MediaLibrary.getAlbumAsync("Eco Print");

            if (album) {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            } else {
                await MediaLibrary.createAlbumAsync("Eco Print", asset, false);
            }

            let formData = new FormData();

            // @ts-ignore
            formData.append('image', photo);
            formData.append('longitude', location.coords.longitude.toString());
            formData.append('latitude', location.coords.latitude.toString());

            axiosInstance.post('upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response: any) => {
                    console.log(response.data);
                    showToast('Image uploaded successfully');

                    const confidence = response && response.data && response.data.Confidence;
                    const prediction = response && response.data && response.data.predicted_type;
                    const week = response && response.data && response.data.Week;
                    const videos = response && response.data && response.data.videos;
                    const images = response && response.data && response.data.sample_images;

                    if (confidence && prediction && week && videos && images) {
                        // @ts-ignore
                        navigation.replace('Prediction', {image: data.uri, confidence, prediction, week, videos, images});
                    } else {
                        showToast('Error getting prediction');
                    }

                    if (response && response.data && response.data.predicted_type === 'Unknown') {
                        // @ts-ignore
                        navigation.replace('SubmitPlant', {
                            image: data.uri,
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        });
                    }

                    hideLoading();
                })
                .catch(error => console.log(error));
        }
    };

    const getInstructions = async () => {
        try {
            const response = await axiosInstance.get('/instructions');

            if (response.status === 200) {
                const result = response && response.data && response.data.instructions;
                setInstructions(result);
                hideLoading();
            } else {
                showToast('Error getting instructions');
                hideLoading();
            }
        } catch (e) {
            console.error(e);
            showToast('Error getting instructions');
        }
    }

    useFocusEffect(
        useCallback(() => {
            requestCameraPermission().catch((error) => console.log(error));

            getInstructions().catch((e) => console.error(e));

            setIsTipToFollow(true);

            if (cameraRef.current) {
                cameraRef.current.resumePreview();
            }

            return () => {
                if (cameraRef.current) {
                    cameraRef.current.pausePreview();
                }
            };
        }, [])
    );

    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.resumePreview();
        }

        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location);
        })();

    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={{flex: 1}}>
                <Camera
                    style={{flex: 1}}
                    type={type}
                    flashMode={flashMode}
                    autoFocus={autoFocus}
                    ref={cameraRef}
                >
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        marginTop: 50,
                        paddingHorizontal: 20,
                    }}>
                        <TouchableOpacity onPress={toggleAutoFocus}>
                            <Ionicons name="ios-aperture-outline" size={32} color="white"/>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
            {
                !isTipToFollow && (
                    <View
                        style={{
                            position: "absolute",
                            justifyContent: "flex-start",
                            borderColor: 'rgba(255,255,255,0.8)',
                            borderWidth: 3,
                            top: "20%",
                            height: "50%",
                            width: 320,
                            left: '50%',
                            marginLeft: -160,
                            padding: 20,
                            borderRadius: 30
                        }}/>
                )
            }
            {
                isTipToFollow && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            position: "absolute",
                            justifyContent: "flex-start",
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            borderWidth: 3,
                            top: "10%",
                            height: "50%",
                            width: 320,
                            left: '50%',
                            marginLeft: -160,
                            padding: 20,
                            borderRadius: 30
                        }}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between",}}>
                            <Text style={{fontSize: 20, fontWeight: "bold"}}>Tips to follow</Text>
                            <TouchableOpacity
                                onPress={() => setIsTipToFollow(false)}
                                style={{backgroundColor: THEME.COLORS.primary, padding: 10, borderRadius: 10}}
                            >
                                <Entypo name="cross" size={24} color="black"/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {
                                instructions && instructions.map((instruction: any, index: number) => (
                                    <View key={index} style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: 10,
                                        paddingRight: 20
                                    }}>
                                        <View style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 15,
                                            backgroundColor: THEME.COLORS.primary,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <Text style={{
                                                color: THEME.COLORS.white,
                                                fontSize: 20,
                                                fontWeight: "bold"
                                            }}>{index + 1}</Text>
                                        </View>
                                        <Text style={{fontSize: 16, marginLeft: 10}}>{instruction.instruction.toString()}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </TouchableOpacity>
                )
            }

            <View style={styles.captureButtonContainer}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <TouchableOpacity onPress={() => setType(
                        type === CameraType.back
                            ? CameraType.front
                            : CameraType.back
                    )}>
                        <Ionicons name="camera-reverse-outline" size={32} color="black"/>
                    </TouchableOpacity>
                    <View style={styles.border}>
                        <TouchableOpacity onPress={takePictureAndUpload}>
                            <View style={styles.captureButton}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={toggleFlashMode}>
                        <Ionicons name="flash-outline" size={32} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>
            <StatusBar style="light"/>
        </View>
    );
}

const styles = StyleSheet.create({
    captureButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 20,
        backgroundColor: THEME.COLORS.white,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: THEME.COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    border: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        marginHorizontal: 60,
        borderColor: THEME.COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
