import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { format, parseISO } from "date-fns";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import { Buffer } from "buffer";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Spinner from "react-native-loading-spinner-overlay";

import Photo from "./src/components/photo";
import Scanner from "./src/components/scanner";
import Map from "./src/components/map";
import Watermark from "./src/components/watermark";
import writeMetadata from "./src/utils/write-metadata";
import BottomSide from "./src/components/bottom-side";
import { LOADING_PROCESSING_IMAGE } from "./src/configs/constant";

export default function App() {
  const [currentDateTime, setCurrentDateTime] = useState(
    format(new Date(), "yyyy-MM-dd HH:mm:ss")
  );
  const [image, setImage] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(null);
  const [statusBar, setStatusBar] = useState("dark");
  const [openCamera, setOpenCamera] = useState(false);
  const [openScanner, setOpenScanner] = useState(false);
  const [openMap, setOpenMap] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [location, setLocation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const imageRef = useRef(null);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");

      let location = await Location.getCurrentPositionAsync();

      setLocation(location.coords);
    })();
  }, [hasPermission]);

  const cameraToggle = () => {
    setOpenMap((prev) => !prev);
    setOpenCamera((prev) => !prev);
  };

  const scannerToggle = () => {
    setOpenMap((prev) => !prev);
    setOpenScanner((prev) => !prev);
  };

  const updateLocation = async () => {
    let location = await Location.getCurrentPositionAsync();

    setLocation(location.coords);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result);
    }
  };

  const retakeImage = async () => {
    setHasPhoto(null);
    setOpenCamera((prev) => !prev);
  };

  const saveComponentAsImage = async () => {
    try {
      setIsSaving((prev) => !prev);

      const image = await captureRef(imageRef, {
        format: "jpg",
        height: hasPhoto.height,
        width: hasPhoto.width,
        quality: 1,
      });

      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const base64WithMetadata = await writeMetadata(base64, location);

      const imageBuffer = Buffer.from(base64WithMetadata, "binary").toString(
        "base64"
      );

      const filename =
        FileSystem.documentDirectory + `evidence-${Date.now()}.jpg`;

      await FileSystem.writeAsStringAsync(filename, imageBuffer, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(filename);

      if (uri) {
        ToastAndroid.show("Image saved to gallery!", ToastAndroid.SHORT);
        setStatusBar("dark");
        setHasPhoto(null);
        setOpenMap((prev) => !prev);
        setIsSaving((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const dateFormat = format(parseISO(currentDateTime), "dd MMMM yyyy");
  const time = format(parseISO(currentDateTime), "HH:mm");
  const day = format(parseISO(currentDateTime), "EEEE");

  return (
    <View style={{ flex: 1, backgroundColor: "#141414" }}>
      <StatusBar style={statusBar} />

      {openCamera ? (
        <Photo
          toggle={cameraToggle}
          location={location}
          statusBar={setStatusBar}
          setHasPhoto={setHasPhoto}
          setOpenMap={setOpenMap}
          setLocation={setLocation}
        />
      ) : openScanner ? (
        <Scanner toggle={scannerToggle} statusBar={setStatusBar} />
      ) : hasPhoto ? (
        <View style={{ flex: 1 }}>
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
            <TouchableOpacity
              onPress={() => {
                setHasPhoto(null);
                setOpenMap((prev) => !prev);
              }}
            >
              <Ionicons name="md-close" size={26} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Spinner
            visible={isSaving}
            textContent={LOADING_PROCESSING_IMAGE}
            textStyle={{ color: "white" }}
          />
          <View ref={imageRef} collapsable={false}>
            <Image
              style={{ aspectRatio: "9/16" }}
              source={{ uri: hasPhoto.uri }}
            />
            <Watermark location={location} />
          </View>
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
                paddingVertical: 25,
              }}
            >
              <TouchableOpacity
                onPress={retakeImage}
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 100,
                    backgroundColor: "#FFF",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <View>
                    <Ionicons name="reload" size={18} color="#B5B6B8" />
                  </View>
                  <View>
                    <Text style={{ color: "#B5B6B8" }}>Re-take</Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/*  */}
              <TouchableOpacity
                onPress={saveComponentAsImage}
                style={{
                  width: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 100,
                    backgroundColor: "#75A1E3",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <View>
                    <Entypo name="check" size={18} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={{ color: "#FFF" }}>Save</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Map location={location} />
      )}

      {openMap && (
        <BottomSide
          updateLocation={updateLocation}
          scannerToggle={scannerToggle}
          cameraToggle={cameraToggle}
          pickImage={pickImage}
          date={dateFormat}
          day={day}
          time={time}
          location={location}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
