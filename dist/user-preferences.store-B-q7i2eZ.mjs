import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener, y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-gpylD4Gq.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { K as readUserProfileVersion, V as publishUserProfileAuthorityChange } from "./user-profiles-internal-DlO1LBbo.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-preferences-publication.ts
const publications = resolveGlobalSingleton(Symbol.for("openclaw.userPreferences.publications"), () => {
	const stores = /* @__PURE__ */ new Map();
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened" && event.identity) stores.delete(event.identity.key);
	});
	return stores;
});
function publication(key) {
	let current = publications.get(key);
	if (!current) {
		current = {
			revision: {},
			pending: /* @__PURE__ */ new Set()
		};
		publications.set(key, current);
	}
	return current;
}
function publishUserPreferencesChange(db) {
	const current = publication(requireOpenClawStateDatabaseIdentity({ db }).key);
	const commit = () => {
		current.revision = {};
	};
	if (!stageSqliteTransactionState(db, {
		stage: () => {},
		rollback: () => {},
		commit
	})) commit();
}
/** Fence readers before worker dispatch and retain the fence through native settlement. */
function beginUserPreferenceMutation(admission) {
	admission.assertCurrent();
	const current = publication(admission.identity.key);
	const settled = createDeferredCore();
	current.revision = {};
	current.pending.add(settled.promise);
	return () => {
		current.revision = {};
		current.pending.delete(settled.promise);
		settled.resolve();
	};
}
async function captureUserPreferenceRead(admission) {
	const current = publication(admission.identity.key);
	while (current.pending.size) await Promise.all(current.pending);
	admission.assertCurrent();
	const revision = current.revision;
	const profileRevision = readUserProfileVersion();
	return () => {
		admission.assertCurrent();
		return publications.get(admission.identity.key) === current && current.revision === revision && current.pending.size === 0 && readUserProfileVersion() === profileRevision;
	};
}
//#endregion
//#region src/state/user-preferences.store.ts
const ensureUserPreferencesSchema = createOpenClawStateSchemaEnsurer({
	table: "user_preferences",
	operationLabel: "users.preferences.schema.ensure"
});
function updatesGitCoauthorPreference(update) {
	return update.serialized.some(({ prefKey }) => prefKey === "git.coauthor.enabled") || update.deletionKeys.includes("git.coauthor.enabled");
}
function deleteUserPreference(database, profileId, key) {
	const db = getNodeSqliteKysely(database);
	if (!tableExists(database, "user_preferences")) return;
	executeSqliteQuerySync(database, db.deleteFrom("user_preferences").where("profile_id", "=", profileId).where("pref_key", "=", key));
	publishUserPreferencesChange(database);
}
function readPreferenceKeys(database, profileId) {
	const db = getNodeSqliteKysely(database);
	return new Set(executeSqliteQuerySync(database, db.selectFrom("user_preferences").select("pref_key").where("profile_id", "=", profileId)).rows.map((row) => row.pref_key));
}
/** Moves one retired profile's preferences without overwriting the merge target's choices. */
function mergeUserPreferences(database, sourceProfileId, targetProfileId) {
	if (sourceProfileId === targetProfileId || !tableExists(database, "user_preferences")) return;
	const db = getNodeSqliteKysely(database);
	const targetKeys = readPreferenceKeys(database, targetProfileId);
	const rows = executeSqliteQuerySync(database, db.selectFrom("user_preferences").selectAll().where("profile_id", "=", sourceProfileId).orderBy("pref_key", "asc")).rows;
	for (const row of rows) {
		if (targetKeys.has(row.pref_key)) continue;
		if (targetKeys.size >= 128) break;
		executeSqliteQuerySync(database, db.insertInto("user_preferences").values({
			...row,
			profile_id: targetProfileId
		}).onConflict((conflict) => conflict.columns(["profile_id", "pref_key"]).doNothing()));
		targetKeys.add(row.pref_key);
	}
	executeSqliteQuerySync(database, db.deleteFrom("user_preferences").where("profile_id", "=", sourceProfileId));
	publishUserPreferencesChange(database);
}
function readUserPreferences(sqlite, profileId, keys) {
	if (keys?.length === 0) return {};
	let query = getNodeSqliteKysely(sqlite).selectFrom("user_preferences").select(["pref_key", "value_json"]).where("profile_id", "=", profileId).orderBy("pref_key", "asc");
	if (keys) query = query.where("pref_key", "in", [...keys]);
	return Object.fromEntries(executeSqliteQuerySync(sqlite, query).rows.map((row) => [row.pref_key, JSON.parse(row.value_json)]));
}
function writeUserPreferences(sqlite, profileId, update) {
	const { serialized, deletionKeys, expected } = update;
	if (expected.length > 0) {
		const current = readUserPreferences(sqlite, profileId, expected.map(({ prefKey }) => prefKey));
		for (const { prefKey, valueJson } of expected) if (valueJson === null ? Object.hasOwn(current, prefKey) : !Object.hasOwn(current, prefKey) || !isDeepStrictEqual(current[prefKey], JSON.parse(valueJson))) return err({ code: "conflict" });
	}
	const db = getNodeSqliteKysely(sqlite);
	const currentKeys = readPreferenceKeys(sqlite, profileId);
	const nextKeys = new Set(currentKeys);
	deletionKeys.forEach((key) => nextKeys.delete(key));
	serialized.forEach((entry) => nextKeys.add(entry.prefKey));
	if (serialized.length > 0 && nextKeys.size > 128) return err({
		code: "profile-key-limit",
		limit: 128,
		currentCount: currentKeys.size
	});
	if (deletionKeys.length > 0) executeSqliteQuerySync(sqlite, db.deleteFrom("user_preferences").where("profile_id", "=", profileId).where("pref_key", "in", deletionKeys));
	const updatedAtMs = Date.now();
	if (serialized.length > 0) executeSqliteQuerySync(sqlite, db.insertInto("user_preferences").values(serialized.map((entry) => ({
		profile_id: profileId,
		pref_key: entry.prefKey,
		value_json: entry.valueJson,
		updated_at_ms: updatedAtMs
	}))).onConflict((conflict) => conflict.columns(["profile_id", "pref_key"]).doUpdateSet({
		value_json: (eb) => eb.ref("excluded.value_json"),
		updated_at_ms: (eb) => eb.ref("excluded.updated_at_ms")
	})));
	if (updatesGitCoauthorPreference(update)) publishUserProfileAuthorityChange(sqlite, profileId);
	publishUserPreferencesChange(sqlite);
	return ok(void 0);
}
//#endregion
export { updatesGitCoauthorPreference as a, captureUserPreferenceRead as c, readUserPreferences as i, ensureUserPreferencesSchema as n, writeUserPreferences as o, mergeUserPreferences as r, beginUserPreferenceMutation as s, deleteUserPreference as t };
