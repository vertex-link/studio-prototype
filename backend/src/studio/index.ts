import type { Response } from "@oak/oak";

const userSockets: Map<string, WebSocket> = new Map();
type Id = {
    id?: string;
};

type UpdateSocket = WebSocket & Id;

export const createNewSocket = (
    socket: WebSocket,
    response: Response,
    id: string = "",
) => {
    let returnSocket: UpdateSocket | undefined = userSockets.get(id);

    if (returnSocket) {
        socket.close();
        returnSocket = userSockets.get(id);
        return response;
    }

    if (!returnSocket) {
        returnSocket = socket;
    }

    if (returnSocket) {
        returnSocket.addEventListener("open", () => {
            returnSocket.id = crypto.randomUUID();
            userSockets.set(returnSocket.id, socket);
            returnSocket.send(JSON.stringify({ userId: returnSocket.id }));
            console.log("a client connected!");
        });
    }

    returnSocket.onclose = () => {
        if (!returnSocket.id) return;
        userSockets.delete(returnSocket.id);
    };

    socket.onmessage = (event) => {
        userSockets.forEach((user) => {
            user.send(event.data);
        });
    };

    return response;
};

// Deno.serve({ port: 8080, hostname: "0.0.0.0" }, (req: Request) => {

//     // const headers = new Headers();
//     // const cookie: Cookie = {
//     //   name: "hungry",
//     //   value: "monster",
//     // };
//     // setCookie(headers, cookie);

//     // const url = new URL(req.url);

//     // if (req.body) {
//     //   const body = await req.text();
//     //   console.log("Body:", body);
//     // }

//     // return new Response(
//     //   `${req.method} ${url.pathname} \n with headers:\n ${
//     //     JSON.stringify(
//     //       Object.fromEntries([...headers]),
//     //     )
//     //   } \n \t url.searchParams \n${
//     //     JSON.stringify(
//     //       Object.fromEntries([...url.searchParams]),
//     //     )
//     //   } \n\n\nset response headers \n${
//     //     JSON.stringify(
//     //       Object.fromEntries([...headers]),
//     //     )
//     //   }`,
//     //   {
//     //     headers,
//     //   },
//     // );
//     // return new Response('Hello World');
// });
