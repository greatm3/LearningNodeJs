### Echo Server with "net" module in node.

- Basically a simple TCP connection that receives a message, and echoes it back.

#### Features to add (ordered in levels of increasing difficulty, I think.)
- [x] Message counter - Count how many messages each person sends
- [x] Quit command - Type "quit" to disconnect nicely
- [ ] Welcome message - Show a custom greeting with the time  
---
- [ ] Multiple clients - Let several people connect at once
- [ ] Broadcast - Send one person's message to everyone else (basic chat)
- [ ] Nicknames - Let people choose a username
- [ ] Time stamps - Add time to each message
- [ ] Command system - Special commands like "/help" or "/time"
---
- [ ] Connection events - Emit events when people join/leave
- [ ] Message events - Emit events for different types of messages
- [ ] Error events - Emit events when things go wrong
---
- [ ] Save chat history - Write all messages to a file
- [ ] Load old messages - Show previous conversations when someone connects
- [ ] Log connections - Keep track of who connected when

# 