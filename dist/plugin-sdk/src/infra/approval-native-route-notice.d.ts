import type { ChannelApprovalNativePlannedTarget } from "./approval-native-delivery.js";
/** Formats the human destination label for where native approval prompts were delivered. */
export declare function describeApprovalDeliveryDestination(params: {
    channelLabel: string;
    deliveredTargets: readonly ChannelApprovalNativePlannedTarget[];
}): string;
/** Builds the notice shown in the current chat when approval was routed elsewhere. */
export declare function resolveApprovalRoutedElsewhereNoticeText(destinations: readonly string[]): string | null;
/** Builds the fallback slash-command notice when native approval delivery fails. */
export declare function resolveApprovalDeliveryFailedNoticeText(params: {
    approvalId: string;
    approvalKind: "exec" | "plugin";
    allowedDecisions?: readonly string[];
}): string;
