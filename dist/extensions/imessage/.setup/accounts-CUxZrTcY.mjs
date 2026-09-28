import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeAccountId, resolveAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
import { accessSync, constants, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { expectDefined } from "openclaw/plugin-sdk/expect-runtime";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { normalizeScpRemoteHost } from "openclaw/plugin-sdk/host-runtime";
//#region extensions/imessage/src/cli-path.ts
const localCliPathCache = /* @__PURE__ */ new Map();
const MACH_O_MAGICS = /* @__PURE__ */ new Set([
	"feedface",
	"feedfacf",
	"cefaedfe",
	"cffaedfe",
	"cafebabe",
	"cafebabf",
	"bebafeca",
	"bfbafeca"
]);
function resolveIMessageHomeDir() {
	const configuredHome = process.env.HOME;
	const home = configuredHome?.trim();
	if (home) return home;
	try {
		return (configuredHome === void 0 ? os.homedir() : os.userInfo().homedir).trim() || void 0;
	} catch {
		return;
	}
}
function expandIMessageUserPath(value) {
	if (!value.startsWith("~")) return value;
	const home = resolveIMessageHomeDir();
	return home ? value.replace(/^~(?=$|[\\/])/, () => home) : value;
}
function resolveIMessageExecutable(cliPath) {
	const expanded = expandIMessageUserPath(cliPath);
	if (expanded.includes(path.sep)) return expanded;
	for (const directory of (process.env.PATH ?? "").split(path.delimiter)) {
		if (!directory) continue;
		const candidate = path.join(directory, expanded);
		try {
			accessSync(candidate, constants.X_OK);
			return candidate;
		} catch {}
	}
}
function isMachOExecutable(filePath) {
	try {
		return MACH_O_MAGICS.has(readFileSync(realpathSync(filePath)).subarray(0, 4).toString("hex"));
	} catch {
		return false;
	}
}
function isProvenLocalIMessageCliPath(params) {
	if (params.remoteHost?.trim()) return false;
	const cliPath = params.cliPath.trim();
	const cacheKey = `${cliPath}\0${process.env.PATH ?? ""}`;
	const cached = localCliPathCache.get(cacheKey);
	if (cached !== void 0) return cached;
	const executable = resolveIMessageExecutable(cliPath);
	let local = executable ? isMachOExecutable(executable) : false;
	if (executable && !local) try {
		const match = readFileSync(realpathSync(executable), "utf8").match(/^#![^\r\n]+\r?\n\s*exec\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s+"\$@"\s*$/u);
		const target = match?.[1] ?? match?.[2] ?? match?.[3];
		local = Boolean(target && path.isAbsolute(target) && isMachOExecutable(target));
	} catch {
		local = false;
	}
	localCliPathCache.set(cacheKey, local);
	return local;
}
function isLikelyLocalIMessageCliPath(params) {
	if (params.remoteHost?.trim()) return false;
	const cliPath = params.cliPath.trim();
	if (cliPath === "imsg") return true;
	if (path.basename(cliPath) !== "imsg") return false;
	try {
		return !/\bssh\b[\s\S]*\bimsg\b/u.test(readFileSync(expandIMessageUserPath(cliPath), "utf8"));
	} catch {
		return true;
	}
}
function defaultMessagesDbPath() {
	const home = resolveIMessageHomeDir();
	return home ? path.join(home, "Library", "Messages", "chat.db") : void 0;
}
function resolveIMessageChatDbLookupPath(params) {
	if (params.remoteHost?.trim()) return;
	const configured = params.dbPath?.trim();
	if (configured) return expandIMessageUserPath(configured);
	if (!isLikelyLocalIMessageCliPath({
		cliPath: params.cliPath,
		remoteHost: params.remoteHost
	})) return;
	return defaultMessagesDbPath();
}
function resolveLocalIMessageChatDbPath(params) {
	if (!isProvenLocalIMessageCliPath({
		cliPath: params.cliPath,
		remoteHost: params.remoteHost
	})) return;
	const configured = params.dbPath?.trim();
	return configured ? expandIMessageUserPath(configured) : defaultMessagesDbPath();
}
//#endregion
//#region extensions/imessage/src/remote-host.ts
const ambiguousSshWrapper = Symbol("ambiguous-ssh-wrapper");
const detectedRemoteHosts = /* @__PURE__ */ new Map();
const remoteHostLookups = /* @__PURE__ */ new Map();
function cacheKey(cliPath) {
	return expandIMessageUserPath(cliPath.trim() || "imsg");
}
function unwrapExecutableToken(token) {
	const first = token[0];
	if ((first === "\"" || first === "'") && token.at(-1) === first) return token.slice(1, -1);
	return token.includes("\"") || token.includes("'") ? void 0 : token;
}
function isExecutable(token, name) {
	const executable = unwrapExecutableToken(token);
	if (!executable) return false;
	return executable === name || executable.startsWith("/") && executable.split("/").at(-1) === name;
}
function looksLikeSshWrapper(content) {
	return (content.match(/"[^"\r\n]*"|'[^'\r\n]*'|[^\s"'`;&|()<>\\]+/g) ?? []).some((token) => isExecutable(token, "ssh"));
}
function parseRemoteHost(content) {
	if (/\\\r?\n/.test(content)) return looksLikeSshWrapper(content) ? null : void 0;
	const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
	if (lines[0]?.startsWith("#!")) lines.shift();
	if (lines.length !== 1) return looksLikeSshWrapper(content) ? null : void 0;
	const match = lines[0]?.match(/^exec\s+((?:"[^"]+"|'[^']+'|[^\s"']+))\s+(?:-T\s+)?([^\s]+)\s+((?:"[^"]+"|'[^']+'|[^\s"']+))\s+"\$@"$/);
	const sshExecutable = match?.[1];
	const destination = match?.[2];
	const imsgExecutable = match?.[3];
	if (!sshExecutable || !destination || !imsgExecutable || !isExecutable(sshExecutable, "ssh") || !isExecutable(imsgExecutable, "imsg")) return looksLikeSshWrapper(content) ? null : void 0;
	return normalizeScpRemoteHost(destination) ?? null;
}
function throwAmbiguousSshWrapper() {
	throw new Error("iMessage SSH cliPath wrapper is not the simple transparent form; configure channels.imessage.remoteHost explicitly.");
}
function getCachedIMessageRemoteHost(params) {
	const configured = normalizeScpRemoteHost(params.remoteHost);
	if (configured) return configured;
	const cached = detectedRemoteHosts.get(cacheKey(params.cliPath));
	return typeof cached === "string" ? cached : void 0;
}
async function resolveIMessageRemoteHost(params) {
	const configured = normalizeScpRemoteHost(params.remoteHost);
	if (configured) return configured;
	const { logVerbose } = await import("openclaw/plugin-sdk/runtime-env");
	if (params.remoteHost?.trim()) logVerbose("imessage: ignoring unsafe configured remoteHost value");
	const key = cacheKey(params.cliPath);
	if (detectedRemoteHosts.has(key)) {
		const cached = detectedRemoteHosts.get(key);
		if (cached === ambiguousSshWrapper) throwAmbiguousSshWrapper();
		return cached ?? void 0;
	}
	if (!key.includes("/") && !key.includes("\\")) {
		detectedRemoteHosts.set(key, null);
		return;
	}
	const pending = remoteHostLookups.get(key);
	if (pending) return await pending;
	const lookup = (async () => {
		let detected;
		try {
			detected = parseRemoteHost(await fs$1.readFile(key, "utf8"));
		} catch (error) {
			const code = error?.code;
			if (code !== "ENOENT" && code !== "ENOTDIR") logVerbose(`imessage: failed to inspect cliPath ${params.cliPath}: ${String(error)}`);
		}
		if (detected === null) {
			detectedRemoteHosts.set(key, ambiguousSshWrapper);
			throwAmbiguousSshWrapper();
		}
		const normalized = normalizeScpRemoteHost(detected);
		if (detected && !normalized) logVerbose("imessage: ignoring unsafe auto-detected remoteHost from cliPath");
		else if (normalized) logVerbose(`imessage: detected remoteHost=${normalized} from cliPath`);
		detectedRemoteHosts.set(key, normalized ?? null);
		return normalized;
	})().finally(() => remoteHostLookups.delete(key));
	remoteHostLookups.set(key, lookup);
	return await lookup;
}
//#endregion
//#region extensions/imessage/src/accounts.ts
const { listAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedIMessageAccountConfig } = createAccountListHelpers("imessage", { implicitDefaultAccount: { channelKeys: ["cliPath", "dbPath"] } });
const listIMessageAccountIds = listAccountIds;
const resolveDefaultIMessageAccountId = resolveDefaultAccountId;
function resolveIMessageAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.imessage?.accounts, accountId);
}
function asStreamingConfigObject(value) {
	return asOptionalRecord(value);
}
function mergeIMessageStreamingConfig(base, account) {
	const baseConfig = asStreamingConfigObject(base);
	const accountConfig = asStreamingConfigObject(account);
	if (!baseConfig || !accountConfig) return accountConfig ?? baseConfig;
	return {
		...baseConfig,
		...accountConfig,
		...baseConfig.block || accountConfig.block ? { block: {
			...baseConfig.block,
			...accountConfig.block,
			...baseConfig.block?.coalesce || accountConfig.block?.coalesce ? { coalesce: {
				...baseConfig.block?.coalesce,
				...accountConfig.block?.coalesce
			} } : {}
		} } : {}
	};
}
function mergeIMessageAccountConfig(cfg, accountId) {
	const accountConfig = resolveIMessageAccountConfig(cfg, accountId);
	const merged = resolveMergedIMessageAccountConfig(cfg, accountId);
	const streaming = mergeIMessageStreamingConfig((cfg.channels?.imessage)?.streaming, accountConfig?.streaming);
	return streaming !== void 0 ? {
		...merged,
		streaming
	} : merged;
}
function resolveIMessageAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultIMessageAccountId(params.cfg));
	const baseEnabled = params.cfg.channels?.imessage?.enabled !== false;
	const merged = mergeIMessageAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const configured = Boolean(merged.enabled === true || merged.cliPath?.trim() || merged.dbPath?.trim() || merged.service || merged.sendTransport || merged.region?.trim() || merged.allowFrom && merged.allowFrom.length > 0 || merged.groupAllowFrom && merged.groupAllowFrom.length > 0 || merged.dmPolicy || merged.groupPolicy || typeof merged.includeAttachments === "boolean" || merged.attachmentRoots && merged.attachmentRoots.length > 0 || merged.remoteAttachmentRoots && merged.remoteAttachmentRoots.length > 0 || typeof merged.mediaMaxMb === "number" || typeof merged.textChunkLimit === "number" || merged.groups && Object.keys(merged.groups).length > 0);
	return {
		accountId,
		enabled: baseEnabled && accountEnabled,
		name: normalizeOptionalString(merged.name),
		config: merged,
		configured
	};
}
function normalizeIMessageCliPath(value) {
	return value?.trim() || "imsg";
}
function normalizeIMessageDbPath(value) {
	return value?.trim() ?? "";
}
function resolveIMessageAccountSourceSignature(account) {
	const cliPath = normalizeIMessageCliPath(account.config.cliPath);
	const dbPath = normalizeIMessageDbPath(account.config.dbPath);
	const remoteHost = getCachedIMessageRemoteHost({
		cliPath,
		remoteHost: account.config.remoteHost
	});
	if (remoteHost) return JSON.stringify([
		cliPath,
		dbPath,
		remoteHost
	]);
	const home = resolveIMessageHomeDir();
	const localDbPath = dbPath ? expandIMessageUserPath(dbPath) : home ? path.join(home, "Library", "Messages", "chat.db") : void 0;
	return JSON.stringify([
		cliPath,
		localDbPath ? path.resolve(localDbPath) : "",
		""
	]);
}
function resolveIMessageAccountSourceOwner(params) {
	let defaultOwner;
	for (const candidateAccountId of listIMessageAccountIds(params.cfg)) {
		const candidate = resolveIMessageAccount({
			cfg: params.cfg,
			accountId: candidateAccountId
		});
		if (!candidate.enabled || !candidate.configured) continue;
		if (resolveIMessageAccountSourceSignature(candidate) !== params.signature) continue;
		if (candidate.accountId === DEFAULT_ACCOUNT_ID) {
			defaultOwner ??= candidate.accountId;
			continue;
		}
		return candidate.accountId;
	}
	return defaultOwner;
}
function resolveIMessageDatabaseFileIdentity(dbPath) {
	try {
		const stats = statSync(dbPath);
		return stats.isFile() ? `${stats.dev}:${stats.ino}` : void 0;
	} catch {
		return;
	}
}
/**
* Returns the owner account id when `account` is an enabled duplicate of
* another enabled account that targets the same local Messages source. Used
* by the iMessage gateway lifecycle to skip starting redundant `imsg rpc`
* watchers (openclaw/openclaw#65141) without otherwise marking the duplicate
* disabled — outbound selection, status surfaces, and capability listings
* keep treating both accounts normally.
*/
function resolveIMessageDuplicateSourceOwner(params) {
	if (!params.account.enabled || !params.account.configured) return;
	const owner = resolveIMessageAccountSourceOwner({
		cfg: params.cfg,
		signature: resolveIMessageAccountSourceSignature(params.account)
	});
	return owner && owner !== params.account.accountId ? owner : void 0;
}
function listEnabledIMessageAccounts(cfg) {
	return listIMessageAccountIds(cfg).map((accountId) => resolveIMessageAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
function hasExclusiveIMessageLocalDatabase(params) {
	if (params.remoteHost?.trim()) return false;
	const otherAccounts = listEnabledIMessageAccounts(params.cfg).filter((candidate) => candidate.accountId !== params.account.accountId);
	if (otherAccounts.length === 0) return true;
	const selectedDbPath = resolveLocalIMessageChatDbPath({
		cliPath: params.cliPath,
		dbPath: params.dbPath,
		remoteHost: params.remoteHost ?? params.account.config.remoteHost
	});
	if (!selectedDbPath) return false;
	const selectedDbIdentity = resolveIMessageDatabaseFileIdentity(selectedDbPath);
	if (!selectedDbIdentity) return false;
	for (const candidate of otherAccounts) {
		if (candidate.config.remoteHost?.trim()) continue;
		const candidateDbPath = resolveLocalIMessageChatDbPath({
			cliPath: candidate.config.cliPath?.trim() || "imsg",
			dbPath: candidate.config.dbPath?.trim() || void 0
		});
		if (!candidateDbPath) return false;
		const candidateDbIdentity = resolveIMessageDatabaseFileIdentity(candidateDbPath);
		if (!candidateDbIdentity || candidateDbIdentity === selectedDbIdentity) return false;
	}
	return true;
}
function collectIMessageDuplicateAccountSourceWarnings(params) {
	const groups = /* @__PURE__ */ new Map();
	for (const accountId of listIMessageAccountIds(params.cfg)) {
		const account = resolveIMessageAccount({
			cfg: params.cfg,
			accountId
		});
		if (!account.enabled || !account.configured) continue;
		const signature = resolveIMessageAccountSourceSignature(account);
		const existing = groups.get(signature);
		if (existing) existing.push(account);
		else groups.set(signature, [account]);
	}
	const warnings = [];
	for (const collisions of groups.values()) {
		if (collisions.length < 2) continue;
		const firstCollision = expectDefined(collisions[0], "duplicate iMessage account source");
		const ownerId = resolveIMessageAccountSourceOwner({
			cfg: params.cfg,
			signature: resolveIMessageAccountSourceSignature(firstCollision)
		});
		const owner = collisions.find((a) => a.accountId === ownerId) ?? firstCollision;
		const dupIds = collisions.filter((a) => a.accountId !== owner.accountId).map((a) => `"${a.accountId}"`).join(", ");
		const cliPath = normalizeIMessageCliPath(owner.config.cliPath);
		const dbPath = normalizeIMessageDbPath(owner.config.dbPath);
		const where = dbPath ? `cliPath=${cliPath}, dbPath=${dbPath}` : `cliPath=${cliPath}`;
		warnings.push(`- channels.imessage: accounts "${owner.accountId}" and ${dupIds} watch the same local Messages source (${where}). OpenClaw runs one watcher (owner: "${owner.accountId}") and idles the duplicate; the other accounts stay enabled for outbound sends and status. Inbound messages arrive tagged with accountId="${owner.accountId}", so bindings pinned to ${dupIds} should be re-pointed at "${owner.accountId}" (or set "enabled": false on "${owner.accountId}" to flip ownership). Set "enabled": false on the unused duplicates to silence this warning.`);
	}
	return warnings;
}
//#endregion
export { resolveDefaultIMessageAccountId as a, getCachedIMessageRemoteHost as c, resolveIMessageChatDbLookupPath as d, resolveIMessageHomeDir as f, listIMessageAccountIds as i, resolveIMessageRemoteHost as l, hasExclusiveIMessageLocalDatabase as n, resolveIMessageAccount as o, resolveLocalIMessageChatDbPath as p, listEnabledIMessageAccounts as r, resolveIMessageDuplicateSourceOwner as s, collectIMessageDuplicateAccountSourceWarnings as t, expandIMessageUserPath as u };
