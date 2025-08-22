import net from "net";

const config = {
    host: "localhost",
    port: 59300
}

const server = net.createServer((socket) => {

    console.log("Client connected!\n");

    let messageCount = 0;

    socket.write("Say anything, and i'll echo it back!\n")

    socket.on("data", (data) => {
        messageCount++;
        let message = data.toString().trim();

        if (message !== "quit") {
            socket.write(`Message #${messageCount} -> You said: ${message}\n`);
            console.log(`Message #${messageCount} -> They said: ${message}\n`)
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