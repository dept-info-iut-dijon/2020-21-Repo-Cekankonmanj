import {
  Platform
} from 'react-native';

export class ServerManager {
    constructor(){
      console.log('ServerManager')
      this.connect();
      this.users = {}
      this.test="salut"
      this.TriangulationManager = undefined

      // envoyer la position seuelemnt lorsque TriangulationManager l'actualise pas tlt
      // et lors de cet envoie, actualiser aux autres

      setInterval(() => {
          if(this.ws.readyState==3){
            this.connect();
          }
      }, 3000);

      this.ws.onopen = () => {
      };

      this.ws.onmessage = (e) => {
        console.log('receive ('+Platform.OS+') : ' + e.data);
        args = e.data.split('|')
        command = args.shift()

        if(command=="add"){
          if(args[0] == "client"){
            this.users[args[1]] = {
                        name: args[2],
                        latitude: 0,
                        longitude: 0,
            };
          }
        }else if (command=="remove") {
          if(args[0] == "client"){
            delete this.users[args[1]];
          }
        }else if (command=="update") {
          if(args[0] == "position"){
            this.users[args[1]].latitude = parseFloat(args[2]);
            this.users[args[1]].longitude = parseFloat(args[3]);
          }
        }
      };

      this.ws.onerror = (e) => {
        console.log(e.message);
      };

      this.ws.onclose = (e) => {
        console.log(e.code, e.reason);
      };
    }

    connect() {
      this.ws = new WebSocket('ws://192.168.1.73:12345');
      this.users = {}
    }

    setTriangulationManager(tm){
      this.TriangulationManager = tm
    }

    onPositionChange(){
      if(this.ws.readyState==1)
        this.ws.send('update|position|' + this.TriangulationManager.generatedPosition.latitude + '|' + this.TriangulationManager.generatedPosition.longitude)
    }
}
