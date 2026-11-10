const require_resolve_allowlist = require("./resolve-allowlist-gI34MnpE.cjs");
let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_approval_auth_runtime = require("openclaw/plugin-sdk/approval-auth-runtime");
let openclaw_plugin_sdk_routing = require("openclaw/plugin-sdk/routing");
//#region extensions/msteams/src/approval-auth.ts
const MSTEAMS_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function normalizeMSTeamsApproverId(value) {
	const normalized = require_resolve_allowlist.normalizeMSTeamsMessagingTarget(String(value));
	const id = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(normalized?.startsWith("user:") ? normalized.slice(5) : normalized);
	return id && MSTEAMS_ID_RE.test(id) ? id : void 0;
}
const msTeamsApproval = (0, openclaw_plugin_sdk_approval_auth_runtime.createChannelApprovalAuth)({
	channelLabel: "Microsoft Teams",
	resolveInputs: ({ cfg, accountId }) => {
		const channel = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId);
		return {
			allowFrom: channel?.allowFrom,
			defaultTo: channel?.defaultTo
		};
	},
	normalizeApprover: normalizeMSTeamsApproverId,
	normalizeSenderId: (value) => {
		const trimmed = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(value);
		if (!trimmed) return;
		return MSTEAMS_ID_RE.test(trimmed) ? trimmed : void 0;
	}
});
const getMSTeamsApprovalApprovers = msTeamsApproval.resolveApprovers;
const msTeamsApprovalAuth = { authorizeActorAction(params) {
	const channel = params.cfg.channels?.msteams;
	if (!channel || channel.enabled === false || require_resolve_allowlist.resolveMSTeamsAccountConfig(params.cfg, params.accountId).enabled === false) return {
		authorized: false,
		reason: "Microsoft Teams approval account is disabled or unavailable."
	};
	return msTeamsApproval.approvalAuth.authorizeActorAction(params);
} };
//#endregion
//#region extensions/msteams/src/monitor-handler/thread-session.ts
const TRAILING_THREAD_SUFFIX = /(?::thread:[^:]+)+$/;
function resolveMSTeamsRouteSessionKey(params) {
	const channelThreadId = params.isChannel ? params.conversationMessageId ?? params.replyToId ?? void 0 : void 0;
	const cleanBase = params.baseSessionKey.replace(TRAILING_THREAD_SUFFIX, "");
	return (0, openclaw_plugin_sdk_routing.resolveThreadSessionKeys)({
		baseSessionKey: cleanBase,
		threadId: channelThreadId,
		parentSessionKey: channelThreadId ? cleanBase : void 0
	}).sessionKey;
}
//#endregion
Object.defineProperty(exports, "getMSTeamsApprovalApprovers", {
	enumerable: true,
	get: function() {
		return getMSTeamsApprovalApprovers;
	}
});
Object.defineProperty(exports, "msTeamsApprovalAuth", {
	enumerable: true,
	get: function() {
		return msTeamsApprovalAuth;
	}
});
Object.defineProperty(exports, "resolveMSTeamsRouteSessionKey", {
	enumerable: true,
	get: function() {
		return resolveMSTeamsRouteSessionKey;
	}
});
