import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { c as readRootJsonObjectSync } from "./json-files-DYmSFHoN.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { An as never, Et as _enum, Fn as object, Jn as string, Nt as array, lr as uuid, nr as tuple, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { d as isSupportedOpenClawNodeVersion } from "./node-version-BfT-yCVT.mjs";
import { a as resolveExistingSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely, p as sql } from "./kysely-sync-9fPQaMlh.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as compareOpenClawReleaseVersions } from "./npm-registry-spec-B_IER0ZB.mjs";
import { l as syncDirectory, p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { r as resolveManagedUpdateLeaseDatabasePath } from "./update-managed-service-handoff-lease-CPNRSilB.mjs";
import { i as captureManagedUpdateLeaseDatabaseIdentity, l as prepareManagedHandoffLeaseDatabaseIdentity, n as assertManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database-DQAEU12_.mjs";
import { n as withExistingSqliteRollbackDatabase } from "./sqlite-existing-database-CZ3ULeQw.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-Nv-hNWki.mjs";
import { c as comparePackageDistContentInventory, o as PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH, s as PACKAGE_DIST_INVENTORY_RELATIVE_PATH } from "./package-dist-inventory-_17OXIG1.mjs";
import "./runtime-guard-BzyF4hYe.mjs";
import { a as resolveBunRuntimeInfo } from "./runtime-paths-v6m7qRRF.mjs";
import { o as captureUpdateCommandExecutorAuthority, t as withUpdateCommandExecutor } from "./update-command-executor-DUq8yLzH.mjs";
import { a as packageIntegrityDifferences, i as isPackageIntegrityResourceError, n as assertPackageIntegritySettlementUnchanged, o as packageLauncherDifferences, r as createPackageIntegrityReader, s as packageStatUnchanged, t as PackageIntegrityMismatchError } from "./package-update-integrity-K9gUqAS0.mjs";
import { d as packagePathEntryExists, f as removePackagePath, n as activateStagedNpmPackageRoot, o as copyPackagePathEntry, r as assertPackagePathIdentity, s as createPackagePathAssertion } from "./package-update-filesystem-Dp6M-xYr.mjs";
import { a as packageActivationIdentity, d as resolvePackageActivationHelper, f as resolvePackageActivationJournalPath, i as isPackageActivationComplete, l as resolvePackageActivationAnchor, n as assertPackageActivationLayout, o as packageActivationRuntimeIdentity, s as privatePackageActivationIdentity, t as LEGACY_PACKAGE_RECOVERY_HELPER, u as resolvePackageActivationControl } from "./package-update-activation-paths-CZ6aheGK.mjs";
import { a as packageActivationIdentitySchema, i as intentSchema, n as PackageActivationPhaseSchema, r as basename$1, t as PackageActivationDescriptorSchema } from "./package-update-activation-schema-xrjB60aF.mjs";
import { t as prepareSqliteRollbackRecovery } from "./sqlite-rollback-recovery-CxCck8hc.mjs";
import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { spawnSync } from "node:child_process";
import { root } from "@openclaw/fs-safe/root";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region src/infra/update-post-core-capability.ts
const POST_CORE_EXECUTOR_CAPABILITY = "stdin-pid-start-v1";
const POST_CORE_MUTATION_PROTOCOL = "original-cancellation-v1";
/** Compatibility only: authority still comes from the original live executor. */
async function supportsPostCoreExecutor(root, nodeRunner) {
	const check = await runUtf8CommandWithTimeout([
		nodeRunner,
		path.join(root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath),
		"--check"
	], {
		cwd: root,
		baseEnv: {},
		timeoutMs: 3e4,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		killGraceMs: 500,
		maxOutputBytes: 65536
	});
	if (check.termination !== "exit" || check.code !== 0 || check.cleanup !== "normal") return false;
	const contract = safeParseJsonRecord(check.stdout);
	if (!contract || contract.postCoreExecutor !== "stdin-pid-start-v1") return false;
	if (contract.mutationProtocol !== "original-cancellation-v1") throw new Error("Target update worker does not support original cancellation.");
	return true;
}
//#endregion
//#region src/infra/package-update-activation-launcher.ts
const launcherSchema = tuple([
	_enum(["symlink", "file"]),
	string(),
	string(),
	string(),
	string()
]);
/** Keep the journal's version-1 launcher encoding while the live reader exposes metadata. */
function encodePackageActivationLauncher(value) {
	return JSON.stringify([
		value.type,
		value.mode,
		value.uid,
		value.gid,
		value.contents
	]);
}
function decodePackageActivationLauncher(encoded) {
	const [type, mode, uid, gid, contents] = launcherSchema.parse(JSON.parse(encoded));
	return {
		type,
		mode,
		uid,
		gid,
		contents
	};
}
function matchesPackageActivationLauncher(actual, encoded) {
	return actual === null || encoded === null ? actual === null && encoded === null : packageLauncherDifferences(decodePackageActivationLauncher(encoded), actual, { checkMode: true }).length === 0;
}
const entryIdentity = (file) => fs.lstatSync(file, { throwIfNoEntry: false }) ? packageActivationIdentity(file, "launcher") : null;
function assertPackageActivationSelectedLaunchers(record, selected) {
	const descriptor = record.descriptor;
	for (const entry of descriptor.launchers) {
		const expected = selected === "previous" && entry.previous === null ? null : record.phase === "aborted" || record.phase === "prepared" ? entry.previousIdentity : record.publications.find((published) => published.name === entry.name)?.identity;
		if (entryIdentity(path.join(descriptor.binDir, entry.name)) !== expected) throw new Error("Selected package launcher identity changed.");
	}
}
async function verifyPackageActivationSelectedLaunchers(record, selected) {
	const descriptor = record.descriptor;
	const reader = createPackageIntegrityReader();
	assertPackageActivationSelectedLaunchers(record, selected);
	for (const entry of descriptor.launchers) {
		const destination = path.join(descriptor.binDir, entry.name);
		if (!matchesPackageActivationLauncher(await reader.exists(destination) ? await reader.launcher(destination) : null, entry[selected])) throw new Error("Selected package launcher fingerprint changed.");
	}
	assertPackageActivationSelectedLaunchers(record, selected);
}
//#endregion
//#region src/infra/package-update-activation-status.ts
/** Released in-anchor journals remain inspection-only; their helper owns recovery. */
function readReleasedPackageActivationReceipt(installKey) {
	const anchor = resolvePackageActivationAnchor(installKey);
	const journal = path.join(anchor, "operation.sqlite");
	if (!fs.lstatSync(journal, { throwIfNoEntry: false })) return;
	const anchorIdentity = privatePackageActivationIdentity(anchor, "anchor");
	const journalIdentity = privatePackageActivationIdentity(journal, "journal");
	const parentIdentity = packageActivationIdentity(path.dirname(anchor), "parent");
	const assertIdentity = () => {
		if (privatePackageActivationIdentity(anchor, "anchor") !== anchorIdentity || privatePackageActivationIdentity(journal, "journal") !== journalIdentity || packageActivationIdentity(path.dirname(anchor), "parent") !== parentIdentity || fs.realpathSync(anchor) !== anchor) throw new Error("Released package activation journal identity changed.");
	};
	const query = (db) => getNodeSqliteKysely(db).selectFrom("package_activation");
	return withExistingSqliteRollbackDatabase(journal, {
		write: false,
		busyTimeoutMs: 0,
		assertIdentity,
		validate: (db) => {
			executeSqliteQuerySync(db, query(db).select([
				"slot",
				"phase",
				"descriptor_json"
			]).limit(0));
		}
	}, (db) => {
		const rows = executeSqliteQuerySync(db, query(db).select(["slot", "phase"]).select((eb) => eb.case().when(eb.fn("length", [eb.cast("descriptor_json", "blob")]), "<=", 1048576).then(eb.ref("descriptor_json")).else(null).end().as("descriptor_json")).limit(2)).rows;
		const row = rows[0];
		if (rows.length !== 1 || row?.slot !== 1 || row.descriptor_json === null) throw new Error("Released package activation journal must contain one bounded operation.");
		const descriptor = object({
			version: literal(1),
			layout: never().optional(),
			operationId: uuid(),
			authority: object({ installKey: string() }),
			anchorIdentity: literal(anchorIdentity),
			journalIdentity: literal(journalIdentity),
			parentIdentity: literal(parentIdentity)
		}).parse(JSON.parse(row.descriptor_json));
		if (descriptor.authority.installKey !== installKey) throw new Error("Released package activation journal does not match its installation.");
		return {
			phase: _enum([
				"prepared",
				"publishing",
				"publication-complete",
				"rollback-in-progress",
				"rolled-back",
				"aborted",
				"retiring",
				"retired"
			]).parse(row.phase),
			operationId: descriptor.operationId,
			installKey,
			recoveryCommand: `node ${quoteCliArg(path.join(anchor, "recovery.mjs"))} status`
		};
	});
}
function assertPackageActivationOperation(record, operationId) {
	if (record.descriptor.operationId !== operationId) throw new Error("Package recovery command belongs to a different operation.");
}
function readPackageActivationRecordStatus(record) {
	return {
		phase: isPackageActivationComplete(resolvePackageActivationAnchor(record.descriptor.authority.installKey), record) ? "complete" : record.phase,
		operationId: record.descriptor.operationId,
		installKey: record.descriptor.authority.installKey
	};
}
const selectedPackageRetirementGeneration = (record) => record.intent?.kind === "remove" || record.intent?.kind === "retire" || record.intent?.kind === "remove-anchor" || record.intent?.kind === "unlink-helper" ? record.intent.selected : record.phase === "publication-complete" ? "candidate" : "previous";
function assertPackageActivationActionAllowed(record, action) {
	if (!(action === "repair" ? [
		"preparing",
		"prepared",
		"publishing",
		"publication-complete"
	] : [
		"publication-complete",
		"rolled-back",
		"aborted",
		"retiring",
		"anchor-retired"
	]).includes(record.phase)) throw new Error(`${action === "repair" ? "Forward publication is disarmed" : "Package evidence cannot be retired"} (${record.phase}).`);
}
//#endregion
//#region src/infra/package-update-activation-journal.ts
const PACKAGE_ACTIVATION_JOURNAL = "operation.sqlite";
const MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES = 1048576;
const queries = (db) => getNodeSqliteKysely(db);
function descriptorJson(descriptor) {
	const encoded = JSON.stringify(PackageActivationDescriptorSchema.parse(descriptor));
	if (Buffer.byteLength(encoded) > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES) throw new Error("Package publication descriptor exceeds 1 MiB");
	return encoded;
}
/** An existing operation is never bootstrapped, migrated, or repaired on open. */
function openPackageActivationJournal(anchor) {
	return openJournal(anchor, false);
}
/** Device drift permits settlement only, never publication or restoration. */
function openPackageActivationSettlementJournal(anchor) {
	return openJournal(anchor, true);
}
function openJournal(anchor, settlementOnly) {
	assertPackageActivationLayout(anchor);
	const journalPath = resolvePackageActivationJournalPath(anchor);
	const parent = path.dirname(anchor);
	const parentIdentity = packageActivationIdentity(parent, "parent");
	const control = resolvePackageActivationControl(anchor);
	const journalParentIdentity = privatePackageActivationIdentity(control, "control");
	const journalIdentity = privatePackageActivationIdentity(journalPath, "journal");
	const assertFiles = () => {
		if (packageActivationIdentity(parent, "parent") !== parentIdentity || privatePackageActivationIdentity(control, "control") !== journalParentIdentity || privatePackageActivationIdentity(journalPath, "journal") !== journalIdentity || fs.realpathSync(control) !== control) throw new Error("Package publication journal identity changed");
	};
	const withDatabase = (write, operation) => withExistingSqliteRollbackDatabase(journalPath, {
		write,
		busyTimeoutMs: 0,
		assertIdentity: assertFiles,
		validate: (db) => {
			executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(0));
		}
	}, (db, transact) => {
		if (write) db.exec("PRAGMA synchronous = EXTRA");
		return operation(db, transact);
	});
	const matchesInstallation = (descriptor) => descriptor.parentIdentity === parentIdentity && descriptor.journalParentIdentity === journalParentIdentity && descriptor.journalIdentity === journalIdentity;
	const installationMismatchMessage = (descriptor) => {
		const changes = [
			[
				"parent",
				descriptor.parentIdentity,
				parentIdentity
			],
			[
				"control dir",
				descriptor.journalParentIdentity,
				journalParentIdentity
			],
			[
				"journal",
				descriptor.journalIdentity,
				journalIdentity
			]
		].flatMap(([name, recorded, current]) => {
			if (recorded === current) return [];
			return [`${name} (recorded ${recorded}; current ${current}${recorded.split(":")[1] === current.split(":")[1] ? "; device number changed only" : ""})`];
		});
		return `Package publication journal does not match its installation${changes.length ? `: ${changes.join("; ")}` : ""}. Run ${formatCliCommand("openclaw update repair")}.`;
	};
	const inspectRemount = (descriptor) => {
		const historicalDevices = /* @__PURE__ */ new Map();
		const currentDevices = /* @__PURE__ */ new Map();
		const identities = [];
		const bind = (historical, observe) => {
			const current = observe();
			const [oldDevice, oldInode] = historical.split(":");
			const [device, inode] = current.split(":");
			if (oldInode !== inode || !oldDevice || !device || historicalDevices.has(device) && historicalDevices.get(device) !== oldDevice || currentDevices.has(oldDevice) && currentDevices.get(oldDevice) !== device) throw new Error("Package settlement inode or device mapping changed.");
			historicalDevices.set(device, oldDevice);
			currentDevices.set(oldDevice, device);
			identities.push(() => {
				if (observe() !== current) throw new Error("Package settlement custody changed.");
			});
			return current;
		};
		bind(descriptor.parentIdentity, () => packageActivationIdentity(path.dirname(anchor), "parent"));
		bind(descriptor.journalParentIdentity, () => privatePackageActivationIdentity(resolvePackageActivationControl(anchor), "control"));
		bind(descriptor.journalIdentity, () => privatePackageActivationIdentity(resolvePackageActivationJournalPath(anchor), "journal"));
		return {
			bind,
			historicalDevices,
			currentIdentity(historical) {
				const [device = "", inode] = historical.split(":");
				return `${currentDevices.get(device) ?? device}:${inode}`;
			},
			assertUnchanged() {
				identities.forEach((assertIdentity) => assertIdentity());
			}
		};
	};
	const decode = (row, completedInstallKey, allowSettlementInspection = settlementOnly) => {
		if (!row || row.slot !== 1 || !Number.isSafeInteger(row.revision) || row.revision < 0 || Buffer.byteLength(row.descriptor_json) > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES) throw new Error("Package publication journal is missing or invalid");
		const descriptor = PackageActivationDescriptorSchema.parse(JSON.parse(row.descriptor_json));
		if (resolvePackageActivationAnchor(descriptor.authority.installKey) !== anchor || packageActivationIdentity(parent, "parent") !== parentIdentity || completedInstallKey !== void 0 && descriptor.authority.installKey !== completedInstallKey || new Set(descriptor.launchers.map((entry) => entry.name)).size !== descriptor.launchers.length) throw new Error(installationMismatchMessage(descriptor));
		const expectedTransfers = /* @__PURE__ */ new Map([
			["anchor", descriptor.anchorIdentity],
			["helper", descriptor.helperIdentity],
			["candidate", descriptor.candidate.identity],
			["launchers", descriptor.launcherRootIdentity]
		]);
		if (descriptor.previousLauncherRootIdentity) expectedTransfers.set("previous-launchers", descriptor.previousLauncherRootIdentity);
		if (descriptor.preparation.length !== expectedTransfers.size || new Set(descriptor.preparation.map((entry) => entry.name)).size !== expectedTransfers.size || descriptor.preparation.some((entry) => expectedTransfers.get(entry.name) !== entry.identity) || descriptor.preparation.find((entry) => entry.name === "candidate")?.source !== descriptor.originalStageRoot) throw new Error("Preparation custody does not match the recorded objects.");
		const publications = array(strictObject({
			name: basename$1,
			identity: packageActivationIdentitySchema
		})).max(64).parse(JSON.parse(row.publications_json));
		const intent = intentSchema.parse(JSON.parse(row.intent_json));
		const names = new Set(descriptor.launchers.map((entry) => entry.name));
		if (new Set(publications.map((entry) => entry.name)).size !== publications.length || publications.some((entry) => !names.has(entry.name)) || intent?.kind === "launcher" && !names.has(intent.name)) throw new Error("Package publication intent names an unknown launcher.");
		const record = {
			revision: row.revision,
			phase: PackageActivationPhaseSchema.parse(row.phase),
			intent,
			descriptor,
			publications
		};
		if (!matchesInstallation(descriptor) && !isPackageActivationComplete(anchor, record)) {
			if (!allowSettlementInspection || ![
				"prepared",
				"publishing",
				"publication-complete",
				"superseded"
			].includes(record.phase)) throw new Error(installationMismatchMessage(descriptor));
			inspectRemount(descriptor);
		}
		return record;
	};
	const readRow = (db) => {
		const sizes = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").select((eb) => [
			"slot",
			eb.fn("length", [eb.cast("descriptor_json", "blob")]).as("descriptor_bytes"),
			eb.fn("length", [eb.cast("intent_json", "blob")]).as("intent_bytes"),
			eb.fn("length", [eb.cast("publications_json", "blob")]).as("publications_bytes")
		]).limit(2)).rows;
		const size = sizes[0];
		if (sizes.length !== 1 || !size || size.slot !== 1 || [
			size.descriptor_bytes,
			size.intent_bytes,
			size.publications_bytes
		].some((bytes) => bytes > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES)) throw new Error("Package publication journal must contain one bounded operation.");
		const rows = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(2)).rows;
		if (rows.length !== 1) throw new Error("Package publication journal must contain exactly one operation.");
		return rows[0];
	};
	const read = () => withDatabase(false, (db) => decode(readRow(db)));
	const assertRecord = (expected, actual) => {
		if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error("Package publication intent is no longer current");
	};
	const writeCurrent = (expected, assertCurrent, write) => withDatabase(true, (db, transact) => transact(() => {
		assertFiles();
		assertCurrent();
		const previous = decode(readRow(db));
		assertRecord(expected, previous);
		return write(db, previous);
	}, { withCommit: (commit) => {
		assertFiles();
		assertCurrent();
		commit();
	} }));
	const transition = (expected, phase, intent, assertCurrent, publications = expected.publications, descriptor = expected.descriptor) => {
		if (settlementOnly && !matchesInstallation(expected.descriptor) && (phase !== "superseded" || !intent || !("settled" in intent) || !intent.settled || !isDeepStrictEqual(descriptor, expected.descriptor) || !isDeepStrictEqual(publications, expected.publications))) throw new Error("Settlement inspection cannot authorize package publication or restoration.");
		const descriptorJsonValue = descriptorJson(descriptor);
		const intentJson = JSON.stringify(intentSchema.parse(intent));
		PackageActivationPhaseSchema.parse(phase);
		assertCurrent();
		return writeCurrent(expected, assertCurrent, (db) => {
			executeSqliteQuerySync(db, queries(db).updateTable("package_activation").set({
				revision: expected.revision + 1,
				phase,
				descriptor_json: descriptorJsonValue,
				intent_json: intentJson,
				publications_json: JSON.stringify(publications)
			}).where("slot", "=", 1).where("revision", "=", expected.revision));
			return decode(readRow(db));
		});
	};
	return {
		read,
		inspectRemount(expected) {
			assertRecord(expected, read());
			return matchesInstallation(expected.descriptor) || isPackageActivationComplete(anchor, expected) ? void 0 : inspectRemount(expected.descriptor);
		},
		archiveSettled(expected, assertCurrent) {
			const retained = `${anchor}.superseded-${expected.descriptor.operationId}`;
			const archive = path.join(retained, "control");
			const assertClosed = () => {
				assertCurrent();
				assertFiles();
				assertRecord(expected, read());
				if (!isPackageActivationComplete(anchor, expected)) throw new Error("Only completed package settlement evidence can be archived.");
			};
			assertClosed();
			const source = fs.lstatSync(anchor, { throwIfNoEntry: false });
			const destination = fs.lstatSync(retained, { throwIfNoEntry: false });
			if (source && destination) throw new Error("Package settlement evidence archive already exists.");
			let retainedIdentity;
			if (source) {
				retainedIdentity = packageActivationIdentity(anchor, true);
				assertClosed();
				try {
					fs.renameSync(anchor, retained);
				} catch (error) {
					if (fs.lstatSync(anchor, { throwIfNoEntry: false }) || !fs.lstatSync(retained, { throwIfNoEntry: false }) || packageActivationIdentity(retained, true) !== retainedIdentity) throw error;
				}
			} else {
				if (!destination) {
					assertClosed();
					fs.mkdirSync(retained, { mode: 448 });
				}
				retainedIdentity = packageActivationIdentity(retained, true);
			}
			const assertSettled = () => {
				assertClosed();
				if (packageActivationIdentity(retained, true) !== retainedIdentity || fs.realpathSync(retained) !== retained || fs.lstatSync(archive, { throwIfNoEntry: false })) throw new Error("Package settlement control archive changed or already exists.");
			};
			assertSettled();
			for (const directory of [
				control,
				parent,
				retained
			]) requireDirectorySync(syncDirectorySync(directory), "Package settlement control archive");
			assertSettled();
			try {
				fs.renameSync(control, archive);
			} catch (error) {
				if (fs.lstatSync(control, { throwIfNoEntry: false }) || !fs.lstatSync(archive, { throwIfNoEntry: false }) || privatePackageActivationIdentity(archive, "control") !== journalParentIdentity) throw error;
			}
			for (const directory of [retained, parent]) {
				assertCurrent();
				if (packageActivationIdentity(parent, "parent") !== parentIdentity || fs.realpathSync(retained) !== retained || packageActivationIdentity(retained, true) !== retainedIdentity || privatePackageActivationIdentity(archive, "control") !== journalParentIdentity || privatePackageActivationIdentity(path.join(archive, PACKAGE_ACTIVATION_JOURNAL), "journal") !== journalIdentity) throw new Error("Package settlement control archive identity changed.");
				requireDirectorySync(syncDirectorySync(directory), "Package settlement control archive");
			}
			assertCurrent();
		},
		readForAdmission(installKey) {
			return withDatabase(false, (db) => decode(readRow(db), installKey, false));
		},
		recordPreviousCopy(expected, previous, assertCurrent) {
			if (expected.phase !== "publishing" || expected.intent?.kind !== "copy-previous" || expected.intent.identity !== previous.identity) throw new Error("Package copy does not match its recorded custody.");
			return transition(expected, "publishing", {
				kind: "displace-copy",
				source: expected.descriptor.previous,
				removing: false
			}, assertCurrent, expected.publications, {
				...expected.descriptor,
				previous
			});
		},
		readForRecovery() {
			return prepareSqliteRollbackRecovery({
				path: journalPath,
				scratchRoot: control,
				assertIdentity: assertFiles,
				assertFileSafe(file) {
					privatePackageActivationIdentity(file, "rollback-journal");
				},
				read: (db) => decode(readRow(db))
			});
		},
		assertCurrent(expected) {
			assertRecord(expected, read());
		},
		transition(expected, phase, intent, assertCurrent, publications = expected.publications) {
			return transition(expected, phase, intent, assertCurrent, publications);
		}
	};
}
function preparationSource(descriptor, name) {
	const source = descriptor.preparation.find((entry) => entry.name === name)?.source;
	if (!source) throw new Error("Package preparation bootstrap custody is missing.");
	return source;
}
/** Only the original admitted producer may create the one-operation database. */
function createPackageActivationJournal(anchor, descriptor, stagedControl, assertCurrent, onCustody) {
	const control = resolvePackageActivationControl(anchor);
	const journalPath = path.join(stagedControl, PACKAGE_ACTIVATION_JOURNAL);
	const helperPath = path.join(stagedControl, "recovery.mjs");
	const assertAnchor = () => {
		assertCurrent();
		assertPackageActivationLayout(anchor);
		if (privatePackageActivationIdentity(preparationSource(descriptor, "anchor"), "anchor") !== descriptor.anchorIdentity || packageActivationIdentity(path.dirname(anchor), "parent") !== descriptor.parentIdentity || fs.realpathSync(path.dirname(anchor)) !== path.dirname(anchor) || privatePackageActivationIdentity(stagedControl, "control") !== descriptor.journalParentIdentity || fs.realpathSync(stagedControl) !== stagedControl || descriptor.journalParentIdentity.split(":")[0] !== descriptor.parentIdentity.split(":")[0] || preparationSource(descriptor, "helper") !== resolvePackageActivationHelper(anchor) || descriptor.preparation.find((entry) => entry.name === "helper")?.sourceParentIdentity !== descriptor.journalParentIdentity || privatePackageActivationIdentity(helperPath, "helper") !== descriptor.helperIdentity || createHash("sha256").update(fs.readFileSync(helperPath)).digest("hex") !== descriptor.helperDigest || packageActivationIdentity(descriptor.authority.installKey, true) !== descriptor.previous.identity || packageActivationIdentity(descriptor.originalStageRoot, true) !== descriptor.candidate.identity || fs.lstatSync(anchor, { throwIfNoEntry: false }) || fs.lstatSync(control, { throwIfNoEntry: false })) throw new Error("Package publication journal identity changed");
	};
	assertAnchor();
	descriptorJson({
		...descriptor,
		journalIdentity: "0:0"
	});
	let journalIdentity;
	let initial;
	const assertCreated = () => {
		assertAnchor();
		if (privatePackageActivationIdentity(journalPath, "journal") !== journalIdentity) throw new Error("Package publication journal identity changed");
	};
	const fd = fs.openSync(journalPath, "wx", 384);
	try {
		const created = fs.fstatSync(fd, { bigint: true });
		journalIdentity = `${created.dev}:${created.ino}`;
		initial = {
			slot: 1,
			revision: 0,
			phase: "preparing",
			descriptor_json: descriptorJson({
				...descriptor,
				journalIdentity
			}),
			intent_json: JSON.stringify({
				kind: "prepare",
				completed: ["helper"],
				moving: null
			}),
			publications_json: "[]"
		};
		assertCreated();
		const db = openNodeSqliteDatabase(resolveExistingSqliteFileUri(journalPath));
		try {
			assertCreated();
			executeSqliteQuerySync(db, queries(db).schema.createTable("package_activation").addColumn("slot", "integer", (column) => column.primaryKey().notNull()).addColumn("revision", "integer", (column) => column.notNull()).addColumn("phase", "text", (column) => column.notNull()).addColumn("descriptor_json", "text", (column) => column.notNull()).addColumn("intent_json", "text", (column) => column.notNull()).addColumn("publications_json", "text", (column) => column.notNull()).modifyEnd(sql`STRICT`));
			assertCreated();
			executeSqliteQuerySync(db, queries(db).insertInto("package_activation").values(initial));
		} finally {
			if (db.isOpen) db.close();
		}
	} finally {
		fs.closeSync(fd);
	}
	const assertReady = () => {
		assertCreated();
		if (!isDeepStrictEqual(fs.readdirSync(stagedControl).toSorted(), [PACKAGE_ACTIVATION_JOURNAL, "recovery.mjs"])) throw new Error("Private package control contains unknown objects.");
	};
	const verifyPrivate = () => withExistingSqliteRollbackDatabase(journalPath, {
		write: false,
		busyTimeoutMs: 0,
		assertIdentity: assertReady,
		validate: () => {}
	}, (db) => {
		const rows = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(2)).rows;
		if (rows.length !== 1 || !isDeepStrictEqual({ ...rows[0] }, initial)) throw new Error("Private package publication journal is incomplete.");
	});
	verifyPrivate();
	requireDirectorySync(syncDirectorySync(stagedControl), "Private package control");
	onCustody?.(true);
	try {
		assertReady();
		fs.renameSync(stagedControl, control);
		for (const directory of /* @__PURE__ */ new Set([path.dirname(stagedControl), path.dirname(control)])) {
			assertCurrent();
			requireDirectorySync(syncDirectorySync(directory), "Package control publication");
		}
	} catch (error) {
		try {
			if (!fs.lstatSync(control, { throwIfNoEntry: false })) {
				verifyPrivate();
				onCustody?.(false);
			}
		} catch {}
		throw error;
	}
	const journal = openPackageActivationJournal(anchor);
	if (descriptorJson(journal.read().descriptor) !== initial.descriptor_json) throw new Error("Published package control identity changed.");
	assertCurrent();
	return journal;
}
//#endregion
//#region src/infra/package-update-activation-custody.ts
function packageActivationIdentityOrAbsent(file, directory) {
	try {
		return packageActivationIdentity(file, directory);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
}
function inspectPackageActivationCustody(anchor, record) {
	if (record.phase !== "preparing" || record.intent?.kind !== "prepare") throw new Error("Package preparation requires its recorded transfer intent.");
	const intent = record.intent;
	const descriptor = record.descriptor;
	if (new Set(intent.completed).size !== intent.completed.length || intent.completed.some((name) => !descriptor.preparation.some((entry) => entry.name === name)) || intent.moving !== null && intent.completed.includes(intent.moving)) throw new Error("Package preparation custody is invalid.");
	return descriptor.preparation.map((entry) => {
		const destination = entry.name === "anchor" ? anchor : entry.name === "helper" ? resolvePackageActivationHelper(anchor) : path.join(anchor, entry.name);
		if (entry.source === descriptor.authority.installKey || entry.source.startsWith(`${anchor}${path.sep}`) || fs.realpathSync(path.dirname(entry.source)) !== path.dirname(entry.source) || packageActivationIdentity(path.dirname(entry.source), "parent") !== entry.sourceParentIdentity) throw new Error("Package preparation source parent changed.");
		const source = packageActivationIdentityOrAbsent(entry.source, entry.name !== "helper");
		const target = packageActivationIdentityOrAbsent(destination, entry.name !== "helper");
		const resident = entry.name === "helper" && entry.source === destination;
		if (resident && (entry.sourceParentIdentity !== descriptor.journalParentIdentity || !intent.completed.includes("helper") || intent.moving === "helper" || source !== entry.identity)) throw new Error("Resident package helper custody is invalid.");
		const moved = resident || source === null && target === entry.identity;
		if (moved) {
			if (!intent.completed.includes(entry.name) && intent.moving !== entry.name) throw new Error("Package preparation transfer has no recorded intent.");
		} else if (source !== entry.identity || target !== null || intent.completed.includes(entry.name)) throw new Error("Package preparation object custody is ambiguous or replaced.");
		return {
			name: entry.name,
			source: entry.source,
			identity: entry.identity,
			sourceParentIdentity: entry.sourceParentIdentity,
			destination,
			moved
		};
	});
}
async function completePackageActivationCustody(anchor, journal, assertCurrent, onHelperReady) {
	let record = journal.read();
	if (record.phase !== "preparing") return;
	const entries = inspectPackageActivationCustody(anchor, record);
	const control = resolvePackageActivationControl(anchor);
	for (const directory of /* @__PURE__ */ new Set([
		control,
		path.dirname(control),
		...entries.map((entry) => path.dirname(entry.source))
	])) {
		assertCurrent();
		journal.assertCurrent(record);
		requireDirectorySync(await syncDirectory(directory), "Package preparation control");
	}
	assertCurrent();
	journal.assertCurrent(record);
	if (record.intent?.kind === "prepare" && record.intent.completed.includes("helper")) {
		assertCurrent();
		journal.assertCurrent(record);
		onHelperReady?.();
	}
	for (const entry of entries) {
		if (record.intent?.kind !== "prepare") throw new Error("Preparation intent changed.");
		if (record.intent.completed.includes(entry.name)) continue;
		if (!entry.moved) {
			record = journal.transition(record, "preparing", {
				kind: "prepare",
				completed: record.intent.completed,
				moving: entry.name
			}, assertCurrent);
			assertCurrent();
			journal.assertCurrent(record);
			const current = inspectPackageActivationCustody(anchor, record).find((item) => item.name === entry.name);
			if (!current || current.moved) throw new Error("Preparation preimage changed before rename.");
			await fs$1.rename(entry.source, entry.destination);
		}
		for (const directory of /* @__PURE__ */ new Set([path.dirname(entry.source), path.dirname(entry.destination)])) {
			assertCurrent();
			journal.assertCurrent(record);
			requireDirectorySync(await syncDirectory(directory), "Package preparation transfer");
		}
		assertCurrent();
		journal.assertCurrent(record);
		if (!inspectPackageActivationCustody(anchor, record).find((item) => item.name === entry.name)?.moved || record.intent?.kind !== "prepare") throw new Error("Preparation transfer was not observed.");
		record = journal.transition(record, "preparing", {
			kind: "prepare",
			completed: [...record.intent.completed, entry.name],
			moving: null
		}, assertCurrent);
		if (entry.name === "helper") onHelperReady?.();
	}
	journal.transition(record, "prepared", null, assertCurrent);
}
/** Recognized obsolete custody closes before best-effort evidence maintenance. */
function settlePackageActivationCustody(params) {
	const { anchor, journal, settlement, assertCurrent } = params;
	const record = journal.transition(params.record, "superseded", {
		...settlement,
		settled: true
	}, assertCurrent);
	params.onSettled?.();
	const warning = archivePackageActivationCustody(anchor, journal, record, params.assertArchiveCurrent ?? assertCurrent);
	return {
		record,
		warning: `${settlement.detail ?? settlement.kind}. ${warning ?? `Preserved at ${anchor}.superseded-${record.descriptor.operationId}`}`,
		archiveWarning: warning
	};
}
/** Completed history is never a prerequisite for the next mutable update. */
function archivePackageActivationCustody(anchor, journal, record, assertCurrent) {
	const retained = `${anchor}.superseded-${record.descriptor.operationId}`;
	try {
		journal.archiveSettled(record, assertCurrent);
	} catch (error) {
		assertCurrent();
		if (fs.lstatSync(resolvePackageActivationJournalPath(anchor), { throwIfNoEntry: false })) journal.assertCurrent(record);
		return `Closed recovery evidence could not be fully archived at ${retained}: ${formatErrorMessage(error)}`;
	}
	assertCurrent();
}
//#endregion
//#region src/infra/package-update-activation-runtime-assets.ts
const packageActivationRuntimeEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "package-update-activation-sealed",
	distWorkerPath: "package-update-activation-recovery.mjs"
};
//#endregion
//#region src/infra/package-update-activation-sqlite.ts
const SQLITE_LIBRARY_HEADER = "// openclaw-package-recovery-sqlite: ";
/** The existing helper digest binds this recovery hint without changing the v1 journal. */
function sealPackageActivationSqliteLibrary(helper, library) {
	return library ? Buffer.concat([Buffer.from(`${SQLITE_LIBRARY_HEADER}${JSON.stringify(library)}\n`), helper]) : helper;
}
function readPackageActivationSqliteLibrary(helper) {
	const end = helper.indexOf(10);
	const firstLine = helper.subarray(0, end < 0 ? helper.length : end).toString("utf8");
	if (!firstLine.startsWith(SQLITE_LIBRARY_HEADER)) return;
	const library = JSON.parse(firstLine.slice(37));
	if (typeof library !== "string" || !path.isAbsolute(library)) throw new Error("Package recovery SQLite library must be an absolute path.");
	return library;
}
function packageActivationSqliteEnvironment(library) {
	return `OPENCLAW_SQLITE_LIBRARY=${quoteCliArg(library)}`;
}
//#endregion
//#region src/infra/package-update-activation-prepare.ts
var PackageActivationArchiveError = class extends Error {};
function packageActivationRecoveryCommand(node, anchor, operationId, helper = resolvePackageActivationHelper(anchor), sqliteLibrary) {
	return `${sqliteLibrary ? `${packageActivationSqliteEnvironment(sqliteLibrary)} ` : ""}${quoteCliArg(node)} ${quoteCliArg(helper)} --anchor ${quoteCliArg(anchor)} --operation ${quoteCliArg(operationId)}`;
}
function resolvePackageActivationRecoveryCommand(record) {
	const anchor = resolvePackageActivationAnchor(record.descriptor.authority.installKey);
	let helper = resolvePackageActivationHelper(anchor);
	if (record.phase === "preparing") {
		const custody = inspectPackageActivationCustody(anchor, record).find((entry) => entry.name === "helper");
		if (!custody) throw new Error("Package bootstrap helper custody is missing.");
		helper = custody.moved ? custody.destination : custody.source;
	}
	const node = record.descriptor.recoveryNodePath;
	const bytes = fs.readFileSync(helper);
	if (createHash("sha256").update(bytes).digest("hex") !== record.descriptor.helperDigest) throw new Error("Package recovery helper digest changed.");
	return packageActivationRecoveryCommand(node, anchor, record.descriptor.operationId, helper, readPackageActivationSqliteLibrary(bytes));
}
async function preparePackageActivationJournal(params, assertion = params.options.fence.assertCurrent.bind(params.options.fence)) {
	const assertCurrent = retainMutationAuthority(assertion);
	assertCurrent();
	const authority = captureUpdateCommandExecutorAuthority(params.options.fence);
	assertCurrent();
	const liveRoot = resolveUpdateInstallRoot(params.liveRoot);
	if (process.platform === "win32" || authority.installKey !== liveRoot) throw new Error("Package publication recovery requires its original POSIX npm directory.");
	const anchor = resolvePackageActivationAnchor(authority.installKey);
	const parent = path.dirname(anchor);
	if (fs.realpathSync(parent) !== parent) throw new Error("Package publication recovery requires canonical installation parents.");
	const stageRoot = resolveUpdateInstallRoot(params.stageRoot);
	const launcherRoot = resolveUpdateInstallRoot(params.launcherRoot);
	const binDir = resolveUpdateInstallRoot(params.binDir);
	const previousLauncherRoot = params.previousLauncherRoot ? resolveUpdateInstallRoot(params.previousLauncherRoot) : void 0;
	const runtime = params.options.runtime;
	const node = fs.realpathSync(runtime.path);
	const assertRuntime = () => {
		if (node !== runtime.path || packageActivationRuntimeIdentity(node) !== runtime.identity) throw new Error("The selected package recovery executable changed after runtime preflight.");
	};
	assertRuntime();
	for (const root of [
		liveRoot,
		stageRoot,
		anchor
	]) if (node === root || node.startsWith(`${root}${path.sep}`)) throw new Error("Recovery requires an external Node executable.");
	let sqliteLibrary;
	if (runtime.kind === "bun") {
		const info = await resolveBunRuntimeInfo(node, void 0, runtime.env ?? process.env);
		if (info.status !== "supported") throw new Error("Recovery requires a supported external Bun executable.", { cause: info.status === "probe-failed" ? info.error : void 0 });
		sqliteLibrary = info.sqliteLibraryPath;
	} else {
		const version = spawnSync(node, ["--version"], {
			env: {},
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		if (version.status !== 0 || !isSupportedOpenClawNodeVersion(version.stdout.trim().replace(/^v/u, ""))) throw new Error("Recovery requires a supported external Node executable.");
	}
	assertCurrent();
	assertRuntime();
	let candidate;
	try {
		candidate = await createPackageIntegrityReader().tree(stageRoot);
	} catch (error) {
		if (!isPackageIntegrityResourceError(error)) throw error;
		const identity = await createPackageIntegrityReader().directoryIdentity(stageRoot);
		if (!identity) throw error;
		candidate = identity;
		params.options.onWarning?.("candidate package fingerprint incomplete; activation requires the directory identity, package version and launchers; full package contents are unverified");
	}
	const reader = createPackageIntegrityReader();
	const launchers = [];
	for (const entry of params.launchers) {
		const source = path.join(launcherRoot, entry.name);
		const destination = path.join(binDir, entry.name);
		launchers.push({
			...entry,
			candidate: encodePackageActivationLauncher(await reader.launcher(source)),
			candidateIdentity: packageActivationIdentity(source, "launcher"),
			previousIdentity: entry.previous === null ? null : packageActivationIdentity(destination, "launcher")
		});
	}
	const parentIdentity = packageActivationIdentity(parent, "parent");
	const binIdentity = packageActivationIdentity(binDir, "parent");
	if (candidate.identity.split(":")[0] !== parentIdentity.split(":")[0] || params.previous.identity.split(":")[0] !== parentIdentity.split(":")[0]) throw new Error("Package publication recovery requires same-filesystem directories.");
	assertPackageActivationLayout(anchor);
	const priorJournal = fs.lstatSync(resolvePackageActivationControl(anchor), { throwIfNoEntry: false }) ? openPackageActivationJournal(anchor) : void 0;
	const prior = priorJournal?.read();
	if (prior && !isPackageActivationComplete(anchor, prior)) throw new Error("An unresolved package operation already owns this installation. Run openclaw update repair before retrying.");
	if (priorJournal && prior) try {
		priorJournal.archiveSettled(prior, assertCurrent);
	} catch (error) {
		assertCurrent();
		if (fs.existsSync(resolvePackageActivationJournalPath(anchor))) priorJournal.assertCurrent(prior);
		throw new PackageActivationArchiveError(`Completed package recovery evidence retained; standalone publication repair is unavailable for this update: ${formatErrorMessage(error)}`, { cause: error });
	}
	const preparation = [
		{
			name: "candidate",
			source: stageRoot,
			identity: candidate.identity
		},
		{
			name: "launchers",
			source: launcherRoot,
			identity: packageActivationIdentity(launcherRoot, true)
		},
		...previousLauncherRoot ? [{
			name: "previous-launchers",
			source: previousLauncherRoot,
			identity: packageActivationIdentity(previousLauncherRoot, true)
		}] : []
	].map((entry) => ({
		name: entry.name,
		source: entry.source,
		identity: entry.identity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(entry.source), "parent")
	}));
	const source = resolveRuntimeWorkerUrl(packageActivationRuntimeEntrypoint);
	if (!source.pathname.endsWith(".mjs")) throw new Error("Package publication recovery requires its built sealed helper.");
	const helperBytes = sealPackageActivationSqliteLibrary(fs.readFileSync(source), sqliteLibrary);
	assertCurrent();
	assertRuntime();
	const stagedAnchor = await fs$1.mkdtemp(path.join(path.dirname(stageRoot), ".activation-anchor-"));
	const anchorIdentity = packageActivationIdentity(stagedAnchor, true);
	const stagedControl = await fs$1.mkdtemp(path.join(path.dirname(stageRoot), ".activation-control-"));
	const stagedHelper = path.join(stagedControl, "recovery.mjs");
	assertCurrent();
	const helperFd = fs.openSync(stagedHelper, "wx", 384);
	try {
		fs.writeFileSync(helperFd, helperBytes);
		fs.fsyncSync(helperFd);
	} finally {
		fs.closeSync(helperFd);
	}
	for (const directory of /* @__PURE__ */ new Set([
		stagedAnchor,
		path.dirname(stagedHelper),
		path.dirname(stagedAnchor)
	])) {
		assertCurrent();
		requireDirectorySync(await syncDirectory(directory), "Package preparation staging");
	}
	assertCurrent();
	const helperIdentity = packageActivationIdentity(stagedHelper, false);
	const helperDigest = createHash("sha256").update(helperBytes).digest("hex");
	preparation.unshift({
		name: "anchor",
		source: stagedAnchor,
		identity: anchorIdentity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(stagedAnchor), "parent")
	}, {
		name: "helper",
		source: resolvePackageActivationHelper(anchor),
		identity: helperIdentity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(stagedHelper), "parent")
	});
	const descriptor = {
		version: 1,
		layout: "external-helper",
		operationId: randomUUID(),
		recoveryNodePath: node,
		authority,
		anchorIdentity,
		parentIdentity,
		journalParentIdentity: packageActivationIdentity(stagedControl, true),
		binDir,
		binIdentity,
		originalStageRoot: stageRoot,
		previous: params.previous,
		candidate,
		launcherRootIdentity: packageActivationIdentity(launcherRoot, true),
		previousLauncherRootIdentity: previousLauncherRoot ? packageActivationIdentity(previousLauncherRoot, true) : null,
		helperDigest,
		helperIdentity,
		preparation,
		launchers
	};
	const journal = createPackageActivationJournal(anchor, descriptor, stagedControl, assertCurrent, params.onCustody);
	const command = packageActivationRecoveryCommand(node, anchor, descriptor.operationId, void 0, sqliteLibrary);
	assertCurrent();
	await completePackageActivationCustody(anchor, journal, assertCurrent, () => params.options.onPrepared(`${command} status`));
	const initial = journal.read();
	initial.descriptor.previous = params.previous;
	initial.descriptor.candidate = candidate;
	return {
		anchor,
		journal,
		command,
		initial
	};
}
//#endregion
//#region src/infra/package-update-activation-settlement.ts
const PACKAGE_RECOVERY_2026_9_9_HELPER = "6ae5112de5a98832da6c8151c65a9cc1e42c59f210284e539e45cf4f280a427f";
/** Qualify untouched preparation or a lost publish acknowledgement, never arbitrary stale custody. */
function inspectRemountedPackagePublication(anchor, record, remount) {
	const d = record.descriptor;
	const live = d.authority.installKey;
	const selected = packageActivationIdentity(live, true) === remount.currentIdentity(d.previous.identity) ? "previous" : "candidate";
	const { bind } = remount;
	const helper = resolvePackageActivationHelper(anchor);
	bind(d.helperIdentity, () => privatePackageActivationIdentity(helper, "helper"));
	bind(d.anchorIdentity, () => privatePackageActivationIdentity(anchor, "anchor"));
	bind(d.previous.identity, () => packageActivationIdentity(selected === "previous" ? live : path.join(anchor, "previous"), true));
	bind(d.launcherRootIdentity, () => packageActivationIdentity(path.join(anchor, "launchers"), true));
	if (d.previousLauncherRootIdentity) bind(d.previousLauncherRootIdentity, () => packageActivationIdentity(path.join(anchor, "previous-launchers"), true));
	if (selected === "candidate") bind(d.candidate.identity, () => packageActivationIdentity(live, true));
	const binIdentity = bind(d.binIdentity, () => packageActivationIdentity(d.binDir, "parent"));
	for (const entry of d.launchers) {
		const launcher = path.join(d.binDir, entry.name);
		const current = packageActivationIdentityOrAbsent(launcher, "launcher");
		if (selected === "previous" && entry.previousIdentity === null && current === null) continue;
		const previous = entry.previousIdentity;
		const historical = previous && previous.split(":")[1] === current?.split(":")[1] ? previous : entry.candidateIdentity;
		if (selected === "candidate" && historical === previous && !matchesPackageActivationLauncher(entry.previous ? decodePackageActivationLauncher(entry.previous) : null, entry.candidate)) throw new Error("Package settlement original launcher did not already match the candidate.");
		bind(selected === "previous" && previous ? previous : historical, () => packageActivationIdentity(launcher, "launcher"));
	}
	const assertUnchanged = () => {
		remount.assertUnchanged();
		if (fs.lstatSync(path.join(anchor, selected === "previous" ? "previous" : "candidate"), { throwIfNoEntry: false }) || fs.lstatSync(d.originalStageRoot, { throwIfNoEntry: false }) || createHash("sha256").update(fs.readFileSync(helper)).digest("hex") !== d.helperDigest) throw new Error("Package settlement requires the original helper and an unambiguous installed generation.");
	};
	assertUnchanged();
	return {
		...remount,
		binIdentity,
		assertUnchanged,
		selected
	};
}
/** Verify the installed generation without republishing it; remounts also prove the sealed tree. */
async function verifyPackagePublicationSettlement(record, assertCurrent, remount) {
	const descriptor = record.descriptor;
	const live = descriptor.authority.installKey;
	const selected = remount?.selected ?? "candidate";
	const expectedTree = descriptor[selected];
	const installedIdentity = remount?.currentIdentity(expectedTree.identity) ?? expectedTree.identity;
	assertCurrent();
	let assertTreeUnchanged;
	if (remount) {
		remount.assertUnchanged();
		const tree = await createPackageIntegrityReader().tree(live, selected === "previous" ? live : descriptor.originalStageRoot, void 0, [LEGACY_PACKAGE_RECOVERY_HELPER, PACKAGE_RECOVERY_2026_9_9_HELPER].includes(descriptor.helperDigest), remount.historicalDevices);
		assertCurrent();
		remount.assertUnchanged();
		if (!isDeepStrictEqual(tree, {
			...expectedTree,
			identity: installedIdentity
		})) throw new Error(`Package settlement full ${selected} fingerprint changed.`);
		assertTreeUnchanged = () => assertPackageIntegritySettlementUnchanged(tree);
	}
	const observed = /* @__PURE__ */ new Map();
	const reader = createPackageIntegrityReader();
	for (const entry of descriptor.launchers) {
		const launcher = path.join(descriptor.binDir, entry.name);
		const stat = fs.lstatSync(launcher, {
			bigint: true,
			throwIfNoEntry: false
		});
		observed.set(launcher, stat);
		if (!matchesPackageActivationLauncher(stat ? await reader.launcher(launcher) : null, entry[selected])) throw new Error(`Package settlement launcher changed: ${entry.name}.`);
	}
	const assertInstalledUnchanged = () => {
		assertCurrent();
		assertTreeUnchanged?.();
		if (packageActivationIdentity(live, true) !== installedIdentity || packageActivationIdentity(descriptor.binDir, "parent") !== (remount?.binIdentity ?? descriptor.binIdentity)) throw new Error("Package settlement identity changed.");
		for (const [file, before] of observed) {
			const after = fs.lstatSync(file, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (before && after ? !packageStatUnchanged(before, after) : before !== after) throw new Error(`Package settlement observation changed: ${path.relative(live, file)}.`);
		}
	};
	const assertUnchanged = () => {
		remount?.assertUnchanged();
		assertInstalledUnchanged();
	};
	assertUnchanged();
	if (selected === "previous") return {
		assertUnchanged,
		assertInstalledUnchanged,
		detail: "Full previous tree and unchanged launchers verified."
	};
	for (const relative of [
		"",
		"dist",
		"package.json",
		PACKAGE_DIST_INVENTORY_RELATIVE_PATH,
		PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH
	]) {
		const file = path.join(live, relative);
		observed.set(file, fs.lstatSync(file, { bigint: true }));
	}
	const { collectPackageDistContentInventory, readPackageDistContentInventoryIfPresent, readPackageDistInventoryIfPresent } = await import("./package-dist-inventory-DTmI39xn.mjs");
	const expected = await readPackageDistContentInventoryIfPresent(live);
	const inventory = await readPackageDistInventoryIfPresent(live);
	if (!expected?.length || !inventory) throw new Error("Package settlement requires the installed package's dist content inventory.");
	const inventoried = expected.map((entry) => entry.path);
	if (!isDeepStrictEqual(inventory.toSorted(), [...inventoried, "dist/postinstall-content-inventory.json"].toSorted())) throw new Error("Package settlement inventories disagree about the required dist paths.");
	for (const relative of inventoried) {
		let file = path.join(live, relative);
		while (file !== live) {
			if (!observed.has(file)) observed.set(file, fs.lstatSync(file, { bigint: true }));
			file = path.dirname(file);
		}
	}
	const actual = await collectPackageDistContentInventory(live, inventoried);
	const mismatches = expected.filter((entry, index) => comparePackageDistContentInventory([entry], [actual[index]]).length > 0).map((entry) => entry.path);
	if (mismatches.length) throw new Error(`Package settlement refused: inventoried dist files changed: ${mismatches.join(", ")}.`);
	const buildInfo = asOptionalRecord(JSON.parse(await fs$1.readFile(path.join(live, "dist/build-info.json"), "utf8")));
	if (!inventoried.includes("dist/build-info.json") || buildInfo?.version !== descriptor.candidate.version) throw new Error(`Package settlement requires build-info version ${descriptor.candidate.version}.`);
	const manifest = readRootJsonObjectSync({
		rootDir: live,
		relativePath: "package.json",
		boundaryLabel: "Package settlement",
		rejectHardlinks: false,
		maxBytes: 16777216
	});
	if (!manifest.ok || manifest.value.name !== "openclaw" || manifest.value.version !== descriptor.candidate.version || manifest.value.type !== "module") throw new Error(`Package settlement requires package.json with name openclaw, version ${descriptor.candidate.version}, and type module.`);
	const contentPaths = new Set(inventoried);
	const assertTarget = (field, target) => {
		const file = typeof target === "string" ? path.resolve(live, target) : live;
		const relative = path.relative(live, file).split(path.sep).join("/");
		if (typeof target !== "string" || !target || target.includes("\\") || field === "exports" && !target.startsWith("./") || relative === ".." || relative.startsWith("../") || path.isAbsolute(relative) || relative.startsWith("dist/") && !contentPaths.has(relative) || !fs.statSync(file, { throwIfNoEntry: false })?.isFile()) throw new Error(`Package settlement refused: package.json ${field} must resolve to a package file (inventoried within dist)${typeof target === "string" ? `: ${target}` : "."}`);
		const resolved = fs.realpathSync(file);
		if (!resolved.startsWith(`${live}${path.sep}`)) throw new Error(`Package settlement refused: package.json ${field} leaves the package: ${target}.`);
		for (const observedPath of [file, resolved]) if (!observed.has(observedPath)) observed.set(observedPath, fs.lstatSync(observedPath, { bigint: true }));
	};
	if (manifest.value.main !== void 0) assertTarget("main", manifest.value.main);
	if (manifest.value.bin !== void 0) {
		const bins = asOptionalRecord(manifest.value.bin);
		for (const target of bins ? Object.values(bins) : [manifest.value.bin]) assertTarget("bin", target);
	}
	const exportTargets = [manifest.value.exports];
	while (exportTargets.length) {
		const target = exportTargets.pop();
		if (target === void 0 || target === null) continue;
		const conditions = asOptionalRecord(target);
		if (Array.isArray(target)) exportTargets.push(...target);
		else if (conditions) exportTargets.push(...Object.values(conditions));
		else assertTarget("exports", target);
	}
	assertUnchanged();
	const extraInspection = await walkDirectory(path.join(live, "dist"), {
		symlinks: "include",
		descend: (entry) => {
			if (!observed.has(entry.path)) observed.set(entry.path, fs.lstatSync(entry.path, { bigint: true }));
			return true;
		}
	});
	const inventoryPaths = /* @__PURE__ */ new Set([...inventory, PACKAGE_DIST_INVENTORY_RELATIVE_PATH]);
	const extraManifests = extraInspection.entries.filter((entry) => entry.name.toLowerCase() === "package.json").map((entry) => `dist/${entry.relativePath.replace(/\\/gu, "/")}`).filter((file) => !contentPaths.has(file));
	if (extraManifests.length || extraInspection.failedDirs.length) throw new Error(`Package settlement refused: unverified package.json scopes: ${[...extraManifests, ...extraInspection.failedDirs.map((entry) => `dist/${entry.relativePath} (unreadable)`)].join(", ")}.`);
	const extras = extraInspection.entries.filter((entry) => entry.kind !== "directory").map((entry) => `dist/${entry.relativePath.replace(/\\/gu, "/")}`).filter((file) => !inventoryPaths.has(file)).toSorted();
	assertUnchanged();
	return {
		assertUnchanged,
		assertInstalledUnchanged,
		detail: `${remount ? "Full candidate tree, including root manifest and entry targets, verified with historical device encoding. " : "Root package.json was field-verified, not content-verified. Entry targets outside dist were checked for resolution, not content. "}Inventoried dist content mismatches: none. Extra dist paths: ${extras.length ? extras.join(", ") : "none"}. Original per-path metadata is not retained in the sealed tree digest.`
	};
}
//#endregion
//#region src/infra/package-update-publication-tree.ts
/** Fill an already journal-owned directory without changing the live tree. */
async function copyPackagePublicationTree(source, destination, assertion) {
	const assertCurrent = retainMutationAuthority(assertion);
	assertCurrent();
	const root$1 = await root(destination, { assertBeforeMutation: assertCurrent });
	assertCurrent();
	const copy = async (relative, assertParents) => {
		assertParents();
		const from = path.join(source, relative);
		const to = path.join(destination, relative);
		const original = fs.lstatSync(from, { bigint: true });
		const assertSource = createPackagePathAssertion(from, original, assertParents);
		if (original.isDirectory()) {
			if (relative) await root$1.mkdir(relative, {
				private: true,
				assertBeforeMutation: assertSource
			});
			assertSource();
			const directory = fs.lstatSync(to, { bigint: true });
			const assertDirectory = createPackagePathAssertion(to, directory, assertSource);
			const children = await fs$1.readdir(from);
			assertDirectory();
			for (const child of children) await copy(path.join(relative, child), assertDirectory);
			assertDirectory();
			if (directory.uid !== original.uid || directory.gid !== original.gid) {
				await fs$1.chown(to, Number(original.uid), Number(original.gid));
				assertDirectory();
			}
			await fs$1.chmod(to, Number(original.mode));
			assertDirectory();
			requireDirectorySync(await syncDirectory(to), "Copied package directory");
			assertDirectory();
		} else if (original.isFile()) {
			await root$1.copyIn(relative, from, {
				sourceHardlinks: "allow",
				preserveSourceMode: true,
				maxBytes: Number(original.size),
				mkdir: false,
				overwrite: false,
				durable: false,
				assertBeforeMutation: assertSource
			});
			assertSource();
			const copied = fs.lstatSync(to, { bigint: true });
			const opened = await root$1.open(relative);
			try {
				assertSource();
				assertPackagePathIdentity(to, copied);
				const actual = fs.fstatSync(opened.handle.fd, { bigint: true });
				if (actual.dev !== copied.dev || actual.ino !== copied.ino) throw new Error("Copied package file changed before persistence.");
				if (actual.uid !== original.uid || actual.gid !== original.gid) {
					await opened.handle.chown(Number(original.uid), Number(original.gid));
					assertSource();
				}
				await opened.handle.chmod(Number(original.mode));
				assertSource();
				await opened.handle.sync();
				assertSource();
				assertPackagePathIdentity(to, copied);
			} finally {
				await opened.handle.close();
			}
		} else if (original.isSymbolicLink()) {
			const target = await fs$1.readlink(from);
			assertSource();
			await fs$1.symlink(target, to);
			assertSource();
			const copied = fs.lstatSync(to, { bigint: true });
			if (copied.uid !== original.uid || copied.gid !== original.gid) {
				await fs$1.lchown(to, Number(original.uid), Number(original.gid));
				assertSource();
			}
			assertPackagePathIdentity(to, copied);
			if (process.platform === "darwin" && copied.mode !== original.mode) {
				await fs$1.lchmod(to, Number(original.mode));
				assertSource();
			}
		} else throw new Error(`Unsupported package copy entry: ${from}`);
		assertSource();
	};
	await copy("", assertCurrent);
}
function createPackagePublicationTreeMatcher(descriptor, onWarning, privateCandidate = () => false) {
	let candidateWarningRecorded = false;
	const verified = /* @__PURE__ */ new WeakMap();
	let legacyWarning;
	const legacy = descriptor.helperDigest === LEGACY_PACKAGE_RECOVERY_HELPER;
	const matches = async (file, expected, logical, contents = true) => {
		const id = packageActivationIdentityOrAbsent(file, true);
		if (id === null) return false;
		if (id !== expected.identity) throw new Error(`Package publication object changed: ${file}`);
		if (!contents) return true;
		const legacyPrevious = legacy && expected === descriptor.previous;
		const checkContents = !(expected === descriptor.candidate && privateCandidate());
		if (checkContents && "digest" in expected && !legacyPrevious) {
			const observed = await createPackageIntegrityReader().tree(file, logical, verified.get(expected) ?? expected, legacy);
			if (!isDeepStrictEqual(observed, expected)) throw new PackageIntegrityMismatchError(`Package publication object changed: ${file}`, packageIntegrityDifferences(expected, observed));
			verified.set(expected, observed);
			return true;
		}
		const observed = await createPackageIntegrityReader().directoryIdentity(file);
		if (observed?.identity !== expected.identity || observed.version !== expected.version) throw new Error(`Package publication object changed: ${file}`);
		if (legacyPrevious) {
			if (!legacyWarning) {
				legacyWarning = "legacy package record settled by identity and version; content could not be re-verified";
				onWarning(legacyWarning);
			}
			return true;
		}
		if (checkContents && !candidateWarningRecorded) {
			onWarning("candidate package fingerprint incomplete; activation requires the directory identity, package version and launchers; full package contents are unverified");
			candidateWarningRecorded = true;
		}
		return true;
	};
	return {
		matches,
		get legacyWarning() {
			return legacyWarning;
		}
	};
}
//#endregion
//#region src/infra/package-update-publication-owner.ts
const log = createSubsystemLogger("update/package-integrity");
function createPublicationOwner(anchor, journal, assertOwner, initial = journal.read(), onWarning = (message) => log.warn(message), freshlyPrepared = false) {
	const assertion = retainMutationAuthority(assertOwner);
	let record = initial;
	let descriptor = record.descriptor;
	let privateCandidate = freshlyPrepared;
	const trees = createPackagePublicationTreeMatcher(descriptor, onWarning, () => privateCandidate);
	const matches = trees.matches;
	let retirementSelected;
	const live = descriptor.authority.installKey;
	const matchesSelected = (selected, contents = true) => matches(live, descriptor[selected], selected === "previous" ? live : descriptor.originalStageRoot, contents);
	const root = (name) => path.join(anchor, name);
	const copyRoot = `${anchor}.copy-${descriptor.operationId}`;
	const custodyPath = (name) => {
		if (record.phase !== "preparing") return name === "anchor" ? anchor : resolvePackageActivationHelper(anchor);
		const entry = inspectPackageActivationCustody(anchor, record).find((item) => item.name === name);
		if (!entry) throw new Error("Package bootstrap custody is missing.");
		return entry.moved ? entry.destination : entry.source;
	};
	const helper = () => custodyPath("helper");
	const artifacts = () => [
		["previous", descriptor.previous.identity],
		["candidate", descriptor.candidate.identity],
		["previous.candidate", descriptor.candidate.identity],
		["launchers", descriptor.launcherRootIdentity],
		["previous-launchers", descriptor.previousLauncherRootIdentity]
	];
	const assertInventory = (allowed = artifacts().map(([name]) => name)) => {
		let entries;
		try {
			entries = fs.readdirSync(custodyPath("anchor"));
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT") && (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor")) return;
			throw error;
		}
		if (entries.some((name) => !allowed.includes(name))) throw new Error("Unknown package recovery artifacts require operator inspection.");
		const expected = record.intent?.kind === "copy-previous" ? record.intent.identity : record.intent?.kind === "displace-copy" ? descriptor.previous.identity : null;
		if (expected) {
			const current = packageActivationIdentityOrAbsent(copyRoot, true);
			if (current !== null && current !== expected) throw new Error("Package copy custody changed.");
		}
	};
	const assertCurrent = () => {
		assertion();
		journal.assertCurrent(record);
		const currentAnchor = packageActivationIdentityOrAbsent(custodyPath("anchor"), true);
		if (currentAnchor !== descriptor.anchorIdentity && !(currentAnchor === null && (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor"))) throw new Error("Package recovery anchor identity changed.");
		if (packageActivationIdentity(descriptor.binDir, "parent") !== descriptor.binIdentity) throw new Error("Package launcher parent changed");
		if (retirementSelected) {
			if (packageActivationIdentity(live, true) !== descriptor[retirementSelected].identity) throw new Error("Selected package changed during retirement.");
			assertPackageActivationSelectedLaunchers(record, retirementSelected);
		}
	};
	const transition = (phase, intent = null, publications = record.publications) => {
		assertCurrent();
		record = journal.transition(record, phase, intent, assertion, publications);
	};
	const inspect = async (contents = "all") => {
		const reader = createPackageIntegrityReader();
		const liveIdentity = packageActivationIdentityOrAbsent(live, true);
		const copying = record.intent?.kind === "displace-copy" ? record.intent : void 0;
		let selected = null;
		if (copying && liveIdentity === copying.source.identity) await matches(live, copying.source, live, !copying.removing);
		else if (liveIdentity !== null) {
			selected = liveIdentity === descriptor.previous.identity ? "previous" : liveIdentity === descriptor.candidate.identity ? "candidate" : null;
			if (!selected) throw new Error("The installed package is not either recorded generation.");
			await matchesSelected(selected, contents === "all" || contents === "selected");
		}
		let previous = await matches(root("previous"), descriptor.previous, live, contents === "all");
		if (copying && await matches(copyRoot, descriptor.previous, live)) {
			if (previous) throw new Error("Package copy custody is ambiguous.");
			previous = true;
		}
		const candidate = await matches(root("candidate"), descriptor.candidate, descriptor.originalStageRoot, contents === "all" || contents === "staged");
		if (selected === "previous" === previous || selected === "candidate" === candidate) throw new Error("Package publication generation roles are ambiguous.");
		if (packageActivationIdentity(root("launchers"), true) !== descriptor.launcherRootIdentity) throw new Error("Candidate launcher assets changed.");
		const published = new Map(record.publications.map((entry) => [entry.name, entry.identity]));
		if (record.intent?.kind === "launcher") published.set(record.intent.name, record.intent.identity);
		const launcherStates = /* @__PURE__ */ new Map();
		for (const entry of descriptor.launchers) {
			const source = root(`launchers/${entry.name}`);
			if (packageActivationIdentity(source, "launcher") !== entry.candidateIdentity || !matchesPackageActivationLauncher(await reader.launcher(source), entry.candidate)) throw new Error("Candidate launcher assets changed.");
			const destination = path.join(descriptor.binDir, entry.name);
			const present = await reader.exists(destination);
			const id = present ? packageActivationIdentity(destination, "launcher") : null;
			const fingerprint = present ? await reader.launcher(destination) : null;
			if (id === entry.previousIdentity && matchesPackageActivationLauncher(fingerprint, entry.previous)) launcherStates.set(entry.name, "previous");
			else if (id === published.get(entry.name) && matchesPackageActivationLauncher(fingerprint, entry.candidate)) launcherStates.set(entry.name, "candidate");
			else throw new Error(`Package launcher changed outside its publication intent: ${entry.name}`);
		}
		return {
			selected,
			previous,
			candidate,
			launcherStates
		};
	};
	const verifyClosure = async () => {
		assertInventory();
		assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
		if (packageActivationIdentity(helper(), false) !== descriptor.helperIdentity) throw new Error("Sealed package recovery helper identity changed.");
		const bytes = await fs$1.readFile(helper());
		if (createHash("sha256").update(bytes).digest("hex") !== descriptor.helperDigest) throw new Error("Sealed package recovery helper changed.");
		assertCurrent();
	};
	const persistPackageSelection = async (selected) => {
		const rejected = selected === "previous" && packageActivationIdentityOrAbsent(root("previous.candidate"), true) !== null;
		const roles = [
			[live, selected === "displaced" ? null : descriptor[selected].identity],
			[root("previous"), selected === "previous" ? null : descriptor.previous.identity],
			[root("candidate"), selected === "displaced" || selected === "previous" && !rejected ? descriptor.candidate.identity : null],
			[root("previous.candidate"), rejected ? descriptor.candidate.identity : null]
		];
		const assertSelected = () => {
			assertCurrent();
			if (roles.some(([file, identity]) => packageActivationIdentityOrAbsent(file, true) !== identity)) throw new Error("Package selection changed during persistence.");
		};
		for (const directory of [anchor, path.dirname(live)]) {
			assertSelected();
			const outcome = await syncDirectory(directory);
			assertSelected();
			requireDirectorySync(outcome, "Package selection");
		}
	};
	const discardIncompleteCopy = async () => {
		if (record.intent?.kind !== "copy-previous") return;
		const identity = record.intent.identity;
		await removePackagePath(copyRoot, () => {
			assertCurrent();
			const current = packageActivationIdentityOrAbsent(copyRoot, true);
			if (current !== null && current !== identity) throw new Error("Package copy custody changed.");
		});
		assertCurrent();
		requireDirectorySync(await syncDirectory(path.dirname(anchor)), "Incomplete package copy removal");
		transition(record.phase, { kind: "displace" });
	};
	const finishCopiedDisplacement = async () => {
		if (record.intent?.kind !== "displace-copy") return;
		const source = record.intent.source;
		await inspect();
		assertCurrent();
		if (packageActivationIdentityOrAbsent(copyRoot, true) !== null) await fs$1.rename(copyRoot, root("previous"));
		for (const directory of [anchor, path.dirname(anchor)]) {
			assertCurrent();
			requireDirectorySync(await syncDirectory(directory), "Verified package copy publication");
		}
		assertCurrent();
		await matches(root("previous"), descriptor.previous, live);
		if (!record.intent.removing) {
			if (!await matches(live, source, live)) throw new Error("Package copy source disappeared before removal intent.");
			transition(record.phase, {
				kind: "displace-copy",
				source,
				removing: true
			});
		}
		await removePackagePath(live, () => {
			assertCurrent();
			const current = packageActivationIdentityOrAbsent(live, true);
			if (current !== null && current !== source.identity || packageActivationIdentityOrAbsent(root("previous"), true) !== descriptor.previous.identity) throw new Error("Package copy displacement custody changed.");
		});
		await persistPackageSelection("displaced");
		transition(record.phase, { kind: "displace" });
	};
	const copyPrevious = async () => {
		assertCurrent();
		await fs$1.mkdir(copyRoot, { mode: 448 });
		const identity = packageActivationIdentity(copyRoot, true);
		const assertCopy = () => {
			assertCurrent();
			if (packageActivationIdentityOrAbsent(live, true) !== descriptor.previous.identity || packageActivationIdentityOrAbsent(copyRoot, true) !== identity || packageActivationIdentityOrAbsent(root("previous"), true) !== null) throw new Error("Package copy preimage changed.");
		};
		assertCopy();
		requireDirectorySync(await syncDirectory(path.dirname(anchor)), "Package copy staging");
		transition("publishing", {
			kind: "copy-previous",
			identity
		});
		const reader = createPackageIntegrityReader();
		const source = await reader.tree(live, live, descriptor.previous);
		if (!isDeepStrictEqual(source, descriptor.previous)) throw new Error("Package copy source changed.");
		await copyPackagePublicationTree(live, copyRoot, assertCopy);
		const previous = await reader.copiedTree(copyRoot, live, source);
		await matches(live, descriptor.previous, live);
		assertCopy();
		record = journal.recordPreviousCopy(record, previous, assertion);
		descriptor = {
			...record.descriptor,
			previous,
			candidate: descriptor.candidate
		};
		await finishCopiedDisplacement();
	};
	const publish = async (resume, onDisplaced) => {
		privateCandidate &&= !resume && record.phase === "prepared";
		try {
			await verifyClosure();
			assertPackageActivationActionAllowed(record, "repair");
			if (record.phase === "preparing") {
				await completePackageActivationCustody(anchor, journal, assertion);
				record = journal.read();
			}
			await discardIncompleteCopy();
			await finishCopiedDisplacement();
			let observed = await inspect();
			assertCurrent();
			if (resume && observed.selected === "previous" && !observed.previous) {
				if ([...observed.launcherStates.values()].some((value) => value !== "previous")) throw new Error("Untouched package has changed launchers; recovery is ambiguous.");
				transition("aborted");
				return readPackageActivationRecordStatus(record);
			}
			if (observed.selected === "previous") {
				transition("publishing", { kind: "displace" });
				assertCurrent();
				if (packageActivationIdentityOrAbsent(live, true) !== descriptor.previous.identity || packageActivationIdentityOrAbsent(root("previous"), true) !== null) throw new Error("Package displacement preimage changed.");
				try {
					await fs$1.rename(live, root("previous"));
				} catch (error) {
					if (!hasErrnoCode(error, "EXDEV")) throw error;
					await copyPrevious();
				}
				await persistPackageSelection("displaced");
				await onDisplaced?.(descriptor.previous, descriptor.previous.identity !== initial.descriptor.previous.identity);
				assertCurrent();
			} else if (observed.selected === null) await persistPackageSelection("displaced");
			if (observed.selected !== "candidate") {
				await inspect("staged");
				transition("publishing", { kind: "publish" });
				await activateStagedNpmPackageRoot(root("candidate"), live, () => {
					assertCurrent();
					if (packageActivationIdentityOrAbsent(root("candidate"), true) !== descriptor.candidate.identity || packageActivationIdentityOrAbsent(root("previous"), true) !== descriptor.previous.identity || packageActivationIdentityOrAbsent(live, true) !== null) throw new Error("Candidate publication preimage changed.");
				});
			}
			await persistPackageSelection("candidate");
			for (const entry of descriptor.launchers) {
				observed = await inspect("none");
				assertCurrent();
				if (observed.launcherStates.get(entry.name) === "candidate") {
					const destination = path.join(descriptor.binDir, entry.name);
					const id = packageActivationIdentity(destination, "launcher");
					requireDirectorySync(await syncDirectory(descriptor.binDir), "Recovered package launcher");
					assertCurrent();
					if (packageActivationIdentity(destination, "launcher") !== id) throw new Error("Recovered launcher changed during persistence.");
					if (!record.publications.some((item) => item.name === entry.name)) transition("publishing", null, [...record.publications, {
						name: entry.name,
						identity: id
					}]);
					continue;
				}
				await copyPackagePathEntry(root(`launchers/${entry.name}`), path.join(descriptor.binDir, entry.name), () => {
					assertCurrent();
					if (packageActivationIdentityOrAbsent(root(`launchers/${entry.name}`), "launcher") !== entry.candidateIdentity) throw new Error("Launcher publication preimage changed.");
				}, (staged) => {
					assertCurrent();
					if (packageActivationIdentityOrAbsent(path.join(descriptor.binDir, entry.name), "launcher") !== entry.previousIdentity) throw new Error("Launcher publication preimage changed.");
					transition("publishing", {
						kind: "launcher",
						name: entry.name,
						identity: packageActivationIdentity(staged, "launcher")
					});
				});
				const id = packageActivationIdentity(path.join(descriptor.binDir, entry.name), "launcher");
				transition("publishing", null, [...record.publications, {
					name: entry.name,
					identity: id
				}]);
			}
			observed = await inspect("selected");
			assertCurrent();
			if (observed.selected !== "candidate") throw new Error("Candidate publication is incomplete.");
			transition("publication-complete");
			return trees.legacyWarning ? retire() : readPackageActivationRecordStatus(record);
		} catch (error) {
			privateCandidate = false;
			throw error;
		}
	};
	const assertSettlementSelection = (selected, cause) => {
		assertion();
		assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
		if (packageActivationIdentity(live, true) !== descriptor[selected].identity) throw new Error("Selected package changed during retirement.", { cause });
		assertPackageActivationSelectedLaunchers(record, selected);
	};
	const settleSelected = (selected, detail, onSettled) => {
		const settled = settlePackageActivationCustody({
			anchor,
			journal,
			record,
			settlement: {
				kind: "publication-settled-external-change",
				replacementIdentity: descriptor[selected].identity,
				settled: true,
				detail
			},
			assertCurrent: () => assertSettlementSelection(selected),
			onSettled: () => onSettled?.(detail)
		});
		record = settled.record;
		return settled;
	};
	const retire = async (onSettled) => {
		await verifyClosure();
		assertPackageActivationActionAllowed(record, "retire");
		const selected = selectedPackageRetirementGeneration(record);
		if (!await matchesSelected(selected)) throw new Error("Selected package is missing.");
		await verifyPackageActivationSelectedLaunchers(record, selected);
		retirementSelected = selected;
		assertCurrent();
		if (trees.legacyWarning) {
			onWarning(settleSelected(selected, trees.legacyWarning, onSettled).warning);
			return readPackageActivationRecordStatus(record);
		}
		if (!["retiring", "anchor-retired"].includes(record.phase)) {
			const publications = record.phase === "aborted" ? descriptor.launchers.flatMap((entry) => entry.previousIdentity ? [{
				name: entry.name,
				identity: entry.previousIdentity
			}] : []) : record.publications;
			transition("retiring", {
				kind: "retire",
				selected
			}, publications);
		}
		for (const [name, expected] of artifacts()) {
			const target = root(name);
			if (!await packagePathEntryExists(target)) {
				assertCurrent();
				continue;
			}
			const id = packageActivationIdentity(target, true);
			if (id !== expected) throw new Error("Retirement target identity changed.");
			transition("retiring", {
				kind: "remove",
				name,
				identity: id,
				selected
			});
			await removePackagePath(target, () => {
				assertCurrent();
				const current = packageActivationIdentityOrAbsent(target, true);
				if (current !== null && current !== id) throw new Error("Retirement target changed before removal.");
			});
		}
		if (record.phase !== "anchor-retired") {
			if (record.intent?.kind !== "remove-anchor") transition("retiring", {
				kind: "remove-anchor",
				identity: descriptor.anchorIdentity,
				selected
			});
			assertCurrent();
			assertInventory([]);
			const current = packageActivationIdentityOrAbsent(anchor, true);
			if (current !== null) {
				if (current !== descriptor.anchorIdentity) throw new Error("Final anchor identity changed.");
				await fs$1.rmdir(anchor);
			}
			assertCurrent();
			requireDirectorySync(await syncDirectory(path.dirname(anchor)), "Package anchor retirement");
			assertCurrent();
			if (packageActivationIdentityOrAbsent(anchor, true) !== null) throw new Error("Package anchor was not retired.");
			transition("anchor-retired", {
				kind: "retire",
				selected
			});
		}
		assertCurrent();
		if (packageActivationIdentityOrAbsent(anchor, true) !== null || packageActivationIdentity(helper(), false) !== descriptor.helperIdentity) throw new Error("Final package recovery cleanup identity changed.");
		transition("anchor-retired", {
			kind: "unlink-helper",
			identity: descriptor.helperIdentity,
			selected
		});
		assertCurrent();
		if (packageActivationIdentity(helper(), false) !== descriptor.helperIdentity) throw new Error("Final helper identity changed.");
		await fs$1.unlink(helper());
		assertCurrent();
		const outcome = await syncDirectory(path.dirname(helper()));
		assertCurrent();
		requireDirectorySync(outcome, "Package helper retirement");
		if (!isPackageActivationComplete(anchor, record)) throw new Error("Package recovery artifacts were not retired.");
		return readPackageActivationRecordStatus(record);
	};
	const retireVerified = async (onSettled) => {
		if (record.phase !== "prepared") assertPackageActivationActionAllowed(record, "retire");
		const selected = selectedPackageRetirementGeneration(record);
		try {
			await retire(onSettled);
			return trees.legacyWarning;
		} catch (error) {
			privateCandidate = false;
			const assertSelected = () => assertSettlementSelection(selected, error);
			assertSelected();
			journal.assertCurrent(record);
			await matchesSelected(selected);
			await verifyPackageActivationSelectedLaunchers(record, selected);
			assertSelected();
			journal.assertCurrent(record);
			const detail = `Verified ${selected} package; recovery evidence retained after cleanup failed: ${formatErrorMessage(error)}`;
			return settleSelected(selected, detail, onSettled).warning;
		}
	};
	return {
		publish,
		retire,
		retireVerified,
		async disarmRollback() {
			privateCandidate = false;
			assertCurrent();
			await discardIncompleteCopy();
			const observed = await inspect();
			assertCurrent();
			if (observed.selected === "previous" && !observed.previous && [...observed.launcherStates.values()].every((value) => value === "previous")) {
				transition("aborted");
				return false;
			}
			transition("rollback-in-progress", record.intent);
			await finishCopiedDisplacement();
			return observed.previous ? descriptor.previous : false;
		},
		recordRestoredLauncher(name, staged) {
			if (record.phase !== "rollback-in-progress") throw new Error("Launcher restoration requires durable rollback intent.");
			const identity = packageActivationIdentity(staged, "launcher");
			transition("rollback-in-progress", {
				kind: "launcher",
				name,
				identity
			}, [...record.publications.filter((entry) => entry.name !== name), {
				name,
				identity
			}]);
		},
		async restored() {
			assertCurrent();
			assertPackageActivationSelectedLaunchers(record, "previous");
			const outcome = await syncDirectory(descriptor.binDir);
			assertCurrent();
			assertPackageActivationSelectedLaunchers(record, "previous");
			requireDirectorySync(outcome, "Restored package launchers");
			await persistPackageSelection("previous");
			const publications = descriptor.launchers.flatMap((entry) => {
				const identity = entry.previous === null ? null : record.publications.find((published) => published.name === entry.name)?.identity ?? entry.previousIdentity;
				if (packageActivationIdentityOrAbsent(path.join(descriptor.binDir, entry.name), "launcher") !== identity) throw new Error("Restored launcher does not match its original owner.");
				return identity ? [{
					name: entry.name,
					identity
				}] : [];
			});
			transition("rolled-back", null, publications);
		},
		status: () => readPackageActivationRecordStatus(record),
		assertCurrent
	};
}
//#endregion
//#region src/infra/package-update-activation.ts
function isForeignLeaseDirectory(databasePath) {
	const uid = process.getuid?.();
	if (uid === void 0) return false;
	const directory = fs.lstatSync(path.dirname(databasePath), { throwIfNoEntry: false });
	return directory?.isDirectory() === true && directory.uid !== uid;
}
function inspectPackageActivationLease({ databasePath, databaseIdentity, parentIdentity }) {
	let current;
	if (isForeignLeaseDirectory(databasePath)) return {
		current,
		changed: true,
		foreignDirectory: true
	};
	try {
		current = captureManagedUpdateLeaseDatabaseIdentity(databasePath);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") || fs.lstatSync(databasePath, { throwIfNoEntry: false })) throw error;
	}
	return {
		current,
		changed: !isDeepStrictEqual(current, {
			databasePath,
			databaseIdentity,
			parentIdentity
		}),
		foreignDirectory: false
	};
}
/** Reconcile completed receipts; unfinished operations still require a live fence. */
function readPackageActivationContinuation(installKey, dryRun) {
	const anchor = resolvePackageActivationAnchor(installKey);
	const released = readReleasedPackageActivationReceipt(installKey);
	if (released) throw new Error(`Package publication recovery is pending. Run openclaw update repair. With the recorded external runtime, run ${released.recoveryCommand}, then use that original helper to repair or retire; keep other package managers stopped.`);
	assertPackageActivationLayout(anchor);
	const journalPath = resolvePackageActivationJournalPath(anchor);
	if (!fs.lstatSync(journalPath, { throwIfNoEntry: false })) {
		if (fs.lstatSync(anchor, { throwIfNoEntry: false }) || fs.lstatSync(resolvePackageActivationControl(anchor), { throwIfNoEntry: false })) throw new Error(`Incomplete or legacy recovery artifacts require their original owner: ${anchor}. The next mutable update is blocked.`);
		return;
	}
	const record = openPackageActivationJournal(anchor).readForAdmission(installKey);
	if (isPackageActivationComplete(anchor, record)) return;
	if (dryRun && [
		"prepared",
		"publishing",
		"publication-complete",
		"aborted",
		"superseded"
	].includes(record.phase) && [record.descriptor.previous.identity, record.descriptor.candidate.identity].includes(packageActivationIdentity(installKey, true)) && (inspectPackageActivationLease(record.descriptor.authority).changed || packageActivationIdentity(installKey, true) === record.descriptor.candidate.identity || packageActivationIdentity(installKey, true) === record.descriptor.previous.identity && (record.phase === "prepared" && record.intent === null && record.publications.length === 0 || record.phase === "aborted"))) return;
	assertManagedUpdateLeaseDatabaseIdentity(record.descriptor.authority);
	if (record.phase === "superseded") throw new Error("Package recovery settlement is incomplete; run openclaw update repair.");
	if (record.phase !== "publication-complete") throw new Error(`Package publication is incomplete; its original continuation cannot run. Run openclaw update repair. With the recorded external runtime, run ${resolvePackageActivationRecoveryCommand(record)} status, then repair or retire; keep other package managers stopped.`);
	return record;
}
function assertNoPendingPackageActivation(installKey, options) {
	const record = readPackageActivationContinuation(installKey, options?.dryRun);
	if (!record) return;
	if (options?.continuation && isDeepStrictEqual(record.descriptor.authority, captureUpdateCommandExecutorAuthority(options.continuation))) return;
	throw new Error(`Package publication recovery is pending. Run openclaw update repair. With the recorded external runtime, run ${resolvePackageActivationRecoveryCommand(record)} status, then repair or retire; keep other package managers stopped.`);
}
async function preparePackageActivation(params) {
	const fence = params.options.fence;
	const assertOriginal = retainMutationAuthority(fence.assertCurrent.bind(fence));
	const options = {
		...params.options,
		fence
	};
	if (process.platform === "win32" || params.installTarget.manager !== "npm" || params.installTarget.directNodeModulesRoot || !(await fs$1.lstat(params.stageRoot)).isDirectory()) return;
	const nodeRunner = resolveExecutablePath(options.runtime.path, { useCache: false });
	assertOriginal();
	if (!nodeRunner) {
		options.onUnavailable?.("Standalone package publication repair is unavailable: the selected runtime executable could not be resolved.");
		return;
	}
	const capable = await supportsPostCoreExecutor(params.stageRoot, nodeRunner);
	assertOriginal();
	if (!capable) {
		options.onUnavailable?.("Standalone package publication repair is unavailable for this target: its update worker does not support delegated post-core execution.");
		return;
	}
	let prepared;
	try {
		prepared = await preparePackageActivationJournal({
			...params,
			options
		}, assertOriginal);
	} catch (error) {
		if (!(error instanceof PackageActivationArchiveError)) throw error;
		options.onUnavailable?.(error.message);
		return;
	}
	const owner = createPublicationOwner(prepared.anchor, prepared.journal, assertOriginal, prepared.initial, options.onWarning, true);
	return {
		...prepared,
		...owner
	};
}
function readPackageActivationReceipt(installKey) {
	const released = readReleasedPackageActivationReceipt(installKey);
	if (released) return released;
	const anchor = resolvePackageActivationAnchor(installKey);
	if (!fs.existsSync(resolvePackageActivationJournalPath(anchor))) {
		readPackageActivationContinuation(installKey);
		return;
	}
	const record = openPackageActivationJournal(anchor).read();
	const receipt = readPackageActivationRecordStatus(record);
	if (receipt.phase !== "complete") assertManagedUpdateLeaseDatabaseIdentity(record.descriptor.authority);
	return receipt.phase === "complete" || record.phase === "superseded" ? receipt : {
		...receipt,
		recoveryCommand: `${resolvePackageActivationRecoveryCommand(record)} status`
	};
}
/** Explicit repair settles untouched preparation or obsolete custody, never pending restoration. */
async function settlePendingPackageActivation(installKey, onSettled, expectedCompleted, options) {
	const anchor = resolvePackageActivationAnchor(installKey);
	if (!expectedCompleted && !fs.existsSync(resolvePackageActivationJournalPath(anchor))) {
		assertNoPendingPackageActivation(installKey);
		return;
	}
	const journal = openPackageActivationSettlementJournal(anchor);
	const admission = options?.dryRun ? void 0 : await journal.readForRecovery();
	const initial = admission?.record ?? journal.read();
	if (options?.operationId) assertPackageActivationOperation(initial, options.operationId);
	const identities = journal.inspectRemount(initial);
	const complete = isPackageActivationComplete(anchor, initial);
	if (options?.operationId && !identities && !complete) throw new Error("Separate-helper settlement requires a verified device remount.");
	if (expectedCompleted && (!complete || !isDeepStrictEqual(initial, expectedCompleted))) throw new Error("Completed package receipt changed; inspect recovery status before retrying.");
	if (initial.phase === "rollback-in-progress") throw new Error("Package restoration is unfinished; its rollback owner must finish recovery.");
	const priorSettlement = initial.phase === "superseded" && initial.intent && "settled" in initial.intent ? initial.intent : void 0;
	const receipt = priorSettlement || complete ? {
		operationId: initial.descriptor.operationId,
		reason: priorSettlement?.kind ?? "publication-retired",
		retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
		detail: priorSettlement?.detail
	} : void 0;
	if (options?.automatic && complete) return options.dryRun ? receipt : void 0;
	const originalAuthority = initial.descriptor.authority;
	const replacementIdentity = packageActivationIdentity(installKey, true);
	if (options?.automatic && ![initial.descriptor.previous.identity, initial.descriptor.candidate.identity].includes(replacementIdentity)) return;
	const lease = inspectPackageActivationLease(originalAuthority);
	const leaseWasMissing = !lease.current || initial.phase === "superseded" && initial.intent?.kind === "recovery-lease-missing";
	const leaseIdentityChanged = leaseWasMissing || lease.changed;
	const previousIdentity = identities?.currentIdentity(initial.descriptor.previous.identity) ?? initial.descriptor.previous.identity;
	const candidateIdentity = identities?.currentIdentity(initial.descriptor.candidate.identity) ?? initial.descriptor.candidate.identity;
	const manualReplacement = ![previousIdentity, candidateIdentity].includes(replacementIdentity);
	const reason = identities && manualReplacement ? "superseded-by-manual-install" : leaseWasMissing ? "recovery-lease-missing" : leaseIdentityChanged ? "recovery-lease-identity-changed" : "superseded-by-manual-install";
	const externalPublication = replacementIdentity === candidateIdentity && (initial.phase === "prepared" || initial.phase === "publishing" || initial.phase === "publication-complete" || initial.phase === "superseded" && initial.intent?.kind === "publication-settled-external-change");
	const unusedPreparation = replacementIdentity === previousIdentity && (initial.phase === "prepared" && initial.intent === null && initial.publications.length === 0 || initial.phase === "aborted");
	const publicationNotStarted = !leaseIdentityChanged && unusedPreparation;
	if (options?.automatic && !leaseIdentityChanged && !externalPublication && !unusedPreparation) return;
	if (!complete && !publicationNotStarted && !externalPublication && !(leaseIdentityChanged && (unusedPreparation || !identities && initial.phase === "publication-complete" && replacementIdentity === previousIdentity || initial.phase === "superseded")) && [previousIdentity, candidateIdentity].includes(replacementIdentity)) {
		if (identities) throw new Error("Remounted previous package has unfinished publication; use the original recovery owner.");
		assertNoPendingPackageActivation(installKey);
		return;
	}
	if (options?.dryRun) {
		if (externalPublication || identities && unusedPreparation) await verifyPackagePublicationSettlement(initial, () => journal.assertCurrent(initial), identities ? inspectRemountedPackagePublication(anchor, initial, identities) : void 0);
		return {
			operationId: initial.descriptor.operationId,
			reason: unusedPreparation ? "publication-not-started" : externalPublication ? "publication-settled-external-change" : reason,
			retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
			detail: void 0,
			warning: void 0
		};
	}
	const currentDatabase = lease.current ?? await prepareManagedHandoffLeaseDatabaseIdentity(lease.foreignDirectory ? resolveManagedUpdateLeaseDatabasePath() : originalAuthority.databasePath);
	const withSettlementOwner = (settle, executorOptions) => options?.owner ? settle(options.owner) : withUpdateCommandExecutor(randomUUID(), async (executor) => await settle((await executor.enter(installKey)).assertCurrent), executorOptions);
	return withSettlementOwner(async (assertOwner) => {
		const assertCurrent = retainMutationAuthority(assertOwner);
		assertManagedUpdateLeaseDatabaseIdentity(currentDatabase);
		admission.admit(assertCurrent);
		journal.assertCurrent(initial);
		let assertReplacement = () => {
			assertCurrent();
			if (packageActivationIdentity(installKey, true) !== replacementIdentity) throw new Error("The installed package changed during recovery settlement.");
		};
		assertReplacement();
		const finish = (settled, archive = true) => {
			onSettled?.(settled);
			if (archive && settled.retained) settled.warning = archivePackageActivationCustody(anchor, journal, journal.read(), assertCurrent);
			return settled;
		};
		if (complete && receipt) return finish(receipt);
		if (publicationNotStarted && !identities) {
			const owner = createPublicationOwner(anchor, journal, assertReplacement, initial);
			if (initial.phase === "prepared") try {
				await owner.disarmRollback();
			} catch {}
			const settled = {
				operationId: initial.descriptor.operationId,
				reason: "publication-not-started",
				retained: void 0,
				detail: void 0
			};
			const warning = await owner.retireVerified((detail) => {
				settled.retained = `${anchor}.superseded-${initial.descriptor.operationId}`;
				settled.detail = detail;
				onSettled?.(settled);
			});
			return warning ? {
				...settled,
				warning
			} : finish(settled, false);
		}
		let assertArchiveCurrent;
		let settlement = priorSettlement ?? {
			kind: reason,
			replacementIdentity,
			settled: true
		};
		if (externalPublication || identities && unusedPreparation) {
			const verified = await verifyPackagePublicationSettlement(initial, assertCurrent, identities ? inspectRemountedPackagePublication(anchor, initial, identities) : void 0);
			const outcome = await syncDirectory(initial.descriptor.binDir);
			verified.assertUnchanged();
			journal.assertCurrent(initial);
			requireDirectorySync(outcome, "Package settlement launcher directory");
			assertReplacement = verified.assertUnchanged;
			assertArchiveCurrent = verified.assertInstalledUnchanged;
			settlement = {
				kind: unusedPreparation ? "publication-not-started" : "publication-settled-external-change",
				replacementIdentity,
				settled: true,
				detail: receipt?.detail ?? verified.detail
			};
		} else if (identities && manualReplacement) {
			const version = await readPackageVersion(installKey);
			if (!version || (compareOpenClawReleaseVersions(version, initial.descriptor.candidate.version) ?? -1) <= 0) throw new Error("Remounted recovery requires a verified newer manual installation.");
			const verified = await verifyPackagePublicationSettlement({
				...initial,
				descriptor: {
					...initial.descriptor,
					candidate: {
						identity: replacementIdentity,
						version
					},
					binIdentity: identities.bind(initial.descriptor.binIdentity, () => packageActivationIdentity(initial.descriptor.binDir, "parent"))
				}
			}, assertReplacement);
			assertReplacement = verified.assertUnchanged;
			if (!priorSettlement) settlement.detail = verified.detail;
		}
		const settled = {
			operationId: initial.descriptor.operationId,
			retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
			reason: settlement.kind,
			detail: settlement.detail
		};
		const result = settlePackageActivationCustody({
			anchor,
			journal,
			record: initial,
			settlement,
			assertCurrent: assertReplacement,
			assertArchiveCurrent,
			onSettled: () => onSettled?.(settled)
		});
		return {
			...settled,
			warning: result.archiveWarning
		};
	}, { existingAuthority: {
		...originalAuthority,
		...currentDatabase
	} });
}
//#endregion
export { encodePackageActivationLauncher as a, supportsPostCoreExecutor as c, settlePendingPackageActivation as i, preparePackageActivation as n, POST_CORE_EXECUTOR_CAPABILITY as o, readPackageActivationReceipt as r, POST_CORE_MUTATION_PROTOCOL as s, assertNoPendingPackageActivation as t };
