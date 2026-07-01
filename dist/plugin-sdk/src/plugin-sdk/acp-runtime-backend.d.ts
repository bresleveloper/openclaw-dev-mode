import type { PluginHookReplyDispatchContext, PluginHookReplyDispatchEvent, PluginHookReplyDispatchResult } from "../plugins/types.js";
export { AcpRuntimeError, isAcpRuntimeError } from "../acp/runtime/errors.js";
export type { AcpRuntimeErrorCode } from "../acp/runtime/errors.js";
export { getAcpRuntimeBackend, registerAcpRuntimeBackend, requireAcpRuntimeBackend, unregisterAcpRuntimeBackend, } from "../acp/runtime/registry.js";
export type { AcpRuntime, AcpRuntimeCapabilities, AcpRuntimeDoctorReport, AcpRuntimeEnsureInput, AcpRuntimeEvent, AcpRuntimeHandle, AcpRuntimeStatus, AcpRuntimeTurn, AcpRuntimeTurnAttachment, AcpRuntimeTurnInput, AcpRuntimeTurnResult, AcpRuntimeTurnResultError, AcpSessionUpdateTag, } from "@openclaw/acp-core/runtime/types";
/**
 * Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
 * Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
 */
export declare function tryDispatchAcpReplyHook(event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext): Promise<PluginHookReplyDispatchResult | void>;
