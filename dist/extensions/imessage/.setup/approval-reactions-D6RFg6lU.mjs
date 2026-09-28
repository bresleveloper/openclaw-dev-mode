import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { c as parseIMessageTarget, o as normalizeIMessageHandle } from "./targets-Cc9vthzI.mjs";
import { c as getIMessageApprovalApprovers, l as imessageApprovalAuth } from "./group-policy-Cjztkquv.mjs";
import { n as getOptionalIMessageRuntime } from "./runtime-Cza4CY5T.mjs";
import { n as normalizeIMessageGuid, t as resolveIMessageReactionContext } from "./reaction-context-Br-vAJFp.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { asDateTimestampMs, isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { addApprovalReactionHintToText, approvalReactionDecisionSetsMatch, buildApprovalReactionDeliveredBindingMarker, buildApprovalReactionHint, createApprovalReactionTargetStore, listApprovalReactionBindings, normalizeApprovalReactionDecision, readApprovalReactionDecisionList, readApprovalReactionDeliveredBinding, readApprovalReactionPresentationBinding, readApprovalReactionTargetRecord, resolveTypedApprovalReactionTarget, settleApprovalReaction } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
//#region extensions/imessage/src/approval-target-keys.ts
function chatIdToKeyValue(chatId) {
	if (chatId == null || chatId === "") return null;
	if (typeof chatId === "number") return Number.isFinite(chatId) && chatId > 0 ? String(chatId) : null;
	return chatId.trim() || null;
}
function enumerateConversationKeyForms(conversation) {
	const forms = [];
	const chatGuid = conversation.chatGuid?.trim();
	if (chatGuid) forms.push(`chat_guid:${chatGuid}`);
	const chatIdentifier = conversation.chatIdentifier?.trim();
	if (chatIdentifier) forms.push(`chat_identifier:${chatIdentifier}`);
	const chatIdValue = chatIdToKeyValue(conversation.chatId);
	if (chatIdValue) forms.push(`chat_id:${chatIdValue}`);
	const handle = conversation.handle?.trim();
	if (handle) forms.push(`handle:${handle}`);
	return forms;
}
function normalizeConversationKey(conversation) {
	return enumerateConversationKeyForms(conversation)[0];
}
/**
* Index a binding under every key derivable from the conversation. Outbound and
* inbound disagree about which key exists: send may only know
* `{handle: "+1..."}` for a DM, while the bridge populates chat_guid on the
* inbound event. Enumerating all forms keeps the two symmetric without making
* callers guess which one the bridge will pick.
*/
function enumerateApprovalTargetKeys(params) {
	const accountId = params.accountId.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !messageId) return [];
	return enumerateConversationKeyForms(params.conversation).map((form) => `${accountId}:${form}:${messageId}`);
}
function buildIMessageApprovalConversationKeyForTarget(to) {
	try {
		const target = parseIMessageTarget(to);
		if (target.kind === "chat_id") return { chatId: target.chatId };
		if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
		if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
		const handle = normalizeIMessageHandle(target.to);
		return handle ? { handle } : null;
	} catch {
		return null;
	}
}
/** Conversation key for an inbound event, mirroring the outbound key forms. */
function buildIMessageApprovalConversationKeyForInbound(params) {
	return {
		...params.chatGuid?.trim() ? { chatGuid: params.chatGuid.trim() } : {},
		...params.chatIdentifier?.trim() ? { chatIdentifier: params.chatIdentifier.trim() } : {},
		...chatIdToKeyValue(params.chatId ?? void 0) ? { chatId: params.chatId } : {},
		...params.isGroup ? {} : { handle: params.actorHandle }
	};
}
//#endregion
//#region extensions/imessage/src/approval-reaction-poll-targets.ts
const PERSISTENT_POLL_TARGET_NAMESPACE = "imessage.approval-reaction-poll-targets";
const PERSISTENT_MAX_ENTRIES$1 = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS$1 = 864e5;
const pendingReactionPollTargets = /* @__PURE__ */ new Map();
function prunePendingReactionPollTargets(nowMs = Date.now()) {
	for (const [key, target] of pendingReactionPollTargets.entries()) if (!isFutureDateTimestampMs(target.expiresAtMs, { nowMs })) pendingReactionPollTargets.delete(key);
}
function resolveIMessageApprovalReactionPollExpiry(ttlMs) {
	const nowMs = asDateTimestampMs(Date.now());
	if (nowMs === void 0) return;
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(ttlMs ?? DEFAULT_REACTION_TARGET_TTL_MS$1, { nowMs }) ?? resolveExpiresAtMsFromDurationMs(DEFAULT_REACTION_TARGET_TTL_MS$1, { nowMs });
	if (expiresAtMs === void 0) return;
	return {
		ttlMs: expiresAtMs - nowMs,
		expiresAtMs
	};
}
function mergePollTargetConversation(left, right) {
	return {
		chatGuid: left.chatGuid ?? right.chatGuid,
		chatIdentifier: left.chatIdentifier ?? right.chatIdentifier,
		chatId: left.chatId ?? right.chatId,
		handle: left.handle ?? right.handle
	};
}
const reportPersistentApprovalReactionError$1 = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-reaction-state", "iMessage persistent approval reaction state failed");
let pendingReactionPollTargetStore;
let pendingReactionPollTargetStoreDisabled = false;
function disablePendingReactionPollTargetStore(error) {
	pendingReactionPollTargetStoreDisabled = true;
	pendingReactionPollTargetStore = void 0;
	reportPersistentApprovalReactionError$1(error);
}
function getPendingReactionPollTargetStore() {
	if (pendingReactionPollTargetStoreDisabled) return;
	if (pendingReactionPollTargetStore) return pendingReactionPollTargetStore;
	try {
		pendingReactionPollTargetStore = getOptionalIMessageRuntime()?.state.openKeyedStore({
			namespace: PERSISTENT_POLL_TARGET_NAMESPACE,
			maxEntries: PERSISTENT_MAX_ENTRIES$1,
			defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS$1
		});
		return pendingReactionPollTargetStore;
	} catch (error) {
		disablePendingReactionPollTargetStore(error);
		return;
	}
}
function readPersistedPollTarget(value) {
	const target = asOptionalRecord(value);
	if (!target) return null;
	const accountId = typeof target.accountId === "string" ? target.accountId.trim() : "";
	const messageId = typeof target.messageId === "string" ? target.messageId.trim() : "";
	const approvalId = typeof target.approvalId === "string" ? target.approvalId.trim() : "";
	const expiresAtMs = asDateTimestampMs(target.expiresAtMs);
	const allowedDecisions = readApprovalReactionDecisionList(target.allowedDecisions);
	const rawConversation = asOptionalRecord(target.conversation) ?? {};
	const conversation = {
		...typeof rawConversation.chatGuid === "string" ? { chatGuid: rawConversation.chatGuid.trim() } : {},
		...typeof rawConversation.chatIdentifier === "string" ? { chatIdentifier: rawConversation.chatIdentifier.trim() } : {},
		...typeof rawConversation.chatId === "string" || typeof rawConversation.chatId === "number" ? { chatId: rawConversation.chatId } : {},
		...typeof rawConversation.handle === "string" ? { handle: rawConversation.handle.trim() } : {}
	};
	if (!accountId || !messageId || !approvalId || expiresAtMs === void 0 || !allowedDecisions || target.approvalKind !== "exec" && target.approvalKind !== "plugin" || !normalizeConversationKey(conversation)) return null;
	return {
		accountId,
		conversation,
		messageId,
		approvalId,
		approvalKind: target.approvalKind,
		allowedDecisions,
		expiresAtMs
	};
}
async function recordIMessageApprovalReactionPollTarget(params) {
	const { expiry } = params;
	const target = {
		accountId: params.accountId,
		conversation: params.conversation,
		messageId: params.messageId,
		approvalId: params.approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions: params.allowedDecisions,
		expiresAtMs: expiry.expiresAtMs
	};
	const store = getPendingReactionPollTargetStore();
	const writes = [];
	for (const key of params.keys) {
		pendingReactionPollTargets.set(key, target);
		if (store) writes.push(store.register(key, target, { ttlMs: expiry.ttlMs }).catch(disablePendingReactionPollTargetStore));
	}
	prunePendingReactionPollTargets();
	await Promise.all(writes);
}
async function deleteIMessageApprovalReactionPollTargets(keys) {
	const store = getPendingReactionPollTargetStore();
	const deletions = [];
	for (const key of keys) {
		pendingReactionPollTargets.delete(key);
		if (store) deletions.push(store.delete(key).catch(disablePendingReactionPollTargetStore));
	}
	await Promise.all(deletions);
}
async function listPendingIMessageApprovalReactionPollTargets(params) {
	const accountId = params.accountId.trim();
	if (!accountId) return [];
	const nowMs = Date.now();
	const store = getPendingReactionPollTargetStore();
	if (store) try {
		for (const entry of await store.entries()) {
			const target = readPersistedPollTarget(entry.value);
			if (!target || !isFutureDateTimestampMs(target.expiresAtMs, { nowMs })) {
				await store.delete(entry.key);
				continue;
			}
			pendingReactionPollTargets.set(entry.key, target);
		}
	} catch (error) {
		disablePendingReactionPollTargetStore(error);
	}
	prunePendingReactionPollTargets(nowMs);
	const targetByApprovalAndMessage = /* @__PURE__ */ new Map();
	for (const target of pendingReactionPollTargets.values()) {
		if (target.accountId !== accountId) continue;
		const key = `${target.approvalId}:${normalizeIMessageGuid(target.messageId)}`;
		const existing = targetByApprovalAndMessage.get(key);
		if (!existing) {
			targetByApprovalAndMessage.set(key, target);
			continue;
		}
		targetByApprovalAndMessage.set(key, {
			...existing,
			conversation: mergePollTargetConversation(existing.conversation, target.conversation),
			expiresAtMs: Math.max(existing.expiresAtMs, target.expiresAtMs)
		});
	}
	return [...targetByApprovalAndMessage.values()];
}
function clearIMessageApprovalReactionPollTargetsForTest() {
	pendingReactionPollTargets.clear();
	pendingReactionPollTargetStore = void 0;
	pendingReactionPollTargetStoreDisabled = false;
}
//#endregion
//#region extensions/imessage/src/approval-reactions.ts
var approval_reactions_exports = /* @__PURE__ */ __exportAll({
	addIMessageApprovalReactionHintToStructuredPayload: () => addIMessageApprovalReactionHintToStructuredPayload,
	buildIMessageApprovalConversationKeyForTarget: () => buildIMessageApprovalConversationKeyForTarget,
	clearIMessageApprovalReactionTargetsForTest: () => clearIMessageApprovalReactionTargetsForTest,
	handleIMessageApprovalReaction: () => handleIMessageApprovalReaction,
	maybeResolveIMessageApprovalReaction: () => maybeResolveIMessageApprovalReaction,
	registerIMessageApprovalReactionTarget: () => registerIMessageApprovalReactionTarget,
	registerIMessageApprovalReactionTargetForDeliveredPayload: () => registerIMessageApprovalReactionTargetForDeliveredPayload,
	resolveIMessageApprovalReactionTargetWithPersistence: () => resolveIMessageApprovalReactionTargetWithPersistence,
	unregisterIMessageApprovalReactionTarget: () => unregisterIMessageApprovalReactionTarget
});
const PERSISTENT_NAMESPACE = "imessage.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 864e5;
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const reportPersistentApprovalReactionError = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-reaction-state", "iMessage persistent approval reaction state failed");
function reportApprovalBindingCorrelationMismatch(binding) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-reaction-state"
		}).warn("iMessage approval prompt text failed binding correlation; tapbacks disabled", {
			approvalId: binding.approvalId,
			approvalKind: binding.approvalKind
		});
	} catch {}
}
const imessageApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentApprovalReactionError,
	readPersistedTarget: readApprovalReactionTargetRecord
});
const IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY = "imessageApprovalReactionBindingV1";
function visibleApprovalBindingMatches(text, binding, options) {
	if (!text) return false;
	const lines = text.split(/\r?\n/).map((line) => line.replace(/\*\*/g, "").trim());
	const normalizedHeaders = lines.map((line) => line.replace(/^[^A-Za-z0-9]*/, ""));
	const hasKindHeader = binding.approvalKind === "exec" ? lines.includes("Approval required.") || normalizedHeaders.some((line) => /^Exec approval required$/i.test(line)) : normalizedHeaders.some((line) => /^Plugin approval required$/i.test(line));
	const hasId = lines.includes(`ID: ${binding.approvalId}`) || lines.includes(`Full id: \`${binding.approvalId}\``) || lines.includes(`Full id: ${binding.approvalId}`);
	if (!hasKindHeader || !hasId) return false;
	const visibleDecisions = [];
	for (const line of lines) {
		const match = line.match(APPROVE_COMMAND_LINE_RE);
		const approvalId = match?.[1];
		const decisionsText = match?.[2];
		if (!approvalId || !decisionsText || approvalId !== binding.approvalId && approvalId !== binding.approvalSlug) continue;
		for (const token of decisionsText.split(/[\s|,]+/)) {
			const decision = normalizeApprovalReactionDecision(token);
			if (decision && !visibleDecisions.includes(decision)) visibleDecisions.push(decision);
		}
	}
	if (!approvalReactionDecisionSetsMatch(binding.allowedDecisions, visibleDecisions)) return false;
	if (!options.requireReactionHint) return true;
	const hint = buildApprovalReactionHint({ allowedDecisions: binding.allowedDecisions });
	return Boolean(hint && text.includes(hint));
}
/** Preserve a validated typed approval binding until the iMessage GUID is known. */
function addIMessageApprovalReactionHintToStructuredPayload(params) {
	const metadata = readApprovalReactionPresentationBinding({
		payload: params.payload,
		requireApprovalSlug: true,
		trimApprovalId: true
	});
	const text = params.payload.text;
	if (metadata?.approvalKind !== params.approvalKind || !text) return null;
	if (!visibleApprovalBindingMatches(text, metadata, { requireReactionHint: false })) {
		reportApprovalBindingCorrelationMismatch(metadata);
		return null;
	}
	return {
		...params.payload,
		text: addApprovalReactionHintToText({
			text,
			allowedDecisions: metadata.allowedDecisions
		}),
		channelData: {
			...params.payload.channelData,
			[IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY]: buildApprovalReactionDeliveredBindingMarker({
				approvalId: metadata.approvalId,
				approvalSlug: metadata.approvalSlug,
				approvalKind: metadata.approvalKind,
				allowedDecisions: metadata.allowedDecisions
			})
		}
	};
}
const APPROVE_COMMAND_LINE_RE = /\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(.+)$/i;
async function registerIMessageApprovalReactionTarget(params) {
	const accountId = params.accountId.trim();
	const messageId = params.messageId.trim();
	const approvalId = params.approvalId.trim();
	const allowedDecisions = listApprovalReactionBindings({ allowedDecisions: params.allowedDecisions }).map((binding) => binding.decision);
	if (!accountId || !messageId || !approvalId || params.approvalKind !== "exec" && params.approvalKind !== "plugin" || allowedDecisions.length === 0) return null;
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions
	};
	const keys = enumerateApprovalTargetKeys({
		accountId,
		conversation: params.conversation,
		messageId
	});
	if (keys.length === 0) return null;
	const expiry = resolveIMessageApprovalReactionPollExpiry(params.ttlMs);
	if (!expiry) return null;
	await Promise.all([recordIMessageApprovalReactionPollTarget({
		keys,
		accountId,
		conversation: params.conversation,
		messageId,
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions,
		expiry
	}), ...keys.map((key) => imessageApprovalReactionTargets.register(key, target, { ttlMs: expiry.ttlMs }))]);
	return target;
}
function listDeliveredIMessageApprovalGuids(params) {
	const deliveries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const result of params.results) {
		if (result.channel !== "imessage") continue;
		const guid = typeof result.meta?.imessageMessageGuid === "string" ? result.meta.imessageMessageGuid.trim() : "";
		const visibleText = result.meta?.imessageVisibleText;
		if (!guid || /^\d+$/.test(guid) || seen.has(guid) || typeof visibleText !== "string") continue;
		seen.add(guid);
		deliveries.push({
			guid,
			visibleText
		});
	}
	if (!visibleApprovalBindingMatches(deliveries.map((delivery) => delivery.visibleText).join("\n"), params.binding, { requireReactionHint: true })) {
		if (params.results.some((result) => result.channel === "imessage")) reportApprovalBindingCorrelationMismatch(params.binding);
		return [];
	}
	return deliveries.map((delivery) => delivery.guid);
}
/** Bind a typed forwarded approval after iMessage returns the stable tapback GUID. */
async function registerIMessageApprovalReactionTargetForDeliveredPayload(params) {
	if (params.target.channel.trim().toLowerCase() !== "imessage") return false;
	const binding = readApprovalReactionDeliveredBinding({
		payload: params.payload,
		channelDataKey: IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY,
		requireApprovalSlug: true,
		trimApprovalId: true
	});
	if (!binding) return false;
	const conversation = buildIMessageApprovalConversationKeyForTarget(params.target.to);
	if (!conversation) return false;
	const registrations = listDeliveredIMessageApprovalGuids({
		binding,
		results: params.results
	}).map((messageId) => registerIMessageApprovalReactionTarget({
		accountId: params.accountId,
		conversation,
		messageId,
		approvalId: binding.approvalId,
		approvalKind: binding.approvalKind,
		allowedDecisions: binding.allowedDecisions,
		ttlMs: params.ttlMs
	}));
	return (await Promise.all(registrations)).some(Boolean);
}
async function unregisterIMessageApprovalReactionTarget(params) {
	const keys = enumerateApprovalTargetKeys(params);
	await Promise.all([...keys.map((key) => imessageApprovalReactionTargets.delete(key)), deleteIMessageApprovalReactionPollTargets(keys)]);
}
function resolveTarget(params) {
	const target = resolveTypedApprovalReactionTarget(params);
	return target ? {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		decision: target.decision
	} : null;
}
function formatCanonicalApprovalTerminalState(approval) {
	const decision = approval.status === "allowed" || approval.status === "denied" ? ` decision=${approval.decision}` : "";
	return `status=${approval.status}${decision} reason=${approval.reason}`;
}
async function resolveIMessageApprovalReactionTargetWithPersistence(params) {
	const keys = enumerateApprovalTargetKeys(params);
	for (const key of keys) {
		const target = resolveTarget({
			target: await imessageApprovalReactionTargets.lookup(key),
			reactionKey: params.reactionKey
		});
		if (target) return target;
	}
	return null;
}
function readApprovalReactionEvent(message, bodyText) {
	const reaction = resolveIMessageReactionContext(message, bodyText);
	if (!reaction) return null;
	const reactionKey = reaction.emoji.trim();
	const candidates = (reaction.targetGuids ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
	const primary = reaction.targetGuid?.trim() || candidates[0] || "";
	const messageIdCandidates = candidates.length > 0 ? candidates : primary ? [primary] : [];
	const actorHandle = normalizeIMessageHandle((message.sender ?? "").trim());
	if (!reactionKey || !primary || !actorHandle) return null;
	const conversation = buildIMessageApprovalConversationKeyForInbound({
		chatGuid: message.chat_guid,
		chatIdentifier: message.chat_identifier,
		chatId: message.chat_id,
		isGroup: message.is_group,
		actorHandle
	});
	if (!normalizeConversationKey(conversation)) return null;
	return {
		conversation,
		messageId: primary,
		messageIdCandidates,
		actorHandle,
		reactionKey,
		action: reaction.action
	};
}
async function handleIMessageApprovalReaction(params) {
	const event = readApprovalReactionEvent(params.message, params.bodyText);
	if (!event) return {
		handled: false,
		stopPolling: false
	};
	if (event.action === "removed") return {
		handled: false,
		stopPolling: false
	};
	let matchedTarget = null;
	let matchedMessageId = null;
	for (const candidate of event.messageIdCandidates) {
		matchedTarget = await resolveIMessageApprovalReactionTargetWithPersistence({
			accountId: params.accountId,
			conversation: event.conversation,
			messageId: candidate,
			reactionKey: event.reactionKey
		});
		if (matchedTarget) {
			matchedMessageId = candidate;
			break;
		}
	}
	const target = matchedTarget;
	if (!target) return {
		handled: false,
		stopPolling: false
	};
	const settlement = await settleApprovalReaction({
		request: {
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision: target.decision,
			channel: "imessage",
			accountId: params.accountId,
			senderId: event.actorHandle,
			gatewayUrl: params.gatewayUrl,
			...params.gatewayRuntime ? { gatewayRuntime: params.gatewayRuntime } : {}
		},
		approvers: getIMessageApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId
		}),
		authorizeActorAction: (input) => imessageApprovalAuth.authorizeActorAction(input),
		loadResolver: loadResolveApprovalOverGateway,
		clearTarget: async () => {
			await Promise.all(event.messageIdCandidates.map((candidate) => unregisterIMessageApprovalReactionTarget({
				accountId: params.accountId,
				conversation: event.conversation,
				messageId: candidate
			})));
		},
		onResolved: (result) => {
			const outcome = result.applied ? "resolved" : "already resolved";
			params.logVerboseMessage?.(`imessage: approval reaction ${outcome} id=${target.approvalId} sender=${event.actorHandle} ${formatCanonicalApprovalTerminalState(result.approval)} via messageId=${matchedMessageId ?? event.messageId}`);
		},
		onError: (error) => {
			try {
				getOptionalIMessageRuntime()?.logging.getChildLogger({
					plugin: "imessage",
					feature: "approval-reactions"
				}).warn("approval reaction failed", {
					approvalId: target.approvalId,
					senderId: event.actorHandle,
					error: String(error)
				});
			} catch {}
		},
		logVerboseMessage: params.logVerboseMessage
	});
	return settlement === "denied" ? {
		handled: true,
		stopPolling: false
	} : {
		handled: true,
		stopPolling: true,
		stopPollingReason: settlement
	};
}
async function maybeResolveIMessageApprovalReaction(params) {
	return (await handleIMessageApprovalReaction(params)).handled;
}
function clearIMessageApprovalReactionTargetsForTest() {
	imessageApprovalReactionTargets.clearForTest();
	clearIMessageApprovalReactionPollTargetsForTest();
	loadResolveApprovalOverGateway.clear();
}
//#endregion
export { unregisterIMessageApprovalReactionTarget as a, buildIMessageApprovalConversationKeyForTarget as c, normalizeConversationKey as d, registerIMessageApprovalReactionTarget as i, enumerateApprovalTargetKeys as l, handleIMessageApprovalReaction as n, listPendingIMessageApprovalReactionPollTargets as o, maybeResolveIMessageApprovalReaction as r, buildIMessageApprovalConversationKeyForInbound as s, approval_reactions_exports as t, enumerateConversationKeyForms as u };
