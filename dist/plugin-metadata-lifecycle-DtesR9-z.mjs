import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { C as retirePluginCache, D as withPluginCache, b as resetPluginCache, d as getPluginMetadataSnapshotCache, f as getProcessPluginCache, o as getPluginCache, s as getPluginCacheRetention } from "./plugin-cache-A1nT2dqa.mjs";
import { t as PluginRuntimeCloseRetainedError } from "./runtime-close-error-CYO2S35x.mjs";
import { o as isGatewayPluginMetadataSnapshotActive, s as selectCurrentPluginMetadataCache, t as clearCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { n as retainPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
import { n as retainPluginSourceCaptureInstance, r as sweepPluginSourceCaptureDirectories } from "./plugin-source-capture-directory-DMhuTSdY.mjs";
//#region src/plugins/plugin-metadata-lifecycle.ts
/** Coordinates plugin metadata snapshot and process memo cache lifecycle resets. */
const pluginMetadataProcessMemoClears = /* @__PURE__ */ new Map();
const gatewayMetadataOwners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayPluginMetadataOwners"), () => /* @__PURE__ */ new Set());
function hasClosingGateway() {
	return [...gatewayMetadataOwners].some((owner) => owner.phase === "closing");
}
/** The kernel owns bootstrap acquisition, published inventory, and unfinished retirement. */
function retainGatewayPluginMetadata() {
	const bootstrapCache = getPluginCache();
	if (hasClosingGateway() || bootstrapCache.retirement) throw new Error("Gateway plugin metadata is shutting down; finish cleanup before starting another Gateway. If cleanup failed, resolve the failure and restart.");
	const sourceCaptures = retainPluginSourceCaptureInstance();
	const releaseReaders = retainPluginMetadataSnapshotReaders();
	sweepPluginSourceCaptureDirectories();
	const owner = {
		cache: bootstrapCache,
		phase: "booting",
		retirements: /* @__PURE__ */ new Set()
	};
	gatewayMetadataOwners.add(owner);
	const releaseCache = (cache, beforeRetire) => {
		if (cache) owner.retirements.add({
			cache,
			beforeRetire
		});
	};
	const waitForRetirement = async (required = []) => {
		const results = await Promise.allSettled([...required, ...[...owner.retirements].map(async (retirement) => {
			const prerequisite = retirement.prerequisite ??= Promise.resolve().then(() => retirement.beforeRetire?.());
			const pending = retirement.promise ??= prerequisite.then(async (previous) => {
				const { cache } = retirement;
				let cleanup;
				if (![...gatewayMetadataOwners].some((other) => other.cache === cache)) cleanup = await retirePluginCache(cache, () => {
					const retained = new Set([...gatewayMetadataOwners].flatMap((other) => Array.from(other.cache?.setupModules.values() ?? [])));
					for (const [key, instance] of cache.setupModules) if (retained.has(instance)) cache.setupModules.delete(key);
				});
				owner.retirements.delete(retirement);
				return {
					cleanupCount: (previous?.cleanupCount ?? 0) + (cleanup?.cleanupCount ?? 0),
					failures: [...previous?.failures ?? [], ...cleanup?.failures ?? []]
				};
			});
			pending.catch(() => {});
			const observed = owner.phase !== "closing" ? await retirement.beforeRetire?.({ deferConsumers: true }) : void 0;
			return owner.phase !== "closing" && (observed?.deferredPluginIds?.length || retirement.cache.kind === "process" && getPluginCacheRetention(retirement.cache)) ? observed : pending;
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
	};
	return {
		beginClose,
		retire: releaseCache,
		runBootstrap(run) {
			if (owner.phase !== "booting" || !owner.cache) throw new Error("Gateway plugin bootstrap has already finished");
			return withPluginCache(owner.cache, run);
		},
		publish(snapshot, changedPluginIds = /* @__PURE__ */ new Set(), beforeRetire) {
			if (owner.phase === "closing" || !gatewayMetadataOwners.has(owner)) throw new Error("Gateway plugin metadata owner is closing");
			const previous = owner.cache;
			const next = snapshot ? getPluginMetadataSnapshotCache(snapshot) : previous;
			if (previous && next && previous !== next) {
				for (const [key, instance] of previous.setupModules) if (!changedPluginIds.has(instance.pluginId) && !next.setupModules.has(key)) next.setupModules.set(key, instance);
			}
			owner.cache = next;
			if (owner.phase === "booting") {
				owner.phase = "active";
				gatewayMetadataOwners.delete(owner);
				gatewayMetadataOwners.add(owner);
			}
			if (previous !== next) releaseCache(previous, beforeRetire);
		},
		waitForRetirement,
		close(onFinal, retireRegistry) {
			beginClose();
			if (owner.closing) return owner.closing;
			if (!gatewayMetadataOwners.has(owner)) return Promise.resolve({
				cleanupCount: 0,
				failures: []
			});
			const otherOwners = [...gatewayMetadataOwners].filter((other) => other !== owner);
			const precedingCloses = otherOwners.flatMap((other) => other.closing ? [other.closing] : []);
			const final = precedingCloses.length === otherOwners.length;
			let retirement;
			const retire = () => retirement ??= Promise.resolve().then(async () => {
				const previous = owner.cache;
				owner.cache = void 0;
				releaseCache(previous);
				if (previous && getProcessPluginCache() === previous) {
					const others = [...gatewayMetadataOwners].filter((other) => other.cache && !other.cache.retirement);
					const survivor = others.findLast((other) => other.phase === "active") ?? others.at(-1);
					if (survivor?.cache) selectCurrentPluginMetadataCache(survivor.cache);
				}
				return await waitForRetirement([...retireRegistry ? [Promise.resolve().then(retireRegistry)] : [], ...final ? precedingCloses : []]);
			});
			owner.closing = Promise.resolve().then(async () => {
				try {
					if (final) await onFinal?.(retire);
					const cleanup = await retire();
					if (final) clearPluginMetadataCaches();
					await sourceCaptures.releaseAsync();
					gatewayMetadataOwners.delete(owner);
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
	if (gatewayMetadataOwners.size > 0 && ([...gatewayMetadataOwners].some((owner) => owner.phase !== "booting") || isGatewayPluginMetadataSnapshotActive() || getProcessPluginCache().retirement)) return;
	clearPluginMetadataCaches();
}
function clearPluginMetadataCaches() {
	clearCurrentPluginMetadataSnapshot();
	for (const [clearProcessMemo, owner] of pluginMetadataProcessMemoClears) if (owner === "process") clearProcessMemo();
	resetPluginCache();
}
//#endregion
export { registerPluginMetadataProcessMemoLifecycleClear as n, retainGatewayPluginMetadata as r, clearPluginMetadataLifecycleCaches as t };
