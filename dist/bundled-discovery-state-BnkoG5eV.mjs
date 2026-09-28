import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as getPluginCacheRetirementSignal, f as getProcessPluginCache, o as getPluginCache, t as PluginCacheFactInvalidatedError, v as preparePluginCacheFact } from "./plugin-cache-A1nT2dqa.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-DEOzYnOP.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DtesR9-z.mjs";
import { n as readPluginMetadataStateRowSync } from "./installed-plugin-index-row-DAPhfvfQ.mjs";
//#region src/plugins/plugin-metadata-state-worker.ts
/** Read raw metadata from retained snapshot bytes or the shared inspection actor. */
async function readPluginMetadataStateRow(selector, options, artifactPreservingReadOnly = false) {
	const preserveArtifacts = artifactPreservingReadOnly || isArtifactPreservingStateRead();
	try {
		const context = captureOpenClawStateWorkerContext(options);
		try {
			if (preserveArtifacts && getActiveOpenClawStateDatabaseReadSnapshot(options)) {
				context.admission.assertCurrent();
				return readPluginMetadataStateRowSync(selector, options, true);
			}
			const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BgU7tLf5.mjs");
			context.admission.assertCurrent();
			return await runOpenClawStateWorkerOperation(context, async (scope) => {
				const row = await scope.execute({
					type: "plugins.metadata.read",
					input: {
						selector,
						artifactPreservingReadOnly: preserveArtifacts
					}
				});
				if (row === void 0) return;
				if (!isRecord(row) || typeof row.value_json !== "string") throw new Error("Shared-state worker returned an invalid plugin metadata row");
				return { value_json: row.value_json };
			}, { existingOnly: true });
		} finally {
			context.admission.assertCurrent();
		}
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin metadata read admission changed during preparation; retry the operation.", { cause: error });
		throw error;
	}
}
//#endregion
//#region src/plugins/bundled-discovery-state.ts
function parseBundledDiscoveryMode(value) {
	return value === "compat" || value === "allowlist" ? value : void 0;
}
function readBundledDiscoveryFact(read) {
	try {
		return read();
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin discovery read admission changed during preparation; retry the operation.", { cause: error });
		throw error;
	}
}
function resolveBundledDiscoveryOptions(options) {
	return options.path || options.database || !hasActivePluginInstallRoots() ? options : {
		...options,
		env: {
			...options.env ?? process.env,
			OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(options.env).stateDir
		}
	};
}
function readBundledDiscoveryMode(options = {}, behavior = {}) {
	const resolvedOptions = resolveBundledDiscoveryOptions(options);
	return parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readConfigMachineState("plugins.bundledDiscovery", resolvedOptions, behavior)));
}
const discoveryState = resolveGlobalSingleton(Symbol.for("openclaw.bundledDiscoveryMode"), () => ({
	generation: {},
	snapshotModes: /* @__PURE__ */ new WeakMap()
}));
registerPluginMetadataProcessMemoLifecycleClear(() => {
	clearBundledDiscoveryModeMemo();
});
function resolveBundledDiscoveryMemoKey(env) {
	const scopedEnv = hasActivePluginInstallRoots() ? {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	} : env;
	return resolveOpenClawStateSqlitePath(scopedEnv);
}
/**
* Callers loading a registry with an explicit env pass it so the mode comes
* from that env's state root; omitting it reads the process root. Pinned
* install roots win over both, matching readBundledDiscoveryMode.
*/
function readBundledDiscoveryModeMemoized(env = process.env, behavior = {}, readPreparedValue) {
	const options = env === process.env ? {} : { env };
	const snapshot = behavior.artifactPreservingReadOnly || isArtifactPreservingStateRead() ? readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(resolveBundledDiscoveryOptions(options))) : void 0;
	if (snapshot || behavior.artifactPreservingReadOnly) {
		const prepared = snapshot && discoveryState.snapshotModes.get(snapshot);
		if (prepared) return prepared.value;
		const value = readBundledDiscoveryMode(options, behavior);
		if (snapshot) discoveryState.snapshotModes.set(snapshot, { value });
		return value;
	}
	const key = resolveBundledDiscoveryMemoKey(env);
	if (discoveryState.memoized?.key !== key) {
		const owner = getPluginCache();
		const prepared = owner.preparedBundledDiscoveryModes.get(key);
		if (prepared && "value" in prepared && prepared.value.generation === discoveryState.generation) {
			getPluginCacheRetirementSignal(owner).throwIfAborted();
			discoveryState.memoized = {
				key,
				value: prepared.value.value
			};
		} else discoveryState.memoized = {
			key,
			value: readPreparedValue ? parseBundledDiscoveryMode(readBundledDiscoveryFact(() => readPreparedValue(key))) : readBundledDiscoveryMode(env === process.env ? {} : { env })
		};
	}
	return discoveryState.memoized.value;
}
/** Prepare the same machine-owned fact for synchronous metadata derivation. */
async function prepareBundledDiscoveryMode(env = process.env) {
	const owner = getPluginCache();
	const options = resolveBundledDiscoveryOptions({ env });
	const snapshot = isArtifactPreservingStateRead() ? readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(options)) : void 0;
	if (snapshot) {
		const metadata = owner.metadata;
		const generation = discoveryState.generation;
		const signal = getPluginCacheRetirementSignal(owner);
		const assertCurrent = () => {
			signal.throwIfAborted();
			if (owner.metadata !== metadata || discoveryState.generation !== generation || readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(options)) !== snapshot) throw new PluginCacheFactInvalidatedError("Plugin discovery snapshot changed during preparation; retry the operation.");
		};
		assertCurrent();
		return assertCurrent;
	}
	const cache = owner.preparedBundledDiscoveryModes;
	const key = resolveBundledDiscoveryMemoKey(env);
	const generation = discoveryState.generation;
	const current = cache.get(key);
	if (current && "value" in current && current.value.generation !== generation) cache.delete(key);
	const prepared = await preparePluginCacheFact(owner, cache, key, async () => {
		let value;
		if (discoveryState.memoized?.key === key) value = discoveryState.memoized.value;
		else {
			const row = await readPluginMetadataStateRow("bundled-discovery", resolveBundledDiscoveryOptions({ env }));
			value = parseBundledDiscoveryMode(row ? JSON.parse(row.value_json) : void 0);
		}
		if (discoveryState.generation !== generation) throw new PluginCacheFactInvalidatedError("Plugin discovery state changed during preparation; retry the operation.");
		return {
			value,
			generation
		};
	});
	const activate = () => {
		prepared.assertCurrent();
		if (discoveryState.generation !== generation) throw new PluginCacheFactInvalidatedError("Plugin discovery state changed during preparation; retry the operation.");
		discoveryState.memoized = {
			key,
			value: prepared.value.value
		};
	};
	activate();
	return activate;
}
/**
* Clears the memo after a machine-state write so same-process readers observe
* the new mode. Without this, doctor's migration could cache the pre-migration
* absent mode and rebuild plugin indexes against stale strict-gate decisions.
*/
function clearBundledDiscoveryModeMemo() {
	discoveryState.memoized = void 0;
	discoveryState.snapshotModes = /* @__PURE__ */ new WeakMap();
	discoveryState.generation = {};
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) cache.preparedBundledDiscoveryModes.clear();
}
//#endregion
export { readPluginMetadataStateRow as a, readBundledDiscoveryModeMemoized as i, prepareBundledDiscoveryMode as n, readBundledDiscoveryMode as r, clearBundledDiscoveryModeMemo as t };
