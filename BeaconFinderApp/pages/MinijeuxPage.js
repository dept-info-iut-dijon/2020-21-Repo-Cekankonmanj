import * as React from 'react';
import {Component} from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

import { useTheme } from '@react-navigation/native';
import CompassHeading from 'react-native-compass-heading';

export var Server = undefined

export function setServer(srv){
  Server = srv;
}

export class MinijeuxPageWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {users:Server.users, degreeCompass:0, playingWithId:"-1"}

    Server.addCallbackUpdate(this.serverUpdate, this);

    const degree_update_rate = 1;

    CompassHeading.start(degree_update_rate, degree => {
      this.setState({degreeCompass:degree})
    });
  }

  serverUpdate(self){
    self.setState({users:Server.users})
  }

  render() {

    const { theme } = this.props;
    colors = theme.colors

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 16 }}>
          <View style={styles.container}>
            <View style={{display: this.state.playingWithId=="-1" ? "flex" : "none"}}>
                <Text style={{
                  color: colors.text,
                  fontSize: 20,
                  textAlign: 'center', }}>
                  Tu chauffes ! {this.state.test}
                </Text>
                <Text style={{
                  color: colors.text,
                  fontSize: 15,
                  textAlign: 'center', }}>
                  Clique sur la personne avec qui jouer.
                </Text>

                <View style={{padding:10, alignItems: 'stretch'}}>
                <FlatList
                  data={Object.keys(this.state.users)}
                  keyExtractor={(item) => item}
                  renderItem={({item}) => {data = this.state.users[item]; return(
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({playingWithId: item})
                      }}
                    >
                      <View style={{backgroundColor:colors.card, borderColor:data.color, borderWidth: 1.5, borderRadius:10, padding:10, marginBottom: 5, alignItems: 'center'}}>
                          <Text style={[styles.item, {color: colors.text}]}>{data.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}}
                  />
                </View>
            </View>

            {this.state.playingWithId=="-1" ? <></> : (
                  <View style={{display: this.state.playingWithId=="-1" ? "none" : "flex"}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({playingWithId: "-1"})
                        }}
                      >
                        <View style={{backgroundColor:colors.card, borderColor:colors.border, borderWidth: 1.5, borderRadius:10, padding:10, marginBottom: 5, alignItems: 'center'}}>
                            <Text style={[styles.item, {color: colors.text}]}>Retour</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{alignItems:"center"}}>
                        <Image
                          style={[
                            styles.image,
                            {transform: [{rotate: `${360 - getDegrees(Server.TriangulationManager.generatedPosition.latitude, Server.TriangulationManager.generatedPosition.longitude, this.state.users[this.state.playingWithId].latitude, this.state.users[this.state.playingWithId].longitude, this.state.degreeCompass)}deg`}]},
                          ]}
                          source={require('../images/compass.png')}
                        />
                        <View style={{alignItems:"center"}}>
                            <Text style={{fontSize: 20, color: colors.text}}>Tu cherches</Text>
                            <Text style={{fontSize: 25, color:this.state.users[this.state.playingWithId].color}}>{this.state.users[this.state.playingWithId].name}</Text>
                                <Text style={{fontSize: 20}}> </Text>
                            <Text style={{fontSize: 20, color: colors.text}}>Distance</Text>
                            <Text style={{fontSize: 25, color:this.state.users[this.state.playingWithId].color}}>{(calcCrow(Server.TriangulationManager.generatedPosition.latitude, Server.TriangulationManager.generatedPosition.longitude, this.state.users[this.state.playingWithId].latitude, this.state.users[this.state.playingWithId].longitude)*100).toFixed(2)} m</Text>
                        </View>
                      </View>
                  </View>
            )}

          </View>
          <Text style={styles.footerHeading}>
            D'autres mini-jeux à venir
          </Text>
          <Text style={styles.footerText}>prochainement...</Text>
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
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
  image: {
    height: 150,
    width: 150,
  },
});

export default function MinijeuxPage(props, prop) {
  const theme = useTheme();

  return <MinijeuxPageWrapper {...props} theme={theme} />;
}

function getDegrees(lat1, lon1, lat2, lon2, headX) {

    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;

    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) -
            Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var brng = (Math.atan2(y, x)) * 180 / Math.PI;

    // fix negative degrees
    if(brng<0) {
        brng=360-Math.abs(brng);
    }

    return brng - headX;
}

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
