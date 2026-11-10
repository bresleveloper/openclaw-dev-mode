import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as computeBackoff } from "./src-Bzfi3cQM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./backoff-N5Hi0doU.mjs";
import "./agent-limits-CB2bq0ey.mjs";
import { n as isTerminalSessionStatus } from "./types-BGDhC4_W.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./config-B3oiWDlr.mjs";
import { x as applySessionEntryExactReplacements } from "./session-accessor.entry-mutation-DgCGNicZ.mjs";
import { r as resolveSubagentChildAgentId } from "./subagent-child-owner-match-Dwr-9sla.mjs";
import { S as compareSubagentRunGeneration, d as getDeliveryLastError, k as isSameSubagentRunOwner, u as ensureDeliveryState } from "./subagent-session-read-scope-7jPlY84h.mjs";
import { h as subagentRuns, s as getSubagentRunsForChildSession } from "./subagent-registry-memory-DE7WJHOr.mjs";
import "./subagent-lifecycle-events-BcwmGJZ8.mjs";
import { f as resolveSubagentSessionStatus, l as getSubagentSessionRuntimeMs, u as getSubagentSessionStartedAt } from "./subagent-run-liveness-DPrFEcUI.mjs";
import { n as isCanonicalSubagentRunRecord } from "./subagent-registry.store.codec-D57MwX5M.mjs";
import { n as resolveSessionRunError, t as recordGatewaySessionRunFailure } from "./session-run-error-GbrkFe1D.mjs";
import { n as resolveSubagentSessionAttachmentRootDir } from "./subagent-attachment-paths-B8kPlxpj.mjs";
import { n as scheduleSessionDelivery } from "./session-delivery-queue-runtime-Di93zudM.mjs";
import { c as runSubagentRegistryWorkerWrite, n as SubagentRegistryMutationRejectedError, o as mutateSubagentRuns, t as SubagentRegistryCommitReceiptError } from "./subagent-registry-persistence-DE7WA4wN.mjs";
import { f as sameRequesterSettleRunIdentity, r as captureRequesterSettleWakeProgress } from "./subagent-requester-settle-identity-BXTgIS3Y.mjs";
import { r as retiredCancellationEndedAt } from "./subagent-completion-mutation.kernel-xxmbtVKz.mjs";
import { n as resolveCompletionFromSessionEntry, s as resolveSubagentChildSessionOwner } from "./subagent-session-reconciliation-DBq1r5kk.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/subagents/completion/subagent-completion-admission.store.ts
const log = createSubsystemLogger("subagents/completion");
var SubagentCompletionSourceChangedError = class extends SubagentRegistryMutationRejectedError {};
function parseAcknowledgedRecord(value) {
	if (!isRecord(value) || !isCanonicalSubagentRunRecord(value.subagent) || typeof value.subagent.runId !== "string" || !value.subagent.runId || typeof value.subagent.childSessionKey !== "string" || !value.subagent.childSessionKey || typeof value.subagent.requesterSessionKey !== "string" || !value.subagent.requesterSessionKey || value.cleanupHandled !== void 0 && typeof value.cleanupHandled !== "boolean") throw new Error("Subagent completion acknowledgment has an invalid native record");
	return {
		subagent: value.subagent,
		cleanupHandled: value.cleanupHandled
	};
}
function parseAdmissionReceipt(value, writeId, runId) {
	if (!isRecord(value) || value.writeId !== writeId || typeof value.claimed !== "boolean" || typeof value.status !== "string") throw new Error("Subagent completion acknowledgment does not identify its write");
	const record = parseAcknowledgedRecord(value.record);
	if (record.subagent.runId !== runId) throw new Error("Subagent completion acknowledged another native owner");
	return {
		writeId,
		claimed: value.claimed,
		status: value.status,
		record
	};
}
function parseMutationReceipt(value, writeId, runIds) {
	if (!isRecord(value) || value.writeId !== writeId || typeof value.applied !== "boolean" && value.applied !== null || !Array.isArray(value.records) || !Array.isArray(value.retiredRunIds) || !Array.isArray(value.queueIds) || !value.retiredRunIds.every((id) => typeof id === "string" && runIds.includes(id)) || !value.queueIds.every((id) => typeof id === "string")) throw new Error("Subagent completion mutation acknowledgment does not identify its write");
	const queueIds = value.queueIds;
	const queueReceipts = (Array.isArray(value.queueReceipts) ? value.queueReceipts : []).map((receipt) => {
		if (!isRecord(receipt) || typeof receipt.id !== "string" || !queueIds.includes(receipt.id)) throw new Error("Subagent completion acknowledged another queue intent");
		if (receipt.status === "completed" || receipt.status === "failed") return {
			id: receipt.id,
			status: receipt.status
		};
		if (receipt.status !== "pending" || typeof receipt.enqueuedAt !== "number" || !Number.isFinite(receipt.enqueuedAt) || typeof receipt.payloadJson !== "string") throw new Error("Subagent completion acknowledged an invalid pending queue intent");
		return {
			id: receipt.id,
			status: "pending",
			enqueuedAt: receipt.enqueuedAt,
			payloadJson: receipt.payloadJson
		};
	});
	if (queueReceipts.length !== value.queueIds.length || new Set(queueReceipts.map(({ id }) => id)).size !== queueReceipts.length) throw new Error("Subagent completion acknowledged incomplete queue intents");
	const records = value.records.map((record) => {
		const acknowledged = parseAcknowledgedRecord(record);
		if (!runIds.includes(acknowledged.subagent.runId)) throw new Error("Subagent completion acknowledged another native owner");
		return acknowledged;
	});
	return {
		writeId,
		applied: value.applied,
		records,
		retiredRunIds: value.retiredRunIds,
		queueIds: value.queueIds,
		...queueReceipts.length > 0 ? { queueReceipts } : {}
	};
}
function hasNewerGeneration(current) {
	return [...getSubagentRunsForChildSession(current.childSessionKey, current.childAgentId)].some((candidate) => compareSubagentRunGeneration(candidate, current) > 0);
}
async function admitSubagentCompletionDelivery(params) {
	const expected = subagentRuns.get(params.runId);
	if (!expected) throw new SubagentCompletionSourceChangedError("Subagent completion owner is unavailable");
	return mutateSubagentRuns([params.runId], (rows) => {
		const current = currentCompletionOwner(rows, expected);
		if (hasNewerGeneration(current)) throw new SubagentCompletionSourceChangedError("Subagent completion source was replaced");
		const prepared = params.plan(current);
		return {
			value: {
				id: prepared.queueEntry.id,
				claimed: false,
				status: "pending",
				subagent: current
			},
			expected: current,
			...prepared
		};
	}, {
		context: params.context,
		assertCurrent() {
			params.assertCurrent();
			if (!isSameSubagentRunOwner(subagentRuns.get(expected.runId), expected)) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before admission");
		},
		async commit(planned, authority) {
			const input = structuredClone({
				writeId: randomUUID(),
				expected: planned.expected,
				subagent: planned.subagent,
				queueEntry: planned.queueEntry
			});
			const receipt = await runSubagentRegistryWorkerWrite(params.context, () => ({
				kind: "completion",
				writeId: input.writeId,
				assertCurrent: authority.assertCurrent,
				execute: (scope) => scope.execute({
					type: "sessionDelivery.admitSubagentCompletion",
					input
				}),
				decode: (value) => parseAdmissionReceipt(value, input.writeId, params.runId)
			}));
			const subagent = {
				...receipt.record.subagent,
				cleanupHandled: planned.expected.cleanupHandled
			};
			return {
				value: {
					id: planned.queueEntry.id,
					claimed: receipt.claimed,
					status: receipt.status,
					subagent
				},
				postimages: /* @__PURE__ */ new Map([[params.runId, subagent]])
			};
		}
	});
}
function currentCompletionOwner(rows, expected) {
	const current = rows.get(expected.runId);
	if (!current || !isSameSubagentRunOwner(current, expected) || !sameRequesterSettleRunIdentity(current, expected) || current.execution.lifecycleGeneration !== expected.execution.lifecycleGeneration || !isDeepStrictEqual(current.childSessionIdentity, expected.childSessionIdentity) || !isDeepStrictEqual(current.killIntent, expected.killIntent) || current.killReconciliation?.killedAt !== expected.killReconciliation?.killedAt || Boolean(current.killReconciliation?.taskCancellationAccepted) !== Boolean(expected.killReconciliation?.taskCancellationAccepted) || Boolean(current.killReconciliation?.suppressTaskDelivery) !== Boolean(expected.killReconciliation?.suppressTaskDelivery) || current.killReconciliation?.supersededAt !== expected.killReconciliation?.supersededAt || current.endedReason === "subagent-killed" !== (expected.endedReason === "subagent-killed") || current.terminalOwner !== expected.terminalOwner || current.suppressAnnounceReason !== expected.suppressAnnounceReason) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before mutation");
	return current;
}
async function mutateCompletion(entries, plan, options = {}) {
	const runIds = entries.map((entry) => entry.runId);
	const context = options.context ?? captureOpenClawStateWorkerContext({
		path: options.databaseOptions?.database?.path ?? options.databaseOptions?.path,
		env: options.databaseOptions?.env
	});
	const result = await mutateSubagentRuns(runIds, (rows) => {
		return {
			value: {
				applied: null,
				queueIds: []
			},
			mutation: plan(rows)
		};
	}, {
		context,
		assertCurrent() {
			options.assertCurrent?.();
			for (const expected of entries) {
				const current = subagentRuns.get(expected.runId);
				if (current && !isSameSubagentRunOwner(current, expected)) throw new SubagentCompletionSourceChangedError("Subagent completion owner changed before mutation");
			}
		},
		onPublished(_postimages, value) {
			if (value.receiptRetentionFailure) throw value.receiptRetentionFailure.error;
			options.onPublished?.();
		},
		async commit(planned, authority) {
			const input = structuredClone({
				writeId: randomUUID(),
				mutation: planned.mutation
			});
			const receipt = await runSubagentRegistryWorkerWrite(context, () => ({
				kind: "completion",
				writeId: input.writeId,
				assertCurrent: authority.assertCurrent,
				execute: (scope) => scope.execute({
					type: "sessionDelivery.mutateSubagentCompletion",
					input
				}),
				decode: (value) => parseMutationReceipt(value, input.writeId, runIds)
			}));
			const postimages = /* @__PURE__ */ new Map();
			for (const runId of receipt.retiredRunIds) postimages.set(runId, null);
			for (const { subagent, cleanupHandled } of receipt.records) postimages.set(subagent.runId, {
				...subagent,
				cleanupHandled
			});
			if (receipt.applied === true && postimages.size !== runIds.length) throw new SubagentRegistryCommitReceiptError(/* @__PURE__ */ new Error("Subagent completion acknowledged an incomplete native publication"));
			let receiptRetentionFailure;
			try {
				options.onCommitted?.(receipt, planned.mutation);
			} catch (error) {
				receiptRetentionFailure = { error };
			}
			return {
				value: {
					applied: receipt.applied,
					queueIds: receipt.queueIds,
					receiptRetentionFailure
				},
				postimages
			};
		}
	});
	for (const id of result.queueIds) try {
		await scheduleSessionDelivery(id, context);
	} catch (error) {
		log.warn("Subagent completion remains queued after scheduling failed", {
			queueId: id,
			error
		});
	}
	return {
		applied: result.applied,
		publication: result.applied === true ? "published" : "unchanged"
	};
}
async function settleSubagentCompletionDelivery(params) {
	await mutateCompletion([params.subagent], (rows) => {
		const current = currentCompletionOwner(rows, params.subagent);
		if (current.delivery?.generation !== params.subagent.delivery?.generation) throw new SubagentCompletionSourceChangedError("Subagent completion delivery generation changed");
		const subagent = structuredClone(current);
		const delivery = ensureDeliveryState(subagent);
		if (delivery.status !== "delivered" || delivery.queueId !== void 0) {
			const now = Date.now();
			Object.assign(delivery, {
				status: "delivered",
				disposition: "delivered",
				deliveredAt: now,
				announcedAt: now,
				lastError: void 0,
				nextAttemptAt: void 0,
				queueId: void 0,
				payload: void 0
			});
		}
		return {
			kind: "settle",
			queueId: params.queueId,
			expected: current,
			subagent
		};
	}, params);
}
async function blockSubagentCompletionDelivery(params) {
	const { context: _context, databaseOptions: _databaseOptions, assertCurrent: _assertCurrent, ...request } = params;
	if (params.storeReplaced) {
		const current = currentCompletionOwner(subagentRuns, params.subagent);
		subagentRuns.retireCompletionAuthority(current);
	}
	return (await mutateCompletion([params.subagent], (rows) => {
		const current = currentCompletionOwner(rows, params.subagent);
		if ((current.delivery?.generation ?? 1) !== (params.subagent.delivery?.generation ?? 1)) throw new SubagentCompletionSourceChangedError("Subagent completion delivery generation changed");
		return {
			kind: "block",
			params: {
				...request,
				subagent: current
			},
			now: Date.now()
		};
	}, params)).applied === true;
}
async function reconcileRetiredSubagentCancellation(expected, now) {
	const endedAt = retiredCancellationEndedAt(expected, now);
	if (endedAt === void 0 || !expected.killReconciliation) return;
	try {
		return (await mutateCompletion([expected], (rows) => {
			const current = currentCompletionOwner(rows, expected);
			if (retiredCancellationEndedAt(current, now) !== endedAt || hasNewerGeneration(current)) throw new SubagentCompletionSourceChangedError("Subagent completion source was replaced");
			return {
				kind: "reconcileCancelled",
				expected: current,
				now
			};
		})).applied ?? void 0;
	} catch (error) {
		if (error instanceof SubagentCompletionSourceChangedError) return false;
		throw error;
	}
}
function currentRequesterEntries(rows, entries, committed) {
	return entries.map((expected) => {
		if (!rows.has(expected.runId) && committed?.result.retiredRunIds.includes(expected.runId)) return { subagent: expected };
		const current = currentCompletionOwner(rows, expected);
		if (!committed && (current.delivery?.generation !== expected.delivery?.generation || !isDeepStrictEqual(captureRequesterSettleWakeProgress(current), captureRequesterSettleWakeProgress(expected)))) throw new SubagentCompletionSourceChangedError("Subagent requester wake cohort changed before mutation");
		return { subagent: current };
	});
}
/** The wake episode retains this receipt until its current host owner can adopt it. */
async function mutateRequesterCompletionBatch(params) {
	return mutateCompletion(params.entries, (rows) => {
		const cohort = {
			entries: currentRequesterEntries(rows, params.entries, params.committed),
			committed: params.committed
		};
		return params.operation.kind === "settle" ? {
			...cohort,
			kind: "requesterBatch",
			outcome: params.operation.outcome,
			now: Date.now()
		} : {
			...cohort,
			kind: "requesterWake",
			operation: params.operation
		};
	}, {
		...params,
		onCommitted(result, mutation) {
			if (!params.committed && (mutation.kind === "requesterBatch" || mutation.kind === "requesterWake")) params.onCommitted?.({
				entries: mutation.entries,
				result
			});
		}
	});
}
//#endregion
//#region src/agents/subagents/subagent-attachment-cleanup.ts
/** Removes host-owned subagent attachment artifacts by generated identity. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function removeSubagentAttachmentTree(rootDir, attachmentId, assertBeforeMutation) {
	if (!UUID_RE.test(attachmentId)) throw new Error("invalid subagent attachment identity");
	assertBeforeMutation?.();
	try {
		await (await root(rootDir)).remove(attachmentId, {
			recursive: true,
			force: true,
			...assertBeforeMutation ? { assertBeforeMutation } : {}
		});
	} catch (error) {
		if (!(error instanceof FsSafeError && error.code === "not-found")) throw error;
	}
}
async function cleanupMaterializedSubagentAttachments(params) {
	const agentId = resolveSubagentChildAgentId(params);
	if (!agentId) throw new Error("Subagent attachment owner is unresolved; attachments remain retained.");
	const rootDir = resolveSubagentSessionAttachmentRootDir({
		agentId,
		childSessionKey: params.childSessionKey
	});
	const isCurrent = params.isCurrent;
	await removeSubagentAttachmentTree(rootDir, params.attachmentId, isCurrent ? () => {
		if (!isCurrent()) throw new Error("subagent attachment cleanup owner is no longer current");
	} : void 0);
}
//#endregion
//#region src/agents/subagents/registry/subagent-registry-helpers.ts
const PROVISIONAL_KILL_RECONCILIATION_MS = 3e5;
const MIN_ANNOUNCE_RETRY_DELAY_MS = 15e3;
const MAX_ANNOUNCE_RETRY_DELAY_MS = 3e5;
const ANNOUNCE_RETRY_JITTER = .2;
const ANNOUNCE_EXPIRY_MS = 3e5;
const ANNOUNCE_COMPLETION_HARD_EXPIRY_MS = 18e5;
const ANNOUNCE_RETRY_BACKOFF = {
	initialMs: MIN_ANNOUNCE_RETRY_DELAY_MS,
	maxMs: MAX_ANNOUNCE_RETRY_DELAY_MS,
	factor: 2,
	jitter: ANNOUNCE_RETRY_JITTER
};
const FROZEN_RESULT_TEXT_MAX_BYTES = 102400;
function capFrozenResultText(resultText) {
	const trimmed = resultText.trim();
	const totalBytes = Buffer.byteLength(trimmed, "utf8");
	if (totalBytes <= FROZEN_RESULT_TEXT_MAX_BYTES) return trimmed;
	const notice = `\n\n[truncated: frozen completion output exceeded ${Math.round(FROZEN_RESULT_TEXT_MAX_BYTES / 1024)}KB (${Math.round(totalBytes / 1024)}KB)]`;
	const maxPayloadBytes = Math.max(0, FROZEN_RESULT_TEXT_MAX_BYTES - Buffer.byteLength(notice, "utf8"));
	return `${truncateUtf8Prefix(trimmed, maxPayloadBytes)}${notice}`;
}
function resolveAnnounceRetryDelayMs(retryCount) {
	return computeBackoff(ANNOUNCE_RETRY_BACKOFF, Math.max(1, retryCount));
}
function formatAnnounceGiveUpLogField(value) {
	const normalized = value.replace(/\s+/g, " ").trim();
	return JSON.stringify(normalized.length > 2e3 ? `${truncateUtf16Safe(normalized, 2e3)}…` : normalized);
}
function logAnnounceGiveUp(entry, reason) {
	const retryCount = entry.delivery?.attemptCount ?? 0;
	const endedAt = entry.execution.endedAt;
	const endedAgoMs = typeof endedAt === "number" ? Math.max(0, Date.now() - endedAt) : void 0;
	const endedAgoLabel = endedAgoMs != null ? `${Math.round(endedAgoMs / 1e3)}s` : "n/a";
	const lastDeliveryError = getDeliveryLastError(entry);
	const deliveryError = lastDeliveryError ? ` deliveryError=${formatAnnounceGiveUpLogField(lastDeliveryError)}` : "";
	defaultRuntime.log(`[warn] Subagent announce give up (${reason}) run=${entry.runId} child=${entry.childSessionKey} requester=${entry.requesterSessionKey} retries=${retryCount} endedAgo=${endedAgoLabel}${deliveryError}`);
}
async function persistSubagentSessionTiming(entry, options) {
	const childSessionKey = entry.childSessionKey?.trim();
	if (!childSessionKey || options?.isCurrentGeneration?.() === false) return;
	const cfg = readRuntimeConfig();
	const { agentId, storePath: configuredStorePath } = resolveSubagentChildSessionOwner(entry, cfg);
	const storePath = options?.sessionEntryCurrent?.source.path ?? options?.session?.storePath ?? options?.settledQueuedCancellation?.storePath ?? configuredStorePath;
	const refused = /* @__PURE__ */ new Error("Subagent timing owner changed before commit");
	const assertGenerationCurrent = () => {
		if (options?.isCurrentGeneration?.() === false) throw refused;
		options?.assertCommitAllowed?.();
	};
	const startedAt = getSubagentSessionStartedAt(entry);
	const endedAt = asFiniteNumber(entry.execution.endedAt);
	const runtimeMs = getSubagentSessionRuntimeMs(entry, endedAt);
	const projectedStatus = resolveSubagentSessionStatus(entry);
	const status = isTerminalSessionStatus(projectedStatus) ? projectedStatus : void 0;
	const lastRunError = status === "interrupted" ? "Run interrupted by a Gateway restart." : status ? resolveSessionRunError(entry.execution.outcome ?? {}, status) : void 0;
	const update = (sessionEntry) => {
		const settled = options?.settledQueuedCancellation;
		if (settled && (entry.collect !== true || entry.execution.status !== "terminal" || entry.execution.startedAt !== void 0 || sessionEntry.startedAt !== void 0 || entry.endedReason !== "subagent-killed" || !entry.killReconciliation || storePath !== settled.storePath || sessionEntry.sessionId !== settled.sessionId || sessionEntry.lifecycleRevision !== settled.lifecycleRevision || sessionEntry.activeWriterRunId !== void 0 || sessionEntry.lifecycleRunId !== void 0 || sessionEntry.lastRunId !== void 0 && sessionEntry.lastRunId !== (entry.swarmRunId ?? entry.runId))) return null;
		if (status === "killed") {
			const existingCompletion = resolveCompletionFromSessionEntry(sessionEntry, Date.now(), { notBeforeMs: entry.execution.startedAt ?? entry.createdAt });
			if (existingCompletion && existingCompletion.reason !== "subagent-killed") {
				if (sessionEntry.abortedLastRun !== true) return null;
				const completedEntry = { ...sessionEntry };
				delete completedEntry.abortedLastRun;
				return completedEntry;
			}
		}
		const next = { ...sessionEntry };
		if (settled) next.lastRunId = entry.swarmRunId ?? entry.runId;
		for (const [key, value] of [
			["startedAt", startedAt],
			["endedAt", endedAt],
			["runtimeMs", runtimeMs]
		]) if (typeof value === "number" && Number.isFinite(value)) next[key] = value;
		else delete next[key];
		next.status = status;
		if (lastRunError) next.lastRunError = lastRunError;
		else if (status === "done") delete next.lastRunError;
		if (status === "interrupted") next.abortedLastRun = true;
		else if (status && status !== "killed") delete next.abortedLastRun;
		return next;
	};
	const persist = async (expected, assertSessionCurrent) => {
		let selected;
		let suppressed = false;
		const assertCurrent = () => {
			assertGenerationCurrent();
			assertSessionCurrent?.();
			if (selected) try {
				if (options?.sessionEntryCurrent) options.sessionEntryCurrent.assertCurrent(selected);
				else options?.assertCurrentEntry?.(selected);
			} catch (error) {
				suppressed = true;
				throw error;
			}
		};
		const persisted = await applySessionEntryExactReplacements({
			agentId,
			storePath,
			sessionKeys: [childSessionKey],
			activeSessionKey: childSessionKey,
			requireWriteSuccess: true,
			skipMaintenance: true,
			assertCommitAllowed: assertCurrent,
			update: ([row]) => {
				if (!row || options?.isCurrentGeneration?.() === false || expected && (row.entry.sessionId !== expected.sessionId || row.entry.lifecycleRevision !== expected.lifecycleRevision)) return { result: void 0 };
				selected = row.entry;
				assertCurrent();
				const next = update(selected);
				return {
					result: next ?? selected,
					...next ? { replacements: [{
						sessionKey: row.sessionKey,
						entry: next
					}] } : {}
				};
			}
		}).catch((error) => {
			if (hasSqliteWorkerOutcomeUnknown(error) || !suppressed) throw error;
		});
		if (persisted && lastRunError && status !== "interrupted") await recordGatewaySessionRunFailure({
			target: {
				agentId,
				storePath,
				sessionKey: childSessionKey,
				sessionId: persisted.sessionId,
				expectedLifecycleRevision: persisted.lifecycleRevision
			},
			runId: entry.runId,
			error: entry.execution.outcome?.error,
			assertCommitAllowed: assertCurrent,
			sessionEntryCurrent: options?.sessionEntryCurrent
		});
	};
	try {
		if (options?.session) {
			options.session.assertCurrent();
			if (options.session.entry) await persist(options.session.entry, options.session.assertCurrent);
			return;
		}
		if (options?.sessionEntryCurrent) {
			await persist(void 0);
			return;
		}
		await withSessionEntryReadOnlyInWorker({
			storePath,
			sessionKey: childSessionKey,
			agentId
		}, assertGenerationCurrent, async (read, owner) => {
			if (!read.ok) throw read.error;
			if (read.value) await persist(read.value, owner.assertCurrent);
		});
	} catch (error) {
		if (error !== refused) throw error;
	}
}
/** Kept sessions may retain their attachments; every other cleanup removes them with the run. */
function shouldRemoveSubagentAttachments(entry, cleanup = entry.cleanup) {
	return cleanup === "delete" || !entry.retainAttachmentsOnKeep;
}
async function safeRemoveAttachmentsDir(entry, isCurrent) {
	if (!entry.attachmentId) return true;
	try {
		await cleanupMaterializedSubagentAttachments({
			childSessionKey: entry.childSessionKey,
			childAgentId: entry.childAgentId,
			attachmentId: entry.attachmentId,
			isCurrent
		});
		return true;
	} catch (error) {
		defaultRuntime.log(`[warn] Subagent attachment cleanup failed (${entry.runId}): ${String(error)}`);
		return false;
	}
}
function resolveArchiveAfterMs(cfg) {
	const minutes = (cfg ?? readRuntimeConfig()).agents?.defaults?.subagents?.archiveAfterMinutes ?? 60;
	if (!Number.isFinite(minutes) || minutes <= 0) return;
	return Math.max(1, Math.floor(minutes)) * 6e4;
}
/** Arms retention only after the run or its waitable collector result has completed. */
function updateSubagentArchiveAtMs(entry, cfg) {
	const endedAt = asFiniteNumber(entry.execution.endedAt);
	const completedAt = entry.collect ? endedAt === void 0 && !entry.collectorCompletion ? void 0 : typeof entry.completion?.capturedAt === "number" && Number.isFinite(entry.completion.capturedAt) ? entry.completion.capturedAt : endedAt : entry.cleanup === "delete" && entry.pauseReason !== "sessions_yield" ? entry.delivery?.discardReason === "task-missing" ? entry.delivery.discardedAt ?? endedAt : endedAt : void 0;
	const archiveAfterMs = entry.spawnMode === "session" || completedAt === void 0 ? void 0 : resolveArchiveAfterMs(cfg);
	const expectedArchiveAt = completedAt !== void 0 && archiveAfterMs !== void 0 ? completedAt + archiveAfterMs : void 0;
	if (entry.archiveAtMs === expectedArchiveAt) return false;
	if (expectedArchiveAt === void 0) delete entry.archiveAtMs;
	else entry.archiveAtMs = expectedArchiveAt;
	return true;
}
//#endregion
export { mutateRequesterCompletionBatch as _, capFrozenResultText as a, resolveAnnounceRetryDelayMs as c, updateSubagentArchiveAtMs as d, cleanupMaterializedSubagentAttachments as f, blockSubagentCompletionDelivery as g, admitSubagentCompletionDelivery as h, PROVISIONAL_KILL_RECONCILIATION_MS as i, safeRemoveAttachmentsDir as l, SubagentCompletionSourceChangedError as m, ANNOUNCE_EXPIRY_MS as n, logAnnounceGiveUp as o, removeSubagentAttachmentTree as p, MIN_ANNOUNCE_RETRY_DELAY_MS as r, persistSubagentSessionTiming as s, ANNOUNCE_COMPLETION_HARD_EXPIRY_MS as t, shouldRemoveSubagentAttachments as u, reconcileRetiredSubagentCancellation as v, settleSubagentCompletionDelivery as y };
