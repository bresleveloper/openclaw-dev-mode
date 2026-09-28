import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { s as isCliProvider } from "./model-selection-CFnUi6iD.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-CQ6tTBOH.mjs";
//#region src/status/agent-runtime-label.ts
const AGENT_RUNTIME_LABELS = {
	openclaw: "OpenClaw Default",
	codex: "OpenAI Codex",
	"codex-cli": "OpenAI Codex",
	"claude-cli": "Claude CLI",
	"google-gemini-cli": "Gemini CLI"
};
function resolveAgentRuntimeLabel(args) {
	const acpAgentRaw = normalizeOptionalString(args.sessionEntry?.acp?.agent);
	const acpAgent = acpAgentRaw ? sanitizeTerminalText(acpAgentRaw) : void 0;
	if (acpAgent) {
		const backendRaw = normalizeOptionalString(args.sessionEntry?.acp?.backend);
		const backend = backendRaw ? sanitizeTerminalText(backendRaw) : void 0;
		return backend ? `${acpAgent} (acp/${backend})` : `${acpAgent} (acp)`;
	}
	const runtimeRaw = normalizeOptionalString(args.resolvedHarness);
	const runtime = normalizeOptionalLowercaseString(runtimeRaw);
	let label;
	if (runtime && runtime !== "auto" && runtime !== "default") label = AGENT_RUNTIME_LABELS[runtime] ?? sanitizeTerminalText(runtimeRaw ?? runtime);
	else {
		const providerRaw = normalizeOptionalString(args.sessionEntry?.modelProvider) ?? normalizeOptionalString(args.sessionEntry?.providerOverride) ?? normalizeOptionalString(args.fallbackProvider);
		const provider = providerRaw ? sanitizeTerminalText(providerRaw) : void 0;
		const providerRuntime = normalizeOptionalLowercaseString(providerRaw);
		if (provider && (args.classifyCliProvider?.(provider) ?? isCliProvider(provider, args.config))) label = AGENT_RUNTIME_LABELS[providerRuntime ?? ""] ?? `${provider} (cli)`;
		else label = expectDefined(AGENT_RUNTIME_LABELS.openclaw, "OpenClaw runtime label");
	}
	const recordedRuntime = normalizeOptionalAgentRuntimeId(args.sessionEntry?.agentHarnessId);
	const recordedLabel = recordedRuntime ? AGENT_RUNTIME_LABELS[recordedRuntime] ?? sanitizeTerminalText(recordedRuntime) : void 0;
	if (!recordedRuntime || isDefaultAgentRuntimeId(recordedRuntime) || recordedLabel === label) return label;
	const relationship = resolveSessionPinnedHarnessId(args.sessionEntry) ? "session pin" : "previous runtime";
	return `${label} (${relationship}: ${recordedLabel})`;
}
//#endregion
export { resolveAgentRuntimeLabel as t };
