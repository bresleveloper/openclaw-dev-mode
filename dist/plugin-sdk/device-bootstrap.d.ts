import { a as DevicePairSetupCompletionRecord, c as DeviceBootstrapProfileInput, d as normalizeDeviceBootstrapProfile, i as DeviceBootstrapTokenRecord, l as DeviceBootstrapPurpose, n as ApproveDevicePairingResult, o as BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, r as DevicePairingApprovalOptions, s as DeviceBootstrapProfile, t as listDevicePairing, u as PAIRING_SETUP_BOOTSTRAP_PROFILE } from "../device-pairing-DBkCtbwV.js";
//#region src/infra/device-pairing-approval.d.ts
export declare function approveDevicePairing(requestId: string, baseDir?: string): Promise<ApproveDevicePairingResult>;
export declare function approveDevicePairing(requestId: string, options: DevicePairingApprovalOptions, baseDir?: string): Promise<ApproveDevicePairingResult>;
//#endregion
//#region src/infra/device-bootstrap.worker-types.d.ts
type DeviceBootstrapBoundContextInput = {
  token: string;
  deviceId: string;
  publicKey: string;
  nowMs: number;
};
type DeviceBootstrapOperations = {
  "bootstrap.issue": {
    input: {
      profile: DeviceBootstrapProfile;
      setupId?: string;
      nowMs: number;
    };
    output: {
      token: string;
      expiresAtMs: number;
    };
  };
  "bootstrap.ensure": {
    input: {
      profile: DeviceBootstrapProfileInput;
      setupId: string;
      nowMs: number;
    };
    output: {
      status: "pending";
      token: string;
      expiresAtMs: number;
      setupId: string;
    } | {
      status: "completed";
      setupId: string;
      deviceId: string;
    };
  };
  "bootstrap.consume": {
    input: {
      token: string;
      deviceId: string;
      completedAtMs: number;
      nowMs: number;
    };
    output: {
      record: DeviceBootstrapTokenRecord;
      completion?: DevicePairSetupCompletionRecord;
    } | null;
  };
  "bootstrap.confirm": {
    input: {
      setupId: string;
      deviceId: string;
      nowMs: number;
    };
    output: DevicePairSetupCompletionRecord | null;
  };
  "bootstrap.readCompletion": {
    input: {
      setupId: string;
      nowMs: number;
    };
    output: DevicePairSetupCompletionRecord | null;
  };
  "bootstrap.prune": {
    input: {
      nowMs: number;
    };
    output: number;
  };
  "bootstrap.clear": {
    input: {
      nowMs: number;
    };
    output: {
      removed: number;
    };
  };
  "bootstrap.revoke": {
    input: {
      token: string;
      nowMs: number;
    };
    output: {
      removed: boolean;
      record?: DeviceBootstrapTokenRecord;
    };
  };
  "bootstrap.restore": {
    input: {
      record: DeviceBootstrapTokenRecord;
      nowMs: number;
    };
    output: boolean;
  };
  "bootstrap.redeem": {
    input: {
      token: string;
      role: string;
      scopes: readonly string[];
      nowMs: number;
    };
    output: {
      recorded: boolean;
      fullyRedeemed: boolean;
    };
  };
  "bootstrap.verify": {
    input: DeviceBootstrapBoundContextInput & {
      role: string;
      scopes: readonly string[];
    };
    output: {
      ok: true;
    } | {
      ok: false;
      reason: string;
    };
  };
};
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
/** Revoke one bootstrap token and retain its record for best-effort restoration. */
export declare function revokeDeviceBootstrapToken(params: BootstrapParams<"bootstrap.revoke">): Promise<DeviceBootstrapOperations["bootstrap.revoke"]["output"]>;
//#endregion
export { BOOTSTRAP_HANDOFF_OPERATOR_SCOPES, type DeviceBootstrapProfile, type DeviceBootstrapProfileInput, type DeviceBootstrapPurpose, PAIRING_SETUP_BOOTSTRAP_PROFILE, listDevicePairing, normalizeDeviceBootstrapProfile };