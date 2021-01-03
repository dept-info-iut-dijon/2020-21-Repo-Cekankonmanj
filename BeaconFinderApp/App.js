// React Navigation Drawer with Sectioned Menu Options & Footer
// https://aboutreact.com/navigation-drawer-sidebar-menu-with-sectioned-menu-options-footer/

import 'react-native-gesture-handler';

import * as React from 'react';
import {Component} from 'react';
import { View, TouchableOpacity, Image, Text, Button } from 'react-native';

import { NavigationContainer, DefaultTheme, DarkTheme, useTheme, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Appearance } from 'react-native'

import {ServerManager} from './ServerManager';
import {DataManager} from './DataManager';
import * as TriangulationManager from './TriangulationManager';
import * as BeaconsManager from './BeaconsManager';

import CartePage from './pages/CartePage';
import * as CartePageManager from './pages/CartePage';
import MinijeuxPage from './pages/MinijeuxPage';
import GestionBeaconsPage from './pages/GestionBeaconsPage';
import * as GestionBeaconsPageManager from './pages/GestionBeaconsPage';
import ParametresApplicationPage from './pages/ParametresApplicationPage';
import * as ParametresApplicationPageManager from './pages/ParametresApplicationPage';
import CustomSidebarMenu from './CustomSidebarMenu';

var Data = new DataManager();
var Server = new ServerManager();
Server.setTriangulationManager(TriangulationManager);
Server.setDataManager(Data);
BeaconsManager.addCallbackBeacons( CartePageManager.updateMapBeacons )
BeaconsManager.addCallbackBeacons( GestionBeaconsPageManager.updateBeacons )
BeaconsManager.addCallbackBeacons( TriangulationManager.updateBeacons )
TriangulationManager.setCarte(CartePageManager)
TriangulationManager.setServer(Server)
CartePageManager.setGetterUserPosition(() => {return TriangulationManager.generatedPosition})
CartePageManager.setGetterServer(() => {return Server})
CartePageManager.setGetterData(() => {return Data})
ParametresApplicationPageManager.setGetterData(() => {return Data})
ParametresApplicationPageManager.setCarte(CartePageManager)
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
    <Stack.Navigator initialRouteName="GestionBeacons">
      <Stack.Screen
        name="GestionBeacons"
        component={GestionBeaconsPage}
        options={{
          title: 'Gestion des Beacons', //Set Header Title
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
        }}
      />
      <Stack.Screen
        name="EditionBeacon"
        component={EditionBeacon}
        options={{
          title: 'Beacons',
          headerStyle: {
            backgroundColor: 'grey', //Set Header color
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

function EditionBeacon({ navigation, route }) {
  const theme = useTheme();
  console.log(route.params)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30, color: theme.colors.text }}>Major : {route.params.item.major}</Text>
      <Text style={{ fontSize: 30, color: theme.colors.text }}>Minor : {route.params.item.minor}</Text>
      <Button onPress={() => navigation.goBack()} title="Fermer" />
    </View>
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
          initialRouteName="Carte"
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
