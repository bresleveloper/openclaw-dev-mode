import { createRequire } from "node:module";
import path from "node:path";
//#region packages/gateway-client/src/websocket.ts
const require = createRequire(import.meta.url);
const wsPackageRoot = path.dirname(require.resolve("ws/package.json"));
const WebSocket = require(path.join(wsPackageRoot, "lib/websocket.js"));
const WebSocketServer = require(path.join(wsPackageRoot, "lib/websocket-server.js"));
const createWebSocketStream = require(path.join(wsPackageRoot, "lib/stream.js"));
//#endregion
export { WebSocketServer as n, createWebSocketStream as r, WebSocket as t };
