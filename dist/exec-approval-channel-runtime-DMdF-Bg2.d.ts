import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import { S as ExecApprovalResolved, b as ExecApprovalRequest, i as NormalizedApprovalRequest, n as ApprovalResolved, r as ChannelApprovalKind, t as ApprovalRequestInput } from "./approval-types-DOLowId2.js";
import "./exec-approvals-DNGb8MUN.js";
import "./client-DIJ-R7Dq.js";
//#region src/infra/exec-approval-channel-runtime.types.d.ts
type ApprovalRequestEvent = ApprovalRequestInput;
/** Adapter implemented by a channel to deliver and finalize native approval prompts. */
type ExecApprovalChannelRuntimeAdapter<TPending, TRequest extends ApprovalRequestEvent = ExecApprovalRequest, TResolved extends ApprovalResolved = ExecApprovalResolved> = {
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
type ExecApprovalChannelRuntime<TRequest extends ApprovalRequestEvent = ExecApprovalRequest, TResolved extends ApprovalResolved = ExecApprovalResolved> = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  handleRequested: (request: TRequest) => Promise<void>;
  handleResolved: (resolved: TResolved) => Promise<void>;
  handleExpired: (approvalId: string) => Promise<void>;
  request: <T = unknown>(method: string, params: Record<string, unknown>) => Promise<T>;
};
//#endregion
export { ExecApprovalChannelRuntimeAdapter as n, ExecApprovalChannelRuntime as t };