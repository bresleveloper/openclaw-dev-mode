import { a as resolveAgentsApiNativeToolPolicy, i as resolveAgentsApiEnvironment, n as agentsApiConfigSchema, r as requireAgentsApiSessionFingerprint } from "./config-gtw8-BMW.mjs";
import { t as AgentsApiClient } from "./agentsapi-client-DzhjNWzN.mjs";
import { i as resolveAgentsApiSessionAccessError } from "./agentsapi-errors-C5phEUd2.mjs";
import { t as buildAgentsApiMcpTools } from "./agentsapi-mcp-BBxWgvQu.mjs";
import { createHash } from "node:crypto";
//#region extensions/agentsapi/agentsapi-binding-migration.ts
/** The binding owner calls this once, under its lease, before admitting legacy state. */
async function migrateAgentsApiBinding(binding, params, readPluginConfig, assertCurrent) {
	const assertMigrationCurrent = () => {
		assertCurrent();
		params.abortSignal?.throwIfAborted();
	};
	assertMigrationCurrent();
	const config = agentsApiConfigSchema.parse(readPluginConfig() ?? {});
	if (!config.forwarding.gatewayTools || !config.forwarding.mcpServers) throw new Error("Agents API legacy binding cannot adopt forwarding restrictions; restore the original configuration and API key and retry, or reset the OpenClaw session to settle the saved native session with a currently authorized key. The saved binding has been retained.");
	const environment = resolveAgentsApiEnvironment(config, params.workspaceDir);
	const { webSearchEnabled } = resolveAgentsApiNativeToolPolicy(params, config);
	const mcpTools = await buildAgentsApiMcpTools(params);
	assertMigrationCurrent();
	const identity = [
		params.model.id,
		params.resolvedApiKey,
		...environment.type === "self_hosted" || environment.network != null ? [environment] : [],
		...mcpTools.length ? [mcpTools] : []
	];
	const fingerprint = createHash("sha256").update(JSON.stringify(identity)).digest("hex");
	if (binding.authFingerprint !== fingerprint || !webSearchEnabled || environment.type === "self_hosted" && config.executorController) throw new Error("Agents API legacy binding cannot verify the original model, API key, environment, MCP, or web-search policy; restore the original configuration and API key and retry, or reset the OpenClaw session to settle the saved native session with a currently authorized key. The saved binding has been retained.");
	try {
		const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, AbortSignal.timeout(3e4)]) : AbortSignal.timeout(3e4);
		const session = await new AgentsApiClient(params.resolvedApiKey, assertMigrationCurrent).session(binding.sessionId, signal);
		assertMigrationCurrent();
		if (session.id !== binding.sessionId) throw new Error("Agents API returned a different session during legacy migration");
	} catch (error) {
		throw resolveAgentsApiSessionAccessError(error, binding.sessionId);
	}
	return {
		sessionId: binding.sessionId,
		configFingerprint: requireAgentsApiSessionFingerprint({
			model: params.model.id,
			environment,
			mcpTools,
			webSearchEnabled,
			forwarding: config.forwarding
		})
	};
}
//#endregion
export { migrateAgentsApiBinding as t };
