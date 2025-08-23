import Server, { userPool } from "./Server.js";

const server = new Server(59000, "localhost")

server.start()
server.start()
server.start()

console.log(server)
console.log(server.client)
console.log(userPool)