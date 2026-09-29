import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { t as AgentSelectionRequiredError } from "./agent-scope-config-IQKOEtZ4.mjs";
import { p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as isGatewayExternallySupervised, t as EXTERNAL_SUPERVISOR_UPDATE_REQUIRED_REASON } from "./gateway-supervision-dG8swyHC.mjs";
import { c as normalizeUpdateChannel, u as resolveEffectiveUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { d as isReportableUpdateRun, s as classifyUpdateOutcome } from "./update-outcome-ZpL2Kt9B.mjs";
import { t as createUpdateErrorFact } from "./update-failure-facts-THF-vx3i.mjs";
import { t as PACKAGE_POST_INSTALL_DOCTOR_ADVISORY } from "./update-doctor-result-C3mikR6I.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import { i as resolveGatewayInstallEntrypoint } from "./gateway-entrypoint-Cko-Hb6h.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { i as detectRespawnSupervisor } from "./supervisor-markers-DL2AtFkv.mjs";
import { D as resolveUpdateInstallRoot, T as writeRestartSentinel, c as formatDoctorNonInteractiveHint } from "./restart-sentinel-KM6PPxhT.mjs";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-Cd7Eq8Zi.mjs";
import { a as mergeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as CONTROL_PLANE_UPDATE_HANDOFF_STARTED_REASON, u as buildUpdateRestartSentinelPayload } from "./update-control-plane-sentinel-D6ewFI99.mjs";
import { a as recordUpdateRunDiagnostics, t as finishUpdateRun } from "./update-run-write-rAL063vt.mjs";
import { a as summarizeUpdateStepFailure } from "./update-run-record-B5xSBZMw.mjs";
import { f as recordUpdateRunPhase, g as recordUpdateRunVerification, h as recordUpdateRunStep, l as reconcileAbandonedUpdateRunsAsync, o as getUpdateRunWithReconciliationAsync, r as createUpdateRun } from "./update-run-ledger-CwAEg-5V.mjs";
import { a as getUpdateRunStatusAsync, c as listUpdateRunsAsync, i as getUpdateRunAsync, r as getUpdateRun, s as listUpdateRuns, t as findActiveUpdateRun } from "./update-run-reader-B17V1KuC.mjs";
import { t as resolveGatewayRestartDeferralTimeoutMs } from "./restart-budget-4VeKpJhh.mjs";
import { a as isInternalMessageChannel, n as isBrowserOperatorUiClient } from "./message-channel-DDcHHhpX.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { $o as validateUpdateRunsGetParams, Go as validateUpdateHoldParams, Jo as validateUpdateReportResult, Ko as validateUpdateHoldResult, Xo as validateUpdateRunParams, is as validateUpdateStatusResult, qo as validateUpdateReportParams, rs as validateUpdateStatusParams, ts as validateUpdateRunsListParams } from "./src-BRUl7oDv.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as isRestartEnabled } from "./commands.flags-BNJlVVgU.mjs";
import { c as getGatewaySuspendAdmissionPhase, k as tryBeginGatewayRootWorkAdmission, s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { r as devUpdateTargetFromGitTarget } from "./update-dev-target-DfXIcNWC.mjs";
import { A as createFreeBsdPkgOwnershipInspection, k as FreeBsdPkgOwnershipError } from "./update-runner-command-DJ8Zpaha.mjs";
import { a as claimManagedServiceUpdateHandoff, m as transferManagedServiceUpdateHandoff, p as startManagedServiceUpdateHandoff, r as cancelManagedServiceUpdateHandoff } from "./update-managed-service-handoff-DYKI1y2T.mjs";
import { i as resolveUpdateInstallSurface, r as resolveUnmanagedUpdateInstallReason } from "./update-runner-install-surface-CWMpY1DS.mjs";
import { r as prepareCommandOwnerAuthority } from "./command-auth-2PSSAYYJ.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { i as renderUpdateRunNotice } from "./update-run-report-Dh57tzMI.mjs";
import { r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import { h as normalizeGatewayRestartDelayMs, u as scheduleGatewayRestart } from "./restart-Bb4QxGMO.mjs";
import "./sessions-DE4llkPV.mjs";
import { t as extractDeliveryInfo } from "./delivery-info-DQ_vEN9Q.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { n as formatCommandOwnerHint } from "./doctor-command-owner-C0KlUKKP.mjs";
import { n as prepareUpdateFailureReport, t as submitUpdateFailureReport } from "./update-failure-report-BJcjKv9U.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as resolveControlPlaneActor, t as formatControlPlaneActor } from "./control-plane-audit-MtFtvM4m.mjs";
import { n as parseRestartRequestParams } from "./restart-request-CTr9_H5j.mjs";
import { n as getUpdateSchedule, t as getUpdateAvailable } from "./update-status-state-CWEy2E9S.mjs";
import { i as refreshGatewayUpdateStatus, n as getUpdateEffectiveChannel, o as gatewayUpdateCampaign } from "./update-startup-DidQCgua.mjs";
import { a as refreshLatestUpdateRestartSentinel, n as getLatestUpdateRestartSentinel, r as recordLatestUpdateRestartSentinel } from "./server-restart-sentinel-CzfnF9jo.mjs";
import { r as resolveUpdateRunNoticeTarget } from "./update-run-notice-target-Bb9RsWTe.mjs";
import { n as wakeUpdateRunWatcher } from "./update-run-watcher-D7uP_v6P.mjs";
import { n as currentUpdateCheckLifecycle } from "./update-check-lifecycle-DKJEwT8f.mjs";
import { t as resolveStartupInstallStatus } from "./update-install-status-9xYYCsL3.mjs";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-methods/update-admission.ts
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
	recordUpdateRunPhase(runId, "requested", { target: {
		...status.installKind === "unknown" ? {} : { kind: status.installKind },
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
	if (!hasUpdateReportOwnerAuthority(client)) {
		respond(false, void 0, {
			code: ErrorCodes.FORBIDDEN,
			message: "Update failure reports require gateway-owner or system administrator authority."
		});
		return;
	}
	const runtimeIdentity = client?.internal?.agentRuntimeIdentity;
	const hasCurrentReportAuthority = () => !client?.connectionSignal?.aborted && hasCurrentClientAuthority() && (!runtimeIdentity || context.validateAgentRuntimeApprovalAuthority?.(runtimeIdentity) === true) && hasUpdateReportOwnerAuthority(client);
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
//#region src/gateway/server-methods/update-status.ts
const updateStatusHandlers = {
	"update.status": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateUpdateStatusParams, "update.status", respond)) return;
		const startedAt = areDiagnosticsEnabledForProcess() ? performance.now() : void 0;
		const timing = startedAt === void 0 ? void 0 : createStageTimingTracker(() => performance.now());
		let phase = "sentinel";
		const mark = (next) => {
			timing?.mark(phase);
			phase = next;
		};
		try {
			let sentinel;
			try {
				sentinel = await refreshLatestUpdateRestartSentinel();
			} catch (err) {
				context?.logGateway?.warn(`update.status sentinel refresh failed: ${formatErrorMessage(err)}`);
				sentinel = getLatestUpdateRestartSentinel();
			}
			mark("checkout");
			const config = context?.getRuntimeConfig?.();
			const configChannel = normalizeUpdateChannel(config?.update?.channel);
			if (params.refreshCheckout === true && config) try {
				await refreshGatewayUpdateStatus(config);
			} catch (err) {
				context?.logGateway?.warn(`update.status checkout refresh failed: ${formatErrorMessage(err)}`);
			}
			mark("identity");
			const schedule = getUpdateSchedule();
			let effectiveChannel = configChannel ?? normalizeUpdateChannel(schedule?.channel);
			if (!effectiveChannel) try {
				effectiveChannel = await getUpdateEffectiveChannel();
			} catch (err) {
				context?.logGateway?.warn(`update.status install identity failed: ${formatErrorMessage(err)}`);
			}
			mark("reconciliation");
			try {
				await reconcileAbandonedUpdateRunsAsync();
			} catch (error) {
				context?.logGateway?.warn(`update.status reconciliation failed: ${formatErrorMessage(error)}`);
			}
			mark("history");
			const { activeRun, lastRun } = await getUpdateRunStatusAsync();
			mark("response");
			const result = {
				sentinel,
				...activeRun ? { activeRun } : {},
				...lastRun ? { lastRun } : {},
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
		const campaignBeforeHold = gatewayUpdateCampaign.getState();
		const ok = gatewayUpdateCampaign.hold();
		const schedule = getUpdateSchedule();
		if (ok) {
			const heldCampaign = gatewayUpdateCampaign.getState();
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
		const admission = tryBeginGatewayRootWorkAdmission("ws:update.runs.get");
		if (!admission) {
			if (!getGatewayRestartDrainSignal().aborted || getGatewaySuspendAdmissionPhase() !== "accepting") {
				respond(false, void 0, {
					code: "UNAVAILABLE",
					message: "update.runs.get unavailable during gateway restart or suspension"
				});
				return;
			}
			respond(true, { run: await getUpdateRunAsync(params.runId) ?? null });
			return;
		}
		try {
			const { run, reconciliationError } = await admission.run(() => getUpdateRunWithReconciliationAsync(params.runId));
			if (reconciliationError) context?.logGateway?.warn(`update.runs.get reconciliation failed: ${reconciliationError}`);
			respond(true, { run: run ?? null });
		} finally {
			admission.release();
		}
	},
	"update.runs.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateUpdateRunsListParams, "update.runs.list", respond)) return;
		respond(true, { runs: await listUpdateRunsAsync(params) });
	}
};
//#endregion
//#region src/gateway/server-methods/update.ts
const MANAGED_HANDOFF_ALREADY_RUNNING_REASON = "managed-service-handoff-already-running";
const updateHandlers = {
	...updateStatusHandlers,
	"update.report": updateReportHandler,
	"update.run": async ({ params, respond, client, context, sessionMutationCommitGuard }) => {
		if (!assertValidParams(params, validateUpdateRunParams, "update.run", respond)) return;
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
		let adoptedCampaignId;
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
			if (adoptedCampaignId && gatewayUpdateCampaign.getState()?.id === adoptedCampaignId) gatewayUpdateCampaign.clear();
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
			const effectiveChannel = resolveEffectiveUpdateChannel({
				configChannel,
				currentVersion: VERSION,
				installKind: status.installKind,
				git: status.git
			}).channel;
			const requestedTarget = params.target;
			const explicitDevTarget = isRecord(requestedTarget) && requestedTarget.kind === "git" && typeof requestedTarget.upstreamRef === "string" && /^[^\s\p{Cc}]+$/u.test(requestedTarget.upstreamRef) && typeof requestedTarget.upstreamSha === "string" && /^[a-f\d]{40}$/iu.test(requestedTarget.upstreamSha) ? devUpdateTargetFromGitTarget({
				upstreamRef: requestedTarget.upstreamRef,
				upstreamSha: requestedTarget.upstreamSha
			}) : void 0;
			let targetFailureReason = requestedTarget !== void 0 && !explicitDevTarget ? "invalid-update-target" : explicitDevTarget && (installSurface.kind !== "git" || effectiveChannel !== "dev") ? "unsupported-update-target" : explicitDevTarget && explicitDevTarget.upstreamRef !== status.git?.upstream ? "update-target-upstream-mismatch" : void 0;
			const adoption = targetFailureReason ? void 0 : gatewayUpdateCampaign.adopt(explicitDevTarget);
			if (adoption?.status === "mismatch") targetFailureReason = "update-target-campaign-mismatch";
			else if (adoption?.status === "applying") targetFailureReason = "update-campaign-applying";
			ownsUpdateOutcome = targetFailureReason === void 0;
			const adoptedCampaign = adoption?.status === "adopted" ? adoption : void 0;
			adoptedCampaignId = adoptedCampaign?.campaignId;
			const adoptedDevTarget = adoptedCampaign?.target.kind === "git" ? devUpdateTargetFromGitTarget(adoptedCampaign.target) : void 0;
			const adoptedPackageTargetVersion = adoptedCampaign?.target.kind === "package" ? adoptedCampaign.target.version.trim() || void 0 : void 0;
			if (adoptedCampaign) context?.logGateway?.info(`update.run adopted campaign ${adoptedCampaign.campaignId} ${formatControlPlaneActor(actor)}`, { target: adoptedCampaign.target });
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
		if (ownsUpdateOutcome && adoptedCampaignId !== void 0) ownsUpdateOutcome = gatewayUpdateCampaign.getState()?.id === adoptedCampaignId;
		const payload = buildUpdateRestartSentinelPayload({
			result,
			meta: sentinelMeta
		});
		let sentinelPersisted = false;
		let sentinelFailure;
		if (ownsUpdateOutcome) try {
			await writeRestartSentinel(payload);
			sentinelPersisted = true;
			recordLatestUpdateRestartSentinel(payload);
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
		if (ownsUpdateOutcome && handoff?.status !== "started" && adoptedCampaignId !== void 0 && gatewayUpdateCampaign.getState()?.id === adoptedCampaignId) {
			gatewayUpdateCampaign.clear();
			context?.logGateway?.info("update.run failed; adopted campaign cleared", { campaignId: adoptedCampaignId });
		}
		if ((ackDelivered || ackQueued) && handoff?.status !== "started") await notify(outcomeRun, "finished");
		context?.logGateway?.info(`update.run completed ${formatControlPlaneActor(actor)} changedPaths=<n/a> restartReason=update.run status=${result.status}`);
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
