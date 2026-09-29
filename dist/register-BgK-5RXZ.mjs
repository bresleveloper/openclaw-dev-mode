import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { d as resolveExecModePolicy } from "./exec-approvals-core-BZ3ECkXD.mjs";
import { a as splitSandboxBindSpec } from "./host-paths-drWtkcBg.mjs";
import { c as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-C7iYNiP7.mjs";
import { l as readExecApprovalsSnapshot } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { o as resolveAgentRoute } from "./resolve-route-zfKT6ZcU.mjs";
import "./routing-JKvWkBDR.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
import { o as registerHealthCheck, r as getHealthCheck } from "./health-check-registry-AvzmSJIz.mjs";
import "./health-D76gHMJp.mjs";
import "./exec-approvals-runtime-DbIWGUdS.mjs";
import "./channel-secret-basic-runtime-jo9e3YPL.mjs";
import { h as toolPolicy } from "./agent-harness-runtime-k4x7zJ-U.mjs";
import { basename, isAbsolute, resolve } from "node:path";
import { createHash } from "node:crypto";
import JSON5 from "json5";
//#region extensions/policy/src/doctor/check-ids.ts
const CHECK_IDS = {
	policyAttestationMismatch: "policy/attestation-hash-mismatch",
	policyDeniedChannelProvider: "policy/channels-denied-provider",
	policyHashMismatch: "policy/policy-hash-mismatch",
	policyInvalidFile: "policy/policy-jsonc-invalid",
	policyMissingFile: "policy/policy-jsonc-missing",
	policyUnmigratedToolsFile: "policy/tools-md-migration-required",
	policyDeniedMcpServer: "policy/mcp-denied-server",
	policyUnapprovedMcpServer: "policy/mcp-unapproved-server",
	policyDeniedModelProvider: "policy/models-denied-provider",
	policyUnapprovedModelProvider: "policy/models-unapproved-provider",
	policyPrivateNetworkAccess: "policy/network-private-access-enabled",
	policyRoutingBindingsRequired: "policy/routing-bindings-required",
	policyRoutingBindingChannelUnconfigured: "policy/routing-binding-channel-unconfigured",
	policyRoutingAgentMismatch: "policy/routing-agent-mismatch",
	policyRoutingMatchKindMismatch: "policy/routing-match-kind-mismatch",
	policyIngressDmPolicyUnapproved: "policy/ingress-dm-policy-unapproved",
	policyIngressDmScopeUnapproved: "policy/ingress-dm-scope-unapproved",
	policyIngressOpenGroupsDenied: "policy/ingress-open-groups-denied",
	policyIngressGroupMentionRequired: "policy/ingress-group-mention-required",
	policyGatewayNonLoopbackBind: "policy/gateway-non-loopback-bind",
	policyGatewayAuthDisabled: "policy/gateway-auth-disabled",
	policyGatewayRateLimitMissing: "policy/gateway-rate-limit-missing",
	policyGatewayControlUiInsecure: "policy/gateway-control-ui-insecure",
	policyGatewayTailscaleFunnel: "policy/gateway-tailscale-funnel",
	policyGatewayRemoteEnabled: "policy/gateway-remote-enabled",
	policyGatewayHttpEndpointEnabled: "policy/gateway-http-endpoint-enabled",
	policyGatewayHttpUrlFetchUnrestricted: "policy/gateway-http-url-fetch-unrestricted",
	policyGatewayNodeCommandDenied: "policy/gateway-node-command-denied",
	policyAgentsWorkspaceAccessDenied: "policy/agents-workspace-access-denied",
	policyAgentsToolNotDenied: "policy/agents-tool-not-denied",
	policyToolsElevatedEnabled: "policy/tools-elevated-enabled",
	policyToolsAlsoAllowMissing: "policy/tools-also-allow-missing",
	policyToolsAlsoAllowUnexpected: "policy/tools-also-allow-unexpected",
	policyToolsExecAskUnapproved: "policy/tools-exec-ask-unapproved",
	policyToolsExecHostUnapproved: "policy/tools-exec-host-unapproved",
	policyToolsExecSecurityUnapproved: "policy/tools-exec-security-unapproved",
	policyToolsFsWorkspaceOnlyRequired: "policy/tools-fs-workspace-only-required",
	policyToolsProfileUnapproved: "policy/tools-profile-unapproved",
	policyToolsRequiredDenyMissing: "policy/tools-required-deny-missing",
	policySandboxModeUnapproved: "policy/sandbox-mode-unapproved",
	policySandboxBackendUnapproved: "policy/sandbox-backend-unapproved",
	policySandboxContainerPostureUnobservable: "policy/sandbox-container-posture-unobservable",
	policySandboxContainerHostNetworkDenied: "policy/sandbox-container-host-network-denied",
	policySandboxContainerNamespaceJoinDenied: "policy/sandbox-container-namespace-join-denied",
	policySandboxContainerMountModeRequired: "policy/sandbox-container-mount-mode-required",
	policySandboxContainerRuntimeSocketMount: "policy/sandbox-container-runtime-socket-mount",
	policySandboxContainerUnconfinedProfile: "policy/sandbox-container-unconfined-profile",
	policySandboxBrowserCdpSourceRangeMissing: "policy/sandbox-browser-cdp-source-range-missing",
	policyDataHandlingTelemetryContentCapture: "policy/data-handling-telemetry-content-capture",
	policyDataHandlingSessionRetentionNotEnforced: "policy/data-handling-session-retention-not-enforced",
	policyDataHandlingSessionTranscriptMemory: "policy/data-handling-session-transcript-memory-enabled",
	policySecretsUnmanagedProvider: "policy/secrets-unmanaged-provider",
	policySecretsDeniedProviderSource: "policy/secrets-denied-provider-source",
	policySecretsInsecureProvider: "policy/secrets-insecure-provider",
	policyAuthProfileInvalidMetadata: "policy/auth-profile-invalid-metadata",
	policyAuthProfileUnapprovedMode: "policy/auth-profile-unapproved-mode",
	policyExecApprovalsMissing: "policy/exec-approvals-missing",
	policyExecApprovalsInvalid: "policy/exec-approvals-invalid",
	policyExecApprovalsDefaultSecurityUnapproved: "policy/exec-approvals-default-security-unapproved",
	policyExecApprovalsAgentSecurityUnapproved: "policy/exec-approvals-agent-security-unapproved",
	policyExecApprovalsAutoAllowSkillsEnabled: "policy/exec-approvals-auto-allow-skills-enabled",
	policyExecApprovalsAllowlistMissing: "policy/exec-approvals-allowlist-missing",
	policyExecApprovalsAllowlistUnexpected: "policy/exec-approvals-allowlist-unexpected",
	policyMissingToolOwner: "policy/tools-missing-owner",
	policyMissingToolRisk: "policy/tools-missing-risk-level",
	policyMissingToolSensitivity: "policy/tools-missing-sensitivity-token",
	policyUnknownToolRisk: "policy/tools-unknown-risk-level",
	policyUnknownToolSensitivity: "policy/tools-unknown-sensitivity-token"
};
const POLICY_CHECK_IDS = [
	CHECK_IDS.policyMissingFile,
	CHECK_IDS.policyInvalidFile,
	CHECK_IDS.policyUnmigratedToolsFile,
	CHECK_IDS.policyHashMismatch,
	CHECK_IDS.policyAttestationMismatch,
	CHECK_IDS.policyDeniedChannelProvider,
	CHECK_IDS.policyDeniedMcpServer,
	CHECK_IDS.policyUnapprovedMcpServer,
	CHECK_IDS.policyDeniedModelProvider,
	CHECK_IDS.policyUnapprovedModelProvider,
	CHECK_IDS.policyPrivateNetworkAccess,
	CHECK_IDS.policyRoutingBindingsRequired,
	CHECK_IDS.policyRoutingBindingChannelUnconfigured,
	CHECK_IDS.policyRoutingAgentMismatch,
	CHECK_IDS.policyRoutingMatchKindMismatch,
	CHECK_IDS.policyIngressDmPolicyUnapproved,
	CHECK_IDS.policyIngressDmScopeUnapproved,
	CHECK_IDS.policyIngressOpenGroupsDenied,
	CHECK_IDS.policyIngressGroupMentionRequired,
	CHECK_IDS.policyGatewayNonLoopbackBind,
	CHECK_IDS.policyGatewayAuthDisabled,
	CHECK_IDS.policyGatewayRateLimitMissing,
	CHECK_IDS.policyGatewayControlUiInsecure,
	CHECK_IDS.policyGatewayTailscaleFunnel,
	CHECK_IDS.policyGatewayRemoteEnabled,
	CHECK_IDS.policyGatewayHttpEndpointEnabled,
	CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted,
	CHECK_IDS.policyGatewayNodeCommandDenied,
	CHECK_IDS.policyAgentsWorkspaceAccessDenied,
	CHECK_IDS.policyAgentsToolNotDenied,
	CHECK_IDS.policyToolsProfileUnapproved,
	CHECK_IDS.policyToolsFsWorkspaceOnlyRequired,
	CHECK_IDS.policyToolsExecSecurityUnapproved,
	CHECK_IDS.policyToolsExecAskUnapproved,
	CHECK_IDS.policyToolsExecHostUnapproved,
	CHECK_IDS.policyToolsElevatedEnabled,
	CHECK_IDS.policyToolsAlsoAllowMissing,
	CHECK_IDS.policyToolsAlsoAllowUnexpected,
	CHECK_IDS.policyToolsRequiredDenyMissing,
	CHECK_IDS.policySandboxModeUnapproved,
	CHECK_IDS.policySandboxBackendUnapproved,
	CHECK_IDS.policySandboxContainerPostureUnobservable,
	CHECK_IDS.policySandboxContainerHostNetworkDenied,
	CHECK_IDS.policySandboxContainerNamespaceJoinDenied,
	CHECK_IDS.policySandboxContainerMountModeRequired,
	CHECK_IDS.policySandboxContainerRuntimeSocketMount,
	CHECK_IDS.policySandboxContainerUnconfinedProfile,
	CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing,
	CHECK_IDS.policyDataHandlingTelemetryContentCapture,
	CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced,
	CHECK_IDS.policyDataHandlingSessionTranscriptMemory,
	CHECK_IDS.policySecretsUnmanagedProvider,
	CHECK_IDS.policySecretsDeniedProviderSource,
	CHECK_IDS.policySecretsInsecureProvider,
	CHECK_IDS.policyAuthProfileInvalidMetadata,
	CHECK_IDS.policyAuthProfileUnapprovedMode,
	CHECK_IDS.policyExecApprovalsMissing,
	CHECK_IDS.policyExecApprovalsInvalid,
	CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved,
	CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved,
	CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled,
	CHECK_IDS.policyExecApprovalsAllowlistMissing,
	CHECK_IDS.policyExecApprovalsAllowlistUnexpected,
	CHECK_IDS.policyMissingToolRisk,
	CHECK_IDS.policyUnknownToolRisk,
	CHECK_IDS.policyMissingToolSensitivity,
	CHECK_IDS.policyMissingToolOwner,
	CHECK_IDS.policyUnknownToolSensitivity
];
//#endregion
//#region extensions/policy/src/exec-approvals-uri.ts
const EXEC_APPROVALS_POLICY_URI = "oc://exec-approvals.json";
const EXEC_APPROVALS_POLICY_DOCUMENT_NAME = EXEC_APPROVALS_POLICY_URI.slice(5);
function execApprovalsPolicyUri(relativePath) {
	return relativePath ? `${EXEC_APPROVALS_POLICY_URI}/${relativePath}` : EXEC_APPROVALS_POLICY_URI;
}
//#endregion
//#region extensions/policy/src/doctor/fix-metadata.ts
const m = (checkId, fixClass, summary, options = {}) => ({
	checkId,
	fixClass,
	summary,
	...options
});
const POLICY_FIX_METADATA = [
	m(CHECK_IDS.policyMissingFile, "manual", "Restore or author the approved policy artifact."),
	m(CHECK_IDS.policyInvalidFile, "manual", "Repair the policy JSONC syntax or schema."),
	m(CHECK_IDS.policyUnmigratedToolsFile, "manual", "Run openclaw doctor --fix to migrate governed tool declarations into AGENTS.md.", { policyPath: ["tools", "requireMetadata"] }),
	m(CHECK_IDS.policyHashMismatch, "manual", "Restore the approved artifact or update the expected hash after review.", { configTargets: ["plugins.entries.policy.config.expectedHash"] }),
	m(CHECK_IDS.policyAttestationMismatch, "manual", "Review the current attestation and update accepted hashes after approval.", { configTargets: ["plugins.entries.policy.config.expectedAttestationHash"] }),
	m(CHECK_IDS.policyDeniedChannelProvider, "automatic", "Disable product-managed channels matching the denied provider.", {
		policyPath: ["channels", "denyRules"],
		configTargets: ["channels"]
	}),
	m(CHECK_IDS.policyDeniedMcpServer, "reviewRequired", "Remove or disable the denied MCP server.", {
		policyPath: [
			"mcp",
			"servers",
			"deny"
		],
		configTargets: ["mcp.servers"]
	}),
	m(CHECK_IDS.policyUnapprovedMcpServer, "reviewRequired", "Remove the unapproved MCP server or select an approved replacement.", {
		policyPath: [
			"mcp",
			"servers",
			"allow"
		],
		configTargets: ["mcp.servers"]
	}),
	m(CHECK_IDS.policyDeniedModelProvider, "reviewRequired", "Remove the model provider or switch references to an approved provider.", {
		policyPath: [
			"models",
			"providers",
			"deny"
		],
		configTargets: ["models"]
	}),
	m(CHECK_IDS.policyUnapprovedModelProvider, "reviewRequired", "Select an approved model provider.", {
		policyPath: [
			"models",
			"providers",
			"allow"
		],
		configTargets: ["models"]
	}),
	m(CHECK_IDS.policyPrivateNetworkAccess, "reviewRequired", "Disable the concrete private-network access opt-in.", {
		policyPath: [
			"network",
			"privateNetwork",
			"allow"
		],
		configTargets: ["network"]
	}),
	m(CHECK_IDS.policyRoutingBindingsRequired, "reviewRequired", "Add an intentional channel route binding or revise the policy after review.", {
		policyPath: ["routing", "requireBindings"],
		configTargets: ["bindings"]
	}),
	m(CHECK_IDS.policyRoutingBindingChannelUnconfigured, "reviewRequired", "Correct the binding channel or configure the intended channel after review.", {
		policyPath: ["routing", "requireConfiguredChannels"],
		configTargets: ["bindings", "channels"]
	}),
	m(CHECK_IDS.policyRoutingAgentMismatch, "reviewRequired", "Review binding precedence and the expected agent before changing message delivery.", {
		policyPath: ["routing", "probes"],
		configTargets: ["bindings"]
	}),
	m(CHECK_IDS.policyRoutingMatchKindMismatch, "reviewRequired", "Restore the intended binding specificity or approve the new match kind.", {
		policyPath: ["routing", "probes"],
		configTargets: ["bindings"]
	}),
	m(CHECK_IDS.policyIngressDmPolicyUnapproved, "reviewRequired", "Set channel DM policy to an allowed value.", {
		policyPath: [
			"ingress",
			"channels",
			"allowDmPolicies"
		],
		configTargets: ["channels"]
	}),
	m(CHECK_IDS.policyIngressDmScopeUnapproved, "reviewRequired", "Move session DM scope to the required or stricter ordered value.", {
		policyPath: [
			"ingress",
			"session",
			"requireDmScope"
		],
		configTargets: ["ingress"]
	}),
	m(CHECK_IDS.policyIngressOpenGroupsDenied, "automatic", "Disable product-managed open group ingress.", {
		policyPath: [
			"ingress",
			"channels",
			"denyOpenGroups"
		],
		configTargets: ["channels"]
	}),
	m(CHECK_IDS.policyIngressGroupMentionRequired, "automatic", "Require mention in product-managed group channels.", {
		policyPath: [
			"ingress",
			"channels",
			"requireMentionInGroups"
		],
		configTargets: ["channels"]
	}),
	m(CHECK_IDS.policyGatewayNonLoopbackBind, "reviewRequired", "Set gateway bind address to loopback when remote exposure is not intended.", {
		policyPath: [
			"gateway",
			"exposure",
			"allowNonLoopbackBind"
		],
		configTargets: ["gateway.bind"]
	}),
	m(CHECK_IDS.policyGatewayAuthDisabled, "manual", "Configure token, password, or trusted-proxy auth.", {
		policyPath: [
			"gateway",
			"auth",
			"requireAuth"
		],
		configTargets: ["gateway.auth"]
	}),
	m(CHECK_IDS.policyGatewayRateLimitMissing, "reviewRequired", "Add explicit gateway auth rate limits from product defaults.", {
		policyPath: [
			"gateway",
			"auth",
			"requireExplicitRateLimit"
		],
		configTargets: ["gateway.auth.rateLimit"]
	}),
	m(CHECK_IDS.policyGatewayControlUiInsecure, "automatic", "Disable the insecure Control UI toggle.", {
		policyPath: [
			"gateway",
			"controlUi",
			"allowInsecure"
		],
		configTargets: ["gateway.controlUi"]
	}),
	m(CHECK_IDS.policyGatewayTailscaleFunnel, "reviewRequired", "Disable Tailscale funnel or serve exposure.", {
		policyPath: [
			"gateway",
			"exposure",
			"allowTailscaleFunnel"
		],
		configTargets: ["tailscale"]
	}),
	m(CHECK_IDS.policyGatewayRemoteEnabled, "automatic", "Disable product-managed remote gateway mode.", {
		policyPath: [
			"gateway",
			"remote",
			"allow"
		],
		configTargets: ["gateway.remote"]
	}),
	m(CHECK_IDS.policyGatewayHttpEndpointEnabled, "automatic", "Disable denied Gateway HTTP endpoints.", {
		policyPath: [
			"gateway",
			"http",
			"denyEndpoints"
		],
		configTargets: ["gateway.http"]
	}),
	m(CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted, "manual", "Add URL allowlists for each URL-fetch input.", {
		policyPath: [
			"gateway",
			"http",
			"requireUrlAllowlists"
		],
		configTargets: ["gateway.http"]
	}),
	m(CHECK_IDS.policyGatewayNodeCommandDenied, "reviewRequired", "Add the command to gateway node denyCommands or update policy after review.", {
		policyPath: [
			"gateway",
			"nodes",
			"denyCommands"
		],
		configTargets: ["gateway.nodes.commands.deny"]
	}),
	m(CHECK_IDS.policyAgentsWorkspaceAccessDenied, "reviewRequired", "Set agent workspace access to an allowed mode.", {
		policyPath: [
			"agents",
			"workspace",
			"allowedAccess"
		],
		configTargets: ["agents"]
	}),
	m(CHECK_IDS.policyAgentsToolNotDenied, "automatic", "Merge required built-in workspace tool denies.", {
		policyPath: [
			"agents",
			"workspace",
			"denyTools"
		],
		configTargets: ["agents"]
	}),
	m(CHECK_IDS.policyToolsProfileUnapproved, "reviewRequired", "Set the tool profile to an allowed profile.", {
		policyPath: [
			"tools",
			"profiles",
			"allow"
		],
		configTargets: ["tools.profile"]
	}),
	m(CHECK_IDS.policyToolsFsWorkspaceOnlyRequired, "reviewRequired", "Set workspace-only filesystem posture when required assets remain readable.", {
		policyPath: [
			"tools",
			"fs",
			"requireWorkspaceOnly"
		],
		configTargets: ["tools.fs.workspaceOnly"]
	}),
	m(CHECK_IDS.policyToolsExecSecurityUnapproved, "reviewRequired", "Set exec security to an allowed value.", {
		policyPath: [
			"tools",
			"exec",
			"allowSecurity"
		],
		configTargets: ["tools.exec.security"]
	}),
	m(CHECK_IDS.policyToolsExecAskUnapproved, "reviewRequired", "Set exec ask mode to an allowed value.", {
		policyPath: [
			"tools",
			"exec",
			"requireAsk"
		],
		configTargets: ["tools.exec.ask"]
	}),
	m(CHECK_IDS.policyToolsExecHostUnapproved, "reviewRequired", "Move exec host to an allowed host mode.", {
		policyPath: [
			"tools",
			"exec",
			"allowHosts"
		],
		configTargets: ["tools.exec.host"]
	}),
	m(CHECK_IDS.policyToolsElevatedEnabled, "automatic", "Set tools elevated mode to disabled.", {
		policyPath: [
			"tools",
			"elevated",
			"allow"
		],
		configTargets: ["tools.elevated.enabled"]
	}),
	m(CHECK_IDS.policyToolsAlsoAllowMissing, "reviewRequired", "Add expected alsoAllow entries only when policy intentionally grants them.", {
		policyPath: [
			"tools",
			"alsoAllow",
			"expected"
		],
		configTargets: ["tools.alsoAllow"]
	}),
	m(CHECK_IDS.policyToolsAlsoAllowUnexpected, "reviewRequired", "Remove unexpected alsoAllow entries.", {
		policyPath: [
			"tools",
			"alsoAllow",
			"expected"
		],
		configTargets: ["tools.alsoAllow"]
	}),
	m(CHECK_IDS.policyToolsRequiredDenyMissing, "automatic", "Merge required built-in deny tool classes.", {
		policyPath: ["tools", "denyTools"],
		configTargets: ["tools.deny", "agents.entries.<id>.tools.deny"]
	}),
	m(CHECK_IDS.policySandboxModeUnapproved, "reviewRequired", "Set sandbox mode to an allowed value.", {
		policyPath: ["sandbox", "requireMode"],
		configTargets: ["sandbox.mode"]
	}),
	m(CHECK_IDS.policySandboxBackendUnapproved, "reviewRequired", "Choose an approved sandbox backend that is installed.", {
		policyPath: ["sandbox", "allowBackends"],
		configTargets: ["sandbox.backend"]
	}),
	m(CHECK_IDS.policySandboxContainerPostureUnobservable, "unsupported", "Add observable container posture evidence before patching."),
	m(CHECK_IDS.policySandboxContainerHostNetworkDenied, "reviewRequired", "Disable container host networking.", {
		policyPath: [
			"sandbox",
			"containers",
			"denyHostNetwork"
		],
		configTargets: ["sandbox.containers"]
	}),
	m(CHECK_IDS.policySandboxContainerNamespaceJoinDenied, "reviewRequired", "Disable joining container namespaces.", {
		policyPath: [
			"sandbox",
			"containers",
			"denyContainerNamespaceJoin"
		],
		configTargets: ["sandbox.containers"]
	}),
	m(CHECK_IDS.policySandboxContainerMountModeRequired, "reviewRequired", "Change required mounts to read-only.", {
		policyPath: [
			"sandbox",
			"containers",
			"requireReadOnlyMounts"
		],
		configTargets: ["sandbox.containers"]
	}),
	m(CHECK_IDS.policySandboxContainerRuntimeSocketMount, "reviewRequired", "Remove container runtime socket binds.", {
		policyPath: [
			"sandbox",
			"containers",
			"denyContainerRuntimeSocketMounts"
		],
		configTargets: ["sandbox.containers"]
	}),
	m(CHECK_IDS.policySandboxContainerUnconfinedProfile, "reviewRequired", "Remove unconfined container profiles.", {
		policyPath: [
			"sandbox",
			"containers",
			"denyUnconfinedProfiles"
		],
		configTargets: ["sandbox.containers"]
	}),
	m(CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing, "manual", "Add an explicit browser CDP source range.", {
		policyPath: [
			"sandbox",
			"browser",
			"requireCdpSourceRange"
		],
		configTargets: ["agents.sandbox.browser"]
	}),
	m(CHECK_IDS.policyDataHandlingTelemetryContentCapture, "automatic", "Disable telemetry content capture.", {
		policyPath: [
			"dataHandling",
			"telemetry",
			"denyContentCapture"
		],
		configTargets: ["diagnostics.otel.captureContent"]
	}),
	m(CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced, "reviewRequired", "Set session maintenance to enforced mode.", {
		policyPath: [
			"dataHandling",
			"retention",
			"requireSessionMaintenance"
		],
		configTargets: ["session.maintenance.mode"]
	}),
	m(CHECK_IDS.policyDataHandlingSessionTranscriptMemory, "reviewRequired", "Disable transcript indexing for the affected agent scope.", {
		policyPath: [
			"dataHandling",
			"memory",
			"denySessionTranscriptIndexing"
		],
		configTargets: ["memory"]
	}),
	m(CHECK_IDS.policySecretsUnmanagedProvider, "manual", "Migrate the secret to a managed provider.", {
		policyPath: ["secrets", "requireManagedProviders"],
		configTargets: ["secrets"]
	}),
	m(CHECK_IDS.policySecretsDeniedProviderSource, "reviewRequired", "Move the secret out of the denied source.", {
		policyPath: ["secrets", "denySources"],
		configTargets: ["secrets"]
	}),
	m(CHECK_IDS.policySecretsInsecureProvider, "reviewRequired", "Remove insecure provider overrides.", {
		policyPath: ["secrets", "allowInsecureProviders"],
		configTargets: ["secrets"]
	}),
	m(CHECK_IDS.policyAuthProfileInvalidMetadata, "manual", "Add required provider and mode metadata to auth profiles.", {
		policyPath: [
			"auth",
			"profiles",
			"requireMetadata"
		],
		configTargets: ["auth.profiles"]
	}),
	m(CHECK_IDS.policyAuthProfileUnapprovedMode, "manual", "Change auth mode and credentials through the auth owner flow.", {
		policyPath: [
			"auth",
			"profiles",
			"allowModes"
		],
		configTargets: ["auth.profiles"]
	}),
	m(CHECK_IDS.policyExecApprovalsMissing, "manual", "Restore an attributable exec-approvals evidence file.", {
		policyPath: ["execApprovals", "requireFile"],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyExecApprovalsInvalid, "manual", "Repair the exec approvals evidence artifact."),
	m(CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved, "manual", "Update reviewed default approval evidence or policy.", {
		policyPath: [
			"execApprovals",
			"defaults",
			"allowSecurity"
		],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved, "manual", "Update reviewed agent approval evidence or policy.", {
		policyPath: [
			"execApprovals",
			"agents",
			"allowSecurity"
		],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled, "reviewRequired", "Disable auto-allow skills in the approval owner surface.", {
		policyPath: [
			"execApprovals",
			"agents",
			"allowAutoAllowSkills"
		],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyExecApprovalsAllowlistMissing, "manual", "Add expected approval patterns through approval review.", {
		policyPath: [
			"execApprovals",
			"agents",
			"allowlist",
			"expected"
		],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyExecApprovalsAllowlistUnexpected, "manual", "Remove unexpected approval patterns through approval review.", {
		policyPath: [
			"execApprovals",
			"agents",
			"allowlist",
			"expected"
		],
		configTargets: [EXEC_APPROVALS_POLICY_DOCUMENT_NAME]
	}),
	m(CHECK_IDS.policyMissingToolRisk, "manual", "Add tool risk metadata in the owning tool declaration.", {
		policyPath: ["tools", "requireMetadata"],
		configTargets: ["tools"]
	}),
	m(CHECK_IDS.policyUnknownToolRisk, "manual", "Use a supported tool risk level.", {
		policyPath: ["tools", "requireMetadata"],
		configTargets: ["tools"]
	}),
	m(CHECK_IDS.policyMissingToolSensitivity, "manual", "Add tool sensitivity metadata in the owning tool declaration.", {
		policyPath: ["tools", "requireMetadata"],
		configTargets: ["tools"]
	}),
	m(CHECK_IDS.policyMissingToolOwner, "manual", "Add owner metadata in the owning tool declaration.", {
		policyPath: ["tools", "requireMetadata"],
		configTargets: ["tools"]
	}),
	m(CHECK_IDS.policyUnknownToolSensitivity, "manual", "Use a supported tool sensitivity token.", {
		policyPath: ["tools", "requireMetadata"],
		configTargets: ["tools"]
	})
];
const POLICY_FIX_METADATA_BY_CHECK_ID = new Map(POLICY_FIX_METADATA.map((rule) => [rule.checkId, rule]));
//#endregion
//#region extensions/policy/src/doctor/automatic-repairs.ts
const AUTOMATIC_REPAIR_CHECK_IDS = /* @__PURE__ */ new Set([
	CHECK_IDS.policyAgentsToolNotDenied,
	CHECK_IDS.policyToolsElevatedEnabled,
	CHECK_IDS.policyToolsRequiredDenyMissing,
	CHECK_IDS.policyGatewayControlUiInsecure,
	CHECK_IDS.policyGatewayHttpEndpointEnabled,
	CHECK_IDS.policyGatewayRemoteEnabled,
	CHECK_IDS.policyIngressOpenGroupsDenied,
	CHECK_IDS.policyIngressGroupMentionRequired,
	CHECK_IDS.policyDataHandlingTelemetryContentCapture
]);
function repairPolicyAutomaticNarrower(ctx, findings, checkId) {
	if (!workspaceRepairsEnabled$1(ctx)) return Promise.resolve(workspaceRepairsDisabledResult$1());
	if (!AUTOMATIC_REPAIR_CHECK_IDS.has(checkId)) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not an automatic narrowing repair",
		changes: []
	});
	if (findings.length === 0 || findings.some((finding) => finding.checkId !== checkId || POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId)?.fixClass !== "automatic")) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not classified as automatic",
		changes: []
	});
	const patch = applyAutomaticPatch(ctx.cfg, findings, checkId);
	if (patch.changes.length === 0) return Promise.resolve({
		status: "skipped",
		reason: "policy automatic repair had no config changes to apply",
		changes: [],
		...patch.warnings !== void 0 ? { warnings: patch.warnings } : {}
	});
	return Promise.resolve({
		status: "repaired",
		config: patch.config,
		changes: patch.changes,
		...patch.warnings !== void 0 ? { warnings: patch.warnings } : {}
	});
}
function applyAutomaticPatch(cfg, findings, checkId) {
	switch (checkId) {
		case CHECK_IDS.policyAgentsToolNotDenied: return mergeRequiredDenyTools(cfg, findings);
		case CHECK_IDS.policyToolsElevatedEnabled:
			if (hasScopedPolicyRequirement(findings)) return skippedUnsafeScopedRepair(cfg, "Skipped scoped tools repair. Scoped elevated-tools policy findings are detect-only because automatic repair cannot safely choose between shared and agent-local config targets.");
			return disableElevatedTools(cfg, findings);
		case CHECK_IDS.policyToolsRequiredDenyMissing: return mergeRequiredDenyTools(cfg, findings);
		case CHECK_IDS.policyGatewayControlUiInsecure: return disableInsecureControlUi(cfg, findings);
		case CHECK_IDS.policyGatewayHttpEndpointEnabled: return setFindingConfigValues(cfg, findings, "enabled", false);
		case CHECK_IDS.policyGatewayRemoteEnabled: return disableRemoteGatewayMode(cfg, findings);
		case CHECK_IDS.policyIngressOpenGroupsDenied: return setFindingConfigValues(cfg, findings, "groupPolicy", "allowlist");
		case CHECK_IDS.policyIngressGroupMentionRequired: return setFindingConfigValues(cfg, findings, "requireMention", true);
		case CHECK_IDS.policyDataHandlingTelemetryContentCapture:
			if (hasScopedPolicyRequirement(findings)) return skippedUnsafeScopedRepair(cfg, "Skipped scoped data-handling repair. The finding reports shared telemetry config, so changing it would affect more than the scoped policy target.");
			return disableTelemetryContentCapture(cfg);
		default: return {
			config: cfg,
			changes: []
		};
	}
}
function mergeRequiredDenyTools(cfg, findings) {
	const next = cloneConfig(cfg);
	const changes = [];
	const warnings = [];
	for (const finding of findings) {
		const tool = missingRequiredTool(finding);
		if (tool === void 0 || finding.ocPath === void 0) continue;
		if (hasScopedPolicyRequirement([finding]) && finding.ocPath === "oc://openclaw.config/tools/deny") {
			warnings.push(`Skipped scoped deny repair for ${tool}. The finding reports inherited root tools.deny, so changing it would affect more than the scoped policy target.`);
			continue;
		}
		if (mergeStringArrayAtOcPath(next, finding.ocPath, tool)) changes.push(`Added ${tool} to ${configPathLabel(finding.ocPath)} for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes: uniqueStrings(changes),
		warnings
	} : {
		config: cfg,
		changes,
		warnings: uniqueStrings(warnings)
	};
}
function disableElevatedTools(cfg, findings) {
	if (!findings.some((finding) => finding.ocPath === "oc://openclaw.config/tools/elevated/enabled")) return {
		config: cfg,
		changes: []
	};
	const next = cloneConfig(cfg);
	const elevated = ensureRecord(ensureRecord(next, "tools"), "elevated");
	if (elevated.enabled === false) return {
		config: cfg,
		changes: []
	};
	elevated.enabled = false;
	return {
		config: next,
		changes: ["Set tools.elevated.enabled=false for policy conformance."]
	};
}
function disableInsecureControlUi(cfg, findings) {
	const next = cloneConfig(cfg);
	const controlUi = ensureRecord(ensureRecord(next, "gateway"), "controlUi");
	const changes = [];
	const fields = [["dangerouslyDisableDeviceAuth", "oc://openclaw.config/gateway/controlUi/dangerouslyDisableDeviceAuth"], ["dangerouslyAllowHostHeaderOriginFallback", "oc://openclaw.config/gateway/controlUi/dangerouslyAllowHostHeaderOriginFallback"]];
	const findingPaths = new Set(findings.map((finding) => finding.ocPath));
	for (const [field, ocPath] of fields) if (findingPaths.has(ocPath) && controlUi[field] !== false) {
		controlUi[field] = false;
		changes.push(`Set gateway.controlUi.${field}=false for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes
	} : {
		config: cfg,
		changes
	};
}
function disableRemoteGatewayMode(cfg, findings) {
	if (!findings.some((finding) => finding.ocPath === "oc://openclaw.config/gateway/mode")) return {
		config: cfg,
		changes: []
	};
	const next = cloneConfig(cfg);
	const gateway = ensureRecord(next, "gateway");
	const changes = [];
	if (gateway.mode === "remote") {
		gateway.mode = "local";
		changes.push("Set gateway.mode=local for policy conformance.");
	}
	return changes.length > 0 ? {
		config: next,
		changes
	} : {
		config: cfg,
		changes
	};
}
function disableTelemetryContentCapture(cfg) {
	const next = cloneConfig(cfg);
	const otel = ensureRecord(ensureRecord(next, "diagnostics"), "otel");
	if (otel.captureContent === false) return {
		config: cfg,
		changes: []
	};
	otel.captureContent = false;
	return {
		config: next,
		changes: ["Set diagnostics.otel.captureContent=false for policy conformance."]
	};
}
function setFindingConfigValues(cfg, findings, fieldName, value) {
	const next = cloneConfig(cfg);
	const changes = [];
	const warnings = [];
	for (const finding of findings) {
		if (isScopedInheritedChannelDefaultFinding(finding)) {
			warnings.push(`Skipped scoped channel ingress repair for ${configPathLabel(finding.ocPath ?? "")}. The finding reports inherited channels.defaults config, so changing it would affect more than the scoped channel target.`);
			continue;
		}
		if (finding.ocPath === void 0 || configPathSegments(finding.ocPath).at(-1) !== fieldName || !setValueAtOcPath(next, finding.ocPath, value)) continue;
		changes.push(`Set ${configPathLabel(finding.ocPath)}=${String(value)} for policy conformance.`);
	}
	return changes.length > 0 ? {
		config: next,
		changes: uniqueStrings(changes),
		warnings
	} : {
		config: cfg,
		changes,
		warnings: uniqueStrings(warnings)
	};
}
function cloneConfig(cfg) {
	return structuredClone(cfg);
}
function mergeStringArrayAtOcPath(cfg, ocPath, entry) {
	const segments = configPathSegments(ocPath);
	if (segments.length === 0 || segments.at(-1) !== "deny") return false;
	let current = cfg;
	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];
		if (segment === void 0) return false;
		if (segment.startsWith("#")) {
			const arrayIndex = Number.parseInt(segment.slice(1), 10);
			if (!Array.isArray(current) || !Number.isInteger(arrayIndex) || arrayIndex < 0) return false;
			current = current[arrayIndex];
			continue;
		}
		if (!isRecord(current)) return false;
		const nextSegment = segments[index + 1];
		if (current[segment] === void 0) current[segment] = nextSegment?.startsWith("#") ? [] : {};
		current = current[segment];
	}
	if (!isRecord(current)) return false;
	const existing = current.deny;
	if (existing !== void 0 && !Array.isArray(existing)) return false;
	const deny = existing ?? [];
	if (deny.some((value) => typeof value === "string" && value === entry)) return false;
	current.deny = [...deny, entry];
	return true;
}
function configPathSegments(ocPath) {
	if (!ocPath.startsWith("oc://openclaw.config/")) return [];
	return splitConfigPath(ocPath.slice(21));
}
function splitConfigPath(path) {
	const segments = [];
	let current = "";
	let quoted = false;
	let escaped = false;
	for (const char of path) {
		if (escaped) {
			current += char;
			escaped = false;
			continue;
		}
		if (quoted && char === "\\") {
			escaped = true;
			continue;
		}
		if (char === "\"") {
			quoted = !quoted;
			continue;
		}
		if (!quoted && char === "/") {
			if (current !== "") segments.push(current);
			current = "";
			continue;
		}
		current += char;
	}
	if (current !== "") segments.push(current);
	return quoted ? [] : segments;
}
function configPathLabel(ocPath) {
	let label = "";
	for (const segment of configPathSegments(ocPath)) if (segment.startsWith("#")) label += `[${segment.slice(1)}]`;
	else label += label === "" ? segment : `.${segment}`;
	return label;
}
function missingRequiredTool(finding) {
	return finding.message.match(/required tool '([^']+)'/)?.[1]?.trim();
}
function setValueAtOcPath(cfg, ocPath, value) {
	const segments = configPathSegments(ocPath);
	if (segments.length === 0) return false;
	let current = cfg;
	for (let index = 0; index < segments.length - 1; index += 1) {
		const segment = segments[index];
		if (segment === void 0 || segment.startsWith("#")) return false;
		if (!isRecord(current)) return false;
		const existing = current[segment];
		if (existing !== void 0 && !isRecord(existing)) return false;
		if (existing === void 0) current[segment] = {};
		current = current[segment];
	}
	if (!isRecord(current)) return false;
	const last = segments.at(-1);
	if (last === void 0 || last.startsWith("#") || current[last] === value) return false;
	current[last] = value;
	return true;
}
function workspaceRepairsEnabled$1(ctx) {
	const plugins = isRecord(ctx.cfg.plugins) ? ctx.cfg.plugins : {};
	const entries = isRecord(plugins.entries) ? plugins.entries : {};
	const policy = isRecord(entries.policy) ? entries.policy : {};
	return (isRecord(policy.config) ? policy.config : {}).workspaceRepairs === true;
}
function workspaceRepairsDisabledResult$1() {
	return {
		status: "skipped",
		reason: "workspace repairs are disabled",
		changes: [],
		warnings: ["Skipped policy config repair. Enable plugins.entries.policy.config.workspaceRepairs to let doctor --fix edit workspace policy config."]
	};
}
function hasScopedPolicyRequirement(findings) {
	return findings.some((finding) => finding.requirement?.includes("/scopes/") === true);
}
function skippedUnsafeScopedRepair(cfg, warning) {
	return {
		config: cfg,
		changes: [],
		warnings: [warning]
	};
}
function isScopedInheritedChannelDefaultFinding(finding) {
	return hasScopedPolicyRequirement([finding]) && finding.ocPath?.startsWith("oc://openclaw.config/channels/defaults/") === true;
}
function ensureRecord(parent, key) {
	const current = parent[key];
	if (isRecord(current)) {
		const copy = { ...current };
		parent[key] = copy;
		return copy;
	}
	const next = {};
	parent[key] = next;
	return next;
}
//#endregion
//#region extensions/policy/src/doctor/check-factory.ts
function createPolicyScopedChecks(deps, definitions) {
	const { evaluatePolicy, findingsForCheck } = deps;
	return definitions.map(([id, description, repair]) => ({
		id,
		kind: "plugin",
		description,
		source: "policy",
		async detect(ctx) {
			return findingsForCheck(await evaluatePolicy(ctx), id);
		},
		...repair ? { repair } : {}
	}));
}
//#endregion
//#region extensions/policy/src/doctor/scopes/channels.ts
function createPolicyChannelProviderChecks(deps) {
	const { channelIdsFromFindings, disableChannels, workspaceRepairsDisabledResult, workspaceRepairsEnabled } = deps;
	return createPolicyScopedChecks(deps, [[
		CHECK_IDS.policyDeniedChannelProvider,
		"Configured channels satisfy policy deny rules.",
		async (ctx, findings) => {
			if (!workspaceRepairsEnabled(ctx)) return workspaceRepairsDisabledResult("channel config");
			const channelIds = channelIdsFromFindings(findings);
			if (channelIds.length === 0) return {
				status: "skipped",
				reason: "no channel findings matched a configurable channel",
				changes: []
			};
			const next = disableChannels(ctx.cfg, channelIds);
			if (next.changed.length === 0) return {
				status: "skipped",
				reason: "matching channels were already disabled or missing",
				changes: []
			};
			return {
				config: next.config,
				changes: next.changed.map((id) => `Disabled channels.${id}.enabled for policy conformance.`)
			};
		}
	]]);
}
function createPolicyIngressChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyIngressDmPolicyUnapproved, "Channel direct-message access policy matches ingress requirements."],
		[CHECK_IDS.policyIngressDmScopeUnapproved, "Direct-message sessions use the policy-required isolation scope."],
		[
			CHECK_IDS.policyIngressOpenGroupsDenied,
			"Channel group access does not use open group policy when denied.",
			async (ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyIngressOpenGroupsDenied)
		],
		[
			CHECK_IDS.policyIngressGroupMentionRequired,
			"Channel group access keeps mention gates enabled when required.",
			async (ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyIngressGroupMentionRequired)
		]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/core.ts
function createPolicyCoreChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyMissingFile, "The enabled Policy plugin has a policy file to verify."],
		[CHECK_IDS.policyInvalidFile, "The enabled policy file parses before policy checks run."],
		[CHECK_IDS.policyHashMismatch, "The policy file matches the configured expected hash."],
		[CHECK_IDS.policyAttestationMismatch, "The current policy check matches the accepted attestation."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/data-auth.ts
function createPolicyDataAuthChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[
			CHECK_IDS.policyDataHandlingTelemetryContentCapture,
			"Telemetry content capture remains disabled when policy denies it.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyDataHandlingTelemetryContentCapture)
		],
		[CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced, "Session retention maintenance is enforced when policy requires it."],
		[CHECK_IDS.policyDataHandlingSessionTranscriptMemory, "Session transcript memory indexing remains disabled when policy denies it."],
		[CHECK_IDS.policySecretsUnmanagedProvider, "OpenClaw config SecretRefs use configured secret providers when policy requires managed providers."],
		[CHECK_IDS.policySecretsDeniedProviderSource, "OpenClaw config secret providers and SecretRefs do not use sources denied by policy."],
		[CHECK_IDS.policySecretsInsecureProvider, "Configured secret providers do not opt into insecure posture unless policy allows it."],
		[CHECK_IDS.policyAuthProfileInvalidMetadata, "OpenClaw config auth profiles declare required provider and mode metadata."],
		[CHECK_IDS.policyAuthProfileUnapprovedMode, "OpenClaw config auth profile modes stay within the policy allowlist."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/exec-approvals.ts
function createPolicyExecApprovalChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyExecApprovalsMissing, "Required exec approvals artifact is present for policy conformance."],
		[CHECK_IDS.policyExecApprovalsInvalid, "Exec approvals artifact parses before policy checks run."],
		[CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved, "Exec approval defaults use a policy-approved security mode."],
		[CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved, "Per-agent exec approval settings use policy-approved security modes."],
		[CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled, "Exec approval agents do not implicitly auto-allow skill CLIs unless policy allows it."],
		[CHECK_IDS.policyExecApprovalsAllowlistMissing, "Exec approval allowlists include every pattern required by policy."],
		[CHECK_IDS.policyExecApprovalsAllowlistUnexpected, "Exec approval allowlists do not contain patterns outside policy."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/policy-evidence-finding.ts
function policyEvidenceFinding(entry, params) {
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: "openclaw config",
		ocPath: entry.source,
		target: entry.source,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
//#endregion
//#region extensions/policy/src/doctor/review-required-repairs.ts
const REVIEW_REQUIRED_REPAIR_CHECK_IDS = /* @__PURE__ */ new Set([CHECK_IDS.policyGatewayNonLoopbackBind, CHECK_IDS.policyGatewayNodeCommandDenied]);
function previewPolicyReviewRequiredRepair(_ctx, findings, checkId) {
	const metadata = POLICY_FIX_METADATA_BY_CHECK_ID.get(checkId);
	if (!REVIEW_REQUIRED_REPAIR_CHECK_IDS.has(checkId) || metadata?.fixClass !== "reviewRequired") return Promise.resolve({
		status: "skipped",
		reason: "policy finding does not have a review-required repair preview",
		changes: []
	});
	if (findings.length === 0 || findings.some((finding) => finding.checkId !== checkId || POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId)?.fixClass !== "reviewRequired")) return Promise.resolve({
		status: "skipped",
		reason: "policy finding is not classified as review-required",
		changes: []
	});
	const previews = findings.flatMap((finding) => previewForFinding(finding, checkId));
	if (previews.length === 0) return Promise.resolve({
		status: "skipped",
		reason: "policy review-required repair had no previewable config changes",
		changes: []
	});
	return Promise.resolve({
		status: "skipped",
		reason: "policy repair requires review before changing config",
		changes: uniqueStrings(previews.map((preview) => preview.change)),
		warnings: uniqueStrings(previews.map((preview) => preview.change)),
		effects: uniqueEffects(previews.map((preview) => preview.effect))
	});
}
function previewForFinding(finding, checkId) {
	switch (checkId) {
		case CHECK_IDS.policyGatewayNonLoopbackBind: return previewGatewayLoopbackBind(finding);
		case CHECK_IDS.policyGatewayNodeCommandDenied: return previewGatewayNodeDenyCommand(finding);
		default: return [];
	}
}
function previewGatewayLoopbackBind(finding) {
	if (finding.ocPath !== "oc://openclaw.config/gateway/bind" && finding.ocPath !== "oc://openclaw.config/gateway/customBindHost") return [];
	return [{
		change: "Review required: set gateway.bind=loopback for policy conformance.",
		effect: {
			kind: "config",
			action: "would-set-after-review",
			target: "gateway.bind=loopback",
			dryRunSafe: true
		}
	}];
}
function previewGatewayNodeDenyCommand(finding) {
	const command = finding.message.match(/Gateway node command '([^']+)'/)?.[1]?.trim();
	if (command === void 0 || command === "" || finding.ocPath !== "oc://openclaw.config/gateway/nodes/commands/deny") return [];
	return [{
		change: `Review required: add ${command} to gateway.nodes.commands.deny for policy conformance.`,
		effect: {
			kind: "config",
			action: "would-append-after-review",
			target: `gateway.nodes.commands.deny += ${command}`,
			dryRunSafe: true
		}
	}];
}
function uniqueEffects(values) {
	const seen = /* @__PURE__ */ new Set();
	return values.filter((value) => {
		const key = JSON.stringify(value);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
//#endregion
//#region extensions/policy/src/policy-value.ts
function scopedPolicyValue(overlay, path) {
	const [root, ...remainingPath] = path;
	if (!root) return;
	return getPolicyPath(overlay[root], remainingPath);
}
function getPolicyPath(value, path) {
	let current = value;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return current;
}
//#endregion
//#region extensions/policy/src/policy-state-helpers.ts
function ocPathSegment$1(value) {
	if (/^(?:[A-Za-z0-9_-]+|#\d+)$/.test(value)) return value;
	if (value.includes("\"") || value.includes("\\")) return value;
	return `"${value}"`;
}
function readBooleanPath(value, path) {
	let current = value;
	for (const part of path) {
		if (!isRecord(current)) return;
		current = current[part];
	}
	return typeof current === "boolean" ? current : void 0;
}
function collectPolicyConfiguredAgents(agents) {
	const entries = agents.entries;
	if (Object.hasOwn(agents, "entries") && entries !== void 0) return isRecord(entries) ? Object.entries(entries).toSorted(([a], [b]) => a.localeCompare(b)).map(([agentId, value]) => ({
		agentId,
		sourceBase: `oc://openclaw.config/agents/entries/${ocPathSegment$1(agentId)}`,
		value
	})) : [];
	return Array.isArray(agents.list) ? agents.list.map((value, index) => ({
		agentId: isRecord(value) && typeof value.id === "string" && value.id.trim() !== "" ? value.id.trim() : `agent-${index}`,
		sourceBase: `oc://openclaw.config/agents/list/#${index}`,
		value
	})) : [];
}
//#endregion
//#region extensions/policy/src/doctor/utils.ts
function readPolicyStringArray(policy, path, options = {}) {
	const current = getPolicyPath(policy, path);
	if (!Array.isArray(current) || !current.every((entry) => typeof entry === "string")) return;
	const lowercase = options.lowercase ?? true;
	return current.map((entry) => {
		const trimmed = entry.trim();
		return lowercase ? trimmed.toLowerCase() : trimmed;
	}).filter(Boolean);
}
function readStringList(policy, path, options) {
	return readPolicyStringArray(policy, path, options) ?? [];
}
function readPolicyPathString(policy, path) {
	const current = getPolicyPath(policy, path);
	return typeof current === "string" ? current.trim().toLowerCase() : void 0;
}
function ocPathSegment(value) {
	if (/^(?:[A-Za-z0-9_-]+|#\d+)$/.test(value)) return value;
	return JSON.stringify(value);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/gateway.ts
function createPolicyGatewayChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[
			CHECK_IDS.policyGatewayNonLoopbackBind,
			"Gateway bind posture matches policy exposure requirements.",
			(ctx, findings) => previewPolicyReviewRequiredRepair(ctx, findings, CHECK_IDS.policyGatewayNonLoopbackBind)
		],
		[CHECK_IDS.policyGatewayAuthDisabled, "Gateway authentication remains enabled when required by policy."],
		[CHECK_IDS.policyGatewayRateLimitMissing, "Gateway authentication rate-limit posture is explicit when required by policy."],
		[
			CHECK_IDS.policyGatewayControlUiInsecure,
			"Gateway Control UI insecure exposure toggles remain disabled by policy.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyGatewayControlUiInsecure)
		],
		[CHECK_IDS.policyGatewayTailscaleFunnel, "Gateway Tailscale Funnel exposure matches policy."],
		[
			CHECK_IDS.policyGatewayRemoteEnabled,
			"Remote gateway mode matches policy.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyGatewayRemoteEnabled)
		],
		[
			CHECK_IDS.policyGatewayHttpEndpointEnabled,
			"Gateway HTTP API endpoints match policy.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyGatewayHttpEndpointEnabled)
		],
		[CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted, "Gateway HTTP URL-fetch inputs have allowlists when required by policy."],
		[
			CHECK_IDS.policyGatewayNodeCommandDenied,
			"Gateway node command allowlists match policy.",
			(ctx, findings) => previewPolicyReviewRequiredRepair(ctx, findings, CHECK_IDS.policyGatewayNodeCommandDenied)
		]
	]);
}
function gatewayExposureFindings(policy, policyDocName, evidence) {
	return [
		...gatewayNonLoopbackBindFindings(policy, policyDocName, evidence),
		...gatewayAuthFindings(policy, policyDocName, evidence),
		...gatewayControlUiFindings(policy, policyDocName, evidence),
		...gatewayTailscaleFindings(policy, policyDocName, evidence),
		...gatewayRemoteFindings(policy, policyDocName, evidence),
		...gatewayHttpEndpointFindings(policy, policyDocName, evidence),
		...gatewayHttpUrlFetchFindings(policy, policyDocName, evidence),
		...gatewayNodeCommandFindings(policy, policyDocName, evidence)
	];
}
function gatewayNonLoopbackBindFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"gateway",
		"exposure",
		"allowNonLoopbackBind"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "bind" && entry.nonLoopback === true).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayNonLoopbackBind,
			message: entry.explicit === false ? "Gateway bind is omitted while the runtime default can permit non-loopback exposure." : `Gateway bind setting '${entry.id}' permits non-loopback exposure.`,
			requirement: `oc://${policyDocName}/gateway/exposure/allowNonLoopbackBind`,
			fixHint: "Use gateway.bind=loopback or update policy after review."
		});
	});
}
function gatewayAuthFindings(policy, policyDocName, evidence) {
	const findings = [];
	if (readBooleanPath(policy, [
		"gateway",
		"auth",
		"requireAuth"
	]) === true) findings.push(...(evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "auth" && entry.value === "none").map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayAuthDisabled,
			message: "Gateway authentication is disabled.",
			requirement: `oc://${policyDocName}/gateway/auth/requireAuth`,
			fixHint: "Set gateway.auth.mode to token, password, or trusted-proxy."
		});
	}));
	if (readBooleanPath(policy, [
		"gateway",
		"auth",
		"requireExplicitRateLimit"
	]) === true) findings.push(...(evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "authRateLimit" && entry.explicit !== true).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayRateLimitMissing,
			message: "Gateway authentication rate-limit posture is not explicit.",
			requirement: `oc://${policyDocName}/gateway/auth/requireExplicitRateLimit`,
			fixHint: "Configure gateway.auth.rateLimit or update policy after review."
		});
	}));
	return findings;
}
function gatewayControlUiFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"gateway",
		"controlUi",
		"allowInsecure"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "controlUi" && entry.value === true && (entry.id === "gateway-control-ui-insecure-auth" || entry.id === "gateway-control-ui-device-auth-disabled" || entry.id === "gateway-control-ui-host-origin-fallback")).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayControlUiInsecure,
			message: `Gateway Control UI insecure toggle '${entry.id}' is enabled.`,
			requirement: `oc://${policyDocName}/gateway/controlUi/allowInsecure`,
			fixHint: "Disable the insecure Control UI toggle or update policy after review."
		});
	});
}
function gatewayTailscaleFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"gateway",
		"exposure",
		"allowTailscaleFunnel"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "tailscale" && entry.value === "funnel").map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayTailscaleFunnel,
			message: "Gateway Tailscale Funnel exposure is enabled.",
			requirement: `oc://${policyDocName}/gateway/exposure/allowTailscaleFunnel`,
			fixHint: "Use tailscale serve/off or update policy after review."
		});
	});
}
function gatewayRemoteFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"gateway",
		"remote",
		"allow"
	]) !== false) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "remote").map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayRemoteEnabled,
			message: `Gateway remote posture '${entry.id}' is enabled.`,
			requirement: `oc://${policyDocName}/gateway/remote/allow`,
			fixHint: "Disable remote gateway mode/config or update policy after review."
		});
	});
}
function gatewayHttpEndpointFindings(policy, policyDocName, evidence) {
	const denied = new Set(readStringList(policy, [
		"gateway",
		"http",
		"denyEndpoints"
	]).map((endpoint) => endpoint.toLowerCase()));
	if (denied.size === 0) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "httpEndpoint" && entry.endpoint !== void 0 && denied.has(entry.endpoint.toLowerCase())).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayHttpEndpointEnabled,
			message: `Gateway HTTP endpoint '${entry.endpoint ?? entry.id}' is denied by policy.`,
			requirement: `oc://${policyDocName}/gateway/http/denyEndpoints`,
			fixHint: "Disable the HTTP endpoint or update policy after review."
		});
	});
}
function gatewayHttpUrlFetchFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"gateway",
		"http",
		"requireUrlAllowlists"
	]) !== true) return [];
	return (evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "httpUrlFetch" && entry.hasAllowlist !== true).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted,
			message: `Gateway HTTP URL-fetch input '${entry.id}' has no URL allowlist.`,
			requirement: `oc://${policyDocName}/gateway/http/requireUrlAllowlists`,
			fixHint: "Add a urlAllowlist for this URL-fetch input or update policy after review."
		});
	});
}
function gatewayNodeCommandFindings(policy, policyDocName, evidence) {
	if (!hasValidOptionalStringList(policy, [
		"gateway",
		"nodes",
		"denyCommands"
	])) return [];
	const policyDenied = readStringList(policy, [
		"gateway",
		"nodes",
		"denyCommands"
	], { lowercase: false });
	if (policyDenied.length === 0) return [];
	const configDenied = new Set((evidence.gatewayExposure ?? []).filter((entry) => entry.kind === "nodeDenyCommand" && entry.command !== void 0).map((entry) => entry.command));
	return policyDenied.filter((command) => !configDenied.has(command)).map((command) => {
		return policyEvidenceFinding({ source: "oc://openclaw.config/gateway/nodes/commands/deny" }, {
			checkId: CHECK_IDS.policyGatewayNodeCommandDenied,
			message: `Gateway node command '${command}' is denied by policy but not denied by OpenClaw config.`,
			requirement: `oc://${policyDocName}/gateway/nodes/denyCommands`,
			fixHint: `Add '${command}' to gateway.nodes.commands.deny or update policy after review.`
		});
	});
}
function hasValidOptionalStringList(policy, path) {
	let current = policy;
	for (const part of path) {
		if (!isRecord(current)) return true;
		current = current[part];
	}
	return current === void 0 || Array.isArray(current) && current.every((entry) => typeof entry === "string" && entry.trim() !== "");
}
//#endregion
//#region extensions/policy/src/doctor/scopes/model-network.ts
function createPolicyModelNetworkChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyDeniedMcpServer, "Configured MCP servers do not match policy deny rules."],
		[CHECK_IDS.policyUnapprovedMcpServer, "Configured MCP servers do not match policy allow rules."],
		[CHECK_IDS.policyDeniedModelProvider, "Configured model providers do not match policy deny rules."],
		[CHECK_IDS.policyUnapprovedModelProvider, "Configured model providers do not match policy allow rules."],
		[CHECK_IDS.policyPrivateNetworkAccess, "Network SSRF policy settings match private-network requirements."]
	]);
}
function mcpServerFindings(policy, policyDocName, evidence) {
	const denied = new Set(readStringList(policy, [
		"mcp",
		"servers",
		"deny"
	], { lowercase: false }));
	const allowed = readStringList(policy, [
		"mcp",
		"servers",
		"allow"
	], { lowercase: false });
	const allowedSet = new Set(allowed);
	const findings = [];
	for (const server of evidence.mcpServers) {
		if (denied.has(server.id)) {
			findings.push(policyEvidenceFinding(server, {
				checkId: CHECK_IDS.policyDeniedMcpServer,
				message: `MCP server '${server.id}' is denied by policy.`,
				requirement: `oc://${policyDocName}/mcp/servers/deny`,
				fixHint: "Remove this configured MCP server or update the policy after review."
			}));
			continue;
		}
		if (allowedSet.size > 0 && !allowedSet.has(server.id)) findings.push(policyEvidenceFinding(server, {
			checkId: CHECK_IDS.policyUnapprovedMcpServer,
			message: `MCP server '${server.id}' is not in the policy allowlist.`,
			requirement: `oc://${policyDocName}/mcp/servers/allow`,
			fixHint: "Use an approved MCP server or update the policy after review."
		}));
	}
	return findings;
}
function modelProviderFindings(policy, policyDocName, evidence) {
	const denied = new Set(readModelProviderPolicyList(policy, [
		"models",
		"providers",
		"deny"
	]));
	const allowed = readModelProviderPolicyList(policy, [
		"models",
		"providers",
		"allow"
	]);
	const allowedSet = new Set(allowed);
	const findings = [];
	for (const provider of evidence.modelProviders) findings.push(...modelProviderConformanceFindings(provider, denied, allowedSet, policyDocName));
	for (const modelRef of evidence.modelRefs) findings.push(...modelRefConformanceFindings(modelRef, denied, allowedSet, policyDocName));
	return findings;
}
function readModelProviderPolicyList(policy, path) {
	return readStringList(policy, path).map((provider) => normalizeProviderId(provider));
}
function modelProviderConformanceFindings(provider, denied, allowed, policyDocName) {
	const findings = [];
	if (denied.has(provider.id)) findings.push(policyEvidenceFinding(provider, {
		checkId: CHECK_IDS.policyDeniedModelProvider,
		message: `Model provider '${provider.id}' is denied by policy.`,
		requirement: `oc://${policyDocName}/models/providers/deny`,
		fixHint: "Remove this configured provider or update the policy after review."
	}));
	if (!denied.has(provider.id) && allowed.size > 0 && !allowed.has(provider.id)) findings.push(policyEvidenceFinding(provider, {
		checkId: CHECK_IDS.policyUnapprovedModelProvider,
		message: `Model provider '${provider.id}' is not in the policy allowlist.`,
		requirement: `oc://${policyDocName}/models/providers/allow`,
		fixHint: "Use an approved model provider or update the policy after review."
	}));
	return findings;
}
function modelRefConformanceFindings(modelRef, denied, allowed, policyDocName) {
	const findings = [];
	if (denied.has(modelRef.provider)) findings.push(policyEvidenceFinding(modelRef, {
		checkId: CHECK_IDS.policyDeniedModelProvider,
		message: `Model ref '${modelRef.ref}' uses denied provider '${modelRef.provider}'.`,
		requirement: `oc://${policyDocName}/models/providers/deny`,
		fixHint: "Select an approved model provider or update the policy after review."
	}));
	if (!denied.has(modelRef.provider) && allowed.size > 0 && !allowed.has(modelRef.provider)) findings.push(policyEvidenceFinding(modelRef, {
		checkId: CHECK_IDS.policyUnapprovedModelProvider,
		message: `Model ref '${modelRef.ref}' uses unapproved provider '${modelRef.provider}'.`,
		requirement: `oc://${policyDocName}/models/providers/allow`,
		fixHint: "Select an approved model provider or update the policy after review."
	}));
	return findings;
}
function networkFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, [
		"network",
		"privateNetwork",
		"allow"
	]) !== false) return [];
	return evidence.network.filter((setting) => setting.value).map((setting) => {
		return policyEvidenceFinding(setting, {
			checkId: CHECK_IDS.policyPrivateNetworkAccess,
			message: `Network setting '${setting.id}' allows private-network access.`,
			requirement: `oc://${policyDocName}/network/privateNetwork/allow`,
			fixHint: "Disable this private-network access setting or update policy after review."
		});
	});
}
//#endregion
//#region extensions/policy/src/doctor/scopes/routing.ts
function createPolicyRoutingChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyRoutingBindingsRequired, "Routing policy has at least one channel route binding when required."],
		[CHECK_IDS.policyRoutingBindingChannelUnconfigured, "Route bindings name channels present in configuration."],
		[CHECK_IDS.policyRoutingAgentMismatch, "Authored routing probes resolve to their expected agents."],
		[CHECK_IDS.policyRoutingMatchKindMismatch, "Authored routing probes match at their expected specificity."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/sandbox.ts
function createPolicySandboxChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policySandboxModeUnapproved, "Sandbox mode config satisfies policy requirements."],
		[CHECK_IDS.policySandboxBackendUnapproved, "Sandbox backend config satisfies policy requirements."],
		[CHECK_IDS.policySandboxContainerPostureUnobservable, "Sandbox container posture policy only targets observable container backends."],
		[CHECK_IDS.policySandboxContainerHostNetworkDenied, "Sandbox container config avoids host network mode."],
		[CHECK_IDS.policySandboxContainerNamespaceJoinDenied, "Sandbox container config avoids joining another container network namespace."],
		[CHECK_IDS.policySandboxContainerMountModeRequired, "Sandbox container mounts are read-only when policy requires it."],
		[CHECK_IDS.policySandboxContainerRuntimeSocketMount, "Sandbox container mounts avoid host container runtime sockets."],
		[CHECK_IDS.policySandboxContainerUnconfinedProfile, "Sandbox container profile config avoids unconfined profiles."],
		[CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing, "Sandbox browser CDP config includes a source range when policy requires it."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/scopes/tools.ts
function createPolicyAgentToolChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyAgentsWorkspaceAccessDenied, "Agent sandbox workspace access matches policy."],
		[
			CHECK_IDS.policyAgentsToolNotDenied,
			"Agent workspace mutation/runtime tools are denied when policy requires it.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyAgentsToolNotDenied)
		],
		[CHECK_IDS.policyToolsProfileUnapproved, "Configured tool profiles match policy allow rules."],
		[CHECK_IDS.policyToolsFsWorkspaceOnlyRequired, "Filesystem tools use workspace-only posture when policy requires it."],
		[CHECK_IDS.policyToolsExecSecurityUnapproved, "Exec tool security mode matches policy allow rules."],
		[CHECK_IDS.policyToolsExecAskUnapproved, "Exec tool ask mode matches policy allow rules."],
		[CHECK_IDS.policyToolsExecHostUnapproved, "Exec tool host routing matches policy allow rules."],
		[
			CHECK_IDS.policyToolsElevatedEnabled,
			"Elevated tool mode remains disabled when policy requires it.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyToolsElevatedEnabled)
		],
		[CHECK_IDS.policyToolsAlsoAllowMissing, "Configured tools.alsoAllow entries include policy expected lists."],
		[CHECK_IDS.policyToolsAlsoAllowUnexpected, "Configured tools.alsoAllow entries match policy expected lists."],
		[
			CHECK_IDS.policyToolsRequiredDenyMissing,
			"Configured tool deny lists include tools required by policy.",
			(ctx, findings) => repairPolicyAutomaticNarrower(ctx, findings, CHECK_IDS.policyToolsRequiredDenyMissing)
		]
	]);
}
function createPolicyToolMetadataChecks(deps) {
	return createPolicyScopedChecks(deps, [
		[CHECK_IDS.policyUnmigratedToolsFile, "Governed tool declarations have been migrated from TOOLS.md into AGENTS.md."],
		[CHECK_IDS.policyMissingToolRisk, "AGENTS.md tool policy entries declare explicit risk levels."],
		[CHECK_IDS.policyUnknownToolRisk, "AGENTS.md tool policy entries use known risk levels."],
		[CHECK_IDS.policyMissingToolSensitivity, "AGENTS.md tool policy entries declare default artifact sensitivity."],
		[CHECK_IDS.policyMissingToolOwner, "AGENTS.md tool policy entries declare an accountable owner."],
		[CHECK_IDS.policyUnknownToolSensitivity, "AGENTS.md tool policy entries use known sensitivity levels."]
	]);
}
//#endregion
//#region extensions/policy/src/doctor/checks.ts
function createPolicyDoctorChecks(deps) {
	return [
		...createPolicyCoreChecks(deps),
		...createPolicyChannelProviderChecks(deps),
		...createPolicyModelNetworkChecks(deps),
		...createPolicyIngressChecks(deps),
		...createPolicyRoutingChecks(deps),
		...createPolicyGatewayChecks(deps),
		...createPolicyAgentToolChecks(deps),
		...createPolicySandboxChecks(deps),
		...createPolicyDataAuthChecks(deps),
		...createPolicyExecApprovalChecks(deps),
		...createPolicyToolMetadataChecks(deps)
	];
}
//#endregion
//#region extensions/policy/src/policy-routing.ts
const ROUTING_MATCH_KINDS = [
	"binding.peer",
	"binding.peer.parent",
	"binding.peer.wildcard",
	"binding.guild+roles",
	"binding.guild",
	"binding.team",
	"binding.account",
	"binding.channel",
	"default"
];
function policyRoutingRules(policy) {
	if (!isRecord(policy) || !isRecord(policy.routing)) return;
	return policy.routing;
}
function listPolicyRouteBindings(cfg) {
	if (!Array.isArray(cfg.bindings)) return [];
	const bindings = [];
	for (const [index, value] of cfg.bindings.entries()) {
		if (!isRecord(value) || value.type === "acp" || !isRecord(value.match)) continue;
		if (typeof value.agentId !== "string" || typeof value.match.channel !== "string") continue;
		bindings.push({
			index,
			channel: value.match.channel
		});
	}
	return bindings;
}
function resolvePolicyRoutingProbe(cfg, probe) {
	return resolveAgentRoute({
		cfg,
		channel: probe.route.channel,
		accountId: probe.route.accountId,
		peer: probe.route.peer,
		parentPeer: probe.route.parentPeer,
		guildId: probe.route.guildId,
		teamId: probe.route.teamId,
		memberRoleIds: probe.route.memberRoleIds === void 0 ? void 0 : [...probe.route.memberRoleIds]
	});
}
//#endregion
//#region extensions/policy/src/policy-state-types.ts
const RESERVED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const NON_SLUG_CHARS = /[^a-z0-9-]+/g;
const COLLAPSE_HYPHENS = /-+/g;
const TRIM_HYPHENS = /^-+|-+$/g;
//#endregion
//#region extensions/policy/src/policy-state-core.ts
function scanPolicyChannels(cfg) {
	return Object.entries(configuredChannels(cfg)).filter(([id]) => !RESERVED_CHANNEL_CONFIG_KEYS.has(id)).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			provider: id,
			source: `oc://openclaw.config/channels/${id}`
		};
		if (isRecord(value) && typeof value.enabled === "boolean") entry.enabled = value.enabled;
		return entry;
	});
}
function scanPolicyMcpServers(cfg) {
	return Object.entries(configuredMcpServers(cfg)).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			transport: mcpServerTransport(value),
			source: `oc://openclaw.config/mcp/servers/${ocPathSegment$1(id)}`
		};
		if (isRecord(value)) {
			if (typeof value.command === "string") entry.command = value.command;
			if (typeof value.url === "string") entry.url = redactMcpUrlForEvidence(value.url);
		}
		return entry;
	});
}
function scanPolicyModelProviders(cfg) {
	return Object.keys(configuredModelProviders(cfg)).toSorted((a, b) => a.localeCompare(b)).map((id) => ({
		id: normalizeProviderId(id),
		source: `oc://openclaw.config/models/providers/${id}`
	}));
}
function scanPolicyModelRefs(cfg) {
	const refs = [];
	if (isRecord(cfg.agents)) {
		collectModelRefsFromRecord(refs, cfg.agents, "oc://openclaw.config/agents");
		collectModelRefsFromAgentAllowlist(refs, cfg.agents);
	}
	return refs.toSorted((a, b) => a.provider.localeCompare(b.provider) || a.model.localeCompare(b.model));
}
function scanPolicyNetwork(cfg) {
	return [
		networkBooleanEvidence(cfg, "browser-private-network", [
			"browser",
			"ssrfPolicy",
			"dangerouslyAllowPrivateNetwork"
		], "oc://openclaw.config/browser/ssrfPolicy/dangerouslyAllowPrivateNetwork"),
		networkBooleanEvidence(cfg, "browser-private-network-legacy", [
			"browser",
			"ssrfPolicy",
			"allowPrivateNetwork"
		], "oc://openclaw.config/browser/ssrfPolicy/allowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-private-network", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"dangerouslyAllowPrivateNetwork"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/dangerouslyAllowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-private-network-legacy", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowPrivateNetwork"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowPrivateNetwork"),
		networkBooleanEvidence(cfg, "web-fetch-rfc2544-benchmark-range", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowRfc2544BenchmarkRange"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowRfc2544BenchmarkRange"),
		networkBooleanEvidence(cfg, "web-fetch-ipv6-unique-local-range", [
			"tools",
			"web",
			"fetch",
			"ssrfPolicy",
			"allowIpv6UniqueLocalRange"
		], "oc://openclaw.config/tools/web/fetch/ssrfPolicy/allowIpv6UniqueLocalRange")
	].filter((entry) => entry !== void 0);
}
function configuredChannels(cfg) {
	return asNonArrayRecord(cfg.channels);
}
function configuredMcpServers(cfg) {
	return asNonArrayRecord(asNonArrayRecord(cfg.mcp).servers);
}
function mcpServerTransport(value) {
	if (!isRecord(value)) return "unknown";
	if (typeof value.command === "string") return "stdio";
	if (value.transport === "sse" || value.transport === "streamable-http") return value.transport;
	if (typeof value.url === "string") return "streamable-http";
	return "unknown";
}
function redactMcpUrlForEvidence(raw) {
	try {
		const url = new URL(raw);
		return `${url.protocol}//${url.host}`;
	} catch {
		return "[redacted-url]";
	}
}
function configuredModelProviders(cfg) {
	return asNonArrayRecord(asNonArrayRecord(cfg.models).providers);
}
function networkBooleanEvidence(cfg, id, path, source) {
	const value = readBooleanPath(cfg, path);
	return value === void 0 ? void 0 : {
		id,
		source,
		value
	};
}
function collectModelRefsFromValue(refs, value, source) {
	if (typeof value === "string") {
		pushModelRef(refs, value, source);
		return;
	}
	if (!isRecord(value)) return;
	if (typeof value.primary === "string") pushModelRef(refs, value.primary, `${source}/primary`);
	if (Array.isArray(value.fallbacks)) {
		for (const [index, fallback] of value.fallbacks.entries()) if (typeof fallback === "string") pushModelRef(refs, fallback, `${source}/fallbacks/#${index}`);
	}
}
function collectModelRefsFromRecord(refs, value, source) {
	for (const [key, child] of Object.entries(value)) {
		const childPath = `${source}/${key}`;
		if (isModelSettingKey(key)) {
			collectModelRefsFromValue(refs, child, childPath);
			continue;
		}
		if (Array.isArray(child)) {
			for (const [index, item] of child.entries()) if (isRecord(item)) collectModelRefsFromRecord(refs, item, `${childPath}/#${index}`);
			continue;
		}
		if (isRecord(child)) collectModelRefsFromRecord(refs, child, childPath);
	}
}
function collectModelRefsFromAgentAllowlist(refs, agents) {
	const defaults = agents.defaults;
	if (isRecord(defaults) && isRecord(defaults.models)) collectModelRefsFromModelMap(refs, defaults.models, "oc://openclaw.config/agents/defaults/models");
	for (const configured of collectPolicyConfiguredAgents(agents)) {
		const agent = configured.value;
		if (!isRecord(agent) || !isRecord(agent.models)) continue;
		collectModelRefsFromModelMap(refs, agent.models, `${configured.sourceBase}/models`);
	}
}
function collectModelRefsFromModelMap(refs, models, source) {
	for (const ref of Object.keys(models)) pushModelRef(refs, ref, `${source}/${ocPathSegment$1(ref)}`);
}
function isModelSettingKey(key) {
	return key === "model" || key.endsWith("Model");
}
function pushModelRef(refs, ref, source) {
	const parsed = parseModelRef(ref);
	if (parsed === void 0) return;
	refs.push({
		ref,
		provider: parsed.provider,
		model: parsed.model,
		source
	});
}
function parseModelRef(ref) {
	const trimmed = ref.trim();
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return;
	return {
		provider: normalizeProviderId(trimmed.slice(0, slash)),
		model: trimmed.slice(slash + 1)
	};
}
//#endregion
//#region extensions/policy/src/policy-state-data.ts
function scanPolicySecrets(cfg) {
	return [...scanPolicySecretProviders(cfg), ...scanPolicySecretInputs(cfg)].toSorted((a, b) => a.source.localeCompare(b.source));
}
function scanPolicyAuthProfiles(cfg) {
	const auth = asNonArrayRecord(cfg.auth);
	const profiles = asNonArrayRecord(auth.profiles);
	return Object.entries(profiles).toSorted(([a], [b]) => a.localeCompare(b)).map(([id, value]) => {
		const entry = {
			id,
			source: `oc://openclaw.config/auth/profiles/${ocPathSegment$1(id)}`,
			validMetadata: isValidAuthProfileMetadata(value)
		};
		if (isRecord(value)) {
			if (typeof value.provider === "string") entry.provider = value.provider;
			if (typeof value.mode === "string") entry.mode = value.mode;
		}
		return entry;
	});
}
function scanPolicyDataHandling(cfg) {
	const entries = [];
	entries.push({
		id: "logging-redaction",
		kind: "sensitiveLoggingRedaction",
		source: "oc://openclaw.invariant/logging/redaction",
		scope: "global",
		value: true,
		explicit: true
	});
	const diagnostics = asNonArrayRecord(cfg.diagnostics);
	const otel = asNonArrayRecord(diagnostics.otel);
	const otelEnabled = diagnostics.enabled !== false && otel.enabled === true;
	const tracesEnabled = otelEnabled && otel.traces !== false;
	const logsEnabled = otelEnabled && otel.logs === true;
	const captureContent = otelEnabled && telemetryContentCaptureEnabled(otel.captureContent, {
		tracesEnabled,
		logsEnabled
	});
	entries.push({
		id: "diagnostics-otel-content-capture",
		kind: "telemetryContentCapture",
		source: "oc://openclaw.config/diagnostics/otel/captureContent",
		scope: "global",
		value: captureContent,
		explicit: otel.captureContent !== void 0
	});
	const session = asNonArrayRecord(cfg.session);
	const maintenance = asNonArrayRecord(session.maintenance);
	const retentionMode = typeof maintenance.mode === "string" ? maintenance.mode : "enforce";
	entries.push({
		id: "session-maintenance-mode",
		kind: "sessionRetentionMode",
		source: "oc://openclaw.config/session/maintenance/mode",
		scope: "global",
		value: retentionMode,
		explicit: maintenance.mode !== void 0
	});
	pushMemorySessionTranscriptIndexing(entries, cfg);
	return entries.toSorted((a, b) => a.source.localeCompare(b.source));
}
function telemetryContentCaptureEnabled(value, signals) {
	if (value === true) return signals.tracesEnabled || signals.logsEnabled;
	if (!isRecord(value)) return false;
	if (!signals.tracesEnabled) return false;
	if (value.enabled !== true) return false;
	return value.inputMessages === true || value.outputMessages === true || value.toolInputs === true || value.toolOutputs === true || value.systemPrompt === true || value.toolDefinitions === true;
}
function pushMemorySessionTranscriptIndexing(entries, cfg) {
	const memory = asNonArrayRecord(cfg.memory);
	const defaultsMemorySearch = asNonArrayRecord(memory.search);
	const defaultSessionMemory = memorySearchSessionTranscriptIndexing(defaultsMemorySearch);
	if (defaultSessionMemory !== void 0) {
		const defaultExperimental = isRecord(defaultsMemorySearch.experimental) ? defaultsMemorySearch.experimental : {};
		entries.push({
			id: "agents-defaults-memory-session-transcripts",
			kind: "memorySessionTranscriptIndexing",
			source: asBoolean(defaultsMemorySearch.rememberAcrossConversations) === void 0 && asBoolean(defaultExperimental.sessionMemory) !== void 0 ? "oc://openclaw.config/memory/search/experimental/sessionMemory" : "oc://openclaw.config/memory/search/rememberAcrossConversations",
			scope: "global",
			value: defaultSessionMemory,
			explicit: true
		});
	}
	const configuredAgents = collectPolicyConfiguredAgents(asNonArrayRecord(cfg.agents));
	if (configuredAgents.length === 0) return;
	configuredAgents.forEach((configured) => {
		const { agentId, value: rawAgent } = configured;
		if (!isRecord(rawAgent)) return;
		const agentMemory = isRecord(rawAgent.memory) ? rawAgent.memory : void 0;
		const memorySearch = isRecord(agentMemory?.search) ? agentMemory.search : void 0;
		const agentSessionMemory = memorySearch === void 0 ? defaultSessionMemory : memorySearchSessionTranscriptIndexing(memorySearch, defaultsMemorySearch);
		if (agentSessionMemory === void 0) return;
		const explicit = memorySearchSessionTranscriptIndexingHasLocalConfig(memorySearch);
		const experimental = asNonArrayRecord(memorySearch?.experimental);
		entries.push({
			id: `${agentId}-memory-session-transcripts`,
			kind: "memorySessionTranscriptIndexing",
			source: explicit ? asBoolean(memorySearch?.rememberAcrossConversations) === void 0 && asBoolean(experimental.sessionMemory) !== void 0 ? `${configured.sourceBase}/memory/search/experimental/sessionMemory` : `${configured.sourceBase}/memory/search/rememberAcrossConversations` : "oc://openclaw.config/memory/search/rememberAcrossConversations",
			scope: "agent",
			agentId: normalizeAgentId(agentId),
			value: agentSessionMemory,
			explicit
		});
	});
}
function memorySearchSessionTranscriptIndexing(memorySearch, inheritedMemorySearch) {
	if (!isRecord(memorySearch)) return;
	const inherited = asNonArrayRecord(inheritedMemorySearch);
	const enabled = asBoolean(memorySearch.enabled) ?? asBoolean(inherited.enabled) ?? true;
	const experimental = asNonArrayRecord(memorySearch.experimental);
	const inheritedExperimental = asNonArrayRecord(inherited.experimental);
	const rememberAcrossConversations = asBoolean(memorySearch.rememberAcrossConversations) ?? asBoolean(experimental.sessionMemory) ?? asBoolean(inherited.rememberAcrossConversations) ?? asBoolean(inheritedExperimental.sessionMemory);
	const sourcesIncludeSessions = memorySearchSourcesIncludeSessions(memorySearch) ?? memorySearchSourcesIncludeSessions(inherited) ?? false;
	if (rememberAcrossConversations === void 0 && asBoolean(experimental.sessionMemory) === void 0 && memorySearchSourcesIncludeSessions(memorySearch) === void 0 && asBoolean(memorySearch.enabled) === void 0) return;
	if (!enabled) return false;
	return rememberAcrossConversations === true && sourcesIncludeSessions;
}
function memorySearchSessionTranscriptIndexingHasLocalConfig(memorySearch) {
	if (!isRecord(memorySearch)) return false;
	return asBoolean(memorySearch.enabled) !== void 0 || asBoolean(memorySearch.rememberAcrossConversations) !== void 0 || asBoolean(isRecord(memorySearch.experimental) ? memorySearch.experimental.sessionMemory : void 0) !== void 0 || memorySearchSourcesIncludeSessions(memorySearch) !== void 0;
}
function memorySearchSourcesIncludeSessions(memorySearch) {
	if (!isRecord(memorySearch) || memorySearch.sources === void 0) return;
	if (!Array.isArray(memorySearch.sources)) return false;
	return memorySearch.sources.includes("sessions");
}
function scanPolicySecretProviders(cfg) {
	const secrets = asNonArrayRecord(cfg.secrets);
	const providers = asNonArrayRecord(secrets.providers);
	return Object.entries(providers).map(([id, value]) => {
		const insecure = secretProviderInsecureFlags(value);
		const entry = {
			id,
			kind: "provider",
			source: `oc://openclaw.config/secrets/providers/${ocPathSegment$1(id)}`
		};
		if (isRecord(value) && typeof value.source === "string") entry.providerSource = value.source;
		if (insecure.length > 0) entry.insecure = insecure;
		return entry;
	});
}
function scanPolicySecretInputs(cfg) {
	const entries = [];
	collectSecretInputs(entries, cfg, [], secretRefDefaults(asNonArrayRecord(cfg.secrets).defaults));
	return entries;
}
function collectSecretInputs(entries, value, path, defaults) {
	if (Array.isArray(value)) {
		value.forEach((item, index) => collectSecretInputs(entries, item, [...path, `#${index}`], defaults));
		return;
	}
	if (!isRecord(value)) return;
	for (const [key, child] of Object.entries(value)) {
		const childPath = [...path, key];
		const source = configPathSource(childPath);
		const ref = isSecretInputPath(childPath) ? secretRefEvidence(child, defaults) : void 0;
		if (ref !== void 0) {
			entries.push({
				id: source,
				kind: "input",
				source,
				provenance: "secretRef",
				refSource: ref.source,
				refProvider: ref.provider
			});
			continue;
		}
		collectSecretInputs(entries, child, childPath, defaults);
	}
}
function configPathSource(path) {
	return `oc://openclaw.config/${path.map(ocPathSegment$1).join("/")}`;
}
function isSecretInputPath(path) {
	const key = path.at(-1);
	if (key === void 0) return false;
	if (matchesConfigPath(path, [
		"plugins",
		"entries",
		"acpx",
		"config",
		"mcpServers",
		"*",
		"env",
		"*"
	])) return true;
	if (isRawEnvMapValuePath(path)) return false;
	if (isSecretInputKey(key)) return true;
	return matchesConfigPath(path, [
		"models",
		"providers",
		"*",
		"headers",
		"*"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"models",
		"providers",
		"*"
	]) || isMediaConfiguredProviderRequestSecretPath(path) || matchesConfigPath(path, [
		"memory",
		"search",
		"remote",
		"headers",
		"*"
	]) || matchesConfigPath(path, [
		"agents",
		"entries",
		"*",
		"memory",
		"search",
		"remote",
		"headers",
		"*"
	]) || matchesConfigPath(path, [
		"agents",
		"list",
		"#",
		"memory",
		"search",
		"remote",
		"headers",
		"*"
	]) || matchesConfigPath(path, [
		"diagnostics",
		"otel",
		"headers",
		"*"
	]);
}
function isRawEnvMapValuePath(path) {
	return path.length >= 2 && path.at(-2) === "env";
}
function isMediaConfiguredProviderRequestSecretPath(path) {
	return isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"models",
		"#"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"audio"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"image"
	]) || isConfiguredProviderRequestSecretPath(path, [
		"tools",
		"media",
		"video"
	]);
}
function isConfiguredProviderRequestSecretPath(path, prefix) {
	if (path.length < prefix.length + 3) return false;
	if (!matchesConfigPathPrefix(path, prefix)) return false;
	const requestIndex = prefix.length;
	if (path[requestIndex] !== "request") return false;
	const suffix = path.slice(requestIndex + 1);
	if (suffix.length === 2 && suffix[0] === "headers") return true;
	if (suffix.length === 2 && suffix[0] === "auth" && isConfiguredProviderAuthSecretKey(suffix[1])) return true;
	if (suffix.length === 2 && suffix[0] === "tls" && isConfiguredProviderTlsSecretKey(suffix[1])) return true;
	return suffix.length === 3 && suffix[0] === "proxy" && suffix[1] === "tls" && isConfiguredProviderTlsSecretKey(suffix[2]);
}
function matchesConfigPathPrefix(path, prefix) {
	if (path.length < prefix.length) return false;
	return prefix.every((segment, index) => {
		const value = path[index];
		if (segment === "*") return value !== void 0 && value !== "";
		if (segment === "#") return value?.startsWith("#") ?? false;
		return value === segment;
	});
}
function matchesConfigPath(path, pattern) {
	return path.length === pattern.length && matchesConfigPathPrefix(path, pattern);
}
function isConfiguredProviderTlsSecretKey(key) {
	return key === "ca" || key === "cert" || key === "key" || key === "passphrase";
}
function isConfiguredProviderAuthSecretKey(key) {
	return key === "token" || key === "value";
}
function isSecretInputKey(key) {
	const normalized = key.toLowerCase();
	return normalized === "apikey" || normalized === "keyref" || normalized === "token" || normalized === "tokenref" || normalized === "password" || normalized === "secret" || normalized === "encryptkey" || normalized === "webhooksecret" || normalized === "serviceaccount" || normalized === "serviceaccountref" || normalized === "privatekey" || normalized === "certificate" || normalized === "certificatedata" || normalized === "identitydata" || normalized === "knownhosts" || normalized === "knownhostsdata" || normalized.endsWith("apikey") || normalized.endsWith("token") || normalized.endsWith("secret") || normalized.endsWith("password");
}
function secretRefDefaults(value) {
	if (!isRecord(value)) return;
	const defaults = {};
	if (typeof value.env === "string") defaults.env = value.env;
	if (typeof value.file === "string") defaults.file = value.file;
	if (typeof value.exec === "string") defaults.exec = value.exec;
	if (typeof value.store === "string") defaults.store = value.store;
	return defaults;
}
function secretRefEvidence(value, defaults) {
	const ref = coerceSecretRef(value, defaults);
	return ref === null ? void 0 : {
		source: ref.source,
		provider: ref.provider,
		id: ref.id
	};
}
function secretProviderInsecureFlags(value) {
	return [];
}
function isValidAuthProfileMetadata(value) {
	if (!isRecord(value)) return false;
	return typeof value.provider === "string" && value.provider.trim() !== "" && isAuthProfileMode(value.mode);
}
function isAuthProfileMode(value) {
	return value === "api_key" || value === "aws-sdk" || value === "oauth" || value === "token";
}
//#endregion
//#region extensions/policy/src/policy-state-exec-approvals.ts
const DEFAULT_EXEC_APPROVAL_AGENT_ID = "main";
function scanPolicyExecApprovals(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [];
	}
	if (!isRecord(parsed) || parsed.version !== 1) return [];
	const evidence = [];
	const defaults = asNonArrayRecord(parsed.defaults);
	evidence.push(execApprovalPostureEvidence("defaults", "defaults", defaults, execApprovalsPolicyUri("defaults")));
	for (const agent of normalizedExecApprovalAgents(parsed.agents)) {
		const agentSource = execApprovalsPolicyUri(`agents/${ocPathSegment$1(agent.sourceAgentId)}`);
		evidence.push(execApprovalPostureEvidence(`agent:${agent.agentId}`, "agent", agent.value, agentSource, agent.agentId));
		for (const [index, entry] of agent.allowlistEntries.entries()) {
			const allowlistSource = execApprovalsPolicyUri(`agents/${ocPathSegment$1(entry.sourceAgentId)}/allowlist/#${entry.index}`);
			evidence.push({
				id: `agent:${agent.agentId}:allowlist:${index}`,
				kind: "allowlist",
				source: allowlistSource,
				agentId: agent.agentId,
				pattern: entry.pattern,
				...entry.argPattern === void 0 ? {} : { argPattern: entry.argPattern },
				...entry.entrySource === void 0 ? {} : { entrySource: entry.entrySource }
			});
		}
	}
	return evidence;
}
function execApprovalPostureEvidence(id, kind, value, source, agentId) {
	const security = readExecApprovalSecurity(value.security);
	const ask = readExecApprovalAsk(value.ask);
	const askFallback = readExecApprovalSecurity(value.askFallback);
	const autoAllowSkills = asBoolean(value.autoAllowSkills);
	return {
		id,
		kind,
		source,
		...agentId === void 0 ? {} : { agentId },
		...value.security == null ? {} : { securityConfigured: true },
		...security === void 0 ? {} : { security },
		...ask === void 0 ? {} : { ask },
		...askFallback === void 0 ? {} : { askFallback },
		...autoAllowSkills === void 0 ? {} : { autoAllowSkills }
	};
}
function readExecApprovalSecurity(value) {
	const normalized = normalizeOptionalString(value);
	return normalized === "deny" || normalized === "allowlist" || normalized === "full" ? normalized : void 0;
}
function readExecApprovalAsk(value) {
	const normalized = normalizeOptionalString(value);
	return normalized === "off" || normalized === "on-miss" || normalized === "always" ? normalized : void 0;
}
function normalizedExecApprovalAgents(rawAgents) {
	if (!isRecord(rawAgents)) return [];
	const agents = Object.entries(rawAgents).filter((entry) => isRecord(entry[1]));
	const legacyDefault = agents.find(([agentId]) => agentId === "default")?.[1];
	const normalized = agents.filter(([agentId]) => agentId !== "default").map(([agentId, value]) => {
		if (agentId === DEFAULT_EXEC_APPROVAL_AGENT_ID && legacyDefault !== void 0) return {
			agentId,
			sourceAgentId: agentId,
			value: mergeLegacyExecApprovalAgent(value, legacyDefault),
			allowlistEntries: mergedExecApprovalAllowlistEntries(value.allowlist, legacyDefault.allowlist)
		};
		return execApprovalAgentFromParts(agentId, agentId, value);
	});
	if (legacyDefault !== void 0 && !agents.some(([agentId]) => agentId === DEFAULT_EXEC_APPROVAL_AGENT_ID)) normalized.push(execApprovalAgentFromParts(DEFAULT_EXEC_APPROVAL_AGENT_ID, "default", legacyDefault));
	return normalized.toSorted((a, b) => a.agentId.localeCompare(b.agentId));
}
function execApprovalAgentFromParts(agentId, sourceAgentId, value) {
	return {
		agentId,
		sourceAgentId,
		value,
		allowlistEntries: execApprovalAllowlistEntries$1(value.allowlist).map((entry) => ({
			index: entry.index,
			pattern: entry.pattern,
			argPattern: entry.argPattern,
			entrySource: entry.entrySource,
			sourceAgentId
		}))
	};
}
function mergeLegacyExecApprovalAgent(current, legacy) {
	return {
		...legacy,
		...current,
		security: current.security ?? legacy.security,
		ask: current.ask ?? legacy.ask,
		askFallback: current.askFallback ?? legacy.askFallback,
		autoAllowSkills: current.autoAllowSkills ?? legacy.autoAllowSkills,
		allowlist: mergedExecApprovalAllowlist(current.allowlist, legacy.allowlist)
	};
}
function mergedExecApprovalAllowlist(current, legacy) {
	const entries = mergedExecApprovalAllowlistEntries(current, legacy).map((entry) => {
		const allowlistEntry = { pattern: entry.pattern };
		if (entry.argPattern !== void 0) allowlistEntry.argPattern = entry.argPattern;
		if (entry.entrySource !== void 0) allowlistEntry.source = entry.entrySource;
		return allowlistEntry;
	});
	return entries.length === 0 ? void 0 : entries;
}
function mergedExecApprovalAllowlistEntries(current, legacy) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	const appendEntries = (sourceEntries) => {
		for (const sourceEntry of sourceEntries) {
			const key = `${sourceEntry.pattern.toLowerCase()}\x00${sourceEntry.argPattern ?? ""}`;
			if (seen.has(key)) continue;
			seen.add(key);
			entries.push(sourceEntry);
		}
	};
	appendEntries(withExecApprovalAllowlistSource(current, DEFAULT_EXEC_APPROVAL_AGENT_ID));
	appendEntries(withExecApprovalAllowlistSource(legacy, "default"));
	return entries;
}
function withExecApprovalAllowlistSource(value, sourceAgentId) {
	return execApprovalAllowlistEntries$1(value).map((entry) => ({
		index: entry.index,
		pattern: entry.pattern,
		argPattern: entry.argPattern,
		entrySource: entry.entrySource,
		sourceAgentId
	}));
}
function readExecApprovalAllowlistEntrySource(value) {
	return normalizeOptionalString(value) === "allow-always" ? "allow-always" : void 0;
}
function execApprovalAllowlistEntries$1(value) {
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const [index, entry] of value.entries()) {
		if (typeof entry === "string") {
			const pattern = entry.trim();
			if (pattern !== "") entries.push({
				index,
				pattern
			});
			continue;
		}
		if (!isRecord(entry)) continue;
		const pattern = normalizeOptionalString(entry.pattern);
		if (pattern === void 0) continue;
		const argPattern = normalizeOptionalString(entry.argPattern);
		const entrySource = readExecApprovalAllowlistEntrySource(entry.source);
		entries.push({
			index,
			pattern,
			...argPattern === void 0 ? {} : { argPattern },
			...entrySource === void 0 ? {} : { entrySource }
		});
	}
	return entries;
}
//#endregion
//#region extensions/policy/src/policy-state-gateway.ts
function scanPolicyGatewayExposure(cfg) {
	const gateway = asNonArrayRecord(cfg.gateway);
	const entries = [];
	const bind = typeof gateway.bind === "string" ? gateway.bind : void 0;
	const customBindHost = typeof gateway.customBindHost === "string" ? gateway.customBindHost : void 0;
	const hasCustomBindHost = customBindHost !== void 0 && customBindHost.trim() !== "";
	const tailscale = asNonArrayRecord(gateway.tailscale);
	const tailscaleForcesLoopback = tailscale.mode === "serve" || tailscale.mode === "funnel";
	entries.push({
		id: bind === void 0 ? "gateway-bind-default" : "gateway-bind",
		kind: "bind",
		source: "oc://openclaw.config/gateway/bind",
		value: bind ?? (tailscaleForcesLoopback ? "loopback" : "runtime-default"),
		nonLoopback: bind === void 0 ? !tailscaleForcesLoopback : bind === "custom" ? false : isGatewayNonLoopbackBind(bind),
		explicit: bind !== void 0
	});
	if (bind === "custom" && hasCustomBindHost) entries.push({
		id: "gateway-custom-bind-host",
		kind: "bind",
		source: "oc://openclaw.config/gateway/customBindHost",
		value: customBindHost,
		nonLoopback: isRuntimeNonLoopbackCustomBindHost(customBindHost)
	});
	const auth = asNonArrayRecord(gateway.auth);
	entries.push({
		id: "gateway-auth-mode",
		kind: "auth",
		source: "oc://openclaw.config/gateway/auth/mode",
		value: typeof auth.mode === "string" ? auth.mode : "token",
		explicit: typeof auth.mode === "string"
	});
	entries.push({
		id: "gateway-auth-rate-limit",
		kind: "authRateLimit",
		source: "oc://openclaw.config/gateway/auth/rateLimit",
		value: isRecord(auth.rateLimit),
		explicit: isRecord(auth.rateLimit)
	});
	const controlUi = asNonArrayRecord(gateway.controlUi);
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-enabled", "controlUi", controlUi.enabled, "oc://openclaw.config/gateway/controlUi/enabled");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-insecure-auth", "controlUi", false, "oc://openclaw.invariant/gateway/controlUi/deviceIdentity");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-device-auth-disabled", "controlUi", false, "oc://openclaw.invariant/gateway/controlUi/deviceIdentity");
	pushGatewayBooleanEvidence(entries, "gateway-control-ui-host-origin-fallback", "controlUi", controlUi.dangerouslyAllowHostHeaderOriginFallback, "oc://openclaw.config/gateway/controlUi/dangerouslyAllowHostHeaderOriginFallback");
	if (typeof tailscale.mode === "string") entries.push({
		id: "gateway-tailscale-mode",
		kind: "tailscale",
		source: "oc://openclaw.config/gateway/tailscale/mode",
		value: tailscale.mode
	});
	if (tailscale.mode === "serve" && tailscale.preserveFunnel === true) entries.push({
		id: "gateway-tailscale-preserve-funnel",
		kind: "tailscale",
		source: "oc://openclaw.config/gateway/tailscale/preserveFunnel",
		value: "funnel"
	});
	const remote = asNonArrayRecord(gateway.remote);
	if (gateway.mode === "remote") {
		entries.push({
			id: "gateway-mode-remote",
			kind: "remote",
			source: "oc://openclaw.config/gateway/mode",
			value: "remote"
		});
		if (typeof remote.url === "string" && remote.url.trim() !== "") entries.push({
			id: "gateway-remote-url",
			kind: "remote",
			source: "oc://openclaw.config/gateway/remote/url",
			value: true
		});
	}
	const http = asNonArrayRecord(gateway.http);
	const endpoints = asNonArrayRecord(http.endpoints);
	pushGatewayHttpEndpointEvidence(entries, endpoints, "chatCompletions");
	pushGatewayHttpEndpointEvidence(entries, endpoints, "responses");
	pushGatewayNodeCommandEvidence(entries, asNonArrayRecord(gateway.nodes));
	return entries.toSorted((a, b) => a.source.localeCompare(b.source));
}
function pushGatewayBooleanEvidence(entries, id, kind, value, source) {
	if (typeof value !== "boolean") return;
	entries.push({
		id,
		kind,
		source,
		value
	});
}
function pushGatewayHttpEndpointEvidence(entries, endpoints, endpoint) {
	const config = endpoints[endpoint];
	if (!isRecord(config)) return;
	const source = `oc://openclaw.config/gateway/http/endpoints/${endpoint}`;
	const enabled = config.enabled === true;
	if (enabled) entries.push({
		id: `gateway-http-${endpoint}`,
		kind: "httpEndpoint",
		source: `${source}/enabled`,
		value: true,
		endpoint
	});
	if (!enabled) return;
	if (endpoint === "chatCompletions") {
		pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["images"], config.images);
		return;
	}
	pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["files"], config.files);
	pushGatewayHttpUrlFetchEvidence(entries, source, endpoint, ["images"], config.images);
}
function pushGatewayHttpUrlFetchEvidence(entries, endpointSource, endpoint, path, value) {
	const allowUrl = isRecord(value) ? value.allowUrl : void 0;
	if (allowUrl === false || allowUrl !== true && endpoint !== "responses") return;
	const allowlist = isRecord(value) ? value.urlAllowlist : void 0;
	const hasEffectiveAllowlist = Array.isArray(allowlist) && allowlist.some((entry) => isEffectiveGatewayUrlAllowlistEntry(entry));
	entries.push({
		id: `gateway-http-${endpoint}-${path.join("-")}-url-fetch`,
		kind: "httpUrlFetch",
		source: `${endpointSource}/${path.map(ocPathSegment$1).join("/")}/allowUrl`,
		value: true,
		endpoint,
		explicit: allowUrl === true,
		hasAllowlist: hasEffectiveAllowlist
	});
}
function pushGatewayNodeCommandEvidence(entries, nodes) {
	const commands = isRecord(nodes.commands) ? nodes.commands : null;
	const denyCommands = commands?.deny;
	const deniedCommands = new Set(Array.isArray(denyCommands) ? denyCommands.filter((command) => typeof command === "string").map((command) => command.trim()) : []);
	if (Array.isArray(denyCommands)) denyCommands.forEach((command, index) => {
		if (typeof command !== "string") return;
		const normalized = command.trim();
		if (normalized === "") return;
		entries.push({
			id: `gateway-node-deny-command-${normalized}`,
			kind: "nodeDenyCommand",
			source: `oc://openclaw.config/gateway/nodes/commands/deny/#${index}`,
			value: normalized,
			command: normalized
		});
	});
	const allowCommands = commands?.allow;
	if (!Array.isArray(allowCommands)) return;
	allowCommands.forEach((command, index) => {
		if (typeof command !== "string") return;
		const normalized = command.trim();
		if (normalized === "" || deniedCommands.has(normalized)) return;
		entries.push({
			id: `gateway-node-command-${normalized}`,
			kind: "nodeCommand",
			source: `oc://openclaw.config/gateway/nodes/commands/allow/#${index}`,
			value: normalized,
			command: normalized
		});
	});
}
function isEffectiveGatewayUrlAllowlistEntry(value) {
	if (typeof value !== "string") return false;
	const normalized = value.trim().toLowerCase();
	return normalized !== "" && normalized !== "*" && normalized !== "*.";
}
function isGatewayNonLoopbackBind(value) {
	return value === "auto" || value === "lan" || value === "custom" || value === "tailnet";
}
function isRuntimeNonLoopbackCustomBindHost(value) {
	const normalized = value.trim().toLowerCase();
	return isCanonicalDottedDecimalIPv4(normalized) && !normalized.startsWith("127.");
}
function isCanonicalDottedDecimalIPv4(value) {
	return /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(value);
}
//#endregion
//#region extensions/policy/src/policy-state-tool-posture.ts
function scanPolicyToolPosture(cfg) {
	const globalTools = asNonArrayRecord(cfg.tools);
	const agents = asNonArrayRecord(cfg.agents);
	const defaults = asNonArrayRecord(agents.defaults);
	const defaultSandbox = asNonArrayRecord(defaults.sandbox);
	const entries = [];
	pushToolPostureEvidence(entries, {
		id: "tools",
		scope: "global",
		tools: globalTools,
		inheritedTools: {},
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		sourceBase: "oc://openclaw.config/tools",
		inheritedSourceBase: "oc://openclaw.config/tools"
	});
	collectPolicyConfiguredAgents(agents).forEach((configured) => {
		const agent = configured.value;
		if (!isRecord(agent)) return;
		pushToolPostureEvidence(entries, {
			id: configured.agentId,
			scope: "agent",
			agentId: configured.agentId,
			tools: asNonArrayRecord(agent.tools),
			inheritedTools: globalTools,
			sandbox: asNonArrayRecord(agent.sandbox),
			inheritedSandbox: defaultSandbox,
			sourceBase: `${configured.sourceBase}/tools`,
			inheritedSourceBase: "oc://openclaw.config/tools"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function pushToolPostureEvidence(entries, params) {
	const localProfile = normalizeOptionalString(params.tools.profile);
	const inheritedProfile = normalizeOptionalString(params.inheritedTools.profile);
	pushToolPostureValue(entries, params, {
		suffix: "profile",
		kind: "profile",
		value: localProfile ?? inheritedProfile ?? "full",
		explicit: localProfile !== void 0 || inheritedProfile !== void 0,
		inherited: localProfile === void 0 && inheritedProfile !== void 0
	});
	pushToolPostureList(entries, params, "allow");
	pushToolAlsoAllowPostureList(entries, params);
	pushToolPostureList(entries, params, "deny");
	pushToolFsPosture(entries, params);
	pushToolExecPosture(entries, params);
	pushToolElevatedPosture(entries, params);
}
function pushToolFsPosture(entries, params) {
	const localFs = asNonArrayRecord(params.tools.fs);
	const inheritedFs = asNonArrayRecord(params.inheritedTools.fs);
	const localWorkspaceOnly = asBoolean(localFs.workspaceOnly);
	const inheritedWorkspaceOnly = asBoolean(inheritedFs.workspaceOnly);
	pushToolPostureValue(entries, params, {
		suffix: "fs/workspaceOnly",
		kind: "fsWorkspaceOnly",
		value: localWorkspaceOnly ?? inheritedWorkspaceOnly ?? false,
		explicit: localWorkspaceOnly !== void 0 || inheritedWorkspaceOnly !== void 0,
		inherited: localWorkspaceOnly === void 0 && inheritedWorkspaceOnly !== void 0
	});
}
function pushToolExecPosture(entries, params) {
	const localExec = asNonArrayRecord(params.tools.exec);
	const inheritedExec = asNonArrayRecord(params.inheritedTools.exec);
	const localHost = normalizeOptionalString(localExec.host);
	const inheritedHost = normalizeOptionalString(inheritedExec.host);
	const host = localHost ?? inheritedHost ?? "auto";
	pushToolPostureValue(entries, params, {
		suffix: "exec/host",
		kind: "execHost",
		value: host,
		explicit: localHost !== void 0 || inheritedHost !== void 0,
		inherited: localHost === void 0 && inheritedHost !== void 0
	});
	const localSecurity = normalizeOptionalString(localExec.security);
	const inheritedSecurity = normalizeOptionalString(inheritedExec.security);
	const localAsk = normalizeOptionalString(localExec.ask);
	const inheritedAsk = normalizeOptionalString(inheritedExec.ask);
	const localMode = readExecMode(localExec.mode);
	const inheritedMode = readExecMode(inheritedExec.mode);
	const sandboxCanApply = (normalizeOptionalString(params.sandbox.mode) ?? normalizeOptionalString(params.inheritedSandbox.mode)) === "all";
	const defaultSecurity = host === "sandbox" || host === "auto" && sandboxCanApply ? "deny" : "full";
	const selectedMode = localMode === void 0 ? inheritedMode === void 0 ? void 0 : {
		value: inheritedMode,
		inherited: true
	} : {
		value: localMode,
		inherited: false
	};
	const modePosture = selectedMode === void 0 ? void 0 : {
		...selectedMode,
		...resolveExecModePolicy({
			mode: selectedMode.value,
			security: "full",
			ask: "off"
		})
	};
	const securityUsesMode = modePosture?.inherited === false || localSecurity === void 0 && modePosture?.inherited === true;
	const security = modePosture?.inherited === false ? modePosture.security : localSecurity ?? modePosture?.security ?? inheritedSecurity ?? defaultSecurity;
	pushToolPostureValue(entries, params, {
		suffix: "exec/security",
		sourceSuffix: securityUsesMode ? "exec/mode" : void 0,
		kind: "execSecurity",
		value: security,
		explicit: modePosture !== void 0 || localSecurity !== void 0 || inheritedSecurity !== void 0,
		inherited: modePosture?.inherited === true ? localSecurity === void 0 : localSecurity === void 0 && inheritedSecurity !== void 0
	});
	const askUsesMode = modePosture?.inherited === false || localAsk === void 0 && modePosture?.inherited === true;
	const ask = modePosture?.inherited === false ? modePosture.ask : localAsk ?? modePosture?.ask ?? inheritedAsk ?? "off";
	pushToolPostureValue(entries, params, {
		suffix: "exec/ask",
		sourceSuffix: askUsesMode ? "exec/mode" : void 0,
		kind: "execAsk",
		value: ask,
		explicit: modePosture !== void 0 || localAsk !== void 0 || inheritedAsk !== void 0,
		inherited: modePosture?.inherited === true ? localAsk === void 0 : localAsk === void 0 && inheritedAsk !== void 0
	});
}
function pushToolElevatedPosture(entries, params) {
	const localElevated = asNonArrayRecord(params.tools.elevated);
	const inheritedElevated = isRecord(params.inheritedTools.elevated) ? params.inheritedTools.elevated : {};
	const localEnabled = asBoolean(localElevated.enabled);
	const inheritedEnabled = asBoolean(inheritedElevated.enabled);
	pushToolPostureValue(entries, params, {
		suffix: "elevated/enabled",
		kind: "elevatedEnabled",
		value: inheritedEnabled === false ? false : localEnabled ?? inheritedEnabled ?? true,
		explicit: localEnabled !== void 0 || inheritedEnabled !== void 0,
		inherited: inheritedEnabled === false && localEnabled !== false || localEnabled === void 0 && inheritedEnabled !== void 0
	});
	const localAllowFrom = asNonArrayRecord(localElevated.allowFrom);
	const inheritedAllowFrom = isRecord(inheritedElevated.allowFrom) ? inheritedElevated.allowFrom : {};
	const providers = [.../* @__PURE__ */ new Set([...Object.keys(inheritedAllowFrom), ...Object.keys(localAllowFrom)])].toSorted((a, b) => a.localeCompare(b));
	for (const provider of providers) {
		const localEntries = readStringOrNumberArray(localAllowFrom[provider]);
		const inheritedEntries = readStringOrNumberArray(inheritedAllowFrom[provider]);
		const inherited = localEntries.length === 0 && inheritedEntries.length > 0;
		entries.push({
			id: `${params.id}-elevated-allow-from-${ocPathSegment$1(provider)}`,
			kind: "elevatedAllowFrom",
			source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/elevated/allowFrom/${ocPathSegment$1(provider)}`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			entries: localEntries.length > 0 ? localEntries : inheritedEntries,
			explicit: localEntries.length > 0 || inheritedEntries.length > 0
		});
	}
}
function pushToolPostureValue(entries, params, entry) {
	entries.push({
		id: `${params.id}-${entry.suffix.replaceAll("/", "-")}`,
		kind: entry.kind,
		source: `${entry.inherited ? params.inheritedSourceBase : params.sourceBase}/${entry.sourceSuffix ?? entry.suffix}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...entry.value === void 0 ? {} : { value: entry.value },
		explicit: entry.explicit
	});
}
function readExecMode(value) {
	const mode = normalizeOptionalString(value)?.toLowerCase();
	switch (mode) {
		case "deny":
		case "allowlist":
		case "ask":
		case "auto":
		case "full": return mode;
		default: return;
	}
}
function pushToolPostureList(entries, params, key) {
	const localEntries = readStringArray(params.tools[key]);
	const inheritedEntries = readStringArray(params.inheritedTools[key]);
	const inherited = localEntries.length === 0 && inheritedEntries.length > 0;
	entries.push({
		id: `${params.id}-${key}`,
		kind: key,
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/${key}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		entries: [...inheritedEntries, ...localEntries],
		explicit: localEntries.length > 0 || inheritedEntries.length > 0
	});
}
function pushToolAlsoAllowPostureList(entries, params) {
	const localValue = params.tools.alsoAllow;
	const inheritedValue = params.inheritedTools.alsoAllow;
	const localConfigured = Array.isArray(localValue);
	const inheritedConfigured = Array.isArray(inheritedValue);
	const localEntries = localConfigured ? readStringArray(localValue) : [];
	const inheritedEntries = inheritedConfigured ? readStringArray(inheritedValue) : [];
	const inherited = !localConfigured && inheritedConfigured;
	entries.push({
		id: `${params.id}-alsoAllow`,
		kind: "alsoAllow",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/alsoAllow`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		entries: inherited ? inheritedEntries : localEntries,
		explicit: localConfigured || inheritedConfigured
	});
}
const AGENT_WORKSPACE_POLICY_TOOLS = [
	"exec",
	"process",
	"write",
	"edit",
	"apply_patch"
];
const IMPLICIT_DEFAULT_ACCOUNT_FIELDS = {
	discord: ["token"],
	googlechat: ["serviceAccount", "serviceAccountFile"],
	imessage: ["cliPath", "dbPath"],
	"qa-channel": ["baseUrl"],
	qqbot: [
		"appId",
		"clientSecret",
		"clientSecretFile"
	],
	signal: ["account"],
	slack: [
		"appToken",
		"botToken",
		"signingSecret"
	],
	"synology-chat": ["token"],
	telegram: ["botToken", "tokenFile"],
	tlon: ["ship"],
	twitch: ["username"],
	whatsapp: ["authDir"],
	zalo: ["botToken", "tokenFile"],
	zalouser: ["profile"]
};
function readStringArray(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
function readStringOrNumberArray(value) {
	if (!Array.isArray(value)) return [];
	const entries = [];
	for (const entry of value) if (typeof entry === "string" && entry.trim() !== "") entries.push(entry.trim());
	else if (typeof entry === "number" && Number.isFinite(entry)) entries.push(String(entry));
	return entries;
}
//#endregion
//#region extensions/policy/src/policy-state-ingress.ts
const ALLOWLIST_DEFAULT_INGRESS_GROUP_POLICY_CHANNELS = /* @__PURE__ */ new Set([
	"googlechat",
	"irc",
	"line",
	"mattermost",
	"matrix",
	"msteams",
	"nextcloud-talk",
	"signal"
]);
const OPEN_GROUPS_DEFAULT_TO_NO_MENTION_CHANNELS = /* @__PURE__ */ new Set(["feishu", "qa-channel"]);
function scanPolicyIngress(cfg) {
	const channels = configuredChannels(cfg);
	const inheritedChannelDefaults = pickSupportedIngressDefaults(asNonArrayRecord(channels.defaults));
	const channelDefaultsSource = "oc://openclaw.config/channels/defaults";
	const entries = [];
	const session = asNonArrayRecord(cfg.session);
	const dmScope = normalizeOptionalString(session.dmScope)?.toLowerCase();
	entries.push({
		id: "session-dm-scope",
		kind: "sessionDmScope",
		source: "oc://openclaw.config/session/dmScope",
		value: dmScope ?? "main",
		explicit: dmScope !== void 0
	});
	for (const [channel, value] of Object.entries(channels)) {
		if (RESERVED_CHANNEL_CONFIG_KEYS.has(channel) || !isRecord(value) || value.enabled === false) continue;
		const channelSource = `oc://openclaw.config/channels/${ocPathSegment$1(channel)}`;
		const accounts = asNonArrayRecord(value.accounts);
		const configuredAccounts = Object.entries(accounts).filter((entry) => isRecord(entry[1]));
		const activeAccounts = configuredAccounts.filter(([, account]) => account.enabled !== false);
		if (configuredAccounts.length === 0 || hasImplicitDefaultAccountConfig(channel, value)) pushChannelIngress(entries, {
			channel,
			config: value,
			inheritedConfig: inheritedChannelDefaults,
			sourceBase: channelSource,
			inheritedSourceBase: channelDefaultsSource,
			fallbackSourceBase: channelSource
		});
		for (const [accountId, account] of activeAccounts) pushChannelIngress(entries, {
			channel,
			accountId,
			config: account,
			inheritedConfig: value,
			inheritNestedContainers: true,
			inheritEmptyNestedContainers: channel === "telegram" && configuredAccounts.length <= 1,
			sourceBase: `${channelSource}/accounts/${ocPathSegment$1(accountId)}`,
			inheritedSourceBase: channelSource,
			fallbackConfig: inheritedChannelDefaults,
			fallbackSourceBase: channelDefaultsSource
		});
	}
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function pickSupportedIngressDefaults(config) {
	const result = {};
	if (config.groupPolicy !== void 0) result.groupPolicy = config.groupPolicy;
	return result;
}
function hasImplicitDefaultAccountConfig(channel, config) {
	switch (channel) {
		case "clickclack": return hasConfiguredAccountValue(config.baseUrl) && hasConfiguredAccountValue(config.workspace) && hasConfiguredAccountValue(config.token);
		case "feishu": return hasConfiguredAccountValue(config.appId) && hasConfiguredAccountValue(config.appSecret);
		case "irc": return hasConfiguredAccountValue(config.host) && hasConfiguredAccountValue(config.nick);
		case "line": return hasConfiguredAccountValue(config.channelAccessToken) || hasConfiguredAccountValue(config.tokenFile);
		case "matrix": return hasConfiguredAccountValue(config.homeserver) && (hasConfiguredAccountValue(config.accessToken) || hasConfiguredAccountValue(config.userId) && hasConfiguredAccountValue(config.password));
		case "mattermost": return hasConfiguredAccountValue(config.baseUrl) && hasConfiguredAccountValue(config.botToken);
		case "nextcloud-talk": return hasConfiguredAccountValue(config.baseUrl) && (hasConfiguredAccountValue(config.botSecret) || hasConfiguredAccountValue(config.botSecretFile));
		default: return (IMPLICIT_DEFAULT_ACCOUNT_FIELDS[channel] ?? []).some((field) => hasConfiguredAccountValue(config[field]));
	}
}
function hasConfiguredAccountValue(value) {
	return typeof value === "string" ? value.trim().length > 0 : value !== void 0 && value !== null;
}
function pushChannelIngress(entries, params) {
	const localDmPolicy = channelDmPolicy(params.config);
	const inheritedDmPolicy = channelDmPolicy(params.inheritedConfig);
	const fallbackDmPolicy = channelDmPolicy(params.fallbackConfig ?? {});
	const effectiveDmPolicy = localDmPolicy.disabledByEnabled === true ? localDmPolicy : localDmPolicy.value !== void 0 ? localDmPolicy : inheritedDmPolicy.disabledByEnabled === true ? inheritedDmPolicy : inheritedDmPolicy.value !== void 0 ? inheritedDmPolicy : fallbackDmPolicy.disabledByEnabled === true || fallbackDmPolicy.value !== void 0 ? fallbackDmPolicy : void 0;
	const dmPolicySource = effectiveDmPolicy?.sourceSuffix === void 0 ? `${params.fallbackSourceBase}/dmPolicy` : effectiveDmPolicy === localDmPolicy ? `${params.sourceBase}/${effectiveDmPolicy.sourceSuffix}` : effectiveDmPolicy === inheritedDmPolicy ? `${params.inheritedSourceBase}/${effectiveDmPolicy.sourceSuffix}` : `${params.fallbackSourceBase}/${effectiveDmPolicy.sourceSuffix}`;
	entries.push({
		id: channelIngressId(params, "dm-policy"),
		kind: "channelDmPolicy",
		source: dmPolicySource,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: effectiveDmPolicy?.value ?? "pairing",
		explicit: effectiveDmPolicy !== void 0
	});
	const localGroupPolicy = normalizeOptionalString(params.config.groupPolicy);
	const inheritedGroupPolicy = normalizeOptionalString(params.inheritedConfig.groupPolicy);
	const fallbackGroupPolicy = normalizeOptionalString(params.fallbackConfig?.groupPolicy);
	const implicitGroupPolicy = channelImplicitGroupPolicy(params);
	entries.push({
		id: channelIngressId(params, "group-policy"),
		kind: "channelGroupPolicy",
		source: localGroupPolicy !== void 0 ? `${params.sourceBase}/groupPolicy` : inheritedGroupPolicy !== void 0 ? `${params.inheritedSourceBase}/groupPolicy` : fallbackGroupPolicy !== void 0 ? `${params.fallbackSourceBase}/groupPolicy` : implicitGroupPolicy.source,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: localGroupPolicy ?? inheritedGroupPolicy ?? fallbackGroupPolicy ?? implicitGroupPolicy.value,
		explicit: localGroupPolicy !== void 0 || inheritedGroupPolicy !== void 0 || fallbackGroupPolicy !== void 0
	});
	pushChannelRequireMentionIngress(entries, params);
}
function channelImplicitGroupPolicy(params) {
	const groups = effectiveNestedIngressContainer(params, "groups");
	if (groups !== void 0) return {
		source: `${groups.sourceBase}/groups`,
		value: "allowlist"
	};
	const fallbackGroups = isRecord(params.fallbackConfig?.groups) ? params.fallbackConfig.groups : void 0;
	if (fallbackGroups !== void 0 && Object.keys(fallbackGroups).length > 0) return {
		source: `${params.fallbackSourceBase}/groups`,
		value: "allowlist"
	};
	return {
		source: `${params.sourceBase}/groupPolicy`,
		value: ALLOWLIST_DEFAULT_INGRESS_GROUP_POLICY_CHANNELS.has(params.channel) ? "allowlist" : "open"
	};
}
function pushChannelRequireMentionIngress(entries, params) {
	const localRequireMention = asBoolean(params.config.requireMention);
	const inheritedRequireMention = asBoolean(params.inheritedConfig.requireMention);
	const fallbackRequireMention = asBoolean(params.fallbackConfig?.requireMention);
	const wildcardRequireMention = channelWildcardRequireMention(params);
	const defaultRequireMention = channelDefaultRequireMention(params);
	entries.push({
		id: channelIngressId(params, "require-mention"),
		kind: "channelRequireMention",
		source: wildcardRequireMention !== void 0 ? wildcardRequireMention.source : localRequireMention !== void 0 ? `${params.sourceBase}/requireMention` : inheritedRequireMention !== void 0 ? `${params.inheritedSourceBase}/requireMention` : fallbackRequireMention !== void 0 ? `${params.fallbackSourceBase}/requireMention` : `${params.sourceBase}/requireMention`,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		value: wildcardRequireMention?.value ?? localRequireMention ?? inheritedRequireMention ?? fallbackRequireMention ?? defaultRequireMention,
		explicit: wildcardRequireMention !== void 0 || localRequireMention !== void 0 || inheritedRequireMention !== void 0 || fallbackRequireMention !== void 0
	});
	const containers = nestedIngressContainers(params);
	for (const { containerKey, container, sourceBase } of containers) for (const [groupId, groupConfig] of Object.entries(container)) {
		if (!isRecord(groupConfig)) continue;
		pushNestedRequireMentionIngress(entries, params, containerKey, groupId, groupConfig, sourceBase);
	}
}
function channelDefaultRequireMention(params) {
	return !((normalizeOptionalString(params.config.groupPolicy) ?? normalizeOptionalString(params.inheritedConfig.groupPolicy) ?? normalizeOptionalString(params.fallbackConfig?.groupPolicy) ?? channelImplicitGroupPolicy(params).value) === "open" && OPEN_GROUPS_DEFAULT_TO_NO_MENTION_CHANNELS.has(params.channel));
}
function channelWildcardRequireMention(params) {
	for (const key of [
		"groups",
		"guilds",
		"channels",
		"rooms",
		"teams"
	]) {
		const effective = effectiveNestedIngressContainer(params, key);
		const wildcard = isRecord(effective?.container["*"]) ? effective.container["*"] : void 0;
		const requireMention = asBoolean(wildcard?.requireMention);
		if (wildcard?.enabled !== false && requireMention !== void 0 && effective !== void 0) return {
			source: `${effective.sourceBase}/${key}/${ocPathSegment$1("*")}/requireMention`,
			value: requireMention
		};
		const fallbackContainer = isRecord(params.fallbackConfig?.[key]) ? params.fallbackConfig[key] : void 0;
		const fallbackWildcard = isRecord(fallbackContainer?.["*"]) ? fallbackContainer["*"] : void 0;
		const fallbackRequireMention = asBoolean(fallbackWildcard?.requireMention);
		if (fallbackWildcard?.enabled !== false && fallbackRequireMention !== void 0) return {
			source: `${params.fallbackSourceBase}/${key}/${ocPathSegment$1("*")}/requireMention`,
			value: fallbackRequireMention
		};
	}
}
function nestedIngressContainers(params) {
	const containers = [];
	for (const key of [
		"groups",
		"guilds",
		"channels",
		"rooms",
		"teams"
	]) {
		const effective = effectiveNestedIngressContainer(params, key);
		if (effective !== void 0) containers.push({
			containerKey: key,
			...effective
		});
	}
	return containers;
}
function effectiveNestedIngressContainer(params, key) {
	const local = isRecord(params.config[key]) ? params.config[key] : void 0;
	const inherited = isRecord(params.inheritedConfig[key]) ? params.inheritedConfig[key] : void 0;
	if (local !== void 0 && Object.keys(local).length > 0) return {
		container: local,
		sourceBase: params.sourceBase
	};
	const inheritsEmpty = local !== void 0 && params.inheritEmptyNestedContainers === true;
	const inheritsMissing = local === void 0 && params.inheritNestedContainers === true;
	if ((inheritsEmpty || inheritsMissing) && inherited !== void 0) return {
		container: inherited,
		sourceBase: params.inheritedSourceBase
	};
}
function pushNestedRequireMentionIngress(entries, params, containerKey, groupId, config, parentSourceBase) {
	if (config.enabled === false) return;
	const sourceBase = `${parentSourceBase}/${containerKey}/${ocPathSegment$1(groupId)}`;
	const requireMention = asBoolean(config.requireMention);
	if (requireMention !== void 0) entries.push({
		id: `${channelIngressId(params, `${containerKey}-${ocPathSegment$1(groupId)}`)}-require-mention`,
		kind: "channelRequireMention",
		source: `${sourceBase}/requireMention`,
		channel: params.channel,
		...params.accountId === void 0 ? {} : { accountId: params.accountId },
		groupId,
		value: requireMention ?? true,
		explicit: requireMention !== void 0
	});
	for (const nestedKey of ["channels", "topics"]) {
		const nested = config[nestedKey];
		if (!isRecord(nested)) continue;
		for (const [nestedId, nestedConfig] of Object.entries(nested)) if (isRecord(nestedConfig)) pushNestedRequireMentionIngress(entries, params, `${containerKey}/${ocPathSegment$1(groupId)}/${nestedKey}`, nestedId, nestedConfig, parentSourceBase);
	}
}
function channelDmPolicy(config) {
	const dm = asNonArrayRecord(config.dm);
	if (dm.enabled === false) return {
		value: "disabled",
		sourceSuffix: "dm/enabled",
		disabledByEnabled: true
	};
	const direct = normalizeOptionalString(config.dmPolicy);
	if (direct !== void 0) return {
		value: direct,
		sourceSuffix: "dmPolicy"
	};
	const legacy = normalizeOptionalString(dm.policy);
	return legacy === void 0 ? {} : {
		value: legacy,
		sourceSuffix: "dm/policy"
	};
}
function channelIngressId(params, suffix) {
	return params.accountId === void 0 ? `${params.channel}-${suffix}` : `${params.channel}-${params.accountId}-${suffix}`;
}
//#endregion
//#region extensions/policy/src/policy-state-routing.ts
function scanPolicyRouting(cfg, rules) {
	return {
		bindings: listPolicyRouteBindings(cfg).map((binding) => ({
			index: binding.index,
			source: `oc://openclaw.config/bindings/#${binding.index}`,
			channel: binding.channel
		})),
		probes: (rules.probes ?? []).map((probe, index) => {
			const result = resolvePolicyRoutingProbe(cfg, probe);
			return {
				id: probe.id,
				source: `oc://policy/routing/probes/#${index}`,
				agentId: result.agentId,
				matchedBy: result.matchedBy
			};
		})
	};
}
//#endregion
//#region extensions/policy/src/policy-state-sandbox.ts
const DEFAULT_POLICY_SANDBOX_BROWSER_NETWORK = "openclaw-sandbox-browser";
function scanPolicySandboxPosture(cfg) {
	const agents = asNonArrayRecord(cfg.agents);
	const defaults = asNonArrayRecord(agents.defaults);
	const defaultSandbox = asNonArrayRecord(defaults.sandbox);
	const entries = [];
	pushSandboxPostureEvidence(entries, {
		id: "agents-defaults",
		scope: "defaults",
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		sourceBase: "oc://openclaw.config/agents/defaults/sandbox",
		inheritedSourceBase: "oc://openclaw.config/agents/defaults/sandbox"
	});
	collectPolicyConfiguredAgents(agents).forEach((configured) => {
		const agent = configured.value;
		if (!isRecord(agent)) return;
		const sandbox = asNonArrayRecord(agent.sandbox);
		pushSandboxPostureEvidence(entries, {
			id: configured.agentId,
			scope: "agent",
			agentId: configured.agentId,
			sandbox,
			inheritedSandbox: defaultSandbox,
			sharedSandboxScope: sandboxScopeIsShared(sandbox, defaultSandbox),
			sourceBase: `${configured.sourceBase}/sandbox`,
			inheritedSourceBase: "oc://openclaw.config/agents/defaults/sandbox"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function pushSandboxPostureEvidence(entries, params) {
	const localMode = normalizeOptionalString(params.sandbox.mode);
	const inheritedMode = normalizeOptionalString(params.inheritedSandbox.mode);
	pushSandboxPostureValue(entries, params, {
		suffix: "mode",
		kind: "mode",
		value: localMode ?? inheritedMode ?? "off",
		explicit: localMode !== void 0 || inheritedMode !== void 0,
		inherited: localMode === void 0 && inheritedMode !== void 0
	});
	const localBackend = normalizeOptionalString(params.sandbox.backend);
	const inheritedBackend = normalizeOptionalString(params.inheritedSandbox.backend);
	const effectiveBackend = (localBackend ?? inheritedBackend ?? "docker").toLowerCase();
	const effectiveParams = {
		...params,
		effectiveBackend
	};
	pushSandboxPostureValue(entries, params, {
		suffix: "backend",
		kind: "backend",
		value: effectiveBackend,
		explicit: localBackend !== void 0 || inheritedBackend !== void 0,
		inherited: localBackend === void 0 && inheritedBackend !== void 0
	});
	if (effectiveBackend === "docker" || effectiveBackend === "podman") pushSandboxDockerPosture(entries, effectiveParams);
	pushSandboxBrowserPosture(entries, effectiveParams);
}
function pushSandboxDockerPosture(entries, params) {
	const localDocker = !params.sharedSandboxScope ? asNonArrayRecord(params.sandbox.docker) : {};
	const inheritedDocker = isRecord(params.inheritedSandbox.docker) ? params.inheritedSandbox.docker : {};
	const localNetwork = normalizeOptionalString(localDocker.network);
	const inheritedNetwork = normalizeOptionalString(inheritedDocker.network);
	pushSandboxPostureValue(entries, params, {
		suffix: "docker/network",
		kind: "containerNetwork",
		value: localNetwork ?? inheritedNetwork ?? "none",
		networkSurface: "docker",
		explicit: localNetwork !== void 0 || inheritedNetwork !== void 0,
		inherited: localNetwork === void 0 && inheritedNetwork !== void 0
	});
	pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, "seccomp");
	pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, "apparmor");
	pushSandboxBindPosture(entries, params, {
		inheritedBinds: readStringArray(inheritedDocker.binds),
		localBinds: readStringArray(localDocker.binds),
		sourceSuffix: "docker/binds",
		surface: "docker"
	});
}
function pushSandboxBindPosture(entries, params, bindParams) {
	const { inheritedBinds, localBinds } = bindParams;
	for (const [index, bind] of [...inheritedBinds, ...localBinds].entries()) {
		const inherited = index < inheritedBinds.length;
		const parsed = splitSandboxBindSpec(bind, { allowWindowsContainerPath: true });
		const bindMode = parsed?.options.split(",").some((option) => option.trim().toLowerCase() === "ro") ? "ro" : "rw";
		entries.push({
			id: `${params.id}-${bindParams.surface}-bind-${index}`,
			kind: "containerMount",
			source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/${bindParams.sourceSuffix}/#${inherited ? index : index - inheritedBinds.length}`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			bind,
			bindHost: parsed?.host,
			bindMode,
			bindSurface: bindParams.surface,
			explicit: true
		});
	}
}
function pushSandboxDockerProfilePosture(entries, params, localDocker, inheritedDocker, profile) {
	const key = profile === "apparmor" ? "apparmorProfile" : "seccompProfile";
	const localValue = normalizeOptionalString(localDocker[key]);
	const inheritedValue = normalizeOptionalString(inheritedDocker[key]);
	const inherited = localValue === void 0 && inheritedValue !== void 0;
	const value = localValue ?? inheritedValue;
	entries.push({
		id: `${params.id}-docker-${profile}-profile`,
		kind: "containerSecurityProfile",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/docker/${key}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		profile,
		...value === void 0 ? {} : { value },
		explicit: value !== void 0
	});
}
function pushSandboxBrowserPosture(entries, params) {
	const localBrowser = !params.sharedSandboxScope ? asNonArrayRecord(params.sandbox.browser) : {};
	const inheritedBrowser = isRecord(params.inheritedSandbox.browser) ? params.inheritedSandbox.browser : {};
	const localEnabled = asBoolean(localBrowser.enabled);
	const inheritedEnabled = asBoolean(inheritedBrowser.enabled);
	if (!(localEnabled ?? inheritedEnabled ?? false)) {
		const disabledInherited = localEnabled === void 0 && inheritedEnabled !== void 0;
		if (localEnabled !== void 0 || inheritedEnabled !== void 0) entries.push({
			id: `${params.id}-browser-cdp-source-range`,
			kind: "browserCdpSourceRange",
			source: `${disabledInherited ? params.inheritedSourceBase : params.sourceBase}/browser/enabled`,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			value: false,
			explicit: true
		});
		return;
	}
	const hasLocalRange = Object.hasOwn(localBrowser, "cdpSourceRange");
	const localRange = normalizeOptionalString(localBrowser.cdpSourceRange);
	const inheritedRange = normalizeOptionalString(inheritedBrowser.cdpSourceRange);
	const inherited = !hasLocalRange && inheritedRange !== void 0;
	const value = hasLocalRange ? localRange : inheritedRange;
	entries.push({
		id: `${params.id}-browser-cdp-source-range`,
		kind: "browserCdpSourceRange",
		source: `${inherited ? params.inheritedSourceBase : params.sourceBase}/browser/cdpSourceRange`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...value === void 0 ? {} : { value },
		explicit: value !== void 0
	});
	const localNetwork = normalizeOptionalString(localBrowser.network);
	const inheritedNetwork = normalizeOptionalString(inheritedBrowser.network);
	pushSandboxPostureValue(entries, params, {
		suffix: "browser/network",
		kind: "containerNetwork",
		value: localNetwork ?? inheritedNetwork ?? DEFAULT_POLICY_SANDBOX_BROWSER_NETWORK,
		networkSurface: "browser",
		explicit: localNetwork !== void 0 || inheritedNetwork !== void 0,
		inherited: localNetwork === void 0 && inheritedNetwork !== void 0
	});
	if (inheritedBrowser.binds !== void 0 || localBrowser.binds !== void 0) pushSandboxBindPosture(entries, params, {
		inheritedBinds: readStringArray(inheritedBrowser.binds),
		localBinds: readStringArray(localBrowser.binds),
		sourceSuffix: "browser/binds",
		surface: "browser"
	});
	else if (params.effectiveBackend !== "docker" && params.effectiveBackend !== "podman") {
		const localDocker = !params.sharedSandboxScope ? asNonArrayRecord(params.sandbox.docker) : {};
		pushSandboxBindPosture(entries, params, {
			inheritedBinds: readStringArray((isRecord(params.inheritedSandbox.docker) ? params.inheritedSandbox.docker : {}).binds),
			localBinds: readStringArray(localDocker.binds),
			sourceSuffix: "docker/binds",
			surface: "browser"
		});
	}
}
function sandboxScopeIsShared(sandbox, inheritedSandbox) {
	const localScope = normalizeOptionalString(sandbox.scope);
	const inheritedScope = normalizeOptionalString(inheritedSandbox.scope);
	const configuredScope = localScope ?? inheritedScope;
	if (configuredScope !== void 0) return configuredScope === "shared";
	const localPerSession = asBoolean(sandbox.perSession);
	const inheritedPerSession = asBoolean(inheritedSandbox.perSession);
	return (localPerSession ?? inheritedPerSession) === false;
}
function pushSandboxPostureValue(entries, params, entry) {
	entries.push({
		id: `${params.id}-${entry.suffix.replaceAll("/", "-")}`,
		kind: entry.kind,
		source: `${entry.inherited ? params.inheritedSourceBase : params.sourceBase}/${entry.suffix}`,
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		...entry.value === void 0 ? {} : { value: entry.value },
		...entry.networkSurface === void 0 ? {} : { networkSurface: entry.networkSurface },
		explicit: entry.explicit
	});
}
//#endregion
//#region extensions/policy/src/policy-state-tools.ts
function scanPolicyTools(raw) {
	return Promise.resolve(scanPolicyToolHeaders(raw));
}
function scanPolicyToolHeaders(raw) {
	const section = markdownSectionLines(raw, "tools");
	if (section.length === 0) return [];
	const tools = [];
	let localNotesMode;
	for (let index = 0; index < section.length; index += 1) {
		const sectionLine = section[index];
		const line = sectionLine?.text ?? "";
		const sectionHeading = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(line);
		const isChildHeading = sectionHeading?.[1]?.length === (sectionLine?.sectionDepth ?? 0) + 1;
		if (line.includes("Skills provide your tools.") && line.includes("Keep local notes") && line.includes("TOOLS.md")) {
			localNotesMode = "plain";
			continue;
		}
		if (isChildHeading && /^Local notes\s*$/iu.test(sectionHeading?.[2] ?? "")) {
			localNotesMode = "plain";
			continue;
		}
		if (isChildHeading && /^Local notes \(migrated from TOOLS\.md\)\s*$/iu.test(sectionHeading?.[2] ?? "")) {
			localNotesMode = "migrated";
			continue;
		}
		if (localNotesMode && sectionHeading && sectionHeading[1].length <= (section[index]?.sectionDepth ?? 0) && slugify(sectionHeading[2] ?? "") === "tools") {
			localNotesMode = void 0;
			continue;
		}
		if (localNotesMode === "plain" && isChildHeading) localNotesMode = void 0;
		if (localNotesMode) continue;
		const heading = isChildHeading ? /^([^\s#]+)(.*)$/u.exec(sectionHeading?.[2] ?? "") : null;
		const bullet = /^[-*+]\s+([^:\s][^:]*?)\s*:(.*)$/.exec(line);
		const match = heading ?? bullet;
		const toolName = match?.[1];
		if (!toolName) continue;
		const id = slugify(toolName);
		if (!id) continue;
		const entry = {
			id,
			source: `oc://AGENTS.md/tools/${id}`,
			line: section[index]?.line ?? index + 1
		};
		const metaLines = [match[2] ?? ""];
		for (let metaIndex = index + 1; metaIndex < section.length; metaIndex += 1) {
			const metaSectionLine = section[metaIndex];
			const metaLine = metaSectionLine?.text ?? "";
			const metaHeading = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(metaLine.trim());
			if (metaHeading !== null && (metaHeading[1]?.length ?? 0) <= (metaSectionLine?.sectionDepth ?? 0) + 1 || /^[-*+]\s+[^:\s][^:]*?\s*:/.test(metaLine)) break;
			metaLines.push(metaLine);
		}
		const meta = metaLines.join("\n");
		const risk = riskFromMeta(meta);
		const sensitivity = /\bsensitivity\s*:\s*([a-z0-9_-]+)\b/i.exec(meta)?.[1]?.toLowerCase();
		const owner = /\bowner\s*:\s*([^\s#]+)\b/i.exec(meta)?.[1];
		const capabilities = capabilityTokensFromMetaLines(metaLines);
		if (risk !== void 0) entry.risk = risk;
		if (sensitivity !== void 0) entry.sensitivity = sensitivity;
		if (owner !== void 0) entry.owner = owner;
		if (capabilities.length > 0) entry.capabilities = capabilities;
		tools.push(entry);
	}
	return tools;
}
function markdownSectionLines(raw, sectionSlug) {
	const lines = raw.split(/\r?\n/);
	let sectionDepth;
	let foundSection = false;
	let fence;
	const section = [];
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const fenceRun = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
		const closingFenceRun = /^\s*(`{3,}|~{3,})\s*$/.exec(line)?.[1];
		const marker = fenceRun?.[0];
		if (marker && !fence) {
			fence = {
				marker,
				length: fenceRun.length
			};
			continue;
		}
		if (closingFenceRun && fence && closingFenceRun[0] === fence.marker && closingFenceRun.length >= fence.length) {
			fence = void 0;
			continue;
		}
		if (fence) continue;
		const heading = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
		if (heading !== null) {
			const depth = heading[1]?.length ?? 0;
			const slug = slugify(heading[2] ?? "");
			if (sectionDepth !== void 0 && depth <= sectionDepth) sectionDepth = void 0;
			if (sectionDepth !== void 0) {
				section.push({
					line: index + 1,
					text: line,
					sectionDepth
				});
				continue;
			}
			if (depth <= 2 && slug === sectionSlug) {
				if (foundSection) section.push({
					line: index + 1,
					text: line,
					sectionDepth: depth
				});
				foundSection = true;
				sectionDepth = depth;
			}
			continue;
		}
		if (sectionDepth !== void 0) section.push({
			line: index + 1,
			text: line,
			sectionDepth
		});
	}
	return section;
}
function slugify(text) {
	return text.toLowerCase().replace(/_/g, "-").replace(NON_SLUG_CHARS, "-").replace(COLLAPSE_HYPHENS, "-").replace(TRIM_HYPHENS, "");
}
function riskFromMeta(meta) {
	const namedRisk = /\brisk\s*:\s*([a-z0-9_-]+)\b/i.exec(meta)?.[1];
	if (namedRisk !== void 0) return namedRisk.toLowerCase();
	switch (/\bR([0-5])\b/.exec(meta)?.[1]) {
		case "0":
		case "1": return "low";
		case "2":
		case "3": return "medium";
		case "4": return "high";
		case "5": return "critical";
		default: return;
	}
}
function capabilityTokensFromMetaLines(lines) {
	return lines.flatMap((line, index) => {
		const trimmed = line.trim();
		if (trimmed.length === 0) return [];
		const tokens = trimmed.match(/\b[A-Z][A-Z0-9_]{2,}\b/g) ?? [];
		if (index === 0 || /\bcapabilities\s*:/i.test(trimmed)) return tokens;
		const withoutTokens = tokens.reduce((remaining, token) => {
			return remaining.replace(token, "");
		}, trimmed);
		return /^[\s,;:[\](){}#*_-]*$/.test(withoutTokens) ? tokens : [];
	});
}
//#endregion
//#region extensions/policy/src/tool-policy-conformance.ts
function toolListCoversTool(list, tool) {
	return !toolPolicy.createToolPolicyMatcher({ deny: [...list] })(tool);
}
function expandPolicyToolRequirement(value) {
	return toolPolicy.expandToolGroups([value]);
}
//#endregion
//#region extensions/policy/src/policy-state-workspace.ts
function scanPolicyAgentWorkspace(cfg) {
	const agents = asNonArrayRecord(cfg.agents);
	const defaults = asNonArrayRecord(agents.defaults);
	const defaultSandbox = asNonArrayRecord(defaults.sandbox);
	const defaultTools = asNonArrayRecord(cfg.tools);
	const entries = [];
	pushAgentWorkspaceEvidence(entries, {
		id: "agents-defaults",
		scope: "defaults",
		sandbox: defaultSandbox,
		inheritedSandbox: {},
		tools: defaultTools,
		inheritedTools: {},
		workspaceSourceBase: "oc://openclaw.config/agents/defaults",
		inheritedWorkspaceSourceBase: "oc://openclaw.config/agents/defaults",
		toolsSourceBase: "oc://openclaw.config/tools",
		inheritedToolsSourceBase: "oc://openclaw.config/tools"
	});
	collectPolicyConfiguredAgents(agents).forEach((configured) => {
		const agent = configured.value;
		if (!isRecord(agent)) return;
		const sandbox = asNonArrayRecord(agent.sandbox);
		const tools = asNonArrayRecord(agent.tools);
		pushAgentWorkspaceEvidence(entries, {
			id: configured.agentId,
			scope: "agent",
			agentId: configured.agentId,
			sandbox,
			inheritedSandbox: defaultSandbox,
			tools,
			inheritedTools: defaultTools,
			workspaceSourceBase: configured.sourceBase,
			inheritedWorkspaceSourceBase: "oc://openclaw.config/agents/defaults",
			toolsSourceBase: `${configured.sourceBase}/tools`,
			inheritedToolsSourceBase: "oc://openclaw.config/tools"
		});
	});
	return entries.toSorted((a, b) => a.source.localeCompare(b.source) || a.id.localeCompare(b.id));
}
function pushAgentWorkspaceEvidence(entries, params) {
	const explicitSandboxMode = normalizeOptionalString(params.sandbox.mode);
	const inheritedSandboxMode = normalizeOptionalString(params.inheritedSandbox.mode);
	const sandboxMode = explicitSandboxMode ?? inheritedSandboxMode ?? "off";
	const sandboxModeCoversAgentMain = sandboxMode === "all";
	const sandboxModeSource = explicitSandboxMode !== void 0 ? `${params.workspaceSourceBase}/sandbox/mode` : inheritedSandboxMode !== void 0 ? `${params.inheritedWorkspaceSourceBase}/sandbox/mode` : "oc://openclaw.config/agents/defaults/sandbox/mode";
	const explicitWorkspaceAccess = normalizeOptionalString(params.sandbox.workspaceAccess);
	const inheritedWorkspaceAccess = normalizeOptionalString(params.inheritedSandbox.workspaceAccess);
	entries.push({
		id: `${params.id}-workspace-access`,
		kind: "workspaceAccess",
		source: explicitWorkspaceAccess !== void 0 ? `${params.workspaceSourceBase}/sandbox/workspaceAccess` : inheritedWorkspaceAccess !== void 0 ? `${params.inheritedWorkspaceSourceBase}/sandbox/workspaceAccess` : "oc://openclaw.config/agents/defaults/sandbox/workspaceAccess",
		scope: params.scope,
		...params.agentId === void 0 ? {} : { agentId: params.agentId },
		value: explicitWorkspaceAccess ?? inheritedWorkspaceAccess ?? "none",
		sandboxMode,
		sandboxModeSource,
		sandboxEnabled: sandboxModeCoversAgentMain,
		explicit: explicitWorkspaceAccess !== void 0
	});
	for (const tool of AGENT_WORKSPACE_POLICY_TOOLS) {
		const denyEvidence = agentWorkspaceToolDenyEvidence(params, tool, sandboxModeCoversAgentMain);
		entries.push({
			id: `${params.id}-tool-${tool}`,
			kind: "toolDeny",
			source: denyEvidence.source,
			scope: params.scope,
			...params.agentId === void 0 ? {} : { agentId: params.agentId },
			tool,
			denied: denyEvidence.denied,
			explicit: denyEvidence.denied
		});
	}
}
function agentWorkspaceToolDenyEvidence(params, tool, sandboxModeCoversAgentMain) {
	const localSandboxToolDeny = configuredSandboxToolDenyEntries(params.tools);
	const inheritedSandboxToolDeny = configuredSandboxToolDenyEntries(params.inheritedTools);
	const match = [
		{
			entries: readStringArray(params.tools.deny),
			source: `${params.toolsSourceBase}/deny`
		},
		{
			entries: readStringArray(params.inheritedTools.deny),
			source: `${params.inheritedToolsSourceBase}/deny`
		},
		...sandboxModeCoversAgentMain ? [localSandboxToolDeny !== void 0 ? {
			entries: localSandboxToolDeny,
			source: `${params.toolsSourceBase}/sandbox/tools/deny`
		} : {
			entries: inheritedSandboxToolDeny ?? [],
			source: `${params.inheritedToolsSourceBase}/sandbox/tools/deny`
		}] : []
	].find((entry) => toolListCoversTool(entry.entries, tool));
	if (match !== void 0) return {
		denied: true,
		source: match.source
	};
	return {
		denied: false,
		source: `${params.toolsSourceBase}/deny`
	};
}
function configuredSandboxToolDenyEntries(tools) {
	const sandbox = asNonArrayRecord(tools.sandbox);
	const sandboxTools = asNonArrayRecord(sandbox.tools);
	return Array.isArray(sandboxTools.deny) ? readStringArray(sandboxTools.deny) : void 0;
}
//#endregion
//#region extensions/policy/src/policy-state-attestation.ts
function policyDocumentHash(policy) {
	return sha256(stableJson(policy));
}
function policyWorkspaceHash(evidence) {
	return sha256(stableJson(evidence));
}
function policyFindingsHash(findings) {
	return sha256(stableJson(findings));
}
function policyAttestationHash(input) {
	return sha256(stableJson(input));
}
function createPolicyAttestation(input) {
	const workspaceHash = policyWorkspaceHash(input.evidence);
	const findingsHash = policyFindingsHash(input.findings);
	return {
		checkedAt: input.checkedAt,
		...input.policyHash === void 0 ? {} : { policy: {
			path: input.policyPath,
			hash: input.policyHash
		} },
		workspace: {
			scope: "policy",
			hash: workspaceHash
		},
		findingsHash,
		attestationHash: policyAttestationHash({
			ok: input.ok,
			policyHash: input.policyHash,
			workspaceHash,
			findingsHash
		})
	};
}
function sha256(value) {
	return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
function stableJson(value) {
	if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
	if (isRecord(value)) return `{${Object.entries(value).toSorted(([a], [b]) => a.localeCompare(b)).map(([key, child]) => `${JSON.stringify(key)}:${stableJson(child)}`).join(",")}}`;
	return JSON.stringify(value);
}
//#endregion
//#region extensions/policy/src/policy-state.ts
function collectPolicyEvidence(cfg, options = {}) {
	const evidence = {
		channels: scanPolicyChannels(cfg),
		mcpServers: scanPolicyMcpServers(cfg),
		modelProviders: scanPolicyModelProviders(cfg),
		modelRefs: scanPolicyModelRefs(cfg),
		network: scanPolicyNetwork(cfg),
		...options.includeIngress === false ? {} : { ingress: scanPolicyIngress(cfg) },
		...options.includeGatewayExposure === false ? {} : { gatewayExposure: scanPolicyGatewayExposure(cfg) },
		...options.includeAgentWorkspace === false ? {} : { agentWorkspace: scanPolicyAgentWorkspace(cfg) },
		...options.includeDataHandling === false ? {} : { dataHandling: scanPolicyDataHandling(cfg) },
		...options.includeToolPosture === false ? {} : { toolPosture: scanPolicyToolPosture(cfg) },
		...options.includeSandboxPosture === false ? {} : { sandboxPosture: scanPolicySandboxPosture(cfg) },
		...options.includeSecrets === false ? {} : { secrets: scanPolicySecrets(cfg) },
		...options.includeAuthProfiles === false ? {} : { authProfiles: scanPolicyAuthProfiles(cfg) },
		...options.includeExecApprovals === false || options.execApprovalsRaw === void 0 ? {} : { execApprovals: options.execApprovalsRaw === null ? [] : scanPolicyExecApprovals(options.execApprovalsRaw) },
		...options.routing === void 0 ? {} : { routing: scanPolicyRouting(cfg, options.routing) }
	};
	if (options.toolsRaw === void 0) return evidence;
	return scanPolicyTools(options.toolsRaw).then((tools) => ({
		...evidence,
		tools
	}));
}
//#endregion
//#region extensions/policy/src/doctor/shape-helpers.ts
function unsupportedPolicyKey(value, allowedKeys) {
	const allowed = new Set(allowedKeys);
	return Object.keys(value).find((key) => !allowed.has(key));
}
function isChannelDenyRule(value) {
	return isRecord(value) && (value.id === void 0 || typeof value.id === "string") && (value.reason === void 0 || typeof value.reason === "string") && isRecord(value.when) && typeof value.when.provider === "string";
}
function policyShapeFinding(policyPath, target, message, fixHint) {
	return {
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message,
		source: "policy",
		path: policyPath,
		target,
		fixHint
	};
}
//#endregion
//#region extensions/policy/src/doctor/exec-approval-rules.ts
function execApprovalAllowlistExpectedShapeFinding(value, params) {
	if (value === void 0) return;
	if (!Array.isArray(value)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}`, `${params.policyPath} ${params.property} must be an array.`, `Fix ${params.policyPath} so ${params.property} is an array of exec approval allowlist entries.`);
	const invalidIndex = value.findIndex((entry) => execApprovalAllowlistRequirement(entry) === void 0);
	if (invalidIndex < 0) return;
	return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${params.target}/#${invalidIndex}`, `${params.policyPath} ${params.property}[${invalidIndex}] must be a non-empty string or an object with pattern and optional argPattern strings.`, `Use entries such as "deploy" or { "pattern": "deploy", "argPattern": "^--prod$" }.`);
}
function readExecApprovalAllowlistRequirements(policy, path) {
	const current = getPolicyPath(policy, path);
	if (!Array.isArray(current)) return;
	const entries = current.map(execApprovalAllowlistRequirement);
	return entries.every((entry) => entry !== void 0) ? entries : void 0;
}
function execApprovalAllowlistRequirement(value) {
	if (typeof value === "string") {
		const pattern = value.trim();
		return pattern === "" ? void 0 : execApprovalAllowlistRequirementFromParts(pattern);
	}
	if (!isRecord(value)) return;
	if (unsupportedPolicyKey(value, ["argPattern", "pattern"]) !== void 0) return;
	const pattern = typeof value.pattern === "string" ? value.pattern.trim() : "";
	if (pattern === "") return;
	const argPattern = typeof value.argPattern === "string" ? value.argPattern.trim() : void 0;
	if (value.argPattern !== void 0 && argPattern === void 0) return;
	return execApprovalAllowlistRequirementFromParts(pattern, argPattern === "" ? void 0 : argPattern);
}
function execApprovalAllowlistRequirementFromParts(pattern, argPattern) {
	return {
		key: execApprovalAllowlistRequirementKey(pattern, argPattern),
		pattern,
		...argPattern === void 0 ? {} : { argPattern }
	};
}
function execApprovalAllowlistRequirementKey(pattern, argPattern) {
	return `${pattern}\0${argPattern ?? ""}`;
}
function execApprovalAllowlistMissingTarget(agentId) {
	return agentId === void 0 ? EXEC_APPROVALS_POLICY_URI : execApprovalsPolicyUri(`agents/${ocPathSegment(agentId)}/allowlist`);
}
function formatExecApprovalAllowlistRequirement(entry) {
	return formatExecApprovalAllowlistParts(entry.pattern, entry.argPattern);
}
function formatExecApprovalAllowlistEntry(entry) {
	return formatExecApprovalAllowlistParts(entry?.pattern ?? "", entry?.argPattern);
}
function formatExecApprovalAllowlistParts(pattern, argPattern) {
	return argPattern === void 0 ? pattern : `${pattern} argPattern=${argPattern}`;
}
function effectiveExecApprovalAgentSecurityEntry(entries, agentId) {
	const exact = entries.find((entry) => entry.kind === "agent" && entry.agentId !== void 0 && normalizeAgentId(entry.agentId) === normalizeAgentId(agentId));
	const wildcard = entries.find((entry) => entry.kind === "agent" && entry.agentId === "*");
	if (exact?.security !== void 0 || exact?.securityConfigured === true) return exact;
	return wildcard?.security === void 0 ? exact ?? wildcard : wildcard;
}
function effectiveExecApprovalAgentAutoAllowSkillsEntry(entries, agentId) {
	const exact = entries.find((entry) => entry.kind === "agent" && entry.agentId !== void 0 && normalizeAgentId(entry.agentId) === normalizeAgentId(agentId));
	if (exact?.autoAllowSkills !== void 0) return exact;
	const wildcard = entries.find((entry) => entry.kind === "agent" && entry.agentId === "*");
	return wildcard?.autoAllowSkills === void 0 ? void 0 : wildcard;
}
function syntheticExecApprovalAgentEntry(agentId) {
	return {
		id: `agent:${agentId}:runtime-defaults`,
		kind: "agent",
		source: EXEC_APPROVALS_POLICY_URI,
		agentId
	};
}
//#endregion
//#region extensions/policy/src/doctor/ordered-shape.ts
function policyRuleValueIsValid(metadata, value) {
	switch (metadata.valueType) {
		case "boolean": return typeof value === "boolean";
		case "channel-provider-deny-rules": return Array.isArray(value) && value.every((entry) => isRecord(entry) && isRecord(entry.when) && typeof entry.when.provider === "string" && entry.when.provider.trim() !== "");
		case "routing-probes": return Array.isArray(value);
		case "string-list":
		case "string": {
			if (metadata.valueType === "string-list" && metadata.policyPath.join(".") === "execApprovals.agents.allowlist.expected") return readExecApprovalAllowlistRequirements(value, []) !== void 0;
			const allowed = metadata.allowedValues ?? metadata.orderedValues;
			return stringListIssue(metadata.valueType === "string" ? [value] : value, metadata.caseSensitive === true ? allowed : allowed?.map((entry) => entry.toLowerCase()), metadata.caseSensitive === true ? "trim" : "lower", false) === void 0;
		}
	}
	return false;
}
function firstPolicyShapeFinding(findings) {
	for (const finding of findings) if (finding !== void 0) return finding;
}
function collectPolicyShapeFindings(findings) {
	return Array.from(findings).filter((finding) => finding !== void 0);
}
function stringListIssue(value, allowed, normalize = "trim", visitHoles = true) {
	if (!Array.isArray(value)) return { kind: "array" };
	const index = value.findIndex((entry, entryIndex) => {
		if (!visitHoles && !(entryIndex in value)) return false;
		if (typeof entry !== "string") return true;
		const normalized = normalize === "raw" ? entry : normalize === "lower" ? entry.trim().toLowerCase() : entry.trim();
		return normalized === "" || allowed !== void 0 && !allowed.includes(normalized);
	});
	return index < 0 ? void 0 : {
		kind: "entry",
		index
	};
}
/** Executes primitive checks; callers retain their explicit first/all diagnostic schedule. */
function createOrderedPolicyShape(value, context) {
	const paths = (path) => {
		const parts = path === "" ? [] : path.split(".");
		return {
			value: getPolicyPath(value, parts),
			property: [context.propertyPrefix, ...parts].filter((part) => part !== void 0).join("."),
			target: [context.targetPrefix, ...parts.map(ocPathSegment)].filter((part) => part !== void 0).join("/"),
			hasTarget: context.targetPrefix !== void 0 || parts.length > 0
		};
	};
	const diagnostic = (path, text, detail = {}) => {
		const location = paths(path);
		const property = location.property;
		const fields = {
			policy: context.policyPath,
			property,
			key: detail.key ?? "",
			index: String(detail.index ?? ""),
			unsupported: property + "." + (detail.key ?? ""),
			valueName: detail.valueName ?? "",
			allowed: detail.allowed?.join(", ") ?? ""
		};
		const render = (template) => template.replace(/\{(policy|property|key|index|unsupported|valueName|allowed)\}/g, (_, key) => fields[key]);
		const suffix = detail.key !== void 0 ? "/" + ocPathSegment(detail.key) : detail.index !== void 0 ? "/#" + detail.index : "";
		return policyShapeFinding(context.policyPath, "oc://" + context.policyDocName + (location.hasTarget ? "/" + location.target : "") + suffix, render(text.message), render(text.hint));
	};
	return {
		value: (path) => paths(path).value,
		finding: diagnostic,
		object(path, hint = "Fix {policy} so {property} is an object.", required = false) {
			const current = paths(path).value;
			return current === void 0 && !required || isRecord(current) ? void 0 : diagnostic(path, {
				message: "{policy} {property} must be an object.",
				hint
			});
		},
		keys(path, allowed, section, hint, message = "{policy} {unsupported} is not supported in " + section + " policy.") {
			const current = paths(path).value;
			if (!isRecord(current)) return;
			const key = Object.keys(current).find((entry) => !allowed.includes(entry));
			return key === void 0 ? void 0 : diagnostic(path, {
				message,
				hint
			}, { key });
		},
		boolean(path, hint = "Set {property} to true or false.") {
			const current = paths(path).value;
			return current === void 0 || typeof current === "boolean" ? void 0 : diagnostic(path, {
				message: "{policy} {property} must be a boolean.",
				hint
			});
		},
		enum(path, allowed, text) {
			const current = paths(path).value;
			return current === void 0 || typeof current === "string" && allowed.includes(current) ? void 0 : diagnostic(path, text, { allowed });
		},
		list(path, options = {}) {
			const current = paths(path).value;
			if (current === void 0) return;
			const issue = stringListIssue(current, options.allowed, options.normalize);
			if (issue === void 0) return;
			const text = issue.kind === "array" ? options.array ?? {
				message: "{policy} {property} must be an array.",
				hint: "Fix {policy} so {property} is an array of {valueName}s."
			} : options.entry ?? {
				message: "{policy} {property}[{index}] must be a supported {valueName}.",
				hint: "Use non-empty {valueName} entries." + (options.allowed === void 0 ? "" : " Supported values: {allowed}.")
			};
			return diagnostic(path, text, {
				...issue.kind === "entry" ? { index: issue.index } : {},
				valueName: options.valueName,
				allowed: options.allowed
			});
		}
	};
}
//#endregion
//#region extensions/policy/src/doctor/metadata.ts
const SANDBOX_CONTAINER_POLICY_RULES = [
	{
		key: "denyHostNetwork",
		label: "host network posture",
		checkIds: [CHECK_IDS.policySandboxContainerHostNetworkDenied]
	},
	{
		key: "denyContainerNamespaceJoin",
		label: "container namespace posture",
		checkIds: [CHECK_IDS.policySandboxContainerNamespaceJoinDenied]
	},
	{
		key: "requireReadOnlyMounts",
		label: "container mount mode posture",
		checkIds: [CHECK_IDS.policySandboxContainerMountModeRequired]
	},
	{
		key: "denyContainerRuntimeSocketMounts",
		label: "container runtime socket mount posture",
		checkIds: [CHECK_IDS.policySandboxContainerRuntimeSocketMount]
	},
	{
		key: "denyUnconfinedProfiles",
		label: "container security profile posture",
		checkIds: [CHECK_IDS.policySandboxContainerUnconfinedProfile]
	}
];
const SANDBOX_POLICY_RULE_METADATA = [
	{
		policyPath: ["sandbox", "requireMode"],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySandboxModeUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"off",
			"non-main",
			"all"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["sandbox", "allowBackends"],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySandboxBackendUnapproved],
		emptyList: "disabled",
		scopeSelectors: ["agentIds"]
	},
	...SANDBOX_CONTAINER_POLICY_RULES.map((rule) => ({
		policyPath: [
			"sandbox",
			"containers",
			rule.key
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: rule.checkIds,
		scopeSelectors: ["agentIds"]
	})),
	{
		policyPath: [
			"sandbox",
			"browser",
			"requireCdpSourceRange"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing],
		scopeSelectors: ["agentIds"]
	}
];
const POLICY_RULE_METADATA = [
	{
		policyPath: ["channels", "denyRules"],
		strictness: "denylist-superset",
		valueType: "channel-provider-deny-rules",
		checkIds: [CHECK_IDS.policyDeniedChannelProvider],
		emptyList: "meaningful",
		caseSensitive: true
	},
	{
		policyPath: [
			"mcp",
			"servers",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyUnapprovedMcpServer],
		emptyList: "disabled",
		caseSensitive: true
	},
	{
		policyPath: [
			"mcp",
			"servers",
			"deny"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyDeniedMcpServer],
		caseSensitive: true
	},
	{
		policyPath: [
			"models",
			"providers",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyUnapprovedModelProvider],
		emptyList: "disabled",
		normalizeValues: "model-provider"
	},
	{
		policyPath: [
			"models",
			"providers",
			"deny"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyDeniedModelProvider],
		normalizeValues: "model-provider"
	},
	{
		policyPath: [
			"network",
			"privateNetwork",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyPrivateNetworkAccess]
	},
	{
		policyPath: ["routing", "requireBindings"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyRoutingBindingsRequired]
	},
	{
		policyPath: ["routing", "requireConfiguredChannels"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyRoutingBindingChannelUnconfigured]
	},
	{
		policyPath: ["routing", "probes"],
		strictness: "routing-probes",
		valueType: "routing-probes",
		checkIds: [CHECK_IDS.policyRoutingAgentMismatch, CHECK_IDS.policyRoutingMatchKindMismatch]
	},
	{
		policyPath: [
			"ingress",
			"session",
			"requireDmScope"
		],
		strictness: "ordered-string",
		valueType: "string",
		orderedValues: [
			"main",
			"per-peer",
			"per-channel-peer",
			"per-account-channel-peer"
		],
		checkIds: [CHECK_IDS.policyIngressDmScopeUnapproved]
	},
	{
		policyPath: [
			"gateway",
			"exposure",
			"allowNonLoopbackBind"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayNonLoopbackBind]
	},
	{
		policyPath: [
			"gateway",
			"exposure",
			"allowTailscaleFunnel"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayTailscaleFunnel]
	},
	{
		policyPath: [
			"gateway",
			"auth",
			"requireAuth"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayAuthDisabled]
	},
	{
		policyPath: [
			"gateway",
			"auth",
			"requireExplicitRateLimit"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayRateLimitMissing]
	},
	{
		policyPath: [
			"gateway",
			"controlUi",
			"allowInsecure"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayControlUiInsecure]
	},
	{
		policyPath: [
			"gateway",
			"remote",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayRemoteEnabled]
	},
	{
		policyPath: [
			"gateway",
			"http",
			"denyEndpoints"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyGatewayHttpEndpointEnabled],
		allowedValues: ["chatCompletions", "responses"],
		caseSensitive: true
	},
	{
		policyPath: [
			"gateway",
			"http",
			"requireUrlAllowlists"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyGatewayHttpUrlFetchUnrestricted]
	},
	{
		policyPath: [
			"gateway",
			"nodes",
			"denyCommands"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyGatewayNodeCommandDenied],
		caseSensitive: true
	},
	{
		policyPath: [
			"agents",
			"workspace",
			"allowedAccess"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAgentsWorkspaceAccessDenied],
		emptyList: "disabled",
		allowedValues: [
			"none",
			"ro",
			"rw"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"agents",
			"workspace",
			"denyTools"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAgentsToolNotDenied],
		allowedValues: [
			"exec",
			"process",
			"write",
			"edit",
			"apply_patch"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"profiles",
			"allow"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsProfileUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"minimal",
			"coding",
			"messaging",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"fs",
			"requireWorkspaceOnly"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyToolsFsWorkspaceOnlyRequired],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"requireAsk"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecAskUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"off",
			"on-miss",
			"always"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"exec",
			"allowHosts"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsExecHostUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"auto",
			"sandbox",
			"gateway",
			"node"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"elevated",
			"allow"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyToolsElevatedEnabled],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"tools",
			"alsoAllow",
			"expected"
		],
		strictness: "exact-list",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsAlsoAllowMissing, CHECK_IDS.policyToolsAlsoAllowUnexpected],
		emptyList: "meaningful",
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["tools", "denyTools"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyToolsRequiredDenyMissing],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["tools", "requireMetadata"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [
			CHECK_IDS.policyUnmigratedToolsFile,
			CHECK_IDS.policyMissingToolRisk,
			CHECK_IDS.policyMissingToolSensitivity,
			CHECK_IDS.policyMissingToolOwner
		],
		allowedValues: [
			"risk",
			"sensitivity",
			"owner"
		]
	},
	...SANDBOX_POLICY_RULE_METADATA,
	{
		policyPath: [
			"ingress",
			"channels",
			"allowDmPolicies"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyIngressDmPolicyUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"pairing",
			"allowlist",
			"open",
			"disabled"
		],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"ingress",
			"channels",
			"denyOpenGroups"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyIngressOpenGroupsDenied],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"ingress",
			"channels",
			"requireMentionInGroups"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyIngressGroupMentionRequired],
		scopeSelectors: ["channelIds"]
	},
	{
		policyPath: [
			"dataHandling",
			"sensitiveLogging",
			"requireRedaction"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [],
		satisfiedByInvariant: "oc://openclaw.invariant/logging/redaction"
	},
	{
		policyPath: [
			"dataHandling",
			"telemetry",
			"denyContentCapture"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingTelemetryContentCapture]
	},
	{
		policyPath: [
			"dataHandling",
			"retention",
			"requireSessionMaintenance"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced]
	},
	{
		policyPath: [
			"dataHandling",
			"memory",
			"denySessionTranscriptIndexing"
		],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyDataHandlingSessionTranscriptMemory],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: ["secrets", "requireManagedProviders"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySecretsUnmanagedProvider]
	},
	{
		policyPath: ["secrets", "denySources"],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policySecretsDeniedProviderSource]
	},
	{
		policyPath: ["secrets", "allowInsecureProviders"],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policySecretsInsecureProvider]
	},
	{
		policyPath: ["execApprovals", "requireFile"],
		strictness: "requires-true",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyExecApprovalsMissing]
	},
	{
		policyPath: [
			"execApprovals",
			"defaults",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowSecurity"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved],
		emptyList: "disabled",
		allowedValues: [
			"deny",
			"allowlist",
			"full"
		],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowAutoAllowSkills"
		],
		strictness: "requires-false",
		valueType: "boolean",
		checkIds: [CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled],
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"execApprovals",
			"agents",
			"allowlist",
			"expected"
		],
		strictness: "exact-list",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyExecApprovalsAllowlistMissing, CHECK_IDS.policyExecApprovalsAllowlistUnexpected],
		emptyList: "meaningful",
		caseSensitive: true,
		scopeSelectors: ["agentIds"]
	},
	{
		policyPath: [
			"auth",
			"profiles",
			"requireMetadata"
		],
		strictness: "denylist-superset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAuthProfileInvalidMetadata],
		allowedValues: ["provider", "mode"]
	},
	{
		policyPath: [
			"auth",
			"profiles",
			"allowModes"
		],
		strictness: "allowlist-subset",
		valueType: "string-list",
		checkIds: [CHECK_IDS.policyAuthProfileUnapprovedMode],
		emptyList: "disabled",
		allowedValues: [
			"api_key",
			"aws-sdk",
			"oauth",
			"token"
		]
	}
];
//#endregion
//#region extensions/policy/src/doctor/policy-constants.ts
const POLICY_RULES = POLICY_RULE_METADATA;
const KNOWN_RISK_LEVELS = [
	"low",
	"medium",
	"high",
	"critical"
];
const KNOWN_SENSITIVITY_LEVELS = [
	"public",
	"internal",
	"confidential",
	"restricted"
];
const SUPPORTED_TOOL_METADATA = [
	"risk",
	"sensitivity",
	"owner"
];
const SUPPORTED_AUTH_PROFILE_METADATA = ["provider", "mode"];
const SUPPORTED_AUTH_PROFILE_MODES = [
	"api_key",
	"aws-sdk",
	"oauth",
	"token"
];
const SUPPORTED_POLICY_SECTIONS = [
	"auth",
	"agents",
	"channels",
	"dataHandling",
	"execApprovals",
	"gateway",
	"ingress",
	"mcp",
	"models",
	"network",
	"routing",
	"sandbox",
	"scopes",
	"secrets",
	"tools"
];
const SUPPORTED_DM_POLICIES = [
	"pairing",
	"allowlist",
	"open",
	"disabled"
];
const SUPPORTED_DM_SCOPES = [
	"main",
	"per-peer",
	"per-channel-peer",
	"per-account-channel-peer"
];
const SUPPORTED_EXEC_APPROVAL_SECURITY = [
	"deny",
	"allowlist",
	"full"
];
//#endregion
//#region extensions/policy/src/doctor/access-findings.ts
function authProfileMetadataRequirementFindings(policy, policyPath, policyDocName) {
	const finding = createOrderedPolicyShape(policy, {
		policyPath,
		policyDocName
	}).list("auth.profiles.requireMetadata", {
		allowed: SUPPORTED_AUTH_PROFILE_METADATA,
		normalize: "lower",
		array: {
			message: "{policy} {property} must be an array of metadata keys.",
			hint: "Use supported metadata keys: {allowed}."
		},
		entry: {
			message: "{policy} {property}[{index}] must be a supported metadata key.",
			hint: "Use supported metadata keys: {allowed}."
		}
	});
	return finding === void 0 ? [] : [finding];
}
function invalidChannelDenyRuleFindings(policy, policyPath, policyDocName) {
	const shape = createOrderedPolicyShape(policy, {
		policyPath,
		policyDocName
	});
	const rules = shape.value("channels.denyRules");
	if (rules === void 0) return [];
	if (!Array.isArray(rules)) return [shape.finding("channels.denyRules", {
		message: "{policy} {property} must be an array.",
		hint: "Fix {policy} so channel deny rules are an array."
	})];
	for (const [index, rule] of rules.entries()) {
		if (!isRecord(rule)) continue;
		const entry = createOrderedPolicyShape(rule, {
			policyPath,
			policyDocName,
			propertyPrefix: "channels.denyRules[" + index + "]",
			targetPrefix: "channels/denyRules/#" + index
		});
		const finding = entry.keys("", [
			"id",
			"reason",
			"when"
		], "", "Remove {unsupported} or use id, when.provider, and reason.", "{policy} {unsupported} is not supported in channel deny rules.") ?? entry.keys("when", ["provider"], "", "Remove {unsupported} or use when.provider.", "{policy} {unsupported} is not supported in channel deny rules.");
		if (finding !== void 0) return [finding];
	}
	const index = rules.findIndex((rule) => !isChannelDenyRule(rule));
	return index < 0 ? [] : [shape.finding("channels.denyRules", {
		message: "{policy} {property}[{index}] must define when.provider as a string.",
		hint: "Fix {policy} so each channel deny rule has a provider match."
	}, { index })];
}
//#endregion
//#region extensions/policy/src/doctor/policy-runtime.ts
const normalizePolicyChannelId = normalizeLowercaseStringOrEmpty;
const loadFsPromisesModule = createLazyRuntimeModule(() => import("node:fs/promises"));
async function readPolicyFile(ctx) {
	const displayName = policyDisplayName(ctx);
	const path = resolveWorkspacePath(ctx, policyPathSetting(ctx));
	try {
		return {
			raw: await (await loadFsPromisesModule()).readFile(path, "utf-8"),
			path,
			displayName,
			ocDocName: basename(displayName)
		};
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
}
async function readExecApprovalsFile(_ctx) {
	const snapshot = readExecApprovalsSnapshot();
	if (!snapshot.exists || snapshot.raw === null) return null;
	return {
		raw: snapshot.raw,
		path: snapshot.path,
		displayName: snapshot.path,
		ocDocName: EXEC_APPROVALS_POLICY_DOCUMENT_NAME
	};
}
async function readWorkspaceFile(ctx, fileName) {
	const path = resolveWorkspacePath(ctx, fileName);
	try {
		return {
			raw: await (await loadFsPromisesModule()).readFile(path, "utf-8"),
			path
		};
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
}
function resolveWorkspacePath(ctx, fileName) {
	if (isAbsolute(fileName)) return fileName;
	return resolve(ctx.cwd ?? process.cwd(), fileName);
}
function isNotFoundPathError(err) {
	return typeof err === "object" && err !== null && "code" in err && err.code === "ENOENT";
}
function parseExecApprovalsFile(raw) {
	try {
		const value = JSON.parse(raw);
		if (!isRecord(value) || value.version !== 1) return {
			ok: false,
			message: "unsupported exec approvals version"
		};
		return {
			ok: true,
			value
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err)
		};
	}
}
function parsePolicyFile(raw) {
	try {
		return {
			ok: true,
			value: JSON5.parse(raw)
		};
	} catch (err) {
		return {
			ok: false,
			message: err instanceof Error ? err.message : String(err)
		};
	}
}
function workspaceRepairsEnabled(ctx) {
	return policySettings(ctx).workspaceRepairs === true;
}
function workspaceRepairsDisabledResult(fileName) {
	return {
		status: "skipped",
		reason: "workspace repairs are disabled",
		changes: [],
		warnings: [`Skipped ${fileName} repair. Enable plugins.entries.policy.config.workspaceRepairs to let doctor --fix edit workspace files.`]
	};
}
function readChannelDenyRules(policy, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.channels) || !Array.isArray(policy.channels.denyRules)) return [];
	return policy.channels.denyRules.map((rule, index) => ({
		rule,
		index
	})).filter((entry) => isChannelDenyRule(entry.rule)).map(({ rule, index }) => {
		const next = {
			when: rule.when,
			requirement: `oc://${policyDocName}/channels/denyRules/#${index}`
		};
		if (rule.id !== void 0) next.id = rule.id;
		if (rule.reason !== void 0) next.reason = rule.reason;
		return next;
	});
}
function channelIdsFromFindings(findings) {
	return [...new Set(findings.filter((finding) => finding.checkId === CHECK_IDS.policyDeniedChannelProvider).map((finding) => finding.ocPath?.match(/^oc:\/\/openclaw\.config\/channels\/(.+)$/)?.[1]).filter((id) => id !== void 0 && id !== ""))];
}
function disableChannels(cfg, channelIds) {
	if (!isRecord(cfg.channels)) return {
		config: cfg,
		changed: []
	};
	const channels = { ...cfg.channels };
	const changed = [];
	for (const id of channelIds) {
		const current = channels[id];
		if (!isRecord(current) || current.enabled === false) continue;
		channels[id] = {
			...current,
			enabled: false
		};
		changed.push(id);
	}
	if (changed.length === 0) return {
		config: cfg,
		changed
	};
	return {
		config: {
			...cfg,
			channels
		},
		changed
	};
}
function policySettings(ctx) {
	const pluginConfig = ctx.cfg.plugins?.entries?.["policy"]?.config;
	if (!isRecord(pluginConfig)) return {};
	return pluginConfig;
}
function policyChecksEnabled(ctx, settings) {
	const entry = ctx.cfg.plugins?.entries?.["policy"];
	if (!isRecord(entry) || entry.enabled === false) return false;
	return settings.enabled !== false;
}
function requiredToolMetadata(policy) {
	return new Set(readPolicyStringArray(policy, ["tools", "requireMetadata"]) ?? []);
}
function requiredAuthProfileMetadata(policy) {
	const entries = readPolicyStringArray(policy, [
		"auth",
		"profiles",
		"requireMetadata"
	]) ?? [];
	return new Set(entries.filter((entry) => SUPPORTED_AUTH_PROFILE_METADATA.includes(entry)));
}
function authProfileHasMetadata(profile, metadata) {
	if (metadata === "provider") return profile.provider !== void 0 && profile.provider.trim() !== "";
	return SUPPORTED_AUTH_PROFILE_MODES.includes(profile.mode);
}
function execApprovalsDisplayName() {
	return resolveExecApprovalsDisplayPath();
}
function policyPathSetting(ctx) {
	const configured = policySettings(ctx).path;
	return typeof configured === "string" && configured.trim() !== "" ? configured.trim() : "policy.jsonc";
}
function policyDisplayName(ctx) {
	const configured = policyPathSetting(ctx);
	return isAbsolute(configured) ? basename(configured) : configured;
}
//#endregion
//#region extensions/policy/src/doctor/strictness.ts
function isPolicyValueAtLeastAsStrict(metadata, candidate, baseline) {
	switch (metadata.strictness) {
		case "allowlist-subset": return isPolicyAllowlistSubset(metadata, candidate, baseline);
		case "denylist-superset": return isPolicyDenylistSuperset(metadata, candidate, baseline);
		case "ordered-string": return isPolicyOrderedStringAtLeastAsStrict(metadata, candidate, baseline);
		case "requires-true": return baseline !== true || candidate === true;
		case "requires-false": return baseline !== false || candidate === false;
		case "exact-list": return samePolicyStringList(candidate, baseline, metadata);
		case "routing-probes": return routingProbesAtLeastAsStrict(candidate, baseline);
	}
	return false;
}
function routingProbesAtLeastAsStrict(candidate, baseline) {
	if (!Array.isArray(candidate) || !Array.isArray(baseline)) return false;
	const candidateById = /* @__PURE__ */ new Map();
	for (const entry of candidate) {
		if (!isRecord(entry) || !hasNonEmptyString(entry.id) || candidateById.has(entry.id)) return false;
		candidateById.set(entry.id, entry);
	}
	return baseline.every((baselineEntry) => {
		if (!isRecord(baselineEntry) || !hasNonEmptyString(baselineEntry.id)) return false;
		const candidateEntry = candidateById.get(baselineEntry.id);
		if (!isRecord(candidateEntry)) return false;
		const candidateRoute = canonicalRoutingRoute(candidateEntry.route);
		const baselineRoute = canonicalRoutingRoute(baselineEntry.route);
		if (candidateRoute === void 0 || baselineRoute === void 0 || candidateRoute !== baselineRoute || !isRecord(candidateEntry.expect) || !isRecord(baselineEntry.expect) || !hasNonEmptyString(candidateEntry.expect.agentId) || !hasNonEmptyString(baselineEntry.expect.agentId) || normalizeAgentId(candidateEntry.expect.agentId) !== normalizeAgentId(baselineEntry.expect.agentId)) return false;
		return routingMatchKindsAtLeastAsStrict(candidateEntry.expect.matchedBy, baselineEntry.expect.matchedBy);
	});
}
function routingMatchKindsAtLeastAsStrict(candidate, baseline) {
	if (baseline === void 0) return candidate === void 0 || validRoutingMatchKinds(candidate);
	if (!validRoutingMatchKinds(candidate) || !validRoutingMatchKinds(baseline)) return false;
	const baselineKinds = new Set(baseline);
	return candidate.every((entry) => baselineKinds.has(entry));
}
function validRoutingMatchKinds(value) {
	return Array.isArray(value) && value.length > 0 && value.every((entry) => typeof entry === "string" && ROUTING_MATCH_KINDS.includes(entry)) && new Set(value).size === value.length;
}
function canonicalRoutingRoute(value) {
	if (!isRecord(value) || Object.keys(value).some((key) => ![
		"accountId",
		"channel",
		"guildId",
		"memberRoleIds",
		"parentPeer",
		"peer",
		"teamId"
	].includes(key)) || !hasNonEmptyString(value.channel) || [
		value.accountId,
		value.guildId,
		value.teamId
	].some((entry) => entry !== void 0 && !hasNonEmptyString(entry))) return;
	const peer = canonicalRoutingPeer(value.peer);
	const parentPeer = canonicalRoutingPeer(value.parentPeer);
	if (peer === null || parentPeer === null) return;
	const memberRoleIds = value.memberRoleIds;
	if (memberRoleIds !== void 0 && (!Array.isArray(memberRoleIds) || memberRoleIds.length === 0 || memberRoleIds.some((entry) => !hasNonEmptyString(entry)) || new Set(memberRoleIds).size !== memberRoleIds.length)) return;
	return JSON.stringify({
		channel: normalizeLowercaseStringOrEmpty(value.channel),
		accountId: normalizeAccountId(value.accountId),
		peer,
		parentPeer,
		guildId: normalizeRoutingId(value.guildId),
		teamId: normalizeRoutingId(value.teamId),
		memberRoleIds: memberRoleIds?.toSorted()
	});
}
function canonicalRoutingPeer(value) {
	if (value === void 0) return;
	if (!isRecord(value) || Object.keys(value).some((key) => key !== "id" && key !== "kind") || ![
		"channel",
		"direct",
		"group"
	].includes(value.kind) || !hasNonEmptyString(value.id)) return null;
	return {
		kind: value.kind,
		id: value.id.trim()
	};
}
function normalizeRoutingId(value) {
	return typeof value === "string" ? value.trim() : void 0;
}
function isPolicyOrderedStringAtLeastAsStrict(metadata, candidate, baseline) {
	const candidateValue = policyString(candidate, metadata);
	const baselineValue = policyString(baseline, metadata);
	if (candidateValue === void 0 || baselineValue === void 0 || metadata.orderedValues === void 0) return false;
	const orderedValues = metadata.orderedValues.map((entry) => metadata.caseSensitive === true ? entry : entry.toLowerCase());
	const candidateIndex = orderedValues.indexOf(candidateValue);
	const baselineIndex = orderedValues.indexOf(baselineValue);
	return candidateIndex >= 0 && baselineIndex >= 0 && candidateIndex >= baselineIndex;
}
function isPolicyAllowlistSubset(metadata, candidate, baseline) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	if (metadata.emptyList === "disabled" && baselineList.length === 0) return true;
	if (metadata.emptyList === "disabled" && baselineList.length > 0 && candidateList.length === 0) return false;
	const allowed = new Set(baselineList);
	return candidateList.every((entry) => allowed.has(entry));
}
function isPolicyDenylistSuperset(metadata, candidate, baseline) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	if (metadata.policyPath.join(".") === "tools.denyTools") return baselineList.flatMap(expandPolicyToolRequirement).every((tool) => toolListCoversTool(candidateList, tool));
	const denied = new Set(candidateList);
	return baselineList.every((entry) => denied.has(entry));
}
function samePolicyStringList(candidate, baseline, metadata) {
	const candidateList = policyStringList(candidate, metadata);
	const baselineList = policyStringList(baseline, metadata);
	if (candidateList === void 0 || baselineList === void 0) return false;
	const candidateSorted = candidateList.toSorted();
	const baselineSorted = baselineList.toSorted();
	return candidateSorted.length === baselineSorted.length && candidateSorted.every((entry, index) => entry === baselineSorted[index]);
}
function policyStringList(value, metadata) {
	if (metadata.valueType === "channel-provider-deny-rules") return channelProviderDenyRuleList(value, metadata);
	if (!Array.isArray(value)) return;
	if (metadata.policyPath.join(".") === "execApprovals.agents.allowlist.expected") return readExecApprovalAllowlistRequirements(value, [])?.map((entry) => entry.key);
	if (!value.every((entry) => typeof entry === "string")) return;
	return value.map((entry) => entry.trim()).filter(Boolean).map((entry) => normalizePolicyStringListEntry(entry, metadata));
}
function normalizePolicyStringListEntry(entry, metadata) {
	if (metadata.normalizeValues === "model-provider") return normalizeProviderId(entry);
	return metadata.caseSensitive === true ? entry : entry.toLowerCase();
}
function channelProviderDenyRuleList(value, metadata) {
	if (!Array.isArray(value)) return;
	const providers = [];
	for (const entry of value) {
		if (!isChannelDenyRule(entry)) return;
		const provider = entry.when?.provider?.trim();
		if (provider !== void 0 && provider !== "") providers.push(metadata.caseSensitive === true ? provider : provider.toLowerCase());
	}
	return providers;
}
function policyString(value, metadata) {
	if (typeof value !== "string" || value.trim() === "") return;
	const trimmed = value.trim();
	return metadata.caseSensitive === true ? trimmed : trimmed.toLowerCase();
}
//#endregion
//#region extensions/policy/src/doctor/policy-scope.ts
function scopedWorkspaceAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "defaults" && !hasScopedAgentEvidence(entries, entry.kind, policyAgentId);
}
function scopedToolAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "global" && !hasScopedToolEvidence(entries, entry.kind, policyAgentId);
}
function hasScopedAgentEvidence(entries, kind, policyAgentId) {
	return entries.some((candidate) => candidate.scope === "agent" && candidate.kind === kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function hasScopedToolEvidence(entries, kind, policyAgentId) {
	return entries.some((candidate) => candidate.scope === "agent" && candidate.kind === kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function scopedAgentIdMatches(evidenceAgentId, policyAgentId) {
	return evidenceAgentId !== void 0 && normalizeAgentId(evidenceAgentId) === normalizeAgentId(policyAgentId);
}
function policyOrScopeHasRules(policy, section, hasRules) {
	if (!isRecord(policy)) return false;
	return hasRules(policy[section]) || agentScopedPolicyOverlays(policy).some(([, overlay]) => hasRules(overlay[section]));
}
function policyHasExecApprovalsRules(policy) {
	return policyOrScopeHasRules(policy, "execApprovals", execApprovalsPolicyHasRules);
}
function execApprovalsPolicyHasRules(value) {
	return isRecord(value) && (value.requireFile !== void 0 || isRecord(value.defaults) || isRecord(value.agents));
}
function policyHasSecretRules(policy) {
	if (!isRecord(policy) || !isRecord(policy.secrets)) return false;
	return policy.secrets.requireManagedProviders !== void 0 || policy.secrets.denySources !== void 0 || policy.secrets.allowInsecureProviders !== void 0;
}
function policyHasAuthProfileRules(policy) {
	return isRecord(policy) && isRecord(policy.auth) && isRecord(policy.auth.profiles) && (policy.auth.profiles.requireMetadata !== void 0 || policy.auth.profiles.allowModes !== void 0);
}
function policyHasIngressRules(policy) {
	return policyOrScopeHasRules(policy, "ingress", ingressPolicyHasRules);
}
function policyHasRoutingRules(policy) {
	return isRecord(policy) && isRecord(policy.routing);
}
function ingressPolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const ingress = value;
	return isRecord(ingress.session) && ingress.session.requireDmScope !== void 0 || isRecord(ingress.channels) && (ingress.channels.allowDmPolicies !== void 0 || ingress.channels.denyOpenGroups !== void 0 || ingress.channels.requireMentionInGroups !== void 0);
}
function policyHasGatewayRules(policy) {
	if (!isRecord(policy) || !isRecord(policy.gateway)) return false;
	const gateway = policy.gateway;
	return isRecord(gateway.exposure) && (gateway.exposure.allowNonLoopbackBind !== void 0 || gateway.exposure.allowTailscaleFunnel !== void 0) || isRecord(gateway.auth) && (gateway.auth.requireAuth !== void 0 || gateway.auth.requireExplicitRateLimit !== void 0) || isRecord(gateway.controlUi) && gateway.controlUi.allowInsecure !== void 0 || isRecord(gateway.remote) && gateway.remote.allow !== void 0 || isRecord(gateway.http) && (gateway.http.denyEndpoints !== void 0 || gateway.http.requireUrlAllowlists !== void 0) || isRecord(gateway.nodes) && gateway.nodes.denyCommands !== void 0;
}
function policyHasAgentWorkspaceRules(policy) {
	if (!isRecord(policy)) return false;
	if (isRecord(policy.agents) && workspacePolicyHasRules(policy.agents.workspace)) return true;
	return agentScopedPolicyOverlays(policy).some(([, overlay]) => {
		return workspacePolicyHasRules((isRecord(overlay.agents) ? overlay.agents : {}).workspace);
	});
}
function policyHasSandboxPostureRules(policy) {
	return policyOrScopeHasRules(policy, "sandbox", sandboxPosturePolicyHasRules);
}
function sandboxPosturePolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const sandbox = value;
	const containers = isRecord(sandbox.containers) ? sandbox.containers : void 0;
	const browser = isRecord(sandbox.browser) ? sandbox.browser : void 0;
	return sandbox.requireMode !== void 0 || sandbox.allowBackends !== void 0 || containers !== void 0 && SANDBOX_CONTAINER_POLICY_RULES.some((rule) => containers[rule.key] !== void 0) || browser?.requireCdpSourceRange !== void 0;
}
function policyHasDataHandlingRules(policy) {
	return policyOrScopeHasRules(policy, "dataHandling", dataHandlingPolicyHasRules);
}
function dataHandlingPolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const dataHandling = value;
	return isRecord(dataHandling.sensitiveLogging) && dataHandling.sensitiveLogging.requireRedaction !== void 0 || isRecord(dataHandling.telemetry) && dataHandling.telemetry.denyContentCapture !== void 0 || isRecord(dataHandling.retention) && dataHandling.retention.requireSessionMaintenance !== void 0 || isRecord(dataHandling.memory) && dataHandling.memory.denySessionTranscriptIndexing !== void 0;
}
function policyHasToolPostureRules(policy) {
	return policyOrScopeHasRules(policy, "tools", toolPosturePolicyHasRules);
}
function workspacePolicyHasRules(value) {
	return isRecord(value) && (value.allowedAccess !== void 0 || value.denyTools !== void 0);
}
function toolPosturePolicyHasRules(value) {
	if (!isRecord(value)) return false;
	const tools = value;
	return isRecord(tools.profiles) && tools.profiles.allow !== void 0 || isRecord(tools.fs) && tools.fs.requireWorkspaceOnly !== void 0 || isRecord(tools.exec) && (tools.exec.allowSecurity !== void 0 || tools.exec.requireAsk !== void 0 || tools.exec.allowHosts !== void 0) || isRecord(tools.elevated) && tools.elevated.allow !== void 0 || isRecord(tools.alsoAllow) && tools.alsoAllow.expected !== void 0 || tools.denyTools !== void 0;
}
function agentScopedPolicyOverlays(policy) {
	if (!isRecord(policy) || !isRecord(policy.scopes)) return [];
	return Object.entries(policy.scopes).filter((entry) => isRecord(entry[1]));
}
function agentScopedPolicyTargets(policy) {
	const targets = [];
	for (const [scopeName, overlay] of agentScopedPolicyOverlays(policy)) {
		if (!Array.isArray(overlay.agentIds)) continue;
		for (const rawAgentId of overlay.agentIds) {
			if (typeof rawAgentId !== "string" || rawAgentId.trim() === "") continue;
			targets.push({
				scopeName,
				agentId: normalizeAgentId(rawAgentId),
				overlay
			});
		}
	}
	return targets;
}
function channelScopedPolicyTargets(policy) {
	const targets = [];
	for (const [scopeName, overlay] of agentScopedPolicyOverlays(policy)) {
		if (!Array.isArray(overlay.channelIds)) continue;
		for (const rawChannelId of overlay.channelIds) {
			if (typeof rawChannelId !== "string" || rawChannelId.trim() === "") continue;
			targets.push({
				scopeName,
				channelId: normalizePolicyChannelId(rawChannelId),
				overlay
			});
		}
	}
	return targets;
}
function duplicateScopedPolicyFieldFinding(scopes, params) {
	return duplicateScopedFieldFinding(scopes, {
		...params,
		selector: "agentIds",
		selectorLabel: "agent",
		normalize: normalizeAgentId
	}) ?? duplicateScopedFieldFinding(scopes, {
		...params,
		selector: "channelIds",
		selectorLabel: "channel",
		normalize: normalizePolicyChannelId
	});
}
function duplicateScopedFieldFinding(scopes, params) {
	const seen = /* @__PURE__ */ new Map();
	for (const [scopeName, overlay] of Object.entries(scopes)) {
		if (!isRecord(overlay)) continue;
		const selectorValues = overlay[params.selector];
		if (!Array.isArray(selectorValues)) continue;
		const fields = scopedPolicyFields(scopeName, overlay, params.selector);
		for (const rawSelectorValue of selectorValues) {
			if (typeof rawSelectorValue !== "string" || rawSelectorValue.trim() === "") continue;
			const selectorValue = params.normalize(rawSelectorValue);
			for (const field of fields) {
				const topLevelValue = getPolicyPath(params.policy, field.metadata.policyPath);
				if (topLevelValue !== void 0 && !isPolicyValueAtLeastAsStrict(field.metadata, field.value, topLevelValue)) return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${field.targetPath}`, `${params.policyPath} scopes.${scopeName}.${field.propertyPath} is weaker than the top-level ${field.propertyPath} policy.`, `Use an equally or more restrictive scoped value, or remove the scoped override.`);
				const key = `${selectorValue}\0${field.fieldPath}`;
				const previous = seen.get(key);
				if (previous !== void 0) {
					if (isPolicyValueAtLeastAsStrict(field.metadata, field.value, previous.field.value)) {
						seen.set(key, {
							scopeName,
							propertyPath: `scopes.${scopeName}.${field.propertyPath}`,
							field
						});
						continue;
					}
					return policyShapeFinding(params.policyPath, `oc://${params.policyDocName}/${field.targetPath}`, `${params.policyPath} scopes.${scopeName}.${field.propertyPath} is not an equally or more restrictive override of ${previous.propertyPath} for ${params.selectorLabel} '${selectorValue}'.`, `Use one effective scoped value per ${params.selectorLabel}, or make later scoped values stricter according to policy metadata.`);
				}
				seen.set(key, {
					scopeName,
					propertyPath: `scopes.${scopeName}.${field.propertyPath}`,
					field
				});
			}
		}
	}
}
function scopedPolicyFields(scopeName, overlay, selector) {
	const prefix = `scopes/${ocPathSegment(scopeName)}`;
	return POLICY_RULES.filter((rule) => rule.scopeSelectors?.includes(selector) === true).map((rule) => ({
		rule,
		value: scopedPolicyValue(overlay, rule.policyPath)
	})).filter((entry) => entry.value !== void 0).map(({ rule, value }) => ({
		fieldPath: rule.policyPath.join("."),
		propertyPath: rule.policyPath.join("."),
		targetPath: `${prefix}/${rule.policyPath.map(ocPathSegment).join("/")}`,
		metadata: rule,
		value
	}));
}
//#endregion
//#region extensions/policy/src/doctor/posture-shapes.ts
const rules = POLICY_RULE_METADATA;
function object(path) {
	return {
		kind: "object",
		path: path.split(".")
	};
}
function keys(path, section, hint, scoped = false) {
	const prefix = path.split(".");
	const allowed = /* @__PURE__ */ new Set();
	for (const entry of rules) if (prefix.every((part, index) => entry.policyPath[index] === part) && (!scoped || entry.scopeSelectors?.includes("agentIds"))) {
		const key = entry.policyPath[prefix.length];
		if (key !== void 0) allowed.add(key);
	}
	return {
		kind: "keys",
		path: prefix,
		allowed: [...allowed],
		section,
		hint,
		scoped
	};
}
function rule(path, valueName = "", style) {
	const metadata = rules.find((entry) => entry.policyPath.join(".") === path);
	if (metadata === void 0 || metadata.valueType !== "boolean" && metadata.valueType !== "string-list") throw new Error(`Unsupported posture shape rule: ${path}`);
	let listStyle;
	if (style === "node-commands") listStyle = { kind: style };
	else if (style !== void 0) {
		if (metadata.allowedValues === void 0) throw new Error(`Missing posture shape enum values: ${path}`);
		listStyle = {
			kind: style,
			allowed: metadata.allowedValues
		};
	}
	return {
		kind: "rule",
		path: metadata.policyPath,
		metadata,
		valueName,
		style: listStyle
	};
}
const workspace = [
	object("agents.workspace"),
	keys("agents.workspace", "agent workspace", "a supported agent workspace policy rule"),
	rule("agents.workspace.allowedAccess", "", "workspace-access"),
	rule("agents.workspace.denyTools", "", "workspace-tools")
];
const tools = [
	keys("tools", "tools", "a supported tools policy rule"),
	...[
		"profiles",
		"fs",
		"exec",
		"elevated",
		"alsoAllow"
	].map((key) => object(`tools.${key}`)),
	keys("tools.profiles", "tools", { key: "allow" }),
	rule("tools.profiles.allow", "tool profile id"),
	keys("tools.fs", "tools", { key: "requireWorkspaceOnly" }),
	rule("tools.fs.requireWorkspaceOnly"),
	keys("tools.exec", "tools", "a supported tools exec policy rule"),
	rule("tools.exec.allowSecurity", "exec security mode"),
	rule("tools.exec.requireAsk", "exec ask mode"),
	rule("tools.exec.allowHosts", "exec host"),
	keys("tools.elevated", "tools", { key: "allow" }),
	rule("tools.elevated.allow"),
	keys("tools.alsoAllow", "tools", { key: "expected" }),
	rule("tools.alsoAllow.expected", "tool id"),
	rule("tools.denyTools", "tool id or group")
];
const gatewaySections = [
	"exposure",
	"auth",
	"controlUi",
	"remote",
	"http",
	"nodes"
];
const shapes = {
	agents: [
		object("agents"),
		keys("agents", "agents", { key: "workspace" }),
		...workspace
	],
	workspace,
	tools,
	"scoped-tools": [
		keys("tools", "agent-scoped tools", "", true),
		...[
			"profiles",
			"fs",
			"exec",
			"elevated",
			"alsoAllow"
		].map((key) => keys(`tools.${key}`, "agent-scoped tools", "", true)),
		...tools
	],
	sandbox: [
		object("sandbox"),
		keys("sandbox", "sandbox", "a supported sandbox posture rule"),
		rule("sandbox.requireMode", "sandbox mode"),
		rule("sandbox.allowBackends", "sandbox backend id"),
		object("sandbox.containers"),
		object("sandbox.browser"),
		keys("sandbox.containers", "sandbox", "a supported sandbox container posture rule"),
		...rules.filter((entry) => entry.policyPath[0] === "sandbox" && entry.policyPath[1] === "containers").map((entry) => rule(entry.policyPath.join("."))),
		keys("sandbox.browser", "sandbox", "a supported sandbox browser posture rule"),
		rule("sandbox.browser.requireCdpSourceRange")
	],
	gateway: [
		object("gateway"),
		...gatewaySections.map((key) => object(`gateway.${key}`)),
		keys("gateway", "Gateway", "a supported Gateway policy section"),
		...gatewaySections.map((key) => keys(`gateway.${key}`, "Gateway", "a supported Gateway policy rule")),
		rule("gateway.exposure.allowNonLoopbackBind"),
		rule("gateway.exposure.allowTailscaleFunnel"),
		rule("gateway.auth.requireAuth"),
		rule("gateway.auth.requireExplicitRateLimit"),
		rule("gateway.controlUi.allowInsecure"),
		rule("gateway.remote.allow"),
		rule("gateway.http.requireUrlAllowlists"),
		rule("gateway.http.denyEndpoints", "", "http-endpoints"),
		rule("gateway.nodes.denyCommands", "", "node-commands")
	]
};
function posturePolicyShapeFinding(shape, value, params) {
	if (value === void 0) return;
	const root = shape === "workspace" ? "agents.workspace" : shape === "scoped-tools" ? "tools" : shape;
	const rootDepth = root.split(".").length;
	const validator = createOrderedPolicyShape(value, {
		...params,
		propertyPrefix: params.propertyPrefix ?? root,
		targetPrefix: params.targetPrefix ?? root.replaceAll(".", "/")
	});
	function* findings() {
		for (const step of shapes[shape]) {
			const path = step.path.slice(rootDepth).join(".");
			if (step.kind === "object") yield validator.object(path);
			else if (step.kind === "keys") {
				const hint = typeof step.hint === "string" ? step.hint : "{property}." + step.hint.key;
				yield validator.keys(path, step.allowed, step.section, step.scoped ? "Move {unsupported} to top-level tools or use a supported scoped tools posture rule." : "Remove {unsupported} or use " + hint + ".");
			} else if (step.metadata.valueType === "boolean") yield validator.boolean(path, shape === "gateway" ? "Fix {policy} so {property} is true or false." : void 0);
			else if (step.style === void 0) yield validator.list(path, {
				allowed: step.metadata.allowedValues,
				valueName: step.valueName
			});
			else yield customListShapeFinding(validator, path, step.style);
		}
	}
	return firstPolicyShapeFinding(findings());
}
function customListShapeFinding(validator, path, style) {
	let arrayHint;
	let entryHint;
	let entryMessage;
	switch (style.kind) {
		case "workspace-access":
			arrayHint = "Use workspace access values such as [\"none\", \"ro\"].";
			entryHint = arrayHint;
			entryMessage = "must be none, ro, or rw.";
			break;
		case "workspace-tools":
			arrayHint = "Use tool ids such as [\"exec\", \"process\", \"write\", \"edit\", \"apply_patch\"].";
			entryHint = "Use supported tool ids: {allowed}.";
			entryMessage = "must be a supported agent workspace tool id.";
			break;
		case "http-endpoints":
			arrayHint = "Use an array of endpoint ids such as [\"responses\"] or remove gateway.http.denyEndpoints.";
			entryHint = "Use supported endpoint ids: {allowed}.";
			entryMessage = "must be a supported endpoint id.";
			break;
		case "node-commands":
			arrayHint = "Use an array of node command ids such as [\"system.run\"] or remove gateway.nodes.denyCommands.";
			entryHint = "Use non-empty node command ids.";
			entryMessage = "must be a non-empty node command id.";
	}
	return validator.list(path, {
		allowed: style.kind === "node-commands" ? void 0 : style.allowed,
		normalize: style.kind === "workspace-access" ? "raw" : "trim",
		array: {
			message: "{policy} {property} must be an array.",
			hint: arrayHint
		},
		entry: {
			message: "{policy} {property}[{index}] " + entryMessage,
			hint: entryHint
		}
	});
}
//#endregion
//#region extensions/policy/src/doctor/access-shapes.ts
function ingressPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	const shape = createOrderedPolicyShape(value, {
		...params,
		propertyPrefix: params.propertyPrefix ?? "ingress",
		targetPrefix: params.targetPrefix ?? "ingress"
	});
	function* findings() {
		yield shape.object("");
		if (params.allowSession === false && shape.value("session") !== void 0) yield shape.finding("session", {
			message: "{policy} {property} is not supported by the channelIds selector.",
			hint: "Move session ingress rules to top-level ingress; scoped ingress currently supports ingress.channels.*."
		});
		yield shape.keys("", ["channels", "session"], "ingress", "Remove {unsupported} or use ingress.session or ingress.channels.");
		yield shape.object("session");
		yield shape.object("channels");
		yield shape.keys("session", ["requireDmScope"], "ingress", "Remove {unsupported} or use {property}.requireDmScope.");
		yield shape.enum("session.requireDmScope", SUPPORTED_DM_SCOPES, {
			message: "{policy} {property} must be a supported DM scope.",
			hint: "Use supported DM scopes: {allowed}."
		});
		yield shape.keys("channels", [
			"allowDmPolicies",
			"denyOpenGroups",
			"requireMentionInGroups"
		], "ingress", "Remove {unsupported} or use a supported ingress channel policy rule.");
		yield shape.list("channels.allowDmPolicies", {
			allowed: SUPPORTED_DM_POLICIES,
			valueName: "DM policy"
		});
		yield shape.boolean("channels.denyOpenGroups");
		yield shape.boolean("channels.requireMentionInGroups");
	}
	return firstPolicyShapeFinding(findings());
}
function execApprovalsPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	const context = {
		...params,
		propertyPrefix: params.propertyPrefix ?? "execApprovals",
		targetPrefix: params.targetPrefix ?? "execApprovals"
	};
	const shape = createOrderedPolicyShape(value, context);
	const allowDefaults = params.allowDefaults ?? true;
	function* findings() {
		yield shape.object("");
		yield shape.keys("", allowDefaults ? [
			"agents",
			"defaults",
			"requireFile"
		] : ["agents"], "exec approvals", "Remove {unsupported} or use a supported execApprovals rule.");
		yield shape.boolean("requireFile", "Set execApprovals.requireFile to true or false.");
		for (const section of allowDefaults ? ["defaults", "agents"] : ["agents"]) yield shape.object(section);
		if (allowDefaults) {
			yield shape.keys("defaults", ["allowSecurity"], "exec approvals", "Use execApprovals.defaults.allowSecurity or remove the unsupported rule.");
			yield shape.list("defaults.allowSecurity", {
				allowed: SUPPORTED_EXEC_APPROVAL_SECURITY,
				valueName: "exec approval security mode"
			});
		}
		yield shape.keys("agents", [
			"allowAutoAllowSkills",
			"allowSecurity",
			"allowlist"
		], "exec approvals", "Use execApprovals.agents.allowSecurity, execApprovals.agents.allowAutoAllowSkills, or execApprovals.agents.allowlist.expected.");
		yield shape.list("agents.allowSecurity", {
			allowed: SUPPORTED_EXEC_APPROVAL_SECURITY,
			valueName: "exec approval security mode"
		});
		yield shape.boolean("agents.allowAutoAllowSkills", "Set execApprovals.agents.allowAutoAllowSkills to true or false.");
		yield shape.object("agents.allowlist");
		yield shape.keys("agents.allowlist", ["expected"], "exec approvals", "Use execApprovals.agents.allowlist.expected or remove the unsupported rule.");
		yield execApprovalAllowlistExpectedShapeFinding(shape.value("agents.allowlist.expected"), {
			policyDocName: params.policyDocName,
			policyPath: params.policyPath,
			property: context.propertyPrefix + ".agents.allowlist.expected",
			target: context.targetPrefix + "/agents/allowlist/expected"
		});
	}
	return firstPolicyShapeFinding(findings());
}
function scopedDataHandlingPolicyShapeFinding(dataHandling, params) {
	const shape = createOrderedPolicyShape(dataHandling, {
		...params,
		propertyPrefix: "scopes." + params.scopeName + ".dataHandling",
		targetPrefix: params.targetPrefix + "/dataHandling"
	});
	function* findings() {
		yield shape.keys("", ["memory"], "", "Move global data-handling rules to top-level dataHandling, or use dataHandling.memory with agentIds.", "{policy} {unsupported} is not a supported scoped policy section.");
		yield shape.object("memory", "Fix {policy} so the scoped dataHandling.memory policy section is an object.");
		yield shape.keys("memory", ["denySessionTranscriptIndexing"], "", "Use dataHandling.memory.denySessionTranscriptIndexing or remove the unsupported rule.", "{policy} {unsupported} is not a supported scoped policy rule.");
		yield shape.boolean("memory.denySessionTranscriptIndexing", "Set dataHandling.memory.denySessionTranscriptIndexing to true or false.");
	}
	return firstPolicyShapeFinding(findings());
}
//#endregion
//#region extensions/policy/src/doctor/scoped-policy-shape.ts
function scopedPolicyShapeFinding(value, params) {
	if (value === void 0) return;
	const root = createOrderedPolicyShape(value, {
		...params,
		propertyPrefix: "scopes",
		targetPrefix: "scopes"
	});
	if (!isRecord(value)) return root.object("", "Fix {policy} so scopes maps scope names to policy overlays with selectors such as agentIds.");
	const scopes = value;
	function* findings() {
		for (const [scopeName, overlay] of Object.entries(scopes)) {
			const targetPrefix = "scopes/" + ocPathSegment(scopeName);
			const propertyPrefix = "scopes." + scopeName;
			const shape = createOrderedPolicyShape(overlay, {
				...params,
				propertyPrefix,
				targetPrefix
			});
			yield shape.object("", "Fix {policy} so the named policy scope is an object.", true);
			const hasAgentIds = shape.value("agentIds") !== void 0;
			const hasChannelIds = shape.value("channelIds") !== void 0;
			if (!hasAgentIds && !hasChannelIds) yield shape.finding("", {
				message: "{policy} {property} must define at least one selector.",
				hint: "List agentIds for agent-scoped policy or channelIds for channel-scoped ingress policy."
			});
			yield scopedSelectorShapeFinding(shape, "agentIds", "agent");
			yield scopedSelectorShapeFinding(shape, "channelIds", "channel");
			if (shape.value("ingress") !== void 0 && !hasChannelIds) yield shape.finding("ingress", {
				message: "{policy} {property} requires the channelIds selector.",
				hint: "Move global ingress rules to top-level ingress, or list channelIds for channel-scoped ingress policy."
			});
			if ([
				"agents",
				"dataHandling",
				"execApprovals",
				"tools",
				"sandbox"
			].some((section) => shape.value(section) !== void 0) && !hasAgentIds) yield shape.finding("", {
				message: "{policy} {property} uses agent-scoped sections without agentIds.",
				hint: "List agentIds for agents.workspace, dataHandling.memory, tools, or sandbox policy sections."
			});
			yield shape.keys("", [
				"agentIds",
				"channelIds",
				"agents",
				"dataHandling",
				"execApprovals",
				"tools",
				"sandbox",
				"ingress"
			], "", "Use agentIds with agents.workspace, dataHandling.memory, execApprovals, tools, or sandbox, and channelIds with ingress.channels.", "{policy} {unsupported} is not a supported scoped policy section.");
			yield shape.object("dataHandling", "Fix {policy} so the scoped dataHandling policy section is an object.");
			const dataHandling = shape.value("dataHandling");
			if (isRecord(dataHandling)) yield scopedDataHandlingPolicyShapeFinding(dataHandling, {
				...params,
				targetPrefix,
				scopeName
			});
			yield shape.object("agents", "Fix {policy} so the scoped agents policy section is an object.");
			yield shape.keys("agents", ["workspace"], "", "Move the rule under agents.workspace or a supported scoped top-level section.", "{policy} {unsupported} is not supported by the agentIds selector.");
			const sectionParams = (section) => ({
				...params,
				targetPrefix: targetPrefix + "/" + section.replaceAll(".", "/"),
				propertyPrefix: propertyPrefix + "." + section
			});
			yield posturePolicyShapeFinding("workspace", shape.value("agents.workspace"), sectionParams("agents.workspace"));
			yield execApprovalsPolicyShapeFinding(shape.value("execApprovals"), {
				...sectionParams("execApprovals"),
				allowDefaults: false
			});
			yield shape.object("tools", "Fix {policy} so the scoped tools policy overlay is an object.");
			yield posturePolicyShapeFinding("scoped-tools", shape.value("tools"), sectionParams("tools"));
			yield posturePolicyShapeFinding("sandbox", shape.value("sandbox"), sectionParams("sandbox"));
			yield ingressPolicyShapeFinding(shape.value("ingress"), {
				...sectionParams("ingress"),
				allowSession: false
			});
		}
		yield duplicateScopedPolicyFieldFinding(scopes, params);
	}
	return firstPolicyShapeFinding(findings());
}
function scopedSelectorShapeFinding(shape, path, kind) {
	const valueName = kind + " id";
	const finding = shape.list(path, { valueName });
	if (finding !== void 0) return finding;
	const value = shape.value(path);
	if (!Array.isArray(value)) return;
	if (value.length === 0) return shape.finding(path, {
		message: "{policy} {property} must include at least one {valueName}.",
		hint: "Add one or more {valueName}s to {policy} {property}."
	}, { valueName });
	const seen = /* @__PURE__ */ new Map();
	for (const [index, rawValue] of value.entries()) {
		if (typeof rawValue !== "string") continue;
		const normalized = kind === "agent" ? normalizeAgentId(rawValue) : normalizePolicyChannelId(rawValue);
		const previous = seen.get(normalized);
		if (previous !== void 0) return shape.finding(path, {
			message: "{policy} {property}[{index}] duplicates {property}[" + previous + "] after normalization.",
			hint: "List each {valueName} only once per named policy scope."
		}, {
			index,
			valueName
		});
		seen.set(normalized, index);
	}
}
function hasValidScopedPolicy(policy, policyPath, policyDocName) {
	return isRecord(policy) && scopedPolicyShapeFinding(policy.scopes, {
		policyDocName,
		policyPath,
		policy
	}) === void 0;
}
//#endregion
//#region extensions/policy/src/doctor/agent-workspace-findings.ts
function agentWorkspaceFindings(policy, policyPath, policyDocName, evidence) {
	if (posturePolicyShapeFinding("agents", isRecord(policy) ? policy.agents : void 0, {
		policyDocName,
		policyPath
	}) !== void 0) return [];
	return [
		...agentWorkspaceAccessFindings(policy, [
			"agents",
			"workspace",
			"allowedAccess"
		], policyDocName, "agents/workspace/allowedAccess", evidence, () => true),
		...agentWorkspaceToolDenyFindings(policy, [
			"agents",
			"workspace",
			"denyTools"
		], policyDocName, "agents/workspace/denyTools", evidence, () => true),
		...agentScopedWorkspaceFindings(policy, policyPath, policyDocName, evidence)
	];
}
function agentWorkspaceAccessFindings(policy, policyPath, policyDocName, requirementPath, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(policy, policyPath));
	if (allowed.size === 0) return [];
	return (evidence.agentWorkspace ?? []).filter(evidenceFilter).filter((entry) => entry.kind === "workspaceAccess" && entry.value !== void 0 && (entry.sandboxEnabled !== true || !allowed.has(entry.value))).map((entry) => {
		const label = entry.agentId === void 0 ? "agents.defaults" : `agent '${entry.agentId}'`;
		const sandboxDisabled = entry.sandboxEnabled !== true;
		const observed = sandboxDisabled ? `sandbox mode '${entry.sandboxMode ?? "off"}'` : `sandbox workspaceAccess '${entry.value ?? ""}'`;
		return policyEvidenceFinding({ source: sandboxDisabled ? entry.sandboxModeSource ?? entry.source : entry.source }, {
			checkId: CHECK_IDS.policyAgentsWorkspaceAccessDenied,
			message: `${label} ${observed} is not allowed by policy.`,
			requirement: `oc://${policyDocName}/${requirementPath}`,
			fixHint: "Enable sandbox mode with workspaceAccess none/ro or update policy after review."
		});
	});
}
function agentWorkspaceToolDenyFindings(policy, policyPath, policyDocName, requirementPath, evidence, evidenceFilter) {
	const requiredDeniedTools = new Set(readStringList(policy, policyPath));
	if (requiredDeniedTools.size === 0) return [];
	return (evidence.agentWorkspace ?? []).filter(evidenceFilter).filter((entry) => entry.kind === "toolDeny" && entry.tool !== void 0 && requiredDeniedTools.has(entry.tool) && entry.denied !== true).map((entry) => {
		const label = entry.agentId === void 0 ? "agents.defaults" : `agent '${entry.agentId}'`;
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyAgentsToolNotDenied,
			message: `${label} does not deny required tool '${entry.tool ?? ""}'.`,
			requirement: `oc://${policyDocName}/${requirementPath}`,
			fixHint: "Add the tool to tools.deny or agents.entries.<id>.tools.deny, or update policy after review."
		});
	});
}
function agentScopedWorkspaceFindings(policy, policyPath, policyDocName, evidence) {
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return [];
	const findings = [];
	for (const target of agentScopedPolicyTargets(policy)) {
		const scopedAgents = isRecord(target.overlay.agents) ? target.overlay.agents : {};
		const workspace = isRecord(scopedAgents.workspace) ? scopedAgents.workspace : {};
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/agents/workspace`;
		const evidenceFilter = (entry) => scopedWorkspaceAgentMatches(entry, target.agentId, evidence.agentWorkspace ?? []);
		findings.push(...agentWorkspaceAccessFindings({ workspace }, ["workspace", "allowedAccess"], policyDocName, `${requirementBase}/allowedAccess`, evidence, evidenceFilter), ...agentWorkspaceToolDenyFindings({ workspace }, ["workspace", "denyTools"], policyDocName, `${requirementBase}/denyTools`, evidence, evidenceFilter));
	}
	return findings;
}
//#endregion
//#region extensions/policy/src/doctor/data-auth-shapes.ts
function dataHandlingPolicyShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.dataHandling)) return [];
	const shape = createOrderedPolicyShape(policy, {
		policyPath,
		policyDocName
	});
	const sections = [
		["sensitiveLogging", "requireRedaction"],
		["telemetry", "denyContentCapture"],
		["retention", "requireSessionMaintenance"],
		["memory", "denySessionTranscriptIndexing"]
	];
	function* sectionRules(section, rule) {
		yield shape.keys("dataHandling." + section, [rule], "data-handling", "Remove {unsupported} or use {property}." + rule + ".");
		yield shape.boolean("dataHandling." + section + "." + rule);
	}
	function* findings() {
		yield shape.keys("dataHandling", [
			"memory",
			"retention",
			"sensitiveLogging",
			"telemetry"
		], "data-handling", "Remove {unsupported} or use a supported data-handling policy rule.");
		for (const [section] of sections) yield shape.object("dataHandling." + section, "Fix {property} so it contains boolean policy rules.");
		for (const [section, rule] of sections) yield firstPolicyShapeFinding(sectionRules(section, rule));
	}
	return collectPolicyShapeFindings(findings());
}
function dataHandlingEntries(evidence, kind) {
	return (evidence.dataHandling ?? []).filter((entry) => entry.kind === kind);
}
function dataHandlingLabel(entry) {
	return entry.agentId === void 0 ? "Global data handling config" : "agent '" + entry.agentId + "'";
}
function secretPolicyShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.secrets)) return [];
	const shape = createOrderedPolicyShape(policy, {
		policyPath,
		policyDocName
	});
	function* findings() {
		yield shape.boolean("secrets.requireManagedProviders");
		yield shape.boolean("secrets.allowInsecureProviders");
		yield shape.list("secrets.denySources", {
			array: {
				message: "{policy} {property} must be an array of source names.",
				hint: "Use an array such as [\"exec\"] or remove secrets.denySources."
			},
			entry: {
				message: "{policy} {property}[{index}] must be a non-empty source name.",
				hint: "Use non-empty source names such as env, file, exec, or openclaw."
			}
		});
	}
	return collectPolicyShapeFindings(findings());
}
function authProfileAllowModesShapeFindings(policy, policyPath, policyDocName) {
	const finding = createOrderedPolicyShape(policy, {
		policyPath,
		policyDocName
	}).list("auth.profiles.allowModes", {
		allowed: SUPPORTED_AUTH_PROFILE_MODES,
		normalize: "lower",
		array: {
			message: "{policy} {property} must be an array of auth modes.",
			hint: "Use supported auth modes: {allowed}."
		},
		entry: {
			message: "{policy} {property}[{index}] must be a supported auth mode.",
			hint: "Use supported auth modes: {allowed}."
		}
	});
	return finding === void 0 ? [] : [finding];
}
//#endregion
//#region extensions/policy/src/doctor/data-auth-findings.ts
function secretAuthProvenanceFindings(policy, policyPath, policyDocName, evidence) {
	const secretShapeFindings = secretPolicyShapeFindings(policy, policyPath, policyDocName);
	const authShapeFindings = authProfileAllowModesShapeFindings(policy, policyPath, policyDocName);
	return [...secretShapeFindings.length > 0 ? secretShapeFindings : [
		...secretManagedProviderFindings(policy, policyDocName, evidence),
		...secretDeniedSourceFindings(policy, policyDocName, evidence),
		...secretInsecureProviderFindings(policy, policyDocName, evidence)
	], ...authShapeFindings.length > 0 ? authShapeFindings : [...authProfileMetadataFindings(policy, policyDocName, evidence), ...authProfileModeFindings(policy, policyDocName, evidence)]];
}
function dataHandlingFindings(policy, policyPath, policyDocName, evidence) {
	const shapeFindings = dataHandlingPolicyShapeFindings(policy, policyPath, policyDocName);
	if (shapeFindings.length > 0) return shapeFindings;
	const findings = [];
	findings.push(...dataHandlingFindingsForRule(policy, policyDocName, "dataHandling", evidence, () => true));
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!dataHandlingPolicyHasRules(target.overlay.dataHandling)) continue;
		findings.push(...dataHandlingFindingsForRule(target.overlay, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/dataHandling`, evidence, (entry) => entry.kind !== "memorySessionTranscriptIndexing" || scopedDataHandlingAgentMatches(entry, target.agentId, evidence.dataHandling ?? [])));
	}
	return findings;
}
function scopedDataHandlingAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.id === "agents-defaults-memory-session-transcripts" && !entries.some((candidate) => candidate.scope === "agent" && candidate.kind === entry.kind && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function dataHandlingFindingsForRule(policy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const dataHandling = isRecord(policy) ? policy.dataHandling : void 0;
	if (!isRecord(dataHandling)) return [];
	const findings = [];
	if (readBooleanPath(dataHandling, ["telemetry", "denyContentCapture"]) === true) findings.push(...dataHandlingEntries(evidence, "telemetryContentCapture").filter(evidenceFilter).filter((entry) => entry.value === true).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingTelemetryContentCapture,
		message: "Telemetry content capture is enabled.",
		requirement: `oc://${policyDocName}/${requirementBase}/telemetry/denyContentCapture`,
		fixHint: "Disable diagnostics.otel.captureContent or update policy after review."
	})));
	if (readBooleanPath(dataHandling, ["retention", "requireSessionMaintenance"]) === true) findings.push(...dataHandlingEntries(evidence, "sessionRetentionMode").filter(evidenceFilter).filter((entry) => entry.value !== "enforce").map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingSessionRetentionNotEnforced,
		message: `Session retention maintenance mode is '${entry.value ?? "unknown"}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/retention/requireSessionMaintenance`,
		fixHint: "Set session.maintenance.mode to enforce or update policy after review."
	})));
	if (readBooleanPath(dataHandling, ["memory", "denySessionTranscriptIndexing"]) === true) findings.push(...dataHandlingEntries(evidence, "memorySessionTranscriptIndexing").filter(evidenceFilter).filter((entry) => entry.value === true).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyDataHandlingSessionTranscriptMemory,
		message: `${dataHandlingLabel(entry)} enables session transcript memory indexing.`,
		requirement: `oc://${policyDocName}/${requirementBase}/memory/denySessionTranscriptIndexing`,
		fixHint: "Disable session transcript memory indexing for the matching config surface or update policy after review."
	})));
	return findings;
}
function secretManagedProviderFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, ["secrets", "requireManagedProviders"]) !== true) return [];
	const secrets = evidence.secrets ?? [];
	const providerKeys = new Set(secrets.filter((secret) => secret.kind === "provider" && secret.providerSource !== void 0).map((secret) => `${secret.providerSource}:${secret.id}`));
	return secrets.filter((secret) => secret.kind === "input" && secret.provenance === "secretRef" && (secret.refProvider === void 0 || secret.refSource === void 0 || !providerKeys.has(`${secret.refSource}:${secret.refProvider}`))).map((secret) => {
		return policyEvidenceFinding(secret, {
			checkId: CHECK_IDS.policySecretsUnmanagedProvider,
			message: `SecretRef uses unmanaged provider '${secret.refProvider ?? "default"}'.`,
			requirement: `oc://${policyDocName}/secrets/requireManagedProviders`,
			fixHint: "Declare the referenced provider under secrets.providers or update policy after review."
		});
	});
}
function secretDeniedSourceFindings(policy, policyDocName, evidence) {
	const deniedSources = new Set(readStringList(policy, ["secrets", "denySources"]));
	if (deniedSources.size === 0) return [];
	return (evidence.secrets ?? []).filter((secret) => {
		const source = secret.kind === "provider" ? secret.providerSource : secret.refSource;
		return source !== void 0 && deniedSources.has(source);
	}).map((secret) => {
		const source = secret.kind === "provider" ? secret.providerSource : secret.refSource;
		return policyEvidenceFinding(secret, {
			checkId: CHECK_IDS.policySecretsDeniedProviderSource,
			message: `Secret ${secret.kind} '${secret.id}' uses denied source '${source}'.`,
			requirement: `oc://${policyDocName}/secrets/denySources`,
			fixHint: "Move this secret to an approved source or update policy after review."
		});
	});
}
function secretInsecureProviderFindings(policy, policyDocName, evidence) {
	if (readBooleanPath(policy, ["secrets", "allowInsecureProviders"]) !== false) return [];
	return (evidence.secrets ?? []).filter((secret) => secret.kind === "provider" && (secret.insecure?.length ?? 0) > 0).map((secret) => {
		return policyEvidenceFinding(secret, {
			checkId: CHECK_IDS.policySecretsInsecureProvider,
			message: `Secret provider '${secret.id}' enables insecure posture: ${(secret.insecure ?? []).join(", ")}.`,
			requirement: `oc://${policyDocName}/secrets/allowInsecureProviders`,
			fixHint: "Remove insecure provider overrides or update policy after review."
		});
	});
}
function authProfileMetadataFindings(policy, policyDocName, evidence) {
	const requiredMetadata = requiredAuthProfileMetadata(policy);
	if (requiredMetadata.size === 0) return [];
	return (evidence.authProfiles ?? []).flatMap((profile) => {
		const missing = [...requiredMetadata].filter((metadata) => !authProfileHasMetadata(profile, metadata));
		if (missing.length === 0) return [];
		return [policyEvidenceFinding(profile, {
			checkId: CHECK_IDS.policyAuthProfileInvalidMetadata,
			message: `Auth profile '${profile.id}' is missing required metadata: ${missing.join(", ")}.`,
			requirement: `oc://${policyDocName}/auth/profiles/requireMetadata`,
			fixHint: "Set auth.profiles.<id>.provider and a supported auth profile mode."
		})];
	});
}
function authProfileModeFindings(policy, policyDocName, evidence) {
	const allowedModes = new Set(readStringList(policy, [
		"auth",
		"profiles",
		"allowModes"
	]));
	if (allowedModes.size === 0) return [];
	return (evidence.authProfiles ?? []).filter((profile) => profile.mode !== void 0 && !allowedModes.has(profile.mode)).map((profile) => {
		return policyEvidenceFinding(profile, {
			checkId: CHECK_IDS.policyAuthProfileUnapprovedMode,
			message: `Auth profile '${profile.id}' uses mode '${profile.mode}' outside the policy allowlist.`,
			requirement: `oc://${policyDocName}/auth/profiles/allowModes`,
			fixHint: "Change the auth profile mode or update policy after review."
		});
	});
}
//#endregion
//#region extensions/policy/src/doctor/exec-approval-findings.ts
function execApprovalsFindings(policy, policyPath, policyDocName, evidence, file, displayName) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const entries = evidence.execApprovals ?? [];
	const defaults = entries.find((entry) => entry.kind === "defaults");
	const defaultSecurity = defaults?.security ?? "full";
	if (isRecord(policy.execApprovals)) {
		const shapeFinding = execApprovalsPolicyShapeFinding(policy.execApprovals, {
			policyDocName,
			policyPath
		});
		if (shapeFinding !== void 0) return [shapeFinding];
		const fileFindings = execApprovalsFileFindings(policy.execApprovals, {
			policyDocName,
			file,
			displayName,
			requirementBase: "execApprovals"
		});
		findings.push(...fileFindings);
		if (fileFindings.length > 0) return findings;
		findings.push(...execApprovalsRuleFindings(policy.execApprovals, {
			entries,
			defaultSecurity,
			defaults,
			displayName,
			fileDisplayName: file?.displayName,
			policyDocName,
			requirementBase: "execApprovals"
		}));
	}
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	const scopedFileFindingScopes = /* @__PURE__ */ new Set();
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!isRecord(target.overlay.execApprovals)) continue;
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/execApprovals`;
		const shapeFinding = execApprovalsPolicyShapeFinding(target.overlay.execApprovals, {
			policyDocName,
			policyPath,
			targetPrefix: requirementBase,
			propertyPrefix: `scopes.${target.scopeName}.execApprovals`,
			allowDefaults: false
		});
		if (shapeFinding !== void 0) {
			findings.push(shapeFinding);
			continue;
		}
		const fileFindings = execApprovalsFileFindings(target.overlay.execApprovals, {
			policyDocName,
			file,
			displayName,
			requirementBase
		});
		if (fileFindings.length > 0) {
			if (!scopedFileFindingScopes.has(target.scopeName)) {
				findings.push(...fileFindings);
				scopedFileFindingScopes.add(target.scopeName);
			}
			continue;
		}
		findings.push(...execApprovalsRuleFindings(target.overlay.execApprovals, {
			entries,
			defaultSecurity,
			defaults,
			displayName,
			fileDisplayName: file?.displayName,
			policyDocName,
			requirementBase,
			targetAgentId: target.agentId
		}));
	}
	return findings;
}
function execApprovalsFileFindings(execApprovalsPolicy, params) {
	const requireFile = readBooleanPath(execApprovalsPolicy, ["requireFile"]) === true;
	const needsArtifactEvidence = requireFile || execApprovalsPolicyNeedsArtifactEvidence(execApprovalsPolicy);
	if (needsArtifactEvidence && params.file === null) return [{
		checkId: CHECK_IDS.policyExecApprovalsMissing,
		severity: "error",
		message: `${EXEC_APPROVALS_POLICY_DOCUMENT_NAME} evidence is required by policy but was not found.`,
		source: "policy",
		path: params.displayName,
		target: EXEC_APPROVALS_POLICY_URI,
		requirement: `oc://${params.policyDocName}/${requireFile ? `${params.requirementBase}/requireFile` : params.requirementBase}`,
		fixHint: "Restore the approved exec approvals artifact or update policy after review."
	}];
	if (params.file === null || params.file === void 0) return [];
	const parsed = parseExecApprovalsFile(params.file.raw);
	if (parsed.ok || !needsArtifactEvidence) return [];
	return [{
		checkId: CHECK_IDS.policyExecApprovalsInvalid,
		severity: "error",
		message: `${params.file.displayName} could not be parsed: ${parsed.message}`,
		source: "policy",
		path: params.file.displayName,
		target: `oc://${params.file.ocDocName}`,
		requirement: `oc://${params.policyDocName}/${params.requirementBase}`,
		fixHint: `Fix ${EXEC_APPROVALS_POLICY_DOCUMENT_NAME} so it is valid JSON.`
	}];
}
function execApprovalsPolicyNeedsArtifactEvidence(execApprovalsPolicy) {
	return isRecord(execApprovalsPolicy.defaults) || isRecord(execApprovalsPolicy.agents);
}
function execApprovalsRuleFindings(execApprovalsPolicy, params) {
	const findings = [];
	const allowedDefaults = new Set(readStringList(execApprovalsPolicy, ["defaults", "allowSecurity"]));
	if (params.targetAgentId === void 0 && allowedDefaults.size > 0 && !allowedDefaults.has(params.defaultSecurity.toLowerCase())) findings.push(execApprovalFinding(params.defaults, {
		checkId: CHECK_IDS.policyExecApprovalsDefaultSecurityUnapproved,
		message: `exec approvals defaults use unapproved security mode '${params.defaultSecurity}'.`,
		requirement: `oc://${params.policyDocName}/${params.requirementBase}/defaults/allowSecurity`,
		fixHint: "Set defaults.security to an approved mode or update policy after review."
	}));
	const allowedAgents = new Set(readStringList(execApprovalsPolicy, ["agents", "allowSecurity"]));
	if (allowedAgents.size > 0) {
		const agentEntries = params.targetAgentId === void 0 ? globalExecApprovalAgentSecurityEntries(params.entries, params.defaults) : [effectiveExecApprovalAgentSecurityEntry(params.entries, params.targetAgentId) ?? params.defaults ?? syntheticExecApprovalAgentEntry(params.targetAgentId)];
		for (const entry of agentEntries) {
			const security = entry.security ?? params.defaultSecurity;
			if (allowedAgents.has(security.toLowerCase())) continue;
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAgentSecurityUnapproved,
				message: `exec approvals agent '${entry.agentId ?? params.targetAgentId ?? "inherited defaults"}' uses unapproved security mode '${security}'.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowSecurity`,
				fixHint: "Set the agent approval security mode to an approved value or update policy after review."
			}));
		}
	}
	if (readBooleanPath(execApprovalsPolicy, ["agents", "allowAutoAllowSkills"]) === false) {
		const autoAllowEntries = params.targetAgentId === void 0 ? globalExecApprovalAgentAutoAllowSkillsEntries(params.entries, params.defaults) : [effectiveExecApprovalAgentAutoAllowSkillsEntry(params.entries, params.targetAgentId) ?? params.defaults ?? syntheticExecApprovalAgentEntry(params.targetAgentId)];
		for (const entry of autoAllowEntries) {
			if (entry.autoAllowSkills !== true) continue;
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAutoAllowSkillsEnabled,
				message: `exec approvals agent '${entry.agentId ?? params.targetAgentId ?? "inherited defaults"}' enables autoAllowSkills outside policy.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowAutoAllowSkills`,
				fixHint: "Set autoAllowSkills to false or update policy after reviewing implicit skill CLI trust."
			}));
		}
	}
	const expected = readExecApprovalAllowlistRequirements(execApprovalsPolicy, [
		"agents",
		"allowlist",
		"expected"
	]);
	if (expected !== void 0) {
		const expectedSet = new Set(expected.map((entry) => entry.key));
		const actualEntries = execApprovalAllowlistEntries(params.entries, params.targetAgentId).filter((entry) => entry.pattern !== void 0);
		const actual = actualEntries.map((entry) => execApprovalAllowlistRequirementKey(entry.pattern, entry.argPattern)).toSorted();
		const actualSet = new Set(actual);
		for (const entry of expected.toSorted((a, b) => a.key.localeCompare(b.key))) if (!actualSet.has(entry.key)) {
			const requirement = `oc://${params.policyDocName}/${params.requirementBase}/agents/allowlist/expected`;
			const target = execApprovalAllowlistMissingTarget(params.targetAgentId);
			findings.push({
				checkId: CHECK_IDS.policyExecApprovalsAllowlistMissing,
				severity: "error",
				message: `exec approvals allowlist is missing expected pattern '${formatExecApprovalAllowlistRequirement(entry)}'.`,
				source: "policy",
				path: params.fileDisplayName ?? params.displayName,
				target,
				requirement,
				fixHint: "Add the expected approval pattern or update policy after review."
			});
		}
		for (const key of actualSet) {
			if (expectedSet.has(key)) continue;
			const entry = actualEntries.find((candidate) => candidate.pattern !== void 0 && execApprovalAllowlistRequirementKey(candidate.pattern, candidate.argPattern) === key);
			findings.push(execApprovalFinding(entry, {
				checkId: CHECK_IDS.policyExecApprovalsAllowlistUnexpected,
				message: `exec approvals allowlist has unexpected pattern '${formatExecApprovalAllowlistEntry(entry)}'.`,
				requirement: `oc://${params.policyDocName}/${params.requirementBase}/agents/allowlist/expected`,
				fixHint: "Remove the unexpected approval pattern or update policy after review."
			}));
		}
	}
	return findings;
}
function globalExecApprovalAgentSecurityEntries(entries, defaults) {
	const agentEntries = entries.filter((candidate) => candidate.kind === "agent");
	const wildcard = agentEntries.find((entry) => entry.agentId === "*");
	const securityEntries = agentEntries.filter((entry) => entry.agentId === "*" || entry.security !== void 0 || entry.securityConfigured === true);
	return wildcard === void 0 ? [...securityEntries, defaults ?? syntheticExecApprovalAgentEntry("*")] : securityEntries;
}
function globalExecApprovalAgentAutoAllowSkillsEntries(entries, defaults) {
	const agentEntries = entries.filter((candidate) => candidate.kind === "agent");
	const wildcard = agentEntries.find((entry) => entry.agentId === "*");
	const explicitEntries = agentEntries.filter((entry) => entry.autoAllowSkills !== void 0);
	return wildcard?.autoAllowSkills === void 0 ? [...explicitEntries, defaults ?? syntheticExecApprovalAgentEntry("*")] : explicitEntries;
}
function execApprovalAllowlistEntries(entries, agentId) {
	if (agentId === void 0) return entries.filter((entry) => entry.kind === "allowlist");
	return entries.filter((entry) => entry.kind === "allowlist" && entry.agentId !== void 0 && (normalizeAgentId(entry.agentId) === normalizeAgentId(agentId) || entry.agentId === "*"));
}
function execApprovalFinding(entry, params) {
	const target = entry?.source ?? "oc://exec-approvals.json";
	return {
		checkId: params.checkId,
		severity: "error",
		message: params.message,
		source: "policy",
		path: EXEC_APPROVALS_POLICY_DOCUMENT_NAME,
		ocPath: target,
		target,
		requirement: params.requirement,
		fixHint: params.fixHint
	};
}
//#endregion
//#region extensions/policy/src/doctor/ingress-findings.ts
function ingressFindings(policy, policyPath, policyDocName, evidence) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const ingressPolicy = policy.ingress;
	if (ingressPolicyShapeFinding(ingressPolicy, {
		policyDocName,
		policyPath
	}) === void 0 && isRecord(ingressPolicy)) findings.push(...ingressFindingsForRule(ingressPolicy, policyDocName, "ingress", evidence, () => true));
	if (hasValidScopedPolicy(policy, policyPath, policyDocName)) for (const target of channelScopedPolicyTargets(policy)) {
		if (ingressPolicyShapeFinding(target.overlay.ingress, {
			policyDocName,
			policyPath,
			targetPrefix: `scopes/${ocPathSegment(target.scopeName)}/ingress`,
			propertyPrefix: `scopes.${target.scopeName}.ingress`,
			allowSession: false
		}) !== void 0 || !isRecord(target.overlay.ingress)) continue;
		findings.push(...ingressFindingsForRule(target.overlay.ingress, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/ingress`, evidence, (entry) => scopedIngressChannelMatches(entry, target.channelId)));
	}
	return findings;
}
function ingressFindingsForRule(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (!isRecord(ingressPolicy)) return [];
	return [
		...ingressDmScopeFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressDmPolicyFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressOpenGroupFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...ingressRequireMentionFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function ingressDmScopeFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const required = readPolicyPathString(ingressPolicy, ["session", "requireDmScope"]);
	if (required === void 0) return [];
	return ingressEntries(evidence, "sessionDmScope").filter(evidenceFilter).filter((entry) => entry.value !== required).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyIngressDmScopeUnapproved,
		message: `session.dmScope '${entry.value ?? ""}' does not match policy.`,
		requirement: `oc://${policyDocName}/${requirementBase}/session/requireDmScope`,
		fixHint: "Set session.dmScope to the required isolation scope or update policy after review."
	}));
}
function ingressDmPolicyFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(ingressPolicy, ["channels", "allowDmPolicies"]));
	if (allowed.size === 0) return [];
	return ingressEntries(evidence, "channelDmPolicy").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyIngressDmPolicyUnapproved,
		message: `${ingressLabel(entry)} uses unapproved DM policy '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/allowDmPolicies`,
		fixHint: "Set the channel DM policy to an allowed value or update policy after review."
	}));
}
function ingressOpenGroupFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(ingressPolicy, ["channels", "denyOpenGroups"]) !== true) return [];
	return ingressEntries(evidence, "channelGroupPolicy").filter(evidenceFilter).filter((entry) => entry.value !== "allowlist" && entry.value !== "disabled").map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyIngressOpenGroupsDenied,
		message: `${ingressLabel(entry)} allows open group ingress.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/denyOpenGroups`,
		fixHint: "Set groupPolicy to allowlist or disabled, or update policy after review."
	}));
}
function ingressRequireMentionFindings(ingressPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(ingressPolicy, ["channels", "requireMentionInGroups"]) !== true) return [];
	const groupPolicies = ingressEntries(evidence, "channelGroupPolicy").filter(evidenceFilter);
	return ingressEntries(evidence, "channelRequireMention").filter(evidenceFilter).filter((entry) => !isGroupIngressDisabled(entry, groupPolicies)).filter((entry) => entry.value !== true).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policyIngressGroupMentionRequired,
		message: `${ingressLabel(entry)} does not require group mentions.`,
		requirement: `oc://${policyDocName}/${requirementBase}/channels/requireMentionInGroups`,
		fixHint: "Set requireMention=true for the channel/group entry or update policy after review."
	}));
}
function isGroupIngressDisabled(entry, groupPolicies) {
	const entryParent = ocPathParent(entry.source);
	const channelDefaultsParent = "oc://openclaw.config/channels/defaults";
	return groupPolicies.filter((candidate) => {
		const candidateParent = ocPathParent(candidate.source);
		return candidate.channel === entry.channel && (candidate.accountId ?? "") === (entry.accountId ?? "") && (candidateParent === channelDefaultsParent || entryParent === candidateParent || entryParent.startsWith(`${candidateParent}/`));
	}).toSorted((left, right) => ocPathParent(right.source).length - ocPathParent(left.source).length)[0]?.value === "disabled";
}
function ocPathParent(source) {
	return source.slice(0, Math.max(0, source.lastIndexOf("/")));
}
function ingressEntries(evidence, kind) {
	return (evidence.ingress ?? []).filter((entry) => entry.kind === kind);
}
function scopedIngressChannelMatches(entry, policyChannelId) {
	return normalizePolicyChannelId(entry.channel ?? "") === policyChannelId;
}
function ingressLabel(entry) {
	const account = entry.accountId === void 0 ? "" : ` account '${entry.accountId}'`;
	const group = entry.groupId === void 0 ? "" : ` group '${entry.groupId}'`;
	return `channel '${entry.channel ?? "unknown"}'${account}${group}`;
}
//#endregion
//#region extensions/policy/src/doctor/routing-shapes.ts
function routingPolicyShapeFinding(value, ctx) {
	if (value === void 0) return;
	if (!isRecord(value)) return invalid(ctx, "routing", "routing must be an object.");
	const unknown = unsupportedPolicyKey(value, [
		"probes",
		"requireBindings",
		"requireConfiguredChannels"
	]);
	if (unknown !== void 0) return invalid(ctx, `routing/${ocPathSegment(unknown)}`, `routing.${unknown} is not supported.`);
	for (const key of ["requireBindings", "requireConfiguredChannels"]) if (value[key] !== void 0 && typeof value[key] !== "boolean") return invalid(ctx, `routing/${key}`, `routing.${key} must be a boolean.`);
	if (value.probes === void 0) return;
	if (!Array.isArray(value.probes)) return invalid(ctx, "routing/probes", "routing.probes must be an array.");
	const ids = /* @__PURE__ */ new Set();
	for (const [index, probe] of value.probes.entries()) {
		const target = `routing/probes/#${index}`;
		if (!isRecord(probe)) return invalid(ctx, target, `routing.probes[${index}] must be an object.`);
		const unknownProbe = unsupportedPolicyKey(probe, [
			"expect",
			"id",
			"route"
		]);
		if (unknownProbe !== void 0) return invalid(ctx, `${target}/${ocPathSegment(unknownProbe)}`, `routing.probes[${index}].${unknownProbe} is not supported.`);
		if (!hasNonEmptyString(probe.id)) return invalid(ctx, `${target}/id`, `routing.probes[${index}].id must be a non-empty string.`);
		if (ids.has(probe.id.trim())) return invalid(ctx, `${target}/id`, `routing probe id ${probe.id.trim()} must be unique.`);
		ids.add(probe.id.trim());
		const routeFinding = routeShapeFinding(probe.route, index, target, ctx);
		if (routeFinding !== void 0) return routeFinding;
		const expectFinding = expectShapeFinding(probe.expect, index, target, ctx);
		if (expectFinding !== void 0) return expectFinding;
	}
}
function routeShapeFinding(value, index, target, ctx) {
	if (!isRecord(value)) return invalid(ctx, `${target}/route`, `routing.probes[${index}].route must be an object.`);
	const unknown = unsupportedPolicyKey(value, [
		"accountId",
		"channel",
		"guildId",
		"memberRoleIds",
		"parentPeer",
		"peer",
		"teamId"
	]);
	if (unknown !== void 0) return invalid(ctx, `${target}/route/${ocPathSegment(unknown)}`, `routing.probes[${index}].route.${unknown} is not supported.`);
	if (!hasNonEmptyString(value.channel)) return invalid(ctx, `${target}/route/channel`, `routing.probes[${index}].route.channel must be a non-empty string.`);
	for (const key of [
		"accountId",
		"guildId",
		"teamId"
	]) if (value[key] !== void 0 && !hasNonEmptyString(value[key])) return invalid(ctx, `${target}/route/${key}`, `routing.probes[${index}].route.${key} must be a non-empty string.`);
	for (const key of ["peer", "parentPeer"]) {
		const finding = peerShapeFinding(value[key], index, key, `${target}/route/${key}`, ctx);
		if (finding !== void 0) return finding;
	}
	if (value.memberRoleIds !== void 0) {
		if (!Array.isArray(value.memberRoleIds) || value.memberRoleIds.length === 0 || value.memberRoleIds.some((entry) => !hasNonEmptyString(entry)) || new Set(value.memberRoleIds.map((entry) => String(entry).trim())).size !== value.memberRoleIds.length) return invalid(ctx, `${target}/route/memberRoleIds`, `routing.probes[${index}].route.memberRoleIds must contain unique non-empty strings.`);
	}
}
function peerShapeFinding(value, index, key, target, ctx) {
	if (value === void 0) return;
	if (!isRecord(value)) return invalid(ctx, target, `routing.probes[${index}].route.${key} must be an object.`);
	const unknown = unsupportedPolicyKey(value, ["id", "kind"]);
	if (unknown !== void 0) return invalid(ctx, `${target}/${ocPathSegment(unknown)}`, `routing.probes[${index}].route.${key}.${unknown} is not supported.`);
	if (![
		"channel",
		"direct",
		"group"
	].includes(value.kind)) return invalid(ctx, `${target}/kind`, `routing.probes[${index}].route.${key}.kind must be direct, group, or channel.`);
	if (!hasNonEmptyString(value.id)) return invalid(ctx, `${target}/id`, `routing.probes[${index}].route.${key}.id must be a non-empty string.`);
}
function expectShapeFinding(value, index, target, ctx) {
	if (!isRecord(value)) return invalid(ctx, `${target}/expect`, `routing.probes[${index}].expect must be an object.`);
	const unknown = unsupportedPolicyKey(value, ["agentId", "matchedBy"]);
	if (unknown !== void 0) return invalid(ctx, `${target}/expect/${ocPathSegment(unknown)}`, `routing.probes[${index}].expect.${unknown} is not supported.`);
	if (!hasNonEmptyString(value.agentId)) return invalid(ctx, `${target}/expect/agentId`, `routing.probes[${index}].expect.agentId must be a non-empty string.`);
	if (value.matchedBy !== void 0) {
		if (!Array.isArray(value.matchedBy) || value.matchedBy.length === 0 || value.matchedBy.some((entry) => typeof entry !== "string" || !ROUTING_MATCH_KINDS.includes(entry)) || new Set(value.matchedBy).size !== value.matchedBy.length) return invalid(ctx, `${target}/expect/matchedBy`, `routing.probes[${index}].expect.matchedBy must contain unique supported match kinds.`);
	}
}
function invalid(ctx, target, message) {
	return policyShapeFinding(ctx.policyPath, `oc://${ctx.policyDocName}/${target}`, `${ctx.policyPath} ${message}`, `Fix ${ctx.policyPath} so routing uses the documented policy syntax.`);
}
//#endregion
//#region extensions/policy/src/doctor/policy-shape.ts
function policyContainerShapeFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy)) return [policyShapeFinding(policyPath, "oc://" + policyDocName, policyPath + " must contain a policy object.", "Fix " + policyPath + " so the top-level policy is an object.")];
	const document = policy;
	const params = {
		policyPath,
		policyDocName
	};
	const shape = createOrderedPolicyShape(document, params);
	function* allowDeny(path, valueName) {
		yield shape.object(path);
		yield shape.keys(path, ["allow", "deny"], "", "Remove {unsupported} or use {property}.allow or {property}.deny.", "{policy} {unsupported} is not supported in policy.");
		for (const key of ["allow", "deny"]) yield shape.list(path + "." + key, {
			valueName,
			entry: {
				message: "{policy} {property}[{index}] must be a non-empty string.",
				hint: "Fix {policy} so each {property} entry is a {valueName}."
			}
		});
	}
	function* findings() {
		yield shape.keys("", SUPPORTED_POLICY_SECTIONS, "", "Remove {key} or use a supported policy section.", "{policy} {key} is not a supported policy section.");
		yield shape.object("tools");
		yield posturePolicyShapeFinding("tools", document.tools, params);
		yield shape.object("channels");
		yield shape.keys("channels", ["denyRules"], "channel", "Remove {unsupported} or use channels.denyRules.");
		yield shape.object("mcp");
		yield shape.keys("mcp", ["servers"], "MCP", "Remove {unsupported} or use mcp.servers.");
		yield shape.object("dataHandling");
		yield* allowDeny("mcp.servers", "MCP server id");
		yield shape.object("models");
		yield shape.keys("models", ["providers"], "model", "Remove {unsupported} or use models.providers.");
		yield* allowDeny("models.providers", "model provider id");
		yield shape.object("network");
		yield shape.keys("network", ["privateNetwork"], "network", "Remove {unsupported} or use network.privateNetwork.");
		yield shape.object("network.privateNetwork");
		yield shape.keys("network.privateNetwork", ["allow"], "network", "Remove {unsupported} or use network.privateNetwork.allow.");
		yield shape.boolean("network.privateNetwork.allow", "Fix {policy} so {property} is true or false.");
		yield shape.object("secrets");
		yield shape.keys("secrets", [
			"allowInsecureProviders",
			"denySources",
			"requireManagedProviders"
		], "secrets", "Remove {unsupported} or use a supported secrets policy rule.");
		yield shape.object("auth");
		yield shape.keys("auth", ["profiles"], "auth", "Remove {unsupported} or use auth.profiles.");
		yield shape.object("auth.profiles");
		yield shape.keys("auth.profiles", ["allowModes", "requireMetadata"], "auth profile", "Remove {unsupported} or use a supported auth profile policy rule.");
		yield execApprovalsPolicyShapeFinding(document.execApprovals, params);
		yield posturePolicyShapeFinding("sandbox", document.sandbox, params);
		yield ingressPolicyShapeFinding(document.ingress, params);
		yield posturePolicyShapeFinding("gateway", document.gateway, params);
		yield routingPolicyShapeFinding(document.routing, params);
		yield posturePolicyShapeFinding("agents", document.agents, params);
		yield scopedPolicyShapeFinding(document.scopes, {
			...params,
			policy: document
		});
	}
	const finding = firstPolicyShapeFinding(findings());
	return finding === void 0 ? [] : [finding];
}
//#endregion
//#region extensions/policy/src/doctor/routing-findings.ts
function routingFindings(policy, policyPath, policyDocName, evidence) {
	const rules = policyRoutingRules(policy);
	if (rules === void 0 || evidence.routing === void 0 || routingPolicyShapeFinding(rules, {
		policyPath,
		policyDocName
	}) !== void 0) return [];
	const findings = [];
	if (rules.requireBindings === true && evidence.routing.bindings.length === 0) findings.push({
		checkId: CHECK_IDS.policyRoutingBindingsRequired,
		severity: "error",
		message: "Routing policy requires at least one channel route binding, but none are configured.",
		source: "policy",
		path: policyPath,
		target: "oc://openclaw.config/bindings",
		requirement: `oc://${policyDocName}/routing/requireBindings`,
		fixHint: "Add an intentional route binding or update the policy after review."
	});
	if (rules.requireConfiguredChannels === true) {
		const configured = new Set(evidence.channels.map((channel) => channel.id.toLowerCase()));
		for (const binding of evidence.routing.bindings) {
			if (configured.has(binding.channel.toLowerCase())) continue;
			findings.push({
				checkId: CHECK_IDS.policyRoutingBindingChannelUnconfigured,
				severity: "error",
				message: `Route binding ${binding.index} names unconfigured channel ${binding.channel}.`,
				source: "policy",
				path: policyPath,
				target: `oc://openclaw.config/bindings/#${binding.index}`,
				requirement: `oc://${policyDocName}/routing/requireConfiguredChannels`,
				fixHint: `Configure channels.${binding.channel}, correct the binding channel, or update the policy after review.`
			});
		}
	}
	for (const probe of rules.probes ?? []) {
		const result = evidence.routing.probes.find((entry) => entry.id === probe.id);
		if (result === void 0) continue;
		const resultTarget = `oc://policy/routing/probes/${ocPathSegment(probe.id)}/result`;
		const requirement = `oc://${policyDocName}/routing/probes/${ocPathSegment(probe.id)}/expect`;
		if (normalizeAgentId(result.agentId) !== normalizeAgentId(probe.expect.agentId)) findings.push({
			checkId: CHECK_IDS.policyRoutingAgentMismatch,
			severity: "error",
			message: `Routing probe ${probe.id} resolved to agent ${result.agentId}, not ${probe.expect.agentId}.`,
			source: "policy",
			path: policyPath,
			target: resultTarget,
			requirement,
			fixHint: "Review the route bindings and expected destination before changing either one."
		});
		if (probe.expect.matchedBy !== void 0 && !probe.expect.matchedBy.includes(result.matchedBy)) findings.push({
			checkId: CHECK_IDS.policyRoutingMatchKindMismatch,
			severity: "error",
			message: `Routing probe ${probe.id} matched by ${result.matchedBy}, which is not an expected match kind.`,
			source: "policy",
			path: policyPath,
			target: resultTarget,
			requirement,
			fixHint: "Restore the intended binding specificity or update the accepted match kinds after review."
		});
	}
	return findings;
}
//#endregion
//#region extensions/policy/src/doctor/sandbox-findings.ts
function sandboxPostureFindings(policy, policyPath, policyDocName, evidence) {
	if (!isRecord(policy)) return [];
	const findings = [];
	const sandboxPolicy = policy.sandbox;
	if (isRecord(sandboxPolicy) && posturePolicyShapeFinding("sandbox", sandboxPolicy, {
		policyDocName,
		policyPath
	}) === void 0) findings.push(...sandboxPostureFindingsForRule(sandboxPolicy, policyDocName, "sandbox", evidence, () => true));
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	for (const target of agentScopedPolicyTargets(policy)) {
		const scopedSandboxPolicy = target.overlay.sandbox;
		if (posturePolicyShapeFinding("sandbox", scopedSandboxPolicy, {
			policyDocName,
			policyPath,
			targetPrefix: `scopes/${ocPathSegment(target.scopeName)}/sandbox`,
			propertyPrefix: `scopes.${target.scopeName}.sandbox`
		}) !== void 0 || !isRecord(scopedSandboxPolicy)) continue;
		findings.push(...sandboxPostureFindingsForRule(scopedSandboxPolicy, policyDocName, `scopes/${ocPathSegment(target.scopeName)}/sandbox`, evidence, (entry) => scopedSandboxAgentMatches(entry, target.agentId, evidence.sandboxPosture ?? [])));
	}
	return findings;
}
function sandboxPostureFindingsForRule(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (!isRecord(sandboxPolicy)) return [];
	return [
		...sandboxModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxBackendFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerPostureUnobservableFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerHostNetworkFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerNamespaceJoinFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerMountModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerRuntimeSocketMountFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxContainerUnconfinedProfileFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...sandboxBrowserCdpSourceRangeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function scopedSandboxAgentMatches(entry, policyAgentId, entries) {
	if (scopedAgentIdMatches(entry.agentId, policyAgentId)) return true;
	return entry.scope === "defaults" && !scopedSandboxDefaultDisabledForAgent(entry, policyAgentId, entries) && !entries.some((candidate) => candidate.scope === "agent" && sandboxPostureEntriesDescribeSameField(candidate, entry) && scopedAgentIdMatches(candidate.agentId, policyAgentId));
}
function scopedSandboxDefaultDisabledForAgent(entry, policyAgentId, entries) {
	if (sandboxEntryRequiresContainerBackend(entry)) {
		const backend = entries.find((candidate) => candidate.scope === "agent" && candidate.kind === "backend" && scopedAgentIdMatches(candidate.agentId, policyAgentId));
		if (typeof backend?.value === "string" && !isObservableContainerSandboxBackend(backend.value)) return true;
	}
	if (sandboxEntryRequiresBrowser(entry)) {
		if (entries.find((candidate) => candidate.scope === "agent" && candidate.kind === "browserCdpSourceRange" && scopedAgentIdMatches(candidate.agentId, policyAgentId))?.value === false) return true;
	}
	return false;
}
function sandboxEntryRequiresContainerBackend(entry) {
	return entry.kind === "containerNetwork" && entry.networkSurface === "docker" || entry.kind === "containerSecurityProfile" || entry.kind === "containerMount" && entry.bindSurface === "docker";
}
function sandboxEntryRequiresBrowser(entry) {
	return entry.kind === "browserCdpSourceRange" || entry.kind === "containerNetwork" && entry.networkSurface === "browser" || entry.kind === "containerMount" && entry.bindSurface === "browser";
}
function sandboxPostureEntriesDescribeSameField(candidate, baseline) {
	return candidate.kind === baseline.kind && candidate.bindSurface === baseline.bindSurface && candidate.networkSurface === baseline.networkSurface && candidate.profile === baseline.profile;
}
function sandboxModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(sandboxPolicy, ["requireMode"]));
	if (allowed.size === 0) return [];
	return sandboxPostureEntries(evidence, "mode").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxModeUnapproved,
		message: `${sandboxPostureLabel(entry)} uses unapproved sandbox mode '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/requireMode`,
		fixHint: "Set agents.defaults.sandbox.mode or agents.entries.<id>.sandbox.mode to an approved value."
	}));
}
function sandboxBackendFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(sandboxPolicy, ["allowBackends"]));
	if (allowed.size === 0) return [];
	return sandboxPostureEntries(evidence, "backend").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxBackendUnapproved,
		message: `${sandboxPostureLabel(entry)} uses unapproved sandbox backend '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/allowBackends`,
		fixHint: "Use an approved sandbox backend or update policy after review."
	}));
}
function isObservableContainerSandboxBackend(value) {
	return value.toLowerCase() === "docker" || value.toLowerCase() === "podman";
}
function sandboxContainerPostureUnobservableFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const enabledRules = SANDBOX_CONTAINER_POLICY_RULES.filter((rule) => readBooleanPath(sandboxPolicy, ["containers", rule.key]) === true);
	if (enabledRules.length === 0) return [];
	return sandboxPostureEntries(evidence, "backend").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !isObservableContainerSandboxBackend(entry.value)).flatMap((entry) => enabledRules.map((rule) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerPostureUnobservable,
		message: `${sandboxPostureLabel(entry)} uses sandbox backend '${entry.value ?? ""}', which cannot observe ${rule.label}.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/${rule.key}`,
		fixHint: "Use an observable container backend for this sandbox or remove the container posture rule."
	})));
}
function sandboxContainerHostNetworkFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["containers", "denyHostNetwork"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerNetwork").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase() === "host").map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerHostNetworkDenied,
		message: `${sandboxPostureLabel(entry)} uses host container network mode.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyHostNetwork`,
		fixHint: "Change the container network mode or update policy after review."
	}));
}
function sandboxContainerNamespaceJoinFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["containers", "denyContainerNamespaceJoin"]) !== true) return [];
	const containerNamespacePrefix = "container:";
	return sandboxPostureEntries(evidence, "containerNetwork").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase().startsWith(containerNamespacePrefix)).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerNamespaceJoinDenied,
		message: `${sandboxPostureLabel(entry)} joins another container network namespace '${entry.value ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyContainerNamespaceJoin`,
		fixHint: "Change the container network mode or update policy after review."
	}));
}
function sandboxContainerMountModeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["containers", "requireReadOnlyMounts"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerMount").filter(evidenceFilter).filter((entry) => entry.bindMode !== "ro").map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerMountModeRequired,
		message: `${sandboxPostureLabel(entry)} has container mount '${entry.bind ?? ""}' with mode '${entry.bindMode ?? "unknown"}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/requireReadOnlyMounts`,
		fixHint: "Set the mount mode to read-only or update policy after review."
	}));
}
function sandboxContainerRuntimeSocketMountFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["containers", "denyContainerRuntimeSocketMounts"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerMount").filter(evidenceFilter).filter((entry) => bindHostLooksLikeContainerRuntimeSocket(entry.bindHost)).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerRuntimeSocketMount,
		message: `${sandboxPostureLabel(entry)} binds host container runtime socket '${entry.bindHost ?? ""}'.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyContainerRuntimeSocketMounts`,
		fixHint: "Remove the container runtime socket bind or update policy after review."
	}));
}
function sandboxContainerUnconfinedProfileFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["containers", "denyUnconfinedProfiles"]) !== true) return [];
	return sandboxPostureEntries(evidence, "containerSecurityProfile").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && entry.value.toLowerCase() === "unconfined").map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxContainerUnconfinedProfile,
		message: `${sandboxPostureLabel(entry)} sets container ${entry.profile ?? "security"} profile to unconfined.`,
		requirement: `oc://${policyDocName}/${requirementBase}/containers/denyUnconfinedProfiles`,
		fixHint: "Remove the unconfined container profile or update policy after review."
	}));
}
function sandboxBrowserCdpSourceRangeFindings(sandboxPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(sandboxPolicy, ["browser", "requireCdpSourceRange"]) !== true) return [];
	return sandboxPostureEntries(evidence, "browserCdpSourceRange").filter(evidenceFilter).filter((entry) => entry.value === void 0).map((entry) => policyEvidenceFinding(entry, {
		checkId: CHECK_IDS.policySandboxBrowserCdpSourceRangeMissing,
		message: `${sandboxPostureLabel(entry)} enables sandbox browser without cdpSourceRange.`,
		requirement: `oc://${policyDocName}/${requirementBase}/browser/requireCdpSourceRange`,
		fixHint: "Set agents.*.sandbox.browser.cdpSourceRange or update policy after review."
	}));
}
function sandboxPostureEntries(evidence, kind) {
	return (evidence.sandboxPosture ?? []).filter((entry) => entry.kind === kind);
}
function sandboxPostureLabel(entry) {
	return entry.agentId === void 0 ? "default sandbox config" : `agent '${entry.agentId}'`;
}
const CONTAINER_RUNTIME_SOCKET_BASENAMES = /* @__PURE__ */ new Set([
	"containerd.sock",
	"docker.sock",
	"podman.sock"
]);
const CONTAINER_RUNTIME_SOCKET_PATHS = /* @__PURE__ */ new Set([
	"/run/containerd/containerd.sock",
	"/run/docker.sock",
	"/run/podman/podman.sock",
	"/var/run/docker.sock",
	"/var/run/podman/podman.sock"
]);
function bindHostLooksLikeContainerRuntimeSocket(value) {
	if (value === void 0) return false;
	const normalized = value.replaceAll("\\", "/").toLowerCase();
	const basenameLocal = normalized.split("/").at(-1) ?? "";
	return CONTAINER_RUNTIME_SOCKET_PATHS.has(normalized) || CONTAINER_RUNTIME_SOCKET_BASENAMES.has(basenameLocal);
}
//#endregion
//#region extensions/policy/src/doctor/tool-findings.ts
function toolPostureFindings(policy, policyPath, policyDocName, evidence) {
	const findings = [];
	if (isRecord(policy) && isRecord(policy.tools) && posturePolicyShapeFinding("tools", policy.tools, {
		policyDocName,
		policyPath
	}) === void 0) findings.push(...toolPostureFindingsForRule(policy.tools, policyDocName, "tools", evidence, () => true));
	if (!hasValidScopedPolicy(policy, policyPath, policyDocName)) return findings;
	for (const target of agentScopedPolicyTargets(policy)) {
		if (!isRecord(target.overlay.tools)) continue;
		const requirementBase = `scopes/${ocPathSegment(target.scopeName)}/tools`;
		if (posturePolicyShapeFinding("tools", target.overlay.tools, {
			policyDocName,
			policyPath,
			targetPrefix: requirementBase,
			propertyPrefix: `scopes.${target.scopeName}.tools`
		}) !== void 0) continue;
		findings.push(...toolPostureFindingsForRule(target.overlay.tools, policyDocName, requirementBase, evidence, (entry) => scopedToolAgentMatches(entry, target.agentId, evidence.toolPosture ?? [])));
	}
	return findings;
}
function toolPostureFindingsForRule(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	return [
		...toolProfileFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolFsWorkspaceOnlyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolExecPostureFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolElevatedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolAlsoAllowExpectedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter),
		...toolRequiredDenyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter)
	];
}
function toolProfileFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const allowed = new Set(readStringList(toolsPolicy, ["profiles", "allow"]));
	if (allowed.size === 0) return [];
	return toolPostureEntries(evidence, "profile").filter(evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyToolsProfileUnapproved,
			message: `${toolPostureLabel(entry)} uses unapproved tool profile '${entry.value ?? ""}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/profiles/allow`,
			fixHint: "Use an approved tools.profile value or update policy after review."
		});
	});
}
function toolFsWorkspaceOnlyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(toolsPolicy, ["fs", "requireWorkspaceOnly"]) !== true) return [];
	return toolPostureEntries(evidence, "fsWorkspaceOnly").filter(evidenceFilter).filter((entry) => entry.value !== true).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyToolsFsWorkspaceOnlyRequired,
			message: `${toolPostureLabel(entry)} does not require workspace-only filesystem tools.`,
			requirement: `oc://${policyDocName}/${requirementBase}/fs/requireWorkspaceOnly`,
			fixHint: "Set tools.fs.workspaceOnly=true or update policy after review."
		});
	});
}
function toolExecPostureFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	return [
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecSecurityUnapproved,
			kind: "execSecurity",
			policyPath: ["exec", "allowSecurity"],
			requirementPath: "exec/allowSecurity",
			settingLabel: "exec security",
			evidenceFilter
		}),
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecAskUnapproved,
			kind: "execAsk",
			policyPath: ["exec", "requireAsk"],
			requirementPath: "exec/requireAsk",
			settingLabel: "exec ask",
			evidenceFilter
		}),
		...toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, {
			checkId: CHECK_IDS.policyToolsExecHostUnapproved,
			kind: "execHost",
			policyPath: ["exec", "allowHosts"],
			requirementPath: "exec/allowHosts",
			settingLabel: "exec host",
			evidenceFilter
		})
	];
}
function toolStringPostureAllowFindings(toolsPolicy, policyDocName, requirementBase, evidence, params) {
	const allowed = new Set(readStringList(toolsPolicy, params.policyPath));
	if (allowed.size === 0) return [];
	return toolPostureEntries(evidence, params.kind).filter(params.evidenceFilter).filter((entry) => typeof entry.value === "string" && !allowed.has(entry.value.toLowerCase())).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: params.checkId,
			message: `${toolPostureLabel(entry)} uses unapproved ${params.settingLabel} '${entry.value ?? ""}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/${params.requirementPath}`,
			fixHint: "Adjust the configured tool posture or update policy after review."
		});
	});
}
function toolElevatedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if (readBooleanPath(toolsPolicy, ["elevated", "allow"]) !== false) return [];
	return toolPostureEntries(evidence, "elevatedEnabled").filter(evidenceFilter).filter((entry) => entry.value !== false).map((entry) => {
		return policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyToolsElevatedEnabled,
			message: `${toolPostureLabel(entry)} permits elevated tool mode.`,
			requirement: `oc://${policyDocName}/${requirementBase}/elevated/allow`,
			fixHint: "Set tools.elevated.enabled=false or update policy after review."
		});
	});
}
function toolAlsoAllowExpectedFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	if ((isRecord(toolsPolicy.alsoAllow) ? toolsPolicy.alsoAllow : {}).expected === void 0) return [];
	const expected = normalizedStringSet(readStringList(toolsPolicy, ["alsoAllow", "expected"]));
	const findings = [];
	for (const entry of toolPostureEntries(evidence, "alsoAllow").filter(evidenceFilter)) {
		const actual = normalizedStringSet(entry.entries ?? []);
		for (const expectedTool of expected) {
			if (actual.has(expectedTool)) continue;
			findings.push(policyEvidenceFinding(entry, {
				checkId: CHECK_IDS.policyToolsAlsoAllowMissing,
				message: `${toolPostureLabel(entry)} is missing expected tools.alsoAllow entry '${expectedTool}'.`,
				requirement: `oc://${policyDocName}/${requirementBase}/alsoAllow/expected`,
				fixHint: "Add the expected tools.alsoAllow entry or update policy after review."
			}));
		}
		for (const actualTool of actual) {
			if (expected.has(actualTool)) continue;
			findings.push(policyEvidenceFinding(entry, {
				checkId: CHECK_IDS.policyToolsAlsoAllowUnexpected,
				message: `${toolPostureLabel(entry)} has unexpected tools.alsoAllow entry '${actualTool}'.`,
				requirement: `oc://${policyDocName}/${requirementBase}/alsoAllow/expected`,
				fixHint: "Remove the unexpected tools.alsoAllow entry or update policy after review."
			}));
		}
	}
	return findings;
}
function normalizedStringSet(entries) {
	return new Set(entries.map((entry) => entry.trim().toLowerCase()).filter(Boolean).toSorted());
}
function toolRequiredDenyFindings(toolsPolicy, policyDocName, requirementBase, evidence, evidenceFilter) {
	const required = readStringList(toolsPolicy, ["denyTools"]);
	if (required.length === 0) return [];
	const requiredTools = uniqueStrings(required.flatMap(expandPolicyToolRequirement));
	const findings = [];
	for (const entry of toolPostureEntries(evidence, "deny").filter(evidenceFilter)) for (const tool of requiredTools) {
		if (toolListCoversTool(entry.entries ?? [], tool)) continue;
		findings.push(policyEvidenceFinding(entry, {
			checkId: CHECK_IDS.policyToolsRequiredDenyMissing,
			message: `${toolPostureLabel(entry)} does not deny required tool '${tool}'.`,
			requirement: `oc://${policyDocName}/${requirementBase}/denyTools`,
			fixHint: "Add the tool or group to tools.deny/agents.entries.<id>.tools.deny, or update policy after review."
		}));
	}
	return findings;
}
function toolPostureEntries(evidence, kind) {
	return (evidence.toolPosture ?? []).filter((entry) => entry.kind === kind);
}
function toolPostureLabel(entry) {
	return entry.agentId === void 0 ? "global tools config" : `agent '${entry.agentId}'`;
}
function toolRiskFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.risk === void 0).map((tool) => {
		return {
			checkId: CHECK_IDS.policyMissingToolRisk,
			severity: "error",
			message: `AGENTS.md tool '${tool.id}' has no explicit risk classification.`,
			source: "policy",
			path: "AGENTS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: "Declare risk:low, risk:medium, risk:high, risk:critical, or an R0-R5 review alias."
		};
	});
}
function toolUnknownRiskFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.risk !== void 0 && !KNOWN_RISK_LEVELS.includes(tool.risk)).map((tool) => {
		return {
			checkId: CHECK_IDS.policyUnknownToolRisk,
			severity: "error",
			message: `AGENTS.md tool '${tool.id}' declares unknown risk '${tool.risk}'.`,
			source: "policy",
			path: "AGENTS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Use one of: ${KNOWN_RISK_LEVELS.join(", ")}.`
		};
	});
}
function toolSensitivityFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).flatMap((tool) => {
		if (tool.sensitivity === void 0) return [{
			checkId: CHECK_IDS.policyMissingToolSensitivity,
			severity: "error",
			message: `AGENTS.md tool '${tool.id}' has no declared artifact sensitivity.`,
			source: "policy",
			path: "AGENTS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Declare sensitivity as one of: ${KNOWN_SENSITIVITY_LEVELS.join(", ")}.`
		}];
		if (KNOWN_SENSITIVITY_LEVELS.includes(tool.sensitivity)) return [];
		return [{
			checkId: CHECK_IDS.policyUnknownToolSensitivity,
			severity: "error",
			message: `AGENTS.md tool '${tool.id}' declares unknown sensitivity '${tool.sensitivity}'.`,
			source: "policy",
			path: "AGENTS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: `Use one of: ${KNOWN_SENSITIVITY_LEVELS.join(", ")}.`
		}];
	});
}
function toolOwnerFindings(policyDocName, evidence) {
	return (evidence.tools ?? []).filter((tool) => tool.owner === void 0).map((tool) => {
		return {
			checkId: CHECK_IDS.policyMissingToolOwner,
			severity: "error",
			message: `AGENTS.md tool '${tool.id}' has no declared owner.`,
			source: "policy",
			path: "AGENTS.md",
			line: tool.line,
			ocPath: tool.source,
			target: tool.source,
			requirement: `oc://${policyDocName}/tools/requireMetadata`,
			fixHint: "Declare owner:<team-or-person> for this tool."
		};
	});
}
//#endregion
//#region extensions/policy/src/doctor/evaluation.ts
const policyEvaluationCache = /* @__PURE__ */ new WeakMap();
function evaluatePolicy(ctx) {
	const cached = policyEvaluationCache.get(ctx);
	if (cached !== void 0) return cached;
	const next = evaluatePolicyUncached(ctx);
	policyEvaluationCache.set(ctx, next);
	return next;
}
async function evaluatePolicyUncached(ctx) {
	const settings = policySettings(ctx);
	const policyPath = policyDisplayName(ctx);
	let evidence = collectPolicyEvidence(ctx.cfg, {
		includeIngress: false,
		includeGatewayExposure: false,
		includeAgentWorkspace: false,
		includeToolPosture: false,
		includeSandboxPosture: false,
		includeSecrets: false,
		includeAuthProfiles: false,
		includeExecApprovals: false
	});
	const findings = [];
	if (!policyChecksEnabled(ctx, settings)) return {
		policyPath,
		evidence,
		expectedAttestationHash: settings.expectedAttestationHash,
		findings,
		attestedFindings: findings
	};
	const policyFile = await readPolicyFile(ctx);
	if (policyFile === null) {
		findings.push({
			checkId: CHECK_IDS.policyMissingFile,
			severity: "warning",
			message: `${policyPath} is missing for the enabled Policy plugin.`,
			source: "policy",
			path: policyPath,
			fixHint: `Restore ${policyPath} or add the policy artifact for this workspace.`
		});
		return {
			policyPath,
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const parsedPolicy = parsePolicyFile(policyFile.raw);
	if (!parsedPolicy.ok) {
		findings.push(policyParseFinding(policyFile.displayName, policyFile.ocDocName, parsedPolicy));
		return {
			policyPath,
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const policy = parsedPolicy.value;
	const policyHash = policyDocumentHash(policy);
	const expectedHash = settings.expectedHash;
	if (typeof expectedHash === "string" && expectedHash.trim() !== "" && policyHash !== expectedHash.trim()) {
		findings.push({
			checkId: CHECK_IDS.policyHashMismatch,
			severity: "error",
			message: `${policyFile.displayName} does not match the configured policy hash.`,
			source: "policy",
			path: policyFile.displayName,
			target: `oc://${policyFile.ocDocName}`,
			requirement: "oc://openclaw.config/plugins/entries/policy/config/expectedHash",
			fixHint: `Restore the approved policy artifact or update plugins.entries.policy.config.expectedHash after review.`
		});
		return {
			policyPath,
			policy: {
				value: policy,
				hash: policyHash
			},
			evidence,
			expectedAttestationHash: settings.expectedAttestationHash,
			findings,
			attestedFindings: findings
		};
	}
	const metadataRequirementFindings = toolMetadataRequirementFindings(policy, policyFile.displayName, policyFile.ocDocName);
	const authMetadataRequirementFindings = authProfileMetadataRequirementFindings(policy, policyFile.displayName, policyFile.ocDocName);
	const requiredMetadata = metadataRequirementFindings.length === 0 ? requiredToolMetadata(policy) : /* @__PURE__ */ new Set();
	const includeSecrets = policyHasSecretRules(policy);
	const includeAuthProfiles = policyHasAuthProfileRules(policy);
	const includeIngress = policyHasIngressRules(policy);
	const includeGatewayExposure = policyHasGatewayRules(policy);
	const includeAgentWorkspace = policyHasAgentWorkspaceRules(policy);
	const includeDataHandling = policyHasDataHandlingRules(policy);
	const includeSandboxPosture = policyHasSandboxPostureRules(policy);
	const includeExecApprovals = policyHasExecApprovalsRules(policy);
	const routing = policyHasRoutingRules(policy) && isRecord(policy) && routingPolicyShapeFinding(policy.routing, {
		policyDocName: policyFile.ocDocName,
		policyPath: policyFile.displayName
	}) === void 0 ? policyRoutingRules(policy) : void 0;
	const execApprovalsFile = includeExecApprovals ? await readExecApprovalsFile(ctx) : void 0;
	let unmigratedToolsFinding;
	if (requiredMetadata.size > 0) {
		const [toolsFile, legacyToolsFile] = await Promise.all([readWorkspaceFile(ctx, "AGENTS.md"), readWorkspaceFile(ctx, "TOOLS.md")]);
		if (legacyToolsFile !== null) unmigratedToolsFinding = {
			checkId: CHECK_IDS.policyUnmigratedToolsFile,
			severity: "error",
			message: "TOOLS.md contains unmigrated governed tool declarations; run `openclaw doctor --fix` to migrate them into the AGENTS.md `## Tools` section before policy evaluation can pass.",
			source: "policy",
			path: "TOOLS.md",
			target: "oc://TOOLS.md/tools",
			requirement: `oc://${policyFile.ocDocName}/tools/requireMetadata`,
			fixHint: "Run `openclaw doctor --fix` to migrate TOOLS.md into the AGENTS.md `## Tools` section."
		};
		evidence = await collectPolicyEvidence(ctx.cfg, {
			toolsRaw: toolsFile?.raw ?? "",
			includeIngress,
			includeGatewayExposure,
			includeAgentWorkspace,
			includeDataHandling,
			includeToolPosture: policyHasToolPostureRules(policy),
			includeSandboxPosture,
			includeSecrets,
			includeAuthProfiles,
			includeExecApprovals,
			execApprovalsRaw: includeExecApprovals ? execApprovalsFile?.raw ?? null : void 0,
			routing
		});
	} else evidence = collectPolicyEvidence(ctx.cfg, {
		includeIngress,
		includeGatewayExposure,
		includeAgentWorkspace,
		includeDataHandling,
		includeToolPosture: policyHasToolPostureRules(policy),
		includeSandboxPosture,
		includeSecrets,
		includeAuthProfiles,
		includeExecApprovals,
		execApprovalsRaw: includeExecApprovals ? execApprovalsFile?.raw ?? null : void 0,
		routing
	});
	const policyFindings = [
		...policyContainerShapeFindings(policy, policyFile.displayName, policyFile.ocDocName),
		...channelFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...mcpServerFindings(policy, policyFile.ocDocName, evidence),
		...modelProviderFindings(policy, policyFile.ocDocName, evidence),
		...networkFindings(policy, policyFile.ocDocName, evidence),
		...routingFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...ingressFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...gatewayExposureFindings(policy, policyFile.ocDocName, evidence),
		...agentWorkspaceFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...toolPostureFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...sandboxPostureFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...dataHandlingFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...secretAuthProvenanceFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence),
		...execApprovalsFindings(policy, policyFile.displayName, policyFile.ocDocName, evidence, execApprovalsFile, execApprovalsDisplayName()),
		...authMetadataRequirementFindings,
		...metadataRequirementFindings,
		...unmigratedToolsFinding === void 0 ? [] : [unmigratedToolsFinding]
	];
	if (requiredMetadata.has("risk")) {
		policyFindings.push(...toolRiskFindings(policyFile.ocDocName, evidence));
		policyFindings.push(...toolUnknownRiskFindings(policyFile.ocDocName, evidence));
	}
	if (requiredMetadata.has("sensitivity")) policyFindings.push(...toolSensitivityFindings(policyFile.ocDocName, evidence));
	if (requiredMetadata.has("owner")) policyFindings.push(...toolOwnerFindings(policyFile.ocDocName, evidence));
	const attestationFindings = policyAttestationFindings(policyFile.displayName, policyHash, evidence, policyFindings, settings);
	if (hasPolicyValidationFinding(policyFindings)) findings.push(...policyFindings);
	else if (attestationFindings.length > 0) findings.push(...attestationFindings);
	else findings.push(...policyFindings);
	return {
		policyPath,
		policy: {
			value: policy,
			hash: policyHash
		},
		evidence,
		expectedAttestationHash: settings.expectedAttestationHash,
		findings,
		attestedFindings: policyFindings
	};
}
function policyParseFinding(policyPath, policyDocName, parseError) {
	return {
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} could not be parsed: ${parseError.message}`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}`,
		fixHint: `Fix ${policyPath} so policy conformance checks can run.`
	};
}
function findingsForCheck(evaluation, checkId) {
	return evaluation.findings.filter((finding) => finding.checkId === checkId);
}
function hasPolicyValidationFinding(findings) {
	return findings.some((finding) => finding.checkId === CHECK_IDS.policyInvalidFile || finding.checkId === CHECK_IDS.policyUnmigratedToolsFile);
}
function channelFindings(policy, policyPath, policyDocName, evidence) {
	const invalidRules = invalidChannelDenyRuleFindings(policy, policyPath, policyDocName);
	if (invalidRules.length > 0) return invalidRules;
	const denyRules = readChannelDenyRules(policy, policyDocName);
	if (denyRules.length === 0) return [];
	return evidence.channels.flatMap((channel) => {
		if (channel.enabled === false) return [];
		const rule = denyRules.find((candidate) => candidate.when?.provider === channel.provider);
		if (rule === void 0) return [];
		return [policyEvidenceFinding(channel, {
			checkId: CHECK_IDS.policyDeniedChannelProvider,
			message: `Channel '${channel.id}' uses denied provider '${channel.provider}'.`,
			requirement: rule.requirement,
			fixHint: rule.reason ?? "Disable this channel, remove it from config, or update the policy deny rule."
		})];
	});
}
function policyAttestationFindings(policyPath, policyHash, evidence, findings, settings) {
	const expected = settings.expectedAttestationHash?.trim();
	if (!expected) return [];
	const current = createPolicyAttestation({
		ok: findings.length === 0,
		checkedAt: (/* @__PURE__ */ new Date(0)).toISOString(),
		policyPath,
		policyHash,
		evidence,
		findings: findings.map(toAttestedFinding)
	});
	if (current.attestationHash === expected) return [];
	return [{
		checkId: CHECK_IDS.policyAttestationMismatch,
		severity: "error",
		message: "The current policy check no longer matches the accepted policy attestation.",
		source: "policy",
		path: "policy attestation",
		target: "oc://policy/attestation/current",
		requirement: "oc://openclaw.config/plugins/entries/policy/config/expectedAttestationHash",
		fixHint: `Run policy check, review attestation ${current.attestationHash}, then update plugins.entries.policy.config.expectedAttestationHash and the supervisor/gateway accepted attestation.`
	}];
}
function toAttestedFinding(finding) {
	return {
		checkId: finding.checkId,
		severity: finding.severity,
		message: finding.message,
		...finding.source !== void 0 ? { source: finding.source } : {},
		...finding.path !== void 0 ? { path: finding.path } : {},
		...finding.line !== void 0 ? { line: finding.line } : {},
		...finding.column !== void 0 ? { column: finding.column } : {},
		...finding.ocPath !== void 0 ? { ocPath: finding.ocPath } : {},
		...finding.target !== void 0 ? { target: finding.target } : {},
		...finding.requirement !== void 0 ? { requirement: finding.requirement } : {},
		...finding.fixHint !== void 0 ? { fixHint: finding.fixHint } : {}
	};
}
function toolMetadataRequirementFindings(policy, policyPath, policyDocName) {
	if (!isRecord(policy) || !isRecord(policy.tools) || policy.tools.requireMetadata === void 0) return [];
	if (!Array.isArray(policy.tools.requireMetadata)) return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} tools.requireMetadata must be an array of metadata keys.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/tools/requireMetadata`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_TOOL_METADATA.join(", ")}.`
	}];
	const invalidIndex = policy.tools.requireMetadata.findIndex((entry) => typeof entry !== "string" || !SUPPORTED_TOOL_METADATA.includes(entry.trim().toLowerCase()));
	if (invalidIndex < 0) return [];
	return [{
		checkId: CHECK_IDS.policyInvalidFile,
		severity: "error",
		message: `${policyPath} tools.requireMetadata[${invalidIndex}] must be a supported metadata key.`,
		source: "policy",
		path: policyPath,
		target: `oc://${policyDocName}/tools/requireMetadata/#${invalidIndex}`,
		fixHint: `Use supported metadata keys: ${SUPPORTED_TOOL_METADATA.join(", ")}.`
	}];
}
//#endregion
//#region extensions/policy/src/doctor/register.ts
let policyDoctorChecks;
const registeredPolicyDoctorRegistrars = /* @__PURE__ */ new WeakSet();
function registerPolicyDoctorChecks(host) {
	if (host !== void 0 && registeredPolicyDoctorRegistrars.has(host.registerHealthCheck)) return;
	const registerHealthCheck$1 = host?.registerHealthCheck ?? registerHealthCheck;
	policyDoctorChecks ??= createPolicyDoctorChecks({
		channelIdsFromFindings,
		disableChannels,
		evaluatePolicy,
		findingsForCheck,
		workspaceRepairsDisabledResult,
		workspaceRepairsEnabled
	});
	for (const check of policyDoctorChecks) {
		if (host === void 0 && getHealthCheck(check.id) === check) continue;
		registerHealthCheck$1(check);
	}
	registeredPolicyDoctorRegistrars.add(registerHealthCheck$1);
}
//#endregion
export { POLICY_RULE_METADATA as a, ocPathSegment as c, POLICY_FIX_METADATA_BY_CHECK_ID as d, POLICY_CHECK_IDS as f, isPolicyValueAtLeastAsStrict as i, getPolicyPath as l, evaluatePolicy as n, policyRuleValueIsValid as o, policyContainerShapeFindings as r, createPolicyAttestation as s, registerPolicyDoctorChecks as t, scopedPolicyValue as u };
