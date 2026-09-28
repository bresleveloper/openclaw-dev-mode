import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { n as registerSignalExitBarrier, o as waitForSignalExitBarriers } from "./signal-exit-barrier-BG0KH3HC.mjs";
import { u as resolveGatewayNativeServiceIdentityConflict } from "./constants-CJCmIHb-.mjs";
import { Et as _enum, Jn as string, Nt as array, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { s as formatUnsupportedNodeVersionMessage } from "./node-version-DdJ6cN09.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { i as readDatabasePathIdentitySync, t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { p as openClawStateDatabaseCache } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { a as formatExternalSupervisorUpdateRequired, o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { n as AUTO_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { c as normalizeUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { a as assertManagedUpdateLeaseDatabaseIdentity, c as withExistingSqliteRollbackDatabase, d as cleanupStaleManagedServiceUpdateHandoffs } from "./update-managed-service-handoff-lease-B6JBgh1M.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import "./config-DryArA1l.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { c as resolveManagedServiceUpdateFailureExitCode, d as normalizeControlPlaneUpdateResult, s as readControlPlaneUpdateSentinelMeta } from "./update-control-plane-sentinel-BWZUhXdG.mjs";
import { a as recordUpdateRunDiagnostics, c as isUpdateRunVerificationConfirmed, o as updateRunLedgerSchema, t as finishUpdateRun } from "./update-run-write-cd5VZ7fL.mjs";
import { i as updateRunStepsFromResultStep, r as isUpdateGatewayReadinessPending } from "./update-run-step-ijjXM1mH.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { c as readUpdateRunDriver } from "./update-run-activity-C0Hu53Kb.mjs";
import { _ as inspectUpdateRecoveries, a as finishInterruptedUpdatePreview, f as recordUpdateRunPhase, g as recordUpdateRunVerification, h as recordUpdateRunStep, i as finishInterruptedUpdateBeforeActivation, n as adoptUpdateRun, r as createUpdateRun, s as heartbeatUpdateRun, v as readRecoveries } from "./update-run-ledger-DE3m4CLB.mjs";
import { a as readUpdateRunRecord } from "./update-run-read.kernel-Blv-D7Xz.mjs";
import { r as getUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { t as disableCurrentOpenClawUpdateLaunchdJob } from "./launchd-BkUcMuKY.mjs";
import { a as resolveManagedUpdateRequester, n as createManagedUpdateRequesterAuthority, t as UpdateRequesterRevokedError } from "./update-requester-authority-DM9cJimf.mjs";
import { c as withOwnedManagedUpdateEnv, i as resolveServiceRefreshEnv, n as resolveOwnedManagedUpdateEnv } from "./update-command-service-env-a79RyIGw.mjs";
import { i as parseDevUpdateTargetEnv, t as UPDATE_DEV_TARGET_REF_ENV } from "./update-dev-target-DfXIcNWC.mjs";
import { A as createFreeBsdPkgOwnershipInspection, C as verifyPackageUpdateRecovery } from "./update-runner-command-DZBJTDir.mjs";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BbC1zqVE.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { d as UpdateCommandRecoveryPendingError, r as captureUpdateCommandExecutorAuthority, u as UpdateActivationTimeoutError } from "./update-command-executor-BQrAUjan.mjs";
import { c as resolveUpdateInstallKind } from "./update-check-CtYi2ZDp.mjs";
import { l as parseUpdateTimeoutMs, m as resolveUpdateRoot } from "./shared-OuJSSGTT.mjs";
import { n as POST_CORE_UPDATE_ENV, t as POST_CORE_UPDATE_CHANNEL_ENV } from "./update-post-core-context-B2x24New.mjs";
import { n as printResult } from "./progress-Duz1sEcD.mjs";
import { a as resolveForegroundUpdateAdmission } from "./update-command-handoff-Bskjp_JN.mjs";
import { d as resolveManagedServicePackageUpdatePlan, i as assertGatewayServiceManagementAllowedForUpdate, l as readManagedGatewayServiceForUpdate, n as GatewayServiceUpdateOwnershipError, s as isGatewayServiceManagementAllowedForUpdate } from "./update-command-service-plan-LoWdIMX_.mjs";
import { n as assertUpdateRecoveryDirectoryAdmission, r as loadUpdateRecovery, t as assertUpdateRecoveryAdmission } from "./update-run-recovery-admission-C4Oce1TJ.mjs";
import { i as UpdateCommandPendingRecoveryFailure, m as recordUpdateResultNextAction, n as UpdateCommandFailure, o as createUpdateCommandFailureResult, r as UpdateCommandFinalizedRecoveryFailure, s as failUpdateCommandRun, t as UnreportedUpdateAdmissionOutcome, y as writeControlPlaneUpdateRestartSentinelBestEffort } from "./update-command-result-ZgmOI6c9.mjs";
import { a as revalidateUpdateDatabaseContext } from "./update-command-managed-context-DAWjJT6G.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/cli/update-cli/update-command-authority.ts
/** Bind requester and executor identity across discovery and delegated child admission. */
function createUpdateCommandAuthority(params, label = "Update") {
	const run = params.opts?.run;
	const runExecutorFence = run?.executorFence;
	const executorFence = runExecutorFence ?? params.executorFence;
	const runId = run?.runId;
	const requester = run?.requesterAuthority;
	let authorityFailure;
	const refuseAuthority = (error) => {
		authorityFailure ??= { error };
		params.onAuthorityRefused?.();
		throw authorityFailure.error;
	};
	const checkAuthority = (check) => {
		if (authorityFailure) throw authorityFailure.error;
		try {
			check();
		} catch (error) {
			refuseAuthority(error);
		}
	};
	const assertRequesterCurrent = () => checkAuthority(() => {
		if (params.opts?.run !== run || run?.executorFence !== runExecutorFence || run?.runId !== runId || run?.requesterAuthority !== requester || run && (!runExecutorFence || !runId?.trim())) throw new UpdateCommandRecoveryPendingError(`${label} lost its original update executor.`);
		if (requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
	});
	const assertCurrent = () => checkAuthority(() => {
		assertRequesterCurrent();
		params.assertCurrent?.();
		executorFence?.assertCurrent();
	});
	return {
		run,
		executorFence,
		runId,
		requester,
		assertCurrent,
		assertRequesterCurrent,
		refuseAuthority
	};
}
//#endregion
//#region src/infra/package-update-activation-journal.ts
const PACKAGE_ACTIVATION_JOURNAL = "operation.sqlite";
const MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES = 1048576;
const absolutePath = string().min(1).max(4096).refine((value) => path.resolve(value) === value);
const identity = string().regex(/^\d+:\d+$/u);
const fingerprint = strictObject({
	digest: string().regex(/^[a-f0-9]{64}$/u),
	identity,
	version: string().min(1).max(256)
});
const basename$1 = string().min(1).max(255).refine((value) => value !== "." && value !== ".." && !/[\\/\0]/u.test(value));
const PackageActivationDescriptorSchema = strictObject({
	version: literal(1),
	operationId: uuid(),
	authority: strictObject({
		databasePath: absolutePath,
		databaseIdentity: identity,
		parentIdentity: identity,
		installKey: absolutePath,
		owner: string().min(1).max(4096)
	}),
	anchorIdentity: identity,
	journalIdentity: identity,
	parentIdentity: identity,
	binDir: absolutePath,
	binIdentity: identity,
	originalStageRoot: absolutePath,
	previous: fingerprint,
	candidate: fingerprint,
	launcherRootIdentity: identity,
	previousLauncherRootIdentity: identity.nullable(),
	helperDigest: string().regex(/^[a-f0-9]{64}$/u),
	launchers: array(strictObject({
		name: basename$1,
		previous: string().max(4096).nullable(),
		candidate: string().max(4096),
		previousIdentity: identity.nullable(),
		candidateIdentity: identity
	})).max(64)
});
const PackageActivationPhaseSchema = _enum([
	"prepared",
	"publishing",
	"publication-complete",
	"rollback-in-progress",
	"rolled-back",
	"aborted",
	"retiring",
	"retired"
]);
const intentSchema = union([
	strictObject({ kind: _enum(["displace", "publish"]) }),
	strictObject({
		kind: literal("launcher"),
		name: basename$1,
		identity
	}),
	strictObject({
		kind: literal("retire"),
		selected: _enum(["previous", "candidate"])
	}),
	strictObject({
		kind: literal("remove"),
		name: _enum([
			"previous",
			"candidate",
			"previous.candidate",
			"launchers",
			"previous-launchers"
		]),
		identity,
		selected: _enum(["previous", "candidate"])
	})
]).nullable();
const queries = (db) => getNodeSqliteKysely(db);
function packageActivationIdentity(file, directory) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (stat.ino === 0n || !(directory === "launcher" ? stat.isSymbolicLink() || stat.isFile() : directory ? stat.isDirectory() && !stat.isSymbolicLink() : stat.isFile()) || process.getuid && stat.uid !== BigInt(process.getuid())) throw new Error("Package publication object has an unsafe identity");
	return `${stat.dev}:${stat.ino}`;
}
function resolvePackageActivationAnchor(installKey) {
	const key = createHash("sha256").update(installKey).digest("hex").slice(0, 24);
	return path.join(path.dirname(installKey), `.openclaw.package-activation-${key}`);
}
function assertPrivate(file, directory) {
	const value = packageActivationIdentity(file, directory);
	const stat = fs.lstatSync(file);
	if ((stat.mode & 63) !== 0 || !directory && stat.nlink !== 1) throw new Error("Package publication recovery permissions are unsafe");
	return value;
}
/** An existing operation is never bootstrapped, migrated, or repaired on open. */
function openPackageActivationJournal(anchor) {
	const journalPath = path.join(anchor, PACKAGE_ACTIVATION_JOURNAL);
	const anchorIdentity = assertPrivate(anchor, true);
	const journalIdentity = assertPrivate(journalPath, false);
	const assertFiles = () => {
		if (assertPrivate(anchor, true) !== anchorIdentity || assertPrivate(journalPath, false) !== journalIdentity || fs.realpathSync(anchor) !== anchor) throw new Error("Package publication journal identity changed");
	};
	const withDatabase = (write, operation) => withExistingSqliteRollbackDatabase(journalPath, {
		write,
		busyTimeoutMs: 0,
		assertIdentity: assertFiles,
		validate: (db) => {
			executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(0));
		}
	}, operation);
	const decode = (row) => {
		if (!row || row.slot !== 1 || !Number.isSafeInteger(row.revision) || row.revision < 0 || Buffer.byteLength(row.descriptor_json) > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES) throw new Error("Package publication journal is missing or invalid");
		const descriptor = PackageActivationDescriptorSchema.parse(JSON.parse(row.descriptor_json));
		if (descriptor.anchorIdentity !== anchorIdentity || descriptor.journalIdentity !== journalIdentity || resolvePackageActivationAnchor(descriptor.authority.installKey) !== anchor || descriptor.parentIdentity !== packageActivationIdentity(path.dirname(anchor), true) || new Set(descriptor.launchers.map((entry) => entry.name)).size !== descriptor.launchers.length) throw new Error("Package publication journal does not match its installation");
		const publications = array(strictObject({
			name: basename$1,
			identity
		})).max(64).parse(JSON.parse(row.publications_json));
		const intent = intentSchema.parse(JSON.parse(row.intent_json));
		const names = new Set(descriptor.launchers.map((entry) => entry.name));
		if (new Set(publications.map((entry) => entry.name)).size !== publications.length || publications.some((entry) => !names.has(entry.name)) || intent?.kind === "launcher" && !names.has(intent.name)) throw new Error("Package publication intent names an unknown launcher.");
		return {
			revision: row.revision,
			phase: PackageActivationPhaseSchema.parse(row.phase),
			intent,
			descriptor,
			publications
		};
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
	return { read };
}
//#endregion
//#region src/infra/package-update-activation-runtime-assets.ts
const PACKAGE_ACTIVATION_HELPER = "recovery.mjs";
//#endregion
//#region src/infra/package-update-activation.ts
/** Read-only correlation; callers still need a privately registered live fence. */
function readPackageActivationContinuation(installKey) {
	const anchor = resolvePackageActivationAnchor(installKey);
	try {
		fs.lstatSync(anchor);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
	if (!fs.existsSync(path.join(anchor, "recovery.mjs")) || !fs.existsSync(path.join(anchor, "operation.sqlite"))) throw new Error(`Incomplete recovery artifacts require operator inspection: ${anchor}. The next mutable update is blocked.`);
	const record = openPackageActivationJournal(anchor).read();
	if (record.phase !== "publication-complete" || record.descriptor.authority.installKey !== installKey) throw new Error("Package publication is incomplete; its original continuation cannot run.");
	assertManagedUpdateLeaseDatabaseIdentity(record.descriptor.authority);
	return record.descriptor.authority;
}
function assertNoPendingPackageActivation(installKey, options) {
	const authority = readPackageActivationContinuation(installKey);
	if (!authority) return;
	if (options?.continuation && isDeepStrictEqual(authority, captureUpdateCommandExecutorAuthority(options.continuation))) return;
	const anchor = resolvePackageActivationAnchor(installKey);
	throw new Error(`Package publication recovery is pending. Run an external Node with ${path.join(anchor, PACKAGE_ACTIVATION_HELPER)} status, then repair or retire; keep other package managers stopped.`);
}
//#endregion
//#region src/cli/update-cli/suppress-deprecations.ts
/**
* Suppress Node.js deprecation warnings.
*
* On Node.js v23+ `process.noDeprecation` may be a read-only property
* (defined via a getter on the prototype with no setter), so the
* assignment can throw. We fall back to the environment variable which
* achieves the same effect.
*/
function suppressDeprecations() {
	try {
		process.noDeprecation = true;
	} catch {}
	process.env.NODE_NO_WARNINGS = "1";
}
//#endregion
//#region src/cli/update-cli/update-command-mutable-signals.ts
const admissions = /* @__PURE__ */ new WeakMap();
function admitMutableUpdateSignalRun(run, record) {
	const env = { ...run.env };
	const file = fs.lstatSync(resolveOpenClawStateSqlitePath(env));
	if (!file.isFile()) throw new Error("Update admission requires its regular state database.");
	admissions.set(run, {
		record,
		env,
		dev: file.dev,
		ino: file.ino
	});
}
function retireMutableUpdateSignalRun(run) {
	admissions.delete(run);
}
async function withMutableUpdateSignals(opts, operation) {
	const run = opts.run;
	const admission = !opts.dryRun && run ? admissions.get(run) : void 0;
	if (!run || !admission || admission.active) return await operation();
	admission.active = true;
	const { env } = admission;
	const pathname = resolveOpenClawStateSqlitePath(env);
	const assertCurrent = () => {
		if (!run.executorFence) throw new Error("Interrupted update has no live installation owner.");
		run.executorFence.assertCurrent();
		const file = fs.lstatSync(pathname);
		if (!file.isFile() || file.dev !== admission.dev || file.ino !== admission.ino) throw new Error("Interrupted update's canonical state generation changed.");
	};
	const settle = () => {
		if (admissions.get(run) !== admission || process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.env.OPENCLAW_UPDATE_POST_CORE === "1" || !run.executorFence) return;
		assertCurrent();
		const expected = getUpdateRun(run.runId, { env });
		if (!expected || expected.status !== "running" || ![
			"requested",
			"staging",
			"validating"
		].includes(expected.phase) || expected.createdAtMs !== admission.record.createdAtMs) return;
		assertCurrent();
		finishInterruptedUpdateBeforeActivation(expected, assertCurrent, { env });
	};
	let shutdown;
	const onSignal = (code) => {
		if (shutdown) return;
		try {
			settle();
		} catch {
			defaultRuntime.error("Update interruption could not be recorded; history remains pending.");
		}
		shutdown = waitForSignalExitBarriers().catch(() => {
			defaultRuntime.error("Update signal cleanup did not complete.");
		}).finally(() => process.exit(code));
	};
	const onSigint = () => onSignal(130);
	const onSigterm = () => onSignal(143);
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	try {
		return await operation();
	} finally {
		retireMutableUpdateSignalRun(run);
		await shutdown;
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
	}
}
//#endregion
//#region src/cli/update-cli/update-command-run.ts
const previewAdmissions = /* @__PURE__ */ new WeakMap();
/** Advance preview custody only across this owner's committed target writes. */
function recordUpdateCommandTarget(run, patch) {
	if (!run) return;
	let before;
	const committed = recordUpdateRunPhase(run.runId, "requested", patch, { env: run.env }, (record) => {
		before = record;
	});
	const admission = previewAdmissions.get(run);
	if (admission && isDeepStrictEqual(before, admission.record)) admission.record = committed;
}
/** Admission follows the managed service root before a redirect or discovered install. */
function resolveUpdateCommandAdmissionRoot(prepared) {
	return prepared.servicePlan?.serviceRoot ?? prepared.servicePlan?.rootRedirect?.root ?? prepared.discoveredRoot;
}
async function resolveUpdateCommandAdmissionEnv(params) {
	await (params.pkgOwnership ?? createFreeBsdPkgOwnershipInspection(12e5)).assertUnowned(params.root);
	let env = resolveServiceRefreshEnv(process.env, params.invocationCwd);
	if (await resolveForegroundUpdateAdmission({
		root: params.root,
		env,
		expectedForeground: params.expectedForeground || params.opts.run?.completionOwner === "gateway-restart" || void 0
	})) return env;
	if (!params.opts.dryRun && !env["OPENCLAW_UPDATE_RUN_ID"] && isGatewayServiceManagementAllowedForUpdate(env)) {
		const inspected = await readManagedGatewayServiceForUpdate(env, params.root, await resolveUpdateInstallKind(params.root) === "package");
		if (inspected) {
			env = resolveOwnedManagedUpdateEnv({
				processEnv: env,
				serviceEnv: mergeGatewayServiceEnv(env, inspected.command),
				serviceDefinitionEnv: resolveManagedGatewayServiceCommand(inspected.command)?.environment,
				invocationCwd: params.invocationCwd
			});
			if (resolveGatewayNativeServiceIdentityConflict(env)) assertGatewayServiceManagementAllowedForUpdate(env);
		}
	}
	return env;
}
/** Package admission must not open history or launch diagnostics on a retained operation. */
function assertUpdatePackageActivationAdmission(root, options) {
	try {
		assertNoPendingPackageActivation(resolveUpdateInstallRoot(root), options);
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure({
			status: "error",
			mode: "unknown",
			root,
			reason: "update-recovery-pending",
			steps: [],
			durationMs: 0
		}, formatErrorMessage(cause), { cause });
	}
	if (options?.serviceRoot && options.serviceRoot !== root) assertUpdatePackageActivationAdmission(options.serviceRoot, { continuation: options.continuation });
}
async function admitUpdateCommandRun(params) {
	assertUpdatePackageActivationAdmission(params.root, { serviceRoot: params.serviceRoot });
	const env = await resolveUpdateCommandAdmissionEnv(params);
	await assertUpdateRecoveryAdmission({ env });
	assertUpdatePackageActivationAdmission(params.root, { serviceRoot: params.serviceRoot });
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(env),
		env,
		recoverOrphanedSidecars: false
	});
	if (params.initialization) {
		const initialized = params.initialization;
		if (resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath(env)) !== initialized.databasePath || resolvePathViaExistingAncestorSync(resolveConfigPath(env)) !== initialized.configPath) throw new GatewayServiceUpdateOwnershipError("Gateway state or configuration selectors changed during target initialization. Retry from the installation's current owning account.", void 0);
		await revalidateUpdateDatabaseContext({
			env,
			readEnv: env,
			config: initialized.target.configSnapshot.sourceConfig,
			configSnapshot: initialized.target.configSnapshot,
			...initialized.target.legacyConfigPlan ? { legacyConfigPlan: initialized.target.legacyConfigPlan } : {}
		});
	}
	const meta = await readControlPlaneUpdateSentinelMeta(env);
	await resolveForegroundUpdateAdmission({
		root: params.root,
		env,
		meta,
		expectedForeground: params.expectedForeground || params.opts.run?.completionOwner === "gateway-restart" || void 0
	});
	assertUpdatePackageActivationAdmission(params.root, { serviceRoot: params.serviceRoot });
	const driver = readUpdateRunDriver();
	const ledgerOptions = {
		env,
		busyTimeoutMs: parseUpdateTimeoutMs(params.opts.timeout) ?? 18e5
	};
	const created = createUpdateRun({
		runId: env["OPENCLAW_UPDATE_RUN_ID"]?.trim() || params.initialization?.runId,
		trigger: "cli",
		preview: params.opts.dryRun === true,
		origin: { driver },
		supersedeStaleIdentityless: !env["OPENCLAW_UPDATE_RUN_ID"]?.trim() && env["OPENCLAW_UPDATE_POST_CORE"] !== "1",
		target: {
			channel: params.opts.channel,
			tag: params.opts.tag,
			...params.installKind && params.installKind !== "unknown" ? { kind: params.installKind } : {},
			...params.installKind === "git" ? { installationMethod: "git-checkout" } : {}
		},
		before: { version: VERSION }
	}, ledgerOptions);
	const record = adoptUpdateRun(created.runId, ledgerOptions);
	const requester = resolveManagedUpdateRequester(record.origin.requester);
	const requesterAuthority = requester?.authorizationSource?.startsWith("profile:") ? Object.freeze({
		requester: Object.freeze({ ...requester }),
		isCurrent: () => {
			throw new Error("Profile update continuation has not acquired its native owner.");
		}
	}) : requester ? await createManagedUpdateRequesterAuthority(requester, env) : void 0;
	const run = {
		runId: record.runId,
		defaultStepTimeoutMs: record.trigger === "campaign" ? AUTO_UPDATE_STEP_TIMEOUT_MS : void 0,
		env,
		...record.trigger !== "cli" && meta?.runId === record.runId && meta.completionOwner === "gateway-restart" ? { completionOwner: "gateway-restart" } : {},
		...requesterAuthority ? { requesterAuthority } : {}
	};
	if (!env["OPENCLAW_UPDATE_RUN_ID"] && env.OPENCLAW_UPDATE_RUN_HANDOFF !== "1" && env["OPENCLAW_UPDATE_POST_CORE"] !== "1") {
		if (params.opts.dryRun === true) previewAdmissions.set(run, {
			record,
			env: { ...env }
		});
		else admitMutableUpdateSignalRun(run, record);
	}
	return run;
}
/** Own diagnostics only for this freshly admitted invocation's lexical lifetime. */
async function withUpdatePreviewSignals(opts, operation) {
	const admission = opts.dryRun === true && opts.run ? previewAdmissions.get(opts.run) : void 0;
	if (!admission || !opts.run || admission.active) return await withMutableUpdateSignals(opts, operation);
	admission.active = true;
	const { env } = admission;
	let interrupted = false;
	let shutdown;
	const unregister = registerSignalExitBarrier(async () => {
		if (!interrupted || process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" || process.env["OPENCLAW_UPDATE_POST_CORE"] === "1") return;
		await assertUpdateRecoveryAdmission({ env });
		if (!isDeepStrictEqual(getUpdateRun(admission.record.runId, { env }), admission.record)) return;
		finishInterruptedUpdatePreview(admission.record, { env });
	});
	const onSignal = (code) => {
		interrupted = true;
		shutdown ??= waitForSignalExitBarriers().catch(() => {
			defaultRuntime.error("Preview interruption could not be recorded; history remains pending.");
		}).finally(() => process.exit(code));
	};
	const onSigint = () => onSignal(130);
	const onSigterm = () => onSignal(143);
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	try {
		return await operation();
	} finally {
		await shutdown;
		previewAdmissions.delete(opts.run);
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
		unregister();
	}
}
function createUpdateRunProgress(run, progress) {
	let deferred = false;
	const driver = readUpdateRunDriver();
	const pendingSteps = [];
	const record = (step) => {
		if (deferred) {
			pendingSteps.push(step);
			return;
		}
		try {
			return recordUpdateRunStep(run.runId, step, { env: run.env });
		} catch (cause) {
			throw new Error(`Could not record update step "${step.step}" (${step.status}): ${formatErrorMessage(cause)}`, { cause });
		}
	};
	return {
		pendingSteps,
		onRollbackOutcome: (rollbackOutcome) => {
			if (!deferred) recordUpdateRunVerification(run.runId, { rollbackOutcome }, { env: run.env });
		},
		onHeartbeat() {
			if (!deferred) heartbeatUpdateRun(run.runId, driver, { env: run.env });
		},
		deferLedgerWrites() {
			deferred = true;
			retireMutableUpdateSignalRun(run);
		},
		flushLedgerWrites() {
			deferred = false;
			for (const step of pendingSteps.splice(0)) record(step);
		},
		onStepStart(step) {
			const committed = record({
				step: step.name,
				status: "in_progress",
				startedAtMs: Date.now()
			});
			progress.onStepStart?.(step, committed);
		},
		onStepComplete(step) {
			const endedAtMs = Date.now();
			let committed;
			for (const entry of updateRunStepsFromResultStep(step)) committed = record({
				...entry,
				startedAtMs: Math.max(0, endedAtMs - step.durationMs),
				endedAtMs
			});
			progress.onStepComplete?.(step, committed);
		}
	};
}
function completeUpdateCommandRun(input, run, completion = {}) {
	const result = normalizeControlPlaneUpdateResult(input);
	if (!run) return result;
	const inspected = inspectUpdateRecoveries({ env: run.env }).find((entry) => entry.record.runId === run.runId);
	const recovery = inspected?.format === "legacy-serving" ? inspected.record : loadUpdateRecovery(run.runId, { env: run.env });
	if (recovery?.terminal && getUpdateRun(run.runId, { env: run.env })?.status === recovery.terminal.status) return {
		...result,
		status: recovery.terminal.status === "succeeded" ? "ok" : "error",
		reason: recovery.terminal.status === "succeeded" ? void 0 : recovery.primaryFailure?.code ?? "update-rolled-back",
		runId: run.runId
	};
	if (recovery) return {
		...result,
		status: "error",
		reason: result.reason ?? "update-recovery-pending",
		runId: run.runId
	};
	const recordOptions = {
		env: run.env,
		redactPaths: result.root ? [result.root] : []
	};
	const helperRecoveryPending = process.env.OPENCLAW_UPDATE_RUN_HANDOFF === "1" && result.recovery?.serviceRestartSafe === true && result.recovery.packageRollbackVerified === true && result.recovery.service === void 0;
	const gatewayRestartPending = run.completionOwner === "gateway-restart" && run.gatewayRestartRequired === true && result.status === "ok" && !completion.rolledBack;
	if (!gatewayRestartPending && !helperRecoveryPending) {
		const finished = finishUpdateRun(run.runId, {
			status: completion.rolledBack ? "rolled-back" : result.status === "ok" ? "succeeded" : result.status === "error" ? "failed" : "skipped",
			diagnostics: result,
			before: result.before,
			reason: result.reason,
			after: result.after,
			downtimeMs: completion.downtimeMs
		}, recordOptions);
		if (result.verification) result.recovery = finished.verification.recovery ?? void 0;
	} else {
		recordUpdateRunPhase(run.runId, gatewayRestartPending ? "restarting" : "requested", {
			before: result.before,
			after: result.after
		}, recordOptions);
		recordUpdateRunDiagnostics(run.runId, result, defaultRuntime.error, recordOptions);
		if (!result.verification) for (const step of result.steps.flatMap(updateRunStepsFromResultStep)) recordUpdateRunStep(run.runId, step, recordOptions);
	}
	return {
		...result,
		runId: run.runId
	};
}
function readDevUpdateTarget() {
	const parsed = parseDevUpdateTargetEnv(process.env);
	if (parsed.status === "invalid") throw new Error(`Invalid internal ${UPDATE_DEV_TARGET_REF_ENV} contract; expected a plain Git ref or a supported tracked-target encoding.`);
	return parsed.status === "valid" ? parsed.target : void 0;
}
async function prepareUpdateCommand(opts) {
	const runtimeFailure = process.versions.bun ? null : nodeRuntimeFailure(process.versions.node, await detectCurrentSqliteCapabilities());
	if (runtimeFailure) {
		const error = `${runtimeFailure}\n${formatUnsupportedNodeVersionMessage(process.versions.node)}`;
		if (opts.json) defaultRuntime.writeJson({
			status: "error",
			mode: "unknown",
			reason: "node-runtime-preflight",
			error,
			steps: [],
			durationMs: 0
		});
		else defaultRuntime.error(`node-runtime-preflight: ${error}`);
		exitCliAfterOutput(defaultRuntime, 1);
	}
	const startedAt = Date.now();
	suppressDeprecations();
	const postCoreUpdateResume = process.env[POST_CORE_UPDATE_ENV] === "1";
	const postCoreUpdateChannel = process.env[POST_CORE_UPDATE_CHANNEL_ENV]?.trim();
	const timeoutMs = parseUpdateTimeoutMs(opts.timeout);
	const shouldRestart = opts.restart !== false;
	const requestedChannel = normalizeUpdateChannel(opts.channel);
	if (opts.channel !== void 0 && !requestedChannel) throw new Error(`--channel must be "stable", "extended-stable", "beta", or "dev" (got "${opts.channel}")`);
	let devTarget;
	if (requestedChannel === "dev") devTarget = readDevUpdateTarget();
	if (!postCoreUpdateResume && opts.dryRun !== true && isGatewayExternallySupervised()) throw new Error(formatExternalSupervisorUpdateRequired());
	const executingRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const discoveredRoot = opts.sourceUpdate?.root ?? await resolveUpdateRoot();
	const installKind = await resolveUpdateInstallKind(discoveredRoot, { timeoutMs });
	if (opts.sourceUpdate && installKind !== "git") throw new Error("Doctor source update requires the accepted Git checkout.");
	const controlPlaneUpdateSentinelMeta = await readControlPlaneUpdateSentinelMeta();
	const foreground = !postCoreUpdateResume && await resolveForegroundUpdateAdmission({
		root: discoveredRoot,
		meta: controlPlaneUpdateSentinelMeta
	});
	const pkgOwnership = createFreeBsdPkgOwnershipInspection(timeoutMs ?? 12e5);
	await pkgOwnership.assertUnowned(discoveredRoot);
	assertUpdatePackageActivationAdmission(discoveredRoot, { continuation: postCoreUpdateResume ? opts.run?.executorFence : void 0 });
	const servicePlan = installKind === "package" && !postCoreUpdateResume && !foreground ? await resolveManagedServicePackageUpdatePlan({
		root: discoveredRoot,
		pkgOwnership,
		rebind: shouldRestart
	}) : void 0;
	const packageAdmission = {
		continuation: postCoreUpdateResume ? opts.run?.executorFence : void 0,
		serviceRoot: servicePlan?.serviceRoot ?? servicePlan?.rootRedirect?.root
	};
	assertUpdatePackageActivationAdmission(discoveredRoot, packageAdmission);
	opts.run?.executorFence?.assertCurrent();
	if (opts.dryRun !== true) await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(process.env),
		recoverOrphanedSidecars: false
	});
	opts.run?.executorFence?.assertCurrent();
	const handoffRoot = controlPlaneUpdateSentinelMeta?.root;
	if (handoffRoot) {
		const { assertManagedServiceUpdateHandoffRoot } = await import("./update-managed-service-handoff-B8Mr7hKl.mjs");
		await assertManagedServiceUpdateHandoffRoot({
			expectedRoot: handoffRoot,
			root: discoveredRoot,
			executingRoot,
			postCore: postCoreUpdateResume
		});
		opts.run?.executorFence?.assertCurrent();
	}
	assertUpdatePackageActivationAdmission(discoveredRoot, packageAdmission);
	if (opts.dryRun !== true) try {
		assertConfigWriteAllowedInCurrentMode();
	} catch (err) {
		await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
		throw err;
	}
	return {
		startedAt,
		postCoreUpdateResume,
		postCoreUpdateChannel,
		timeoutMs,
		shouldRestart,
		requestedChannel,
		devTarget,
		controlPlaneUpdateSentinelMeta,
		discoveredRoot,
		installKind,
		servicePlan,
		pkgOwnership
	};
}
/** Prepare mutable runtime state only under the admitted installation owner. */
async function prepareMutableUpdateRuntime(env, fence) {
	return await withOwnedManagedUpdateEnv(env, async () => {
		fence.assertCurrent();
		await cleanupStaleManagedServiceUpdateHandoffs().catch(() => void 0);
		fence.assertCurrent();
		await assertOpenClawStateWriteAllowedAtPath({ databasePath: resolveOpenClawStateSqlitePath(process.env) });
		fence.assertCurrent();
		await disableCurrentOpenClawUpdateLaunchdJob().catch(() => void 0);
		fence.assertCurrent();
		const records = await loadInstalledPluginIndexInstallRecords();
		fence.assertCurrent();
		return records;
	});
}
//#endregion
//#region src/infra/update-run-terminal-record.ts
/** Retain a completed outcome while its updater still owns the existing state.
* Publication consumes this fact after release; it never grants recovery authority. */
function captureCompletedUpdateRun(runId, assertCurrent, options) {
	assertCurrent();
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		assertCurrent();
		if (readRecoveries(db).length > 0) return;
		const record = readUpdateRunRecord(db, runId);
		assertCurrent();
		return record?.status === "succeeded" && record.phase === "finished" ? record : void 0;
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run"
	});
}
//#endregion
//#region src/cli/update-cli/update-command-terminal-record.ts
function matchesResult(record, result) {
	if (result.status !== "ok" || result.runId && result.runId !== record.runId) return false;
	const verification = record.verification;
	if (!isUpdateRunVerificationConfirmed(verification)) return false;
	for (const key of [
		"version",
		"sha",
		"buildId"
	]) {
		const expected = result.after?.[key];
		const actual = record.after[key];
		if (expected && actual) {
			if (expected !== actual) return false;
		}
	}
	const observedVersion = verification.runningVersion;
	const observedBuild = verification.runningBuildId;
	if (record.after.version && observedVersion && record.after.version !== observedVersion || record.after.buildId && observedBuild && record.after.buildId !== observedBuild) return false;
	if (result.after?.version && observedVersion && result.after.version !== observedVersion || (result.after?.buildId ? observedBuild !== result.after.buildId : !result.after?.version || observedVersion !== result.after.version)) return false;
	const key = result.after?.buildId ? "buildId" : result.after?.sha ? "sha" : "version";
	return Boolean(result.after?.[key] && record.after[key] === result.after[key]);
}
/** Capture an already completed outcome while its real executor still owns state. */
async function captureUpdateCommandTerminalRecord(params, result, assertCurrent) {
	const run = params.opts.run;
	const executor = run?.executorFence;
	if (!run || !executor || result.status !== "ok") return;
	const pathname = resolveOpenClawStateSqlitePath(run.env);
	if (resolveOpenClawStateSqlitePath(params.ownedManagedUpdateEnv ?? run.env) !== pathname) return;
	assertCurrent();
	if (!await assertUpdateRecoveryDirectoryAdmission(pathname)) return;
	assertCurrent();
	const identity = readDatabasePathIdentitySync(pathname).key;
	const record = captureCompletedUpdateRun(run.runId, assertCurrent, {
		env: run.env,
		path: pathname
	});
	assertCurrent();
	if (!record || !matchesResult(record, result)) return;
	const captured = {
		run,
		executor,
		path: pathname,
		identity,
		record
	};
	readUpdateCommandTerminalRecord(params, result, captured);
	return captured;
}
/** Recheck identity without reopening released state or taking a live snapshot. */
function readUpdateCommandTerminalRecord(params, result, captured) {
	const run = params.opts.run;
	if (run !== captured.run || run.executorFence !== captured.executor || run.runId !== captured.record.runId || resolveOpenClawStateSqlitePath(run.env) !== captured.path || resolveOpenClawStateSqlitePath(params.ownedManagedUpdateEnv ?? run.env) !== captured.path || !matchesResult(captured.record, result)) throw new Error("Update terminal publication lost its captured outcome.");
	assertExistingDatabaseIdentity(captured.path, captured.identity);
	openClawStateDatabaseCache.assertOpenClawStateDatabaseFreshOpenAllowedAtPath(captured.path, run.env);
	return captured.record;
}
//#endregion
//#region src/cli/update-cli/update-command-terminal.ts
const terminalOwners = /* @__PURE__ */ new WeakMap();
/** Finalization prepares a report; the outer invocation owns its publication. */
function deferUpdateCommandTerminalResult(run, publish) {
	const owner = run && terminalOwners.get(run);
	if (!owner) return false;
	owner.publish = publish;
	return true;
}
function hasDeferredUpdateCommandTerminalResult(run) {
	return terminalOwners.get(run)?.publish !== void 0;
}
/** Record facts while admitted; publish only when the executor has settled. */
async function prepareUnexpectedUpdateCommandFailure(error, opts, onPublishedRecord) {
	const failure = {
		mode: "unknown",
		durationMs: 0,
		failure: { cause: error }
	};
	let fact;
	try {
		const recorded = failUpdateCommandRun(error, opts.run);
		if (!recorded) throw new Error("Update history remains with its existing recovery owner.");
		fact = recorded;
	} catch (cause) {
		return new UpdateCommandPendingRecoveryFailure(createUpdateCommandFailureResult(failure), formatErrorMessage(cause), { cause: error });
	}
	const result = createUpdateCommandFailureResult({
		...failure,
		phase: fact.check
	});
	result.failedStep.failureFacts = [fact];
	const params = {
		opts,
		root: result.root ?? ""
	};
	const publish = async (settlementFailure, onTerminalRecord) => {
		const settled = await resolveSettledUpdateCommandResult(params, result, settlementFailure);
		return publishUpdateCommandTerminalResult(params, settled.result, { rolledBack: false }, onTerminalRecord);
	};
	if (!deferUpdateCommandTerminalResult(opts.run, publish)) await publish(void 0, onPublishedRecord);
	return new UpdateCommandFailure(result, 1, fact.message, { cause: error });
}
/** Enclose the real executor so its final checks and release precede terminal output. */
async function withUpdateCommandTerminalResult(operation, opts = {}) {
	const owner = {};
	let run;
	let registrationOpen = true;
	const registerRun = (admitted) => {
		if (!registrationOpen || run || terminalOwners.has(admitted)) throw new Error("Update terminal publication already has an owner or has settled.");
		run = admitted;
		terminalOwners.set(admitted, owner);
	};
	let outcome;
	try {
		outcome = { value: await operation(registerRun) };
	} catch (error) {
		outcome = { error };
	} finally {
		registrationOpen = false;
		if (run) terminalOwners.delete(run);
	}
	if ("error" in outcome && hasCommandProcessCleanupError(outcome.error)) throw outcome.error;
	const activationTimeout = "error" in outcome ? collectNestedErrorCandidates(outcome.error).find((error) => error instanceof UpdateActivationTimeoutError) : void 0;
	if (run && activationTimeout && !owner.publish) {
		const admittedRun = run;
		owner.publish = async (failure) => {
			const params = {
				opts: {
					...opts,
					run: admittedRun
				},
				root: activationTimeout.root
			};
			const { result } = await resolveSettledUpdateCommandResult(params, {
				status: "error",
				mode: "unknown",
				root: activationTimeout.root,
				steps: [],
				durationMs: activationTimeout.timeoutMs
			}, failure);
			return publishUpdateCommandTerminalResult(params, result, { rolledBack: false });
		};
	}
	if (owner.publish) {
		const result = await owner.publish("error" in outcome ? outcome.error : void 0, opts.onTerminalRecord);
		opts.onResult?.(result);
		if ("error" in outcome) {
			const failure = outcome.error;
			if (failure instanceof UpdateCommandPendingRecoveryFailure || failure instanceof UpdateCommandRecoveryPendingError || activationTimeout) throw new UpdateCommandFinalizedRecoveryFailure(result);
			throw new UpdateCommandFailure(result, failure instanceof UpdateCommandFailure ? failure.exitCode : 1, formatErrorMessage(failure), {
				cause: failure,
				automaticTriage: failure instanceof UpdateCommandFailure ? failure.automaticTriage : void 0
			});
		}
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
/** Resolve diagnostic output without reusing a released mutation fence. */
async function resolveSettledUpdateCommandResult(params, pendingResult, failure, captured) {
	const settlementFailed = failure !== void 0 && (!(failure instanceof UpdateCommandFailure) || failure instanceof UpdateCommandPendingRecoveryFailure);
	const activationTimeout = collectNestedErrorCandidates(failure).find((error) => error instanceof UpdateActivationTimeoutError);
	const failedStep = settlementFailed ? {
		name: "update-executor-settlement",
		command: "openclaw update",
		cwd: pendingResult.root ?? params.root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: activationTimeout?.message ?? formatErrorMessage(failure)
	} : void 0;
	const result = failedStep ? {
		...pendingResult,
		status: "error",
		reason: activationTimeout?.reason ?? "update-executor-settlement-failed",
		failedStep,
		steps: [...pendingResult.steps, failedStep]
	} : failure instanceof UpdateCommandFailure ? failure.result : pendingResult;
	try {
		if (failure === void 0 && captured) {
			readUpdateCommandTerminalRecord(params, result, captured);
			return {
				result,
				settlementFailed,
				captured
			};
		}
		const env = params.ownedManagedUpdateEnv ?? params.opts.run?.env;
		const targetPath = resolveOpenClawStateSqlitePath(env);
		await assertUpdateRecoveryAdmission({
			env,
			path: targetPath
		});
		if (params.opts.run) {
			if (resolveOpenClawStateSqlitePath(params.opts.run.env) !== targetPath) await assertUpdateRecoveryAdmission({ env: params.opts.run.env });
			const prior = getUpdateRun(params.opts.run.runId, { env: params.opts.run.env });
			if (prior && prior.status !== "running" && settlementFailed) throw new Error("Update history was already finalized by another owner.");
		}
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(result, formatErrorMessage(cause), { cause });
	}
	return {
		result,
		settlementFailed
	};
}
/** Share verified retirement and unverified recovery retention across finalizers. */
async function recordUpdatePackageCompletion(params, result, assertCurrent) {
	const transaction = params.packageTransaction;
	if (!transaction) return;
	if (isUpdateGatewayReadinessPending(result) || result.status === "ok" && params.opts.run?.completionOwner === "gateway-restart" && params.opts.run.gatewayRestartRequired === true) {
		assertCurrent();
		const message = `Gateway readiness is pending; backup retirement deferred for ${transaction.backupRoot}. Verify readiness before cleanup.`;
		result.steps.push({
			name: "package-backup-retention",
			command: "openclaw update",
			cwd: result.root ?? params.root,
			durationMs: 0,
			exitCode: 0,
			advisory: {
				kind: "recoverable-maintenance",
				message
			}
		});
		defaultRuntime.error(message);
		return;
	}
	let cleanupFailure;
	const retained = await transaction.complete({ activationVerified: result.status === "ok" }, assertCurrent).catch((error) => {
		assertCurrent();
		if (error instanceof UpdateCommandPendingRecoveryFailure) throw error;
		cleanupFailure = error;
		return {
			name: "package-backup-retention",
			command: "openclaw update",
			cwd: result.root ?? params.root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: `Update backup cleanup failed: ${formatErrorMessage(error)}. Inspect ${transaction.backupRoot} before manual cleanup.`
		};
	});
	assertCurrent();
	if (!retained) return;
	const step = {
		...retained,
		stderrTail: retained.stderrTail
	};
	if (step.exitCode !== 0) {
		const recoveryPath = `Recovery transaction backup path: ${transaction.backupRoot}`;
		if (!step.advisory) step.warnings = [...step.warnings ?? [], recoveryPath];
		if (!step.stderrTail?.includes(transaction.backupRoot)) step.stderrTail = [step.stderrTail, recoveryPath].filter(Boolean).join("\n");
	}
	result.steps = [...result.steps, step];
	if (result.status !== "ok" && !result.recovery?.packageRollbackVerified) {
		defaultRuntime.error(step.stderrTail);
		return;
	}
	if (step.exitCode !== 0 && step.advisory?.kind !== "recoverable-maintenance") return new UpdateCommandFailure({
		...result,
		status: "error",
		reason: "package-backup-retention-failed",
		failedStep: step
	}, 1, step.stderrTail ?? "Package backup completion was not verified.", { cause: cleanupFailure });
}
async function reportUnreportedUpdateAdmissionOutcome(error) {
	const candidates = collectNestedErrorCandidates(error);
	const outcome = candidates.find((candidate) => candidate instanceof UnreportedUpdateAdmissionOutcome);
	if (!outcome) throw error;
	const cleanupFailed = error !== outcome;
	const result = await publishPreMutationUpdateOutcome(cleanupFailed ? {
		...outcome.report,
		reason: "update-admission-cleanup-failed",
		message: candidates.filter((candidate) => candidate instanceof Error).slice(0, 8).map((candidate) => formatErrorMessage(candidate).slice(0, 2e3)).join("\n")
	} : outcome.report, async () => ({
		status: !cleanupFailed && outcome.skipped ? "skipped" : "error",
		...cleanupFailed ? { recovery: {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		} } : {}
	}));
	if (!cleanupFailed && outcome.skipped) return exitCliAfterOutput(defaultRuntime, outcome.skipped.exitCode);
	return exitCliAfterOutput(defaultRuntime, cleanupFailed ? 1 : resolveManagedServiceUpdateFailureExitCode(result));
}
async function reportPreMutationUpdateResult(params) {
	const result = await publishPreMutationUpdateOutcome(params, async () => ({
		status: params.status ?? "error",
		...params.opts.dryRun !== true && params.status !== "skipped" ? { recovery: await (params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, parseUpdateTimeoutMs(params.opts.timeout)) : verifyPackageUpdateRecovery(params.root)) } : {}
	}));
	if (!params.opts.run && params.opts.dryRun && params.reason === "invalid-dev-target") return exitCliAfterOutput(defaultRuntime, 1);
	throw new UpdateCommandFailure(result, params.status === "skipped" ? 0 : resolveManagedServiceUpdateFailureExitCode(result), params.message);
}
async function publishPreMutationUpdateOutcome(params, prepareOutcome) {
	const run = params.opts.run;
	const active = run ? getUpdateRun(run.runId, { env: run.env }) : void 0;
	if (run && active && params.message) recordUpdateRunPhase(run.runId, active.phase, {
		origin: { nextAction: params.message },
		...params.installKind !== "unknown" ? { target: { kind: params.installKind } } : {}
	}, { env: run.env });
	const outcome = await prepareOutcome();
	const failedStep = outcome.status === "error" || params.failureFacts?.length ? {
		name: outcome.status === "skipped" ? active?.phase ?? "requested" : params.reason,
		command: "openclaw update",
		cwd: params.root,
		durationMs: 0,
		exitCode: outcome.status === "error" ? 1 : 0,
		stderrTail: params.message,
		...params.recoverySteps ? { recoverySteps: params.recoverySteps } : {},
		failureFacts: normalizeUpdateFailureFacts(params.failureFacts ?? [{
			check: params.reason,
			code: params.reason,
			message: params.message
		}], run?.env)
	} : void 0;
	const result = completeUpdateCommandRun({
		...outcome,
		mode: params.mode ?? (params.installKind === "git" ? "git" : "unknown"),
		root: params.root,
		reason: params.reason,
		failedStep: outcome.status === "error" ? failedStep : void 0,
		steps: failedStep ? [failedStep] : [],
		...outcome.status === "skipped" ? { before: { version: await readPackageVersion(params.root) } } : {},
		durationMs: 0
	}, params.opts.run);
	if (params.opts.dryRun !== true) await writeControlPlaneUpdateRestartSentinelBestEffort({
		meta: params.controlPlaneUpdateSentinelMeta,
		result,
		jsonMode: Boolean(params.opts.json),
		env: run?.env
	});
	if ((run || params.opts.dryRun) && params.reason === "invalid-dev-target" && params.message) {
		defaultRuntime.error(params.message);
		return result;
	}
	if (params.opts.json && params.message) defaultRuntime.error(params.message);
	await printResult(result, params.opts, { nextAction: params.message });
	return result;
}
/** Write the terminal ledger and its visible result together after settlement. */
async function publishUpdateCommandTerminalResult(params, input, outcome, onTerminalRecord) {
	let record;
	if (outcome.captured) try {
		record = readUpdateCommandTerminalRecord(params, input, outcome.captured);
	} catch (cause) {
		throw new UpdateCommandPendingRecoveryFailure(input, formatErrorMessage(cause), { cause });
	}
	const nextAction = recordUpdateResultNextAction(params, input, record);
	const result = record ? {
		...input,
		runId: record.runId
	} : completeUpdateCommandRun(input, params.opts.run, outcome);
	await printResult(result, params.opts, {
		nextAction,
		record
	});
	if (record) onTerminalRecord?.(record);
	return result;
}
//#endregion
export { createUpdateCommandAuthority as C, suppressDeprecations as S, readDevUpdateTarget as _, recordUpdatePackageCompletion as a, resolveUpdateCommandAdmissionRoot as b, resolveSettledUpdateCommandResult as c, admitUpdateCommandRun as d, assertUpdatePackageActivationAdmission as f, prepareUpdateCommand as g, prepareMutableUpdateRuntime as h, publishUpdateCommandTerminalResult as i, withUpdateCommandTerminalResult as l, createUpdateRunProgress as m, hasDeferredUpdateCommandTerminalResult as n, reportPreMutationUpdateResult as o, completeUpdateCommandRun as p, prepareUnexpectedUpdateCommandFailure as r, reportUnreportedUpdateAdmissionOutcome as s, deferUpdateCommandTerminalResult as t, captureUpdateCommandTerminalRecord as u, recordUpdateCommandTarget as v, withUpdatePreviewSignals as x, resolveUpdateCommandAdmissionEnv as y };
