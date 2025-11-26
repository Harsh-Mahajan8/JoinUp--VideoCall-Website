import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export default function connectToSocket(server) {
    const io = new Server(server,{
        cors:{
            origin:"*",
            method:["GET", "POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    });

    io.on("connection", (socket) => {
        console.log("Something is connected~");
        socket.on("joinCall", (path) => {
            if (connections[path] === undefined) {
                connections[path] = []
            }

            connections[path].push(socket.id);//connections ={[/room] = [socket1]}

            timeOnline[socket.id] = new Date();//timeOnline = {sockect1 = new Date()}

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("userJoined", socket.id, connections[path]); // connections[/room][socket0-> length-1] emit that this(current user joined) and the linst of users(sockets) in the room
                if (messages[path] !== undefined) {
                    for (let a = 0; a < messages[path].length; a++) {
                        io.to(socket.id).emit("chatMessage", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socketIdSender'])//messages={ sender: "Bob", data: "Hi Alice!", socketIdSender: "socketID_2" } emit this to current joined user

                    }
                }
            }
        })

        socket.on("signal", (toID, message) => {
            io.to(toID).emit("signal", socket.id, message)
        })

        socket.on("chatMsg", (data, sender) => {
            //msg send from client 
            const [matchingRoom, found] = Object.entries(connections)//entires inside connections converted into array[rooomname, [sockets.....]]
                .reduce(([room, isFound], [roomKey, roomValue]) => {

                    if (!isFound && roomValue.includes(socket.id)) {//havent found yet and is present in this room 
                        return [roomKey, true];//return that roomname and boolean value
                    }
                    retunr[room, isFound];
                }, ["", false]
                );

            if (found === true) {
                if (messages[matchingRoom] === undefined) {//if there is no such room  then create an intialize it
                    messages[matchingRoom] = []
                }
                //if there is a matching room then send the msg in that room
                messages[matchingRoom].push({
                    "sender": sender,
                    "data": data,
                    "socketIdSender": socket.id
                });

                console.log("message", key, ':', sender, data)

                connections[matchingRoom].forEach(e => {
                    io.to(e).emit('chatMessages', data, sender, socket.id);
                });
            }
        })

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            var key;//room id
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {//creating deep copies k,v key(roomod) value(socketid)

                for (a = 0; a < v.length; a++) {
                    if (v[a] === socket.id) {
                        key = k;//once we find that socket if then set key -> room id

                        for (b = 0; b < connections[key].length; b++) {//no of sockets connected in that room
                            io.to(connections[key][a]).emit("userLeft", socket.id);//send to every connected user in that room

                        } 
                        
                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index, 1);

                        if(connections[key].length === 0){
                            delete connections[key];
                        }
                    }
                }
            }
        })
    })

    return io;
}