import type { ChannelApprovalNativeDeliveryPlan, ChannelApprovalNativePlannedTarget } from "./approval-native-delivery.js";
import type { ChannelApprovalKind } from "./approval-types.js";
import type { ExecApprovalRequest } from "./exec-approvals.js";
import type { PluginApprovalRequest } from "./plugin-approvals.js";
type GatewayRequestFn = <T = unknown>(method: string, params: Record<string, unknown>) => Promise<T>;
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
/** Returns whether a native approval runtime is active for the requested channel/account scope. */
export declare function hasActiveApprovalNativeRouteRuntime(params: {
    approvalKind: ChannelApprovalKind;
    channel?: string | null;
    accountId?: string | null;
}): boolean;
/** Tracks native approval deliveries and sends origin-chat notices after all observed runtimes report. */
export declare function createApprovalNativeRouteReporter(params: {
    handledKinds: ReadonlySet<ChannelApprovalKind>;
    channel?: string;
    channelLabel?: string;
    accountId?: string | null;
    requestGateway: GatewayRequestFn;
}): {
    observeRequest(payload: {
        approvalKind: ChannelApprovalKind;
        request: ApprovalRequest;
    }): void;
    start(): void;
    reportSkipped(paramsValue: {
        approvalKind: ChannelApprovalKind;
        request: ApprovalRequest;
    }): Promise<void>;
    reportDelivery(paramsLocal: {
        approvalKind: ChannelApprovalKind;
        request: ApprovalRequest;
        deliveryPlan: ChannelApprovalNativeDeliveryPlan;
        deliveredTargets: readonly ChannelApprovalNativePlannedTarget[];
    }): Promise<void>;
    stop(): Promise<void>;
};
/** Clears in-memory native approval route coordination state between tests. */
export declare function clearApprovalNativeRouteStateForTest(): void;
export {};
