import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { i as listRouteBindings, t as isRouteBinding } from "./bindings-CI-O7TMQ.mjs";
import { t as describeBinding } from "./agents.binding-format-BRYI5aWJ.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { r as requireValidConfigForWrite, t as requireValidConfig } from "./config-validation-CdWq9kXm.mjs";
//#region src/commands/agents.commands.bind.ts
const loadAgentBindingsModule = createLazyPromise(() => import("./agents.bindings-Btwv91fl.mjs"));
function hasAgent(cfg, agentId) {
	const targetAgentId = normalizeAgentId(agentId);
	const agents = listAgentEntries(cfg);
	if (agents.length === 0) return targetAgentId === normalizeAgentId(resolveDefaultAgentId(cfg));
	return agents.some((agent) => normalizeAgentId(agent.id) === targetAgentId);
}
function formatBindingOwnerLine(binding) {
	return `${normalizeAgentId(binding.agentId)} <- ${describeBinding(binding)}`;
}
function failAgentBinding(message) {
	throw new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
function resolveTargetAgentId(params) {
	const normalized = params.agentInput === void 0 ? null : normalizeAgentIdStrict(params.agentInput);
	if (normalized && !normalized.ok) failAgentBinding(`Agent "${params.agentInput}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	const agentId = normalized?.value ?? resolveDefaultAgentId(params.cfg);
	if (!hasAgent(params.cfg, agentId)) failAgentBinding(`Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`);
	return agentId;
}
function formatBindingConflicts(conflicts) {
	return conflicts.map((conflict) => `${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`);
}
async function resolveParsedBindings(params) {
	const specs = normalizeStringEntries(params.bindValues);
	if (specs.length === 0) failAgentBinding(params.emptyMessage);
	const { parseBindingSpecs } = await loadAgentBindingsModule();
	const parsed = parseBindingSpecs({
		agentId: params.agentId,
		specs,
		config: params.cfg
	});
	if (parsed.errors.length > 0) failAgentBinding(parsed.errors.join("\n"));
	return parsed.bindings;
}
function emitJsonPayload(params) {
	if (!params.json) return false;
	writeRuntimeJson(params.runtime, params.payload);
	if ((params.conflictCount ?? 0) > 0) params.runtime.exit(1);
	return true;
}
async function resolveConfigAndTargetAgentId(params) {
	const writeSnapshot = await requireValidConfigForWrite(params.runtime);
	if (!writeSnapshot) return null;
	const cfg = writeSnapshot.snapshot.sourceConfig;
	return {
		cfg,
		agentId: resolveTargetAgentId({
			cfg,
			agentInput: params.agentInput
		}),
		writeSnapshot
	};
}
/** List configured agent route bindings, optionally filtered by target agent. */
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
	runtime.log(["Routing bindings:", ...filtered.map((binding) => `- ${formatBindingOwnerLine(binding)}`)].join("\n"));
}
/** Add route bindings for an agent and fail when another agent already owns the route. */
async function agentsBindCommand(opts, runtime = defaultRuntime) {
	const resolved = await resolveConfigAndTargetAgentId({
		runtime,
		agentInput: opts.agent
	});
	if (!resolved) return;
	const { cfg, agentId, writeSnapshot } = resolved;
	const bindings = await resolveParsedBindings({
		cfg,
		agentId,
		bindValues: opts.bind,
		emptyMessage: "Provide at least one --bind <channel[:accountId]>."
	});
	const { applyAgentBindings } = await loadAgentBindingsModule();
	const result = applyAgentBindings(cfg, bindings);
	if (result.added.length > 0 || result.updated.length > 0) {
		await replaceConfigFile({
			sourceConfig: result.config,
			...writeSnapshot
		});
		if (!opts.json) logConfigUpdated(runtime);
	}
	const payload = {
		agentId,
		added: result.added.map(describeBinding),
		updated: result.updated.map(describeBinding),
		skipped: result.skipped.map(describeBinding),
		conflicts: formatBindingConflicts(result.conflicts)
	};
	if (emitJsonPayload({
		runtime,
		json: opts.json,
		payload,
		conflictCount: result.conflicts.length
	})) return;
	if (result.added.length > 0) {
		runtime.log("Added bindings:");
		for (const binding of result.added) runtime.log(`- ${describeBinding(binding)}`);
	} else if (result.updated.length === 0) runtime.log("No new bindings added.");
	if (result.updated.length > 0) {
		runtime.log("Updated bindings:");
		for (const binding of result.updated) runtime.log(`- ${describeBinding(binding)}`);
	}
	if (result.skipped.length > 0) {
		runtime.log("Already present:");
		for (const binding of result.skipped) runtime.log(`- ${describeBinding(binding)}`);
	}
	if (result.conflicts.length > 0) {
		runtime.error("Skipped bindings already claimed by another agent:");
		for (const conflict of result.conflicts) runtime.error(`- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`);
		runtime.exit(1);
	}
}
/** Remove selected route bindings, or all bindings owned by an agent with `--all`. */
async function agentsUnbindCommand(opts, runtime = defaultRuntime) {
	const resolved = await resolveConfigAndTargetAgentId({
		runtime,
		agentInput: opts.agent
	});
	if (!resolved) return;
	const { cfg, agentId, writeSnapshot } = resolved;
	if (opts.all && (opts.bind?.length ?? 0) > 0) failAgentBinding("Use either --all or --bind, not both.");
	if (opts.all) {
		const existing = listRouteBindings(cfg);
		const removed = existing.filter((binding) => normalizeAgentId(binding.agentId) === agentId);
		const keptRoutes = existing.filter((binding) => normalizeAgentId(binding.agentId) !== agentId);
		const nonRoutes = (cfg.bindings ?? []).filter((binding) => !isRouteBinding(binding));
		if (removed.length === 0) {
			if (emitJsonPayload({
				runtime,
				json: opts.json,
				payload: {
					agentId,
					removed: [],
					missing: [],
					conflicts: []
				}
			})) return;
			runtime.log(`No bindings to remove for agent "${agentId}".`);
			return;
		}
		const next = {
			...cfg,
			bindings: [...keptRoutes, ...nonRoutes].length > 0 ? [...keptRoutes, ...nonRoutes] : void 0
		};
		await replaceConfigFile({
			sourceConfig: next,
			...writeSnapshot
		});
		if (!opts.json) logConfigUpdated(runtime);
		const payload = {
			agentId,
			removed: removed.map(describeBinding),
			missing: [],
			conflicts: []
		};
		if (emitJsonPayload({
			runtime,
			json: opts.json,
			payload
		})) return;
		runtime.log(`Removed ${removed.length} binding(s) for "${agentId}".`);
		return;
	}
	const bindings = await resolveParsedBindings({
		cfg,
		agentId,
		bindValues: opts.bind,
		emptyMessage: "Provide at least one --bind <channel[:accountId]> or use --all."
	});
	const { removeAgentBindings } = await loadAgentBindingsModule();
	const result = removeAgentBindings(cfg, bindings);
	if (result.removed.length > 0) {
		await replaceConfigFile({
			sourceConfig: result.config,
			...writeSnapshot
		});
		if (!opts.json) logConfigUpdated(runtime);
	}
	const payload = {
		agentId,
		removed: result.removed.map(describeBinding),
		missing: result.missing.map(describeBinding),
		conflicts: formatBindingConflicts(result.conflicts)
	};
	if (emitJsonPayload({
		runtime,
		json: opts.json,
		payload,
		conflictCount: result.conflicts.length
	})) return;
	if (result.removed.length > 0) {
		runtime.log("Removed bindings:");
		for (const binding of result.removed) runtime.log(`- ${describeBinding(binding)}`);
	} else runtime.log("No bindings removed.");
	if (result.missing.length > 0) {
		runtime.log("Not found:");
		for (const binding of result.missing) runtime.log(`- ${describeBinding(binding)}`);
	}
	if (result.conflicts.length > 0) {
		runtime.error("Bindings are owned by another agent:");
		for (const conflict of result.conflicts) runtime.error(`- ${describeBinding(conflict.binding)} (agent=${conflict.existingAgentId})`);
		runtime.exit(1);
	}
}
//#endregion
export { agentsBindCommand, agentsBindingsCommand, agentsUnbindCommand };
