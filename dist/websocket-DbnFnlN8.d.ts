import { ClientOptions, Data, RawData } from "ws";
//#region packages/gateway-client/src/websocket.d.ts
type GatewayWebSocketTargetOptions = {
  url?: string;
  tlsFingerprint?: string;
  /** Original TLS peer hostname or IP when the transport endpoint is translated. */
  tlsServerName?: string;
};
declare const WebSocketServer: typeof import("ws").WebSocketServer;
declare const createWebSocketStream: typeof import("ws").createWebSocketStream;
type WebSocketServer = import("ws").WebSocketServer;
//#endregion
export { WebSocketServer as a, RawData as i, Data as n, createWebSocketStream as o, GatewayWebSocketTargetOptions as r, ClientOptions as t };