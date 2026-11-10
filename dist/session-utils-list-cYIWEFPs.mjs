import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { Tt as buildGroupDisplayName } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as sessionDeliveryChannel, r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import { m as sessionCreatorProfileId, s as MAX_SESSION_PARTICIPANTS } from "./session-entry-lineage-B7Mubzwj.mjs";
import { p as isPinnableSessionEntry } from "./store-maintenance-BqMt1Twc.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { n as resolveSessionModelIdentityRef } from "./session-model-ref-BTkDCi12.mjs";
import { n as isFinitePositiveTimestamp, r as matchesSessionArchiveFilter, s as resolveSessionChildOwners } from "./session-utils-core-DYhQWF9T.mjs";
import { t as getSessionDefaults } from "./session-utils-model-Bx2gzKtO.mjs";
import { J as sortAndLimitSessionEntries, h as identity, i as withReadySessionRows, j as selectionRow, q as compareSessionEntryPairs } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { n as isConfiguredGatewaySessionEntry } from "./combined-store-gateway-D1UQome7.mjs";
import { t as sessionActivityTimestamp } from "./session-activity-timestamp-AzhKZXR9.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { a as projectSessionOwner, c as projectSessionPeople, d as resolveSessionListProfileReference, f as sortSessionOwnerFacet, l as projectSessionPeopleFacet, o as projectSessionParticipant, s as projectSessionParticipants, t as addSessionOwnerFacetIdentity, u as projectSessionProfileInvolvements } from "./session-identity-projection-sgwF_hD_.mjs";
import { n as readPreparedGatewayModelCatalogMetadata, r as readPreparedGatewayModelMetadata } from "./server-model-catalog-view-DGYC_Ub2.mjs";
import { s as resolveAssistantIdentity } from "./assistant-avatar-DB_cUu5U.mjs";
import { a as parseGroupKey, t as isGroupOrChannelDisplaySession } from "./session-utils-store-lW7Wu3P0.mjs";
import { a as resolveGatewaySessionKind, i as resolveGatewaySessionGoal, n as projectGatewaySessionRunState, r as resolveGatewaySessionDisplayName, t as projectGatewaySessionActiveRun } from "./session-utils-display-DdkO-Qt-.mjs";
import { i as shareSidebarSessionRows, n as prepareSessionRowPublication } from "./session-row-presentation-L_akTnVb.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-CAoWtmWT.mjs";
import { t as resolveGatewayModelSelectionPolicy } from "./session-model-selection-policy-Ch870Lfm.mjs";
import { t as bindSessionListRowRead } from "./session-list-read-result-_90Ix9m0.mjs";
import { performance } from "node:perf_hooks";
import pMap from "p-map";
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
/** Titles share canonical Unicode and word separators across Gateway selection and palette ranking. */
function normalizeSessionSearchText(value) {
	return normalizeLowercaseStringOrEmpty(value).normalize("NFC").replace(/[\p{P}\s]+/gu, " ").trim();
}
//#endregion
//#region src/gateway/session-list-filters.ts
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
function* filterSessionEntries(params, window) {
	const { cfg, opts, now, shouldYield, configuredAgentIds } = params;
	let rowContext;
	const getRowContext = () => rowContext ??= params.getRowContext();
	const search = normalizeLowercaseStringOrEmpty(opts.search);
	const activeMinutes = typeof opts.activeMinutes === "number" && Number.isFinite(opts.activeMinutes) ? Math.max(1, Math.floor(opts.activeMinutes)) : void 0;
	const creatorId = normalizeOptionalString(opts.creatorId);
	const ownerId = normalizeOptionalString(opts.ownerId);
	const ownerFirstActorId = normalizeOptionalString(params.ownerFirstActorId);
	const activeCutoff = activeMinutes === void 0 ? void 0 : now - activeMinutes * 6e4;
	let activityExpiresAt = Infinity;
	const entries = [];
	let totalCount = 0;
	const ownerEntries = [];
	const ownerFacet = /* @__PURE__ */ new Map();
	const ownerSessionCounts = opts.includeOwnerSessionCounts ? /* @__PURE__ */ new Map() : void 0;
	const ownerSessionProfiles = ownerSessionCounts ? /* @__PURE__ */ new Map() : void 0;
	const people = /* @__PURE__ */ new Map();
	let peopleSessionCount = 0;
	let peopleIncomplete = false;
	const activityPulse = createActivityPulse(opts);
	const pulsePeople = activityPulse && opts.includePeople ? /* @__PURE__ */ new Set() : void 0;
	const identities = params.userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const identityProjection = getRowContext().identityProjection;
	const projectOwner = identityProjection?.owner ?? projectSessionOwner;
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
	if (opts.involvingProfileId) for (const pair of params.entries("all")) {
		if (params.entryFilter?.(pair[0], pair[1], expectDefined(params.getTarget(pair[0]), "selection row owner")) ?? true) visibleEntries.push(pair);
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
	const candidateEntries = opts.involvingProfileId ? visibleEntries.filter(([, entry]) => matchesSessionArchiveFilter(entry, opts.archived)) : params.entries(opts.archived);
	const includeGlobal = opts.includeGlobal === true;
	const includeUnknown = opts.includeUnknown === true;
	const spawnedBy = typeof opts.spawnedBy === "string" ? opts.spawnedBy : "";
	const label = normalizeOptionalString(opts.label) ?? "";
	const boardFace = opts.boardFace;
	const agentFilter = typeof opts.agentId === "string" ? normalizeAgentId(opts.agentId) : "";
	const titleSearch = search && normalizeSessionSearchText(search);
	const matchesSearch = search ? (key, entry) => {
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
		const metadataSnapshot = readPreparedGatewayModelCatalogMetadata(params.modelCatalog instanceof Map ? params.modelCatalog.get(agentId) : void 0);
		const run = projectGatewaySessionRunState({
			key: storeKey,
			entry,
			now,
			rowContext: getRowContext()
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
		const source = expectDefined(params.getModelFacts, "prepared search row model facts")(key);
		if (!search.startsWith("agent:")) {
			const subagentRun = getRowContext().subagentRuns.getDisplaySubagentRun(storeKey);
			const resolvedModel = resolveSessionModelIdentityRef(cfg, entry, agentId, subagentRun?.model, {
				allowPluginNormalization: false,
				manifestPlugins: metadataSnapshot,
				configuredDefaultModelByAgent: getRowContext().configuredDefaultModelByAgent
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
	} : void 0;
	const personalKeys = involvingActorId && params.involvementKeys(involvingActorId, true);
	const relationKeys = profileRelation?.relationship === "involving" ? params.involvementKeys(profileRelation.profileId, false) : void 0;
	for (const pair of candidateEntries) {
		if (shouldYield?.()) yield;
		const key = pair[0];
		const entry = pair[1];
		if (opts.requireLastInteraction === true && (!isFinitePositiveTimestamp(entry.lastInteractionAt) || normalizeOptionalString(entry.heartbeatIsolatedBaseSessionKey))) continue;
		if (label && entry.label !== label || boardFace && entry.boardFace !== boardFace) continue;
		if (opts.projectId !== void 0 && entry.projectId !== opts.projectId) continue;
		if (opts.workspaceDir !== void 0 && (entry.spawnedCwd ?? entry.spawnedWorkspaceDir) !== opts.workspaceDir) continue;
		if (opts.group !== void 0 && (entry.category ?? "") !== opts.group) continue;
		const target = expectDefined(params.getTarget(key), "selection row owner");
		if (!opts.involvingProfileId && params.entryFilter?.(key, entry, target) === false) continue;
		const { selection } = target;
		const storeKey = target.storeKey ?? key;
		if (selection.isCronRun || opts.excludeCron === true && selection.isCron || opts.excludeSystem === true && selection.isSystem || opts.excludeDock === true && selection.isDock || opts.excludeSubagents === true && selection.isSubagent || !includeGlobal && storeKey === "global" || !includeUnknown && storeKey === "unknown") continue;
		if (agentFilter && storeKey !== "global") {
			if ((target.storeKey ? normalizeAgentId(target.agentId) : selection.agentId) !== agentFilter) continue;
		}
		if (selection.isPhantom) continue;
		if (spawnedBy) {
			if (storeKey === "unknown" || storeKey === "global") continue;
			if (!resolveSessionChildOwners({
				key,
				entry,
				now,
				subagentRuns: getRowContext().subagentRuns
			}).includes(spawnedBy)) continue;
		}
		if (opts.pinned !== void 0 && (entry.pinnedAt !== void 0 && isPinnableSessionEntry(storeKey, entry)) !== opts.pinned) continue;
		if (matchesSearch && !matchesSearch(key, entry)) continue;
		if (activeMinutes !== void 0) {
			const expiresAt = (opts.sortBy === "activity" ? sessionActivityTimestamp(entry) : entry.updatedAt ?? 0) + activeMinutes * 6e4;
			if (expiresAt < now) continue;
			activityExpiresAt = Math.min(activityExpiresAt, expiresAt);
		}
		const effectiveOwner = projectOwner(entry, identities, cfg, configuredAgentIds)?.actor;
		if (profileRelation?.relationship === "owned" && (effectiveOwner?.identity?.type !== "profile" || effectiveOwner.identity.id !== profileRelation.profileId)) continue;
		if (profileRelation?.relationship === "created") {
			const createdProfileId = sessionCreatorProfileId(entry.createdActor);
			if (!createdProfileId || projectSessionParticipant({
				type: "profile",
				id: createdProfileId
			}, identities, cfg).identity.id !== profileRelation.profileId) continue;
		}
		if (profileRelation?.relationship === "involving" && !relationKeys?.has(key)) continue;
		if (effectiveOwner) addSessionOwnerFacetIdentity(ownerFacet, effectiveOwner);
		if (creatorId && entry.createdActor?.id !== creatorId) continue;
		if (ownerId && effectiveOwner?.id !== ownerId) continue;
		if (personalKeys && !personalKeys.has(key)) continue;
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
			counts.open += 1;
			ownerSessionProfiles.set(key, profileId);
			ownerSessionCounts.set(profileId, counts);
		}
		if (activityPulse) {
			const agentId = target.agentId;
			activityPulse.sessions += 1;
			activityPulse.running += Number(params.projectActiveRun?.(key, entry, agentId)?.active === true);
			if (activityPulse.started !== void 0 && activeCutoff !== void 0) activityPulse.started += Number(entry.createdAt !== void 0 && entry.createdAt >= activeCutoff);
			const activityTs = sessionActivityTimestamp(entry);
			if (activityTs >= activityPulse.since && activityTs < activityPulse.until) {
				const bucket = opts.activityPulseBoundaries.findLastIndex((boundary) => boundary <= activityTs);
				activityPulse.buckets[bucket] = (activityPulse.buckets[bucket] ?? 0) + 1;
			}
		}
		if (effectiveOwner?.identity?.type === "profile" && effectiveOwner.identity.id === ownerFirstActorId && (!window || ownerEntries.length < window.ownerLimit)) ownerEntries.push(pair);
		if (!window || totalCount >= window.offset && (window.limit === void 0 || entries.length < window.limit)) entries.push(pair);
		totalCount++;
	}
	const { people: visiblePeople, overflow } = projectSessionPeopleFacet(people, selectedProfileId);
	if (activityPulse && pulsePeople) activityPulse.people = pulsePeople.size;
	return {
		entries,
		ownerEntries,
		totalCount,
		ownerFacet: sortSessionOwnerFacet(ownerFacet),
		...ownerSessionCounts ? {
			ownerSessionProfiles,
			ownerSessionCounts: [...ownerSessionCounts.values()].toSorted((a, b) => a.profileId.localeCompare(b.profileId))
		} : {},
		involvingProfileId: selectedProfileId,
		...Number.isFinite(activityExpiresAt) ? { activityExpiresAt } : {},
		...activityPulse ? { activityPulse } : {},
		...opts.includePeople ? {
			people: visiblePeople,
			peopleIncomplete: peopleIncomplete || overflow,
			peopleSessionCount
		} : {}
	};
}
/** Open membership is metadata; running state is read from the current runtime owners. */
function projectSessionOwnerRunningCounts(params, selection, candidateKeys) {
	if (!selection.ownerSessionCounts || !selection.ownerSessionProfiles) return selection;
	const counts = new Map(selection.ownerSessionCounts.map((count) => [count.profileId, {
		...count,
		running: 0
	}]));
	const context = params.getRowContext();
	for (const key of candidateKeys()) {
		const profileId = selection.ownerSessionProfiles.get(key);
		if (profileId === void 0) continue;
		const target = params.getTarget(key);
		if (!target) continue;
		const active = params.projectActiveRun?.(key, target.entry, target.agentId);
		const storeKey = target.storeKey ?? key;
		if (active?.active === true && active.status !== "queued" || context.subagentRuns.countActiveDescendantRuns(storeKey) > 0 || context.projectedSubagentActivity?.has(storeKey) === true) counts.get(profileId).running += 1;
	}
	return {
		...selection,
		ownerSessionCounts: [...counts.values()]
	};
}
//#endregion
//#region src/gateway/session-row-selection.ts
const sentinel$1 = (key) => key === "global" || key === "unknown";
const EMPTY_KEYS = /* @__PURE__ */ new Set();
function createSessionRowSelection(cfg, scope, activeOnly, getContext) {
	const groups = /* @__PURE__ */ new Map();
	const winners = /* @__PURE__ */ new Map();
	const duplicates = /* @__PURE__ */ new Set();
	const orders = /* @__PURE__ */ new Map();
	const personalInvolvements = /* @__PURE__ */ new Map();
	const relatedInvolvements = /* @__PURE__ */ new Map();
	const rowInvolvements = /* @__PURE__ */ new Map();
	const changedInvolvements = /* @__PURE__ */ new Set();
	const configuredAgentIds = scope.ownerAgentIds;
	let involvementRevision;
	const removeInvolvement = (key) => {
		const previous = rowInvolvements.get(key);
		if (!previous) return;
		for (const [profiles, index] of [[previous.personal, personalInvolvements], [previous.related, relatedInvolvements]]) for (const profileId of profiles) {
			const keys = index.get(profileId);
			keys.delete(key);
			if (!keys.size) index.delete(profileId);
		}
		rowInvolvements.delete(key);
	};
	const prepareInvolvements = () => {
		const context = getContext();
		const revision = context.identityProjection?.revision ?? context.userProfileIdentityById;
		if (involvementRevision !== revision) {
			personalInvolvements.clear();
			relatedInvolvements.clear();
			rowInvolvements.clear();
			changedInvolvements.clear();
			for (const key of winners.keys()) changedInvolvements.add(key);
			involvementRevision = revision;
		}
		const identities = context.userProfileIdentityById;
		for (const key of changedInvolvements) {
			const { entry } = winners.get(key).row;
			const related = /* @__PURE__ */ new Set();
			const owner = (context.identityProjection?.owner ?? projectSessionOwner)(entry, identities, cfg, configuredAgentIds)?.actor;
			if (owner?.identity?.type === "profile") related.add(owner.identity.id);
			const participants = (context.identityProjection?.participants ?? projectSessionParticipants)(entry, identities, cfg);
			for (const participant of participants.values()) if (participant.identity.type === "profile") related.add(participant.identity.id);
			const states = (context.identityProjection?.involvement ?? projectSessionProfileInvolvements)(entry, identities);
			for (const [profileId, state] of states) if (state.lastMention) related.add(profileId);
			const personal = new Set(related);
			for (const [profileId, state] of states) if (state.hidden) personal.delete(profileId);
			else personal.add(profileId);
			for (const [profiles, index] of [[personal, personalInvolvements], [related, relatedInvolvements]]) for (const profileId of profiles) {
				const keys = index.get(profileId) ?? /* @__PURE__ */ new Set();
				keys.add(key);
				index.set(profileId, keys);
			}
			if (personal.size || related.size) rowInvolvements.set(key, {
				personal,
				related
			});
		}
		changedInvolvements.clear();
	};
	let position = 0;
	const keyFor = (row) => sentinel$1(row.key) && activeOnly ? JSON.stringify([row.key, row.agentId]) : row.key;
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
		if (group.size > 1 && !sentinel$1(winner.row.key)) duplicates.add(key);
		else duplicates.delete(key);
		if (winner) winners.set(key, winner);
		else winners.delete(key);
		if (winner === oldWinner) return;
		if (involvementRevision) {
			removeInvolvement(key);
			if (winner) changedInvolvements.add(key);
			else changedInvolvements.delete(key);
		}
		for (const { sortBy, archived, entries } of orders.values()) {
			const locate = (pair) => {
				let lo = 0, hi = entries.length;
				while (lo < hi) {
					const mid = lo + hi >>> 1;
					if (compareSessionEntryPairs(entries[mid], pair, sortBy) < 0) lo = mid + 1;
					else hi = mid;
				}
				return lo;
			};
			if (oldWinner && matchesSessionArchiveFilter(oldWinner.row.entry, archived)) entries.splice(locate(oldWinner.pair), 1);
			if (winner && matchesSessionArchiveFilter(winner.row.entry, archived)) entries.splice(locate(winner.pair), 0, winner.pair);
		}
	};
	return {
		add(row) {
			update(identity(row), keyFor(row), row);
		},
		change(change) {
			update(change.id, keyFor(change), change.row);
		},
		read(sortBy, candidates) {
			for (const key of duplicates) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${key}`);
			return {
				configuredAgentIds,
				entries(archived) {
					const orderKey = `${sortBy}:${archived ?? false}`;
					let entries = !candidates && sortBy && orders.get(orderKey)?.entries;
					if (!entries) {
						const targets = (candidates ? [...new Set(Array.from(candidates, keyFor))].flatMap((key) => winners.get(key) ?? []) : [...winners.values()]).filter((target) => matchesSessionArchiveFilter(target.row.entry, archived));
						if (!sortBy) targets.sort((a, b) => a.position - b.position);
						entries = targets.map((target) => target.pair);
						if (sortBy) {
							entries.sort((a, b) => compareSessionEntryPairs(a, b, sortBy));
							if (!candidates) orders.set(orderKey, {
								sortBy,
								archived,
								entries
							});
						}
					}
					return entries;
				},
				get: (key) => winners.get(key)?.row,
				involvementKeys(profileId, personal) {
					prepareInvolvements();
					return (personal ? personalInvolvements : relatedInvolvements).get(profileId) ?? EMPTY_KEYS;
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/session-utils-list.ts
function* selectSessionEntries(params) {
	const limit = resolveOptionalIntegerOption(params.opts.limit, { min: 1 }) ?? params.defaultLimit;
	const offset = resolveNonNegativeIntegerOption(params.opts.offset, 0);
	const ownerLimit = params.ownerFirstActorId && offset === 0 ? Math.min(limit ?? 60, 60) : 0;
	const { ownerEntries, entries: filtered, ...facets } = yield* filterSessionEntries(params, params.entriesSorted ? {
		offset,
		limit,
		ownerLimit
	} : void 0);
	const sharedEntries = params.entriesSorted ? filtered : (yield* sortAndLimitSessionEntries(filtered, limit === void 0 ? void 0 : Math.min(offset + limit, Number.MAX_SAFE_INTEGER), params.opts.sortBy, params.shouldYield)).slice(offset);
	let entries = sharedEntries;
	let ownerCount = 0;
	if (ownerLimit > 0) {
		const owned = params.entriesSorted ? ownerEntries : yield* sortAndLimitSessionEntries(ownerEntries, ownerLimit, params.opts.sortBy, params.shouldYield);
		ownerCount = owned.length;
		const ownedKeys = new Set(owned.map(([key]) => key));
		entries = [...owned, ...sharedEntries.filter(([key]) => !ownedKeys.has(key))];
	}
	const nextOffset = offset + sharedEntries.length;
	const hasMore = nextOffset < facets.totalCount;
	return {
		...facets,
		entries,
		ownerCount,
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
	const metadataSnapshot = readPreparedGatewayModelMetadata(cfg, preparedDefaultsCatalog);
	const defaults = getSessionDefaults(cfg, defaultsCatalog, {
		...opts.agentId ? { agentId: opts.agentId } : {},
		allowPluginNormalization: false,
		providerPolicySource: preparedDefaultsCatalog?.pluginRegistry ?? "active",
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
		...list.activityExpiresAt !== void 0 ? { activityExpiresAt: list.activityExpiresAt } : {},
		...list.activityPulse ? { activityPulse: list.activityPulse } : {},
		...list.people ? {
			people: list.people,
			peopleIncomplete: list.peopleIncomplete,
			peopleSessionCount: list.peopleSessionCount
		} : {},
		defaults: policy ? policy.defaults(defaults) : defaults,
		...opts.rowMode === "sidebar" ? shareSidebarSessionRows(sessions, opts.ifRowsRevision) : { sessions }
	};
}
const sentinel = (key) => key === "global" || key === "unknown";
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
	const keyed = prepared?.key !== void 0 || prepared?.sessionIdOrKey !== void 0 || prepared?.candidateKeys !== void 0;
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
		selection = createSessionRowSelection(cfg, selectedScope, activeOnly, () => projection.state.rowContext);
		const queries = prepared?.candidateKeys ? [...prepared.candidateKeys].map((key) => ({ key })) : [{
			key: prepared?.key,
			sessionIdOrKey: prepared?.sessionIdOrKey,
			parentSessionKey
		}];
		for (const row of queries.flatMap((query) => projection.selectEntries({
			agentId: selectedScope.agentId,
			...query,
			sortBy: null
		}, prepared?.metadataPrepared === true))) selection.add(selectionRow(row));
		if (retained) {
			let variants = scopes.get(selectedScope);
			if (!variants) scopes.set(selectedScope, variants = /* @__PURE__ */ new Map());
			variants.set(activeOnly, selection);
		}
	}
	const candidates = prepared?.candidateSessionIdsOrKeys && Array.from(prepared.candidateSessionIdsOrKeys).flatMap((sessionIdOrKey) => projection.selectEntries({
		agentId: selectedScope.agentId,
		sessionIdOrKey,
		sortBy: null
	}, prepared.metadataPrepared === true));
	const selected = selection.read(prepared?.ordered ? opts.sortBy ?? "updatedAt" : void 0, candidates);
	const { entries } = selected;
	return {
		cfg,
		opts,
		now,
		modelCatalog,
		entries,
		configuredAgentIds: selected.configuredAgentIds,
		involvementKeys: selected.involvementKeys,
		candidateKeys(identities) {
			return new Set(Array.from(identities).flatMap((sessionIdOrKey) => projection.selectEntries({
				agentId: selectedScope.agentId,
				sessionIdOrKey,
				sortBy: null
			}, prepared?.metadataPrepared === true).map((row) => sentinel(row.key) && activeOnly ? JSON.stringify([row.key, row.agentId]) : row.key)));
		},
		storePath: selectedScope.path,
		userProfileIdentityById: rowContext.userProfileIdentityById,
		getRowContext: () => rowContext,
		getTarget: (key) => {
			const winner = selected.get(key);
			return !winner || key === winner.key ? winner : {
				...winner,
				storeKey: winner.key
			};
		},
		getModelFacts: (key) => {
			const winner = selected.get(key);
			return projection.modelFacts({
				agentId: winner.agentId,
				key: winner.key,
				storePath: winner.storeTarget.storePath
			}, prepared?.metadataPrepared === true);
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
	for (const [key] of prepared.entries("all")) {
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
	const projectRun = context ? createVisibleActiveSessionRunProjector(context, projection.state.rowContext.projectedAgentRuns) : void 0;
	const presentation = prepareSessionRowPublication(projection, now)(client, projectRun);
	const prepared = prepareSessionRowSelection(projection, opts, {
		key: exactKey,
		now,
		rowContext: presentation.rowContext,
		metadataPrepared: params.metadataPrepared,
		ordered: true,
		candidateSessionIdsOrKeys: opts.activeOnly ? projectRun?.candidateSessionIdsOrKeys() : void 0
	});
	const { getTarget } = prepared;
	const { active } = presentation;
	const identity = gatewayClientSessionCreator(client ?? null)?.id;
	const filters = {
		...prepared,
		identityNames: params.searchIdentities?.names,
		entriesSorted: true,
		involvingActorId: opts.involvingMe ? identity : void 0,
		ownerFirstActorId: opts.ownerFirst ? identity : void 0,
		restrictProfileReferences: client !== void 0,
		projectActiveRun: context ? (key, entry, agentId) => active(getTarget(key)?.key ?? key, entry, agentId) : void 0,
		entryFilter: (key, entry, row) => {
			const storeKey = row.storeKey ?? key;
			let visible = params.visibility?.get(entry);
			if (visible === void 0) {
				visible = client === void 0 || (presentation.sharing.entryFilter?.(storeKey, entry) ?? true);
				params.visibility?.set(entry, visible);
			}
			return visible && (opts.hasBoard === void 0 || row.hasBoard === opts.hasBoard) && (!opts.activeOnly || Boolean(active(storeKey, entry, row.agentId)?.active));
		}
	};
	const ownerRunningCandidateKeys = () => prepared.candidateKeys(/* @__PURE__ */ new Set([
		...projectRun?.candidateSessionIdsOrKeys() ?? [],
		...presentation.rowContext.subagentRuns.requesterSessionKeys(),
		...presentation.rowContext.projectedSubagentActivity ?? []
	]));
	return {
		prepared,
		presentation,
		filters,
		ownerRunningCandidateKeys
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
			await projection.prepareSelection({ yieldForCatalog: true });
			if (opts.search?.trim()) searchIdentities = await prepareSessionSearchIdentityNames(projection, opts, true);
		} while (projection.needsSelectionPreparation() || searchIdentities && searchIdentities.cfg !== projection.state.cfg);
		let prepareSyncMs = 0;
		const selectPage = () => {
			const started = performance.now();
			const syncCpu = diagnostics?.startSyncCpu();
			try {
				diagnostics?.mark("storeLoad");
				const now = Date.now();
				const { presentation, prepared, filters, ownerRunningCandidateKeys } = prepareProjectedSessionList({
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
				const select = () => withAgentRosterFactsBatch(prepared.cfg, () => runSynchronousWork(selectSessionEntries({
					...filters,
					defaultLimit: 100
				})));
				return {
					now,
					presentation,
					prepared,
					selection: projectSessionOwnerRunningCounts(filters, params.acceptsSerializedJson && exactKey === void 0 ? presentation.select(opts, select) : select(), ownerRunningCandidateKeys)
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
					if (!target) return [];
					const includeTranscriptFields = index < 100 + selection.ownerCount;
					const { row: sharedRow, record } = presentation.snapshot({
						agentId: target.agentId,
						key: target.key,
						storePath: target.storeTarget.storePath
					}, {
						includeDerivedTitles: opts.includeDerivedTitles && includeTranscriptFields,
						includeLastMessage: opts.includeLastMessage && includeTranscriptFields,
						includeActivitySummary: opts.includeActivitySummary === true,
						rowMode: opts.rowMode,
						omitSentinelChildren: opts.activeOnly && sentinel(target.key),
						childArchiveFilter: opts.archived ?? false
					});
					if (!sharedRow || !record) return [];
					if ((record.materializedSequence ?? 0) > materializedBefore) materializedRowCount++;
					if (params.acceptsSerializedJson) return [sharedRow];
					const row = { ...sharedRow };
					bindSessionListRowRead(row, {
						projection,
						record,
						client
					});
					return [row];
				});
				diagnostics?.mark("decoration");
				const result = buildSessionsListResult(prepared, {
					...selection,
					now,
					storePath: prepared.storePath
				}, params.acceptsSerializedJson ? presentation.list(sessions, opts) : sessions, context?.getCommittedRuntimeConfig?.() ?? cfg, client);
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
		}, { selection: true });
	});
}
//#endregion
export { prepareSessionSearchIdentityNames as a, prepareSessionRowSelection as i, listProjectedSessions as n, selectSessionEntries as o, prepareProjectedSessionList as r, filterSessionEntries as s, filterAndSortSessionEntries as t };
