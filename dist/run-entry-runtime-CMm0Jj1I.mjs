import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { t as isCliProvider } from "./model-selection-cli-DjULziH2.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B4sEclNg.mjs";
import { a as readSessionEntryInWorker, u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { s as createAgentRunSupersededAbortError } from "./run-termination-DGv2EKii.mjs";
import "./cli-session-B9R5wqcb.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-vpBZ53qC.mjs";
import { r as persistCliSessionBindingResult } from "./cli-session-store-DzH7uOVD.mjs";
//#region src/agents/embedded-agent-runner/run-entry-cli.ts
/** Acquire native continuity after placement admission and settle it before releasing the turn. */
function withAdmittedCliCandidate(params, run) {
	return withLocalSessionPlacementTurnSettlement(params.claim, async (assertSettlementCurrent) => {
		const target = params.sessionTarget;
		const sessionEntry = target ? params.readMode === "writable" ? await readSessionEntryInWorker({
			...target,
			readConsistency: "latest"
		}, assertSettlementCurrent) : await withSessionEntryReadOnlyInWorker(target, assertSettlementCurrent, async (read) => {
			if (!read.ok) throw read.error;
			return read.value;
		}) : params.getSessionEntry();
		assertSettlementCurrent();
		if (target && (sessionEntry?.sessionId !== target.sessionId || sessionEntry.lifecycleRevision !== params.expectedLifecycleRevision)) throw createAgentRunSupersededAbortError();
		return run({
			sessionEntry,
			cliSessionBinding: getCliSessionBinding(sessionEntry, params.provider),
			assertSettlementCurrent,
			settleResult: async ({ result, expectedSession, sessionStore, preserveBinding }) => {
				const classification = params.classifyResult?.(result);
				if (preserveBinding || classification && result.meta.agentMeta?.clearCliSessionBinding !== true) return result;
				return persistCliSessionBindingResult({
					agentId: params.claim.agentId,
					provider: params.provider,
					sessionKey: target?.sessionKey,
					storePath: target?.storePath,
					result,
					expectedSession,
					sessionStore,
					assertSettlementCurrent,
					abortSignal: params.admission?.abortSignal
				});
			}
		});
	}, params.admission);
}
//#endregion
//#region src/agents/embedded-agent-runner/run-entry-runtime.ts
/** Select a candidate's CLI route without reinterpreting a locked harness as a backend. */
function resolveRunEntryCliRuntime(params) {
	const runtime = params.sessionRuntimeOverride;
	const pinnedCliRuntime = runtime && runtime !== params.pinnedHarnessId && isCliProvider(runtime, params.config) ? runtime : void 0;
	const cliExecutionProvider = pinnedCliRuntime ?? (runtime ? params.provider : resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.config,
		agentId: params.agentId,
		modelId: params.model,
		authProfileId: params.authProfileId
	}) ?? params.provider);
	return {
		cliExecutionProvider,
		useCliExecution: runtime ? pinnedCliRuntime !== void 0 : isCliProvider(cliExecutionProvider, params.config)
	};
}
//#endregion
export { withAdmittedCliCandidate as n, resolveRunEntryCliRuntime as t };
