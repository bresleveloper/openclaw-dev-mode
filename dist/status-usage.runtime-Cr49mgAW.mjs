import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as resolveAgentDir, m as resolveConfiguredAgentId, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-92B-lj2w.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-Rdb47msF.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as resolveModelAuthLabel } from "./model-auth-label-Ch2WjZIZ.mjs";
import { i as shouldUseCodexSyntheticUsageForRuntime, n as mergeUsageSummaries, r as resolveUsageCredentialType, t as buildCodexSyntheticUsageAuth } from "./codex-synthetic-usage-Cr12F2QM.mjs";
import { n as resolveStatusGatewayProbeTimeoutMs } from "./status.gateway-probe-budget-CGuGR8Uw.mjs";
//#region src/commands/status-usage.runtime.ts
const providerUsageLoader = createLazyImportLoader(() => import("./provider-usage-B5qbhDuE.mjs"));
function shouldUseConfiguredCodexSyntheticUsage(params) {
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
	const authLabel = resolveModelAuthLabel({
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
	const { loadProviderUsageSummary } = await providerUsageLoader.load();
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
	if (!shouldUseConfiguredCodexSyntheticUsage({
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
