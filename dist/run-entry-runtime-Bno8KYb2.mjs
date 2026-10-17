import { r as getCliSessionBinding } from "./cli-session-binding-CMk8AbZT.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B5N-I0ib.mjs";
import { a as readSessionEntryInWorker, u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-B3Aup1sL.mjs";
import { s as createAgentRunSupersededAbortError } from "./run-termination-DGv2EKii.mjs";
import "./cli-session-BGS0cWwl.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-BtajgBsg.mjs";
import { r as persistCliSessionBindingResult } from "./cli-session-store-CDlpTLDs.mjs";
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
