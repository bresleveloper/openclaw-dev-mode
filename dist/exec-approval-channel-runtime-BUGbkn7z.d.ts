import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { A as ExecApprovalRequest, M as ExecApprovalResolved, _ as PluginApprovalResolved, n as ChannelApprovalKind, r as NormalizedApprovalRequest, s as SystemAgentApprovalResolved, t as ApprovalRequestInput } from "./approval-types-DIxuby8L.js";
import "./exec-approvals-BN7bizpP.js";
import { i as GatewayReconnectPausedInfo } from "./client-CL1XJAG_.js";
//#region src/infra/exec-approval-channel-runtime.types.d.ts
type ApprovalRequestEvent$1 = ApprovalRequestInput;
type ApprovalResolvedEvent$1 = ExecApprovalResolved | PluginApprovalResolved | SystemAgentApprovalResolved;
/** Adapter implemented by a channel to deliver and finalize native approval prompts. */
type ExecApprovalChannelRuntimeAdapter<TPending, TRequest extends ApprovalRequestEvent$1 = ExecApprovalRequest, TResolved extends ApprovalResolvedEvent$1 = ExecApprovalResolved> = {
  label: string;
  clientDisplayName: string;
  cfg: OpenClawConfig;
  gatewayUrl?: string;
  /** Defaults to exec-only; include plugin when the adapter can handle plugin approvals. */
  eventKinds?: readonly ChannelApprovalKind[];
  isConfigured: () => boolean;
  shouldHandle: (request: NormalizedApprovalRequest<TRequest>) => boolean;
  deliverRequested: (request: NormalizedApprovalRequest<TRequest>) => Promise<TPending[]>;
  beforeGatewayClientStart?: () => Promise<void> | void;
  finalizeResolved: (params: {
    request: NormalizedApprovalRequest<TRequest>;
    resolved: TResolved;
    entries: TPending[];
  }) => Promise<void>;
  finalizeExpired?: (params: {
    request: NormalizedApprovalRequest<TRequest>;
    entries: TPending[];
  }) => Promise<void>;
  onStopped?: () => Promise<void> | void;
  nowMs?: () => number;
};
/** Runtime handle used by approval bootstrap code to manage a channel-native approval client. */
type ExecApprovalChannelRuntime<TRequest extends ApprovalRequestEvent$1 = ExecApprovalRequest, TResolved extends ApprovalResolvedEvent$1 = ExecApprovalResolved> = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  handleRequested: (request: TRequest) => Promise<void>;
  handleResolved: (resolved: TResolved) => Promise<void>;
  handleExpired: (approvalId: string) => Promise<void>;
  request: <T = unknown>(method: string, params: Record<string, unknown>) => Promise<T>;
};
//#endregion
//#region src/infra/exec-approval-channel-runtime.d.ts
type ApprovalRequestEvent = ApprovalRequestInput;
type ApprovalResolvedEvent = ExecApprovalResolved | PluginApprovalResolved | SystemAgentApprovalResolved;
/** Error raised when the gateway pauses approval reconnects after a terminal startup failure. */
declare class ExecApprovalChannelRuntimeTerminalStartError extends Error {
  readonly detailCode: string | null;
  constructor(info: GatewayReconnectPausedInfo, cause?: unknown);
}
/** Narrows terminal approval runtime startup failures for bootstrap retry policy. */
declare function isExecApprovalChannelRuntimeTerminalStartError(error: unknown): error is ExecApprovalChannelRuntimeTerminalStartError;
/** Creates the gateway-backed approval runtime that tracks pending requests and finalization. */
declare function createExecApprovalChannelRuntime<TPending, TRequest extends ApprovalRequestEvent = ExecApprovalRequest, TResolved extends ApprovalResolvedEvent = ExecApprovalResolved>(adapter: ExecApprovalChannelRuntimeAdapter<TPending, TRequest, TResolved>): ExecApprovalChannelRuntime<TRequest, TResolved>;
//#endregion
export { ExecApprovalChannelRuntimeAdapter as a, ExecApprovalChannelRuntime as i, createExecApprovalChannelRuntime as n, isExecApprovalChannelRuntimeTerminalStartError as r, ExecApprovalChannelRuntimeTerminalStartError as t };