import {
  Alert,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid
} from 'react-native';

import Kontakt, {KontaktModule} from 'react-native-kontaktio';
const {connect, init, startDiscovery, startScanning, startRangingBeaconsInRegion} = Kontakt;

const kontaktEmitter = new NativeEventEmitter(KontaktModule);

const isAndroid = Platform.OS === 'android';

const region1 = {
  identifier: 'Beacons 1',
  uuid: 'f7826da6-4fa2-4e98-8024-bc5b71e0893e',
}

const region2 = {
  identifier: 'Beacons 2',
  uuid: 'e88225f5-ff80-4989-9705-c0b9efbcc62e',
}

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Permission de localisation',
        message:
          'Cette application nécessite cette autorisation pour localiser les beacons.',
        buttonNeutral: 'Demander plus tard',
        buttonNegative: 'Annuler',
        buttonPositive: 'Ok',
      },
    );

    const granted2 = await PermissionsAndroid.request(
    	PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    	{
        title: 'Permission de localisation',
        message:
          'Cette application nécessite cette autorisation pour localiser les beacons.',
        buttonNeutral: 'Demander plus tard',
        buttonNegative: 'Annuler',
        buttonPositive: 'Ok',
    	}
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED && granted2 === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      // permission denied
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const setup = async (truc) => {
  console.log('BeaconsManager.setup (' + (isAndroid ? 'Android' : 'iOS') + ')');
  if (isAndroid) {
    // Android
    const granted = await requestLocationPermission();
    if (granted) {
      await connect();
      await startScanning();
    } else {
      Alert.alert(
        'Permission error',
        'Location permission not granted. Cannot scan for beacons',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  } else {
    // iOS
    await init();
    await startRangingBeaconsInRegion(region1).then(() => console.log('iOS started ranging 1')).catch(error => console.log('[startRanging]', error));
    await startRangingBeaconsInRegion(region2).then(() => console.log('iOS started ranging 2')).catch(error => console.log('[startRanging]', error));
  }
  // Add beacon listener
  if (isAndroid) {
    DeviceEventEmitter.addListener('beaconsDidUpdate', ({beacons, region}) => {

    });
  } else {
    kontaktEmitter.addListener('didRangeBeacons', ({beacons, region}) => {
      
    });
  }
};