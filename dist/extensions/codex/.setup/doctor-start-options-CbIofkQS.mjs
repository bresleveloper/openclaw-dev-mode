import { d as readCodexPluginConfig } from "./config-parsing-DsWSCPHO.mjs";
import { a as resolveCodexAppServerStartOptionsForAgent } from "./config-options-l737cwJB.mjs";
import { a as isManagedCodexDesktopCommand, u as resolveManagedCodexAppServerStartOptions } from "./managed-binary-CN7ii1MZ.mjs";
import "./config-DEC5R1wk.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-Be4ZqerX.mjs";
import { listAgentIds, resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveDefaultModelForAgent } from "openclaw/plugin-sdk/agent-runtime";
import { resolveEffectiveAgentRuntime } from "openclaw/plugin-sdk/command-auth-native";
//#region extensions/codex/src/doctor-start-options.ts
/** Selects the same local agent or passive-catalog command for both Doctor probes. */
async function resolveCodexDoctorStartOptions(params) {
	const pluginConfig = params.cfg.plugins?.entries?.codex?.config;
	const start = resolveCodexAppServerRuntimeOptions({
		pluginConfig,
		env: params.env
	}).start;
	if (start.transport !== "stdio") return {
		status: "skipped",
		reason: "Codex uses a remote app-server transport."
	};
	if (params.managedOnly && start.commandSource !== "managed") return {
		status: "skipped",
		reason: "Codex uses a custom app-server command."
	};
	const resolveAgentStartOptions = params.deps?.resolveAgentStartOptions ?? resolveCodexAppServerStartOptionsForAgent;
	const resolveStartOptions = params.deps?.resolveStartOptions ?? resolveManagedCodexAppServerStartOptions;
	const isDesktopCommand = params.deps?.isDesktopCommand ?? isManagedCodexDesktopCommand;
	const candidates = [];
	for (const agentId of listAgentIds(params.cfg)) {
		const model = resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId
		});
		if (resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider: model.provider,
			modelId: model.model,
			agentId
		}) !== "codex") continue;
		candidates.push(resolveAgentStartOptions({
			startOptions: start,
			agentDir: resolveAgentDir(params.cfg, agentId, params.env),
			env: params.env
		}));
	}
	if (params.cfg.plugins?.entries?.codex?.enabled === true && readCodexPluginConfig(pluginConfig).sessionCatalog?.enabled !== false) candidates.push({
		...start,
		managedCommandOrder: "package-only"
	});
	for (const candidate of candidates) {
		const resolved = await resolveStartOptions(candidate, {
			pluginRoot: params.pluginRoot,
			preferInstalled: false
		});
		if (!isDesktopCommand(resolved.command)) return {
			status: "selected",
			start: resolved
		};
	}
	return {
		status: "skipped",
		reason: candidates.length ? "Only desktop-owned Codex commands are configured." : "No local Codex runtime is configured."
	};
}
//#endregion
export { resolveCodexDoctorStartOptions as t };
