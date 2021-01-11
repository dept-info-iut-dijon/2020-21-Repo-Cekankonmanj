import {
  Platform
} from 'react-native';

export class ServerManager {
    constructor(){
      console.log('ServerManager')
      this.connect();
      this.users = {}
      this.TriangulationManager = undefined
      this.DataManager = undefined

      this.callbacksUpdateList = []

      // envoyer la position seuelemnt lorsque TriangulationManager l'actualise pas tlt
      // et lors de cet envoie, actualiser aux autres

      setInterval(() => {
          if(this.ws.readyState==3){
            this.connect();
          }
      }, 5000);
    }

    addCallbackUpdate(f, param){
      this.callbacksUpdateList.push([f, param]);
    }

    callbacksUpdate() {
      for(c in this.callbacksUpdateList)
        this.callbacksUpdateList[c][0](this.callbacksUpdateList[c][1]);
    }

    connect() {
      this.ws = new WebSocket('ws://192.168.1.73:12345');
      this.users = {}

      this.ws.onopen = () => {
        this.DataManager.getData("@color", "#ff00ff").then((value) => {
          this.ws.send('set|color|'+value);
          this.DataManager.getData("@name", "#ff00ff").then((value) => {
            this.ws.send('set|name|'+value);
            this.ws.send('ready')
          })
        })
      };

      this.ws.onmessage = (e) => {
        //console.log('receive ('+Platform.OS+') : ' + e.data);
        args = e.data.split('|');
        command = args.shift();
        //console.log(args);

        if(command=="add"){
          if(args[0] == "client"){
            this.users[args[1]] = {
                        color: args[2],
                        name: args[3],
                        latitude: 0,
                        longitude: 0,
            };
            this.callbacksUpdate();
          }
        }else if (command=="remove") {
          if(args[0] == "client"){
            delete this.users[args[1]];
            this.callbacksUpdate();
          }
        }else if (command=="update") {
          if(args[0] == "position"){
            this.users[args[1]].latitude = parseFloat(args[2]);
            this.users[args[1]].longitude = parseFloat(args[3]);
          }else if(args[0] == "color"){
            this.users[args[1]].color = args[2];
          }else if(args[0] == "name"){
            this.users[args[1]].name = args[2];
          }
          this.callbacksUpdate();
        }
      };

      this.ws.onerror = (e) => {
        console.log(e.message);
      };

      this.ws.onclose = (e) => {
        console.log(e.code, e.reason);
      };
    }

    setTriangulationManager(tm){
      this.TriangulationManager = tm
    }

    setDataManager(data){
      this.DataManager = data
    }

    onPositionChange(){
      if(this.ws.readyState==1)
        this.ws.send('update|position|' + this.TriangulationManager.generatedPosition.latitude + '|' + this.TriangulationManager.generatedPosition.longitude)
    }

    onColorUserChange(color){
      if(this.ws.readyState==1)
        this.ws.send('update|color|' + color);
    }

    onNameUserChange(name){
      if(this.ws.readyState==1)
        this.ws.send('update|name|' + name);
    }
}
