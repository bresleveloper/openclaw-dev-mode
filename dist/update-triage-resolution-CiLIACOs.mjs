import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as compareSemverStrings } from "./update-check-eI0vGW6V.mjs";
import { n as collectPackageDistContentInventoryErrors } from "./package-dist-inventory-CQca5HwG.mjs";
import { t as collectGitRuntimeErrors } from "./update-git-runtime-Cg4widap.mjs";
import { r as collectInstalledGlobalPackageErrors } from "./update-global-rkW-mKvG.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { r as isAcknowledgedAbandonedUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { c as readDeferredPluginMigrations, r as formatDeferredPluginMigration } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { d as readUpdateRunResolutionHistory, i as getUpdateRun, n as findActiveUpdateRun } from "./update-run-reader-B7x8dkVs.mjs";
import { t as assertNoPendingPackageActivation } from "./package-update-activation-B8eAkK7X.mjs";
import { f as verifyPreviousGatewayForUpdate } from "./update-command-verification-dRgzET5O.mjs";
import { a as resolveGatewayRestartProbeContext } from "./restart-health-probe-AixgfgCP.mjs";
//#region src/infra/update-triage-resolution.ts
function matchesIdentity(expected, observed) {
	return (!expected.version || expected.version === observed.version) && (!expected.sha || expected.sha === observed.sha);
}
const failureFamilies = {
	recovery: ["managed-service-handoff-failed", "update-recovery-pending"],
	package: ["global-install-failed", "runtime-verification-failed"],
	acquisition: [
		"fetch-failed",
		"no-release-tag",
		"no-target-sha",
		"target-metadata-preflight",
		"dirty",
		"clean-check-failed",
		"preflight-remote-failed",
		"preflight-revlist-failed",
		"preflight-worktree-failed",
		"preflight-no-candidates",
		"preflight-no-good-commit",
		"preflight-insufficient-space",
		"preflight-node-runtime-incompatible"
	],
	checkout: [
		"checkout-failed",
		"doctor-entry-missing",
		"ui-assets-missing",
		"ui-build-failed",
		"head-verification-failed",
		"target-sha-mismatch"
	],
	schema: [
		"database-schema-preflight",
		"invalid-config",
		"config-read-failed"
	],
	doctor: [
		"post-update-failed",
		"doctor-failed",
		"repair-requires-config-change",
		"finalize:doctor",
		"finalize:targetConfigConvergence",
		"post-plugin-doctor-invalid-config",
		"post-update-plugins"
	],
	service: [
		"managed-service-preflight",
		"service-revalidation-failed",
		"restart-unhealthy",
		"version-mismatch",
		"build-id-mismatch",
		"plugin-errors",
		"channel-errors",
		"readyz-unhealthy",
		"service-not-running"
	]
};
const nextUpdate = "Next step: run `openclaw update status --json`, then retry `openclaw update`.";
const nextRepair = "Next step: run `openclaw update status --json`, then `openclaw update repair`.";
function unresolved(message, stop = true, nextStep = nextUpdate) {
	const summary = `${nextStep} ${message}`;
	return {
		ok: false,
		score: -1,
		summary,
		...stop ? { stopReason: summary } : {}
	};
}
function validateTriagePendingRecovery(installRoot, env) {
	try {
		assertNoPendingPackageActivation(resolveUpdateInstallRoot(installRoot));
	} catch (error) {
		return unresolved(`Package activation recovery remains pending: ${formatErrorMessage(error)}`, true, nextRepair);
	}
	const warnings = readDeferredPluginMigrations({ env }).map((pending) => formatDeferredPluginMigration(pending, env));
	return warnings.length > 0 ? unresolved(warnings.join(" "), true, nextRepair) : void 0;
}
async function readGitHead(params) {
	const head = await runUtf8CommandWithTimeout([
		"git",
		"-C",
		params.installRoot,
		"rev-parse",
		"HEAD"
	], {
		signal: params.signal,
		env: params.env,
		input: "",
		killProcessTree: true,
		maxOutputBytes: 4096,
		terminateOnOutputLimit: true
	});
	params.signal.throwIfAborted();
	return head.code === 0 && head.termination === "exit" && !head.outputLimitExceeded ? head.stdout.trim() || void 0 : void 0;
}
/** Resolve the attributed blocker without rewriting the updater's historical outcome. */
async function validateTriageUpdateResolution(params) {
	const { failure, installRoot, env, signal } = params;
	signal.throwIfAborted();
	const recoveryFailure = validateTriagePendingRecovery(installRoot, env);
	if (recoveryFailure) return recoveryFailure;
	const runId = failure && "result" in failure ? failure.result.runId : void 0;
	const options = { env };
	let history;
	try {
		history = readUpdateRunResolutionHistory(options);
	} catch (error) {
		return unresolved(`Update history is unavailable: ${String(error)}`, true, nextRepair);
	}
	const original = (params.implicit ? history.failure : void 0) ?? (runId ? getUpdateRun(runId, options) : void 0);
	const ownerChanged = () => findActiveUpdateRun(options) || readUpdateRunResolutionHistory(options).outcome?.runId !== history.outcome?.runId;
	const validateDoctor = async () => {
		const doctor = await params.validateDoctor();
		signal.throwIfAborted();
		return ownerChanged() ? unresolved("The update owner changed during verification.") : validateTriagePendingRecovery(installRoot, env) ?? doctor;
	};
	if (findActiveUpdateRun(options)) return unresolved("An update is still running; wait for its owner to finish.");
	if (!failure && !original || original && isAcknowledgedAbandonedUpdateRun(original)) return await validateDoctor();
	let target = original?.target;
	if (!original || !target?.kind || !(target.version || target.kind === "git" && target.sha)) return unresolved("Cannot establish the update target.", true, nextRepair);
	const completion = history.outcome;
	const rolledBack = completion?.status === "rolled-back";
	const superseded = params.implicit && completion && (completion.status === "succeeded" || rolledBack) && completion.finishedAtMs !== null && completion.createdAtMs >= original.createdAtMs && completion.target.kind && (completion.target.version || completion.target.sha) && (matchesIdentity(target, completion.after) || (compareSemverStrings(completion.after.version ?? null, target.version ?? null) ?? -1) >= 0);
	if (superseded) target = completion.target;
	const reason = original.reason ?? (failure && "result" in failure ? failure.result.reason : void 0);
	const family = Object.entries(failureFamilies).find(([, reasons]) => reason !== void 0 && reasons.includes(reason))?.[0];
	if (!family && !superseded) return unresolved(`No resolution predicate for update failure ${reason ?? "without a recorded reason"}.`, true, nextRepair);
	if (!completion || completion.finishedAtMs === null || completion.createdAtMs < original.createdAtMs || completion.target.kind !== target.kind || completion.status !== "succeeded" && completion.status !== "rolled-back") return unresolved(`The updater has not recorded a completed resolution of the ${family} failure for ${target.sha ?? target.version}.`, true, family === "doctor" || family === "recovery" ? nextRepair : nextUpdate);
	const expected = rolledBack ? superseded ? completion.before : original.before : superseded ? completion.after : {
		version: target.version ?? completion.after.version,
		sha: target.sha ?? completion.after.sha
	};
	if (!(expected.version || expected.sha) || !matchesIdentity(expected, completion.after) || !(rolledBack ? matchesIdentity(target, completion.target) : matchesIdentity(completion.target, completion.after)) || rolledBack && !completion.steps.some((step) => step.step === "package rollback" && step.status === "completed")) return unresolved("The updater has not verified the requested version or package rollback.");
	signal.throwIfAborted();
	const installedVersion = await readPackageVersion(installRoot);
	if (!installedVersion || expected.version && installedVersion !== expected.version) return unresolved(`Expected installed version ${expected.version ?? "from the verified checkout"}; found ${installedVersion ?? "no installed version"}.`);
	const doctor = await validateDoctor();
	if (!doctor.ok) return doctor.stopReason ? doctor : {
		...doctor,
		summary: `${doctor.summary} ${nextUpdate}`
	};
	let errors;
	if (target.kind === "git") {
		const head = await readGitHead(params);
		if (!head || expected.sha && head !== expected.sha) return unresolved("The checkout does not match the updater's recorded commit.");
		errors = await collectGitRuntimeErrors({
			root: installRoot,
			sha: head
		});
	} else {
		errors = await collectInstalledGlobalPackageErrors({
			packageRoot: installRoot,
			expectedVersion: expected.version
		});
		errors.push(...await collectPackageDistContentInventoryErrors(installRoot));
	}
	signal.throwIfAborted();
	if (errors.length) return {
		...unresolved(`Installed runtime verification failed: ${errors.slice(0, 3).join("; ")}`, false),
		score: -errors.length
	};
	const { config } = await resolveGatewayRestartProbeContext(env);
	const serviceVerified = await verifyPreviousGatewayForUpdate({
		root: installRoot,
		config,
		env,
		opts: {},
		signal,
		expectedVersion: installedVersion,
		requirePluginHealth: reason === "plugin-errors" || reason === "post-update-plugins" || failure && "result" in failure && failure.result.postUpdate?.plugins?.status === "error"
	});
	signal.throwIfAborted();
	if (!serviceVerified) return unresolved("The managed Gateway's installation, running version, and readiness are not verified.");
	if (await readPackageVersion(installRoot) !== installedVersion) return unresolved("The installed version changed during verification.");
	signal.throwIfAborted();
	if (ownerChanged()) return unresolved("The update owner changed during verification.");
	return validateTriagePendingRecovery(installRoot, env) ?? {
		ok: true,
		score: 0,
		summary: `${rolledBack ? "Rollback" : "Update"} to ${expected.version ?? expected.sha}${expected.version && expected.sha ? ` (${expected.sha})` : ""} recorded by the updater; installed runtime and managed Gateway readiness verified.`
	};
}
//#endregion
export { validateTriageUpdateResolution };
