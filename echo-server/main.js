import net from "net";

const config = {
    host: "localhost",
    port: 59300
}

const server = net.createServer((socket) => {
    socket.on("connect", () => {
        console.log("Client connected!");
    })

    socket.write("Say anything, and i'll echo it back!")

    socket.on("disconnect", () => {
        console.log("Client disconnected!");
    })
})

server.listen(config.port, config.host, () => {
    console.log("Echo server is running on port " + config.port);
})