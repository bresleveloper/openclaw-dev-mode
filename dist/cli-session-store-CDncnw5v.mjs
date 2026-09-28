import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { r as formatErrorMessageForDisplay } from "./error-diagnostics-805LTf-V.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as clearCliSession, n as assertCliSessionBindingResultCommitAllowed, t as applyCliSessionBindingResult } from "./cli-session-CeXeyPue.mjs";
import { n as appendAgentRunFailure } from "./agent-run-result-ecnMVuqT.mjs";
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
		assertCommitAllowed: params.assertCommitAllowed,
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
/** A rejected continuity write cannot erase completed effects or reopen model fallback. */
async function settleCliSessionResult(result, settle) {
	try {
		await settle();
		return result;
	} catch (error) {
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
			update: (entry) => applyCliSessionBindingResult(entry, params.provider, params.result.meta.agentMeta),
			assertCommitAllowed: () => assertCliSessionBindingResultCommitAllowed(params.result.meta.agentMeta, params.assertSettlementCurrent, params.abortSignal)
		});
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
export { persistCliSessionBindingResult as n, settleCliSessionResult as r, clearCliSessionInStore as t };
