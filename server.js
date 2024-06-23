const express = require("express")
const path = require("path")
const WebSocket = require("ws")

const server = express()

server.get("/:document_name", (request, response) =>{
    document_name = request.params.document_name
    return response.sendFile(path.join(__dirname, document_name));
})

server.get("/js/:document_name", (request, response) =>{
    document_name = request.params.document_name
    return response.sendFile(path.join(__dirname, "/static/js/"+document_name))
})

// Web Socket Server //
const web_socket_server = new WebSocket.Server({port: 8080})
var rooms = {}

web_socket_server.on('connection', (ws, request) => {

    var room = request.url.slice(1)
    if(!(room in rooms)){
        rooms[room] = {
            "users": new Set,
            "data": []
        }
    }

    rooms[room].users.add(ws)

    rooms[room].users.forEach(user =>{
        if (user.readyState > 1){
            rooms[room].users.delete(user)
        }
    })


    ws.send(JSON.stringify(rooms[room].data))

    ws.on('message', (message) => {

        if (message.includes("add_message")){
            message = message.toString().replace("add_message", "")
            message_json = JSON.parse(message)
            message_id = message_json.id

            for (unit_message in rooms[room].data){
                if(rooms[room].data[unit_message].id == message_id){
                    return -1
                }
            }
            rooms[room].data.push(message_json)
        }
        else if(message.includes("remove_message")){
            message = message.toString().replace("remove_message", "")
            message_json = JSON.parse(message)
            message_id = message_json.id

            rooms[room].data.forEach((unit_message, index) =>{
                if (unit_message.id == message_id){
                    rooms[room].data.splice(index, 1)
                }
            })

        }

        rooms[room].users.forEach(user =>
            user.send(JSON.stringify(rooms[room].data))
        )

    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000)