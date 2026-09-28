import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import { a as resolveMatrixAccountConfig } from "./account-config-CRsKoMqJ.mjs";
import { i as normalizeMatrixResolvableTarget, t as isMatrixQualifiedUserId } from "./target-ids-Nwx7cMVE.mjs";
import { n as withMatrixSendCurrentness, o as buildMatrixReactionContent, t as captureMatrixSendCurrentness } from "./send-currentness-BrGXL7b8.mjs";
import { _ as MsgType, d as buildMatrixMessageRelation, f as resolveMatrixReplyToEventId, g as MSC4357_LIVE_KEY, l as isStrictDirectRoom, m as EventType, n as inspectMatrixDirectRooms, p as resolveMatrixThreadRootId, r as persistMatrixDirectRoomMapping, v as RelationType } from "./direct-management-B2Bno2xL.mjs";
import { n as getMatrixEventProjection } from "./event-helpers-CspuhE9k.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { asFiniteNumber, asNullableObjectRecord, asNullableRecord, isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString, normalizeOptionalStringifiedId } from "openclaw/plugin-sdk/string-coerce-runtime";
import { FormatCapabilityProfile, convertMarkdownTables, findCodeRegions, isInsideCode, markdownToIR, renderMarkdownWithMarkers, tokenizeHtmlTags } from "openclaw/plugin-sdk/text-chunking";
import { createHash } from "node:crypto";
import path from "node:path";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { loadOutboundMediaFromUrl } from "openclaw/plugin-sdk/outbound-media";
import { M_POLL_KIND_DISCLOSED } from "matrix-js-sdk/lib/@types/polls.js";
import { normalizePollInput } from "openclaw/plugin-sdk/poll-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { resolveTextChunkLimit } from "openclaw/plugin-sdk/reply-chunking";
import MarkdownIt from "markdown-it";
import { isAutoLinkedFileRef } from "openclaw/plugin-sdk/text-autolink-runtime";
import { isVoiceMessageCompatibleAudio } from "openclaw/plugin-sdk/media-runtime";
import { parseBuffer } from "music-metadata";
//#region extensions/matrix/src/matrix/send/client.ts
const loadMatrixSendClientRuntime = createLazyRuntimeModule(() => import("./client-bootstrap-BSnUAoz1.mjs"));
function resolveMediaMaxBytes(accountId, cfg) {
	if (!cfg) throw new Error("Matrix media limits requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const resolvedCfg = requireRuntimeConfig(cfg, "Matrix media limits");
	const mediaMaxMb = resolveMatrixAccountConfig({
		cfg: resolvedCfg,
		accountId
	}).mediaMaxMb;
	return typeof mediaMaxMb === "number" && mediaMaxMb > 0 ? mediaMaxMb * 1024 * 1024 : void 0;
}
async function withResolvedMatrixSendClient(opts, run) {
	return await withResolvedMatrixClient({
		...opts,
		readiness: "started"
	}, (client, abortSignal) => {
		if (!opts.signal && !opts.assertDirectAdapterHandoff) return run(client, abortSignal);
		return withMatrixSendCurrentness(client, () => {
			opts.assertDirectAdapterHandoff?.();
			opts.signal?.throwIfAborted();
			abortSignal?.throwIfAborted();
		}, () => run(client, abortSignal));
	}, "persist");
}
async function withResolvedMatrixControlClient(opts, run) {
	return await withResolvedMatrixClient({
		...opts,
		readiness: "none"
	}, run);
}
async function withResolvedMatrixClient(opts, run, shutdownBehavior) {
	if (opts.client) return await run(opts.client);
	const { withResolvedRuntimeMatrixClient } = await loadMatrixSendClientRuntime();
	return await withResolvedRuntimeMatrixClient(opts, run, shutdownBehavior);
}
//#endregion
//#region extensions/matrix/src/matrix/send/receipt.ts
function createMatrixSendReceipt(params) {
	const firstEvent = params.events[0];
	const receipt = createMessageReceiptFromOutboundResults({
		kind: firstEvent?.kind ?? "text",
		...firstEvent?.replyToId ? { replyToId: firstEvent.replyToId } : {},
		...params.threadId ? { threadId: params.threadId } : {},
		results: params.events.map(({ messageId }) => ({
			channel: "matrix",
			messageId,
			roomId: params.roomId
		}))
	});
	receipt.parts = receipt.parts.map((part, index) => {
		const event = params.events[index];
		const actualPart = {
			...part,
			kind: event.kind
		};
		if (event.replyToId) actualPart.replyToId = event.replyToId;
		else delete actualPart.replyToId;
		return actualPart;
	});
	return receipt;
}
//#endregion
//#region extensions/matrix/src/matrix/send/targets.ts
function normalizeTarget(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("Matrix target is required (room:<id> or #alias)");
	return trimmed;
}
function normalizeThreadId(raw) {
	return normalizeOptionalStringifiedId(raw) ?? null;
}
const MAX_DIRECT_ROOM_CACHE_SIZE = 1024;
const directRoomCacheByClient = /* @__PURE__ */ new WeakMap();
function resolveDirectRoomCache(client) {
	const existing = directRoomCacheByClient.get(client);
	if (existing) return existing;
	const created = /* @__PURE__ */ new Map();
	directRoomCacheByClient.set(client, created);
	return created;
}
function setDirectRoomCached(client, key, value) {
	const directRoomCache = resolveDirectRoomCache(client);
	directRoomCache.set(key, value);
	if (directRoomCache.size > MAX_DIRECT_ROOM_CACHE_SIZE) {
		const oldest = directRoomCache.keys().next().value;
		if (oldest !== void 0) directRoomCache.delete(oldest);
	}
}
async function resolveDirectRoomId(client, userId, persistDirectMapping) {
	const trimmed = userId.trim();
	if (!isMatrixQualifiedUserId(trimmed)) throw new Error(`Matrix user IDs must be fully qualified (got "${trimmed}")`);
	const selfUserId = (await client.getUserId().catch(() => null))?.trim() || null;
	const directRoomCache = resolveDirectRoomCache(client);
	const cacheKey = persistDirectMapping ? trimmed : `read:${trimmed}`;
	const cached = directRoomCache.get(cacheKey);
	if (cached && await isStrictDirectRoom({
		client,
		roomId: cached,
		remoteUserId: trimmed,
		selfUserId
	})) return cached;
	if (cached) directRoomCache.delete(cacheKey);
	const inspection = await inspectMatrixDirectRooms({
		client,
		remoteUserId: trimmed
	});
	if (inspection.activeRoomId) {
		if (persistDirectMapping && inspection.mappedRoomIds[0] !== inspection.activeRoomId) await persistMatrixDirectRoomMapping({
			client,
			remoteUserId: trimmed,
			roomId: inspection.activeRoomId
		}).catch(() => {
			captureMatrixSendCurrentness(client)?.();
		});
		setDirectRoomCached(client, cacheKey, inspection.activeRoomId);
		return inspection.activeRoomId;
	}
	throw new Error(`No direct room found for ${trimmed} (m.direct missing)`);
}
async function resolveMatrixRoomId(client, raw, opts = {}) {
	const target = normalizeMatrixResolvableTarget(normalizeTarget(raw));
	if (normalizeLowercaseStringOrEmpty(target).startsWith("user:")) return await resolveDirectRoomId(client, target.slice(5), opts.persistDirectMapping ?? true);
	if (isMatrixQualifiedUserId(target)) return await resolveDirectRoomId(client, target, opts.persistDirectMapping ?? true);
	if (target.startsWith("#")) {
		const resolved = await client.resolveRoom(target);
		if (!resolved) throw new Error(`Matrix alias ${target} could not be resolved`);
		return resolved;
	}
	return target;
}
//#endregion
//#region extensions/matrix/src/matrix/delivery-plan.ts
const DELIVERY_PLAN_VERSION = 1;
const DELIVERY_PLAN_NAMESPACE = "outbound-delivery-plans";
const DELIVERY_PLAN_TTL_MS = 864e5;
var MatrixDeliveryPlanInvariantError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "MatrixDeliveryPlanInvariantError";
	}
};
function createDeliveryPlanStore() {
	return getMatrixRuntime().state.openBlobStore({
		namespace: DELIVERY_PLAN_NAMESPACE,
		maxEntries: 1e4,
		maxBytesPerEntry: 8388608,
		maxBytesPerNamespace: 268435456,
		overflowPolicy: "reject-new",
		defaultTtlMs: DELIVERY_PLAN_TTL_MS
	});
}
function requireIndex(value, label) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Matrix durable delivery ${label} must be a non-negative integer`);
	return value;
}
function requirePartCount(value) {
	if (!Number.isSafeInteger(value) || (value ?? 0) < 1) throw new Error("Matrix durable delivery part count must be a positive integer");
	return value;
}
function queuePrefix(queueId) {
	const normalized = queueId.trim();
	if (!normalized) throw new Error("Matrix durable delivery requires a queue id");
	return `${createHash("sha256").update(normalized).digest("hex")}.`;
}
function planKey(identity) {
	return `${queuePrefix(identity.queueId)}${requireIndex(identity.partIndex, "part index")}`;
}
function transactionId(identity, eventIndex) {
	return `oc_${createHash("sha256").update(identity.queueId).update("\0").update(String(requireIndex(identity.partIndex, "part index"))).update("\0").update(String(requireIndex(eventIndex, "event index"))).digest("base64url")}`;
}
const RECEIPT_KINDS = /* @__PURE__ */ new Set([
	"text",
	"media",
	"voice",
	"poll",
	"card",
	"preview",
	"unknown"
]);
function isPlan(value) {
	if (!value || typeof value !== "object") return false;
	const plan = value;
	return plan.version === DELIVERY_PLAN_VERSION && typeof plan.queueId === "string" && Boolean(plan.queueId.trim()) && typeof plan.accountId === "string" && typeof plan.roomId === "string" && Boolean(plan.roomId.trim()) && (plan.wireEventType === "m.room.message" || plan.wireEventType === "m.room.encrypted") && typeof plan.endpointPrefix === "string" && Boolean(plan.endpointPrefix.trim()) && typeof plan.transactionScopeId === "string" && Boolean(plan.transactionScopeId.trim()) && Number.isSafeInteger(plan.partIndex) && (plan.partIndex ?? -1) >= 0 && Number.isSafeInteger(plan.partCount) && (plan.partCount ?? 0) > 0 && (plan.partIndex ?? -1) < (plan.partCount ?? 0) && Array.isArray(plan.events) && plan.events.length > 0 && plan.events.every((event) => event && typeof event === "object" && typeof event.transactionId === "string" && Boolean(event.transactionId.trim()) && RECEIPT_KINDS.has(event.receiptKind) && Boolean(event.content) && typeof event.content === "object");
}
function decodePlan(bytes) {
	let value;
	try {
		value = JSON.parse(new TextDecoder().decode(bytes));
	} catch {
		throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan is invalid JSON");
	}
	if (!isPlan(value)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan is invalid");
	return value;
}
function assertPlanIdentity(plan, params) {
	if (plan.queueId !== params.identity.queueId || plan.partIndex !== params.identity.partIndex || plan.partCount !== params.identity.partCount || plan.accountId !== (params.accountId ?? "") || plan.roomId !== params.roomId || plan.transactionScopeId !== params.transactionScopeId || plan.wireEventType !== params.wireEventType) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan no longer matches the active delivery target");
}
function endpointPrefix(dispatch) {
	const encodedTransactionId = encodeURIComponent(dispatch.transactionId);
	if (!dispatch.requestPath.endsWith(encodedTransactionId)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery transaction does not match its request path");
	return dispatch.requestPath.slice(0, -encodedTransactionId.length);
}
function createMatrixPlannedEvents(params) {
	return params.events.map((event, index) => ({
		...structuredClone(event),
		transactionId: transactionId(params.identity, index)
	}));
}
function resolveMatrixDurableDeliveryIdentity(params) {
	if (params.queueId === void 0) return null;
	if (params.partIndex === void 0 || params.partCount === void 0) throw new Error("Matrix durable delivery requires stable part topology");
	const partIndex = requireIndex(params.partIndex, "part index");
	const partCount = requirePartCount(params.partCount);
	if (partIndex >= partCount) throw new Error("Matrix durable delivery part index must be below the part count");
	return {
		queueId: params.queueId,
		partIndex,
		partCount
	};
}
async function loadMatrixDeliveryPlan(params) {
	const entry = await createDeliveryPlanStore().lookup(planKey(params.identity));
	if (!entry) return null;
	const plan = decodePlan(entry.bytes);
	if (planKey(plan) !== planKey(params.identity)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan key is invalid");
	assertPlanIdentity(plan, params);
	return structuredClone(plan);
}
async function persistMatrixDeliveryPlan(params) {
	if (params.events.length === 0) throw new Error("Matrix durable delivery plan must contain at least one event");
	if (params.dispatch.roomId !== params.roomId || params.dispatch.eventType !== params.wireEventType || !params.events.some((event) => event.transactionId === params.dispatch.transactionId)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery was dispatched to an unexpected endpoint");
	const partCount = requirePartCount(params.identity.partCount);
	const events = params.events.map((event, index) => {
		if (event.transactionId !== transactionId(params.identity, index)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan has an invalid transaction identifier");
		return structuredClone(event);
	});
	const plan = {
		version: DELIVERY_PLAN_VERSION,
		queueId: params.identity.queueId,
		accountId: params.accountId ?? "",
		roomId: params.roomId,
		wireEventType: params.wireEventType,
		endpointPrefix: endpointPrefix(params.dispatch),
		transactionScopeId: params.transactionScopeId,
		partIndex: requireIndex(params.identity.partIndex, "part index"),
		partCount,
		events
	};
	const store = createDeliveryPlanStore();
	await store.deleteExpired();
	const bytes = new TextEncoder().encode(JSON.stringify(plan));
	if (await store.registerIfAbsent(planKey(params.identity), bytes, {})) return plan;
	const existing = await loadMatrixDeliveryPlan(params);
	if (!existing || JSON.stringify(existing) !== JSON.stringify(plan)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan no longer matches the prepared event batch");
	return existing;
}
async function loadQueuePlans(queueId) {
	const store = createDeliveryPlanStore();
	const entries = await store.entries();
	const prefix = entries.length > 0 ? queuePrefix(queueId) : "";
	const keys = entries.filter((entry) => entry.key.startsWith(prefix)).map((entry) => entry.key);
	const plans = [];
	for (const key of keys) {
		const entry = await store.lookup(key);
		if (!entry) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan disappeared during reconciliation");
		const plan = decodePlan(entry.bytes);
		if (key !== planKey(plan)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan key is invalid");
		plans.push(plan);
	}
	return plans;
}
function assertCompletePartTopology(plans) {
	const partCount = plans[0]?.partCount;
	if (!partCount) throw new MatrixDeliveryPlanInvariantError("Matrix ambiguous delivery has no event plan");
	if (plans.some((plan) => plan.partCount !== partCount)) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery plan part topology is inconsistent");
	const storedParts = new Set(plans.map((plan) => plan.partIndex));
	if (storedParts.size !== partCount || Array.from({ length: partCount }, (_, partIndex) => partIndex).some((partIndex) => !storedParts.has(partIndex))) throw new MatrixDeliveryPlanInvariantError("Matrix ambiguous delivery has an incomplete event plan");
}
async function requireTransactionScope(client) {
	const scope = (await client.getTransactionScopeId()).trim();
	if (!scope) throw new MatrixDeliveryPlanInvariantError("Matrix durable delivery requires a stable transaction scope");
	return scope;
}
async function reconcileMatrixUnknownSend(ctx) {
	try {
		if (ctx.payloads.length !== 1) throw new MatrixDeliveryPlanInvariantError("Matrix reconciliation requires exactly one prepared payload");
		const plans = await loadQueuePlans(ctx.queueId);
		if (plans.length === 0) throw new MatrixDeliveryPlanInvariantError("Matrix ambiguous delivery has no persisted event plan");
		assertCompletePartTopology(plans);
		return await withResolvedMatrixSendClient({
			cfg: ctx.cfg,
			accountId: ctx.accountId
		}, async (client) => {
			const transactionScopeId = await requireTransactionScope(client);
			const roomId = await resolveMatrixRoomId(client, ctx.to);
			const wireEventType = await client.getMessageWireEventType(roomId);
			const orderedPlans = [...plans].toSorted((left, right) => left.partIndex - right.partIndex);
			const results = /* @__PURE__ */ new Map();
			for (const plan of orderedPlans) {
				assertPlanIdentity(plan, {
					identity: plan,
					accountId: ctx.accountId,
					roomId,
					transactionScopeId,
					wireEventType
				});
				for (const event of plan.events) {
					const messageId = await client.sendMessage(roomId, event.content, event.transactionId, async (dispatch) => {
						await persistMatrixDeliveryPlan({
							identity: plan,
							accountId: ctx.accountId,
							roomId,
							transactionScopeId,
							wireEventType,
							events: plan.events,
							dispatch
						});
					});
					if (!results.has(messageId)) {
						const replyToId = resolveMatrixReplyToEventId(event.content);
						results.set(messageId, {
							messageId,
							kind: event.receiptKind,
							...replyToId ? { replyToId } : {}
						});
					}
				}
			}
			const receipt = createMatrixSendReceipt({
				roomId,
				events: [...results.values()],
				threadId: resolveMatrixThreadRootId(orderedPlans[0].events[0].content)
			});
			return {
				status: "sent",
				messageId: receipt.platformMessageIds.at(-1),
				receipt
			};
		});
	} catch (error) {
		const retryable = !(error instanceof MatrixDeliveryPlanInvariantError);
		let cleanupError;
		if (!retryable) try {
			await cleanupMatrixDeliveryPlans({ queueId: ctx.queueId });
		} catch (cleanupFailure) {
			cleanupError = cleanupFailure;
		}
		const errorMessage = formatErrorMessage(error instanceof Error || typeof error === "string" ? error : "unknown error");
		return {
			status: "unresolved",
			error: cleanupError === void 0 ? errorMessage : `${errorMessage}; Matrix delivery-plan cleanup failed: ${formatErrorMessage(cleanupError instanceof Error || typeof cleanupError === "string" ? cleanupError : "unknown error")}`,
			retryable
		};
	}
}
async function cleanupMatrixDeliveryPlans(ctx) {
	const store = createDeliveryPlanStore();
	await store.deleteExpired();
	const entries = await store.entries();
	const prefix = entries.length > 0 ? queuePrefix(ctx.queueId) : "";
	const keys = entries.filter((entry) => entry.key.startsWith(prefix)).map((entry) => entry.key);
	for (const key of keys) await store.delete(key);
}
//#endregion
//#region extensions/matrix/src/matrix/poll-types.ts
/**
* Matrix Poll Types (MSC3381)
*
* Defines types for Matrix poll events:
* - m.poll.start - Creates a new poll
* - m.poll.response - Records a vote
* - m.poll.end - Closes a poll
*/
const M_POLL_START = "m.poll.start";
const M_POLL_RESPONSE = "m.poll.response";
const M_POLL_END = "m.poll.end";
const ORG_POLL_START = "org.matrix.msc3381.poll.start";
const ORG_POLL_RESPONSE = "org.matrix.msc3381.poll.response";
const ORG_POLL_END = "org.matrix.msc3381.poll.end";
const POLL_EVENT_TYPES = [
	M_POLL_START,
	M_POLL_RESPONSE,
	M_POLL_END,
	ORG_POLL_START,
	ORG_POLL_RESPONSE,
	ORG_POLL_END
];
const POLL_START_TYPES = [M_POLL_START, ORG_POLL_START];
const POLL_RESPONSE_TYPES = [M_POLL_RESPONSE, ORG_POLL_RESPONSE];
const POLL_END_TYPES = [M_POLL_END, ORG_POLL_END];
function isPollStartType(eventType) {
	return POLL_START_TYPES.includes(eventType);
}
function isPollResponseType(eventType) {
	return POLL_RESPONSE_TYPES.includes(eventType);
}
function isPollEndType(eventType) {
	return POLL_END_TYPES.includes(eventType);
}
function isPollEventType(eventType) {
	return POLL_EVENT_TYPES.includes(eventType);
}
function getTextContent(text) {
	if (!isRecord(text)) return "";
	const value = text["m.text"] ?? text["org.matrix.msc1767.text"] ?? text.body;
	return normalizeOptionalString(value) ?? "";
}
function parsePollStart(content) {
	const poll = content["m.poll.start"] ?? content[ORG_POLL_START] ?? content["m.poll"];
	if (!poll) return null;
	const question = getTextContent(poll.question);
	if (!question) return null;
	const rawAnswers = poll.answers;
	const answers = (Array.isArray(rawAnswers) ? rawAnswers : []).map((answer) => ({
		id: isRecord(answer) && typeof answer.id === "string" ? answer.id : "",
		text: getTextContent(answer)
	})).filter((answer) => answer.id.trim().length > 0 && answer.text.length > 0);
	if (answers.length === 0) return null;
	const maxSelectionsRaw = poll.max_selections;
	const maxSelections = typeof maxSelectionsRaw === "number" && Number.isFinite(maxSelectionsRaw) ? Math.floor(maxSelectionsRaw) : 1;
	return {
		question,
		answers,
		kind: M_POLL_KIND_DISCLOSED.matches(poll.kind ?? "m.poll.disclosed") ? "m.poll.disclosed" : "m.poll.undisclosed",
		maxSelections: Math.min(Math.max(maxSelections, 1), answers.length)
	};
}
function parsePollStartContent(content) {
	const parsed = parsePollStart(content);
	if (!parsed) return null;
	return {
		eventId: "",
		roomId: "",
		sender: "",
		senderName: "",
		question: parsed.question,
		answers: parsed.answers.map((answer) => answer.text),
		kind: parsed.kind,
		maxSelections: parsed.maxSelections
	};
}
function formatPollAsText(summary) {
	return [
		"[Poll]",
		summary.question,
		"",
		...summary.answers.map((answer, idx) => `${idx + 1}. ${answer}`)
	].join("\n");
}
function resolvePollReferenceEventId(content) {
	if (!content || typeof content !== "object") return null;
	const relates = content["m.relates_to"];
	if (!relates || typeof relates.event_id !== "string") return null;
	const eventId = relates.event_id.trim();
	return eventId.length > 0 ? eventId : null;
}
function parsePollResponseAnswerIds(content) {
	if (!content || typeof content !== "object") return null;
	const response = content[M_POLL_RESPONSE] ?? content[ORG_POLL_RESPONSE];
	if (!response || !Array.isArray(response.answers)) return null;
	return response.answers.filter((answer) => typeof answer === "string");
}
function buildPollResultsSummary(params) {
	const parsed = parsePollStart(params.content);
	if (!parsed) return null;
	let pollClosedAt = Number.POSITIVE_INFINITY;
	for (const event of params.relationEvents) {
		if (event.unsigned?.redacted_because) continue;
		if (!isPollEndType(typeof event.type === "string" ? event.type : "")) continue;
		if (event.sender !== params.sender) continue;
		const ts = asFiniteNumber(event.origin_server_ts) ?? Number.POSITIVE_INFINITY;
		if (ts < pollClosedAt) pollClosedAt = ts;
	}
	const answerIds = new Set(parsed.answers.map((answer) => answer.id));
	const latestVoteBySender = /* @__PURE__ */ new Map();
	const orderedRelationEvents = [...params.relationEvents].toSorted((left, right) => {
		const leftTs = asFiniteNumber(left.origin_server_ts) ?? Number.POSITIVE_INFINITY;
		const rightTs = asFiniteNumber(right.origin_server_ts) ?? Number.POSITIVE_INFINITY;
		if (leftTs !== rightTs) return leftTs - rightTs;
		return (left.event_id ?? "").localeCompare(right.event_id ?? "");
	});
	for (const event of orderedRelationEvents) {
		if (event.unsigned?.redacted_because) continue;
		if (!isPollResponseType(typeof event.type === "string" ? event.type : "")) continue;
		const senderId = normalizeOptionalString(event.sender) ?? "";
		if (!senderId) continue;
		const eventTs = asFiniteNumber(event.origin_server_ts) ?? Number.POSITIVE_INFINITY;
		if (eventTs > pollClosedAt) continue;
		const rawAnswers = parsePollResponseAnswerIds(event.content) ?? [];
		const normalizedAnswers = Array.from(new Set(rawAnswers.map((answerId) => normalizeOptionalString(answerId) ?? "").filter((answerId) => answerIds.has(answerId)).slice(0, parsed.maxSelections)));
		latestVoteBySender.set(senderId, {
			ts: eventTs,
			eventId: typeof event.event_id === "string" ? event.event_id : "",
			answerIds: normalizedAnswers
		});
	}
	const voteCounts = new Map(parsed.answers.map((answer) => [answer.id, 0]));
	let totalVotes = 0;
	for (const latestVote of latestVoteBySender.values()) {
		if (latestVote.answerIds.length === 0) continue;
		totalVotes += 1;
		for (const answerId of latestVote.answerIds) voteCounts.set(answerId, (voteCounts.get(answerId) ?? 0) + 1);
	}
	return {
		eventId: params.pollEventId,
		roomId: params.roomId,
		sender: params.sender,
		senderName: params.senderName,
		question: parsed.question,
		answers: parsed.answers.map((answer) => answer.text),
		kind: parsed.kind,
		maxSelections: parsed.maxSelections,
		entries: parsed.answers.map((answer) => ({
			id: answer.id,
			text: answer.text,
			votes: voteCounts.get(answer.id) ?? 0
		})),
		totalVotes,
		closed: Number.isFinite(pollClosedAt)
	};
}
function formatPollResultsAsText(summary) {
	const lines = [
		summary.closed ? "[Poll closed]" : "[Poll]",
		summary.question,
		""
	];
	const revealResults = summary.kind === "m.poll.disclosed" || summary.closed;
	for (const [index, entry] of summary.entries.entries()) {
		if (!revealResults) {
			lines.push(`${index + 1}. ${entry.text}`);
			continue;
		}
		lines.push(`${index + 1}. ${entry.text} (${entry.votes} vote${entry.votes === 1 ? "" : "s"})`);
	}
	lines.push("");
	if (!revealResults) lines.push("Responses are hidden until the poll closes.");
	else lines.push(`Total voters: ${summary.totalVotes}`);
	return lines.join("\n");
}
function buildTextContent$1(body) {
	return {
		"m.text": body,
		"org.matrix.msc1767.text": body
	};
}
function buildPollFallbackText(question, answers) {
	if (answers.length === 0) return question;
	return `${question}\n${answers.map((answer, idx) => `${idx + 1}. ${answer}`).join("\n")}`;
}
function buildPollStartContent(poll) {
	const normalized = normalizePollInput(poll);
	const answers = normalized.options.map((option, idx) => ({
		id: `answer${idx + 1}`,
		...buildTextContent$1(option)
	}));
	const isMultiple = normalized.maxSelections > 1;
	const fallbackText = buildPollFallbackText(normalized.question, answers.map((answer) => getTextContent(answer)));
	return {
		[M_POLL_START]: {
			question: buildTextContent$1(normalized.question),
			kind: isMultiple ? "m.poll.undisclosed" : "m.poll.disclosed",
			max_selections: normalized.maxSelections,
			answers
		},
		"m.text": fallbackText,
		"org.matrix.msc1767.text": fallbackText
	};
}
function buildPollResponseContent(pollEventId, answerIds) {
	return {
		[M_POLL_RESPONSE]: { answers: answerIds },
		[ORG_POLL_RESPONSE]: { answers: answerIds },
		"m.relates_to": {
			rel_type: "m.reference",
			event_id: pollEventId
		}
	};
}
//#endregion
//#region extensions/matrix/src/matrix/format-profile.ts
function createMatrixPrivateMarkers(markdown, exhaustedMessage) {
	const used = new Set(Array.from(markdown, (character) => character.charCodeAt(0)));
	for (const match of markdown.matchAll(/&#(?:x([0-9a-f]+)|(\d+));/giu)) {
		const radix = match[1] ? 16 : 10;
		const value = Number.parseInt(match[1] ?? match[2] ?? "", radix);
		if (Number.isFinite(value) && value <= 65535) used.add(value);
	}
	const markers = [];
	for (let code = 57344; code <= 63743 && markers.length < 3; code += 1) if (!used.has(code)) markers.push(String.fromCharCode(code));
	if (markers.length < 3) throw new Error(exhaustedMessage);
	return {
		open: markers[0] ?? "",
		close: markers[1] ?? "",
		padding: markers[2] ?? ""
	};
}
const MATRIX_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "html",
	constructs: {
		taskList: "fallback",
		image: "fallback"
	},
	chunk: {
		limit: 4e3,
		unit: "chars"
	}
});
function isMarkdownEscaped(markdown, index) {
	let slashCount = 0;
	let cursor = index - 1;
	while (cursor >= 0 && markdown[cursor] === "\\") {
		slashCount += 1;
		cursor -= 1;
	}
	return slashCount % 2 === 1;
}
function projectMatrixMarkdown(markdown) {
	return (markdown ?? "").replace(/\r\n?/gu, "\n");
}
function renderMatrixMarkdownTables(markdown, mode) {
	return MATRIX_FORMAT_PROFILE.constructs.table === "native" && (mode === "off" || mode === "block") ? markdown : convertMarkdownTables(markdown, mode);
}
//#endregion
//#region extensions/matrix/src/matrix/format-table-ranges.ts
const tableParser = new MarkdownIt({
	html: false,
	linkify: false,
	typographer: false
});
function findMatrixTableSourceRanges(markdown) {
	const lineStarts = [0];
	for (let index = 0; index < markdown.length; index += 1) if (markdown[index] === "\n") lineStarts.push(index + 1);
	lineStarts.push(markdown.length);
	return matrixTableSourceRangesFromTokens(tableParser.parse(markdown, {}), lineStarts, markdown.length);
}
function matrixTableSourceRangesFromTokens(tokens, lineStarts, sourceLength) {
	return tokens.flatMap((token) => {
		if (token.type !== "table_open" || !token.map) return [];
		return [{
			start: lineStarts[token.map[0]] ?? 0,
			end: lineStarts[token.map[1]] ?? sourceLength
		}];
	});
}
//#endregion
//#region extensions/matrix/src/matrix/format-spoiler-ranges.ts
const spoilerParser = new MarkdownIt({
	html: false,
	linkify: true,
	typographer: false
});
spoilerParser.linkify.set({ fuzzyLink: true });
function findInlineMetadataRanges(markdown, references) {
	const ranges = [];
	const labelStack = [];
	const codeRegions = findCodeRegions(markdown);
	const underlineTags = [...tokenizeHtmlTags(markdown)].filter((tag) => tag.name === "u" || tag.name === "ins");
	let underlineIndex = 0;
	for (let index = 0; index < markdown.length - 1; index += 1) {
		let nextUnderlineTag = underlineTags[underlineIndex];
		while (nextUnderlineTag && nextUnderlineTag.start < index) {
			underlineIndex += 1;
			nextUnderlineTag = underlineTags[underlineIndex];
		}
		const underlineTag = nextUnderlineTag?.start === index ? nextUnderlineTag : void 0;
		if (underlineTag) {
			index = underlineTag.end - 1;
			continue;
		}
		if (isInsideCode(index, codeRegions)) continue;
		if (markdown[index] === "\n" && markdown[index + 1] === "\n") {
			labelStack.length = 0;
			continue;
		}
		if (markdown[index] === "[" && !isMarkdownEscaped(markdown, index)) {
			labelStack.push(index);
			continue;
		}
		if (markdown[index] === "]" && markdown[index + 1] === "(" && !isMarkdownEscaped(markdown, index) && labelStack.pop() !== void 0) {
			const start = index + 2;
			let cursor = start;
			while (/[\s]/u.test(markdown[cursor] ?? "")) cursor += 1;
			const destination = spoilerParser.helpers.parseLinkDestination(markdown, cursor, markdown.length);
			if (destination.ok) {
				cursor = destination.pos;
				while (/[\s]/u.test(markdown[cursor] ?? "")) cursor += 1;
				const title = spoilerParser.helpers.parseLinkTitle(markdown, cursor, markdown.length);
				if (title.ok) {
					cursor = title.pos;
					while (/[\s]/u.test(markdown[cursor] ?? "")) cursor += 1;
				}
			}
			if (destination.ok && markdown[cursor] === ")") {
				ranges.push({
					start,
					end: cursor + 1
				});
				index = cursor;
			}
			continue;
		}
		if (markdown[index] === "]" && markdown[index + 1] === "[" && !isMarkdownEscaped(markdown, index) && labelStack.pop() !== void 0) {
			let end = index + 2;
			while (end < markdown.length && (markdown[end] !== "]" || isMarkdownEscaped(markdown, end))) end += 1;
			const reference = spoilerParser.utils.normalizeReference(markdown.slice(index + 2, end));
			if (end < markdown.length && references.has(reference)) {
				ranges.push({
					start: index + 2,
					end
				});
				index = end;
			}
			continue;
		}
		if (markdown[index] === "]" && !isMarkdownEscaped(markdown, index)) labelStack.pop();
		if (markdown[index] === "<") {
			const autolink = /^<[A-Za-z][A-Za-z0-9+.-]{1,31}:[^<>\s]*>/u.exec(markdown.slice(index));
			if (autolink && !isMarkdownEscaped(markdown, index)) {
				ranges.push({
					start: index,
					end: index + autolink[0].length
				});
				index += autolink[0].length - 1;
				continue;
			}
			const emailAutolink = /^<[^<>\s@]+@[^<>\s@]+>/u.exec(markdown.slice(index));
			if (emailAutolink && !isMarkdownEscaped(markdown, index)) {
				ranges.push({
					start: index,
					end: index + emailAutolink[0].length
				});
				index += emailAutolink[0].length - 1;
			}
		}
	}
	return ranges;
}
function prepareMatrixMarkdownSource(markdown) {
	const env = {};
	const tokens = spoilerParser.parse(markdown, env);
	const references = new Set(Object.keys(env.references ?? {}));
	const lineStarts = [0];
	for (let index = 0; index < markdown.length; index += 1) if (markdown[index] === "\n") lineStarts.push(index + 1);
	lineStarts.push(markdown.length);
	const inlineRanges = tokens.flatMap((token) => {
		if (token.type !== "inline" || !token.map) return [];
		return [{
			start: lineStarts[token.map[0]] ?? 0,
			end: lineStarts[token.map[1]] ?? markdown.length
		}];
	});
	const ranges = inlineRanges.flatMap(({ start, end }) => findInlineMetadataRanges(markdown.slice(start, end), references).map((range) => ({
		start: start + range.start,
		end: start + range.end
	})));
	for (const match of markdown.matchAll(/^\s*\[[^\]\n]+\]:\s*.+$/gmu)) {
		const start = match.index ?? 0;
		const labelEnd = match[0].indexOf("]:");
		const reference = spoilerParser.utils.normalizeReference(match[0].slice(1, labelEnd));
		if (references.has(reference)) {
			let end = start + match[0].length;
			const continuation = /^\n[ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^\n)]*\))[ \t]*/u.exec(markdown.slice(end));
			end += continuation?.[0].length ?? 0;
			ranges.push({
				start,
				end
			});
		}
	}
	const codeRegions = findCodeRegions(markdown);
	for (const match of spoilerParser.linkify.match(markdown) ?? []) if (!isInsideCode(match.index, codeRegions)) ranges.push({
		start: match.index,
		end: match.lastIndex
	});
	return {
		markdown,
		inlineRanges,
		tableRanges: matrixTableSourceRangesFromTokens(tokens, lineStarts, markdown.length),
		metadataRanges: ranges,
		codeRegions,
		underlineTags: [...tokenizeHtmlTags(markdown)].filter((tag) => tag.name === "u" || tag.name === "ins")
	};
}
function findMatrixSpoilerDelimiterOffsets(source) {
	const { markdown, inlineRanges, codeRegions, metadataRanges, underlineTags } = source;
	const excludedRanges = [
		...codeRegions,
		...metadataRanges,
		...underlineTags
	];
	const offsets = [];
	for (const { start, end } of inlineRanges) {
		const candidates = [];
		for (let index = start; index < end - 1; index += 1) {
			if (markdown[index] !== "|" || markdown[index + 1] !== "|") continue;
			const excluded = excludedRanges.some((range) => index >= range.start && index < range.end);
			if (isMarkdownEscaped(markdown, index) || excluded) continue;
			candidates.push(index);
			index += 1;
		}
		candidates.length -= candidates.length % 2;
		offsets.push(...candidates);
	}
	return [...new Set(offsets)].toSorted((left, right) => left - right);
}
function hasMatrixSpoilerMetadataCollision(source, offsets) {
	const { markdown, codeRegions } = source;
	const ordinary = new Set(offsets);
	const underlineTags = source.underlineTags.filter((tag) => !isMarkdownEscaped(markdown, tag.start));
	const literalRanges = [...source.tableRanges, ...codeRegions.filter((code) => !underlineTags.some((tag) => code.start > tag.start && code.start < tag.end))];
	for (let index = 0; index < markdown.length - 1; index += 1) {
		if (markdown[index] !== "|" || markdown[index + 1] !== "|") continue;
		if (ordinary.has(index) || isMarkdownEscaped(markdown, index)) continue;
		if (literalRanges.some((range) => index >= range.start && index < range.end)) continue;
		return true;
	}
	return false;
}
function analyzeMatrixSpoilers(markdown) {
	const projected = projectMatrixMarkdown(markdown);
	if (!projected.includes("||")) return {
		markdown: projected,
		delimiterOffsets: [],
		metadataCollision: false
	};
	const source = prepareMatrixMarkdownSource(projected);
	const delimiterOffsets = findMatrixSpoilerDelimiterOffsets(source);
	return {
		markdown: projected,
		delimiterOffsets,
		metadataCollision: hasMatrixSpoilerMetadataCollision(source, delimiterOffsets)
	};
}
//#endregion
//#region extensions/matrix/src/matrix/format.ts
const MATRIX_STYLE_MARKERS = {
	underline: {
		open: "<u>",
		close: "</u>"
	},
	spoiler: {
		open: "<span data-mx-spoiler>",
		close: "</span>"
	}
};
const md = new MarkdownIt({
	html: false,
	linkify: true,
	breaks: true,
	typographer: false
});
md.linkify.set({ fuzzyLink: true });
md.enable("strikethrough");
const { escapeHtml } = md.utils;
const MENTION_PATTERN = /@[A-Za-z0-9._=+\-/:[\]]+/g;
const MATRIX_MENTION_USER_ID_PATTERN = new RegExp(`^@[A-Za-z0-9._=+\\-/]+:(?:${/(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)(?:\.(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?))*(?::\d+)?/.source}|\\[[0-9A-Fa-f:.]+\\](?::\\d+)?)$`);
const TRIMMABLE_MENTION_SUFFIX = /[),.!?:;\]]/;
const parseMatrixUnderline = (state, silent) => {
	if (state.src.charCodeAt(state.pos) !== 60) return false;
	const tag = tokenizeHtmlTags(state.src.slice(state.pos)).next().value;
	if (!tag || tag.start !== 0 || tag.name !== "u" && tag.name !== "ins") return false;
	if (!silent) {
		const token = state.push(tag.selfClosing ? "text" : tag.closing ? "matrix_underline_close" : "matrix_underline_open", tag.selfClosing ? "" : "u", tag.selfClosing ? 0 : tag.closing ? -1 : 1);
		if (tag.selfClosing) token.content = tag.raw;
	}
	state.pos += tag.end;
	return true;
};
md.inline.ruler.before("html_inline", "matrix_underline", parseMatrixUnderline);
md.renderer.rules.matrix_underline_open = () => MATRIX_STYLE_MARKERS.underline.open;
md.renderer.rules.matrix_underline_close = () => MATRIX_STYLE_MARKERS.underline.close;
md.renderer.rules.matrix_spoiler_open = () => MATRIX_STYLE_MARKERS.spoiler.open;
md.renderer.rules.matrix_spoiler_close = () => MATRIX_STYLE_MARKERS.spoiler.close;
md.core.ruler.after("inline", "matrix_spoilers", (state) => {
	const markers = state.env.matrixSpoilerMarkers;
	if (!markers) return;
	for (const token of state.tokens) if (token.children?.length) token.children = normalizeMatrixSpoilerNesting(injectProtectedMatrixSpoilers(token.children, markers));
});
function shouldSuppressAutoLink(tokens, idx) {
	const token = tokens[idx];
	if (token?.type !== "link_open" || token.info !== "auto") return false;
	const href = String(token.attrGet("href") ?? "");
	const label = tokens[idx + 1]?.type === "text" ? tokens[idx + 1]?.content ?? "" : "";
	return Boolean(href && label && isAutoLinkedFileRef(href, label));
}
md.renderer.rules.image = (tokens, idx, options, env, self) => {
	const token = tokens[idx];
	return token?.children?.length ? self.renderInline(token.children, options, env) : escapeHtml(token?.content ?? "");
};
md.renderer.rules.html_block = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");
md.renderer.rules.html_inline = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");
md.renderer.rules.text_special = (tokens, idx) => escapeHtml(tokens[idx]?.content ?? "");
md.renderer.rules.matrix_escaped_mention = () => "@";
md.core.ruler.before("text_join", "matrix_escaped_mentions", (state) => {
	preserveEscapedMentionTokens(state.tokens);
});
md.renderer.rules.link_open = (tokens, idx, _options, _env, self) => shouldSuppressAutoLink(tokens, idx) ? "" : self.renderToken(tokens, idx, _options);
md.renderer.rules.link_close = (tokens, idx, _options, _env, self) => {
	const openIdx = idx - 2;
	if (openIdx >= 0 && shouldSuppressAutoLink(tokens, openIdx)) return "";
	return self.renderToken(tokens, idx, _options);
};
function preserveEscapedMentionTokens(tokens) {
	for (const token of tokens) {
		if (token.type === "text_special" && token.info === "escape" && token.content === "@") token.type = "matrix_escaped_mention";
		if (token.children) preserveEscapedMentionTokens(token.children);
	}
}
function isMentionStartBoundary(charBefore) {
	return !charBefore || !/[A-Za-z0-9_]/.test(charBefore);
}
function trimMentionSuffix(rawInput, endInput) {
	let raw = rawInput;
	let end = endInput;
	while (raw.length > 1 && TRIMMABLE_MENTION_SUFFIX.test(raw.at(-1) ?? "")) {
		if (raw.at(-1) === "]" && /\[[0-9A-Fa-f:.]+\](?::\d+)?$/i.test(raw)) break;
		raw = raw.slice(0, -1);
		end -= 1;
	}
	if (!raw.startsWith("@") || raw === "@") return null;
	return {
		raw,
		end
	};
}
function isMatrixMentionUserId(raw) {
	return isMatrixQualifiedUserId(raw) && MATRIX_MENTION_USER_ID_PATTERN.test(raw);
}
function buildMentionCandidate(raw, start) {
	const normalized = trimMentionSuffix(raw, start + raw.length);
	if (!normalized) return null;
	const kind = normalizeLowercaseStringOrEmpty(normalized.raw) === "@room" ? "room" : "user";
	const base = {
		raw: normalized.raw,
		start,
		end: normalized.end,
		kind
	};
	if (kind === "room") return base;
	const userCandidate = isMatrixMentionUserId(normalized.raw) ? {
		...base,
		userId: normalized.raw
	} : null;
	if (!userCandidate) return null;
	return userCandidate;
}
function collectMentionCandidates(text) {
	const mentions = [];
	for (const match of text.matchAll(MENTION_PATTERN)) {
		const raw = match[0];
		const start = match.index ?? -1;
		if (start < 0 || !raw) continue;
		if (!isMentionStartBoundary(text[start - 1])) continue;
		const candidate = buildMentionCandidate(raw, start);
		if (!candidate) continue;
		mentions.push(candidate);
	}
	return mentions;
}
function createToken(sample, type, tag, nesting) {
	const TokenCtor = sample.constructor;
	return new TokenCtor(type, tag, nesting);
}
function createTextToken(sample, content) {
	const token = createToken(sample, "text", "", 0);
	token.content = content;
	return token;
}
function injectProtectedMatrixSpoilers(tokens, markers) {
	const result = [];
	for (const token of tokens) {
		if (token.type !== "text") {
			if (token.children?.length) token.children = normalizeMatrixSpoilerNesting(injectProtectedMatrixSpoilers(token.children, markers));
			result.push(token);
			continue;
		}
		let cursor = 0;
		for (let index = 0; index < token.content.length; index += 1) {
			const marker = token.content[index];
			if (marker !== markers.open && marker !== markers.close || token.content[index + 1] !== markers.padding) continue;
			if (index > cursor) result.push(createTextToken(token, token.content.slice(cursor, index)));
			result.push(createToken(token, marker === markers.open ? "matrix_spoiler_open" : "matrix_spoiler_close", "span", marker === markers.open ? 1 : -1));
			index += 1;
			cursor = index + 1;
		}
		if (cursor < token.content.length) result.push(createTextToken(token, token.content.slice(cursor)));
	}
	return result;
}
function copyInlineToken(sample, type, tag, nesting) {
	const token = createToken(sample, type, tag, nesting);
	token.markup = sample.markup;
	token.attrs = sample.attrs ? [...sample.attrs] : null;
	return token;
}
function normalizeMatrixSpoilerNesting(tokens) {
	const result = [];
	const stack = [];
	for (const token of tokens) {
		if (token.nesting === 1) {
			stack.push(token);
			result.push(token);
			continue;
		}
		if (token.nesting !== -1) {
			result.push(token);
			continue;
		}
		const openIndex = stack.findLastIndex((open) => open.tag === token.tag);
		if (openIndex < 0) {
			result.push(token);
			continue;
		}
		if (openIndex === stack.length - 1) {
			stack.pop();
			result.push(token);
			continue;
		}
		const crossing = stack.splice(openIndex + 1);
		for (const open of crossing.toReversed()) result.push(copyInlineToken(open, open.type.replace(/_open$/u, "_close"), open.tag, -1));
		stack.pop();
		result.push(token);
		for (const open of crossing) {
			result.push(copyInlineToken(open, open.type, open.tag, 1));
			stack.push(open);
		}
	}
	return result;
}
function createMentionLinkTokens(params) {
	const open = createToken(params.sample, "link_open", "a", 1);
	open.attrSet("href", params.href);
	return [
		open,
		createTextToken(params.sample, params.label),
		createToken(params.sample, "link_close", "a", -1)
	];
}
function resolveMentionUserId(match) {
	if (match.kind !== "user") return null;
	return match.userId ?? null;
}
async function resolveMatrixSelfUserId(client) {
	const getUserId = client.getUserId;
	if (typeof getUserId !== "function") return null;
	return await Promise.resolve(getUserId.call(client)).catch(() => null);
}
function mutateInlineTokensWithMentions(params) {
	const nextChildren = [];
	let roomMentioned = false;
	let insideLinkDepth = 0;
	for (const child of params.children) {
		if (child.type === "link_open") {
			insideLinkDepth += 1;
			nextChildren.push(child);
			continue;
		}
		if (child.type === "link_close") {
			insideLinkDepth = Math.max(0, insideLinkDepth - 1);
			nextChildren.push(child);
			continue;
		}
		if (child.type !== "text" || !child.content) {
			nextChildren.push(child);
			continue;
		}
		if (insideLinkDepth > 0) {
			nextChildren.push(child);
			continue;
		}
		const matches = collectMentionCandidates(child.content);
		if (matches.length === 0) {
			nextChildren.push(child);
			continue;
		}
		let cursor = 0;
		for (const match of matches) {
			if (match.start > cursor) nextChildren.push(createTextToken(child, child.content.slice(cursor, match.start)));
			cursor = match.end;
			if (match.kind === "room") {
				roomMentioned = true;
				nextChildren.push(createTextToken(child, match.raw));
				continue;
			}
			const resolvedUserId = resolveMentionUserId(match);
			if (!resolvedUserId || resolvedUserId === params.selfUserId) {
				nextChildren.push(createTextToken(child, match.raw));
				continue;
			}
			if (!params.seenUserIds.has(resolvedUserId)) {
				params.seenUserIds.add(resolvedUserId);
				params.userIds.push(resolvedUserId);
			}
			nextChildren.push(...createMentionLinkTokens({
				sample: child,
				href: `https://matrix.to/#/${encodeURIComponent(resolvedUserId)}`,
				label: match.raw
			}));
		}
		if (cursor < child.content.length) nextChildren.push(createTextToken(child, child.content.slice(cursor)));
	}
	return {
		children: nextChildren,
		roomMentioned
	};
}
function compactLooseListTokens(tokens) {
	const listItemStack = [];
	for (const [index, token] of tokens.entries()) {
		if (token.type === "list_item_open") {
			listItemStack.push({
				level: token.level,
				paragraphIndex: void 0
			});
			continue;
		}
		if (token.type === "list_item_close") {
			const item = listItemStack.pop();
			if (typeof item?.paragraphIndex === "number") {
				const openToken = tokens[item.paragraphIndex];
				const closeToken = tokens[item.paragraphIndex + 2];
				if (openToken && closeToken) {
					openToken.hidden = true;
					closeToken.hidden = true;
				}
			}
			continue;
		}
		const currentItem = listItemStack.at(-1);
		if (!currentItem || token.level !== currentItem.level + 1) continue;
		if (token.type === "paragraph_open") currentItem.paragraphIndex = currentItem.paragraphIndex === void 0 ? index : null;
	}
}
function markdownToMatrixHtml(markdown, options = {}) {
	const analysis = analyzeMatrixSpoilers(markdown);
	if (analysis.metadataCollision) return renderMatrixFallbackHtml(analysis);
	const tokens = parseMatrixMarkdown(analysis, options.tableMode);
	compactLooseListTokens(tokens);
	return md.renderer.render(tokens, md.options, {}).trimEnd();
}
function protectMatrixSpoilerDelimiters(analysis) {
	const { markdown, delimiterOffsets: offsets } = analysis;
	if (offsets.length === 0) return { markdown };
	const markers = createMatrixPrivateMarkers(markdown, "Matrix spoiler formatting exhausted its private marker pool");
	let protectedMarkdown = "";
	let cursor = 0;
	for (const [index, offset] of offsets.entries()) {
		const marker = index % 2 === 0 ? markers.open : markers.close;
		protectedMarkdown += `${markdown.slice(cursor, offset)}${marker}${markers.padding}`;
		cursor = offset + 2;
	}
	protectedMarkdown += markdown.slice(cursor);
	return {
		markdown: protectedMarkdown,
		markers
	};
}
function parseMatrixMarkdown(analysis, tableMode) {
	const protectedSpoilers = protectMatrixSpoilerDelimiters(analysis);
	if (tableMode === "off") md.disable("table");
	try {
		return md.parse(protectedSpoilers.markdown, { matrixSpoilerMarkers: protectedSpoilers.markers });
	} finally {
		if (tableMode === "off") md.enable("table");
	}
}
function markdownToMatrixBody(markdown) {
	return renderMatrixBody(analyzeMatrixSpoilers(markdown));
}
function renderMatrixBody(analysis) {
	const { markdown: projected, delimiterOffsets: offsets, metadataCollision } = analysis;
	if (offsets.length === 0 && !metadataCollision) return projected;
	let body = projected;
	if (metadataCollision) body = "[Spoiler]";
	else for (let index = offsets.length - 2; index >= 0; index -= 2) {
		const open = offsets[index];
		const close = offsets[index + 1];
		if (open !== void 0 && close !== void 0) body = `${body.slice(0, open)}[Spoiler]${body.slice(close + 2)}`;
	}
	const ir = markdownToIR(body, {
		enableHtmlUnderline: true,
		headingStyle: "rich",
		linkify: true
	});
	return renderMarkdownWithMarkers(ir, {
		styleMarkers: {},
		escapeText: (text) => text
	}, MATRIX_FORMAT_PROFILE);
}
function renderMatrixFallbackHtml(analysis) {
	return `<p>${escapeHtml(renderMatrixBody(analysis)).replaceAll("\n", "<br>\n")}</p>`;
}
async function resolveMarkdownMentionState(params) {
	const tokens = parseMatrixMarkdown(params.analysis, params.tableMode);
	const selfUserId = await resolveMatrixSelfUserId(params.client);
	const userIds = [];
	const seenUserIds = /* @__PURE__ */ new Set();
	let roomMentioned = false;
	for (const token of tokens) {
		if (!token.children?.length) continue;
		const mutated = mutateInlineTokensWithMentions({
			children: token.children,
			userIds,
			seenUserIds,
			selfUserId
		});
		token.children = mutated.children;
		roomMentioned ||= mutated.roomMentioned;
	}
	const mentions = {};
	if (userIds.length > 0) mentions.user_ids = userIds;
	if (roomMentioned) mentions.room = true;
	return {
		tokens,
		mentions
	};
}
async function resolveMatrixMentionsInMarkdown(params) {
	return (await resolveMarkdownMentionState({
		analysis: analyzeMatrixSpoilers(params.markdown),
		client: params.client
	})).mentions;
}
async function renderMarkdownToMatrixHtmlWithMentions(params) {
	const analysis = analyzeMatrixSpoilers(params.markdown);
	const state = await resolveMarkdownMentionState({
		...params,
		analysis
	});
	if (analysis.metadataCollision) {
		const redacted = renderMatrixBody(analysis);
		const redactedState = await resolveMarkdownMentionState({
			...params,
			analysis: analyzeMatrixSpoilers(redacted)
		});
		return {
			html: renderMatrixFallbackHtml(analysis),
			mentions: redactedState.mentions
		};
	}
	compactLooseListTokens(state.tokens);
	return {
		html: md.renderer.render(state.tokens, md.options, {}).trimEnd() || void 0,
		mentions: state.mentions
	};
}
//#endregion
//#region extensions/matrix/src/matrix/send/chunking.ts
function normalizeMatrixEventLimit(limit) {
	if (!Number.isFinite(limit) || limit <= 0) return limit;
	return Math.max(1, Math.floor(limit));
}
function resolveMatrixChunkOverflow(chunk, limit) {
	const body = markdownToMatrixBody(chunk);
	const renderedLength = Math.max(chunk.length, body.length);
	if (limit === 1 && Array.from(chunk).length === 1 && Array.from(body).length === 1) return 0;
	return Math.max(0, renderedLength - limit);
}
function protectMatrixUnderlineTags(markdown) {
	const { codeRegions, metadataRanges, underlineTags } = prepareMatrixMarkdownSource(markdown);
	const tags = underlineTags.filter((tag) => !tag.selfClosing && !isInsideCode(tag.start, codeRegions) && !isMarkdownEscaped(markdown, tag.start) && !metadataRanges.some((range) => tag.start >= range.start && tag.start < range.end));
	if (tags.length === 0) return { markdown };
	const markers = createMatrixPrivateMarkers(markdown, "Matrix underline chunking exhausted its private marker pool");
	let depth = 0;
	const replacements = tags.flatMap((tag) => {
		if (!tag.closing) {
			depth += 1;
			return [{
				tag,
				marker: depth === 1 ? markers.open : ""
			}];
		}
		if (depth === 0) return [];
		depth -= 1;
		return [{
			tag,
			marker: depth === 0 ? markers.close : ""
		}];
	});
	let protectedMarkdown = markdown;
	for (const { tag, marker } of replacements.toReversed()) protectedMarkdown = `${protectedMarkdown.slice(0, tag.start)}${marker}${markers.padding.repeat(tag.raw.length - marker.length)}${protectedMarkdown.slice(tag.end)}`;
	return {
		markdown: protectedMarkdown,
		markers
	};
}
function restoreMatrixStyleChunks(chunks, spoiler, underline) {
	if (!spoiler && !underline) return chunks;
	const stack = [];
	const syntax = {
		spoiler: {
			open: "||",
			close: "||"
		},
		underline: {
			open: "<u>",
			close: "</u>"
		}
	};
	return chunks.map((chunk) => {
		let restored = stack.map((style) => syntax[style].open).join("");
		for (const character of chunk) {
			const opening = character === spoiler?.open ? "spoiler" : character === underline?.open ? "underline" : void 0;
			const closing = character === spoiler?.close ? "spoiler" : character === underline?.close ? "underline" : void 0;
			if (opening) {
				stack.push(opening);
				restored += syntax[opening].open;
			} else if (closing) {
				const stackIndex = stack.lastIndexOf(closing);
				if (stackIndex >= 0) {
					const above = stack.slice(stackIndex + 1);
					restored += above.toReversed().map((style) => syntax[style].close).join("");
					restored += syntax[closing].close;
					stack.splice(stackIndex, 1);
					restored += above.map((style) => syntax[style].open).join("");
				}
			} else if (character !== spoiler?.padding && character !== underline?.padding) restored += character;
		}
		return restored + stack.toReversed().map((style) => syntax[style].close).join("");
	});
}
function splitMatrixTableSegments(markdown) {
	const segments = [];
	let cursor = 0;
	for (const range of findMatrixTableSourceRanges(markdown)) {
		const plain = markdown.slice(cursor, range.start).replace(/(?:[ \t]*\n)+$/u, "");
		if (plain.trim()) segments.push({
			table: false,
			text: plain
		});
		const rawTable = markdown.slice(range.start, range.end).trimEnd();
		const indent = /^ +/u.exec(rawTable)?.[0] ?? "";
		const table = indent ? rawTable.split("\n").map((line) => line.startsWith(indent) ? line.slice(indent.length) : line).join("\n") : rawTable;
		segments.push({
			table: true,
			text: table
		});
		cursor = range.end;
	}
	const tail = markdown.slice(cursor).replace(/^(?:[ \t]*\n)+/u, "");
	if (tail.trim()) segments.push({
		table: false,
		text: tail
	});
	return segments;
}
function prepareMatrixSingleText(text, opts) {
	const normalizedText = text.replace(/\r\n?/gu, "\n");
	const trimmedText = opts.preserveWhitespace ? normalizedText : normalizedText.trim();
	const cfg = requireRuntimeConfig(opts.cfg, "Matrix text preparation");
	const tableMode = opts.tableMode ?? resolveMarkdownTableMode({
		cfg,
		channel: "matrix",
		accountId: opts.accountId,
		supportsBlockTables: MATRIX_FORMAT_PROFILE.constructs.table === "native"
	});
	const convertedText = renderMatrixMarkdownTables(trimmedText, tableMode);
	const singleEventLimit = normalizeMatrixEventLimit(Math.min(resolveTextChunkLimit(cfg, "matrix", opts.accountId), MATRIX_FORMAT_PROFILE.chunk.limit));
	const preparedBody = markdownToMatrixBody(convertedText);
	const eventTextLength = Math.max(convertedText.length, preparedBody.length);
	return {
		trimmedText,
		convertedText,
		preparedBody,
		singleEventLimit,
		eventTextLength,
		fitsInSingleEvent: eventTextLength <= singleEventLimit,
		tableMode
	};
}
function chunkMatrixText(text, opts) {
	const preparedText = prepareMatrixSingleText(text, opts);
	if (preparedText.fitsInSingleEvent) return {
		...preparedText,
		chunks: preparedText.convertedText ? [preparedText.convertedText] : []
	};
	const cfg = requireRuntimeConfig(opts.cfg, "Matrix text chunking");
	const chunkMode = getMatrixRuntime().channel.text.resolveChunkMode(cfg, "matrix", opts.accountId);
	const analysis = analyzeMatrixSpoilers(preparedText.convertedText);
	const collisionRedacted = analysis.metadataCollision ? renderMatrixBody(analysis) : void 0;
	const chunkSegment = (segmentText) => {
		const segmentAnalysis = analyzeMatrixSpoilers(segmentText);
		const protectedUnderline = protectMatrixUnderlineTags(segmentAnalysis.metadataCollision ? renderMatrixBody(segmentAnalysis) : segmentText);
		const protectedSpoilers = protectMatrixSpoilerDelimiters(analyzeMatrixSpoilers(protectedUnderline.markdown));
		const wrapperReserve = (protectedSpoilers.markers ? 4 : 0) + (protectedUnderline.markers ? 7 : 0);
		const privateMarkers = [protectedSpoilers.markers, protectedUnderline.markers].flatMap((markers) => markers ? [
			markers.open,
			markers.close,
			markers.padding
		] : []);
		let reserve = wrapperReserve;
		while (reserve < preparedText.singleEventLimit) {
			const protectedChunks = getMatrixRuntime().channel.text.chunkMarkdownTextWithMode(protectedSpoilers.markdown, preparedText.singleEventLimit - reserve, chunkMode);
			const restored = restoreMatrixStyleChunks(protectedChunks, protectedSpoilers.markers, protectedUnderline.markers).filter((_, index) => {
				return privateMarkers.reduce((value, marker) => value.replaceAll(marker, ""), protectedChunks[index] ?? "").length > 0;
			});
			const overflow = Math.max(0, ...restored.map((chunk) => resolveMatrixChunkOverflow(chunk, preparedText.singleEventLimit)));
			if (overflow === 0) return restored;
			reserve += overflow;
		}
		throw new Error("Matrix text chunk limit is too small for formatted content");
	};
	const chunks = collisionRedacted !== void 0 ? chunkSegment(collisionRedacted) : preparedText.tableMode === "block" ? splitMatrixTableSegments(preparedText.convertedText).flatMap((segment) => {
		if (!segment.table) return chunkSegment(segment.text);
		return segment.text.length <= preparedText.singleEventLimit ? [segment.text] : chunkSegment(renderMatrixMarkdownTables(segment.text, "bullets"));
	}) : chunkSegment(preparedText.convertedText);
	return {
		...preparedText,
		chunks
	};
}
//#endregion
//#region extensions/matrix/src/matrix/media-text.ts
const MATRIX_MEDIA_KINDS = {
	"m.audio": "audio",
	"m.file": "file",
	"m.image": "image",
	"m.sticker": "sticker",
	"m.video": "video"
};
function resolveMatrixMediaKind(msgtype) {
	const key = msgtype ?? "";
	return Object.hasOwn(MATRIX_MEDIA_KINDS, key) ? MATRIX_MEDIA_KINDS[key] : void 0;
}
function resolveMatrixMediaLabel(kind, fallback = "media") {
	return `${kind ?? fallback} attachment`;
}
function formatMatrixAttachmentMarker(params) {
	const label = resolveMatrixMediaLabel(params.kind);
	if (params.tooLarge) return `[matrix ${label} too large]`;
	return params.unavailable ? `[matrix ${label} unavailable]` : `[matrix ${label}]`;
}
function isLikelyBareFilename(text) {
	const trimmed = text.trim();
	if (!trimmed || trimmed.includes("\n") || /\s/.test(trimmed)) return false;
	if (path.basename(trimmed) !== trimmed) return false;
	return path.extname(trimmed).length > 1;
}
function resolveCaptionOrFilename(params) {
	const body = params.body?.trim() ?? "";
	const filename = params.filename?.trim() ?? "";
	if (filename) {
		if (!body || body === filename) return { filename };
		return {
			caption: body,
			filename
		};
	}
	if (!body) return {};
	if (isLikelyBareFilename(body)) return { filename: body };
	return { caption: body };
}
function resolveMatrixReplacementContent(event, replacementEvent = event.unsigned?.["m.relations"]?.["m.replace"]) {
	return resolveMatrixReplacement(event, replacementEvent)?.content;
}
function resolveMatrixReplacement(event, replacementEvent = event.unsigned?.["m.relations"]?.["m.replace"]) {
	const replacement = asNullableObjectRecord(replacementEvent);
	if (!replacement || event.state_key !== void 0 || event.unsigned?.redacted_because) return;
	const content = asNullableObjectRecord(replacement.content);
	const relation = asNullableObjectRecord(content?.["m.relates_to"]);
	const unreadable = getMatrixEventProjection(replacement)?.decryptionFailure === true || replacement.type === "m.room.encrypted";
	if (replacement.sender !== event.sender || !unreadable && replacement.type !== event.type || replacement.state_key !== void 0 || asNullableObjectRecord(replacement.unsigned)?.redacted_because || !relation || relation.rel_type !== "m.replace" || relation.event_id !== event.event_id) return;
	if (unreadable) return { kind: "unreadable" };
	const newContent = asNullableRecord(content?.["m.new_content"]);
	return newContent ? {
		kind: "content",
		content: newContent
	} : void 0;
}
function resolveMatrixMessageAttachment(params) {
	const kind = resolveMatrixMediaKind(params.msgtype);
	if (!kind) return;
	const resolved = resolveCaptionOrFilename(params);
	return {
		kind,
		caption: resolved.caption,
		filename: resolved.filename
	};
}
function formatMatrixAttachmentText(params) {
	if (!params.attachment) return;
	return formatMatrixAttachmentMarker({
		kind: params.attachment.kind,
		tooLarge: params.tooLarge,
		unavailable: params.unavailable
	});
}
function formatMatrixMessageText(params) {
	const attachment = resolveMatrixMessageAttachment(params);
	const body = attachment ? attachment.caption ?? "" : params.body?.trim() ?? "";
	const marker = formatMatrixAttachmentText({
		attachment,
		tooLarge: params.tooLarge,
		unavailable: params.unavailable
	});
	if (!marker) return body || void 0;
	if (!body) return marker;
	return `${body}\n\n${marker}`;
}
function formatMatrixMediaUnavailableText(params) {
	return formatMatrixMessageText({
		...params,
		unavailable: true
	}) ?? "";
}
function formatMatrixMediaTooLargeText(params) {
	return formatMatrixMessageText({
		...params,
		tooLarge: true
	}) ?? "";
}
//#endregion
//#region extensions/matrix/src/matrix/send/edit-content.ts
const MAX_EDIT_RELATION_PAGES = 100;
const EDIT_RELATION_PAGE_SIZE = 100;
const EDIT_DECRYPTION_ERROR = "Matrix edit history is not fully decrypted; restore encryption keys before editing.";
async function resolveMatrixEditContent(params) {
	const { client, roomId, event } = params;
	if (!event || event.unsigned?.redacted_because || event.state_key !== void 0) return event?.content;
	const projection = getMatrixEventProjection(event);
	if (projection?.decryptionFailure || event.type === "m.room.encrypted") throw new Error(EDIT_DECRYPTION_ERROR);
	const originalContent = projection?.originalContent ?? event.content;
	const embedded = resolveMatrixReplacementContent(event) ?? asNullableObjectRecord(originalContent?.["m.new_content"]);
	if (embedded) return embedded;
	let latest;
	let latestReplacement;
	let from;
	const seenCursors = /* @__PURE__ */ new Set();
	for (let pageIndex = 0; pageIndex < MAX_EDIT_RELATION_PAGES; pageIndex++) {
		const page = await client.getRelations(roomId, event.event_id, "m.replace", void 0, {
			from,
			limit: EDIT_RELATION_PAGE_SIZE
		});
		for (const replacement of page.events) {
			const replacementContent = resolveMatrixReplacement(event, replacement);
			if (replacementContent && (!latest || replacement.origin_server_ts > latest.origin_server_ts || replacement.origin_server_ts === latest.origin_server_ts && replacement.event_id > latest.event_id)) {
				latest = replacement;
				latestReplacement = replacementContent;
			}
		}
		from = page.nextBatch ?? void 0;
		if (!from) {
			if (latestReplacement?.kind === "unreadable") throw new Error(EDIT_DECRYPTION_ERROR);
			return latestReplacement?.content ?? originalContent;
		}
		if (seenCursors.has(from)) break;
		seenCursors.add(from);
	}
	throw new Error("Matrix edit history could not be fully read; send a new message instead.");
}
//#endregion
//#region extensions/matrix/src/matrix/send/formatting.ts
async function renderMatrixFormattedContent(params) {
	const markdown = params.markdown ?? "";
	const body = params.preparedBody ?? markdownToMatrixBody(markdown);
	if (params.includeMentions === false) return {
		body,
		html: markdownToMatrixHtml(markdown, { tableMode: params.tableMode }).trimEnd() || void 0
	};
	const { html, mentions } = await renderMarkdownToMatrixHtmlWithMentions({
		markdown,
		client: params.client,
		tableMode: params.tableMode
	});
	return {
		body,
		html,
		mentions
	};
}
function buildTextContent(body, relation, opts = {}) {
	const msgtype = opts.msgtype ?? MsgType.Text;
	return relation ? {
		msgtype,
		body,
		"m.relates_to": relation
	} : {
		msgtype,
		body
	};
}
async function enrichMatrixFormattedContent(params) {
	const { body, html, mentions } = await renderMatrixFormattedContent({
		client: params.client,
		markdown: params.markdown,
		preparedBody: params.preparedBody,
		includeMentions: params.includeMentions,
		tableMode: params.tableMode
	});
	params.content.body = body || params.content.body;
	if (mentions) params.content["m.mentions"] = mentions;
	else delete params.content["m.mentions"];
	if (!html) {
		delete params.content.format;
		delete params.content.formatted_body;
		return;
	}
	params.content.format = "org.matrix.custom.html";
	params.content.formatted_body = html;
}
async function resolveMatrixMentionsForBody(params) {
	return await resolveMatrixMentionsInMarkdown({
		markdown: params.body ?? "",
		client: params.client
	});
}
function normalizeMentionUserIds(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string" && entry.trim().length > 0) : [];
}
function extractMatrixMentions(content) {
	const rawMentions = content?.["m.mentions"];
	if (!rawMentions || typeof rawMentions !== "object") return {};
	const mentions = rawMentions;
	const normalized = {};
	const userIds = normalizeMentionUserIds(mentions.user_ids);
	if (userIds.length > 0) normalized.user_ids = userIds;
	if (mentions.room === true) normalized.room = true;
	return normalized;
}
function diffMatrixMentions(current, previous) {
	const previousUserIds = new Set(previous.user_ids ?? []);
	const newUserIds = (current.user_ids ?? []).filter((userId) => !previousUserIds.has(userId));
	const delta = {};
	if (newUserIds.length > 0) delta.user_ids = newUserIds;
	if (current.room && !previous.room) delta.room = true;
	return delta;
}
function resolveMatrixMsgType(contentType, _fileName) {
	switch (getMatrixRuntime().media.mediaKindFromMime(contentType ?? "")) {
		case "image": return MsgType.Image;
		case "audio": return MsgType.Audio;
		case "video": return MsgType.Video;
		default: return MsgType.File;
	}
}
function resolveMatrixVoiceDecision(opts) {
	if (!opts.wantsVoice) return { useVoice: false };
	if (isMatrixVoiceCompatibleAudio(opts)) return { useVoice: true };
	return { useVoice: false };
}
function isMatrixVoiceCompatibleAudio(opts) {
	return isVoiceMessageCompatibleAudio({
		contentType: opts.contentType,
		fileName: opts.fileName
	});
}
//#endregion
//#region extensions/matrix/src/matrix/send/media.ts
function buildMatrixMediaInfo(params) {
	const base = {};
	if (Number.isFinite(params.size)) base.size = params.size;
	if (params.mimetype) base.mimetype = params.mimetype;
	const info = params.imageInfo ? {
		...base,
		...params.imageInfo
	} : base;
	if (typeof params.durationMs === "number") return {
		...info,
		duration: params.durationMs
	};
	if (!params.imageInfo && Object.keys(info).length === 0) return;
	return info;
}
function buildMediaContent(params) {
	const info = buildMatrixMediaInfo({
		size: params.size,
		mimetype: params.mimetype,
		durationMs: params.durationMs,
		imageInfo: params.imageInfo
	});
	const base = {
		msgtype: params.msgtype,
		body: params.body,
		filename: params.filename,
		info: info ?? void 0
	};
	if (!params.file && params.url) base.url = params.url;
	if (params.file) base.file = params.file;
	if (params.isVoice) {
		base["org.matrix.msc3245.voice"] = {};
		if (typeof params.durationMs === "number") base["org.matrix.msc1767.audio"] = { duration: params.durationMs };
	}
	if (params.relation) base["m.relates_to"] = params.relation;
	return base;
}
const THUMBNAIL_MAX_SIDE = 800;
const THUMBNAIL_QUALITY = 80;
const AIFC_IMA4_BYTES_PER_CHANNEL_PACKET = 34;
const AIFC_IMA4_FRAMES_PER_PACKET = 64;
function resolveAifcIma4DurationSeconds(buffer, sampleRate) {
	if (!sampleRate || !Number.isFinite(sampleRate) || buffer.length < 12 || buffer.toString("ascii", 0, 4) !== "FORM" || buffer.toString("ascii", 8, 12) !== "AIFC") return;
	let channels;
	let declaredFrameCount;
	let soundDataBytes;
	for (let offset = 12; offset + 8 <= buffer.length;) {
		const chunkType = buffer.toString("ascii", offset, offset + 4);
		const chunkSize = buffer.readUInt32BE(offset + 4);
		const chunkStart = offset + 8;
		if (chunkSize > buffer.length - chunkStart) return;
		if (chunkType === "COMM") {
			if (chunkSize < 22 || buffer.toString("ascii", chunkStart + 18, chunkStart + 22) !== "ima4") return;
			channels = buffer.readUInt16BE(chunkStart);
			declaredFrameCount = buffer.readUInt32BE(chunkStart + 2);
		} else if (chunkType === "SSND") {
			if (chunkSize < 8) return;
			const soundDataOffset = buffer.readUInt32BE(chunkStart);
			if (soundDataOffset > chunkSize - 8) return;
			soundDataBytes = chunkSize - 8 - soundDataOffset;
		}
		offset = chunkStart + chunkSize + (chunkSize & 1);
	}
	if (!channels || !declaredFrameCount || !soundDataBytes) return;
	const packetSize = channels * AIFC_IMA4_BYTES_PER_CHANNEL_PACKET;
	if (soundDataBytes % packetSize !== 0) return;
	const packetCount = soundDataBytes / packetSize;
	if (packetCount !== declaredFrameCount) return;
	return packetCount * AIFC_IMA4_FRAMES_PER_PACKET / sampleRate;
}
async function prepareImageInfo(params) {
	const meta = await getMatrixRuntime().media.getImageMetadata(params.buffer).catch(() => null);
	if (!meta) return;
	const imageInfo = {
		w: meta.width,
		h: meta.height
	};
	if (Math.max(meta.width, meta.height) > THUMBNAIL_MAX_SIDE) try {
		const thumbBuffer = await getMatrixRuntime().media.resizeToJpeg({
			buffer: params.buffer,
			maxSide: THUMBNAIL_MAX_SIDE,
			quality: THUMBNAIL_QUALITY,
			withoutEnlargement: true
		});
		const thumbMeta = await getMatrixRuntime().media.getImageMetadata(thumbBuffer).catch(() => null);
		const result = await uploadMediaWithEncryption(params.client, params.roomId, thumbBuffer, {
			contentType: "image/jpeg",
			filename: "thumbnail.jpg"
		});
		if (result.file) imageInfo.thumbnail_file = result.file;
		else imageInfo.thumbnail_url = result.url;
		if (thumbMeta) imageInfo.thumbnail_info = {
			w: thumbMeta.width,
			h: thumbMeta.height,
			mimetype: "image/jpeg",
			size: thumbBuffer.byteLength
		};
	} catch {}
	return imageInfo;
}
async function resolveMediaDurationMs(params) {
	if (params.kind !== "audio" && params.kind !== "video") return;
	try {
		const fileInfo = params.contentType || params.fileName ? {
			mimeType: params.contentType,
			size: params.buffer.byteLength,
			path: params.fileName
		} : void 0;
		const metadata = await parseBuffer(params.buffer, fileInfo, {
			duration: true,
			skipCovers: true
		});
		const durationSeconds = resolveAifcIma4DurationSeconds(params.buffer, metadata.format.sampleRate) ?? metadata.format.duration;
		if (typeof durationSeconds === "number" && Number.isFinite(durationSeconds)) return Math.max(0, Math.round(durationSeconds * 1e3));
	} catch {}
}
async function uploadMediaWithEncryption(client, roomId, buffer, params) {
	if (await client.prepareRoomForMessageSend(roomId) === "m.room.encrypted") {
		if (!client.crypto) throw new Error("Encrypted Matrix room: enable encryption before uploading media");
		const encrypted = await client.crypto.encryptMedia(buffer);
		const mxc = await client.uploadContent(encrypted.buffer, "application/octet-stream");
		return {
			url: mxc,
			file: {
				url: mxc,
				...encrypted.file
			}
		};
	}
	return { url: await client.uploadContent(buffer, params.contentType, params.filename) };
}
//#endregion
//#region extensions/matrix/src/matrix/send.ts
var send_exports = /* @__PURE__ */ __exportAll({
	chunkMatrixText: () => chunkMatrixText,
	editMessageMatrix: () => editMessageMatrix,
	prepareMatrixSingleText: () => prepareMatrixSingleText,
	reactMatrixMessage: () => reactMatrixMessage,
	resolveMatrixMentionsForBody: () => resolveMatrixMentionsForBody,
	resolveMatrixRoomId: () => resolveMatrixRoomId,
	sendMessageMatrix: () => sendMessageMatrix,
	sendPollMatrix: () => sendPollMatrix,
	sendReadReceiptMatrix: () => sendReadReceiptMatrix,
	sendSingleTextMessageMatrix: () => sendSingleTextMessageMatrix,
	sendTypingMatrix: () => sendTypingMatrix
});
function isMatrixClient(value) {
	return typeof value.sendEvent === "function";
}
function normalizeMatrixClientResolveOpts(opts) {
	if (!opts) return {};
	if (isMatrixClient(opts)) return { client: opts };
	return {
		client: opts.client,
		cfg: opts.cfg,
		timeoutMs: opts.timeoutMs,
		accountId: opts.accountId
	};
}
function resolvePreviousThreadId(previousEvent) {
	if (!previousEvent || typeof previousEvent !== "object") return;
	const content = previousEvent.content;
	if (!content || typeof content !== "object") return;
	const relation = content["m.relates_to"];
	if (!relation || typeof relation !== "object") return;
	const relationRecord = relation;
	if (relationRecord.rel_type !== RelationType.Thread || typeof relationRecord.event_id !== "string") return;
	return normalizeThreadId(relationRecord.event_id) ?? void 0;
}
function withMatrixExtraContentFields(content, extraContent) {
	if (!extraContent) return content;
	return {
		...content,
		...extraContent
	};
}
async function resolvePreviousEditMentions(params) {
	const content = await resolveMatrixEditContent(params);
	if (content && Object.hasOwn(content, "m.mentions")) return extractMatrixMentions(content);
	const body = typeof content?.body === "string" ? content.body : "";
	if (!body) return {};
	return await resolveMatrixMentionsForBody({
		client: params.client,
		body
	});
}
async function sendMessageMatrix(to, message, opts) {
	const messageText = message?.trimEnd() ?? "";
	if (!messageText.trim() && !opts.mediaUrl) throw new Error("Matrix send requires text or media");
	const durableIdentity = resolveMatrixDurableDeliveryIdentity({
		queueId: opts.deliveryQueueId,
		partIndex: opts.deliveryPartIndex,
		partCount: opts.deliveryPartCount
	});
	return await withResolvedMatrixSendClient({
		client: opts.client,
		cfg: opts.cfg,
		timeoutMs: opts.timeoutMs,
		accountId: opts.accountId,
		signal: opts.signal,
		assertDirectAdapterHandoff: opts.assertDirectAdapterHandoff
	}, async (client) => {
		const roomId = await resolveMatrixRoomId(client, to);
		const wireEventType = await client.prepareRoomForMessageSend(roomId);
		const cfg = requireRuntimeConfig(opts.cfg, "Matrix send");
		const threadId = normalizeThreadId(opts.threadId);
		const transactionScopeId = durableIdentity ? await client.getTransactionScopeId() : void 0;
		let plannedEvents = (durableIdentity ? await loadMatrixDeliveryPlan({
			identity: durableIdentity,
			accountId: opts.accountId,
			roomId,
			transactionScopeId,
			wireEventType
		}) : null)?.events;
		if (!plannedEvents) {
			const { chunks, convertedText, preparedBody, fitsInSingleEvent, tableMode } = chunkMatrixText(messageText, {
				cfg,
				accountId: opts.accountId,
				preserveWhitespace: true
			});
			const singleEventBody = fitsInSingleEvent ? preparedBody : void 0;
			const relation = buildMatrixMessageRelation({
				...opts,
				threadId
			});
			let pendingExtraContent = opts.extraContent;
			const events = [];
			const prepareContent = (content, receiptKind) => {
				events.push({
					content: withMatrixExtraContentFields(content, pendingExtraContent),
					receiptKind
				});
				pendingExtraContent = void 0;
			};
			if (opts.mediaUrl) {
				const maxBytes = resolveMediaMaxBytes(opts.accountId, cfg);
				const media = await loadOutboundMediaFromUrl(opts.mediaUrl, {
					maxBytes,
					mediaAccess: opts.mediaAccess,
					mediaLocalRoots: opts.mediaLocalRoots,
					mediaReadFile: opts.mediaReadFile
				});
				const uploaded = await uploadMediaWithEncryption(client, roomId, media.buffer, {
					contentType: media.contentType,
					filename: media.fileName
				});
				const durationMs = await resolveMediaDurationMs({
					buffer: media.buffer,
					contentType: media.contentType,
					fileName: media.fileName,
					kind: media.kind === "sticker" ? "unknown" : media.kind ?? "unknown"
				});
				const baseMsgType = resolveMatrixMsgType(media.contentType, media.fileName);
				const { useVoice } = resolveMatrixVoiceDecision({
					wantsVoice: opts.audioAsVoice === true,
					contentType: media.contentType,
					fileName: media.fileName
				});
				const msgtype = useVoice ? MsgType.Audio : baseMsgType;
				const receiptKind = useVoice ? "voice" : "media";
				const imageInfo = msgtype === MsgType.Image ? await prepareImageInfo({
					buffer: media.buffer,
					client,
					roomId
				}) : void 0;
				const [firstChunk, ...rest] = chunks;
				const captionMarkdown = useVoice ? "" : firstChunk ?? "";
				const content = buildMediaContent({
					msgtype,
					body: useVoice ? "Voice message" : captionMarkdown || media.fileName || "(file)",
					url: uploaded.url,
					file: uploaded.file,
					filename: media.fileName,
					mimetype: media.contentType,
					size: media.buffer.byteLength,
					durationMs,
					relation,
					isVoice: useVoice,
					imageInfo
				});
				await enrichMatrixFormattedContent({
					client,
					content,
					markdown: captionMarkdown,
					preparedBody: captionMarkdown === convertedText ? singleEventBody : void 0,
					tableMode
				});
				prepareContent(content, receiptKind);
				const textChunks = useVoice ? chunks : rest;
				const followupRelation = useVoice || threadId ? relation : void 0;
				for (const chunk of textChunks) {
					if (!chunk.trim()) continue;
					const followup = buildTextContent(chunk, followupRelation);
					await enrichMatrixFormattedContent({
						client,
						content: followup,
						markdown: chunk,
						preparedBody: chunk === convertedText ? singleEventBody : void 0,
						tableMode
					});
					prepareContent(followup, "text");
				}
			} else for (const chunk of chunks.length ? chunks : [""]) {
				if (!chunk.trim()) continue;
				const content = buildTextContent(chunk, relation);
				await enrichMatrixFormattedContent({
					client,
					content,
					markdown: chunk,
					preparedBody: chunk === convertedText ? singleEventBody : void 0,
					tableMode
				});
				prepareContent(content, "text");
			}
			plannedEvents = durableIdentity ? createMatrixPlannedEvents({
				identity: durableIdentity,
				events
			}) : events.map((event) => ({
				content: event.content,
				receiptKind: event.receiptKind,
				transactionId: ""
			}));
		}
		if (opts.mediaUrl) await client.prepareRoomForMessageSend(roomId, plannedEvents[0]?.content);
		const acceptedEvents = [];
		const acceptedContents = [];
		let lastMessageId = "";
		for (const planned of plannedEvents) {
			const eventId = await client.sendMessage(roomId, planned.content, planned.transactionId || void 0, durableIdentity ? async (dispatch) => {
				await persistMatrixDeliveryPlan({
					identity: durableIdentity,
					accountId: opts.accountId,
					roomId,
					transactionScopeId,
					wireEventType: dispatch.eventType,
					events: plannedEvents,
					dispatch
				});
				await opts.onPlatformSendDispatch?.();
			} : opts.onPlatformSendDispatch);
			lastMessageId = eventId || lastMessageId;
			if (!eventId) continue;
			const eventReplyToId = resolveMatrixReplyToEventId(planned.content);
			const acceptedEvent = {
				messageId: eventId,
				kind: planned.receiptKind,
				...eventReplyToId ? { replyToId: eventReplyToId } : {}
			};
			acceptedEvents.push(acceptedEvent);
			const visibleContent = planned.content.body ?? "";
			acceptedContents.push(visibleContent);
			await opts.onDeliveryResult?.({
				messageId: eventId,
				roomId,
				primaryMessageId: eventId,
				receipt: createMatrixSendReceipt({
					roomId,
					events: [acceptedEvent],
					threadId
				}),
				content: visibleContent
			});
		}
		return {
			messageId: lastMessageId || "unknown",
			roomId,
			primaryMessageId: acceptedEvents[0]?.messageId ?? (lastMessageId || "unknown"),
			receipt: createMatrixSendReceipt({
				roomId,
				events: acceptedEvents,
				threadId
			}),
			content: acceptedContents.join("\n")
		};
	});
}
async function sendPollMatrix(to, poll, opts) {
	if (!poll.question?.trim()) throw new Error("Matrix poll requires a question");
	if (!poll.options?.length) throw new Error("Matrix poll requires options");
	return await withResolvedMatrixSendClient({
		client: opts.client,
		cfg: opts.cfg,
		timeoutMs: opts.timeoutMs,
		accountId: opts.accountId
	}, async (client) => {
		const roomId = await resolveMatrixRoomId(client, to);
		const pollContent = buildPollStartContent(poll);
		const mentions = await resolveMatrixMentionsForBody({
			client,
			body: pollContent["m.text"] ?? pollContent["org.matrix.msc1767.text"] ?? poll.question ?? ""
		});
		const threadId = normalizeThreadId(opts.threadId);
		const pollPayload = threadId ? {
			...pollContent,
			"m.relates_to": buildMatrixMessageRelation({ threadId })
		} : { ...pollContent };
		pollPayload["m.mentions"] = mentions;
		return {
			eventId: await client.sendEvent(roomId, "m.poll.start", pollPayload) ?? "unknown",
			roomId
		};
	});
}
async function sendTypingMatrix(roomId, typing, optsOrTimeoutMs, client) {
	const opts = typeof optsOrTimeoutMs === "number" ? {
		timeoutMs: optsOrTimeoutMs,
		...client ? { client } : {}
	} : {
		...normalizeMatrixClientResolveOpts(optsOrTimeoutMs),
		...client ? { client } : {}
	};
	await withResolvedMatrixControlClient({
		client: opts.client,
		cfg: opts.cfg,
		timeoutMs: opts.timeoutMs,
		accountId: opts.accountId
	}, async (resolved) => {
		const resolvedRoom = await resolveMatrixRoomId(resolved, roomId);
		const resolvedTimeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 3e4;
		await resolved.setTyping(resolvedRoom, typing, resolvedTimeoutMs);
	});
}
async function sendReadReceiptMatrix(roomId, eventId, client) {
	if (!eventId?.trim()) return;
	await withResolvedMatrixControlClient({ client }, async (resolved) => {
		const resolvedRoom = await resolveMatrixRoomId(resolved, roomId);
		await resolved.sendReadReceipt(resolvedRoom, eventId.trim());
	});
}
async function sendSingleTextMessageMatrix(roomId, text, opts) {
	const { trimmedText, convertedText, preparedBody, singleEventLimit, eventTextLength, fitsInSingleEvent, tableMode } = prepareMatrixSingleText(text.trimEnd(), {
		cfg: opts.cfg,
		accountId: opts.accountId,
		preserveWhitespace: true
	});
	if (!trimmedText.trim()) throw new Error("Matrix single-message send requires text");
	if (!fitsInSingleEvent) throw new Error(`Matrix single-message text exceeds limit (${eventTextLength} > ${singleEventLimit})`);
	return await withResolvedMatrixSendClient({
		client: opts.client,
		cfg: opts.cfg,
		accountId: opts.accountId
	}, async (client) => {
		const resolvedRoom = await resolveMatrixRoomId(client, roomId);
		const normalizedThreadId = normalizeThreadId(opts.threadId);
		const relation = buildMatrixMessageRelation({
			...opts,
			threadId: normalizedThreadId
		});
		const content = withMatrixExtraContentFields(buildTextContent(convertedText, relation, { msgtype: opts.msgtype }), opts.extraContent);
		await enrichMatrixFormattedContent({
			client,
			content,
			markdown: convertedText,
			preparedBody,
			includeMentions: opts.includeMentions,
			tableMode
		});
		if (opts.live) content[MSC4357_LIVE_KEY] = {};
		const eventId = await client.sendMessage(resolvedRoom, content);
		const replyToId = resolveMatrixReplyToEventId(content);
		return {
			messageId: eventId ?? "unknown",
			roomId: resolvedRoom,
			primaryMessageId: eventId ?? "unknown",
			receipt: createMatrixSendReceipt({
				roomId: resolvedRoom,
				events: eventId ? [{
					messageId: eventId,
					kind: "text",
					...replyToId ? { replyToId } : {}
				}] : [],
				threadId: normalizedThreadId
			}),
			content: content.body
		};
	});
}
async function editMessageMatrix(roomId, originalEventId, newText, opts) {
	return await withResolvedMatrixSendClient({
		client: opts.client,
		cfg: opts.cfg,
		accountId: opts.accountId,
		timeoutMs: opts.timeoutMs
	}, async (client) => {
		const resolvedRoom = await resolveMatrixRoomId(client, roomId);
		const { convertedText, preparedBody, tableMode } = prepareMatrixSingleText(newText, {
			cfg: requireRuntimeConfig(opts.cfg, "Matrix message edit"),
			accountId: opts.accountId,
			preserveWhitespace: true
		});
		const newContent = withMatrixExtraContentFields(buildTextContent(convertedText, void 0, { msgtype: opts.msgtype }), opts.extraContent);
		await enrichMatrixFormattedContent({
			client,
			content: newContent,
			markdown: convertedText,
			preparedBody,
			includeMentions: opts.includeMentions,
			tableMode
		});
		const threadId = normalizeThreadId(opts.threadId);
		const previousEvent = opts.includeMentions !== false || threadId ? await client.getEvent(resolvedRoom, originalEventId) : null;
		const replaceMentions = opts.includeMentions === false ? void 0 : diffMatrixMentions(extractMatrixMentions(newContent), await resolvePreviousEditMentions({
			client,
			roomId: resolvedRoom,
			event: previousEvent
		}));
		const replaceRelation = {
			rel_type: RelationType.Replace,
			event_id: originalEventId
		};
		if (threadId) {
			if (resolvePreviousThreadId(previousEvent) !== threadId) throw new Error("Matrix edit cannot add or change the original event thread relation.");
		}
		const content = {
			...newContent,
			body: `* ${newContent.body}`,
			...typeof newContent.formatted_body === "string" ? { formatted_body: `* ${newContent.formatted_body}` } : {},
			"m.new_content": newContent,
			"m.relates_to": replaceRelation
		};
		if (replaceMentions !== void 0) content["m.mentions"] = replaceMentions;
		if (opts.live) {
			content[MSC4357_LIVE_KEY] = {};
			content["m.new_content"][MSC4357_LIVE_KEY] = {};
		}
		return await client.sendMessage(resolvedRoom, content) ?? "";
	});
}
async function reactMatrixMessage(roomId, messageId, emoji, opts) {
	const clientOpts = normalizeMatrixClientResolveOpts(opts);
	await withResolvedMatrixSendClient({
		client: clientOpts.client,
		cfg: clientOpts.cfg,
		timeoutMs: clientOpts.timeoutMs,
		accountId: clientOpts.accountId ?? void 0
	}, async (resolved) => {
		const resolvedRoom = await resolveMatrixRoomId(resolved, roomId);
		const reaction = buildMatrixReactionContent(messageId, emoji);
		await resolved.sendEvent(resolvedRoom, EventType.Reaction, reaction);
	});
}
//#endregion
export { resolvePollReferenceEventId as C, resolveMatrixRoomId as E, parsePollStartContent as S, reconcileMatrixUnknownSend as T, formatPollAsText as _, sendSingleTextMessageMatrix as a, isPollStartType as b, formatMatrixMediaTooLargeText as c, isLikelyBareFilename as d, resolveMatrixMessageAttachment as f, buildPollResultsSummary as g, buildPollResponseContent as h, sendPollMatrix as i, formatMatrixMediaUnavailableText as l, prepareMatrixSingleText as m, reactMatrixMessage as n, sendTypingMatrix as o, resolveMatrixReplacementContent as p, sendMessageMatrix as r, send_exports as s, editMessageMatrix as t, formatMatrixMessageText as u, formatPollResultsAsText as v, cleanupMatrixDeliveryPlans as w, parsePollStart as x, isPollEventType as y };
