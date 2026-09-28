import { m as sessionBindingIdentity } from "./session-binding-record-BGoz8wOK.mjs";
import { v as CatalogParamsError } from "./session-catalog-native-projection-DowriLid.mjs";
import { t as assertCodexArchiveDescendantsUnowned } from "./thread-archive-guard-C9frICzX.mjs";
import "./session-binding-Cm0apEbd.mjs";
import { runSessionActionExclusive } from "./session-catalog-node-adoption-ITddWx_X.mjs";
import { isAdoptionSessionKeyForThread, requireIdleThread } from "./session-catalog-adoption-BI6UTDZT.mjs";
import { listAgentIds } from "openclaw/plugin-sdk/agent-scope-runtime";
import { sessionCatalogAdoptedSourceKey } from "openclaw/plugin-sdk/session-catalog";
//#region extensions/codex/src/session-catalog-archive.ts
function assertNoPendingSupervisionBranch(params) {
	const adoptedEntries = [params.agentId, ...listAgentIds(params.config).filter((agentId) => agentId !== params.agentId)].flatMap((agentId) => params.runtime.agent.session.listSessionEntries({
		agentId,
		readOnly: true
	})).filter((candidate) => isAdoptionSessionKeyForThread(candidate.sessionKey, params.threadId, params.sourceHomeId) || params.sourceHomeId !== void 0 && params.allowLegacy === true && isAdoptionSessionKeyForThread(candidate.sessionKey, params.threadId));
	for (const adopted of adoptedEntries) {
		if (adopted.entry.initializationPending === true) throw new CatalogParamsError("Codex session cannot be archived while its OpenClaw branch is initializing");
		const sessionId = adopted.entry.sessionId?.trim();
		if (!sessionId) continue;
		const binding = params.bindingStore.read(sessionBindingIdentity({
			sessionId,
			sessionKey: adopted.sessionKey,
			config: params.config
		}));
		if (binding?.connectionScope === "supervision" && binding.supervisionSourceThreadId === params.threadId && binding.pendingSupervisionBranch?.sourceThreadId === params.threadId) throw new CatalogParamsError("Codex session cannot be archived until its OpenClaw branch starts");
	}
}
/** Archives one inactive Gateway-local Codex thread after a fresh status read. */
async function archiveLocalCodexSession(params) {
	return await runSessionActionExclusive(sessionCatalogAdoptedSourceKey(params.hostId ?? "gateway:local", params.threadId), async () => {
		return await params.bindingStore.withThreadArchiveFence(async () => {
			const run = async (control) => {
				assertNoPendingSupervisionBranch(params);
				await control.requireEligibleThread(params.threadId);
				const thread = await control.readThread(params.threadId, false);
				if (thread.id !== params.threadId) throw new Error("Codex app-server returned a different thread than requested");
				requireIdleThread(thread, "archive");
				if (await params.bindingStore.hasOtherThreadOwner(params.threadId)) throw new CatalogParamsError("Codex session cannot be archived while it is attached to an OpenClaw session");
				await assertCodexArchiveDescendantsUnowned({
					bindingStore: params.bindingStore,
					threadId: params.threadId,
					listPage: (request) => control.listDescendantPage(request),
					assertDescendantIdle: async (descendantThreadId) => {
						const descendant = await control.readThread(descendantThreadId, false);
						if (descendant.id !== descendantThreadId) throw new Error("Codex app-server returned a different descendant than requested");
						requireIdleThread(descendant, "archive");
					}
				});
				await control.archiveThread(params.threadId);
				return { archived: true };
			};
			return await params.control.withPinnedConnection(run);
		});
	});
}
//#endregion
export { archiveLocalCodexSession };
