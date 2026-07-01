import { An as AcpRuntimeTurnResultError, Dn as AcpRuntimeTurnAttachment, En as AcpRuntimeTurn, On as AcpRuntimeTurnInput, Sn as AcpRuntimeHandle, Tn as AcpRuntimeStatus, _n as AcpRuntime, bn as AcpRuntimeEnsureInput, jn as AcpSessionUpdateTag, kn as AcpRuntimeTurnResult, vn as AcpRuntimeCapabilities, xn as AcpRuntimeEvent, yn as AcpRuntimeDoctorReport } from "./types.openclaw-R57aE8ho.js";
import { a as unregisterAcpRuntimeBackend, c as isAcpRuntimeError, i as requireAcpRuntimeBackend, n as getAcpRuntimeBackend, o as AcpRuntimeError, r as registerAcpRuntimeBackend, s as AcpRuntimeErrorCode, t as AcpRuntimeBackend } from "./registry-DRKtYHqt.js";
import { tryDispatchAcpReplyHook } from "./acp-runtime-backend.js";
import { i as readAcpSessionEntry, r as AcpSessionStoreEntry } from "./manager.core-BpSsS0Sk.js";
import { t as getAcpSessionManager } from "./manager-ajYN81Gl.js";

//#region src/plugin-sdk/acp-runtime.d.ts
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
} & {
  resetAcpRuntimeBackendsForTests(): void;
  getAcpRuntimeRegistryGlobalStateForTests(): {
    backendsById: Map<string, AcpRuntimeBackend>;
  };
};
//#endregion
export { type AcpRuntime, type AcpRuntimeCapabilities, type AcpRuntimeDoctorReport, type AcpRuntimeEnsureInput, AcpRuntimeError, type AcpRuntimeErrorCode, type AcpRuntimeEvent, type AcpRuntimeHandle, type AcpRuntimeStatus, type AcpRuntimeTurn, type AcpRuntimeTurnAttachment, type AcpRuntimeTurnInput, type AcpRuntimeTurnResult, type AcpRuntimeTurnResultError, type AcpSessionStoreEntry, type AcpSessionUpdateTag, testing as __testing, testing, getAcpRuntimeBackend, getAcpSessionManager, isAcpRuntimeError, readAcpSessionEntry, registerAcpRuntimeBackend, requireAcpRuntimeBackend, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend };