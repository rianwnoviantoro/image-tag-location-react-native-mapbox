import { View, Text } from "react-native";
import React from "react";
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoicmlhbndub3ZpYW50b3JvIiwiYSI6ImNsZDFjejJ0bzA1eXozcHJ2NDE4cmlhdG4ifQ.BQ8Jo5D0-bwPJeqJ11F5ww"
);

export default function Map({ location }) {
  return (
    <>
      {location && (
        <View style={{ flex: 1 }}>
          <Mapbox.MapView
            style={{ flex: 1 }}
            styleURL={Mapbox.StyleURL.Street}
            scaleBarEnabled={false}
          >
            <Mapbox.Camera
              zoomLevel={15}
              centerCoordinate={[location.longitude, location.latitude]}
              animationMode="flyTo"
              animationDuration={5000}
            />
            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[location.longitude, location.latitude]}
              title="Your location"
            />
          </Mapbox.MapView>
        </View>
      )}
    </>
  );
}
