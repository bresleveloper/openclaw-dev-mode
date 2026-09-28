import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as PLUGIN_DECLARED_SURFACE_GROUPS } from "./plugin-declared-surface-groups-CaZZpMBC.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as promptYesNo } from "./prompt-BU90Lld0.mjs";
//#region src/cli/plugin-capability-consent.ts
const CAPABILITY_GROUP_LABELS = {
	channels: "Channels",
	providers: "Providers",
	tools: "Tools",
	contracts: "Contracts",
	hooks: "Hooks",
	mcpServers: "MCP servers",
	cliCommands: "CLI commands",
	cliBackends: "CLI backends",
	skills: "Skills",
	dangerousConfigFlags: "Dangerous configuration flags"
};
function sanitizeCapabilityValues(values) {
	return values.map((value) => sanitizeTerminalText(value)).join(", ");
}
function formatPluginCapabilityConsentLines(details) {
	const lines = [`Plugin capabilities require approval: ${sanitizeTerminalText(details.name)} (${sanitizeTerminalText(details.pluginId)})${details.version ? ` @ ${sanitizeTerminalText(details.version)}` : ""}`];
	if (details.source) {
		const source = [details.source.kind, details.source.spec ?? details.source.packageName].filter((value) => Boolean(value)).map((value) => sanitizeTerminalText(value)).join(": ");
		lines.push(`Source: ${source}`);
		if (details.source.integrity) lines.push(`Integrity: ${sanitizeTerminalText(details.source.integrity)}`);
	}
	for (const group of PLUGIN_DECLARED_SURFACE_GROUPS) {
		const label = CAPABILITY_GROUP_LABELS[group];
		const values = details.declared[group];
		if (values.length > 0) lines.push(`${label}: ${sanitizeCapabilityValues(values)}`);
		const widened = details.widened?.[group];
		if (widened && widened.length > 0) lines.push(`New ${label.toLowerCase()}: ${sanitizeCapabilityValues(widened)}`);
	}
	lines.push(`Prompt injection: ${details.grants.hooks.allowPromptInjection.effective ? "allowed" : "denied"}`, `Conversation access: ${details.grants.hooks.allowConversationAccess.effective ? "allowed" : "denied"}`);
	for (const [grantGroup, values] of [["LLM", details.grants.llm], ["Subagent", details.grants.subagent]]) {
		if (!values) continue;
		for (const [grantName, value] of Object.entries(values)) {
			const rendered = Array.isArray(value) ? sanitizeCapabilityValues(value) : String(value);
			lines.push(`${grantGroup} ${grantName}: ${rendered}`);
		}
	}
	if (details.trust) {
		lines.push(`Trust: ${details.trust.disposition}`);
		if (details.trust.reasons?.length) lines.push(`Trust notes: ${sanitizeCapabilityValues(details.trust.reasons)}`);
	}
	if (details.acceptedAt) lines.push(`Previously accepted: ${sanitizeTerminalText(details.acceptedAt)}`);
	return lines;
}
/** Resolve explicit or interactive plugin capability consent at the CLI boundary. */
function resolvePluginCapabilityConsentCliOptions(params) {
	if (params.acceptCapabilities) return { onCapabilityConsent: async (details) => ({ reviewToken: details.reviewToken }) };
	if (params.allowPrompt === false || !process.stdin.isTTY || !process.stdout.isTTY) return {};
	const runtime = params.runtime ?? defaultRuntime;
	return { onCapabilityConsent: async (details) => {
		for (const line of formatPluginCapabilityConsentLines(details)) runtime.log(theme.warn(line));
		return await promptYesNo(`Accept these capabilities and ${params.action} "${sanitizeTerminalText(details.pluginId)}"?`) ? { reviewToken: details.reviewToken } : void 0;
	} };
}
//#endregion
export { resolvePluginCapabilityConsentCliOptions as n, formatPluginCapabilityConsentLines as t };
