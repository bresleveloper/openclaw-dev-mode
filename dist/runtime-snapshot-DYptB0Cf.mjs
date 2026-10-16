import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { t as clearExecutablePathCache } from "./executable-path-CP2HPhgU.mjs";
import { d as resetPublishedConfigRuntimeEnv, r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as isDeeplyFrozenPlainData, t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts, r as copyConfigResolutionFacts, t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { d as prepareRuntimePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { r as resolveChannelConfigActivationFacts } from "./channel-config-activation-CjIoaWiA.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { t as getScopedConfigSnapshotPreparation } from "./io.snapshot-preparation-scope-CebMPnB-.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/runtime-config-capture-state.ts
const captures = /* @__PURE__ */ new WeakMap();
function getRuntimeConfigCapture(config) {
	return config ? captures.get(config) : void 0;
}
/** Freeze a selected runtime/source pair before its publication owner yields. */
function captureRuntimeConfigWithSource(config, source) {
	const clone = (value) => freezeJsonSnapshot(cloneConfigWithResolutionFacts(value));
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
//#endregion
//#region src/config/runtime-config-snapshot-match.ts
/** Serialize a value with object keys sorted, so equal data always yields the same bytes. */
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
//#endregion
//#region packages/model-catalog-core/src/configured-model-refs.ts
/** Agent config keys that can contain direct model references. */
const AGENT_MODEL_CONFIG_KEYS = [
	"model",
	"utilityModel",
	"imageModel",
	"voiceModel",
	"pdfModel"
];
/** Visit raw selector refs without changing values, order, or fallback indices. */
function visitModelSelectorRefs(value, path, visit) {
	if (typeof value === "string") {
		visit(path, value, "primary");
		return;
	}
	if (!isRecord(value)) return;
	if (typeof value.primary === "string") visit(`${path}.primary`, value.primary, "primary");
	if (Array.isArray(value.fallbacks)) {
		for (const [index, fallback] of value.fallbacks.entries()) if (typeof fallback === "string") visit(`${path}.fallbacks.${index}`, fallback, "fallback");
	}
}
/** List raw refs from one string or primary/fallback model selector. */
function listModelRefsFromConfigValue(value) {
	const refs = [];
	visitModelSelectorRefs(value, "", (_path, ref) => refs.push(ref));
	return refs;
}
/** Collect configured model references from agents, tools, channels, hooks, and message config. */
function collectConfiguredModelRefs(config, options = {}) {
	const refs = [];
	const pushModelRef = (path, value, kind) => {
		if (typeof value === "string" && value.trim()) refs.push({
			path,
			value: value.trim(),
			kind
		});
	};
	const collectModelConfig = (path, value, kind) => visitModelSelectorRefs(value, path, (refPath, ref) => pushModelRef(refPath, ref, kind));
	const collectFromAgent = (path, agent, includeEntrySelectors = false) => {
		if (!isRecord(agent)) return;
		for (const key of AGENT_MODEL_CONFIG_KEYS) collectModelConfig(`${path}.${key}`, agent[key], key === "voiceModel" ? "literal" : "selector");
		const mediaModels = asNonArrayRecord(agent.mediaModels);
		for (const capability of [
			"image",
			"video",
			"music"
		]) collectModelConfig(`${path}.mediaModels.${capability}`, mediaModels[capability], "literal");
		pushModelRef(`${path}.heartbeat.model`, asOptionalRecord(agent.heartbeat)?.model, "selector");
		collectModelConfig(`${path}.subagents.model`, asOptionalRecord(agent.subagents)?.model, "selector");
		if (isRecord(agent.compaction)) {
			pushModelRef(`${path}.compaction.model`, agent.compaction.model, "selector");
			pushModelRef(`${path}.compaction.memoryFlush.model`, asOptionalRecord(agent.compaction.memoryFlush)?.model, "selector");
		}
		if (isRecord(agent.models)) for (const modelRef of Object.keys(agent.models)) pushModelRef(`${path}.models.${modelRef}`, modelRef, "literal");
		if (includeEntrySelectors) {
			const tools = asNonArrayRecord(agent.tools);
			const exec = asNonArrayRecord(tools.exec);
			collectModelConfig(`${path}.tools.exec.reviewer.model`, asOptionalRecord(exec.reviewer)?.model, "selector");
			pushModelRef(`${path}.tts.summaryModel`, asOptionalRecord(agent.tts)?.summaryModel, "selector");
		}
	};
	const root = asNonArrayRecord(config);
	const tools = asNonArrayRecord(root.tools);
	const exec = asNonArrayRecord(tools.exec);
	collectModelConfig("tools.exec.reviewer.model", asOptionalRecord(exec.reviewer)?.model, "selector");
	const media = asNonArrayRecord(tools.media);
	for (const capability of [
		"image",
		"audio",
		"video"
	]) pushModelRef(`tools.media.${capability}.preferredModel`, asOptionalRecord(media[capability])?.preferredModel, "literal");
	const agents = asNonArrayRecord(root.agents);
	collectFromAgent("agents.defaults", agents.defaults);
	if (Object.hasOwn(agents, "entries")) {
		if (isRecord(agents.entries)) for (const [agentId, entry] of Object.entries(agents.entries)) collectFromAgent(`agents.entries.${agentId}`, entry, true);
	} else if (Array.isArray(agents.list)) for (const [index, entry] of agents.list.entries()) collectFromAgent(`agents.list.${index}`, entry, true);
	if (options.includeChannelModelOverrides !== false) {
		const channels = asNonArrayRecord(root.channels);
		const modelByChannel = asNonArrayRecord(channels.modelByChannel);
		for (const [channelId, channelMap] of Object.entries(modelByChannel)) {
			if (!isRecord(channelMap)) continue;
			for (const [targetId, modelRef] of Object.entries(channelMap)) pushModelRef(`channels.modelByChannel.${channelId}.${targetId}`, modelRef, "selector");
		}
	}
	const hooks = asNonArrayRecord(root.hooks);
	if (Array.isArray(hooks.mappings)) for (const [index, mapping] of hooks.mappings.entries()) pushModelRef(`hooks.mappings.${index}.model`, asOptionalRecord(mapping)?.model, "selector");
	pushModelRef("hooks.gmail.model", asOptionalRecord(hooks.gmail)?.model, "selector");
	pushModelRef("tts.summaryModel", asOptionalRecord(root.tts)?.summaryModel, "selector");
	const discord = asNonArrayRecord(asNonArrayRecord(root.channels).discord);
	const collectDiscordVoice = (path, value) => {
		const voice = asNonArrayRecord(value);
		pushModelRef(`${path}.model`, voice.model, "selector");
		pushModelRef(`${path}.tts.summaryModel`, asOptionalRecord(voice.tts)?.summaryModel, "selector");
	};
	collectDiscordVoice("channels.discord.voice", discord.voice);
	if (isRecord(discord.accounts)) for (const [accountId, account] of Object.entries(discord.accounts)) collectDiscordVoice(`channels.discord.accounts.${accountId}.voice`, asOptionalRecord(account)?.voice);
	return refs;
}
/** Collect only configured model reference values. */
function collectConfiguredModelRefValues(config, options) {
	return collectConfiguredModelRefs(config, options).map((ref) => ref.value);
}
//#endregion
//#region src/config/runtime-session-changes.ts
function projectionConfig({ meta: _meta, wizard: _wizard, logging: _logging, diagnostics: _diagnostics, update: _update, telemetry: _telemetry, channels, ui, gateway, talk, ...config }) {
	const { prefs: _prefs, ...uiConfig } = ui ?? {};
	const { auth, ...gatewayConfig } = gateway ?? {};
	const { identityScopes: _identityScopes, ...authConfig } = auth ?? {};
	const { realtime, ...talkConfig } = talk ?? {};
	const { model: _realtimeModel, ...realtimeConfig } = realtime ?? {};
	return {
		...config,
		channels: {
			activation: resolveChannelConfigActivationFacts({ channels }),
			models: collectConfiguredModelRefs({ channels })
		},
		ui: uiConfig,
		gateway: {
			...gatewayConfig,
			auth: authConfig
		},
		talk: {
			...talkConfig,
			realtime: realtimeConfig
		}
	};
}
function withoutAgentIdentities(config) {
	const agents = config.agents;
	const withoutIdentity = ({ identity: _identity, ...entry }) => entry;
	return {
		...config,
		agents: agents && {
			...agents,
			entries: agents.entries && Object.fromEntries(Object.entries(agents.entries).map(([id, entry]) => [id, withoutIdentity(entry)]))
		}
	};
}
/** Classify once at committed config publication; consumers retain their prepared facts. */
function runtimeSessionChangeScope(previous, next) {
	if (!previous || previous === next || !isDeepStrictEqual(serializeConfigResolutionFacts(previous), serializeConfigResolutionFacts(next))) return "config";
	const before = projectionConfig(previous);
	const after = projectionConfig(next);
	if (isDeepStrictEqual(before, after)) return "config-presentation";
	return isDeepStrictEqual(withoutAgentIdentities(before), withoutAgentIdentities(after)) ? "config-profiles" : "config";
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
let runtimeConfigSnapshot = null;
let runtimeConfigCapturedSnapshot = null;
let runtimeConfigSourceSnapshot = null;
let runtimeConfigSnapshotMetadata = null;
let runtimeConfigPublishedFacts = null;
let runtimeConfigAppliedHash = null;
let runtimeConfigSnapshotRevision = 0;
let runtimeConfigSnapshotGeneration = 0;
let runtimeConfigPreparerGeneration = 0;
let runtimeConfigSnapshotRefreshHandler = null;
const managedRuntimeConfigWriteOwners = /* @__PURE__ */ new Map();
const runtimeConfigWriteListeners = /* @__PURE__ */ new Set();
const runtimeConfigSnapshotPreparers = /* @__PURE__ */ new Map();
const immutableConfigHashes = /* @__PURE__ */ new WeakMap();
function hashRuntimeConfigValue(value) {
	const immutable = isDeeplyFrozenPlainData(value);
	const cached = immutable ? immutableConfigHashes.get(value) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = sha256Base64Url(stableConfigStringify(value));
	if (immutable) immutableConfigHashes.set(value, fingerprint);
	return fingerprint;
}
function setRuntimeConfigSnapshot(config, sourceConfig) {
	preparePublishedRuntimeConfigSnapshot(config, sourceConfig, false);
}
function preparePublishedRuntimeConfigSnapshot(inputConfig, sourceConfig, valuesUnchanged) {
	const config = getRuntimeConfigCapture(inputConfig) ? cloneConfigWithResolutionFacts(inputConfig) : inputConfig;
	const factSource = getConfigResolutionFacts(config) !== null ? config : sourceConfig ?? config;
	copyConfigResolutionFacts(factSource, config);
	for (const prepare of runtimeConfigSnapshotPreparers.keys()) prepare(config);
	publishRuntimeConfigSnapshot(config, sourceConfig, valuesUnchanged);
}
function publishRuntimeConfigSnapshot(config, sourceConfig, valuesUnchanged = false) {
	const metadata = {
		revision: ++runtimeConfigSnapshotRevision,
		fingerprint: hashRuntimeConfigValue(config),
		sourceFingerprint: sourceConfig ? hashRuntimeConfigValue(sourceConfig) : null,
		updatedAtMs: Date.now()
	};
	const facts = serializeConfigResolutionFacts(config);
	const scope = runtimeConfigSnapshot !== null && runtimeConfigSnapshotMetadata !== null && (hashRuntimeConfigValue(runtimeConfigSnapshot) !== runtimeConfigSnapshotMetadata.fingerprint || !isDeepStrictEqual(serializeConfigResolutionFacts(runtimeConfigSnapshot), runtimeConfigPublishedFacts)) ? "config" : runtimeSessionChangeScope(runtimeConfigSnapshot, config);
	const matchesPublished = runtimeConfigSnapshot !== config && runtimeConfigSnapshotMetadata?.fingerprint === metadata.fingerprint && isDeepStrictEqual(runtimeConfigPublishedFacts, facts);
	prepareRuntimePluginsConfig(config);
	runtimeConfigSnapshotGeneration += 1;
	clearExecutablePathCache();
	runtimeConfigSnapshot = config;
	runtimeConfigCapturedSnapshot = null;
	runtimeConfigSourceSnapshot = sourceConfig ?? null;
	runtimeConfigSnapshotMetadata = metadata;
	runtimeConfigPublishedFacts = facts;
	if (!valuesUnchanged && !matchesPublished) sessionChanges.emit({
		all: true,
		scope
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
async function prepareRuntimeConfigSnapshot(inputConfig, context = {}, assertCurrent) {
	const config = getRuntimeConfigCapture(inputConfig) ? cloneConfigWithResolutionFacts(inputConfig) : inputConfig;
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
	const published = runtimeConfigSnapshot;
	const sourceFacts = serializeConfigResolutionFacts(params.sourceConfig);
	const valuesUnchanged = hashRuntimeConfigValue(published) === runtimeConfigSnapshotMetadata.fingerprint && isDeepStrictEqual(runtimeConfigPublishedFacts, sourceFacts);
	copyConfigResolutionFacts(params.sourceConfig, published);
	preparePublishedRuntimeConfigSnapshot(published, params.sourceConfig, valuesUnchanged);
	return true;
}
function resetConfigRuntimeState(options = {}) {
	runtimeConfigSnapshotGeneration += 1;
	clearExecutablePathCache();
	prepareRuntimePluginsConfig(null);
	runtimeConfigSnapshot = null;
	runtimeConfigCapturedSnapshot = null;
	runtimeConfigSourceSnapshot = null;
	runtimeConfigSnapshotMetadata = null;
	runtimeConfigPublishedFacts = null;
	runtimeConfigAppliedHash = null;
	runtimeConfigSnapshotRevision = 0;
	resetPublishedConfigRuntimeEnv({ preserveOwnership: options.preserveConfigEnv });
}
function clearRuntimeConfigSnapshot() {
	resetConfigRuntimeState({ preserveConfigEnv: true });
}
function getRuntimeConfigSnapshot(options) {
	if (options?.capture && runtimeConfigSnapshot) return runtimeConfigCapturedSnapshot ??= captureRuntimeConfigWithSource(runtimeConfigSnapshot, runtimeConfigSourceSnapshot ?? runtimeConfigSnapshot);
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
	return registerListener(runtimeConfigWriteListeners, listener);
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
	const unregister = () => {
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
	notifyListeners(runtimeConfigWriteListeners, event);
}
function loadPinnedRuntimeConfig(loadFresh) {
	if (runtimeConfigSnapshot) return runtimeConfigSnapshot;
	const config = loadFresh();
	setRuntimeConfigSnapshot(config);
	return getRuntimeConfigSnapshot() ?? config;
}
async function loadPinnedRuntimeConfigAsync(loadFresh, options = {}) {
	const result = (config) => options.capture ? {
		config: config === runtimeConfigSnapshot ? getRuntimeConfigSnapshot({ capture: true }) : captureRuntimeConfigWithSource(config, runtimeConfigSourceSnapshot ?? config),
		env: cloneEnvWithPlatformSemantics(process.env)
	} : config;
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
export { AGENT_MODEL_CONFIG_KEYS as A, resolveRuntimeConfigCacheKey as C, setRuntimeConfigSnapshot as D, setRuntimeConfigAppliedHash as E, captureRuntimeConfigWithSource as F, getRuntimeConfigCapture as I, collectConfiguredModelRefs as M, listModelRefsFromConfigValue as N, setRuntimeConfigSnapshotRefreshHandler as O, visitModelSelectorRefs as P, resolveConfigWriteFollowUp as S, setAppliedRuntimeConfigSnapshot as T, registerManagedRuntimeConfigWriteOwner as _, getRuntimeConfigAppliedHash as a, resetConfigRuntimeState as b, getRuntimeConfigSnapshotRefreshHandler as c, hashRuntimeConfigValue as d, loadPinnedRuntimeConfig as f, preflightRuntimeSnapshotWrite as g, preflightManagedRuntimeConfigWrite as h, finalizeRuntimeSnapshotWrite as i, collectConfiguredModelRefValues as j, setRuntimeConfigSourceSnapshotIfCurrent as k, getRuntimeConfigSourceSnapshot as l, notifyRuntimeConfigWriteListeners as m, clearRuntimeConfigSnapshot as n, getRuntimeConfigSnapshot as o, loadPinnedRuntimeConfigAsync as p, createRuntimeConfigReader as r, getRuntimeConfigSnapshotMetadata as s, captureManagedConfigSnapshotPreparation as t, hasManagedRuntimeConfigWriteOwner as u, registerRuntimeConfigSnapshotPreparer as v, selectApplicableRuntimeConfig as w, resolveConfigWriteAfterWrite as x, registerRuntimeConfigWriteListener as y };
