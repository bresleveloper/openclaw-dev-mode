import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { asOptionalRecord, readStringField } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
//#region extensions/codex/src/app-server/native-subagent-history-owner.ts
const nonBlankString = z.string().refine((value) => Boolean(value.trim()));
const codexNativeSubagentHistoryOwnerSchema = z.object({
	parentThreadId: nonBlankString,
	sessionId: nonBlankString,
	lifecycleRevision: nonBlankString.optional(),
	connectionFingerprint: z.string().regex(/^[a-f0-9]{64}$/u)
});
/** Automatic recovery may follow native rotation only within the same host lifecycle and connection. */
function matchesCodexNativeSubagentHistoryOwner(stored, current) {
	return stored.connectionFingerprint === current.connectionFingerprint && stored.lifecycleRevision === current.lifecycleRevision && (stored.lifecycleRevision !== void 0 || stored.sessionId === current.sessionId);
}
function codexNativeSubagentHistoryConnectionFingerprint(binding) {
	if (!binding.appServerRuntimeFingerprint) return;
	return createHash("sha256").update(JSON.stringify([
		binding.appServerRuntimeFingerprint,
		binding.connectionScope ?? null,
		binding.authProfileId ?? null
	])).digest("hex");
}
function createCodexNativeSubagentHistoryOwner(params) {
	const connectionFingerprint = codexNativeSubagentHistoryConnectionFingerprint(params.binding);
	return connectionFingerprint ? {
		parentThreadId: params.parentThreadId,
		sessionId: params.sessionId,
		...params.lifecycleRevision ? { lifecycleRevision: params.lifecycleRevision } : {},
		connectionFingerprint
	} : void 0;
}
function readCodexNativeSubagentHistoryOwner(detail) {
	const value = asOptionalRecord(detail)?.nativeHistory;
	if (value === void 0) return;
	const owner = codexNativeSubagentHistoryOwnerSchema.safeParse(value);
	if (!owner.success) throw new Error("Subagent history owner is invalid.");
	const { lifecycleRevision, ...required } = owner.data;
	return lifecycleRevision === void 0 ? required : {
		...required,
		lifecycleRevision
	};
}
function assertHistoryOwnerMatchesRegistration(saved, current, parentThreadId, requireSaved = false) {
	if (requireSaved && !saved) throw new Error("Subagent completion history owner is missing.");
	if (saved && (!current || saved.parentThreadId !== parentThreadId || saved.connectionFingerprint !== current.connectionFingerprint || saved.sessionId !== current.sessionId || saved.lifecycleRevision !== current.lifecycleRevision)) throw new Error("Subagent completion history owner is contradictory.");
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-assignment.ts
const CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX = "codex-thread:";
/** Initial assignments use the thread locator; follow-ups belong to a native turn. */
function codexNativeSubagentRunId(threadId, turnId) {
	return `${CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX}${threadId.trim()}${turnId ? `:turn:${turnId}` : ""}`;
}
function readCodexNativeSubagentRunId(runId) {
	if (!runId?.startsWith(CODEX_NATIVE_SUBAGENT_RUN_ID_PREFIX)) return;
	const [threadId, turnId] = runId.slice(13).split(":turn:");
	return threadId?.trim() ? {
		threadId,
		...turnId ? { turnId } : {}
	} : void 0;
}
function readNativeSubagentThreadIds(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readThreadParentThreadId(thread) {
	return readStringField(thread, "parentThreadId")?.trim() ?? readStringField(readThreadSpawnSource(thread), "parent_thread_id")?.trim();
}
function readThreadSpawnSource(thread) {
	const source = isJsonObject(thread?.source) ? thread.source : void 0;
	const subAgent = isJsonObject(source?.subAgent) ? source.subAgent : void 0;
	return isJsonObject(subAgent?.thread_spawn) ? subAgent.thread_spawn : void 0;
}
function normalizeIdentifier(value) {
	return value?.replace(/[^a-z0-9]/giu, "").toLowerCase();
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-submission.ts
const identifier$1 = z.string().refine((value) => Boolean(value.trim()));
const submissionSchema = z.object({
	parentTurnId: identifier$1,
	callId: identifier$1,
	childThreadId: identifier$1,
	submissionId: identifier$1,
	predecessorRunId: identifier$1,
	predecessorNativeTurnId: identifier$1
}).strict();
const submissionsSchema = z.object({
	version: z.literal(1),
	owner: codexNativeSubagentHistoryOwnerSchema,
	receipts: z.array(submissionSchema)
}).strict().refine(({ receipts }) => new Set(receipts.map(({ parentTurnId, callId }) => JSON.stringify([parentTurnId, callId]))).size === receipts.length);
function matchesCodexNativeSubagentSubmissionOwner(stored, current) {
	return stored.parentThreadId === current.parentThreadId && matchesCodexNativeSubagentHistoryOwner(stored, current);
}
function readCodexNativeSubagentSubmissions(value) {
	if (value === void 0) return;
	const parsed = submissionsSchema.safeParse(value);
	if (!parsed.success) throw new Error("Invalid Codex native subagent submission metadata.");
	return parsed.data;
}
function mutateCodexNativeSubagentSubmissions(params) {
	const current = readCodexNativeSubagentSubmissions(params.current);
	const owner = codexNativeSubagentHistoryOwnerSchema.parse(params.owner);
	const receipt = submissionSchema.parse(params.receipt);
	if (current && !matchesCodexNativeSubagentSubmissionOwner(current.owner, owner)) return { applied: false };
	const receipts = current?.receipts ?? [];
	const existing = receipts.find((entry) => entry.parentTurnId === receipt.parentTurnId && entry.callId === receipt.callId);
	if (existing && !isDeepStrictEqual(existing, receipt)) return { applied: false };
	if (params.consume) {
		if (!current) return { applied: false };
		const remaining = receipts.filter((entry) => entry !== existing);
		return {
			applied: true,
			...remaining.length ? { next: {
				version: 1,
				owner: current.owner,
				receipts: remaining
			} } : {}
		};
	}
	return {
		applied: true,
		next: {
			version: 1,
			owner: current?.owner ?? owner,
			receipts: existing ? receipts : [...receipts, receipt]
		}
	};
}
/** Physical adoption cannot establish continuity for an unstamped receipt. */
function adoptCodexNativeSubagentSubmissions(value) {
	if (value === void 0) return;
	const parsed = submissionsSchema.safeParse(value);
	return !parsed.success || parsed.data.owner.lifecycleRevision ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/native-subagent-pending-assignments.ts
const identifier = z.string().trim().min(1);
const assignmentSchema = z.object({
	runId: identifier,
	childThreadId: identifier,
	nativeTurnId: identifier.optional(),
	nativeParentThreadId: identifier,
	owner: codexNativeSubagentHistoryOwnerSchema,
	submission: submissionSchema.optional(),
	recordedCompletion: z.object({
		childThreadId: identifier,
		status: z.enum([
			"succeeded",
			"failed",
			"cancelled"
		]),
		statusLabel: z.literal("recorded_task_result"),
		result: z.string().min(1),
		completedAt: z.number().finite().optional()
	}).strict().optional()
}).strict().refine((entry) => !entry.recordedCompletion || entry.recordedCompletion.childThreadId === entry.childThreadId).refine((entry) => !entry.submission || entry.submission.childThreadId === entry.childThreadId && entry.nativeTurnId === entry.submission.submissionId && entry.runId === codexNativeSubagentRunId(entry.childThreadId, entry.submission.submissionId)).refine((entry) => entry.runId === codexNativeSubagentRunId(entry.childThreadId) || entry.nativeTurnId !== void 0 && readCodexNativeSubagentRunId(entry.runId)?.threadId === entry.childThreadId);
const inventorySchema = z.object({
	version: z.literal(1),
	assignments: z.array(assignmentSchema)
}).strict().refine(({ assignments }) => new Set(assignments.map((entry) => entry.runId)).size === assignments.length);
/** Native parent rotation is not physical requester or connection adoption. */
function matchesNativeAssignmentLifecycle(saved, current) {
	return saved.sessionId === current.sessionId && saved.lifecycleRevision === current.lifecycleRevision && saved.connectionFingerprint === current.connectionFingerprint;
}
function readNativePendingAssignments(value) {
	if (value === void 0) return;
	const parsed = inventorySchema.safeParse(value);
	if (!parsed.success) throw new Error("Invalid Codex native pending assignment metadata.");
	return parsed.data;
}
function mutateNativePendingAssignments(params) {
	const current = readNativePendingAssignments(params.current);
	const assignment = assignmentSchema.parse(params.assignment);
	const owner = codexNativeSubagentHistoryOwnerSchema.parse(params.owner);
	if (!matchesNativeAssignmentLifecycle(assignment.owner, owner)) return { applied: false };
	const assignments = current?.assignments ?? [];
	const existing = assignments.find((entry) => entry.runId === assignment.runId);
	if (existing && (!isDeepStrictEqual(existing.owner, assignment.owner) || existing.nativeParentThreadId !== assignment.nativeParentThreadId || existing.childThreadId !== assignment.childThreadId)) return { applied: false };
	if (params.consume && (!existing || existing.nativeTurnId !== assignment.nativeTurnId)) return { applied: false };
	const remaining = assignments.filter((entry) => entry !== existing);
	if (!params.consume) remaining.push(existing?.recordedCompletion && !assignment.recordedCompletion ? {
		...assignment,
		recordedCompletion: existing.recordedCompletion
	} : assignment);
	return {
		applied: true,
		next: remaining.length ? {
			version: 1,
			assignments: remaining
		} : void 0
	};
}
//#endregion
export { readCodexNativeSubagentHistoryOwner as _, matchesCodexNativeSubagentSubmissionOwner as a, codexNativeSubagentRunId as c, readNativeSubagentThreadIds as d, readThreadParentThreadId as f, createCodexNativeSubagentHistoryOwner as g, codexNativeSubagentHistoryConnectionFingerprint as h, adoptCodexNativeSubagentSubmissions as i, normalizeIdentifier as l, assertHistoryOwnerMatchesRegistration as m, mutateNativePendingAssignments as n, mutateCodexNativeSubagentSubmissions as o, readThreadSpawnSource as p, readNativePendingAssignments as r, readCodexNativeSubagentSubmissions as s, matchesNativeAssignmentLifecycle as t, readCodexNativeSubagentRunId as u };
