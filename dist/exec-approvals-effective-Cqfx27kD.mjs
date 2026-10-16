import { v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveExecModeFromPolicy, l as resolveExecModePolicy } from "./exec-approvals-core-s7tTQC_a.mjs";
import { i as DEFAULT_EXEC_APPROVAL_ASK_FALLBACK, p as resolveExecApprovalsDisplayPath } from "./exec-approvals-migration-gate-4cEEb67t.mjs";
import { _ as resolveExecApprovalAllowedDecisions, b as resolveExecApprovalsFromFileInternal, m as minSecurity, p as maxAsk } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import "./exec-approvals-B1rZTeax.mjs";
//#region src/infra/exec-approvals-effective.ts
const DEFAULT_REQUESTED_SECURITY = "full";
const DEFAULT_REQUESTED_ASK = "off";
const SESSION_EXEC_OVERRIDES_NOTE = "Per-session /exec overrides are not included; run /exec in the relevant session to inspect its current defaults.";
function resolveRequestedField(params) {
	if (params.scopeValue !== void 0) return {
		value: params.scopeValue,
		sourcePath: "scope"
	};
	if (params.globalValue !== void 0) return {
		value: params.globalValue,
		sourcePath: "tools.exec"
	};
	return {
		value: params.fallback,
		sourcePath: "__default__"
	};
}
function formatRequestedSource(params) {
	return params.sourcePath === "__default__" ? `OpenClaw default (${params.defaultValue})` : `${params.sourcePath}.${params.field}`;
}
function hasLegacyExecPolicyOverride(exec) {
	return exec?.security !== void 0 || exec?.ask !== void 0;
}
function resolveRequestedPolicy(params) {
	const explicitMode = params.scopeExecConfig?.mode || (!hasLegacyExecPolicyOverride(params.scopeExecConfig) ? params.globalExecConfig?.mode : void 0);
	if (explicitMode) {
		const policy = resolveExecModePolicy({
			mode: explicitMode,
			security: DEFAULT_REQUESTED_SECURITY,
			ask: DEFAULT_REQUESTED_ASK
		});
		const source = `${params.scopeExecConfig?.mode ? params.configPath : "tools.exec"}.mode`;
		return {
			mode: policy.mode,
			modeSource: source,
			security: policy.security,
			securitySource: source,
			ask: policy.ask,
			askSource: source
		};
	}
	const inherited = params.globalExecConfig?.mode ? resolveExecModePolicy({
		mode: params.globalExecConfig.mode,
		security: DEFAULT_REQUESTED_SECURITY,
		ask: DEFAULT_REQUESTED_ASK
	}) : void 0;
	const security = resolveRequestedField({
		scopeValue: params.scopeExecConfig?.security,
		globalValue: inherited?.security ?? params.globalExecConfig?.security,
		fallback: DEFAULT_REQUESTED_SECURITY
	});
	const ask = resolveRequestedField({
		scopeValue: params.scopeExecConfig?.ask,
		globalValue: inherited?.ask ?? params.globalExecConfig?.ask,
		fallback: DEFAULT_REQUESTED_ASK
	});
	const securitySource = inherited && security.sourcePath === "tools.exec" ? "tools.exec.mode" : formatRequestedSource({
		sourcePath: security.sourcePath === "scope" ? params.configPath : security.sourcePath,
		field: "security",
		defaultValue: DEFAULT_REQUESTED_SECURITY
	});
	const askSource = inherited && ask.sourcePath === "tools.exec" ? "tools.exec.mode" : formatRequestedSource({
		sourcePath: ask.sourcePath === "scope" ? params.configPath : ask.sourcePath,
		field: "ask",
		defaultValue: DEFAULT_REQUESTED_ASK
	});
	return {
		mode: resolveExecModeFromPolicy({
			security: security.value,
			ask: ask.value
		}),
		modeSource: securitySource === askSource ? `derived from ${securitySource}` : `derived from ${securitySource} and ${askSource}`,
		security: security.value,
		securitySource,
		ask: ask.value,
		askSource
	};
}
function formatHostFieldSource(params) {
	if (params.sourceSuffix) return `${params.hostPath} ${params.sourceSuffix}`;
	if (params.hostDefaultSource) return params.hostDefaultSource;
	if (params.field === "askFallback") return `OpenClaw default (${DEFAULT_EXEC_APPROVAL_ASK_FALLBACK})`;
	return "inherits requested tool policy";
}
function collectExecPolicyScopeSnapshots(params) {
	const defaultAgentId = tryResolveLegacyCompatibilityAgentId(params.cfg);
	const snapshots = [resolveExecPolicyScopeSnapshot({
		approvals: params.approvals,
		agentId: defaultAgentId,
		scopeExecConfig: params.cfg.tools?.exec,
		configPath: "tools.exec",
		hostPath: params.hostPath,
		hostDefaults: params.hostDefaults,
		hostDefaultSource: params.hostDefaultSource,
		scopeLabel: "tools.exec"
	})];
	const globalExecConfig = params.cfg.tools?.exec;
	const configuredAgents = listAgentEntries(params.cfg);
	const configAgentIds = new Set(configuredAgents.filter((agent) => agent.id !== defaultAgentId || agent.tools?.exec !== void 0).map((agent) => agent.id));
	const approvalAgentIds = Object.keys(params.approvals.agents ?? {}).filter((agentId) => agentId !== "*" && agentId !== "default" && agentId !== defaultAgentId);
	const agentIds = sortUniqueStrings([...configAgentIds, ...approvalAgentIds]);
	for (const agentId of agentIds) {
		const agentConfig = configuredAgents.find((agent) => agent.id === agentId);
		snapshots.push(resolveExecPolicyScopeSnapshot({
			approvals: params.approvals,
			scopeExecConfig: agentConfig?.tools?.exec,
			globalExecConfig,
			configPath: `agents.entries.${agentId}.tools.exec`,
			hostPath: params.hostPath,
			hostDefaults: params.hostDefaults,
			hostDefaultSource: params.hostDefaultSource,
			scopeLabel: `agent:${agentId}`,
			agentId
		}));
	}
	return snapshots;
}
function resolveExecPolicyScopeSnapshot(params) {
	const requestedHost = resolveRequestedField({
		scopeValue: params.scopeExecConfig?.host,
		globalValue: params.globalExecConfig?.host,
		fallback: "auto"
	});
	const requestedPolicy = resolveRequestedPolicy({
		scopeExecConfig: params.scopeExecConfig,
		globalExecConfig: params.globalExecConfig,
		configPath: params.configPath
	});
	const resolved = resolveExecApprovalsFromFileInternal({
		file: params.approvals,
		agentId: params.agentId,
		overrides: {
			security: params.hostDefaults?.security ?? requestedPolicy.security,
			ask: params.hostDefaults?.ask ?? requestedPolicy.ask,
			...params.hostDefaults ? { askFallback: params.hostDefaults.askFallback } : {}
		}
	});
	const hostPath = params.hostPath ?? resolveExecApprovalsDisplayPath();
	const effectiveSecurity = minSecurity(requestedPolicy.security, resolved.agent.security);
	const effectiveAsk = maxAsk(requestedPolicy.ask, resolved.agent.ask);
	const effectiveAskFallback = minSecurity(effectiveSecurity, resolved.agent.askFallback);
	const effectiveMode = effectiveSecurity === requestedPolicy.security && effectiveAsk === requestedPolicy.ask ? requestedPolicy.mode : resolveExecModeFromPolicy({
		security: effectiveSecurity,
		ask: effectiveAsk
	});
	return {
		scopeLabel: params.scopeLabel,
		configPath: params.configPath,
		...params.agentId ? { agentId: params.agentId } : {},
		host: {
			requested: requestedHost.value,
			requestedSource: requestedHost.sourcePath === "__default__" ? "OpenClaw default (auto)" : `${requestedHost.sourcePath === "scope" ? params.configPath : requestedHost.sourcePath}.host`
		},
		mode: {
			requested: requestedPolicy.mode,
			requestedSource: requestedPolicy.modeSource,
			effective: effectiveMode,
			note: effectiveMode === requestedPolicy.mode ? "requested mode applies" : "host policy changes effective mode"
		},
		security: {
			requested: requestedPolicy.security,
			requestedSource: requestedPolicy.securitySource,
			host: resolved.agent.security,
			hostSource: formatHostFieldSource({
				hostPath,
				field: "security",
				sourceSuffix: resolved.agentSources.security,
				hostDefaultSource: params.hostDefaultSource
			}),
			effective: effectiveSecurity,
			note: effectiveSecurity === requestedPolicy.security ? "requested security applies" : "stricter host security wins"
		},
		ask: {
			requested: requestedPolicy.ask,
			requestedSource: requestedPolicy.askSource,
			host: resolved.agent.ask,
			hostSource: formatHostFieldSource({
				hostPath,
				field: "ask",
				sourceSuffix: resolved.agentSources.ask,
				hostDefaultSource: params.hostDefaultSource
			}),
			effective: effectiveAsk,
			note: effectiveAsk === requestedPolicy.ask ? "requested ask applies" : "more aggressive ask wins"
		},
		askFallback: {
			effective: effectiveAskFallback,
			source: formatHostFieldSource({
				hostPath,
				field: "askFallback",
				sourceSuffix: resolved.agentSources.askFallback,
				hostDefaultSource: params.hostDefaultSource
			})
		},
		allowedDecisions: resolveExecApprovalAllowedDecisions({ ask: effectiveAsk })
	};
}
//#endregion
export { collectExecPolicyScopeSnapshots as n, resolveExecPolicyScopeSnapshot as r, SESSION_EXEC_OVERRIDES_NOTE as t };
