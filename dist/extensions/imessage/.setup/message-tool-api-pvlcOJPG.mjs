import { n as inferIMessageTargetChatType } from "./targets-Cc9vthzI.mjs";
import { c as getCachedIMessageRemoteHost, o as resolveIMessageAccount } from "./accounts-CUxZrTcY.mjs";
import { createActionGate } from "openclaw/plugin-sdk/channel-actions";
import { Type } from "typebox";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
//#region extensions/imessage/src/actions-contract.ts
const IMESSAGE_ACTIONS = {
	react: { gate: "reactions" },
	edit: { gate: "edit" },
	unsend: { gate: "unsend" },
	reply: { gate: "reply" },
	sendWithEffect: { gate: "sendWithEffect" },
	renameGroup: {
		gate: "renameGroup",
		groupOnly: true
	},
	setGroupIcon: {
		gate: "setGroupIcon",
		groupOnly: true
	},
	addParticipant: {
		gate: "addParticipant",
		groupOnly: true
	},
	removeParticipant: {
		gate: "removeParticipant",
		groupOnly: true
	},
	leaveGroup: {
		gate: "leaveGroup",
		groupOnly: true
	},
	sendAttachment: { gate: "sendAttachment" },
	poll: { gate: "polls" },
	"poll-vote": { gate: "polls" }
};
const IMESSAGE_ACTION_NAMES = Object.keys(IMESSAGE_ACTIONS);
//#endregion
//#region extensions/imessage/src/private-api-status.ts
const FOUNDATIONAL_RPC_METHODS = /* @__PURE__ */ new Set([
	"chats.list",
	"messages.history",
	"watch.subscribe",
	"watch.unsubscribe",
	"send"
]);
const bridgeStatusCache = /* @__PURE__ */ new Map();
function normalizeCliPath(cliPath) {
	return cliPath?.trim() || "imsg";
}
function imessageRpcSupportsMethod(status, method) {
	if (!status?.available) return false;
	if (status.rpcMethods.length === 0) return FOUNDATIONAL_RPC_METHODS.has(method);
	return status.rpcMethods.includes(method);
}
function getCachedIMessagePrivateApiStatus(cliPath) {
	const key = normalizeCliPath(cliPath);
	const entry = bridgeStatusCache.get(key);
	if (!entry) return;
	if (entry.expiresAt === 0) return entry.status;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || entry.expiresAt <= now) {
		bridgeStatusCache.delete(key);
		return;
	}
	return entry.status;
}
function invalidateCachedIMessagePrivateApiStatus(cliPath) {
	bridgeStatusCache.delete(normalizeCliPath(cliPath));
}
function setCachedIMessagePrivateApiStatus(cliPath, status, expiresAt = 0) {
	if (expiresAt !== 0 && asDateTimestampMs(expiresAt) === void 0) return;
	bridgeStatusCache.set(normalizeCliPath(cliPath), {
		status,
		expiresAt
	});
}
//#endregion
//#region extensions/imessage/src/message-tool-api.ts
const PRIVATE_API_ACTIONS = /* @__PURE__ */ new Set([
	"react",
	"edit",
	"unsend",
	"reply",
	"sendWithEffect",
	"renameGroup",
	"setGroupIcon",
	"addParticipant",
	"removeParticipant",
	"leaveGroup",
	"sendAttachment",
	"poll",
	"poll-vote"
]);
function isGroupTarget(raw, chatType) {
	if (chatType) return chatType !== "direct";
	if (!raw) return false;
	return inferIMessageTargetChatType(raw) === "group";
}
function describeIMessageMessageTool({ cfg, accountId, chatType, currentChannelId }) {
	const account = resolveIMessageAccount({
		cfg,
		accountId
	});
	if (!account.enabled || !account.configured) return null;
	const cliPath = account.config.cliPath?.trim() || "imsg";
	const privateApiStatus = getCachedIMessagePrivateApiStatus(cliPath);
	const remote = Boolean(getCachedIMessageRemoteHost({
		cliPath,
		remoteHost: account.config.remoteHost
	}));
	const gate = createActionGate(account.config.actions);
	const actions = /* @__PURE__ */ new Set();
	for (const action of IMESSAGE_ACTION_NAMES) {
		const spec = IMESSAGE_ACTIONS[action];
		if (!spec?.gate || !gate(spec.gate)) continue;
		if (privateApiStatus?.available === false && PRIVATE_API_ACTIONS.has(action)) continue;
		if (action === "edit" && privateApiStatus?.selectors && !privateApiStatus.selectors.editMessage && !privateApiStatus.selectors.editMessageItem) continue;
		if (action === "unsend" && privateApiStatus?.selectors?.retractMessagePart !== true) continue;
		if (action === "poll" && privateApiStatus?.selectors && !privateApiStatus.selectors.pollPayloadMessage) continue;
		if (action === "poll-vote" && privateApiStatus?.selectors && !privateApiStatus.selectors.pollVoteMessage) continue;
		if (action === "poll-vote" && privateApiStatus && !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")) continue;
		actions.add(action);
	}
	if (!isGroupTarget(currentChannelId, chatType)) {
		for (const action of IMESSAGE_ACTION_NAMES) if ("groupOnly" in IMESSAGE_ACTIONS[action] && IMESSAGE_ACTIONS[action].groupOnly) actions.delete(action);
	}
	if (actions.delete("sendAttachment")) actions.add("upload-file");
	return {
		actions: Array.from(actions),
		...actions.has("poll-vote") ? { schema: {
			properties: {
				...remote ? {
					pollOptionId: Type.Optional(Type.String({ description: "Stable iMessage poll option id. Required for Remote Mac over SSH accounts; copy it from the inbound poll options." })),
					pollOptionIndex: Type.Optional(Type.Integer({
						minimum: 1,
						description: "Local iMessage accounts only. Remote Mac accounts must use pollOptionId."
					}))
				} : {},
				pollOptionText: Type.Optional(Type.String({ description: remote ? "Local iMessage accounts only. Remote Mac accounts must use pollOptionId." : "Exact iMessage poll option text." }))
			},
			actions: ["poll-vote"],
			visibility: "all-configured"
		} } : {}
	};
}
//#endregion
export { setCachedIMessagePrivateApiStatus as a, invalidateCachedIMessagePrivateApiStatus as i, getCachedIMessagePrivateApiStatus as n, IMESSAGE_ACTIONS as o, imessageRpcSupportsMethod as r, IMESSAGE_ACTION_NAMES as s, describeIMessageMessageTool as t };
