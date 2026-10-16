import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as normalizeWindowsPathForComparison } from "./path-guards-CH7noY0Z.mjs";
import { Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as UpdateRunDriverSchema } from "./update-run-schema-DOichlUj.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { h as normalizeArchiveRoot, m as normalizeArchivePath, p as isArchivePathWithin, r as buildBackupArchivePath } from "./backup-shared-B6KMCCJW.mjs";
import path from "node:path";
//#region src/commands/backup-verify-manifest.ts
const recoveryPath = string().min(1).refine((value) => !value.includes("\0") && path.resolve(value) === value);
const recoveryDigest = string().regex(/^[a-f0-9]{64}$/u);
const recoveryEntry = discriminatedUnion("kind", [
	strictObject({
		kind: literal("file"),
		sourcePath: recoveryPath,
		archivePath: string().regex(/^payload\/\d+$/u),
		size: number().int().nonnegative(),
		sha256: recoveryDigest,
		sqlite: boolean(),
		mode: number().int().nonnegative()
	}),
	strictObject({
		kind: literal("directory"),
		sourcePath: recoveryPath,
		mode: number().int().nonnegative()
	}),
	strictObject({
		kind: literal("symlink"),
		sourcePath: recoveryPath,
		target: string().refine((value) => !value.includes("\0")),
		contentPath: recoveryPath.optional()
	}),
	strictObject({
		kind: literal("missing"),
		sourcePath: recoveryPath,
		sqlite: boolean(),
		directory: boolean()
	})
]);
const updateRecoveryManifestSchema = strictObject({
	schemaVersion: union([literal(1), literal(2)]),
	kind: literal("update-recovery"),
	generation: discriminatedUnion("kind", [
		strictObject({ kind: literal("baseline") }),
		strictObject({
			kind: literal("candidate"),
			baselineSha256: recoveryDigest
		}),
		strictObject({
			kind: literal("prepared"),
			baselineSha256: recoveryDigest,
			candidateSha256: recoveryDigest
		})
	]).optional(),
	databases: array(discriminatedUnion("role", [strictObject({
		path: recoveryPath,
		role: literal("global")
	}), strictObject({
		path: recoveryPath,
		role: literal("agent"),
		agentId: string().min(1)
	})])).optional(),
	runId: string().regex(/^[a-zA-Z0-9_-]{1,128}$/u),
	installRoot: recoveryPath,
	stateDir: recoveryPath,
	configPath: recoveryPath,
	configPaths: array(recoveryPath).min(1).max(512),
	creator: UpdateRunDriverSchema,
	drivers: array(UpdateRunDriverSchema).max(32),
	createdAt: string().datetime(),
	roots: array(recoveryPath).min(1),
	excludedRoots: array(recoveryPath),
	protectedPaths: array(recoveryPath),
	entries: array(recoveryEntry).max(1e6),
	warnings: array(strictObject({
		kind: literal("undeclared-migration-resources"),
		pluginId: string().min(1),
		message: string().min(1)
	})).optional()
});
/** Update recovery binds every payload; ordinary archive manifests retain their existing contract. */
function parseUpdateRecoveryBackupManifest(raw) {
	const manifest = updateRecoveryManifestSchema.parse(JSON.parse(raw));
	if (manifest.schemaVersion === 1 && (manifest.generation || manifest.databases) || manifest.schemaVersion === 2 && (!manifest.generation || !manifest.databases)) throw new Error("Update recovery generation metadata does not match its format version.");
	const databasePaths = /* @__PURE__ */ new Set();
	let globalDatabasePath;
	for (const database of manifest.databases ?? []) {
		if (databasePaths.has(database.path) || database.role === "global" && globalDatabasePath !== void 0 || database.role === "agent" && normalizeAgentId(database.agentId) !== database.agentId) throw new Error(`Invalid update recovery database identity: ${database.path}`);
		databasePaths.add(database.path);
		if (database.role === "global") globalDatabasePath = database.path;
	}
	const sources = /* @__PURE__ */ new Map();
	const payloads = /* @__PURE__ */ new Set();
	const excluded = new Set(manifest.excludedRoots);
	if (excluded.size !== manifest.excludedRoots.length || [
		...manifest.roots,
		...manifest.protectedPaths,
		...manifest.configPaths
	].some((pathname) => excluded.has(pathname))) throw new Error("Update recovery exclusions conflict with retained resource inventory.");
	for (const entry of manifest.entries) {
		if (excluded.has(entry.sourcePath)) throw new Error(`Excluded update recovery source has a retained entry: ${entry.sourcePath}`);
		if (entry.kind === "missing" && entry.sqlite && entry.directory) throw new Error("Missing SQLite inventory cannot describe a directory.");
		if (sources.has(entry.sourcePath) || !manifest.roots.some((root) => {
			const relative = path.relative(root, entry.sourcePath);
			return relative === "" || !path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`);
		})) throw new Error(`Invalid update recovery source: ${entry.sourcePath}`);
		sources.set(entry.sourcePath, entry);
		if (entry.kind === "file") {
			if (payloads.has(entry.archivePath)) throw new Error(`Duplicate update recovery payload: ${entry.archivePath}`);
			payloads.add(entry.archivePath);
		}
	}
	for (const database of manifest.databases ?? []) {
		const entry = sources.get(database.path);
		if (!entry || !((entry.kind === "file" || entry.kind === "missing" && !entry.directory) && entry.sqlite)) throw new Error(`Update recovery database is missing its SQLite inventory: ${database.path}`);
	}
	if (manifest.roots.some((root) => !sources.has(root))) throw new Error("Update recovery manifest is missing a root entry.");
	if (!manifest.configPaths.includes(manifest.configPath) || new Set(manifest.configPaths).size !== manifest.configPaths.length) throw new Error("Update recovery manifest is missing its configuration inventory.");
	for (const pathname of manifest.configPaths) {
		const config = sources.get(pathname);
		const content = config?.kind === "symlink" && config.contentPath ? sources.get(config.contentPath) : void 0;
		if (!config || config.kind === "directory" || config.kind === "file" && config.sqlite || config.kind === "missing" && (config.directory || config.sqlite) || config.kind === "symlink" && (!config.contentPath || !manifest.configPaths.includes(config.contentPath) || !content || !((content.kind === "file" || content.kind === "missing" && !content.directory) && !content.sqlite))) throw new Error("Update recovery manifest is missing its configuration inventory.");
	}
	return manifest;
}
function backupManifestSizeError(bytes) {
	const maxBytes = 1048576;
	return bytes > maxBytes ? /* @__PURE__ */ new Error(`Backup manifest exceeds ${maxBytes} byte limit.`) : void 0;
}
function parseBackupManifestSourcePath(value, label) {
	if (typeof value !== "string" || value.includes("\0")) throw new Error(`Backup manifest ${label} has an invalid sourcePath.`);
	const windowsPath = /^(?:[A-Za-z]:[\\/]|\\\\(?![?.]\\))/u.test(value);
	const normalized = windowsPath ? path.win32.normalize(value) : path.posix.normalize(value);
	if (!windowsPath && !value.startsWith("/") || normalized !== value) throw new Error(`Backup manifest ${label} sourcePath must be absolute and normalized.`);
	return value;
}
function parseBackupManifestAgentRoots(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Backup manifest agentRoots must be an array.");
	const agentRoots = [];
	const seenAgentIds = /* @__PURE__ */ new Set();
	const seenSourcePaths = /* @__PURE__ */ new Set();
	for (const agentRoot of value) {
		if (!isRecord(agentRoot) || Object.keys(agentRoot).length !== 2 || !Object.hasOwn(agentRoot, "agentId") || !Object.hasOwn(agentRoot, "sourcePath")) throw new Error("Backup manifest agent root must contain only agentId and sourcePath.");
		const { agentId, sourcePath } = agentRoot;
		if (typeof agentId !== "string" || !agentId || normalizeAgentId(agentId) !== agentId) throw new Error("Backup manifest agent root has an invalid or noncanonical agentId.");
		const normalizedSourcePath = parseBackupManifestSourcePath(sourcePath, "agent root");
		const sourcePathKey = /^(?:[A-Za-z]:[\\/]|\\\\(?![?.]\\))/u.test(normalizedSourcePath) ? normalizeWindowsPathForComparison(normalizedSourcePath) : normalizedSourcePath;
		if (seenAgentIds.has(agentId) || seenSourcePaths.has(sourcePathKey)) throw new Error("Backup manifest contains duplicate agent root ownership.");
		seenAgentIds.add(agentId);
		seenSourcePaths.add(sourcePathKey);
		agentRoots.push({
			agentId,
			sourcePath: normalizedSourcePath
		});
	}
	return agentRoots;
}
function parseBackupManifestSqliteSnapshots(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Backup manifest sqliteSnapshots must be an array.");
	let hasGlobal = false;
	const paths = /* @__PURE__ */ new Set();
	return value.map((snapshot) => {
		if (!isRecord(snapshot) || snapshot.role !== "global" && snapshot.role !== "agent" || Object.keys(snapshot).some((key) => key !== "sourcePath" && key !== "role" && !(snapshot.role === "agent" && key === "agentId"))) throw new Error("Backup manifest contains an invalid SQLite snapshot owner.");
		const sourcePath = parseBackupManifestSourcePath(snapshot.sourcePath, "SQLite snapshot");
		let identity;
		if (snapshot.role === "global") identity = { role: "global" };
		else {
			const agentId = snapshot.agentId;
			if (typeof agentId !== "string" || !agentId || normalizeAgentId(agentId) !== agentId) throw new Error("Backup manifest SQLite snapshot has an invalid agentId.");
			identity = {
				role: "agent",
				agentId
			};
		}
		const sourceKey = sourcePath.replaceAll("\\", "/").normalize("NFC").toLowerCase();
		if (identity.role === "global" && hasGlobal || paths.has(sourceKey)) throw new Error("Backup manifest contains duplicate SQLite snapshot ownership.");
		hasGlobal ||= identity.role === "global";
		paths.add(sourceKey);
		return {
			sourcePath,
			...identity
		};
	});
}
function parseBackupManifest(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error("Backup manifest is not valid JSON.", { cause: err });
	}
	if (!isRecord(parsed)) throw new Error("Backup manifest must be an object.");
	if (parsed.schemaVersion !== 1) throw new Error(`Unsupported backup manifest schemaVersion: ${String(parsed.schemaVersion)}`);
	if (typeof parsed.archiveRoot !== "string" || !parsed.archiveRoot.trim()) throw new Error("Backup manifest is missing archiveRoot.");
	if (typeof parsed.createdAt !== "string" || !parsed.createdAt.trim()) throw new Error("Backup manifest is missing createdAt.");
	if (!Array.isArray(parsed.assets)) throw new Error("Backup manifest is missing assets.");
	const assets = [];
	for (const asset of parsed.assets) {
		if (!isRecord(asset)) throw new Error("Backup manifest contains a non-object asset.");
		if (typeof asset.kind !== "string" || !asset.kind.trim()) throw new Error("Backup manifest asset is missing kind.");
		if (typeof asset.sourcePath !== "string" || !asset.sourcePath.trim()) throw new Error("Backup manifest asset is missing sourcePath.");
		if (typeof asset.archivePath !== "string" || !asset.archivePath.trim()) throw new Error("Backup manifest asset is missing archivePath.");
		assets.push({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		});
	}
	const externalSymbolicLinks = [];
	if (parsed.externalSymbolicLinks !== void 0) {
		if (!Array.isArray(parsed.externalSymbolicLinks)) throw new Error("Backup manifest externalSymbolicLinks must be an array.");
		for (const link of parsed.externalSymbolicLinks) {
			if (!isRecord(link) || typeof link.entryPath !== "string" || typeof link.linkpath !== "string") throw new Error("Backup manifest contains an invalid external symbolic link.");
			externalSymbolicLinks.push({
				entryPath: link.entryPath,
				linkpath: link.linkpath
			});
		}
	}
	return {
		schemaVersion: 1,
		archiveRoot: parsed.archiveRoot,
		createdAt: parsed.createdAt,
		runtimeVersion: typeof parsed.runtimeVersion === "string" && parsed.runtimeVersion.trim() ? parsed.runtimeVersion : "unknown",
		platform: typeof parsed.platform === "string" ? parsed.platform : "unknown",
		nodeVersion: typeof parsed.nodeVersion === "string" ? parsed.nodeVersion : "unknown",
		paths: isRecord(parsed.paths) ? {
			...parsed.paths.stateDir === void 0 ? {} : { stateDir: parseBackupManifestSourcePath(parsed.paths.stateDir, "state directory") },
			agentRoots: parseBackupManifestAgentRoots(parsed.paths.agentRoots)
		} : void 0,
		assets,
		sqliteSnapshots: parseBackupManifestSqliteSnapshots(parsed.sqliteSnapshots),
		...parsed.externalSymbolicLinks === void 0 ? {} : { externalSymbolicLinks }
	};
}
function isRootBackupManifestEntry(entryPath) {
	const parts = entryPath.split("/");
	return parts.length === 2 && parts[0] !== "" && parts[1] === "manifest.json";
}
function verifyBackupManifestEntries(manifest, entries) {
	const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
	const manifestEntryPath = path.posix.join(archiveRoot, "manifest.json");
	const normalizedEntries = [...entries];
	if (!entries.has(manifestEntryPath)) throw new Error(`Archive is missing manifest entry: ${manifestEntryPath}`);
	for (const entry of normalizedEntries) if (!isArchivePathWithin(entry, archiveRoot)) throw new Error(`Archive entry is outside the declared archive root: ${entry}`);
	const payloadRoot = path.posix.join(archiveRoot, "payload");
	for (const asset of manifest.assets) {
		const assetArchivePath = normalizeArchivePath(asset.archivePath, "Backup manifest asset path");
		if (!isArchivePathWithin(assetArchivePath, payloadRoot)) throw new Error(`Manifest asset path is outside payload root: ${asset.archivePath}`);
		if (!entries.has(assetArchivePath) && !normalizedEntries.some((entry) => isArchivePathWithin(entry, assetArchivePath))) throw new Error(`Archive is missing payload for manifest asset: ${assetArchivePath}`);
	}
}
/** The capture-time inventory, never today's filesystem, defines required database coverage. */
function verifyBackupSqliteCoverage(manifest, requiredSnapshots, verifiedSnapshots) {
	for (const required of [...manifest.sqliteSnapshots ?? [], ...requiredSnapshots]) {
		const expectedPath = buildBackupArchivePath(manifest.archiveRoot, required.sourcePath);
		if (!verifiedSnapshots.some((verified) => verified.archivePath === expectedPath && verified.role === required.role && (required.role === "global" || verified.role === "agent" && verified.agentId === required.agentId))) throw new Error(`Backup lacks verified canonical SQLite coverage for ${required.sourcePath}.`);
	}
}
//#endregion
export { verifyBackupManifestEntries as a, parseUpdateRecoveryBackupManifest as i, isRootBackupManifestEntry as n, verifyBackupSqliteCoverage as o, parseBackupManifest as r, backupManifestSizeError as t };
