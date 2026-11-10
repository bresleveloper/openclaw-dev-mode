import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { s as matchesAgentDatabaseReadCandidatePath } from "./agent-database-readers-DSwi8tar.mjs";
import { s as registerOpenClawAgentDatabaseReadCandidateResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as SessionCanonicalKeyMigrationRequiredError } from "./session-canonical-key-error-YHax-6is.mjs";
import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { o as isOpenClawAgentDatabaseRegistryChange } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { A as projectSessionSharingEntry, d as readPreparedSessionSharingChange, f as readSessionEntryCreatedEntry, p as readSessionEntryCreationTransition, t as isPreparedSessionSharingChange, v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { i as prepareSessionStoreTargetInventory, r as createSessionStoreRegistryMutationFilter } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as prepareSessionStoreTargetInventoryRead } from "./session-store-target-runtime-D11id0W-.mjs";
import { n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { a as resolveSessionStoreIdentity, n as readSessionRoutingFacts } from "./session-store-key-DKpto8R6.mjs";
import { n as captureSessionSharingMemoryFacts, t as SessionMutationFactsUnavailableError } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as prepareGatewaySessionStoreTargetReadOnly } from "./session-utils-store-lookup-DlW2SGlr.mjs";
import { t as findCanonicalStoreMatch } from "./session-utils-store-selection-DIMLgaMc.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-sharing-facts-read.ts
/** Reuse committed metadata/member facts; only missing rows need creation placeholders. */
async function readSessionSharingFactsInWorker(input, prepareSource) {
	let physicalSource;
	const captureSource = (source, identity) => {
		physicalSource = source;
		prepareSource(source, identity);
	};
	const request = {
		...input,
		projection: "full",
		snapshotFields: [],
		includeMembers: true,
		includeAuthorization: true
	};
	let loaded = await readSessionEntriesFromStoreInWorker(request, captureSource);
	if (loaded.entries.length === 0) loaded = await readSessionEntriesFromStoreInWorker({
		...request,
		projection: "sharing"
	}, captureSource);
	return {
		...loaded,
		sharing: loaded.sharing ?? (loaded.databaseIdentity && physicalSource ? {
			source: physicalSource,
			databaseIdentity: `file:${loaded.databaseIdentity.identity}`,
			placeholders: [],
			members: loaded.entries.map(({ sessionKey }) => ({
				sessionKey,
				identityIds: (loaded.members?.[sessionKey] ?? []).map((member) => member.identityId)
			}))
		} : void 0)
	};
}
//#endregion
//#region src/gateway/session-sharing-memory-facts.ts
function prepareMemorySessionMutationFacts(params, assertRoutingCurrent) {
	const { agentId, canonicalKey } = params;
	let memoryActive = true;
	const memory = captureSessionSharingMemoryFacts({
		agentId,
		sessionKey: canonicalKey,
		resolved: { storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }) }
	}, () => {
		if (!memoryActive) throw new SessionMutationFactsUnavailableError();
	}, Boolean(params.allowMissing));
	if (!memory) return;
	const read = {
		storageTarget: {
			agentId,
			canonicalKey,
			storePath: memory.location.path
		},
		bindCreation() {},
		prepareRead() {},
		readCurrent(cfg) {
			assertRoutingCurrent(cfg);
			return memory.readCurrent();
		},
		release() {
			memoryActive = false;
		}
	};
	const prepare = async () => {
		if (params.storageReady) await params.storageReady;
		read.readCurrent(params.cfg);
		return read;
	};
	return prepare();
}
//#endregion
//#region src/gateway/session-sharing-routing.ts
function captureSessionMutationRouting(cfg, changed = () => new SessionMutationFactsUnavailableError(), targets) {
	const capturedTargets = targets?.length ? targets.map(({ sessionKey, agentId, preserveQualifiedAddress }) => ({
		sessionKey,
		agentId,
		preserveQualifiedAddress
	})) : void 0;
	const route = readSessionRoutingFacts(cfg, capturedTargets);
	return (current) => {
		if (!isDeepStrictEqual(readSessionRoutingFacts(current, capturedTargets), route)) throw changed();
	};
}
//#endregion
//#region src/gateway/session-sharing-preparation.ts
async function prepareSessionMutationFacts(params) {
	const assertRoutingCurrent = captureSessionMutationRouting(params.cfg, void 0, [params]);
	const { canonicalKey, agentId } = resolveSessionStoreIdentity(params);
	const memory = prepareMemorySessionMutationFacts({
		...params,
		agentId,
		canonicalKey
	}, assertRoutingCurrent);
	if (memory) return memory;
	const initialStoreKeys = [params.sessionKey.trim(), canonicalKey];
	const releases = [];
	let active = true;
	let beforeDiscovery = params.storageReady !== void 0;
	let waitingForStorage = false;
	let invalidated = false;
	let facts;
	let assertRegistryPublication;
	let followRegistration;
	let creation;
	let expectedPlaceholder;
	let adoptCreatedEntry;
	let assertSource;
	const selectedPaths = /* @__PURE__ */ new Set();
	const acquiringPaths = /* @__PURE__ */ new Set();
	const acquiringReads = /* @__PURE__ */ new Map();
	const initializedReads = /* @__PURE__ */ new Set();
	const acquireSource = (sourcePath, sessionKeys) => {
		const identity = readDatabasePathIdentitySync(sourcePath);
		if (identity.birthtime === void 0) return;
		acquiringPaths.add(path.resolve(sourcePath));
		acquiringPaths.add(identity.canonicalPath);
		for (const sessionKey of sessionKeys) {
			const key = `${identity.key}\0${sessionKey}`;
			if (!acquiringReads.has(key)) {
				const retained = retainPreparedSessionSharingFacts({
					databaseIdentity: identity.key,
					sessionKey,
					acquiring: true
				});
				acquiringReads.set(key, retained);
				releases.push(retained.release);
			}
		}
		return identity;
	};
	const release = () => {
		if (active) {
			active = false;
			for (const stop of releases.splice(0).toReversed()) stop();
		}
	};
	const retainCandidate = (candidate) => {
		for (const pathname of /* @__PURE__ */ new Set([candidate.path, candidate.physicalPath])) releases.push(registerOpenClawAgentDatabaseReadCandidateResource({
			...candidate,
			path: pathname,
			revoke: release,
			close: async () => release()
		}));
	};
	const assertActive = () => {
		if (!active || invalidated) throw new SessionMutationFactsUnavailableError();
	};
	const invalidate = () => {
		invalidated = true;
	};
	const changed = (change) => {
		if ("all" in change) {
			if (isSessionStoreTopologyChange(change)) {
				if (beforeDiscovery) return;
				if (isOpenClawAgentDatabaseRegistryChange(change) && assertRegistryPublication) try {
					assertRegistryPublication();
				} catch {
					invalidate();
				}
				else invalidate();
				return;
			}
			if (typeof change.scope === "string" && [
				"profiles",
				"catalog",
				"acp",
				"agent-runs",
				"subagent-runs",
				"worker-placements",
				"worker-environments",
				"config",
				"config-presentation",
				"config-profiles"
			].includes(change.scope)) return;
			if (typeof change.scope === "object" && change.scope.agentId && change.scope.agentId !== agentId) return;
			invalidate();
			return;
		}
		if (change.scope === "automation" || change.scope === "acp" || change.agentId && change.agentId !== agentId && !change.storePath || ![...initialStoreKeys, ...facts?.target?.storeKeys ?? []].includes(change.sessionKey)) return;
		if (!change.storePath) return;
		if (facts?.target && !selectedPaths.has(path.resolve(change.storePath))) return;
		if (!change.factsInvalidated && (change.facts?.kind === "unchanged" || change.facts?.kind === "participants" || change.facts?.kind === "category")) return;
		if (active && !invalidated && facts?.target === null && creation && selectedPaths.has(path.resolve(change.storePath))) {
			const placeholder = readSessionEntryCreationTransition(change, creation);
			if (placeholder) try {
				assertSource();
				expectedPlaceholder = placeholder;
				return;
			} catch {
				invalidate();
				return;
			}
			const created = readSessionEntryCreatedEntry(change, creation);
			if (created && adoptCreatedEntry) {
				adoptCreatedEntry(created);
				creation = void 0;
				return;
			}
		}
		if (!facts && acquiringPaths.has(path.resolve(change.storePath)) && isPreparedSessionSharingChange(change)) return;
		if (!facts || facts.target === null || readPreparedSessionSharingChange(change) === void 0) invalidate();
	};
	releases.push(sessionChanges.subscribeFacts(changed), onSessionIdentityMutation((change) => {
		if (change.agentId === agentId && change.previous.sessionKeys.some((key) => initialStoreKeys.includes(key))) invalidate();
	}));
	try {
		const parsedAgent = parseAgentSessionKey(params.sessionKey)?.agentId;
		const discoveryInventory = prepareSessionStoreTargetInventory(params.cfg, [agentId, ...parsedAgent ? [parsedAgent] : []]);
		const candidateIdentities = discoveryInventory.candidates.map((candidate) => ({
			candidate,
			identity: readDatabasePathIdentitySync(candidate.path)
		}));
		const missingCandidates = candidateIdentities.filter(({ identity }) => identity.birthtime === void 0);
		for (const { candidate, identity } of candidateIdentities) if (identity.birthtime !== void 0) {
			retainCandidate(candidate);
			acquireSource(candidate.path, initialStoreKeys);
		}
		if (params.storageReady) {
			waitingForStorage = true;
			await params.storageReady;
			waitingForStorage = false;
			beforeDiscovery = false;
			for (const captured of missingCandidates) captured.identity = readDatabasePathIdentitySync(captured.candidate.path);
		}
		assertActive();
		for (const { candidate } of missingCandidates) {
			retainCandidate(candidate);
			acquireSource(candidate.path, initialStoreKeys);
		}
		let readFacts = () => facts;
		const { candidates: discoveryCandidates, ...inventory } = discoveryInventory;
		const preparedSources = [];
		const inventoryRead = prepareSessionStoreTargetInventoryRead(discoveryInventory, createSessionStoreRegistryMutationFilter({
			captured: candidateIdentities.map(({ candidate, identity }) => ({
				candidate,
				identity: identity.key,
				birthtime: identity.birthtime
			})),
			preparedSources,
			registryDiscovery: inventory.registryDiscovery
		}));
		followRegistration = inventoryRead.followRegistration;
		assertRegistryPublication = () => {
			inventoryRead.assertRegistryCurrent();
		};
		const members = /* @__PURE__ */ new Map();
		const retainedReads = /* @__PURE__ */ new Map();
		const selected = await inventoryRead.withRead(async (sources, assertDiscoveryCurrent) => {
			const targetDiscoveryCache = /* @__PURE__ */ new Map();
			for (const source of sources.agents) {
				if (!source.result.available && source.result.reason !== "database-missing") throw new SessionMutationFactsUnavailableError();
				targetDiscoveryCache.set(source.agentId, {
					existing: source.result.available ? source.result.targets : [],
					fallback: {
						agentId: source.agentId,
						storePath: inventory.paths.get(source.agentId).configured
					}
				});
			}
			const target = await prepareGatewaySessionStoreTargetReadOnly({
				cfg: inventory.config,
				key: params.sessionKey,
				agentId,
				preserveQualifiedAddress: params.preserveQualifiedAddress,
				env: inventory.env,
				targetDiscoveryCache
			}, async (reads, select) => {
				for (const read of reads) {
					assertActive();
					const loaded = await readSessionSharingFactsInWorker({
						agentId: read.agentId ?? agentId,
						storePath: read.storePath,
						sessionKeys: read.options.exactKeys,
						env: inventory.env
					}, (source) => {
						assertActive();
						if (acquireSource(source.path, read.options.exactKeys)) acquiringPaths.add(path.resolve(read.storePath));
					});
					assertActive();
					const store = Object.fromEntries(loaded.entries.map(({ sessionKey, entry }) => [sessionKey, entry]));
					read.result = ok(store);
					if (loaded.sharing) {
						const source = loaded.databaseIdentity;
						if (!source || !source.incarnation || source.filename !== loaded.sharing.source.path || `file:${source.identity}` !== loaded.sharing.databaseIdentity || source.birthtime === void 0) throw new SessionMutationFactsUnavailableError();
						assertExistingDatabaseIdentity(loaded.sharing.source.path, loaded.sharing.databaseIdentity, source.birthtime);
						preparedSources.push({
							...loaded.sharing.source,
							identity: loaded.sharing.databaseIdentity,
							birthtime: source.birthtime
						});
						read.readSource = loaded.sharing.source;
						members.set(read.storePath, {
							facts: loaded.sharing,
							source: {
								...loaded.sharing.source,
								databaseIdentity: source.identity,
								databaseBirthtime: source.birthtime
							}
						});
						for (const sessionKey of read.options.exactKeys) {
							const key = `${loaded.sharing.databaseIdentity}\0${sessionKey}`;
							const retained = acquiringReads.get(key);
							if (!retained) throw new SessionMutationFactsUnavailableError();
							retainedReads.set(key, retained);
							if (!initializedReads.has(key)) {
								const entry = store[sessionKey];
								retained.initialize({
									entry: entry ? projectSessionSharingEntry(entry) : void 0,
									placeholder: loaded.sharing.placeholders.find((row) => row.sessionKey === sessionKey),
									membership: new Set(loaded.sharing.members.find((row) => row.sessionKey === sessionKey)?.identityIds)
								});
								initializedReads.add(key);
							}
							const pending = retained.prepareRead();
							if (pending) {
								await pending;
								assertActive();
							}
							const current = retained.readCurrent();
							if (!current) throw new SessionMutationFactsUnavailableError();
							if (current.entry) store[sessionKey] = current.entry;
						}
					}
				}
				return select();
			});
			assertDiscoveryCurrent();
			return target;
		});
		assertActive();
		const storageTarget = Object.freeze({
			agentId: selected.agentId,
			canonicalKey: selected.canonicalKey,
			storePath: selected.storePath
		});
		const match = findCanonicalStoreMatch(selected.store, selected.storeKeys);
		const selectedSharing = members.get(selected.storePath);
		const sharing = selectedSharing?.facts;
		const readSource = selectedSharing?.source;
		selectedPaths.add(path.resolve(selected.storePath));
		if (sharing) {
			selectedPaths.add(path.resolve(sharing.source.path));
			const sourceCandidates = discoveryCandidates.filter((candidate) => matchesAgentDatabaseReadCandidatePath({
				...candidate,
				path: candidate.physicalPath
			}, sharing.source.path));
			if (sourceCandidates.length === 0) throw new SessionMutationFactsUnavailableError();
			for (const candidate of sourceCandidates) selectedPaths.add(path.resolve(candidate.path));
		}
		if (!match) {
			if (!params.allowMissing) throw new SessionMutationFactsUnavailableError();
			facts = {
				target: null,
				membership: /* @__PURE__ */ new Set(),
				sourcePath: sharing?.source.path,
				sourceAgentId: sharing?.source.agentId,
				readSource
			};
			const retained = sharing && retainedReads.get(`${sharing.databaseIdentity}\0${canonicalKey}`);
			expectedPlaceholder = retained?.readCurrent()?.placeholder;
			adoptCreatedEntry = (entry) => {
				retained?.adoptCreatedEntry(entry);
				facts = {
					...facts,
					target: {
						agentId: selected.agentId,
						canonicalKey: selected.canonicalKey,
						storePath: selected.storePath,
						storeKeys: selected.storeKeys,
						storeKey: canonicalKey,
						readSource,
						entry
					}
				};
			};
			readFacts = () => {
				const current = retained?.readCurrent();
				if (facts.target && current?.entry) return {
					...facts,
					target: {
						...facts.target,
						entry: current.entry
					},
					membership: current.membership
				};
				if (retained && !current || current?.entry || current?.placeholder?.sessionId !== expectedPlaceholder?.sessionId) throw new SessionMutationFactsUnavailableError();
				return {
					...facts,
					target: null,
					membership: /* @__PURE__ */ new Set()
				};
			};
		} else {
			if (!sharing) throw new SessionMutationFactsUnavailableError();
			const target = {
				agentId: selected.agentId,
				canonicalKey: selected.canonicalKey,
				storePath: selected.storePath,
				readSource,
				storeKeys: selected.storeKeys,
				entry: projectSessionSharingEntry(match.entry),
				storeKey: match.key
			};
			facts = {
				sourcePath: sharing.source.path,
				sourceAgentId: sharing.source.agentId,
				readSource,
				target,
				membership: new Set(sharing.members.find((member) => member.sessionKey === match.key)?.identityIds)
			};
			const retained = retainedReads.get(`${sharing.databaseIdentity}\0${target.storeKey}`);
			if (!retained) throw new SessionMutationFactsUnavailableError();
			readFacts = () => {
				const current = retained.readCurrent();
				if (!current?.entry) throw new SessionMutationFactsUnavailableError();
				return {
					sourcePath: sharing.source.path,
					sourceAgentId: sharing.source.agentId,
					readSource,
					target: {
						...target,
						entry: current.entry
					},
					membership: current.membership
				};
			};
		}
		assertSource = () => {
			inventoryRead.assertRegistryCurrent();
		};
		const readCurrent = (cfg) => {
			try {
				assertActive();
				assertRoutingCurrent(cfg);
				assertSource();
				return readFacts();
			} catch (error) {
				throw error instanceof SessionMutationFactsUnavailableError ? error : new SessionMutationFactsUnavailableError({ cause: error });
			}
		};
		const bindCreation = (operation) => {
			if (facts?.target === null) creation = operation;
		};
		const prepareRead = () => {
			if (!active) return;
			const pending = [...acquiringReads.values()].flatMap((read) => read.prepareRead() ?? []);
			return pending.length > 0 ? Promise.all(pending).then(() => {}) : void 0;
		};
		const pending = prepareRead();
		if (pending) await pending;
		return {
			storageTarget,
			bindCreation,
			prepareRead,
			readCurrent,
			release,
			followRegistration
		};
	} catch (error) {
		release();
		throw waitingForStorage || error instanceof SessionMutationFactsUnavailableError || error instanceof SessionCanonicalKeyMigrationRequiredError ? error : new SessionMutationFactsUnavailableError({ cause: error });
	}
}
//#endregion
export { captureSessionMutationRouting as n, prepareSessionMutationFacts as t };
