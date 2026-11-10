import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import "./config-env-vars-BHneg24Q.mjs";
import { n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { t as observeOwnedDirectory } from "./owned-directory-observation-DGvnK2He.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { d as readOpenClawAgentDatabaseRegistryToken, u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { r as captureSessionStoreReadCandidate, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { u as shouldSkipDiscoveryError } from "./targets-DJGC6v85.mjs";
import { t as createExistingAgentSessionStoreTargetResolver } from "./targets-discovery.native-C3KQIMj6.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as resolveGatewaySessionStoreLookupCandidates } from "./session-utils-store-candidates-DoVKUG44.mjs";
import path from "node:path";
//#region src/gateway/session-utils-store-sources.ts
function captureSessionStoreRouting(cfg) {
	return withAgentRosterFactsBatch(cfg, () => ({
		agentIds: listConfiguredSessionStoreAgentIds(cfg),
		store: cfg.session?.store,
		compatibilityAgentId: resolveSessionStoreCompatibilityAgentId(cfg)
	}));
}
function sessionStoreRoutingConfig(routing) {
	return {
		agents: {
			ownership: "explicit",
			entries: Object.fromEntries(routing.agentIds.map((agentId) => [agentId, {}])),
			defaults: { sessionStore: { agentId: routing.compatibilityAgentId } }
		},
		session: { store: routing.store }
	};
}
function storeChanged() {
	return /* @__PURE__ */ new Error("Session store changed while preparing its metadata. Retry the request.");
}
/** Native discovery policy shared by synchronous readers and the admitted history worker. */
function resolveGatewaySessionStoreReadSources(params) {
	const cfg = sessionStoreRoutingConfig(params.routing);
	return withAgentRosterFactsBatch(cfg, () => {
		const registered = params.registeredDatabases.filter((entry) => entry.schemaVersion === 27);
		const agentIds = /* @__PURE__ */ new Set([...listConfiguredSessionStoreAgentIds(cfg), ...registered.map((entry) => entry.agentId)]);
		const isSameDatabasePath = createOpenClawAgentDatabasePathMatcher();
		const resolveExistingTargets = createExistingAgentSessionStoreTargetResolver(cfg, {
			env: params.env,
			registeredDatabases: registered,
			readCandidates: params.candidates,
			isSameDatabasePath
		});
		const sources = /* @__PURE__ */ new Map();
		const bindCurrentSource = (source) => {
			if (params.candidates) assertSessionStoreReadCandidate(source.path, params.candidates);
			isSameDatabasePath(source.path, source.path);
			return source.agentId === params.currentSource.agentId && isSameDatabasePath(source.path, params.currentSource.path) ? params.currentSource : source;
		};
		for (const agentId of agentIds) {
			let resolved;
			let exactRegisteredSources = false;
			try {
				const { candidates, readSources } = resolveGatewaySessionStoreLookupCandidates({
					...params,
					cfg,
					agentId,
					registeredDatabases: registered,
					resolveExistingTargets
				});
				resolved = [];
				if (readSources) {
					exactRegisteredSources = true;
					resolved = readSources;
				} else for (const candidate of candidates) {
					const target = resolveSqliteTargetFromSessionStorePath(candidate.storePath, {
						agentId: candidate.agentId,
						defaultAgentId: resolveSessionStoreCompatibilityAgentId(cfg),
						env: params.env,
						registeredDatabases: registered,
						readCandidates: params.candidates,
						isSameDatabasePath
					});
					if (target.ownerSource === "ambiguous-registry") {
						resolved.length = 0;
						break;
					}
					resolved.push({
						agentId: target.agentId ?? candidate.agentId,
						path: target.path
					});
				}
				const bound = [];
				for (const source of resolved) {
					const current = bindCurrentSource(source);
					if (!bound.some((previous) => (!exactRegisteredSources || previous.agentId === current.agentId) && isSameDatabasePath(previous.path, current.path))) bound.push(current);
				}
				sources.set(agentId, bound);
			} catch {
				sources.set(agentId, []);
				continue;
			}
		}
		return {
			sources: Object.fromEntries(sources),
			isCurrent: () => isSameDatabasePath.isCurrent()
		};
	});
}
const sourcePreparations = /* @__PURE__ */ new Map();
registerOpenClawStateDatabaseAsyncResource({ close: async () => {
	for (const [key, memo] of sourcePreparations) retireSourcePreparation(key, memo);
} });
function retireSourcePreparation(key, memo) {
	memo.current = false;
	for (const observation of memo.observations.values()) observation.close();
	memo.observations.clear();
	if (sourcePreparations.get(key) === memo) sourcePreparations.delete(key);
}
function observeSourcePath(key, memo, pathname) {
	if (!memo.current) return;
	let child = path.resolve(pathname);
	for (;;) {
		const directory = path.dirname(child);
		if (directory === child) return;
		const name = path.basename(child);
		const observationKey = JSON.stringify([directory, name]);
		if (!memo.observations.has(observationKey)) memo.observations.set(observationKey, observeOwnedDirectory(directory, (filename) => {
			if (!memo.current || memo.observedThisTurn) return;
			if (filename === void 0 || (process.platform === "win32" ? filename.toLowerCase() === name.toLowerCase() : filename === name)) {
				memo.observedThisTurn = true;
				queueMicrotask(() => {
					memo.observedThisTurn = false;
				});
				try {
					if (memo.pathsCurrent && !memo.pathsCurrent()) retireSourcePreparation(key, memo);
				} catch {
					retireSourcePreparation(key, memo);
				}
			}
		}, { recoveryIntervalMs: 3e4 }));
		child = directory;
	}
}
/** Retain discovery facts; registry receipts and directory observations revoke their generation. */
async function prepareGatewaySessionStoreReadSourcesAsync(params, signal) {
	signal?.throwIfAborted();
	const routing = captureSessionStoreRouting(params.cfg);
	const env = captureSessionTranscriptStorageEnvironment(params.env);
	const registryOptions = {
		env,
		path: path.resolve(params.registryPath)
	};
	const registry = readOpenClawAgentDatabaseRegistryToken(registryOptions);
	const key = JSON.stringify([
		routing,
		env,
		params.currentSource,
		registryOptions.path
	]);
	let memo = sourcePreparations.get(key);
	if (memo && memo.registry !== registry) {
		retireSourcePreparation(key, memo);
		memo = void 0;
	}
	if (!memo) {
		const created = {
			registry,
			current: true,
			observations: /* @__PURE__ */ new Map(),
			prepared: Promise.resolve(void 0)
		};
		memo = created;
		sourcePreparations.set(key, created);
		created.prepared = prepareSourceRequest({
			...params,
			registryPath: registryOptions.path
		}, routing, env, created, (pathname) => observeSourcePath(key, created, pathname)).catch((error) => {
			retireSourcePreparation(key, created);
			throw error;
		});
		while (sourcePreparations.size > 128) {
			const [oldestKey, oldest] = sourcePreparations.entries().next().value;
			retireSourcePreparation(oldestKey, oldest);
		}
	}
	const request = await racePromiseWithAbortSignal(memo.prepared, signal, (aborted) => aborted.reason);
	signal?.throwIfAborted();
	const captured = memo;
	const assertCurrent = () => {
		if (!captured.current || captured.registry !== readOpenClawAgentDatabaseRegistryToken(registryOptions)) {
			retireSourcePreparation(key, captured);
			throw storeChanged();
		}
	};
	assertCurrent();
	return {
		request: request && structuredClone(request),
		assertCurrent
	};
}
async function prepareSourceRequest(params, routing, env, memo, observe) {
	const paths = createOpenClawAgentDatabasePathMatcher();
	memo.pathsCurrent = () => paths.isCurrent();
	paths(params.registryPath, params.registryPath);
	observe(params.registryPath);
	const inventory = prepareSessionStoreTargetInventory(sessionStoreRoutingConfig(routing), routing.agentIds, env);
	const currentSource = { ...params.currentSource };
	paths(currentSource.path, currentSource.path);
	observe(currentSource.path);
	const candidates = /* @__PURE__ */ new Map();
	const capture = (candidate) => {
		try {
			paths(candidate.path, candidate.path);
		} catch (error) {
			if (!shouldSkipDiscoveryError(error)) throw error;
			return;
		}
		observe(candidate.path);
		observe(candidate.physicalPath);
		candidates.set(JSON.stringify(candidate), candidate);
	};
	inventory.candidates.forEach(capture);
	capture(captureSessionStoreReadCandidate(currentSource.path));
	const registry = await prepareOpenClawAgentDatabaseRegistrySnapshotRead({
		env,
		path: params.registryPath,
		includeIncompatibleSchemaVersions: true
	}).read();
	if (!memo.current) throw storeChanged();
	const original = registry.result;
	const registeredDatabases = original.status === "available" ? original.entries.map(({ agentId, path: databasePath, schemaVersion }) => ({
		agentId,
		path: databasePath,
		schemaVersion
	})) : void 0;
	for (const registered of registeredDatabases ?? []) if (registered.schemaVersion === 27) capture(captureSessionStoreReadCandidate(registered.path));
	if (!paths.isCurrent()) throw storeChanged();
	registry.assertCurrent();
	memo.registry = readOpenClawAgentDatabaseRegistryToken({
		env,
		path: params.registryPath
	});
	return registeredDatabases ? {
		routing,
		currentSource,
		env,
		registeredDatabases,
		candidates: [...candidates.values()]
	} : void 0;
}
//#endregion
export { resolveGatewaySessionStoreReadSources as n, prepareGatewaySessionStoreReadSourcesAsync as t };
