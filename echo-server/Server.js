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
            this.#handleConnection(connection);
        }).listen(this.port, this.host, () => {
            process.stdout.write("Server started: " + this.host + ":" + this.port)
        })
    }

    #handleConnection (connection) {
        this.client = User.createClient(connection);
        this.broadcastMessage(`User ${this.client.id} connected\n`, this.client);
        this.client.socket.write(`Welcome to the server ID: ${this.client.id} -> ${this.userPool.length} online\n`);
        this.userPool.push(this.client);
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