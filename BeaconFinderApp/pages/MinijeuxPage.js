import * as React from 'react';
import {Component} from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList } from 'react-native';

import { useTheme } from '@react-navigation/native';
import CompassHeading from 'react-native-compass-heading';

export var Server = undefined

export function setServer(srv){
  Server = srv;
}

export class MinijeuxPageWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {users:Server.users}
    this.blabla = "blabla";
    Server.addCallbackUpdate(this.serverUpdate, this);
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
              Nombre de joueurs disponibles : {Object.keys(this.state.users).length}
            </Text>

            <View>
            <FlatList
              data={Object.keys(this.state.users)}
              renderItem={({item}) => {data = this.state.users[item]; return(<Text style={styles.item}>{data.name}</Text>)}}
              />
            </View>
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
    alignItems: 'center',
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

export default function MinijeuxPage(props, prop) {
  const theme = useTheme();

  return <MinijeuxPageWrapper {...props} theme={theme} />;
}
