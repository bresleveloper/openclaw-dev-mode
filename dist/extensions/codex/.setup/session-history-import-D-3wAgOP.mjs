import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { r as importCodexThreadHistoryToTranscript } from "./transcript-mirror-BtHDBp1G.mjs";
import { n as prepareCodexSessionInitialization } from "./session-initialization-rcgbZiid.mjs";
import { resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
//#region extensions/codex/src/app-server/session-history-import.ts
/** Creates a session whose transcript is derived from one verified Codex thread snapshot. */
async function createImportedCodexSession(params) {
	const spawnedCwd = params.thread.cwd?.trim() || void 0;
	const createParams = {
		cfg: params.config,
		key: params.key,
		agentId: params.agentId,
		...params.displayName !== void 0 ? { displayName: params.displayName } : {},
		...spawnedCwd ? { spawnedCwd } : {},
		initialEntry: params.initialEntry,
		afterCreate: async (entry) => {
			if (!entry.initialization) throw new Error("Codex history initialization requires host creation authority");
			const initialization = prepareCodexSessionInitialization({
				initialization: entry.initialization,
				bindingStore: params.bindingStore,
				identity: sessionBindingIdentity({
					agentId: entry.agentId,
					sessionId: entry.sessionId,
					sessionKey: entry.key,
					config: params.config
				}),
				prepareCleanup: params.prepareCleanup
			});
			const storePath = resolveStorePath(params.config.session?.store, { agentId: entry.agentId });
			await importCodexThreadHistoryToTranscript({
				assertCurrent: entry.initialization.assertCurrent,
				thread: params.thread,
				throughTurnId: params.throughTurnId,
				storePath,
				sessionId: entry.sessionId,
				sessionKey: entry.key,
				agentId: entry.agentId,
				...spawnedCwd ? { cwd: spawnedCwd } : {},
				modelProvider: params.thread.modelProvider,
				config: params.config
			});
			entry.initialization.assertCurrent();
			return await params.afterImport(entry, initialization);
		}
	};
	return params.recoverMatchingInitialEntry ? await params.runtime.agent.session.createSessionEntry({
		...createParams,
		recoverMatchingInitialEntry: true
	}) : await params.runtime.agent.session.createSessionEntry(createParams);
}
//#endregion
export { createImportedCodexSession };
