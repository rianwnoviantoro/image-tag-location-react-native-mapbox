import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import React from "react";

export default function BottomSide({
  updateLocation,
  scannerToggle,
  cameraToggle,
  pickImage,
  date,
  day,
  time,
  location,
}) {
  return (
    <View style={styles.bottomSide}>
      {/* Locate */}
      <View
        style={{
          position: "relative",
          alignSelf: "flex-end",
          justifyContent: "center",
          alignItems: "center",
          width: 45,
          height: 45,
          borderRadius: 50,
          marginBottom: 10,
          backgroundColor: "#75A1E3",
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.19,
          shadowRadius: 5,
          elevation: 6,
        }}
      >
        <TouchableOpacity onPress={updateLocation}>
          <FontAwesome5 name="location-arrow" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      {/* Info */}
      <View
        style={{
          ...styles.menuContainer,
          marginBottom: 10,
        }}
      >
        <View style={styles.dateInfoContainer}>
          <Text style={{ fontSize: 20, fontWeight: 700, color: "#75A1E3" }}>
            {date}
          </Text>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Text style={{ color: "#B5B6B8" }}>{time}</Text>
            <Text style={{ color: "#B5B6B8", fontSize: 10 }}>{day}</Text>
          </View>
        </View>
        <View style={styles.mapInfoContainer}>
          <View style={styles.mapIcon}>
            <View>
              <Ionicons name="location-sharp" size={18} color="#75A1E3" />
            </View>
            <View>
              <View style={styles.mapCoords}>
                <Text style={{ color: "#B5B6B8" }}>Long</Text>
                <Text style={{ color: "#B5B6B8" }}>
                  {location && location.longitude}
                </Text>
              </View>
              <View style={styles.mapCoords}>
                <Text style={{ color: "#B5B6B8" }}>Lat</Text>
                <Text style={{ color: "#B5B6B8" }}>
                  {location && location.latitude}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* Menu */}
      <View style={{ ...styles.menuContainer, marginBottom: 10 }}>
        <TouchableOpacity style={styles.menuItem} onPress={scannerToggle}>
          <AntDesign name="qrcode" size={24} color="#75A1E3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItemCenter} onPress={cameraToggle}>
          <AntDesign name="camera" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={pickImage}>
          <FontAwesome name="folder" size={24} color="#75A1E3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSide: {
    position: "absolute",
    bottom: 10,
    right: 50,
    left: 50,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.19,
    shadowRadius: 5,
    elevation: 6,
  },
  menuItem: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
  },
  menuItemCenter: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#75A1E3",
    borderRadius: 18,
    padding: 10,
  },
  dateInfoContainer: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 0.5,
    borderColor: "rgba(186, 186, 186, 0.58)",
  },
  dateStyle: { fontSize: 20, fontWeight: 700, color: "#75A1E3" },
  mapInfoContainer: {
    width: "50%",
    alignItems: "center",
  },
  mapIcon: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  mapCoords: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
});
