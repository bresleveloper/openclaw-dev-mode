import { An as AcpRuntimeTurnResultError, Dn as AcpRuntimeTurnAttachment, En as AcpRuntimeTurn, On as AcpRuntimeTurnInput, Sn as AcpRuntimeHandle, Tn as AcpRuntimeStatus, _n as AcpRuntime, bn as AcpRuntimeEnsureInput, jn as AcpSessionUpdateTag, kn as AcpRuntimeTurnResult, vn as AcpRuntimeCapabilities, xn as AcpRuntimeEvent, yn as AcpRuntimeDoctorReport } from "./types.openclaw-R57aE8ho.js";
import { at as PluginHookReplyDispatchResult, it as PluginHookReplyDispatchEvent, rt as PluginHookReplyDispatchContext } from "./hook-types-D7oQwM1Q.js";
import { a as unregisterAcpRuntimeBackend, c as isAcpRuntimeError, i as requireAcpRuntimeBackend, n as getAcpRuntimeBackend, o as AcpRuntimeError, r as registerAcpRuntimeBackend, s as AcpRuntimeErrorCode } from "./registry-DRKtYHqt.js";

//#region src/plugin-sdk/acp-runtime-backend.d.ts
/**
 * Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
 * Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
 */
declare function tryDispatchAcpReplyHook(event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext): Promise<PluginHookReplyDispatchResult | void>;
//#endregion
export { type AcpRuntime, type AcpRuntimeCapabilities, type AcpRuntimeDoctorReport, type AcpRuntimeEnsureInput, AcpRuntimeError, type AcpRuntimeErrorCode, type AcpRuntimeEvent, type AcpRuntimeHandle, type AcpRuntimeStatus, type AcpRuntimeTurn, type AcpRuntimeTurnAttachment, type AcpRuntimeTurnInput, type AcpRuntimeTurnResult, type AcpRuntimeTurnResultError, type AcpSessionUpdateTag, getAcpRuntimeBackend, isAcpRuntimeError, registerAcpRuntimeBackend, requireAcpRuntimeBackend, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend };