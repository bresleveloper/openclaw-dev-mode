import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as tableHasColumn, t as ensureColumn } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { r as readConfigMachineStateRowInDatabase } from "./config-machine-state-BfMkd608.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { n as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-Dn1blVrY.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/session-group-membership.read.ts
/** Discovery runs on a read worker; mutation guards call it inside their owning transaction. */
function readSessionGroupMembership(cfg, env) {
	const stores = resolveAllAgentSessionStoreTargetsSync(cfg, { env }).map((target) => {
		const resolved = resolveSqliteReadScope({
			...target,
			env
		});
		const options = toDatabaseOptions(resolved);
		return {
			agentId: target.agentId,
			storePath: resolveOpenClawAgentSqlitePath(options)
		};
	});
	const groups = /* @__PURE__ */ new Map();
	for (const store of stores) for (const { sessionKey, entry } of listSessionEntriesReadOnly({
		...store,
		env,
		projection: "list",
		clone: false
	})) {
		const name = normalizeOptionalString(entry.category);
		if (name) {
			const members = groups.get(name) ?? [];
			members.push({
				sessionKey,
				agentId: store.agentId
			});
			groups.set(name, members);
		}
	}
	return {
		stores,
		groups: [...groups]
	};
}
//#endregion
//#region src/gateway/session-group-registration.kernel.ts
function hasSessionGroup(db, name) {
	const kysely = getNodeSqliteKysely(db);
	return Boolean(executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").where("name", "=", name).limit(1)).rows[0]);
}
function registerSessionGroupInDatabase(database, name, env) {
	if (hasSessionGroup(database.db, name)) return false;
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (hasSessionGroup(db, name)) return false;
		const kysely = getNodeSqliteKysely(db);
		const maxRow = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("position").orderBy("position", "desc").limit(1)).rows[0];
		executeSqliteQuerySync(db, kysely.insertInto("session_groups").values({
			name,
			position: (maxRow?.position ?? -1) + 1,
			created_at: Date.now()
		}));
		return true;
	}, {
		database,
		path: database.path,
		env
	});
}
//#endregion
//#region src/gateway/session-group-catalog.kernel.ts
const SIDEBAR_ORDER = "sidebar.sectionOrder";
const defaultsDatabases = /* @__PURE__ */ new WeakSet();
const kyselyFor = (db) => getNodeSqliteKysely(db);
function hasDefaults(db) {
	return tableHasColumn(db, "session_groups", "cwd") && tableHasColumn(db, "session_groups", "worktree");
}
function readSessionGroupCatalogEntry(db, name) {
	const query = kyselyFor(db).selectFrom("session_groups").where("name", "=", name).limit(1);
	const row = executeSqliteQuerySync(db, hasDefaults(db) ? query.selectAll() : query.select([
		"name",
		"position",
		"created_at"
	])).rows[0];
	return row && { ...row };
}
function readSessionGroupCatalogSnapshot(db) {
	const query = kyselyFor(db).selectFrom("session_groups").orderBy("position").orderBy("name");
	const defaultsSchema = hasDefaults(db);
	const groups = executeSqliteQuerySync(db, query.select(["name", "position"])).rows;
	const defaults = defaultsSchema ? executeSqliteQuerySync(db, query.select([
		"name",
		"cwd",
		"worktree"
	])).rows.map((row) => {
		const record = { name: row.name };
		if (row.cwd) record.cwd = row.cwd;
		if (row.worktree !== null) record.worktree = row.worktree === 1;
		return record;
	}) : groups.map(({ name }) => ({ name }));
	const order = readConfigMachineStateRowInDatabase(db, SIDEBAR_ORDER);
	return {
		groups,
		defaults,
		sectionOrder: order ? JSON.parse(order.value_json) : []
	};
}
function updateSidebarOrder(db, update) {
	const row = readConfigMachineStateRowInDatabase(db, SIDEBAR_ORDER);
	const next = update(row ? JSON.parse(row.value_json) : void 0);
	if (!next) return;
	const values = {
		value_json: JSON.stringify(next),
		updated_at_ms: Date.now()
	};
	executeSqliteQuerySync(db, kyselyFor(db).insertInto("config_machine_state").values({
		state_key: SIDEBAR_ORDER,
		...values
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet(values)));
}
function mutateSessionGroupCatalogInDatabase(database, input, env) {
	if (input.kind === "register") return {
		changed: registerSessionGroupInDatabase(database, input.name, env),
		snapshot: readSessionGroupCatalogSnapshot(database.db)
	};
	let ensuredDefaults = false;
	const result = runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = kyselyFor(db);
		const names = executeSqliteQuerySync(db, kysely.selectFrom("session_groups").select("name").orderBy("position").orderBy("name")).rows.map((row) => row.name);
		const selected = input.kind === "put" ? names.filter((name) => !input.names.includes(name)) : input.kind === "defaults" || input.kind === "retire" ? [input.name] : [];
		const readGroups = () => {
			if (!("cfg" in input) || selected.length === 0) return;
			const members = new Map(readSessionGroupMembership(input.cfg, env).groups);
			return selected.map((name) => [name, members.get(name) ?? []]);
		};
		const groups = readGroups();
		const assertGroupsCurrent = () => {
			if (groups && !isDeepStrictEqual(groups, readGroups())) throw new Error("Session group members changed before catalog mutation; retry the request");
		};
		requestSqliteWorkerOperationAdmission({
			stage: "transaction",
			facts: {
				names,
				groups
			}
		});
		assertGroupsCurrent();
		let changed = false;
		let source;
		let missingName;
		if (input.kind === "put") {
			const nonEmpty = groups?.map(([name, members]) => ({
				name,
				memberSessions: members.length
			})).filter((group) => group.memberSessions > 0);
			if (nonEmpty?.length) {
				requestSqliteWorkerOperationAdmission({
					stage: "commit",
					facts: void 0
				});
				assertGroupsCurrent();
				return {
					changed: false,
					nonEmpty,
					snapshot: readSessionGroupCatalogSnapshot(db)
				};
			}
			const now = Date.now();
			const existing = new Set(names);
			executeSqliteQuerySync(db, input.names.length === 0 ? kysely.deleteFrom("session_groups") : kysely.deleteFrom("session_groups").where("name", "not in", input.names));
			input.names.forEach((name, position) => executeSqliteQuerySync(db, existing.has(name) ? kysely.updateTable("session_groups").set({ position }).where("name", "=", name) : kysely.insertInto("session_groups").values({
				name,
				position,
				created_at: now
			})));
			if (input.sectionOrder) updateSidebarOrder(db, () => input.sectionOrder);
			changed = true;
		} else if (input.kind === "defaults") {
			if (readSessionGroupCatalogEntry(db, input.name)) {
				if (!defaultsDatabases.has(db)) {
					ensureColumn(db, "session_groups", "cwd TEXT");
					ensureColumn(db, "session_groups", "worktree INTEGER");
					ensuredDefaults = true;
				}
				changed = executeSqliteQuerySync(db, kysely.updateTable("session_groups").set({
					cwd: input.cwd,
					worktree: input.worktree ? 1 : 0
				}).where("name", "=", input.name)).numAffectedRows === 1n;
			}
		} else if (input.kind === "prepare") {
			source = readSessionGroupCatalogEntry(db, input.name);
			if (input.to && !source) missingName = input.name;
			else if (input.to && source && !readSessionGroupCatalogEntry(db, input.to)) {
				executeSqliteQuerySync(db, kysely.insertInto("session_groups").values({
					...source,
					name: input.to
				}));
				changed = true;
			}
		} else {
			if (groups?.some(([, members]) => members.length > 0)) throw new Error(`session group ${JSON.stringify(input.name)} still has members`);
			if (!isDeepStrictEqual(readSessionGroupCatalogEntry(db, input.name), input.source)) throw new Error(`session group ${JSON.stringify(input.name)} changed before completion`);
			if (input.to !== void 0 && !readSessionGroupCatalogEntry(db, input.to)) missingName = input.to;
			else {
				executeSqliteQuerySync(db, kysely.deleteFrom("session_groups").where("name", "=", input.name));
				const from = `category:${input.name}`;
				const to = input.to === void 0 ? void 0 : `category:${input.to}`;
				updateSidebarOrder(db, (current) => !current?.includes(from) ? void 0 : to === void 0 || current.includes(to) ? current.filter((id) => id !== from) : current.map((id) => id === from ? to : id));
				changed = true;
			}
		}
		requestSqliteWorkerOperationAdmission({
			stage: "commit",
			facts: void 0
		});
		assertGroupsCurrent();
		return {
			changed,
			source,
			missingName,
			snapshot: readSessionGroupCatalogSnapshot(db)
		};
	}, {
		database,
		path: database.path,
		env
	});
	if (ensuredDefaults) defaultsDatabases.add(database.db);
	return result;
}
//#endregion
export { readSessionGroupCatalogEntry as n, mutateSessionGroupCatalogInDatabase as t };
