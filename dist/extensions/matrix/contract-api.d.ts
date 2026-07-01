import { r as matrixSetupAdapter, t as matrixOnboardingAdapter } from "../../setup-surface-b0NlNwg5.js";

//#region extensions/matrix/src/setup-contract.d.ts
declare const singleAccountKeysToMove: ("deviceId" | "replyToMode" | "avatarUrl" | "groups" | "dm" | "responsePrefix" | "actions" | "textChunkLimit" | "allowBots" | "dangerouslyAllowNameMatching" | "chunkMode" | "blockStreaming" | "mediaMaxMb" | "ackReaction" | "ackReactionScope" | "threadBindings" | "initialSyncLimit" | "encryption" | "allowlistOnly" | "threadReplies" | "reactionNotifications" | "startupVerification" | "startupVerificationCooldownHours" | "autoJoin" | "autoJoinAllowlist" | "rooms")[];
declare const namedAccountPromotionKeys: ("password" | "deviceId" | "name" | "avatarUrl" | "initialSyncLimit" | "encryption" | "homeserver" | "userId" | "accessToken" | "deviceName")[];
declare function resolveSingleAccountPromotionTarget(params: {
  channel: Record<string, unknown>;
}): string;
//#endregion
export { matrixSetupAdapter, matrixOnboardingAdapter as matrixSetupWizard, namedAccountPromotionKeys, resolveSingleAccountPromotionTarget, singleAccountKeysToMove };