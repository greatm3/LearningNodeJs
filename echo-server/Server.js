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
      user.socket.write(`Hello this is ${this.serverName}, please kindly provide a nickname to join: `)

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

    connection.on("data", (data) => {
      const message = data.toString().trim();

      if (message === "quit") {
        user.socket.end();
      } else {
        if (!user.isFirstMessage) {

          this.broadcastMessage(`[${user.nickname}]: ${message}\n`, user);
          user.messageCount++;
          this.emit("LOGINFO", `${user.id} -> new message: messageCount -> ${user.messageCount}`)

        } else {
          // parse/set nickname;
          const providedNickname = message;
          if (providedNickname === "") {
            user.socket.write("Please provide a valid nickname: ")
          } else {

            const nicknameExists = (providedNickname) => {
              for (let index = 0; index < this.userPool.length; index++) {
                if (this.userPool[index].nickname?.toLowerCase() === providedNickname.toLowerCase()) {
                  return true
                }
              }
              return false;
            }

            if (nicknameExists(providedNickname)) {
              user.socket.write(`${providedNickname} has been used, provide another one: `)
            } else {
              user.nickname = message;
              user.socket.write(`welcome to ${this.serverName} ${user.nickname}!, ${this.userPool.length} online\n`)
              this.broadcastMessage(`${user.nickname} joined the chat!\n`, user)
              user.isFirstMessage = false;
              this.userPool.push(user);
            }
          }

        }

      }
    })

    connection.on("end", () => {
      this.broadcastMessage(`${user.nickname} left the chat\n`, user);
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
