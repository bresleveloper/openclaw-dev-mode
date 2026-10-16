import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-MyNs7ITg.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { n as resolveSendPolicy } from "./send-policy-dVeTk31X.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { B as projectGatewaySessionRunState, nt as resolveActiveSessionAgentStatus, z as projectGatewaySessionActiveRun } from "./session-row-prepared-read-eHG52FnK.mjs";
import { o as projectSessionParticipant, u as projectSessionProfileInvolvement } from "./session-identity-projection-CViuALyG.mjs";
import { o as resolveSessionChildOwners } from "./session-utils-core-tGMGyJu7.mjs";
import { n as authorizeIncognitoSessionTarget, o as authorizeSessionAgentRun, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { i as prepareSessionFastModePresentation, n as prepareOperatorModelPresentation } from "./operator-model-presentation-B_liypCy.mjs";
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
	const view = (context) => {
		const revision = projection.sharingRevision;
		let publication = publications.get(projection);
		if (!publication || publication.context !== context || publication.revision !== revision || !revision) {
			publication = {
				context,
				revision,
				rows: /* @__PURE__ */ new WeakMap()
			};
			publications.set(projection, publication);
		}
		return publication.rows;
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
	const publicationRows = publication?.(rowContext);
	const subagentRuns = rowContext.subagentRuns.atTime(now);
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
	const viewer = (value) => ({
		visibility: resolveSessionVisibility(value.entry),
		...profileId && !value.entry.incognito && !isIncognitoSessionKey(value.canonicalKey) ? { hiddenFromInvolvingMe: projectSessionProfileInvolvement(value.entry, profileId, profiles)?.hidden ?? false } : {},
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
	const present = (captured, options = {}) => {
		const record = projection.describe({
			agentId: captured.agentId,
			key: captured.key,
			storePath: captured.storeTarget.storePath
		}, captured);
		if (!record) return null;
		const run = active(record.key, record.entry, record.agentId);
		const preparedFacts = record.facts?.present();
		let excludedChildKeys = options.excludedChildKeys;
		if (!excludedChildKeys && client !== void 0) {
			let excluded;
			for (const { key, entry } of record.materialized.source.childLinks ?? []) if (sharing.entryFilter?.(key, entry) === false) (excluded ??= /* @__PURE__ */ new Set()).add(key);
			excludedChildKeys = excluded;
		}
		const sourceSwarm = record.materialized.row.swarm;
		let excludedSwarmKeys;
		for (const group of sourceSwarm?.groups ?? []) for (const { sessionKey } of group.children ?? []) if (excludedChildKeys?.has(sessionKey) || client !== void 0 && projection.selectEntries({ key: sessionKey }).some((child) => sharing.entryFilter?.(child.key, child.entry) === false)) (excludedSwarmKeys ??= /* @__PURE__ */ new Set()).add(sessionKey);
		let published = publicationRows?.get(record);
		if (publicationRows) {
			const runState = (key, entry) => projectGatewaySessionRunState({
				key,
				entry,
				now,
				rowContext: {
					...rowContext,
					subagentRuns
				}
			});
			const temporal = runState(record.key, record.entry);
			const facts = [
				record.materialized,
				record.materializedSequence,
				record.profileRevision,
				record.subagentRevision,
				record.lastMessagePreview,
				record.fallbackModel,
				sourceSwarm,
				subagentRuns.revision,
				temporal.subagentRun,
				temporal.fields.hasActiveSubagentRun,
				temporal.fields.runtimeMs,
				JSON.stringify([run, preparedFacts]),
				resolveActiveSessionAgentStatus(record.entry.agentStatus, now),
				record.entry.goal?.status === "active" && record.entry.goal.tokenBudget !== void 0 ? now : void 0,
				...(record.materialized.source.childLinks ?? []).flatMap(({ key, entry }) => {
					const childActive = runState(key, entry).fields.hasActiveSubagentRun;
					return [childActive, resolveSessionChildOwners({
						key,
						entry,
						now,
						subagentRuns,
						hasActiveRun: childActive
					}).includes(record.key)];
				})
			];
			const previous = published?.facts;
			if (!previous || !facts.every((fact, index) => fact === previous[index])) {
				published = {
					facts,
					views: /* @__PURE__ */ new Map(),
					target: toProjectedSessionSharingTarget(record)
				};
				publicationRows.set(record, published);
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
			const snapshot = freezeJsonSnapshot(structuredClone(projected));
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
		if (options.rowMode === "compact") {
			for (const field of SESSION_ROW_DETAIL_FIELDS) delete row[field];
			row.rowMode = "compact";
		}
		if (options.omitSentinelChildren) {
			row.childSessions = void 0;
			row.hasActiveSubagentRun = void 0;
		}
		if (signature !== void 0) {
			const snapshot = freezeJsonSnapshot(structuredClone(row));
			views?.set(signature, snapshot);
			return projectModels(snapshot);
		}
		return projectModels(row);
	};
	return {
		rowContext: {
			...rowContext,
			subagentRuns
		},
		active,
		sharing,
		target,
		present,
		snapshot(query, options = {}) {
			const record = projection.describe(query);
			return record ? {
				row: present(record, options),
				lifecycleRunId: record.entry.lifecycleRunId
			} : { row: null };
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
export { prepareSessionRowPublication as n, serializeSessionRow as r, prepareProjectedSessionPresentation as t };
