import { r as OpenClawConfig } from "../types.openclaw-DWWUw8hA.js";
import "../openclaw-state-db-Yba_0aSZ.js";
import { a as DeviceBootstrapBoundContextInput, c as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, d as DeviceBootstrapPurpose, f as PAIRING_SETUP_BOOTSTRAP_PROFILE, h as WorkerOperations, l as DeviceBootstrapProfile, m as WorkerOperationContext, n as ApproveDevicePairingResult, o as DeviceBootstrapTokenRecord, p as normalizeDeviceBootstrapProfile, r as DevicePairingApprovalOptions, s as DevicePairSetupCompletionRecord, t as listDevicePairing, u as DeviceBootstrapProfileInput } from "../device-pairing-CNJlbrAV.js";
import "../config-contracts--AJ2MFWu.js";
//#region src/infra/device-pairing-approval.d.ts
export declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
export declare function approveDevicePairing(requestId: string, options: DevicePairingApprovalOptions, baseDir?: string): Promise<ApproveDevicePairingResult>;
//#endregion
//#region src/infra/device-bootstrap.worker-kernel.d.ts
declare const deviceBootstrapOperations: {
  "bootstrap.issue": (input: {
    profile: DeviceBootstrapProfile;
    setupId?: string;
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    token: string;
    expiresAtMs: number;
  };
  "bootstrap.ensure": (input: {
    profile: DeviceBootstrapProfileInput;
    setupId: string;
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    status: "pending";
    token: string;
    expiresAtMs: number;
    setupId: string;
  } | {
    status: "completed";
    setupId: string;
    deviceId: string;
  };
  "bootstrap.consume": (input: {
    token: string;
    deviceId: string;
    completedAtMs: number;
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    record: DeviceBootstrapTokenRecord;
    completion?: DevicePairSetupCompletionRecord;
  } | null;
  "bootstrap.confirm": (input: {
    setupId: string;
    deviceId: string;
    nowMs: number;
  }, { open }: WorkerOperationContext) => DevicePairSetupCompletionRecord | null;
  "bootstrap.readCompletion": (input: {
    setupId: string;
    nowMs: number;
  }, { open }: WorkerOperationContext) => DevicePairSetupCompletionRecord | null;
  "bootstrap.prune": (input: {
    nowMs: number;
  }, { open }: WorkerOperationContext) => number;
  "bootstrap.clear": (input: {
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    removed: number;
  };
  "bootstrap.revoke": (input: {
    token: string;
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    removed: boolean;
    record?: DeviceBootstrapTokenRecord;
  };
  "bootstrap.restore": (input: {
    record: DeviceBootstrapTokenRecord;
    nowMs: number;
  }, { open }: WorkerOperationContext) => boolean;
  "bootstrap.redeem": (input: {
    token: string;
    role: string;
    scopes: readonly string[];
    nowMs: number;
  }, { open }: WorkerOperationContext) => {
    recorded: boolean;
    fullyRedeemed: boolean;
  };
  "bootstrap.verify": (input: DeviceBootstrapBoundContextInput & {
    role: string;
    scopes: readonly string[];
  }, { open }: WorkerOperationContext) => {
    ok: true;
  } | {
    ok: false;
    reason: string;
  };
};
type DeviceBootstrapOperations = WorkerOperations<typeof deviceBootstrapOperations>;
//#endregion
//#region src/infra/device-bootstrap.d.ts
type DeviceBootstrapTokenIssueParams = {
  /** Revalidate caller authority at the worker's transaction and commit boundaries. */
  assertCurrent?: () => void;
  baseDir?: string;
  profile?: DeviceBootstrapProfileInput;
  roles?: readonly string[];
  scopes?: readonly string[];
};
/** Issue a short-lived generic bootstrap token with a bounded role/scope handoff profile. */
export declare function issueDeviceBootstrapToken(params?: DeviceBootstrapTokenIssueParams): Promise<{
  token: string;
  expiresAtMs: number;
}>;
type BootstrapParams<Key extends keyof DeviceBootstrapOperations> = Omit<DeviceBootstrapOperations[Key]["input"], "nowMs"> & {
  baseDir?: string;
};
/** Remove every outstanding bootstrap token. */
export declare function clearDeviceBootstrapTokens(params?: BootstrapParams<"bootstrap.clear"> & {
  assertCurrent?: () => void;
}): Promise<DeviceBootstrapOperations["bootstrap.clear"]["output"]>;
/** Revoke a bootstrap token unless its cloud-worker environment is already bound to the token's device. */
export declare function revokeDeviceBootstrapToken(params: BootstrapParams<"bootstrap.revoke">): Promise<DeviceBootstrapOperations["bootstrap.revoke"]["output"]>;
//#endregion
//#region src/plugin-sdk/device-bootstrap.d.ts
export declare const resolvePairingGatewayUrl: (cfg: OpenClawConfig, opts: {
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
//#endregion
export { BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, type DeviceBootstrapProfile, type DeviceBootstrapProfileInput, type DeviceBootstrapPurpose, PAIRING_SETUP_BOOTSTRAP_PROFILE, listDevicePairing, normalizeDeviceBootstrapProfile };