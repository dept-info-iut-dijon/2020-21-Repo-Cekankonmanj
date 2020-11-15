import * as React from 'react';
import {Component} from 'react';
import { Appearance } from 'react-native'

import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import MapView, {Marker, Circle, Overlay} from 'react-native-maps';

import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';

import beaconsDATA from '../list.json';

var CartePageHandler;

class CartePage extends Component {
  constructor() {
    super();
    CartePageHandler = this;
    this.state = {
      beacons:[]
    }
  }
  render() {
    let beaconsList = this.state.beacons.map((marker, index) => {
     return <Circle key={index} radius={marker.radius} fillColor={marker.color} center={{
        latitude: marker.latlng.latitude,
        longitude: marker.latlng.longitude,
     }}/>
    })
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

             customMapStyle={(Appearance.getColorScheme()==="dark" ? mapStyleDark : mapStyleLight)}

             style={styles.map}
           >
           {beaconsList}
           </MapView>
        </View>
      </View>
    </SafeAreaView>
    )
  }
};

export function updateMapBeacons(bs){
  beacons = [];
  for(b in bs){
    beacon = bs[b];
    for (let beaconDATA of beaconsDATA) {
      if(beaconDATA[0]==beacon.major && beaconDATA[1]==beacon.minor){
         if(beaconDATA[6]==0){
           c = "#f00";
         }else if(beaconDATA[6]==1){
           c = "#faa";
         }else if(beaconDATA[6]==2){
           c = "#fee";
         }else{
           c = "#000";
         }
         var rad = 1/(beacon.rssi*(-1)/100)/1.25;
         if(rad=="-Infinity")
            rad = 0.1;
         beacons.push({color:c, radius:rad,latlng:{latitude:beaconDATA[3], longitude:beaconDATA[4]}});
      }
    }
  }
  CartePageHandler.setState({beacons:beacons});
}

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
