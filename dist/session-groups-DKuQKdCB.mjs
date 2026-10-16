import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { s as openOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { n as publishSessionEntryCacheCategoryUpdate } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { r as prepareSessionGroupCategoryMutation, t as applySessionGroupCategoryMutation } from "./session-group-categories.kernel-BhgRGqMF.mjs";
import { T as runSessionCollaborationWrite } from "./session-accessor-cUVSaeKy.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as readSessionGroupMembershipInWorker, n as mutateSessionGroupCatalog, r as readSessionGroupCatalog, t as ensureSessionGroupCatalog } from "./session-group-catalog-DEO_bQ_M.mjs";
//#region src/config/sessions/session-group-categories.ts
/** Prepared rows stay with the broker; only target identities cross the admission boundary. */
function updateSessionGroupCategoriesInWorker(params) {
	const { scope, from, to, assertTargetCurrent } = params;
	const agentId = scope.agentId;
	let keys = [];
	const superseded = /* @__PURE__ */ new Set();
	let releasePublicationFence;
	const assertCurrent = () => {
		for (const sessionKey of keys) assertTargetCurrent?.({
			agentId,
			sessionKey
		});
	};
	return runSessionCollaborationWrite(scope, {
		type: "category.apply",
		input: {
			scope,
			from,
			to
		}
	}, (capturedScope) => {
		const options = toDatabaseOptions(resolveSqliteScope(capturedScope));
		const database = openOpenClawAgentDatabase(options);
		const planned = prepareSessionGroupCategoryMutation(database, from);
		keys = [...planned.keys()];
		assertCurrent();
		return runOpenClawAgentWriteTransaction((current) => {
			assertCurrent();
			return applySessionGroupCategoryMutation(current, planned, to, capturedScope.env ?? process.env).length;
		}, options, { operationLabel: "session.group-categories.update" });
	}, (changed, location, database) => {
		releasePublicationFence?.();
		publishSessionEntryCacheCategoryUpdate(database, changed.filter(({ sessionKey }) => !superseded.has(sessionKey)), to);
		sessionChanges.emitBatch(changed.map(({ sessionKey, sessionId }) => ({
			agentId: location.agentId,
			storePath: location.storePath,
			sessionKey,
			...superseded.has(sessionKey) ? { factsInvalidated: true } : { facts: {
				kind: "category",
				sessionId,
				category: to?.trim() || null
			} }
		})));
		return changed.length;
	}, assertCurrent, async (operation, preparedScope) => {
		keys = await operation.execute({
			type: "category.prepare",
			input: {
				scope: preparedScope,
				from
			}
		});
		assertCurrent();
		const targets = new Set(keys);
		releasePublicationFence = sessionChanges.subscribeFacts((change) => {
			if ("all" in change) for (const key of targets) superseded.add(key);
			else if (targets.has(change.sessionKey) && change.scope !== "automation" && (change.factsInvalidated || change.facts && change.facts.kind !== "unchanged" && change.facts.kind !== "member" && change.facts.kind !== "participants")) superseded.add(change.sessionKey);
		});
	}, () => {
		releasePublicationFence?.();
		return superseded.size === 0 ? keys : void 0;
	}).finally(() => releasePublicationFence?.());
}
//#endregion
//#region src/gateway/session-groups.ts
var SessionGroupNotFoundError = class extends Error {
	constructor(name) {
		super(`unknown session group: ${name}`);
		this.name = "SessionGroupNotFoundError";
	}
};
var SessionGroupNotEmptyError = class extends Error {
	constructor(groups) {
		super(`sessions.groups.put cannot drop groups that still have member sessions: ${groups.map((group) => `"${group.name}" (${group.memberSessions})`).join(", ")}; include them in names or remove them via sessions.groups.delete`);
		this.groups = groups;
		this.name = "SessionGroupNotEmptyError";
	}
};
function normalizeSidebarSectionOrder(sectionOrder, groupNames) {
	const groups = new Set(groupNames);
	const normalized = /* @__PURE__ */ new Set();
	for (const raw of sectionOrder) {
		const sectionId = raw.trim();
		let canonical = null;
		if (sectionId === "ungrouped" || sectionId === "groups" || sectionId === "work") canonical = sectionId;
		else if (sectionId.startsWith("category:")) {
			const name = normalizeOptionalString(sectionId.slice(9));
			if (name && groups.has(name)) canonical = `category:${name}`;
		} else if (sectionId.startsWith("catalog:")) {
			const catalogId = normalizeOptionalString(sectionId.slice(8));
			if (catalogId) canonical = `catalog:${catalogId}`;
		}
		if (canonical) normalized.add(canonical);
	}
	return [...normalized];
}
/**
* Replaces the ordered catalog. Dropping a name whose group still has member
* sessions is rejected: member sweeps stay owned by sessions.groups.delete,
* so a put can never leave dangling categories that resurrect the group.
*/
async function putSessionGroups(params) {
	const { cfg, names, sectionOrder, env = process.env } = params;
	await ensureSessionGroupCatalog(env);
	const normalized = normalizeUniqueTrimmedStringList(names);
	const normalizedSectionOrder = sectionOrder === void 0 ? void 0 : normalizeSidebarSectionOrder(sectionOrder, normalized);
	const result = await mutateSessionGroupCatalog({
		kind: "put",
		names: normalized,
		sectionOrder: normalizedSectionOrder,
		cfg: {
			agents: cfg.agents,
			session: cfg.session
		}
	}, env, (facts) => {
		params.assertCurrent?.();
		for (const [, targets] of facts?.groups ?? []) for (const target of targets) params.assertTargetCurrent?.(target);
	});
	if (result.nonEmpty?.length) throw new SessionGroupNotEmptyError(result.nonEmpty);
	return result.snapshot.groups;
}
/**
* Absorbs a category assigned through sessions.patch so the catalog keeps
* covering every group an operator UI can observe, appended at the end.
*/
async function ensureSessionGroupRegistered(name, env = process.env, assertCurrent) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) return false;
	return (await mutateSessionGroupCatalog({
		kind: "register",
		name: normalized
	}, env, assertCurrent)).changed;
}
async function updateSessionGroupDefaults(name, defaults, env = process.env, assertCurrent, cfg = {}) {
	const normalized = normalizeOptionalString(name);
	if (!normalized) throw new Error("group defaults update requires a non-empty name");
	const result = await mutateSessionGroupCatalog({
		kind: "defaults",
		cfg: {
			agents: cfg.agents,
			session: cfg.session
		},
		name: normalized,
		cwd: normalizeOptionalString(defaults.cwd) ?? null,
		worktree: defaults.worktree
	}, env, (facts) => assertCurrent?.(facts?.groups?.find(([group]) => group === normalized)?.[1]));
	return result.changed ? result.snapshot.defaults : null;
}
/**
* Bulk-updates member session categories across every agent store without
* bumping updatedAt: group maintenance must not reshuffle recency ordering.
*/
async function updateMemberCategories(cfg, from, to, env, assertTargetCurrent) {
	let updated = 0;
	const { stores } = await readSessionGroupMembershipInWorker(cfg, env);
	for (const target of stores) updated += await updateSessionGroupCategoriesInWorker({
		scope: {
			...target,
			sessionKey: "",
			env
		},
		from,
		to,
		assertTargetCurrent
	});
	return updated;
}
async function mutateSessionGroup(params, action) {
	const env = params.env ?? process.env;
	await ensureSessionGroupCatalog(env);
	const from = normalizeOptionalString(params.name);
	const to = action === "rename" ? normalizeOptionalString(params.to) : void 0;
	if (!from || action === "rename" && !to) throw new Error(action === "rename" ? "group rename requires non-empty names" : "group delete requires a non-empty name");
	let updatedSessions = 0;
	if (from !== to) {
		params.assertCurrent?.();
		const prepared = await mutateSessionGroupCatalog({
			kind: "prepare",
			name: from,
			to
		}, env, params.assertCurrent);
		if (prepared.missingName) throw new SessionGroupNotFoundError(prepared.missingName);
		const source = prepared.source;
		try {
			updatedSessions = await updateMemberCategories(params.cfg, from, to, env, params.assertTargetCurrent);
			params.assertCurrent?.();
			const retired = await mutateSessionGroupCatalog({
				kind: "retire",
				name: from,
				to,
				source,
				cfg: {
					agents: params.cfg.agents,
					session: params.cfg.session
				}
			}, env, params.assertCurrent);
			if (retired.missingName) throw new SessionGroupNotFoundError(retired.missingName);
		} catch (error) {
			const message = `${formatErrorMessage(error)}. Group changes may be partial; reload groups and retry the same operation.`;
			if (error instanceof SessionMutationAuthorizationChangedError) throw new SessionMutationAuthorizationChangedError({
				...error.error,
				message
			});
			throw new Error(message, { cause: error });
		}
	}
	const { groups, sectionOrder } = readSessionGroupCatalog(env);
	return {
		groups,
		sectionOrder,
		updatedSessions
	};
}
async function renameSessionGroup(params) {
	return await mutateSessionGroup(params, "rename");
}
async function deleteSessionGroup(params) {
	return await mutateSessionGroup(params, "delete");
}
//#endregion
export { putSessionGroups as a, ensureSessionGroupRegistered as i, SessionGroupNotFoundError as n, renameSessionGroup as o, deleteSessionGroup as r, updateSessionGroupDefaults as s, SessionGroupNotEmptyError as t };
