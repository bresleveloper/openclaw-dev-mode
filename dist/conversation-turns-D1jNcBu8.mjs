import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import crypto from "node:crypto";
//#region src/sessions/conversation-turns.ts
const pendingTurns = resolveGlobalSingleton(Symbol.for("openclaw.pendingConversationTurns"), () => /* @__PURE__ */ new Map(), (turns) => {
	for (const pending of turns.values()) pending.settle(void 0);
});
const pendingTurnsByOutboundId = resolveGlobalSingleton(Symbol.for("openclaw.pendingConversationTurnsByOutboundId"), () => /* @__PURE__ */ new Map(), (turns) => turns.clear());
function pendingTurnKey(agentId, id) {
	return JSON.stringify([agentId, id]);
}
function outboundMessageKey(agentId, outboundMessageId) {
	return JSON.stringify([agentId, outboundMessageId]);
}
function removePendingOutboundMembership(pending) {
	if (!pending.outboundMessageId) return;
	const key = outboundMessageKey(pending.agentId, pending.outboundMessageId);
	const bucket = pendingTurnsByOutboundId.get(key);
	bucket?.delete(pending);
	if (bucket?.size === 0) pendingTurnsByOutboundId.delete(key);
}
/** Registers one process-local waiter; transcript correlation remains durable after completion. */
function registerPendingConversationTurn(params) {
	const agentId = normalizeOptionalString(params.agentId);
	if (!agentId) throw new Error("conversation turn requires an agent id");
	const id = normalizeOptionalString(params.id) ?? crypto.randomUUID();
	const key = pendingTurnKey(agentId, id);
	if (pendingTurns.has(key)) throw new Error(`conversation turn already pending for ${agentId}: ${id}`);
	const createdAt = Date.now();
	const timeoutMs = Math.max(0, params.timeoutMs);
	let settled = false;
	let resolvePromise = () => void 0;
	const promise = new Promise((resolve) => {
		resolvePromise = resolve;
	});
	let resolveCorrelationReady = () => void 0;
	const correlationReady = new Promise((resolve) => {
		resolveCorrelationReady = resolve;
	});
	let correlationReadySettled = false;
	const markCorrelationReady = () => {
		if (correlationReadySettled) return;
		correlationReadySettled = true;
		resolveCorrelationReady();
	};
	let timer;
	const stopTimeout = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const settle = (reply) => {
		if (settled) return;
		settled = true;
		markCorrelationReady();
		removePendingOutboundMembership(pending);
		if (pendingTurns.get(key) === pending) pendingTurns.delete(key);
		stopTimeout();
		params.signal?.removeEventListener("abort", cancel);
		resolvePromise(reply);
	};
	const cancel = () => settle(void 0);
	const pending = {
		key,
		agentId,
		id,
		conversationRef: params.conversationRef,
		sessionId: params.sessionId,
		threadId: normalizeOptionalString(params.threadId),
		createdAt,
		correlationReady,
		markCorrelationReady,
		claimed: false,
		settle
	};
	pendingTurns.set(key, pending);
	timer = setTimeout(cancel, timeoutMs);
	timer.unref?.();
	params.signal?.addEventListener("abort", cancel, { once: true });
	if (params.signal?.aborted) cancel();
	return {
		id,
		setOutboundMessageId: (messageId) => {
			if (pendingTurns.get(key) !== pending) return;
			removePendingOutboundMembership(pending);
			pending.outboundMessageId = normalizeOptionalString(messageId);
			if (!pending.outboundMessageId) {
				pending.settle(void 0);
				return;
			}
			const outboundKey = outboundMessageKey(pending.agentId, pending.outboundMessageId);
			const bucket = pendingTurnsByOutboundId.get(outboundKey) ?? /* @__PURE__ */ new Set();
			bucket.add(pending);
			pendingTurnsByOutboundId.set(outboundKey, bucket);
		},
		markReady: () => {
			if (pendingTurns.get(key) !== pending) return;
			if (pending.outboundMessageId) pending.markCorrelationReady();
			else pending.settle(void 0);
		},
		wait: async () => await promise,
		cancel
	};
}
/** Cancels one Gateway-owned turn so a late reply follows ordinary inbound dispatch. */
function cancelPendingConversationTurn(params) {
	const agentId = normalizeOptionalString(params.agentId);
	const id = normalizeOptionalString(params.id);
	const pending = agentId && id ? pendingTurns.get(pendingTurnKey(agentId, id)) : void 0;
	if (!pending) return false;
	pending.settle(void 0);
	return true;
}
/** Claims a correlated inbound reply so the waiting turn can consume it without a second agent run. */
async function claimPendingConversationTurnReply(params) {
	const replyToId = normalizeOptionalString(params.replyToId);
	if (!replyToId) return;
	const threadId = normalizeOptionalString(params.threadId);
	const parentConversationRef = normalizeOptionalString(params.parentConversationRef);
	const agentId = normalizeOptionalString(params.agentId);
	if (!agentId) return;
	let pending;
	const candidates = pendingTurnsByOutboundId.get(outboundMessageKey(agentId, replyToId));
	for (const candidate of candidates ?? []) {
		if (candidate.claimed || candidate.agentId !== agentId || candidate.outboundMessageId !== replyToId || candidate.conversationRef !== params.conversationRef && (candidate.threadId || threadId !== replyToId || parentConversationRef !== candidate.conversationRef) || candidate.sessionId !== params.sessionId || candidate.threadId && threadId && candidate.threadId !== threadId) continue;
		if (!pending || candidate.createdAt < pending.createdAt) pending = candidate;
	}
	if (!pending) return;
	pending.claimed = true;
	await pending.correlationReady;
	if (pendingTurns.get(pending.key) !== pending) return;
	let active = true;
	const isCurrent = () => active && pendingTurns.get(pending.key) === pending && pending.claimed;
	const reply = {
		conversationRef: params.conversationRef,
		messageId: params.messageId,
		...replyToId ? { replyToId } : {},
		...threadId ? { threadId } : {},
		text: params.text,
		timestamp: params.timestamp ?? Date.now()
	};
	return {
		turnId: pending.id,
		sessionId: pending.sessionId,
		assertCurrent: () => {
			if (!isCurrent()) throw new Error("conversation turn reply claim is no longer active");
		},
		complete: (completion = {}) => {
			if (!isCurrent()) return;
			active = false;
			pending.settle({
				...reply,
				...completion.transcriptArtifactId ? { transcriptArtifactId: completion.transcriptArtifactId } : {},
				...completion.transcriptMessageId ? { transcriptMessageId: completion.transcriptMessageId } : {}
			});
		},
		release: () => {
			if (!isCurrent()) return;
			active = false;
			pending.claimed = false;
		}
	};
}
//#endregion
export { claimPendingConversationTurnReply as n, registerPendingConversationTurn as r, cancelPendingConversationTurn as t };
