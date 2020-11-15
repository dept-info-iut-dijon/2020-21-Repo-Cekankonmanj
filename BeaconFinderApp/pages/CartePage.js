import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import MapView, {Marker, Circle, Overlay} from 'react-native-maps';

import mapStyleDark from './mapStyleDark.json';

const CartePage = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.container}>

          <MapView
             initialRegion={{
               latitude: 47.3109789,
               longitude: 5.0682459,
               latitudeDelta: 0.0022,
               longitudeDelta: 0.0022,
             }}

             //showsUserLocation
             showsIndoorLevelPicker={false}
             loadingEnabled

             showsMyLocationButton
             showsUserLocation

             //showsBuildings={false}
             //showsIndoors={false}
             pitchEnabled={false}
             provider="google"

             customMapStyle={mapStyleDark}

             style={styles.map}
           />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
  },
  footerHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CartePage;
