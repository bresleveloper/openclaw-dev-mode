import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as readConfigMachineState } from "./config-machine-state-DdwUh_Ff.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-CSDERtm3.mjs";
import { t as readConfigMachineStateAsync } from "./config-machine-state-async-Ck1ARyFy.mjs";
import { i as SHARED_AUTH_STORE_STATE_KEY } from "./sqlite-json-Dyr7VLoH.mjs";
import path from "node:path";
//#region src/agents/auth-profiles/shared-main-dir.ts
/** Resolve the shipped shared-main auth store, including its supported relocation. */
function resolveSharedMainAuthAgentDir(env = process.env) {
	const configured = env.OPENCLAW_AGENT_DIR?.trim();
	return configured ? resolveUserPath(configured, env) : path.join(resolveStateDir(env), "agents", LEGACY_IMPLICIT_AGENT_ID, "agent");
}
//#endregion
//#region src/agents/auth-profiles/path-resolve.ts
/**
* Auth profile path resolution.
* Centralizes canonical shared SQLite and cross-agent OAuth refresh lock paths.
*/
const SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT = 256;
function captureAuthProfileOwnerScope(env = process.env) {
	return {
		stateDir: path.resolve(resolveStateDir(env)),
		sharedMainDir: path.resolve(resolveSharedMainAuthAgentDir(env))
	};
}
const sharedAuthStoreOwnershipByDatabasePath = resolveGlobalSingleton(Symbol.for("openclaw.sharedAuthStoreOwnershipByDatabasePath"), () => /* @__PURE__ */ new Map());
var InvalidSharedAuthStoreOwnershipError = class extends Error {
	constructor(value) {
		super(`Config machine state ${SHARED_AUTH_STORE_STATE_KEY} has an invalid shared auth store location (${JSON.stringify(value)}); run openclaw doctor --fix.`);
		this.code = "INVALID_SHARED_AUTH_STORE_OWNERSHIP";
		this.action = "openclaw doctor --fix";
		this.stateKey = SHARED_AUTH_STORE_STATE_KEY;
		this.name = "InvalidSharedAuthStoreOwnershipError";
	}
};
function parseSharedAuthStoreOwnership(value) {
	if (value === void 0) return { location: "legacy-main" };
	if (isRecord(value) && Object.keys(value).length === 1 && (value.location === "legacy-main" || value.location === "state-db")) return { location: value.location };
	throw new InvalidSharedAuthStoreOwnershipError(value);
}
function getPreparedSharedAuthStoreOwnership(env) {
	return sharedAuthStoreOwnershipByDatabasePath.get(path.resolve(resolveOpenClawStateSqlitePath(env)));
}
function cacheSharedOwnership(databasePath, read) {
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart OpenClaw.");
	const ownership = parseSharedAuthStoreOwnership(read());
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Consume the process-stable owner prepared by the auth lifecycle. Never opens SQLite. */
function resolveSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	throw new Error(`Shared auth store ownership is not prepared for ${databasePath}; await resolveSharedAuthStoreOwnershipAsync before using auth paths.`);
}
/** Fill the same process-stable owner cache without reading SQLite on the caller. */
async function resolveSharedAuthStoreOwnershipAsync(context) {
	const databasePath = context.admission.databasePath;
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	const value = await readConfigMachineStateAsync(SHARED_AUTH_STORE_STATE_KEY, {
		path: databasePath,
		env: context.environment
	}, { artifactPreservingReadOnly: isArtifactPreservingStateRead() });
	context.admission.assertCurrent();
	const current = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (current) return current;
	return cacheSharedOwnership(databasePath, () => value);
}
/** Prepare cold ownership once; warm lifecycle entries consume the published fact directly. */
async function prepareSharedAuthStoreOwnership(env = process.env) {
	return getPreparedSharedAuthStoreOwnership(env) ?? resolveSharedAuthStoreOwnershipAsync(captureOpenClawStateWorkerContext({ env }));
}
/** Inspect copied state without pinning a runtime owner or changing SQLite artifacts. */
function inspectSharedAuthStoreOwnership(env = process.env) {
	return parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { env }, { artifactPreservingReadOnly: true }));
}
/** Install a committed shared-store ownership fact without rereading SQLite. */
function noteCommittedSharedAuthStoreOwnership(ownership, env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
}
/** Reload shared auth ownership after an explicitly joined auth child mutation. */
async function reloadSharedAuthStoreOwnership(env = process.env) {
	const context = captureOpenClawStateWorkerContext({ env });
	const value = await readConfigMachineStateAsync(SHARED_AUTH_STORE_STATE_KEY, {
		path: context.admission.databasePath,
		env: context.environment
	}, { artifactPreservingReadOnly: isArtifactPreservingStateRead() });
	context.admission.assertCurrent();
	const ownership = parseSharedAuthStoreOwnership(value);
	sharedAuthStoreOwnershipByDatabasePath.set(context.admission.databasePath, ownership);
	return ownership;
}
/** Resolve the canonical shared auth database path. */
function resolveSharedAuthStorePath(env = process.env) {
	if (resolveSharedAuthStoreOwnership(env).location === "state-db") return resolveOpenClawStateSqlitePath(env);
	return path.join(resolveSharedMainAuthAgentDir(env), "openclaw-agent.sqlite");
}
/**
* Resolve the path of the cross-agent, per-profile OAuth refresh coordination
* lock. The filename digests a JSON tuple of `[provider, profileId]` so it is
* filesystem-safe for arbitrary unicode/control-character inputs and always
* bounded in length. Tuple encoding makes it impossible to collide two distinct
* `(provider, profileId)` pairs by separator-sensitive string concatenation.
*
* This lock is the serialization point that prevents the `refresh_token_reused`
* storm when N agents share one OAuth profile (see issue #26322): every agent
* that attempts a refresh acquires this same file lock, so only one HTTP
* refresh is in-flight at a time and peers can adopt the resulting fresh
* credentials instead of racing against a single-use refresh token.
*
* The key intentionally includes `provider` so that two profiles that
* happen to share a `profileId` across providers (operator-renamed profile,
* test fixture, etc.) do not needlessly serialize against each other.
*/
function resolveOAuthRefreshLockPath(provider, profileId, env = process.env) {
	const safeId = `lock-${oauthLockPathDigest(JSON.stringify([provider, profileId]))}`;
	return path.join(resolveStateDir(env), "locks", "oauth-refresh", safeId);
}
function oauthLockPathDigest(value) {
	let left = 14695981039346656037n;
	let right = 11160318154034397263n;
	const prime = 1099511628211n;
	const mask = 18446744073709551615n;
	for (const byte of Buffer.from(value, "utf8")) {
		const octet = BigInt(byte);
		left = (left ^ octet) * prime & mask;
		right = (right ^ octet + 11400714819323198485n) * prime & mask;
	}
	return `${left.toString(16).padStart(16, "0")}${right.toString(16).padStart(16, "0")}`;
}
//#endregion
export { parseSharedAuthStoreOwnership as a, resolveOAuthRefreshLockPath as c, resolveSharedAuthStorePath as d, resolveSharedMainAuthAgentDir as f, noteCommittedSharedAuthStoreOwnership as i, resolveSharedAuthStoreOwnership as l, getPreparedSharedAuthStoreOwnership as n, prepareSharedAuthStoreOwnership as o, inspectSharedAuthStoreOwnership as r, reloadSharedAuthStoreOwnership as s, captureAuthProfileOwnerScope as t, resolveSharedAuthStoreOwnershipAsync as u };
