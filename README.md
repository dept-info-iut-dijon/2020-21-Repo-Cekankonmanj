

# 2020-21-Repo-Cekankonmanj

Ce projet, réalisé pour notre projet tutoré de S3, avait pour but de créer une application permettant de localiser sois-même ainsi que ses amis dans l'IUT avec précision avec l'aide des beacons placés partout dans les bâtiments.

## Membre du projet

 - Barbier Tom
 - Boujot Nicolas
 - Demonceaux Mathis
 - Fierimonte Margot

## Organisation du projet

L'application iOS et Android se trouve dans le dossier [BeaconFinderApp](https://github.com/dept-info-iut-dijon/2020-21-Repo-Cekankonmanj/tree/master/BeaconFinderApp).

Le serveur se trouve dans le dossier [BeaconFinderServer](https://github.com/dept-info-iut-dijon/2020-21-Repo-Cekankonmanj/tree/master/BeaconFinderServer).

## Protocole client-serveur
### Client -> Serveur
##### `set|color|{couleur}`
Règle la couleur de l'utilisateur pour les autres, à remplacer `{couleur}` par la couleur choisie en hexadécimal, exemple #ff00ff. Se fait à la connexion.
##### `set|name|{nom}`
Règle le nom de l'utilisateur pour les autres, à remplacer `{nom}` par le nom choisi. Se fait à la connexion.
##### `ready`
Packet à envoyer au serveur lorsque toutes les variables sont set pour lui dire que l'utilisateur est prêt à être envoyé aux autres.
##### `update|color|{couleur}`
De même que `set|color|{couleur}` lors de la modification.
##### `update|name|{nom}`
De même que `set|name|{nom}` lors de la modification.
##### `update|position|{latitude}|{longitude}`
Met à jour la position de l'utilisateur pour les autres utilisateurs.

`{latitude}` : la nouvelle latitude calculée

`{longitude}` : la nouvelle longitude calculée


### Client <- Serveur
##### `add|client|{id}|{couleur}|{nom}`
Envoie un nouvel utilisateur.

`{id}` : identifiant de l'utilisateur

`{couleur}` : couleur de l'utilisateur

`{nom}` : nom de l'utilisateur

##### `remove|client|{id}`
Supprime un utilisateur lors de sa déconnexion.

`{id}` : identifiant de l'utilisateur

##### `update|position|{id}|{latitude}|{longitude}`
Met à jour la position de l'utilisateur `{id}`

`{id}` : identifiant de l'utilisateur

`{latitude}` : la nouvelle latitude

`{longitude}` : la nouvelle longitude

##### `update|color|{id}|{couleur}`
Met à jour la couleur `{couleur}` de l'utilisateur `{id}`
##### `update|name|{id}|{nom}`
Met à jour le nom `{nom}` de l'utilisateur `{id}`
