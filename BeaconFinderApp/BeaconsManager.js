import {
  Alert,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid
} from 'react-native';

import Kontakt, {KontaktModule} from 'react-native-kontaktio';
const {connect, init, startDiscovery, startScanning, startRangingBeaconsInRegion, configure, scanMode, scanPeriod	} = Kontakt;

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

var scannedBeaconsPerRegion = {};
var lastRSSIPerBeacon = {};
var lastAccuracyPerBeacon = {};
export var scannedBeacons = [];

var iosNbScanToUpdate = 3;
var iosNbScan = 0;
var scans = [];

var callbacks = []
var callbackBeacons = (beacons) => {
  for(c in callbacks)
    callbacks[c](beacons);
};

export function addCallbackBeacons(f){
  callbacks.push(f);
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
      await connect().then(() => configure({
        scanMode: scanMode.LOW_LATENCY,
        scanPeriod: scanPeriod.RANGING
      }));
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
      scannedBeacons = [];
      for(beacon in beacons){
        if(beacons[beacon]["uuid"]==region1.uuid || beacons[beacon]["uuid"]==region2.uuid)
          scannedBeacons.push(beacons[beacon])
      }
      //console.log("scannedBeacons android: " + scannedBeacons.length)
      callbackBeacons(scannedBeacons);
    });
  } else {
    kontaktEmitter.addListener('didRangeBeacons', ({beacons, region}) => {
      scannedBeaconsPerRegion[region.uuid] = beacons;
      scannedBeacons = [];
      for (s in scannedBeaconsPerRegion){
        for (beacon in scannedBeaconsPerRegion[s]){
          if(scannedBeaconsPerRegion[s][beacon].rssi==0 && lastRSSIPerBeacon[scannedBeaconsPerRegion[s][beacon].major + "_" + scannedBeaconsPerRegion[s][beacon].minor]!=undefined){
            scannedBeaconsPerRegion[s][beacon].rssi = lastRSSIPerBeacon[scannedBeaconsPerRegion[s][beacon].major + "_" + scannedBeaconsPerRegion[s][beacon].minor]
            scannedBeaconsPerRegion[s][beacon].accuracy = lastAccuracyPerBeacon[scannedBeaconsPerRegion[s][beacon].major + "_" + scannedBeaconsPerRegion[s][beacon].minor]
            scannedBeacons.push(scannedBeaconsPerRegion[s][beacon])
          }else if(scannedBeaconsPerRegion[s][beacon].rssi!=0){
            lastRSSIPerBeacon[scannedBeaconsPerRegion[s][beacon].major + "_" + scannedBeaconsPerRegion[s][beacon].minor] = scannedBeaconsPerRegion[s][beacon].rssi;
            lastAccuracyPerBeacon[scannedBeaconsPerRegion[s][beacon].major + "_" + scannedBeaconsPerRegion[s][beacon].minor] = scannedBeaconsPerRegion[s][beacon].accuracy;

            scannedBeacons.push(scannedBeaconsPerRegion[s][beacon]);
          }
        }
      }
      //console.log("scannedBeacons iOS: " + scannedBeacons.length)
      if(iosNbScan!=iosNbScanToUpdate-1){
        //on ajoute le scan
        scans.push(scannedBeacons)
        iosNbScan += 1;
      }else{
        //moyenne
        scans.push(scannedBeacons)
        rssiMoyenneBeacons = {}
        countMoyenneBeacons = {}

        for(scan in scans){
          for(beacon in scans[scan]){
            b = scans[scan][beacon]
            if(scan == 0){
              rssiMoyenneBeacons[b.major + "_" + b.minor] = 0;
              countMoyenneBeacons[b.major + "_" + b.minor] = 0;
            }
            rssiMoyenneBeacons[b.major + "_" + b.minor] += b.rssi;
            countMoyenneBeacons[b.major + "_" + b.minor] += 1;
            if(scan == iosNbScanToUpdate-1){
              rssiMoyenneBeacons[b.major + "_" + b.minor] = rssiMoyenneBeacons[b.major + "_" + b.minor] / countMoyenneBeacons[b.major + "_" + b.minor];
            }
          }
        }

        for(beacon in scannedBeacons){
          b = scannedBeacons[beacon]
          if(!isNaN(rssiMoyenneBeacons[b.major + "_" + b.minor])){
            scannedBeacons[beacon].rssi = rssiMoyenneBeacons[b.major + "_" + b.minor];
          }
        }

        scans = []
        iosNbScan = 0;
        callbackBeacons(scannedBeacons);
      }

    });
  }
};
