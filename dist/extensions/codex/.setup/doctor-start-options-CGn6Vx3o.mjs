import { p as readCodexPluginConfig } from "./config-parsing-BugaRTEy.mjs";
import { d as resolveManagedCodexAppServerStartOptions, o as isManagedCodexDesktopCommand } from "./managed-binary-ARII6CR1.mjs";
import { o as resolveCodexAppServerStartOptionsForAgent } from "./config-options-ZyoXdPOW.mjs";
import "./config-B-xRmWRi.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-DUl8J_Uu.mjs";
import { listAgentIds, resolveAgentDir } from "openclaw/plugin-sdk/agent-scope-runtime";
import { resolveDefaultModelForAgent } from "openclaw/plugin-sdk/agent-runtime";
import { resolveEffectiveAgentRuntime } from "openclaw/plugin-sdk/command-auth-native";
// extensions/codex/src/doctor-start-options.ts
/** Selects the same local agent or passive-catalog command for both Doctor probes. */
async function resolveCodexDoctorStartOptions(params) {
	const pluginConfig = readCodexPluginConfig(params.cfg.plugins?.entries?.codex?.config);
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
		candidates.push(resolveCodexAppServerStartOptionsForAgent({
			startOptions: start,
			agentDir: resolveAgentDir(params.cfg, agentId, params.env),
			env: params.env
		}));
	}
	if (params.cfg.plugins?.entries?.codex?.enabled === true && pluginConfig.sessionCatalog?.enabled !== false) candidates.push({
		...start,
		managedCommandOrder: "package-only"
	});
	for (const candidate of candidates) {
		const resolved = await resolveManagedCodexAppServerStartOptions(candidate, {
			pluginRoot: params.pluginRoot,
			preferInstalled: false
		});
		if (!isManagedCodexDesktopCommand(resolved.command)) return {
			status: "selected",
			start: resolved
		};
	}
	return {
		status: "skipped",
		reason: candidates.length ? "Only desktop-owned Codex commands are configured." : "No local Codex runtime is configured."
	};
}
export { resolveCodexDoctorStartOptions as t };
