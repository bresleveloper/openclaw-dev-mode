import { t as isContainerEnvironment } from "./container-environment-e2wGNmXf.mjs";
import { n as pickPrimaryTailnetIPv4 } from "./tailnet-CMDED3Fa.mjs";
import { t as defaultGatewayBindMode, v as resolveGatewayRequiredListenHosts } from "./net-C6WEu3pd.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-DMGtt9dg.mjs";
import { t as mergeGatewayServiceEnv } from "./service-env-merge-BU8q8IlG.mjs";
//#region src/daemon/gateway-service-probe-hosts.ts
async function resolveGatewayServiceProbeHosts(params) {
	const baseEnv = params.env ?? process.env;
	const mergedEnv = mergeGatewayServiceEnv(baseEnv, params.command ?? null);
	const { createConfigIO } = await import("./io.runtime.js");
	const cfg = await createConfigIO({
		env: mergedEnv,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => ({}));
	const bindMode = cfg.gateway?.bind ?? defaultGatewayBindMode(cfg.gateway?.tailscale?.mode ?? "off");
	const bindHost = bindMode === "lan" ? "0.0.0.0" : bindMode === "custom" ? cfg.gateway?.customBindHost?.trim() || "0.0.0.0" : bindMode === "tailnet" ? pickPrimaryTailnetIPv4() ?? LOOPBACK_PORT_PROBE_HOSTS[0] : bindMode === "auto" && isContainerEnvironment() ? "0.0.0.0" : LOOPBACK_PORT_PROBE_HOSTS[0];
	return resolveGatewayRequiredListenHosts(bindHost);
}
//#endregion
export { resolveGatewayServiceProbeHosts as t };
