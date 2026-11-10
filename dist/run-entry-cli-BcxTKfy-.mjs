import { s as createAgentRunSupersededAbortError } from "./run-termination-Dwf1ksjA.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { d as readSessionEntryInWorker, i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./cli-session-CBCjrsL6.mjs";
import { s as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-DV-Z5szH.mjs";
import { i as persistStoppedFirstCliSessionInStore, r as persistCliSessionBindingResult } from "./cli-session-store-BqSinGQ9.mjs";
//#region src/agents/embedded-agent-runner/run-entry-cli.ts
/** Acquire native continuity after placement admission and settle it before releasing the turn. */
function withAdmittedCliCandidate(params, run) {
	return withLocalSessionPlacementTurnSettlement(params.claim, async (assertSettlementCurrent) => {
		const target = params.sessionTarget;
		const sessionEntry = target ? params.readMode === "writable" ? await readSessionEntryInWorker({
			...target,
			readConsistency: "latest"
		}, assertSettlementCurrent) : await readSessionEntryReadOnlyInWorker(target, assertSettlementCurrent) : params.getSessionEntry();
		assertSettlementCurrent();
		if (target && (sessionEntry?.sessionId !== target.sessionId || sessionEntry.lifecycleRevision !== params.expectedLifecycleRevision)) throw createAgentRunSupersededAbortError();
		return run({
			sessionEntry,
			cliSessionBinding: getCliSessionBinding(sessionEntry, params.provider),
			assertSettlementCurrent,
			settleResult: async ({ result, expectedSession, sessionStore, preserveBinding }) => {
				if (params.classifyResult?.(result) && result.meta.agentMeta?.clearCliSessionBinding !== true) return result;
				return persistCliSessionBindingResult({
					agentId: params.claim.agentId,
					provider: params.provider,
					sessionKey: target?.sessionKey,
					storePath: target?.storePath,
					result,
					expectedSession,
					sessionStore,
					preserveBinding,
					assertSettlementCurrent,
					abortSignal: params.admission?.abortSignal
				});
			},
			persistStoppedFirstSession: ({ binding, expectedSession, sessionStore }) => persistStoppedFirstCliSessionInStore({
				agentId: params.claim.agentId,
				provider: params.provider,
				sessionKey: target?.sessionKey,
				storePath: target?.storePath,
				binding,
				expectedSession,
				sessionStore,
				assertSettlementCurrent
			})
		});
	}, params.admission);
}
//#endregion
export { withAdmittedCliCandidate as t };
