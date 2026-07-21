import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { i as WHATSAPP_AUTH_UNSTABLE_CODE } from "./session-errors-UAdbjcYp.js";
import { a as makeWASocket, c as WAMessageKey, l as GroupMetadata, u as proto } from "./identity-DCTSP_rK.js";

//#region extensions/whatsapp/src/socket-timing.d.ts
type WhatsAppSocketTimingOptions = {
  keepAliveIntervalMs?: number;
  connectTimeoutMs?: number;
  defaultQueryTimeoutMs?: number;
};
//#endregion
//#region extensions/whatsapp/src/creds-persistence.d.ts
type CredsQueueWaitResult = "drained" | "timed_out";
declare function writeCredsJsonAtomically(authDir: string, creds: unknown): Promise<void>;
declare function waitForCredsSaveQueue(authDir?: string): Promise<void>;
declare function waitForCredsSaveQueueWithTimeout(authDir: string, timeoutMs?: number): Promise<CredsQueueWaitResult>;
//#endregion
//#region extensions/whatsapp/src/session.d.ts
/**
 * Create a Baileys socket backed by the multi-file auth store we keep on disk.
 * Consumers can opt into QR printing for interactive login flows.
 */
declare function createWaSocket(printQr: boolean, verbose: boolean, opts?: {
  authDir?: string;
  onQr?: (qr: string) => void;
  getMessage?: (key: WAMessageKey) => Promise<proto.IMessage | undefined>;
  cachedGroupMetadata?: (jid: string) => Promise<GroupMetadata | undefined>;
  waWebSocketUrl?: string | URL;
} & WhatsAppSocketTimingOptions): Promise<ReturnType<typeof makeWASocket>>;
type WhatsAppConnectionWaitOptions = {
  timeout: "none";
} | {
  timeoutMs: number;
};
declare function waitForWaConnection(sock: ReturnType<typeof makeWASocket>, options?: WhatsAppConnectionWaitOptions): Promise<void>;
declare function newConnectionId(): `${string}-${string}-${string}-${string}-${string}`;
//#endregion
//#region extensions/whatsapp/src/login-qr.d.ts
type StartWebLoginWithQrResult = {
  qrDataUrl?: string;
  message: string;
  connected?: boolean;
  code?: typeof WHATSAPP_AUTH_UNSTABLE_CODE;
};
declare function startWebLoginWithQr$1(opts?: {
  verbose?: boolean;
  timeoutMs?: number;
  force?: boolean;
  accountId?: string;
  runtime?: RuntimeEnv;
}): Promise<StartWebLoginWithQrResult>;
declare function waitForWebLogin$1(opts?: {
  timeoutMs?: number;
  runtime?: RuntimeEnv;
  accountId?: string;
  currentQrDataUrl?: string;
}): Promise<{
  connected: boolean;
  message: string;
  qrDataUrl?: string;
}>;
//#endregion
//#region extensions/whatsapp/login-qr-runtime.d.ts
type StartWebLoginWithQr = typeof startWebLoginWithQr$1;
type WaitForWebLogin = typeof waitForWebLogin$1;
declare function startWebLoginWithQr(...args: Parameters<StartWebLoginWithQr>): ReturnType<StartWebLoginWithQr>;
declare function waitForWebLogin(...args: Parameters<WaitForWebLogin>): ReturnType<WaitForWebLogin>;
//#endregion
export { waitForWaConnection as a, waitForCredsSaveQueueWithTimeout as c, newConnectionId as i, writeCredsJsonAtomically as l, waitForWebLogin as n, CredsQueueWaitResult as o, createWaSocket as r, waitForCredsSaveQueue as s, startWebLoginWithQr as t, WhatsAppSocketTimingOptions as u };