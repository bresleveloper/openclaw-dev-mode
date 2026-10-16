import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { n as inspectTailscaleBackendStateWithRunner, r as inspectTailscaleServeGatewayUrlsWithRunner } from "./tailscale-status-BA6JQcBe.mjs";
//#region src/commands/doctor-tailscale.ts
/** A prerequisite finding, not authority to enable Tailscale or change exposure. */
async function inspectDoctorTailscalePrerequisite(cfg) {
	const mode = cfg.gateway?.tailscale?.mode;
	if (cfg.gateway?.mode === "remote" || mode !== "serve" && mode !== "funnel") return;
	const inspection = await inspectTailscaleBackendStateWithRunner((argv, options) => runUtf8CommandWithTimeout(argv, {
		...options,
		maxOutputBytes: 4e5
	}));
	const prerequisite = `Gateway startup requires a running Tailscale backend because gateway.tailscale.mode="${mode}".`;
	if (inspection.status !== "ok") return `${prerequisite} Tailscale status ${inspection.status === "invalid" ? "could not be parsed" : "is unavailable"}. Verify that the Tailscale CLI is installed and the local Tailscale service is running with \`tailscale status --json\`, then rerun Doctor before restarting the Gateway.`;
	switch (inspection.state) {
		case "Running": return;
		case "Stopped": return `${prerequisite} Tailscale is stopped. Reconnect in the Tailscale app or run \`tailscale up\`, then verify \`tailscale status --json\` reports Running before restarting the Gateway.`;
		case "NeedsLogin": return `${prerequisite} Tailscale is logged out. Sign in through the Tailscale app or \`tailscale login\`, then verify \`tailscale status --json\` reports Running before restarting the Gateway.`;
		case "NeedsMachineAuth": return `${prerequisite} This machine needs tailnet administrator approval. Approve it in the Tailscale admin console, then verify \`tailscale status --json\` reports Running before restarting the Gateway.`;
		case "NoState":
		case "Starting": return `${prerequisite} The Tailscale backend is still starting. Wait for \`tailscale status --json\` to report Running before restarting the Gateway.`;
		default: return `${prerequisite} Tailscale did not report a running backend. Inspect \`tailscale status --json\` and resolve its backend state before restarting the Gateway.`;
	}
}
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
export { inspectDoctorTailscalePrerequisite, prepareTailscaleConfigMigration };
