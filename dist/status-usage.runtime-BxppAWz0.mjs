import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveAgentDir, h as resolveConfiguredAgentId, m as resolveAmbientOwnerAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-Bm7d8DH8.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { n as resolveModelAuthLabelAsync } from "./model-auth-label-Ds3jL8Jm.mjs";
import { i as shouldUseCodexSyntheticUsageForRuntime, n as mergeUsageSummaries, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-DCAKKwoG.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
//#region src/commands/status-usage.runtime.ts
async function shouldUseConfiguredCodexSyntheticUsage(params) {
	const configuredDefault = resolveDefaultModelForAgent({
		cfg: params.config,
		agentId: params.agentId,
		allowPluginNormalization: false
	});
	const policy = resolveAgentHarnessPolicy({
		config: params.config,
		agentId: params.agentId,
		provider: configuredDefault.provider,
		modelId: configuredDefault.model
	});
	if (!shouldUseCodexSyntheticUsageForRuntime({
		provider: configuredDefault.provider,
		effectiveHarness: policy.runtime
	})) return false;
	const authLabel = await resolveModelAuthLabelAsync({
		provider: configuredDefault.provider,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: configuredDefault.provider,
			harnessRuntime: policy.runtime,
			config: params.config
		}),
		cfg: params.config,
		agentDir: params.agentDir,
		includeExternalProfiles: false
	});
	return resolveUsageCredentialType(authLabel) !== "api_key";
}
/** Loads provider usage for status output from an explicit or ambient system-agent scope. */
async function resolveStatusUsageSummary(params) {
	const { loadProviderUsageSummary } = await import("./provider-usage-BNy8z9Ms.mjs");
	const rawAgentId = params.agentId?.trim();
	if (params.agentId !== void 0 && !rawAgentId) throw new Error("--agent must not be blank");
	const agentId = rawAgentId ? normalizeAgentId(rawAgentId) : void 0;
	if (agentId) resolveConfiguredAgentId(params.config, agentId);
	let resolvedAgentId = agentId;
	let agentDir = params.agentDir;
	if (!agentDir) {
		resolvedAgentId ??= resolveAmbientOwnerAgentId(params.config, void 0, {
			surface: "status usage credentials",
			hint: "Set agents.defaults.systemAgent.agentId."
		});
		agentDir = resolveAgentDir(params.config, resolvedAgentId);
	}
	const usage = await loadProviderUsageSummary({
		timeoutMs: resolveStatusGatewayProbeTimeoutMs(params),
		config: params.config,
		agentDir
	});
	if (!await shouldUseConfiguredCodexSyntheticUsage({
		config: params.config,
		agentDir,
		agentId: resolvedAgentId
	})) return usage;
	const codexUsage = await loadProviderUsageSummary({
		timeoutMs: resolveStatusGatewayProbeTimeoutMs(params),
		providers: ["openai"],
		auth: [buildCodexSyntheticUsageAuth()],
		config: params.config,
		agentDir
	});
	return mergeUsageSummaries(usage, codexUsage);
}
//#endregion
export { resolveStatusUsageSummary };
