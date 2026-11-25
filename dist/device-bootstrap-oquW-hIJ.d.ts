import { $D as DeviceBootstrapTokenRecord, Tu as DevicePairingApprovalOptions, nO as DeviceBootstrapProfileInput, wu as ApproveDevicePairingResult } from "./config-contracts-hzlacViZ.js";
import { r as OpenClawConfig } from "./types.openclaw-D8uW-XQA.js";
declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
declare function approveDevicePairing(requestId: string, options: DevicePairingApprovalOptions, baseDir?: string): Promise<ApproveDevicePairingResult>;
type DeviceBootstrapTokenIssueParams = {
  /** Revalidate caller authority at the worker's transaction and commit boundaries. */
  assertCurrent?: () => void;
  baseDir?: string;
  profile?: DeviceBootstrapProfileInput;
  roles?: readonly string[];
  scopes?: readonly string[];
};
/** Issue a short-lived generic bootstrap token with a bounded role/scope handoff profile. */
declare function issueDeviceBootstrapToken(params?: DeviceBootstrapTokenIssueParams): Promise<{
  token: string;
  expiresAtMs: number;
}>;
declare function clearDeviceBootstrapTokens(params?: {
  baseDir?: string;
  assertCurrent?: () => void;
}): Promise<{
  removed: number;
}>;
/** Revoke a bootstrap token unless its cloud-worker environment is already bound to the token's device. */
declare function revokeDeviceBootstrapToken(params: {
  token: string;
  baseDir?: string;
}): Promise<{
  removed: boolean;
  record?: DeviceBootstrapTokenRecord;
}>;
declare const resolvePairingGatewayUrl: (cfg: OpenClawConfig, opts: {
  env: NodeJS.ProcessEnv;
  publicUrl?: string;
  publicOriginPreference?: "fallback" | "prefer";
  urlPathMode?: "origin-only" | "preserve";
  preferRemoteUrl?: boolean;
  useLocalGateway?: boolean;
  forceSecure?: boolean;
  runCommandWithTimeout?: (argv: string[], opts: {
    timeoutMs: number;
    maxOutputBytes?: number;
  }) => Promise<{
    code: number | null;
    stdout: string;
    stderr?: string;
  }>;
  networkInterfaces: () => ReturnType<typeof import("node:os").networkInterfaces>;
}) => Promise<{
  url?: string;
  source?: string;
  error?: string;
}>;
export { approveDevicePairing as a, revokeDeviceBootstrapToken as i, clearDeviceBootstrapTokens as n, issueDeviceBootstrapToken as r, resolvePairingGatewayUrl as t };