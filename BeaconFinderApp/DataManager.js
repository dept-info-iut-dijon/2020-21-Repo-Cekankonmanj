import AsyncStorage from '@react-native-async-storage/async-storage';

export class DataManager {
    constructor(){
      console.log('DataManager')
    }

    async getData(key, defaultValue){
      console.log("getData", key, defaultValue)
      try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
          return value;
        }else{
          return defaultValue;
        }
      } catch(e) {
        console.log("erreur getData")
        return defaultValue;
      }
    }

    async setData(key, value){
      try {
        await AsyncStorage.setItem(key, value)
      } catch (e) {
        console.log("erreur storeData")
      }
    }
}
