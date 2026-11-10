import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
//#region src/cli/error-format.ts
const DEFAULT_GATEWAY_PORT_EXAMPLE = 18789;
function formatInlineCliCommand(command) {
	return `\`${formatCliCommand(command)}\``;
}
function formatPortRangeHint() {
	return `Use a port number from 1 to 65535, for example ${DEFAULT_GATEWAY_PORT_EXAMPLE}.`;
}
function formatInvalidPortOption(option) {
	return `Invalid ${option}. ${formatPortRangeHint()}`;
}
function formatInvalidConfigPort(path) {
	return `Invalid ${path} in config. Set ${path} to a number from 1 to 65535, or pass --port ${DEFAULT_GATEWAY_PORT_EXAMPLE}.`;
}
function formatUnknownChannelMessage(params) {
	return `Unknown channel "${params.channel}". Run ${formatInlineCliCommand("openclaw channels list --all")} to see configured and installable channels.`;
}
function formatUnsupportedChannelActionMessage(params) {
	const inspectCommand = params.inspectCommand ?? `openclaw channels capabilities --channel ${params.channel}`;
	return `Channel "${params.channel}" does not support ${params.action}. Run ${formatInlineCliCommand(inspectCommand)} to inspect supported actions.`;
}
function formatStrictJsonParseFailure(params) {
	const cause = (params.cause instanceof Error ? params.cause.message : String(params.cause)).trim().replace(/[.。]+$/u, "");
	const preview = params.value.length > 48 ? `${truncateUtf16Safe(params.value, 45).trimEnd()}...` : params.value;
	return [
		`Could not parse ${JSON.stringify(preview)} as JSON for --strict-json.`,
		`${cause}.`,
		`Use valid JSON. For structured changes, use a JSON5 config patch object file with ${formatInlineCliCommand("openclaw config patch --file <path> --dry-run")}.`,
		"For plain strings, omit --strict-json."
	].join(" ");
}
function formatGatewayCommandFailure(params) {
	const message = (params.error instanceof Error ? params.error.message : String(params.error)).replace(/\s*Run [`"]?openclaw doctor[`"]? for diagnostics\.?/gi, "").replace(/\s+Gateway target:\s+.*$/isu, "").replace(/\s+/g, " ").trim().replace(/[.。]+$/u, "");
	const detail = message ? `: ${message}` : "";
	return `Could not ${params.action} because the Gateway did not respond${detail}. Run ${formatInlineCliCommand("openclaw gateway status --deep")} to inspect the active Gateway.`;
}
function formatLookupMiss(params) {
	const valueLabel = params.valueLabel ?? params.noun.toLowerCase();
	return `${params.noun} not found: ${params.value}. Run ${formatInlineCliCommand(params.listCommand)} to see recent ${valueLabel}s.`;
}
function formatMissingPluginMessage(params) {
	const listCommand = params.listCommand ?? "openclaw plugins list";
	const searchHint = params.includeSearch ? `, or ${formatInlineCliCommand("openclaw plugins search " + params.id)} to look for installable plugins` : "";
	return `Plugin not found: ${params.id}. Run ${formatInlineCliCommand(listCommand)} to see installed plugins${searchHint}.`;
}
//#endregion
export { formatMissingPluginMessage as a, formatUnknownChannelMessage as c, formatLookupMiss as i, formatUnsupportedChannelActionMessage as l, formatInvalidConfigPort as n, formatPortRangeHint as o, formatInvalidPortOption as r, formatStrictJsonParseFailure as s, formatGatewayCommandFailure as t };
