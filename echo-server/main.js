import net from "net";

const config = {
    host: "localhost",
    port: 59300
}

const server = net.createServer((socket) => {



    socket.on("connect", () => {
        console.log("Client connected!\n");
    })

    let messageCount = 0;

    socket.write("Say anything, and i'll echo it back!\n")

    socket.on("data", (data) => {
        messageCount++;
        let message = data.toString();
        socket.write(`Message #${messageCount} -> You said: ${message}`);
        console.log(`Message #${messageCount} -> They said: ${message}`)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected!\n");
    })
})

server.listen(config.port, config.host, () => {
    console.log("Echo server is running on port " + config.port);
})