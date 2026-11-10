import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as appendSessionTranscriptReport, r as readLatestSessionTranscriptReport } from "./session-accessor-Czw4l8kI.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { t as boundedWorkerError } from "./worker-error-BrVatFit.mjs";
import { a as projectWorkspaceResultConflict, i as formatWorkspaceConflictSummary, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-CQVfTI04.mjs";
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(target, assertCurrent) {
	async function withWorkerTranscript(run, missingMessage) {
		assertCurrent();
		const lostSession = () => {
			if (missingMessage) throw new Error(`${missingMessage} lost session ${target.sessionId}`);
			return err("session-unavailable");
		};
		const result = await withSessionTranscriptWriteAssertion(target, assertCurrent, run);
		assertCurrent();
		return result.ok ? ok(result.value) : lostSession();
	}
	return {
		resolveConflict: async () => {
			const result = await withWorkerTranscript(() => readLatestSessionTranscriptReport(target, [WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE]));
			if (!result.ok) return {
				kind: "unknown",
				reason: result.error
			};
			const transcriptEntry = result.value;
			if (transcriptEntry?.customType !== "cloud-workspace-conflict") return { kind: "absent" };
			const details = transcriptEntry.details;
			if (Array.isArray(details?.paths) && details.paths.length > 0 && details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) && typeof details.stagedResultRef === "string" && (details.totalCount === void 0 || Number.isSafeInteger(details.totalCount) && details.totalCount >= details.paths.length) && /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return {
				kind: "conflict",
				conflict: projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount)
			};
			return {
				kind: "unknown",
				reason: "malformed-report"
			};
		},
		reportConflict: async (conflict) => {
			await withWorkerTranscript(() => appendSessionTranscriptReport(target, {
				kind: "custom",
				customTypes: [WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE],
				selectReport: (latestConflictEntry) => {
					if ("cleared" in conflict) {
						if (latestConflictEntry?.customType !== "cloud-workspace-conflict-cleared") return {
							customType: WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE,
							content: "A later cloud workspace result superseded the previous conflict.",
							display: false
						};
						return;
					}
					const projectedConflict = projectWorkspaceResultConflict(conflict.paths, conflict.stagedResultRef, conflict.totalCount);
					const details = latestConflictEntry?.details;
					if (!(latestConflictEntry?.customType === "cloud-workspace-conflict" && details?.stagedResultRef === projectedConflict.stagedResultRef && details.totalCount === projectedConflict.totalCount && Array.isArray(details.paths) && JSON.stringify(details.paths) === JSON.stringify(projectedConflict.paths))) return {
						customType: WORKSPACE_CONFLICT_TRANSCRIPT_TYPE,
						content: formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount),
						display: true,
						details: projectedConflict
					};
				}
			}), "Recovered cloud workspace conflict");
		},
		reportFailure: async (failure) => {
			await withWorkerTranscript(() => appendSessionTranscriptReport(target, {
				kind: "custom",
				customTypes: [WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE],
				selectReport: (latestRecovery) => {
					const error = boundedWorkerError(failure, 768);
					const content = `Cloud workspace recovery attempt failed: ${error}. OpenClaw preserved the result and will retry.`;
					if (latestRecovery?.content !== content) return {
						customType: WORKSPACE_RECOVERY_FAILURE_TRANSCRIPT_TYPE,
						content,
						display: true,
						details: { error }
					};
				}
			}), "Cloud workspace recovery");
		}
	};
}
//#endregion
export { createWorkerWorkspaceConflictTranscriptHandlers as t };
