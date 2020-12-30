import * as React from 'react';
import {Component, useRef} from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsList from 'react-native-settings-list';

import { useTheme } from '@react-navigation/native';

import Dialog from "react-native-dialog";
import { ColorPicker, fromHsv } from 'react-native-color-picker'

async function getData(key, defaultValue){
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      return value;
    }else{
      return defaultValue;
    }
  } catch(e) {
    console.log("erreur getData")
  }
}

async function setData(key, value){
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log("erreur storeData")
  }
}

export class ParametresApplicationPageWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameModalVisible: false,
      colorModalVisible: false,
      visibleOnMap: false,
      name: "",
      color: "",
      newName: ""
    };
    this.textInput = React.createRef();
    this.newColor = ""

    getData("@name", "Steve").then((value) => {
      this.setState({name: value});
    })

    getData("@color", "#ff00ff").then((value) => {
      this.setState({color: value});
    })

    getData("@visibleOnMap", "false").then((value) => {
      this.setState({visibleOnMap: (value=="true")});
    })

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
                      switchOnValueChange={(value) => {setData("@visibleOnMap", value.toString()); this.setState({ visibleOnMap: value })}}
                    />
                    <SettingsList.Item
                      title='Nom sur la carte'
                      titleInfo={this.state.name}
                      titleInfoStyle={styles.titleInfoStyle}
                      onPress={() => this.setState({ newName: this.state.name, nameModalVisible: true })}
                    />
                    <SettingsList.Item
                      title='Couleur sur la carte'
                      titleInfo={this.state.color}
                      titleInfoStyle={{color: this.state.color}}
                      onPress={() => this.setState({colorModalVisible: true })}
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
              <Dialog.Button label="Confirmer" onPress={() => {setData("@name", this.state.newName); this.setState({ name: this.state.newName, nameModalVisible: false })}}/>
            </Dialog.Container>

              <Dialog.Container visible={this.state.colorModalVisible} onBackdropPress={() => this.setState({ nameModalVisible: false })}>
                <Dialog.Title>Couleur sur la carte</Dialog.Title>
                  <ColorPicker
                    defaultColor={this.state.color}
                    onColorChange={(color) => this.newColor = fromHsv(color)}
                    style={{height:250, margin:15}}
                  />
                  <Dialog.Button label="Annuler" onPress={() => this.setState({ colorModalVisible: false })}/>
                  <Dialog.Button label="Confirmer" onPress={() => {setData("@color", this.newColor); this.setState({ color: this.newColor, colorModalVisible: false })}}/>
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
