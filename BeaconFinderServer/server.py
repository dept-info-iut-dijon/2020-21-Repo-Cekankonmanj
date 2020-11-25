import logging
from websocket_server import WebsocketServer

clients = {}

def new_client(client, server):
	clients[client["id"]] = client
	print('nombre de clients :' + str(len(clients)))
	#server.send_message_to_all("Hey all, a new client has joined us")

def message_received(client, server, message):
	print('RECEIVED : ' + message)

def client_left(client, server):
	del clients[client["id"]]


server = WebsocketServer(12345, host='192.168.3.35')
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
