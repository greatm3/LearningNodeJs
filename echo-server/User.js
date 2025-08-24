class User {
    constructor(socket) {
        this.socket = socket;
        this.messageCount = 0;
    }

    static createClient(socket) {
        return new User(socket);
    }
}

export default User;