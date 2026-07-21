import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
//#region src/gateway/server-methods/connect.ts
/**
* Rejects `connect` after the WebSocket handshake already established identity.
*/
const connectHandlers = { connect: ({ respond }) => {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "connect is only valid as the first request"));
} };
//#endregion
export { connectHandlers };
