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
      beacons:[],
      sortType: "identifiant",
      displayType: "scanned",
      displayFloor: -1,
      displaySettings: false
    }
    this.styles = {};
  }
  render() {
    const { theme } = this.props;
    colors = theme.colors
    this.styles = StyleSheet.create({
        container: {
          flex: 5,
          alignItems: 'stretch',
          justifyContent: 'center',
        },
        containerControl:{
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
          <View style={this.styles.containerControl}>

            <Text style={{color: colors.text,fontSize: 18,textAlign: 'center'}}>
              Nombre de beacons détectés : {this.state.beacons.length}
            </Text>

            <Button style={{color: colors.text,fontSize: 15,textAlign: 'center'}} title="Réglages" onPress={() => {this.setState({displaySettings: !this.state.displaySettings})}} />

            <View style={{alignItems: 'center', paddingTop: 10, display: (this.state.displaySettings ? 'flex' : 'none')}}>
                <Text style={{color: colors.text, fontSize: 16}}>Trier par</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Identifiant" disabled={this.state.sortType=="identifiant"} onPress={() => {this.setState({sortType: 'identifiant'})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Signal" disabled={this.state.sortType=="signal"} onPress={() => {this.setState({sortType: 'signal'})}} />
                    </View>
                </View>
            </View>

            <View style={{alignItems: 'center', paddingTop: 10, display: (this.state.displaySettings ? 'flex' : 'none')}}>
                <Text style={{color: colors.text, fontSize: 16}}>Affichage</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Scannés" disabled={this.state.displayType=="scanned"} onPress={() => {this.setState({displayType: 'scanned'})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Nouveaux" disabled={this.state.displayType=="new"} onPress={() => {this.setState({displayType: 'new'})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Hors-ligne" disabled={this.state.displayType=="offline"} onPress={() => {this.setState({displayType: 'offline'})}} />
                    </View>
                </View>
            </View>

            <View style={{alignItems: 'center', paddingTop: 10, display: (this.state.displayType=="new"||!this.state.displaySettings ? 'none' : 'flex')}}>
                <Text style={{color: colors.text, fontSize: 16}}>Etage</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="Tous" disabled={this.state.displayFloor==-1} onPress={() => {this.setState({displayFloor: -1})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="RDC" disabled={this.state.displayFloor==0} onPress={() => {this.setState({displayFloor: 0})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="1er" disabled={this.state.displayFloor==1} onPress={() => {this.setState({displayFloor: 1})}} />
                    </View>
                    <View style={{flex:1, padding: 5}}>
                        <Button title="2ème" disabled={this.state.displayFloor==2} onPress={() => {this.setState({displayFloor: 2})}} />
                    </View>
                </View>
            </View>

          </View>

          <View style={this.styles.container}>
            <FlatList
              data={(() => {
                if(this.state.displayType=="offline" ){
                    return beaconsDATA
                }else{
                    if(this.state.sortType=="identifiant")
                      return this.state.beacons.sort(function(a,b) {return a.major - b.major}).sort(function(a,b) {return a.minor - b.minor}) ;
                    else if(this.state.sortType=="signal")
                      return this.state.beacons.sort(function(a,b) {return b.rssi - a.rssi});
                    }
                })()}
              renderItem={this.state.displayType=="offline" ? generateListOfflineBeacon : generateListBeacon}
              keyExtractor={this.state.displayType=="offline" ? (item => item[0] + "_" + item[1]) : (item => item.major + "_" + item.minor)}
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
  for (let beaconDATA of beaconsDATA){
    if(beaconDATA[0]==item.major && beaconDATA[1]==item.minor){
      bData = beaconDATA;
      if(GestionBeaconsPageHandler.state.displayType == "new")
        return <></>
    }
  }

  if(GestionBeaconsPageHandler.state.displayType == "scanned" && bData == undefined)
      return <></>

  if(GestionBeaconsPageHandler.state.displayType == "scanned" && GestionBeaconsPageHandler.state.displayFloor != bData[6] && GestionBeaconsPageHandler.state.displayFloor != -1)
      return <></>

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
            {bData!=undefined ? <Text style={styles.beaconText}>{bData[6]==0 ? "RDC" : ("Etage "+bData[6])}</Text> : <></>}
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

function generateListOfflineBeacon({item}){
  var scanned = false;
  var styles = GestionBeaconsPageHandler.styles;
  for (let beacon of GestionBeaconsPageHandler.state.beacons){
    if(item[0]==beacon.major && item[1]==beacon.minor){
      scanned = true;
    }
  }
  if(!scanned){
    if(GestionBeaconsPageHandler.state.displayFloor != item[6] && GestionBeaconsPageHandler.state.displayFloor != -1)
        return <></>
    else
     return <View style={styles.beaconItem}>
         <View style={styles.beaconItemInfos}>
          <View style={styles.beaconTexts}>
            <Text style={styles.beaconTitle}>Beacon non détecté</Text>
            <Text style={styles.beaconText}>Major : {item[0]}</Text>
            <Text style={styles.beaconText}>Minor : {item[1]}</Text>
            <Text style={styles.beaconText}>{item[6]==0 ? "RDC" : ("Etage "+item[6])}</Text>
          </View>
          <View style={styles.beaconButtonSettings}>
            <Button title="Modifier"/>
          </View>
        </View>
      </View>
    }
}
