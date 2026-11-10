import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import "./agent-runtime-id-BZLMe-UU.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { n as hasConfiguredGatewayAuthSecretInput } from "./auth-config-utils-BW1BkpUK.mjs";
import { a as resolvePairingGatewayUrl, i as resolveConfiguredPairingPublicUrl, t as PAIRING_GATEWAY_LOOPBACK_ERROR } from "./setup-code-CNtEQo_X.mjs";
import os from "node:os";
//#region src/commands/doctor-node-hosting-preconditions.ts
const CHECK_ID = "core/doctor/node-hosting-preconditions";
function usesIdentityHeadersWithoutMachineCredentials(cfg) {
	return !hasConfiguredGatewayAuthSecretInput(cfg, "gateway.auth.token") && !hasConfiguredGatewayAuthSecretInput(cfg, "gateway.auth.password") && (cfg.gateway?.auth?.mode === "trusted-proxy" || cfg.gateway?.tailscale?.mode === "serve" && cfg.gateway?.auth?.mode !== "password" && cfg.gateway?.auth?.mode !== "none" && cfg.gateway?.auth?.allowTailscale !== false);
}
function hasConfiguredNodeHosting(cfg) {
	const nodes = cfg.gateway?.nodes;
	const execConfigs = [cfg.tools?.exec, ...Object.values(cfg.agents?.entries ?? {}).map((agent) => agent.tools?.exec)];
	return Boolean(cfg.plugins?.entries?.["device-pair"]?.enabled === true || resolveConfiguredPairingPublicUrl(cfg) || nodes?.browser?.mode !== "off" && nodes?.browser?.node?.trim() || nodes?.pairing?.autoApproveCidrs?.length || nodes?.pairing?.sshVerify || nodes?.commands?.allow?.length || execConfigs.some((exec) => exec?.host === "node" || (exec?.host ?? cfg.tools?.exec?.host ?? "auto") === "auto" && exec?.node?.trim()));
}
function lacksNodeOnboardingPlugin(cfg) {
	return !resolveEffectiveEnableState({
		id: "device-pair",
		origin: "bundled",
		config: normalizePluginsConfig(cfg.plugins),
		rootConfig: cfg,
		enabledByDefault: true
	}).enabled;
}
function lacksDeviceCapableRuntimeRoute(cfg) {
	const registry = getActivePluginRegistry();
	return listAgentIds(cfg).every((agentId) => {
		const model = resolveDefaultModelForAgent({
			cfg,
			agentId
		});
		const runtime = resolveEffectiveAgentRuntime({
			cfg,
			provider: model.provider,
			modelId: model.model,
			agentId
		});
		if (runtime === "openclaw") return false;
		const harness = registry?.agentHarnesses.find((entry) => entry.harness.id === runtime)?.harness;
		return harness !== void 0 && harness.cloudPlacement?.devicePlacement === void 0;
	});
}
/** Collects config-only warnings for node authentication, onboarding, and worker ingress. */
async function collectNodeHostingPreconditionFindings(cfg) {
	if (cfg.gateway?.mode === "remote" || !hasConfiguredNodeHosting(cfg)) return [];
	const findings = [];
	const warn = (finding) => findings.push({
		checkId: CHECK_ID,
		severity: "warning",
		...finding
	});
	if (lacksNodeOnboardingPlugin(cfg)) warn({
		message: "The device-pair plugin is not enabled; node onboarding join codes and openclaw connect are unavailable.",
		path: "plugins.entries.device-pair.enabled",
		requirement: "node-onboarding-plugin",
		fixHint: "Set plugins.entries.device-pair.enabled: true, check that device-pair is not denied or excluded by plugins.allow, then restart the Gateway."
	});
	if (lacksDeviceCapableRuntimeRoute(cfg)) warn({
		message: "No configured agent/model route resolves to a runtime that supports paired-device placement.",
		path: "agents",
		requirement: "device-session-runtime",
		fixHint: "Select an agent/model route whose runtime supports paired-device placement, then check that its plugin is enabled and its required node commands are explicitly allowed. Runtime policy is model/provider-scoped; whole-agent runtime keys are ignored. For a multi-agent roster, set agents.ownership: \"explicit\"."
	});
	if (usesIdentityHeadersWithoutMachineCredentials(cfg)) warn({
		message: "Gateway identity-header auth has no configured token/password path for machine clients; new node hosts cannot authenticate or become worker hosts.",
		path: "gateway.auth",
		requirement: "machine-client-auth",
		fixHint: "Switch gateway.auth.mode to token and configure gateway.auth.token as a SecretRef so machine clients can authenticate as devices. Keep trusted-proxy only if machine clients use a clean loopback/direct gateway.auth.password path. For Access-fronted gateways, configure the node gateway.cloudflareAccess.clientId / clientSecret SecretInputs or set CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET before openclaw connect."
	});
	const bind = cfg.gateway?.bind ?? "loopback";
	if ((bind === "loopback" || bind === "auto") && (await resolvePairingGatewayUrl(cfg, {
		env: process.env,
		publicUrl: resolveConfiguredPairingPublicUrl(cfg),
		networkInterfaces: os.networkInterfaces
	})).error === "Gateway is only bound to loopback. Set gateway.publicOrigin to your public HTTPS origin, configure plugins.entries.device-pair.config.publicUrl, enable tailscale serve, or set gateway.bind=lan.") warn({
		message: PAIRING_GATEWAY_LOOPBACK_ERROR,
		path: "gateway.bind",
		requirement: "node-onboarding-url",
		fixHint: "If an edge proxy fronts node onboarding, allow /j/* and /__openclaw__/worker without edge identity auth, and preserve WebSocket upgrade on /__openclaw__/worker. Both routes enforce their own credentials."
	});
	return findings;
}
//#endregion
export { collectNodeHostingPreconditionFindings };
