import { r as defaultRuntime, t as ExitError } from "./runtime-BazLsT0s.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { f as writeJsonAtomic, m as writeTextAtomic, o as readJsonIfExists } from "./json-files-DYmSFHoN.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Un as record, Yt as discriminatedUnion, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as publishFileExclusive, l as syncDirectory, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { l as assertConfigFileWritePathSnapshot, u as captureConfigFileWritePathProof } from "./write-lock-BlX1pI0w.mjs";
import { t as readExistingStateRootMode } from "./private-dir-mode-BBICrnrB.mjs";
import { r as acquireGatewayLock } from "./gateway-lock-OT1e72lx.mjs";
import { t as prepareDoctorDatabasePreflight } from "./doctor-database-preflight-D_Pwi3Vj.mjs";
import { r as createUpdateRun } from "./update-run-ledger-C3oL-g8r.mjs";
import { r as readUpdateConfigSnapshot, t as captureUpdateConfigSnapshot } from "./update-command-config-snapshot-tEb-vXUT.mjs";
import { a as hasSchemaRefusal, i as formatSchemaRefusalLines, n as captureTargetDatabaseSchemaContext } from "./schema-preflight-Dfpu1-Iv.mjs";
import { p as removePackageUpdatePath } from "./package-update-filesystem-Dp6M-xYr.mjs";
import { n as createUpdateDatabaseBackup, t as UpdateDatabaseBackupSchema } from "./update-database-backup-aeI_iiyz.mjs";
import { t as restoreUpdateDatabaseBackup } from "./update-database-restore-CntdXaR8.mjs";
import { t as runDoctorHealthFlow } from "./doctor-health-DfYSrMfp.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/cli/update-cli/update-command-migrate.ts
const ReceiptSchema = object({
	schemaVersion: literal(1),
	runId: string().uuid(),
	startedAtMs: number().int().nonnegative().optional(),
	stateDir: string(),
	configPath: string(),
	status: _enum([
		"backed-up",
		"migrated",
		"failed",
		"restoring-config",
		"restored",
		"finished"
	]),
	backup: UpdateDatabaseBackupSchema,
	databases: array(string()),
	databaseIdentities: record(string(), object({
		dev: number(),
		ino: number()
	})),
	configIdentity: object({
		path: string(),
		dev: number(),
		ino: number()
	}).nullable(),
	configFiles: array(object({
		path: string(),
		raw: string().nullable(),
		pathSnapshot: object({
			targetPath: string(),
			entries: array(discriminatedUnion("kind", [object({
				path: string(),
				kind: literal("missing-directory")
			}), object({
				path: string(),
				kind: literal("existing"),
				dev: string(),
				ino: string(),
				link: string().optional()
			})]))
		})
	})),
	displacedConfigFiles: array(string()).optional(),
	configDisplacementHashes: record(string(), string().regex(/^[a-f0-9]{64}$/u)).optional(),
	error: string().optional()
});
function receiptPath(backupRoot) {
	if (!path.isAbsolute(backupRoot)) throw new Error("--backup-root must be an absolute path.");
	return `${path.resolve(backupRoot)}.receipt.json`;
}
async function readReceipt(backupRoot) {
	const file = receiptPath(backupRoot);
	const receipt = ReceiptSchema.parse(await readJsonIfExists(file));
	if (receipt.stateDir !== resolveStateDir() || receipt.configPath !== resolveConfigPath()) throw new Error("Update migration receipt belongs to another state directory or config.");
	const normalized = path.resolve(backupRoot);
	const canonicalBackup = path.join(await fs$1.realpath(path.dirname(normalized)), `${path.basename(normalized)}.databases`);
	if (receipt.backup.directory !== canonicalBackup) throw new Error("Update migration receipt belongs to another backup root.");
	return {
		file,
		receipt
	};
}
async function saveReceipt(file, receipt) {
	const destination = path.join(await fs$1.realpath(path.dirname(file)), path.basename(file));
	await writeJsonAtomic(destination, receipt, {
		mode: 384,
		dirMode: 448,
		durable: true
	});
}
async function readIdentities(databases) {
	const identities = {};
	for (const database of databases) {
		const info = await fs$1.stat(database, { bigint: true }).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (info) identities[database] = {
			dev: info.dev,
			ino: info.ino
		};
	}
	return identities;
}
function toReceiptIdentities(identities) {
	return Object.fromEntries(Object.entries(identities).map(([file, identity]) => [file, {
		dev: Number(identity.dev),
		ino: Number(identity.ino)
	}]));
}
async function readConfigIdentity(configPath) {
	const identity = (await readIdentities([configPath]))[configPath];
	return identity ? {
		path: configPath,
		dev: Number(identity.dev),
		ino: Number(identity.ino)
	} : null;
}
/** The external supervisor owns drain/start; the candidate owns backup and schema repair. */
async function updateMigrateCommand(backupRoot) {
	const startedAtMs = Date.now();
	const file = receiptPath(backupRoot);
	if (await readJsonIfExists(file) !== null) throw new Error(`Update migration receipt already exists: ${file}. Restore it or choose a new backup root.`);
	const env = process.env;
	const source = await captureTargetDatabaseSchemaContext(env);
	const preflight = await prepareDoctorDatabasePreflight();
	if (hasSchemaRefusal(preflight)) throw new Error(formatSchemaRefusalLines(preflight).join("\n"));
	const lock = await acquireGatewayLock({
		env,
		role: "sqlite-maintenance",
		allowInTests: true,
		timeoutMs: 0
	});
	if (!lock) throw new Error("Update migration requires the Gateway to be stopped.");
	let receipt;
	let verifiedSnapshots;
	try {
		({receipt, verifiedSnapshots} = await lock.run(async () => {
			await fs$1.mkdir(path.dirname(backupRoot), {
				recursive: true,
				mode: 448
			});
			lock.assertCurrent();
			const config = await captureUpdateConfigSnapshot(resolveConfigPath(env), env);
			if (config.doctorOwned === false) throw new Error("Update migration cannot capture the complete configuration include graph.");
			const normalized = path.resolve(backupRoot);
			const canonicalRoot = path.join(await fs$1.realpath(path.dirname(normalized)), path.basename(normalized));
			lock.assertCurrent();
			const backup = await createUpdateDatabaseBackup({
				backupRoot: canonicalRoot,
				stateDir: resolveStateDir(env),
				config: source.config,
				env,
				stopped: true
			});
			lock.assertCurrent();
			const databases = [.../* @__PURE__ */ new Set([...backup.databases.map((entry) => entry.path), ...backup.missingPaths])];
			const databaseIdentities = await readIdentities(databases);
			lock.assertCurrent();
			const capturedReceipt = {
				schemaVersion: 1,
				runId: randomUUID(),
				startedAtMs,
				stateDir: resolveStateDir(env),
				configPath: resolveConfigPath(env),
				status: "backed-up",
				backup,
				databases,
				databaseIdentities: toReceiptIdentities(databaseIdentities),
				configIdentity: await readConfigIdentity(resolveConfigPath(env)),
				configFiles: [config, ...config.includedFiles ?? []].map((entry) => {
					const pathSnapshot = entry.pathSnapshot ?? captureConfigFileWritePathProof(entry.path, resolvePathViaExistingAncestorSync(entry.path), fs).snapshot;
					assertConfigFileWritePathSnapshot(pathSnapshot, fs);
					return {
						path: entry.path,
						raw: entry.raw,
						pathSnapshot
					};
				})
			};
			await saveReceipt(file, capturedReceipt);
			lock.assertCurrent();
			return {
				receipt: capturedReceipt,
				verifiedSnapshots: (backup.databaseOwners ?? []).flatMap((owner) => {
					const identity = databaseIdentities[owner.path];
					if (!identity) return [];
					return [{
						sourcePath: owner.path,
						...identity,
						...owner
					}];
				})
			};
		}));
	} finally {
		await lock.release();
	}
	const doctorEnv = {
		OPENCLAW_SERVICE_REPAIR_POLICY: "external",
		OPENCLAW_UPDATE_IN_PROGRESS: "1",
		OPENCLAW_UPDATE_POST_CORE_CONVERGENCE: "1",
		OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE: "1"
	};
	const previous = Object.fromEntries(Object.keys(doctorEnv).map((key) => [key, env[key]]));
	Object.assign(env, doctorEnv);
	try {
		preflight.verifiedSnapshots = verifiedSnapshots;
		try {
			await runDoctorHealthFlow(defaultRuntime, {
				repair: true,
				nonInteractive: true,
				workspaceSuggestions: false
			}, void 0, preflight);
		} catch (error) {
			if (!(error instanceof ExitError) || error.code !== 0) throw error;
		}
		const migrated = await prepareDoctorDatabasePreflight();
		if (hasSchemaRefusal(migrated) || migrated.pendingMigrations?.length) throw new Error("Doctor did not complete the candidate database migrations; the recovery backup was retained.");
		receipt.status = "migrated";
		receipt.databaseIdentities = toReceiptIdentities(await readIdentities(receipt.databases));
		receipt.configIdentity = await readConfigIdentity(receipt.configPath);
		await saveReceipt(file, receipt);
	} catch (error) {
		receipt.status = "failed";
		receipt.error = formatErrorMessage(error);
		await saveReceipt(file, receipt);
		throw error;
	} finally {
		for (const [key, value] of Object.entries(previous)) if (value === void 0) delete env[key];
		else env[key] = value;
	}
	defaultRuntime.writeJson({
		status: receipt.status,
		receipt: file,
		databases: receipt.databases
	});
}
/** Rollback of a stopped, still-fenced candidate may discard its startup bookkeeping. */
async function updateRestoreCommand(backupRoot) {
	const { file, receipt } = await readReceipt(backupRoot);
	if (receipt.status === "finished") throw new Error("The accepted update's rollback backup has been retired.");
	if (receipt.status !== "restored") {
		if (receipt.status !== "restoring-config") {
			await restoreUpdateDatabaseBackup({
				backup: receipt.backup,
				runId: receipt.runId,
				env: process.env,
				assertCurrent: () => {}
			});
			receipt.status = "restoring-config";
			receipt.databaseIdentities = toReceiptIdentities(await readIdentities(receipt.databases));
			await saveReceipt(file, receipt);
		}
		const lock = await acquireGatewayLock({
			env: process.env,
			role: "sqlite-maintenance",
			allowInTests: true,
			timeoutMs: 0
		});
		if (!lock) throw new Error("Configuration rollback requires the Gateway to remain stopped.");
		try {
			await lock.run(async () => {
				for (const config of receipt.configFiles) {
					const assertCurrent = () => {
						lock.assertCurrent();
						assertConfigFileWritePathSnapshot(config.pathSnapshot, fs);
					};
					assertCurrent();
					const configPath = config.pathSnapshot.targetPath;
					const current = await readUpdateConfigSnapshot(configPath);
					assertCurrent();
					if (current.raw === config.raw) continue;
					const target = `${configPath}.migrated-${receipt.runId}`;
					const displaced = await readUpdateConfigSnapshot(target);
					assertCurrent();
					const expectedHash = receipt.configDisplacementHashes?.[target];
					if (displaced.raw !== null) {
						if (!expectedHash || displaced.hash !== expectedHash) throw new Error(`Displaced configuration changed or has no recovery receipt: ${target}`);
						if (current.raw !== null && current.raw !== config.raw && current.hash !== expectedHash) throw new Error(`Configuration changed after rollback began: ${config.path}; newer bytes were preserved.`);
					} else if (current.raw !== null) {
						if (expectedHash && current.hash !== expectedHash) throw new Error(`Configuration changed before rollback displacement: ${config.path}; newer bytes were preserved.`);
						(receipt.configDisplacementHashes ??= {})[target] = current.hash;
						await saveReceipt(file, receipt);
						const staged = `${target}.pending-${randomUUID()}`;
						try {
							await writeTextAtomic(staged, current.raw, {
								mode: 384,
								dirMode: readExistingStateRootMode(path.dirname(staged), receipt.stateDir),
								durable: true
							});
							const identity = await fs$1.lstat(staged);
							assertCurrent();
							await publishFileExclusive({
								sourcePath: staged,
								targetPath: target,
								expectedSourceIdentity: identity,
								strategy: "rename-noreplace"
							});
						} finally {
							await fs$1.rm(staged, { force: true });
						}
						assertCurrent();
					} else if (expectedHash) throw new Error(`The recorded configuration displacement is missing: ${target}`);
					if ((displaced.raw !== null || current.raw !== null) && !receipt.displacedConfigFiles?.includes(target)) (receipt.displacedConfigFiles ??= []).push(target);
					if (config.raw !== null) await writeTextAtomic(configPath, config.raw, {
						mode: 384,
						dirMode: readExistingStateRootMode(path.dirname(configPath), receipt.stateDir),
						durable: true,
						beforeRename: async () => assertCurrent()
					});
					else {
						assertCurrent();
						await fs$1.rm(configPath, { force: true });
						const directory = await fs$1.realpath(path.dirname(configPath));
						assertCurrent();
						requireDirectorySync(await syncDirectory(directory), "Restored configuration directory");
						assertCurrent();
					}
				}
			});
		} finally {
			await lock.release();
		}
		receipt.status = "restored";
		receipt.databaseIdentities = toReceiptIdentities(await readIdentities(receipt.databases));
		receipt.configIdentity = await readConfigIdentity(receipt.configPath);
		delete receipt.error;
		await saveReceipt(file, receipt);
	}
	defaultRuntime.writeJson({
		status: receipt.status,
		receipt: file,
		databases: receipt.databases
	});
}
/** The supervisor calls this only after accepting the candidate and retiring its rollback journal. */
async function updateFinishCommand(backupRoot) {
	const { file, receipt } = await readReceipt(backupRoot);
	if (receipt.status !== "migrated" && receipt.status !== "finished") throw new Error("Only a successfully migrated and accepted update may retire its backup.");
	receipt.status = "finished";
	receipt.configFiles = [];
	await saveReceipt(file, receipt);
	const warnings = await removePackageUpdatePath(receipt.backup.directory) ? [] : [`Backup cleanup remains pending at ${receipt.backup.directory}; retry update finish.`];
	if (receipt.startedAtMs !== void 0) try {
		createUpdateRun({
			runId: receipt.runId,
			trigger: "cli",
			accepted: { startedAtMs: receipt.startedAtMs },
			after: { version: VERSION }
		}, { env: process.env });
	} catch (error) {
		warnings.push(`Update history did not record this accepted update (${formatErrorMessage(error)}); retry update finish.`);
	}
	defaultRuntime.writeJson({
		status: receipt.status,
		receipt: file,
		...warnings.length > 0 ? { warning: warnings.join(" ") } : {}
	});
}
//#endregion
export { updateFinishCommand, updateMigrateCommand, updateRestoreCommand };
