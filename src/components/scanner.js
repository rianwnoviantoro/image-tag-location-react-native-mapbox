import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as WebBrowser from "expo-web-browser";

const Scanner = ({ toggle, statusBar }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      statusBar("light");
    })();
  }, [hasPermission]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    openPopup(data);
  };

  const handleScanAgain = () => {
    setScanned((prev) => !prev);
  };

  const openPopup = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {hasPermission === null ? (
        <Text>Requesting Camera Permission</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ flex: 1 }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              paddingTop: 40,
              paddingBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity onPress={() => toggle((prev) => !prev)}>
              <Ionicons name="md-close" size={26} color="#FFF" />
            </TouchableOpacity>
          </View>
          {/* Camera view and controls will be added here */}
          <View
            style={{
              position: "absolute",
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
              ></View>
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={handleScanAgain}>
                  <Text style={{ color: "#FFF" }}>Tap to Scan Again</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "30%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              ></View>
            </View>
          </View>
        </BarCodeScanner>
      )}
    </View>
  );
};

export default Scanner;
