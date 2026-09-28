import { n as setRetainedLegacyDefaultAgentId, t as getRetainedLegacyDefaultAgentId } from "./legacy.default-agent-owner-state-BIemD7B0.mjs";
import { n as isDeeplyFrozenPlainData, t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts, r as copyConfigResolutionFacts, t as cloneConfigWithResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { n as cloneEnvWithPlatformSemantics, p as resetPublishedConfigRuntimeEnv } from "./config-env-vars-BHI12YH5.mjs";
import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
import { t as clearExecutablePathCache } from "./executable-path-BMRdcL7i.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { t as getScopedConfigSnapshotPreparation } from "./io.snapshot-preparation-scope-CebMPnB-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/runtime-config-capture-state.ts
const captures = /* @__PURE__ */ new WeakMap();
function getRuntimeConfigCapture(config) {
	return config ? captures.get(config) : void 0;
}
/** Freeze a selected runtime/source pair before its publication owner yields. */
function captureRuntimeConfigWithSource(config, source) {
	const clone = (value) => {
		const captured = cloneConfigWithResolutionFacts(value);
		setRetainedLegacyDefaultAgentId(captured, getRetainedLegacyDefaultAgentId(value));
		return freezeJsonSnapshot(captured);
	};
	const captured = clone(config);
	const capturedSource = source === config ? captured : clone(source);
	captures.set(captured, {
		source: capturedSource,
		origin: config
	});
	if (capturedSource !== captured) captures.set(capturedSource, {
		source: capturedSource,
		origin: source
	});
	return captured;
}
/** Retain effective environment alongside the selected config/source publication. */
function captureRuntimeConfigRead(config, source) {
	return {
		config: captureRuntimeConfigWithSource(config, source),
		env: cloneEnvWithPlatformSemantics(process.env)
	};
}
//#endregion
//#region src/config/runtime-snapshot.ts
function resolveConfigWriteAfterWrite(afterWrite) {
	return afterWrite ?? { mode: "auto" };
}
function resolveConfigWriteFollowUp(afterWrite) {
	const resolved = resolveConfigWriteAfterWrite(afterWrite);
	if (resolved.mode === "restart") return {
		mode: "restart",
		reason: resolved.reason,
		requiresRestart: true
	};
	if (resolved.mode === "none") return {
		mode: "none",
		reason: resolved.reason,
		requiresRestart: false
	};
	return {
		mode: "auto",
		requiresRestart: false
	};
}
function projectRuntimeConfigWritePreparedCandidates(preparedCandidates, runtimeConfig, sourceConfig) {
	return new Map([...preparedCandidates].map(([ownerId, candidate]) => [ownerId, {
		...candidate,
		runtimeConfig: candidate.reapplyRuntimeOverlays?.(runtimeConfig) ?? candidate.runtimeConfig,
		compareConfig: candidate.reapplyCompareOverlays?.(sourceConfig) ?? candidate.compareConfig
	}]));
}
let runtimeConfigSnapshot = null;
let runtimeConfigSourceSnapshot = null;
let runtimeConfigSnapshotMetadata = null;
let runtimeConfigAppliedHash = null;
let runtimeConfigSnapshotRevision = 0;
let runtimeConfigSnapshotGeneration = 0;
let runtimeConfigPreparerGeneration = 0;
let runtimeConfigSnapshotRefreshHandler = null;
const managedRuntimeConfigWriteOwners = /* @__PURE__ */ new Map();
const runtimeConfigWriteListeners = /* @__PURE__ */ new Set();
const runtimeConfigSnapshotPreparers = /* @__PURE__ */ new Map();
function stableConfigStringify(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
	if (Array.isArray(value)) return `[${value.map((entry) => stableConfigStringify(entry)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).toSorted().map((key) => `${JSON.stringify(key)}:${stableConfigStringify(record[key])}`).join(",")}}`;
}
function configSnapshotsMatch(left, right) {
	if (left === right) return true;
	if (getConfigResolutionFacts(left) !== getConfigResolutionFacts(right) && !isDeepStrictEqual(serializeConfigResolutionFacts(left), serializeConfigResolutionFacts(right))) return false;
	try {
		return stableConfigStringify(left) === stableConfigStringify(right);
	} catch {
		return false;
	}
}
const immutableConfigHashes = /* @__PURE__ */ new WeakMap();
function hashRuntimeConfigValue(value) {
	const immutable = isDeeplyFrozenPlainData(value);
	const cached = immutable ? immutableConfigHashes.get(value) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = sha256Base64Url(stableConfigStringify(value));
	if (immutable) immutableConfigHashes.set(value, fingerprint);
	return fingerprint;
}
function createRuntimeConfigSnapshotMetadata(config, sourceConfig) {
	runtimeConfigSnapshotRevision += 1;
	return {
		revision: runtimeConfigSnapshotRevision,
		fingerprint: hashRuntimeConfigValue(config),
		sourceFingerprint: sourceConfig ? hashRuntimeConfigValue(sourceConfig) : null,
		updatedAtMs: Date.now()
	};
}
function setRuntimeConfigSnapshot(config, sourceConfig) {
	const factSource = getConfigResolutionFacts(config) !== null ? config : sourceConfig ?? config;
	copyConfigResolutionFacts(factSource, config);
	for (const prepare of runtimeConfigSnapshotPreparers.keys()) prepare(config);
	publishRuntimeConfigSnapshot(config, sourceConfig);
}
function publishRuntimeConfigSnapshot(config, sourceConfig) {
	runtimeConfigSnapshotGeneration += 1;
	clearExecutablePathCache();
	runtimeConfigSnapshot = config;
	runtimeConfigSourceSnapshot = sourceConfig ?? null;
	runtimeConfigSnapshotMetadata = createRuntimeConfigSnapshotMetadata(config, sourceConfig);
	sessionChanges.emit({
		all: true,
		scope: "config"
	});
}
function registerRuntimeConfigSnapshotPreparer(prepare, options) {
	runtimeConfigPreparerGeneration += 1;
	runtimeConfigSnapshotPreparers.set(prepare, options);
	if (runtimeConfigSnapshot) prepare(runtimeConfigSnapshot);
	return () => {
		runtimeConfigPreparerGeneration += 1;
		runtimeConfigSnapshotPreparers.delete(prepare);
	};
}
function preparationFingerprint(config) {
	return sha256Base64Url(stableConfigStringify({
		config,
		facts: serializeConfigResolutionFacts(config)
	}));
}
/** Prepare off the publication path; a superseded candidate must be discarded by its owner. */
async function prepareRuntimeConfigSnapshot(config, context = {}, assertCurrent) {
	const generation = runtimeConfigSnapshotGeneration;
	const preparerGeneration = runtimeConfigPreparerGeneration;
	const fingerprint = preparationFingerprint(config);
	const envFingerprint = context.env ? sha256Base64Url(stableConfigStringify(context.env)) : null;
	const prepared = await Promise.allSettled([...runtimeConfigSnapshotPreparers].map(async ([prepare, options]) => options ? options.prepareAsync(config, context) : () => prepare(config)));
	const contributions = [];
	for (const result of prepared) {
		if (result.status === "rejected") throw result.reason;
		contributions.push(result.value);
	}
	const isCurrent = () => {
		assertCurrent?.();
		return runtimeConfigSnapshotGeneration === generation && runtimeConfigPreparerGeneration === preparerGeneration && preparationFingerprint(config) === fingerprint && (context.env ? sha256Base64Url(stableConfigStringify(context.env)) : null) === envFingerprint;
	};
	let consumed = false;
	return () => {
		if (consumed || !isCurrent()) return false;
		consumed = true;
		for (const contribute of contributions) {
			contribute();
			if (!isCurrent()) return false;
		}
		publishRuntimeConfigSnapshot(config);
		return true;
	};
}
function setAppliedRuntimeConfigSnapshot(config, sourceConfig) {
	setRuntimeConfigSnapshot(config, sourceConfig);
	runtimeConfigAppliedHash = hashRuntimeConfigValue(sourceConfig);
}
/** Publish a newer canonical source without changing the active runtime object. */
function setRuntimeConfigSourceSnapshotIfCurrent(params) {
	if (!runtimeConfigSnapshot || !runtimeConfigSnapshotMetadata || runtimeConfigSnapshotMetadata.revision !== params.expectedRevision) return false;
	copyConfigResolutionFacts(params.sourceConfig, runtimeConfigSnapshot);
	setRuntimeConfigSnapshot(runtimeConfigSnapshot, params.sourceConfig);
	return true;
}
function resetConfigRuntimeState(options = {}) {
	runtimeConfigSnapshotGeneration += 1;
	clearExecutablePathCache();
	runtimeConfigSnapshot = null;
	runtimeConfigSourceSnapshot = null;
	runtimeConfigSnapshotMetadata = null;
	runtimeConfigAppliedHash = null;
	runtimeConfigSnapshotRevision = 0;
	resetPublishedConfigRuntimeEnv({ preserveOwnership: options.preserveConfigEnv });
}
function clearRuntimeConfigSnapshot() {
	resetConfigRuntimeState({ preserveConfigEnv: true });
}
function getRuntimeConfigSnapshot() {
	return runtimeConfigSnapshot;
}
function getRuntimeConfigSourceSnapshot() {
	return runtimeConfigSourceSnapshot;
}
function getRuntimeConfigSnapshotMetadata() {
	return runtimeConfigSnapshotMetadata;
}
/** Resolved source-config revision accepted by the active Gateway runtime. */
function getRuntimeConfigAppliedHash() {
	return runtimeConfigAppliedHash;
}
function setRuntimeConfigAppliedHash(hash) {
	runtimeConfigAppliedHash = hash;
}
function resolveRuntimeConfigCacheKey(config) {
	const metadata = runtimeConfigSnapshotMetadata;
	if (metadata && config === runtimeConfigSnapshot) return `runtime:${metadata.revision}:${metadata.fingerprint}`;
	return `config:${hashRuntimeConfigValue(config)}`;
}
function createRuntimeConfigWriteNotification(params) {
	const metadata = params.runtimeConfig === runtimeConfigSnapshot && runtimeConfigSnapshotMetadata ? runtimeConfigSnapshotMetadata : {
		revision: runtimeConfigSnapshotRevision,
		fingerprint: hashRuntimeConfigValue(params.runtimeConfig),
		sourceFingerprint: hashRuntimeConfigValue(params.sourceConfig),
		updatedAtMs: Date.now()
	};
	return {
		configPath: params.configPath,
		sourceConfig: params.sourceConfig,
		runtimeConfig: params.runtimeConfig,
		persistedHash: params.persistedHash,
		revision: metadata.revision,
		fingerprint: metadata.fingerprint,
		sourceFingerprint: metadata.sourceFingerprint,
		writtenAtMs: params.writtenAtMs ?? Date.now(),
		afterWrite: params.afterWrite,
		...params.runtimeRefresh ? { runtimeRefresh: params.runtimeRefresh } : {},
		...params.preparedCandidate ? { preparedCandidate: params.preparedCandidate } : {},
		...params.preparedCandidatesByOwner ? { preparedCandidatesByOwner: params.preparedCandidatesByOwner } : {}
	};
}
function selectApplicableRuntimeConfig(params) {
	const runtimeConfig = params.runtimeConfig ?? null;
	if (!runtimeConfig) return params.inputConfig;
	const inputConfig = params.inputConfig;
	if (!inputConfig) return runtimeConfig;
	if (inputConfig === runtimeConfig) return inputConfig;
	const runtimeSourceConfig = params.runtimeSourceConfig ?? null;
	if (runtimeSourceConfig && configSnapshotsMatch(inputConfig, runtimeSourceConfig)) return runtimeConfig;
	return inputConfig;
}
/** Bind a retained consumer to its current runtime owner while preserving scoped configs. */
function createRuntimeConfigReader(inputConfig) {
	const origin = getRuntimeConfigCapture(inputConfig)?.origin ?? inputConfig;
	const followsRuntimeConfig = runtimeConfigSnapshot === origin || runtimeConfigSourceSnapshot !== null && configSnapshotsMatch(inputConfig, runtimeConfigSourceSnapshot);
	return () => (followsRuntimeConfig ? runtimeConfigSnapshot : null) ?? inputConfig;
}
function setRuntimeConfigSnapshotRefreshHandler(refreshHandler) {
	runtimeConfigSnapshotRefreshHandler = refreshHandler;
}
function getRuntimeConfigSnapshotRefreshHandler() {
	return runtimeConfigSnapshotRefreshHandler;
}
function registerRuntimeConfigWriteListener(listener) {
	runtimeConfigWriteListeners.add(listener);
	return () => {
		runtimeConfigWriteListeners.delete(listener);
	};
}
function registerManagedRuntimeConfigWriteOwner(configPath, preflight, prepareSnapshot) {
	const owner = {
		id: Symbol("managed-runtime-config-write-owner"),
		preflight,
		prepareSnapshot
	};
	const owners = managedRuntimeConfigWriteOwners.get(configPath) ?? /* @__PURE__ */ new Set();
	owners.add(owner);
	managedRuntimeConfigWriteOwners.set(configPath, owners);
	let released = false;
	const unregister = () => {
		if (released) return;
		released = true;
		const currentOwners = managedRuntimeConfigWriteOwners.get(configPath);
		currentOwners?.delete(owner);
		if (!currentOwners || currentOwners.size === 0) managedRuntimeConfigWriteOwners.delete(configPath);
	};
	return Object.assign(unregister, { ownerId: owner.id });
}
/** A read retains one exact host owner; release cannot redirect it to a replacement. */
function captureManagedConfigSnapshotPreparation(configPath) {
	const scoped = getScopedConfigSnapshotPreparation(configPath);
	const owner = [...managedRuntimeConfigWriteOwners.get(configPath) ?? []].find((candidate) => candidate.prepareSnapshot);
	const prepare = scoped?.prepare ?? owner?.prepareSnapshot;
	if (!prepare) return null;
	const isCurrent = scoped?.isCurrent ?? (() => Boolean(owner && managedRuntimeConfigWriteOwners.get(configPath)?.has(owner)));
	const assertCurrent = () => {
		if (!isCurrent()) throw new Error("Gateway config snapshot preparation owner has closed");
	};
	const run = async (operation) => {
		assertCurrent();
		try {
			return await operation(prepare);
		} finally {
			assertCurrent();
		}
	};
	return Object.assign(run, { assertCurrent });
}
async function preflightManagedRuntimeConfigWrite(configPath, sourceConfig, refreshOptions) {
	const owners = managedRuntimeConfigWriteOwners.get(configPath);
	if (!owners) {
		if (refreshOptions?.requireImmediateApplication) throw new Error("The Gateway cannot apply this activation. Start the Gateway, then retry the saved sign-in.");
		return /* @__PURE__ */ new Map();
	}
	const preparedCandidates = /* @__PURE__ */ new Map();
	for (const owner of owners) if (owner.preflight) preparedCandidates.set(owner.id, await owner.preflight(sourceConfig, refreshOptions));
	return preparedCandidates;
}
function hasManagedRuntimeConfigWriteOwner(configPath) {
	return managedRuntimeConfigWriteOwners.has(configPath);
}
function notifyRuntimeConfigWriteListeners(event) {
	for (const listener of runtimeConfigWriteListeners) try {
		listener(event);
	} catch {}
}
function loadPinnedRuntimeConfig(loadFresh) {
	if (runtimeConfigSnapshot) return runtimeConfigSnapshot;
	const config = loadFresh();
	setRuntimeConfigSnapshot(config);
	return getRuntimeConfigSnapshot() ?? config;
}
async function loadPinnedRuntimeConfigAsync(loadFresh, options = {}) {
	const result = (config) => options.capture ? captureRuntimeConfigRead(config, runtimeConfigSourceSnapshot ?? config) : config;
	options.assertCurrent?.();
	if (runtimeConfigSnapshot) return result(runtimeConfigSnapshot);
	const generation = runtimeConfigSnapshotGeneration;
	const assertCurrent = () => {
		options.assertCurrent?.();
		if (runtimeConfigSnapshotGeneration !== generation) throw new Error("Runtime config load was superseded before publication");
	};
	try {
		const { config, runtimeEnv } = await loadFresh(assertCurrent);
		options.assertCurrent?.();
		if (runtimeConfigSnapshot) return result(runtimeConfigSnapshot);
		assertCurrent();
		const commit = await prepareRuntimeConfigSnapshot(config, { env: runtimeEnv?.env }, options.assertCurrent);
		options.assertCurrent?.();
		if (runtimeConfigSnapshot) return result(runtimeConfigSnapshot);
		assertCurrent();
		const publication = runtimeEnv?.publish();
		try {
			assertCurrent();
			if (!commit()) throw new Error("Runtime config preparation was superseded before publication");
			publication?.commit();
		} catch (error) {
			publication?.();
			throw error;
		}
		return result(getRuntimeConfigSnapshot() ?? config);
	} catch (error) {
		options.assertCurrent?.();
		if (runtimeConfigSnapshot) return result(runtimeConfigSnapshot);
		throw error;
	}
}
async function preflightRuntimeSnapshotWrite(params) {
	if (params.refreshOptions?.requireImmediateApplication) throw new Error("The Gateway cannot apply this activation. Start the Gateway, then retry the saved sign-in.");
	const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
	if (!refreshHandler?.preflight) return;
	try {
		return await refreshHandler.preflight({
			sourceConfig: params.nextSourceConfig,
			...params.refreshOptions
		});
	} catch (error) {
		throw params.createRefreshError(params.formatRefreshError(error), error);
	}
}
async function finalizeRuntimeSnapshotWrite(params) {
	const notifyCommittedWrite = () => {
		params.assertCurrent?.();
		params.notifyCommittedWrite();
	};
	params.assertCurrent?.();
	if (params.deferRuntimeActivation) {
		notifyCommittedWrite();
		return;
	}
	const generation = runtimeConfigSnapshotGeneration;
	const refreshHandler = getRuntimeConfigSnapshotRefreshHandler();
	if (refreshHandler) {
		let refreshed;
		try {
			refreshed = await refreshHandler.refresh({
				sourceConfig: params.nextSourceConfig,
				...params.refreshOptions,
				preflightResult: params.preflightResult,
				...params.assertCurrent ? { assertCurrent: params.assertCurrent } : {}
			});
		} catch (error) {
			params.assertCurrent?.();
			try {
				refreshHandler.clearOnRefreshFailure?.();
			} catch {}
			throw params.createRefreshError(params.formatRefreshError(error), error);
		}
		params.assertCurrent?.();
		if (refreshed) {
			notifyCommittedWrite();
			return;
		}
	}
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (runtimeConfigSnapshotGeneration !== generation) throw new Error("Runtime config reload was superseded before publication");
	};
	const { config, runtimeEnv } = typeof params.freshConfig === "function" ? await params.freshConfig(assertCurrent) : { config: params.freshConfig };
	assertCurrent();
	const publication = runtimeEnv?.publish();
	try {
		assertCurrent();
		setRuntimeConfigSnapshot(config, params.hadBothSnapshots ? params.nextSourceConfig : void 0);
		publication?.commit();
	} catch (error) {
		publication?.();
		throw error;
	}
	notifyCommittedWrite();
}
//#endregion
export { setRuntimeConfigSnapshotRefreshHandler as A, resolveConfigWriteAfterWrite as C, setAppliedRuntimeConfigSnapshot as D, selectApplicableRuntimeConfig as E, captureRuntimeConfigWithSource as M, getRuntimeConfigCapture as N, setRuntimeConfigAppliedHash as O, resetConfigRuntimeState as S, resolveRuntimeConfigCacheKey as T, preflightRuntimeSnapshotWrite as _, finalizeRuntimeSnapshotWrite as a, registerRuntimeConfigSnapshotPreparer as b, getRuntimeConfigSnapshotMetadata as c, hasManagedRuntimeConfigWriteOwner as d, hashRuntimeConfigValue as f, preflightManagedRuntimeConfigWrite as g, notifyRuntimeConfigWriteListeners as h, createRuntimeConfigWriteNotification as i, setRuntimeConfigSourceSnapshotIfCurrent as j, setRuntimeConfigSnapshot as k, getRuntimeConfigSnapshotRefreshHandler as l, loadPinnedRuntimeConfigAsync as m, clearRuntimeConfigSnapshot as n, getRuntimeConfigAppliedHash as o, loadPinnedRuntimeConfig as p, createRuntimeConfigReader as r, getRuntimeConfigSnapshot as s, captureManagedConfigSnapshotPreparation as t, getRuntimeConfigSourceSnapshot as u, projectRuntimeConfigWritePreparedCandidates as v, resolveConfigWriteFollowUp as w, registerRuntimeConfigWriteListener as x, registerManagedRuntimeConfigWriteOwner as y };
