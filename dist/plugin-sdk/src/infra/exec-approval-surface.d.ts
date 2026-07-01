import { type OpenClawConfig } from "../config/config.js";
/** Native approval availability for the channel/account that initiated an approval. */
export type ExecApprovalInitiatingSurfaceState = {
    kind: "enabled";
    channel: string | undefined;
    channelLabel: string;
    accountId?: string;
} | {
    kind: "disabled";
    channel: string;
    channelLabel: string;
    accountId?: string;
} | {
    kind: "unsupported";
    channel: string;
    channelLabel: string;
    accountId?: string;
};
type ApprovalKind = "exec" | "plugin";
/** Resolves whether exec approvals can be handled on the initiating surface. */
export declare function resolveExecApprovalInitiatingSurfaceState(params: {
    channel?: string | null;
    accountId?: string | null;
    cfg?: OpenClawConfig;
}): ExecApprovalInitiatingSurfaceState;
/** Resolves whether approvals of a given kind can be handled on the initiating surface. */
export declare function resolveApprovalInitiatingSurfaceState(params: {
    channel?: string | null;
    accountId?: string | null;
    cfg?: OpenClawConfig;
    approvalKind: ApprovalKind;
}): ExecApprovalInitiatingSurfaceState;
/** Returns whether a channel can present native exec approval UI. */
export declare function supportsNativeExecApprovalClient(channel?: string | null): boolean;
/** Lists native exec approval client labels for reply guidance. */
export declare function listNativeExecApprovalClientLabels(params?: {
    excludeChannel?: string | null;
}): string[];
/** Returns channel-specific setup guidance for native exec approvals, when available. */
export declare function describeNativeExecApprovalClientSetup(params: {
    channel?: string | null;
    channelLabel?: string | null;
    accountId?: string | null;
}): string | null;
export {};
