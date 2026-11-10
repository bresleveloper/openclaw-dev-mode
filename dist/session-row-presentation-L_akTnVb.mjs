import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { E as resolveProjectedAgentRunModel } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { s as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility, n as authorizeIncognitoSessionTarget, o as authorizeSessionAgentRun } from "./session-sharing-policy-vx7GWqzs.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { r as registerSerializedJsonArray } from "./serialized-json-IhaVUH2u.mjs";
import { i as prepareSessionFastModePresentation, n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { r as matchesSessionArchiveFilter, s as resolveSessionChildOwners } from "./session-utils-core-DYhQWF9T.mjs";
import { n as resolveActiveSessionAgentStatus } from "./session-agent-status-rvbCDjfy.mjs";
import { o as projectSessionParticipant, u as projectSessionProfileInvolvements } from "./session-identity-projection-sgwF_hD_.mjs";
import { n as projectGatewaySessionRunState, t as projectGatewaySessionActiveRun } from "./session-utils-display-DdkO-Qt-.mjs";
import { n as resolveSendPolicy } from "./send-policy-D88FrugM.mjs";
import { randomUUID } from "node:crypto";
//#region packages/gateway-protocol/src/session-row-fields.ts
/** Compact list omissions are unknown detail facts, never deletion receipts. */
const SESSION_ROW_DETAIL_FIELDS = [
	"contextWindows",
	"contextWindowDefault",
	"thinkingLevels",
	"thinkingOptions",
	"thinkingDefault",
	"toolOverrides",
	"providerReview",
	"nativeRuntimeConsent",
	"contextBudgetStatus",
	"agentRuntime",
	"pluginExtensions"
];
/** Gallery presentation and the facts needed to reconcile its held membership. */
const SESSION_DASHBOARD_ROW_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"rowMode",
	"sessionId",
	"lifecycleRevision",
	"kind",
	"agentId",
	"label",
	"displayName",
	"derivedTitle",
	"lastMessagePreview",
	"accountId",
	"updatedAt",
	"snapshotAt",
	"status",
	"createdActor",
	"owner",
	"hasBoard",
	"boardFace",
	"archived",
	"pinned",
	"pinnedAt",
	"isDock",
	"sidebarRoot",
	"spawnedBy",
	"controlOwnerSessionKey",
	"parentSessionKey",
	"childSessions",
	"childOwnerSessionKeys",
	"isMain",
	"worktree",
	"repository",
	"execNode"
]);
/** Sidebar rendering, actions, and the receipts used by its managed list window. */
const SESSION_SIDEBAR_ROW_FIELDS = /* @__PURE__ */ new Set([
	...SESSION_DASHBOARD_ROW_FIELDS,
	"incognito",
	"icon",
	"color",
	"channelAvatarUrl",
	"category",
	"channel",
	"classification",
	"chatType",
	"subject",
	"groupChannel",
	"space",
	"origin",
	"deliveryContext",
	"createdVia",
	"createdSurface",
	"createdAt",
	"participants",
	"expandedParticipants",
	"participantCount",
	"archivedBy",
	"snoozedUntil",
	"unread",
	"lastReadAt",
	"markedUnreadAt",
	"lastActivityAt",
	"lastInteractionAt",
	"hiddenFromInvolvingMe",
	"visibility",
	"sharingRole",
	"communication",
	"effectiveCommunication",
	"hasActiveRun",
	"hasActiveSubagentRun",
	"activeRunIds",
	"subagentRunState",
	"modelSelectionLocked",
	"hasAutomation",
	"agentStatus",
	"observerDigest",
	"lastRunError",
	"abortedLastRun",
	"restartRecoveryStatus",
	"startedAt",
	"endedAt",
	"runtimeMs",
	"execCwd",
	"spawnedWorkspaceDir",
	"spawnedCwd",
	"placement",
	"placementMove",
	"forkSource",
	"parentSessionId",
	"forkedFromParent",
	"spawnDepth",
	"subagentRole",
	"subagentControlScope",
	"swarmGroupId"
]);
//#endregion
//#region src/gateway/session-row-presentation.ts
function toProjectedSessionSharingTarget(record) {
	return {
		agentId: record.agentId,
		canonicalKey: record.key,
		entry: record.entry,
		storeKey: record.key,
		storeKeys: [record.key],
		storePath: record.storeTarget.storePath
	};
}
const publications = /* @__PURE__ */ new WeakMap();
const encodings = /* @__PURE__ */ new WeakMap();
/** Immutable row identities own field preparation; fact indexes stay response-local. */
function createSessionRowFactSharing() {
	const prepared = /* @__PURE__ */ new WeakMap();
	return (sessions) => {
		const candidates = /* @__PURE__ */ new Map();
		const rows = [];
		sessions.forEach((row, index) => {
			const { key, kind, updatedAt, sessionId, rowMode } = row;
			rows.push({
				key,
				kind,
				updatedAt,
				sessionId,
				rowMode
			});
			let facts = prepared.get(row);
			if (!facts) {
				facts = [];
				for (const field in row) {
					const value = row[field];
					if (value === void 0 || [
						"key",
						"kind",
						"updatedAt",
						"sessionId",
						"rowMode"
					].includes(field)) continue;
					const fact = {};
					fact[field] = value;
					facts.push([JSON.stringify(fact), fact]);
				}
				prepared.set(row, facts);
			}
			for (const [encoded, fact] of facts) {
				const candidate = candidates.get(encoded);
				if (candidate) candidate.rows.push(index);
				else candidates.set(encoded, {
					fact,
					rows: [index]
				});
			}
		});
		const groups = /* @__PURE__ */ new Map();
		for (const candidate of candidates.values()) {
			if (candidate.rows.length < 2) {
				Object.assign(rows[candidate.rows[0]], candidate.fact);
				continue;
			}
			const key = candidate.rows.join(",");
			const group = groups.get(key);
			if (group) Object.assign(group.fact, candidate.fact);
			else groups.set(key, {
				fact: { ...candidate.fact },
				rows: candidate.rows
			});
		}
		const sharedFacts = [];
		for (const group of groups.values()) {
			const reference = sharedFacts.push(group.fact) - 1;
			for (const index of group.rows) (rows[index].sharedFacts ??= []).push(reference);
		}
		return {
			sessions: rows,
			sharedFacts
		};
	};
}
const shareSessionRowFacts = createSessionRowFactSharing();
const sharedLists = /* @__PURE__ */ new WeakMap();
function shareSidebarSessionRows(rows, ifRowsRevision) {
	let shared = sharedLists.get(rows);
	if (!shared) {
		shared = {
			...shareSessionRowFacts(rows),
			rowsRevision: randomUUID()
		};
		registerSerializedJsonArray(shared.sessions, shared.sessions.map(serializeSessionRow));
		sharedLists.set(rows, shared);
	}
	return ifRowsRevision === shared.rowsRevision ? {
		sessions: [],
		rowsRevision: shared.rowsRevision,
		rowsUnchanged: true
	} : shared;
}
/** Only the immutable presentation is encoded; recipient-specific list wrappers stay private. */
function serializeSessionRow(row) {
	let encoded = encodings.get(row);
	if (encoded === void 0) {
		encoded = JSON.stringify(row);
		encodings.set(row, encoded);
	}
	return encoded;
}
/** Sharing decisions remain recipient-local; only their identical presented results are reused. */
function prepareSessionRowPublication(projection, now, read = projection) {
	const view = () => {
		const revision = projection.state.revision;
		let publication = publications.get(projection);
		if (!publication) {
			publication = {
				revision,
				factsRevision: 0,
				rows: /* @__PURE__ */ new WeakMap(),
				lists: /* @__PURE__ */ new Map()
			};
			publications.set(projection, publication);
			const retained = publication;
			projection.onSelectionChange((change) => {
				if (change.kind === "reset") {
					retained.lists.clear();
					return;
				}
				retained.revision = void 0;
				for (const list of retained.lists.values()) list.selection = void 0;
			});
			projection.onFactsChange((change) => {
				retained.factsRevision++;
				for (const list of retained.lists.values()) if (change.kind === "reset" || list.rows?.some((row) => row.key === change.key)) list.rows = void 0;
			});
		} else if (publication.revision !== revision) {
			if (publication.revision !== void 0) publication.lists.clear();
			publication.revision = revision;
		}
		return publication;
	};
	return (client, projectRun) => prepareProjectedSessionPresentation(read, client, now, projectRun, view);
}
/** Recreate after yields: the caller identity and clock belong to one synchronous presentation. */
function prepareProjectedSessionPresentation(projection, client, now = Date.now(), projectRun, publication) {
	const { cfg, policyConfig, rowContext } = projection.state;
	const presentFastMode = prepareSessionFastModePresentation(client);
	const models = client === void 0 ? void 0 : prepareOperatorModelPresentation({
		cfg,
		policyConfig,
		client
	});
	const publicationState = publication?.();
	const publicationRows = publicationState?.rows;
	const subagentRuns = rowContext.subagentRuns.atTime(now);
	const preparedRowContext = {
		...rowContext,
		subagentRuns
	};
	const runState = (key, { entry, parsedKey }) => projectGatewaySessionRunState({
		key,
		entry,
		parsedKey,
		now,
		rowContext: preparedRowContext
	});
	const active = (key, entry, agentId) => projectRun?.({
		requestedKey: key,
		canonicalKey: key,
		sessionId: entry.sessionId,
		agentId,
		defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, key)
	});
	const target = (query) => {
		const record = projection.describe(query);
		return record ? toProjectedSessionSharingTarget(record) : null;
	};
	const sharing = prepareProjectedSessionSharing({
		cfg: policyConfig,
		client: client ?? null,
		isMember: (value, identityId) => projection.readMembership({
			agentId: value.agentId,
			key: value.storeKey,
			storePath: value.storePath
		})?.has(identityId) ?? false
	});
	const profile = gatewayClientSessionCreator(client ?? null);
	const profiles = rowContext.userProfileIdentityById;
	const profileId = profile ? projectSessionParticipant({
		type: "profile",
		id: profile.id
	}, profiles).identity.id : void 0;
	const listView = (opts) => {
		const { source: _source, ifRowsRevision: _ifRowsRevision, ...query } = opts;
		const key = JSON.stringify([
			client === void 0,
			sharing.cacheKey,
			presentFastMode("ultrafast"),
			Object.entries(query).toSorted(([left], [right]) => left.localeCompare(right))
		]);
		const lists = publicationState?.lists;
		let view = lists?.get(key);
		if (!view) {
			view = {};
			if (lists && lists.size >= 32) lists.delete(lists.keys().next().value);
			lists?.set(key, view);
		}
		return view;
	};
	const viewer = (value) => ({
		visibility: resolveSessionVisibility(value.entry),
		...profileId && !value.entry.incognito && !isIncognitoSessionKey(value.canonicalKey) ? { hiddenFromInvolvingMe: (rowContext.identityProjection?.involvement ?? projectSessionProfileInvolvements)(value.entry, profiles).get(profileId)?.hidden ?? false } : {},
		sharingRole: sharing.roleForTarget(value),
		sendDisabledReason: authorizeSessionAgentRun({
			cfg: policyConfig,
			client: client ?? null,
			target: value
		}, { policy: sharing.policy })?.message ?? sharing.authorizeTarget(value)?.message ?? (resolveSendPolicy({
			cfg,
			entry: value.entry,
			sessionKey: value.canonicalKey
		}) === "deny" ? "send blocked by session policy" : null)
	});
	const present = (record, options = {}) => {
		const run = active(record.key, record.entry, record.agentId);
		const preparedFacts = record.facts?.present();
		const childOwnerSessionKeys = resolveSessionChildOwners({
			key: record.key,
			entry: record.entry,
			parsedKey: record.materialized.source.parsedKey,
			now,
			subagentRuns
		});
		let excludedChildKeys = options.excludedChildKeys;
		if (!excludedChildKeys && client !== void 0) {
			let excluded;
			for (const { key, entry } of record.materialized.source.childLinks ?? []) if (sharing.entryFilter?.(key, entry) === false) (excluded ??= /* @__PURE__ */ new Set()).add(key);
			excludedChildKeys = excluded;
		}
		const sourceSwarm = options.rowMode === "sidebar" || options.rowMode === "dashboard" ? void 0 : record.materialized.row.swarm;
		let excludedSwarmKeys;
		for (const group of sourceSwarm?.groups ?? []) for (const { sessionKey } of group.children ?? []) if (excludedChildKeys?.has(sessionKey) || client !== void 0 && projection.selectEntries({ key: sessionKey }).some((child) => sharing.entryFilter?.(child.key, child.entry) === false)) (excludedSwarmKeys ??= /* @__PURE__ */ new Set()).add(sessionKey);
		let published = publicationRows?.get(record.materialized);
		if (publicationRows) {
			const liveModel = resolveProjectedAgentRunModel({
				agentId: record.agentId,
				sessionId: record.entry.sessionId,
				index: rowContext.projectedAgentRuns
			});
			const temporal = runState(record.key, record.materialized.source);
			const facts = [
				record.profileRevision,
				record.lastMessagePreview,
				record.fallbackModel,
				liveModel?.provider,
				liveModel?.model,
				liveModel === null,
				record.materialized.row.swarm,
				childOwnerSessionKeys,
				temporal.subagentRun?.model,
				temporal.subagentOwner,
				temporal.fields.status,
				temporal.fields.lastRunError,
				temporal.fields.subagentRunState,
				temporal.fields.hasActiveSubagentRun,
				temporal.fields.startedAt,
				temporal.fields.endedAt,
				temporal.fields.runtimeMs,
				run?.active,
				run?.status,
				JSON.stringify(run?.runIds),
				preparedFacts?.placement || preparedFacts?.placementMove ? JSON.stringify(preparedFacts) : preparedFacts,
				resolveActiveSessionAgentStatus(record.entry.agentStatus, now),
				record.entry.goal?.status === "active" && record.entry.goal.tokenBudget !== void 0 ? now : void 0,
				record.materialized.source.childLinks?.length
			];
			for (const child of record.materialized.source.childLinks ?? []) {
				const { key, entry, parsedKey } = child;
				const childActive = runState(key, child).fields.hasActiveSubagentRun;
				facts.push(key, childActive, resolveSessionChildOwners({
					key,
					entry,
					parsedKey,
					now,
					subagentRuns,
					hasActiveRun: childActive
				}).includes(record.key));
			}
			const previous = published?.facts;
			if (!previous || !facts.every((fact, index) => fact === previous[index])) {
				published = {
					facts,
					views: /* @__PURE__ */ new Map(),
					target: toProjectedSessionSharingTarget(record)
				};
				publicationRows.set(record.materialized, published);
			}
		}
		const views = published?.views;
		const value = published?.target ?? toProjectedSessionSharingTarget(record);
		const viewerFacts = client === void 0 ? void 0 : viewer(value);
		const canEnsure = client !== void 0 && preparedFacts?.activitySummary ? !authorizeIncognitoSessionTarget({
			client: client ?? null,
			sessionKey: value.canonicalKey,
			target: value
		}) && !sharing.authorizeTarget(value) : void 0;
		const signature = views && JSON.stringify([
			presentFastMode("ultrafast"),
			options.includeDerivedTitles,
			options.includeLastMessage,
			options.includeActivitySummary,
			options.rowMode,
			options.omitSentinelChildren,
			options.childArchiveFilter,
			excludedChildKeys?.size ? [...excludedChildKeys] : void 0,
			excludedSwarmKeys && [...excludedSwarmKeys],
			viewerFacts,
			canEnsure
		]);
		const cached = signature === void 0 ? void 0 : views?.get(signature);
		const projectModels = (row) => {
			const projected = models?.session(row) ?? row;
			if (projected === row || !views || signature === void 0) return projected;
			const modelSignature = signature + JSON.stringify([
				projected.modelProvider,
				projected.model,
				projected.activeModelProvider,
				projected.activeModel,
				projected.contextBudgetStatus
			]);
			const existing = views.get(modelSignature);
			if (existing) return existing;
			const snapshot = Object.freeze(projected);
			views.set(modelSignature, snapshot);
			return snapshot;
		};
		if (cached) return projectModels(cached);
		const row = projection.present(record, {
			...options,
			now,
			subagentRuns,
			active: run?.active,
			excludedChildKeys,
			preparedFacts
		});
		row.childOwnerSessionKeys = [...childOwnerSessionKeys];
		row.fastMode = presentFastMode(row.fastMode);
		row.effectiveFastMode = presentFastMode(row.effectiveFastMode);
		if (sourceSwarm) {
			row.swarm = {
				...sourceSwarm,
				groups: []
			};
			for (const group of sourceSwarm.groups) row.swarm.groups.push({
				...group,
				children: group.children?.filter(({ sessionKey }) => !excludedSwarmKeys?.has(sessionKey))
			});
		}
		if (run) Object.assign(row, projectGatewaySessionActiveRun(run, row.status), run.runIds === void 0 ? {} : { activeRunIds: run.runIds });
		if (options.includeActivitySummary === false) row.activitySummary = void 0;
		if (viewerFacts) {
			Object.assign(row, viewerFacts);
			if (row.activitySummary) row.activitySummary = {
				...row.activitySummary,
				canEnsure: canEnsure === true
			};
		}
		if (options.rowMode === "dashboard" || options.rowMode === "sidebar") {
			const fields = options.rowMode === "sidebar" ? SESSION_SIDEBAR_ROW_FIELDS : SESSION_DASHBOARD_ROW_FIELDS;
			for (const field of Object.keys(row)) if (!fields.has(field)) Reflect.deleteProperty(row, field);
			row.rowMode = options.rowMode;
		} else if (options.rowMode === "compact") {
			for (const field of SESSION_ROW_DETAIL_FIELDS) delete row[field];
			row.rowMode = "compact";
		}
		if (options.omitSentinelChildren) {
			row.childSessions = void 0;
			row.hasActiveSubagentRun = void 0;
		}
		if (row.childSessions?.length && options.childArchiveFilter !== void 0 && options.childArchiveFilter !== "all") {
			let excluded;
			for (const { key: childKey, entry } of record.materialized.source.childLinks ?? []) if (!matchesSessionArchiveFilter(entry, options.childArchiveFilter)) (excluded ??= /* @__PURE__ */ new Set()).add(childKey);
			if (excluded) row.childSessions = row.childSessions.filter((childKey) => !excluded.has(childKey));
		}
		if (signature !== void 0) {
			const encoded = JSON.stringify(row);
			const snapshot = freezeJsonSnapshot(row);
			encodings.set(snapshot, encoded);
			views?.set(signature, snapshot);
			return projectModels(snapshot);
		}
		return projectModels(row);
	};
	return {
		get audienceKey() {
			return JSON.stringify([
				sharing.cacheKey,
				presentFastMode("ultrafast"),
				publicationState?.factsRevision
			]);
		},
		rowContext: preparedRowContext,
		active,
		sharing,
		target,
		present(captured, options = {}) {
			const record = projection.describe({
				agentId: captured.agentId,
				key: captured.key,
				storePath: captured.storeTarget.storePath
			}, captured);
			return record ? present(record, options) : null;
		},
		select(opts, select) {
			if (opts.search || opts.spawnedBy || opts.activeOnly || opts.activityPulseBoundaries) return select();
			const view = listView(opts);
			if (view.selection && opts.activeMinutes !== void 0 && (now < view.selectedAt || now > (view.selection.activityExpiresAt ?? Infinity))) view.selection = void 0;
			if (!view.selection) {
				const { entries, ownerSessionProfiles, ...facets } = select();
				Object.freeze(entries);
				view.selection = Object.freeze({
					...freezeJsonSnapshot(facets),
					ownerSessionProfiles,
					entries
				});
				view.selectedAt = now;
			}
			return view.selection;
		},
		list(rows, opts) {
			const view = listView(opts);
			const previous = view.rows;
			if (previous?.length === rows.length && rows.every((row, index) => row === previous[index])) return previous;
			Object.freeze(rows);
			if (opts.rowMode !== "sidebar") registerSerializedJsonArray(rows, rows.map(serializeSessionRow));
			view.rows = rows;
			return rows;
		},
		snapshot(query, options = {}) {
			const record = projection.describe(query);
			return record ? {
				row: present(record, options),
				record,
				lifecycleRunId: record.entry.lifecycleRunId
			} : {
				row: null,
				record
			};
		},
		authorizeDescription(query) {
			return authorizeIncognitoSessionTarget({
				client: client ?? null,
				sessionKey: query.key,
				target: isIncognitoSessionKey(query.key) ? null : target(query)
			});
		}
	};
}
//#endregion
export { shareSidebarSessionRows as i, prepareSessionRowPublication as n, serializeSessionRow as r, prepareProjectedSessionPresentation as t };
