import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

import { Camera } from "expo-camera";
import { LOADING_TAKE_PICTURE } from "../configs/constant";

const Photo = ({
  toggle,
  location,
  statusBar,
  setHasPhoto,
  setOpenMap,
  setLocation,
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(Camera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isSaving, setIsSaving] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
      statusBar("light");
      setLocation(location);
    })();
  }, [hasPermission]);

  const toggleFlash = () => {
    setFlashOn(
      flashOn === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const toggleFlipCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsSaving(true);
        const photo = await cameraRef.current.takePictureAsync();
        setHasPhoto(photo);
        setIsSaving(false);
        setOpenMap((prev) => !prev);
        toggle((prev) => !prev);
      } catch (error) {
        console.log("Error taking picture:", error);
        setIsSaving(false);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {hasPermission === null ? (
        <Text>Requesting Camera Permission</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <>
          <View
            style={{
              backgroundColor: "#141414",
              paddingTop: 40,
              paddingBottom: 10,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={() => toggle((prev) => !prev)}>
              <Ionicons name="md-close" size={26} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash}>
              <Ionicons
                name="flash-sharp"
                size={26}
                color={flashOn ? "#FFD700" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>
          <Camera
            style={{ aspectRatio: 9 / 16 }}
            ratio="16:9"
            type={cameraType}
            ref={cameraRef}
          >
            {/* Camera view and controls will be added here */}
          </Camera>
          <View
            style={{
              position: "absolute",
              backgroundColor: "#141414",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={() => toggle((prev) => !prev)}>
                  <Ionicons name="md-close" size={26} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Spinner
                  visible={isSaving}
                  textContent={LOADING_TAKE_PICTURE}
                  textStyle={{ color: "white" }}
                />
                <TouchableOpacity
                  style={{
                    width: 75,
                    height: 75,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 45,
                    borderWidth: 10,
                    borderColor: "#75A1E3",
                  }}
                  onPress={takePicture}
                ></TouchableOpacity>
              </View>
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={toggleFlipCamera}>
                  <AntDesign name="retweet" size={26} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Photo;
