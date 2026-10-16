import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { S as resolveIsConfigReadOnly } from "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { D as withAgentRosterFactsBatch, T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import "./operator-scopes-DsrPoRc4.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { g as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-D1TSJMmX.mjs";
import { h as isPinnableSessionEntry } from "./store-maintenance-CGOlSbiV.mjs";
import { s as sessionCreatorProfileId, t as MAX_SESSION_PARTICIPANTS } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { t as buildGroupDisplayName } from "./group-DiW6xNkZ.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { t as resolveSessionModelIdentityRef } from "./session-model-ref-zMXEXgI3.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { t as isConfiguredGatewaySessionEntry } from "./combined-store-gateway-KQyr45dp.mjs";
import { B as projectGatewaySessionRunState, H as resolveGatewaySessionGoal, U as resolveGatewaySessionKind, V as resolveGatewaySessionDisplayName, at as compareSessionEntryPairs, h as identity, i as withReadySessionRows, j as selectionRow, ot as sortAndLimitSessionEntries, st as sessionActivityTimestamp, z as projectGatewaySessionActiveRun } from "./session-row-prepared-read-eHG52FnK.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as getSessionDefaults } from "./session-utils-model-0e9R_Y2U.mjs";
import { a as projectSessionOwner, c as projectSessionPeople, d as resolveSessionListProfileReference, f as sortSessionOwnerFacet, l as projectSessionPeopleFacet, o as projectSessionParticipant, s as projectSessionParticipants, t as addSessionOwnerFacetIdentity, u as projectSessionProfileInvolvement } from "./session-identity-projection-CViuALyG.mjs";
import { n as readPreparedGatewayModelCatalogMetadata } from "./server-model-catalog-view-muuNaRwE.mjs";
import { n as isFinitePositiveTimestamp, o as resolveSessionChildOwners } from "./session-utils-core-tGMGyJu7.mjs";
import { o as resolveAssistantIdentity } from "./assistant-avatar-CM_Vhve2.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-BX-eWQU_.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-6vHANwv_.mjs";
import { n as prepareSessionRowPublication } from "./session-row-presentation-CxWwfXbM.mjs";
import { n as prepareOperatorModelPresentation } from "./operator-model-presentation-B_liypCy.mjs";
import { n as resolveStickyModelSelectionPolicy } from "./sticky-model-selection-DhufpkOc.mjs";
import { t as bindSessionListRowRead } from "./session-list-read-result-ymBunwrK.mjs";
import { performance } from "node:perf_hooks";
import pMap from "p-map";
//#region src/gateway/server-methods/session-model-selection-policy.ts
function resolveGatewayModelSelectionPolicy(params) {
	return resolveStickyModelSelectionPolicy({
		canPersistConfig: params.callerScopes.includes("operator.admin") && !resolveIsConfigReadOnly(process.env),
		cfg: params.cfg,
		...params.scope ? { scope: params.scope } : {}
	});
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
//#region src/shared/session-search-text.ts
/** Titles share word separators across Gateway selection and palette ranking. */
function normalizeSessionSearchText(value) {
	return normalizeLowercaseStringOrEmpty(value).replace(/[\p{P}\s]+/gu, " ").trim();
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
const staticSearchFields = /* @__PURE__ */ new WeakMap();
function createSessionListSearchMatcher(params) {
	const { cfg, search, now } = params;
	const titleSearch = normalizeSessionSearchText(search);
	let rowContext;
	const context = () => rowContext ??= params.getRowContext();
	return (key, entry) => {
		const target = expectDefined(params.getTarget(key), "search row owner");
		const storeKey = target.storeKey ?? key;
		let fields = staticSearchFields.get(target.selection);
		if (!fields) {
			const titles = [
				entry.label,
				entry.subject,
				entry.category,
				resolveSessionListSearchDisplayName(storeKey, entry),
				resolveGatewaySessionDisplayName(storeKey, entry)
			];
			const rawFields = [
				storeKey,
				entry.sessionId,
				...titles,
				resolveGatewaySessionKind(storeKey, entry)
			];
			addSessionListSearchModelFields(rawFields, {
				provider: entry.modelProvider,
				model: entry.model
			});
			fields = {
				literal: rawFields.map(normalizeLowercaseStringOrEmpty),
				titles: titles.map(normalizeSessionSearchText)
			};
			staticSearchFields.set(target.selection, fields);
		}
		if (fields.literal.some((field) => field.includes(search)) || titleSearch && fields.titles.some((field) => field.includes(titleSearch))) return true;
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
		if (matchesSessionListSearch([params.identityNames?.get(agentId)], search)) return true;
		const source = expectDefined(target.materialized?.source ?? target.getModelFacts?.(), "prepared search row model facts");
		if (!search.startsWith("agent:")) {
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
function createSessionCandidateFilter(params) {
	const { opts, now } = params;
	let rowContext;
	const getRowContext = () => rowContext ??= params.getRowContext();
	const includeGlobal = opts.includeGlobal === true;
	const includeUnknown = opts.includeUnknown === true;
	const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
	const label = normalizeOptionalString(opts.label) ?? "";
	const boardFace = opts.boardFace;
	const agentId = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
	return ([key, entry]) => {
		const target = expectDefined(params.getTarget(key), "selection row owner");
		const { selection } = target;
		const storeKey = target.storeKey ?? key;
		if (selection.isCronRun || opts.excludeCron === true && selection.isCron || opts.excludeSystem === true && selection.isSystem || opts.excludeSubagents === true && selection.isSubagent || !includeGlobal && storeKey === "global" || !includeUnknown && storeKey === "unknown") return false;
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
}
function createActivityPulse(opts) {
	const boundaries = opts.activityPulseBoundaries;
	if (!boundaries) return;
	return {
		since: boundaries[0],
		until: boundaries[boundaries.length - 1],
		buckets: Array.from({ length: boundaries.length - 1 }, () => 0),
		sessions: 0,
		...opts.activeMinutes === void 0 ? {} : { started: 0 },
		running: 0
	};
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
	const ownerSessionCounts = opts.includeOwnerSessionCounts ? /* @__PURE__ */ new Map() : void 0;
	const people = /* @__PURE__ */ new Map();
	let peopleSessionCount = 0;
	let peopleIncomplete = false;
	const activityPulse = createActivityPulse(opts);
	const pulsePeople = activityPulse && opts.includePeople ? /* @__PURE__ */ new Set() : void 0;
	const configuredAgentIds = params.configuredAgentIds ?? new Set(listAgentIds(cfg));
	const identities = params.userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const identityProjection = getRowContext().identityProjection;
	const projectOwner = identityProjection?.owner ?? projectSessionOwner;
	const projectParticipants = identityProjection?.participants ?? projectSessionParticipants;
	const projectInvolvement = identityProjection?.involvement ?? projectSessionProfileInvolvement;
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
	if (opts.involvingProfileId) for (const pair of params.entries) {
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
	const candidateEntries = opts.involvingProfileId ? visibleEntries : params.entries;
	const keepCandidate = createSessionCandidateFilter({
		...params,
		getRowContext
	});
	const matchesSearch = search ? createSessionListSearchMatcher({
		cfg,
		search,
		identityNames: params.identityNames,
		now,
		getTarget: params.getTarget,
		modelCatalog: params.modelCatalog instanceof Map ? params.modelCatalog : void 0,
		getRowContext,
		projectActiveRun: params.projectActiveRun
	}) : void 0;
	const participantKeys = /* @__PURE__ */ new Map();
	const matchesInvolvement = (entry, effectiveOwner, profileId, personal) => {
		const state = projectInvolvement(entry, profileId, identities);
		let participantKey = participantKeys.get(profileId);
		if (!participantKey) {
			participantKey = JSON.stringify({
				type: "profile",
				id: profileId
			});
			participantKeys.set(profileId, participantKey);
		}
		return !(personal && state?.hidden) && (Boolean(state?.lastMention || personal && state?.hidden === false) || effectiveOwner?.identity?.type === "profile" && effectiveOwner.identity.id === profileId || projectParticipants(entry, identities, cfg).has(participantKey));
	};
	for (const pair of candidateEntries) {
		if (shouldYield?.()) yield;
		const key = pair[0];
		const entry = pair[1];
		if (!opts.involvingProfileId && params.entryFilter?.(key, entry) === false || !keepCandidate(pair)) continue;
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
			if (pulsePeople) for (const person of associated) pulsePeople.add(person.identity.id);
		}
		if (ownerSessionCounts && entry.archivedAt === void 0 && effectiveOwner?.identity?.type === "profile") {
			const profileId = effectiveOwner.identity.id;
			const counts = ownerSessionCounts.get(profileId) ?? {
				profileId,
				open: 0,
				running: 0
			};
			const agentId = expectDefined(params.getTarget(key), "counted row owner").agentId;
			const active = params.projectActiveRun?.(key, entry, agentId);
			counts.open += 1;
			counts.running += Number(active?.active === true && active.status !== "queued");
			ownerSessionCounts.set(profileId, counts);
		}
		if (activityPulse) {
			const agentId = expectDefined(params.getTarget(key), "pulse row owner").agentId;
			activityPulse.sessions += 1;
			activityPulse.running += Number(params.projectActiveRun?.(key, entry, agentId)?.active === true);
			if (activityPulse.started !== void 0 && activeCutoff !== void 0) activityPulse.started += Number(entry.createdAt !== void 0 && entry.createdAt >= activeCutoff);
			const activityTs = sessionActivityTimestamp(entry);
			if (activityTs >= activityPulse.since && activityTs < activityPulse.until) {
				const bucket = opts.activityPulseBoundaries.findLastIndex((boundary) => boundary <= activityTs);
				activityPulse.buckets[bucket] = (activityPulse.buckets[bucket] ?? 0) + 1;
			}
		}
		if (effectiveOwner?.identity?.type === "profile" && effectiveOwner.identity.id === ownerFirstActorId) ownerEntries.push(pair);
		entries.push(pair);
	}
	const { people: visiblePeople, overflow } = projectSessionPeopleFacet(people, selectedProfileId);
	if (activityPulse && pulsePeople) activityPulse.people = pulsePeople.size;
	return {
		entries,
		ownerEntries,
		ownerFacet: sortSessionOwnerFacet(ownerFacet),
		...ownerSessionCounts ? { ownerSessionCounts: [...ownerSessionCounts.values()].toSorted((a, b) => a.profileId.localeCompare(b.profileId)) } : {},
		involvingProfileId: selectedProfileId,
		...activityPulse ? { activityPulse } : {},
		...opts.includePeople ? {
			people: visiblePeople,
			peopleIncomplete: peopleIncomplete || overflow,
			peopleSessionCount
		} : {}
	};
}
//#endregion
//#region src/gateway/session-utils-list.ts
function resolveSessionsListWindowLimit(limit, offset) {
	if (limit === void 0) return;
	const windowLimit = offset + limit;
	return Number.isFinite(windowLimit) ? Math.min(windowLimit, Number.MAX_SAFE_INTEGER) : void 0;
}
function* selectSessionEntries(params) {
	const { ownerEntries, entries: filtered, ...facets } = yield* filterSessionEntries(params);
	const limit = resolveOptionalIntegerOption(params.opts.limit, { min: 1 }) ?? params.defaultLimit;
	const offset = resolveNonNegativeIntegerOption(params.opts.offset, 0);
	const windowLimit = resolveSessionsListWindowLimit(limit, offset);
	const sortedWindow = params.entriesSorted ? filtered.slice(0, windowLimit) : yield* sortAndLimitSessionEntries(filtered, windowLimit, params.opts.sortBy, params.shouldYield);
	const sharedEntries = limit === void 0 ? sortedWindow.slice(offset) : sortedWindow.slice(offset, offset + limit);
	let entries = sharedEntries;
	let ownerCount = 0;
	if (params.ownerFirstActorId && offset === 0) {
		const ownerLimit = Math.min(limit ?? 60, 60);
		const owned = params.entriesSorted ? ownerEntries.slice(0, ownerLimit) : yield* sortAndLimitSessionEntries(ownerEntries, ownerLimit, params.opts.sortBy, params.shouldYield);
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
function buildSessionsListResult(params, list, sessions, policyConfig, client) {
	const { cfg, opts, modelCatalog } = params;
	const defaultsAgentId = normalizeAgentId(opts.agentId || (tryResolveLegacyCompatibilityAgentId(cfg) ?? "main"));
	const preparedDefaultsCatalog = modelCatalog instanceof Map ? modelCatalog.get(defaultsAgentId) : void 0;
	const defaultsCatalog = modelCatalog instanceof Map ? preparedDefaultsCatalog?.entries : modelCatalog;
	const metadataSnapshot = readPreparedGatewayModelCatalogMetadata(preparedDefaultsCatalog);
	const defaults = getSessionDefaults(cfg, defaultsCatalog, {
		...opts.agentId ? { agentId: opts.agentId } : {},
		allowPluginNormalization: false,
		providerPolicySource: preparedDefaultsCatalog?.pluginRegistry,
		metadataSnapshot
	});
	const policy = client === void 0 ? void 0 : prepareOperatorModelPresentation({
		cfg,
		policyConfig,
		client,
		metadataSnapshot
	})?.forAgent(defaultsAgentId, defaultsCatalog);
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
		...list.ownerSessionCounts ? { ownerSessionCounts: list.ownerSessionCounts } : {},
		involvingProfileId: list.involvingProfileId,
		...list.activityPulse ? { activityPulse: list.activityPulse } : {},
		...list.people ? {
			people: list.people,
			peopleIncomplete: list.peopleIncomplete,
			peopleSessionCount: list.peopleSessionCount
		} : {},
		defaults: policy ? policy.defaults(defaults) : defaults,
		sessions
	};
}
const sentinel = (key) => key === "global" || key === "unknown";
function createSessionRowSelection(cfg, scope, activeOnly) {
	const groups = /* @__PURE__ */ new Map();
	const winners = /* @__PURE__ */ new Map();
	const duplicates = /* @__PURE__ */ new Set();
	const orders = /* @__PURE__ */ new Map();
	let position = 0;
	const keyFor = (row) => sentinel(row.key) && activeOnly ? JSON.stringify([row.key, row.agentId]) : row.key;
	const update = (id, key, row) => {
		const previous = groups.get(key);
		const oldWinner = winners.get(key);
		const candidate = previous?.get(id);
		const eligible = row && scope.paths.has(row.storeTarget.storePath) && (!scope.agentId || row.agentId === scope.agentId) && (!scope.configuredAgentIds || isConfiguredGatewaySessionEntry(cfg, scope.configuredAgentIds, row.key, row.entry));
		const group = previous ?? /* @__PURE__ */ new Map();
		if (eligible) {
			group.set(id, {
				row,
				pair: [key, row.entry],
				position: candidate?.position ?? position++
			});
			groups.set(key, group);
		} else {
			group.delete(id);
			if (!group.size) groups.delete(key);
		}
		let winner;
		for (const target of group.values()) if (!winner || scope.paths.get(target.row.storeTarget.storePath) < scope.paths.get(winner.row.storeTarget.storePath)) winner = target;
		if (group.size > 1 && !sentinel(winner.row.key)) duplicates.add(key);
		else duplicates.delete(key);
		if (winner) winners.set(key, winner);
		else winners.delete(key);
		if (winner === oldWinner) return;
		for (const [sortBy, entries] of orders) {
			const locate = (pair) => {
				let lo = 0, hi = entries.length;
				while (lo < hi) {
					const mid = lo + hi >>> 1;
					if (compareSessionEntryPairs(entries[mid], pair, sortBy) < 0) lo = mid + 1;
					else hi = mid;
				}
				return lo;
			};
			if (oldWinner) entries.splice(locate(oldWinner.pair), 1);
			if (winner) entries.splice(locate(winner.pair), 0, winner.pair);
		}
	};
	return {
		add(row) {
			update(identity(row), keyFor(row), row);
		},
		change(change) {
			update(change.id, keyFor(change), change.row);
		},
		read(sortBy) {
			for (const key of duplicates) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${key}`);
			let entries = sortBy && orders.get(sortBy);
			if (!entries) {
				const targets = [...winners.values()];
				if (!sortBy) targets.sort((a, b) => a.position - b.position);
				entries = targets.map((target) => target.pair);
				if (sortBy) {
					entries.sort((a, b) => compareSessionEntryPairs(a, b, sortBy));
					orders.set(sortBy, entries);
				}
			}
			return {
				entries,
				get: (key) => winners.get(key)?.row
			};
		}
	};
}
const sessionRowSelections = /* @__PURE__ */ new WeakMap();
/** Preserve federation before caller visibility and activity filters. */
function prepareSessionRowSelection(projection, opts, prepared) {
	const { cfg, modelCatalog, scope, rowContext: residentContext } = projection.state;
	const selectedScope = scope(opts);
	const now = prepared?.now ?? Date.now();
	const rowContext = prepared?.rowContext ?? {
		...residentContext,
		subagentRuns: residentContext.subagentRuns.atTime(now)
	};
	const keyed = prepared?.key !== void 0 || prepared?.sessionIdOrKey !== void 0;
	const parentSessionKey = !keyed && !opts.involvingProfileId ? opts.spawnedBy : void 0;
	const broad = !keyed && !parentSessionKey;
	const activeOnly = opts.activeOnly === true;
	let scopes = sessionRowSelections.get(projection);
	if (!scopes) {
		scopes = /* @__PURE__ */ new Map();
		sessionRowSelections.set(projection, scopes);
		const current = scopes;
		projection.onSelectionChange((change) => {
			if (change.kind === "reset") current.clear();
			else for (const variants of current.values()) for (const selection of variants.values()) selection.change(change);
		});
	}
	const retained = broad && prepared?.ordered && selectedScope.paths.size > 0;
	let selection = retained ? scopes.get(selectedScope)?.get(activeOnly) : void 0;
	if (!selection) {
		selection = createSessionRowSelection(cfg, selectedScope, activeOnly);
		for (const row of projection.selectEntries({
			agentId: selectedScope.agentId,
			key: prepared?.key,
			sessionIdOrKey: prepared?.sessionIdOrKey,
			parentSessionKey,
			sortBy: null
		}, prepared?.metadataPrepared === true)) selection.add(selectionRow(row));
		if (retained) {
			let variants = scopes.get(selectedScope);
			if (!variants) scopes.set(selectedScope, variants = /* @__PURE__ */ new Map());
			variants.set(activeOnly, selection);
		}
	}
	const selected = selection.read(prepared?.ordered ? opts.sortBy ?? "updatedAt" : void 0);
	const { entries } = selected;
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
			const winner = selected.get(key);
			if (!winner || !opts.search && key === winner.key) return winner;
			const query = {
				agentId: winner.agentId,
				key: winner.key,
				storePath: winner.storeTarget.storePath
			};
			return {
				...winner,
				...opts.search && projection.isMaterialized(query) ? { materialized: projection.capture(query)?.materialized } : {},
				...key !== winner.key ? { storeKey: winner.key } : {},
				getModelFacts: () => projection.modelFacts(query, prepared?.metadataPrepared === true)
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
/** Acquire mutable workspace names before entering synchronous visibility and selection. */
async function prepareSessionSearchIdentityNames(projection, opts, metadataPrepared = false) {
	const prepared = prepareSessionRowSelection(projection, opts, {
		metadataPrepared,
		ordered: true
	});
	const scope = projection.state.scope(opts);
	const agentIds = new Set(scope.agentId ? [scope.agentId] : listAgentIds(prepared.cfg));
	for (const [key] of prepared.entries) {
		const agentId = prepared.getTarget(key)?.agentId;
		if (agentId) agentIds.add(agentId);
	}
	const identities = await pMap([...agentIds], (agentId) => resolveAssistantIdentity({
		cfg: prepared.cfg,
		agentId
	}), { concurrency: 4 });
	return {
		cfg: prepared.cfg,
		names: new Map(identities.map(({ agentId, name }) => [agentId, name]))
	};
}
/** Shared synchronous membership policy for list pages and full-roster transcript search. */
function prepareProjectedSessionList(params) {
	const { projection, opts, key: exactKey, context, client, now } = params;
	if (params.searchIdentities && params.searchIdentities.cfg !== projection.state.cfg) throw new Error("Session identity configuration changed while reading; retry the request");
	const presentation = prepareSessionRowPublication(projection, now)(client, context ? createVisibleActiveSessionRunProjector(context, projection.state.rowContext.projectedAgentRuns) : void 0);
	const prepared = prepareSessionRowSelection(projection, opts, {
		key: exactKey,
		now,
		rowContext: presentation.rowContext,
		metadataPrepared: params.metadataPrepared,
		ordered: true
	});
	const { getTarget } = prepared;
	const { active } = presentation;
	const identity = gatewayClientSessionCreator(client ?? null)?.id;
	return {
		prepared,
		presentation,
		filters: {
			...prepared,
			identityNames: params.searchIdentities?.names,
			entriesSorted: true,
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
	return projection.withSelectionPreparation(async () => {
		const dirtyRowCount = projection.dirtyRowCount;
		const materializedBefore = projection.materializedCount;
		diagnostics?.mark("materialize");
		const waitStarted = performance.now();
		let yieldCount = 0;
		let searchIdentities;
		do {
			yieldCount++;
			await projection.prepareSelection(true);
			if (opts.search?.trim()) searchIdentities = await prepareSessionSearchIdentityNames(projection, opts, true);
		} while (projection.needsSelectionPreparation() || searchIdentities && searchIdentities.cfg !== projection.state.cfg);
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
					now,
					searchIdentities,
					metadataPrepared: true
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
				const sharedRows = [];
				const sessions = selection.entries.flatMap(([key], index) => {
					const target = getTarget(key);
					const record = target && projection.describe({
						agentId: target.agentId,
						key: target.key,
						storePath: target.storeTarget.storePath
					});
					if (!record) return [];
					const includeTranscriptFields = index < 100 + selection.ownerCount;
					const sharedRow = presentation.present(record, {
						includeDerivedTitles: opts.includeDerivedTitles && includeTranscriptFields,
						includeLastMessage: opts.includeLastMessage && includeTranscriptFields,
						includeActivitySummary: opts.includeActivitySummary === true,
						rowMode: opts.rowMode,
						omitSentinelChildren: opts.activeOnly && sentinel(record.key)
					});
					if (!sharedRow) return [];
					sharedRows.push(sharedRow);
					const row = { ...sharedRow };
					bindSessionListRowRead(row, {
						projection,
						record,
						client
					});
					if ((record.materializedSequence ?? 0) > materializedBefore) materializedRowCount++;
					return [row];
				});
				diagnostics?.mark("decoration");
				const result = buildSessionsListResult(prepared, {
					...selection,
					now,
					storePath: prepared.storePath
				}, sessions, context?.getCommittedRuntimeConfig?.() ?? cfg, client);
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
				params.onResult?.(result, sharedRows);
				return result;
			} finally {
				diagnostics?.finishSyncCpu("rowThreadCpuMs", syncCpu);
			}
		}, { selection: true });
	});
}
//#endregion
export { prepareSessionSearchIdentityNames as a, prepareSessionRowSelection as i, listProjectedSessions as n, filterSessionEntries as o, prepareProjectedSessionList as r, resolveGatewayModelSelectionPolicy as s, filterAndSortSessionEntries as t };
