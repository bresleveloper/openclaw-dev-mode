import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { probePathSuffixAliasesSync, resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
var IncognitoAgentDatabasePathCollisionError = class extends Error {
	constructor(pathname) {
		super(`Incognito agent database sentinel path already exists: ${pathname}. This filename is reserved for in-memory incognito state; move or rename the file and retry.`);
		this.name = "IncognitoAgentDatabasePathCollisionError";
		this.path = pathname;
	}
};
function assertIncognitoAgentDatabasePathAvailable(pathname) {
	if (existsSync(pathname)) throw new IncognitoAgentDatabasePathCollisionError(pathname);
}
const agentSqlitePaths = /* @__PURE__ */ new Map();
const agentSqlitePathKeys = agentSqlitePaths.keys();
function resolveOpenClawAgentSqlitePath(options) {
	const agentId = normalizeAgentId(options.agentId);
	if (options.path != null) return path.resolve(options.path);
	const stateDir = resolveStateDir(options.env ?? process.env);
	const cacheKey = `${agentId}:${stateDir}`;
	const cached = agentSqlitePaths.get(cacheKey);
	if (cached !== void 0) return cached;
	const resolved = path.resolve(stateDir, "agents", agentId, "agent", "openclaw-agent.sqlite");
	agentSqlitePaths.set(cacheKey, resolved);
	if (agentSqlitePaths.size > 256) {
		const oldest = agentSqlitePathKeys.next();
		if (!oldest.done) agentSqlitePaths.delete(oldest.value);
	}
	return resolved;
}
/** Resolve the lexical sentinel path that keys one agent's process-held incognito database. */
function resolveIncognitoOpenClawAgentSqlitePath(options) {
	return path.join(path.dirname(resolveOpenClawAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
/** Identify the reserved incognito sentinel without touching its filesystem path. */
function isIncognitoOpenClawAgentSqlitePath(pathname, options) {
	const resolved = path.resolve(pathname);
	return path.basename(resolved) === "incognito-openclaw-agent.sqlite" && resolved === resolveIncognitoOpenClawAgentSqlitePath(options);
}
const missingSuffixAliasCache = /* @__PURE__ */ new Map();
function shouldProbeUnicodeCaseVariants(left, right) {
	const hasNonAscii = (value) => value.split("").some((character) => character.charCodeAt(0) > 127);
	if (!hasNonAscii(left) && !hasNonAscii(right)) return false;
	const lowercaseEquivalent = left.toLowerCase() === right.toLowerCase();
	const uppercaseEquivalent = left.toUpperCase() === right.toUpperCase();
	if (!lowercaseEquivalent && !uppercaseEquivalent) return false;
	return !(Array.from(left).length !== Array.from(right).length && lowercaseEquivalent && !uppercaseEquivalent);
}
function areMissingSuffixAliases(params) {
	if (params.left === void 0 || params.right === void 0) return false;
	if (params.left === params.right) return true;
	const leftSegments = params.left.split(path.sep);
	const rightSegments = params.right.split(path.sep);
	if (leftSegments.length !== rightSegments.length || [...leftSegments, ...rightSegments].some((segment) => !segment || segment === "." || segment === "..")) return false;
	const suffixPair = [params.left, params.right].toSorted();
	const cacheKey = JSON.stringify([
		params.parentDevice.toString(),
		params.parentInode.toString(),
		params.parentRealPath,
		...suffixPair
	]);
	const cached = missingSuffixAliasCache.get(cacheKey);
	if (cached !== void 0) return cached;
	let aliases;
	let cause;
	try {
		aliases = probePathSuffixAliasesSync({
			directory: params.parentRealPath,
			left: params.left,
			right: params.right,
			maxDepth: leftSegments.length,
			shouldProbeCaseVariants: shouldProbeUnicodeCaseVariants
		});
	} catch (error) {
		cause = error;
	}
	if (aliases === void 0) throw new Error(`Cannot determine whether database paths alias under ${JSON.stringify(params.parentRealPath)}: ${JSON.stringify(params.left)} and ${JSON.stringify(params.right)}. Check directory access and retry.`, { cause });
	missingSuffixAliasCache.set(cacheKey, aliases);
	return aliases;
}
function anchorDatabasePathWithoutNormalizing(pathname) {
	const platformPath = path.sep === "\\" ? pathname.replaceAll("/", "\\") : pathname;
	if (path.isAbsolute(platformPath)) return platformPath;
	if (path.sep === "\\") {
		const driveRelative = /^([A-Za-z]:)(.*)$/u.exec(platformPath);
		if (driveRelative) {
			const driveBase = path.resolve(`${driveRelative[1]}.`);
			return driveRelative[2] ? `${driveBase}${driveBase.endsWith(path.sep) ? "" : path.sep}${driveRelative[2]}` : driveBase;
		}
	}
	const cwd = process.cwd();
	return `${cwd}${cwd.endsWith(path.sep) ? "" : path.sep}${platformPath}`;
}
function resolveAgentDatabasePathIdentity(pathname) {
	const lexicalPath = anchorDatabasePathWithoutNormalizing(pathname);
	try {
		const realPath = realpathSync.native(lexicalPath);
		const stat = statSync(realPath, { bigint: true });
		return {
			lexicalPath,
			realPath,
			device: stat.dev,
			inode: stat.ino
		};
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		const rootPath = path.parse(lexicalPath).root;
		const observed = resolvePathPrefixSync(rootPath + lexicalPath.slice(rootPath.length).split(path.sep).filter(Boolean).join(path.sep));
		const parentRealPath = observed.existingPath;
		const parentStat = statSync(parentRealPath, { bigint: true });
		return {
			lexicalPath,
			parentDevice: parentStat.dev,
			parentInode: parentStat.ino,
			parentRealPath,
			unresolvedSuffix: observed.unresolvedSegments.join(path.sep)
		};
	}
}
function areSameAgentDatabasePathIdentities(leftIdentity, rightIdentity) {
	if (leftIdentity.lexicalPath === rightIdentity.lexicalPath) return true;
	if (leftIdentity.realPath && leftIdentity.realPath === rightIdentity.realPath) return true;
	const parentDevice = leftIdentity.parentDevice;
	const parentInode = leftIdentity.parentInode;
	const sameMissingParent = parentDevice !== void 0 && parentInode !== void 0 && parentDevice === rightIdentity.parentDevice && parentInode === rightIdentity.parentInode;
	const sameMissingSuffix = leftIdentity.unresolvedSuffix === rightIdentity.unresolvedSuffix || sameMissingParent && leftIdentity.parentRealPath !== void 0 && areMissingSuffixAliases({
		left: leftIdentity.unresolvedSuffix,
		right: rightIdentity.unresolvedSuffix,
		parentDevice,
		parentInode,
		parentRealPath: leftIdentity.parentRealPath
	});
	return leftIdentity.device !== void 0 && leftIdentity.inode !== void 0 && leftIdentity.device === rightIdentity.device && leftIdentity.inode === rightIdentity.inode || sameMissingParent && sameMissingSuffix;
}
/** Create a synchronous-operation matcher that prepares each exact locator once. */
function createOpenClawAgentDatabasePathMatcher() {
	const identities = /* @__PURE__ */ new Map();
	const resolveIdentity = (pathname) => {
		const lexicalPath = anchorDatabasePathWithoutNormalizing(pathname);
		const cached = identities.get(lexicalPath);
		if (cached) return cached;
		const identity = resolveAgentDatabasePathIdentity(lexicalPath);
		identities.set(lexicalPath, identity);
		return identity;
	};
	return Object.assign((left, right) => areSameAgentDatabasePathIdentities(resolveIdentity(left), resolveIdentity(right)), { isCurrent() {
		for (const previous of identities.values()) {
			const current = resolveAgentDatabasePathIdentity(previous.lexicalPath);
			if (previous.realPath !== current.realPath || previous.device !== current.device || previous.inode !== current.inode || previous.parentDevice !== current.parentDevice || previous.parentInode !== current.parentInode || previous.parentRealPath !== current.parentRealPath || previous.unresolvedSuffix !== current.unresolvedSuffix) return false;
		}
		return true;
	} });
}
/** Compare two database locators by canonical filesystem identity when available. */
function isSameOpenClawAgentDatabasePath(left, right) {
	return areSameAgentDatabasePathIdentities(resolveAgentDatabasePathIdentity(left), resolveAgentDatabasePathIdentity(right));
}
function canonicalPathForRegistryBoundary(pathname) {
	const identity = resolveAgentDatabasePathIdentity(pathname);
	if (identity.realPath) return identity.realPath;
	if (!identity.parentRealPath || !identity.unresolvedSuffix) return identity.parentRealPath ?? path.resolve(pathname);
	const unresolvedSegments = identity.unresolvedSuffix.split(path.sep);
	return unresolvedSegments.includes("..") ? identity.parentRealPath : path.join(identity.parentRealPath, ...unresolvedSegments);
}
/** Named import artifacts are offline archives, not durable runtime discovery state. */
function isPersistentOpenClawAgentDatabasePath(pathname, env = process.env) {
	const lexicalCandidate = path.resolve(pathname);
	const lexicalImportsDir = path.join(path.resolve(resolveStateDir(env)), "imports");
	if (isPathInside(lexicalImportsDir, lexicalCandidate)) return false;
	const candidate = canonicalPathForRegistryBoundary(pathname);
	const stateDir = canonicalPathForRegistryBoundary(resolveStateDir(env));
	const importsDir = canonicalPathForRegistryBoundary(path.join(stateDir, "imports"));
	return !isPathInside(importsDir, candidate);
}
//#endregion
export { isPersistentOpenClawAgentDatabasePath as a, resolveOpenClawAgentSqlitePath as c, isIncognitoOpenClawAgentSqlitePath as i, assertIncognitoAgentDatabasePathAvailable as n, isSameOpenClawAgentDatabasePath as o, createOpenClawAgentDatabasePathMatcher as r, resolveIncognitoOpenClawAgentSqlitePath as s, INCOGNITO_AGENT_SQLITE_BASENAME as t };
