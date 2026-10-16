import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as createPrivateSqliteDirectory } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { d as maintenanceOwnerHasSourceCustody, l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as SQLITE_SIDECAR_SUFFIXES } from "./sqlite-files-BEC3zbaw.mjs";
import { n as readUpdateRunDriver } from "./update-run-driver-k0LVIIq0.mjs";
import { t as createDoctorRehearsalDatabaseCoverage } from "./doctor-rehearsal-databases-jWB-feGw.mjs";
import { a as publishFileExclusive, c as sha256File, i as pinDirectory, l as syncDirectory, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { i as sameFileMutationFingerprint, t as copyFileHandle } from "./file-descriptor-B4yBUiAP.mjs";
import { f as openClawStateDatabaseCache } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot, o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { t as createConfigIO } from "./io.factory-DWrU5KGJ.mjs";
import { a as getUpdateRunAsync } from "./update-run-reader-B7x8dkVs.mjs";
import { o as isOpenClawAgentDatabaseOpen } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as readUpdateDatabaseGenerationsIsolated } from "./update-candidate-state-CO0vwfHU.mjs";
import { r as resolveBackupConfigCapture } from "./backup-config-capture-BOahK9f8.mjs";
import { u as preparePluginDoctorMigrationBackupResources } from "./doctor-contract-registry-BGRBWEIs.mjs";
import { a as UPDATE_CAPTURE_PRIVACY_MARKER_CONTENT, i as UPDATE_CAPTURE_PRIVACY_MARKER, n as isUpdateCapturePath, r as resolveUpdateCaptureRoot } from "./update-capture-paths-BuDS3zdN.mjs";
import { t as readUpdateDatabaseGenerations } from "./update-database-generations-BIwBejmj.mjs";
import { t as createUpdateDatabaseBackup } from "./update-database-backup-Db_62cRi.mjs";
import { i as parseUpdateRecoveryBackupManifest } from "./backup-verify-manifest-Bfrnp4oG.mjs";
import { n as ensurePrivateSnapshotRepositoryRoot } from "./local-repository-B-IjFY66.mjs";
import { t as collectDoctorSkillWorkshopBackupResources } from "./doctor-update-rehearsal-workshop-DagHO3Xj.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-recovery-baseline-capture.ts
function within(candidate, root) {
	const relative = path.relative(root, candidate);
	return relative === "" || !path.isAbsolute(relative) && relative !== ".." && !relative.startsWith(`..${path.sep}`);
}
function canonicalEntryPath(value) {
	const absolute = path.resolve(value);
	return path.join(resolvePathViaExistingAncestorSync(path.dirname(absolute)), path.basename(absolute));
}
async function statOrMissing(value) {
	try {
		return await fs.lstat(value, { bigint: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function markPrivateCapture(directory) {
	const marker = path.join(directory, UPDATE_CAPTURE_PRIVACY_MARKER);
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const output = _usingCtx$1.a(await fs.open(marker, "wx", 384));
			await output.writeFile(UPDATE_CAPTURE_PRIVACY_MARKER_CONTENT);
			await output.sync();
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch (error) {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
		if (await (await root(directory, {
			symlinks: "reject",
			hardlinks: "reject"
		})).readText(".openclaw-private-update-capture", { maxBytes: 128 }) !== "openclaw-private-update-capture-v1\n") throw new Error(`Private update capture marker changed: ${directory}`, { cause: error });
	}
	requireDirectorySync(await syncDirectory(directory), "Private update capture marker");
}
function maintenanceOwnerMayReadGenerationsInProcess(sharedStatePath, databasePaths) {
	const scope = getOpenClawDatabaseMaintenanceScope();
	return maintenanceOwnerHasSourceCustody(scope, sharedStatePath) && !openClawStateDatabaseCache.isOpenClawStateDatabaseOpen(sharedStatePath) && [...databasePaths].every((pathname) => maintenanceOwnerHasSourceCustody(scope, pathname) && !isOpenClawAgentDatabaseOpen(pathname));
}
/** Capture for manual recovery under the original invocation's live custody.
* Sources may remain active; final revalidation is not authority to restore them. */
function captureUpdateRecoveryBaseline(params) {
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("Fresh original-state capture requires the installed CLI.");
	return withArtifactPreservingStateReads(async () => {
		const runId = params.runId;
		if (!/^[a-zA-Z0-9_-]{1,128}$/u.test(runId)) throw new Error("Invalid original update capture run identity.");
		const env = { ...params.env };
		const sharedStatePath = resolveOpenClawStateSqlitePath(env);
		const assertCaller = params.assertCurrent;
		const rehearsal = createDoctorRehearsalDatabaseCoverage(params.env);
		const assertCurrent = () => {
			params.signal?.throwIfAborted();
			assertCaller();
			rehearsal?.assertCurrent();
		};
		assertCurrent();
		const configuration = await createConfigIO({
			env,
			configPath: resolveConfigPath(env),
			observe: false,
			pluginValidation: "core-only"
		}).readConfigFileSnapshotForWrite();
		assertCurrent();
		const snapshot = configuration.snapshot;
		if (path.resolve(snapshot.path) !== path.resolve(resolveConfigPath(env))) throw new Error("Original update capture changed its selected configuration path.");
		if (snapshot.exists && snapshot.raw === null) throw new Error("Original update configuration is unreadable.");
		const configCapture = await resolveBackupConfigCapture(configuration, {
			env,
			pluginValidation: "core-only"
		});
		assertCurrent();
		const creator = readUpdateRunDriver();
		if (!creator) throw new Error("Cannot identify the original update capture process.");
		const stateDir = resolvePathViaExistingAncestorSync(resolveStateDir(env));
		const configPath = canonicalEntryPath(snapshot.path);
		const store = resolveUpdateCaptureRoot(stateDir);
		const directory = path.join(store, runId);
		const installRoot = path.resolve(params.installRoot);
		const drivers = structuredClone([...params.drivers]);
		const createdAt = (/* @__PURE__ */ new Date()).toISOString();
		const configPaths = /* @__PURE__ */ new Set([configPath]);
		const resources = /* @__PURE__ */ new Map();
		const warnings = [];
		const declare = (pathname, kind) => {
			const canonical = canonicalEntryPath(pathname);
			if (within(canonical, store) || kind === "directory" && within(store, canonical) || isUpdateCapturePath(canonical, stateDir)) throw new Error(`An original capture cannot contain another capture: ${canonical}`);
			const previous = resources.get(canonical);
			if (previous && previous !== kind) throw new Error(`Conflicting original update resource kinds: ${canonical}`);
			resources.set(canonical, kind);
			return canonical;
		};
		declare(configPath, "file");
		for (const file of configCapture.files) {
			configPaths.add(declare(file.sourcePath, "file"));
			configPaths.add(declare(file.canonicalPath, "file"));
		}
		const collectResources = () => withOpenClawStateDatabaseReadSnapshot(async () => {
			const plugins = await preparePluginDoctorMigrationBackupResources({
				config: snapshot.sourceConfig,
				env,
				stateDir,
				warnings,
				requireLocalResources: true
			});
			const workshop = await collectDoctorSkillWorkshopBackupResources({
				config: snapshot.sourceConfig,
				env
			});
			plugins.assertCurrent();
			return [...plugins.resources, ...workshop];
		}, { env });
		const declared = await collectResources();
		assertCurrent();
		for (const resource of declared) declare(resource.path, resource.kind);
		await configCapture.revalidate();
		assertCurrent();
		const observed = /* @__PURE__ */ new Map();
		const entries = /* @__PURE__ */ new Map();
		const files = /* @__PURE__ */ new Map();
		const roots = new Set(resources.keys());
		const forcedSqlite = /* @__PURE__ */ new Set();
		const visit = async (pathname, declaredKind) => {
			const kind = declaredKind ?? resources.get(pathname);
			if (observed.has(pathname)) return;
			if (observed.size >= 1e6) throw new Error("Original update resource inventory exceeds its manifest bound.");
			assertCurrent();
			const stat = await statOrMissing(pathname);
			assertCurrent();
			observed.set(pathname, { stat });
			if (!stat) {
				if (kind === "sqlite") forcedSqlite.add(pathname);
				entries.set(pathname, {
					kind: "missing",
					sourcePath: pathname,
					sqlite: kind === "sqlite",
					directory: kind === "directory"
				});
				return;
			}
			if (stat.isSymbolicLink()) {
				const target = await fs.readlink(pathname);
				observed.set(pathname, {
					stat,
					target
				});
				const entry = {
					kind: "symlink",
					sourcePath: pathname,
					target
				};
				entries.set(pathname, entry);
				if (kind) {
					const contentPath = await fs.realpath(pathname).catch((error) => {
						if (!hasErrnoCode(error, "ENOENT")) throw error;
						return canonicalEntryPath(path.resolve(path.dirname(pathname), target));
					});
					if (contentPath === pathname) throw new Error(`Original update resource link is cyclic: ${pathname}`);
					roots.add(contentPath);
					if (configPaths.has(pathname)) {
						entry.contentPath = contentPath;
						configPaths.add(contentPath);
					}
					await visit(contentPath, kind);
				}
				return;
			}
			if (kind === "sqlite") forcedSqlite.add(pathname);
			if (stat.isDirectory()) {
				if (isUpdateCapturePath(pathname, stateDir)) throw new Error(`Original update resource contains a private capture: ${pathname}`);
				if (kind && kind !== "directory") throw new Error(`Original update resource is unexpectedly a directory: ${pathname}`);
				const names = (await fs.readdir(pathname)).toSorted();
				observed.set(pathname, {
					stat,
					names
				});
				entries.set(pathname, {
					kind: "directory",
					sourcePath: pathname,
					mode: Number(stat.mode & 511n)
				});
				for (const name of names) await visit(path.join(pathname, name));
			} else if (stat.isFile() && kind !== "directory") files.set(pathname, stat);
			else throw new Error(`Original update resource has an unsupported file kind: ${pathname}`);
		};
		for (const [pathname, kind] of resources) await visit(pathname, kind);
		assertCurrent();
		await ensurePrivateSnapshotRepositoryRoot(store);
		await markPrivateCapture(store);
		assertCurrent();
		await createPrivateSqliteDirectory(directory);
		const pin = await pinDirectory(directory);
		try {
			await markPrivateCapture(directory);
			await createPrivateSqliteDirectory(path.join(directory, "payload"));
			requireDirectorySync(await syncDirectory(store), "Original update capture root");
			assertCurrent();
			const databases = await createUpdateDatabaseBackup({
				backupRoot: path.join(directory, "database"),
				stateDir,
				config: snapshot.sourceConfig,
				env,
				signal: params.signal,
				nodeRunner: params.nodeRunner,
				timeoutMs: params.timeoutMs,
				acquisition: params.acquisition,
				preserveSourceArtifacts: true,
				additionalPaths: [...forcedSqlite],
				additionalFiles: [...files.keys()].filter((pathname) => !configPaths.has(pathname)),
				rehearsal
			});
			assertCurrent();
			const databasePaths = /* @__PURE__ */ new Set([...databases.databases.map((file) => file.path), ...databases.missingPaths]);
			const databaseSpellings = /* @__PURE__ */ new Set([...databasePaths, ...databases.sourcePaths.map(canonicalEntryPath)]);
			const databaseOwners = databases.databaseOwners;
			if (!databaseOwners) throw new Error("Original update database ownership inventory is unavailable.");
			for (const pathname of [...databases.sourcePaths, ...databasePaths]) {
				const canonical = canonicalEntryPath(pathname);
				roots.add(canonical);
				await visit(canonical, "sqlite");
			}
			const sidecars = new Set([...databaseSpellings].flatMap((file) => SQLITE_SIDECAR_SUFFIXES.map((suffix) => file + suffix)));
			let payloadIndex = 0;
			for (const file of databases.databases) {
				const archivePath = `payload/${payloadIndex++}`;
				const payloadPath = path.join(directory, archivePath);
				const sourceIdentity = await fs.lstat(file.snapshotPath, { bigint: true });
				assertCurrent();
				await pin.assertCurrent();
				assertCurrent();
				const publication = await publishFileExclusive({
					sourcePath: file.snapshotPath,
					targetPath: payloadPath,
					expectedSourceIdentity: sourceIdentity,
					strategy: "rename-noreplace",
					onSyncFailure: "preserve"
				});
				assertCurrent();
				requireDirectorySync(publication.directorySync, "Original database payload publication");
				requireDirectorySync(await syncDirectory(path.dirname(file.snapshotPath)), "Original database snapshot removal");
				assertCurrent();
				const content = await sha256File(payloadPath);
				if (content.digest !== file.sha256 || content.bytes !== file.sizeBytes) throw new Error(`Original database payload changed: ${file.path}`);
				const stat = files.get(file.path);
				if (!stat) throw new Error(`Original database disappeared during capture: ${file.path}`);
				entries.set(file.path, {
					kind: "file",
					sourcePath: file.path,
					archivePath,
					size: file.sizeBytes,
					sha256: file.sha256,
					sqlite: true,
					mode: Number(stat.mode & 511n)
				});
			}
			for (const [pathname, before] of files) try {
				var _usingCtx3 = _usingCtx();
				if (databaseSpellings.has(pathname) || sidecars.has(pathname) || rehearsal?.excludes(pathname)) continue;
				assertCurrent();
				await pin.assertCurrent();
				assertCurrent();
				const sourceRoot = await root(path.dirname(pathname));
				assertCurrent();
				const source = await sourceRoot.open(path.basename(pathname), {
					symlinks: "reject",
					hardlinks: "allow"
				});
				const archivePath = `payload/${payloadIndex++}`;
				const handle = _usingCtx3.a(source.handle);
				const opened = await handle.stat({ bigint: true });
				if (!sameFileMutationFingerprint(before, opened)) throw new Error(`Original update file changed before capture: ${pathname}`);
				assertCurrent();
				const output = _usingCtx3.a(await fs.open(path.join(directory, archivePath), "wx+", 384));
				await copyFileHandle(handle, output, { assertBeforeMutation: assertCurrent });
				if (!sameFileMutationFingerprint(opened, await handle.stat({ bigint: true }))) throw new Error(`Original update file changed during capture: ${pathname}`);
				await output.sync();
				const content = await sha256File(output);
				entries.set(pathname, {
					kind: "file",
					sourcePath: pathname,
					archivePath,
					size: content.bytes,
					sha256: content.digest,
					sqlite: false,
					mode: Number(before.mode & 511n)
				});
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				await _usingCtx3.d();
			}
			await configCapture.revalidate();
			if (!isDeepStrictEqual(await collectResources(), declared)) throw new Error("Original update migration resource inventory changed during capture.");
			assertCurrent();
			const generations = params.acquisition?.mode === "maintenance-owner" && maintenanceOwnerMayReadGenerationsInProcess(sharedStatePath, databasePaths) ? readUpdateDatabaseGenerations([...databasePaths]) : await readUpdateDatabaseGenerationsIsolated([...databasePaths], {
				env,
				signal: params.signal,
				timeoutMs: params.timeoutMs,
				acquisition: params.acquisition
			});
			const unverified = [...databasePaths].flatMap((pathname) => !Object.hasOwn(databases.sourceGenerations, pathname) ? [[pathname, "no stable generation was recorded during its snapshot."]] : databases.sourceGenerations[pathname] !== generations[pathname] ? [[pathname, "generation changed after its snapshot."]] : []);
			if (unverified.length) throw new Error([
				"Original database generation changed or could not be verified; capture is unsealed.",
				...unverified.map(([pathname, reason]) => `${pathname}: ${reason}`),
				...databases.warnings.filter((warning) => unverified.some(([pathname]) => warning.includes(pathname)))
			].join("\n"));
			for (const [pathname, before] of observed) {
				if (databaseSpellings.has(pathname) || sidecars.has(pathname)) continue;
				const current = await statOrMissing(pathname);
				if (before.stat ? !current || !sameFileMutationFingerprint(before.stat, current) || current.mode !== before.stat.mode : current !== void 0) throw new Error(`Original update resource changed during capture: ${pathname}`);
				if (before.names && !isDeepStrictEqual((await fs.readdir(pathname)).toSorted(), before.names)) throw new Error(`Original update directory changed during capture: ${pathname}`);
				if (before.target !== void 0 && await fs.readlink(pathname) !== before.target) throw new Error(`Original update resource link changed during capture: ${pathname}`);
			}
			const boundedWarnings = warnings.slice(0, 32).map((warning) => ({
				kind: warning.kind,
				pluginId: warning.pluginId,
				message: truncateUtf16Safe(warning.message, 500)
			}));
			const manifest = {
				schemaVersion: 2,
				kind: "update-recovery",
				generation: { kind: "baseline" },
				runId,
				installRoot,
				stateDir,
				configPath,
				configPaths: [...configPaths].toSorted(),
				creator,
				drivers,
				createdAt,
				roots: [...roots].filter((pathname) => !rehearsal?.excludes(pathname)).toSorted(),
				excludedRoots: [.../* @__PURE__ */ new Set([...rehearsal?.paths ?? [], ...[...observed.keys()].filter((pathname) => rehearsal?.excludes(pathname))])].toSorted(),
				protectedPaths: [...resources.keys()].filter((pathname) => !rehearsal?.excludes(pathname)).toSorted(),
				databases: databaseOwners,
				entries: [...entries.values()].filter((entry) => !sidecars.has(entry.sourcePath) && !rehearsal?.excludes(entry.sourcePath)).toSorted((a, b) => a.sourcePath.localeCompare(b.sourcePath)),
				...boundedWarnings.length ? { warnings: boundedWarnings } : {}
			};
			const raw = `${JSON.stringify(manifest)}\n`;
			if (Buffer.byteLength(raw) > 134217728) throw new Error("Original update capture exceeds its manifest size bound.");
			parseUpdateRecoveryBackupManifest(raw);
			assertCurrent();
			await pin.assertCurrent();
			requireDirectorySync(await syncDirectory(path.join(directory, "payload")), "Original update payloads");
			const manifestPath = path.join(directory, "manifest.json");
			const temporaryManifestPath = path.join(directory, "manifest.json.partial");
			let manifestIdentity;
			try {
				var _usingCtx4 = _usingCtx();
				assertCurrent();
				const output = _usingCtx4.a(await fs.open(temporaryManifestPath, "wx", 384));
				assertCurrent();
				await output.writeFile(raw);
				assertCurrent();
				await output.sync();
				manifestIdentity = await output.stat({ bigint: true });
			} catch (_) {
				_usingCtx4.e = _;
			} finally {
				await _usingCtx4.d();
			}
			await pin.assertCurrent();
			assertCurrent();
			const publication = await publishFileExclusive({
				sourcePath: temporaryManifestPath,
				targetPath: manifestPath,
				expectedSourceIdentity: manifestIdentity,
				parentReceipt: pin.receipt,
				strategy: "rename-noreplace",
				onSyncFailure: "preserve"
			});
			requireDirectorySync(publication.directorySync, "Original update capture seal");
			assertCurrent();
			return {
				ref: {
					directory,
					manifestPath,
					manifestSha256: sha256Hex(raw)
				},
				warnings: boundedWarnings,
				diagnostics: { databaseWarnings: databases.warnings }
			};
		} catch (cause) {
			throw new Error(`Original update capture failed; evidence retained at ${directory}`, { cause });
		} finally {
			await pin.close();
		}
	});
}
const STANDALONE_DOCTOR_CAPTURE_RETENTION_MS = 2592e6;
/** Only sealed, unassociated standalone originals are eligible for retirement. */
async function retireExpiredStandaloneDoctorCaptures(params) {
	const retired = [];
	const warnings = [];
	const root = resolveUpdateCaptureRoot(params.stateDir);
	const now = params.now ?? Date.now();
	let names;
	try {
		names = await fs.readdir(root);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) warnings.push(`Standalone Doctor capture retirement unavailable at ${root}: ${formatErrorMessage(error)}`);
		return {
			retired,
			warnings
		};
	}
	for (const name of names.toSorted()) {
		if (name === params.keepRunId || !/^doctor-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u.test(name)) continue;
		const directory = path.join(root, name);
		try {
			const entry = await fs.lstat(directory);
			if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
			let raw;
			try {
				raw = await fs.readFile(path.join(directory, "manifest.json"), "utf8");
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) continue;
				throw error;
			}
			const manifest = parseUpdateRecoveryBackupManifest(raw);
			const createdAt = Date.parse(manifest.createdAt);
			if (manifest.runId !== name || manifest.schemaVersion !== 2 || manifest.generation?.kind !== "baseline" || !Number.isFinite(createdAt) || now - createdAt <= STANDALONE_DOCTOR_CAPTURE_RETENTION_MS || await statOrMissing(path.join(directory, "outcome.json")) || await getUpdateRunAsync(manifest.runId, { path: path.join(params.stateDir, "state", "openclaw.sqlite") }) !== void 0) continue;
			params.assertCurrent();
			await fs.rm(directory, { recursive: true });
			retired.push(directory);
		} catch (error) {
			warnings.push(`Standalone Doctor capture retained at ${directory}: ${formatErrorMessage(error)}`);
		}
	}
	return {
		retired,
		warnings
	};
}
//#endregion
export { captureUpdateRecoveryBaseline, retireExpiredStandaloneDoctorCaptures };
