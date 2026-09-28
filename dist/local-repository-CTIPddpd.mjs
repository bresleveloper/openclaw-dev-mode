import { t as containsAsciiControlCharacter } from "./string-normalization-_gRhJUDw.mjs";
import { d as sameFileIdentity, t as assertDirectoryIdentitySync$1 } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { a as canonicalPathFromExistingAncestor, c as isPathInside, o as ensureAbsoluteDirectory, w as root } from "./fs-safe-BAPek8At.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { t as applyPrivateModeSync } from "./private-mode-B6dWGRb2.mjs";
import { c as createPrivateSqliteTempDirectory, s as createPrivateSqliteDirectory } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-B1TtVu8E.mjs";
import { i as sameFileMutationFingerprint, t as copyFileHandle } from "./file-descriptor-C_0BsNDD.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { E as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import "./openclaw-state-db-BFK9cMiV.mjs";
import { c as sha256File, f as syncDirectoryIfSupported, i as pinDirectory, l as syncDirectory, n as getPublishFileExclusiveFailureDetails, o as publishFileNoClobber, s as requireDirectorySync, t as ensureDurableDirectory } from "./directory-durability-BKe2aOQN.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-CSUVJC6v.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-BskpG3v_.mjs";
import { n as buildEncodedPowerShellArgs, r as buildPowerShellFailureCause, t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import { t as embedSessionColdArchivesInSnapshot } from "./session-cold-storage-backup-BXvIimnw.mjs";
import { n as sanitizeOpenClawStateLeaseRows, t as sanitizeOpenClawGlobalStateSnapshot } from "./openclaw-state-snapshot-sanitizer-ClAnumPE.mjs";
import { n as publishVerifiedSqliteFile, t as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-BtH-P5bb.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/snapshot/snapshot-provider.ts
const SNAPSHOT_MANIFEST_FILENAME = "manifest.json";
const SNAPSHOT_SQLITE_FILENAME = "database.sqlite";
//#endregion
//#region src/snapshot/manifest.ts
const MAX_MANIFEST_BYTES = 1048576;
const MAX_SQLITE_USER_VERSION = 2147483647;
const MIN_SQLITE_USER_VERSION = -2147483648;
const SNAPSHOT_ID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,254}$/;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
async function hashSnapshotArtifact(snapshotDir) {
	const opened = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	try {
		return {
			...await hashFileHandle(opened.handle),
			stat: opened.stat
		};
	} finally {
		await opened.handle.close();
	}
}
async function copySnapshotArtifact(snapshotDir, targetPath) {
	const source = await (await root(snapshotDir)).open(SNAPSHOT_SQLITE_FILENAME, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	let target;
	let targetIdentity;
	try {
		target = await fs$1.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat();
		const digest = await hashFileHandle(source.handle, target);
		await target.sync();
		const finalIdentity = await target.stat();
		const currentIdentity = await fs$1.lstat(targetPath);
		if (!sameFileIdentity(targetIdentity, finalIdentity) || !sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`Snapshot restore staging file changed during copy: ${targetPath}`);
		return {
			...digest,
			stat: finalIdentity
		};
	} catch (error) {
		await target?.close().catch(() => void 0);
		target = void 0;
		if (targetIdentity) {
			const currentIdentity = await fs$1.lstat(targetPath).catch(() => void 0);
			if (currentIdentity && sameFileIdentity(targetIdentity, currentIdentity)) await fs$1.unlink(targetPath).catch(() => void 0);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
		await source.handle.close().catch(() => void 0);
	}
}
async function hashFileHandle(source, target) {
	const initialStat = await source.stat({ bigint: true });
	let sizeBytes = 0;
	if (target) sizeBytes = await copyFileHandle(source, target);
	const hashed = await sha256File(target ?? source);
	const finalStat = await source.stat({ bigint: true });
	if (!sameFileMutationFingerprint(initialStat, finalStat) || target && sizeBytes !== hashed.bytes) throw new Error("Snapshot artifact changed while being read.");
	return {
		sha256: hashed.digest,
		sizeBytes: hashed.bytes
	};
}
async function writeSnapshotManifest(snapshotDir, manifest) {
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const handle = await fs$1.open(manifestPath, "wx+", 384);
	try {
		await handle.writeFile(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function readSnapshotManifest(snapshotDir, expectedSnapshotId = path.basename(snapshotDir)) {
	const snapshotRoot = await root(snapshotDir);
	const manifestPath = path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME);
	const result = await snapshotRoot.read(SNAPSHOT_MANIFEST_FILENAME, {
		hardlinks: "reject",
		maxBytes: MAX_MANIFEST_BYTES,
		symlinks: "reject"
	});
	let parsed;
	try {
		parsed = JSON.parse(result.buffer.toString("utf8"));
	} catch (error) {
		throw new Error(`Snapshot manifest is not valid JSON: ${manifestPath}`, { cause: error });
	}
	return parseSnapshotManifest(parsed, manifestPath, expectedSnapshotId);
}
function parseSnapshotManifest(value, manifestPath, expectedSnapshotId) {
	const record = requireRecord(value, "manifest", manifestPath);
	requireExactKeys(record, [
		"schemaVersion",
		"snapshotId",
		"createdAt",
		"database",
		"artifact"
	]);
	if (record.schemaVersion !== 1) throw new Error(`Unsupported snapshot manifest schemaVersion ${String(record.schemaVersion)}: ${manifestPath}`);
	const snapshotId = requireSnapshotId(record.snapshotId, manifestPath);
	if (snapshotId !== expectedSnapshotId) throw new Error(`Snapshot manifest id ${snapshotId} does not match directory ${expectedSnapshotId}: ${manifestPath}`);
	const createdAt = requireCanonicalTimestamp(record.createdAt, manifestPath);
	const database = parseSnapshotDatabase(record.database, manifestPath);
	const artifactRecord = requireRecord(record.artifact, "artifact", manifestPath);
	requireExactKeys(artifactRecord, [
		"path",
		"sha256",
		"sizeBytes"
	]);
	if (artifactRecord.path !== "database.sqlite") throw new Error(`Snapshot manifest artifact.path must be ${SNAPSHOT_SQLITE_FILENAME}: ${manifestPath}`);
	if (typeof artifactRecord.sha256 !== "string" || !SHA256_PATTERN.test(artifactRecord.sha256)) throw new Error(`Snapshot manifest artifact.sha256 is invalid: ${manifestPath}`);
	if (!Number.isSafeInteger(artifactRecord.sizeBytes) || Number(artifactRecord.sizeBytes) <= 0) throw new Error(`Snapshot manifest artifact.sizeBytes is invalid: ${manifestPath}`);
	return {
		schemaVersion: 1,
		snapshotId,
		createdAt,
		database,
		artifact: {
			path: SNAPSHOT_SQLITE_FILENAME,
			sha256: artifactRecord.sha256,
			sizeBytes: Number(artifactRecord.sizeBytes)
		}
	};
}
function parseSnapshotDatabase(value, manifestPath) {
	const database = requireRecord(value, "database", manifestPath);
	const role = database.role;
	const basename = requireSafeText(database.basename, "database.basename", manifestPath, 255);
	if (path.basename(basename) !== basename || basename === "." || basename === "..") throw new Error(`Snapshot manifest database.basename is invalid: ${manifestPath}`);
	const userVersion = requireSqliteUserVersion(database.userVersion, manifestPath);
	if (role === "global") {
		requireExactKeys(database, [
			"role",
			"basename",
			"userVersion"
		]);
		return {
			role,
			basename,
			userVersion
		};
	}
	if (role === "agent") {
		requireExactKeys(database, [
			"role",
			"agentId",
			"basename",
			"userVersion"
		]);
		const agentId = requireSafeText(database.agentId, "database.agentId", manifestPath, 64);
		if (!isValidAgentId(agentId) || normalizeAgentId(agentId) !== agentId) throw new Error(`Snapshot manifest database.agentId is invalid: ${manifestPath}`);
		return {
			role,
			agentId,
			basename,
			userVersion
		};
	}
	if (role === "generic") {
		requireExactKeys(database, [
			"role",
			"id",
			"basename",
			"userVersion"
		]);
		return {
			role,
			id: requireSafeText(database.id, "database.id", manifestPath, 256),
			basename,
			userVersion
		};
	}
	throw new Error(`Snapshot manifest database.role is invalid: ${manifestPath}`);
}
function requireRecord(value, field, manifestPath) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`Snapshot manifest ${field} must be an object: ${manifestPath}`);
	return value;
}
function requireExactKeys(record, expectedKeys) {
	const actual = Object.keys(record).toSorted();
	const expected = [...expectedKeys].toSorted();
	if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) throw new Error(`Snapshot manifest fields must be exactly ${expectedKeys.join(", ")}; got ${actual.join(", ")}`);
}
function requireSnapshotId(value, manifestPath) {
	if (typeof value !== "string" || !SNAPSHOT_ID_PATTERN.test(value)) throw new Error(`Snapshot manifest snapshotId is invalid: ${manifestPath}`);
	return value;
}
function requireCanonicalTimestamp(value, manifestPath) {
	if (typeof value !== "string") throw new Error(`Snapshot manifest createdAt is invalid: ${manifestPath}`);
	const parsed = new Date(value);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== value) throw new Error(`Snapshot manifest createdAt is not canonical ISO 8601: ${manifestPath}`);
	return value;
}
function requireSafeText(value, field, manifestPath, maxLength) {
	if (typeof value !== "string" || value.length === 0 || value.length > maxLength || value.trim() !== value || containsAsciiControlCharacter(value)) throw new Error(`Snapshot manifest ${field} is invalid: ${manifestPath}`);
	return value;
}
function requireSqliteUserVersion(value, manifestPath) {
	if (!Number.isSafeInteger(value) || Number(value) < MIN_SQLITE_USER_VERSION || Number(value) > MAX_SQLITE_USER_VERSION) throw new Error(`Snapshot manifest database.userVersion is invalid: ${manifestPath}`);
	return Number(value);
}
//#endregion
//#region src/snapshot/openclaw-snapshot-copy.ts
function normalizeSnapshotIdentity(identity) {
	if (identity.role === "global") return identity;
	if (identity.role === "agent") {
		const agentId = normalizeAgentId(identity.agentId);
		if (!isValidAgentId(identity.agentId) || agentId !== identity.agentId) throw new Error(`SQLite snapshot agent id must be canonical: ${identity.agentId}`);
		return {
			role: "agent",
			agentId
		};
	}
	const id = identity.id.trim();
	if (!id || id !== identity.id || id.length > 256 || containsAsciiControlCharacter(id)) throw new Error("SQLite snapshot generic database id is invalid.");
	return {
		role: "generic",
		id
	};
}
function buildSnapshotValidator(identity) {
	if (identity.role === "global") return (database, pathname) => assertOpenClawStateDatabaseForMaintenance(database, { pathname });
	if (identity.role === "agent") return (database, pathname) => assertOpenClawAgentDatabaseForMaintenance(database, {
		agentId: identity.agentId,
		pathname
	});
	return () => void 0;
}
/** Produce the canonical sanitized, compact, verified copy used by every snapshot provider. */
async function createOpenClawSnapshotCopy(params) {
	assertNotUpdateCapturePath(params.database.path, resolveStateDir());
	const identity = normalizeSnapshotIdentity(params.database.identity);
	return {
		identity,
		...await createVerifiedSqliteSnapshot({
			sourcePath: params.database.path,
			targetPath: params.targetPath,
			requireNonEmptySource: identity.role !== "generic",
			transform: async (database) => {
				if (identity.role === "global") sanitizeOpenClawGlobalStateSnapshot(database);
				else if (identity.role === "agent") sanitizeOpenClawStateLeaseRows(database);
				await embedSessionColdArchivesInSnapshot({
					database,
					sourceStorePath: params.database.path
				});
			},
			validate: buildSnapshotValidator(identity)
		})
	};
}
//#endregion
//#region src/snapshot/local-repository-directory-policy.ts
const MACOS_REPLACEMENT_ACL_PERMISSIONS = /* @__PURE__ */ new Set([
	"add_file",
	"add_subdirectory",
	"chown",
	"delete",
	"delete_child",
	"writesecurity"
]);
const WINDOWS_STAGING_ACCESS_RIGHTS = /* @__PURE__ */ new Set([
	"F",
	"M",
	"RX",
	"R",
	"W",
	"D",
	"DE",
	"RC",
	"WDAC",
	"WO",
	"AS",
	"MA",
	"GR",
	"GW",
	"GE",
	"GA",
	"RD",
	"WD",
	"AD",
	"REA",
	"WEA",
	"X",
	"DC",
	"RA",
	"WA",
	"UNKNOWN"
]);
const WINDOWS_STAGING_REPLACEMENT_RIGHTS = /* @__PURE__ */ new Set([
	"F",
	"M",
	"D",
	"DE",
	"WDAC",
	"WO",
	"MA",
	"GA",
	"DC",
	"UNKNOWN"
]);
const WINDOWS_TRUSTED_OWNER_SIDS = /* @__PURE__ */ new Set([
	"S-1-5-18",
	"S-1-5-32-544",
	"S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464"
]);
const WINDOWS_TRUSTED_ACCESS_SIDS = /* @__PURE__ */ new Set([...WINDOWS_TRUSTED_OWNER_SIDS, "S-1-3-0"]);
const WINDOWS_ACL_METADATA_MAX_BUFFER = 16777216;
const WINDOWS_SID_SCHEMA = string().regex(/^S-\d+-\d+(?:-\d+)+$/iu).transform((value) => value.toUpperCase());
const WINDOWS_PRINCIPAL_SCHEMA = string().min(1).transform((value) => value.toUpperCase());
const WINDOWS_ACCESS_ENTRY_SCHEMA = object({
	principal: WINDOWS_PRINCIPAL_SCHEMA,
	accessType: _enum(["Allow", "Deny"]),
	rightsMask: number().int().nonnegative().max(4294967295),
	inheritanceFlags: string(),
	propagationFlags: string()
}).strict();
const WINDOWS_PATH_SECURITY_SCHEMA = object({
	currentUserSid: WINDOWS_SID_SCHEMA,
	paths: array(object({
		path: string().min(1),
		ownerSid: WINDOWS_SID_SCHEMA,
		entries: array(WINDOWS_ACCESS_ENTRY_SCHEMA).min(1)
	}).strict()).min(1)
}).strict();
const WINDOWS_FILE_RIGHTS = [
	[1, "RD"],
	[2, "WD"],
	[4, "AD"],
	[8, "REA"],
	[16, "WEA"],
	[32, "X"],
	[64, "DC"],
	[128, "RA"],
	[256, "WA"],
	[65536, "D"],
	[131072, "RC"],
	[262144, "WDAC"],
	[524288, "WO"],
	[1048576, "S"],
	[33554432, "MA"],
	[268435456, "GA"],
	[536870912, "GE"],
	[1073741824, "GW"],
	[2147483648, "GR"]
];
const WINDOWS_KNOWN_FILE_RIGHTS_MASK = WINDOWS_FILE_RIGHTS.reduce((mask, [right]) => mask | right, 0);
const WINDOWS_READ_RIGHTS_MASK = -1342046039;
const WINDOWS_WRITE_RIGHTS_MASK = 1343029590;
let macosTrustedAclPrincipalsPromise;
function assertDirectory(stat, pathname, label) {
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`${label} must be a real directory: ${pathname}`);
}
async function assertDirectoryIdentity(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath, { bigint: typeof expectedIdentity.dev === "bigint" });
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
function assertDirectoryIdentitySync(directoryPath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(directoryPath);
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
async function assertTrustedStagingRoot(expectedIdentity, rootPath, options = {}) {
	const resolvedRootPath = path.resolve(rootPath);
	const trustedRootPath = await fs$1.realpath(resolvedRootPath);
	const rootIdentity = await fs$1.lstat(trustedRootPath, { bigint: typeof expectedIdentity.dev === "bigint" });
	assertDirectory(rootIdentity, trustedRootPath, "Private SQLite staging root");
	if (!sameFileIdentity(rootIdentity, expectedIdentity)) throw new Error(`Private SQLite staging root changed during operation: ${resolvedRootPath}`);
	if (process.platform === "win32") {
		await assertTrustedWindowsStagingPath(trustedRootPath);
		return trustedRootPath;
	}
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	const unsafeMode = (Number(rootIdentity.mode) & 18) !== 0;
	if (uid === void 0 || Number(rootIdentity.uid) !== uid || unsafeMode && options.allowModeRepair !== true) throw new Error(`Private SQLite staging root must be owned by the current user and not writable by other users: ${resolvedRootPath}`);
	if (process.platform === "darwin") await assertTrustedMacosAcl(trustedRootPath, options.allowModeRepair !== true);
	await assertTrustedPosixStagingAncestors(trustedRootPath, rootIdentity, uid);
	return trustedRootPath;
}
async function assertPrivateStagingDirectory(expectedIdentity, directoryPath) {
	const currentIdentity = await fs$1.lstat(directoryPath);
	assertDirectory(currentIdentity, directoryPath, "Private SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`Private SQLite staging directory changed during operation: ${directoryPath}`);
	if (process.platform === "win32") return;
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid === void 0 || currentIdentity.uid !== uid || (currentIdentity.mode & 63) !== 0) throw new Error(`Private SQLite staging directory permissions are unsafe: ${directoryPath}`);
	if (process.platform === "darwin") await assertTrustedMacosAcl(directoryPath, true);
}
async function assertTrustedPosixStagingAncestors(rootPath, rootIdentity, uid) {
	let childIdentity = rootIdentity;
	let currentPath = path.dirname(rootPath);
	while (currentPath !== rootPath) {
		const currentIdentity = await fs$1.lstat(currentPath);
		assertDirectory(currentIdentity, currentPath, "SQLite staging ancestor");
		const writableByOtherUsers = (currentIdentity.mode & 18) !== 0;
		const ownerCanReplaceChild = currentIdentity.uid !== uid && currentIdentity.uid !== 0;
		const stickyOwnerIsTrusted = currentIdentity.uid === uid || currentIdentity.uid === 0;
		const stickyProtectsChild = (currentIdentity.mode & 512) !== 0 && stickyOwnerIsTrusted && Number(childIdentity.uid) === uid;
		if (ownerCanReplaceChild || writableByOtherUsers && !stickyProtectsChild) throw new Error(`SQLite staging ancestor must not allow another user to replace its child: ${currentPath}`);
		if (process.platform === "darwin") await assertTrustedMacosAcl(currentPath, false);
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) return;
		childIdentity = currentIdentity;
		currentPath = parentPath;
	}
}
function parseMacosAclEntries(output, pathname) {
	const lines = output.split(/\r?\n/u);
	const header = lines.shift();
	if (!header) throw new Error(`Unable to inspect macOS ACL for SQLite staging: ${pathname}`);
	const entries = [];
	for (const line of lines) {
		if (!/^\s*\d+:\s/u.test(line)) continue;
		const match = line.match(/^\s*\d+:\s+(.+?)\s+(?:inherited\s+)?(allow|deny)\s+([a-z_,]+)\s*$/u);
		if (!match) throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
		const [, principal, effect, permissions] = match;
		if (!principal || !permissions || effect !== "allow" && effect !== "deny") throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
		entries.push({
			principal: normalizeAclPrincipal(principal),
			effect,
			permissions: new Set(permissions.split(","))
		});
	}
	if (/^[^\s]{10}\+/u.test(header) && entries.length === 0) throw new Error(`Unable to parse macOS ACL for SQLite staging: ${pathname}`);
	return entries;
}
function normalizeAclPrincipal(principal) {
	return principal.trim().toLowerCase();
}
async function resolveTrustedMacosAclPrincipals() {
	macosTrustedAclPrincipalsPromise ??= (async () => {
		const dsmemberutil = resolveSystemBin("dsmemberutil");
		if (!dsmemberutil) throw new Error("Unable to resolve dsmemberutil for macOS ACL verification.");
		const currentUsername = os.userInfo().username;
		const usernames = /* @__PURE__ */ new Set([currentUsername, "root"]);
		const trusted = /* @__PURE__ */ new Set();
		for (const username of usernames) {
			const { stdout } = await runExec(dsmemberutil, [
				"getuuid",
				"-U",
				username
			], {
				timeoutMs: 5e3,
				maxBuffer: 65536
			});
			const uuid = stdout.trim();
			if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/iu.test(uuid)) throw new Error(`Unable to resolve trusted macOS ACL principal for ${username}.`);
			trusted.add(normalizeAclPrincipal(uuid));
			trusted.add(normalizeAclPrincipal(username));
			trusted.add(normalizeAclPrincipal(`user:${username}`));
		}
		return trusted;
	})();
	return await macosTrustedAclPrincipalsPromise;
}
async function assertTrustedMacosAcl(pathname, requirePrivate) {
	const ls = resolveSystemBin("ls");
	if (!ls) throw new Error(`Unable to verify macOS ACL for SQLite staging: ${pathname}`);
	let entries;
	try {
		const [result, trustedPrincipals] = await Promise.all([runExec(ls, [
			"-lden",
			"--",
			pathname
		], {
			timeoutMs: 5e3,
			maxBuffer: 1048576
		}), resolveTrustedMacosAclPrincipals()]);
		entries = parseMacosAclEntries(result.stdout, pathname).filter((entry) => !trustedPrincipals.has(entry.principal));
	} catch (error) {
		throw new Error(`Unable to verify macOS ACL for SQLite staging: ${pathname}`, { cause: error });
	}
	if (entries.find((entry) => entry.effect === "allow" && (requirePrivate || [...entry.permissions].some((permission) => MACOS_REPLACEMENT_ACL_PERMISSIONS.has(permission))))) throw new Error(`macOS ACL permits untrusted SQLite staging access: ${pathname}`);
}
async function assertTrustedWindowsStagingPath(rootPath) {
	const paths = [rootPath];
	let currentPath = path.dirname(rootPath);
	while (currentPath !== rootPath) {
		paths.push(currentPath);
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) break;
		currentPath = parentPath;
	}
	let security;
	try {
		security = await inspectWindowsPathSecurity(paths);
	} catch (error) {
		throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${rootPath}`, { cause: error });
	}
	if (security.paths.length !== paths.length) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${rootPath}`);
	for (const [index, pathname] of paths.entries()) {
		const pathSecurity = security.paths[index];
		if (!pathSecurity || path.resolve(pathSecurity.path) !== path.resolve(pathname)) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
		assertTrustedWindowsAcl(pathname, index === 0, security.currentUserSid, pathSecurity);
	}
}
function assertTrustedWindowsAcl(pathname, requirePrivate, currentUserSid, security) {
	const pathRole = requirePrivate ? "repository root" : "ancestor";
	if (security.ownerSid !== currentUserSid && !WINDOWS_TRUSTED_OWNER_SIDS.has(security.ownerSid)) throw new Error(`Windows SQLite staging ${pathRole} is owned by an untrusted principal: path=${pathname} principal=${security.ownerSid}. Choose a local directory owned only by the current user or a trusted OS principal.`);
	const allowedEntries = security.entries.filter((entry) => entry.accessType === "Allow");
	if (allowedEntries.length === 0) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
	const unsafeEntry = allowedEntries.filter((entry) => entry.principal !== currentUserSid && !WINDOWS_TRUSTED_ACCESS_SIDS.has(entry.principal)).map(windowsSecurityEntryToAclEntry).find((entry) => windowsAclEntryPermitsUnsafeStagingAccess(entry, requirePrivate));
	if (unsafeEntry) throw new Error(`Windows ACL permits untrusted SQLite staging access on ${pathRole}: path=${pathname} principal=${unsafeEntry.principal} rights=${unsafeEntry.rawRights}. Remove the untrusted grant or choose a private local directory; do not use a shared or synced root.`);
}
function windowsSecurityEntryToAclEntry(entry) {
	const rights = WINDOWS_FILE_RIGHTS.filter(([right]) => (entry.rightsMask & right) !== 0).map(([, name]) => name);
	if ((entry.rightsMask & ~WINDOWS_KNOWN_FILE_RIGHTS_MASK) !== 0) rights.push("UNKNOWN");
	const inheritanceFlags = new Set(entry.inheritanceFlags.split(",").map((flag) => flag.trim()));
	const propagationFlags = new Set(entry.propagationFlags.split(",").map((flag) => flag.trim()));
	const rawFlags = [
		inheritanceFlags.has("ObjectInherit") ? "(OI)" : "",
		inheritanceFlags.has("ContainerInherit") ? "(CI)" : "",
		propagationFlags.has("NoPropagateInherit") ? "(NP)" : "",
		propagationFlags.has("InheritOnly") ? "(IO)" : ""
	].join("");
	return {
		principal: entry.principal,
		rights,
		rawRights: `${rawFlags}(${rights.join(",")})`,
		canRead: (entry.rightsMask & WINDOWS_READ_RIGHTS_MASK) !== 0,
		canWrite: (entry.rightsMask & WINDOWS_WRITE_RIGHTS_MASK) !== 0
	};
}
function windowsAclEntryPermitsUnsafeStagingAccess(entry, requirePrivate) {
	if (!requirePrivate && /\(IO\)/iu.test(entry.rawRights)) return false;
	const rights = entry.rights.map((right) => right.toUpperCase());
	const unsafeRights = requirePrivate ? WINDOWS_STAGING_ACCESS_RIGHTS : WINDOWS_STAGING_REPLACEMENT_RIGHTS;
	return requirePrivate && (entry.canWrite || entry.canRead) || rights.some((right) => unsafeRights.has(right));
}
async function inspectWindowsPathSecurity(pathnames) {
	const stdout = await runEncodedWindowsPowerShell([
		"$ErrorActionPreference = 'Stop'",
		`$paths = ConvertFrom-Json ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(JSON.stringify(pathnames), "utf8").toString("base64")}')))`,
		"$pathSecurity = @($paths | ForEach-Object { $path = [string]$_; $acl = Get-Acl -LiteralPath $path; $entries = @($acl.Access | ForEach-Object { $identity = $_.IdentityReference; try { $principal = $identity.Translate([System.Security.Principal.SecurityIdentifier]).Value } catch { $principal = [string]$identity.Value }; $rightsMask = ([int64][int32]$_.FileSystemRights) -band 0xffffffffL; [pscustomobject]@{ principal = $principal; accessType = [string]$_.AccessControlType; rightsMask = $rightsMask; inheritanceFlags = [string]$_.InheritanceFlags; propagationFlags = [string]$_.PropagationFlags } }); [pscustomobject]@{ path = $path; ownerSid = $acl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value; entries = $entries } })",
		"$payload = [pscustomobject]@{ currentUserSid = [System.Security.Principal.WindowsIdentity]::GetCurrent().User.Value; paths = $pathSecurity }",
		"$json = ConvertTo-Json -InputObject $payload -Compress -Depth 4",
		"[Console]::Out.Write([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($json)))"
	].join("; "), WINDOWS_ACL_METADATA_MAX_BUFFER);
	let parsed;
	try {
		parsed = JSON.parse(Buffer.from(stdout.trim(), "base64").toString("utf8"));
	} catch (error) {
		throw new Error("Unable to parse Windows ACL metadata.", { cause: error });
	}
	const result = WINDOWS_PATH_SECURITY_SCHEMA.safeParse(parsed);
	if (!result.success) throw new Error("Invalid Windows ACL metadata.", { cause: result.error });
	return result.data;
}
async function runEncodedWindowsPowerShell(command, maxBuffer) {
	const powershell = resolveSystemBin("powershell");
	if (!powershell) throw new Error("Unable to resolve PowerShell for Windows SQLite path security.");
	try {
		const { stdout } = await runExec(powershell, buildEncodedPowerShellArgs(command), {
			env: { PSModulePath: path.win32.join(path.win32.dirname(powershell), "Modules") },
			timeoutMs: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS,
			maxBuffer
		});
		return stdout;
	} catch (error) {
		throw buildPowerShellFailureCause(error);
	}
}
//#endregion
//#region src/snapshot/local-repository.ts
const SNAPSHOT_DIRECTORY_MODE = 448;
const SNAPSHOT_FILE_MODE = 384;
const SNAPSHOT_PENDING_FILENAME = ".pending";
const SQLITE_SIDECAR_SUFFIXES = [
	"-wal",
	"-shm",
	"-journal"
];
const SNAPSHOT_ARTIFACT_ENTRIES = /* @__PURE__ */ new Set([
	SNAPSHOT_MANIFEST_FILENAME,
	SNAPSHOT_PENDING_FILENAME,
	SNAPSHOT_SQLITE_FILENAME
]);
const RESTORE_STAGING_ENTRIES = /* @__PURE__ */ new Set([SNAPSHOT_SQLITE_FILENAME]);
const VALIDATION_STAGING_ENTRIES = /* @__PURE__ */ new Set([SNAPSHOT_SQLITE_FILENAME, ...SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${SNAPSHOT_SQLITE_FILENAME}${suffix}`)]);
function createLocalSqliteSnapshotProvider(options) {
	return new LocalSqliteSnapshotProvider(options);
}
var LocalSqliteSnapshotProvider = class {
	#allowedDatabaseRoles;
	#repositoryPath;
	#validationRootPath;
	#now;
	constructor(options) {
		this.#allowedDatabaseRoles = options.allowedDatabaseRoles;
		this.#repositoryPath = path.resolve(options.repositoryPath);
		this.#validationRootPath = path.resolve(options.validationRootPath ?? path.dirname(this.#repositoryPath));
		this.#now = options.now ?? (() => /* @__PURE__ */ new Date());
	}
	async create(database) {
		const repositoryReceipt = await ensurePrivateDirectory(this.#repositoryPath, "SQLite snapshot repository");
		const repositoryIdentity = repositoryReceipt.identity;
		const trustedRepositoryPath = await assertTrustedStagingRoot(repositoryIdentity, this.#repositoryPath);
		const sourcePath = path.resolve(database.path);
		const identity = normalizeSnapshotIdentity(database.identity);
		const now = this.#now();
		if (!Number.isFinite(now.getTime())) throw new Error("SQLite snapshot timestamp is invalid.");
		const snapshotId = buildSnapshotId(now);
		const snapshotRefPath = path.join(this.#repositoryPath, snapshotId);
		const snapshotDir = path.join(trustedRepositoryPath, snapshotId);
		const stagingDir = path.join(trustedRepositoryPath, `.tmp-${randomUUID()}`);
		const artifactPath = path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME);
		await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
		await createPrivateSqliteDirectory(stagingDir);
		let stagingIdentity;
		let publishedDirectory;
		let publishedIdentity;
		const publishedEntries = /* @__PURE__ */ new Map();
		let snapshotDirectoryCreated = false;
		try {
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			stagingIdentity = await fs$1.lstat(stagingDir);
			applyPrivateModeSync(stagingDir, SNAPSHOT_DIRECTORY_MODE);
			await assertPrivateStagingDirectory(stagingIdentity, stagingDir);
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			const result = await createOpenClawSnapshotCopy({
				database: {
					path: sourcePath,
					identity
				},
				targetPath: artifactPath
			});
			applyPrivateModeSync(artifactPath, SNAPSHOT_FILE_MODE);
			const artifact = await hashSnapshotArtifact(stagingDir);
			const manifest = {
				schemaVersion: 1,
				snapshotId,
				createdAt: now.toISOString(),
				database: buildDatabaseManifest(identity, sourcePath, result.userVersion),
				artifact: {
					path: SNAPSHOT_SQLITE_FILENAME,
					sha256: artifact.sha256,
					sizeBytes: artifact.sizeBytes
				}
			};
			await writeSnapshotManifest(stagingDir, manifest);
			applyPrivateModeSync(path.join(stagingDir, SNAPSHOT_MANIFEST_FILENAME), SNAPSHOT_FILE_MODE);
			await readSnapshotManifest(stagingDir, snapshotId);
			await syncDirectoryIfSupported(stagingDir);
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			try {
				await createPrivateSqliteDirectory(snapshotDir);
				snapshotDirectoryCreated = true;
			} catch (error) {
				if (error.code === "EEXIST") throw new Error(`SQLite snapshot directory already exists: ${snapshotDir}`, { cause: error });
				throw error;
			}
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			publishedDirectory = await pinDirectory(snapshotDir, { label: "SQLite snapshot directory" });
			publishedIdentity = publishedDirectory.receipt.identity;
			applyPrivateModeSync(snapshotDir, SNAPSHOT_DIRECTORY_MODE);
			await assertPrivateStagingDirectory(publishedIdentity, snapshotDir);
			await publishedDirectory.assertCurrent();
			const pendingPath = path.join(snapshotDir, SNAPSHOT_PENDING_FILENAME);
			const pendingHandle = await fs$1.open(pendingPath, "wx+", SNAPSHOT_FILE_MODE);
			let pendingIdentity;
			try {
				pendingIdentity = await pendingHandle.stat();
				publishedEntries.set(SNAPSHOT_PENDING_FILENAME, pendingIdentity);
				await pendingHandle.sync();
			} finally {
				await pendingHandle.close();
			}
			await publishedDirectory.assertCurrent();
			requireDirectorySync(await publishedDirectory.sync(), "SQLite snapshot directory");
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			requireDirectorySync(await syncDirectory(repositoryReceipt), "SQLite snapshot repository");
			await publishedDirectory.assertCurrent();
			await publishSnapshotEntryNoOverwrite(path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME), path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME), SNAPSHOT_SQLITE_FILENAME, publishedEntries);
			await publishedDirectory.assertCurrent();
			await publishSnapshotEntryNoOverwrite(path.join(stagingDir, SNAPSHOT_MANIFEST_FILENAME), path.join(snapshotDir, SNAPSHOT_MANIFEST_FILENAME), SNAPSHOT_MANIFEST_FILENAME, publishedEntries);
			await publishedDirectory.assertCurrent();
			requireDirectorySync(await publishedDirectory.sync(), "SQLite snapshot directory");
			await commitPendingSnapshot({
				allowedDatabaseRoles: void 0,
				repositoryIdentity,
				repositoryPath: trustedRepositoryPath,
				snapshotPath: snapshotDir,
				snapshotDirectory: publishedDirectory,
				validationRootPath: trustedRepositoryPath,
				expected: {
					manifest,
					pendingIdentity
				}
			});
			publishedEntries.delete(SNAPSHOT_PENDING_FILENAME);
			await publishedDirectory.close();
			publishedDirectory = void 0;
			return {
				ref: { path: snapshotRefPath },
				manifest
			};
		} catch (error) {
			await publishedDirectory?.close().catch(() => void 0);
			publishedDirectory = void 0;
			if (snapshotDirectoryCreated) publishedIdentity ??= await fs$1.lstat(snapshotDir).catch(() => void 0);
			if (publishedIdentity) {
				if (await removePublishedSnapshotDirectoryIfOwned(snapshotDir, publishedIdentity, publishedEntries)) await syncDirectoryIfSupported(trustedRepositoryPath);
			}
			throw error;
		} finally {
			if (stagingIdentity ? await removePrivateDirectoryIfOwned(stagingDir, stagingIdentity, SNAPSHOT_ARTIFACT_ENTRIES).catch(() => false) : await fs$1.rmdir(stagingDir).then(() => true).catch(() => false)) await syncDirectoryIfSupported(trustedRepositoryPath).catch(() => void 0);
		}
	}
	async verify(snapshot) {
		const snapshotDir = await this.#resolveSnapshotDirectory(snapshot);
		const manifest = await readVerifiedSnapshotManifest(snapshotDir);
		assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
		const artifact = await hashSnapshotArtifact(snapshotDir);
		const artifactPath = path.join(snapshotDir, SNAPSHOT_SQLITE_FILENAME);
		assertArtifactMatchesManifest(artifactPath, artifact, manifest);
		await verifySnapshotDatabaseFile(artifactPath, artifact.stat, manifest, this.#validationRootPath);
		await assertSnapshotContents(snapshotDir);
		return {
			ok: true,
			manifest
		};
	}
	async restoreFresh(snapshot, targetPath) {
		const snapshotDir = await this.#resolveSnapshotDirectory(snapshot);
		const manifest = await readVerifiedSnapshotManifest(snapshotDir);
		assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
		const resolvedTargetPath = path.resolve(targetPath);
		await assertFreshRestorePathsAbsent(resolvedTargetPath);
		const canonicalRepositoryPath = await fs$1.realpath(this.#repositoryPath);
		const canonicalRestoreParentPath = await canonicalPathFromExistingAncestor(path.dirname(resolvedTargetPath));
		const canonicalTargetPath = path.join(canonicalRestoreParentPath, path.basename(resolvedTargetPath));
		if (isPathInside(canonicalRepositoryPath, canonicalTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentPath = path.dirname(canonicalTargetPath);
		const restoreParentReceipt = await ensureRestoreParentDirectory(restoreParentPath);
		const trustedRestoreParentPath = await fs$1.realpath(restoreParentPath);
		const trustedTargetPath = path.join(trustedRestoreParentPath, path.basename(resolvedTargetPath));
		if (!isPathInside(canonicalTargetPath, trustedTargetPath) || !isPathInside(trustedTargetPath, canonicalTargetPath)) throw new Error(`SQLite restore target changed while creating its parent: ${resolvedTargetPath}`);
		if (isPathInside(canonicalRepositoryPath, trustedTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentIdentity = await fs$1.lstat(trustedRestoreParentPath);
		if (!sameFileIdentity(restoreParentReceipt.identity, restoreParentIdentity)) throw new Error(`SQLite restore parent changed after durable creation: ${trustedRestoreParentPath}`);
		await assertFreshRestorePathsAbsent(trustedTargetPath);
		return await withPrivateSqliteStagingDirectory({
			rootReceipt: restoreParentReceipt,
			prefix: ".tmp-restore-",
			allowedEntries: RESTORE_STAGING_ENTRIES,
			operation: async (stagingDir, stagingIdentity) => {
				const stagedSourcePath = path.join(stagingDir, SNAPSHOT_SQLITE_FILENAME);
				const stagedArtifact = await copySnapshotArtifact(snapshotDir, stagedSourcePath);
				await assertDirectoryIdentity(stagingDir, stagingIdentity);
				assertArtifactMatchesManifest(stagedSourcePath, stagedArtifact, manifest);
				await assertSnapshotContents(snapshotDir);
				await verifySnapshotDatabaseFile(stagedSourcePath, stagedArtifact.stat, manifest, trustedRestoreParentPath);
				await publishVerifiedSqliteFile({
					sourceIdentity: stagedArtifact.stat,
					sourcePath: stagedSourcePath,
					targetPath: trustedTargetPath,
					expectedContent: manifest.artifact,
					requireAtomicPublication: true,
					beforePublish: async () => {
						await assertDirectoryIdentity(trustedRestoreParentPath, restoreParentIdentity);
						await assertFreshRestorePathsAbsent(trustedTargetPath);
					},
					afterPublish: (guard) => {
						guard.assertTargetMatchesExpectedContent(() => {
							assertDirectoryIdentitySync(trustedRestoreParentPath, restoreParentIdentity);
							assertNoSqliteSidecarsSync(trustedTargetPath);
						});
					}
				});
				return {
					ok: true,
					manifest
				};
			}
		});
	}
	async list() {
		const repositoryStat = await lstatIfExists(this.#repositoryPath);
		if (!repositoryStat) return [];
		assertDirectory(repositoryStat, this.#repositoryPath, "SQLite snapshot repository");
		const entries = await fs$1.readdir(this.#repositoryPath, { withFileTypes: true });
		const snapshots = [];
		for (const entry of entries) {
			if (entry.name.startsWith(".tmp-")) {
				if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unsafe staging entry: ${path.join(this.#repositoryPath, entry.name)}`);
				continue;
			}
			if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unexpected entry: ${path.join(this.#repositoryPath, entry.name)}`);
			const snapshotPath = path.join(this.#repositoryPath, entry.name);
			const snapshotState = await classifySnapshotDirectory(snapshotPath);
			if (snapshotState === "incomplete") continue;
			const manifest = snapshotState === "complete-pending" ? await recoverCompletePendingSnapshot({
				allowedDatabaseRoles: this.#allowedDatabaseRoles,
				repositoryIdentity: repositoryStat,
				repositoryPath: this.#repositoryPath,
				snapshotPath,
				validationRootPath: this.#validationRootPath
			}) : await readVerifiedSnapshotManifest(snapshotPath);
			assertAllowedDatabaseRole(manifest, this.#allowedDatabaseRoles);
			snapshots.push({
				ref: { path: snapshotPath },
				manifest
			});
		}
		return snapshots.toSorted((left, right) => right.manifest.createdAt.localeCompare(left.manifest.createdAt) || right.manifest.snapshotId.localeCompare(left.manifest.snapshotId));
	}
	async #resolveSnapshotDirectory(snapshot) {
		const snapshotDir = path.resolve(snapshot.path);
		if (path.dirname(snapshotDir) !== this.#repositoryPath) throw new Error(`SQLite snapshot must be an immediate child of repository ${this.#repositoryPath}: ${snapshotDir}`);
		const repositoryStat = await lstatIfExists(this.#repositoryPath);
		if (!repositoryStat) throw new Error(`SQLite snapshot repository does not exist: ${this.#repositoryPath}. Check the snapshot path or create a snapshot with \`openclaw backup sqlite create\`.`);
		assertDirectory(repositoryStat, this.#repositoryPath, "SQLite snapshot repository");
		const snapshotStat = await lstatIfExists(snapshotDir);
		if (!snapshotStat) throw new Error(`SQLite snapshot does not exist: ${snapshotDir}. Run \`openclaw backup sqlite list --repository ${this.#repositoryPath}\` to inspect available snapshots.`);
		assertDirectory(snapshotStat, snapshotDir, "SQLite snapshot");
		if (await lstatIfExists(path.join(snapshotDir, SNAPSHOT_PENDING_FILENAME))) {
			if (await classifySnapshotDirectory(snapshotDir) === "complete-pending") await recoverCompletePendingSnapshot({
				allowedDatabaseRoles: this.#allowedDatabaseRoles,
				repositoryIdentity: repositoryStat,
				repositoryPath: this.#repositoryPath,
				snapshotPath: snapshotDir,
				validationRootPath: this.#validationRootPath
			});
		}
		return snapshotDir;
	}
};
async function readVerifiedSnapshotManifest(snapshotDir) {
	await assertSnapshotContents(snapshotDir);
	return await readSnapshotManifest(snapshotDir);
}
function assertArtifactMatchesManifest(artifactPath, artifact, manifest) {
	if (artifact.sizeBytes !== manifest.artifact.sizeBytes) throw new Error(`Snapshot artifact size mismatch for ${artifactPath}: expected ${manifest.artifact.sizeBytes}, got ${artifact.sizeBytes}`);
	if (artifact.sha256 !== manifest.artifact.sha256) throw new Error(`Snapshot artifact hash mismatch for ${artifactPath}: expected ${manifest.artifact.sha256}, got ${artifact.sha256}`);
}
function assertAllowedDatabaseRole(manifest, allowedRoles) {
	if (!allowedRoles || allowedRoles.includes(manifest.database.role)) return;
	throw new Error(`SQLite snapshot database role ${manifest.database.role} is not allowed for this operation.`);
}
async function verifySnapshotDatabaseFile(artifactPath, expectedIdentity, manifest, validationRootPath) {
	const beforeOpen = await fs$1.lstat(artifactPath);
	if (beforeOpen.isSymbolicLink() || !beforeOpen.isFile() || beforeOpen.nlink > 1 || !sameFileIdentity(expectedIdentity, beforeOpen)) throw new Error(`Snapshot artifact changed before SQLite verification: ${artifactPath}`);
	const validationRootIdentity = await lstatIfExists(validationRootPath, { bigint: true });
	if (!validationRootIdentity) throw new Error(`SQLite validation root does not exist: ${validationRootPath}. Create a private directory there or pass an existing directory with \`--scratch\`.`);
	assertDirectory(validationRootIdentity, validationRootPath, "SQLite validation root");
	const canonicalValidationRootPath = await fs$1.realpath(validationRootPath);
	await withPrivateSqliteStagingDirectory({
		rootReceipt: {
			path: canonicalValidationRootPath,
			realPath: canonicalValidationRootPath,
			identity: validationRootIdentity
		},
		prefix: ".tmp-verify-",
		allowedEntries: VALIDATION_STAGING_ENTRIES,
		operation: async (validationDir) => {
			const validationPath = path.join(validationDir, SNAPSHOT_SQLITE_FILENAME);
			const validationArtifact = await copySnapshotArtifact(path.dirname(artifactPath), validationPath);
			assertArtifactMatchesManifest(validationPath, validationArtifact, manifest);
			const database = openNodeSqliteDatabase(validationPath, {
				allowExtension: true,
				readOnly: true
			});
			try {
				database.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
				await loadSqliteVecExtension({ db: database });
				assertSqliteIntegrity(database, artifactPath);
				buildManifestDatabaseValidator(manifest.database)(database, artifactPath);
			} finally {
				database.close();
			}
			const validatedArtifact = await hashSnapshotArtifact(validationDir);
			if (!sameFileIdentity(validationArtifact.stat, validatedArtifact.stat)) throw new Error(`Snapshot validation copy changed: ${validationPath}`);
			assertArtifactMatchesManifest(validationPath, validatedArtifact, manifest);
		}
	});
	const afterOpen = await fs$1.lstat(artifactPath);
	if (afterOpen.isSymbolicLink() || !afterOpen.isFile() || afterOpen.nlink > 1 || !sameFileIdentity(expectedIdentity, afterOpen)) throw new Error(`Snapshot artifact changed during SQLite verification: ${artifactPath}`);
	const verifiedArtifact = await hashSnapshotArtifact(path.dirname(artifactPath));
	if (!sameFileIdentity(expectedIdentity, verifiedArtifact.stat)) throw new Error(`Snapshot artifact changed after SQLite verification: ${artifactPath}`);
	assertArtifactMatchesManifest(artifactPath, verifiedArtifact, manifest);
}
function buildDatabaseManifest(identity, sourcePath, userVersion) {
	const basename = path.basename(sourcePath);
	if (identity.role === "global") return {
		role: "global",
		basename,
		userVersion
	};
	if (identity.role === "agent") return {
		role: "agent",
		agentId: identity.agentId,
		basename,
		userVersion
	};
	return {
		role: "generic",
		id: identity.id,
		basename,
		userVersion
	};
}
function buildManifestDatabaseValidator(manifest) {
	const validateOwner = buildSnapshotValidator(manifest);
	return (database, pathname) => {
		validateOwner(database, pathname);
		const userVersion = readSqliteUserVersion(database);
		if (userVersion !== manifest.userVersion) throw new Error(`Snapshot database user_version mismatch for ${pathname}: expected ${manifest.userVersion}, got ${userVersion}`);
	};
}
function buildSnapshotId(now) {
	return `${now.toISOString().replaceAll(/[:.]/g, "-")}-${randomUUID()}`;
}
async function ensurePrivateDirectory(directoryPath, scopeLabel) {
	let expectedExistingIdentity;
	if (process.platform !== "win32") {
		expectedExistingIdentity = await lstatIfExists(directoryPath, { bigint: true });
		if (expectedExistingIdentity) {
			assertDirectory(expectedExistingIdentity, directoryPath, scopeLabel);
			const realPath = await assertTrustedStagingRoot(expectedExistingIdentity, directoryPath, { allowModeRepair: true });
			assertDirectoryIdentitySync$1(directoryPath, {
				dev: expectedExistingIdentity.dev,
				ino: expectedExistingIdentity.ino,
				realPath
			});
			applyPrivateModeSync(directoryPath, SNAPSHOT_DIRECTORY_MODE);
		}
	}
	const receipt = await ensureDurableDirectory({
		directoryPath,
		label: scopeLabel,
		expectedExistingIdentity,
		create: async (targetPath) => {
			if (process.platform === "win32") {
				const parentResult = await ensureAbsoluteDirectory(path.dirname(targetPath), {
					mode: SNAPSHOT_DIRECTORY_MODE,
					scopeLabel
				});
				if (!parentResult.ok) throw parentResult.error;
				try {
					await createPrivateSqliteDirectory(targetPath);
					return;
				} catch (error) {
					if (error.code !== "EEXIST") throw error;
				}
			}
			const result = await ensureAbsoluteDirectory(targetPath, {
				mode: SNAPSHOT_DIRECTORY_MODE,
				scopeLabel
			});
			if (!result.ok) throw result.error;
			applyPrivateModeSync(result.path, SNAPSHOT_DIRECTORY_MODE);
		}
	});
	requireDirectorySync(receipt.parentSync, scopeLabel);
	return receipt;
}
async function ensureRestoreParentDirectory(directoryPath) {
	const receipt = await ensureDurableDirectory({
		directoryPath,
		label: "SQLite restore target",
		create: async (targetPath) => {
			const result = await ensureAbsoluteDirectory(targetPath, {
				mode: SNAPSHOT_DIRECTORY_MODE,
				scopeLabel: "SQLite restore target"
			});
			if (!result.ok) throw result.error;
		}
	});
	requireDirectorySync(receipt.parentSync, "SQLite restore target");
	return receipt;
}
async function publishSnapshotEntryNoOverwrite(sourcePath, targetPath, entryName, publishedEntries) {
	let publication;
	try {
		publication = await publishFileNoClobber(sourcePath, targetPath, {
			strategy: "link-or-copy",
			moveSource: true,
			durability: "fail-closed"
		});
	} catch (error) {
		const details = getPublishFileExclusiveFailureDetails(error);
		if (details?.targetCreated && details.cleanup !== "removed") {
			const [currentSource, currentTarget] = await Promise.all([fs$1.lstat(sourcePath).catch(() => void 0), fs$1.lstat(targetPath).catch(() => void 0)]);
			const matchesReceipt = details.targetIdentity && currentTarget && sameFileIdentity(details.targetIdentity, currentTarget);
			const matchesSource = currentSource && currentTarget && sameFileIdentity(currentSource, currentTarget);
			if (currentTarget && (matchesReceipt || matchesSource)) publishedEntries.set(entryName, currentTarget);
		}
		throw error;
	}
	const expectedTargetIdentity = publication.identity;
	publishedEntries.set(entryName, expectedTargetIdentity);
	const initialTargetIdentity = await fs$1.lstat(targetPath);
	if (!sameFileIdentity(expectedTargetIdentity, initialTargetIdentity)) throw new Error(`SQLite snapshot entry changed during publication: ${targetPath}`);
	const finalTargetIdentity = await fs$1.lstat(targetPath);
	if (!sameFileIdentity(initialTargetIdentity, finalTargetIdentity)) throw new Error(`SQLite snapshot entry changed after publication: ${targetPath}`);
	publishedEntries.set(entryName, finalTargetIdentity);
}
async function assertSnapshotContents(snapshotDir, allowPending = false) {
	const expected = /* @__PURE__ */ new Set([SNAPSHOT_MANIFEST_FILENAME, SNAPSHOT_SQLITE_FILENAME]);
	const entries = await fs$1.readdir(snapshotDir, { withFileTypes: true });
	for (const entry of entries) {
		if (allowPending && entry.name === SNAPSHOT_PENDING_FILENAME) {
			readPendingSnapshotIdentity(path.join(snapshotDir, entry.name));
			continue;
		}
		if (!expected.delete(entry.name)) throw new Error(`SQLite snapshot contains unexpected entry: ${path.join(snapshotDir, entry.name)}`);
		if (entry.isSymbolicLink() || !entry.isFile()) throw new Error(`SQLite snapshot entry must be a regular file: ${path.join(snapshotDir, entry.name)}`);
		if ((await fs$1.lstat(path.join(snapshotDir, entry.name))).nlink > 1) throw new Error(`SQLite snapshot entry must not be hardlinked: ${path.join(snapshotDir, entry.name)}`);
	}
	if (expected.size > 0) throw new Error(`SQLite snapshot is missing ${[...expected].join(", ")}: ${snapshotDir}`);
}
async function classifySnapshotDirectory(snapshotDir) {
	const entries = await fs$1.readdir(snapshotDir, { withFileTypes: true });
	const knownEntries = /* @__PURE__ */ new Set([
		SNAPSHOT_MANIFEST_FILENAME,
		SNAPSHOT_PENDING_FILENAME,
		SNAPSHOT_SQLITE_FILENAME
	]);
	for (const entry of entries) if (!knownEntries.has(entry.name) || entry.isSymbolicLink() || !entry.isFile()) throw new Error(`SQLite snapshot contains unexpected incomplete entry: ${path.join(snapshotDir, entry.name)}`);
	const names = new Set(entries.map((entry) => entry.name));
	if (names.size === 0) return "incomplete";
	if (!names.has(SNAPSHOT_PENDING_FILENAME)) return "committed";
	return names.has("manifest.json") && names.has("database.sqlite") ? "complete-pending" : "incomplete";
}
async function recoverCompletePendingSnapshot(params) {
	const trustedRepositoryPath = await assertTrustedStagingRoot(params.repositoryIdentity, params.repositoryPath);
	await assertDirectoryIdentity(trustedRepositoryPath, params.repositoryIdentity);
	const snapshotDirectory = await pinDirectory(params.snapshotPath, { label: "SQLite pending snapshot directory" });
	try {
		await assertPrivateStagingDirectory(snapshotDirectory.receipt.identity, params.snapshotPath);
		return await commitPendingSnapshot({
			...params,
			repositoryPath: trustedRepositoryPath,
			snapshotDirectory
		});
	} finally {
		await snapshotDirectory.close().catch(() => void 0);
	}
}
async function commitPendingSnapshot(params) {
	const { snapshotPath, snapshotDirectory, expected } = params;
	const scopeLabel = expected ? "SQLite snapshot directory" : "SQLite pending snapshot directory";
	await snapshotDirectory.assertCurrent();
	await assertSnapshotContents(snapshotPath, true);
	const manifest = await readSnapshotManifest(snapshotPath);
	if (expected && !isDeepStrictEqual(manifest, expected.manifest)) throw new Error(`SQLite snapshot manifest changed during publication: ${snapshotPath}`);
	assertAllowedDatabaseRole(manifest, params.allowedDatabaseRoles);
	const artifact = await hashSnapshotArtifact(snapshotPath);
	const artifactPath = path.join(snapshotPath, SNAPSHOT_SQLITE_FILENAME);
	assertArtifactMatchesManifest(artifactPath, artifact, manifest);
	await verifySnapshotDatabaseFile(artifactPath, artifact.stat, manifest, params.validationRootPath);
	if (!expected) requireDirectorySync(await snapshotDirectory.sync(), scopeLabel);
	const pendingPath = path.join(snapshotPath, SNAPSHOT_PENDING_FILENAME);
	const pendingIdentity = readPendingSnapshotIdentity(pendingPath);
	if (pendingIdentity) {
		if (expected && !sameFileIdentity(expected.pendingIdentity, pendingIdentity)) throw new Error(`SQLite snapshot pending marker changed: ${pendingPath}`);
		await snapshotDirectory.assertCurrent();
		const currentPendingIdentity = readPendingSnapshotIdentity(pendingPath);
		if (currentPendingIdentity) {
			if (!sameFileIdentity(pendingIdentity, currentPendingIdentity)) throw new Error(`SQLite snapshot pending marker changed: ${pendingPath}`);
			try {
				fs.unlinkSync(pendingPath);
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
			}
		}
	}
	requireDirectorySync(await snapshotDirectory.sync(), scopeLabel);
	await snapshotDirectory.assertCurrent();
	const committedManifest = await readSnapshotManifest(snapshotPath);
	if (!isDeepStrictEqual(committedManifest, manifest)) throw new Error(`SQLite snapshot manifest changed ${expected ? "after commit" : "during recovery"}: ${snapshotPath}`);
	assertArtifactMatchesManifest(artifactPath, await hashSnapshotArtifact(snapshotPath), committedManifest);
	await assertSnapshotContents(snapshotPath);
	await snapshotDirectory.assertCurrent();
	await assertDirectoryIdentity(params.repositoryPath, params.repositoryIdentity);
	return committedManifest;
}
function readPendingSnapshotIdentity(pendingPath) {
	const identity = lstatIfExistsSync(pendingPath);
	if (identity && (identity.isSymbolicLink() || !identity.isFile() || identity.nlink > 1)) throw new Error(`SQLite snapshot pending marker is unsafe: ${pendingPath}`);
	return identity;
}
async function assertFreshRestorePathsAbsent(databasePath) {
	for (const candidate of [databasePath, ...SQLITE_SIDECAR_SUFFIXES.map((suffix) => `${databasePath}${suffix}`)]) if (await lstatIfExists(candidate)) throw new Error(`Fresh SQLite restore path already exists: ${candidate}`);
}
function assertNoSqliteSidecarsSync(databasePath) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) {
		const sidecarPath = `${databasePath}${suffix}`;
		try {
			fs.lstatSync(sidecarPath);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		throw new Error(`Restored SQLite database has unexpected sidecar: ${sidecarPath}`);
	}
}
async function lstatIfExists(pathname, options) {
	try {
		return await fs$1.lstat(pathname, options);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function lstatIfExistsSync(pathname) {
	try {
		return fs.lstatSync(pathname);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function removePrivateDirectoryIfOwned(directoryPath, expectedIdentity, allowedEntries) {
	const currentIdentity = await lstatIfExists(directoryPath);
	if (!currentIdentity) return false;
	if (currentIdentity.isSymbolicLink() || !currentIdentity.isDirectory() || !sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`Private SQLite staging directory changed before cleanup: ${directoryPath}`);
	const entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
	const verifiedPaths = [];
	for (const entry of entries) {
		const entryPath = path.join(directoryPath, entry.name);
		if (!allowedEntries.has(entry.name) || entry.isSymbolicLink() || !entry.isFile()) throw new Error(`Private SQLite staging directory has unexpected entry: ${entryPath}`);
		if ((await fs$1.lstat(entryPath)).nlink > 1) throw new Error(`Private SQLite staging file must not be hardlinked: ${entryPath}`);
		verifiedPaths.push(entryPath);
	}
	await Promise.all(verifiedPaths.map(async (entryPath) => await fs$1.unlink(entryPath)));
	await fs$1.rmdir(directoryPath);
	return true;
}
async function withPrivateSqliteStagingDirectory(options) {
	const trustedRootPath = await assertTrustedStagingRoot(options.rootReceipt.identity, options.rootReceipt.path);
	await assertDirectoryIdentity(trustedRootPath, options.rootReceipt.identity);
	const directoryPath = await createPrivateSqliteTempDirectory(trustedRootPath, options.prefix);
	const directoryIdentity = await fs$1.lstat(directoryPath);
	let outcome;
	try {
		applyPrivateModeSync(directoryPath, SNAPSHOT_DIRECTORY_MODE);
		await assertPrivateStagingDirectory(directoryIdentity, directoryPath);
		await assertDirectoryIdentity(trustedRootPath, options.rootReceipt.identity);
		outcome = {
			ok: true,
			value: await options.operation(directoryPath, directoryIdentity)
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	let cleanupOutcome;
	try {
		if (!await removePrivateDirectoryIfOwned(directoryPath, directoryIdentity, options.allowedEntries)) throw new Error(`Private SQLite staging directory disappeared: ${directoryPath}`);
		cleanupOutcome = { ok: true };
	} catch (error) {
		cleanupOutcome = {
			ok: false,
			error
		};
	}
	if (!cleanupOutcome.ok) {
		if (!outcome.ok) throw new AggregateError([outcome.error, cleanupOutcome.error], `SQLite staging operation and cleanup both failed: ${directoryPath}`);
		throw new Error(`Failed to clean private SQLite staging directory: ${directoryPath}`, { cause: cleanupOutcome.error });
	}
	requireDirectorySync(await syncDirectory(options.rootReceipt), "Private SQLite staging root");
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
/** Create or strictly admit a Git repository through the local snapshot root trust policy. */
async function ensurePrivateSnapshotRepositoryRoot(rootPath) {
	try {
		return await assertTrustedStagingRoot(await fs$1.lstat(rootPath), rootPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	return await assertTrustedStagingRoot((await ensurePrivateDirectory(rootPath, "Git backup repository")).identity, rootPath);
}
async function removePublishedSnapshotDirectoryIfOwned(directoryPath, expectedIdentity, publishedEntries) {
	const currentIdentity = await lstatIfExists(directoryPath);
	if (!currentIdentity || currentIdentity.isSymbolicLink() || !currentIdentity.isDirectory() || !sameFileIdentity(currentIdentity, expectedIdentity)) return false;
	const entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
	for (const entry of entries) {
		const expectedEntryIdentity = publishedEntries.get(entry.name);
		if (!expectedEntryIdentity || entry.isSymbolicLink() || !entry.isFile()) continue;
		const entryPath = path.join(directoryPath, entry.name);
		const currentEntryIdentity = await fs$1.lstat(entryPath);
		if (sameFileIdentity(currentEntryIdentity, expectedEntryIdentity)) await fs$1.unlink(entryPath);
	}
	if ((await fs$1.readdir(directoryPath)).length > 0) return false;
	await fs$1.rmdir(directoryPath);
	return true;
}
//#endregion
export { hashSnapshotArtifact as a, createOpenClawSnapshotCopy as i, ensurePrivateSnapshotRepositoryRoot as n, SNAPSHOT_SQLITE_FILENAME as o, buildSnapshotValidator as r, createLocalSqliteSnapshotProvider as t };
