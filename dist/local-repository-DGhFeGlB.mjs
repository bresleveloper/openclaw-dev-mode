import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as findGitRoot } from "./git-root-toH5zPNI.mjs";
import { m as applyPrivateModeSync } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { a as canonicalPathFromExistingAncestor$1, c as isPathInside$1, o as ensureAbsoluteDirectory$1 } from "./fs-safe-6Z4UiMS4.mjs";
import { d as createPrivateSqliteDirectory, f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-B4VrWJSe.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { a as resolveSqliteDatabaseFilePaths, t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-N5UzY_DG.mjs";
import { r as assertSupportedStateSchemaVersion } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance, w as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import "./session-key-CSDERtm3.mjs";
import { f as syncDirectoryIfSupported, i as pinDirectory, l as syncDirectory, n as getPublishFileExclusiveFailureDetails, o as publishFileNoClobber, s as requireDirectorySync, t as ensureDurableDirectory } from "./directory-durability-B2RKADOj.mjs";
import { i as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { n as runExec } from "./exec-Bf6uhUA7.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-C4XpKCv9.mjs";
import { n as assertOpenClawAgentDatabaseOwner, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { t as assertNotUpdateCapturePath } from "./update-capture-paths-KB4ru3JI.mjs";
import { a as publishVerifiedSqliteFile, r as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-u13JUemz.mjs";
import { t as loadSqliteVecExtension } from "./sqlite-vec-DjjFDiM4.mjs";
import { t as embedSessionColdArchivesInSnapshot } from "./session-cold-storage-backup-C62shack.mjs";
import { _ as SNAPSHOT_SQLITE_FILENAME, d as readSnapshotExportEnvelope, f as copySnapshotArtifact, g as SNAPSHOT_MANIFEST_FILENAME, h as writeSnapshotManifest, i as capturePostgresBackup, l as runOfflineDatabaseBackup, m as readSnapshotManifest, o as preparePostgresRestore, p as hashSnapshotArtifact, s as readBackupEngine, u as verifyMatchedPostgresBackup } from "./database-backup-EzQ2PUMu.mjs";
import { n as sanitizeOpenClawStateLeaseRows, t as sanitizeOpenClawGlobalStateSnapshot } from "./openclaw-state-snapshot-sanitizer-rntdA4KE.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { assertDirectoryIdentitySync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { hasNodeErrorCode } from "@openclaw/fs-safe/path";
import { readOwnerAndDaclBatch } from "@openclaw/fs-safe/permissions";
import assert from "node:assert/strict";
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
	return (database, pathname) => {
		if (identity.role === "global") {
			const version = assertSupportedStateSchemaVersion(database, pathname);
			const owner = assertOpenClawStateDatabaseOwner(database, { pathname });
			assert(version > 0 && owner.schema_version === version, "Invalid snapshot schema version.");
		} else if (identity.role === "agent") {
			const version = assertSupportedAgentSchemaVersion(database, pathname);
			const owner = assertOpenClawAgentDatabaseOwner(database, {
				pathname,
				agentId: identity.agentId
			});
			assert(version > 0 && owner.schemaVersion === version, "Invalid snapshot schema version.");
		}
	};
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
			validate: identity.role === "global" ? (database, pathname) => assertOpenClawStateDatabaseForMaintenance(database, { pathname }) : identity.role === "agent" ? (database, pathname) => assertOpenClawAgentDatabaseForMaintenance(database, {
				pathname,
				agentId: identity.agentId
			}) : void 0
		})
	};
}
//#endregion
//#region src/snapshot/restore-paths.ts
async function assertFreshRestoreTarget(databasePath) {
	for (const candidate of resolveSqliteDatabaseFilePaths(databasePath)) {
		try {
			await fs$1.lstat(candidate);
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			throw error;
		}
		throw new Error(`Fresh SQLite restore path already exists: ${candidate}`);
	}
}
function assertNoSqliteSidecarsSync(databasePath, errorPrefix) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) {
		const sidecarPath = `${databasePath}${suffix}`;
		try {
			fs.lstatSync(sidecarPath);
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			throw error;
		}
		throw new Error(`${errorPrefix}: ${sidecarPath}`);
	}
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
const WINDOWS_STAGING_REPLACEMENT_RIGHTS_MASK = 302841920;
const WINDOWS_TRUSTED_OWNER_SIDS = /* @__PURE__ */ new Set([
	"S-1-5-18",
	"S-1-5-32-544",
	"S-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464"
]);
const WINDOWS_TRUSTED_ACCESS_SIDS = /* @__PURE__ */ new Set([...WINDOWS_TRUSTED_OWNER_SIDS, "S-1-3-0"]);
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
let macosTrustedAclPrincipalsPromise;
function assertDirectory(stat, pathname, label) {
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`${label} must be a real directory: ${pathname}`);
}
async function assertDirectoryIdentity(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath, { bigint: true });
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
function assertDirectoryIdentitySync$1(directoryPath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(directoryPath, { bigint: true });
	assertDirectory(currentIdentity, directoryPath, "SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`SQLite staging directory changed during operation: ${directoryPath}`);
}
async function assertTrustedStagingRoot(expectedIdentity, rootPath, options = {}) {
	const resolvedRootPath = path.resolve(rootPath);
	const trustedRootPath = await fs$1.realpath(resolvedRootPath);
	const rootIdentity = await fs$1.lstat(trustedRootPath, { bigint: true });
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
	const currentIdentity = await fs$1.lstat(directoryPath, { bigint: true });
	assertDirectory(currentIdentity, directoryPath, "Private SQLite staging directory");
	if (!sameFileIdentity(currentIdentity, expectedIdentity)) throw new Error(`Private SQLite staging directory changed during operation: ${directoryPath}`);
	if (process.platform === "win32") return;
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid === void 0 || Number(currentIdentity.uid) !== uid || (currentIdentity.mode & 63n) !== 0n) throw new Error(`Private SQLite staging directory permissions are unsafe: ${directoryPath}`);
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
		security = await readOwnerAndDaclBatch(paths);
	} catch (error) {
		throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${rootPath}`, { cause: error });
	}
	for (const [index, pathname] of paths.entries()) {
		const pathSecurity = security[index];
		if (pathSecurity.status !== "supported" || !pathSecurity.isLocal || !pathSecurity.daclPresent || !pathSecurity.complete) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
		assertTrustedWindowsAcl(pathname, index === 0, pathSecurity);
	}
}
function assertTrustedWindowsAcl(pathname, requirePrivate, security) {
	const pathRole = requirePrivate ? "repository root" : "ancestor";
	const currentUserSid = security.currentUserSid.toUpperCase();
	const ownerSid = security.ownerSid.toUpperCase();
	if (ownerSid !== currentUserSid && !WINDOWS_TRUSTED_OWNER_SIDS.has(ownerSid)) throw new Error(`Windows SQLite staging ${pathRole} is owned by an untrusted principal: path=${pathname} principal=${ownerSid}. Choose a local directory owned only by the current user or a trusted OS principal.`);
	const allowedEntries = security.aces.filter((entry) => entry.aceType === "allow");
	if (allowedEntries.length === 0) throw new Error(`Unable to verify private Windows ACL for SQLite staging: ${pathname}`);
	const unsafeMask = requirePrivate ? -1048577 : WINDOWS_STAGING_REPLACEMENT_RIGHTS_MASK | ~WINDOWS_KNOWN_FILE_RIGHTS_MASK;
	const unsafeEntry = allowedEntries.find((entry) => {
		const sid = entry.sid.toUpperCase();
		return sid !== currentUserSid && !WINDOWS_TRUSTED_ACCESS_SIDS.has(sid) && (requirePrivate || !entry.flags.inheritOnly) && (entry.mask & unsafeMask) !== 0;
	});
	if (unsafeEntry) throw new Error(`Windows ACL permits untrusted SQLite staging access on ${pathRole}: path=${pathname} principal=${unsafeEntry.sid.toUpperCase()} rights=${formatWindowsSecurityRights(unsafeEntry)}. Remove the untrusted grant or choose a private local directory; do not use a shared or synced root.`);
}
function formatWindowsSecurityRights(entry) {
	const rights = WINDOWS_FILE_RIGHTS.filter(([right]) => (entry.mask & right) !== 0).map(([, name]) => name);
	if ((entry.mask & ~WINDOWS_KNOWN_FILE_RIGHTS_MASK) !== 0) rights.push("UNKNOWN");
	return `${[
		entry.flags.objectInherit ? "(OI)" : "",
		entry.flags.containerInherit ? "(CI)" : "",
		entry.flags.noPropagateInherit ? "(NP)" : "",
		entry.flags.inheritOnly ? "(IO)" : ""
	].join("")}(${rights.join(",")})`;
}
//#endregion
//#region src/snapshot/local-repository-private-directory.ts
function isPrivateDirectoryAlreadyExists(error) {
	return process.platform === "win32" ? error instanceof FsSafeError && error.code === "already-exists" : error.code === "EEXIST";
}
async function createPrivateSnapshotDirectory(directoryPath) {
	try {
		await createPrivateSqliteDirectory(directoryPath);
	} catch (error) {
		if (isPrivateDirectoryAlreadyExists(error)) throw new Error(`SQLite snapshot directory already exists: ${directoryPath}`, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/snapshot/local-repository.ts
const SNAPSHOT_DIRECTORY_MODE = 448;
const SNAPSHOT_FILE_MODE = 384;
const SNAPSHOT_PENDING_FILENAME = ".pending";
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
function createLocalSnapshotProvider(options) {
	const native = createLocalSqliteSnapshotProvider(options);
	const repository = path.resolve(options.repositoryPath);
	const locate = async (snapshot) => {
		const directory = path.resolve(snapshot.path);
		if (path.dirname(directory) !== repository) throw new Error("Snapshot must be an immediate repository child.");
		await assertTrustedStagingRoot(await fs$1.lstat(repository, { bigint: true }), repository);
		assertDirectory(await fs$1.lstat(directory, { bigint: true }), directory, "Snapshot");
		return directory;
	};
	const provider = {
		async create(database) {
			if (readBackupEngine(database.path).engine === "sqlite") return native.create(database);
			const trusted = await ensurePrivateSnapshotRepositoryRoot(repository);
			const directory = path.join(trusted, `${(options.now?.() ?? /* @__PURE__ */ new Date()).toISOString().replaceAll(/[:.]/g, "-")}-${randomUUID()}`);
			const identity = normalizeSnapshotIdentity(database.identity);
			if (options.allowedDatabaseRoles && !options.allowedDatabaseRoles.includes(identity.role)) throw new Error("Snapshot database role is not allowed.");
			const manifest = await capturePostgresBackup({
				sourcePath: database.path,
				directory
			});
			return {
				ref: { path: directory },
				manifest
			};
		},
		async verify(snapshot) {
			const directory = await locate(snapshot);
			if ((await readSnapshotExportEnvelope(directory)).engine === "sqlite") return native.verify(snapshot);
			return {
				ok: true,
				manifest: await verifyMatchedPostgresBackup(directory, "user-backup")
			};
		},
		async restoreFresh(snapshot, targetPath) {
			const directory = await locate(snapshot);
			const envelope = await readSnapshotExportEnvelope(directory);
			if (envelope.engine === "sqlite") return native.restoreFresh(snapshot, targetPath);
			const target = path.join(await canonicalPathFromExistingAncestor$1(path.dirname(path.resolve(targetPath))), path.basename(targetPath));
			if (isPathInside$1(repository, target)) throw new Error("Restore target must be outside its repository.");
			await assertFreshRestoreTarget(target);
			const receipt = await ensureRestoreParentDirectory(path.dirname(target));
			return runOfflineDatabaseBackup(target, ({ config, assertCurrent }) => withPrivateSqliteStagingDirectory({
				rootReceipt: receipt,
				prefix: ".tmp-restore-",
				allowedEntries: RESTORE_STAGING_ENTRIES,
				operation: async (staging) => {
					const sourcePath = path.join(staging, SNAPSHOT_SQLITE_FILENAME);
					const content = await preparePostgresRestore({
						directory,
						anchorPath: sourcePath,
						config,
						profile: "user-backup",
						assertCurrent
					});
					await publishVerifiedSqliteFile({
						sourcePath,
						sourceIdentity: await fs$1.lstat(sourcePath, { bigint: true }),
						targetPath: target,
						expectedContent: content,
						requireAtomicPublication: true,
						beforePublish: async () => {
							assertCurrent();
							await assertFreshRestoreTarget(target);
						},
						afterPublish: (guard) => guard.assertTargetMatchesExpectedContent(assertCurrent)
					});
					return {
						ok: true,
						manifest: envelope.manifest
					};
				}
			}));
		},
		async list() {
			const summaries = [];
			if (!await lstatIfExists(repository)) return [];
			for (const entry of await fs$1.readdir(repository, { withFileTypes: true })) {
				if (!entry.isDirectory() || entry.name.startsWith(".tmp-")) continue;
				const ref = { path: path.join(repository, entry.name) };
				if (await lstatIfExists(path.join(ref.path, ".pending"))) continue;
				summaries.push({
					ref,
					manifest: (await provider.verify(ref)).manifest
				});
			}
			return summaries.toSorted((a, b) => b.manifest.createdAt.localeCompare(a.manifest.createdAt));
		}
	};
	return provider;
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
		const repositoryIdentity = repositoryReceipt.exactIdentity;
		const trustedRepositoryPath = await assertTrustedStagingRoot(repositoryIdentity, this.#repositoryPath);
		const sourcePath = path.resolve(database.path);
		const identity = normalizeSnapshotIdentity(database.identity);
		const now = this.#now();
		if (!Number.isFinite(now.getTime())) throw new Error("SQLite snapshot timestamp is invalid.");
		const snapshotId = `${now.toISOString().replaceAll(/[:.]/g, "-")}-${randomUUID()}`;
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
			stagingIdentity = await fs$1.lstat(stagingDir, { bigint: true });
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
			await createPrivateSnapshotDirectory(snapshotDir);
			snapshotDirectoryCreated = true;
			await assertDirectoryIdentity(trustedRepositoryPath, repositoryIdentity);
			publishedDirectory = await pinDirectory(snapshotDir, { label: "SQLite snapshot directory" });
			publishedIdentity = publishedDirectory.receipt.exactIdentity;
			applyPrivateModeSync(snapshotDir, SNAPSHOT_DIRECTORY_MODE);
			await assertPrivateStagingDirectory(publishedIdentity, snapshotDir);
			await publishedDirectory.assertCurrent();
			const pendingPath = path.join(snapshotDir, SNAPSHOT_PENDING_FILENAME);
			const pendingHandle = await fs$1.open(pendingPath, "wx+", SNAPSHOT_FILE_MODE);
			let pendingIdentity;
			try {
				pendingIdentity = await pendingHandle.stat({ bigint: true });
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
			if (snapshotDirectoryCreated) publishedIdentity ??= await fs$1.lstat(snapshotDir, { bigint: true }).catch(() => void 0);
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
		await verifySnapshotDatabaseFile(artifactPath, artifact.identity, manifest, this.#validationRootPath);
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
		await assertFreshRestoreTarget(resolvedTargetPath);
		const canonicalRepositoryPath = await fs$1.realpath(this.#repositoryPath);
		const canonicalRestoreParentPath = await canonicalPathFromExistingAncestor$1(path.dirname(resolvedTargetPath));
		const canonicalTargetPath = path.join(canonicalRestoreParentPath, path.basename(resolvedTargetPath));
		if (isPathInside$1(canonicalRepositoryPath, canonicalTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentPath = path.dirname(canonicalTargetPath);
		const restoreParentReceipt = await ensureRestoreParentDirectory(restoreParentPath);
		const trustedRestoreParentPath = await fs$1.realpath(restoreParentPath);
		const trustedTargetPath = path.join(trustedRestoreParentPath, path.basename(resolvedTargetPath));
		if (!isPathInside$1(canonicalTargetPath, trustedTargetPath) || !isPathInside$1(trustedTargetPath, canonicalTargetPath)) throw new Error(`SQLite restore target changed while creating its parent: ${resolvedTargetPath}`);
		if (isPathInside$1(canonicalRepositoryPath, trustedTargetPath)) throw new Error(`SQLite restore target must be outside snapshot repository ${this.#repositoryPath}: ${resolvedTargetPath}`);
		const restoreParentIdentity = await fs$1.lstat(trustedRestoreParentPath, { bigint: true });
		if (!sameFileIdentity(restoreParentReceipt.exactIdentity, restoreParentIdentity)) throw new Error(`SQLite restore parent changed after durable creation: ${trustedRestoreParentPath}`);
		await assertFreshRestoreTarget(trustedTargetPath);
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
				await verifySnapshotDatabaseFile(stagedSourcePath, stagedArtifact.identity, manifest, trustedRestoreParentPath);
				await publishVerifiedSqliteFile({
					sourceIdentity: stagedArtifact.identity,
					sourcePath: stagedSourcePath,
					targetPath: trustedTargetPath,
					expectedContent: manifest.artifact,
					requireAtomicPublication: true,
					beforePublish: async () => {
						await assertDirectoryIdentity(trustedRestoreParentPath, restoreParentIdentity);
						await assertFreshRestoreTarget(trustedTargetPath);
					},
					afterPublish: (guard) => {
						guard.assertTargetMatchesExpectedContent(() => {
							assertDirectoryIdentitySync$1(trustedRestoreParentPath, restoreParentIdentity);
							assertNoSqliteSidecarsSync(trustedTargetPath, "Restored SQLite database has unexpected sidecar");
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
		if (findGitRoot(this.#repositoryPath, { maxDepth: 1 })) throw new Error(`Git backup repository is not a SQLite snapshot repository: ${this.#repositoryPath}. Use \`openclaw backup git log --repository <path>\` instead.`);
		const entries = await fs$1.readdir(this.#repositoryPath, { withFileTypes: true });
		const snapshots = [];
		for (const entry of entries) {
			const snapshotPath = path.join(this.#repositoryPath, entry.name);
			if (entry.name.startsWith(".tmp-")) {
				if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unsafe staging entry: ${snapshotPath}`);
				continue;
			}
			if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`SQLite snapshot repository contains unexpected entry: ${snapshotPath}`);
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
	const beforeOpen = await fs$1.lstat(artifactPath, { bigint: true });
	if (beforeOpen.isSymbolicLink() || !beforeOpen.isFile() || beforeOpen.nlink > 1n || !sameFileIdentity(expectedIdentity, beforeOpen)) throw new Error(`Snapshot artifact changed before SQLite verification: ${artifactPath}`);
	const validationRootIdentity = await lstatIfExists(validationRootPath, { bigint: true });
	if (!validationRootIdentity) throw new Error(`SQLite validation root does not exist: ${validationRootPath}. Create a private directory there or pass an existing directory with \`--scratch\`.`);
	assertDirectory(validationRootIdentity, validationRootPath, "SQLite validation root");
	const canonicalValidationRootPath = await fs$1.realpath(validationRootPath);
	await withPrivateSqliteStagingDirectory({
		rootReceipt: {
			path: canonicalValidationRootPath,
			realPath: canonicalValidationRootPath,
			identity: validationRootIdentity,
			exactIdentity: validationRootIdentity
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
				buildSnapshotValidator(manifest.database)(database, artifactPath);
				const userVersion = readSqliteUserVersion(database);
				if (userVersion !== manifest.database.userVersion) throw new Error(`Snapshot database user_version mismatch for ${artifactPath}: expected ${manifest.database.userVersion}, got ${userVersion}`);
			} finally {
				database.close();
			}
			const validatedArtifact = await hashSnapshotArtifact(validationDir);
			if (!sameFileIdentity(validationArtifact.identity, validatedArtifact.identity)) throw new Error(`Snapshot validation copy changed: ${validationPath}`);
			assertArtifactMatchesManifest(validationPath, validatedArtifact, manifest);
		}
	});
	const afterOpen = await fs$1.lstat(artifactPath, { bigint: true });
	if (afterOpen.isSymbolicLink() || !afterOpen.isFile() || afterOpen.nlink > 1n || !sameFileIdentity(expectedIdentity, afterOpen)) throw new Error(`Snapshot artifact changed during SQLite verification: ${artifactPath}`);
	const verifiedArtifact = await hashSnapshotArtifact(path.dirname(artifactPath));
	if (!sameFileIdentity(expectedIdentity, verifiedArtifact.identity)) throw new Error(`Snapshot artifact changed after SQLite verification: ${artifactPath}`);
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
async function ensurePrivateDirectory(directoryPath, scopeLabel) {
	let expectedExistingIdentity;
	if (process.platform !== "win32") {
		expectedExistingIdentity = await lstatIfExists(directoryPath, { bigint: true });
		if (expectedExistingIdentity) {
			assertDirectory(expectedExistingIdentity, directoryPath, scopeLabel);
			const realPath = await assertTrustedStagingRoot(expectedExistingIdentity, directoryPath, { allowModeRepair: true });
			assertDirectoryIdentitySync(directoryPath, {
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
				const parentResult = await ensureAbsoluteDirectory$1(path.dirname(targetPath), {
					mode: SNAPSHOT_DIRECTORY_MODE,
					scopeLabel
				});
				if (!parentResult.ok) throw parentResult.error;
				try {
					await createPrivateSqliteDirectory(targetPath);
					return;
				} catch (error) {
					if (!isPrivateDirectoryAlreadyExists(error)) throw error;
				}
			}
			const result = await ensureAbsoluteDirectory$1(targetPath, {
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
			const result = await ensureAbsoluteDirectory$1(targetPath, {
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
			const [currentSource, currentTarget] = await Promise.all([fs$1.lstat(sourcePath, { bigint: true }).catch(() => void 0), fs$1.lstat(targetPath, { bigint: true }).catch(() => void 0)]);
			const matchesReceipt = details.exactTargetIdentity && currentTarget && sameFileIdentity(details.exactTargetIdentity, currentTarget);
			const matchesSource = currentSource && currentTarget && sameFileIdentity(currentSource, currentTarget);
			if (currentTarget && (matchesReceipt || matchesSource)) publishedEntries.set(entryName, currentTarget);
		}
		throw error;
	}
	const expectedTargetIdentity = publication.exactIdentity;
	publishedEntries.set(entryName, expectedTargetIdentity);
	const initialTargetIdentity = await fs$1.lstat(targetPath, { bigint: true });
	if (!sameFileIdentity(expectedTargetIdentity, initialTargetIdentity)) throw new Error(`SQLite snapshot entry changed during publication: ${targetPath}`);
	const finalTargetIdentity = await fs$1.lstat(targetPath, { bigint: true });
	if (!sameFileIdentity(initialTargetIdentity, finalTargetIdentity)) throw new Error(`SQLite snapshot entry changed after publication: ${targetPath}`);
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
		await assertPrivateStagingDirectory(snapshotDirectory.receipt.exactIdentity, params.snapshotPath);
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
	await verifySnapshotDatabaseFile(artifactPath, artifact.identity, manifest, params.validationRootPath);
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
	if (identity && (identity.isSymbolicLink() || !identity.isFile() || identity.nlink > 1n)) throw new Error(`SQLite snapshot pending marker is unsafe: ${pendingPath}`);
	return identity;
}
async function lstatIfExists(pathname, options) {
	try {
		return await fs$1.lstat(pathname, options ?? { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function lstatIfExistsSync(pathname) {
	try {
		return fs.lstatSync(pathname, { bigint: true });
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
	const trustedRootPath = await assertTrustedStagingRoot(options.rootReceipt.exactIdentity, options.rootReceipt.path);
	await assertDirectoryIdentity(trustedRootPath, options.rootReceipt.exactIdentity);
	const directoryPath = await createPrivateSqliteTempDirectory(trustedRootPath, options.prefix);
	const directoryIdentity = await fs$1.lstat(directoryPath, { bigint: true });
	let outcome;
	try {
		applyPrivateModeSync(directoryPath, SNAPSHOT_DIRECTORY_MODE);
		await assertPrivateStagingDirectory(directoryIdentity, directoryPath);
		await assertDirectoryIdentity(trustedRootPath, options.rootReceipt.exactIdentity);
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
		return await assertTrustedStagingRoot(await fs$1.lstat(rootPath, { bigint: true }), rootPath);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	return await assertTrustedStagingRoot((await ensurePrivateDirectory(rootPath, "Git backup repository")).exactIdentity, rootPath);
}
async function removePublishedSnapshotDirectoryIfOwned(directoryPath, expectedIdentity, publishedEntries) {
	const currentIdentity = await lstatIfExists(directoryPath);
	if (!currentIdentity || currentIdentity.isSymbolicLink() || !currentIdentity.isDirectory() || !sameFileIdentity(currentIdentity, expectedIdentity)) return false;
	const entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
	for (const entry of entries) {
		const expectedEntryIdentity = publishedEntries.get(entry.name);
		if (!expectedEntryIdentity || entry.isSymbolicLink() || !entry.isFile()) continue;
		const entryPath = path.join(directoryPath, entry.name);
		const currentEntryIdentity = await fs$1.lstat(entryPath, { bigint: true });
		if (sameFileIdentity(currentEntryIdentity, expectedEntryIdentity)) await fs$1.unlink(entryPath);
	}
	if ((await fs$1.readdir(directoryPath)).length > 0) return false;
	await fs$1.rmdir(directoryPath);
	return true;
}
//#endregion
export { assertNoSqliteSidecarsSync as a, assertFreshRestoreTarget as i, createLocalSqliteSnapshotProvider as n, buildSnapshotValidator as o, ensurePrivateSnapshotRepositoryRoot as r, createOpenClawSnapshotCopy as s, createLocalSnapshotProvider as t };
