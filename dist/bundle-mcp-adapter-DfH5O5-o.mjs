import { s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/agents/bundle-mcp-adapter.ts
function decodeHeaderEnvPlaceholder(value) {
	const match = /^(Bearer )?\${([A-Z0-9_]+)}$/.exec(value);
	return match?.[2] ? {
		envVar: match[2],
		bearer: Boolean(match[1])
	} : null;
}
const COMMON_STRING_FIELDS = [
	"command",
	"cwd",
	"url"
];
function normalizeBundleMcpServerConfig(server, fields = {}) {
	const next = {};
	for (const field of [...COMMON_STRING_FIELDS, ...fields.strings ?? []]) if (typeof server[field] === "string") next[field] = server[field];
	for (const field of fields.booleans ?? []) if (typeof server[field] === "boolean") next[field] = server[field];
	const args = Array.isArray(server.args) && server.args.every((entry) => typeof entry === "string") ? [...server.args] : void 0;
	if (args) next.args = args;
	const env = filterStringRecord(server.env);
	if (env) next.env = env;
	return next;
}
//#endregion
export { normalizeBundleMcpServerConfig as n, decodeHeaderEnvPlaceholder as t };
