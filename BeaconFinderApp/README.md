# Application

Cette application utilise React-Native afin de pouvoir la proposer directement sur iOS et Android.
Un Mac est nécessaire (ou une machine virtuelle) pour compiler l'application iOS.

Voir la documentation de React Native pour l'installation : https://reactnative.dev/docs/getting-started

# Installation de l'application

- Cloner la repo
- Ouvrir un cmd

```bash
	npm i

	#pour ios :
	cd ios
	pod install
	cd ..

	#pour tous :
	npx react-native start
	npx react-native (run-android | run-ios)
```


# Documentation
### App.js:

Fichier principal, il crée tous les objets nécessaire à l'application et les paramètres entre eux.
Ce fichier gère aussi le stack de chaque page, ainsi que le Drawer à gauche permettant de naviguer dans l'application.
A la fin se trouve un Listener captant le changement de mode jour/nuit de l'appareil pour adapter l'application.

### /pages/CartePage.js
Ce fichier gère la page de la carte. Cette page repose essentiellement sur l'élément MapView en plein écran. Cet élément affiche une carte google maps, et contiendra toutes les formes (cercle, polygone) à afficher sur la carte (comme les personnes, les beacons)

La fonction calcGrow à la fin permet de calculer la distance entre deux points, ceci permet de détecter l'appuie sur un cercle pour afficher le nom de la personne.
*Cette fonction n'a pas l'air très précise, il faudrait l'améliorer*

#### mapStyleDark.json & mapStyleLight.json
Ces fichiers chargés par l'élément MapView permettent l'affichage de la carte en mode jour ou en mode nuit suivant les paramètres de l'appareil.

### /pages/GestionBeaconsPage.js
Ce fichier gère la page de gestion des beacons.
Tout est géré dans la classe `GestionBeaconsPageWrapper`
Les fonctions `generateListBeacon` et `generateListOfflineBeacon` permettent de représenter visuellement un beacon et ses informations dans la liste.

### /pages/MinijeuxPage.js
Ce fichier gère la page des mini-jeux.
Actuellement, il n'y en a qu'un seul : Tu Chauffes !
Ce jeu utilise la librairie react-native-compass-heading qui permet d'avoir accès à la boussole de l'appareil.

La fonction `getDegrees(lat1, lon1, lat2, lon2, headX)` permet de connaitre la direction entre deux points `(lat1, lon1; lat2, lon2)` en fonction de l'orientation du téléphone par rapport au nord `(headX)`

### /pages/ParametresApplication.js
Ce fichier gère la page des paramètres de l'application.
Elle interagit avec la classe `DataManager` pour sauvegarder et obtenir chaque réglage.

Deux objets Dialog se trouvent à la fin du rendu de la classe principale, une pour l'entrée du nom par l'utilisateur, l'autre pour le laisser régler sa couleur en utilisant la librairie `react-native-color-picker`.
Ces fenêtres de dialog s'ouvrent lors de l'appuie sur le réglage respectif.

### ServerManager.js
Ce fichier gère la connexion avec le serveur.
Cette classe traite les informations reçus par le serveur concernant les autres utilisateurs et les garde en mémoire. De plus, elle envoie au serveur la position de l'utilisateur à chaque calcule, ainsi que ses paramètres (nom, couleur) lorsqu'il les change.
La ligne suivante est à paramétrer en la remplaçant par l'adresse du serveur :
```javascript
this.ws = new WebSocket('ws://192.168.1.73:12345');
```
Le protocole se trouve sur le [README.md principal](https://github.com/dept-info-iut-dijon/2020-21-Repo-Cekankonmanj#protocole-client-serveur)

### BeaconManager.js
Cette fichier s'occupe de la détection des beacons en utilisant la librairie react-native-kontaktio.
Cette librairie appelle une fonction à chaque scan en donnant les beacons scannés avec leur identifiants ainsi que la puissance du signal.
La fréquence de signal sur iOS étant trop rapide (1 par seconde), nous calculons une moyenne des 3 derniers scans pour avoir une actualisation plus modérées toutes les 3 secondes.

### TriangulationManager.js
Cette classe gère le calcule de la triangulation à chaque scan par le fichier BeaconsManager.js.
L'algorithme utilise une librairie intégrant l'algorithme de Levenberg-Marquardt. Ceci permet d'avoir un résultat précis.
De plus, pour améliorer cette précision nous faisons plusieurs choses :
 - Nous groupons les beacons par 3 par ordre croissant de signal
 - Nous calculons la position de chaque groupe en fonction des distances des beacons
 - Nous faisons la moyenne de ces calcules en divisant par 3 le coefficient à chaque groupe

Cette class gère aussi l'estimation de l'étage en cours

### DataManager.js
Cette classe gère la persistance des données (écriture et lecture) en utilisant la librairie react-native-async-storage. C'est une classe asynchrone, il faudra donc l'appeler de la bonne façon.

### list.json
Se fichier contient une liste de chaque beacon placé à l'IUT sous la forme `[majeur, mineur, encore_existant, latitude, longitude, id_batiment, etage]`
Il serait intéressant d'en faire une liste plus flexible comme
