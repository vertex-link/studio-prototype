import type { Response } from "@oak/oak";

const userSockets: Map<string, UpdateSocket> = new Map();
type Id = {
    id?: string;
};

type UpdateSocket = WebSocket & Id;
// TODO: Implement with WebRTC
// The plan is to do the first implementaion with WebSockets and create a fitting schema to update the entities and upgrade based on that schmea to a webrtc connection.
// This would involve moving parts of the update mechanism to the frontend and implement the signaling server on the backend side
export const createNewSocket = (
    socket: WebSocket,
    response: Response,
    id: string = "",
) => {
    console.log("crate new socket for", id);
    let returnSocket: UpdateSocket | undefined = userSockets.get(id);

    console.log("return socket init", returnSocket);

    if (returnSocket) {
        console.log("return socket exits. closing new socket", returnSocket);
        socket.close();
        returnSocket = userSockets.get(id);
        return response;
    }

    if (!returnSocket) {
        returnSocket = socket;
    }

    if (returnSocket) {
        console.log("socket register attempt");
        returnSocket.addEventListener("open", () => {
            returnSocket.id = id;
            userSockets.set(id, socket);
            // returnSocket.send(JSON.stringify({ userId: returnSocket.id }));
        });
    }

    returnSocket.onclose = () => {
        if (!returnSocket.id) return;
        userSockets.delete(returnSocket.id);
    };

    socket.onmessage = (event) => {
        userSockets.forEach((socket) => {
            if (socket.id !== id) {
                socket.send(event.data);
            }
        });
    };

    return response;
};
