import User from "./User.js";
import net from "net";
import { EventEmitter } from "events";

class Server extends EventEmitter {
  constructor(port, host, serverName) {
    super();
    this.port = port;
    this.host = host;
    this.serverName = serverName;
    this.userPool = [];
  }

  start() {
    const server = net.createServer((connection) => {

      const user = User.createClient(connection);
      user.id = this.#assignID();


      // on connection, set the isFirstMessage prop of the User to true, this property will be the condition to assign a nickname to a connected user
      // and ask for the nickname
      user.isFirstMessage = true;
      user.socket.write(`Welcome to ${this.serverName}, please kindly provide a nickname: `)

      // takes in the connection: socket and the new user that was created as parameters
      this.#handleConnection(connection, user);
      this.emit("LOGINFO", `new user connected -> ${user.id}`)

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

  // handles the "data" and "end" events emitted by the connection
  #handleConnection(connection, user) {
    this.broadcastMessage(`User ${user.nickname} connected\n`, user);
    user.socket.write(`Welcome to the server ID: ${user.nickname} -> ${this.userPool.length} online\n`);
    this.userPool.push(user);

    connection.on("data", (data) => {
      const data = data.toString().trim();

      if (data.toString().trim() === "quit") {
        user.socket.end();
      } else {
        if (!user.isFirstMessage) {

          this.broadcastMessage(`[${user.nickname}]: ${data.toString().trim()}\n`, user);
          user.messageCount++;
          this.emit("LOGINFO", `${user.id} -> new message: messageCount -> ${user.messageCount}`)
        } else {
          // parse/set nickname;
          const providedNickname = data;

        }

      }
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

  }

  // this right now, is not practical i'm just using it for the mean time.
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
