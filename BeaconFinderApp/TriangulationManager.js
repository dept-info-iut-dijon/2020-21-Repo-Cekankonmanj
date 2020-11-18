export var generatedPosition = {latitude:47.3109789, longitude: 5.0682459}
import beaconsDATA from './list.json';

export function updateBeacons(bs){
   groupedBeacons = groupBeacon(bs.sort(function(a,b) {return b.rssi - a.rssi}));
   generatedPosition = generatePosition(groupedBeacons)
}

function groupBeacon(bs){
  var newGroup = []
  var groups = []
  for(b in bs){
    for (let beaconDATA of beaconsDATA)
      if(beaconDATA[0]==bs[b].major && beaconDATA[1]==bs[b].minor)
        newGroup.push([beaconDATA, bs[b]]);
    if(newGroup.length==3){
      groups.push(newGroup);
      newGroup = [];
    }
  }
  return groups;
}

function getMeetingPoints(distanceA, distanceB, distanceC, pointA1, pointA2, pointB1, pointB2, pointC1, pointC2) {

    var w,z,x,y,y2;
    w = distanceA * distanceA - distanceB * distanceB - pointA1 * pointA1 - pointA2* pointA2 + pointB1 * pointB1 + pointB2 * pointB2;
    z = distanceB * distanceB - distanceC * distanceC - pointB1* pointB1 - pointB2 * pointB2 + pointC1 * pointC1 + pointC2 * pointC2;
    x = (w * ( pointC2 - pointB2) - z * ( pointB2 - pointA2)) / (2 * (( pointB1 - pointA1) * ( pointC2 - pointB2) - ( pointC1 - pointB1) * ( pointB2 - pointA2)));
    y = (w - 2 * x * (pointB1 - pointA1)) / (2 * ( pointB2 - pointA2));
    y2 = (z - 2 * x * ( pointC1 -pointB1)) / (2 * ( pointC2 - pointB2));
    y = (y + y2) / 2;

    return {latitude:x, longitude: y};
}

function getTrilateration(position1, position2, position3) {
    var xa = position1.x;
    var ya = position1.y;
    var xb = position2.x;
    var yb = position2.y;
    var xc = position3.x;
    var yc = position3.y;
    var ra = position1.distance;
    var rb = position2.distance;
    var rc = position3.distance;

    var S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
    var T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
    var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
    var x = ((y * (ya - yb)) - T) / (xb - xa);

    return {
        x: x,
        y: y
    };
}

function generatePosition(groupedBeacons){
  coef = 1;
  coefTotal = 0;

  var a, b, c;
  for(group in groupedBeacons){
    a = groupedBeacons[group][0][1].accuracy
    aX = groupedBeacons[group][0][0][3];
    aY = groupedBeacons[group][0][0][4];
    b = groupedBeacons[group][1][1].accuracy
    bX = groupedBeacons[group][1][0][3];
    bY = groupedBeacons[group][1][0][4];
    c = groupedBeacons[group][2][1].accuracy
    cX = groupedBeacons[group][2][0][3];
    cY = groupedBeacons[group][2][0][4];

    getMeetingPoints(a, b, c, aX, aY, bX, bY, cX, cY);
    console.log("aX", aX, "aY", aY, "distanceA", a)
    console.log("bX", bX, "bY", bY, "distanceB", b)
    console.log("cX", cX, "cY", cY, "distanceC", c)
    console.log(getTrilateration({x:aX, y:aY, distance:a}, {x:bX, y:bY, distance:b}, {x:cX, y:cY, distance:c}))
    console.log("")
    return {latitude:47.3109789, longitude: 5.0682459}
  }

  return {latitude:47.3109789, longitude: 5.0682459}
}
