import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import "./startup-migration-checkpoint-C2dAjwWy.mjs";
import "./capability-consent-error-details-CF5XfV3G.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-THF-vx3i.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { a as resolveGatewayService } from "./service-BCULlL85.mjs";
import { a as waitForGatewayHttpReadiness, i as resolveGatewayRestartProbeContext } from "./restart-health-probe-BqNYgG_6.mjs";
import { n as waitForGatewayHealthyRestart, s as inspectGatewayRestart, t as isSameGatewayRestartGeneration } from "./restart-health-By4lclzW.mjs";
import "./restart-health.constants-BnbTHsGr.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-CAxWdF8c.mjs";
import { d as UpdateCommandRecoveryPendingError } from "./update-command-executor-DDhDn9_F.mjs";
import { a as gatewayServiceCommandUsesRoot, p as resolveUpdatedGatewayRestartPort } from "./update-command-service-plan-B89pDfz8.mjs";
//#region src/cli/update-cli/update-command-plugins-internals.ts
/** Producer-classified notices shared by current and published updater handoffs. */
function collectPostCorePluginAdvisories(result) {
	return [...(result?.warnings ?? []).filter((warning) => warning.reason === "plugin-target-unavailable" || warning.reason === "plugin-operator-managed" || warning.reason === "doctor-advisory").map((warning) => warning.message), ...(result?.npm?.outcomes ?? []).filter((outcome) => outcome.code === "source-bundled-plugin").map((outcome) => outcome.message)];
}
function collectPostCorePluginFailureFacts(result, env = process.env) {
	if (result.status !== "error") return [];
	if (result.failureFacts?.length) return normalizeUpdateFailureFacts(result.failureFacts, env);
	const failures = result.npm.outcomes.filter((outcome) => outcome.status === "error").map((outcome) => ({
		check: "plugin-update",
		code: outcome.code ?? "plugin-update-failed",
		pluginId: outcome.pluginId,
		message: outcome.message
	}));
	if (!failures.length) failures.push(...result.sync.errors.map((message) => ({
		check: "plugin-sync",
		code: "plugin-sync-failed",
		message
	})));
	if (!failures.length) failures.push({
		check: "plugin-convergence",
		code: result.reason ?? "post-update-plugins",
		message: result.warnings?.[0]?.message
	});
	return normalizeUpdateFailureFacts(failures, env);
}
function assessPluginUpdate(params) {
	if (params.outcomes.some((outcome) => outcome.status === "error" && outcome.code === "PLUGIN_CAPABILITY_CONSENT_REQUIRED")) return {
		kind: "unsafe",
		reason: "capability-consent-required"
	};
	if (params.integrityDrift) return {
		kind: "unsafe",
		reason: "integrity-drift"
	};
	const failures = params.smokeFailures;
	if (failures.some((failure) => !failure.installPath)) return {
		kind: "unsafe",
		reason: "unowned-plugin-payload"
	};
	const unavailablePluginIds = [...failures.map((failure) => failure.pluginId), ...params.disabledPluginIds];
	if (unavailablePluginIds.some((pluginId) => params.requirements[pluginId] === "required")) return {
		kind: "unsafe",
		reason: "required-plugin-unavailable"
	};
	if (unavailablePluginIds.some((pluginId) => params.requirements[pluginId] !== "optional")) return {
		kind: "unsafe",
		reason: "plugin-requirement-unknown"
	};
	if (params.disabledPluginIds.length > 0) return {
		kind: "unsafe",
		reason: "plugin-disabled-after-update"
	};
	if (failures.length > 0) return {
		kind: "optional-repair-needed",
		failures
	};
	return params.errored ? {
		kind: "unsafe",
		reason: "convergence-failed"
	} : { kind: "no-payload-repair" };
}
function createPluginUpdateWarning(params) {
	const command = formatCliCommand(params.kind === "load" ? "openclaw doctor --fix" : params.pluginId ? `openclaw plugins update ${params.pluginId}` : "openclaw update repair", params.env);
	const nextAction = `Run \`${command}\` to ${params.kind === "load" ? "check and repair the load problem" : "retry"}.`;
	return {
		...params.pluginId ? { pluginId: params.pluginId } : {},
		reason: params.reason,
		message: params.pluginId ? `Plugin "${params.pluginId}" could not be ${params.kind === "load" ? "loaded" : "updated"}. ${nextAction}` : `Plugin updates could not complete. ${nextAction}`,
		guidance: [command]
	};
}
function appendPluginUpdateWarnings(result, warnings) {
	if (warnings.length === 0) return result;
	const plugins = result.postUpdate?.plugins ?? {
		status: "warning",
		changed: false,
		sync: {
			changed: false,
			switchedToBundled: [],
			switchedToNpm: [],
			warnings: [],
			errors: []
		},
		npm: {
			changed: false,
			outcomes: []
		},
		integrityDrifts: []
	};
	const combined = [...plugins.warnings ?? []];
	for (const warning of warnings) if (!combined.some((entry) => entry.pluginId === warning.pluginId && entry.reason === warning.reason)) combined.push(warning);
	return {
		...result,
		postUpdate: {
			...result.postUpdate,
			plugins: {
				...plugins,
				status: plugins.status === "error" ? "error" : "warning",
				warnings: combined
			}
		}
	};
}
/**
* Build the post-core-update result we return when the active config cannot
* even be parsed. Mandatory post-core convergence requires a parseable
* config to know which plugins are configured; if one isn't available, we
* refuse to restart the gateway and surface this as a hard error so the
* existing `status === "error"` => `exit 1` pre-restart gate fires.
*/
function buildInvalidConfigPostCoreUpdateResult() {
	const guidance = ["Run `openclaw doctor` to inspect the config validation errors.", "Once the config parses, rerun `openclaw update repair`."];
	const message = "Plugin post-update convergence skipped because the config is invalid; refusing to restart the gateway with an unverified plugin set.";
	return {
		message,
		guidance,
		result: {
			status: "error",
			reason: "invalid-config",
			changed: false,
			sync: {
				changed: false,
				switchedToBundled: [],
				switchedToNpm: [],
				warnings: [],
				errors: []
			},
			npm: {
				changed: false,
				outcomes: []
			},
			integrityDrifts: [],
			warnings: [{
				reason: "invalid-config",
				message,
				guidance
			}]
		}
	};
}
//#endregion
//#region src/cli/update-cli/update-command-supervisor.ts
async function hasLoadedLaunchdKeepAliveSupervisor(params) {
	if (process.platform !== "darwin") return false;
	return await params.service.isLoaded({ env: params.env }).catch(() => false);
}
//#endregion
//#region src/cli/update-cli/update-command-readiness.ts
async function verifyPreviousGatewayForUpdate(params) {
	const { config, env } = params;
	const readiness = captureUpdateGatewayReadinessOwner({
		opts: params.opts,
		signal: params.signal
	});
	const assertCurrent = () => {
		readiness.assertCurrent();
		params.assertCurrent?.();
	};
	const port = params.gatewayPort ?? await resolveUpdatedGatewayRestartPort({
		config,
		serviceEnv: env
	});
	const [installedVersion, expectedBuildId] = await Promise.all([readPackageVersion(params.root), readBuiltGatewayBuildId(params.root)]);
	if (params.expectedVersion && installedVersion !== params.expectedVersion) return false;
	const expectedVersion = params.expectedVersion ?? installedVersion;
	const { health, readyz } = await observeUpdateGatewayReadiness({
		serviceEnv: env,
		gatewayPort: port,
		expectedVersion: expectedVersion ?? void 0,
		expectedBuildId: expectedBuildId ?? void 0,
		timeoutMs: params.timeoutMs,
		observedStartupMs: params.observedStartupMs,
		requireRunningService: true,
		settle: { probes: 1 },
		signal: params.signal,
		requirePluginHealth: params.requirePluginHealth,
		assertCurrent
	});
	const servesPreviousPackage = await gatewayServiceCommandUsesRoot({
		root: params.root,
		env
	});
	assertCurrent();
	return Boolean(expectedVersion && servesPreviousPackage === true && health.healthy && health.runtime.status === "running" && readyz);
}
/** Keep readiness proof and its live authority bound to the original admission. */
function captureUpdateGatewayReadinessOwner(params) {
	const originalRun = params.opts.run;
	const originalExecutor = originalRun?.executorFence;
	const originalRecovery = params.opts.recovery;
	const proofOptions = {
		...params.opts,
		...originalRun ? { run: {
			...originalRun,
			env: { ...originalRun.env }
		} } : {}
	};
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
		if (params.opts.run !== originalRun || originalRun?.executorFence !== originalExecutor || params.opts.recovery !== originalRecovery) throw new UpdateCommandRecoveryPendingError("Readiness observation lost its original executor.");
		originalExecutor?.assertCurrent();
		if (originalRecovery) throw new UpdateCommandRecoveryPendingError("Full-state checkpoint recovery is deferred; retained state was left unchanged.");
	};
	return {
		proofOptions,
		assertCurrent
	};
}
function gatewayReadinessPending(health) {
	if (health.waitOutcome === "still-starting") return true;
	return health.waitOutcome === "timeout" && health.runtime.status === "running" && (typeof health.runtime.pid === "number" || Boolean(health.gatewayBootId)) && [
		"waiting for Gateway listener",
		"startup migration",
		"settling healthy Gateway"
	].includes(health.startupPhase ?? "") && !health.versionMismatch && !health.buildIdMismatch && !health.activatedPluginErrors?.length && !health.channelProbeErrors?.length && health.staleGatewayPids.length === 0;
}
/** Observe one ready generation before activation or after restart, without recording a verdict. */
async function observeUpdateGatewayReadiness(params) {
	const timeoutMs = params.timeoutMs ?? Math.max(3e5, (params.observedStartupMs ?? 0) * 10);
	const settle = params.settle ?? { probes: 12 };
	const settleDurationMs = (Math.max(1, settle.probes) - 1) * 500;
	const startedAtMs = performance.now();
	const remainingMs = () => Math.max(0, Math.min(startedAtMs + timeoutMs + settleDurationMs, params.deadlineMs ?? Infinity) - performance.now());
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	assertCurrent();
	const service = resolveGatewayService();
	const probeParams = {
		service,
		port: params.gatewayPort,
		expectedVersion: params.expectedVersion,
		...params.expectedBuildId ? { expectedBuildId: params.expectedBuildId } : {},
		requirePluginHealth: params.requirePluginHealth ?? false,
		env: params.serviceEnv,
		...params.signal ? { signal: params.signal } : {}
	};
	const waitForHealthy = async () => {
		assertCurrent();
		const supervisorKeepsAlive = await hasLoadedLaunchdKeepAliveSupervisor({
			service,
			env: params.serviceEnv
		});
		assertCurrent();
		const health = await waitForGatewayHealthyRestart({
			...probeParams,
			timeoutMs: Math.max(1, remainingMs() - settleDurationMs),
			deadlineMs: params.deadlineMs,
			requireRunningService: params.requireRunningService,
			settle,
			supervisorKeepsAlive
		});
		assertCurrent();
		return health;
	};
	let health = params.health ?? await waitForHealthy();
	let launchAgentRecovery = null;
	if (params.recoverHealth && !gatewayReadinessPending(health)) {
		({health, launchAgentRecovery} = await params.recoverHealth(health, waitForHealthy));
		assertCurrent();
	}
	if (!health.healthy && (health.waitOutcome !== void 0 && health.waitOutcome !== "healthy" || health.versionMismatch || health.buildIdMismatch || health.activatedPluginErrors?.length || health.channelProbeErrors?.length || health.staleGatewayPids.length > 0)) return {
		health,
		readyz: false,
		http: void 0,
		launchAgentRecovery
	};
	const context = await resolveGatewayRestartProbeContext(params.serviceEnv);
	assertCurrent();
	const http = await waitForGatewayHttpReadiness({
		config: context.config,
		port: params.gatewayPort,
		attempts: Math.ceil(remainingMs() / 500),
		deadlineAt: Date.now() + remainingMs(),
		probeTimeoutMs: remainingMs(),
		delayMs: 500,
		...params.signal ? { signal: params.signal } : {}
	});
	assertCurrent();
	const readyz = http.readyz === 200;
	if (health.healthy && (!params.requireRunningService || health.runtime.status === "running")) {
		const settled = health;
		const inspect = () => inspectGatewayRestart({
			...probeParams,
			probeContext: context,
			timeoutMs: Math.max(1, remainingMs())
		});
		const inspected = await inspect();
		assertCurrent();
		health = inspected.healthy ? await inspect() : inspected;
		assertCurrent();
		health.startupPhase = settled.startupPhase;
		if (!(isSameGatewayRestartGeneration(settled, inspected) && isSameGatewayRestartGeneration(inspected, health))) {
			health.healthy = false;
			health.waitOutcome = "generation-changed";
			health.probeError = "Gateway process changed during final readiness verification.";
		}
	}
	if (health.waitOutcome !== "generation-changed" && (!readyz || remainingMs() === 0)) health = {
		...health,
		healthy: false,
		waitOutcome: "timeout",
		elapsedMs: performance.now() - startedAtMs,
		...!readyz ? { startupPhase: "waiting for Gateway HTTP readiness" } : {}
	};
	return {
		health,
		readyz,
		http,
		launchAgentRecovery
	};
}
//#endregion
export { hasLoadedLaunchdKeepAliveSupervisor as a, buildInvalidConfigPostCoreUpdateResult as c, createPluginUpdateWarning as d, verifyPreviousGatewayForUpdate as i, collectPostCorePluginAdvisories as l, gatewayReadinessPending as n, appendPluginUpdateWarnings as o, observeUpdateGatewayReadiness as r, assessPluginUpdate as s, captureUpdateGatewayReadinessOwner as t, collectPostCorePluginFailureFacts as u };
