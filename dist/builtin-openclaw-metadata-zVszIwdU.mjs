import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-xESS3bi6.mjs";
//#region src/agents/harness/builtin-openclaw-metadata.ts
/** Shared descriptor facts; invocation and built-in identity stay with the factory. */
const BUILTIN_AGENT_HARNESS_METADATA = {
	id: "openclaw",
	label: "OpenClaw embedded agent",
	contextEngineHostCapabilities: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST.capabilities,
	supports: () => ({
		supported: true,
		priority: 0
	})
};
//#endregion
export { BUILTIN_AGENT_HARNESS_METADATA as t };
