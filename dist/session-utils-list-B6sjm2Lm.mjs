import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, w as withAgentRosterFactsBatch } from "./agent-scope-config-IQKOEtZ4.mjs";
import { b as resolveIsConfigReadOnly } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-BBylVEaq.mjs";
import { o as sessionCreatorProfileId, t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-C-JyMH54.mjs";
import { t as buildGroupDisplayName } from "./group-B8HN3m8j.mjs";
import { g as isPinnableSessionEntry } from "./store-maintenance-C5xEVYop.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as resolveSessionModelIdentityRef } from "./session-model-ref-DGVV7laa.mjs";
import { t as isConfiguredGatewaySessionEntry } from "./combined-store-gateway-Bb3P3TzM.mjs";
import { r as isFinitePositiveTimestamp, s as resolveSessionChildOwners } from "./session-utils-core-CPCyMcSJ.mjs";
import { o as resolveAssistantIdentity } from "./assistant-avatar-D6yA4rZS.mjs";
import { t as getSessionDefaults } from "./session-utils-model-CUQjuht1.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-DqGvpsY3.mjs";
import { F as sortAndLimitSessionEntries, I as sessionActivityTimestamp, n as withReadySessionRows } from "./session-row-prepared-read-BZIZR-6Q.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { a as projectSessionOwner, c as projectSessionPeople, d as resolveSessionListProfileReference, f as sortSessionOwnerFacet, l as projectSessionPeopleFacet, o as projectSessionParticipant, s as projectSessionParticipants, t as addSessionOwnerFacetIdentity, u as projectSessionProfileInvolvement } from "./session-identity-projection-C0mYume0.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { a as resolveGatewaySessionKind, i as resolveGatewaySessionGoal, n as projectGatewaySessionRunState, r as resolveGatewaySessionDisplayName, t as projectGatewaySessionActiveRun } from "./session-utils-display-C9DkcmRI.mjs";
import { et as gatewayClientSessionCreator } from "./session-sharing-C_5FkkwM.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-COSfbADi.mjs";
import { n as resolveStickyModelSelectionPolicy } from "./sticky-model-selection-DPMybMQ_.mjs";
import { i as prepareProjectedSessionPresentation, t as bindSessionListRowRead } from "./session-list-read-result-BWd6LrJ1.mjs";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/session-model-selection-policy.ts
function resolveGatewayModelSelectionPolicy(params) {
	return resolveStickyModelSelectionPolicy({
		canPersistConfig: params.callerScopes.includes("operator.admin") && !resolveIsConfigReadOnly(process.env),
		cfg: params.cfg,
		...params.scope ? { scope: params.scope } : {}
	});
}
//#endregion
//#region src/shared/session-list-visibility.ts
/** Display/discovery classification; routing validates canonical keys separately. */
function isCronSessionDisplayKey(key) {
	return /^(?:cron:|agent::*[^:]+:+cron:+[^:])/u.test(normalizeLowercaseStringOrEmpty(key));
}
/**
* Classify probes from recorded provenance, never transcript text. Legacy rows
* without provenance and operator-named CLI sessions remain discoverable. Cron
* rows belong to the separate automation filter even when a system created them.
*/
function isSystemCreatedSessionRow(row) {
	if (isCronSessionDisplayKey(row.key)) return false;
	if (row.createdActor?.type === "system") return true;
	if (row.createdVia !== "run" && row.createdVia !== "internal") return false;
	if (row.createdActor?.type === "human") return false;
	return !(row.label?.trim() || row.displayName?.trim() || row.subject?.trim());
}
//#endregion
//#region src/shared/agent-runtime-display.ts
function formatAgentRuntimeLabel(agentRuntime) {
	const id = normalizeOptionalString(agentRuntime?.id) ?? "-";
	const fallback = normalizeOptionalString(agentRuntime?.fallback);
	return fallback ? `${id} (fallback ${fallback})` : id;
}
//#endregion
//#region src/shared/session-goal-display.ts
function formatGoalTokenCount(value) {
	if (!Number.isFinite(value) || value <= 0) return "0";
	if (value < 1e3) return String(Math.round(value));
	if (value < 1e6) {
		const rounded = value >= 1e4 ? Math.round(value / 1e3) : Math.round(value / 100) / 10;
		if (rounded >= 1e3) return "1m";
		return `${rounded}k`;
	}
	return `${value >= 1e7 ? Math.round(value / 1e6) : Math.round(value / 1e5) / 10}m`;
}
function formatGoalUsage(goal) {
	if (typeof goal.tokenBudget === "number" && Number.isFinite(goal.tokenBudget)) return `${formatGoalTokenCount(goal.tokensUsed)}/${formatGoalTokenCount(goal.tokenBudget)}`;
	if (goal.tokensUsed > 0) return `${formatGoalTokenCount(goal.tokensUsed)} used`;
	return null;
}
function formatGoalStatusLabel(status) {
	switch (status) {
		case "active": return "Pursuing goal";
		case "paused": return "Goal paused";
		case "blocked": return "Goal blocked";
		case "usage_limited": return "Goal hit usage limits";
		case "budget_limited": return "Goal unmet";
		case "complete": return "Goal achieved";
	}
	return status;
}
function formatGoalSummary(goal) {
	const usage = formatGoalUsage(goal);
	const status = formatGoalStatusLabel(goal.status);
	return usage ? `${status} (${usage})` : status;
}
//#endregion
//#region src/shared/session-run-state.ts
function isSessionRunActive(state) {
	if (state.status && state.status !== "queued" && state.status !== "running") return false;
	if (typeof state.hasActiveRun === "boolean") return state.hasActiveRun;
	return state.status === "queued" || state.status === "running";
}
//#endregion
//#region src/gateway/session-utils-search.ts
function resolveSessionListSearchDisplayName(key, entry) {
	if (entry?.displayName) return entry.displayName;
	const parsed = parseGroupKey(key);
	const channel = sessionDeliveryChannel(entry) ?? parsed?.channel;
	if (isGroupOrChannelDisplaySession(entry, parsed) && channel) return buildGroupDisplayName({
		provider: channel,
		subject: entry?.subject,
		groupChannel: entry?.groupChannel,
		space: entry?.space,
		id: parsed?.id,
		key
	});
	return entry?.label ?? sessionDeliveryOrigin(entry)?.label;
}
function addSessionListSearchModelFields(fields, identity) {
	const provider = normalizeOptionalString(identity.provider);
	const model = normalizeOptionalString(identity.model);
	fields.push(provider, model);
	if (provider && model) fields.push(`${provider}/${model}`);
}
function matchesSessionListSearch(fields, search) {
	return fields.some((field) => typeof field === "string" && normalizeLowercaseStringOrEmpty(field).includes(search));
}
function shouldResolveDerivedSessionModelSearchFields(search) {
	return !search.startsWith("agent:");
}
const staticSearchFields = /* @__PURE__ */ new WeakMap();
function createSessionListSearchMatcher(params) {
	const { cfg, search, now } = params;
	const identityNames = /* @__PURE__ */ new Map();
	let rowContext;
	const context = () => rowContext ??= params.getRowContext();
	return (key, entry) => {
		const target = expectDefined(params.getTarget(key), "search row owner");
		const storeKey = target.storeKey ?? key;
		let fields = staticSearchFields.get(target.selection);
		if (!fields) {
			const rawFields = [
				storeKey,
				entry.label,
				entry.subject,
				entry.sessionId,
				entry.category,
				resolveSessionListSearchDisplayName(storeKey, entry),
				resolveGatewaySessionDisplayName(storeKey, entry),
				resolveGatewaySessionKind(storeKey, entry)
			];
			addSessionListSearchModelFields(rawFields, {
				provider: entry.modelProvider,
				model: entry.model
			});
			fields = rawFields.map(normalizeLowercaseStringOrEmpty);
			staticSearchFields.set(target.selection, fields);
		}
		if (fields.some((field) => field.includes(search))) return true;
		const agentId = target.agentId;
		const metadataSnapshot = readPreparedGatewayModelCatalogMetadata(params.modelCatalog?.get(agentId));
		const run = projectGatewaySessionRunState({
			key: storeKey,
			entry,
			now,
			rowContext: context()
		}).fields;
		const active = params.projectActiveRun?.(key, entry, agentId);
		const state = projectGatewaySessionActiveRun(active, run.status);
		const goal = resolveGatewaySessionGoal(entry, now);
		if (matchesSessionListSearch([
			state.status,
			isSessionRunActive(state) ? "live running" : state.hasActiveRun === false ? "idle" : void 0,
			goal ? `${goal.objective} ${goal.status} ${formatGoalSummary(goal)} ${goal.lastStatusNote ?? ""}` : void 0
		], search)) return true;
		if (!identityNames.has(agentId)) identityNames.set(agentId, resolveAssistantIdentity({
			cfg,
			agentId
		}).name);
		if (matchesSessionListSearch([identityNames.get(agentId)], search)) return true;
		const source = expectDefined(target.materialized?.source ?? target.getModelFacts?.(), "prepared search row model facts");
		if (shouldResolveDerivedSessionModelSearchFields(search)) {
			const subagentRun = context().subagentRuns.getDisplaySubagentRun(storeKey);
			const resolvedModel = resolveSessionModelIdentityRef(cfg, entry, agentId, subagentRun?.model, {
				allowPluginNormalization: false,
				manifestPlugins: metadataSnapshot
			});
			const models = [];
			for (const identity of [
				resolvedModel,
				source.selectedModel,
				source.rowModelIdentity
			]) addSessionListSearchModelFields(models, identity);
			if (matchesSessionListSearch(models, search)) return true;
		}
		return matchesSessionListSearch([formatAgentRuntimeLabel(source.thinkingProjection.agentRuntime)], search);
	};
}
//#endregion
//#region src/gateway/session-list-filters.ts
/** The predicate and its cache key consume the same membership dependencies. */
function projectSessionListCandidateOptions(opts) {
	return {
		includeGlobal: opts.includeGlobal,
		includeUnknown: opts.includeUnknown,
		spawnedBy: opts.spawnedBy,
		label: opts.label,
		boardFace: opts.boardFace,
		agentId: opts.agentId,
		excludeCron: opts.excludeCron,
		excludeSystem: opts.excludeSystem,
		excludeSubagents: opts.excludeSubagents,
		archived: opts.archived,
		requireLastInteraction: opts.requireLastInteraction,
		projectId: opts.projectId,
		workspaceDir: opts.workspaceDir,
		group: opts.group,
		pinned: opts.pinned
	};
}
function* filterSessionCandidateEntries(params) {
	const { opts, now, shouldYield } = params;
	let rowContext;
	const getRowContext = () => rowContext ??= params.getRowContext();
	const includeGlobal = opts.includeGlobal === true;
	const includeUnknown = opts.includeUnknown === true;
	const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
	const label = normalizeOptionalString(opts.label) ?? "";
	const boardFace = opts.boardFace;
	const agentId = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
	const keepCandidate = ([key, entry]) => {
		const target = expectDefined(params.getTarget(key), "selection row owner");
		const { selection } = target;
		const storeKey = target.storeKey ?? key;
		if (selection.isCronRun || opts.excludeCron === true && isCronSessionDisplayKey(key) || opts.excludeSystem === true && isSystemCreatedSessionRow({
			key,
			createdActor: entry.createdActor,
			createdVia: entry.createdVia,
			label: entry.label,
			displayName: entry.displayName,
			subject: entry.subject
		}) || opts.excludeSubagents === true && selection.isSubagent || !includeGlobal && storeKey === "global" || !includeUnknown && storeKey === "unknown") return false;
		if (agentId && storeKey !== "global") {
			if ((target.storeKey ? normalizeAgentId(target.agentId) : selection.agentId) !== agentId) return false;
		}
		if (selection.isPhantom) return false;
		if (spawnedBy) {
			if (storeKey === "unknown" || storeKey === "global") return false;
			if (!resolveSessionChildOwners({
				key,
				entry,
				now,
				subagentRuns: getRowContext().subagentRuns
			}).includes(spawnedBy)) return false;
		}
		if (opts.archived !== "all") {
			const archived = entry.archivedAt !== void 0;
			if (opts.archived === true ? !archived : archived) return false;
		}
		if (opts.requireLastInteraction === true && (!isFinitePositiveTimestamp(entry.lastInteractionAt) || normalizeOptionalString(entry.heartbeatIsolatedBaseSessionKey))) return false;
		if (label && entry.label !== label || boardFace && entry.boardFace !== boardFace) return false;
		if (opts.projectId !== void 0 && entry.projectId !== opts.projectId) return false;
		if (opts.workspaceDir !== void 0 && (entry.spawnedCwd ?? entry.spawnedWorkspaceDir) !== opts.workspaceDir) return false;
		if (opts.group !== void 0 && (entry.category ?? "") !== opts.group) return false;
		if (opts.pinned !== void 0 && (entry.pinnedAt !== void 0 && isPinnableSessionEntry(storeKey, entry)) !== opts.pinned) return false;
		return true;
	};
	const candidateEntries = [];
	for (const pair of params.entries) {
		if (keepCandidate(pair)) candidateEntries.push(pair);
		if (shouldYield?.()) yield;
	}
	return candidateEntries;
}
function* filterSessionEntries(params) {
	const { cfg, opts, now, shouldYield } = params;
	let rowContext;
	const getRowContext = () => rowContext ??= params.getRowContext();
	const search = normalizeLowercaseStringOrEmpty(opts.search);
	const activeMinutes = typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes) ? Math.max(1, Math.floor(opts.activeMinutes)) : void 0;
	const creatorId = normalizeOptionalString(opts.creatorId);
	const ownerId = normalizeOptionalString(opts.ownerId);
	const ownerFirstActorId = normalizeOptionalString(params.ownerFirstActorId);
	const activeCutoff = activeMinutes === void 0 ? void 0 : now - activeMinutes * 6e4;
	const entries = [];
	const ownerEntries = [];
	const ownerFacet = /* @__PURE__ */ new Map();
	const people = /* @__PURE__ */ new Map();
	let peopleSessionCount = 0;
	let peopleIncomplete = false;
	const configuredAgentIds = params.configuredAgentIds ?? new Set(listAgentIds(cfg));
	const identities = params.userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const identityProjection = getRowContext().identityProjection;
	const projectOwner = identityProjection?.owner ?? projectSessionOwner;
	const projectParticipants = identityProjection?.participants ?? projectSessionParticipants;
	const projectPeople = identityProjection?.people ?? projectSessionPeople;
	const profileRelation = opts.profileRelation ? {
		...opts.profileRelation,
		profileId: projectSessionParticipant({
			type: "profile",
			id: opts.profileRelation.profileId
		}, identities, cfg).identity.id
	} : void 0;
	const involvingActorId = normalizeOptionalString(params.involvingActorId);
	const visibleEntries = [];
	for (const pair of params.entries) {
		if (params.entryFilter?.(pair[0], pair[1]) ?? true) visibleEntries.push(pair);
		if (shouldYield?.()) yield;
	}
	const allowedProfileIds = opts.involvingProfileId && params.restrictProfileReferences ? /* @__PURE__ */ new Set() : void 0;
	if (allowedProfileIds) for (const [, entry] of visibleEntries) {
		const owner = projectOwner(entry, identities, cfg, configuredAgentIds)?.actor;
		for (const person of projectPeople(entry, identities, owner)) allowedProfileIds.add(person.identity.id);
		if (shouldYield?.()) yield;
	}
	const profileReference = opts.involvingProfileId ? yield* resolveSessionListProfileReference(opts.involvingProfileId, visibleEntries, identities, allowedProfileIds, shouldYield) : void 0;
	if (profileReference && !profileReference.ok) throw new Error("Person link is ambiguous. Use a longer profile ID in the Activity URL.");
	const selectedProfileId = profileReference?.value;
	const candidateEntries = params.candidatesPrepared ? visibleEntries : yield* filterSessionCandidateEntries({
		...params,
		opts: projectSessionListCandidateOptions(opts),
		entries: visibleEntries,
		getRowContext
	});
	const matchesSearch = search ? createSessionListSearchMatcher({
		cfg,
		search,
		now,
		getTarget: params.getTarget,
		modelCatalog: params.modelCatalog instanceof Map ? params.modelCatalog : void 0,
		getRowContext,
		projectActiveRun: params.projectActiveRun
	}) : void 0;
	const matchesInvolvement = (entry, effectiveOwner, profileId, personal) => {
		const state = projectSessionProfileInvolvement(entry, profileId, identities);
		return !(personal && state?.hidden) && (Boolean(state?.lastMention || personal && state?.hidden === false) || effectiveOwner?.identity?.type === "profile" && effectiveOwner.identity.id === profileId || projectParticipants(entry, identities, cfg).has(JSON.stringify({
			type: "profile",
			id: profileId
		})));
	};
	for (const pair of candidateEntries) {
		if (shouldYield?.()) yield;
		const key = pair[0];
		const entry = pair[1];
		if (matchesSearch && !matchesSearch(key, entry)) continue;
		if (activeCutoff !== void 0 && (opts.sortBy === "activity" ? sessionActivityTimestamp(entry) : entry.updatedAt ?? 0) < activeCutoff) continue;
		const effectiveOwner = projectOwner(entry, identities, cfg, configuredAgentIds)?.actor;
		if (profileRelation?.relationship === "owned" && (effectiveOwner?.identity?.type !== "profile" || effectiveOwner.identity.id !== profileRelation.profileId)) continue;
		if (profileRelation?.relationship === "created") {
			const createdProfileId = sessionCreatorProfileId(entry.createdActor);
			if (!createdProfileId || projectSessionParticipant({
				type: "profile",
				id: createdProfileId
			}, identities, cfg).identity.id !== profileRelation.profileId) continue;
		}
		if (profileRelation?.relationship === "involving" && !matchesInvolvement(entry, effectiveOwner, profileRelation.profileId, false)) continue;
		if (effectiveOwner) addSessionOwnerFacetIdentity(ownerFacet, effectiveOwner);
		if (creatorId && entry.createdActor?.id !== creatorId) continue;
		if (ownerId && effectiveOwner?.id !== ownerId) continue;
		if (involvingActorId && !matchesInvolvement(entry, effectiveOwner, involvingActorId, true)) continue;
		if (opts.includePeople || opts.involvingProfileId) {
			const associated = projectPeople(entry, identities, effectiveOwner);
			peopleSessionCount += 1;
			peopleIncomplete ||= (entry.participantCount ?? entry.participants?.length ?? 0) >= MAX_SESSION_PARTICIPANTS || entry.participants?.some((participant) => participant.identity.type === "legacy") === true;
			for (const person of associated) {
				const existing = people.get(person.identity.id);
				if (existing) {
					existing.identity = person.identity;
					existing.label = person.label;
					existing.avatarUrl = person.avatarUrl;
					existing.sessionCount += 1;
				} else people.set(person.identity.id, {
					...person,
					sessionCount: 1
				});
			}
			if (opts.involvingProfileId) {
				if (!associated.some((person) => person.identity.id === selectedProfileId)) continue;
			}
		}
		if (effectiveOwner?.identity?.type === "profile" && effectiveOwner.identity.id === ownerFirstActorId) ownerEntries.push(pair);
		entries.push(pair);
	}
	const { people: visiblePeople, overflow } = projectSessionPeopleFacet(people.values(), selectedProfileId);
	return {
		entries,
		ownerEntries,
		ownerFacet: sortSessionOwnerFacet(ownerFacet),
		involvingProfileId: selectedProfileId,
		...opts.includePeople ? {
			people: visiblePeople,
			peopleIncomplete: peopleIncomplete || overflow,
			peopleSessionCount
		} : {}
	};
}
//#endregion
//#region src/gateway/session-utils-list.ts
function resolveSessionsListLimit(opts, defaultLimit) {
	if (typeof opts.limit !== "number" || !Number.isFinite(opts.limit)) return defaultLimit;
	return Math.max(1, Math.floor(opts.limit));
}
function resolveSessionsListOffset(opts) {
	if (typeof opts.offset !== "number" || !Number.isFinite(opts.offset)) return 0;
	return Math.max(0, Math.floor(opts.offset));
}
function resolveSessionsListWindowLimit(limit, offset) {
	if (limit === void 0) return;
	const windowLimit = offset + limit;
	return Number.isFinite(windowLimit) ? Math.min(windowLimit, Number.MAX_SAFE_INTEGER) : void 0;
}
function* selectSessionEntries(params) {
	const { ownerEntries, entries: filtered, ...facets } = yield* filterSessionEntries(params);
	const limit = resolveSessionsListLimit(params.opts, params.defaultLimit);
	const offset = resolveSessionsListOffset(params.opts);
	const windowLimit = resolveSessionsListWindowLimit(limit, offset);
	const sortedWindow = yield* sortAndLimitSessionEntries(filtered, windowLimit, params.opts.sortBy, params.shouldYield);
	const sharedEntries = limit === void 0 ? sortedWindow.slice(offset) : sortedWindow.slice(offset, offset + limit);
	let entries = sharedEntries;
	let ownerCount = 0;
	if (params.ownerFirstActorId && offset === 0) {
		const owned = yield* sortAndLimitSessionEntries(ownerEntries, Math.min(limit ?? 60, 60), params.opts.sortBy, params.shouldYield);
		ownerCount = owned.length;
		const ownedKeys = new Set(owned.map(([key]) => key));
		entries = [...owned, ...sharedEntries.filter(([key]) => !ownedKeys.has(key))];
	}
	const nextOffset = offset + sharedEntries.length;
	const hasMore = nextOffset < filtered.length;
	return {
		...facets,
		entries,
		ownerCount,
		totalCount: filtered.length,
		limitApplied: limit,
		offset,
		nextOffset: hasMore ? nextOffset : null,
		hasMore
	};
}
function buildSessionsListResult(params, list, sessions) {
	const { cfg, opts, modelCatalog } = params;
	const preparedDefaultsCatalog = modelCatalog instanceof Map ? modelCatalog.get(resolveSessionsListDefaultsAgentId(cfg, opts.agentId)) : void 0;
	const defaultsCatalog = modelCatalog instanceof Map ? preparedDefaultsCatalog?.entries : modelCatalog;
	return {
		ts: list.now,
		path: list.storePath,
		count: sessions.length,
		totalCount: list.totalCount,
		limitApplied: list.limitApplied,
		offset: list.offset > 0 ? list.offset : void 0,
		nextOffset: list.nextOffset,
		hasMore: list.hasMore,
		owners: list.ownerFacet,
		involvingProfileId: list.involvingProfileId,
		...list.people ? {
			people: list.people,
			peopleIncomplete: list.peopleIncomplete,
			peopleSessionCount: list.peopleSessionCount
		} : {},
		defaults: getSessionDefaults(cfg, defaultsCatalog, {
			...opts.agentId ? { agentId: opts.agentId } : {},
			allowPluginNormalization: false,
			providerPolicySource: preparedDefaultsCatalog?.pluginRegistry,
			metadataSnapshot: readPreparedGatewayModelCatalogMetadata(preparedDefaultsCatalog)
		}),
		sessions
	};
}
function resolveSessionsListDefaultsAgentId(cfg, requestedAgentId) {
	return requestedAgentId ? normalizeAgentId(requestedAgentId) : normalizeAgentId(tryResolveLegacyCompatibilityAgentId(cfg) ?? "main");
}
const sentinel = (key) => key === "global" || key === "unknown";
const sessionRowSelections = /* @__PURE__ */ new WeakMap();
/** Preserve federation before caller visibility and activity filters. */
function prepareSessionRowSelection(projection, opts, prepared) {
	const { cfg, modelCatalog, scope, revision, rowContext: residentContext } = projection.state;
	const selectedScope = scope(opts);
	const now = prepared?.now ?? Date.now();
	const rowContext = prepared?.rowContext ?? {
		...residentContext,
		subagentRuns: residentContext.subagentRuns.atTime(now)
	};
	const keyed = prepared?.key !== void 0 || prepared?.sessionIdOrKey !== void 0;
	const activeOnly = opts.activeOnly === true;
	let selection = keyed ? void 0 : sessionRowSelections.get(revision)?.get(selectedScope)?.get(activeOnly);
	if (!selection) {
		const rows = projection.selectEntries({
			agentId: selectedScope.agentId,
			key: prepared?.key,
			sessionIdOrKey: prepared?.sessionIdOrKey,
			sortBy: null
		}).filter((row) => selectedScope.paths.has(row.storeTarget.storePath) && (!selectedScope.configuredAgentIds || isConfiguredGatewaySessionEntry(cfg, selectedScope.configuredAgentIds, row.key, row.entry)));
		const winners = /* @__PURE__ */ new Map();
		const keyFor = (row) => sentinel(row.key) && opts.activeOnly ? JSON.stringify([row.key, row.agentId]) : row.key;
		for (const row of rows) {
			const key = keyFor(row);
			const previous = winners.get(key);
			if (previous && !sentinel(row.key)) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${row.key}`);
			if (!previous || selectedScope.paths.get(row.storeTarget.storePath) < selectedScope.paths.get(previous.storeTarget.storePath)) winners.set(key, row);
		}
		const entries = [];
		for (const row of rows) {
			const key = keyFor(row);
			if (winners.get(key) === row) entries.push([key, row.entry]);
		}
		selection = {
			winners,
			entries
		};
		if (!keyed) {
			const currentRevision = projection.state.revision;
			let scopes = sessionRowSelections.get(currentRevision);
			if (!scopes) {
				scopes = /* @__PURE__ */ new WeakMap();
				sessionRowSelections.set(currentRevision, scopes);
			}
			let variants = scopes.get(selectedScope);
			if (!variants) {
				variants = /* @__PURE__ */ new Map();
				scopes.set(selectedScope, variants);
			}
			variants.set(activeOnly, selection);
		}
	}
	const { winners, entries } = selection;
	return {
		cfg,
		opts,
		now,
		modelCatalog,
		entries,
		storePath: selectedScope.path,
		userProfileIdentityById: rowContext.userProfileIdentityById,
		getRowContext: () => rowContext,
		getTarget: (key) => {
			const winner = winners.get(key);
			if (!winner || !opts.search && key === winner.key) return winner;
			return {
				...winner,
				...key !== winner.key ? { storeKey: winner.key } : {},
				getModelFacts: () => projection.modelFacts(winner)
			};
		}
	};
}
function filterAndSortSessionEntries(params) {
	return withAgentRosterFactsBatch(params.cfg, () => runSynchronousWork(selectSessionEntries({
		...params,
		restrictProfileReferences: params.entryFilter !== void 0
	}))).entries;
}
const sessionListCandidates = /* @__PURE__ */ new WeakMap();
/** Shared synchronous membership policy for list pages and full-roster transcript search. */
function prepareProjectedSessionList(params) {
	const { projection, opts, key: exactKey, context, client, now } = params;
	const presentation = prepareProjectedSessionPresentation(projection, client, now, context ? createVisibleActiveSessionRunProjector(context, projection.state.rowContext.projectedAgentRuns) : void 0);
	const prepared = prepareSessionRowSelection(projection, opts, {
		key: exactKey,
		now,
		rowContext: presentation.rowContext
	});
	const { getTarget } = prepared;
	const { active } = presentation;
	const identity = gatewayClientSessionCreator(client ?? null)?.id;
	let candidates;
	if (!opts.spawnedBy && !opts.involvingProfileId) {
		const candidateOptions = projectSessionListCandidateOptions(opts);
		const key = JSON.stringify([exactKey, candidateOptions]);
		let cached = sessionListCandidates.get(prepared.entries);
		if (cached?.key !== key) {
			cached = {
				key,
				entries: runSynchronousWork(filterSessionCandidateEntries({
					...prepared,
					opts: candidateOptions
				}))
			};
			sessionListCandidates.set(prepared.entries, cached);
		}
		candidates = cached.entries;
	}
	return {
		prepared,
		presentation,
		filters: {
			...prepared,
			...candidates ? {
				entries: candidates,
				candidatesPrepared: true
			} : {},
			involvingActorId: opts.involvingMe ? identity : void 0,
			ownerFirstActorId: opts.ownerFirst ? identity : void 0,
			restrictProfileReferences: client !== void 0,
			projectActiveRun: context ? (key, entry, agentId) => active(getTarget(key)?.key ?? key, entry, agentId) : void 0,
			entryFilter: (key, entry) => {
				const row = getTarget(key);
				return Boolean(row && (client === void 0 || (presentation.sharing.entryFilter?.(row.key, entry) ?? true))) && (opts.hasBoard === void 0 || row?.hasBoard === opts.hasBoard) && (!opts.activeOnly || Boolean(row && active(row.key, entry, row.agentId)?.active));
			}
		}
	};
}
/** Prepare selected rows, then authorize and present them in one synchronous boundary. */
async function listProjectedSessions(params) {
	const { projection, opts, key: exactKey, context, client, diagnostics } = params;
	const dirtyRowCount = projection.dirtyRowCount;
	const materializedBefore = projection.materializedCount;
	diagnostics?.mark("materialize");
	const waitStarted = performance.now();
	let yieldCount = 0;
	do {
		yieldCount++;
		await projection.ensureMaterialized();
	} while (projection.needsMaterialization);
	let prepareSyncMs = 0;
	const selectPage = () => {
		const started = performance.now();
		const syncCpu = diagnostics?.startSyncCpu();
		try {
			diagnostics?.mark("storeLoad");
			const now = Date.now();
			const { presentation, prepared, filters } = prepareProjectedSessionList({
				projection,
				opts,
				key: exactKey,
				context,
				client,
				now
			});
			diagnostics?.mark("filterSetup");
			return {
				now,
				presentation,
				prepared,
				selection: withAgentRosterFactsBatch(prepared.cfg, () => runSynchronousWork(selectSessionEntries({
					...filters,
					defaultLimit: 100
				})))
			};
		} finally {
			diagnostics?.finishSyncCpu("prepareThreadCpuMs", syncCpu);
			prepareSyncMs += performance.now() - started;
			if (diagnostics) diagnostics.projection.prepareSyncMs = prepareSyncMs;
			diagnostics?.mark("materialize");
		}
	};
	let page;
	return withReadySessionRows(projection, () => {
		page = selectPage();
		return page.selection.entries.flatMap(([key]) => {
			const target = page.prepared.getTarget(key);
			return target ? [{
				agentId: target.agentId,
				key: target.key,
				storePath: target.storeTarget.storePath
			}] : [];
		});
	}, () => {
		const resumed = performance.now();
		const { now, presentation, prepared, selection } = page;
		const { cfg, getTarget } = prepared;
		diagnostics?.mark("sharing");
		diagnostics?.mark("rows");
		const rowsStarted = performance.now();
		let syncCpu = diagnostics?.startSyncCpu();
		try {
			let materializedRowCount = 0;
			projection.setArchivePageSize(selection.entries.length);
			const sessions = selection.entries.flatMap(([key], index) => {
				const target = getTarget(key);
				const record = target && projection.describe({
					agentId: target.agentId,
					key: target.key,
					storePath: target.storeTarget.storePath
				});
				if (!record) return [];
				const includeTranscriptFields = index < 100 + selection.ownerCount;
				const row = presentation.present(record, {
					includeDerivedTitles: opts.includeDerivedTitles && includeTranscriptFields,
					includeLastMessage: opts.includeLastMessage && includeTranscriptFields,
					includeActivitySummary: opts.includeActivitySummary === true
				});
				if (!row) return [];
				bindSessionListRowRead(row, {
					projection,
					record,
					client
				});
				if ((record.materializedSequence ?? 0) > materializedBefore) materializedRowCount++;
				if (opts.activeOnly && sentinel(record.key)) {
					row.childSessions = void 0;
					row.hasActiveSubagentRun = void 0;
				}
				return [row];
			});
			diagnostics?.mark("decoration");
			const result = buildSessionsListResult(prepared, {
				...selection,
				now,
				storePath: prepared.storePath
			}, sessions);
			if (client !== void 0) result.defaults.modelSelectionTarget = resolveGatewayModelSelectionPolicy({
				callerScopes: client?.connect?.scopes ?? [],
				cfg
			}).target;
			diagnostics?.mark("visibilityRepair");
			if (diagnostics) Object.assign(diagnostics.projection, {
				prepareSyncMs,
				rowSyncMs: performance.now() - rowsStarted,
				yieldWaitMs: resumed - waitStarted - prepareSyncMs,
				yieldCount,
				selectedRowCount: sessions.length,
				dirtyRowCount,
				materializedRowCount,
				reusedRowCount: sessions.length - materializedRowCount
			});
			diagnostics?.finishSyncCpu("rowThreadCpuMs", syncCpu);
			syncCpu = void 0;
			params.onResult?.(result);
			return result;
		} finally {
			diagnostics?.finishSyncCpu("rowThreadCpuMs", syncCpu);
		}
	});
}
//#endregion
export { filterSessionEntries as a, prepareSessionRowSelection as i, listProjectedSessions as n, resolveGatewayModelSelectionPolicy as o, prepareProjectedSessionList as r, filterAndSortSessionEntries as t };
