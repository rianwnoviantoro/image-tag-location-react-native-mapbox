import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import React from "react";
import SvgQRCode from "react-native-qrcode-svg";

import Axios from "../hooks/axios";
import { KEY, MAPBOX_PLACE, GMAP } from "../configs/constant";

export default function Watermark({ location }) {
  const { response, error, isLoading } = Axios({
    endpoint: `${MAPBOX_PLACE}/${location.longitude},${location.latitude}.json?access_token=${KEY}`,
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrCode}>
        <SvgQRCode
          value={`${GMAP + location.latitude},${location.longitude}`}
          size={50}
          backgroundColor="#FFFFFF"
        />
      </View>
      <View>
        <Text style={{ color: "#FFFFFF", fontWeight: 700 }}>
          {response && response.features[0].context[3].text},{" "}
          {response && response.features[0].context[4].text},{" "}
          {response && response.features[0].context[5].text}
        </Text>
        <Text style={{ color: "#FFFFFF", fontWeight: 700 }}>
          {response && response.features[0].context[0].text},{" "}
          {response && response.features[0].context[2].text}
        </Text>
        <Text style={{ color: "#FFFFFF", fontWeight: 700 }}>
          Lat: {location && location.latitude}, Long:{" "}
          {location && location.longitude}
        </Text>
        <Text style={{ color: "#FFFFFF", fontWeight: 700 }}>
          {format(new Date(), "yyyy-MM-dd HH:mm")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 10,
    backgroundColor: "rgba(186, 186, 186, 0.48)",
    padding: 5,
    gap: 10,
  },
  qrCode: { padding: 5, backgroundColor: "#FFFFFF", borderRadius: 5 },
});
