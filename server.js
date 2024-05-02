import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
const clients = new Map(); // has to be a Map instead of {} due to non-string keys
const wss = new WebSocketServer({ port: 3030 }); 


wss.on('connection', (ws) => {
    // create an id to track the client
    const id = randomUUID();
    clients.set(ws, id);
    console.log(`new connection assigned id: ${id}`);

    // send a message to all connected clients upon receiving a message from one of the connected clients
    ws.on('message', (data) => {
        serverBroadcast(`${data}`);
    });

    // stop tracking the client upon that client closing the connection
    ws.on('close', () => {
        console.log(`connection (id = ${clients.get(ws)}) closed`);
        clients.delete(ws);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    // send the id back to the newly connected client

});

function serverBroadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
console.log('The server is running and waiting for connections: 3030');