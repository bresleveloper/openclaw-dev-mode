import { c as parseIMessageTarget, o as normalizeIMessageHandle, t as formatIMessageChatTarget } from "./targets-BicBiYsM.mjs";
import { d as resolveIMessageChatDbLookupPath, l as resolveIMessageRemoteHost, n as hasExclusiveIMessageLocalDatabase, o as resolveIMessageAccount } from "./accounts-evTpvJMv.mjs";
import { C as resolveIMessageDirectChatService, _ as resolveIMessageSentEchoEntryKey, b as chatContextFromIMessageTarget, c as rememberIMessageReplyCache, f as IMESSAGE_SENT_ECHOES_NAMESPACE, g as resolveIMessageEchoMediaKey, n as createIMessageRpcClient, p as IMESSAGE_SENT_ECHOES_TTL_MS, r as runIMessageCliJsonCommand, t as IMessageRpcRequestError } from "./client-12apu4Ip.mjs";
import { a as normalizeIMessageMessageId, i as normalizeIMessageGuid } from "./actions-DJqbUmbN.mjs";
import { n as getOptionalIMessageRuntime, t as getIMessageRuntime } from "./runtime-Cza4CY5T.mjs";
import { d as getIMessageApprovalApprovers, f as imessageApprovalAuth } from "./channel-CL73qdMG.mjs";
import { n as sanitizeIMessageFinalOutboundText, t as protectIMessageFencedRoleMarkers } from "./sanitize-outbound-C0x4BPky.mjs";
import { a as withIMessageReceiptGuidReader, r as resolveAuthorizedIMessageReplyReference, t as withIMessageRemoteFile } from "./remote-file-BU7pA-Zi.mjs";
import { d as normalizeConversationKey, i as registerIMessageApprovalReactionTarget, l as enumerateApprovalTargetKeys, s as buildIMessageApprovalConversationKeyForInbound, u as enumerateConversationKeyForms } from "./approval-reactions-L9Ul7PAu.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { accessSync, constants } from "node:fs";
import { basename } from "node:path";
import { extractOriginalFilename, kindFromMime, resolveOutboundAttachmentFromUrl } from "openclaw/plugin-sdk/media-runtime";
import { logVerbose, sleep } from "openclaw/plugin-sdk/runtime-env";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { PlatformMessageNotDispatchedError, isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { racePromiseWithAbortSignal } from "openclaw/plugin-sdk/time-runtime";
import { addApprovalReactionHintToText, createApprovalReactionTargetStore, listApprovalReactionBindings } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { convertMarkdownTables, stripInlineDirectiveTagsForDelivery } from "openclaw/plugin-sdk/text-chunking";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
//#region extensions/imessage/src/approval-control-binding-window.ts
const pendingByConversation = /* @__PURE__ */ new Map();
function approvalControlBindingAbortError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : new Error("iMessage approval control binding aborted", { cause: reason });
}
function bindingKeys(accountId, conversation) {
	const account = accountId.trim();
	return account ? enumerateConversationKeyForms(conversation).map((form) => `${account}:${form}`) : [];
}
/** Marks the send-to-binding interval during which a visible control is not yet resolvable. */
function beginIMessageApprovalControlBinding(params) {
	const keys = bindingKeys(params.accountId, params.conversation);
	const { promise, resolve } = createDeferred();
	let closed = false;
	const window = {
		done: promise,
		close: () => {
			if (closed) return;
			closed = true;
			for (const key of keys) {
				const windows = pendingByConversation.get(key);
				windows?.delete(window);
				if (windows?.size === 0) pendingByConversation.delete(key);
			}
			resolve();
		}
	};
	for (const key of keys) {
		const windows = pendingByConversation.get(key) ?? /* @__PURE__ */ new Set();
		windows.add(window);
		pendingByConversation.set(key, windows);
	}
	return { close: window.close };
}
/** Waits for one matching delivery to finish binding; callers recheck until none remain. */
async function waitForIMessageApprovalControlBinding(params) {
	const windows = /* @__PURE__ */ new Set();
	for (const key of bindingKeys(params.accountId, params.conversation)) for (const window of pendingByConversation.get(key) ?? []) windows.add(window);
	if (windows.size === 0) return false;
	if (params.abortSignal?.aborted) throw approvalControlBindingAbortError(params.abortSignal);
	await racePromiseWithAbortSignal(Promise.race([...windows].map((window) => window.done)), params.abortSignal, approvalControlBindingAbortError);
	return true;
}
function clearIMessageApprovalControlBindingsForTest() {
	for (const windows of pendingByConversation.values()) for (const window of windows) window.close();
	pendingByConversation.clear();
}
const iMessageApprovalControlBindings = {
	begin: beginIMessageApprovalControlBinding,
	wait: waitForIMessageApprovalControlBinding,
	clearForTest: clearIMessageApprovalControlBindingsForTest
};
//#endregion
//#region extensions/imessage/src/approval-polls.ts
const TARGET_NAMESPACE = "imessage.approval-polls";
const TOMBSTONE_NAMESPACE = "imessage.approval-poll-tombstones";
const MAX_ENTRIES = 1e3;
const DEFAULT_TARGET_TTL_MS = 864e5;
/**
* Messages has no close-poll API, so a resolved approval's balloon stays
* tappable forever. Tombstones outlive the binding so late taps are swallowed
* instead of reaching the agent as "Poll vote: ..." prose. Persisted, because a
* gateway restart must not turn old polls back into chat noise.
*/
const TOMBSTONE_TTL_MS = 2592e6;
const APPROVAL_DECISIONS = /* @__PURE__ */ new Set([
	"allow-once",
	"allow-always",
	"deny"
]);
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const reportPersistentError = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-poll-state", "iMessage persistent approval poll state failed");
function readPersistedTarget(value) {
	const target = value;
	if (!target || typeof target.approvalId !== "string" || target.approvalKind !== "exec" && target.approvalKind !== "plugin" && target.approvalKind !== "system-agent" || !Array.isArray(target.optionDecisions)) return null;
	const optionDecisions = target.optionDecisions.flatMap((pair) => {
		if (!Array.isArray(pair) || pair.length !== 2) return [];
		const [optionId, decision] = pair;
		if (typeof optionId !== "string" || typeof decision !== "string") return [];
		return APPROVAL_DECISIONS.has(decision) ? [[optionId, decision]] : [];
	});
	return optionDecisions.length > 0 ? {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		optionDecisions
	} : null;
}
const pollTargets = createApprovalReactionTargetStore({
	namespace: TARGET_NAMESPACE,
	maxEntries: MAX_ENTRIES,
	defaultTtlMs: DEFAULT_TARGET_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentError,
	readPersistedTarget
});
const pollTombstones = createApprovalReactionTargetStore({
	namespace: TOMBSTONE_NAMESPACE,
	maxEntries: MAX_ENTRIES,
	defaultTtlMs: TOMBSTONE_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentError,
	readPersistedTarget: (value) => {
		const approvalId = value?.approvalId;
		return typeof approvalId === "string" ? { approvalId } : null;
	}
});
/**
* Poll option labels for an approval, in canonical decision order. Reuses the
* tapback bindings so the two controls never disagree about which decisions
* exist or what they are called.
*/
function buildApprovalPollOptions(params) {
	return listApprovalReactionBindings(params).map((binding) => ({
		decision: binding.decision,
		text: `${binding.emoji} ${binding.label}`
	}));
}
/**
* Match the option ids Messages returned back to decisions. Text only pairs the
* response against what we asked for; the id is what a later vote is authorized
* against, since option text in a vote payload is attacker-shaped.
*/
function mapSentPollOptionsToDecisions(params) {
	if (params.sent.length !== params.requested.length) return [];
	const byText = new Map(params.requested.map((option) => [option.text.trim(), option.decision]));
	const seenIds = /* @__PURE__ */ new Set();
	const seenDecisions = /* @__PURE__ */ new Set();
	const mapped = [];
	for (const option of params.sent) {
		const id = option.id.trim();
		const decision = byText.get(option.text.trim());
		if (!id || !decision || seenIds.has(id) || seenDecisions.has(decision)) return [];
		seenIds.add(id);
		seenDecisions.add(decision);
		mapped.push([id, decision]);
	}
	return seenDecisions.size === params.requested.length ? mapped : [];
}
async function registerIMessageApprovalPollTarget(params) {
	const accountId = params.accountId.trim();
	const approvalId = params.approvalId.trim();
	const expiresAtMs = asDateTimestampMs(params.expiresAtMs);
	const ttlMs = expiresAtMs === void 0 ? void 0 : expiresAtMs - Date.now();
	if (!accountId || !approvalId || params.optionDecisions.length === 0 || ttlMs === void 0 || ttlMs <= 0) return false;
	const keys = enumeratePollTargetKeys({
		accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionDecisions.map(([optionId]) => optionId)
	});
	if (keys.length === 0) return false;
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		optionDecisions: params.optionDecisions
	};
	await Promise.all(keys.flatMap((key) => [pollTargets.register(key, target, { ttlMs }), pollTombstones.register(key, { approvalId }, { ttlMs: TOMBSTONE_TTL_MS })]));
	return true;
}
async function unregisterIMessageApprovalPollTarget(params) {
	const keys = enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionDecisions?.map(([optionId]) => optionId)
	});
	await Promise.all(keys.flatMap((key) => [pollTargets.delete(key), pollTombstones.register(key, { approvalId: params.approvalId ?? "" }, { ttlMs: TOMBSTONE_TTL_MS })]));
}
/**
* Consume votes for a poll that was created but could not be safely bound.
* Messages has no reliable retract primitive for this balloon.
*/
async function registerIMessageApprovalPollTombstone(params) {
	const keys = enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionIds
	});
	if (keys.length === 0) return false;
	await Promise.all(keys.map((key) => pollTombstones.register(key, { approvalId: params.approvalId }, { ttlMs: TOMBSTONE_TTL_MS })));
	return true;
}
function enumeratePollTargetKeys(params) {
	const references = [...params.pollGuid?.trim() ? [`guid:${normalizeIMessageGuid(params.pollGuid)}`] : [], ...(params.optionIds ?? []).flatMap((optionId) => {
		const normalized = optionId.trim();
		return normalized ? [`option:${normalized}`] : [];
	})];
	return [...new Set(references.flatMap((messageId) => enumerateApprovalTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		messageId
	})))];
}
function readPollVoteEvent(message) {
	const poll = message.poll;
	if (!poll || poll.kind !== "vote") return null;
	const pollGuid = normalizeIMessageGuid(typeof poll.original_guid === "string" && poll.original_guid || typeof poll.poll_guid === "string" && poll.poll_guid || "");
	const sender = normalizeIMessageHandle((message.sender ?? "").trim());
	const destinationCallerId = normalizeIMessageHandle((message.destination_caller_id ?? "").trim());
	const actorHandle = (message.is_from_me !== true && Boolean(sender) && Boolean(destinationCallerId) && sender === destinationCallerId ? "" : sender) || (message.is_from_me === true ? destinationCallerId : "");
	if (!pollGuid || !actorHandle) return null;
	const rawVotes = Array.isArray(poll.votes) ? poll.votes : poll.vote ? [poll.vote] : [];
	let malformedVotes = false;
	const votes = rawVotes.flatMap((vote) => {
		if (!vote || typeof vote.option_id !== "string") {
			malformedVotes = true;
			return [];
		}
		const optionId = vote.option_id.trim();
		if (!optionId) {
			malformedVotes = true;
			return [];
		}
		return [{
			optionId,
			participantKey: typeof vote.participant === "string" ? normalizeIMessageHandle(vote.participant.trim().replace(/^[ep]:/iu, "")) : "",
			selected: vote.event_type === "selected"
		}];
	});
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
		pollGuid,
		actorHandle,
		votes,
		malformedVotes
	};
}
async function lookupPollRecord(store, params) {
	for (const key of enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionIds
	})) {
		const target = await store.lookup(key);
		if (target) return target;
	}
	return null;
}
/**
* Outcomes for votes we own are logged at info, not verbose: an approval
* decision is security-relevant, and diagnosing "the tap did nothing" must not
* require re-running the gateway in debug.
*/
function info(message, fields) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-polls"
		}).info(message, fields);
	} catch {}
}
function warn$1(message, fields) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-polls"
		}).warn(message, fields);
	} catch {}
}
/**
* Resolve a pending approval from an inbound native poll vote. Returns true when
* the event belongs to an approval poll we own, so the monitor can stop it
* before the ordinary dispatch pipeline renders it as prose.
*/
async function maybeResolveIMessageApprovalPollVote(params) {
	const event = readPollVoteEvent(params.message);
	if (!event) return false;
	const lookupKey = {
		accountId: params.accountId,
		conversation: event.conversation,
		pollGuid: event.pollGuid,
		optionIds: event.votes.map((vote) => vote.optionId)
	};
	const target = await lookupPollRecord(pollTargets, lookupKey);
	if (!target) return Boolean(await lookupPollRecord(pollTombstones, lookupKey));
	if (event.malformedVotes) {
		warn$1("approval poll vote ignored: malformed complete vote set", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const directlyAttributedVotes = event.votes.filter((vote) => vote.participantKey === event.actorHandle);
	const participantKeys = new Set(event.votes.map((vote) => vote.participantKey).filter(Boolean));
	const actorVotes = directlyAttributedVotes.length > 0 ? directlyAttributedVotes : event.votes.length === 1 || participantKeys.size === 1 ? event.votes : [];
	if (actorVotes.length === 0) {
		warn$1("approval poll vote participants did not identify the transport actor", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const selectedVotes = actorVotes.filter((vote) => vote.selected);
	if (selectedVotes.length === 0) {
		info("approval poll deselect ignored; first selection decides", { approvalId: target.approvalId });
		return true;
	}
	const selectedDecisions = selectedVotes.map((vote) => ({
		optionId: vote.optionId,
		decision: target.optionDecisions.find(([optionId]) => optionId === vote.optionId)?.[1]
	}));
	if (selectedDecisions.some((entry) => !entry.decision)) {
		warn$1("approval poll vote ignored: selected option not bound to a decision", {
			approvalId: target.approvalId,
			optionIds: selectedDecisions.map((entry) => entry.optionId)
		});
		return true;
	}
	const decisions = [...new Set(selectedDecisions.map((entry) => entry.decision))];
	if (decisions.length !== 1) {
		warn$1("approval poll vote ignored: ambiguous selected decisions", {
			approvalId: target.approvalId,
			decisions
		});
		return true;
	}
	const decision = decisions[0];
	if (!decision) return true;
	if (getIMessageApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) {
		info("approval poll vote denied: no explicit approvers configured", { approvalId: target.approvalId });
		return true;
	}
	if (!imessageApprovalAuth.authorizeActorAction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: event.actorHandle,
		action: "approve",
		approvalKind: target.approvalKind
	}).authorized) {
		info("approval poll vote denied: sender not an approver", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const resolveApprovalOverGateway = await loadResolveApprovalOverGateway();
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision,
			channel: "imessage",
			accountId: params.accountId,
			senderId: event.actorHandle,
			gatewayUrl: params.gatewayUrl,
			...params.gatewayRuntime ? { gatewayRuntime: params.gatewayRuntime } : {}
		});
		await unregisterIMessageApprovalPollTarget({
			...lookupKey,
			optionDecisions: target.optionDecisions,
			approvalId: target.approvalId
		});
		info(`approval poll vote ${result.applied ? "resolved" : "already resolved"}`, {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle,
			decision
		});
		return true;
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			await unregisterIMessageApprovalPollTarget({
				...lookupKey,
				optionDecisions: target.optionDecisions,
				approvalId: target.approvalId
			});
			info("approval poll vote ignored: approval already gone", { approvalId: target.approvalId });
			return true;
		}
		warn$1("approval poll vote failed", {
			approvalId: target.approvalId,
			senderId: event.actorHandle,
			error: String(error)
		});
		throw error;
	}
}
function clearIMessageApprovalPollTargetsForTest() {
	pollTargets.clearForTest();
	pollTombstones.clearForTest();
	loadResolveApprovalOverGateway.clear();
}
const iMessageApprovalPollTargets = {
	register: registerIMessageApprovalPollTarget,
	unregister: unregisterIMessageApprovalPollTarget,
	registerTombstone: registerIMessageApprovalPollTombstone,
	clearForTest: clearIMessageApprovalPollTargetsForTest
};
//#endregion
//#region extensions/imessage/src/monitor/echo-text-corruption.ts
function isLeadingEchoTextCorruptionMarker(code) {
	return code === 0 || code === 65279 || code === 65533 || code === 65534 || code === 65535;
}
function normalizeIMessageEchoText(text) {
	if (!text) return;
	const normalized = text.replace(/\r\n?/g, "\n").trim();
	let offset = 0;
	while (offset < normalized.length && isLeadingEchoTextCorruptionMarker(normalized.charCodeAt(offset))) offset += 1;
	return normalized.slice(offset).trim() || void 0;
}
//#endregion
//#region extensions/imessage/src/monitor/persisted-echo-cache.ts
let persistenceFailureLogged = false;
function reportFailure(scope, err) {
	if (persistenceFailureLogged) return;
	persistenceFailureLogged = true;
	logVerbose(`imessage echo-cache: ${scope} disabled after first failure: ${String(err)}`);
}
function normalizeMedia(media) {
	if (!resolveIMessageEchoMediaKey(media)) return;
	const contentType = media?.contentType?.trim().toLowerCase() || void 0;
	const kind = media?.kind ?? void 0;
	return {
		...kind ? { kind } : {},
		...contentType ? { contentType } : {}
	};
}
function openPersistedEchoStore() {
	return getIMessageRuntime().state.openKeyedStore({
		namespace: IMESSAGE_SENT_ECHOES_NAMESPACE,
		maxEntries: 256
	});
}
function remainingTtlMs(timestamp) {
	const remaining = IMESSAGE_SENT_ECHOES_TTL_MS - Math.max(0, Date.now() - timestamp);
	return remaining > 0 ? remaining : void 0;
}
function resolveEntryTtlMs(entry, ttlMs) {
	if (typeof ttlMs === "number" && Number.isFinite(ttlMs) && ttlMs > 0) return ttlMs;
	return remainingTtlMs(entry.timestamp);
}
function isLiveEntry(entry, now = Date.now()) {
	const cutoff = now - IMESSAGE_SENT_ECHOES_TTL_MS;
	return entry.timestamp >= cutoff && (entry.expiresAt == null || entry.expiresAt > now);
}
async function readRecentEntries() {
	try {
		return (await openPersistedEchoStore().entries()).map(({ value }) => value).filter((entry) => isLiveEntry(entry)).toSorted((a, b) => a.timestamp - b.timestamp).slice(-256);
	} catch (err) {
		reportFailure("read", err);
		return [];
	}
}
async function persistEntry(entry, ttlMs) {
	const effectiveTtlMs = resolveEntryTtlMs(entry, ttlMs);
	if (!effectiveTtlMs) return;
	const key = resolveIMessageSentEchoEntryKey(entry);
	try {
		await openPersistedEchoStore().register(key, entry, { ttlMs: effectiveTtlMs });
	} catch (err) {
		reportFailure("write", err);
		return;
	}
	return key;
}
async function rememberPersistedIMessageEcho(params) {
	const text = normalizeIMessageEchoText(params.text);
	const media = normalizeMedia(params.media);
	const messageId = normalizeIMessageMessageId(params.messageId);
	const entry = {
		scope: params.scope,
		timestamp: Date.now(),
		...text ? { text } : {},
		...media ? { media } : {},
		...messageId ? { messageId } : {},
		...params.pending ? { pending: true } : {}
	};
	if (typeof params.ttlMs === "number" && Number.isFinite(params.ttlMs) && params.ttlMs > 0) entry.expiresAt = entry.timestamp + params.ttlMs;
	if (!entry.text && !entry.media && !entry.messageId) return;
	return await persistEntry(entry, params.ttlMs);
}
async function forgetPersistedIMessageEchoKey(key) {
	if (!key) return;
	try {
		await openPersistedEchoStore().delete(key);
	} catch (err) {
		reportFailure("delete", err);
	}
}
async function hasPersistedIMessageEcho(params) {
	const text = normalizeIMessageEchoText(params.text);
	const mediaKey = resolveIMessageEchoMediaKey(params.media);
	const messageId = normalizeIMessageMessageId(params.messageId);
	if (!text && !mediaKey && !messageId) return false;
	for (const entry of await readRecentEntries()) {
		if (entry.scope !== params.scope) continue;
		if (messageId && entry.messageId === messageId) return true;
		const hasConflictingMessageIds = Boolean(messageId && entry.messageId && messageId !== entry.messageId);
		if (text && (!hasConflictingMessageIds || params.skipIdShortCircuit) && entry.text === text && (!entry.pending || params.includePendingText)) return true;
		if (mediaKey && !hasConflictingMessageIds && resolveIMessageEchoMediaKey(entry.media) === mediaKey && (!entry.pending || params.includePendingText)) return true;
	}
	return false;
}
//#endregion
//#region extensions/imessage/src/send-transport.ts
function normalizeIMessageRpcSendError(error) {
	if (!(error instanceof IMessageRpcRequestError)) return error;
	const data = asOptionalRecord(error.data);
	return data?.disposition === "not_started" && data.retry_safe === true ? new PlatformMessageNotDispatchedError(error.message, { cause: error }) : error;
}
async function requestIMessageRpcSend(client, method, params, timeoutMs, handoff) {
	handoff.assertDirectAdapterHandoff?.();
	await handoff.onPlatformSendDispatch?.();
	handoff.assertDirectAdapterHandoff?.();
	try {
		return await client.request(method, params, { timeoutMs });
	} catch (error) {
		throw normalizeIMessageRpcSendError(error);
	}
}
//#endregion
//#region extensions/imessage/src/send.ts
const MIN_PENDING_PERSISTED_ECHO_TTL_MS = 6e4;
const PENDING_PERSISTED_ECHO_GRACE_MS = 5e3;
function resolveMessageId(result) {
	if (!result) return null;
	const raw = typeof result.messageGuid === "string" && result.messageGuid.trim() || typeof result.messageId === "string" && result.messageId.trim() || typeof result.message_id === "string" && result.message_id.trim() || typeof result.id === "string" && result.id.trim() || typeof result.guid === "string" && result.guid.trim() || (typeof result.message_id === "number" ? String(result.message_id) : null) || (typeof result.id === "number" ? String(result.id) : null);
	return raw ? raw.trim() : null;
}
function resolveOutboundMessageGuid(result) {
	if (!result) return null;
	for (const key of [
		"messageGuid",
		"guid",
		"messageId",
		"message_id",
		"id"
	]) {
		const guid = normalizeResolvedMessageGuid(result[key]);
		if (guid) return guid;
	}
	return null;
}
function isNumericMessageRowId(value) {
	return typeof value === "string" && /^\d+$/.test(value.trim());
}
function normalizeResolvedMessageGuid(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return normalizeIMessageMessageId(trimmed) && !isNumericMessageRowId(trimmed) ? trimmed : null;
}
async function resolveMessageGuidFromChatDb(params) {
	const dbPath = params.dbPath?.trim();
	const messageId = params.messageId.trim();
	if (!dbPath || !isNumericMessageRowId(messageId)) return null;
	return normalizeResolvedMessageGuid(await withIMessageReceiptGuidReader(dbPath, (read) => read({
		type: "messageGuid",
		input: { messageId }
	})));
}
function canResolveLatestSentMessageGuidFromChatDb(dbPath) {
	const normalizedDbPath = dbPath?.trim();
	if (!normalizedDbPath) return false;
	try {
		accessSync(normalizedDbPath, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveApprovalBindingMessageGuid(params) {
	const immediateGuid = resolveOutboundMessageGuid(params.result);
	if (immediateGuid) return immediateGuid;
	const messageId = params.messageId?.trim();
	if (!messageId || !isNumericMessageRowId(messageId)) return null;
	return normalizeResolvedMessageGuid(await (params.resolveMessageGuidImpl ?? resolveMessageGuidFromChatDb)({
		dbPath: params.dbPath,
		messageId
	}));
}
async function resolveFallbackSentMessageGuid(params) {
	const dbPath = params.dbPath?.trim();
	if (!params.resolveSentMessageGuidImpl && !canResolveLatestSentMessageGuidFromChatDb(dbPath)) return null;
	const deadlineMs = Date.now() + 5e3;
	const poll = async (resolver) => {
		while (Date.now() <= deadlineMs) {
			const resolved = normalizeResolvedMessageGuid(await resolver({
				dbPath: params.dbPath,
				target: params.target,
				text: params.text,
				sentAfterMs: params.sentAfterMs
			}));
			if (resolved) return resolved;
			if (Date.now() >= deadlineMs) return null;
			await sleep(250);
		}
		return null;
	};
	if (params.resolveSentMessageGuidImpl) return await poll(params.resolveSentMessageGuidImpl);
	if (!dbPath) return null;
	return await withIMessageReceiptGuidReader(dbPath, (read) => poll(({ target, text, sentAfterMs }) => read({
		type: "latestSentGuid",
		input: {
			target,
			text,
			sentAfterMs
		}
	})));
}
function resolveOutboundEchoMedia(mediaContentType) {
	if (!mediaContentType) return;
	return {
		contentType: mediaContentType,
		kind: kindFromMime(mediaContentType) ?? "unknown"
	};
}
function createIMessageSendReceipt(params) {
	const messageId = params.messageId.trim();
	const results = normalizeIMessageMessageId(messageId) ? [{
		channel: "imessage",
		messageId,
		meta: { targetKind: params.target.kind }
	}] : [];
	if (results[0]) {
		if (params.target.kind === "chat_id") results[0].chatId = String(params.target.chatId);
		else if (params.target.kind === "chat_guid") results[0].conversationId = params.target.chatGuid;
		else if (params.target.kind === "chat_identifier") results[0].conversationId = params.target.chatIdentifier;
	}
	return createMessageReceiptFromOutboundResults({
		results,
		kind: params.kind,
		...params.replyToId ? { replyToId: params.replyToId } : {}
	});
}
async function withOriginalIMessageAttachmentPath(filePath, send) {
	const filename = extractOriginalFilename(filePath);
	if (basename(filePath) === filename) return await send(filePath);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-imessage-outbound-"
	}, async (workspace) => await send(await workspace.copyIn(filename, filePath)));
}
function canSynthesizeAttachmentChatHandle(raw) {
	const trimmed = raw.trim();
	return trimmed.includes("@") || trimmed.startsWith("+");
}
function resolveOutboundEchoScope(params) {
	if (params.target.kind === "chat_id") return `${params.accountId}:${formatIMessageChatTarget(params.target.chatId)}`;
	if (params.target.kind === "chat_guid") return `${params.accountId}:chat_guid:${params.target.chatGuid}`;
	if (params.target.kind === "chat_identifier") return `${params.accountId}:chat_identifier:${params.target.chatIdentifier}`;
	return `${params.accountId}:imessage:${params.target.to}`;
}
function resolveIMessageSendFailure(result) {
	if (result.success !== false) return null;
	return typeof result.error === "string" && result.error.trim() ? result.error.trim() : "iMessage action failed";
}
function isIMessageRpcSendTimeout(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /imsg rpc timeout \(send\)/i.test(message);
}
function resultService(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized === "imessage" || normalized === "sms" ? normalized : void 0;
}
function resolvePendingPersistedEchoTtlMs(timeoutMs) {
	return Math.max(MIN_PENDING_PERSISTED_ECHO_TTL_MS, Math.max(0, timeoutMs) + PENDING_PERSISTED_ECHO_GRACE_MS);
}
function isAttachmentCommandFallbackError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /(?:unknown|unrecognized|invalid|unsupported)\s+(?:command|subcommand)|not a recognized command|send-attachment.*(?:not found|unsupported|unavailable)|private api bridge.*unavailable|requires the imsg private api bridge|run imsg launch/iu.test(message);
}
function isThreadedReplyUnsupportedError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /reply_to requires bridge transport|cannot send threaded repl|threaded repl(?:y|ies)\b.*(?:unsupported|not supported|requires|unavailable)|requires bridge transport/iu.test(message);
}
async function resolveAttachmentChatTarget(params) {
	if (params.target.kind === "chat_guid") return params.target.chatGuid;
	if (params.target.kind === "handle") {
		if (!canSynthesizeAttachmentChatHandle(params.target.to)) return null;
		const normalizedHandle = normalizeIMessageHandle(params.target.to);
		if (!normalizedHandle) return null;
		const service = params.target.service !== "auto" ? params.target.service : params.service;
		if (service === "sms") return `SMS;-;${normalizedHandle}`;
		if (service === "imessage") return `iMessage;-;${normalizedHandle}`;
		return `any;-;${normalizedHandle}`;
	}
	if (params.target.kind !== "chat_id") return null;
	const result = await params.runCliJson([
		"group",
		"--chat-id",
		String(params.target.chatId)
	]);
	return normalizeOptionalString(result.guid) ?? normalizeOptionalString(result.chat_guid) ?? null;
}
async function trySendAttachmentForTarget(params) {
	if (params.audioAsVoice && params.sendTransport === "applescript") throw new Error("iMessage voice messages require bridge transport; AppleScript cannot send native voice notes. Set sendTransport to bridge or auto.");
	if (params.target.kind === "handle" && !params.audioAsVoice && params.sendTransport !== "bridge" && (params.service === "sms" || params.service === "imessage")) return null;
	if (params.remoteHost && params.sendTransport === "applescript") return null;
	let attachmentChatTarget = null;
	if (params.remoteHost) {
		if (params.target.kind === "chat_guid") attachmentChatTarget = params.target.chatGuid;
		else if (params.target.kind === "chat_identifier") attachmentChatTarget = params.target.chatIdentifier;
		else if (params.target.kind === "handle") {
			const normalizedHandle = normalizeIMessageHandle(params.target.to);
			if (normalizedHandle) {
				const service = params.target.service !== "auto" ? params.target.service : params.service;
				attachmentChatTarget = `${service === "sms" ? "SMS" : service === "imessage" ? "iMessage" : "any"};-;${normalizedHandle}`;
			}
		} else attachmentChatTarget = formatIMessageChatTarget(params.target.chatId);
	} else try {
		attachmentChatTarget = await resolveAttachmentChatTarget({
			target: params.target,
			service: params.service,
			runCliJson: params.runCliJson
		});
	} catch (error) {
		if (!params.audioAsVoice && isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	if (!attachmentChatTarget) {
		if (params.audioAsVoice) throw new Error("iMessage voice messages require an existing chat and bridge transport.");
		return null;
	}
	params.assertDirectAdapterHandoff?.();
	const echoScope = resolveOutboundEchoScope({
		accountId: params.accountId,
		target: params.target
	});
	let result;
	let pendingEchoKey;
	try {
		pendingEchoKey = await rememberPersistedIMessageEcho({
			scope: echoScope,
			text: params.echoText,
			media: params.echoMedia,
			ttlMs: params.pendingEchoTtlMs,
			pending: true
		});
		result = await withOriginalIMessageAttachmentPath(params.filePath, async (attachmentPath) => {
			if (params.remoteHost) return await params.withRemoteFile({
				remoteHost: params.remoteHost,
				localPath: attachmentPath,
				timeoutMs: params.timeoutMs,
				assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
				use: async (remotePath) => {
					const rpcParams = {
						file: remotePath,
						...params.audioAsVoice ? { audio: true } : {},
						...params.replyToId ? { reply_to: params.replyToId } : {}
					};
					if (params.target.kind === "chat_id") rpcParams.chat_id = params.target.chatId;
					else if (params.target.kind === "chat_guid") rpcParams.chat_guid = params.target.chatGuid;
					else rpcParams.chat_identifier = attachmentChatTarget;
					return await params.requestRpc("send.attachment", rpcParams);
				}
			});
			params.assertDirectAdapterHandoff?.();
			await params.onPlatformSendDispatch?.();
			params.assertDirectAdapterHandoff?.();
			return await params.runCliJson([
				"send-attachment",
				"--chat",
				attachmentChatTarget,
				"--file",
				attachmentPath,
				...params.audioAsVoice ? ["--audio"] : [],
				...params.replyToId ? ["--reply-to", params.replyToId] : [],
				"--transport",
				params.sendTransport === "bridge" ? "dylib" : params.sendTransport
			]);
		});
		const failure = resolveIMessageSendFailure(result);
		if (failure) throw new Error(failure);
	} catch (error) {
		await forgetPersistedIMessageEchoKey(pendingEchoKey);
		if (!params.audioAsVoice && isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	const resolvedId = resolveMessageId(result);
	const approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
		dbPath: params.dbPath,
		messageId: resolvedId,
		result,
		resolveMessageGuidImpl: params.resolveMessageGuidImpl
	});
	const messageId = resolvedId ?? (result.ok || result.success ? "ok" : "unknown");
	await rememberPersistedIMessageEcho({
		scope: echoScope,
		text: params.echoText,
		media: params.echoMedia,
		messageId: resolvedId ?? void 0
	});
	if (resolvedId && normalizeIMessageMessageId(resolvedId)) await rememberIMessageReplyCache({
		accountId: params.accountId,
		messageId: resolvedId,
		chatGuid: params.target.kind === "chat_guid" ? params.target.chatGuid : params.target.kind === "chat_id" ? attachmentChatTarget : void 0,
		chatIdentifier: params.target.kind === "chat_identifier" || params.target.kind === "handle" ? attachmentChatTarget : void 0,
		chatId: params.target.kind === "chat_id" ? params.target.chatId : void 0,
		timestamp: Date.now(),
		isFromMe: true
	});
	return {
		messageId,
		...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
		sentText: "",
		...params.echoText ? { echoText: params.echoText } : {},
		...params.echoMedia ? { echoMedia: params.echoMedia } : {},
		receipt: createIMessageSendReceipt({
			messageId,
			target: params.target,
			kind: params.audioAsVoice ? "voice" : "media",
			...params.replyToId ? { replyToId: params.replyToId } : {}
		})
	};
}
async function sendMessageIMessage(to, text, opts) {
	const cfg = requireRuntimeConfig(opts.config, "iMessage send");
	opts.assertDirectAdapterHandoff?.();
	const account = opts.account ?? resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
	const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: account.config.remoteHost
	});
	opts.assertDirectAdapterHandoff?.();
	const chatDbLookupPath = resolveIMessageChatDbLookupPath({
		cliPath,
		dbPath,
		remoteHost
	});
	const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
	const service = opts.service ?? (target.kind === "handle" && (target.serviceExplicit || target.service !== "auto") ? target.service : void 0) ?? account.config.service;
	const sendTransport = account.config.sendTransport ?? "auto";
	const resolvedReplyToId = await resolveAuthorizedIMessageReplyReference({
		account,
		target,
		cliPath,
		dbPath,
		remoteHost,
		hasExclusiveLocalDatabase: hasExclusiveIMessageLocalDatabase({
			cfg,
			account,
			cliPath,
			dbPath,
			remoteHost
		}),
		service,
		replyToId: opts.replyToId,
		conversationReadOrigin: opts.conversationReadOrigin
	});
	opts.assertDirectAdapterHandoff?.();
	const timeoutMs = opts.timeoutMs ?? Math.max(account.config.probeTimeoutMs ?? 0, 18e4);
	const pendingEchoTtlMs = resolvePendingPersistedEchoTtlMs(timeoutMs);
	const region = opts.region?.trim() || account.config.region?.trim() || "US";
	const maxBytes = typeof opts.maxBytes === "number" ? opts.maxBytes : typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb * 1024 * 1024 : 16777216;
	let message = opts.approvalPrompt ? addApprovalReactionHintToText({
		text,
		allowedDecisions: opts.approvalPrompt.allowedDecisions
	}) : text;
	const protectedRoles = protectIMessageFencedRoleMarkers(message);
	message = protectedRoles.text;
	let filePath;
	let mediaContentType;
	if (opts.mediaUrl?.trim()) {
		const resolved = await (opts.resolveAttachmentImpl ?? resolveOutboundAttachmentFromUrl)(opts.mediaUrl.trim(), maxBytes, {
			mediaAccess: opts.mediaAccess,
			localRoots: opts.mediaLocalRoots,
			readFile: opts.mediaReadFile
		});
		filePath = resolved.path;
		mediaContentType = resolved.contentType ?? void 0;
		opts.assertDirectAdapterHandoff?.();
	}
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	if (message.trim()) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "imessage",
			accountId: account.accountId
		});
		protectedRoles.verifyProtectedRoles(message);
		message = convertMarkdownTables(message, tableMode);
		protectedRoles.verifyProtectedRoles(message);
	}
	protectedRoles.verifyProtectedRoles(message);
	message = stripInlineDirectiveTagsForDelivery(message).text;
	protectedRoles.verifyProtectedRoles(message);
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const formatted = sanitizeIMessageFinalOutboundText(message, {
		formatMarkdown: true,
		protection: protectedRoles
	});
	message = formatted.text;
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const echoText = message.trim() || void 0;
	const echoMedia = filePath ? resolveOutboundEchoMedia(mediaContentType) : void 0;
	let effectiveReplyToId = resolvedReplyToId;
	const runCli = opts.runCliJson ?? ((args) => runIMessageCliJsonCommand({
		args,
		cliPath,
		dbPath,
		timeoutMs
	}));
	const runCliJson = async (args) => {
		opts.assertDirectAdapterHandoff?.();
		return await runCli(args);
	};
	const requestOwnedRpc = async (method, rpcParams) => {
		opts.assertDirectAdapterHandoff?.();
		const rpcClient = await (opts.createClient ?? createIMessageRpcClient)({
			cliPath,
			dbPath,
			remoteHost
		});
		try {
			return await requestIMessageRpcSend(rpcClient, method, rpcParams, timeoutMs, opts);
		} finally {
			await rpcClient.stop();
		}
	};
	const withRemoteFile = opts.withRemoteFile ?? withIMessageRemoteFile;
	if (filePath && (!resolvedReplyToId || opts.audioAsVoice)) {
		const attachmentResult = await trySendAttachmentForTarget({
			accountId: account.accountId,
			dbPath: chatDbLookupPath,
			target,
			service,
			sendTransport,
			filePath,
			audioAsVoice: opts.audioAsVoice,
			...resolvedReplyToId ? { replyToId: resolvedReplyToId } : {},
			echoMedia,
			pendingEchoTtlMs,
			timeoutMs,
			remoteHost,
			runCliJson,
			requestRpc: requestOwnedRpc,
			withRemoteFile,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl,
			assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff,
			onPlatformSendDispatch: opts.onPlatformSendDispatch
		});
		if (attachmentResult) {
			if (!message.trim()) return attachmentResult;
			await opts.onDeliveryResult?.({
				...attachmentResult,
				content: "",
				messageIds: attachmentResult.receipt.platformMessageIds,
				visibleReplySent: true,
				...attachmentResult.receipt.replyToId ? { replyToId: attachmentResult.receipt.replyToId } : {}
			});
			let captionResult;
			try {
				captionResult = await sendMessageIMessage(to, text, {
					...opts,
					mediaUrl: void 0,
					onDeliveryResult: void 0
				});
			} catch (error) {
				throw createChannelPartialDeliveryError(error, {
					content: "",
					messageIds: attachmentResult.receipt.platformMessageIds,
					receipt: attachmentResult.receipt,
					visibleReplySent: true
				});
			}
			return {
				messageId: normalizeIMessageMessageId(attachmentResult.messageId) ? attachmentResult.messageId : captionResult.messageId,
				...captionResult.guid ?? attachmentResult.guid ? { guid: captionResult.guid ?? attachmentResult.guid } : {},
				sentText: captionResult.sentText,
				...captionResult.echoText ?? attachmentResult.echoText ? { echoText: captionResult.echoText ?? attachmentResult.echoText } : {},
				...attachmentResult.echoMedia ? { echoMedia: attachmentResult.echoMedia } : {},
				receipt: createMessageReceiptFromOutboundResults({
					results: [{ receipt: attachmentResult.receipt }, { receipt: captionResult.receipt }],
					sentAt: Math.max(attachmentResult.receipt.sentAt, captionResult.receipt.sentAt)
				})
			};
		}
	}
	const params = {
		text: message,
		service: service || "auto",
		region,
		transport: sendTransport
	};
	if (resolvedReplyToId) params.reply_to = resolvedReplyToId;
	if (formatted.ranges.length > 0) params.formatting = formatted.ranges;
	if (filePath) params.file = filePath;
	if (target.kind === "chat_id") params.chat_id = target.chatId;
	else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
	else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
	else params.to = target.to;
	const echoScope = resolveOutboundEchoScope({
		accountId: account.accountId,
		target
	});
	opts.assertDirectAdapterHandoff?.();
	const client = opts.client ?? await (opts.createClient ?? createIMessageRpcClient)({
		cliPath,
		dbPath,
		remoteHost
	});
	const shouldClose = !opts.client;
	const requestSuccessfulSend = async (sendParams) => {
		const request = async (nativeParams) => await requestIMessageRpcSend(client, "send", nativeParams, timeoutMs, opts);
		const response = filePath ? await withOriginalIMessageAttachmentPath(filePath, async (attachmentPath) => {
			if (remoteHost) return await withRemoteFile({
				remoteHost,
				localPath: attachmentPath,
				timeoutMs,
				assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff,
				use: async (remotePath) => request({
					...sendParams,
					file: remotePath
				})
			});
			return await request({
				...sendParams,
				file: attachmentPath
			});
		}) : await request(sendParams);
		const failure = resolveIMessageSendFailure(response);
		if (failure) throw new Error(failure);
		return response;
	};
	let result;
	const sendStartedAtMs = Date.now();
	let pendingEchoKey;
	try {
		try {
			pendingEchoKey = await rememberPersistedIMessageEcho({
				scope: echoScope,
				text: echoText,
				media: echoMedia,
				ttlMs: pendingEchoTtlMs,
				pending: true
			});
			result = await requestSuccessfulSend(params);
		} catch (error) {
			if (resolvedReplyToId && isThreadedReplyUnsupportedError(error)) {
				const plainParams = { ...params };
				delete plainParams.reply_to;
				result = await requestSuccessfulSend(plainParams);
				effectiveReplyToId = void 0;
			} else if (filePath || !isIMessageRpcSendTimeout(error)) throw error;
			else if (!opts.approvalPrompt || resolvedReplyToId || !(opts.resolveSentMessageGuidImpl || canResolveLatestSentMessageGuidFromChatDb(chatDbLookupPath))) throw error;
			else {
				const recoveredGuid = await resolveFallbackSentMessageGuid({
					dbPath: chatDbLookupPath,
					target,
					text: message,
					sentAfterMs: sendStartedAtMs,
					resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
				});
				if (recoveredGuid) result = {
					guid: recoveredGuid,
					status: "sent"
				};
				else throw error;
			}
		}
		const resolvedId = resolveMessageId(result);
		const messageId = resolvedId ?? (result?.ok || result?.success || result?.status === "sent" ? "ok" : "unknown");
		let approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
			dbPath: chatDbLookupPath,
			messageId: resolvedId,
			result,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl
		});
		if (!approvalBindingMessageId && opts.approvalPrompt && !filePath && !effectiveReplyToId) approvalBindingMessageId = await resolveFallbackSentMessageGuid({
			dbPath: chatDbLookupPath,
			target,
			text: message,
			sentAfterMs: sendStartedAtMs,
			resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
		});
		await rememberPersistedIMessageEcho({
			scope: echoScope,
			text: echoText,
			media: echoMedia,
			messageId: resolvedId ?? void 0
		});
		const providerChatGuid = normalizeOptionalString(result.chat_guid) ?? normalizeOptionalString(result.chatGuid);
		const confirmedService = resolveIMessageDirectChatService(resultService(result.service) ?? service, providerChatGuid);
		if (resolvedId && normalizeIMessageMessageId(resolvedId)) {
			const chatContext = chatContextFromIMessageTarget(target, confirmedService ?? service);
			await rememberIMessageReplyCache({
				accountId: account.accountId,
				messageId: resolvedId,
				...chatContext,
				...providerChatGuid ? { chatGuid: providerChatGuid } : {},
				timestamp: Date.now(),
				isFromMe: true
			});
		}
		if (message && approvalBindingMessageId && opts.approvalPrompt) {
			const handleForKey = target.kind === "handle" ? normalizeIMessageHandle(target.to) : void 0;
			const conversation = {
				...target.kind === "chat_guid" ? { chatGuid: target.chatGuid } : {},
				...target.kind === "chat_identifier" ? { chatIdentifier: target.chatIdentifier } : {},
				...target.kind === "chat_id" ? { chatId: target.chatId } : {},
				...handleForKey ? { handle: handleForKey } : {}
			};
			await registerIMessageApprovalReactionTarget({
				accountId: account.accountId,
				conversation,
				messageId: approvalBindingMessageId,
				approvalId: opts.approvalPrompt.approvalId,
				approvalKind: opts.approvalPrompt.approvalKind,
				allowedDecisions: opts.approvalPrompt.allowedDecisions
			});
		}
		return {
			messageId,
			...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
			...confirmedService ? { service: confirmedService } : {},
			...providerChatGuid ? { chatGuid: providerChatGuid } : {},
			sentText: message,
			...echoText ? { echoText } : {},
			...echoMedia ? { echoMedia } : {},
			receipt: createIMessageSendReceipt({
				messageId,
				target,
				kind: filePath ? "media" : "text",
				...effectiveReplyToId ? { replyToId: effectiveReplyToId } : {}
			})
		};
	} catch (error) {
		await forgetPersistedIMessageEchoKey(pendingEchoKey);
		throw error;
	} finally {
		if (shouldClose) await client.stop();
	}
}
//#endregion
export { iMessageApprovalPollTargets as a, iMessageApprovalControlBindings as c, buildApprovalPollOptions as i, hasPersistedIMessageEcho as n, mapSentPollOptionsToDecisions as o, normalizeIMessageEchoText as r, maybeResolveIMessageApprovalPollVote as s, sendMessageIMessage as t };
