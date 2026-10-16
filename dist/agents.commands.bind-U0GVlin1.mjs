import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as ExpectedCliError } from "./failure-output-gtb9zaTk.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as replaceConfigFile } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { i as listRouteBindings, t as isRouteBinding } from "./bindings-Cw_QSeBA.mjs";
import { n as describeBindingConflict, t as describeBinding } from "./agents.binding-format-B08nnBYq.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import { r as requireValidConfigForWrite, t as requireValidConfig } from "./config-validation-Cf7I75MX.mjs";
//#region src/commands/agents.commands.bind.ts
const loadAgentBindingsModule = createLazyPromise(() => import("./agents.bindings-DC6mTB83.mjs"));
function hasAgent(cfg, agentId) {
	const targetAgentId = normalizeAgentId(agentId);
	const agents = listAgentEntries(cfg);
	if (agents.length === 0) return targetAgentId === normalizeAgentId(resolveDefaultAgentId(cfg));
	return agents.some((agent) => normalizeAgentId(agent.id) === targetAgentId);
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
function emitJsonPayload(runtime, json, payload) {
	if (!json) return false;
	writeRuntimeJson(runtime, payload);
	if (payload.conflicts.length > 0) runtime.exit(1);
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
		conflicts: result.conflicts.map(describeBindingConflict)
	};
	if (emitJsonPayload(runtime, opts.json, payload)) return;
	if (result.added.length === 0 && result.updated.length === 0) runtime.log("No new bindings added.");
	for (const [heading, descriptions] of [
		["Added bindings:", payload.added],
		["Updated bindings:", payload.updated],
		["Already present:", payload.skipped]
	]) if (descriptions.length > 0) {
		runtime.log(heading);
		for (const description of descriptions) runtime.log(`- ${description}`);
	}
	if (result.conflicts.length > 0) {
		runtime.error("Skipped bindings already claimed by another agent:");
		for (const conflict of payload.conflicts) runtime.error(`- ${conflict}`);
		runtime.exit(1);
	}
}
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
		if (removed.length > 0) {
			const keptRoutes = existing.filter((binding) => normalizeAgentId(binding.agentId) !== agentId);
			const nonRoutes = (cfg.bindings ?? []).filter((binding) => !isRouteBinding(binding));
			const remaining = [...keptRoutes, ...nonRoutes];
			await replaceConfigFile({
				sourceConfig: {
					...cfg,
					bindings: remaining.length > 0 ? remaining : void 0
				},
				...writeSnapshot
			});
			if (!opts.json) logConfigUpdated(runtime);
		}
		const payload = {
			agentId,
			removed: removed.map(describeBinding),
			missing: [],
			conflicts: []
		};
		if (emitJsonPayload(runtime, opts.json, payload)) return;
		runtime.log(removed.length > 0 ? `Removed ${removed.length} binding(s) for "${agentId}".` : `No bindings to remove for agent "${agentId}".`);
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
		conflicts: result.conflicts.map(describeBindingConflict)
	};
	if (emitJsonPayload(runtime, opts.json, payload)) return;
	if (result.removed.length === 0) runtime.log("No bindings removed.");
	for (const [heading, descriptions] of [["Removed bindings:", payload.removed], ["Not found:", payload.missing]]) if (descriptions.length > 0) {
		runtime.log(heading);
		for (const description of descriptions) runtime.log(`- ${description}`);
	}
	if (result.conflicts.length > 0) {
		runtime.error("Bindings are owned by another agent:");
		for (const conflict of payload.conflicts) runtime.error(`- ${conflict}`);
		runtime.exit(1);
	}
}
//#endregion
export { agentsBindCommand, agentsBindingsCommand, agentsUnbindCommand };
