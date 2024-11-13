import type { Response } from "@oak/oak";

const userSockets: Map<string, UpdateSocket> = new Map();
type Id = {
    id?: string;
};

type UpdateSocket = WebSocket & Id;

export const createNewSocket = (
    socket: WebSocket,
    response: Response,
    id: string = "",
) => {
    console.log("crate new socket for", id);
    let returnSocket: UpdateSocket | undefined = userSockets.get(id);

    console.log("return socket init", returnSocket);

    if (returnSocket) {
        console.log("returen socket exits. closing new socket", returnSocket);
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
            console.log("a client connected!");
        });
    }

    returnSocket.onclose = () => {
        if (!returnSocket.id) return;
        userSockets.delete(returnSocket.id);
    };

    socket.onmessage = (event) => {
        // console.log(event);

        userSockets.forEach((socket) => {
            // console.log(socket);
            if (socket.id !== id) {
                socket.send(event.data);
            }
        });
    };

    return response;
};
