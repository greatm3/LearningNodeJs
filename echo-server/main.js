import net from "net";

const config = {
    host: "localhost",
    port: 59300
}

const server = net.createServer((socket) => {
    socket.on("connect", () => {
        console.log("Client connected!\n");
    })

    socket.write("Say anything, and i'll echo it back!\n")

    socket.on("data", (data) => {
        socket.write("You said: " + data + "\n")
        console.log("They said: " + data + "\n")
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected!\n");
    })
})

server.listen(config.port, config.host, () => {
    console.log("Echo server is running on port " + config.port);
})