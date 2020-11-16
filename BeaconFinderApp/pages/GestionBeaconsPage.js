import * as React from 'react';
import {Component} from 'react';
import { SafeAreaView, StyleSheet, View, Text, Appearance, FlatList, Button } from 'react-native';
import MapView, {Marker, Circle, Overlay} from 'react-native-maps';

import { useTheme, useRoute } from '@react-navigation/native';

import mapStyleDark from './mapStyleDark.json';
import mapStyleLight from './mapStyleLight.json';

import beaconsDATA from '../list.json';
var etageImage = [require("../images/RDC.png"), require("../images/Etage1.png"), require("../images/Etage2.png")];

var GestionBeaconsPageHandler;

export class GestionBeaconsPageWrapper extends Component {
  constructor() {
    super();
    GestionBeaconsPageHandler = this;
    this.state = {
      beacons:[]
    }
    this.styles = {};
  }
  render() {
    const { theme } = this.props;
    colors = theme.colors
    this.styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'center',
        },
        beaconItem:{
          flex: 1,
          flexDirection: 'column',
          padding: 3,
          margin: 7,
          marginBottom: 0,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1.5,
          borderRadius:10,
        },
        beaconItemInfos: {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        beaconItemBar: {
          flex: 1,
          margin:2,
          marginTop: 4,
          borderRadius:10,
          backgroundColor: colors.border
        },
        beaconItemSignal: {
          flex: 1,
          alignItems: 'center',
          borderRadius:10,
          backgroundColor: colors.primary,
          height: 10,
        },
        beaconMap: {
          height:80,
          width:100,
          borderRadius:10,
          flex: 2,
        },
        beaconTexts:{
          flex: 4,
          alignItems: 'center',
        },
        beaconButtonSettings:{
          flex: 2,
          alignItems: 'center',
        },
        beaconText:{
          color: colors.text,
        },
        beaconTitle:{
          fontSize: 18,
          color: colors.text,
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
      });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <View style={this.styles.container}>
            <Text style={{
              color: colors.text,
              fontSize: 18,
              textAlign: 'center', }}>
              Nombre de beacons détectés : {this.state.beacons.length}
            </Text>
            <FlatList
              adata={this.state.beacons.sort(function(a,b) {
                              return a.major - b.major
                    }).sort(function(a,b) {
                                    return a.minor - b.minor
                          })}
              data={this.state.beacons.sort(function(a,b) {
                             return b.rssi - a.rssi
                    })}
              renderItem={generateListBeacon}
              keyExtractor={item => item.major + "_" + item.minor}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

export default function GestionBeaconsPage(props, prop) {
  const theme = useTheme();

  return <GestionBeaconsPageWrapper {...props} theme={theme} />;
}

export function updateBeacons(bs){
  if(GestionBeaconsPageHandler!=undefined)
    GestionBeaconsPageHandler.setState({beacons:bs})
}

function generateListBeacon({item}){
  var bData;
  var circle = React.createRef();
  var styles = GestionBeaconsPageHandler.styles;
  for (let beaconDATA of beaconsDATA)
    if(beaconDATA[0]==item.major && beaconDATA[1]==item.minor)
      bData = beaconDATA;
     return <View style={styles.beaconItem}>
         <View style={styles.beaconItemInfos}>
         {bData!=undefined ?
           <MapView
            initialRegion={{
              latitude: bData[3],
              longitude: bData[4],
              latitudeDelta: 0.0004,
              longitudeDelta: 0.0004,
            }}
            showsIndoorLevelPicker={false}
            loadingEnabled
            pitchEnabled={false}
            provider="google"
            liteMode={false}
            zoomEnabled={false}
            scrollEnabled={false}
            toolbarEnabled={false}
            showsBuildings={false}
            showsIndoors={false}

            customMapStyle={(Appearance.getColorScheme()==="dark" ? mapStyleDark : mapStyleLight)}
            style={styles.beaconMap}

            onMapReady={() => circle.current.setNativeProps({ fillColor: "rgba(255,0,0,0.7)" })}
          >
          <Overlay
            bounds={[[47.311501, 5.067575], [47.310468, 5.069191]]}
            image={etageImage[bData[6]]}
            zindex={0}
          />
          <Circle radius={3} ref={circle} zIndex={10} center={{
            latitude: bData[3],
            longitude: bData[4],
          }}/>
          </MapView>
        : <></>}
          <View style={styles.beaconTexts}>
            <Text style={styles.beaconTitle}>{bData!=undefined ? "Beacon détecté" : "Nouveau beacon"}</Text>
            <Text style={styles.beaconText}>Major : {item.major}</Text>
            <Text style={styles.beaconText}>Minor : {item.minor}</Text>
            {bData!=undefined ? <Text style={styles.beaconText}>Etage {bData[6]}</Text> : <></>}
          </View>
          <View style={styles.beaconButtonSettings}>
            <Button title={bData!=undefined ? "Modifier" : "Ajouter"} />
          </View>
        </View>
        <View style={styles.beaconItemBar}>
          <View style={[styles.beaconItemSignal, {width: (110-item.rssi*(-1)) +'%'}]}>
          </View>
        </View>
      </View>
}
