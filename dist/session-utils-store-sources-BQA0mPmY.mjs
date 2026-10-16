import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { S as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead, l as readOpenClawAgentDatabaseRegistryToken, s as listOpenClawRegisteredAgentDatabases, t as AgentDatabaseRegistryChangedError } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { c as captureSessionStoreReadCandidate, o as resolveSqliteTargetFromSessionStorePath, s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { d as shouldSkipDiscoveryError, t as createExistingAgentSessionStoreTargetResolver } from "./targets-BbcRkdUC.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { n as resolveGatewaySessionStoreLookupCandidates } from "./session-utils-store-candidates-Dcn6yumd.mjs";
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
function sameRegistrations(left, right) {
	return left.length === right.length && left.every((entry, index) => {
		const previous = right[index];
		return entry.agentId === previous.agentId && entry.path === previous.path && entry.schemaVersion === previous.schemaVersion;
	});
}
function storeChanged() {
	return /* @__PURE__ */ new Error("Session store changed while preparing its metadata. Retry the request.");
}
/** Native discovery policy shared by synchronous readers and the admitted history worker. */
function resolveGatewaySessionStoreReadSources(params) {
	const cfg = sessionStoreRoutingConfig(params.routing);
	return withAgentRosterFactsBatch(cfg, () => {
		const registered = params.registeredDatabases.filter((entry) => entry.schemaVersion === 24);
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
/** Bind candidate addresses once; registry metadata uses its existing invalidation owner. */
function prepareGatewaySessionStoreReadSources(params) {
	const registryOptions = {
		env: cloneEnvWithPlatformSemantics(params.env),
		path: params.registryPath,
		includeIncompatibleSchemaVersions: true
	};
	const currentSource = params.currentSource;
	const currentSourceAgentId = currentSource.agentId;
	const currentSourcePath = currentSource.path;
	let discoveryIsCurrent;
	let registryToken = readOpenClawAgentDatabaseRegistryToken(registryOptions);
	const assertCurrent = () => {
		const currentToken = readOpenClawAgentDatabaseRegistryToken(registryOptions);
		if (currentToken === registryToken) return;
		try {
			if (discoveryIsCurrent?.()) {
				registryToken = currentToken;
				return;
			}
		} catch {}
		throw new Error("Session store changed while preparing its metadata. Retry the request.");
	};
	return {
		sources: withAgentRosterFactsBatch(params.cfg, () => {
			let registered;
			try {
				registered = listOpenClawRegisteredAgentDatabases(registryOptions);
			} catch {
				return {};
			}
			const registryFacts = registered;
			const resolved = resolveGatewaySessionStoreReadSources({
				routing: captureSessionStoreRouting(params.cfg),
				currentSource,
				env: params.env,
				registeredDatabases: registered
			});
			discoveryIsCurrent = () => {
				const current = listOpenClawRegisteredAgentDatabases(registryOptions);
				return currentSource.agentId === currentSourceAgentId && currentSource.path === currentSourcePath && sameRegistrations(current, registryFacts) && resolved.isCurrent();
			};
			return resolved.sources;
		}),
		assertCurrent
	};
}
/** Capture source routing for the existing history worker; no native discovery runs here. */
async function prepareGatewaySessionStoreReadSourcesAsync(params, signal) {
	signal?.throwIfAborted();
	const routing = captureSessionStoreRouting(params.cfg);
	const env = captureSessionTranscriptStorageEnvironment(params.env);
	const inventory = prepareSessionStoreTargetInventory(sessionStoreRoutingConfig(routing), routing.agentIds, env);
	const currentSource = { ...params.currentSource };
	const paths = createOpenClawAgentDatabasePathMatcher();
	paths(currentSource.path, currentSource.path);
	const candidates = /* @__PURE__ */ new Map();
	const unavailablePaths = /* @__PURE__ */ new Set();
	const capture = (candidate) => {
		if (unavailablePaths.has(candidate.path)) return;
		try {
			paths(candidate.path, candidate.path);
		} catch (error) {
			if (!shouldSkipDiscoveryError(error)) throw error;
			unavailablePaths.add(candidate.path);
			return;
		}
		candidates.set(JSON.stringify(candidate), candidate);
	};
	inventory.candidates.forEach(capture);
	capture(captureSessionStoreReadCandidate(currentSource.path));
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({
		env,
		path: params.registryPath,
		includeIncompatibleSchemaVersions: true
	});
	const assertSourceCurrent = () => {
		if (params.currentSource.agentId !== currentSource.agentId || params.currentSource.path !== currentSource.path || !paths.isCurrent()) throw storeChanged();
	};
	const readRegistry = async (assertCallerCurrent, readSignal) => {
		for (let attempt = 0;; attempt++) {
			assertCallerCurrent?.();
			assertSourceCurrent();
			try {
				const current = await registryRead.read(readSignal);
				assertCallerCurrent?.();
				assertSourceCurrent();
				current.assertCurrent();
				return current;
			} catch (error) {
				if (!(error instanceof AgentDatabaseRegistryChangedError) || attempt >= 2) throw error;
			}
		}
	};
	let registry = await readRegistry(void 0, signal);
	const original = registry.result;
	const assertCurrent = () => {
		assertSourceCurrent();
		try {
			registry.assertCurrent();
		} catch (error) {
			if (error instanceof AgentDatabaseRegistryChangedError) throw storeChanged();
			throw error;
		}
	};
	assertCurrent();
	const registeredDatabases = original.status === "available" ? original.entries.map(({ agentId, path, schemaVersion }) => ({
		agentId,
		path,
		schemaVersion
	})) : void 0;
	for (const registered of registeredDatabases ?? []) if (registered.schemaVersion === 24) capture(captureSessionStoreReadCandidate(registered.path));
	return {
		request: registeredDatabases ? {
			routing,
			currentSource,
			env,
			registeredDatabases,
			candidates: [...candidates.values()]
		} : void 0,
		assertSourceCurrent,
		assertCurrent,
		async revalidate(assertCallerCurrent) {
			assertCallerCurrent();
			assertSourceCurrent();
			try {
				registry.assertCurrent();
				return;
			} catch (error) {
				if (!(error instanceof AgentDatabaseRegistryChangedError)) throw error;
			}
			const current = await readRegistry(assertCallerCurrent, signal);
			assertCallerCurrent();
			assertSourceCurrent();
			current.assertCurrent();
			if (current.result.status !== original.status || current.result.status === "available" && original.status === "available" && !sameRegistrations(current.result.entries, original.entries)) throw storeChanged();
			registry = current;
		}
	};
}
//#endregion
export { prepareGatewaySessionStoreReadSourcesAsync as n, resolveGatewaySessionStoreReadSources as r, prepareGatewaySessionStoreReadSources as t };
