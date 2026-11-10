import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-CBUpoSHj.mjs";
import { a as githubOAuthSecret, i as githubOAuthScopes, n as githubOAuthProfileId, o as githubOAuthTimestamp, r as githubOAuthRefreshFields, s as validGitHubDeviceTiming, t as githubOAuthDeviceFields } from "./github-oauth-values-mlPBB9E9.mjs";
import { a as readPersonalGitHubSecret, s as writePersonalGitHubSecret, t as PersonalGitHubStateError } from "./secret-store-hidden-github.kernel-oq1fy2PW.mjs";
import { a as stageUserGitHubConnectionCommit } from "./user-github-connection-events-CptgDKbj.mjs";
import { randomUUID } from "node:crypto";
//#region src/state/user-github-connections.types.ts
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
const userGitHubConnectionSchema = strictObject({
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
const connectionCommitSchema = strictObject({
	kind: literal("user-github-connection"),
	changedOwners: array(string()),
	retiredProfileIds: array(string())
});
/** Source snapshots carry only the connection facts needed for publication authority. */
function projectUserGitHubConnectionAuthority(connection) {
	if (!connection) return null;
	const selected = connection.selection;
	return {
		generation: connection.generation,
		selection: selected.kind === "disconnected" ? { kind: "disconnected" } : {
			kind: selected.kind,
			profileId: selected.profileId,
			accountId: selected.accountId,
			login: selected.login,
			accessExpiresAtMs: selected.accessExpiresAtMs,
			refreshExpiresAtMs: selected.refreshExpiresAtMs,
			refreshFailure: selected.refreshFailure,
			scopes: [...selected.scopes],
			refreshing: Boolean(selected.refresh)
		}
	};
}
function isUserGitHubConnectionCommit(value) {
	return connectionCommitSchema.safeParse(value).success;
}
//#endregion
//#region src/state/user-github-connections.kernel.ts
function publishAfterCommit(db, changedOwners, retiredProfileIds, capture) {
	const receipt = {
		kind: "user-github-connection",
		changedOwners,
		retiredProfileIds
	};
	if (capture) capture(receipt);
	else stageUserGitHubConnectionCommit(db, receipt);
}
function parseUserGitHubConnection(raw) {
	const result = userGitHubConnectionSchema.safeParse(safeParseJson(raw));
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
function resolvePersonalGitHubOwnerInDatabase(profile, db) {
	if (!tableExists(db, "user_profiles")) return;
	const resolved = selectResolvedUserProfileMetadataById(db, profile);
	return resolved && !resolved.merged_into ? resolved.id : void 0;
}
function requireOwner(db, owner) {
	if (resolvePersonalGitHubOwnerInDatabase(owner, db) !== owner) throw new Error("Personal GitHub owner changed; reconnect and try again.");
}
function readConnection(db, owner) {
	const raw = readPersonalGitHubSecret(db, owner);
	return raw === void 0 ? void 0 : parseUserGitHubConnection(raw);
}
function readUserGitHubConnectionInDatabase(db, owner) {
	requireOwner(db, owner);
	return readConnection(db, owner);
}
function readCanonicalUserGitHubConnectionInDatabase(db, profile) {
	const owner = resolvePersonalGitHubOwnerInDatabase(profile, db);
	return owner ? {
		owner,
		connection: readConnection(db, owner)
	} : void 0;
}
function writeUserGitHubConnectionInDatabase(db, owner, next, current, capture) {
	const parsed = parseUserGitHubConnection(JSON.stringify(next));
	writePersonalGitHubSecret(db, owner, JSON.stringify(parsed));
	const retained = new Set(connectionProfiles(parsed));
	publishAfterCommit(db, [owner], connectionProfiles(current).filter((id) => !retained.has(id)), capture);
	return parsed;
}
function disconnectedUserGitHubConnection() {
	return {
		version: 1,
		generation: randomUUID(),
		selection: { kind: "disconnected" }
	};
}
function cancelUserGitHubAuthorizationInDatabase(db, owner, requestId, capture) {
	const current = readUserGitHubConnectionInDatabase(db, owner);
	return current?.pending?.requestId === requestId ? writeUserGitHubConnectionInDatabase(db, owner, {
		...current,
		pending: void 0
	}, current, capture) : void 0;
}
function disconnectUserGitHubConnectionInDatabase(db, owner, capture) {
	requireOwner(db, owner);
	return writeUserGitHubConnectionInDatabase(db, owner, disconnectedUserGitHubConnection(), readConnectionForReplacement(db, owner), capture);
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
function mergeUserGitHubConnection(db, source, target, capture) {
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
	publishAfterCommit(db, [source, target], [...connectionProfiles(sourceRecord), ...connectionProfiles(targetRecord)].filter((id) => !retained.has(id)), capture);
}
//#endregion
export { parseUserGitHubConnection as a, resolvePersonalGitHubOwnerInDatabase as c, projectUserGitHubConnectionAuthority as d, mergeUserGitHubConnection as i, writeUserGitHubConnectionInDatabase as l, disconnectUserGitHubConnectionInDatabase as n, readCanonicalUserGitHubConnectionInDatabase as o, disconnectedUserGitHubConnection as r, readUserGitHubConnectionInDatabase as s, cancelUserGitHubAuthorizationInDatabase as t, isUserGitHubConnectionCommit as u };
