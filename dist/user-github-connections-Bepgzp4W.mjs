import { Et as _enum, Jn as string, Pn as number, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { c as readPersonalGitHubSecret, r as PersonalGitHubStateError, u as writePersonalGitHubSecret } from "./secret-store-hidden-github-B2SEsxSq.mjs";
import { h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-BxQLnWfo.mjs";
import { a as githubOAuthSecret, i as githubOAuthScopes, n as githubOAuthProfileId, o as githubOAuthTimestamp, r as githubOAuthRefreshFields, s as validGitHubDeviceTiming, t as githubOAuthDeviceFields } from "./github-oauth-values-mlPBB9E9.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/user-github-connections.ts
const tokenPair = strictObject({
	accessToken: githubOAuthSecret,
	refreshToken: githubOAuthSecret,
	tokenType: literal("bearer"),
	scopes: githubOAuthScopes,
	expiresInSeconds: number().int().positive().max(31622400),
	refreshTokenExpiresInSeconds: number().int().positive().max(31622400)
});
const deviceFields = {
	requestId: string().uuid(),
	createdAtMs: githubOAuthTimestamp,
	expiresAtMs: githubOAuthTimestamp
};
const device = strictObject({
	...deviceFields,
	kind: literal("device"),
	...githubOAuthDeviceFields,
	candidate: strictObject({
		profileId: githubOAuthProfileId,
		tokens: tokenPair,
		receivedAtMs: githubOAuthTimestamp
	}).optional()
});
const connected = strictObject({
	kind: literal("connected"),
	profileId: githubOAuthProfileId,
	...githubOAuthRefreshFields,
	refreshFailure: _enum(["expired", "failed"]).optional(),
	refresh: strictObject({
		operationId: string().uuid(),
		tokens: tokenPair.optional(),
		receivedAtMs: githubOAuthTimestamp.optional()
	}).optional()
});
const connectionSchema = strictObject({
	version: literal(1),
	generation: string().uuid(),
	selection: discriminatedUnion("kind", [strictObject({ kind: literal("disconnected") }), connected]),
	pending: discriminatedUnion("kind", [strictObject({
		...deviceFields,
		kind: literal("starting")
	}), device]).optional()
}).superRefine((record, ctx) => {
	const pending = record.pending;
	if (pending && !validGitHubDeviceTiming(pending)) ctx.addIssue({
		code: "custom",
		message: "Invalid device timing"
	});
	const selection = record.selection;
	if (selection.kind === "connected" && (selection.refreshExpiresAtMs <= selection.accessExpiresAtMs || Boolean(selection.refresh?.tokens) !== (selection.refresh?.receivedAtMs !== void 0))) ctx.addIssue({
		code: "custom",
		message: "Invalid refresh state"
	});
});
const retirementObservers = /* @__PURE__ */ new Set();
function observeUserGitHubProfileRetirement(observer) {
	retirementObservers.add(observer);
	return () => {
		retirementObservers.delete(observer);
	};
}
function retireAfterCommit(db, ids) {
	if (ids.length > 0) deferSqlitePostCommitPublication(db, () => {
		for (const observer of retirementObservers) observer(ids);
	});
}
function parseConnection(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new PersonalGitHubStateError();
	}
	const result = connectionSchema.safeParse(parsed);
	if (!result.success) throw new PersonalGitHubStateError();
	const record = result.data;
	if (record.pending?.kind === "device") {
		registerSecretValueForRedaction(record.pending.deviceCode);
		if (record.pending.candidate) registerTokens(record.pending.candidate.tokens);
	}
	if (record.selection.kind === "connected") {
		registerSecretValueForRedaction(record.selection.refreshToken);
		if (record.selection.refresh?.tokens) registerTokens(record.selection.refresh.tokens);
	}
	return record;
}
function registerTokens(tokens) {
	registerSecretValueForRedaction(tokens.accessToken);
	registerSecretValueForRedaction(tokens.refreshToken);
}
/** Display fallback to a tombstone is never credential ownership. */
function resolvePersonalGitHubOwner(profile, db = openOpenClawStateDatabase().db) {
	if (!tableExists(db, "user_profiles")) return;
	const resolved = selectResolvedUserProfileMetadataById(db, profile);
	return resolved && !resolved.merged_into ? resolved.id : void 0;
}
function requireOwner(db, owner) {
	if (resolvePersonalGitHubOwner(owner, db) !== owner) throw new Error("Personal GitHub owner changed; reconnect and try again.");
}
function readConnection(db, owner) {
	const raw = readPersonalGitHubSecret(db, owner);
	return raw === void 0 ? void 0 : parseConnection(raw);
}
function readUserGitHubConnection(owner, database) {
	const db = openOpenClawStateDatabase(database).db;
	requireOwner(db, owner);
	return readConnection(db, owner);
}
function updateUserGitHubConnection(owner, update, assertCurrent, database) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		requireOwner(db, owner);
		const current = readConnection(db, owner);
		const next = parseConnection(JSON.stringify(update(current)));
		assertCurrent();
		writePersonalGitHubSecret(db, owner, JSON.stringify(next));
		const retained = new Set(connectionProfiles(next));
		retireAfterCommit(db, connectionProfiles(current).filter((id) => !retained.has(id)));
		return next;
	}, database, { operationLabel: "users.github.update" });
}
function disconnectedUserGitHubConnection() {
	return {
		version: 1,
		generation: randomUUID(),
		selection: { kind: "disconnected" }
	};
}
function disconnectUserGitHubConnection(owner, assertCurrent) {
	runOpenClawStateWriteTransaction(({ db }) => {
		requireOwner(db, owner);
		const previous = readConnectionForReplacement(db, owner);
		assertCurrent();
		writePersonalGitHubSecret(db, owner, JSON.stringify(disconnectedUserGitHubConnection()));
		retireAfterCommit(db, connectionProfiles(previous));
	}, void 0, { operationLabel: "users.github.disconnect" });
}
function connectionProfiles(record) {
	return [...record?.selection.kind === "connected" ? [record.selection.profileId] : [], ...record?.pending?.kind === "device" && record.pending.candidate ? [record.pending.candidate.profileId] : []];
}
function readConnectionForReplacement(db, owner) {
	try {
		return readConnection(db, owner);
	} catch (error) {
		if (!(error instanceof PersonalGitHubStateError)) throw error;
		return disconnectedUserGitHubConnection();
	}
}
/** Transfer only this live source, never credentials stranded on historical aliases. */
function mergeUserGitHubConnection(db, source, target) {
	requireOwner(db, source);
	requireOwner(db, target);
	const sourceRecord = readConnectionForReplacement(db, source);
	const targetRecord = readConnectionForReplacement(db, target);
	const selected = targetRecord ?? sourceRecord;
	if (!selected) return;
	const next = {
		...selected,
		generation: randomUUID(),
		pending: void 0
	};
	writePersonalGitHubSecret(db, target, JSON.stringify(next));
	if (sourceRecord) writePersonalGitHubSecret(db, source, null);
	const retained = new Set(connectionProfiles(next));
	retireAfterCommit(db, [...connectionProfiles(sourceRecord), ...connectionProfiles(targetRecord)].filter((id) => !retained.has(id)));
}
/** A remote rotation may follow an exact transferred operation; this never authorizes an action. */
function updateUserGitHubRefresh(params) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const owner = resolvePersonalGitHubOwner(params.owner, db);
		if (!owner) return false;
		const record = readConnection(db, owner);
		const selection = record?.selection;
		if (!record || selection?.kind !== "connected" || selection.profileId !== params.profileId || selection.refresh?.operationId !== params.operationId) return false;
		const next = parseConnection(JSON.stringify({
			...record,
			selection: params.update(selection)
		}));
		writePersonalGitHubSecret(db, owner, JSON.stringify(next));
		return true;
	}, void 0, { operationLabel: "users.github.refresh" });
}
function listUserGitHubConnections() {
	const db = openOpenClawStateDatabase().db;
	if (!tableExists(db, "secret_store_entries") || !tableExists(db, "user_profiles")) return [];
	const query = getNodeSqliteKysely(db);
	return executeSqliteQuerySync(db, query.selectFrom("secret_store_entries").innerJoin("user_profiles", "user_profiles.id", "secret_store_entries.scope_id").select(["scope_id", "value"]).where("scope_kind", "=", "identity").where("name", "=", "github-connection").where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null).where("merged_into", "is", null).orderBy("scope_id")).rows.flatMap((row) => {
		try {
			return [{
				owner: row.scope_id,
				connection: parseConnection(row.value)
			}];
		} catch {
			return [];
		}
	});
}
//#endregion
export { observeUserGitHubProfileRetirement as a, updateUserGitHubConnection as c, mergeUserGitHubConnection as i, updateUserGitHubRefresh as l, disconnectedUserGitHubConnection as n, readUserGitHubConnection as o, listUserGitHubConnections as r, resolvePersonalGitHubOwner as s, disconnectUserGitHubConnection as t };
