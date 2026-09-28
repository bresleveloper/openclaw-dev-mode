import { r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import { i as ApprovalResolveResult, r as ApprovalResolveParams, t as ApprovalDecision } from "./approvals-B-zk4kd_.js";
import { n as ChannelApprovalKind } from "./approval-types-DIxuby8L.js";
import "./index-hVvy_KTe.js";
//#region src/infra/approval-gateway-resolver.d.ts
type ResolveApprovalOverGatewayBaseParams = {
  cfg: OpenClawConfig;
  approvalId: string;
  decision: ApprovalDecision;
  channel?: string;
  accountId?: string | null;
  senderId?: string | null;
  gatewayUrl?: string;
  clientDisplayName?: string;
};
type ApprovalGatewayRuntime = {
  request: (method: "approval.resolve", params: ApprovalResolveParams, options?: {
    clientDisplayName?: string;
  }) => Promise<ApprovalResolveResult>;
};
type CanonicalResolveApprovalOverGatewayParams = ResolveApprovalOverGatewayBaseParams & {
  /** Explicit owner required by the canonical approval resolver. */
  approvalKind: ChannelApprovalKind;
  gatewayRuntime?: ApprovalGatewayRuntime;
  allowPluginFallback?: never;
  resolveMethod?: never;
};
/**
 * Shipped compatibility input for command-backed and older channel controls.
 * @deprecated Pass approvalKind so resolution uses the canonical approval service.
 */
type LegacyResolveApprovalOverGatewayParams = ResolveApprovalOverGatewayBaseParams & {
  approvalKind?: never;
  /**
   * Shipped legacy fallback after an exec lookup proves no match.
   * @deprecated Pass approvalKind so resolution uses the canonical approval service.
   */
  allowPluginFallback?: boolean;
  /**
   * Explicit legacy owner. Omission retains the shipped id-based routing contract.
   * @deprecated Pass approvalKind so resolution uses the canonical approval service.
   */
  resolveMethod?: ChannelApprovalKind;
};
/**
 * Resolves a shipped legacy approval control through its kind-specific Gateway adapter.
 * @deprecated Pass approvalKind so resolution uses the canonical approval service.
 */
declare function resolveApprovalOverGateway(params: LegacyResolveApprovalOverGatewayParams): Promise<void>;
/** Resolves a typed approval through the canonical operator approval service. */
declare function resolveApprovalOverGateway(params: CanonicalResolveApprovalOverGatewayParams): Promise<ApprovalResolveResult>;
//#endregion
export { resolveApprovalOverGateway as t };