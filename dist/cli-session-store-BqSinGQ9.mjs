import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { r as formatErrorMessageForDisplay } from "./error-diagnostics-Cgksm9ND.mjs";
import { i as clearCliSession, l as setCliSessionBinding, n as assertCliSessionBindingResultCommitAllowed, t as applyCliSessionBindingResult } from "./cli-session-CBCjrsL6.mjs";
import { i as hasCommittedCliFinalReply, t as appendAgentRunFailure } from "./agent-run-result-C69jhuXu.mjs";
//#region src/agents/cli-session-store.ts
async function patchCliSessionBindingInStore(params) {
	const { sessionKey, storePath } = params;
	if (!sessionKey || !storePath) return;
	const expected = { ...params.expectedSession };
	let committed;
	await patchSessionEntryCore({
		agentId: params.agentId,
		sessionKey,
		storePath
	}, (entry) => {
		if (entry.sessionId !== expected.sessionId || entry.lifecycleRevision !== expected.lifecycleRevision || entry.activeWriterRunId !== expected.activeWriterRunId) return null;
		const next = { ...entry };
		if (!params.update(next)) return null;
		return {
			cliSessionIds: next.cliSessionIds,
			cliSessionBindings: next.cliSessionBindings,
			claudeCliSessionId: next.claudeCliSessionId
		};
	}, {
		fallbackEntry: params.fallbackEntry,
		...sessionEntryCommitGuardOptions(params.assertCommitAllowed),
		preserveActivity: params.preserveActivity,
		skipMaintenance: params.skipMaintenance,
		onCommitted: (entry) => {
			committed = entry;
			params.onCommitted?.();
			if (params.sessionStore) params.sessionStore[sessionKey] = entry;
		}
	});
	return committed;
}
async function patchCliSessionForkBinding(params, updateBinding) {
	const { provider, sessionKey, sessionStore, expectedCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry || entry.cliSessionBindings?.[provider]?.sessionId !== expectedCliSessionId) return;
	return await patchCliSessionBindingInStore({
		...params,
		expectedSession: entry,
		update: (current) => {
			const binding = current.cliSessionBindings?.[provider];
			if (binding?.sessionId !== expectedCliSessionId) return false;
			const nextBinding = updateBinding(binding);
			if (!nextBinding) return false;
			setCliSessionBinding(current, provider, nextBinding);
			return true;
		}
	});
}
/** Clears the one-shot fork marker before the resumed CLI process starts. */
async function consumeCliSessionForkInStore(params) {
	return await patchCliSessionForkBinding(params, (binding) => {
		if (binding.forkNextResume !== true) return;
		const { forkNextResume: _forkNextResume, ...consumedBinding } = binding;
		return consumedBinding;
	});
}
/** Arms a fork marker for recovery, or re-arms one after a failed CLI turn. */
async function restoreCliSessionForkInStore(params) {
	return await patchCliSessionForkBinding(params, (binding) => binding.forkNextResume === true ? void 0 : {
		...binding,
		forkNextResume: true
	});
}
/** Share fork publication and cancellation rules across command and live reply callers. */
function buildCliSessionForkRunParams(params, onEntryPatched) {
	const activeParams = {
		...params,
		assertCommitAllowed: composeSessionSourceAssertion([params.assertCommitAllowed], (assertSource) => {
			assertSource();
			params.abortSignal?.throwIfAborted();
		})
	};
	return {
		claimCliSessionFork: async () => {
			const claimed = await consumeCliSessionForkInStore(activeParams);
			if (claimed) onEntryPatched(claimed);
			return Boolean(claimed);
		},
		restoreCliSessionFork: async () => {
			const restored = await restoreCliSessionForkInStore(params);
			if (restored) onEntryPatched(restored);
		},
		persistCliSessionForkSuccessor: async (successorCliSessionId) => {
			const persisted = await persistCliSessionForkSuccessorInStore({
				...activeParams,
				successorCliSessionId
			});
			if (!persisted) throw new Error("CLI session fork successor could not be persisted");
			onEntryPatched(persisted);
		}
	};
}
/** Rebinds a claimed fork without bypassing its retained account/environment checks. */
async function persistCliSessionForkSuccessorInStore(params) {
	if (params.successorCliSessionId === params.expectedCliSessionId) return;
	return await patchCliSessionForkBinding(params, (binding) => binding.forkNextResume === true ? void 0 : {
		...binding,
		sessionId: params.successorCliSessionId
	});
}
/** A rejected continuity write cannot erase completed effects or reopen model fallback. */
async function settleCliSessionResult(result, settle) {
	try {
		await settle();
		return result;
	} catch (error) {
		if (hasCommittedCliFinalReply(result)) {
			createSubsystemLogger("agents/cli-runner").warn(`CLI session continuity could not be saved after final reply commit: ${formatErrorMessageForDisplay(error)}`);
			return result;
		}
		const detail = redactSensitiveText(formatErrorMessageForDisplay(error), { mode: "tools" });
		const diagnostic = truncateUtf16Safe(`CLI session continuity could not be saved: ${detail}`, 1024);
		return appendAgentRunFailure(result, diagnostic);
	}
}
/** Publish native continuity before the placement owner releases its session lane. */
async function persistCliSessionBindingResult(params) {
	const expectedSession = params.expectedSession;
	if (!expectedSession) return params.result;
	return await settleCliSessionResult(params.result, async () => {
		await patchCliSessionBindingInStore({
			...params,
			expectedSession,
			preserveActivity: true,
			skipMaintenance: true,
			update: (entry) => {
				const meta = params.result.meta.agentMeta;
				if (!params.preserveBinding) return applyCliSessionBindingResult(entry, params.provider, meta);
				const binding = getCliSessionBinding(entry, params.provider);
				const resultBinding = meta?.cliSessionBinding;
				const transcriptCursor = resultBinding?.transcriptCursor;
				if (meta?.clearCliSessionBinding === true || !binding || binding.sessionId !== resultBinding?.sessionId || !transcriptCursor) return false;
				setCliSessionBinding(entry, params.provider, {
					...binding,
					transcriptCursor
				});
				return true;
			},
			assertCommitAllowed: composeSessionSourceAssertion([params.assertSettlementCurrent], (assertSource) => assertCliSessionBindingResultCommitAllowed(params.result.meta.agentMeta, assertSource, params.abortSignal))
		});
	});
}
/**
* A directly stopped first turn has no settled result, but its flushed native session is
* the chat's only continuity. The turn owner still guards the write; caller abort does not,
* and an existing binding is never replaced.
*/
async function persistStoppedFirstCliSessionInStore(params) {
	if (!params.expectedSession || getCliSessionBinding(params.expectedSession, params.provider)) return;
	await patchCliSessionBindingInStore({
		...params,
		expectedSession: params.expectedSession,
		preserveActivity: true,
		skipMaintenance: true,
		assertCommitAllowed: params.assertSettlementCurrent,
		update: (entry) => {
			if (getCliSessionBinding(entry, params.provider)) return false;
			setCliSessionBinding(entry, params.provider, params.binding);
			return true;
		}
	});
}
/** Clears a failed/invalid native binding; a turn owner supplies its exact commit guard. */
async function clearCliSessionInStore(params) {
	const entry = params.activeSessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (!entry) return;
	const clearEntry = (current) => {
		if (!current || params.expectedCliSessionId && getCliSessionBinding(current, params.provider)?.sessionId !== params.expectedCliSessionId) return false;
		clearCliSession(current, params.provider);
		current.updatedAt = Date.now();
		return true;
	};
	const clearCachedEntries = () => {
		clearEntry(params.activeSessionEntry);
		clearEntry(params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	};
	if (!params.sessionKey || !params.storePath) {
		params.assertCommitAllowed?.();
		clearCachedEntries();
		return;
	}
	return await patchCliSessionBindingInStore({
		...params,
		expectedSession: {
			...entry,
			sessionId: params.expectedSessionId ?? entry.sessionId
		},
		fallbackEntry: params.expectedSessionId ? void 0 : entry,
		update: clearEntry,
		onCommitted: clearCachedEntries
	});
}
//#endregion
export { restoreCliSessionForkInStore as a, persistStoppedFirstCliSessionInStore as i, clearCliSessionInStore as n, settleCliSessionResult as o, persistCliSessionBindingResult as r, buildCliSessionForkRunParams as t };
