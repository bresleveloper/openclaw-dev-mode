import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-D4MkflNJ.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-dWNS6Rcs.mjs";
import { v as isUserModelAuthProfileId } from "./profile-usage-stats-BLwxBqRR.mjs";
import { a as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-SwwRUDrm.mjs";
import { P as captureUserProfileModelAccountLinksAuthority } from "./user-profiles-internal-DlO1LBbo.mjs";
import { a as listUserProfileAuthLinks, o as listUserProfileAuthLinksAsync } from "./user-model-accounts-sYn17idc.mjs";
import { l as getRuntimeAuthProfileStoreMetadataRevision } from "./runtime-snapshots-CSLjByUx.mjs";
import { o as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { r as getPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-DB_HuZmL.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-a1kURD5f.mjs";
import { r as getSkillsSnapshotVersion } from "./refresh-state-CRa-OKC_.mjs";
import { n as captureGenerationFacts, r as generationFactsMatch, t as ChatMetadataSnapshotUnavailableError } from "./chat-metadata-facts-hnlju5aq.mjs";
import { a as resolveSessionCatalogProfiles, n as prepareChatMetadataModelProjection, o as sessionProjectionKey, r as projectChatSessionMetadata, s as resolveChatAccountSelection, t as hasSessionCatalogContext } from "./chat-metadata-session-projection-D6fB6baF.mjs";
//#region src/gateway/server-methods/chat-metadata-model-list.ts
/** Model-list variants are derived facts of the existing chat metadata generation. */
function createChatMetadataModelList(params) {
	const agents = new Map(params.facts.agents.map((agent) => [agent.agentId, agent]));
	for (const [key, request] of params.requested) if (!agents.has(request.agentId)) params.requested.delete(key);
	const projections = /* @__PURE__ */ new Map();
	const prepare = (request) => {
		const key = JSON.stringify([
			request.agentId,
			request.params,
			request.includeManualSelection
		]);
		const existing = projections.get(key);
		if (existing) return existing.then((projection) => {
			if (projection.isCurrent()) return projection;
			if (projections.get(key) === existing) projections.delete(key);
			return prepare(request);
		});
		const facts = agents.get(request.agentId);
		if (!facts?.owner.catalogOwner || !facts.owner.isCurrent()) return Promise.reject(new PreparedModelRuntimePublicationSupersededError("Model catalog changed while preparing this result. Retry the request."));
		const { owner, modelCatalog, authStore, authModes } = facts;
		const catalogOwner = facts.owner.catalogOwner;
		const pending = import("./models-list-result-khzxkrL1.mjs").then(({ prepareModelsListResult }) => prepareModelsListResult({
			...request,
			source: {
				kind: "published",
				getConfig: params.context.getRuntimeConfig,
				owner: {
					...owner,
					catalogOwner,
					agentId: request.agentId,
					workspaceDir: catalogOwner.workspaceDir,
					modelCatalog,
					authStore,
					authModes,
					authMaterializations: getPreparedModelRuntimeAuthMaterializations(owner)
				}
			},
			preloadedOnly: true
		})).then((projection) => {
			params.requested.set(key, {
				...request,
				params: { ...request.params }
			});
			pruneMapToMaxSize(params.requested, params.maxEntries);
			return projection;
		});
		projections.set(key, pending);
		pruneMapToMaxSize(projections, params.maxEntries);
		pending.catch(() => {
			if (projections.get(key) === pending) projections.delete(key);
		});
		return pending;
	};
	return {
		prepare,
		async read(request) {
			const { requesterProfileId, ...shared } = request;
			if (requesterProfileId && request.params.view !== "provider-config") {
				const authority = captureUserProfileModelAccountLinksAuthority(captureOpenClawStateReadContext().admission, requesterProfileId);
				const links = await listUserProfileAuthLinksAsync(requesterProfileId);
				if (!authority()) return {
					isCurrent: () => false,
					read: () => ({ models: [] })
				};
				if (links.length > 0) return;
				const projection = await prepare(shared);
				return {
					isCurrent: () => authority() && projection.isCurrent(),
					read: () => ({
						...projection.read(),
						accountSelection: {
							kind: "automatic",
							label: "Automatic account selection"
						}
					})
				};
			}
			return prepare(shared);
		}
	};
}
//#endregion
//#region src/gateway/server-methods/chat-metadata-runtime.ts
const CHAT_METADATA_CACHE_MAX_ENTRIES = 64;
function readPreparedChatMetadata(projection, readParams, config) {
	readParams.draftAccountSelection?.assertCurrent();
	const { agent } = projection;
	return projectChatSessionMetadata(readParams, {
		...projection.read(),
		...agent.commands !== void 0 ? { commands: agent.commands } : {},
		swarmEnabled: agent.swarmEnabled,
		accountSelection: resolveChatAccountSelection({
			authStore: agent.authStore,
			sessionEntry: readParams.sessionEntry,
			requesterProfileId: readParams.requesterProfileId
		})
	}, config);
}
function createGatewayChatMetadataRuntime(params) {
	const deps = {
		getConfig: params.getConfig,
		getContext: params.getContext,
		getPreparedOwner: getPublishedPreparedModelCatalogOwnerSnapshot,
		getPreparedAuthStore: getPreparedRuntimeAuthProfileStoreSnapshot,
		getAuthStoreRevision: getRuntimeAuthProfileStoreMetadataRevision,
		getSkillsVersion: getSkillsSnapshotVersion,
		getPluginRegistryVersion: getActivePluginRegistryVersion,
		buildCommands: async ({ cfg, agentId }) => {
			const { buildCommandsListResult } = await import("./commands-list-result-BgXg30E-.mjs");
			return buildCommandsListResult({
				cfg,
				agentId,
				includeArgs: true,
				scope: "text"
			});
		},
		buildProjection: prepareChatMetadataModelProjection,
		...params.deps
	};
	const requestedModelLists = /* @__PURE__ */ new Map();
	let current;
	let lastError;
	let replacement;
	let invalidationEpoch = 0;
	let refreshVersion = 0;
	let lastSettlement;
	let lastNotifiedFacts;
	const notifyChanged = (facts, catalogStatusChanged = false) => {
		const previous = lastNotifiedFacts;
		lastNotifiedFacts = facts;
		params.onChanged?.({
			modelCatalogChanged: catalogStatusChanged || !previous || !facts || !generationFactsMatch(previous, facts, "catalog"),
			authChanged: !previous || !facts || !generationFactsMatch(previous, facts, "auth")
		});
	};
	let refreshTail = Promise.resolve();
	let stoppedError;
	const activeWork = /* @__PURE__ */ new Set();
	const trackWork = (work) => {
		activeWork.add(work);
		const settled = () => activeWork.delete(work);
		work.then(settled, settled);
		return work;
	};
	const assertOpen = () => {
		if (stoppedError) throw stoppedError;
	};
	let pending;
	const projectAgent = async (generation, agent, sessionEntry, requesterProfileId, assertCurrent, useRequesterDefaults = false) => {
		assertOpen();
		assertCurrent?.();
		if (!agent.owner.isCurrent()) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata owner retired for agent "${agent.agentId}"`);
		const profiles = resolveSessionCatalogProfiles(sessionEntry, agent.owner.config, agent.agentId);
		const neutral = !hasSessionCatalogContext(profiles);
		const defaultProfileId = useRequesterDefaults && !profiles.preferredProfileId && requesterProfileId && listUserProfileAuthLinks(requesterProfileId).length > 0 ? requesterProfileId : void 0;
		const projections = !profiles.preferredProfileId && defaultProfileId || isUserModelAuthProfileId(profiles.preferredProfileId ?? "") ? /* @__PURE__ */ new Map() : neutral ? generation.neutralProjectionByAgentId : generation.sessionProjectionByKey;
		const key = neutral ? agent.agentId : sessionProjectionKey(agent.agentId, profiles);
		const existing = projections.get(key);
		if (existing) {
			const prepared = existing.state === "ready" ? existing.projection : await existing.promise;
			if (prepared.isCurrent()) return prepared;
			if (projections.get(key) === existing) projections.delete(key);
			return projectAgent(generation, agent, sessionEntry, requesterProfileId, assertCurrent, useRequesterDefaults);
		}
		const projection = deps.buildProjection({
			context: deps.getContext(),
			facts: agent,
			requesterProfileId: defaultProfileId,
			...assertCurrent ? { assertCurrent } : {},
			...profiles
		}).then((prepared) => {
			assertCurrent?.();
			const preparedProjection = {
				...prepared,
				agent
			};
			if (generation.epoch === invalidationEpoch && projections.get(key) === entry) projections.set(key, {
				state: "ready",
				projection: preparedProjection
			});
			return preparedProjection;
		}).catch((error) => {
			if (projections.get(key) === entry) projections.delete(key);
			throw error;
		});
		trackWork(projection);
		const entry = {
			state: "pending",
			promise: projection
		};
		projections.set(key, entry);
		pruneMapToMaxSize(projections, CHAT_METADATA_CACHE_MAX_ENTRIES);
		return projection;
	};
	const prepareAgent = (generation, agentId) => {
		const existing = generation.agentsById.get(agentId);
		if (existing) return existing;
		const agent = generation.facts.agents.find((candidate) => candidate.agentId === agentId);
		if (!agent) return;
		const preparing = trackWork((async () => {
			let commands;
			try {
				commands = (await deps.buildCommands({
					cfg: generation.facts.config,
					agentId
				})).commands;
			} catch (error) {
				params.log.warn(`chat metadata continuing without text commands for ${agentId}: ${formatErrorMessage(error)}`);
			}
			return {
				...agent,
				...commands !== void 0 ? { commands } : {},
				swarmEnabled: resolveSwarmConfig(generation.facts.config, agentId).enabled
			};
		})().catch((error) => {
			if (generation.agentsById.get(agentId) === preparing) generation.agentsById.delete(agentId);
			throw error;
		}));
		generation.agentsById.set(agentId, preparing);
		pruneMapToMaxSize(generation.agentsById, CHAT_METADATA_CACHE_MAX_ENTRIES);
		return preparing;
	};
	const runRefresh = async (version) => {
		if (version !== refreshVersion) return;
		assertOpen();
		try {
			await params.beforeRefresh?.();
			if (version !== refreshVersion) return;
			const facts = captureGenerationFacts(deps);
			if (current && generationFactsMatch(current.facts, facts)) return;
			current = {
				epoch: invalidationEpoch,
				facts,
				modelLists: createChatMetadataModelList({
					facts,
					context: deps.getContext(),
					requested: requestedModelLists,
					maxEntries: CHAT_METADATA_CACHE_MAX_ENTRIES
				}),
				agentsById: /* @__PURE__ */ new Map(),
				neutralProjectionByAgentId: /* @__PURE__ */ new Map(),
				sessionProjectionByKey: /* @__PURE__ */ new Map()
			};
			await Promise.allSettled([...requestedModelLists.values()].map(current.modelLists.prepare));
		} catch (error) {
			if (version !== refreshVersion) return;
			throw error;
		}
	};
	const refresh = (options = {}) => {
		if (stoppedError) return Promise.reject(stoppedError);
		let facts;
		if (params.beforeRefresh) {
			if (pending) {
				pending.notifyIfUnchanged ||= options.notifyIfUnchanged === true;
				return pending.promise;
			}
		} else {
			try {
				facts = captureGenerationFacts(deps);
			} catch (error) {
				const refreshError = error instanceof Error ? error : new Error(formatErrorMessage(error));
				fail(refreshError);
				return Promise.reject(refreshError);
			}
			if (current && generationFactsMatch(current.facts, facts)) {
				if (options.notifyIfUnchanged) notifyChanged(current.facts, true);
				return Promise.resolve();
			}
			if (pending?.facts && generationFactsMatch(pending.facts, facts)) {
				pending.notifyIfUnchanged ||= options.notifyIfUnchanged === true;
				return pending.promise;
			}
			if (current || pending) invalidate(true);
		}
		const version = ++refreshVersion;
		const promise = refreshTail.catch(() => {}).then(() => runRefresh(version));
		refreshTail = promise;
		const generationReady = createDeferredCore();
		pending = {
			...facts ? { facts } : {},
			promise,
			generationReady,
			notifyIfUnchanged: options.notifyIfUnchanged === true
		};
		promise.then(() => {
			generationReady.resolve();
			if (pending?.promise !== promise) return;
			const notifyIfUnchanged = pending.notifyIfUnchanged;
			pending = void 0;
			if (current?.epoch !== invalidationEpoch) return;
			lastError = void 0;
			const committedReplacement = replacement;
			replacement = void 0;
			committedReplacement?.resolve();
			if (lastSettlement !== current || notifyIfUnchanged) {
				lastSettlement = current;
				notifyChanged(current.facts, notifyIfUnchanged);
			}
		}, (error) => {
			generationReady.resolve();
			if (pending?.promise !== promise) return;
			pending = void 0;
			fail(error);
		});
		return promise;
	};
	const authStoresCurrent = (generation) => generation.facts.agents.every(({ owner, authStoreRevision }) => authStoreRevision === `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`);
	const isCurrentGeneration = (generation) => current === generation && generation.epoch === invalidationEpoch && authStoresCurrent(generation);
	const readCurrent = async (project) => {
		for (;;) {
			assertOpen();
			const preparation = pending;
			if (preparation) {
				await preparation.generationReady.promise;
				continue;
			}
			let generation = current;
			const replacementPromise = replacement?.promise;
			if (!generation && replacementPromise) {
				await replacementPromise;
				continue;
			}
			const retryUnavailableOwner = lastError instanceof ChatMetadataSnapshotUnavailableError;
			if (!generation && (params.refreshOnRead || retryUnavailableOwner)) {
				await refresh();
				generation = current;
			}
			if (!generation) {
				if (lastError) throw lastError;
				throw new ChatMetadataSnapshotUnavailableError();
			}
			if (!params.refreshOnRead && !authStoresCurrent(generation)) {
				await refresh();
				continue;
			}
			if (params.refreshOnRead) {
				let latest;
				try {
					latest = captureGenerationFacts(deps);
				} catch {
					await refresh();
					generation = current;
				}
				if (latest && generation && !generationFactsMatch(generation.facts, latest)) {
					await refresh();
					generation = current;
				}
			}
			if (!generation) throw new ChatMetadataSnapshotUnavailableError();
			if (params.refreshOnRead) {
				const latest = captureGenerationFacts(deps);
				if (!generationFactsMatch(generation.facts, latest)) throw new ChatMetadataSnapshotUnavailableError("prepared chat metadata snapshot is stale while its replacement is publishing");
			}
			try {
				const readProjection = await project(generation);
				if (isCurrentGeneration(generation) && readProjection.isCurrent()) return readProjection.read();
			} catch (error) {
				if (isCurrentGeneration(generation)) throw error;
			}
		}
	};
	const readModelsList = async (request) => {
		assertAgentDatabaseAdmitted(request.agentId);
		return readCurrent(async (generation) => {
			return await generation.modelLists.read(request) ?? {
				isCurrent: () => true,
				read: () => void 0
			};
		});
	};
	const read = async (readParams) => {
		assertAgentDatabaseAdmitted(readParams.agentId);
		const draft = readParams.draftAccountSelection;
		const isCurrent = readParams.isCurrent;
		const assertCurrent = isCurrent ? () => {
			if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Chat metadata access changed while preparing its metadata. Retry the request.");
			draft?.assertCurrent();
		} : draft?.assertCurrent;
		const sessionEntry = draft ? {
			authProfileOverride: draft.authProfileId,
			authProfileOverrideSource: "user"
		} : readParams.sessionEntry;
		return await readCurrent(async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = await prepareAgent(generation, agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata is unavailable for agent "${agentId}"`);
			readParams.assertCurrent?.();
			const projection = await projectAgent(generation, agent, sessionEntry, draft?.owner ?? readParams.requesterProfileId, assertCurrent, !readParams.sessionKey && !readParams.sessionEntry);
			return {
				isCurrent: projection.isCurrent,
				read: () => readPreparedChatMetadata(projection, {
					...readParams,
					sessionEntry,
					requesterProfileId: draft?.owner ?? readParams.requesterProfileId
				}, deps.getConfig())
			};
		});
	};
	const readStartup = async (readParams) => {
		assertAgentDatabaseAdmitted(readParams.agentId);
		const profiles = resolveSessionCatalogProfiles(readParams.sessionEntry, deps.getConfig(), readParams.agentId);
		const hasSessionContext = hasSessionCatalogContext(profiles);
		const assemble = (neutral, session) => ({
			...readParams.readPolicy === "ready" ? {} : { metadata: readPreparedChatMetadata(session, {
				...readParams,
				requesterProfileId: readParams.readRequesterProfileId?.()
			}, deps.getConfig()) },
			sessionModelCatalog: session.modelCatalog,
			defaultModelCatalog: neutral.modelCatalog
		});
		const projectStartup = async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = await prepareAgent(generation, agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat startup projection is unavailable for agent "${agentId}"`);
			const readNeutral = await projectAgent(generation, agent);
			const readSession = hasSessionContext ? await projectAgent(generation, agent, readParams.sessionEntry, readParams.readRequesterProfileId?.()) : readNeutral;
			return {
				isCurrent: () => readNeutral.isCurrent() && readSession.isCurrent(),
				read: () => assemble(readNeutral, readSession)
			};
		};
		if (readParams.readPolicy !== "ready" && hasSessionContext) return readCurrent(projectStartup);
		if (isUserModelAuthProfileId(profiles.preferredProfileId ?? "")) return;
		const generation = current;
		if (!generation || replacement || pending || !isCurrentGeneration(generation)) return;
		if (params.refreshOnRead) try {
			if (!generationFactsMatch(generation.facts, captureGenerationFacts(deps))) return;
		} catch {
			return;
		}
		const agentId = normalizeAgentId(readParams.agentId);
		const neutral = generation.neutralProjectionByAgentId.get(agentId);
		const session = hasSessionContext ? generation.sessionProjectionByKey.get(sessionProjectionKey(agentId, profiles)) : neutral;
		if (neutral?.state !== "ready" || session?.state !== "ready" || !neutral.projection.isCurrent() || !session.projection.isCurrent()) return;
		return assemble(neutral.projection, session.projection);
	};
	const invalidate = (retainNotifiedFacts = false) => {
		if (stoppedError) return;
		if (!retainNotifiedFacts) lastNotifiedFacts = void 0;
		invalidationEpoch += 1;
		refreshVersion += 1;
		pending?.generationReady.resolve();
		pending = void 0;
		current = void 0;
		lastError = void 0;
		if (!replacement) {
			replacement = createDeferredCore();
			replacement.promise.catch(() => {});
		}
	};
	const fail = (error) => {
		const replacementError = error instanceof Error ? error : new Error(formatErrorMessage(error));
		refreshVersion += 1;
		pending?.generationReady.resolve();
		pending = void 0;
		current = void 0;
		lastError = replacementError;
		const failedReplacement = replacement;
		replacement = void 0;
		failedReplacement?.reject(replacementError);
		if (!stoppedError && lastSettlement !== invalidationEpoch) {
			lastSettlement = invalidationEpoch;
			notifyChanged();
		}
	};
	const stop = async () => {
		if (!stoppedError) {
			stoppedError = new ChatMetadataSnapshotUnavailableError("gateway chat metadata runtime is stopped");
			invalidationEpoch += 1;
			fail(stoppedError);
			requestedModelLists.clear();
		}
		while (activeWork.size > 0) await Promise.allSettled(activeWork);
	};
	return {
		fail,
		invalidate,
		read: (readParams) => trackWork(read(readParams)),
		readModelsList: (request) => trackWork(readModelsList(request)),
		readStartup: (startupParams) => trackWork(readStartup(startupParams)),
		refresh: (options) => trackWork(refresh(options)),
		stop
	};
}
//#endregion
export { createGatewayChatMetadataRuntime };
