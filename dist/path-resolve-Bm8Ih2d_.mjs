import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-CBvmC8zz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { r as isArtifactPreservingStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as SHARED_AUTH_STORE_STATE_KEY } from "./sqlite-json-DYv-pIUa.mjs";
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
const sharedAuthStoreOwnershipByDatabasePath = /* @__PURE__ */ new Map();
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
/** Resolve the process-stable owner of the shared auth store. */
function resolveSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart OpenClaw.");
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, {
		env,
		path: databasePath
	}));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Fill the same process-stable owner cache without reading SQLite on the caller. */
async function resolveSharedAuthStoreOwnershipAsync(context) {
	const databasePath = context.admission.databasePath;
	const cached = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (cached) return cached;
	const value = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "authProfiles.sharedOwnership",
		input: { artifactPreserving: isArtifactPreservingStateRead() }
	}), { existingOnly: true });
	context.admission.assertCurrent();
	const current = sharedAuthStoreOwnershipByDatabasePath.get(databasePath);
	if (current) return current;
	if (sharedAuthStoreOwnershipByDatabasePath.size >= SHARED_AUTH_STORE_OWNERSHIP_CACHE_LIMIT) throw new Error("Shared auth store ownership cache exceeded its process root limit; restart OpenClaw.");
	const ownership = parseSharedAuthStoreOwnership(value);
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
	return ownership;
}
/** Inspect copied state without pinning a runtime owner or changing SQLite artifacts. */
function inspectSharedAuthStoreOwnership(env = process.env) {
	return parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, { env }, { artifactPreservingReadOnly: true }));
}
/** Update the process-stable cache after this process commits the ownership row. */
function noteCommittedSharedAuthStoreOwnership(ownership, env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
}
/** Reload shared auth ownership after an explicit out-of-process auth mutation. */
function reloadSharedAuthStoreOwnership(env = process.env) {
	const databasePath = path.resolve(resolveOpenClawStateSqlitePath(env));
	const ownership = parseSharedAuthStoreOwnership(readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, {
		env,
		path: databasePath
	}));
	sharedAuthStoreOwnershipByDatabasePath.set(databasePath, ownership);
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
export { resolveOAuthRefreshLockPath as a, resolveSharedAuthStorePath as c, reloadSharedAuthStoreOwnership as i, resolveSharedMainAuthAgentDir as l, inspectSharedAuthStoreOwnership as n, resolveSharedAuthStoreOwnership as o, noteCommittedSharedAuthStoreOwnership as r, resolveSharedAuthStoreOwnershipAsync as s, captureAuthProfileOwnerScope as t };
