import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.mjs";
import { n as pickPrimaryTailnetIPv4 } from "./tailnet-tYVaPrxr.mjs";
import { t as defaultGatewayBindMode, v as resolveGatewayRequiredListenHosts } from "./net-DU4aWKLv.mjs";
import { t as LOOPBACK_PORT_PROBE_HOSTS } from "./ports-probe-DxY7uEcU.mjs";
//#region src/daemon/service-env-merge.ts
function mergeGatewayServiceEnv(baseEnv, command) {
	if (!command?.environment) return baseEnv;
	const merged = {
		...baseEnv,
		...command.environment
	};
	for (const key of [
		"DBUS_SESSION_BUS_ADDRESS",
		"XDG_RUNTIME_DIR",
		"USER",
		"LOGNAME",
		"SUDO_USER"
	]) if (Object.hasOwn(baseEnv, key)) merged[key] = baseEnv[key];
	else delete merged[key];
	for (const key of [
		"OPENCLAW_LAUNCHD_LABEL",
		"OPENCLAW_SYSTEMD_UNIT",
		"OPENCLAW_WINDOWS_TASK_NAME"
	]) {
		const value = baseEnv[key]?.trim();
		if (value) merged[key] = value;
	}
	return merged;
}
//#endregion
//#region src/daemon/gateway-service-probe-hosts.ts
async function resolveGatewayServiceProbeHosts(params) {
	const mergedEnv = mergeGatewayServiceEnv(params.env ?? process.env, params.command ?? null);
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
export { mergeGatewayServiceEnv as n, resolveGatewayServiceProbeHosts as t };
