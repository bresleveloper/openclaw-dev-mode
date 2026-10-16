import { S as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-SXYawyhG.mjs";
import { t as withCodexAppServerThreadMutation } from "./thread-ownership-queue-Dp24d7-F.mjs";
import { K as releaseCodexAppServerLiveThread, V as isCodexAppServerLiveThreadClaimed, q as retainCodexAppServerLiveThread } from "./shared-client-r9NcV_GJ.mjs";
import { f as unsubscribeCodexThreadBestEffort, o as closeCodexStartupClientBestEffort, r as CodexAppServerUnsafeSubscriptionError } from "./attempt-client-cleanup-DNfVb5SC.mjs";
import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { runWithAsyncWorkResources } from "openclaw/plugin-sdk/agent-harness-tool-runtime";
//#region extensions/codex/src/app-server/thread-ownership.ts
var thread_ownership_exports = /* @__PURE__ */ __exportAll({
	isSameCodexAppServerThreadOwner: () => isSameCodexAppServerThreadOwner,
	releaseCodexAppServerBindingSubscription: () => releaseCodexAppServerBindingSubscription,
	retainCodexAppServerBindingSubscription: () => retainCodexAppServerBindingSubscription,
	retireCodexConversationThreadBinding: () => retireCodexConversationThreadBinding,
	rollbackCodexAppServerBindingSubscription: () => rollbackCodexAppServerBindingSubscription,
	withCodexAppServerThreadMutationHold: () => withCodexAppServerThreadMutationHold,
	withExclusiveCodexAppServerThread: () => withExclusiveCodexAppServerThread
});
/** Queued cancellation settles the caller without letting successors overtake its lane. */
async function withCodexAppServerThreadMutationHold(threadId, run, signal) {
	return await runWithAsyncWorkResources(async (onAcquired) => {
		signal?.throwIfAborted();
		const { promise, resolve, reject } = createDeferred();
		const abort = () => reject(signal?.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("compaction aborted"));
		signal?.addEventListener("abort", abort, { once: true });
		const start = () => signal?.removeEventListener("abort", abort);
		const queued = withCodexAppServerThreadMutation(threadId, async () => {
			let heldUntil;
			try {
				signal?.throwIfAborted();
				resolve(await run((until) => {
					heldUntil ??= until;
				}, start));
			} catch (error) {
				reject(error);
			}
			await heldUntil;
		});
		onAcquired({ release: async () => {
			await Promise.allSettled([queued]);
		} });
		queued.finally(start).catch(reject);
		return promise;
	});
}
/** Codex subscriptions belong to a physical connection, not the native thread ID alone. */
function isSameCodexAppServerThreadOwner(current, expected) {
	return current !== void 0 && expected !== void 0 && current.threadId === expected.threadId && current.clientId === expected.clientId;
}
/** Fences native subscription and commit together; Codex subscriptions are not reference-counted. */
async function withExclusiveCodexAppServerThread(params) {
	return await withCodexAppServerThreadMutation(params.threadId, async () => {
		if (await params.bindingStore.hasOtherThreadOwner(params.threadId, params.identity)) throw new Error(`Codex thread ${params.threadId} is owned by another OpenClaw session or conversation.`);
		return await params.run();
	});
}
/** Publishes one owned subscription with its persistent or ephemeral retention lifetime. */
async function retainCodexAppServerBindingSubscription(client, threadId, ownership) {
	return await retainCodexAppServerLiveThread(client, threadId, ownership?.release ?? (async (releasedThreadId, assertCurrent, withCurrent) => {
		if (!await unsubscribeCodexThreadBestEffort(client, {
			threadId: releasedThreadId,
			timeoutMs: 5e3,
			assertCurrent,
			withCurrent
		})) {
			assertCurrent?.();
			await closeCodexStartupClientBestEffort(client);
			throw new CodexAppServerUnsafeSubscriptionError(`Codex thread subscription could not be released: ${releasedThreadId}`);
		}
	}), ownership?.configFingerprint, ownership?.serviceTier, ownership?.ephemeralPolicy);
}
/** Rolls back the exact subscription Codex created before its binding was committed. */
async function rollbackCodexAppServerBindingSubscription(client, threadId, retained) {
	if (retained && await releaseCodexAppServerLiveThread(client, threadId)) return;
	if (isCodexAppServerLiveThreadClaimed(client, threadId)) return;
	if (!await unsubscribeCodexThreadBestEffort(client, {
		threadId,
		timeoutMs: 5e3
	})) await closeCodexStartupClientBestEffort(client);
}
/** Releases only the physical client and native thread recorded by the displaced binding owner. */
async function releaseCodexAppServerBindingSubscription(binding, options = {}) {
	options.assertCurrent?.();
	const clientLease = await retainSharedCodexAppServerClientByInstanceId(binding.clientId);
	if (!clientLease) return;
	try {
		if (await releaseCodexAppServerLiveThread(clientLease.client, binding.threadId, options.assertCurrent, options.withCurrent)) return;
		options.assertCurrent?.();
		if (isCodexAppServerLiveThreadClaimed(clientLease.client, binding.threadId)) throw new Error(`Codex thread ${binding.threadId} has an active run; stop it before changing its owner.`);
		if (!options.allowUntracked) return;
		if (!await unsubscribeCodexThreadBestEffort(clientLease.client, {
			threadId: binding.threadId,
			timeoutMs: 5e3,
			assertCurrent: options.assertCurrent,
			withCurrent: options.withCurrent
		})) {
			await closeCodexStartupClientBestEffort(clientLease.client);
			throw new CodexAppServerUnsafeSubscriptionError(`Codex retired thread subscription could not be released: ${binding.threadId}`);
		}
	} finally {
		await clientLease.release(binding.clientId !== options.retainedClientId && !isCodexAppServerLiveThreadClaimed(clientLease.client, binding.threadId));
	}
}
/** Clears and releases one exact conversation generation without touching its replacement. */
async function retireCodexConversationThreadBinding(params) {
	const assertCurrent = params.assertCurrent;
	const expected = params.bindingStore.read(params.identity);
	if (!expected || params.expectedThreadId && expected.threadId !== params.expectedThreadId) return false;
	return await withCodexAppServerThreadMutation(expected.threadId, () => params.bindingStore.withLease(params.identity, async () => {
		const current = params.bindingStore.read(params.identity);
		if (!current || !isSameCodexAppServerThreadOwner(current, expected) || params.expectedStartId && current?.conversationStartId !== params.expectedStartId) return false;
		assertCurrent?.();
		await releaseCodexAppServerBindingSubscription(current, {
			allowUntracked: params.allowUntracked,
			assertCurrent
		});
		const cleared = await params.bindingStore.mutate(params.identity, {
			kind: "clear",
			threadId: current.threadId
		}, assertCurrent);
		if (!cleared || !params.afterClear) return cleared;
		try {
			assertCurrent?.();
			await params.afterClear();
			return true;
		} catch (error) {
			try {
				if (!await params.bindingStore.mutate(params.identity, {
					kind: "set",
					binding: current,
					if: { kind: "absent" }
				}, assertCurrent)) throw new Error("the previous Codex binding generation could not be restored", { cause: error });
			} catch (restorationError) {
				throw new AggregateError([error, restorationError], `Codex conversation detachment failed and native thread ${current.threadId} could not be restored; run /codex resume ${current.threadId} to recover it`, { cause: restorationError });
			}
			throw error;
		}
	}));
}
//#endregion
export { rollbackCodexAppServerBindingSubscription as a, withExclusiveCodexAppServerThread as c, retireCodexConversationThreadBinding as i, releaseCodexAppServerBindingSubscription as n, thread_ownership_exports as o, retainCodexAppServerBindingSubscription as r, withCodexAppServerThreadMutationHold as s, isSameCodexAppServerThreadOwner as t };
