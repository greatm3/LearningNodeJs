import net from "net";
import { User } from "./User.js";

const config = {
    host: "localhost",
    port: 59300
}

const clients = Object.create(null);

const server = net.createServer((socket) => {

    // create a unique client id on connection
    const clientID = Math.floor(Math.random() * 1000);
    clients[clientID] = socket;

    // function to broadcast the message to other clients except the sender

    function broadCast(message, senderId) {
        for (let id in clients) {
            if (clients[senderId] !== socket) {
                clients[id].write(message);
                console.log("User ID: " + id);
            }
        }
    }

    console.log("User connected!");

    let messageCount = 0;
    socket.write("Welcome to the echo chat server!\n")
    broadCast(`[${clientID}] just entered the chat\n`, clientID);

    socket.on("data", (data) => {

        messageCount++;
        let message = data.toString().trim();

        if (message !== "quit") {

            broadCast(`Message #${messageCount} -> [${clientID}] said ${message}!\n`, clientID);
            socket.write(`Message #${messageCount} -> You said: ${message}\n`);

        } else {

            socket.write("Goodbye!")

            // reset the message count to 0, and remove the client from the clients pool
            messageCount = 0;
            delete clients[clientID]

            // end connection and broadcast exit status
            broadCast(`${clientID}! just exited the chat\n`, clientID);
            socket.end();
            console.log("User exited the server.")

        }

    })
})

server.listen(config.port, config.host, () => {
    console.log("Echo server is running on port " + config.port);
})