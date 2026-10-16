import { a as WebSocketServer, i as RawData, n as Data, o as createWebSocketStream, t as ClientOptions } from "../websocket-DbnFnlN8.js";
import { Duplex } from "node:stream";
import { Socket } from "node:net";
//#region src/shared/one-time-ticket-store.d.ts
type OneTimeTicketStore<T> = {
  mint(payload: T, opts?: {
    ttlMs?: number;
    nowMs?: number;
    revokeSignal?: AbortSignal;
  }): {
    token: string;
    expiresAtMs: number;
  };
  /** Single use; a rejected owner check leaves an unexpired ticket available to its owner. */
  consume(token: string, nowMs?: number, accept?: (payload: T) => boolean): T | undefined;
  /** Drops a ticket without redeeming or expiring it (no `onExpire`). */
  delete(token: string): boolean;
  clear(): void;
  readonly size: number;
};
export declare function createOneTimeTicketStore<T>(opts: {
  ttlMs: number;
  now?: () => number;
  /** Called when an unconsumed ticket expires through its timer, consume() or clear(). */
  onExpire?: (payload: T, token: string) => void;
}): OneTimeTicketStore<T>;
//#endregion
//#region src/gateway/websocket-keepalive.d.ts
type WebSocketKeepaliveSocket = {
  readonly readyState: number;
  readonly bufferedAmount: number;
  ping(data?: undefined, mask?: undefined, callback?: (error?: Error) => void): void;
  on(event: "pong", listener: () => void): unknown;
  off(event: "pong" | "close", listener: () => void): unknown;
  once(event: "close", listener: () => void): unknown;
  terminate(): void;
};
type PingWrite = {
  pingWriteState: "pending" | "completed" | "failed";
};
type WebSocketHeartbeatDiagnostics = PingWrite & {
  lastPongAgeMs: number | undefined;
  bufferedBytes: number;
};
/** Keep idle transports active; only the connection owner may impose a pong deadline. */
export declare function startWebSocketKeepalive(socket: WebSocketKeepaliveSocket, onMissedPong?: (diagnostics: WebSocketHeartbeatDiagnostics) => void, transport?: Pick<Socket, "setTimeout" | "on" | "off" | "timeout">): () => void;
//#endregion
//#region src/shared/websocket-upgrade-reject.d.ts
type WebSocketUpgradeRejection = {
  status: 400 | 401 | 403 | 404 | 426 | 429 | 502 | 503 | 504;
  reason?: string;
  body?: {
    contentType: string;
    text: string;
  };
  headers?: Record<string, string>;
};
export declare function rejectWebSocketUpgrade(socket: Pick<Duplex, "end" | "destroy">, params: WebSocketUpgradeRejection): void;
//#endregion
//#region src/plugin-sdk/websocket-runtime.d.ts
export declare const WebSocket: typeof import("ws").WebSocket;
export type WebSocket = import("ws").WebSocket;
//#endregion
export { type ClientOptions, type Data, type OneTimeTicketStore, type RawData, type WebSocketHeartbeatDiagnostics, type WebSocketKeepaliveSocket, WebSocketServer, type WebSocketUpgradeRejection, createWebSocketStream };