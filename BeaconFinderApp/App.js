// React Navigation Drawer with Sectioned Menu Options & Footer
// https://aboutreact.com/navigation-drawer-sidebar-menu-with-sectioned-menu-options-footer/

import 'react-native-gesture-handler';

import * as React from 'react';
import {Component} from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { Appearance } from 'react-native'

import CartePage from './pages/CartePage';
import * as CartePageManager from './pages/CartePage';
import MinijeuxPage from './pages/MinijeuxPage';
import GestionBeaconsPage from './pages/GestionBeaconsPage';
import ParametresApplicationPage from './pages/ParametresApplicationPage';

import CustomSidebarMenu from './CustomSidebarMenu';

import * as BeaconsManager from './BeaconsManager';
BeaconsManager.setCallbackBeacons( CartePageManager.updateMapBeacons )
BeaconsManager.setup()

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const NavigationDrawerStructure = (props) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 15 }}
        />
      </TouchableOpacity>
    </View>
  );
};

function CarteStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Carte">
      <Stack.Screen
        name="Carte"
        component={CartePage}
        options={{
          title: 'Carte', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerStructure navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#4888FF', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MinijeuxStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Minijeux"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: 'purple', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="Minijeux"
        component={MinijeuxPage}
        options={{
          title: 'Mini-jeux', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

function GestionBeaconsStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="GestionBeacons"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: 'grey', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="GestionBeacons"
        component={GestionBeaconsPage}
        options={{
          title: 'Gestion des Beacons', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

function ParametresApplicationStack({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="ParametresApplication"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerStructure navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: 'grey', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="ParametresApplication"
        component={ParametresApplicationPage}
        options={{
          title: 'Paramètres de l\'application', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
}

var AppHandler;
class App extends Component {
  constructor() {
    super();
    AppHandler = this;
    this.state = {
      colorSheme: (Appearance.getColorScheme()==="dark" ? DarkTheme : DefaultTheme)
    }
  }
  render() {
    return (
      <NavigationContainer theme={this.state.colorSheme}>
        <Drawer.Navigator headerShown={false}
          // For setting Custom Sidebar Menu
          drawerContent={(props) => <CustomSidebarMenu {...props} />}>
          <Drawer.Screen
            name="Carte"
            options={{
              drawerLabel: 'Carte',
              // Section/Group Name
              groupName: 'Accueil',
              activeTintColor: '#4888FF',
              headerShown:false,
            }}
            component={CarteStack}
          />
          <Drawer.Screen
            name="Mini-jeux"
            options={{
              drawerLabel: 'Mini-jeux',
              // Section/Group Name
              groupName: 'Accueil',
              activeTintColor: 'purple',
              headerShown:false,
            }}
            component={MinijeuxStack}
          />
          <Drawer.Screen
            name="GestionBeacons"
            options={{
              drawerLabel: 'Gestion des Beacons',
              // Section/Group Name
              groupName: 'Réglages',
              activeTintColor: 'grey',
              headerShown:false,
            }}
            component={GestionBeaconsStack}
          />
          <Drawer.Screen
            name="ParametresApplication"
            options={{
              drawerLabel: 'Paramètres de l\'application',
              // Section/Group Name
              groupName: 'Réglages',
              activeTintColor: 'grey',
              headerShown:false,
            }}
            component={ParametresApplicationStack}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    )
  }
}

Appearance.addChangeListener(() => {
  AppHandler.setState({colorSheme: (Appearance.getColorScheme()==="dark" ? DarkTheme : DefaultTheme)})
})

export default App;
