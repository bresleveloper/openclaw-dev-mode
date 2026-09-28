import { a as isDebugProxyGlobalFetchPatchInstalled, c as closeDebugProxyCaptureStore, d as CaptureQueryPreset, f as CaptureQueryRow, g as resolveEffectiveDebugProxyUrl, h as resolveDebugProxySettings, i as finalizeDebugProxyCapture, l as getDebugProxyCaptureStore, m as createDebugProxyWebSocketAgent, n as captureWsEvent, o as DebugProxyCaptureStore, p as CaptureSessionSummary, r as initializeDebugProxyCapture, s as acquireDebugProxyCaptureStore, t as captureHttpExchange, u as CaptureEventRecord } from "../kysely-sync-j49J-6_6.js";
import "kysely";
//#region src/proxy-capture/store-readonly.d.ts
type DebugProxyCaptureReader = {
  getSessionEvents(sessionId: string, limit?: number): Array<Record<string, unknown>>;
  readBlob(blobId: string): string | null;
};
/** Read capture rows without joining or mutating the shared-state writer lifecycle. */
export declare function createDebugProxyCaptureReader(params: {
  env: NodeJS.ProcessEnv;
}): DebugProxyCaptureReader;
//#endregion
export { type CaptureEventRecord, type CaptureQueryPreset, type CaptureQueryRow, type CaptureSessionSummary, type DebugProxyCaptureReader, DebugProxyCaptureStore, acquireDebugProxyCaptureStore, captureHttpExchange, captureWsEvent, closeDebugProxyCaptureStore, createDebugProxyWebSocketAgent, finalizeDebugProxyCapture, getDebugProxyCaptureStore, initializeDebugProxyCapture, isDebugProxyGlobalFetchPatchInstalled, resolveDebugProxySettings, resolveEffectiveDebugProxyUrl };