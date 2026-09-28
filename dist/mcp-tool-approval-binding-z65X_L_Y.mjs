import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { O as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
//#region src/infra/mcp-tool-approval-binding.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.mcpToolApprovalBindings"), () => /* @__PURE__ */ new WeakMap());
function registerMcpToolApprovalBinding(binding) {
	const owner = getActiveAgentRunDelegatedAuthority(binding.authority.operationalRunInstance);
	if (!owner || !validateAgentRunDelegatedAuthority(binding.authority)) return () => {};
	const entries = bindings.get(owner) ?? /* @__PURE__ */ new Set();
	entries.add(binding);
	bindings.set(owner, entries);
	return () => entries.delete(binding);
}
function takeMcpToolApprovalBinding(scope) {
	if (!validateAgentRunDelegatedAuthority(scope.authority)) return;
	const owner = getActiveAgentRunDelegatedAuthority(scope.authority.operationalRunInstance);
	const entries = owner && bindings.get(owner);
	const matches = [...entries ?? []].filter((entry) => entry.agentId === scope.agentId && entry.toolCallId === scope.toolCallId && entry.server === scope.server && entry.tool === scope.tool);
	if (matches.length !== 1) return;
	const binding = matches[0];
	entries.delete(binding);
	return () => {
		try {
			return validateAgentRunDelegatedAuthority(binding.authority) && binding.isActive() && validateAgentRunDelegatedAuthority(binding.authority) && validateAgentRunDelegatedAuthority(scope.authority);
		} catch {
			return false;
		}
	};
}
//#endregion
export { takeMcpToolApprovalBinding as n, registerMcpToolApprovalBinding as t };
