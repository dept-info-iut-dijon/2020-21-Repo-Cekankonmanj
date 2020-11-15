import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image } from 'react-native';

import { useTheme } from '@react-navigation/native';
import SettingsList from 'react-native-settings-list';

const ParametresApplication = () => {

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    titleInfoStyle: {
      color:'#aaa'
    },
    titleStyle: {
      color:colors.text
    }
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={{flex:1}}>
            <SettingsList borderColor={colors.border} backgroundColor={colors.card} defaultTitleStyle={styles.titleStyle} defaultItemSize={50}>
              <SettingsList.Header headerStyle={{marginTop:15}}/>
              <SettingsList.Item
                hasSwitch={true}
                switchState={true}
                hasNavArrow={false}
                title='Airplane Mode'
              />
              <SettingsList.Item
                title='Wi-Fi'
                titleInfo='Bill Wi The Science Fi'
                titleInfoStyle={styles.titleInfoStyle}
                onPress={() => Alert.alert('Route to Wifi Page')}
              />
              <SettingsList.Item

                title='Blutooth'
                titleInfo='Off'
                titleInfoStyle={styles.titleInfoStyle}
                onPress={() => Alert.alert('Route to Blutooth Page')}
              />
              <SettingsList.Item

                title='Cellular'
                onPress={() => Alert.alert('Route To Cellular Page')}
              />
              <SettingsList.Item

                title='Personal Hotspot'
                titleInfo='Off'
                titleInfoStyle={styles.titleInfoStyle}
                onPress={() => Alert.alert('Route To Hotspot Page')}
              />
              <SettingsList.Header headerStyle={{marginTop:15}}/>
              <SettingsList.Item

                title='Notifications'
                onPress={() => Alert.alert('Route To Notifications Page')}
              />
              <SettingsList.Item

                title='Control Center'
                onPress={() => Alert.alert('Route To Control Center Page')}
              />
              <SettingsList.Item

                title='Do Not Disturb'
                onPress={() => Alert.alert('Route To Do Not Disturb Page')}
              />
              <SettingsList.Header headerStyle={{marginTop:15}}/>
              <SettingsList.Item

                title='General'
                onPress={() => alert('Route To General Page')}
              />
              <SettingsList.Item

                title='Display & Brightness'
                onPress={() => Alert.alert('Route To Display Page')}
              />
            </SettingsList>
          </View>
      </View>
    </SafeAreaView>
  );
};

export default ParametresApplication;
