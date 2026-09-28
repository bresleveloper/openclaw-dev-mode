import { l as resolveGoogleChatAccount } from "./channel-base-B3EzcV7X.mjs";
import { m as normalizeGoogleChatTarget, p as isGoogleChatUserTarget } from "./channel.adapters-CSAwKSvQ.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelApprovalAuth } from "openclaw/plugin-sdk/approval-auth-runtime";
//#region extensions/googlechat/src/approval-auth.ts
function normalizeGoogleChatApproverId(value) {
	const normalized = normalizeGoogleChatTarget(String(value));
	if (!normalized || !isGoogleChatUserTarget(normalized)) return;
	const suffix = normalizeLowercaseStringOrEmpty(normalized.slice(6));
	if (!suffix || suffix.includes("@")) return;
	return `users/${suffix}`;
}
const googleChatApproval = createChannelApprovalAuth({
	channelLabel: "Google Chat",
	resolveInputs: ({ cfg, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		}).config;
		return {
			allowFrom: account.allowFrom,
			defaultTo: account.defaultTo
		};
	},
	normalizeApprover: normalizeGoogleChatApproverId
});
const getGoogleChatApprovalApprovers = googleChatApproval.resolveApprovers;
const googleChatApprovalAuth = googleChatApproval.approvalAuth;
//#endregion
export { googleChatApprovalAuth as n, normalizeGoogleChatApproverId as r, getGoogleChatApprovalApprovers as t };
