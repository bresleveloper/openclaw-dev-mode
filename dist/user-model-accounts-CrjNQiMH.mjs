import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { Jn as string, Pn as number, Un as record, lr as uuid, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { G as parseUserModelAuthProfileId, R as inlineAuthProfileCredentialSchema, W as isUserModelAuthProfileId, s as personalCredentialPublication, y as coerceProfileUsageStats } from "./user-model-account-authority-DFFjC5J5.mjs";
import { _ as ensureSecretStoreSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { p as publishUserProfileModelAccountLinksChange, r as captureUserProfileModelAccountLinksAuthority } from "./user-profile-events-CXjmX5Qy.mjs";
import { S as userProfilesDb, p as selectResolvedUserProfile } from "./user-profiles-internal-CBUpoSHj.mjs";
import { randomUUID } from "node:crypto";
import { toUSVString } from "node:util";
//#region src/state/user-model-account-records.kernel.ts
function invalidUserModelAccounts() {
	return /* @__PURE__ */ new Error("Personal model account state is invalid; restore a verified state backup.");
}
function readUserModelAccountRecord(db, owner, name) {
	if (!tableExists(db, "secret_store_entries")) return;
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
		"value",
		"kind",
		"allowed_hosts"
	]).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "=", name).where("deleted_at_ms", "is", null));
	return row ? userModelAccountRecordValue(row) : void 0;
}
function userModelAccountRecordValue(row) {
	if (row.kind !== "secret" || row.allowed_hosts !== null || row.value === null) throw invalidUserModelAccounts();
	return row.value;
}
/** Read only selected records through their current one-hop owners, preserving selection order. */
function readSelectedUserModelAccountRecords(db, profileIds) {
	const selected = [...new Set(profileIds)].flatMap((id) => {
		const locator = parseUserModelAuthProfileId(id);
		return locator ? [{
			id,
			owner: locator.ownerProfileId
		}] : [];
	});
	if (selected.length === 0 || !tableExists(db, "user_profiles") || !tableExists(db, "secret_store_entries")) return [];
	const rows = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("user_profiles as source").leftJoin("user_profiles as target", "target.id", "source.merged_into").innerJoin("secret_store_entries", (join) => join.on((eb) => eb("secret_store_entries.scope_id", "=", eb.case().when(eb.or([eb("source.merged_into", "is", null), eb("source.merged_into", "=", "")])).then(eb.ref("source.id")).else(eb.ref("target.id")).end()))).select([
		"name",
		"value",
		"kind",
		"allowed_hosts"
	]).where("scope_kind", "=", "identity").where("deleted_at_ms", "is", null).where((eb) => eb.or([
		eb("source.merged_into", "is", null),
		eb("source.merged_into", "=", ""),
		eb.and([eb("target.id", "is not", null), eb.or([eb("target.merged_into", "is", null), eb("target.merged_into", "=", "")])])
	])).where((eb) => eb.or(selected.map(({ id, owner }) => eb.and([eb("source.id", "=", owner), eb("name", "=", `model-account:${id}`)]))))).rows;
	const records = new Map(rows.map((row) => [row.name, row]));
	return selected.flatMap(({ id }) => {
		const row = records.get(`model-account:${id}`);
		return row ? [{
			id,
			...row
		}] : [];
	});
}
//#endregion
//#region src/state/user-model-accounts.ts
const credentialSchema = inlineAuthProfileCredentialSchema.refine((credential) => credential.copyToAgents !== true, "Personal model accounts cannot be copied to agent stores.");
const linksSchema = strictObject({
	version: literal(1),
	links: record(string(), strictObject({
		authProfileId: string().min(1),
		updatedAt: number()
	}).nullable())
});
const profileSchema = strictObject({
	version: literal(1),
	credential: credentialSchema,
	usageStats: unknown().transform(coerceProfileUsageStats).optional(),
	authorizationId: uuid().optional()
});
const MODEL_ACCOUNTS_PAGE_SIZE = 50;
function parseRecord(value, schema) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw invalidUserModelAccounts();
	const result = schema.safeParse(safeParseJson(value));
	if (!result.success) throw invalidUserModelAccounts();
	return result.data;
}
function resolveOwner(db, profileId) {
	if (!tableExists(db, "user_profiles")) return;
	const profile = selectResolvedUserProfile(db, profileId, userProfilesDb(db).selectFrom("user_profiles").select(["id", "merged_into"]));
	return profile && !profile.merged_into ? profile.id : void 0;
}
function requireOwner(db, profileId) {
	const owner = resolveOwner(db, profileId);
	if (!owner) throw new Error("Personal model account owner is unavailable; refresh Profile and try again.");
	return owner;
}
function writeRecord(db, owner, name, value) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new Error("Personal model account entry exceeds the 64 KiB secret-store limit.");
	ensureSecretStoreSchema(db);
	const now = Date.now();
	const mutable = {
		value,
		kind: "secret",
		allowed_hosts: null,
		deleted_at_ms: null,
		updated_at_ms: now,
		updated_by: null
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("secret_store_entries").values({
		scope_kind: "identity",
		scope_id: owner,
		name,
		created_at_ms: now,
		...mutable
	}).onConflict((conflict) => conflict.columns([
		"scope_kind",
		"scope_id",
		"name"
	]).doUpdateSet(mutable)));
}
function readLinks(db, owner) {
	const raw = readUserModelAccountRecord(db, owner, "model-accounts");
	return raw === void 0 ? {
		version: 1,
		links: {}
	} : parseRecord(raw, linksSchema);
}
function writeLinks(db, owner, links) {
	writeRecord(db, owner, "model-accounts", JSON.stringify(linksSchema.parse(links)));
	publishUserProfileModelAccountLinksChange(db, owner);
}
function readProfile(db, owner, authProfileId) {
	if (!isUserModelAuthProfileId(authProfileId)) return;
	const raw = readUserModelAccountRecord(db, owner, `model-account:${authProfileId}`);
	if (raw === void 0) return;
	const record = parseRecord(raw, profileSchema);
	registerUserModelAuthProfileSecrets(record.credential);
	return record;
}
function parseProfileRecord(raw) {
	if (raw === void 0) return;
	const { credential, usageStats } = parseRecord(raw, profileSchema);
	registerUserModelAuthProfileSecrets(credential);
	return {
		credential,
		usageStats
	};
}
function registerUserModelAuthProfileSecrets(credential) {
	if (credential.type === "oauth") {
		registerSecretValueForRedaction(credential.access);
		registerSecretValueForRedaction(credential.refresh);
		if (credential.idToken) registerSecretValueForRedaction(credential.idToken);
	} else if (credential.type === "token") {
		if (credential.token !== void 0) registerSecretValueForRedaction(credential.token);
	} else if (credential.key !== void 0) registerSecretValueForRedaction(credential.key);
}
function encodeUserModelAuthProfile(profile) {
	return JSON.stringify(profileSchema.parse({
		version: 1,
		...profile
	}));
}
function normalizeUserModelAuthProfile(profile) {
	const { credential, usageStats } = parseRecord(encodeUserModelAuthProfile(profile), profileSchema);
	return {
		credential,
		usageStats
	};
}
function writeProfile(db, owner, authProfileId, profile, authorizationId, replacement = false) {
	const record = profileSchema.parse({
		version: 1,
		...profile,
		authorizationId
	});
	writeRecord(db, owner, `model-account:${authProfileId}`, JSON.stringify(record));
	personalCredentialPublication.stagePostimages(db, [{
		id: authProfileId,
		credential: record.credential,
		authorizationId,
		replacement
	}]);
	return {
		credential: record.credential,
		usageStats: record.usageStats
	};
}
function accountLinks(record) {
	return Object.entries(record.links).toSorted(([a], [b]) => a.localeCompare(b)).flatMap(([provider, link]) => link ? [{
		provider,
		...link
	}] : []);
}
function credentialOwner(db, authProfileId) {
	const locator = parseUserModelAuthProfileId(authProfileId);
	return locator ? resolveOwner(db, locator.ownerProfileId) : void 0;
}
function accountSummary(authProfileId, value, links) {
	const { credential } = parseRecord(value, profileSchema);
	const identity = [credential.email?.trim(), credential.displayName?.trim()].filter(Boolean);
	return {
		authProfileId,
		provider: credential.provider,
		label: truncateUtf16Safe(toUSVString([...new Set(identity)].join(" · ") || credential.provider), 256),
		authType: credential.type,
		selected: links.links[credential.provider]?.authProfileId === authProfileId
	};
}
/** Owner-only control-plane inventory; runtime selection never enumerates private accounts. */
function listUserModelAccounts(params, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		if (!tableExists(db, "secret_store_entries")) return { accounts: [] };
		const links = readLinks(db, owner);
		let query = getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
			"name",
			"value",
			"kind",
			"allowed_hosts"
		]).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "like", "model-account:%").where("deleted_at_ms", "is", null).orderBy("name").limit(51);
		if (params.cursor) query = query.where("name", ">", `model-account:${params.cursor}`);
		const rows = executeSqliteQuerySync(db, query).rows;
		const accounts = rows.slice(0, MODEL_ACCOUNTS_PAGE_SIZE).map((row) => {
			if (row.kind !== "secret" || row.allowed_hosts !== null) throw invalidUserModelAccounts();
			return accountSummary(row.name.slice(14), row.value, links);
		});
		const last = accounts.at(-1);
		return {
			accounts,
			...rows.length > MODEL_ACCOUNTS_PAGE_SIZE && last ? { nextCursor: last.authProfileId } : {}
		};
	}, options) ?? { accounts: [] };
}
function readUserModelAccountSummary(params, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readUserModelAccountSummaryInDatabase(db, params), options);
}
function readUserModelAccountSummaryInDatabase(db, params) {
	const owner = resolveOwner(db, params.profileId);
	if (!owner || credentialOwner(db, params.authProfileId) !== owner) return;
	const value = readUserModelAccountRecord(db, owner, `model-account:${params.authProfileId}`);
	return value === void 0 ? void 0 : accountSummary(params.authProfileId, value, readLinks(db, owner));
}
/** Only an explicitly selected credential is loaded; no personal account enumeration. */
function readUserModelAuthProfile(authProfileId, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readPersonalCatalogProfilesInDatabase(db, { profileId: authProfileId }).profiles[authProfileId], options);
}
/** The catalog reads only explicit pins or linked credentials from its admitted reader. */
function readPersonalCatalogProfilesInDatabase(db, selection) {
	const links = "requesterProfileId" in selection ? listUserProfileAuthLinksInDatabase(db, selection.requesterProfileId) : [];
	const profileIds = "profileId" in selection ? [selection.profileId] : links.map((link) => link.authProfileId);
	const profiles = {};
	for (const { id, ...record } of readSelectedUserModelAccountRecords(db, profileIds)) {
		const profile = parseProfileRecord(userModelAccountRecordValue(record));
		if (profile) profiles[id] = profile;
	}
	return {
		links,
		profiles
	};
}
/** The canonical OAuth/usage owners mutate one exact private credential under the DB lock. */
function updateUserModelAuthProfile(authProfileId, update, options = {}, admit) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		admit?.({ stage: "transaction" });
		const owner = credentialOwner(db, authProfileId);
		const record = owner ? readProfile(db, owner, authProfileId) : void 0;
		if (!owner || !record) return false;
		const current = {
			credential: record.credential,
			usageStats: record.usageStats
		};
		const provider = current.credential.provider;
		if (!update(current)) return false;
		if (current.credential.provider !== provider) throw new Error("A personal model account refresh cannot change its provider.");
		const profile = writeProfile(db, owner, authProfileId, current, record.authorizationId);
		admit?.({
			stage: "commit",
			profile
		});
		return true;
	}, options, { operationLabel: "users.model-accounts.update" });
}
/** Enroll pre-lifetime records inside the admitted credential worker transaction. */
function enrollPersonalAuthProfileAuthorizationInDatabase(db, params) {
	const owner = credentialOwner(db, params.authProfileId);
	if (!owner || resolveOwner(db, params.profileId) !== owner) return;
	const record = readProfile(db, owner, params.authProfileId);
	if (!record) return;
	const authorizationId = record.authorizationId ?? randomUUID();
	if (!record.authorizationId) writeProfile(db, owner, params.authProfileId, record, authorizationId);
	return {
		ownerProfileId: owner,
		authorizationId
	};
}
/** Credential and selection commit together, after revalidating the live authorization. */
function connectUserModelAccount(params, options = {}) {
	const credential = credentialSchema.parse(params.credential);
	const replacement = params.replacement;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.ownerProfileId);
		if (owner !== params.ownerProfileId) throw new Error("Personal model account owner changed; refresh Profile and try again.");
		const record = readLinks(db, owner);
		const authProfileId = replacement && record.links[credential.provider]?.authProfileId === replacement.id && JSON.stringify(readProfile(db, owner, replacement.id)?.credential) === JSON.stringify(replacement.credential) ? replacement.id : `personal:${owner}:${randomUUID()}`;
		record.links[credential.provider] = {
			authProfileId,
			updatedAt: Date.now()
		};
		params.assertCurrent("transaction");
		writeProfile(db, owner, authProfileId, { credential }, randomUUID(), true);
		writeLinks(db, owner, record);
		params.assertCurrent("commit");
		return {
			authProfileId,
			links: accountLinks(record)
		};
	}, options, { operationLabel: "users.model-accounts.connect" });
}
/** Private provider preparation only; control-plane replies never contain this credential. */
function readSelectedUserModelAccount(profileId, provider, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		const owner = requireOwner(db, profileId);
		const id = readLinks(db, owner).links[provider]?.authProfileId;
		const profile = id && credentialOwner(db, id) === owner ? readProfile(db, owner, id) : void 0;
		return id && profile?.credential.provider === provider ? {
			id,
			credential: profile.credential
		} : void 0;
	}, options);
}
function listUserProfileAuthLinks(profileId, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => listUserProfileAuthLinksInDatabase(db, profileId), options) ?? [];
}
function listUserProfileAuthLinksInDatabase(db, profileId) {
	const owner = resolveOwner(db, profileId);
	return owner ? accountLinks(readLinks(db, owner)) : [];
}
const userProfileAuthLinks = /* @__PURE__ */ new Map();
/** The profile writer's receipts invalidate links shared by Gateway readers. */
async function listUserProfileAuthLinksAsync(profileId, options = {}) {
	const context = options.context ?? captureOpenClawStateReadWorkerContext(options);
	const key = JSON.stringify([context.admission.databasePath, profileId]);
	const cached = userProfileAuthLinks.get(key);
	if (cached?.isCurrent()) return cached.links.map((link) => Object.assign({}, link));
	const isCurrent = captureUserProfileModelAccountLinksAuthority(context.admission, profileId);
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "userModelAccounts.links",
		profileId
	}, {
		context,
		current: true,
		preferIndependentWarmRead: true
	});
	context.admission.assertCurrent();
	const links = reply?.links ?? [];
	userProfileAuthLinks.set(key, {
		links,
		isCurrent
	});
	pruneMapToMaxSize(userProfileAuthLinks, 512);
	return links.map((link) => Object.assign({}, link));
}
/** Apply Doctor's verified credential renames without changing account selections or ownership. */
function renameUserProfileAuthLinks(profileIdMap, options = {}) {
	if (profileIdMap.size === 0) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		if (!tableExists(db, "secret_store_entries")) return 0;
		const query = getNodeSqliteKysely(db);
		const rows = executeSqliteQuerySync(db, query.selectFrom("secret_store_entries").select("scope_id").where("scope_kind", "=", "identity").where("name", "=", "model-accounts").where("deleted_at_ms", "is", null)).rows;
		const replacements = [];
		for (const row of rows) {
			if (resolveOwner(db, row.scope_id) !== row.scope_id) continue;
			const record = readLinks(db, row.scope_id);
			let changed = false;
			for (const link of Object.values(record.links)) {
				if (!link) continue;
				const renamed = profileIdMap.get(link.authProfileId);
				if (renamed !== void 0 && renamed !== link.authProfileId) {
					link.authProfileId = renamed;
					changed = true;
				}
			}
			if (changed) {
				const value = JSON.stringify(record);
				parseRecord(value, linksSchema);
				replacements.push({
					owner: row.scope_id,
					value
				});
			}
		}
		for (const { owner, value } of replacements) executeSqliteQuerySync(db, query.updateTable("secret_store_entries").set({ value }).where("scope_kind", "=", "identity").where("scope_id", "=", owner).where("name", "=", "model-accounts").where("deleted_at_ms", "is", null));
		for (const { owner } of replacements) publishUserProfileModelAccountLinksChange(db, owner);
		return replacements.length;
	}, options, { operationLabel: "users.model-accounts.rename-auth-profiles" });
}
function setUserProfileAuthLink(params, options = {}) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		const record = readLinks(db, owner);
		if (isUserModelAuthProfileId(params.authProfileId) && (credentialOwner(db, params.authProfileId) !== owner || readProfile(db, owner, params.authProfileId)?.credential.provider !== params.provider)) throw new Error("Personal model account does not belong to this profile and provider.");
		record.links[params.provider] = {
			authProfileId: params.authProfileId,
			updatedAt: Date.now()
		};
		params.assertCurrent?.("transaction");
		writeLinks(db, owner, record);
		params.assertCurrent?.("commit");
		return accountLinks(record);
	}, options, { operationLabel: "users.model-accounts.link" });
}
function clearUserProfileAuthLink(params, options = {}) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const owner = requireOwner(db, params.profileId);
		const record = readLinks(db, owner);
		record.links[params.provider] = null;
		params.assertCurrent?.("transaction");
		writeLinks(db, owner, record);
		params.assertCurrent?.("commit");
		return accountLinks(record);
	}, options, { operationLabel: "users.model-accounts.unlink" });
}
/** Transfer only the current live source; never adopt secrets stranded on old aliases. */
function mergeUserModelAccounts(db, source, target) {
	if (!tableExists(db, "secret_store_entries")) return;
	if (requireOwner(db, source) !== source || requireOwner(db, target) !== target) throw new Error("Personal model account merge requires current profile owners.");
	const sourceRecord = readLinks(db, source);
	const targetRecord = readLinks(db, target);
	if (Object.keys(sourceRecord.links).length > 0) writeLinks(db, target, {
		version: 1,
		links: {
			...sourceRecord.links,
			...targetRecord.links
		}
	});
	const query = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, query.insertInto("secret_store_entries").columns([
		"scope_kind",
		"scope_id",
		"name",
		"value",
		"kind",
		"allowed_hosts",
		"created_at_ms",
		"updated_at_ms",
		"updated_by",
		"deleted_at_ms"
	]).expression(query.selectFrom("secret_store_entries").select((eb) => [
		"scope_kind",
		eb.val(target).as("scope_id"),
		"name",
		"value",
		"kind",
		"allowed_hosts",
		"created_at_ms",
		"updated_at_ms",
		"updated_by",
		"deleted_at_ms"
	]).where("scope_kind", "=", "identity").where("scope_id", "=", source).where("name", "like", "model-account:%")).onConflict((conflict) => conflict.columns([
		"scope_kind",
		"scope_id",
		"name"
	]).doNothing()));
	executeSqliteQuerySync(db, query.deleteFrom("secret_store_entries").where("scope_kind", "=", "identity").where("scope_id", "=", source).where((eb) => eb.or([eb("name", "=", "model-accounts"), eb("name", "like", "model-account:%")])));
	publishUserProfileModelAccountLinksChange(db, source, target);
}
//#endregion
export { listUserModelAccounts as a, mergeUserModelAccounts as c, readUserModelAccountSummary as d, readUserModelAuthProfile as f, updateUserModelAuthProfile as g, setUserProfileAuthLink as h, enrollPersonalAuthProfileAuthorizationInDatabase as i, normalizeUserModelAuthProfile as l, renameUserProfileAuthLinks as m, connectUserModelAccount as n, listUserProfileAuthLinks as o, registerUserModelAuthProfileSecrets as p, encodeUserModelAuthProfile as r, listUserProfileAuthLinksAsync as s, clearUserProfileAuthLink as t, readSelectedUserModelAccount as u };
