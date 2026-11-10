import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { i as resolveConfigEnvVars } from "./env-substitution-4XQMuGXB.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as parseJsonWithJson5Fallback } from "./parse-json-compat-BBtWoq5_.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, lr as uuid } from "./schemas-BOYIvvln.mjs";
import { l as hasActiveGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { n as createSqliteWalCheckpoint } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import "./worker-task-pool-D6ogd941.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { i as withConfigWriteLock } from "./write-lock-BlX1pI0w.mjs";
import { r as setConfigValueAtPath } from "./config-paths-BvomE-N1.mjs";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-Dmwzhxit.mjs";
import { b as writeConfigFile, l as readConfigFileSnapshotForWrite } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { c as prepareDatabasePortDirectory, d as writeDatabasePortManifest, i as assertDatabasePortRecoveryAllowed, l as syncDatabasePortPath, n as archiveDatabasePortManifest, o as databasePortArtifactSchema, r as assertDatabasePortPlatformSupported, s as databasePortManifestPath, u as writeDatabasePortArtifact } from "./database-port-recovery-DeW0rW16.mjs";
import { i as prepareVerifiedSqliteFile, r as createVerifiedSqliteSnapshot } from "./sqlite-snapshot-u13JUemz.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { t as resolveDatabaseEngineInput } from "./config-Df1l-yPz.mjs";
import { C as materializeDatabasePort, S as inspectSqlitePortSchema, b as DatabasePortDataError, i as capturePostgresBackup, n as captureDatabaseArtifact, o as preparePostgresRestore, s as readBackupEngine, t as assertDatabaseArtifact, v as loadWorkboardPortDescriptor, w as readPostgresPortCapabilities, x as inspectDatabasePort, y as withWorkboardPostgres } from "./database-backup-EzQ2PUMu.mjs";
import { r as discoverBackupDatabasePaths } from "./backup-sqlite-snapshot-DTRlR6jv.mjs";
import { t as collectIncludePathsRecursive } from "./includes-scan-B5IjbhSm.mjs";
import { n as assertDoctorSqliteMaintenancePathsNotAliased } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { parentPort, workerData } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/database-engine/port-command.worker.ts
var WorkboardPortError = class extends Error {};
function workboardApi() {
	return loadBundledPluginPublicArtifactModuleSync({
		dirName: "workboard",
		artifactBasename: "database-port-api.js"
	}).workboardDatabasePortApi;
}
function refuse$1(fact) {
	throw new DatabasePortDataError(fact);
}
function compare(actual, expected) {
	if (!isDeepStrictEqual(actual, expected)) refuse$1("observed changed canonical rows or allocations; required recorded verification");
}
async function inspectSqlite(sourcePath, descriptor, allowMigration = false) {
	const prepared = prepareSqliteReadOnlyLocationSync(sourcePath);
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			const db = _usingCtx$1.u(openNodeSqliteDatabase(prepared.location, {
				readOnly: true,
				readBigInts: true
			}));
			const { version, migrationRequired, pendingColumns } = workboardApi().inspectWorkboardPortSource(db);
			if (allowMigration && migrationRequired) {
				inspectSqlitePortSchema(db, descriptor, pendingColumns);
				return {
					version,
					migrationRequired
				};
			}
			const { tables, allocations } = await inspectDatabasePort({
				engine: "sqlite",
				db
			}, descriptor);
			return {
				version,
				migrationRequired,
				verification: {
					tables,
					allocations
				}
			};
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	} finally {
		prepared.cleanup();
	}
}
async function inspectPostgres(db, descriptor, identity, verifyDefinitions = true) {
	if (!(await db.query("SELECT nspowner = (SELECT oid FROM pg_roles WHERE rolname = current_user) AS owned FROM pg_namespace WHERE nspname = $1", [identity.namespace])).rows[0]?.owned) refuse$1("observed missing namespace or different owner; required namespace owned by the configured role");
	await db.query("SET row_security = off");
	const { tables, allocations } = await inspectDatabasePort({
		engine: "postgres",
		db,
		namespace: identity.namespace
	}, descriptor, identity.storeId, verifyDefinitions);
	return {
		tables,
		allocations
	};
}
async function preflight$1(task, assertCurrent) {
	return withWorkboardPostgres(task.config, async (db, descriptor) => {
		const facts = await readPostgresPortCapabilities(db, descriptor);
		if (task.probe) {
			const namespace = task.namespace ?? `port_probe_${randomUUID().replaceAll("-", "")}`;
			await db.query("BEGIN");
			try {
				assertCurrent();
				await db.query(`CREATE SCHEMA "${namespace}"; CREATE TABLE "${namespace}".probe (n INTEGER); INSERT INTO "${namespace}".probe VALUES (1); SELECT n FROM "${namespace}".probe; DROP TABLE "${namespace}".probe; DROP SCHEMA "${namespace}"`);
			} catch {
				refuse$1("observed failed namespace privilege probe; required CREATE, INSERT, SELECT and DROP privileges");
			} finally {
				await db.query("ROLLBACK");
			}
		}
		return {
			...facts,
			privilegesChecked: task.probe
		};
	});
}
async function stage(task, descriptor, assertCurrent) {
	const { migrationRequired, verification } = await inspectSqlite(task.sourcePath, descriptor);
	if (migrationRequired || !verification) refuse$1("observed unmigrated private source; required migrate phase before staging");
	if (task.sourceVerification) compare(verification, task.sourceVerification);
	if (await fs$1.stat(task.targetPath).then(() => true, (error) => hasErrnoCode(error, "ENOENT") ? false : Promise.reject(new Error("Unable to inspect staging target", { cause: error })))) {
		if (!task.resume) refuse$1("observed occupied target file; required absent private staging path");
		const { targetPath: sourcePath, to: engine } = task;
		try {
			await verify$1({
				...task,
				operation: "verify",
				sourcePath,
				engine,
				verification
			}, descriptor);
			return verification;
		} catch {
			for (const suffix of [
				"",
				"-wal",
				"-shm",
				"-journal"
			]) {
				assertCurrent();
				await fs$1.rm(task.targetPath + suffix, { force: true });
			}
		}
	}
	if (task.to === "postgres") try {
		var _usingCtx3 = _usingCtx();
		try {
			await withWorkboardPostgres(task.config, async (db) => {
				try {
					var _usingCtx4 = _usingCtx();
					if ((await db.query("SELECT 1 FROM pg_namespace WHERE nspname = $1", [task.namespace])).rowCount) {
						if (!task.resume) refuse$1("observed occupied target namespace; required fresh namespace");
						compare(await inspectPostgres(db, descriptor, task), verification);
						return;
					}
					await preflight$1({
						operation: "preflight",
						config: task.config,
						probe: true,
						namespace: task.namespace
					}, assertCurrent);
					const image = _usingCtx4.u(openNodeSqliteDatabase(task.sourcePath, {
						readOnly: true,
						readBigInts: true
					}));
					compare(await materializeDatabasePort({
						source: {
							engine: "sqlite",
							db: image
						},
						destination: {
							engine: "postgres",
							db,
							namespace: task.namespace
						},
						descriptor,
						storeId: task.storeId,
						assertCurrent
					}), verification);
				} catch (_) {
					_usingCtx4.e = _;
				} finally {
					_usingCtx4.d();
				}
			});
		} catch (error) {
			if (error instanceof DatabasePortDataError) throw error;
		}
		await withWorkboardPostgres(task.config, async (db) => compare(await inspectPostgres(db, descriptor, task), verification));
		assertCurrent();
		await fs$1.writeFile(task.targetPath, "", {
			flag: "wx",
			mode: 384
		});
		const anchor = _usingCtx3.u(openNodeSqliteDatabase(task.targetPath));
		anchor.exec("CREATE TABLE openclaw_engine_anchor (store_id TEXT NOT NULL, engine TEXT NOT NULL CHECK (engine = 'postgres'), schema TEXT NOT NULL)");
		anchor.prepare("INSERT INTO openclaw_engine_anchor VALUES (?, 'postgres', ?)").run(task.storeId, task.namespace);
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
	else {
		const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
		await createVerifiedSqliteSnapshot({
			sourcePath: task.sourcePath,
			targetPath: task.targetPath,
			preserveRowIds: true
		});
	}
	assertCurrent();
	workboardApi().admitWorkboardPort(task.targetPath, task.to === "postgres" ? await resolveDatabaseEngineInput(task.config) : void 0);
	if (task.to === "sqlite") compare((await inspectSqlite(task.targetPath, descriptor)).verification, verification);
	return verification;
}
async function verify$1(task, descriptor) {
	const engine = readBackupEngine(task.sourcePath);
	if (engine.engine !== task.engine || engine.engine === "postgres" && (engine.storeId !== task.storeId || engine.namespace !== task.namespace)) refuse$1("observed mismatched anchor identity; required recorded engine, store UUID and namespace");
	compare(task.engine === "postgres" ? await withWorkboardPostgres(task.config, (db) => inspectPostgres(db, descriptor, task)) : (await inspectSqlite(task.sourcePath, descriptor)).verification, task.verification);
}
async function execute(task, assertCurrent) {
	if (task.operation === "preflight") return preflight$1(task, assertCurrent);
	if (task.operation === "checkpoint") try {
		var _usingCtx5 = _usingCtx();
		const db = _usingCtx5.u(openNodeSqliteDatabase(task.sourcePath));
		assertCurrent();
		if (!createSqliteWalCheckpoint(db, { databasePath: task.sourcePath }, 0).checkpoint("TRUNCATE")) refuse$1("observed busy SQLite WAL; required all readers and writers stopped");
		return;
	} catch (_) {
		_usingCtx5.e = _;
	} finally {
		_usingCtx5.d();
	}
	const descriptor = await loadWorkboardPortDescriptor();
	const descriptorHash = createHash("sha256").update(JSON.stringify(descriptor)).digest("hex");
	if (task.operation === "inspect") {
		const engine = readBackupEngine(task.sourcePath);
		const facts = engine.engine === "postgres" ? await withWorkboardPostgres(task.config, async (db) => ({
			version: descriptor.version,
			migrationRequired: false,
			verification: await inspectPostgres(db, descriptor, engine, false)
		})) : await inspectSqlite(task.sourcePath, descriptor, true);
		return {
			...engine,
			...facts,
			descriptorHash,
			targetVersion: descriptor.version
		};
	}
	if (task.operation === "migrate") {
		await inspectSqlite(task.sourcePath, descriptor, true);
		assertCurrent();
		workboardApi().admitWorkboardPort(task.sourcePath);
	}
	if (task.operation === "migrate" || task.operation === "stage") return {
		descriptorHash,
		verification: task.operation === "stage" ? await stage(task, descriptor, assertCurrent) : (await inspectSqlite(task.sourcePath, descriptor)).verification
	};
	return verify$1(task, descriptor);
}
/** Joins the one-shot native worker before the caller may publish any active pathname. */
async function runWorkboardPortTask(task, scope) {
	scope.assertCurrent();
	const { WorkerTaskPool } = await import("./worker-task-pool-CvM7d10Q.mjs");
	const pool = new WorkerTaskPool({
		workerUrl: new URL(import.meta.url),
		maxWorkers: 1,
		workerOptions: { workerData: { openclawPortCommand: true } }
	});
	try {
		const result = await pool.run(task, { signal: scope.signal });
		scope.assertCurrent();
		return result;
	} catch (error) {
		if (error instanceof WorkerTaskError && error.code === "failed" && error.message.startsWith(`${task.operation}: `)) throw new WorkboardPortError(error.message);
		throw error;
	} finally {
		await pool.close();
	}
}
if (parentPort && workerData?.openclawPortCommand === true) {
	const { serveWorkerTasks } = await import("./worker-task-server-BxttNAkS.mjs");
	serveWorkerTasks((value, _channel, control) => control.runNativeSection(async () => {
		const task = value;
		try {
			return await execute(task, control.throwIfCancelled);
		} catch (error) {
			const fact = error instanceof DatabasePortDataError || error instanceof workboardApi().WorkboardPortSchemaError ? error.message : "observed database validation or I/O failure; required readable, valid data and namespace privileges";
			throw new Error(`${task.operation}: ${"sourcePath" in task ? task.sourcePath : "workboard"}: ${fact}. Stop the Gateway, correct the source or connection, then retry or use the retained recovery manifest.`, { cause: error });
		}
	}));
}
//#endregion
//#region src/commands/doctor-database-port-context.ts
const inputsSchema = object({
	originalEngine: string().nullable(),
	remainingSqlite: array(string()),
	stores: array(object({
		dev: string(),
		ino: string(),
		image: string(),
		original: databasePortArtifactSchema
	}))
});
function refuse(ctx, observed, required) {
	throw new WorkboardPortError(`Database port ${ctx.phase}: ${ctx.target}; observed ${observed}; required ${required}. Stop the Gateway first; correct this fact and retry, or use --resume/--rollback with ${databasePortManifestPath(ctx.stateDir)}.`);
}
const digest = (value) => createHash("sha256").update(stableStringify(value)).digest("hex");
function manifest(ctx) {
	return ctx.manifest;
}
function storeAt(ctx, index) {
	return {
		target: manifest(ctx).targets[index],
		input: ctx.inputs.stores[index]
	};
}
const storeDirectory = (ctx, index) => path.join(ctx.directory, String(index));
const stagePath = (ctx, index) => path.join(storeDirectory(ctx, index), "target.sqlite");
const livePath = (target) => target.original.engine === "sqlite" ? target.original.path : target.original.anchorPath;
function revise(ctx) {
	const current = manifest(ctx);
	current.revision++;
	writeDatabasePortManifest(ctx.stateDir, current, ctx.assertCurrent);
}
async function record(ctx, file, value) {
	const contents = `${JSON.stringify(value)}\n`;
	if (fs.existsSync(file)) {
		if (fs.readFileSync(file, "utf8") !== contents) refuse(ctx, "changed private artifact", "recorded artifact contents");
	} else writeDatabasePortArtifact(file, contents, ctx.assertCurrent);
	manifest(ctx).artifacts.push(await captureDatabaseArtifact(file));
	revise(ctx);
}
function privatePaths(ctx, files) {
	for (const file of files) {
		ctx.target = file;
		try {
			assertDoctorSqliteMaintenancePathsNotAliased("database port", [file], [ctx.stateDir, path.dirname(ctx.configPath)]);
		} catch {
			refuse(ctx, "aliased or inaccessible path", "an owned path without symbolic or hard links");
		}
	}
}
async function configInputs(ctx) {
	const raw = fs.readFileSync(ctx.configPath, "utf8");
	const files = [ctx.configPath, ...await collectIncludePathsRecursive({
		configPath: ctx.configPath,
		parsed: parseJsonWithJson5Fallback(raw),
		env: ctx.env
	})];
	privatePaths(ctx, files);
	return await Promise.all(files.map(captureDatabaseArtifact));
}
async function readDatabasePortConfigSnapshot(ctx) {
	ctx.assertCurrent();
	const value = await readConfigFileSnapshotForWrite({
		observe: false,
		skipPluginValidation: true
	});
	if (!value.snapshot.valid || value.snapshot.path !== ctx.configPath) refuse(ctx, "invalid or changed configuration", "valid pinned config source");
	privatePaths(ctx, Object.keys(value.writeOptions.includeFileTargetsForWrite ?? {}));
	return value;
}
function postgresConfig(config) {
	return {
		...config,
		database: {
			...config.database,
			engine: "postgres"
		}
	};
}
function capacity(ctx, files) {
	const volumes = /* @__PURE__ */ new Map();
	for (const file of files) {
		const dev = fs.statSync(file.path).dev;
		const volume = volumes.get(dev) ?? {
			path: file.path,
			required: 1024 ** 3
		};
		volume.required += file.size * 7;
		volumes.set(dev, volume);
	}
	for (const volume of volumes.values()) {
		const free = tryReadDiskSpace(volume.path);
		if (free && free.availableBytes < volume.required) refuse(ctx, `${free.availableBytes} bytes free on ${volume.path}`, `${volume.required} bytes for captures, migration, indexes and publication`);
	}
}
//#endregion
//#region src/commands/doctor-database-port.ts
async function preflight(ctx, options) {
	ctx.phase = "preflight";
	const captured = await configInputs(ctx), current = await readDatabasePortConfigSnapshot(ctx);
	for (const input of captured) await assertDatabaseArtifact(input);
	const config = current.snapshot.config;
	const from = config.database?.engine ?? "sqlite", to = options.to;
	const roots = resolvePluginMetadataSnapshot({
		stateDir: ctx.stateDir,
		config,
		env: ctx.env
	}).plugins.filter((plugin) => plugin.id === "workboard").flatMap((plugin) => (plugin.backupResources ?? []).filter((resource) => resource.scope === "state" && resource.disposition === "include").map((resource) => path.join(ctx.stateDir, resource.relativePath)));
	privatePaths(ctx, roots);
	const all = await discoverBackupDatabasePaths({
		stateDir: ctx.stateDir,
		config,
		env: ctx.env
	});
	const stores = all.filter((file) => roots.some((root) => file === root || file.startsWith(`${root}${path.sep}`)));
	const inspected = /* @__PURE__ */ new Map();
	for (const file of all) {
		ctx.target = file;
		privatePaths(ctx, [file]);
		if (!stores.includes(file)) {
			if (readBackupEngine(file).engine !== "sqlite") refuse(ctx, "unclassified PostgreSQL anchor", "registered workboard ownership");
			continue;
		}
		const facts = await runWorkboardPortTask({
			operation: "inspect",
			sourcePath: file,
			config: postgresConfig(config),
			to
		}, ctx);
		if (facts.engine !== from) refuse(ctx, `${facts.engine} store with ${from} config`, "matching physical/config engines");
		inspected.set(file, facts);
	}
	capacity(ctx, stores.map((file) => ({
		path: file,
		size: fs.statSync(file).size
	})));
	if (stores.length && from !== to) await runWorkboardPortTask({
		operation: "preflight",
		config: postgresConfig(config),
		probe: false
	}, ctx);
	return {
		snapshot: current,
		configInputs: captured,
		from,
		to,
		stores,
		inspected,
		migrations: stores.filter((file) => inspected.get(file)?.migrationRequired),
		remainingSqlite: all.filter((file) => !stores.includes(file))
	};
}
async function captureOriginals(ctx, facts) {
	ctx.phase = "capture originals";
	ctx.assertCurrent();
	const operationId = randomUUID();
	ctx.directory = prepareDatabasePortDirectory(ctx.stateDir, operationId);
	const artifacts = [], targets = [];
	const authored = facts.snapshot.snapshot.authoredConfig ?? facts.snapshot.snapshot.sourceConfig;
	ctx.inputs = {
		stores: [],
		remainingSqlite: facts.remainingSqlite,
		originalEngine: authored.database?.engine ?? null
	};
	for (const [index, [file, info]] of [...facts.inspected].entries()) {
		ctx.target = file;
		ctx.assertCurrent();
		const directory = storeDirectory(ctx, index);
		fs.mkdirSync(directory, { mode: 448 });
		const stat = fs.lstatSync(file, { bigint: true }), original = await captureDatabaseArtifact(file);
		let image = path.join(directory, "original.sqlite"), anchor = image;
		if (facts.from === "postgres") {
			const pg = path.join(directory, "postgres");
			await capturePostgresBackup({
				sourcePath: file,
				directory: pg,
				config: postgresConfig(facts.snapshot.snapshot.config),
				profile: "exact",
				assertCurrent: ctx.assertCurrent
			});
			image = path.join(pg, "database.sqlite");
			anchor = path.join(pg, "anchor.sqlite");
			artifacts.push(...await Promise.all([
				image,
				anchor,
				path.join(pg, "manifest.json")
			].map(captureDatabaseArtifact)));
		} else {
			await createVerifiedSqliteSnapshot({
				sourcePath: file,
				targetPath: image,
				preserveRowIds: true
			});
			artifacts.push(await captureDatabaseArtifact(image));
		}
		await assertDatabaseArtifact(original);
		ctx.inputs.stores.push({
			dev: String(stat.dev),
			ino: String(stat.ino),
			original,
			image
		});
		const storeId = info.storeId ?? randomUUID();
		targets.push({
			storeId,
			sourceSchemaVersion: info.version,
			targetSchemaVersion: info.targetVersion,
			descriptorHash: info.descriptorHash,
			original: facts.from === "sqlite" ? {
				engine: "sqlite",
				path: file
			} : {
				engine: "postgres",
				anchorPath: file,
				namespace: info.namespace
			},
			intended: facts.to === "sqlite" ? {
				engine: "sqlite",
				path: file
			} : {
				engine: "postgres",
				anchorPath: file,
				namespace: `port_${randomUUID().replaceAll("-", "")}`
			},
			originalCapture: await captureDatabaseArtifact(anchor),
			verification: null
		});
	}
	for (const [index, input] of facts.configInputs.entries()) {
		await assertDatabaseArtifact(input);
		const file = path.join(ctx.directory, `config-${index}.json`);
		writeDatabasePortArtifact(file, fs.readFileSync(input.path), ctx.assertCurrent);
		artifacts.push(await captureDatabaseArtifact(file));
	}
	const inputFile = path.join(ctx.directory, "inputs.json");
	writeDatabasePortArtifact(inputFile, `${JSON.stringify(ctx.inputs)}\n`, ctx.assertCurrent);
	artifacts.push(await captureDatabaseArtifact(inputFile));
	const root = fs.lstatSync(ctx.stateDir, { bigint: true });
	ctx.manifest = {
		version: 1,
		operationId,
		revision: 1,
		state: "preparing",
		root: {
			stateDir: ctx.stateDir,
			dev: String(root.dev),
			ino: String(root.ino)
		},
		direction: {
			from: facts.from,
			to: facts.to
		},
		originalConfig: facts.configInputs,
		artifacts,
		targets
	};
	writeDatabasePortManifest(ctx.stateDir, ctx.manifest, ctx.assertCurrent);
	capacity(ctx, ctx.inputs.stores.map(({ original, image }) => ({
		path: original.path,
		size: fs.statSync(image).size
	})));
}
async function privateMigrate(ctx, index) {
	ctx.phase = "private migrate";
	const prefix = path.join(storeDirectory(ctx, index), "working-");
	const recorded = manifest(ctx).artifacts.find((file) => file.path.startsWith(prefix));
	const file = recorded?.path ?? `${prefix}${randomUUID()}.sqlite`;
	if (recorded) {
		await assertDatabaseArtifact(recorded);
		return file;
	}
	await createVerifiedSqliteSnapshot({
		sourcePath: storeAt(ctx, index).input.image,
		targetPath: file,
		preserveRowIds: true
	});
	await runWorkboardPortTask({
		operation: "migrate",
		sourcePath: file
	}, ctx);
	syncDatabasePortPath(file);
	syncDatabasePortPath(path.dirname(file));
	manifest(ctx).artifacts.push(await captureDatabaseArtifact(file));
	revise(ctx);
	return file;
}
async function stageMaterialize(ctx, index, config) {
	const current = manifest(ctx), { target } = storeAt(ctx, index);
	ctx.target = livePath(target);
	if (target.verification) return;
	const working = await privateMigrate(ctx, index);
	ctx.phase = "stage/materialize";
	const result = await runWorkboardPortTask({
		operation: "stage",
		sourcePath: working,
		targetPath: stagePath(ctx, index),
		to: current.direction.to,
		storeId: target.storeId,
		namespace: target.intended.engine === "postgres" ? target.intended.namespace : "",
		config: postgresConfig(config),
		resume: true,
		sourceVerification: current.direction.from === "postgres" ? JSON.parse(fs.readFileSync(path.join(storeDirectory(ctx, index), "postgres/manifest.json"), "utf8")).verification : void 0
	}, ctx);
	const proof = result.verification;
	target.verification = {
		contentHash: digest(proof.tables),
		allocationHash: digest(proof.allocations),
		catalogHash: result.descriptorHash,
		rowCount: Object.values(proof.tables).reduce((sum, table) => sum + table.rows, 0),
		ownerAdmitted: true
	};
	current.artifacts.push(await captureDatabaseArtifact(stagePath(ctx, index)));
	await record(ctx, path.join(storeDirectory(ctx, index), "verification.json"), proof);
}
async function verify(ctx, index, config, original = false, sourcePath) {
	ctx.phase = "verify";
	const current = manifest(ctx), { target } = storeAt(ctx, index);
	ctx.target = livePath(target);
	const proofFile = path.join(storeDirectory(ctx, index), original && target.original.engine === "postgres" ? "postgres/manifest.json" : "verification.json");
	const parsed = JSON.parse(fs.readFileSync(proofFile, "utf8"));
	const proof = original && target.original.engine === "postgres" ? parsed.verification : parsed;
	const location = sourcePath && original && current.direction.from === "postgres" ? readBackupEngine(sourcePath) : original ? target.original : target.intended;
	await runWorkboardPortTask({
		operation: "verify",
		sourcePath: sourcePath ?? (original ? target.originalCapture.path : stagePath(ctx, index)),
		engine: original ? current.direction.from : current.direction.to,
		storeId: target.storeId,
		namespace: location.engine === "postgres" ? location.namespace : "",
		verification: proof,
		config: postgresConfig(config)
	}, ctx);
}
async function assertOriginal(ctx, index, config) {
	const { target, input: store } = storeAt(ctx, index);
	ctx.target = store.original.path;
	privatePaths(ctx, [store.original.path]);
	const stat = fs.lstatSync(store.original.path, { bigint: true });
	if (String(stat.dev) !== store.dev || String(stat.ino) !== store.ino) refuse(ctx, "changed source identity", "captured device and inode");
	if (target.original.engine === "postgres") {
		await verify(ctx, index, config, true);
		return;
	}
	const copy = path.join(storeDirectory(ctx, index), `source-check-${randomUUID()}.sqlite`);
	await createVerifiedSqliteSnapshot({
		sourcePath: store.original.path,
		targetPath: copy,
		preserveRowIds: true
	});
	if ((await captureDatabaseArtifact(copy)).sha256 !== (await captureDatabaseArtifact(store.image)).sha256) refuse(ctx, "changed source data", "captured original SQLite image");
}
async function classifyConfig(ctx) {
	const current = await readDatabasePortConfigSnapshot(ctx), files = await configInputs(ctx), saved = manifest(ctx);
	if (isDeepStrictEqual(files, saved.originalConfig)) return {
		current,
		engine: saved.direction.from
	};
	if (!isDeepStrictEqual(files.map((file) => file.path), saved.originalConfig.map((file) => file.path))) refuse(ctx, "changed config include graph", "captured config inputs");
	for (const artifact of saved.artifacts.filter((file) => path.basename(file.path).startsWith("config-intent-"))) {
		const intent = object({
			hash: string(),
			engine: _enum(["sqlite", "postgres"])
		}).parse(JSON.parse(fs.readFileSync(artifact.path, "utf8")));
		if (digest(current.snapshot.sourceConfig) === intent.hash) return {
			current,
			engine: intent.engine
		};
	}
	return refuse(ctx, "unrecognized config contents", "recorded old or prepared new config");
}
async function prepareStores(ctx, config, restoring) {
	ctx.phase = restoring ? "rollback" : "prepare stores";
	const current = manifest(ctx);
	for (const [index, target] of current.targets.entries()) {
		ctx.target = livePath(target);
		privatePaths(ctx, [ctx.target]);
		const actual = await captureDatabaseArtifact(ctx.target);
		const staged = current.artifacts.find((file) => file.path === stagePath(ctx, index));
		const restored = actual.sha256 === target.originalCapture.sha256 || current.artifacts.some((file) => path.basename(file.path).startsWith("rollback-") && file.sha256 === actual.sha256);
		const fresh = staged && actual.sha256 === staged.sha256;
		if (!fresh && !(restoring && restored)) {
			if (restoring && target.original.engine === "postgres") await assertDatabaseArtifact(storeAt(ctx, index).input.original);
			else await assertOriginal(ctx, index, config);
		}
		if (!restoring && fresh) {
			await verify(ctx, index, config);
			continue;
		}
		let source = restoring ? target.originalCapture.path : stagePath(ctx, index);
		if (restoring && target.original.engine === "postgres") try {
			await verify(ctx, index, config, true, !fresh ? ctx.target : void 0);
		} catch {
			source = path.join(storeDirectory(ctx, index), `rollback-${randomUUID()}.sqlite`);
			await preparePostgresRestore({
				directory: path.dirname(target.originalCapture.path),
				anchorPath: source,
				profile: "exact",
				config: postgresConfig(config),
				expectedSource: {
					storeId: target.storeId,
					namespace: target.original.namespace
				},
				assertCurrent: ctx.assertCurrent
			});
			current.artifacts.push(await captureDatabaseArtifact(source));
			revise(ctx);
		}
		if (restoring && (restored || !fresh) && source === target.originalCapture.path) continue;
		if (!restoring) await verify(ctx, index, config);
		ctx.phase = restoring ? "rollback" : "publish stores";
		await runWorkboardPortTask({
			operation: "checkpoint",
			sourcePath: ctx.target
		}, ctx);
		const settled = await captureDatabaseArtifact(ctx.target), bytes = await captureDatabaseArtifact(source);
		const image = await prepareVerifiedSqliteFile({
			sourcePath: source,
			sourceIdentity: fs.lstatSync(source, { bigint: true }),
			targetPath: ctx.target,
			expectedContent: {
				sha256: bytes.sha256,
				sizeBytes: bytes.size
			},
			replaceExisting: {
				expectedIdentity: fs.lstatSync(ctx.target, { bigint: true }),
				expectedContent: {
					sha256: settled.sha256,
					sizeBytes: settled.size
				},
				assertCustody: ctx.assertCurrent
			}
		});
		ctx.prepared.push([ctx.target, image]);
	}
}
async function publishStores(ctx) {
	ctx.phase = "publish stores";
	const current = manifest(ctx);
	ctx.target = ctx.prepared[0]?.[0] ?? ctx.configPath;
	if (current.state === "preparing") {
		current.state = "publishing";
		revise(ctx);
	}
	for (const [target, image] of ctx.prepared) {
		ctx.target = target;
		await image.publish();
	}
}
async function switchConfig(ctx, restoring) {
	ctx.phase = "switch config";
	ctx.target = ctx.configPath;
	const { current, engine } = await classifyConfig(ctx), saved = manifest(ctx);
	const wanted = restoring ? saved.direction.from : saved.direction.to;
	const value = restoring ? ctx.inputs.originalEngine ?? void 0 : wanted;
	if (engine !== wanted) {
		const candidate = structuredClone(current.snapshot.authoredConfig ?? current.snapshot.sourceConfig);
		const unsetEngine = value === void 0;
		setConfigValueAtPath(candidate, ["database", "engine"], value);
		const result = await writeConfigFile(candidate, {
			...current.writeOptions,
			baseSnapshot: current.snapshot,
			inputBase: "source",
			explicitSetPaths: unsetEngine ? [] : [["database", "engine"]],
			unsetPaths: unsetEngine ? [["database", "engine"]] : void 0,
			assertCurrent: ctx.assertCurrent,
			observe: false,
			skipOutputLogs: true,
			skipRuntimeSnapshotRefresh: true,
			beforeCommit: async () => {
				await publishStores(ctx);
				ctx.phase = "switch config";
				ctx.target = ctx.configPath;
			},
			preCommitRuntimePreflight: async (source) => {
				await record(ctx, path.join(ctx.directory, `config-intent-${randomUUID()}.json`), {
					hash: digest(source),
					engine: wanted
				});
			}
		});
		if (!(await configInputs(ctx)).some((file) => file.sha256 === result.persistedHash)) refuse(ctx, "config receipt hash mismatch", "writer's persisted hash");
	} else await publishStores(ctx);
	for (const file of saved.originalConfig) {
		ctx.assertCurrent();
		syncDatabasePortPath(file.path);
		syncDatabasePortPath(path.dirname(file.path));
	}
}
function finalize(ctx, outcome) {
	ctx.phase = "finalize/archive";
	const current = manifest(ctx);
	if (current.state !== "complete") {
		current.state = "complete";
		current.outcome = outcome;
		revise(ctx);
	}
	const archived = archiveDatabasePortManifest(ctx.stateDir, current.operationId, ctx.assertCurrent);
	return {
		phase: "complete",
		engine: outcome === "ported" ? current.direction.to : current.direction.from,
		stores: current.targets.map(livePath),
		backup: ctx.directory,
		remainingSqlite: ctx.inputs?.remainingSqlite ?? [],
		manifest: archived,
		serverCapacity: "unknown; former PostgreSQL namespaces retained",
		restart: "Start the Gateway through its service owner."
	};
}
async function resume(ctx) {
	const current = manifest(ctx), config = (await readDatabasePortConfigSnapshot(ctx)).snapshot.config;
	if (current.state === "preparing") {
		for (const input of current.originalConfig) await assertDatabaseArtifact(input);
		for (const index of current.targets.keys()) await stageMaterialize(ctx, index, config);
	}
	return await finishPort(ctx, config, false);
}
async function rollback(ctx) {
	if ((resolveConfigEnvVars(ctx.inputs.originalEngine, ctx.env) ?? "sqlite") !== manifest(ctx).direction.from) refuse(ctx, "changed engine environment", "original engine environment before rollback");
	return await finishPort(ctx, (await readDatabasePortConfigSnapshot(ctx)).snapshot.config, true);
}
async function finishPort(ctx, config, restoring) {
	try {
		const preparingRollback = restoring && manifest(ctx).state === "preparing";
		if (preparingRollback) for (const index of manifest(ctx).targets.keys()) await assertOriginal(ctx, index, config);
		else await prepareStores(ctx, config, restoring);
		await withConfigWriteLock(ctx.configPath, async () => {
			if (preparingRollback) await classifyConfig(ctx);
			else await switchConfig(ctx, restoring);
		}, ctx.env, ctx.assertCurrent);
	} finally {
		for (const [, image] of ctx.prepared) await image.cleanup();
	}
	return finalize(ctx, restoring ? "rolled-back" : "ported");
}
async function loadRecovery(ctx) {
	const saved = manifest(ctx);
	ctx.directory = path.join(path.dirname(databasePortManifestPath(ctx.stateDir)), saved.operationId);
	for (const file of saved.artifacts) {
		if (!file.path.startsWith(`${ctx.directory}${path.sep}`)) refuse(ctx, "artifact outside operation directory", "private operation-owned artifacts");
		privatePaths(ctx, [file.path]);
		const stat = fs.lstatSync(file.path);
		if ((stat.mode & 511) !== 384 || process.getuid && stat.uid !== process.getuid()) refuse(ctx, "nonprivate artifact", "0600 caller-owned file");
		await assertDatabaseArtifact(file);
	}
	ctx.inputs = inputsSchema.parse(JSON.parse(fs.readFileSync(path.join(ctx.directory, "inputs.json"), "utf8")));
	if (ctx.inputs.stores.length !== saved.targets.length || saved.targets.some((target, index) => {
		const file = ctx.inputs?.stores[index]?.original.path;
		return !file?.startsWith(`${ctx.stateDir}${path.sep}`) || file !== livePath(target);
	})) refuse(ctx, "mismatched target set", "complete captured store set");
}
async function doctorDatabasePort(options) {
	assertDatabasePortPlatformSupported();
	const stateDir = path.resolve(resolveStateDir()), configPath = path.resolve(resolveConfigPath());
	const ctx = {
		stateDir,
		configPath,
		env: process.env,
		assertCurrent: () => {},
		phase: "preflight",
		target: stateDir,
		directory: "",
		prepared: []
	};
	try {
		privatePaths(ctx, [stateDir, configPath]);
		if (hasActiveGatewayStateOwner(path.join(stateDir, "state", "openclaw.sqlite"))) refuse(ctx, "hosted Gateway owner", "exclusive offline custody");
		const recoveryPath = options.resume ?? options.rollback;
		const recovery = recoveryPath ? {
			manifestPath: path.resolve(recoveryPath),
			operationId: object({ operationId: uuid() }).parse(JSON.parse(fs.readFileSync(recoveryPath, "utf8"))).operationId,
			action: options.rollback ? "rollback" : "resume"
		} : void 0;
		return await runWithLocalStateOwner({
			method: "database.port",
			params: {},
			target: stateDir,
			onForeignOwner: "refuse",
			databasePortRecovery: recovery,
			runLocal: async ({ env, assertCurrent, signal }) => {
				Object.assign(ctx, {
					env,
					assertCurrent,
					signal
				});
				if (recovery) {
					ctx.manifest = assertDatabasePortRecoveryAllowed(stateDir, recovery);
					await loadRecovery(ctx);
					if (ctx.manifest.state === "complete") return finalize(ctx, ctx.manifest.outcome);
					return recovery.action === "resume" ? await resume(ctx) : await rollback(ctx);
				}
				const facts = await preflight(ctx, options);
				if (options.dryRun || facts.from === facts.to || !facts.stores.length) return {
					phase: options.dryRun ? "preflight" : "complete",
					engine: facts.from,
					to: facts.to,
					stores: facts.stores,
					migrations: facts.migrations,
					remainingSqlite: facts.remainingSqlite,
					verification: options.dryRun ? `${facts.migrations.length} stores need private migration; copy and privilege probe not performed` : "verified no-op",
					serverCapacity: "unknown"
				};
				await captureOriginals(ctx, facts);
				return await resume(ctx);
			}
		});
	} catch (error) {
		if (error instanceof WorkboardPortError) throw error;
		const parsed = object({ code: string().regex(/^[A-Z0-9_]+$/) }).safeParse(error);
		return refuse(ctx, parsed.success ? parsed.data.code : "validation or I/O failure", "successful verified phase; preserve the recovery directory");
	}
}
//#endregion
export { doctorDatabasePort };
