import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { Et as _enum, Jn as string, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/infra/database-port-recovery.ts
const count = number().int().nonnegative();
const hash$1 = string().regex(/^[a-f0-9]{64}$/);
const absolutePath = string().refine((value) => path.isAbsolute(value) && !value.includes("://"));
const databasePortArtifactSchema = strictObject({
	path: absolutePath,
	sha256: hash$1,
	size: count
});
const location = discriminatedUnion("engine", [strictObject({
	engine: literal("sqlite"),
	path: absolutePath
}), strictObject({
	engine: literal("postgres"),
	anchorPath: absolutePath,
	namespace: string().regex(/^[a-z_][a-z0-9_]*$/)
})]);
const target = strictObject({
	storeId: uuid(),
	sourceSchemaVersion: count,
	targetSchemaVersion: count,
	descriptorHash: hash$1,
	original: location,
	intended: location,
	originalCapture: databasePortArtifactSchema,
	verification: strictObject({
		contentHash: hash$1,
		catalogHash: hash$1,
		allocationHash: hash$1,
		rowCount: count,
		ownerAdmitted: literal(true)
	}).nullable()
});
const manifestSchema = strictObject({
	version: literal(1),
	operationId: uuid(),
	revision: number().int().positive(),
	state: _enum([
		"preparing",
		"publishing",
		"complete"
	]),
	outcome: _enum(["ported", "rolled-back"]).optional(),
	root: strictObject({
		stateDir: absolutePath,
		dev: string().regex(/^\d+$/),
		ino: string().regex(/^\d+$/)
	}),
	direction: strictObject({
		from: _enum(["sqlite", "postgres"]),
		to: _enum(["sqlite", "postgres"])
	}),
	originalConfig: array(databasePortArtifactSchema).min(1),
	artifacts: array(databasePortArtifactSchema),
	targets: array(target).min(1)
}).superRefine((value, ctx) => {
	if (value.direction.from === value.direction.to || new Set(value.targets.map((entry) => entry.storeId)).size !== value.targets.length || value.targets.some((entry) => entry.original.engine !== value.direction.from || entry.intended.engine !== value.direction.to || value.state !== "preparing" && value.outcome !== "rolled-back" && !entry.verification) || value.state === "complete" !== Boolean(value.outcome)) ctx.addIssue({
		code: "custom",
		message: "Invalid database port manifest state"
	});
});
/** Port recovery requires durable directories and atomic replacement of existing SQLite files. */
function assertDatabasePortPlatformSupported() {
	if (process.platform === "win32") throw new Error("Native Windows does not support SQLite ↔ PostgreSQL database port yet. Existing data and engine selection stay unchanged. Start with a fresh PostgreSQL setup on Windows, or run the port on Linux or macOS.");
}
function databasePortManifestPath(stateDir) {
	return path.join(stateDir, "recovery", "database-port", "manifest.json");
}
var DatabasePortRecoveryError = class extends Error {};
function refusal(stateDir) {
	const manifestPath = databasePortManifestPath(stateDir);
	const quoted = `'${manifestPath.replaceAll("'", "'\\''")}'`;
	return new DatabasePortRecoveryError(`Database port recovery required at ${manifestPath}. Run openclaw database port --resume ${quoted} or openclaw database port --rollback ${quoted}.`);
}
function readManifest(stateDir) {
	let raw;
	try {
		raw = fs.readFileSync(databasePortManifestPath(stateDir), {
			encoding: "utf8",
			flag: fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW
		});
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw refusal(stateDir);
	}
	try {
		return manifestSchema.parse(JSON.parse(raw));
	} catch {
		throw refusal(stateDir);
	}
}
function assertDatabasePortStartupAllowed(stateDir) {
	const manifest = readManifest(stateDir);
	if (manifest && (manifest.state !== "complete" || manifest.root.stateDir !== stateDir)) throw refusal(stateDir);
}
function assertPrivate(filePath, directory) {
	const stat = fs.lstatSync(filePath);
	if ((directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1) || (stat.mode & 511) !== (directory ? 448 : 384) || process.getuid && stat.uid !== process.getuid()) throw new Error(`Database port recovery path must be privately owned: ${filePath}`);
}
function assertRoot(stateDir, manifest) {
	const stat = fs.lstatSync(stateDir, { bigint: true });
	const identity = {
		stateDir,
		dev: String(stat.dev),
		ino: String(stat.ino)
	};
	if (!stat.isDirectory() || JSON.stringify(manifest.root) !== JSON.stringify(identity)) throw refusal(stateDir);
}
/** Called only after physical custody has been acquired. */
function assertDatabasePortRecoveryAllowed(stateDir, intent) {
	const fixedPath = databasePortManifestPath(stateDir);
	const manifest = readManifest(stateDir);
	if (intent.manifestPath !== fixedPath || !manifest || manifest.operationId !== intent.operationId || manifest.state === "complete" && intent.action !== "resume" || intent.action !== "resume" && intent.action !== "rollback") throw refusal(stateDir);
	assertRoot(stateDir, manifest);
	assertPrivate(path.dirname(path.dirname(fixedPath)), true);
	assertPrivate(path.dirname(fixedPath), true);
	assertPrivate(fixedPath, false);
	return manifest;
}
function syncDatabasePortPath(pathname) {
	const fd = fs.openSync(pathname, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
	try {
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
}
function ensurePrivateDirectory(directory) {
	try {
		fs.mkdirSync(directory, { mode: 448 });
		syncDatabasePortPath(path.dirname(directory));
	} catch (error) {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	}
	assertPrivate(directory, true);
}
/** Private recovery artifacts and manifest revisions share one durable publication primitive. */
function writeDatabasePortArtifact(filePath, contents, assertCustody, replace = false) {
	const temporary = path.join(path.dirname(filePath), `.manifest-${randomUUID()}.tmp`);
	const fd = fs.openSync(temporary, "wx", 384);
	try {
		try {
			fs.writeFileSync(fd, contents);
			fs.fsyncSync(fd);
		} finally {
			fs.closeSync(fd);
		}
		assertCustody();
		if (replace) fs.renameSync(temporary, filePath);
		else {
			fs.linkSync(temporary, filePath);
			fs.unlinkSync(temporary);
		}
		syncDatabasePortPath(path.dirname(filePath));
	} finally {
		fs.rmSync(temporary, { force: true });
	}
}
function prepareDatabasePortDirectory(stateDir, operationId) {
	const parent = path.dirname(databasePortManifestPath(stateDir));
	const directory = path.join(parent, uuid().parse(operationId));
	for (const entry of [
		path.dirname(parent),
		parent,
		directory
	]) ensurePrivateDirectory(entry);
	return directory;
}
function writeAtomic(filePath, manifest, assertCustody) {
	writeDatabasePortArtifact(filePath, `${JSON.stringify(manifest)}\n`, assertCustody, true);
}
/** The caller holds offline custody; every revision is durable before returning. */
function writeDatabasePortManifest(stateDir, input, assertCustody) {
	const manifest = manifestSchema.parse(input);
	assertCustody();
	assertRoot(stateDir, manifest);
	const fixedPath = databasePortManifestPath(stateDir);
	ensurePrivateDirectory(path.dirname(path.dirname(fixedPath)));
	ensurePrivateDirectory(path.dirname(fixedPath));
	const previous = readManifest(stateDir);
	if (previous) {
		assertPrivate(fixedPath, false);
		const immutable = (value) => JSON.stringify({
			operationId: value.operationId,
			root: value.root,
			direction: value.direction,
			originalConfig: value.originalConfig,
			targets: value.targets.map(({ verification: _verification, ...entry }) => entry)
		});
		const states = [
			"preparing",
			"publishing",
			"complete"
		];
		if (immutable(previous) !== immutable(manifest) || manifest.revision !== previous.revision + 1 || previous.state === "complete" || states.indexOf(manifest.state) < states.indexOf(previous.state) || states.indexOf(manifest.state) > states.indexOf(previous.state) + 1 && !(previous.state === "preparing" && manifest.outcome === "rolled-back") || previous.artifacts.some((artifact) => !manifest.artifacts.some((next) => JSON.stringify(next) === JSON.stringify(artifact)))) throw refusal(stateDir);
	} else if (manifest.state !== "preparing" || manifest.revision !== 1) throw refusal(stateDir);
	writeAtomic(fixedPath, manifest, assertCustody);
}
function archiveDatabasePortManifest(stateDir, operationId, assertCustody) {
	assertCustody();
	const manifest = readManifest(stateDir);
	if (!manifest || manifest.state !== "complete" || manifest.operationId !== operationId) throw refusal(stateDir);
	assertRoot(stateDir, manifest);
	const fixedPath = databasePortManifestPath(stateDir);
	assertPrivate(path.dirname(path.dirname(fixedPath)), true);
	assertPrivate(path.dirname(fixedPath), true);
	assertPrivate(fixedPath, false);
	const directory = path.join(path.dirname(fixedPath), operationId);
	ensurePrivateDirectory(directory);
	const archived = path.join(directory, "manifest.json");
	writeAtomic(archived, manifest, assertCustody);
	assertCustody();
	fs.unlinkSync(fixedPath);
	syncDatabasePortPath(path.dirname(fixedPath));
	return archived;
}
//#endregion
export { assertDatabasePortStartupAllowed as a, prepareDatabasePortDirectory as c, writeDatabasePortManifest as d, assertDatabasePortRecoveryAllowed as i, syncDatabasePortPath as l, archiveDatabasePortManifest as n, databasePortArtifactSchema as o, assertDatabasePortPlatformSupported as r, databasePortManifestPath as s, DatabasePortRecoveryError as t, writeDatabasePortArtifact as u };
