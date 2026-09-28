import { r as parseTcpPortFromArgs } from "./tcp-port-BVV_ljmK.mjs";
import { E as resolveStateDir, p as resolveConfigPath, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { o as readGatewayOwnerLease } from "./windows-port-pids-Bid_Huck.mjs";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-D3Br9aVM.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-DxY7uEcU.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
import { h as isImplicitLocalGatewayTarget } from "./call-C_MP4_Gs.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-BaSdm1-m.mjs";
import { i as resolveGatewayRestartProbeContext } from "./restart-health-probe-CZvLpSGR.mjs";
import { n as waitForGatewayHealthyRestart } from "./restart-health-DJKnlVry.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
//#region src/cli/daemon-cli/diagnostic-readiness.ts
/** Returns undefined when the original diagnostic path owns target or authentication handling. */
async function waitForGatewayDiagnosticReadiness(opts) {
	if (!await isImplicitLocalGatewayTarget(opts)) return;
	const probeContext = opts.config ? {
		config: opts.config,
		auth: (await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: opts.config,
			mode: "local",
			explicitAuth: {
				token: opts.token,
				password: opts.password
			}
		})).auth
	} : await resolveGatewayRestartProbeContext(process.env, {
		token: opts.token,
		password: opts.password
	});
	if (!probeContext.auth?.token && !probeContext.auth?.password && probeContext.config.gateway?.auth?.mode !== "none") return;
	const port = opts.localPortOverride ?? resolveGatewayPort(probeContext.config);
	const nativeService = resolveGatewayService();
	let nativeCommand;
	return waitForGatewayHealthyRestart({
		port,
		timeoutMs: opts.timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS,
		deadlineMs: opts.deadlineMs,
		probeContext,
		probeHosts: LOOPBACK_PORT_PROBE_HOSTS,
		requirePluginHealth: false,
		onProgress: opts.onProgress,
		service: {
			readCommand: async () => null,
			readRuntime: async (env, options) => {
				const owner = readGatewayOwnerLease({
					env,
					port
				});
				if (owner?.state === "live" && (owner.mode === "foreground" || owner.supervisor?.kind === "external")) return {
					status: "running",
					pid: owner.pid
				};
				const startedAt = performance.now();
				const command = await (nativeCommand ??= nativeService.readCommand(env, options).catch(() => null));
				const serviceEnv = mergeGatewayServiceEnv(env, command);
				const servicePort = parseTcpPortFromArgs(command?.programArguments) ?? resolveGatewayPort(probeContext.config, serviceEnv);
				if (!command || servicePort !== port || resolveStateDir(serviceEnv) !== resolveStateDir(env) || resolveConfigPath(serviceEnv) !== resolveConfigPath(env)) return { status: "unknown" };
				return nativeService.readRuntime(env, {
					...options,
					...options?.timeoutMs === void 0 ? {} : { timeoutMs: Math.max(1, options.timeoutMs - (performance.now() - startedAt)) }
				});
			}
		}
	});
}
//#endregion
export { waitForGatewayDiagnosticReadiness as t };
