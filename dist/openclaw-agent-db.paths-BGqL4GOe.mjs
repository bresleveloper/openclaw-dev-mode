import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { realpathSync, statSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { probePathSuffixAliasesSync, resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
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
/** Resolve the lexical sentinel path used by an agent's memory session owner. */
function resolveIncognitoOpenClawAgentSqlitePath(options) {
	return path.join(path.dirname(resolveOpenClawAgentSqlitePath(options)), INCOGNITO_AGENT_SQLITE_BASENAME);
}
/** Identify the reserved incognito sentinel without touching its filesystem path. */
function isIncognitoOpenClawAgentSqlitePath(pathname, options) {
	const resolved = path.resolve(pathname);
	return path.basename(resolved) === "incognito-openclaw-agent.sqlite" && resolved === resolveIncognitoOpenClawAgentSqlitePath(options);
}
/** An explicit sentinel names its physical root; ambient state cannot redirect it. */
function resolveExplicitIncognitoAgentSqliteTarget(pathname, options = {}) {
	if (!pathname || path.basename(pathname) !== "incognito-openclaw-agent.sqlite") return;
	const resolved = path.resolve(pathname);
	const agentId = normalizeAgentId(options.agentId ?? path.basename(path.dirname(path.dirname(resolved))));
	const env = options.env ?? { OPENCLAW_STATE_DIR: path.resolve(resolved, "../../../..") };
	if (!isIncognitoOpenClawAgentSqlitePath(resolved, {
		agentId,
		env
	})) throw new Error("Explicit incognito database target does not match its agent and state root");
	return {
		agentId,
		env,
		path: resolved
	};
}
const missingSuffixAliasCache = /* @__PURE__ */ new Map();
function shouldProbeUnicodeCaseVariants(left, right) {
	const hasNonAscii = (value) => value.split("").some((character) => character.charCodeAt(0) > 127);
	if (!hasNonAscii(left) && !hasNonAscii(right)) return false;
	const lowercaseEquivalent = left.toLowerCase() === right.toLowerCase();
	return left.toUpperCase() === right.toUpperCase() || lowercaseEquivalent && Array.from(left).length === Array.from(right).length;
}
function areMissingSuffixAliases(params) {
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
	if ("realPath" in leftIdentity) return "realPath" in rightIdentity && (leftIdentity.realPath === rightIdentity.realPath || leftIdentity.device === rightIdentity.device && leftIdentity.inode === rightIdentity.inode);
	return !("realPath" in rightIdentity) && leftIdentity.parentDevice === rightIdentity.parentDevice && leftIdentity.parentInode === rightIdentity.parentInode && areMissingSuffixAliases({
		left: leftIdentity.unresolvedSuffix,
		right: rightIdentity.unresolvedSuffix,
		parentDevice: leftIdentity.parentDevice,
		parentInode: leftIdentity.parentInode,
		parentRealPath: leftIdentity.parentRealPath
	});
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
	return Object.assign((left, right) => areSameAgentDatabasePathIdentities(resolveIdentity(left), resolveIdentity(right)), {
		createIndex() {
			const keys = /* @__PURE__ */ new Map();
			const groups = [];
			const fileGroups = /* @__PURE__ */ new Map();
			const realPathGroups = /* @__PURE__ */ new Map();
			const missingParentGroups = /* @__PURE__ */ new Map();
			return (pathname) => {
				const identity = resolveIdentity(pathname);
				const cached = keys.get(identity.lexicalPath);
				if (cached !== void 0) return cached;
				let group;
				if ("realPath" in identity) {
					const fileKey = `${identity.device}:${identity.inode}`;
					const fileGroup = fileGroups.get(fileKey);
					const realPathGroup = realPathGroups.get(identity.realPath);
					group = fileGroup === void 0 ? realPathGroup : realPathGroup === void 0 ? fileGroup : Math.min(fileGroup, realPathGroup);
					if (group === void 0) {
						group = groups.push(identity) - 1;
						fileGroups.set(fileKey, group);
						realPathGroups.set(identity.realPath, group);
					}
				} else {
					const parentKey = `${identity.parentDevice}:${identity.parentInode}`;
					const candidates = missingParentGroups.get(parentKey) ?? [];
					group = candidates.find((index) => areSameAgentDatabasePathIdentities(groups[index], identity));
					if (group === void 0) {
						group = groups.push(identity) - 1;
						candidates.push(group);
						missingParentGroups.set(parentKey, candidates);
					}
				}
				const key = groups[group].lexicalPath;
				keys.set(identity.lexicalPath, key);
				return key;
			};
		},
		isCurrent() {
			for (const previous of identities.values()) {
				const current = resolveAgentDatabasePathIdentity(previous.lexicalPath);
				if (!isDeepStrictEqual(previous, current)) return false;
			}
			return true;
		}
	});
}
/** Compare two database locators by canonical filesystem identity when available. */
function isSameOpenClawAgentDatabasePath(left, right) {
	return areSameAgentDatabasePathIdentities(resolveAgentDatabasePathIdentity(left), resolveAgentDatabasePathIdentity(right));
}
function canonicalPathForRegistryBoundary(pathname) {
	const identity = resolveAgentDatabasePathIdentity(pathname);
	if ("realPath" in identity) return identity.realPath;
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
export { isSameOpenClawAgentDatabasePath as a, resolveOpenClawAgentSqlitePath as c, isPersistentOpenClawAgentDatabasePath as i, createOpenClawAgentDatabasePathMatcher as n, resolveExplicitIncognitoAgentSqliteTarget as o, isIncognitoOpenClawAgentSqlitePath as r, resolveIncognitoOpenClawAgentSqlitePath as s, INCOGNITO_AGENT_SQLITE_BASENAME as t };
