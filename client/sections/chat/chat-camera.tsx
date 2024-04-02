import { Camera, CameraType } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native';
import { Button, IconButton, Modal, Portal, Text } from 'react-native-paper';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as modelWeights from '../../assets/item.bin'

const modelJSON = require('../../assets/model.json');

interface CC {
    open: boolean;
    closeCamera: () => void;
}

const ChatCamera = ({ closeCamera, open }: CC) => {

    const [camType, setCamType] = useState<CameraType>(CameraType.back);
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [predictions, setPredictions] = useState<any[]>([]);

    const cameraRef = useRef<any>(null);
    const modelRef = useRef<any>(null);

    const flipCamera = () => {
        if (camType === CameraType.back) setCamType(CameraType.front);
        else if (camType === CameraType.front) setCamType(CameraType.back);
    }

    const detectObjects = async () => {
        if (!cameraReady || !modelRef.current) return;
        const imageTensor = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.8 });
        // Preprocess the image as needed (resize, normalize, etc.)
        // const preprocessedImage = preprocessImage(imageTensor);
        // Perform inference using your custom model
        const predictions = await modelRef.current.predict(imageTensor);
        // Process predictions and update state
        console.log(predictions);
        setPredictions(predictions);
    
        setTimeout(() => {
          detectObjects();
        }, 1000); // Adjust the interval as needed for real-time performance
      };

    const loadModel = async () => {
        try {
            // await tf.ready();
            // const model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights));
            // console.log(model);
            // return model;
        } catch (err: any) {
            console.error('Error:', err?.message || err);
        }
    }

    const takePicture = async () => {

    }

    useEffect(() => {
        loadModel();
    }, [])

  return (
    <Portal>
        <Modal visible={open} onDismiss={closeCamera} contentContainerStyle={{ backgroundColor: '#fff', flex: 1 }}>
            <Camera 
                ref={cameraRef} 
                type={camType} 
                style={{ flex: 1 }} 
                onCameraReady={() => { setCameraReady(true) }}
            />
            <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <Button mode='contained-tonal' onPress={closeCamera}>Close</Button>
                <IconButton
                    icon='checkbox-blank-circle'
                    size={50}
                    onPress={takePicture}
                    mode='contained'
                />
                <IconButton
                    icon='camera-flip'
                    onPress={flipCamera}
                    mode='contained'
                />
            </View>
        </Modal>
    </Portal>
  )
}

export default ChatCamera