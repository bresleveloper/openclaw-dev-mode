import { c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { t as sanitizeTerminalText } from "./safe-text-Crz8bz-e.js";
import { h as isCliProvider } from "./model-selection-i8V2iTdL.js";
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
	if (runtime && runtime !== "auto" && runtime !== "default") return AGENT_RUNTIME_LABELS[runtime] ?? sanitizeTerminalText(runtimeRaw ?? runtime);
	const providerRaw = normalizeOptionalString(args.sessionEntry?.modelProvider) ?? normalizeOptionalString(args.sessionEntry?.providerOverride) ?? normalizeOptionalString(args.fallbackProvider);
	const provider = providerRaw ? sanitizeTerminalText(providerRaw) : void 0;
	if (provider && isCliProvider(provider, args.config)) return AGENT_RUNTIME_LABELS[normalizeOptionalLowercaseString(providerRaw) ?? ""] ?? `${provider} (cli)`;
	return AGENT_RUNTIME_LABELS.openclaw;
}
//#endregion
export { resolveAgentRuntimeLabel as t };
