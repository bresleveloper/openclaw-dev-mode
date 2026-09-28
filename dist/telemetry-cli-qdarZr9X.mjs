import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { o as transformConfigFileWithRetry } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.mjs";
import { i as resolveTelemetryStatus, n as buildTelemetryUserAgent, t as buildTelemetryPayload } from "./telemetry-zaPKARP_.mjs";
//#region src/cli/telemetry-cli.ts
const TELEMETRY_REASON_LABELS = {
	enabled: "enabled in configuration",
	"automated-environment": "disabled in an automated environment (CI is set)",
	"do-not-track": "disabled by DO_NOT_TRACK",
	"config-disabled": "disabled in configuration",
	"never-asked": "consent has not been requested",
	"update-disabled": "update checks are disabled"
};
async function showTelemetry(options) {
	const config = getRuntimeConfig({ skipPluginValidation: true });
	const telemetry = await resolveTelemetryStatus(config);
	const request = telemetry.reason === "update-disabled" || telemetry.reason === "automated-environment" ? null : {
		method: telemetry.enabled ? "POST" : "GET",
		userAgent: buildTelemetryUserAgent("gateway"),
		...telemetry.enabled ? { payload: await buildTelemetryPayload(config, { surface: "gateway" }) } : {}
	};
	if (options.json) {
		defaultRuntime.writeJson({
			featureStatsEnabled: telemetry.enabled,
			reason: telemetry.reason,
			endpoint: telemetry.endpoint,
			lastPingAt: telemetry.lastPingAt ? new Date(telemetry.lastPingAt).toISOString() : null,
			request
		}, 0);
		return;
	}
	defaultRuntime.log(`Feature stats: ${telemetry.enabled ? "enabled" : "disabled"}`);
	defaultRuntime.log(`Reason: ${TELEMETRY_REASON_LABELS[telemetry.reason]}`);
	defaultRuntime.log(`Endpoint: ${telemetry.endpoint}`);
	defaultRuntime.log(`Last ping: ${telemetry.lastPingAt ? new Date(telemetry.lastPingAt).toISOString() : "never"}`);
	if (!request) {
		defaultRuntime.log(`Request: none (${TELEMETRY_REASON_LABELS[telemetry.reason]})`);
		return;
	}
	defaultRuntime.log(`Request: ${request.method} ${telemetry.endpoint}`);
	defaultRuntime.log(`User-Agent: ${request.userAgent}`);
	if (request.payload) {
		defaultRuntime.log("Payload:");
		defaultRuntime.log(JSON.stringify(request.payload));
	}
}
async function setTelemetryEnabled(enabled) {
	await transformConfigFileWithRetry({ transform: (config) => ({ nextConfig: {
		...config,
		telemetry: {
			...config.telemetry,
			enabled,
			consentedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	} }) });
	defaultRuntime.log(`Anonymous feature stats ${enabled ? "enabled" : "disabled"}.`);
}
function registerTelemetryCli(program) {
	const telemetry = program.command("telemetry").description("Inspect and manage anonymous usage telemetry");
	telemetry.command("show").description("Preview the daily update request from this CLI process").option("--json", "Print the request and payload as JSON").action(async (options) => runCommandWithRuntime(defaultRuntime, () => showTelemetry(options)));
	for (const [name, enabled] of Object.entries({
		on: true,
		off: false
	})) telemetry.command(name).description(`${enabled ? "Enable" : "Disable"} anonymous feature statistics`).action(() => runCommandWithRuntime(defaultRuntime, () => setTelemetryEnabled(enabled)));
	applyParentDefaultHelpAction(telemetry.helpCommand(true));
}
//#endregion
export { registerTelemetryCli };
