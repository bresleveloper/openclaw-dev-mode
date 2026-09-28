import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { a as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { o as projectSessionParticipant, u as projectSessionProfileInvolvement } from "./session-identity-projection-C0mYume0.mjs";
import { t as projectGatewaySessionActiveRun } from "./session-utils-display-C9DkcmRI.mjs";
import { D as prepareProjectedSessionSharing, J as resolveSessionVisibility, et as gatewayClientSessionCreator, j as authorizeIncognitoSessionTarget } from "./session-sharing-C_5FkkwM.mjs";
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
/** Recreate after yields: the caller identity and clock belong to one synchronous presentation. */
function prepareProjectedSessionPresentation(projection, client, now = Date.now(), projectRun) {
	const { cfg, rowContext } = projection.state;
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
		cfg,
		client: client ?? null,
		isMember: (value, identityId) => projection.describe({
			agentId: value.agentId,
			key: value.storeKey,
			storePath: value.storePath
		})?.membership.has(identityId) ?? false
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
		sharingRole: sharing.roleForTarget(value)
	});
	const present = (captured, options = {}) => {
		const record = projection.describe({
			agentId: captured.agentId,
			key: captured.key,
			storePath: captured.storeTarget.storePath
		}, captured);
		if (!record) return null;
		const run = active(record.key, record.entry, record.agentId);
		const excludedChildKeys = options.excludedChildKeys ?? new Set(record.materialized.source.childLinks?.flatMap(({ key, entry }) => client !== void 0 && sharing.entryFilter?.(key, entry) === false ? [key] : []));
		const row = projection.present(record, {
			...options,
			now,
			subagentRuns,
			active: run?.active,
			excludedChildKeys
		});
		if (row.swarm) row.swarm = {
			...row.swarm,
			groups: row.swarm.groups.map((group) => ({
				...group,
				children: group.children?.filter(({ sessionKey }) => !excludedChildKeys.has(sessionKey) && (client === void 0 || !projection.selectEntries({ key: sessionKey }).some((child) => sharing.entryFilter?.(child.key, child.entry) === false)))
			}))
		};
		if (run) Object.assign(row, projectGatewaySessionActiveRun(run, row.status), run.runIds === void 0 ? {} : { activeRunIds: run.runIds });
		if (options.includeActivitySummary === false) row.activitySummary = void 0;
		if (client !== void 0) {
			const value = toProjectedSessionSharingTarget(record);
			Object.assign(row, viewer(value));
			if (row.activitySummary) row.activitySummary = {
				...row.activitySummary,
				canEnsure: !authorizeIncognitoSessionTarget({
					client: client ?? null,
					sessionKey: value.canonicalKey,
					target: value
				}) && !sharing.authorizeTarget(value)
			};
		}
		return row;
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
//#region src/gateway/session-list-read-result.ts
const reads = /* @__PURE__ */ new WeakMap();
function bindSessionListRowRead(row, read) {
	reads.set(row, {
		projection: new WeakRef(read.projection),
		client: read.client,
		agentId: read.record.agentId,
		key: read.record.key,
		storePath: read.record.storeTarget.storePath,
		storeAgentId: read.record.storeTarget.agentId,
		generation: read.record.generation,
		sessionId: read.record.entry.sessionId,
		lifecycleRevision: read.record.entry.lifecycleRevision
	});
}
/** Explicit tool enrichment reads the selected physical owner, never a wire-provided path. */
async function readSessionListRowTitleFields(row, requireOwner) {
	const selected = reads.get(row);
	if (!selected) {
		if (requireOwner) throw new Error("Session enrichment requires its Gateway or embedded read owner");
		return;
	}
	if (!await withCurrentSessionListRows([row], ([allowed]) => allowed, true)) return null;
	const { readSessionTitleFieldsFromTranscriptAsync } = await import("./session-transcript-title-reader-BzP7IS-w.mjs");
	return await readSessionTitleFieldsFromTranscriptAsync({
		agentId: selected.storeAgentId,
		sessionKey: selected.key,
		sessionId: selected.sessionId,
		storePath: selected.storePath,
		sessionEntry: { sessionId: selected.sessionId }
	});
}
/** Finalize buffered enrichment inside one current owner read, without a later await. */
async function withCurrentSessionListRows(rows, consume, requireOwner) {
	if (rows.length === 0) return consume([]);
	const captured = rows.map((row) => reads.get(row));
	if (!requireOwner && captured.every((read) => !read)) return consume(rows.map(() => true));
	const selected = captured.map((read) => {
		if (!read) throw new Error("Session enrichment requires its Gateway or embedded read owner");
		return read;
	});
	const projection = selected[0].projection.deref();
	if (!projection || selected.some((read) => read.projection.deref() !== projection)) throw new Error("Gateway changed while preparing session inventory; retry the request");
	while (true) {
		const prepared = await projection.withPreparedExactRows(() => selected.map(({ agentId, key }) => ({
			agentId,
			key
		})), (read) => {
			const presentations = /* @__PURE__ */ new Map();
			return consume(selected.map((selectedRead) => {
				const { agentId, key, client } = selectedRead;
				const query = {
					agentId,
					key
				};
				const record = read.describe(query);
				if (!record || record.agentId !== agentId || record.key !== key || record.storeTarget.storePath !== selectedRead.storePath || record.storeTarget.agentId !== selectedRead.storeAgentId || record.generation !== selectedRead.generation || record.entry.sessionId !== selectedRead.sessionId || record.entry.lifecycleRevision !== selectedRead.lifecycleRevision) return false;
				if (client === void 0) return true;
				let presentation = presentations.get(client);
				if (!presentation) {
					presentation = prepareProjectedSessionPresentation(read, client);
					presentations.set(client, presentation);
				}
				return !presentation.authorizeDescription(query) && presentation.sharing.entryFilter?.(record.key, record.entry) !== false;
			}));
		});
		if (prepared.kind === "complete") return prepared.value;
		const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DvYAlpmU.mjs");
		await certifySessionCanonicalValidationPending(prepared.database);
	}
}
//#endregion
export { prepareProjectedSessionPresentation as i, readSessionListRowTitleFields as n, withCurrentSessionListRows as r, bindSessionListRowRead as t };
