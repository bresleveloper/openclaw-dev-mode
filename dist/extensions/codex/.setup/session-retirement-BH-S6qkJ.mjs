import { n as withCodexAppServerThreadMutation, t as isIncognitoSessionKey } from "./incognito-session-uhrBF6wJ.mjs";
import { I as hasCodexAppServerLiveThread, U as releaseCodexAppServerLiveThread, _ as retainSharedCodexAppServerClientByInstanceId, z as isCodexAppServerLiveThreadClaimed } from "./shared-client-DA4VR4Eb.mjs";
import { n as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS, o as closeCodexStartupClientBestEffort, p as unsubscribeCodexThreadBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { t as isSameCodexAppServerThreadOwner } from "./thread-ownership-DcTtAcXj.mjs";
import { t as codexNativeSubagentMonitorRuntime } from "./native-subagent-monitor-D3filLY2.mjs";
import { t as getCodexSessionInitializationRollback } from "./session-initialization-rcgbZiid.mjs";
//#region extensions/codex/src/app-server/session-retirement.ts
async function releaseSessionSubscription(client, binding, sessionKey, assertCurrent) {
	assertCurrent?.();
	codexNativeSubagentMonitorRuntime.retireParent(client, binding.threadId);
	const released = await releaseCodexAppServerLiveThread(client, binding.threadId, assertCurrent);
	assertCurrent?.();
	if (!released && isIncognitoSessionKey(sessionKey)) {
		const unsubscribed = await unsubscribeCodexThreadBestEffort(client, {
			threadId: binding.threadId,
			timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS,
			assertCurrent
		});
		assertCurrent?.();
		if (!unsubscribed) {
			await closeCodexStartupClientBestEffort(client);
			throw new CodexAppServerUnsafeSubscriptionError(`Codex retired session subscription could not be released: ${binding.threadId}`);
		}
	}
}
/** Prepare exact binding deletion before the session owner commits either database. */
async function withCodexAppServerSessionDeletion(bindingStore, params, run) {
	return withCodexAppServerSessionMutation(bindingStore, params, run);
}
/** Retire the old native context when the host commits a rewind or branch switch. */
async function withCodexAppServerSessionContextReset(bindingStore, params, run) {
	params.assertCurrent();
	const plan = await bindingStore.prepareSessionGenerationReclaim({
		kind: "session",
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	});
	params.assertCurrent();
	const sessionId = plan.kind === "verify" && plan.expectedPreviousSessionId === params.previousSessionId ? plan.expectedPreviousSessionId : params.sessionId;
	return withCodexAppServerSessionMutation(bindingStore, {
		...params,
		sessionId
	}, run);
}
async function withCodexAppServerSessionMutation(bindingStore, params, run) {
	const { assertCurrent } = params;
	const identity = {
		kind: "session",
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId
	};
	const remove = () => bindingStore.withSessionDeletion(identity, assertCurrent, async (binding, mutation) => {
		assertCurrent();
		const rollbackInitialization = getCodexSessionInitializationRollback(bindingStore, params, identity, binding);
		if (binding?.connectionScope === "supervision" && !rollbackInitialization) throw new Error("Cannot delete a session while its Codex binding is owned by supervision");
		const clientLease = binding?.clientId ? retainSharedCodexAppServerClientByInstanceId(binding.clientId) : void 0;
		const assertUnclaimed = () => {
			assertCurrent();
			if (clientLease && binding && isCodexAppServerLiveThreadClaimed(clientLease.client, binding.threadId)) throw new Error("Cannot delete a session while its Codex thread is claimed by active work");
		};
		let committed = false;
		try {
			assertUnclaimed();
			return await run({
				commit() {
					assertUnclaimed();
					mutation.commit();
					committed = true;
				},
				rollback() {
					mutation.rollback();
					committed = false;
				}
			});
		} finally {
			try {
				if (committed && rollbackInitialization) {
					assertCurrent();
					await rollbackInitialization();
				}
				if (committed && binding && clientLease) await withCodexAppServerThreadMutation(binding.threadId, async () => {
					assertCurrent();
					if (!hasCodexAppServerLiveThread(clientLease.client, binding.threadId) && !isIncognitoSessionKey(params.sessionKey)) return;
					if (await bindingStore.hasOtherThreadOwner(binding.threadId)) return;
					await releaseSessionSubscription(clientLease.client, binding, params.sessionKey, assertUnclaimed);
				});
			} finally {
				clientLease?.release();
			}
		}
	});
	return params.initialization ? await bindingStore.withThreadArchiveFence(remove) : await remove();
}
/** Retire binding and native subscription under the same generation/physical-client ownership fence. */
async function retireCodexAppServerSessionGeneration(params) {
	const retireGeneration = () => params.mode === "reset" ? params.bindingStore.resetSessionGeneration(params.identity) : params.bindingStore.retireSessionGeneration(params.identity);
	const expectedBinding = params.bindingStore.read(params.identity);
	if (!expectedBinding) return await retireGeneration();
	return await withCodexAppServerThreadMutation(expectedBinding.threadId, () => params.bindingStore.withLease(params.identity, async () => {
		const binding = params.bindingStore.read(params.identity);
		if (!binding || !isSameCodexAppServerThreadOwner(binding, expectedBinding)) return "conflict";
		const result = await retireGeneration();
		if (result !== "applied" || !binding?.clientId) return result;
		const clientLease = retainSharedCodexAppServerClientByInstanceId(binding.clientId);
		if (!clientLease) return result;
		try {
			await releaseSessionSubscription(clientLease.client, binding, params.identity.sessionKey);
		} finally {
			clientLease.release();
		}
		return result;
	}));
}
//#endregion
export { retireCodexAppServerSessionGeneration, withCodexAppServerSessionContextReset, withCodexAppServerSessionDeletion };
