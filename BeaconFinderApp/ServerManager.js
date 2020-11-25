export class ServerManager {
    constructor(){
      console.log('ServerManager')
      this.connect();

      setInterval(() => {
          if(this.ws.readyState==3){
            this.connect();
            //this.ws.send('update|position|' + TriangulationManager.generatedPosition.latitude + '|' + TriangulationManager.generatedPosition.longitude)
          }
      }, 3000);

      this.ws.onopen = () => {
      };

      this.ws.onmessage = (e) => {
        console.log(e.data);
      };

      this.ws.onerror = (e) => {
        console.log(e.message);
      };

      this.ws.onclose = (e) => {
        console.log(e.code, e.reason);
      };
    }

    connect() {
      this.ws = new WebSocket('ws://192.168.3.35:12345');
    }
}
