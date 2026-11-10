import { d as normalizeStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { o as writeRuntimeJson, r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { l as resolveAgentOperationAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { r as replaceConfigFile } from "./mutate-h3hU3xe4.mjs";
import "./config-B3oiWDlr.mjs";
import { i as listRouteBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { u as throwExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { r as logConfigUpdated } from "./logging-CTh_T0q8.mjs";
import { r as requireValidConfigForWrite, t as requireValidConfig } from "./config-validation-CHn1iJgM.mjs";
import { n as describeBindingConflict, t as describeBinding } from "./agents.binding-format-B08nnBYq.mjs";
//#region src/commands/agents.commands.bind.ts
function resolveTargetAgentId(params) {
	const normalized = params.agentInput === void 0 ? null : normalizeAgentIdStrict(params.agentInput);
	if (normalized && !normalized.ok) throwExpectedCliError(`Agent "${params.agentInput}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	const agentId = normalized?.value ?? resolveAgentOperationAgentId(params.cfg);
	if (!listAgentIds(params.cfg).includes(agentId)) throwExpectedCliError(`Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	return agentId;
}
async function resolveParsedBindings(params) {
	const specs = normalizeStringEntries(params.bindValues);
	if (specs.length === 0) throwExpectedCliError(params.emptyMessage);
	const { parseBindingSpecs } = await import("./agents.bindings-B1LBWVTK.mjs");
	const parsed = parseBindingSpecs({
		agentId: params.agentId,
		specs,
		config: params.cfg
	});
	if (parsed.errors.length > 0) throwExpectedCliError(parsed.errors.join("\n"));
	return parsed.bindings;
}
async function agentsBindingsCommand(opts, runtime = defaultRuntime) {
	const cfg = await requireValidConfig(runtime, { skipPluginValidation: true });
	if (!cfg) return;
	const filterAgentId = opts.agent === void 0 ? void 0 : resolveTargetAgentId({
		cfg,
		agentInput: opts.agent
	});
	const filtered = listRouteBindings(cfg).filter((binding) => !filterAgentId || normalizeAgentId(binding.agentId) === filterAgentId);
	if (opts.json) {
		writeRuntimeJson(runtime, filtered.map((binding) => ({
			agentId: normalizeAgentId(binding.agentId),
			match: binding.match,
			description: describeBinding(binding)
		})));
		return;
	}
	if (filtered.length === 0) {
		runtime.log(filterAgentId ? `No routing bindings for agent "${filterAgentId}".` : "No routing bindings.");
		return;
	}
	runtime.log(["Routing bindings:", ...filtered.map((binding) => `- ${normalizeAgentId(binding.agentId)} <- ${describeBinding(binding)}`)].join("\n"));
}
async function agentsUpdateBindingsCommand(operation, opts, runtime = defaultRuntime) {
	const writeSnapshot = await requireValidConfigForWrite(runtime);
	if (!writeSnapshot) return;
	const cfg = writeSnapshot.snapshot.sourceConfig;
	const agentId = resolveTargetAgentId({
		cfg,
		agentInput: opts.agent
	});
	if (operation === "unbind" && opts.all && (opts.bind?.length ?? 0) > 0) throwExpectedCliError("Use either --all or --bind, not both.");
	const removeAll = operation === "unbind" && opts.all;
	const binding = operation === "bind";
	let result;
	if (removeAll) {
		const existing = listRouteBindings(cfg);
		const removed = existing.filter((entry) => normalizeAgentId(entry.agentId) === agentId);
		const remaining = [...existing.filter((entry) => normalizeAgentId(entry.agentId) !== agentId), ...(cfg.bindings ?? []).filter((entry) => !isRouteBinding(entry))];
		result = {
			config: {
				...cfg,
				bindings: remaining.length > 0 ? remaining : void 0
			},
			removed,
			missing: [],
			conflicts: []
		};
	} else {
		const bindings = await resolveParsedBindings({
			cfg,
			agentId,
			bindValues: opts.bind,
			emptyMessage: binding ? "Provide at least one --bind <channel[:accountId]>." : "Provide at least one --bind <channel[:accountId]> or use --all."
		});
		const { applyAgentBindings, removeAgentBindings } = await import("./agents.bindings-B1LBWVTK.mjs");
		result = binding ? applyAgentBindings(cfg, bindings) : removeAgentBindings(cfg, bindings);
	}
	const changed = "added" in result ? result.added.length > 0 || result.updated.length > 0 : result.removed.length > 0;
	if (changed) {
		await replaceConfigFile({
			sourceConfig: result.config,
			...writeSnapshot
		});
		if (!opts.json) logConfigUpdated(runtime);
	}
	const payload = {
		agentId,
		..."added" in result ? {
			added: result.added.map(describeBinding),
			updated: result.updated.map(describeBinding),
			skipped: result.skipped.map(describeBinding)
		} : {
			removed: result.removed.map(describeBinding),
			missing: result.missing.map(describeBinding)
		},
		conflicts: result.conflicts.map(describeBindingConflict)
	};
	if (opts.json) {
		writeRuntimeJson(runtime, payload);
		if (payload.conflicts.length > 0) runtime.exit(1);
		return;
	}
	if (removeAll && "removed" in payload) {
		runtime.log(payload.removed.length > 0 ? `Removed ${payload.removed.length} binding(s) for "${agentId}".` : `No bindings to remove for agent "${agentId}".`);
		return;
	}
	if (!changed) runtime.log(binding ? "No new bindings added." : "No bindings removed.");
	const sections = "added" in payload ? [
		["Added bindings:", payload.added],
		["Updated bindings:", payload.updated],
		["Already present:", payload.skipped]
	] : [["Removed bindings:", payload.removed], ["Not found:", payload.missing]];
	for (const [heading, descriptions] of sections) if (descriptions.length > 0) {
		runtime.log(heading);
		for (const description of descriptions) runtime.log(`- ${description}`);
	}
	if (payload.conflicts.length > 0) {
		runtime.error(binding ? "Skipped bindings already claimed by another agent:" : "Bindings are owned by another agent:");
		for (const conflict of payload.conflicts) runtime.error(`- ${conflict}`);
		runtime.exit(1);
	}
}
//#endregion
export { agentsBindingsCommand, agentsUpdateBindingsCommand };
