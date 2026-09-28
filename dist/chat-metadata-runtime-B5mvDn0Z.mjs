import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { T as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-B2zZQffc.mjs";
import { d as readAgentDatabaseAdmissionRefusal, n as assertAgentDatabaseAdmitted } from "./agent-database-admission-BFwcs62N.mjs";
import { i as isUserModelAuthProfileId } from "./profile-usage-stats-Uo3hJqOO.mjs";
import { o as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-CTvq6MSF.mjs";
import { l as getRuntimeAuthProfileStoreMetadataRevision } from "./runtime-snapshots-CBozwlR0.mjs";
import { a as listUserProfileAuthLinks } from "./user-model-accounts-C87WCnZM.mjs";
import { r as getPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import { y as withPreparedModelRuntimeReadBatch } from "./prepared-model-runtime-DwKkPNoF.mjs";
import { t as getPreparedModelRuntimeStartupStatus } from "./prepared-model-runtime.startup-status-Da154XRr.mjs";
import { r as getPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-CVW3VWVx.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-C7Yo0FcH.mjs";
import { r as getSkillsSnapshotVersion } from "./refresh-state-NJJr9z6k.mjs";
import { a as resolveSessionCatalogProfiles, n as prepareChatMetadataModelProjection, o as sessionProjectionKey, r as projectChatSessionMetadata, s as resolveChatAccountSelection, t as hasSessionCatalogContext } from "./chat-metadata-session-projection-Bwg0KFCs.mjs";
//#region src/gateway/server-methods/chat-metadata-facts.ts
function generationFactsMatch(left, right) {
	if (left.configKey !== right.configKey || left.pluginRegistryVersion !== right.pluginRegistryVersion || left.agents.length !== right.agents.length) return false;
	return left.agents.every((agent, index) => {
		const candidate = right.agents[index];
		return candidate?.agentId === agent.agentId && candidate.owner === agent.owner && candidate.authStoreRevision === agent.authStoreRevision && candidate.modelCatalog === agent.modelCatalog && candidate.catalogRefreshFailed === agent.catalogRefreshFailed && candidate.skillsVersion === agent.skillsVersion;
	});
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
var ChatMetadataSnapshotUnavailableError = class extends Error {
	constructor(message = "prepared chat metadata snapshot is unavailable") {
		super(message);
		this.name = "ChatMetadataSnapshotUnavailableError";
	}
};
function captureGenerationFacts(deps) {
	const config = deps.getConfig();
	const agents = withPreparedModelRuntimeReadBatch(() => withAgentRosterFactsBatch(config, () => listAgentIds(config).filter((agentId) => !readAgentDatabaseAdmissionRefusal(agentId)).flatMap((rawAgentId) => {
		const agentId = normalizeAgentId(rawAgentId);
		const owner = deps.getPreparedOwner({
			agentId,
			config
		});
		if (!owner) {
			if (getPreparedModelRuntimeStartupStatus()?.degraded) return [];
			throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata owner is unavailable for agent "${agentId}"`);
		}
		const workspaceDir = owner.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
		const fullModelCatalog = owner.readFullModelCatalog?.();
		const fullCatalogAuth = fullModelCatalog ? getPreparedModelFullCatalogAuth(fullModelCatalog) : void 0;
		if (fullModelCatalog && !fullCatalogAuth) throw new Error("prepared full model catalog omitted its auth generation");
		const catalog = fullModelCatalog ?? owner.modelCatalog;
		return [{
			agentId,
			owner,
			authStore: fullCatalogAuth?.authStore ?? deps.getPreparedAuthStore(owner.agentDir, owner.inheritedAuthDir) ?? {
				version: 1,
				profiles: {}
			},
			authModes: fullCatalogAuth?.authModes ?? owner.authModes,
			authStoreRevision: `${deps.getAuthStoreRevision(owner.agentDir)}:${deps.getAuthStoreRevision(owner.inheritedAuthDir)}`,
			modelCatalog: catalog,
			catalogRefreshFailed: catalog.refreshFailed === true,
			skillsVersion: deps.getSkillsVersion(workspaceDir)
		}];
	})));
	return {
		config,
		configKey: resolveRuntimeConfigCacheKey(config),
		pluginRegistryVersion: deps.getPluginRegistryVersion(),
		agents
	};
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
			const { buildCommandsListResult } = await import("./commands-list-result-CyE7OQF6.mjs");
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
	let current;
	let lastError;
	let replacement;
	let invalidationEpoch = 0;
	let refreshVersion = 0;
	let lastSettlement;
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
				agentsById: /* @__PURE__ */ new Map(),
				neutralProjectionByAgentId: /* @__PURE__ */ new Map(),
				sessionProjectionByKey: /* @__PURE__ */ new Map()
			};
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
				if (options.notifyIfUnchanged) params.onChanged?.();
				return Promise.resolve();
			}
			if (pending?.facts && generationFactsMatch(pending.facts, facts)) {
				pending.notifyIfUnchanged ||= options.notifyIfUnchanged === true;
				return pending.promise;
			}
			if (current || pending) invalidate();
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
				params.onChanged?.();
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
	const read = async (readParams) => {
		assertAgentDatabaseAdmitted(readParams.agentId);
		const draft = readParams.draftAccountSelection;
		const sessionEntry = draft ? {
			authProfileOverride: draft.authProfileId,
			authProfileOverrideSource: "user"
		} : readParams.sessionEntry;
		return await readCurrent(async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = await prepareAgent(generation, agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata is unavailable for agent "${agentId}"`);
			const projection = await projectAgent(generation, agent, sessionEntry, draft?.owner ?? readParams.requesterProfileId, draft?.assertCurrent, !readParams.sessionKey && !readParams.sessionEntry);
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
	const invalidate = () => {
		if (stoppedError) return;
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
			params.onChanged?.();
		}
	};
	const stop = async () => {
		if (!stoppedError) {
			stoppedError = new ChatMetadataSnapshotUnavailableError("gateway chat metadata runtime is stopped");
			invalidationEpoch += 1;
			fail(stoppedError);
		}
		while (activeWork.size > 0) await Promise.allSettled(activeWork);
	};
	return {
		fail,
		invalidate,
		read: (readParams) => trackWork(read(readParams)),
		readStartup: (startupParams) => trackWork(readStartup(startupParams)),
		refresh: (options) => trackWork(refresh(options)),
		stop
	};
}
//#endregion
export { ChatMetadataSnapshotUnavailableError, createGatewayChatMetadataRuntime };
