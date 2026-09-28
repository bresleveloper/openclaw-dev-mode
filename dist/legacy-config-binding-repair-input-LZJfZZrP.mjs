import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
//#region src/commands/doctor/shared/legacy-config-binding-repair-input.ts
/** Decide whether ownership repair applies before loading channel and routing machinery. */
function resolveChannelAccountBindingRepairInput(cfg) {
	const agentIds = new Set(listAgentIds(cfg));
	const bindings = cfg.bindings === void 0 ? [] : cfg.bindings;
	if (agentIds.size < 2 || cfg.plugins?.enabled === false || !Array.isArray(bindings) || !bindings.every((binding) => isRecord(binding) && isRecord(binding.match) && typeof binding.agentId === "string" && binding.agentId.trim().length > 0 && typeof binding.match.channel === "string" && (binding.match.accountId === void 0 || typeof binding.match.accountId === "string"))) return;
	return {
		agentIds,
		bindings
	};
}
//#endregion
export { resolveChannelAccountBindingRepairInput as t };
