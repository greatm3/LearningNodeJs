import User from "./User.js";
import net from "net";
import {EventEmitter} from "events";

class Server extends EventEmitter {
    constructor(port, host) {
        super();
        this.port = port;
        this.host = host;
        this.userPool = [];
    }

    start() {
        const server = net.createServer((connection) => {

            const user = User.createClient(connection);
            user.id = this.#assignID();

            this.#handleConnection(connection, user);
            this.emit("LOGINFO", `new user connected -> ${user.id}`)

            connection.on("data", (data) => {
                this.broadcastMessage(`[${user.id}]: ${data.toString().trim()}\n`, user);
                user.messageCount++;
                this.emit("LOGINFO", `${user.id} -> new message: messageCount -> ${user.messageCount}`)
            })

            connection.on("end", () => {
                this.broadcastMessage(`[${user.id}] left the chat\n`, user);
                this.emit("LOGINFO", `${user.id} exited the chat`)
                this.userPool = this.userPool.filter((client) => {
                    if (client.id !== user.id) {
                        return client;
                    }
                })
            })

            connection.on("error", (err) => {
                this.emit("LOGERROR", err.message);
            })

        })

        server.listen(this.port, this.host, () => {
            console.log("Server started: " + this.host + ":" + this.port);
            this.emit("LOGINFO", `Server started: ${this.host}:${this.port}`);
        })

        // code to exit in case server shutdown mistakenly or using CTRL + C
        process.on("SIGINT", async () => {
            console.log("SHUTTING DOWN SERVER...")

            server.close();
            this.emit("LOGINFO", `Server closed: ${this.host}:${this.port}`);

            this.userPool.forEach((user) => {
                user.socket.write("Server is shutting down, GoodBye")
                user.socket.end();
            })

            setTimeout(() => {
                console.log("Server closed");
                process.exit(0);
            }, 500)
        })

    }

    #handleConnection(connection, user) {
        this.broadcastMessage(`User ${user.id} connected\n`, user);
        user.socket.write(`Welcome to the server ID: ${user.id} -> ${this.userPool.length} online\n`);
        this.userPool.push(user);
    }

    #assignID() {
        return Math.floor((Math.random() * 10000) + Date.now() / 5000);
    }

    broadcastMessage(message, sender) {
        this.userPool.forEach((user) => {
            if (user.socket !== sender.socket) {
                user.socket.write(message);
            }
        })
    }

}

export default Server;