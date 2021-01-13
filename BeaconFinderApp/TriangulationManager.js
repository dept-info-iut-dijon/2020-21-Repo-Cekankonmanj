import {
  Platform
} from 'react-native';

export var generatedPosition = {latitude:47.3109789, longitude: 5.0682459, etage:0}
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
   generatedPosition.etage = calculEtage(bs);
   if(Server!=undefined)
      Server.onPositionChange();
   if(Carte!=undefined)
      Carte.onPositionChange();
}

const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;

function calculEtage(bs){
  etageSum = [];
  for(b in bs)
    for (let beaconDATA of beaconsDATA)
      if(beaconDATA[0]==bs[b].major && beaconDATA[1]==bs[b].minor){
        if(etageSum[beaconDATA[6]] == undefined)
          etageSum[beaconDATA[6]] = []
        etageSum[beaconDATA[6]].push(bs[b].rssi*-1);
      }
  etageActuel = 0;
  etageActuelMin = 1000;
  for(etage in etageSum){
    avg = average(etageSum[etage]);
    //console.log("etage ", etage, avg);
    if(etageActuelMin>avg){
      etageActuelMin = avg;
      etageActuel = etage;
    }
  }
  console.log("probablement étage " + etageActuel);
  return etageActuel;
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
    var txPower = -67.0; // Manufacture set this power in the device
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
    //return {latitude: calcul.latitude, longitude: calcul.longitude}
    resLatitude += calcul.latitude * coef
    resLongitude += calcul.longitude * coef
    coefTotal += coef;
    coef = coef/3
  }
  if(resLatitude == 0)
    return {latitude:47.3109789, longitude: 5.0682459, etage:0}
  else
    return {latitude: resLatitude/coefTotal, longitude: resLongitude/coefTotal, etage:0}

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
           , beacons[0].dist
           ]

  var P2 = [ earthR *(math.cos(rad(beacons[1].lat)) * math.cos(rad(beacons[1].lon)))
           , earthR *(math.cos(rad(beacons[1].lat)) * math.sin(rad(beacons[1].lon)))
           , earthR *(math.sin(rad(beacons[1].lat)))
           , beacons[1].dist
           ]

  var P3 = [ earthR *(math.cos(rad(beacons[2].lat)) * math.cos(rad(beacons[2].lon)))
           , earthR *(math.cos(rad(beacons[2].lat)) * math.sin(rad(beacons[2].lon)))
           , earthR *(math.sin(rad(beacons[2].lat)))
           , beacons[2].dist
           ]


  var input = [
      P1,
      P2,
      P3
  ];

  var output = trilat(input);
  //console.log(output)

  var lat = deg(math.asin(math.divide(output[2], earthR)))
  var lon = deg(math.atan2(output[1], output[0]))

  //console.log(lat, lon)

  return {latitude:lat, longitude: lon}

}




var LM = require('ml-curve-fitting');
var Matrix = LM.Matrix;
var mathAlgebra = Matrix.algebra;



//Distance function. p is the guessed point.
var euclidean = function(t,p,c){
    var rows = t.rows;
    var result = new Matrix(t.rows, 1);
    for(var i=0;i<rows;i++){
       result[i][0] = Math.sqrt(Math.pow(t[i][0]-p[0][0],2)+Math.pow(t[i][1]-p[1][0],2)+Math.pow(t[i][2]-p[2][0],2));
    }

    return result;
};

function trilat(data, allowedDist) {
    var nbPoints = data.length;
    var t = mathAlgebra.matrix(nbPoints,3);//[1:Npnt]'; // independent variable
    var y_data = mathAlgebra.matrix(nbPoints, 1);

    for(var i=0;i<nbPoints;i++){
        t[i][0] = data[i][0]; // x
        t[i][1] = data[i][1]; // y
        t[i][2] = data[i][2]; // z
        y_data[i][0] = data[i][3]; // distance
    }

    var weight = [1];
    var opts = [ 2, 100, 1e-3, 1e-3, 1e-3, 1e-2, 1e-2, 11, 9, 1 ];
    var consts = [];

    var Xs = [ data[0][0], data[1][0], data[2][0] ];// x
    var Ys = [ data[0][1], data[1][1], data[2][1] ];// y
    var Zs = [ data[0][2], data[1][2], data[2][2] ];// z
    var minX = Math.min.apply(Math, Xs);// x
    var minY = Math.min.apply(Math, Ys);// y
    var minZ = Math.min.apply(Math, Zs);// z
    var maxX = Math.max.apply(Math, Xs);// x
    var maxY = Math.max.apply(Math, Ys);// y
    var maxZ = Math.max.apply(Math, Zs);// z
    var avgX = ( Xs[0] + Xs[1] + Xs[2] ) / 3;// x
    var avgY = ( Ys[0] + Ys[1] + Ys[2] ) / 3;// y
    var avgZ = ( Zs[0] + Zs[1] + Zs[2] ) / 3;// z
    var ad = allowedDist || 0;

    var p_init = mathAlgebra.matrix([[avgX], [avgY], [avgZ]]);
    var p_min = mathAlgebra.matrix([[minX-ad], [minY-ad], [minZ-ad]]);
    var p_max = mathAlgebra.matrix([[maxX+ad], [maxY+ad], [maxZ+ad]]);

    // https://github.com/mljs/curve-fitting/blob/master/Documentation.md
    var p_fit = LM.optimize(euclidean,p_init,t,y_data,weight,-0.01,p_min,p_max,consts,opts);
    p_fit = p_fit.p;

    // euclidean(t,p_fit,consts)

    return [ p_fit[0][0], p_fit[1][0],  p_fit[2][0] ];
}
