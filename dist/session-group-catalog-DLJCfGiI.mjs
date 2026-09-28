import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import path from "node:path";
//#region src/gateway/session-group-catalog.ts
function isCatalogAdmission(value) {
	return isRecord(value) && Array.isArray(value.names) && value.names.every((name) => typeof name === "string") && (value.groups === void 0 || Array.isArray(value.groups) && value.groups.every((group) => Array.isArray(group) && group.length === 2 && typeof group[0] === "string" && Array.isArray(group[1]) && group[1].every((target) => isRecord(target) && typeof target.sessionKey === "string" && typeof target.agentId === "string")));
}
async function readSessionGroupMembershipInWorker(cfg, env) {
	const result = await executeExistingOpenClawStateRead({ env }, {
		type: "sessionGroups.members",
		cfg: {
			agents: cfg.agents,
			session: cfg.session
		}
	});
	if (!result) return {
		stores: [],
		groups: []
	};
	if (!result.ok || result.type !== "sessionGroups.members") throw new Error("Session group membership worker returned an unexpected result");
	return result.snapshot;
}
const catalogs = resolveGlobalSingleton(Symbol.for("openclaw.sessionGroupCatalog"), () => {
	const entries = /* @__PURE__ */ new Map();
	const invalidate = (pathname, identityKey) => {
		for (const [key, catalog] of entries) if (!pathname && !identityKey || pathname === key || identityKey !== void 0 && identityKey === catalog.admission?.identity.key) {
			catalog.revision += 1;
			catalog.snapshot = void 0;
			entries.delete(key);
		}
	};
	registerOpenClawStateDatabaseAsyncResource({
		phase: "after-resources",
		async close(identity) {
			invalidate(identity?.canonicalPath, identity?.key);
		}
	});
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		const pathname = event.kind === "opened" ? event.database.path : event.path;
		if (event.kind !== "opened") {
			invalidate(pathname, event.identity?.key);
			return;
		}
		for (const [key, catalog] of entries) if (pathname === key || event.identity.key === catalog.admission?.identity.key) {
			if (catalog.absent || catalog.reading && !catalog.snapshot) {
				catalog.revision += 1;
				catalog.snapshot = void 0;
				catalog.absent = false;
			}
		}
	});
	return entries;
});
function catalogFor(env) {
	const pathname = path.resolve(resolveOpenClawStateSqlitePath(env));
	let catalog = catalogs.get(pathname);
	if (!catalog) {
		catalog = { revision: 0 };
		catalogs.set(pathname, catalog);
	}
	return catalog;
}
/** Cold admission resolves aliases once; viewers keep borrowing the shared owner directly. */
function bindCatalog(admission) {
	const current = catalogs.get(admission.databasePath);
	const catalog = [...catalogs.values()].find((catalog) => catalog.admission?.identity.key === admission.identity.key) ?? (current && (!current.admission || current.admission.identity.key === admission.identity.key) ? current : { revision: 0 });
	if (current && current !== catalog) current.revision += 1;
	catalog.admission = admission;
	catalogs.set(admission.databasePath, catalog);
	return catalog;
}
function install(catalog, snapshot, absent = false) {
	for (const record of [...snapshot.groups, ...snapshot.defaults]) Object.freeze(record);
	Object.freeze(snapshot.groups);
	Object.freeze(snapshot.defaults);
	Object.freeze(snapshot.sectionOrder);
	catalog.snapshot = Object.freeze(snapshot);
	catalog.absent = absent;
}
/** The lifecycle owner refreshes once; synchronous viewers only borrow committed facts. */
async function ensureSessionGroupCatalog(env = process.env) {
	if (catalogFor(env).snapshot) return;
	const context = captureOpenClawStateWorkerContext({ env });
	const catalog = bindCatalog(context.admission);
	while (!catalog.snapshot) {
		if (!catalog.reading) {
			const revision = catalog.revision;
			catalog.reading = (async () => {
				const result = await executeExistingOpenClawStateRead({
					env: context.environment,
					path: context.admission.databasePath
				}, { type: "sessionGroups.snapshot" });
				context.admission.assertCurrent();
				if (catalog.revision !== revision) return;
				if (!result) install(catalog, {
					groups: [],
					defaults: [],
					sectionOrder: []
				}, true);
				else if (result.ok && result.type === "sessionGroups.snapshot") install(catalog, result.snapshot);
				else throw new Error("Session group catalog worker returned an unexpected result");
			})().finally(() => {
				catalog.reading = void 0;
			});
		}
		await catalog.reading;
		if (catalog !== catalogs.get(context.admission.databasePath)) throw new Error("Session group catalog changed while preparing; retry the request");
	}
}
function readSessionGroupCatalog(env = process.env) {
	const snapshot = catalogFor(env).snapshot;
	if (!snapshot) throw new Error("Session group catalog is not prepared");
	return snapshot;
}
function mutateSessionGroupCatalog(input, env, assertCurrent) {
	const mutation = structuredClone(input);
	const context = captureOpenClawStateWorkerContext({ env });
	const catalog = bindCatalog(context.admission);
	const write = async () => {
		context.admission.assertCurrent();
		assertCurrent?.();
		catalog.revision += 1;
		try {
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "sessionGroups.mutate",
				input: mutation
			}), {
				requireStateLifecycle: true,
				assertCurrent: () => assertCurrent?.(),
				createAdmission() {
					return {
						nativeLocations: [context.admission.databasePath],
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							context.admission.assertCurrent();
							if (request.stage === "transaction") {
								if (!isCatalogAdmission(request.facts)) throw new Error("Session group transaction omitted catalog authority");
								assertCurrent?.(request.facts);
							} else assertCurrent?.();
							grant();
						})
					};
				}
			});
			context.admission.assertCurrent();
			catalog.revision += 1;
			install(catalog, result.snapshot);
			return result;
		} catch (error) {
			catalog.revision += 1;
			catalog.snapshot = void 0;
			try {
				context.admission.assertCurrent();
				await ensureSessionGroupCatalog(context.environment);
			} catch {}
			throw error;
		}
	};
	const result = catalog.writing ? catalog.writing.then(write, write) : write();
	catalog.writing = result;
	result.finally(() => {
		if (catalog.writing === result) catalog.writing = void 0;
	}).catch(() => {});
	return result;
}
//#endregion
export { readSessionGroupMembershipInWorker as i, mutateSessionGroupCatalog as n, readSessionGroupCatalog as r, ensureSessionGroupCatalog as t };
