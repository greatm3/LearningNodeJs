import {User} from "./User.js";
import net from "net";

class Server {
    constructor (port, host) {
        this.port = port;
        this.host = host;
        this.userPool = [];
    }

    start() {
        net.createServer((connection) => {
            const user = User.createClient(connection);
            user.id = this.#assignID();

            this.#handleConnection(connection, user);

            connection.on("data", (data) => {
                this.broadcastMessage(`[${user.id}]: ${data.toString().trim()}\n`, user);
                user.messageCount++;
            })

            connection.on("end", () => {
                this.broadcastMessage(`[${user.id}] left the chat\n`, user)
                this.userPool = this.userPool.filter((client) => {
                    if (client.id !== user.id) {
                        return user;
                    }
                })
            })

        }).listen(this.port, this.host, () => {
            console.log("Server started: " + this.host + ":" + this.port + "\n")
        })
    }

    #handleConnection (connection, user) {
        this.#assignID(user)
        this.broadcastMessage(`User ${user.id} connected\n`, user);
        user.socket.write(`Welcome to the server ID: ${user.id} -> ${this.userPool.length} online\n`);
        this.userPool.push(user);
    }

    #assignID() {
        return Math.floor((Math.random() * 10000) + Date.now() / 5000);
    }

    broadcastMessage (message, sender) {
        this.userPool.forEach((user) => {
            if (user.socket !== sender.socket) {
                user.socket.write(message);
            }
        })
    }

}

export default Server;