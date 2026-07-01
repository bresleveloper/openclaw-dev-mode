/**
 * Carries confirmed CLI messaging delivery across failed execution/finalization paths.
 */
import type { CliOutput } from "../cli-output.js";
type CliMessagingDeliveryEvidence = Pick<CliOutput, "didSendViaMessagingTool" | "didDeliverSourceReplyViaMessageTool" | "messagingToolSentTexts" | "messagingToolSentMediaUrls" | "messagingToolSentTargets" | "messagingToolSourceReplyPayloads">;
/** Attaches confirmed delivery evidence so caller retries cannot duplicate a visible send. */
export declare function attachCliMessagingDeliveryEvidence(error: unknown, output: CliMessagingDeliveryEvidence): unknown;
/** Reads confirmed delivery evidence from a failed CLI attempt. */
export declare function getCliMessagingDeliveryEvidence(error: unknown): CliMessagingDeliveryEvidence | undefined;
export {};
