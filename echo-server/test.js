import Server from "./Server.js";

const config = {
    logger: console.log
}
const server = new Server(59000, "localhost", config)

server.start()