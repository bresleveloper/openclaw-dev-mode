import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { n as captureSessionActorStorageOwner, s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { C as runSessionCollaborationWrite, b as publishSessionCollaborationChanges } from "./session-accessor-Czw4l8kI.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { i as readSessionGroupMembershipInWorker, n as mutateSessionGroupCatalog, r as readSessionGroupCatalog, t as ensureSessionGroupCatalog } from "./session-group-catalog-DqTqmjvM.mjs";
//#region src/config/sessions/session-group-categories.ts
/** Prepared rows stay with the broker; only target identities cross the admission boundary. */
function updateSessionGroupCategoriesInWorker(params) {
	const { scope, from, to, assertTargetCurrent } = params;
	const agentId = scope.agentId;
	const owner = captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	});
	if (owner) return (async () => {
		const ownerSessionKey = owner.owner?.listSessions(owner.authority)[0]?.target.sessionKey ?? (owner.binding?.agentId === owner.agentId && owner.binding.path === owner.path ? owner.binding.actor.target.sessionKey : void 0);
		if (!ownerSessionKey) return 0;
		if (to !== void 0) await ensureSessionGroupCatalog(scope.env ?? process.env);
		return await withSessionActorStorage({
			...scope,
			sessionKey: ownerSessionKey
		}, {
			authority: owner.authority,
			lifetime: {
				assertCurrent: () => owner.authority.assertCurrent(),
				assertReadable: () => owner.authority.assertCurrent()
			}
		}, async (memory) => {
			const outcome = await memory.actor.storage.mutate({
				type: "session.category.apply",
				input: {
					from,
					to
				}
			}, {
				assertCurrent() {
					memory.authority.assertCurrent();
					if (to !== void 0 && !readSessionGroupCatalog(scope.env).groups.some((group) => group.name === to)) throw new Error(`unknown session group: ${to}`);
				},
				authorize(stage, facts, publication) {
					assertTargetCurrent?.({
						agentId,
						sessionKey: facts.target.sessionKey
					});
					memory.authority.authorize(stage, facts, publication);
				}
			}, { committed({ value }) {
				sessionChanges.emitBatch(value.map(({ sessionKey, sessionId }) => ({
					agentId,
					storePath: memory.path,
					sessionKey,
					facts: {
						kind: "category",
						sessionId,
						category: to?.trim() || null
					}
				})));
			} });
			if (outcome.kind === "rolled-back" || outcome.failure) {
				const failure = outcome.kind === "rolled-back" ? outcome.error : outcome.failure;
				const error = new Error(failure.message);
				error.name = failure.name;
				throw error;
			}
			return outcome.value.length;
		}) ?? 0;
	})();
	let keys = [];
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
	}, (changed, location, database, currentKeys) => {
		const changes = (currentKeys ? changed.filter(({ sessionKey }) => currentKeys.has(sessionKey)) : changed).map(({ sessionKey, sessionId }) => ({
			agentId: location.agentId,
			storePath: location.storePath,
			sessionKey,
			facts: {
				kind: "category",
				sessionId,
				category: to?.trim() || null
			}
		}));
		publishSessionCollaborationChanges(changes, database);
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
	});
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
			const { stores } = await readSessionGroupMembershipInWorker(params.cfg, env);
			for (const target of stores) updatedSessions += await updateSessionGroupCategoriesInWorker({
				scope: {
					...target,
					sessionKey: "",
					env
				},
				from,
				to,
				assertTargetCurrent: params.assertTargetCurrent
			});
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
