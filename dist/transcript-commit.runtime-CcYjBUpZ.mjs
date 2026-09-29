import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { s as resolveTerminalAssistantTranscriptRunId, t as attachSessionTranscriptRunId } from "./transcript-events-DukKauix.mjs";
import { p as withTranscriptWriteTransaction } from "./session-accessor.sqlite-transcript-write-Bk_2EeDT.mjs";
import { t as redactTranscriptMessage } from "./transcript-redact-CcOcbRyc.mjs";
import { g as replaceSessionEntrySync, s as loadSessionEntry } from "./session-accessor.sqlite-entry-BB2Zsfho.mjs";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DdmXgBkg.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import { o as prepareWorkerTurnTranscriptMessage } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { t as resolveWorkerSessionTarget } from "./session-target-B6cm2OUn.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/transcript-commit.runtime.ts
const WORKER_TRANSCRIPT_SESSION_CONFLICT = /* @__PURE__ */ new Error("worker transcript session changed");
function requestHash(request) {
	return createHash("sha256").update(stableStringify({
		baseLeafId: request.baseLeafId,
		messages: request.messages
	})).digest("hex");
}
function messageIdempotencyKey(params) {
	return `worker-commit-${createHash("sha256").update([
		params.sessionId,
		params.runEpoch,
		params.seq,
		params.index
	].join("\0")).digest("base64url")}`;
}
function readMessageIdempotencyKey(message) {
	if (!isRecord(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isCommittedAgentMessage(message) {
	if (!isRecord(message)) return false;
	const role = message.role;
	return (role === "user" || role === "assistant" || role === "toolResult") && readMessageIdempotencyKey(message) !== void 0;
}
function resolveActiveCommitPrefix(params) {
	const activeBranch = params.manager.getBranch();
	const activeVisibleEntryCount = activeBranch.filter((entry) => entry.type === "message" || entry.type === "compaction").length;
	if (params.manager.getLeafId() === params.baseLeafId) return {
		activeVisibleEntryCount,
		ok: true,
		recoveredMessages: []
	};
	const baseIndex = params.baseLeafId === null ? -1 : activeBranch.findIndex((entry) => entry.id === params.baseLeafId);
	if (params.baseLeafId !== null && baseIndex < 0) return { ok: false };
	const activeSuffix = activeBranch.slice(baseIndex + 1);
	if (activeSuffix.length === 0) return { ok: false };
	const recoveredMessages = [];
	for (const [index, entry] of activeSuffix.slice(0, params.messages.length).entries()) {
		const expectedKey = readMessageIdempotencyKey(params.messages[index]);
		if (entry.type !== "message" || !expectedKey || !isCommittedAgentMessage(entry.message) || readMessageIdempotencyKey(entry.message) !== expectedKey) return { ok: false };
		recoveredMessages.push({
			appended: false,
			message: entry.message,
			messageId: entry.id
		});
	}
	return {
		activeVisibleEntryCount,
		ok: true,
		recoveredMessages
	};
}
function resolvePersistedCommitAcrossDag(params) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const entry of params.manager.getEntries()) {
		const children = childrenByParent.get(entry.parentId) ?? [];
		children.push(entry);
		childrenByParent.set(entry.parentId, children);
	}
	const completedPaths = [];
	const visit = (parentId, messageIndex, path) => {
		if (completedPaths.length > 1) return;
		if (messageIndex === params.messages.length) {
			completedPaths.push(path);
			return;
		}
		const expectedKey = readMessageIdempotencyKey(params.messages[messageIndex]);
		if (!expectedKey) return;
		for (const entry of childrenByParent.get(parentId) ?? []) {
			if (entry.type !== "message" || !isCommittedAgentMessage(entry.message) || readMessageIdempotencyKey(entry.message) !== expectedKey) continue;
			visit(entry.id, messageIndex + 1, [...path, {
				appended: false,
				message: entry.message,
				messageId: entry.id
			}]);
		}
	};
	visit(params.baseLeafId, 0, []);
	if (completedPaths.length > 1) return { kind: "ambiguous" };
	const messages = completedPaths[0];
	return messages ? {
		kind: "found",
		messages
	} : { kind: "missing" };
}
async function applyWorkerTranscriptCommit(params) {
	const redactedMessages = params.messages.map((message) => attachSessionTranscriptRunId(redactTranscriptMessage(message, params.config), params.runId));
	const expectedState = {
		sessionId: params.sessionId,
		lifecycleRevision: params.target.sessionEntry.lifecycleRevision
	};
	let applied;
	try {
		applied = await withTranscriptWriteTransaction(params.target, (transcriptTarget) => {
			params.assertCurrent();
			const currentEntry = loadSessionEntry(params.target);
			if (!currentEntry || currentEntry.sessionId !== expectedState.sessionId) return {
				ok: false,
				reason: "session-not-attached"
			};
			if (currentEntry.lifecycleRevision !== expectedState.lifecycleRevision) return {
				ok: false,
				reason: "invalid-batch"
			};
			const manager = SessionManager.open(transcriptTarget);
			if (params.recoverPersistedBatch) {
				const recovered = resolvePersistedCommitAcrossDag({
					baseLeafId: params.requestedBaseLeafId,
					manager,
					messages: params.messages
				});
				if (recovered.kind === "found") return {
					ok: true,
					messages: recovered.messages
				};
				if (recovered.kind === "ambiguous") return {
					ok: false,
					reason: "invalid-batch"
				};
			}
			const prefix = resolveActiveCommitPrefix({
				baseLeafId: params.requestedBaseLeafId,
				manager,
				messages: params.messages
			});
			if (!prefix.ok) return {
				ok: false,
				reason: "stale-base-leaf"
			};
			const freshMessages = redactedMessages.slice(prefix.recoveredMessages.length);
			if (!freshMessages.every(isCommittedAgentMessage)) return {
				ok: false,
				reason: "invalid-batch"
			};
			const messages = [...prefix.recoveredMessages];
			let nextMessageSeq = prefix.activeVisibleEntryCount;
			for (const message of freshMessages) {
				if (message.role === "assistant") Object.assign(message, prepareWorkerTurnTranscriptMessage(params.identity, message));
				const messageId = manager.appendMessage(message, {
					config: params.config,
					idempotencyLookup: "caller-checked"
				});
				nextMessageSeq += 1;
				messages.push({
					appended: true,
					message,
					messageId,
					messageSeq: nextMessageSeq
				});
			}
			const freshEntry = loadSessionEntry(params.target);
			if (!freshEntry || freshEntry.sessionId !== expectedState.sessionId || freshEntry.lifecycleRevision !== expectedState.lifecycleRevision) throw WORKER_TRANSCRIPT_SESSION_CONFLICT;
			const appendedCount = messages.filter((message) => message.appended).length;
			const nextEntry = {
				...freshEntry,
				...appendedCount > 0 ? { updatedAt: Math.max(freshEntry.updatedAt ?? 0, Date.now()) } : {}
			};
			replaceSessionEntrySync(params.target, nextEntry);
			params.assertCurrent();
			return {
				ok: true,
				messages
			};
		});
	} catch (error) {
		if (error === WORKER_TRANSCRIPT_SESSION_CONFLICT) return {
			ok: false,
			reason: "invalid-batch"
		};
		throw error;
	}
	if (!applied.ok) return applied;
	for (const message of applied.messages) {
		if (!message.appended) continue;
		const runId = resolveTerminalAssistantTranscriptRunId(message.message, params.runId);
		await publishTranscriptUpdate(params.target, {
			lifecycleRevision: expectedState.lifecycleRevision,
			message: message.message,
			messageId: message.messageId,
			messageSeq: message.messageSeq,
			...runId ? { runId } : {}
		});
	}
	return applied;
}
async function commitWorkerTranscript(options, store, sessionId, params) {
	const input = {
		environmentId: params.identity.environmentId,
		sessionId,
		runEpoch: params.request.runEpoch,
		seq: params.request.seq,
		requestHash: requestHash(params.request)
	};
	params.assertCurrent();
	const started = store.begin(input);
	if (started.kind === "replay") return started.outcome;
	if (started.kind === "rejected") return {
		ok: false,
		reason: "invalid-batch"
	};
	const config = options.getConfig();
	const target = resolveWorkerSessionTarget(config, sessionId);
	if (!target) return store.complete({
		...input,
		outcome: {
			ok: false,
			reason: "session-not-attached"
		}
	});
	const messages = params.request.messages.map((message, index) => ({
		...structuredClone(message),
		idempotencyKey: messageIdempotencyKey({
			sessionId,
			runEpoch: params.request.runEpoch,
			seq: params.request.seq,
			index
		})
	}));
	let authorityFailure;
	let applied;
	try {
		applied = await applyWorkerTranscriptCommit({
			assertCurrent: () => {
				try {
					params.assertCurrent();
				} catch (error) {
					authorityFailure = { error };
					throw error;
				}
			},
			config,
			identity: params.identity,
			messages,
			recoverPersistedBatch: started.kind === "recover",
			requestedBaseLeafId: params.request.baseLeafId,
			runId: params.identity.runId,
			sessionId,
			target
		});
	} catch (error) {
		if (started.kind === "claimed" && authorityFailure && authorityFailure.error === error) store.discardUncommitted(input);
		throw error;
	}
	if (!applied.ok) return store.complete({
		...input,
		outcome: {
			ok: false,
			reason: applied.reason
		}
	});
	const entryIds = applied.messages.map((message) => message.messageId);
	const newLeafId = entryIds.at(-1);
	if (entryIds.length !== params.request.messages.length || !newLeafId) return store.complete({
		...input,
		outcome: {
			ok: false,
			reason: "invalid-batch"
		}
	});
	return store.complete({
		...input,
		outcome: {
			ok: true,
			result: {
				entryIds,
				newLeafId
			}
		}
	});
}
//#endregion
export { commitWorkerTranscript };
