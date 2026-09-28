import { v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as inspectTailscaleServeGatewayUrlsWithRunner } from "./tailscale-status-Dr51G8r4.mjs";
//#region src/commands/doctor-tailscale.ts
function result(config, warnings = []) {
	return {
		config,
		changes: [],
		warnings
	};
}
async function prepareTailscaleConfigMigration(params) {
	const config = params.cfg;
	const gateway = config.gateway;
	const managed = (gateway?.tailscale?.mode ?? "off") !== "off";
	if (gateway?.tailscale?.mode === "serve" && gateway.tailscale.preserveFunnel) return result(config);
	if (!gateway || gateway.mode === "remote" || !managed && gateway.bind !== "lan") return result(config);
	const gatewayPort = resolveGatewayPort(config, params.env ?? process.env);
	const runCommandWithTimeout = params.runCommandWithTimeout ?? ((argv, options) => runUtf8CommandWithTimeout(argv, {
		...options,
		maxOutputBytes: 4e5
	}));
	const inspection = await inspectTailscaleServeGatewayUrlsWithRunner(gatewayPort, runCommandWithTimeout, managed);
	if (inspection.status === "unavailable") return result(config);
	if (inspection.status === "invalid") return result(config, ["Tailscale Serve status could not be parsed, so legacy Serve configuration was not changed. Review `tailscale serve status --json`, then rerun Doctor."]);
	if (inspection.urls.length === 0) return result(config);
	if (managed) return result(config, inspection.urls.some((url) => !new URL(url).port) ? ["The predecessor Tailscale route will be adopted from a previous OpenClaw release when the Gateway starts."] : []);
	return result(config, [`Legacy Tailscale Serve still targets Gateway port ${gatewayPort}, but Doctor cannot prove that OpenClaw owns the existing route; configuration was not changed. If you confirm the route belongs to the current Tailscale hostname and is stale from an older OpenClaw release, remove only its root handler with ${inspection.urls.map((url) => `\`tailscale serve --yes --https=${new URL(url).port || "443"} --set-path=/ off\``).join(" or ")}, then configure gateway.bind="loopback" and gateway.tailscale.mode="serve" manually and restart the Gateway. If another service owns the route, leave managed Tailscale ingress off and configure gateway.trustedProxies for that proxy instead.`]);
}
//#endregion
export { prepareTailscaleConfigMigration };
