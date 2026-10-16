import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as runCommandBuffered } from "./exec-DJvyCA0D.mjs";
import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import { n as resolveGitHubHost } from "./github-host-runtime-B1RbT0q5.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/agents/github-read-identity.ts
const GITHUB_IDENTITY_COMMAND_TIMEOUT_MS = 15e3;
const GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES = 32768;
const NATIVE_GITHUB_TOKEN_TTL_MS = 6e4;
let nativeTokens = /* @__PURE__ */ new Map();
const pendingNativeTokens = /* @__PURE__ */ new Map();
function clearNativeGitHubTokenCache() {
	nativeTokens = /* @__PURE__ */ new Map();
	pendingNativeTokens.clear();
}
function ambientGitHubCredential(env, host = resolveGitHubHost()) {
	const names = host === "github.com" ? ["GH_TOKEN", "GITHUB_TOKEN"] : ["GH_ENTERPRISE_TOKEN", "GITHUB_ENTERPRISE_TOKEN"];
	const token = resolveEnvironmentValue(env, names[0]) || resolveEnvironmentValue(env, names[1]);
	if (token && host !== "github.com" && resolveEnvironmentValue(env, "GH_HOST")?.trim().toLowerCase() !== host) throw new GitHubIdentityError("unverified");
	return {
		host,
		token
	};
}
async function readCachedNativeGitHubToken(env, requireAbsentProof = false, githubHost = resolveGitHubHost()) {
	const effectiveEnv = mergeProcessEnv([process.env, env]);
	const { host, token } = ambientGitHubCredential(effectiveEnv, githubHost);
	if (token) return normalizeGitHubToken(token);
	const key = createHash("sha256").update(JSON.stringify([
		host,
		process.cwd(),
		Object.entries(effectiveEnv).toSorted(([left], [right]) => left.localeCompare(right)),
		requireAbsentProof
	])).digest("hex");
	const cache = nativeTokens;
	const cached = cache.get(key);
	if (cached && cached.expiresAt > Date.now()) return cached.token;
	cache.delete(key);
	return getOrCreatePromise(pendingNativeTokens, key, async () => {
		const current = await readNativeGitHubToken(env, requireAbsentProof, host);
		if (current !== void 0) {
			cache.set(key, {
				token: current,
				expiresAt: Date.now() + NATIVE_GITHUB_TOKEN_TTL_MS
			});
			pruneMapToMaxSize(cache, 32);
		}
		return current;
	}, { evictOnSettled: true });
}
async function runGitHubIdentityCommand(argv, env, cwd, timeoutMs = GITHUB_IDENTITY_COMMAND_TIMEOUT_MS) {
	return await runCommandBuffered(argv, {
		env: env ? { ...env } : {},
		cwd,
		timeoutMs,
		maxOutputBytes: GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES
	});
}
function normalizeGitHubToken(token) {
	const normalized = token.trim();
	if (!normalized || normalized.length > 2048 || /\s/u.test(normalized)) throw new Error("Managed GitHub credential must be one non-empty line.");
	registerSecretValueForRedaction(normalized);
	return normalized;
}
async function assertNoNativeGitHubConfiguration(env, cwd) {
	const value = (name) => resolveEnvironmentValue(env, name);
	const windows = process.platform === "win32";
	const nativePath = windows ? path.win32 : path.posix;
	const home = value(windows ? "USERPROFILE" : "HOME");
	const xdg = value("XDG_CONFIG_HOME");
	const appData = value("APPDATA");
	const configured = value("GH_CONFIG_DIR") || (xdg ? nativePath.join(xdg, "gh") : void 0) || (windows && appData ? nativePath.join(appData, "GitHub CLI") : void 0) || (home ? nativePath.join(home, ".config", "gh") : void 0);
	if (!configured) throw new GitHubIdentityError("unverified");
	const directory = nativePath.resolve(cwd, configured);
	for (const file of [
		directory,
		nativePath.join(directory, "config.yml"),
		nativePath.join(directory, "hosts.yml")
	]) try {
		const stat = await fs.lstat(file);
		if (file !== directory || !stat.isDirectory() || stat.isSymbolicLink()) throw new GitHubIdentityError("unavailable");
	} catch (error) {
		if (error instanceof GitHubIdentityError) throw error;
		if (!hasErrnoCode(error, "ENOENT")) throw new GitHubIdentityError("unverified");
	}
}
async function readNativeGitHubToken(env, requireAbsentProof = false, githubHost = resolveGitHubHost()) {
	const effectiveEnv = mergeProcessEnv([process.env, env]);
	const { token } = ambientGitHubCredential(effectiveEnv, githubHost);
	if (token) return normalizeGitHubToken(token);
	const commandEnv = {
		...env,
		GH_HOST: githubHost,
		GH_TOKEN: void 0,
		GITHUB_TOKEN: void 0,
		GH_ENTERPRISE_TOKEN: void 0,
		GITHUB_ENTERPRISE_TOKEN: void 0
	};
	const startedAt = performance.now();
	const result = await runGitHubIdentityCommand([
		"gh",
		"auth",
		"token",
		"--hostname",
		githubHost
	], commandEnv);
	try {
		if (result.code === 0) return normalizeGitHubToken(result.stdout.toString("utf8"));
	} finally {
		result.stdout.fill(0);
		result.stderr.fill(0);
	}
	if (!requireAbsentProof) return;
	if (result.termination === "error") try {
		const cwd = process.cwd();
		if (!hasErrnoCode(result.error, "ENOENT") || !(await fs.stat(cwd)).isDirectory() || resolveExecutablePath("gh", {
			env: effectiveEnv,
			cwd,
			useCache: false
		})) throw new GitHubIdentityError("unverified");
		await assertNoNativeGitHubConfiguration(effectiveEnv, cwd);
		return;
	} catch (error) {
		throw error instanceof GitHubIdentityError ? error : new GitHubIdentityError("unverified");
	}
	if (result.termination !== "exit") throw new GitHubIdentityError("unverified");
	const remainingMs = GITHUB_IDENTITY_COMMAND_TIMEOUT_MS - Math.ceil(performance.now() - startedAt);
	if (remainingMs <= 0) throw new GitHubIdentityError("unverified");
	const observed = await runGitHubIdentityCommand([
		"gh",
		"auth",
		"status",
		"--active",
		"--hostname",
		githubHost,
		"--json",
		"hosts"
	], commandEnv, void 0, remainingMs);
	try {
		if (observed.code !== 0) throw new GitHubIdentityError("unverified");
		let value;
		try {
			value = JSON.parse(observed.stdout.toString("utf8"));
		} catch {
			throw new GitHubIdentityError("unverified");
		}
		if (!isRecord(value) || !isRecord(value.hosts) || Object.keys(value).length !== 1) throw new GitHubIdentityError("unverified");
		if (Object.keys(value.hosts).length !== 0) throw new GitHubIdentityError("unavailable");
		return;
	} finally {
		observed.stdout.fill(0);
		observed.stderr.fill(0);
	}
}
/** The caller's owner admits the operation; selection is checked inside that admission. */
function startGitHubIdentityOperation(operation, authority) {
	authority.assertCurrent?.();
	return authority.startCurrent ? authority.startCurrent(() => {
		authority.assertCurrent?.();
		return operation();
	}) : operation();
}
var GitHubIdentityError = class extends Error {
	constructor(reason) {
		super(reason === "changed" ? "GitHub identity changed; reload the dashboard and retry." : reason === "rate_limited" ? "GitHub identity verification is rate limited; wait and retry." : reason === "unverified" ? "The effective GitHub identity could not be verified; retry or reconnect the agent's GitHub identity." : "The selected GitHub credential is unavailable; reconnect the agent's GitHub identity in Settings.");
		this.reason = reason;
	}
};
function createGitHubReadIdentity(params) {
	const { token, selection, assertSelected, startActive, readToken } = params;
	const caller = {
		assertCurrent: assertSelected,
		startCurrent: startActive
	};
	const start = async (operation) => {
		const current = await startGitHubIdentityOperation(readToken, caller);
		return await startGitHubIdentityOperation(() => {
			if (current !== token) throw new GitHubIdentityError("changed");
			return operation();
		}, caller);
	};
	const authority = {
		cacheScope: selection.source === "anonymous" ? "anonymous" : createHash("sha256").update(JSON.stringify([
			selection.source,
			selection.profileId,
			selection.accountId,
			token
		])).digest("hex"),
		assertSelected,
		revalidate: () => start(() => void 0),
		start
	};
	return params.token === void 0 ? {
		...authority,
		token: void 0,
		selection: Object.freeze(params.selection)
	} : {
		...authority,
		token: params.token,
		selection: Object.freeze(params.selection)
	};
}
//#endregion
export { normalizeGitHubToken as a, runGitHubIdentityCommand as c, createGitHubReadIdentity as i, startGitHubIdentityOperation as l, GitHubIdentityError as n, readCachedNativeGitHubToken as o, clearNativeGitHubTokenCache as r, readNativeGitHubToken as s, GITHUB_IDENTITY_OUTPUT_LIMIT_BYTES as t };
