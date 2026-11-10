import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { s as stageSqliteTransactionState } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { a as normalizeBackgroundPreference, r as USER_BACKGROUND_PREFERENCE_KEY } from "./background-preferences-C24XmTL3.mjs";
import { d as publishUserProfileAuthorityChange, g as readUserProfileVersion } from "./user-profile-events-CXjmX5Qy.mjs";
import { t as createOpenClawStateSchemaEnsurer } from "./openclaw-state-feature-schema-ensure-BdqUBvvX.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-background.store.ts
const ensureUserBackgroundSchema = createOpenClawStateSchemaEnsurer({
	table: "user_background_images",
	operationLabel: "users.background.schema.ensure"
});
/** Preference edits and settings previews never materialize the retained image payload. */
function readUserBackgroundAsset(db, profileId) {
	if (!tableExists(db, "user_background_images")) return;
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("user_background_images").select([
		"asset_id",
		"width",
		"height"
	]).select((eb) => eb.fn("length", ["image"]).as("byte_length")).where("profile_id", "=", profileId));
}
/** The same validation runs for ordinary preference writes and atomic upload selection. */
function isOwnedBackgroundPreference(db, profileId, value) {
	const preference = normalizeBackgroundPreference(value);
	return Boolean(preference && (preference.source.kind !== "custom" || readUserBackgroundAsset(db, profileId)?.asset_id === preference.source.assetId));
}
function writeUserBackgroundImage(db, row) {
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("user_background_images").values(row).onConflict((conflict) => conflict.column("profile_id").doUpdateSet({
		asset_id: row.asset_id,
		image: row.image,
		width: row.width,
		height: row.height
	})));
}
function deleteUserBackgroundImage(db, profileId) {
	if (tableExists(db, "user_background_images")) executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("user_background_images").where("profile_id", "=", profileId));
}
/** Profile linking preserves the target upload, or transfers the source without duplicating it. */
function mergeUserBackgroundImages(db, sourceId, targetId) {
	if (sourceId === targetId || !tableExists(db, "user_background_images")) return;
	if (readUserBackgroundAsset(db, targetId)) {
		deleteUserBackgroundImage(db, sourceId);
		return;
	}
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("user_background_images").set({ profile_id: targetId }).where("profile_id", "=", sourceId));
}
//#endregion
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
		const background = row.pref_key === "ui.background" ? normalizeBackgroundPreference(JSON.parse(row.value_json)) : void 0;
		const valueJson = background && !isOwnedBackgroundPreference(database, targetProfileId, background) ? JSON.stringify({
			...background,
			source: { kind: "none" }
		}) : row.value_json;
		executeSqliteQuerySync(database, db.insertInto("user_preferences").values({
			...row,
			value_json: valueJson,
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
	const background = serialized.find((entry) => entry.prefKey === USER_BACKGROUND_PREFERENCE_KEY);
	if (background || deletionKeys.includes("ui.background")) {
		if (!expected.some((entry) => entry.prefKey === "ui.background")) return err({ code: "conflict" });
		if (background && !isOwnedBackgroundPreference(sqlite, profileId, JSON.parse(background.valueJson))) return err({
			code: "invalid-value",
			key: USER_BACKGROUND_PREFERENCE_KEY
		});
	}
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
export { updatesGitCoauthorPreference as a, captureUserPreferenceRead as c, mergeUserBackgroundImages as d, readUserBackgroundAsset as f, readUserPreferences as i, deleteUserBackgroundImage as l, ensureUserPreferencesSchema as n, writeUserPreferences as o, writeUserBackgroundImage as p, mergeUserPreferences as r, beginUserPreferenceMutation as s, deleteUserPreference as t, ensureUserBackgroundSchema as u };
