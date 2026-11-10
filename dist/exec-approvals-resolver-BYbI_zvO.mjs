import { t as expandHomePrefix } from "./home-dir-CtsdYvX3.mjs";
import { f as resolveExecApprovalsSocketPath, s as normalizeExecApprovalsInternal, u as resolveExecApprovalsDisplayPath } from "./exec-approvals-config-JiuCEgOc.mjs";
//#region src/infra/exec-approvals-resolver.ts
function resolveExecApprovalsFromFileInternal(params) {
	const rawFile = params.file;
	const file = normalizeExecApprovalsInternal(rawFile);
	const defaults = file.defaults ?? {};
	const agentKey = params.agentId ?? "default";
	const agent = file.agents?.[agentKey] ?? {};
	const wildcard = file.agents?.["*"] ?? {};
	const rawAgent = rawFile.agents?.[agentKey] ?? {};
	const rawWildcard = rawFile.agents?.["*"] ?? {};
	const fallbackSecurity = params.overrides?.security ?? "full";
	const fallbackAsk = params.overrides?.ask ?? "off";
	const fallbackAskFallback = params.overrides?.askFallback ?? "deny";
	const fallbackAutoAllowSkills = params.overrides?.autoAllowSkills ?? false;
	const resolvedDefaults = {
		security: defaults.security ?? fallbackSecurity,
		ask: defaults.ask ?? fallbackAsk,
		askFallback: defaults.askFallback ?? fallbackAskFallback,
		autoAllowSkills: defaults.autoAllowSkills ?? fallbackAutoAllowSkills
	};
	const resolveField = (field) => {
		const defaultValue = defaults[field];
		const fallbackField = defaultValue !== void 0 ? {
			value: defaultValue,
			source: `defaults.${field}`
		} : {
			value: resolvedDefaults[field],
			source: null
		};
		const agentOverrides = rawAgent[field] != null;
		const value = (agentOverrides ? agent : rawWildcard[field] != null ? wildcard : void 0)?.[field];
		return value !== void 0 ? {
			value,
			source: `agents.${agentOverrides ? agentKey : "*"}.${field}`
		} : fallbackField;
	};
	const resolvedAgentSecurity = resolveField("security");
	const resolvedAgentAsk = resolveField("ask");
	const resolvedAgentAskFallback = resolveField("askFallback");
	const resolvedAgent = {
		security: resolvedAgentSecurity.value,
		ask: resolvedAgentAsk.value,
		askFallback: resolvedAgentAskFallback.value,
		autoAllowSkills: agent.autoAllowSkills ?? wildcard.autoAllowSkills ?? resolvedDefaults.autoAllowSkills
	};
	const allowlist = [...wildcard.allowlist ?? [], ...agent.allowlist ?? []];
	return {
		path: params.path ?? resolveExecApprovalsDisplayPath(),
		socketPath: expandHomePrefix(params.socketPath ?? file.socket?.path ?? resolveExecApprovalsSocketPath()),
		token: params.token ?? file.socket?.token ?? "",
		defaults: resolvedDefaults,
		agent: resolvedAgent,
		agentSources: {
			security: resolvedAgentSecurity.source,
			ask: resolvedAgentAsk.source,
			askFallback: resolvedAgentAskFallback.source
		},
		allowlist,
		file
	};
}
//#endregion
export { resolveExecApprovalsFromFileInternal as t };
