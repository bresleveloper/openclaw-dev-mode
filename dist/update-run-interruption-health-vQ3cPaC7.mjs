import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { b as resolveGatewayPort } from "./paths-orClZ-2Z.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { i as readPackageVersion } from "./package-json-B0xzRYh1.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-S2Kgafdv.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
import { t as GatewayRestartDeadlineError } from "./restart-health-deadline-W160VriR.mjs";
import { i as INTERRUPTED_UPDATE_SETTLE_PROBES } from "./restart-health.constants-C-z_CCoa.mjs";
import { a as resolveGatewayRestartProbeContext, o as waitForGatewayHttpReadiness } from "./restart-health-probe-Pjm6LtxI.mjs";
import { a as getGatewayChannelWarnings, c as inspectGatewayRestart, n as waitForGatewayHealthyRestart, t as isSameGatewayRestartGeneration } from "./restart-health-D3oE2IOJ.mjs";
//#region src/infra/update-run-interruption-health.ts
/** Read-only settlement shares one deadline, including setup and final identity checks. */
async function observeInterruptedUpdateGateway(candidate, input) {
	const { deadline } = input;
	let waitOutcome;
	const result = (outcome) => ({
		outcome,
		elapsedMs: Math.round(deadline.elapsedMs()),
		phase: deadline.expiredPhase ?? deadline.phase,
		...waitOutcome ? { waitOutcome } : {}
	});
	try {
		const env = input.env ?? process.env;
		const root = await deadline.read("setup:package-root", () => resolveOpenClawPackageRoot({
			argv1: process.argv[1],
			moduleUrl: import.meta.url
		}));
		if (!root) return result("unverified");
		const installedMatches = async (phase) => {
			const [version, buildId] = await deadline.read(phase, () => Promise.all([readPackageVersion(root), readBuiltGatewayBuildId(root)]));
			return version === candidate.version && buildId === candidate.buildId;
		};
		if (!await installedMatches("setup:installed-identity")) return result("unverified");
		const context = await deadline.read("setup:probe-context", () => resolveGatewayRestartProbeContext(env, void 0, deadline.signal));
		const port = resolveGatewayPort(context.config, env);
		const probe = {
			service: resolveGatewayService(),
			port,
			env,
			signal: deadline.signal,
			deadline,
			probeContext: context,
			expectedVersion: candidate.version,
			expectedBuildId: candidate.buildId,
			requirePluginHealth: true,
			requireChannelHealth: false
		};
		const inspect = (phase) => deadline.read(phase, () => inspectGatewayRestart({
			...probe,
			phase
		}));
		const servingMatches = (health) => health.healthy && health.runtime.status === "running" && health.gatewayVersion === candidate.version && health.gatewayBuildId === candidate.buildId;
		const before = await deadline.read("health-wait", () => waitForGatewayHealthyRestart({
			...probe,
			phase: "health-wait",
			requireRunningService: true,
			settle: { probes: INTERRUPTED_UPDATE_SETTLE_PROBES }
		}));
		waitOutcome = before.waitOutcome;
		if (!servingMatches(before)) return result("unverified");
		const http = await deadline.read("reconciliation:http", () => waitForGatewayHttpReadiness({
			requireChannelHealth: false,
			config: context.config,
			port,
			attempts: 1,
			deadlineAt: performance.now() + deadline.remainingMs(),
			probeTimeoutMs: deadline.remainingMs(),
			delayMs: 0,
			signal: deadline.signal
		}));
		const inspected = await inspect("reconciliation:inspect-before");
		const after = await inspect("reconciliation:inspect-after");
		if (!(http.coreReady ?? (http.healthz === 200 && http.readyz === 200)) || !servingMatches(after) || !servingMatches(inspected) || !isSameGatewayRestartGeneration(before, inspected) || !isSameGatewayRestartGeneration(inspected, after) || !await installedMatches("reconciliation:installed-identity")) return result("unverified");
		deadline.signal.throwIfAborted();
		return {
			...result("settled"),
			channelWarnings: getGatewayChannelWarnings(after, http).map(({ id }) => id),
			verification: {
				booted: true,
				serviceRunning: true,
				pid: after.runtime.pid,
				port,
				runningVersion: candidate.version,
				runningBuildId: candidate.buildId,
				versionMatch: true,
				readyz: http.readyz === 200,
				...http.coreReady !== void 0 ? { coreReady: http.coreReady } : {},
				settled: true,
				channelsReady: http.readyz === 200 && getGatewayChannelWarnings(after, http).length === 0,
				pluginErrors: after.activatedPluginErrors?.map((error) => JSON.stringify(error)) ?? []
			}
		};
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		input.signal?.throwIfAborted();
		return result(error instanceof GatewayRestartDeadlineError ? "timed-out" : "unverified");
	}
}
//#endregion
export { observeInterruptedUpdateGateway };
