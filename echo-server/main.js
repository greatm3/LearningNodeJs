import net from "net";

const config = {
    host: "localhost",
    port: 59300
}

const clients = Object.create(null);

const server = net.createServer((socket) => {

    // create a unique client id on connection
    const clientID = Math.floor(Math.random() * 1000);

    clients[clientID] = socket;

    console.log("Client connected!\n");

    let messageCount = 0;

    socket.write("Welcome to the echo chat server!\n")

    // function to broadcast the message to other clients except the sender

    function broadCast(message) {
        for (let id in clients) {
            if (socket !== clients[id]) {
                clients[id].write(`Message #${messageCount} -> [user ${id}] said: ${message}\n`);
            }
        }
    }

    socket.on("data", (data) => {

        messageCount++;
        let message = data.toString().trim();

        if (message !== "quit") {
            broadCast(message);
        } else {
            socket.write("Goodbye!")
            messageCount = 0;
            socket.end();
            console.log("Client exited the server.")
        }

    })
})

server.listen(config.port, config.host, () => {
    console.log("Echo server is running on port " + config.port);
})