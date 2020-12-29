import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';

import { useTheme } from '@react-navigation/native';
import SettingsList from 'react-native-settings-list';

import Dialog from "react-native-dialog";

const ParametresApplication = () => {

  const { colors } = useTheme();
  const [nameModalVisible, setNameModalVisible] = React.useState(false);
  const [visibleOnMap, setVisibleOnMap] = React.useState(false);

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
                  switchState={visibleOnMap}
                  hasNavArrow={false}
                  title='Partager sa position'
                  switchOnValueChange={(value) => {setVisibleOnMap(value);}}
                />
                <SettingsList.Item
                  title='Nom sur la carte'
                  titleInfo='Nicolas'
                  titleInfoStyle={styles.titleInfoStyle}
                  onPress={() => setNameModalVisible(true)}
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
        <Dialog.Container visible={nameModalVisible} onBackdropPress={() => setNameModalVisible(false)}>
          <Dialog.Title>Nom sur la carte</Dialog.Title>
          <Dialog.Description>
            Choisissez le nom qui sera affiché sur la carte pour les autres utilisateurs de l'application
          </Dialog.Description>
          <Dialog.Input />
          <Dialog.Button label="Annuler" onPress={() => setNameModalVisible(false)}/>
          <Dialog.Button label="Confirmer" onPress={() => setNameModalVisible(false)}/>
        </Dialog.Container>
      </View>
    </>
  );
};

export default ParametresApplication;
