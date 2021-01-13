import * as React from 'react';
import {Component} from 'react';
import { Appearance } from 'react-native'

import { SafeAreaView, StyleSheet, View, Text } from 'react-native';

import MapView, {Marker, Circle, Overlay, Polygon} from 'react-native-maps';

import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';

import beaconsDATA from '../list.json';

var CartePageHandler;

var getUserPosition = () => {return {latitude: 0, longitude: 0}};
var getServer = () => {return null};
var getDataManager = () => {return null};

export function setGetterUserPosition(func){
  getUserPosition = func;
}

export function setGetterServer(func){
  getServer = func;
}

export function setGetterData(func){
  getDataManager = func;
}

export function onPositionChange(){
  if(CartePageHandler!=undefined)
    CartePageHandler.setState({userPosition: getUserPosition()})
}

export function onColorUserChange(color){
  if(CartePageHandler!=undefined)
    CartePageHandler.setState({userColor: color})
}

export function onShowBeaconsChange(value){
  if(CartePageHandler!=undefined)
    CartePageHandler.setState({showBeaconsOnMap: value})
}

export function onSatelliteModeChange(value){
  if(CartePageHandler!=undefined)
    CartePageHandler.setState({satelliteMode: value})
}

class CartePage extends Component {
  constructor() {
    super();
    CartePageHandler = this;
    this.state = {
      beacons:[],
      userPosition: {latitude: 0, longitude: 0},
      userColor: "#fff",
      showBeaconsOnMap: true,
      satelliteMode: false,
    }
    this.Data = getDataManager();

    this.Data.getData("@color", "#ff00ff").then((value) => {
      this.state.userColor = value;
    })

    this.Data.getData("@showBeaconsOnMap", "true").then((value) => {
      this.state.showBeaconsOnMap = (value=="true");
    })

    this.Data.getData("@satelliteMode", "false").then((value) => {
      this.state.satelliteMode = (value=="true");
    })
  }
  render() {
    var circleUser = React.createRef();
    var server = getServer();

    let beaconsList = this.state.beacons.map((marker, index) => {
          return <Polygon key={index} radius={marker.radius} zIndex={10000000} fillColor={marker.color} strokeWidth={1.5} coordinates={[
                    {latitude: marker.latlng.latitude-0.000017,
                    longitude: marker.latlng.longitude},
                    {latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude+0.000017},
                    {latitude: marker.latlng.latitude+0.000017,
                    longitude: marker.latlng.longitude},
                    {latitude: marker.latlng.latitude,
                    longitude: marker.latlng.longitude-0.000017}
                  ]}
          /> })

    let usersList = Object.keys(server.users).map((user, index) => {
          var circle = React.createRef();
          return <Circle
                    fillColor={server.users[user].color}
                    key={index*1500} zIndex={index*1500+2000}
                    radius={2}
                    ref={circle}
                    center={{latitude: server.users[user].latitude,longitude: server.users[user].longitude}}
                    onLayout={()=>{circle.current.setNativeProps({ fillColor: server.users[user].color })}}
                  />
          })

    return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1}}>
        { server.ws.readyState == 0 ?
          <View style={{height:40, backgroundColor: '#7f7', justifyContent: 'center', alignItems: 'center'}}>
            <Text>Connexion au serveur...</Text>
          </View>
        : <></> }
        { server.ws.readyState == 3 ?
          <View style={{height:40, backgroundColor: '#f77', justifyContent: 'center', alignItems: 'center'}}>
            <Text>Déconnecté du serveur, nouvelle tentative dans 5 secondes..</Text>
          </View>
        : <></> }
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

             //showsMyLocationButton
             //showsUserLocation

             showsBuildings={false}
             showsIndoors={false}
             pitchEnabled={false}
             provider="google"
             mapType={this.state.satelliteMode ? "satellite" : undefined}

             customMapStyle={(Appearance.getColorScheme()==="dark" ? mapStyleDark : mapStyleLight)}

             style={styles.map}
             onMapReady={() => {console.log("onMapReady"); circleUser.current.setNativeProps({ fillColor: this.state.userColor })}}

             onPress={event => {
                                    lat = event.nativeEvent.coordinate.latitude;
                                    lon = event.nativeEvent.coordinate.longitude;
                                    Object.keys(server.users).map((user, index) => {
                                          lat2 = server.users[user].latitude;
                                          lon2 = server.users[user].longitude;
                                          if((calcCrow(lat, lon, lat2, lon2)*100)<1){
                                            alert("C'est " + server.users[user].name + "!")
                                          }
                                    });
                                }
                      }
           >
             <Overlay
               bounds={[[47.311501, 5.067575], [47.310468, 5.069191]]}
               image={require('../images/Etage1.png')}
               zindex={0}
             />
             {this.state.showBeaconsOnMap ? beaconsList : <></>}
             {usersList}
             <Circle key={1000} radius={1.5} ref={circleUser} zIndex={2000} fillColor={this.state.userColor} center={{
                latitude: this.state.userPosition.latitude,
                longitude: this.state.userPosition.longitude,
             }}
             />
           </MapView>
        </View>
      </View>
    </View>
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
           c = "#fff";
         }else if(beaconDATA[6]==1){
           c = "#aaa";
         }else if(beaconDATA[6]==2){
           c = "#666";
         }else{
           c = "#0f0";
         }
         var rad = beacon.rssi*(-1)/100;
         if(beacon.rssi == 0)
         {
            rad = 2;
            c = "#00f";
          }
         beacons.push({color:c, radius:rad,latlng:{latitude:beaconDATA[3], longitude:beaconDATA[4]}});
      }
    }
  }
  if(CartePageHandler!=undefined)
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

function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = (lat2-lat1) * Math.PI / 180;
  var dLon = (lon2-lon1) * Math.PI / 180;
  var lat1 = (lat1) * Math.PI / 180;
  var lat2 = (lat2) * Math.PI / 180;

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

export default CartePage;
