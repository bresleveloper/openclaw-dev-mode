import { l as resolvePathPrefixSync, o as probePathSuffixAliasesSync } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-DJbkHzN8.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { i as resolveOpenClawRegisteredAgentDatabasePath, r as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { a as prepareAgentDeletionPathFence, t as assertAgentDeletionPathFence } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { r as invalidateRegisteredAgentDatabasesMemo } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { c as invalidateOpenClawAgentDatabaseValidationsForAgent, s as invalidateOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-BQ1Mko2o.mjs";
import { realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-db-registry.ts
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
		if (error.code !== "ENOENT") throw error;
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
	const sameMissingSuffix = leftIdentity.unresolvedSuffix === rightIdentity.unresolvedSuffix || sameMissingParent && parentDevice !== void 0 && parentInode !== void 0 && leftIdentity.parentRealPath !== void 0 && areMissingSuffixAliases({
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
function registerOpenClawAgentDatabase(params, onCommitted) {
	if (!isPersistentOpenClawAgentDatabasePath(params.path, params.env)) return;
	const deletionFence = prepareAgentDeletionPathFence({
		agentId: params.agentId,
		path: params.path
	}, { env: params.env });
	let sizeBytes = null;
	try {
		sizeBytes = statSync(params.path).size;
	} catch {
		sizeBytes = null;
	}
	const lastSeenAt = Date.now();
	runOpenClawStateWriteTransaction((database) => {
		assertAgentDeletionPathFence(database, deletionFence);
		const storedPath = resolveOpenClawAgentDatabaseStoredPath(database.path, params.path);
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("agent_databases").values({
			agent_id: params.agentId,
			path: storedPath,
			schema_version: params.schemaVersion ?? 23,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			schema_version: params.schemaVersion ?? 23,
			last_seen_at: lastSeenAt,
			size_bytes: sizeBytes
		})));
		invalidateRegisteredAgentDatabasesMemo({ env: params.env });
		if (onCommitted) {
			const receipt = Object.freeze({
				agentId: params.agentId,
				agentPath: params.path,
				stateDatabasePath: database.path,
				stateDatabaseIdentity: requireOpenClawStateDatabaseIdentity(database).key
			});
			if (!stageSqliteTransactionState(database.db, {
				stage() {},
				rollback() {},
				commit: () => onCommitted(receipt)
			})) throw new Error("Agent registration requires its canonical transaction publication scope");
		}
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}, { env: params.env });
	invalidateOpenClawAgentDatabaseValidation(params.path);
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
	if (lexicalCandidate === lexicalImportsDir || isPathInside(lexicalImportsDir, lexicalCandidate)) return false;
	const candidate = canonicalPathForRegistryBoundary(pathname);
	const stateDir = canonicalPathForRegistryBoundary(resolveStateDir(env));
	const importsDir = canonicalPathForRegistryBoundary(path.join(stateDir, "imports"));
	if (candidate === importsDir || isPathInside(importsDir, candidate)) return false;
	return true;
}
function unregisterOpenClawAgentDatabase(params) {
	runOpenClawStateWriteTransaction((database) => {
		const storedPath = resolveOpenClawAgentDatabaseStoredPath(database.path, params.path);
		const matchingPaths = [.../* @__PURE__ */ new Set([
			storedPath,
			params.path,
			path.resolve(params.path)
		])];
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("agent_databases").where("agent_id", "=", params.agentId).where("path", "in", matchingPaths));
		invalidateRegisteredAgentDatabasesMemo({ env: params.env });
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
	}, { env: params.env });
	invalidateOpenClawAgentDatabaseValidation(params.path);
}
/** Remove every durable database registration owned by a deleted agent. */
function unregisterOpenClawAgentDatabases(params) {
	const options = {
		env: params.env,
		...params.database ? {
			database: params.database,
			path: params.database.path
		} : {}
	};
	const removedPaths = runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const removed = executeSqliteQuerySync(database.db, db.deleteFrom("agent_databases").where("agent_id", "=", params.agentId).returning("path"));
		invalidateRegisteredAgentDatabasesMemo(options);
		sessionChanges.emit({
			all: true,
			scope: "stores"
		}, database.db);
		return removed.rows.map((row) => resolveOpenClawRegisteredAgentDatabasePath(database.path, row.path));
	}, options);
	invalidateOpenClawAgentDatabaseValidationsForAgent(params.agentId, removedPaths);
}
//#endregion
export { unregisterOpenClawAgentDatabase as a, registerOpenClawAgentDatabase as i, isPersistentOpenClawAgentDatabasePath as n, unregisterOpenClawAgentDatabases as o, isSameOpenClawAgentDatabasePath as r, createOpenClawAgentDatabasePathMatcher as t };
