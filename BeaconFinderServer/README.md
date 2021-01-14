# Serveur
Ce serveur permet la communication avec les utilisateurs de l'application afin de partager leur position ainsi que leur identité.

## Outils nécessaires
Ce serveur fonctionne sur Python3.6 minimum.
De plus, la librairie websocket-server est nécessaire, elle s'installe avec cette commande :
```
pip install websocket-server
```
## Mise en route

Avant de lancer le serveur, pensez à changer la ligne 58 avec votre adresse IP :
```python
server = WebsocketServer(12345, host='192.168.1.73')
```

Puis il vous suffit de lancer le serveur :
```
python server.py
```

## Documentation
Le serveur fonctionne sur trois fonctions appelées automatiquement :
### `new_client(client, server)`
Cette fonction est appelée lors de la connexion d'un utilisateur.

### `message_received(client, server, message)`
Cette fonction est appelée lors de la réception d'un message par un client.

### `new_client(client, server)`
Cette fonction est appelée lors de la déconnexion d'un utilisateur.

___

### `server.send_message(client, message)`
Cette fonction envoie le message `message` au client `client`
