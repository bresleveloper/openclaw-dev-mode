import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { d as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, o as classifySessionKeyShape } from "./session-key-C09ow4h0.mjs";
import { t as hasAgentRosterProperty } from "./agent-roster-BXD1uMJD.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { i as logWarn } from "./logger-DskmrSVa.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
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
/** Rooted execution borrows plugin facts only from its agent's canonical bootstrap workspace. */
function resolveRootedRunRuntimeWorkspace(params) {
	if (!params.bootstrapWorkspaceDir?.trim() || !params.config || !hasAgentRosterProperty(params.config)) return;
	const bootstrap = resolveRunWorkspaceDir({
		...params,
		workspaceDir: params.bootstrapWorkspaceDir
	});
	if (!bootstrap.isCanonicalWorkspace || bootstrap.usedFallback) return;
	return params.workspaceDir !== bootstrap.workspaceDir || params.requireWorkspaceOnly === true && params.sessionRoot !== void 0 ? bootstrap : void 0;
}
/** Resolves the agent's canonical workspace for a run that executes somewhere else. */
function resolveCanonicalRunRuntimeWorkspace(params) {
	if (!params.config || !hasAgentRosterProperty(params.config)) return;
	const { fallbackReason: _fallbackReason, ...canonical } = resolveRunWorkspaceDir({
		...params,
		workspaceDir: void 0
	});
	return canonical.workspaceDir === resolveUserPath(params.workspaceDir, params.env ?? process.env) ? void 0 : {
		...canonical,
		usedFallback: false
	};
}
//#endregion
export { resolveRunWorkspaceDir as i, resolveCanonicalRunRuntimeWorkspace as n, resolveRootedRunRuntimeWorkspace as r, redactRunIdentifier as t };
