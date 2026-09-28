import { n as createClaimableDedupe, o as runClaimableDedupeClaimLoop } from "../persistent-dedupe-Bh_LkzTr.mjs";
//#region src/plugin-sdk/ingress-effect-once.ts
const INGRESS_EFFECT_ONCE_NAMESPACE_PREFIX = "ingress-effect-once";
var IngressEffectRunFailedError = class extends Error {
	constructor() {
		super("ingress effect failed before its durable commit");
		this.name = "IngressEffectRunFailedError";
	}
};
/**
* Create a durable per-event side-effect guard for channel ingress drains.
*
* Create one factory per ingress queue/account scope and give that scope a stable, unique
* `namespacePrefix`; `eventId` only needs to be unique within that queue. Storage failures
* reject instead of falling back to process memory.
*
* `ttlMs` must cover the maximum effect-commit-to-tombstone delay plus the channel's
* ingress tombstone retention. Older records are dead weight once the tombstone prevents
* replay. A process death after `run()` succeeds but before the claim commits can still
* execute the effect again on recovery, as can a storage failure during that commit.
*/
function createIngressEffectOnce(params) {
	const dedupe = createClaimableDedupe({
		pluginId: params.pluginId,
		namespacePrefix: INGRESS_EFFECT_ONCE_NAMESPACE_PREFIX,
		ttlMs: params.ttlMs,
		stateMaxEntries: params.stateMaxEntries,
		memoryMaxSize: params.memoryMaxSize ?? params.stateMaxEntries,
		onDiskError: (error) => {
			params.onDiskError?.(error);
			throw error;
		}
	});
	return { runOnce: async (effectParams) => {
		const key = JSON.stringify([effectParams.effect, effectParams.eventId]);
		const namespace = params.namespacePrefix;
		if ((await runClaimableDedupeClaimLoop(() => dedupe.claim(key, { namespace }), (error) => {
			if (error instanceof IngressEffectRunFailedError) return true;
			throw error;
		})).kind === "duplicate") return { kind: "replayed" };
		let value;
		try {
			value = await effectParams.run();
		} catch (error) {
			dedupe.release(key, {
				namespace,
				error: new IngressEffectRunFailedError()
			});
			throw error;
		}
		try {
			await dedupe.commit(key, { namespace });
		} catch (error) {
			try {
				await dedupe.forget(key, {
					namespace,
					onDiskError: (cleanupError) => {
						throw cleanupError;
					}
				});
			} catch {}
			throw error;
		}
		return {
			kind: "executed",
			value
		};
	} };
}
//#endregion
export { createIngressEffectOnce };
