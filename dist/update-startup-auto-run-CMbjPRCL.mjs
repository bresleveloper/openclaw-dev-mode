import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { n as AUTO_UPDATE_STEP_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-CUdBruRD.mjs";
import { E as writeRestartSentinelIfUnchanged, _ as readRestartSentinelSnapshot } from "./restart-sentinel-CWHFSDjo.mjs";
import { s as classifyUpdateOutcome } from "./update-outcome-BHX5xsqd.mjs";
import { n as createUpdateErrorFact } from "./update-failure-facts-CetdnXr-.mjs";
import { a as updateRunStepsFromResultStep } from "./update-run-step-BDxgGAu8.mjs";
import { f as recordUpdateRunStep, l as recordUpdateRunPhase, r as createUpdateRun } from "./update-run-ledger-jBhhLo0P.mjs";
import { i as finishUpdateRun, l as recordUpdateRunDiagnostics } from "./update-run-write-DdGOnqyV.mjs";
import { i as getUpdateRun, u as listUpdateRunsAsync } from "./update-run-reader-B7x8dkVs.mjs";
import { d as buildUpdateRestartSentinelPayload, o as isPendingControlPlaneUpdateRestartSentinel } from "./update-control-plane-sentinel-Du9790-7.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-Cab7F5S1.mjs";
import { f as startManagedServiceUpdateHandoff, g as formatManagedServiceUpdateCommand, h as buildManagedServiceHandoffUnavailableMessage, p as transferManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff } from "./update-managed-service-handoff-LK1Xs-uX.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-C6PCt2me.mjs";
import { i as isForkUpdateBlocked, n as FORK_UPDATE_BLOCKED_REASON, t as FORK_UPDATE_BLOCKED_MESSAGE } from "./fork-update-block-BNpONrZP.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/update-startup-auto-run.ts
async function runAutoUpdateCommand(params, log) {
	const startedAt = Date.now();
	const command = formatManagedServiceUpdateCommand({
		channel: params.channel,
		...params.packageTargetVersion ? { tag: params.packageTargetVersion } : {}
	});
	const failure = (reason, message, status = "error") => ({
		status: "failed",
		result: {
			status,
			mode: params.mode,
			root: params.root,
			reason,
			before: { version: VERSION },
			steps: [],
			durationMs: Date.now() - startedAt
		},
		message
	});
	if (isForkUpdateBlocked()) return failure(FORK_UPDATE_BLOCKED_REASON, FORK_UPDATE_BLOCKED_MESSAGE, "skipped");
	if (isGatewayExternallySupervised()) return failure(EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON, "Use the external supervisor's update workflow to stop, update, and restart the Gateway.", "skipped");
	const supervisor = detectRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	if (!supervisor) return failure("managed-service-handoff-unavailable", buildManagedServiceHandoffUnavailableMessage(command), "skipped");
	recordUpdateRunPhase(params.runId, "requested", { target: { installationMethod: "managed-service" } });
	const handoffFailure = (error) => {
		log.info("automatic update handoff failed", { error: formatErrorMessage(error) });
		const reason = "managed-service-handoff-failed";
		const fact = createUpdateErrorFact("managed-service", error);
		try {
			recordUpdateRunStep(params.runId, {
				step: "requested",
				status: "failed",
				reason
			});
		} catch {
			log.info("Update failure state could not be recorded; preserving the original error.");
		}
		recordUpdateRunDiagnostics(params.runId, { failure: {
			step: "managed-service",
			detail: fact.message,
			failureFacts: [fact]
		} }, (message) => log.info(message));
		const code = extractErrorCode(error);
		const outcome = failure(reason, `Automatic update handoff failed${code ? ` (${code})` : ""}. Inspect the Gateway log, then run \`${command}\` from a shell to retry.`);
		outcome.result.steps = [{
			name: "managed-service",
			command: "",
			cwd: "",
			durationMs: 0,
			exitCode: 1,
			failureFacts: [fact]
		}];
		outcome.result.rollbackOutcome = {
			status: "not-attempted",
			reason: "Automatic handoff does not perform package rollback after an exception"
		};
		return outcome;
	};
	try {
		params.signal?.throwIfAborted();
		if (!params.root?.trim()) throw new Error("managed auto-update install root is unavailable");
		const handoffId = randomUUID();
		const started = await startManagedServiceUpdateHandoff({
			root: params.root,
			recoveryTimeoutMs: params.timeoutMs,
			restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(params.restartDrainTimeoutMs) ?? resolveGatewayRestartDeferralTimeoutMs(),
			channel: params.channel,
			...params.packageTargetVersion ? { tag: params.packageTargetVersion } : {},
			supervisor,
			handoffId,
			...params.devTarget ? { devTarget: params.devTarget } : {},
			meta: {
				runId: params.runId,
				handoffId,
				note: "background auto-update"
			}
		});
		if (started.status === "started") {
			const successorOwner = {
				kind: "managed-update-handoff",
				handoffId: started.handoffId,
				installRoot: started.installRoot
			};
			if (params.signal?.aborted) {
				const cancelled = await cancelManagedServiceUpdateHandoff(successorOwner);
				if (cancelled !== "restored-in-process") log.info("stopped auto-update handoff cancellation could not be verified", {
					result: cancelled,
					command: started.command,
					logPath: started.logPath
				});
				params.signal.throwIfAborted();
			}
			try {
				if (!await transferManagedServiceUpdateHandoff(successorOwner)) throw new Error("managed update ownership transfer failed");
				params.signal?.throwIfAborted();
			} catch (error) {
				const outcome = handoffFailure(error);
				await cancelManagedServiceUpdateHandoff(successorOwner);
				return outcome;
			}
		} else finishUpdateRun(params.runId, {
			status: "skipped",
			reason: "managed-service-handoff-already-running"
		});
		return {
			status: "handoff",
			command: started.command,
			logPath: started.logPath
		};
	} catch (err) {
		return handoffFailure(err);
	}
}
function candidateDoctorFailureSignature(run) {
	if (run.trigger !== "campaign" || run.status !== "failed" || !run.reason) return;
	const failed = run.steps.filter((step) => step.status === "failed" && (step.step === "candidate-doctor" || step.step === "candidate-doctor-lint"));
	if (!failed.length) return;
	const stable = (detail) => detail?.replace(/openclaw-update-canary-[A-Za-z0-9]+/gu, "openclaw-update-canary-[attempt]").replace(/\(\d+ms\)/gu, "(elapsed)");
	return JSON.stringify([run.reason, failed.toSorted((a, b) => a.step.localeCompare(b.step)).map((step) => [
		step.step,
		step.exitCode,
		step.failureFacts?.length ? step.failureFacts.map((fact) => JSON.stringify([
			fact.check,
			fact.code,
			fact.affectedKey,
			fact.pluginId,
			stable(fact.message)
		])).toSorted() : stable(step.detail)
	])]);
}
async function runCampaignUpdate(params) {
	const campaignId = params.campaign.getState()?.id;
	const isCurrent = () => campaignId !== void 0 && !params.signal?.aborted && params.campaign.getState()?.id === campaignId;
	if (campaignId === void 0 || !isCurrent() || !params.canApply()) return "failed";
	const recent = await listUpdateRunsAsync({
		limit: 2,
		excludeReason: "dry-run"
	}).catch((error) => {
		params.log.info("Warning: Automatic update retry history is unavailable; continuing update.", { error: formatErrorMessage(error) });
		return [];
	});
	if (!isCurrent() || !params.canApply()) return "failed";
	const signature = recent[0] && candidateDoctorFailureSignature(recent[0]);
	if (signature && recent.length === 2 && recent.every((run) => run.target.channel === params.channel && (params.mode === "git" ? run.target.sha : run.target.version) === params.version && candidateDoctorFailureSignature(run) === signature)) {
		const nextAction = "Inspect `openclaw update status`, resolve the reported check, then run `openclaw update` to retry; a new candidate also resumes automatic updates.";
		params.log.info(`Warning: Automatic updates paused after repeated candidate-doctor failure. ${nextAction}`, {
			version: params.version,
			reason: recent[0]?.reason,
			runIds: recent.map((run) => run.runId),
			nextAction
		});
		return "failed";
	}
	const run = createUpdateRun({
		trigger: "campaign",
		origin: { campaignId },
		target: {
			channel: params.channel,
			tag: params.tag,
			kind: params.mode === "git" ? "git" : "package",
			...params.mode === "unknown" ? {} : { installationMethod: params.mode === "git" ? "git-checkout" : `${params.mode}-global` },
			...params.mode === "git" ? { sha: params.version } : { version: params.version }
		},
		before: { version: VERSION }
	});
	const runId = run.runId;
	params.campaign.bindRun(campaignId, runId);
	params.onUpdateRunCreated?.();
	const { channel, forced, tag, version } = params;
	const attempt = {
		channel,
		forced,
		tag,
		version
	};
	let terminal = {
		status: "failed",
		reason: "unexpected-error"
	};
	try {
		const { runUpdateFailureTriage } = await import("./update-triage-Cm_nsncD.mjs");
		const { sentinel, revision } = await readRestartSentinelSnapshot();
		if (!isCurrent()) return "failed";
		params.onAttempt(params.version);
		const outcome = await params.runAuto({
			runId,
			channel: params.channel,
			mode: params.mode,
			timeoutMs: AUTO_UPDATE_STEP_TIMEOUT_MS,
			restartDrainTimeoutMs: resolveGatewayRestartDeferralTimeoutMs(),
			...params.root ? { root: params.root } : {},
			...params.channel === "dev" ? {} : { packageTargetVersion: params.version },
			...params.devTarget ? { devTarget: params.devTarget } : {},
			...params.signal ? { signal: params.signal } : {}
		});
		if (outcome.status === "handoff") {
			terminal = void 0;
			recordUpdateRunStep(runId, {
				step: "managed-service update handoff",
				status: "completed",
				endedAtMs: Date.now()
			});
			if (!isCurrent()) return "failed";
			params.log.info("auto-update handoff started", {
				...attempt,
				...outcome.command ? { command: outcome.command } : {},
				...outcome.logPath ? { logPath: outcome.logPath } : {}
			});
			return "handoff";
		}
		terminal = {
			status: outcome.result.status === "skipped" ? "skipped" : "failed",
			reason: outcome.result.reason,
			after: outcome.result.after
		};
		recordUpdateRunDiagnostics(runId, (recorded) => ({
			recovery: outcome.result.recovery && (recorded.recovery ?? outcome.result.recovery),
			rollbackOutcome: outcome.result.rollbackOutcome && (recorded.rollbackOutcome ?? outcome.result.rollbackOutcome)
		}), (message) => params.log.info(message));
		recordUpdateRunPhase(runId, "requested", {
			before: outcome.result.before,
			origin: { nextAction: outcome.message }
		});
		for (const step of outcome.result.steps.flatMap(updateRunStepsFromResultStep)) recordUpdateRunStep(runId, {
			...step,
			endedAtMs: Date.now()
		});
		if (!isCurrent()) return "failed";
		let triageHint;
		if (classifyUpdateOutcome(outcome.result) === "failed") {
			const triage = await runUpdateFailureTriage({
				failure: {
					result: outcome.result,
					error: outcome.message
				},
				target: {
					root: params.root,
					env: process.env
				},
				mode: "json",
				runtime: {
					log: (message) => params.log.info(message),
					error: (message) => params.log.info(message)
				},
				signal: params.signal,
				isCurrent
			});
			if (triage.status !== "cancelled") {
				triageHint = triage.hint;
				recordUpdateRunPhase(runId, "requested", { origin: { doctorHint: triageHint } });
			}
		}
		if (!isCurrent()) return "failed";
		if (!sentinel || !isPendingControlPlaneUpdateRestartSentinel(sentinel.payload)) await writeRestartSentinelIfUnchanged({
			payload: {
				...buildUpdateRestartSentinelPayload({
					result: outcome.result,
					meta: {
						runId,
						root: params.root,
						note: outcome.message
					}
				}),
				...triageHint ? { doctorHint: triageHint } : {}
			},
			expectedRevision: revision,
			isCurrent
		});
		if (!isCurrent()) return "failed";
		const skipped = classifyUpdateOutcome(outcome.result) === "noop";
		params.log.info(skipped ? "auto-update attempt skipped" : "auto-update attempt failed", {
			...attempt,
			reason: outcome.result.reason,
			message: outcome.message,
			...triageHint ? { triage: triageHint } : {}
		});
		if (skipped) {
			finishUpdateRun(runId, terminal);
			terminal = void 0;
			params.campaign.clear();
		}
		return skipped ? "applied" : "failed";
	} catch (error) {
		const detail = formatErrorMessage(error);
		params.log.info(`auto-update attempt failed error=${detail}`, attempt);
		if (terminal) {
			terminal.status = "failed";
			terminal.reason = extractErrorCode(error) || "unexpected-error";
			let current = run;
			try {
				current = getUpdateRun(runId) ?? run;
			} catch {
				params.log.info("Update history could not be read; preserving the original automatic update failure with captured admission facts.");
			}
			const step = current.steps.findLast((entry) => entry.status === "in_progress")?.step ?? current.phase;
			const fact = createUpdateErrorFact(step, error);
			recordUpdateRunDiagnostics(runId, { failure: {
				step,
				detail: fact.message,
				failureFacts: [fact]
			} }, (message) => params.log.info(message));
			recordUpdateRunDiagnostics(runId, (recorded) => ({ rollbackOutcome: recorded.rollbackOutcome ?? {
				status: "not-attempted",
				reason: "The startup campaign does not roll back a failed automatic update handoff"
			} }), (message) => params.log.info(message));
		}
		throw error;
	} finally {
		if (terminal) finishUpdateRun(runId, terminal);
	}
}
//#endregion
export { runCampaignUpdate as n, runAutoUpdateCommand as t };
