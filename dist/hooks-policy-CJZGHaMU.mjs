import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
//#region src/gateway/hooks-policy.ts
/** Resolves configured hook agent ids, or undefined when all agents are allowed. */
function resolveAllowedAgentIds(raw) {
	if (!Array.isArray(raw)) return;
	const allowed = /* @__PURE__ */ new Set();
	for (const entry of raw) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		if (trimmed === "*") return;
		allowed.add(normalizeAgentId(trimmed));
	}
	return allowed;
}
//#endregion
export { resolveAllowedAgentIds as t };
