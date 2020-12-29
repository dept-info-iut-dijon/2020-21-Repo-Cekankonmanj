import * as React from 'react';
import {Component, useRef} from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '@react-navigation/native';
import SettingsList from 'react-native-settings-list';

import Dialog from "react-native-dialog";

export class ParametresApplicationPageWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameModalVisible: false,
      visibleOnMap: false,
      name: "Defaut",
      newName: ""
    };
    this.textInput = React.createRef();

    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('@storage_Key', value)
      } catch (e) {
        // saving error
      }
    }
    storeData("COUCOU TOI");

    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key')
        if(value !== null) {
          console.log(value)
        }
      } catch(e) {
        // error reading value
      }
    }

  }

  render() {
    const { theme, navigation } = this.props;
    colors = theme.colors

    const styles = StyleSheet.create({
      titleInfoStyle: {
        color:'#aaa'
      },
      titleStyle: {
        color:colors.text
      }
    });

      return (
        <>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View style={{flex:1}}>
                  <SettingsList borderColor={colors.border} backgroundColor={colors.card} defaultTitleStyle={styles.titleStyle} defaultItemSize={50}>
                    <SettingsList.Header headerStyle={{marginTop:15}}/>
                    <SettingsList.Item
                      hasSwitch={true}
                      switchState={this.state.visibleOnMap}
                      hasNavArrow={false}
                      title='Partager sa position'
                      switchOnValueChange={(value) => this.setState({ visibleOnMap: value })}
                    />
                    <SettingsList.Item
                      title='Nom sur la carte'
                      titleInfo={this.state.name}
                      titleInfoStyle={styles.titleInfoStyle}
                      onPress={() => this.setState({ newName: this.state.name, nameModalVisible: true })}
                    />
                    <SettingsList.Header headerStyle={{marginTop:15}}/>
                    <SettingsList.Item

                      title='aaa'
                      onPress={() => Alert.alert('Route To Notifications Page')}
                    />
                    <SettingsList.Item

                      title='aaa'
                      onPress={() => Alert.alert('Route To Control Center Page')}
                    />
                    <SettingsList.Item

                      title='aaa'
                      onPress={() => Alert.alert('Route To Do Not Disturb Page')}
                    />
                  </SettingsList>
                </View>
            </View>
          </SafeAreaView>

          <View>
            <Dialog.Container visible={this.state.nameModalVisible} onBackdropPress={() => this.setState({ nameModalVisible: false })}>
              <Dialog.Title>Nom sur la carte</Dialog.Title>
              <Dialog.Description>
                Choisissez le nom qui sera affiché sur la carte pour les autres utilisateurs de l'application
              </Dialog.Description>
              <Dialog.Input onChangeText={(text) => this.setState({ newName: text })} value={this.state.newName} />
              <Dialog.Button label="Annuler" onPress={() => this.setState({ nameModalVisible: false })}/>
              <Dialog.Button label="Confirmer" onPress={() => this.setState({ name: this.state.newName, nameModalVisible: false })}/>
            </Dialog.Container>
          </View>
        </>
      );
    }
};

export default function ParametresApplicationPage(props, prop) {
  const theme = useTheme();

  return <ParametresApplicationPageWrapper {...props} theme={theme} />;
}
