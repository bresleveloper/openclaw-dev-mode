import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { b as findSessionTranscriptHeader, v as assertCurrentSessionTranscriptHeader } from "./transcript-payload-Yc_w8Yx5.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { a as loadSessionEntry, f as replaceSessionEntrySync } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { s as readTranscriptContextVersionInTransaction } from "./session-accessor.sqlite-transcript-state-xJ1TJ9j2.mjs";
import { d as loadTranscriptReadSnapshotSync } from "./session-accessor.sqlite-read-D4vZepQN.mjs";
import { a as appendTranscriptMessageSnapshotSync } from "./session-accessor.sqlite-transcript-write-Kl-_Ewp0.mjs";
import { t as SessionManagerCore } from "./session-manager-core-AIc6XbHU.mjs";
//#region src/gateway/worker-environments/transcript-commit.kernel.ts
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
function prepareTranscriptCommit(input) {
	const entry = loadSessionEntry(input.scope);
	if (!entry || entry.sessionId !== input.scope.sessionId) return {
		result: {
			ok: false,
			reason: "session-not-attached"
		},
		parentId: null,
		nextMessageSeq: 0
	};
	if (input.lifecycleRevision !== void 0 && entry.lifecycleRevision !== input.lifecycleRevision) return {
		result: {
			ok: false,
			reason: "invalid-batch"
		},
		parentId: null,
		nextMessageSeq: 0
	};
	const snapshot = loadTranscriptReadSnapshotSync(input.scope);
	if (snapshot.events.length > 0) assertCurrentSessionTranscriptHeader(findSessionTranscriptHeader(snapshot.events));
	const manager = new SessionManagerCore(input.cwd, void 0, snapshot.events);
	const plan = (result, nextMessageSeq = 0) => ({
		result,
		version: snapshot.version,
		nextMessageSeq,
		parentId: manager.getAppendParentId()
	});
	if (input.recoverPersistedBatch) {
		const recovered = resolvePersistedCommitAcrossDag({
			baseLeafId: input.requestedBaseLeafId,
			manager,
			messages: input.messages
		});
		if (recovered.kind === "found") return plan({
			ok: true,
			messages: recovered.messages,
			lifecycleRevision: entry.lifecycleRevision
		});
		if (recovered.kind === "ambiguous") return plan({
			ok: false,
			reason: "invalid-batch"
		});
	}
	const prefix = resolveActiveCommitPrefix({
		baseLeafId: input.requestedBaseLeafId,
		manager,
		messages: input.messages
	});
	return prefix.ok ? plan({
		ok: true,
		messages: prefix.recoveredMessages,
		lifecycleRevision: entry.lifecycleRevision
	}, prefix.activeVisibleEntryCount) : plan({
		ok: false,
		reason: "stale-base-leaf"
	});
}
/** The caller owns one synchronous transaction around validation, append, and metadata. */
function applyPreparedTranscriptCommit(input, plan, freshMessages, onProjectionReconcileNeeded) {
	if (!plan.result.ok) return plan.result;
	const currentEntry = loadSessionEntry(input.scope);
	if (!currentEntry || currentEntry.sessionId !== input.scope.sessionId) return {
		ok: false,
		reason: "session-not-attached"
	};
	if (currentEntry.lifecycleRevision !== plan.result.lifecycleRevision) return {
		ok: false,
		reason: "invalid-batch"
	};
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptScope(input.scope)));
	const version = readTranscriptContextVersionInTransaction(database, input.scope.sessionId);
	if (!plan.version || version.generation !== plan.version.generation || version.rawSeq !== plan.version.rawSeq || version.updatedAt !== plan.version.updatedAt) return {
		ok: false,
		reason: "stale-base-leaf"
	};
	if (plan.result.messages.length === input.messages.length) return plan.result;
	const recoveredCount = plan.result.messages.length;
	if (freshMessages.length !== input.messages.length - recoveredCount || !freshMessages.every((message, index) => isCommittedAgentMessage(message) && readMessageIdempotencyKey(message) === readMessageIdempotencyKey(input.messages[recoveredCount + index]))) return {
		ok: false,
		reason: "invalid-batch"
	};
	const messages = [...plan.result.messages];
	let parentId = plan.parentId;
	let nextMessageSeq = plan.nextMessageSeq;
	for (const message of freshMessages) {
		const snapshot = appendTranscriptMessageSnapshotSync(input.scope, {
			message,
			cwd: input.cwd,
			parentId,
			appendIntent: "active-branch",
			idempotencyLookup: "caller-checked"
		}, void 0, {
			messageAlreadyRedacted: true,
			scheduleProjectionReconcile: false,
			onProjectionReconcileNeeded
		});
		if (!snapshot.ok || !snapshot.value.result?.appended) throw new Error("Worker transcript message was not persisted", { cause: snapshot.ok ? void 0 : snapshot.error });
		const result = snapshot.value.result;
		parentId = result.messageId;
		nextMessageSeq += 1;
		messages.push({
			appended: true,
			message: result.message,
			messageId: result.messageId,
			messageSeq: nextMessageSeq
		});
	}
	const entry = loadSessionEntry(input.scope);
	if (!entry || entry.sessionId !== input.scope.sessionId || entry.lifecycleRevision !== plan.result.lifecycleRevision) throw new Error("Worker transcript session changed inside its transaction");
	replaceSessionEntrySync(input.scope, {
		...entry,
		updatedAt: Math.max(entry.updatedAt ?? 0, Date.now())
	});
	return {
		...plan.result,
		messages
	};
}
//#endregion
export { isCommittedAgentMessage as n, prepareTranscriptCommit as r, applyPreparedTranscriptCommit as t };
