import {
  Platform
} from 'react-native';

export var generatedPosition = {latitude:47.3109789, longitude: 5.0682459}
export var Server = undefined
export var Carte = undefined
import beaconsDATA from './list.json';
var math = require('mathjs')

export function setServer(srv){
  Server = srv;
}

export function setCarte(srv){
  Carte = srv;
}

export function updateBeacons(bs){
   groupedBeacons = groupBeacon(bs.sort(function(a,b) {return b.rssi - a.rssi}));
   generatedPosition = generatePosition(groupedBeacons)
   if(Server!=undefined)
      Server.onPositionChange();
   if(Carte!=undefined)
      Carte.onPositionChange();
}

function groupBeacon(bs){
  var newGroup = []
  var groups = []
  for(b in bs){
    for (let beaconDATA of beaconsDATA)
      if(beaconDATA[0]==bs[b].major && beaconDATA[1]==bs[b].minor && beaconDATA[6]!=-1)
        newGroup.push([beaconDATA, bs[b]]);
    if(newGroup.length==3){
      groups.push(newGroup);
      newGroup = [];
    }
  }
  return groups;
}

function calculateBeaconDistance(rssi) {
    var txPower = -65.0; // Manufacture set this power in the device
    if (rssi == 0){
        return -1.0;
    }

    var ratio = rssi*1.0 / txPower;
    if (ratio < 1.0){
        return math.pow(ratio,10);

    }
    else{
        var accuracy = (0.89976)*math.pow(ratio,7.7095) + 0.111;
        return accuracy;
    }
}

function generatePosition(groupedBeacons){
  coef = 1;
  coefTotal = 0;
  resLatitude = 0;
  resLongitude = 0;

  //console.log("======================== " + Platform.OS)
  var a, b, c;
  for(group in groupedBeacons){

      //console.log(calculateBeaconDistance(groupedBeacons[group][0][1].rssi) + " " + groupedBeacons[group][0][1].rssi)
      //  console.log(calculateBeaconDistance(groupedBeacons[group][1][1].rssi) + " " + groupedBeacons[group][1][1].rssi)
      //    console.log(calculateBeaconDistance(groupedBeacons[group][2][1].rssi) + " " + groupedBeacons[group][0][1].rssi)
      //    console.log('------')

    a = calculateBeaconDistance(groupedBeacons[group][0][1].rssi)
    aX = groupedBeacons[group][0][0][3];
    aY = groupedBeacons[group][0][0][4];
    b = calculateBeaconDistance(groupedBeacons[group][1][1].rssi)
    bX = groupedBeacons[group][1][0][3];
    bY = groupedBeacons[group][1][0][4];
    c = calculateBeaconDistance(groupedBeacons[group][2][1].rssi)
    cX = groupedBeacons[group][2][0][3];
    cY = groupedBeacons[group][2][0][4];

    var beacons = [{lat:aX ,lon:aY ,dist:a}, {lat:bX ,lon:bY ,dist:b}, {lat:cX ,lon:cY ,dist:c}]

    calcul = trilaterate(beacons)
    resLatitude += calcul.latitude * coef
    resLongitude += calcul.longitude * coef
    coefTotal += coef;
    //console.log(coef);
    coef = coef/3
  }
  if(resLatitude == 0)
    return {latitude:47.3109789, longitude: 5.0682459}
  else
    return {latitude: resLatitude/coefTotal, longitude: resLongitude/coefTotal}

}

var trilaterate = function(beacons) {

  var earthR = 6371e3
    , rad = function(deg) {
      return deg * (math.pi/180)
    }
    , deg = function(rad) {
      return rad * (180/math.pi)
    }

  var P1 = [ earthR *(math.cos(rad(beacons[0].lat)) * math.cos(rad(beacons[0].lon)))
           , earthR *(math.cos(rad(beacons[0].lat)) * math.sin(rad(beacons[0].lon)))
           , earthR *(math.sin(rad(beacons[0].lat)))
           ]

  var P2 = [ earthR *(math.cos(rad(beacons[1].lat)) * math.cos(rad(beacons[1].lon)))
           , earthR *(math.cos(rad(beacons[1].lat)) * math.sin(rad(beacons[1].lon)))
           , earthR *(math.sin(rad(beacons[1].lat)))
           ]

  var P3 = [ earthR *(math.cos(rad(beacons[2].lat)) * math.cos(rad(beacons[2].lon)))
           , earthR *(math.cos(rad(beacons[2].lat)) * math.sin(rad(beacons[2].lon)))
           , earthR *(math.sin(rad(beacons[2].lat)))
           ]

  var ex = math.divide(math.subtract(P2, P1), math.norm( math.subtract(P2, P1) ))
  var i =  math.dot(ex, math.subtract(P3, P1) )

  var ey = math.divide(
          math.subtract(
            math.subtract(P3, P1),
            math.multiply(i, ex)
          ),
          math.norm(
            math.subtract(
              math.subtract(P3, P1),
              math.multiply(i, ex)
            )
          )
       )

  var ez = math.cross(ex, ey)
  var d =  math.norm(math.subtract(P2, P1))
  var j =  math.dot(ey, math.subtract(P3, P1))

  var x =  (math.pow(beacons[0].dist, 2) - math.pow(beacons[1].dist,2) + math.pow(d,2))/(2*d)
  var y = ((math.pow(beacons[0].dist, 2) - math.pow(beacons[2].dist,2) + math.pow(i,2) + math.pow(j,2))/(2*j)) - ((i/j)*x)

  var z = math.sqrt( math.abs(math.pow(beacons[0].dist, 2) - math.pow(x, 2) - math.pow(y, 2)) )

  var triPt = math.add(
            math.add(
              math.add(P1,
                math.multiply(x, ex)
              ),
              math.multiply(y, ey)
            ),
            math.multiply(z, ez)
          )

  var lat = deg(math.asin(math.divide(triPt[2], earthR)))
  var lon = deg(math.atan2(triPt[1], triPt[0]))

  return {latitude:lat, longitude: lon}

}
