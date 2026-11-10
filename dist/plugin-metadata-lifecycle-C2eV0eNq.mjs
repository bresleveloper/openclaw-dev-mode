import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { S as resetPluginCache, T as retirePluginCache, c as getPluginCache, k as withPluginCache, l as getPluginCacheRetention, m as getProcessPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { n as PluginRuntimeCloseRetainedError } from "./runtime-close-error-DOUCCb00.mjs";
import { o as isGatewayPluginMetadataSnapshotActive, t as clearCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { n as retainPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot-readers-BVwX7oya.mjs";
import { c as retainPluginSourceCaptureInstance } from "./plugin-source-capture-directory-uZgzXzIf.mjs";
//#region src/plugins/plugin-metadata-lifecycle.ts
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Map();
const gatewayMetadata = resolveGlobalSingleton(Symbol.for("openclaw.gatewayPluginMetadataOwner"), () => ({}));
/** The kernel owns bootstrap acquisition, published inventory, and unfinished retirement. */
function retainGatewayPluginMetadata(scheduler, onAllGatewaysClosing) {
	scheduler.signal.throwIfAborted();
	const bootstrapCache = getPluginCache();
	if (gatewayMetadata.owner?.phase === "closing" || bootstrapCache.retirement) throw new Error("Gateway plugin metadata is shutting down; finish cleanup before starting another Gateway. If cleanup failed, resolve the failure and restart.");
	const sourceCaptures = retainPluginSourceCaptureInstance();
	const sourceSweep = sourceCaptures.startMaintenance(scheduler);
	const releaseReaders = retainPluginMetadataSnapshotReaders();
	const owner = {
		cache: bootstrapCache,
		phase: "booting",
		retirements: /* @__PURE__ */ new Set()
	};
	gatewayMetadata.owner = owner;
	const releaseCache = (cache, beforeRetire) => {
		if (cache) owner.retirements.add({
			cache,
			beforeRetire
		});
	};
	const waitForRetirement = async (required = []) => {
		const deferConsumers = owner.closing === void 0;
		const results = await Promise.allSettled([...required, ...[...owner.retirements].map(async (retirement) => {
			const pending = retirement.promise ??= Promise.resolve().then(async () => {
				const previous = await retirement.beforeRetire?.();
				const { cache } = retirement;
				const cleanup = await retirePluginCache(cache, () => {
					for (const [key, instance] of cache.setupModules) if (owner.cache?.setupModules.get(key) === instance) cache.setupModules.delete(key);
				});
				return {
					cleanupCount: (previous?.cleanupCount ?? 0) + (cleanup?.cleanupCount ?? 0),
					failures: [...previous?.failures ?? [], ...cleanup?.failures ?? []]
				};
			});
			pending.catch(() => {});
			const observed = deferConsumers ? await retirement.beforeRetire?.({ deferConsumers: true }) : void 0;
			if (deferConsumers && (observed?.deferredPluginIds?.length || retirement.cache.kind === "process" && getPluginCacheRetention(retirement.cache))) return observed;
			const completed = await pending;
			owner.retirements.delete(retirement);
			return completed;
		})]);
		const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length) throw new AggregateError(failures, "Gateway plugin metadata cleanup failed");
		const completed = results.flatMap((result) => result.status === "fulfilled" && result.value ? [result.value] : []);
		const deferredPluginIds = completed.flatMap((result) => result.deferredPluginIds ?? []);
		return {
			cleanupCount: completed.reduce((count, result) => count + result.cleanupCount, 0),
			failures: completed.flatMap((result) => result.failures),
			...deferredPluginIds.length ? { deferredPluginIds } : {}
		};
	};
	const beginClose = () => {
		owner.phase = "closing";
		owner.prelude ??= Promise.resolve().then(onAllGatewaysClosing);
		owner.prelude.catch(() => {});
		return owner.prelude;
	};
	return {
		beginClose,
		retire: releaseCache,
		runBootstrap(run) {
			if (owner.phase !== "booting" || !owner.cache) throw new Error("Gateway plugin bootstrap has already finished");
			return withPluginCache(owner.cache, run);
		},
		publish(snapshot, changedPluginIds = /* @__PURE__ */ new Set(), beforeRetire) {
			if (owner.phase === "closing") throw new Error("Gateway plugin metadata owner is closing");
			const previous = owner.cache;
			const next = snapshot ? getPluginMetadataSnapshotCache(snapshot) : previous;
			if (previous && next && previous !== next) {
				for (const [key, instance] of previous.setupModules) if (!changedPluginIds.has(instance.pluginId) && !next.setupModules.has(key)) next.setupModules.set(key, instance);
			}
			owner.cache = next;
			if (owner.phase === "booting") owner.phase = "active";
			if (previous !== next) releaseCache(previous, beforeRetire);
		},
		waitForRetirement,
		close(onFinal, retireRegistry) {
			const prelude = beginClose();
			if (owner.closing) return owner.closing;
			let retirement;
			const retire = () => retirement ??= Promise.resolve().then(async () => {
				const previous = owner.cache;
				owner.cache = void 0;
				releaseCache(previous);
				return await waitForRetirement(retireRegistry ? [Promise.resolve().then(retireRegistry)] : []);
			});
			owner.closing = Promise.resolve().then(async () => {
				try {
					await prelude;
					await onFinal?.(retire);
					const cleanup = await retire();
					clearPluginMetadataCaches();
					await sourceSweep;
					await sourceCaptures.releaseAsync();
					gatewayMetadata.owner = void 0;
					releaseReaders();
					return cleanup;
				} catch (error) {
					throw new PluginRuntimeCloseRetainedError(error);
				}
			});
			return owner.closing;
		}
	};
}
/** Registers a metadata clear hook with the lifetime of its facts. */
function registerPluginMetadataProcessMemoLifecycleClear(clearProcessMemo, options = { owner: "process" }) {
	pluginMetadataProcessMemoClears.set(clearProcessMemo, options.owner);
}
/** Clears plugin metadata snapshots and registered process memo caches. */
function clearPluginMetadataLifecycleCaches() {
	for (const [clearMemo, owner] of pluginMetadataProcessMemoClears) if (owner === "operation") clearMemo();
	if (gatewayMetadata.owner && (gatewayMetadata.owner.phase !== "booting" || isGatewayPluginMetadataSnapshotActive() || getProcessPluginCache().retirement)) return;
	clearPluginMetadataCaches();
}
function clearPluginMetadataCaches() {
	clearCurrentPluginMetadataSnapshot();
	for (const [clearProcessMemo, owner] of pluginMetadataProcessMemoClears) if (owner === "process") clearProcessMemo();
	resetPluginCache();
}
//#endregion
export { registerPluginMetadataProcessMemoLifecycleClear as n, retainGatewayPluginMetadata as r, clearPluginMetadataLifecycleCaches as t };
