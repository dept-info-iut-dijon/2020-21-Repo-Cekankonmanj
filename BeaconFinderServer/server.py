import logging
from websocket_server import WebsocketServer


def new_client(client, server):
	client["position"] = {}
	client["position"]["latitude"] = 0
	client["position"]["longitude"] = 0
	client["color"] = "#000000"
	client["name"] = "Default_server"
	print('nombre de clients :' + str(len(server.clients)))
	#server.send_message_to_all("Hey all, a new client has joined us")

def message_received(client, server, message):
	print('RECEIVED '+ str(client["id"]) +': ' + message)
	command = message.split('|')[0]
	args = message.split('|')[1:]
	if(command=="update"):
		if(args[0]=="position"):
			client["position"]["latitude"] = float(args[1])
			client["position"]["longitude"] = float(args[2])
			for other_client in server.clients:
				if(other_client['id']!=client["id"]):
					send_position(other_client, client)
		elif(args[0] == "color"):
			client["color"] = args[1]
			for other_client in server.clients:
				if(other_client['id']!=client["id"]):
					server.send_message(other_client, f"update|color|{client['id']}|{args[1]}")

	elif(command=="set"):
		client[args[0]] = '|'.join(args[1:])

	elif(command=="ready"):
		for other_client in server.clients:
			if(other_client['id']!=client["id"]):
				server.send_message(other_client, f"add|client|{client['id']}|{client['color']}|{client['name']}")
				server.send_message(client, f"add|client|{other_client['id']}|{other_client['color']}|{other_client['name']}")

def send_position(client, other_client):
	lat = other_client["position"]["latitude"]
	lon = other_client["position"]["longitude"]
	userid = other_client["id"]
	server.send_message(client, f"update|position|{userid}|{lat}|{lon}")

def client_left(client, server):
	for other_client in server.clients:
		if(other_client['id']!=client["id"]):
			server.send_message(other_client, f"remove|client|{client['id']}")


server = WebsocketServer(12345, host='192.168.3.34')
server.set_fn_new_client(new_client)
server.set_fn_client_left(client_left)
server.set_fn_message_received(message_received)
server.run_forever()
