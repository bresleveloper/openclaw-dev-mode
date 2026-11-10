import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as getSkillsSnapshotVersion } from "./refresh-state-DoFid57J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./session-key-CSDERtm3.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-DkPagH0y.mjs";
import { W as isUserModelAuthProfileId } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as assertAgentDatabaseAdmitted } from "./agent-database-admission-CeDA0ojh.mjs";
import { r as captureUserProfileModelAccountLinksAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { l as getRuntimeAuthProfileStoreMetadataRevision, s as getRuntimeAuthProfileStoreCatalogRevision } from "./runtime-snapshots-HRosak4u.mjs";
import { o as getPreparedModelRuntimeAuthMaterializations } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { i as readSessionRuntimeOwnershipAsync } from "./session-utils-model-selection-pzj_r9Dj.mjs";
import { a as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-BPXZsh12.mjs";
import { s as listUserProfileAuthLinksAsync } from "./user-model-accounts-CrjNQiMH.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { f as getPendingPreparedModelRuntimeReplacement } from "./prepared-model-runtime-wDlPVSla.mjs";
import { n as withCurrentReadAuthority } from "./current-read-authority-CySCga_Z.mjs";
import { r as getPublishedPreparedModelCatalogOwnerSnapshot } from "./prepared-model-catalog-B9Dr8wIV.mjs";
import { t as resolveSwarmConfig } from "./swarm-config-CIQf_kSH.mjs";
import { a as generationFactsMatch, i as captureGenerationFacts, n as assertPreparedAgentCurrent, r as authStoresCurrent, t as ChatMetadataSnapshotUnavailableError } from "./chat-metadata-facts-BgJRYR4b.mjs";
import { a as readPreparedChatMetadata, c as prepareChatAccountSelection, n as prepareChatMetadataModelProjection, o as resolveSessionCatalogProfiles, r as prepareSessionAcpMeta, s as sessionProjectionKey, t as hasSessionCatalogContext } from "./chat-metadata-session-projection-CYKasMCP.mjs";
import { createHash } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/server-methods/chat-metadata-model-list.ts
/** Model-list variants are derived facts of the existing chat metadata generation. */
function createChatMetadataModelList(params) {
	const agents = new Map(params.facts.agents.map((agent) => [agent.agentId, agent]));
	for (const [key, request] of params.requested) if (!agents.has(request.agentId)) params.requested.delete(key);
	const projections = /* @__PURE__ */ new Map();
	const prepare = async (request, authority) => {
		const key = JSON.stringify([
			request.agentId,
			{
				...request.params,
				sessionKey: Boolean(request.params.sessionKey)
			},
			request.includeManualSelection,
			request.readScope?.sessionEntry
		]);
		const existing = projections.get(key);
		if (existing) {
			const projection = await existing;
			if (projection.isCurrent()) return projection;
			projections.delete(key);
		}
		const facts = agents.get(request.agentId);
		if (!facts?.owner.catalogOwner || !facts.owner.isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Model catalog changed while preparing this result. Retry the request.");
		const { owner, modelCatalog, authStore, authModes } = facts;
		const catalogOwner = facts.owner.catalogOwner;
		const pending = import("./models-list-result-yX_YwdVs.mjs").then(({ prepareModelsListResult }) => prepareModelsListResult({
			...request,
			preparationAuthority: authority,
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
			projections.delete(key);
		});
		return pending;
	};
	return {
		prepare,
		async read(request) {
			const { requesterProfileId, readScope, ...shared } = request;
			if (readScope) {
				const entry = readScope.sessionEntry;
				if (!readScope.sessionKey || isUserModelAuthProfileId(entry?.authProfileOverride?.trim() ?? "")) return;
				return prepare({
					...shared,
					readScope: {
						agentId: request.agentId,
						sessionKey: readScope.sessionKey,
						sessionEntry: entry && {
							modelOverride: entry.modelOverride,
							providerOverride: entry.providerOverride,
							modelOverrideRouteResolution: entry.modelOverrideRouteResolution,
							modelOverrideFallbackOriginProvider: entry.modelOverrideFallbackOriginProvider,
							modelOverrideFallbackOriginModel: entry.modelOverrideFallbackOriginModel,
							agentRuntimeOverride: entry.agentRuntimeOverride,
							authProfileOverride: entry.authProfileOverride,
							authProfileOverrideSource: entry.authProfileOverrideSource,
							authProfileOverrideCompactionCount: entry.authProfileOverrideCompactionCount
						}
					}
				}, readScope);
			}
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
function createGatewayChatMetadataRuntime(params) {
	const deps = {
		getConfig: params.getConfig,
		getContext: params.getContext,
		getPreparedOwner: getPublishedPreparedModelCatalogOwnerSnapshot,
		getPreparedAuthStore: getPreparedRuntimeAuthProfileStoreSnapshot,
		getAuthStoreRevision: getRuntimeAuthProfileStoreMetadataRevision,
		getAuthCatalogRevision: getRuntimeAuthProfileStoreCatalogRevision,
		getSkillsVersion: getSkillsSnapshotVersion,
		getPluginRegistryVersion: getActivePluginRegistryVersion,
		buildCommands: async ({ cfg, agentId }) => {
			const { buildCommandsListResult } = await import("./commands-list-result-BWCFUJAd.mjs");
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
	let failed = false;
	let lastNotifiedFacts;
	const notifyChanged = (facts, catalogStatusChanged = false) => {
		const previous = lastNotifiedFacts;
		lastNotifiedFacts = facts;
		params.onChanged?.({
			modelCatalogChanged: catalogStatusChanged || !previous || !facts || !generationFactsMatch(previous, facts, "catalog-notification"),
			authChanged: !previous || !facts || !generationFactsMatch(previous, facts, "auth"),
			...previous && facts && generationFactsMatch(previous, facts, "commands") ? { commandsChanged: false } : {}
		});
	};
	let stoppedError;
	const activeWork = /* @__PURE__ */ new Set();
	const trackWork = (work) => {
		if (activeWork.has(work)) return work;
		activeWork.add(work);
		const settled = () => activeWork.delete(work);
		work.then(settled, settled);
		return work;
	};
	const assertOpen = () => {
		if (stoppedError) throw stoppedError;
	};
	let pending;
	let refreshRequested = false;
	let notifyRefreshIfUnchanged = false;
	const projectAgent = async (generation, agent, sessionEntry, requesterProfileId, authority, useRequesterDefaults = false) => {
		assertOpen();
		authority?.assertCurrent?.();
		assertPreparedAgentCurrent(agent);
		const profiles = resolveSessionCatalogProfiles(sessionEntry, agent.owner.config, agent.agentId);
		const neutral = !hasSessionCatalogContext(profiles);
		const defaultProfileId = useRequesterDefaults && !profiles.preferredProfileId && requesterProfileId && (await listUserProfileAuthLinksAsync(requesterProfileId)).length > 0 ? requesterProfileId : void 0;
		const projections = !profiles.preferredProfileId && defaultProfileId || isUserModelAuthProfileId(profiles.preferredProfileId ?? "") ? /* @__PURE__ */ new Map() : neutral ? generation.neutralProjectionByAgentId : generation.sessionProjectionByKey;
		const key = neutral ? agent.agentId : sessionProjectionKey(agent.agentId, profiles);
		const existing = projections.get(key);
		if (existing) {
			const prepared = existing.state === "ready" ? existing.projection : await existing.promise;
			if (await withCurrentReadAuthority(authority, () => prepared.isCurrent())) return prepared;
			projections.delete(key);
		}
		const projection = deps.buildProjection({
			context: deps.getContext(),
			facts: agent,
			requesterProfileId: defaultProfileId,
			...authority,
			...profiles
		}).then((prepared) => withCurrentReadAuthority(authority, () => {
			const preparedProjection = {
				...prepared,
				agent
			};
			projections.set(key, {
				state: "ready",
				projection: preparedProjection
			});
			pruneMapToMaxSize(projections, CHAT_METADATA_CACHE_MAX_ENTRIES);
			return preparedProjection;
		})).catch((error) => {
			projections.delete(key);
			throw error;
		});
		trackWork(projection);
		projections.set(key, {
			state: "pending",
			promise: projection
		});
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
			const swarmEnabled = resolveSwarmConfig(generation.facts.config, agentId).enabled;
			return {
				...agent,
				...commands !== void 0 ? { commands } : {},
				swarmEnabled,
				revision: createHash("sha256").update(JSON.stringify({
					commands,
					swarmEnabled
				})).digest("base64url")
			};
		})().catch((error) => {
			generation.agentsById.delete(agentId);
			throw error;
		}));
		generation.agentsById.set(agentId, preparing);
		pruneMapToMaxSize(generation.agentsById, CHAT_METADATA_CACHE_MAX_ENTRIES);
		return preparing;
	};
	const runRefresh = async (options) => {
		for (let ownerReplacement = getPendingPreparedModelRuntimeReplacement(); ownerReplacement; ownerReplacement = getPendingPreparedModelRuntimeReplacement()) {
			await ownerReplacement;
			assertOpen();
		}
		assertOpen();
		const facts = captureGenerationFacts(deps);
		if (!current || !generationFactsMatch(current.facts, facts)) {
			const generation = {
				facts,
				modelLists: current && generationFactsMatch(current.facts, facts, "catalog") ? current.modelLists : createChatMetadataModelList({
					facts,
					context: deps.getContext(),
					requested: requestedModelLists,
					maxEntries: CHAT_METADATA_CACHE_MAX_ENTRIES
				}),
				agentsById: /* @__PURE__ */ new Map(),
				neutralProjectionByAgentId: /* @__PURE__ */ new Map(),
				sessionProjectionByKey: /* @__PURE__ */ new Map()
			};
			const { modelLists } = generation;
			await Promise.allSettled([...requestedModelLists.values()].map((request) => modelLists.prepare(request)));
			assertOpen();
			current = generation;
			notifyChanged(facts, options.notifyIfUnchanged);
		} else if (options.notifyIfUnchanged) notifyChanged(facts, true);
		failed = false;
		lastError = void 0;
		replacement?.resolve();
		replacement = void 0;
	};
	const refresh = AsyncLocalStorage.bind((options = {}) => {
		if (stoppedError) return Promise.reject(stoppedError);
		refreshRequested = true;
		notifyRefreshIfUnchanged ||= options.notifyIfUnchanged === true;
		if (pending) return pending;
		const promise = Promise.resolve().then(async () => {
			while (refreshRequested) {
				refreshRequested = false;
				const notifyIfUnchanged = notifyRefreshIfUnchanged;
				notifyRefreshIfUnchanged = false;
				await runRefresh({ notifyIfUnchanged });
			}
		});
		pending = promise;
		promise.then(() => {
			pending = void 0;
		}, (error) => {
			pending = void 0;
			refreshRequested = false;
			notifyRefreshIfUnchanged = false;
			fail(error);
		});
		return promise;
	});
	const readCurrent = async (project) => {
		assertOpen();
		await pending;
		if (!current && replacement) await replacement.promise;
		if (!current && lastError instanceof ChatMetadataSnapshotUnavailableError || current && !authStoresCurrent(current.facts, deps)) await refresh();
		const generation = current;
		if (!generation) throw lastError ?? new ChatMetadataSnapshotUnavailableError();
		const readProjection = await project(generation);
		assertOpen();
		if (!readProjection.isCurrent()) throw new ChatMetadataSnapshotUnavailableError();
		return readProjection.read();
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
		const { draftAccountSelection: draft, isCurrent } = readParams;
		const assertCurrent = isCurrent ? () => {
			if (!isCurrent()) throw new PreparedModelRuntimePublicationSupersededError("Chat metadata access changed while preparing its metadata. Retry the request.");
			draft?.assertCurrent();
		} : draft?.assertCurrent;
		const authority = (readParams.withCurrent || readParams.assertCurrent || assertCurrent) && {
			withCurrent: readParams.withCurrent,
			assertCurrent: () => {
				readParams.assertCurrent?.();
				assertCurrent?.();
			}
		};
		const sessionEntry = draft ? {
			authProfileOverride: draft.authProfileId,
			authProfileOverrideSource: "user"
		} : readParams.sessionEntry;
		return await readCurrent(async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = await prepareAgent(generation, agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat metadata is unavailable for agent "${agentId}"`);
			await withCurrentReadAuthority(authority, () => {});
			if (readParams.includeModels === false) {
				assertPreparedAgentCurrent(agent);
				return {
					isCurrent: agent.owner.isCurrent,
					read: () => {
						draft?.assertCurrent();
						return {
							...readParams.ifRevision === agent.revision ? { unchanged: true } : { commands: agent.commands },
							swarmEnabled: agent.swarmEnabled,
							revision: agent.revision
						};
					}
				};
			}
			const projection = await withCurrentReadAuthority(authority, () => projectAgent(generation, agent, sessionEntry, draft?.owner ?? readParams.requesterProfileId, authority, !readParams.sessionKey && !readParams.sessionEntry));
			const readAccountSelection = await withCurrentReadAuthority(authority, () => prepareChatAccountSelection({
				authStore: agent.authStore,
				sessionEntry,
				requesterProfileId: draft?.owner ?? readParams.requesterProfileId
			}));
			const acpMeta = await withCurrentReadAuthority(authority, () => prepareSessionAcpMeta({
				...readParams,
				sessionEntry
			}, deps.getConfig()));
			const runtimeOwnership = await withCurrentReadAuthority(authority, () => readSessionRuntimeOwnershipAsync({
				...readParams,
				sessionEntry,
				config: deps.getConfig()
			}));
			await withCurrentReadAuthority(authority, () => {});
			return {
				isCurrent: projection.isCurrent,
				read: () => readPreparedChatMetadata(projection, {
					...readParams,
					sessionEntry,
					requesterProfileId: draft?.owner ?? readParams.requesterProfileId
				}, deps.getConfig(), acpMeta, runtimeOwnership, readAccountSelection)
			};
		});
	};
	const readStartup = async (readParams) => {
		assertAgentDatabaseAdmitted(readParams.agentId);
		const profiles = resolveSessionCatalogProfiles(readParams.sessionEntry, deps.getConfig(), readParams.agentId);
		const hasSessionContext = hasSessionCatalogContext(profiles);
		const assemble = (neutral, session, acpMeta, runtimeOwnership, readAccountSelection) => ({
			...readParams.readPolicy === "ready" ? {} : { metadata: readPreparedChatMetadata(session, {
				...readParams,
				requesterProfileId: readParams.readRequesterProfileId?.()
			}, deps.getConfig(), acpMeta, runtimeOwnership, readAccountSelection) },
			sessionModelCatalog: session.modelCatalog,
			defaultModelCatalog: neutral.modelCatalog
		});
		const projectStartup = async (generation) => {
			const agentId = normalizeAgentId(readParams.agentId);
			const agent = await prepareAgent(generation, agentId);
			if (!agent) throw new ChatMetadataSnapshotUnavailableError(`prepared chat startup projection is unavailable for agent "${agentId}"`);
			const readNeutral = await projectAgent(generation, agent);
			const readSession = hasSessionContext ? await projectAgent(generation, agent, readParams.sessionEntry, readParams.readRequesterProfileId?.()) : readNeutral;
			const readAccountSelection = await prepareChatAccountSelection({
				authStore: agent.authStore,
				sessionEntry: readParams.sessionEntry,
				readRequesterProfileId: readParams.readRequesterProfileId
			});
			const acpMeta = await prepareSessionAcpMeta(readParams, deps.getConfig());
			const runtimeOwnership = await readSessionRuntimeOwnershipAsync({
				...readParams,
				config: deps.getConfig()
			});
			return {
				isCurrent: () => readNeutral.isCurrent() && readSession.isCurrent(),
				read: () => assemble(readNeutral, readSession, acpMeta, runtimeOwnership, readAccountSelection)
			};
		};
		if (readParams.readPolicy !== "ready" && hasSessionContext) return readCurrent(projectStartup);
		if (isUserModelAuthProfileId(profiles.preferredProfileId ?? "")) return;
		const generation = current;
		if (!generation || replacement || pending || !authStoresCurrent(generation.facts, deps)) return;
		const agentId = normalizeAgentId(readParams.agentId);
		const neutral = generation.neutralProjectionByAgentId.get(agentId);
		const session = hasSessionContext ? generation.sessionProjectionByKey.get(sessionProjectionKey(agentId, profiles)) : neutral;
		if (neutral?.state !== "ready" || session?.state !== "ready" || !neutral.projection.isCurrent() || !session.projection.isCurrent()) return;
		if (readParams.readPolicy === "ready") return assemble(neutral.projection, session.projection, null, void 0);
		const acpMeta = await prepareSessionAcpMeta(readParams, deps.getConfig());
		const runtimeOwnership = await readSessionRuntimeOwnershipAsync({
			...readParams,
			config: deps.getConfig()
		});
		return assemble(neutral.projection, session.projection, acpMeta, runtimeOwnership);
	};
	const invalidate = () => {
		if (stoppedError) return;
		lastNotifiedFacts = void 0;
		current = void 0;
		lastError = void 0;
		if (!replacement) {
			replacement = createDeferredCore();
			replacement.promise.catch(() => {});
		}
	};
	const fail = (error) => {
		const replacementError = error instanceof Error ? error : new Error(formatErrorMessage(error));
		current = void 0;
		lastError = replacementError;
		const failedReplacement = replacement;
		replacement = void 0;
		failedReplacement?.reject(replacementError);
		if (!stoppedError && !failed) {
			failed = true;
			notifyChanged();
		}
	};
	const stop = async () => {
		if (!stoppedError) {
			stoppedError = new ChatMetadataSnapshotUnavailableError("gateway chat metadata runtime is stopped");
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
