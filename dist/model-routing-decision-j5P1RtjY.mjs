import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { T as hasAgentRosterProperty, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { A as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { i as recordExecutionDecisionWork } from "./execution-decision-work-2rlltydX.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/workspace-run.ts
/**
* Agent run workspace resolver.
*
* Selects per-run workspace directories and redacts run identifiers for logs/prompts.
*/
const RUN_WORKSPACE_ROSTER_REQUIRED_ERROR_CODE = "RUN_WORKSPACE_ROSTER_REQUIRED";
var RunWorkspaceRosterRequiredError = class extends Error {
	constructor() {
		super("No agents configured; run workspace resolution requires an explicit roster.");
		this.code = RUN_WORKSPACE_ROSTER_REQUIRED_ERROR_CODE;
		this.name = "RunWorkspaceRosterRequiredError";
	}
};
var RunWorkspaceAgentNotConfiguredError = class extends Error {
	constructor(agentId) {
		super(`Agent ${agentId} is not present in the configured roster.`);
		this.code = "RUN_WORKSPACE_AGENT_NOT_CONFIGURED";
		this.name = "RunWorkspaceAgentNotConfiguredError";
		this.agentId = agentId;
	}
};
/** Redacts a run/session identifier for logs and prompts. */
function redactRunIdentifier(value) {
	return redactIdentifier(value, { len: 12 });
}
/** Resolves the workspace directory used for an agent run. */
function resolveRunWorkspaceDir(params) {
	const rawSessionKey = params.sessionKey?.trim() ?? "";
	if (classifySessionKeyShape(rawSessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing workspace resolution.");
	const config = params.config;
	if (!config || !hasAgentRosterProperty(config)) throw new RunWorkspaceRosterRequiredError();
	const env = params.env ?? process.env;
	const requested = params.workspaceDir;
	const agentId = resolveSessionAgentId({
		sessionKey: rawSessionKey || void 0,
		agentId: params.agentId,
		config
	});
	const agentIdSource = params.agentId ? "explicit" : parseAgentSessionKey(rawSessionKey)?.agentId ? "session_key" : "default";
	if (!resolveAgentConfig(config, agentId)) throw new RunWorkspaceAgentNotConfiguredError(agentId);
	if (typeof requested === "string") {
		const trimmed = requested.trim();
		if (trimmed) {
			const sanitized = sanitizeForPromptLiteral(trimmed);
			if (sanitized !== trimmed) logWarn("Control/format characters stripped from workspaceDir (OC-19 hardening).");
			const workspaceDir = resolveUserPath(sanitized, env);
			return {
				workspaceDir,
				isCanonicalWorkspace: workspaceDir === resolveUserPath(resolveAgentWorkspaceDir(config, agentId, env), env),
				usedFallback: false,
				agentId,
				agentIdSource
			};
		}
	}
	const fallbackReason = requested == null ? "missing" : typeof requested === "string" ? "blank" : "invalid_type";
	const fallbackWorkspace = resolveAgentWorkspaceDir(config, agentId, env);
	const sanitizedFallback = sanitizeForPromptLiteral(fallbackWorkspace);
	if (sanitizedFallback !== fallbackWorkspace) logWarn("Control/format characters stripped from fallback workspaceDir (OC-19 hardening).");
	return {
		workspaceDir: resolveUserPath(sanitizedFallback, env),
		isCanonicalWorkspace: true,
		usedFallback: true,
		fallbackReason,
		agentId,
		agentIdSource
	};
}
//#endregion
//#region src/agents/model-routing-decision.ts
/** Receipt-grade facts for one model route that reached exact run admission. */
function boundedModelRef(provider, model) {
	return truncateUtf16Safe(redactSensitiveText(`${provider}/${model}`, { mode: "tools" }), 160);
}
/** Queue only selected routes that already own an admitted execution token. */
function recordAdmittedModelRoutingDecision(params) {
	const admittedRunContext = params.admittedRunContext;
	const token = admittedRunContext?.executionIdentityToken;
	if (!token) return false;
	const receiptId = `model-routing:${randomUUID()}`;
	const requestedRef = boundedModelRef(params.requestedProvider, params.requestedModel);
	const selectedRef = boundedModelRef(params.selectedProvider, params.selectedModel);
	const credentialProfileId = params.credentialProfileId?.trim();
	const hasCredentialOwner = Boolean(credentialProfileId);
	const reasonCode = params.fallbackReason ?? (params.fallbackSelected ? "model_route_selected_after_fallback" : "model_route_selected");
	const assertActive = resolveAdmittedRunActiveAssertion(admittedRunContext, params.abortSignal);
	if (!assertActive) throw new Error("admitted run authority is no longer active");
	assertActive();
	return recordExecutionDecisionWork({
		workVersion: 1,
		token,
		receipt: {
			schemaVersion: 1,
			receiptId,
			occurredAt: params.occurredAt ?? Date.now(),
			action: {
				family: "model-routing",
				operation: `${params.selectionMode}-selection`,
				summary: `Requested ${requestedRef}; selected ${selectedRef}.`
			},
			decision: {
				outcome: "allowed",
				reasonCode
			},
			enforcement: {
				coverageState: hasCredentialOwner ? "attribution-only" : "unknown",
				policyRefs: [],
				grantRefs: [],
				contextFieldsUsed: [
					"contextId",
					"executionId",
					"runId"
				]
			},
			source: {
				owner: "model-routing",
				recordRef: receiptId,
				decisionBoundary: "agent-runtime.post-admission"
			},
			missingEvidence: hasCredentialOwner ? [] : ["credential_profile_owner"],
			remediation: []
		},
		refs: {
			...credentialProfileId ? { resource: {
				namespace: "credential-profile",
				value: credentialProfileId
			} } : {},
			target: {
				namespace: "model-route",
				value: JSON.stringify([params.selectedProvider, params.selectedModel])
			}
		}
	});
}
//#endregion
export { redactRunIdentifier as n, resolveRunWorkspaceDir as r, recordAdmittedModelRoutingDecision as t };
