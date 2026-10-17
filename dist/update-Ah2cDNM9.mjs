import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { n as tryProcessCwd } from "./safe-cwd-DOxDm8mD.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as isPlainCommandExitFailure } from "./exec-result-s7WOth0N.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-CUdBruRD.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BquD107I.mjs";
import { f as resolveUnmanagedUpdateInstallReason, p as resolveUpdateInstallSurface } from "./update-check-CWEQyown.mjs";
import { _ as FreeBsdPkgOwnershipError, y as createFreeBsdPkgOwnershipInspection } from "./update-global-rkW-mKvG.mjs";
import { n as redactKnownPathPrefixesForSupport } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { o as createConfigRuntimeEnvBase, s as getPublishedConfigRuntimeEnvState } from "./config-env-vars-DjPHKieF.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-CDYpzA0r.mjs";
import { T as writeRestartSentinel, c as formatDoctorNonInteractiveHint } from "./restart-sentinel-CWHFSDjo.mjs";
import { d as isReportableUpdateRun, s as classifyUpdateOutcome } from "./update-outcome-BHX5xsqd.mjs";
import { n as isPublicUpdateFailureCode } from "./update-failure-public-codes-C2YOHbsK.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as summarizeUpdateStepFailure, o as toPublicUpdateRun } from "./update-run-record-Cu3LgwJt.mjs";
import { n as PACKAGE_POST_INSTALL_DOCTOR_ADVISORY } from "./update-doctor-result-yVslo54h.mjs";
import { r as readGatewayOwnerLease } from "./gateway-owner-lease-0RgOZO_d.mjs";
import { f as recordUpdateRunStep, h as reconcileAbandonedUpdateRunsAsync, l as recordUpdateRunPhase, m as getUpdateRunWithReconciliationAsync, p as recordUpdateRunVerification, r as createUpdateRun } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as finishUpdateRun, l as recordUpdateRunDiagnostics } from "./update-run-write-DdGOnqyV.mjs";
import { a as getUpdateRunAsync, c as getUpdateRunStatusAsync, i as getUpdateRun, l as listUpdateRuns, n as findActiveUpdateRun, u as listUpdateRunsAsync } from "./update-run-reader-B7x8dkVs.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import { a as isInternalMessageChannel, n as isBrowserOperatorUiClient } from "./message-channel-j-k-Nup3.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { as as validateUpdateRunParams, cs as validateUpdateRunsGetParams, es as validateUpdateHoldParams, fs as validateUpdateStatusParams, ns as validateUpdateReportParams, ps as validateUpdateStatusResult, rs as validateUpdateReportResult, ts as validateUpdateHoldResult, us as validateUpdateRunsListParams } from "./src-l2dWvEsN.mjs";
import { a as mergeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { c as getGatewaySuspendAdmissionPhase, k as tryBeginGatewayRootWorkAdmission, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { r as prepareCommandOwnerAuthority } from "./command-auth-DyjyIT4u.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as buildUpdateRestartSentinelPayload, t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { a as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-CRhfnUxj.mjs";
import { n as UpdatePreMutationError } from "./shared-D-l8dmoD.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-Cab7F5S1.mjs";
import { a as claimManagedServiceUpdateHandoff, f as startManagedServiceUpdateHandoff, p as transferManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff } from "./update-managed-service-handoff-LK1Xs-uX.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { n as devUpdateTargetFromGitTarget } from "./update-dev-target-CE00IgAg.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { h as normalizeGatewayRestartDelayMs, u as scheduleGatewayRestart } from "./restart-aw9Ylq2b.mjs";
import "./sessions-D_sxp1B4.mjs";
import { t as extractDeliveryInfo } from "./delivery-info-CEcYg3mo.mjs";
import { n as isRestartEnabled } from "./commands.flags-D0cD2TME.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { n as formatCommandOwnerHint } from "./doctor-command-owner-ZwiTw8zO.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-BrASrBY_.mjs";
import { t as renderUpdateRunNotice } from "./update-run-notice-B3odEBec.mjs";
import { n as inspectImmutableInstall } from "./update-immutable-install-C2Prgk-C.mjs";
import { n as prepareUpdateFailureReport, t as submitUpdateFailureReport } from "./update-failure-report-BNPC9pn2.mjs";
import { i as isForkUpdateBlocked, t as FORK_UPDATE_BLOCKED_MESSAGE } from "./fork-update-block-BNpONrZP.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { r as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-DhEbrRsy.mjs";
import { n as parseRestartRequestParams } from "./restart-request-Cq5MrcJD.mjs";
import { i as setUpdateScheduleCache, n as getUpdateSchedule, t as getUpdateAvailable } from "./update-status-state-BvKx4Ptf.mjs";
import { n as currentUpdateCheckLifecycle } from "./update-check-lifecycle-lSyfn78A.mjs";
import { a as refreshLatestUpdateRestartSentinel, n as getLatestUpdateRestartSentinel, r as recordLatestUpdateRestartSentinel } from "./server-restart-sentinel-CLU4C1aw.mjs";
import { r as resolveUpdateRunNoticeTarget } from "./update-run-notice-target-LGaJRoCA.mjs";
import { n as wakeUpdateRunWatcher } from "./update-run-watcher-BuZCa2gM.mjs";
import { n as resolveStartupInstallStatus, r as withUpdateInstallStatus } from "./update-install-status-BdlD4Zek.mjs";
import { n as getUpdateEffectiveChannel } from "./update-startup-tAafBDiA.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/fork-update-run-refusal.ts
/** Answers with the FIX-09 refusal while updates are blocked; true means the handler must return. */
function respondIfForkUpdateBlocked(respond) {
	if (!isForkUpdateBlocked()) return false;
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, FORK_UPDATE_BLOCKED_MESSAGE));
	return true;
}
//#endregion
//#region src/infra/ocm-update-client.ts
const name = string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/u);
const jobId = name.max(128);
const timestamp = string().transform(Date.parse).pipe(number().int().nonnegative());
const commandFailureSchema = object({
	failed: boolean(),
	exitCode: number().optional(),
	signal: unknown().optional(),
	cause: unknown().optional(),
	timedOut: boolean().optional(),
	isCanceled: boolean().optional(),
	isMaxBuffer: boolean().optional(),
	isTerminated: boolean().optional(),
	stdout: string(),
	stderr: string()
});
var OcmUpdateCapabilitiesUnsupportedError = class extends Error {
	constructor() {
		super("OCM update capabilities are unsupported. Use OCM's update command or update OCM to enable Gateway update jobs.");
	}
};
const capabilitySchema = object({
	protocol: literal("ocm.upgrade-job"),
	protocolVersion: literal(1),
	supported: boolean(),
	envName: name,
	envRoot: string(),
	stateDir: string(),
	configPath: string(),
	bindingKind: _enum([
		"runtime",
		"launcher",
		"dev",
		"none"
	]),
	bindingName: name.optional(),
	operations: array(string()),
	selectors: array(string())
});
const jobSchema = object({
	id: jobId,
	envName: name,
	state: _enum([
		"starting",
		"running",
		"succeeded",
		"failed",
		"interrupted"
	]),
	progress: string(),
	createdAt: timestamp,
	updatedAt: timestamp,
	result: object({
		outcome: string(),
		bindingKind: string().optional(),
		runtimeReleaseVersion: string().nullable(),
		note: string().nullable()
	}).nullable(),
	error: string().nullable()
});
function projectJob(job, redact) {
	const running = job.state === "starting" || job.state === "running";
	const current = job.result?.outcome === "up-to-date";
	const changed = job.result?.outcome === "updated" || job.result?.outcome === "switched" || job.result?.outcome === "source-updated";
	const kind = job.result?.bindingKind === "runtime" ? "package" : job.result?.bindingKind === "launcher" ? "git" : void 0;
	const status = running ? "running" : job.result?.outcome === "rolled-back" ? "rolled-back" : job.state !== "succeeded" ? "failed" : changed ? "succeeded" : "skipped";
	const failed = status === "failed" || status === "rolled-back";
	const version = job.result?.runtimeReleaseVersion ? redact(job.result.runtimeReleaseVersion) : void 0;
	return {
		runId: `ocm:${job.id}`,
		createdAtMs: job.createdAt,
		updatedAtMs: job.updatedAt,
		trigger: "api",
		phase: running ? "requested" : "finished",
		status,
		reason: current ? "already-current" : failed ? `ocm-update-${job.state}` : status === "skipped" ? `ocm-${job.result?.outcome ?? "unknown-outcome"}` : null,
		origin: failed || running || status === "skipped" ? { nextAction: `OCM owns this update. Check its status with ocm upgrade job status ${job.envName} --request-id ${job.id}.` } : {},
		target: {
			...kind ? { kind } : {},
			installationMethod: "ocm",
			...version ? { version } : {}
		},
		before: {},
		after: status === "succeeded" && version ? { version } : {},
		steps: [{
			step: "OCM update",
			status: running ? "in_progress" : failed ? "failed" : status === "skipped" ? "skipped" : "completed",
			startedAtMs: job.createdAt,
			...running ? {} : { endedAtMs: job.updatedAt },
			detail: redact(job.error ?? job.result?.note ?? job.progress)
		}],
		verification: {},
		repair: [],
		confirmedAtMs: null,
		finishedAtMs: running ? null : job.updatedAt,
		downtimeMs: null
	};
}
/** OCM launch metadata selects the manager; an RPC can select only a recorded job ID. */
async function resolveOcmUpdateManager() {
	const published = getPublishedConfigRuntimeEnvState();
	const env = published.sourceConfig ? createConfigRuntimeEnvBase(published.sourceConfig, process.env, { ownedEnv: published.ownedEnv }) : { ...process.env };
	if (!env.OCM_SELF || !env.OCM_ACTIVE_ENV && !env.OCM_ACTIVE_ENV_ROOT) return null;
	const redaction = {
		env,
		stateDir: resolveStateDir(env)
	};
	const redact = (value) => truncateUtf16Safe(redactKnownPathPrefixesForSupport(redactSensitiveText(value, { mode: "tools" }), redaction), 1024);
	const rejectDiagnostic = (error) => {
		throw new Error(redact(formatErrorMessage(error)));
	};
	const executable = env.OCM_SELF;
	const envName = name.safeParse(env.OCM_ACTIVE_ENV);
	const root = env.OCM_ACTIVE_ENV_ROOT;
	if (!executable || !path.isAbsolute(executable) || !env.OCM_HOME || !path.isAbsolute(env.OCM_HOME) || !root || !path.isAbsolute(root) || !envName.success) throw new Error("The OCM update binding is incomplete. Restart this environment through OCM.");
	const command = async (args) => {
		const { stdout } = await runExec(executable, [
			"upgrade",
			"job",
			...args,
			"--json"
		], {
			baseEnv: env,
			timeoutMs: 3e4,
			maxBuffer: 65536,
			logOutput: false
		}).catch((error) => {
			const failure = commandFailureSchema.safeParse(error);
			if (args[0] === "capabilities" && failure.success && isPlainCommandExitFailure(failure.data) && failure.data.exitCode === 1 && failure.data.stdout === "" && failure.data.stderr === `ocm: unexpected arguments: capabilities ${envName.data}\nRun "${executable.trim()} help" for usage.\n`) throw new OcmUpdateCapabilitiesUnsupportedError();
			return rejectDiagnostic(error);
		});
		try {
			return JSON.parse(stdout);
		} catch {
			throw new Error("OCM returned an invalid update response.");
		}
	};
	const parsedCapability = capabilitySchema.safeParse(await command(["capabilities", envName.data]).catch((error) => {
		if (error instanceof OcmUpdateCapabilitiesUnsupportedError) throw error;
		throw new Error(`Could not read OCM update capabilities: ${formatErrorMessage(error)}. Use OCM's update command or update OCM to enable Gateway update jobs.`);
	}));
	if (!parsedCapability.success) throw new Error("OCM returned an unsupported update capability response.");
	const capability = parsedCapability.data;
	const pairs = [
		[capability.envRoot, root],
		[capability.stateDir, resolveStateDir(env)],
		[capability.configPath, resolveConfigPath(env)]
	];
	const matches = await Promise.all(pairs.map(async ([actual, expected]) => path.isAbsolute(actual) && await fs.realpath(actual).catch(rejectDiagnostic) === await fs.realpath(expected).catch(rejectDiagnostic)));
	if (capability.envName !== envName.data || matches.some((match) => !match)) throw new Error("OCM's update binding does not match this Gateway's state and configuration.");
	const kind = capability.bindingKind === "runtime" ? "package" : capability.bindingKind === "launcher" ? "git" : null;
	if (!capability.supported || !capability.bindingName) return null;
	const read = (value, id) => {
		const parsedJob = jobSchema.safeParse(value);
		if (!parsedJob.success) throw new Error("OCM returned an invalid update status. Inspect the job through OCM.");
		const job = parsedJob.data;
		if (job.envName !== envName.data || id !== void 0 && job.id !== id) throw new Error("OCM returned an update for a different environment or request.");
		return projectJob(job, redact);
	};
	return {
		canStart: kind !== null && capability.operations.includes(kind === "package" ? "packaged-upgrade" : "source-upgrade"),
		async start(assertCurrent, channel) {
			if (kind === "package" && channel === "dev" || channel && kind === "package" && !capability.selectors.includes("channel")) throw new Error("OCM cannot apply the selected update channel while preserving this installation type.");
			const id = randomUUID();
			assertCurrent();
			try {
				return read(await command([
					"start",
					envName.data,
					"--request-id",
					id,
					"--if-binding",
					`${capability.bindingKind}:${capability.bindingName}`,
					...channel && kind === "package" ? ["--channel", channel] : []
				]), id);
			} catch (error) {
				try {
					return read(await command([
						"status",
						envName.data,
						"--request-id",
						id
					]), id);
				} catch {
					throw error;
				}
			}
		},
		async status(runId) {
			const id = runId === void 0 ? void 0 : jobId.parse(runId.replace(/^ocm:/u, ""));
			const value = await command([
				"status",
				envName.data,
				...id ? ["--request-id", id] : []
			]);
			return value === null && id === void 0 ? null : read(value, id);
		}
	};
}
//#endregion
//#region src/gateway/server-methods/update-admission.ts
/** Native params are returned only when this request still belongs to the native updater. */
async function admitGatewayUpdateRequest(request) {
	const { params, respond, context } = request;
	if (!assertValidParams(params, validateUpdateRunParams, "update.run", respond)) return null;
	const authority = readGatewayRequestMutationAuthority(request);
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: tryProcessCwd()
	});
	const installOwner = await readInstallOwner(root);
	if (installOwner) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatInstallOwnerMessage(installOwner), {
			details: {
				reason: "host-owned-install",
				installOwner
			},
			retryable: false
		}));
		return null;
	}
	if (root && await inspectImmutableInstall(root)) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, IMMUTABLE_UPDATE_GUIDANCE, {
			details: { reason: "immutable-native-updater-required" },
			retryable: false
		}));
		return null;
	}
	const channel = params.requester?.channel;
	const manager = !channel || isInternalMessageChannel(channel) ? await resolveOcmUpdateManager() : null;
	if (!manager?.canStart) return params;
	if (params.target) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "This OCM version does not support an explicit Git update target."));
		return null;
	}
	const run = await manager.start(authority.assertCurrent, normalizeUpdateChannel(context.getRuntimeConfig().update?.channel));
	respond(true, {
		runId: run.runId,
		ok: run.status === "running" || run.status === "succeeded" || run.status === "skipped",
		result: {
			status: run.status === "running" || run.status === "skipped" ? "skipped" : run.status === "succeeded" ? "ok" : "error",
			reason: run.reason
		},
		...run.status === "running" ? { handoff: { status: "started" } } : {},
		message: "OCM owns this update. Use the Update status view to follow its progress and result."
	});
	return null;
}
const IMMUTABLE_UPDATE_GUIDANCE = "Run openclaw update as the root installation owner outside the Gateway service cgroup. Native immutable activation requires an explicitly enabled adoption record; use openclaw update recover --root <installation-root> for retained recovery. Gateway update.run cannot acquire that external updater authority.";
function reportImmutableGatewayUpdateRefusal(runId, installSurface, respond) {
	const reason = "immutable-native-updater-required";
	recordUpdateRunPhase(runId, "requested", { origin: { nextAction: IMMUTABLE_UPDATE_GUIDANCE } });
	finishUpdateRun(runId, {
		status: "skipped",
		reason
	});
	respond(true, {
		runId,
		ok: false,
		message: IMMUTABLE_UPDATE_GUIDANCE,
		result: {
			status: "skipped",
			mode: installSurface.mode,
			root: installSurface.root,
			reason,
			steps: [],
			durationMs: 0
		},
		restart: null
	});
}
function retainUpdateRequesterAuthority(requester, authority, getConfig) {
	return {
		signal: authority?.signal,
		assertCurrent: () => {
			if (!requester?.channel || isInternalMessageChannel(requester.channel)) return;
			const config = getConfig();
			if (!requester.authorizationSource || !authority?.isCurrent(config) || !isRestartEnabled(config)) throw new Error("Update requester authority changed before parking.");
		}
	};
}
async function resolveGatewayUpdateAdmission(runId, timeoutMs) {
	recordUpdateRunStep(runId, {
		step: "installation-inspection",
		status: "in_progress"
	});
	const { root, status } = await currentUpdateCheckLifecycle().run((signal) => resolveStartupInstallStatus(false, signal));
	if (status.error?.timeoutMs) throw new Error(status.error.message);
	recordUpdateRunPhase(runId, "requested", { target: {
		...status.installKind === "git" || status.installKind === "package" ? { kind: status.installKind } : {},
		...status.installKind === "git" ? { installationMethod: "git-checkout" } : {}
	} });
	await createFreeBsdPkgOwnershipInspection(timeoutMs).assertUnowned(root);
	const installSurface = await resolveUpdateInstallSurface({
		root,
		installKind: status.installKind,
		timeoutMs
	});
	recordUpdateRunPhase(runId, "requested", {
		...installSurface.kind === "global" ? { target: { installationMethod: `${installSurface.mode}-global` } } : {},
		step: {
			step: "installation-inspection",
			status: "completed"
		}
	});
	return {
		status,
		installSurface
	};
}
function recordHandoffFailure(runId, error, previous, warn) {
	const { reason, failureFacts } = error instanceof UpdatePreMutationError ? error : {
		reason: "managed-service-handoff-failed",
		failureFacts: [createUpdateErrorFact("managed-service", error)]
	};
	const step = {
		name: "requested",
		command: "",
		cwd: previous.root ?? "",
		durationMs: 0,
		exitCode: null,
		failureFacts
	};
	try {
		if (error instanceof UpdatePreMutationError) recordUpdateRunPhase(runId, "requested", { origin: { nextAction: error.message } });
		recordUpdateRunStep(runId, {
			step: step.name,
			status: "failed",
			reason
		});
	} catch {
		warn("Update failure state could not be recorded; preserving the original error.");
	}
	recordUpdateRunDiagnostics(runId, { failure: {
		step: step.name,
		exitCode: step.exitCode,
		detail: summarizeUpdateStepFailure(step),
		failureFacts
	} }, warn);
	return {
		...previous,
		status: "error",
		reason,
		steps: [...previous.steps, step]
	};
}
function createUnexpectedUpdateFailureResult(current, previous, error, warn) {
	const activeStep = current.steps.findLast((step) => step.status === "in_progress");
	const name = activeStep?.step ?? current.phase;
	const reason = error instanceof FreeBsdPkgOwnershipError ? error.reason : "unexpected-error";
	const step = {
		name,
		command: "",
		cwd: previous.root ?? "",
		durationMs: Date.now() - (activeStep?.startedAtMs ?? current.createdAtMs),
		exitCode: 1,
		failureFacts: [createUpdateErrorFact(name, error)]
	};
	const result = {
		...previous,
		status: "error",
		mode: previous.mode === "unknown" && current.target.kind === "git" ? "git" : previous.mode,
		reason,
		recovery: current.verification.recovery ?? previous.recovery,
		rollbackOutcome: current.verification.rollbackOutcome ?? previous.rollbackOutcome ?? {
			status: "not-attempted",
			reason: "Gateway RPC does not perform rollback after an unexpected exception"
		},
		before: previous.before ?? current.before,
		after: previous.after ?? current.after,
		steps: [...previous.steps, step],
		durationMs: Date.now() - current.createdAtMs
	};
	recordUpdateRunDiagnostics(current.runId, {
		recovery: result.recovery,
		rollbackOutcome: result.rollbackOutcome,
		failure: {
			step: name,
			exitCode: step.exitCode,
			detail: summarizeUpdateStepFailure(step),
			failureFacts: step.failureFacts
		}
	}, warn);
	return result;
}
//#endregion
//#region src/gateway/server-methods/update-outcome-observation.ts
function recordGatewayUpdateOutcome(result, actor, logGateway) {
	const message = `update.run completed ${formatControlPlaneActor(actor)} changedPaths=<n/a> restartReason=update.run status=${result.status}`;
	if (classifyUpdateOutcome(result) !== "failed") {
		logGateway?.info(message);
		return;
	}
	const publicReason = result.reason && isPublicUpdateFailureCode(result.reason) ? result.reason : "unavailable";
	const failure = result.steps.findLast((step) => step.failureFacts?.length || step.exitCode !== null && step.exitCode !== 0);
	const fact = failure?.failureFacts?.[0];
	const errorName = fact?.errorName && isPublicUpdateFailureCode(fact.errorName) ? fact.errorName : "Error";
	const code = fact?.code && isPublicUpdateFailureCode(fact.code) ? ` code=${fact.code}` : "";
	const summary = failure ? `${errorName}${code}${failure.exitCode !== null ? ` exitCode=${failure.exitCode}` : ""}` : "Update request refused";
	logGateway?.warn(`${message} reason=${publicReason} error=${JSON.stringify(summary)}`);
}
//#endregion
//#region src/gateway/server-methods/update-report.ts
/** Consent-gated Gateway owner for one sanitized failed-update report. */
function readIdentity(value) {
	return value ? {
		...typeof value.sha === "string" ? { sha: value.sha } : {},
		...typeof value.version === "string" ? { version: value.version } : {},
		...typeof value.buildId === "string" ? { buildId: value.buildId } : {},
		...typeof value.upstreamRef === "string" ? { upstreamRef: value.upstreamRef } : {}
	} : void 0;
}
function projectReportInput(payload) {
	if (payload.kind !== "update" || classifyUpdateOutcome({
		status: payload.status,
		reason: payload.stats?.reason ?? void 0
	}) !== "failed" || !payload.stats) return null;
	const stats = payload.stats;
	const mode = stats.mode === "git" || stats.mode === "pnpm" || stats.mode === "bun" || stats.mode === "npm" ? stats.mode : "unknown";
	const recovery = stats.recovery;
	return {
		attemptId: stats.runId?.trim() || stats.handoffId?.trim() || `recorded:${payload.ts}`,
		result: {
			status: payload.status,
			mode,
			...typeof stats.reason === "string" ? { reason: stats.reason } : {},
			...readIdentity(stats.before) ? { before: readIdentity(stats.before) } : {},
			...readIdentity(stats.after) ? { after: readIdentity(stats.after) } : {},
			steps: (stats.steps ?? []).map((step) => {
				const projected = {
					name: step.name,
					command: "",
					cwd: "",
					durationMs: step.durationMs ?? 0,
					exitCode: step.log?.exitCode ?? null,
					failureFacts: step.failureFacts
				};
				if (step.advisory) projected.advisory = PACKAGE_POST_INSTALL_DOCTOR_ADVISORY;
				return projected;
			}),
			durationMs: stats.durationMs ?? 0,
			...recovery ? { recovery } : {}
		},
		...stats.target ? { target: stats.target } : {}
	};
}
async function readCurrentReportInput(hasCurrentAuthority) {
	const sentinel = await refreshLatestUpdateRestartSentinel();
	if (!hasCurrentAuthority()) return null;
	const run = findActiveUpdateRun() ?? listUpdateRuns({ limit: 1 })[0];
	if (!run) return sentinel ? projectReportInput(sentinel) : null;
	if (!isReportableUpdateRun(run)) return null;
	const matching = sentinel?.stats?.runId === run.runId && sentinel.stats.reason === run.reason ? projectReportInput(sentinel) : null;
	const target = run.target.sha ?? run.target.version ?? run.target.tag ?? (run.target.channel ? `${run.target.channel} channel` : matching?.target);
	return {
		attemptId: run.runId,
		recordedRun: run,
		...target ? { target } : {},
		result: {
			status: "error",
			mode: matching?.result.mode ?? (run.target.kind === "git" ? "git" : "unknown"),
			...run.reason ? { reason: run.reason } : {},
			before: readIdentity(run.before),
			after: readIdentity(run.after),
			durationMs: Math.max(0, (run.finishedAtMs ?? run.updatedAtMs) - run.createdAtMs),
			steps: matching?.result.steps ?? [],
			...matching?.result.recovery ? { recovery: matching.result.recovery } : {}
		}
	};
}
function projectPublicSubmitResult(result) {
	if (result.status === "created") return {
		status: result.status,
		url: result.url,
		...result.message ? { message: result.message } : {}
	};
	if (result.status === "fallback") return {
		status: result.status,
		fallbackUrl: result.fallbackUrl,
		message: result.message
	};
	return {
		status: result.status,
		message: result.message,
		...result.url ? { url: result.url } : {},
		...result.fallbackUrl ? { fallbackUrl: result.fallbackUrl } : {}
	};
}
function hasUpdateReportOwnerAuthority(client) {
	return client?.internal?.operatorRoleActor?.kind === "system" || client?.authenticatedUserProfile?.profileId === "gateway-owner";
}
const updateReportHandler = async ({ client, context, hasCurrentClientAuthority, params, respond }) => {
	if (!assertValidParams(params, validateUpdateReportParams, "update.report", respond)) return;
	if (!hasCurrentClientAuthority) {
		respond(false, void 0, {
			code: "INVALID_REQUEST",
			message: "Update report access requires a current authenticated client."
		});
		return;
	}
	const profileId = client?.authenticatedUserProfile?.profileId;
	const systemActor = client?.internal?.operatorRoleActor?.kind === "system";
	const publicationMode = hasUpdateReportOwnerAuthority(client) ? "host" : "browser";
	if (publicationMode === "browser" && !profileId?.trim()) {
		respond(false, void 0, {
			code: ErrorCodes.FORBIDDEN,
			message: "Update failure reports require an identified administrator."
		});
		return;
	}
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const hasCurrentReportAuthority = () => !client?.connectionSignal?.aborted && hasCurrentClientAuthority() && (!runtimeIdentity || context.validateAgentRuntimeApprovalAuthority?.(runtimeIdentity) === true) && client?.authenticatedUserProfile?.profileId === profileId && client?.internal?.operatorRoleActor?.kind === "system" === systemActor && (publicationMode === "browser" || hasUpdateReportOwnerAuthority(client));
	if (!hasCurrentReportAuthority()) return;
	try {
		const input = await readCurrentReportInput(hasCurrentReportAuthority);
		if (!hasCurrentReportAuthority()) return;
		if (!input || input.attemptId !== params.attemptId) {
			respond(false, void 0, {
				code: "INVALID_REQUEST",
				message: "This failed update attempt is stale or unavailable."
			});
			return;
		}
		const prepared = await prepareUpdateFailureReport(input);
		if (!hasCurrentReportAuthority()) return;
		let result;
		if (params.action === "preview") {
			if (!hasCurrentReportAuthority()) return;
			result = {
				status: "ready",
				attemptId: prepared.attemptId,
				body: prepared.body,
				previewDigest: prepared.previewDigest,
				title: prepared.title
			};
		} else {
			const submitted = await submitUpdateFailureReport(prepared, params.previewDigest, {
				publicationMode,
				hasCurrentAuthority: hasCurrentReportAuthority,
				validateCurrentAttempt: async () => {
					const currentInput = await readCurrentReportInput(hasCurrentReportAuthority);
					if (currentInput?.attemptId !== params.attemptId) return false;
					return (await prepareUpdateFailureReport(currentInput)).previewDigest === prepared.previewDigest;
				}
			});
			if (submitted.status === "stale") {
				respond(false, void 0, {
					code: "INVALID_REQUEST",
					message: submitted.message
				});
				return;
			}
			result = projectPublicSubmitResult(submitted);
		}
		if (!hasCurrentReportAuthority()) return;
		if (!validateUpdateReportResult(result)) {
			respond(false, void 0, {
				code: "UNAVAILABLE",
				message: "update report status is temporarily unavailable"
			});
			return;
		}
		respond(true, result);
	} catch {
		respond(false, void 0, {
			code: "INVALID_REQUEST",
			message: "Update report could not be prepared safely."
		});
	}
};
//#endregion
//#region src/infra/update-status-schedule.ts
/** Projects scheduler facts independently of optional checkout discovery. */
function getGatewayUpdateSchedule(cfg, channel) {
	const schedule = getUpdateSchedule();
	const campaign = currentUpdateCheckLifecycle().campaign?.getState();
	const { campaign: _cachedCampaign, ...cachedFacts } = schedule ?? {
		channel,
		campaign: void 0
	};
	const result = {
		...schedule && (schedule.channel === channel || campaign && schedule.campaign?.id === campaign.id) ? cachedFacts : { channel },
		autoEnabled: Boolean(cfg.update?.auto?.enabled) && cfg.update?.checkOnStart !== false && !isTruthyEnvValue(process.env.OPENCLAW_NO_AUTO_UPDATE),
		...campaign ? { campaign } : {}
	};
	const install = currentUpdateCheckLifecycle().installStatus;
	return install && (install.status.error?.timeoutMs || install.status.installKind === "immutable") ? withUpdateInstallStatus(result, install.status, true, install.installReceipt, install.root) : result;
}
/** Refreshes read-only checkout and immutable-generation facts used by update.status. */
function refreshGatewayUpdateStatus(cfg) {
	const lifecycle = currentUpdateCheckLifecycle();
	const pending = lifecycle.refreshes.get(cfg);
	if (pending) return pending;
	const refresh = lifecycle.run(async (signal) => {
		const scheduleAtStart = getUpdateSchedule();
		const channel = normalizeUpdateChannel(cfg.update?.channel) ?? resolveEffectiveUpdateChannel({
			currentVersion: VERSION,
			...(await lifecycle.initialize()).status
		}).channel;
		const isCurrent = () => {
			const schedule = getUpdateSchedule();
			const campaign = lifecycle.campaign?.getState();
			return lifecycle.isCurrent() && !signal.aborted && (!campaign || schedule?.channel === channel && schedule.campaign?.id === campaign.id) && (schedule === scheduleAtStart || schedule?.channel === channel);
		};
		if (channel !== "dev" && lifecycle.installStatus?.status.installKind !== "immutable" || !isCurrent()) return;
		const { root, status, installReceipt } = await resolveStartupInstallStatus(true, signal);
		if (!isCurrent()) return;
		if (lifecycle.installStatus?.status.error && !status.error || lifecycle.installStatus?.status.installKind === "immutable" || status.installKind === "immutable") lifecycle.installStatus = {
			root,
			status,
			installReceipt
		};
		const schedule = getUpdateSchedule();
		const current = schedule?.channel === channel ? schedule : {
			channel,
			autoEnabled: Boolean(cfg.update?.auto?.enabled)
		};
		setUpdateScheduleCache({ next: withUpdateInstallStatus(current, status, true, installReceipt, root) });
	}).finally(() => {
		if (lifecycle.refreshes.get(cfg) === refresh) lifecycle.refreshes.delete(cfg);
	});
	lifecycle.refreshes.set(cfg, refresh);
	return refresh;
}
//#endregion
//#region src/gateway/server-methods/update-status.ts
const updateStatusHandlers = {
	"update.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateUpdateStatusParams, "update.status", respond)) return;
		const lifecycle = currentUpdateCheckLifecycle();
		const startedAt = areDiagnosticsEnabledForProcess() ? performance.now() : void 0;
		const timing = startedAt === void 0 ? void 0 : createStageTimingTracker(() => performance.now());
		let phase = "sentinel";
		const mark = (next) => {
			timing?.mark(phase);
			phase = next;
		};
		try {
			const immutable = lifecycle.installStatus?.status.installKind === "immutable";
			let manager = immutable ? null : await resolveOcmUpdateManager().catch((error) => {
				if (!(error instanceof OcmUpdateCapabilitiesUnsupportedError)) throw error;
				context?.logGateway?.warn(error.message);
				return null;
			});
			const managedRun = manager ? await manager.status() : null;
			if (manager && !manager.canStart && !managedRun) manager = null;
			let sentinel;
			try {
				sentinel = manager ? null : await refreshLatestUpdateRestartSentinel();
			} catch (err) {
				context?.logGateway?.warn(`update.status sentinel refresh failed: ${formatErrorMessage(err)}`);
				sentinel = getLatestUpdateRestartSentinel();
			}
			mark("checkout");
			const config = context?.getRuntimeConfig?.();
			if ((params.refreshCheckout === true || immutable) && config) try {
				await refreshGatewayUpdateStatus(config);
			} catch (err) {
				context?.logGateway?.warn(`update.status checkout refresh failed: ${formatErrorMessage(err)}`);
			}
			mark("reconciliation");
			try {
				if (!manager) await reconcileAbandonedUpdateRunsAsync();
			} catch (error) {
				context?.logGateway?.warn(`update.status reconciliation failed: ${formatErrorMessage(error)}`);
			}
			mark("history");
			const { activeRun, lastRun } = manager ? {
				activeRun: managedRun?.status === "running" ? managedRun : void 0,
				lastRun: managedRun?.status !== "running" ? managedRun ?? void 0 : void 0
			} : await getUpdateRunStatusAsync();
			const campaign = lifecycle.campaign;
			const campaignRunId = campaign?.getRunId();
			const campaignRun = !campaignRunId || lastRun?.runId === campaignRunId ? lastRun : activeRun?.runId === campaignRunId ? activeRun : await getUpdateRunAsync(campaignRunId).catch((error) => {
				context?.logGateway?.warn(`update.status campaign run lookup failed: ${formatErrorMessage(error)}`);
			});
			if (lifecycle.isCurrent() && !lifecycle.signal.aborted) campaign?.reconcileRun(campaignRun);
			mark("identity");
			let currentConfig = context?.getRuntimeConfig?.() ?? config;
			let effectiveChannel = normalizeUpdateChannel(currentConfig?.update?.channel) ?? (currentConfig ? void 0 : normalizeUpdateChannel(getUpdateSchedule()?.channel));
			if (!effectiveChannel) {
				try {
					effectiveChannel = await getUpdateEffectiveChannel();
				} catch (err) {
					context?.logGateway?.warn(`update.status install identity failed: ${formatErrorMessage(err)}`);
				}
				currentConfig = context?.getRuntimeConfig?.() ?? currentConfig;
				effectiveChannel = normalizeUpdateChannel(currentConfig?.update?.channel) ?? effectiveChannel;
			}
			const schedule = currentConfig ? effectiveChannel ? getGatewayUpdateSchedule(currentConfig, effectiveChannel) : void 0 : getUpdateSchedule();
			mark("response");
			const result = {
				sentinel,
				...activeRun ? { activeRun: toPublicUpdateRun(activeRun) } : {},
				...lastRun ? { lastRun: toPublicUpdateRun(lastRun) } : {},
				updateAvailable: getUpdateAvailable(),
				...effectiveChannel ? { effectiveChannel } : {},
				...schedule ? { schedule } : {}
			};
			if (!validateUpdateStatusResult(result)) {
				respond(false, void 0, {
					code: "UNAVAILABLE",
					message: "update status is temporarily unavailable"
				});
				return;
			}
			respond(true, result);
		} finally {
			if (timing && startedAt !== void 0 && areDiagnosticsEnabledForProcess()) {
				timing.mark(phase);
				const { totalMs, stages } = timing.snapshot();
				if (performance.now() - startedAt >= 1e3) try {
					context?.logGateway?.warn("update.status: slow request", {
						operation: "update.status",
						elapsedMs: totalMs,
						phaseDurationsMs: Object.fromEntries(stages.map(({ name, durationMs }) => [name, durationMs]))
					});
				} catch {}
			}
		}
	},
	"update.hold": ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateUpdateHoldParams, "update.hold", respond)) return;
		const actor = resolveControlPlaneActor(client);
		const campaign = currentUpdateCheckLifecycle().campaign;
		const campaignBeforeHold = campaign?.getState();
		const ok = campaign?.hold() ?? false;
		const schedule = getUpdateSchedule();
		if (ok) {
			const heldCampaign = campaign?.getState();
			context?.logGateway?.info(`update.hold granted ${formatControlPlaneActor(actor)} holdUntilMs=${heldCampaign?.holdUntilMs} forceAtMs=${heldCampaign?.forceAtMs}`);
		} else {
			const reason = !campaignBeforeHold ? "no campaign" : campaignBeforeHold.state === "applying" ? "applying" : "already held";
			context?.logGateway?.info(`update.hold refused ${formatControlPlaneActor(actor)}`, { reason });
		}
		const result = {
			ok,
			...schedule ? { schedule } : {}
		};
		if (!validateUpdateHoldResult(result)) {
			respond(false, void 0, {
				code: "UNAVAILABLE",
				message: "update hold status is temporarily unavailable"
			});
			return;
		}
		respond(true, result);
	},
	"update.runs.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateUpdateRunsGetParams, "update.runs.get", respond)) return;
		if (params.runId.startsWith("ocm:")) {
			const manager = await resolveOcmUpdateManager();
			if (!manager) {
				respond(false, void 0, {
					code: "UNAVAILABLE",
					message: "The OCM update manager is unavailable for this Gateway."
				});
				return;
			}
			respond(true, { run: await manager.status(params.runId) });
			return;
		}
		const admission = tryBeginGatewayRootWorkAdmission("ws:update.runs.get");
		if (!admission) {
			if (!getGatewayRestartDrainSignal().aborted || getGatewaySuspendAdmissionPhase() !== "accepting") {
				respond(false, void 0, {
					code: "UNAVAILABLE",
					message: "update.runs.get unavailable during gateway restart or suspension"
				});
				return;
			}
			const run = await getUpdateRunAsync(params.runId);
			respond(true, { run: run ? toPublicUpdateRun(run) : null });
			return;
		}
		try {
			const { run, reconciliationError } = await admission.run(() => getUpdateRunWithReconciliationAsync(params.runId));
			if (reconciliationError) context?.logGateway?.warn(`update.runs.get reconciliation failed: ${reconciliationError}`);
			respond(true, { run: run ? toPublicUpdateRun(run) : null });
		} finally {
			admission.release();
		}
	},
	"update.runs.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateUpdateRunsListParams, "update.runs.list", respond)) return;
		respond(true, { runs: (await listUpdateRunsAsync(params)).map(toPublicUpdateRun) });
	}
};
//#endregion
//#region src/gateway/server-methods/update.ts
const MANAGED_HANDOFF_ALREADY_RUNNING_REASON = "managed-service-handoff-already-running";
const updateHandlers = {
	...updateStatusHandlers,
	"update.report": updateReportHandler,
	"update.run": async (request) => {
		const { respond, client, context, sessionMutationCommitGuard } = request;
		if (respondIfForkUpdateBlocked(respond)) return;
		const params = await admitGatewayUpdateRequest(request);
		if (!params) return;
		const actor = resolveControlPlaneActor(client);
		const { sessionKey: rawSessionKey, deliveryContext: requestedDeliveryContext, threadId: requestedThreadId, note, continuationMessage, restartDelayMs: requestedRestartDelayMs } = parseRestartRequestParams(params);
		const getConfig = context.getRuntimeConfig;
		const config = getConfig();
		let sessionKey;
		if (rawSessionKey) try {
			sessionKey = resolveSessionStoreIdentity({
				cfg: config,
				sessionKey: rawSessionKey
			}).canonicalKey;
		} catch (error) {
			if (!(error instanceof AgentSelectionRequiredError)) throw error;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
			return;
		}
		const restartDelayMs = normalizeGatewayRestartDelayMs(requestedRestartDelayMs);
		const { deliveryContext: sessionDeliveryContext, threadId: sessionThreadId } = extractDeliveryInfo(sessionKey, { cfg: config });
		let deliveryContext = mergeDeliveryContext(requestedDeliveryContext, sessionDeliveryContext);
		const threadId = requestedThreadId ?? sessionThreadId;
		const timeoutMs = params.timeoutMs === void 0 ? void 0 : Math.max(1e3, params.timeoutMs);
		const requesterChannel = params.requester?.channel;
		const trigger = requesterChannel && !isInternalMessageChannel(requesterChannel) ? "chat" : isBrowserOperatorUiClient(client?.connect.client) || sessionKey && isInternalMessageChannel(requesterChannel ?? deliveryContext?.channel) ? "control-ui" : "api";
		const requesterInput = params.requester ? { ...params.requester } : void 0;
		const requesterAuthority = requesterInput?.channel && !isInternalMessageChannel(requesterInput.channel) ? await prepareCommandOwnerAuthority(config, requesterInput) : void 0;
		const requester = requesterInput && {
			...requesterInput,
			...requesterAuthority ? { authorizationSource: requesterAuthority.source ?? "" } : {}
		};
		const retainedRequesterAuthority = retainUpdateRequesterAuthority(requester, requesterAuthority, getConfig);
		const noticeTarget = await resolveUpdateRunNoticeTarget({
			cfg: config,
			sessionKey,
			explicitDeliveryContext: deliveryContext,
			threadId
		});
		if (noticeTarget.kind === "internal") deliveryContext = { channel: INTERNAL_MESSAGE_CHANNEL };
		const origin = {
			doctorHint: formatDoctorNonInteractiveHint(),
			...requester ? { requester } : {},
			...sessionKey ? { sessionKey } : {},
			...deliveryContext ? { deliveryContext: {
				channel: deliveryContext.channel,
				to: deliveryContext.to,
				accountId: deliveryContext.accountId,
				threadId: threadId ?? (deliveryContext.threadId != null ? String(deliveryContext.threadId) : void 0)
			} } : {}
		};
		const run = createUpdateRun({
			trigger,
			origin,
			before: { version: VERSION },
			...params.target ? { target: {
				kind: "git",
				sha: params.target.upstreamSha
			} } : {}
		});
		const runId = run.runId;
		const warn = (message) => context?.logGateway?.warn(message);
		recordUpdateRunVerification(runId, {
			runningVersion: VERSION,
			serviceRunning: true,
			pid: process.pid
		});
		wakeUpdateRunWatcher();
		let result = {
			status: "error",
			mode: "unknown",
			steps: [],
			durationMs: 0
		};
		let handoff = null;
		let managedHandoffOwner;
		let ackDelivered = false;
		let ackQueued = false;
		let acknowledgement;
		let outcomeMessage;
		const assertUpdateAdmissionCurrent = () => {
			try {
				sessionMutationCommitGuard?.();
			} catch {
				outcomeMessage = "This update no longer has a live requester principal or scheduled operator admission. Ask the operator to run the update again.";
				throw new UpdatePreMutationError("owner_required", outcomeMessage);
			}
		};
		let ownsUpdateOutcome = false;
		const updateLifecycle = currentUpdateCheckLifecycle();
		let adoptedCampaignId;
		const ownsAdoptedCampaign = () => adoptedCampaignId === void 0 || updateLifecycle.campaign?.getState()?.id === adoptedCampaignId;
		const refuseUnauthorizedChatUpdate = () => {
			if (!requester?.channel || isInternalMessageChannel(requester.channel)) return false;
			const currentConfig = getConfig();
			const reason = !requester.authorizationSource || !requesterAuthority?.isCurrent(currentConfig) ? "owner_required" : !isRestartEnabled(currentConfig) ? "restart-disabled" : void 0;
			if (!reason) return false;
			const message = reason === "owner_required" ? `Only the OpenClaw owner can start an update from chat. ${formatCommandOwnerHint({
				cfg: currentConfig,
				channel: requester.channel,
				id: requester.senderId
			})}` : "Updates from chat are disabled (commands.restart=false). Use the Control UI or ask the Gateway operator to update OpenClaw.";
			if (adoptedCampaignId && updateLifecycle.campaign?.getState()?.id === adoptedCampaignId) updateLifecycle.campaign?.clear();
			recordUpdateRunPhase(runId, "requested", { origin: { nextAction: message } });
			const refusedRun = finishUpdateRun(runId, {
				status: reason === "owner_required" ? "failed" : "skipped",
				reason
			});
			respond(true, {
				runId,
				ok: false,
				code: reason,
				message,
				ackDelivered,
				ackQueued,
				acknowledgement,
				result: {
					status: reason === "owner_required" ? "error" : "skipped",
					reason
				}
			});
			return refusedRun;
		};
		if (refuseUnauthorizedChatUpdate()) return;
		const { createUpdateRunNotifier } = await import("./update-run-notice.runtime.js");
		const notify = await createUpdateRunNotifier(run, getConfig, context.deps, noticeTarget);
		const sentinelMeta = {
			runId,
			...sessionKey ? { sessionKey } : {},
			...deliveryContext ? { deliveryContext } : {},
			...threadId ? { threadId } : {},
			...note !== void 0 ? { note } : {},
			...continuationMessage !== void 0 ? { continuationMessage } : {}
		};
		try {
			const configChannel = normalizeUpdateChannel(config.update?.channel);
			const { status, installSurface } = await resolveGatewayUpdateAdmission(runId, timeoutMs);
			const installRoot = installSurface.root;
			result.mode = installSurface.mode;
			result.root = installRoot;
			const refusedUpdate = (outcome, reason, beforeVersion) => ({
				status: outcome,
				mode: installSurface.mode,
				...installRoot ? { root: installRoot } : {},
				...beforeVersion ? { before: { version: beforeVersion } } : {},
				reason,
				steps: [],
				durationMs: 0
			});
			if (installSurface.kind === "immutable") {
				reportImmutableGatewayUpdateRefusal(runId, installSurface, respond);
				return;
			}
			const effectiveChannel = resolveEffectiveUpdateChannel({
				configChannel,
				currentVersion: VERSION,
				installKind: status.installKind,
				git: status.git
			}).channel;
			const explicitDevTarget = params.target ? devUpdateTargetFromGitTarget(params.target) : void 0;
			let targetFailureReason = explicitDevTarget && (installSurface.kind !== "git" || effectiveChannel !== "dev") ? "unsupported-update-target" : explicitDevTarget && explicitDevTarget.upstreamRef !== status.git?.upstream ? "update-target-upstream-mismatch" : void 0;
			const adoption = targetFailureReason ? void 0 : updateLifecycle.campaign?.adopt(explicitDevTarget);
			if (adoption?.status === "mismatch") targetFailureReason = "update-target-campaign-mismatch";
			else if (adoption?.status === "applying") targetFailureReason = "update-campaign-applying";
			ownsUpdateOutcome = targetFailureReason === void 0;
			const adoptedCampaign = adoption?.status === "adopted" ? adoption : void 0;
			adoptedCampaignId = adoptedCampaign?.campaignId;
			const adoptedDevTarget = adoptedCampaign?.target.kind === "git" ? devUpdateTargetFromGitTarget(adoptedCampaign.target) : void 0;
			const adoptedPackageTargetVersion = adoptedCampaign?.target.kind === "package" ? adoptedCampaign.target.version.trim() || void 0 : void 0;
			const devTarget = explicitDevTarget ?? adoptedDevTarget;
			recordUpdateRunPhase(runId, "requested", {
				...adoptedCampaign ? {
					trigger: "campaign",
					origin: { campaignId: adoptedCampaign.campaignId }
				} : {},
				target: {
					channel: effectiveChannel,
					kind: installSurface.kind === "git" ? "git" : "package",
					...devTarget ? { sha: devTarget.upstreamSha } : {},
					...adoptedPackageTargetVersion ? { version: adoptedPackageTargetVersion } : {}
				}
			});
			if (adoptedCampaign) {
				updateLifecycle.campaign?.bindRun(adoptedCampaign.campaignId, runId);
				context?.logGateway?.info(`update.run adopted campaign ${adoptedCampaign.campaignId} ${formatControlPlaneActor(actor)}`, { target: adoptedCampaign.target });
			}
			sentinelMeta.target = devTarget ? `${devTarget.upstreamRef}@${devTarget.upstreamSha}` : adoptedPackageTargetVersion ? `version ${adoptedPackageTargetVersion}` : `${effectiveChannel} channel`;
			const acknowledgeUpdate = async (beforeVersion) => {
				if (refuseUnauthorizedChatUpdate()) return false;
				const targetVersion = adoptedPackageTargetVersion ?? getUpdateAvailable()?.latestVersion;
				const acknowledgedRun = recordUpdateRunPhase(runId, "requested", {
					before: { version: beforeVersion ?? VERSION },
					...targetVersion ? { target: { version: targetVersion } } : {}
				});
				acknowledgement = renderUpdateRunNotice(acknowledgedRun, "ack") ?? void 0;
				const ack = await notify(acknowledgedRun, "ack");
				ackDelivered = ack.delivered;
				ackQueued = ack.owned;
				return true;
			};
			const detectedSupervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
			const gatewayOwner = readGatewayOwnerLease({ current: true });
			const foregroundOrigin = gatewayOwner?.mode === "foreground" && gatewayOwner.state === "live" && gatewayOwner.pid === process.pid && gatewayOwner.startedAt !== null ? {
				owner: gatewayOwner.owner,
				pid: gatewayOwner.pid,
				host: gatewayOwner.host,
				startedAt: gatewayOwner.startedAt,
				port: gatewayOwner.port,
				stateDatabasePath: resolvePathViaExistingAncestorSync(resolveOpenClawStateSqlitePath()),
				configPath: resolvePathViaExistingAncestorSync(resolveConfigPath())
			} : void 0;
			const assertForegroundRespawnEnabled = () => {
				if (foregroundOrigin && isTruthyEnvValue(process.env.OPENCLAW_NO_RESPAWN)) {
					outcomeMessage = "This foreground Gateway cannot restart because OPENCLAW_NO_RESPAWN is enabled. Stop the Gateway, run openclaw update, then start it again. To allow updates from the Gateway, relaunch it without OPENCLAW_NO_RESPAWN.";
					throw new UpdatePreMutationError("restart-unavailable", outcomeMessage);
				}
			};
			const supervisor = foregroundOrigin ? null : detectedSupervisor;
			if (supervisor) recordUpdateRunPhase(runId, "requested", { target: { installationMethod: "managed-service" } });
			const handoffChannel = installSurface.kind === "git" ? void 0 : effectiveChannel === "extended-stable" ? effectiveChannel : configChannel ?? void 0;
			if (targetFailureReason) result = refusedUpdate("error", targetFailureReason);
			else if (installSurface.kind === "missing") result = refusedUpdate("error", "not-openclaw-root");
			else if (isGatewayExternallySupervised()) {
				const beforeVersion = await readPackageVersion(installSurface.root);
				result = refusedUpdate("skipped", EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON, beforeVersion);
			} else if (installSurface.kind === "package-root") result = refusedUpdate("skipped", resolveUnmanagedUpdateInstallReason(), await readPackageVersion(installSurface.root));
			else if (!isRestartEnabled(config) && !supervisor) {
				const beforeVersion = installSurface.root ? await readPackageVersion(installSurface.root) : null;
				result = refusedUpdate("skipped", installSurface.kind === "global" ? "restart-unavailable" : "restart-disabled", beforeVersion);
			} else {
				if (!installRoot) throw new Error("managed update install root is unavailable");
				if (!supervisor && !foregroundOrigin) throw new Error("The current foreground Gateway owner could not be verified.");
				try {
					const beforeVersion = await readPackageVersion(installRoot);
					const foregroundEntrypoint = foregroundOrigin ? await resolveGatewayInstallEntrypoint(installRoot) : void 0;
					if (foregroundOrigin && !foregroundEntrypoint) throw new Error("The foreground installation's update entrypoint is unavailable.");
					const startedAt = Date.now();
					const handoffId = randomUUID();
					sentinelMeta.handoffId = handoffId;
					sentinelMeta.root = resolveUpdateInstallRoot(installRoot);
					if (foregroundOrigin) {
						sentinelMeta.completionOwner = "gateway-restart";
						sentinelMeta.foregroundOrigin = foregroundOrigin;
					}
					assertForegroundRespawnEnabled();
					if (!await acknowledgeUpdate(beforeVersion)) return;
					const refusal = refuseUnauthorizedChatUpdate();
					if (refusal) {
						if (ackDelivered || ackQueued) await notify(refusal, "finished");
						return;
					}
					assertForegroundRespawnEnabled();
					assertUpdateAdmissionCurrent();
					const started = await startManagedServiceUpdateHandoff({
						runId,
						requesterAuthority: retainedRequesterAuthority,
						beforePark: async () => {
							const assertMayPark = () => {
								const current = getUpdateRun(runId);
								if (current?.status !== "running") throw new Error("Update run disappeared before Gateway parking.");
								const currentConfig = getConfig();
								retainedRequesterAuthority.assertCurrent();
								if (foregroundOrigin) {
									if (!managedHandoffOwner || !claimManagedServiceUpdateHandoff(managedHandoffOwner) || !isRestartEnabled(currentConfig)) throw new Error("Foreground update authority changed before parking.");
									assertForegroundRespawnEnabled();
								}
								return current;
							};
							const current = assertMayPark();
							await notify(current, current.phase === "requested" ? "parking" : "activating");
							assertMayPark();
							if (foregroundOrigin) scheduleGatewayRestart({
								delayMs: 0,
								reason: "update.run",
								successorOwner: managedHandoffOwner,
								audit: {
									actor: actor.actor,
									deviceId: actor.deviceId,
									clientIp: actor.clientIp,
									changedPaths: []
								}
							});
						},
						requester,
						root: installRoot,
						timeoutMs,
						restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
						restartDelayMs: requestedRestartDelayMs === void 0 ? 0 : restartDelayMs,
						...handoffChannel ? { channel: handoffChannel } : {},
						...adoptedPackageTargetVersion ? { tag: adoptedPackageTargetVersion } : {},
						...devTarget ? { devTarget } : {},
						meta: sentinelMeta,
						handoffId,
						supervisor,
						...foregroundOrigin ? {
							foregroundOrigin,
							argv1: foregroundEntrypoint
						} : {}
					});
					ownsUpdateOutcome = started.status === "started";
					sentinelMeta.handoffId = started.handoffId ?? handoffId;
					if (started.status === "started") {
						handoff = {
							status: "started",
							...started.pid ? { pid: started.pid } : {},
							command: started.command
						};
						managedHandoffOwner = {
							kind: "managed-update-handoff",
							handoffId: started.handoffId,
							installRoot: started.installRoot
						};
						recordUpdateRunStep(runId, {
							step: "managed-service update handoff",
							status: "completed",
							exitCode: null,
							startedAtMs: startedAt,
							endedAtMs: Date.now()
						});
					} else handoff = {
						status: "already-running",
						command: started.command,
						message: "Another managed update is already running; retry after it completes."
					};
					result = {
						status: "skipped",
						mode: installSurface.mode,
						root: installRoot,
						reason: ownsUpdateOutcome ? CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON : MANAGED_HANDOFF_ALREADY_RUNNING_REASON,
						...beforeVersion ? { before: { version: beforeVersion } } : {},
						steps: ownsUpdateOutcome ? [{
							name: "managed-service update handoff",
							command: started.command,
							cwd: installRoot,
							durationMs: Date.now() - startedAt,
							exitCode: null
						}] : [],
						durationMs: Date.now() - startedAt
					};
				} catch (err) {
					context?.logGateway?.warn(`update.run managed-service handoff failed ${formatControlPlaneActor(actor)} error=${formatErrorMessage(err)}`);
					result = recordHandoffFailure(runId, err, refusedUpdate("error", "managed-service-handoff-failed"), warn);
				}
			}
		} catch (error) {
			if (error instanceof FreeBsdPkgOwnershipError) outcomeMessage = error.message;
			context?.logGateway?.warn(`update.run failed error=${formatErrorMessage(error)}`);
			let recorded = run;
			try {
				recorded = getUpdateRun(runId) ?? run;
			} catch {
				context?.logGateway?.warn("Update history could not be read; preserving the original update failure with captured admission facts.");
			}
			result = createUnexpectedUpdateFailureResult(recorded, result, error, warn);
		}
		let outcomeRun = recordUpdateRunPhase(runId, "requested", {
			before: result.before,
			after: result.after,
			...outcomeMessage ? { origin: { nextAction: outcomeMessage } } : handoff && "message" in handoff ? { origin: { nextAction: handoff.message } } : {}
		});
		if (handoff?.status !== "started") outcomeRun = finishUpdateRun(runId, {
			status: result.status === "skipped" ? "skipped" : "failed",
			reason: result.reason,
			after: result.after
		});
		ownsUpdateOutcome &&= ownsAdoptedCampaign();
		const payload = buildUpdateRestartSentinelPayload({
			result,
			meta: sentinelMeta
		});
		let sentinelPersisted = false;
		let sentinelFailure;
		if (ownsUpdateOutcome) try {
			await writeRestartSentinel(payload, void 0, () => {
				if (!ownsAdoptedCampaign()) throw new Error("Update campaign retired before restart sentinel persistence");
			});
			sentinelPersisted = true;
			if (ownsAdoptedCampaign()) recordLatestUpdateRestartSentinel(payload);
		} catch (error) {
			sentinelFailure = { error };
		}
		if (managedHandoffOwner) try {
			if (sentinelPersisted) assertUpdateAdmissionCurrent();
			if (!sentinelPersisted || !await transferManagedServiceUpdateHandoff(managedHandoffOwner)) throw sentinelFailure ? sentinelFailure.error : /* @__PURE__ */ new Error("managed update ownership transfer failed");
		} catch (error) {
			try {
				result = recordHandoffFailure(runId, error, result, warn);
			} finally {
				await cancelManagedServiceUpdateHandoff(managedHandoffOwner);
			}
			handoff = null;
			outcomeRun = finishUpdateRun(runId, {
				status: "failed",
				reason: result.reason
			});
			context?.logGateway?.warn(`update.run handoff transfer failed: ${formatErrorMessage(error)}`);
		}
		if (ownsUpdateOutcome && handoff?.status !== "started" && adoptedCampaignId !== void 0 && ownsAdoptedCampaign()) {
			updateLifecycle.campaign?.clear();
			context?.logGateway?.info("update.run failed; adopted campaign cleared", { campaignId: adoptedCampaignId });
		}
		if ((ackDelivered || ackQueued) && handoff?.status !== "started") await notify(outcomeRun, "finished");
		recordGatewayUpdateOutcome(result, actor, context?.logGateway);
		respond(true, {
			runId,
			ok: handoff?.status === "started",
			ackDelivered,
			ackQueued,
			acknowledgement,
			...outcomeMessage ? { message: outcomeMessage } : {},
			result,
			...handoff ? { handoff } : {},
			restart: null,
			sentinel: {
				persisted: sentinelPersisted,
				payload
			}
		}, void 0);
	}
};
//#endregion
export { updateHandlers };
