import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as getPluginCache, m as getProcessPluginCache, n as PluginCacheFactInvalidatedError, u as getPluginCacheRetirementSignal, y as preparePluginCacheFact } from "./plugin-cache-BbahpD-b.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as isArtifactPreservingStateRead, r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { n as getActiveOpenClawStateDatabaseReadSnapshot, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { r as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-cuIncTSC.mjs";
//#region src/plugins/plugin-metadata-state-worker.ts
async function readPluginMetadataState(selection, options, artifactPreservingReadOnly) {
	try {
		const stateKeys = "stateKeys" in selection ? [...selection.stateKeys] : [selection.selector === "installed-index" ? "plugins.installedIndex" : "plugins.bundledDiscovery"];
		const read = () => executeExistingOpenClawStateRead(options, {
			type: "plugins.metadata.read",
			input: { stateKeys }
		}, { snapshotPreparation: "awaited" });
		const result = await (artifactPreservingReadOnly ? withArtifactPreservingStateReads(read) : read());
		if (result === void 0) return [];
		return result.rows;
	} catch (error) {
		if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin metadata read admission changed during preparation; retry the operation.", { cause: error });
		throw error;
	}
}
/** Read raw metadata through the shared reader, including retained snapshot scopes. */
async function readPluginMetadataStateRow(selector, options, artifactPreservingReadOnly = false) {
	const [row] = await readPluginMetadataState({ selector }, options, artifactPreservingReadOnly);
	return row ? { value_json: row.value_json } : void 0;
}
/** Policy and inventory preparation share one worker request and SQLite snapshot. */
function readPluginMetadataStateRows(stateKeys, options, artifactPreservingReadOnly = false) {
	return readPluginMetadataState({ stateKeys }, options, artifactPreservingReadOnly);
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
const discoveryState = resolveGlobalSingleton(Symbol.for("openclaw.bundledDiscoveryMode"), () => ({ snapshotModes: /* @__PURE__ */ new WeakMap() }));
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
		if (prepared && "value" in prepared) {
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
async function prepareBundledDiscoveryMode(env = process.env, readPreparedRow) {
	const owner = getPluginCache();
	const key = resolveBundledDiscoveryMemoKey(env);
	const options = resolveBundledDiscoveryOptions({ env });
	const snapshot = isArtifactPreservingStateRead() ? readBundledDiscoveryFact(() => getActiveOpenClawStateDatabaseReadSnapshot(options)) : void 0;
	if (snapshot) {
		const existing = discoveryState.snapshotModes.get(snapshot);
		let value = existing?.value;
		if (!existing) try {
			const row = readPreparedRow ? await readPreparedRow(key) : await readPluginMetadataStateRow("bundled-discovery", options);
			value = parseBundledDiscoveryMode(row ? JSON.parse(row.value_json) : void 0);
		} catch (error) {
			if (isStateDatabaseReadAdmissionInvalidatedError(error)) throw new PluginCacheFactInvalidatedError("Plugin discovery read admission changed during preparation; retry the operation.", { cause: error });
			throw error;
		}
		const activate = () => {
			discoveryState.snapshotModes.set(snapshot, { value });
			if (owner.kind === "operation") owner.preparedBundledDiscoveryModes.set(key, { value: {
				value,
				generation: owner
			} });
		};
		activate();
		return activate;
	}
	const cache = owner.preparedBundledDiscoveryModes;
	const prepared = await preparePluginCacheFact(owner, cache, key, async () => {
		let value;
		if (discoveryState.memoized?.key === key) value = discoveryState.memoized.value;
		else {
			const row = readPreparedRow ? await readPreparedRow(key) : await readPluginMetadataStateRow("bundled-discovery", resolveBundledDiscoveryOptions({ env }));
			value = parseBundledDiscoveryMode(row ? JSON.parse(row.value_json) : void 0);
		}
		return {
			value,
			generation: owner
		};
	});
	const activate = () => {
		prepared.assertCurrent();
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
	for (const cache of /* @__PURE__ */ new Set([getPluginCache(), getProcessPluginCache()])) cache.preparedBundledDiscoveryModes.clear();
}
//#endregion
export { readPluginMetadataStateRow as a, readBundledDiscoveryModeMemoized as i, prepareBundledDiscoveryMode as n, readPluginMetadataStateRows as o, readBundledDiscoveryMode as r, clearBundledDiscoveryModeMemo as t };
