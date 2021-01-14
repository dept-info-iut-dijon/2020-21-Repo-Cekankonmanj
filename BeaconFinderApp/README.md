
# Membre du projet

Barbier Tom
Boujot Nicolas
Demonceaux Mathis
Fierimonte Margot

Ce projet a été réalisé pendant notre S3


# Installation

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


# Class

App.js: c'est le fichier principal de notre application, il s'occupe de l'affichage de l'application

/pages/CartePage.js: c'est le fichier qui s'occupe de tout se qui gère la page principale de localisation

/pages/GestionBeaconsPage.js: Ce fichier gère l'affichage de la page Réglages qui est lié au Beacons

/pages/mapStyleDark.json:  Ce fichier est le fichier, il est utilisé lorsque l'utilisateur est en mode nuit

/pages/mapStyleLight.json:  Ce fichier est le fichier, il est utilisé lorsque l'utilisateur est en mode jour

/pages/MinijeuxPage.js: Ce fichier gère tout ce qui lié à l'écran Mini jeux. Il y a actuellement un mini jeux le : tu chauffes

/pages/ParametresApplication.js:  Ce fichier gère la page des paramètres de l'application par exemple votre nom sur la carte ou votre couleur

ServerManager.js: Ce fichier gère la connexion avec le serveur, ici n'oubliez pas de configurer la ligne 35 avec l'adresse du serveur:

	this.ws = new WebSocket('ws://192.168.1.73:12345');

TriangulationManager.js: Ici est géré l'algorithme de la triangulation. Cet algorithme  
