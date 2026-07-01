import type { ChannelApprovalNativeTarget } from "../channels/plugins/approval-native.types.js";
/** Builds the stable dedupe key used to compare channel-native approval targets. */
export declare function buildChannelApprovalNativeTargetKey(target: ChannelApprovalNativeTarget): string;
