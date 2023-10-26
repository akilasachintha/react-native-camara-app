import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {Camera, getCameraPermissionsAsync, requestCameraPermissionsAsync} from 'expo-camera';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';

export default function HomeScreen() {
    const cameraRef = useRef<Camera | null>(null);
    const [focusDepth, setFocusDepth] = useState(0.5);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [model, setModel] = useState(null);

    // Load the COCO-SSD model
    useEffect(() => {
        const loadModel = async () => {
            await tf.ready(); // Make sure TensorFlow.js is ready
            const model = await cocoSsd.load();
            setModel(model);
        };

        loadModel();
    }, []);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const { status } = await getCameraPermissionsAsync();
            if (status !== 'granted') {
                const { status } = await requestCameraPermissionsAsync();
                setIsCameraReady(status === 'granted');
            } else {
                setIsCameraReady(true);
            }
        };

        requestCameraPermission().catch((error) => console.log(error));
    }, []);

    const takePictureAndUpload = async () => {
        console.log('takePictureAndUpload');
        if (cameraRef.current && model) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);

            // Convert base64 image to array buffer
            const imageBuffer = tf.util.encodeString(data.base64 || '', 'base64').buffer;
            // Decode jpeg image to tensor
            const raw = new Uint8Array(imageBuffer);
            const imageTensor = decodeJpeg(raw);

            // Run object detection on the captured image
            const predictions = await model.detect(imageTensor);

            // Now you have the predictions
            // You can draw bounding boxes on your view based on these predictions

            let photo = {
                uri: data.uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };

            let formData = new FormData();
            // @ts-ignore
            formData.append('photo', photo);

            axios.post('http://your-api-url.com', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => console.log(response.data))
                .catch(error => console.log(error));
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 1 }}
                ref={cameraRef}
                focusDepth={focusDepth}
                onCameraReady={() => setIsCameraReady(true)}
            />
            <View style={styles.captureButtonContainer}>
                <TouchableOpacity onPress={takePictureAndUpload} disabled={!isCameraReady}>
                    <View style={styles.captureButton} />
                </TouchableOpacity>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    step={0.1}
                    value={focusDepth}
                    onValueChange={(value) => setFocusDepth(value)}
                />
            </View>
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
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
