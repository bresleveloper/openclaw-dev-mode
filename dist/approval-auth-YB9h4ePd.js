import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as resolveApprovalApprovers } from "./approval-approvers-Rslf6S0G.js";
import { t as createResolvedApproverActionAuthAdapter } from "./approval-auth-helpers-Xdjt6p1L.js";
import { i as resolveGoogleChatAccount } from "./accounts-DwCzvEYh.js";
import { n as isGoogleChatUserTarget, r as normalizeGoogleChatTarget } from "./targets-BysC5r0Z.js";
//#region extensions/googlechat/src/approval-auth.ts
function normalizeGoogleChatApproverId(value) {
	const normalized = normalizeGoogleChatTarget(String(value));
	if (!normalized || !isGoogleChatUserTarget(normalized)) return;
	const suffix = normalizeLowercaseStringOrEmpty(normalized.slice(6));
	if (!suffix || suffix.includes("@")) return;
	return `users/${suffix}`;
}
function getGoogleChatApprovalApprovers(params) {
	const account = resolveGoogleChatAccount(params).config;
	return resolveApprovalApprovers({
		allowFrom: account.dm?.allowFrom,
		defaultTo: account.defaultTo,
		normalizeApprover: normalizeGoogleChatApproverId
	});
}
const googleChatApprovalAuth = createResolvedApproverActionAuthAdapter({
	channelLabel: "Google Chat",
	resolveApprovers: getGoogleChatApprovalApprovers,
	normalizeSenderId: (value) => normalizeGoogleChatApproverId(value)
});
//#endregion
export { googleChatApprovalAuth as n, normalizeGoogleChatApproverId as r, getGoogleChatApprovalApprovers as t };
