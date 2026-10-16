import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Sn as looseObject, Un as record, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import path from "node:path";
//#region extensions/agentsapi/config.ts
const DEFAULT_NATIVE_TOOLS = [{
	type: "web_search",
	mode: "live"
}, {
	type: "programmatic_tool_calling",
	enabled: true
}];
const agentsApiConfigSchema = strictObject({
	nativeTools: array(looseObject({ type: string().min(1) })).default(DEFAULT_NATIVE_TOOLS),
	plugins: strictObject({
		enabled: boolean().optional(),
		allow_all_plugins: boolean().optional(),
		plugins: record(string(), strictObject({
			enabled: boolean().optional(),
			marketplaceName: string().regex(/^[A-Za-z0-9_-]+$/).optional(),
			pluginName: string().trim().min(1).optional()
		})).optional()
	}).optional(),
	environment: _enum(["openai_hosted", "self_hosted"]).default("openai_hosted"),
	openai_host: strictObject({ network: strictObject({
		access: _enum([
			"enabled",
			"disabled",
			"restricted"
		]),
		allowed_domains: array(string()).nullable().optional()
	}).nullable().optional() }).optional(),
	hostExecutorSkillDirectories: array(string().regex(/^(?:\/|[A-Za-z]:[\\/]|\\\\[^\\/]+[\\/][^\\/]+)/).refine((directory) => !directory.split(directory.startsWith("/") ? "/" : /[\\/]/).some((segment) => segment === "." || segment === ".."), "Executor skill directories cannot contain . or .. path segments")).max(32).refine((directories) => new Set(directories).size === directories.length, "Executor skill directories must be unique").optional()
});
function resolveAgentsApiEnvironment(parsed, workspaceDir) {
	return parsed.environment === "self_hosted" ? {
		type: "self_hosted",
		workspace_directory: path.resolve(workspaceDir),
		...parsed.hostExecutorSkillDirectories?.length ? { capability_directories: parsed.hostExecutorSkillDirectories } : {}
	} : {
		type: "openai_hosted",
		...parsed.openai_host?.network !== void 0 ? { network: parsed.openai_host.network } : {}
	};
}
//#endregion
export { agentsApiConfigSchema as n, resolveAgentsApiEnvironment as r, DEFAULT_NATIVE_TOOLS as t };
