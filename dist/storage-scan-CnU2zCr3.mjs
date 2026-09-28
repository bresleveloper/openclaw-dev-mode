import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { O as listAgentIds, a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as parseEnvValue } from "./shared-BUXrUFz5.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/storage-scan.ts
/** Filesystem discovery for local secret storage audits. */
/** Parses one .env assignment value using the shared shell-ish env parser. */
function parseEnvAssignmentValue(raw) {
	return parseEnvValue(raw);
}
/** Lists global dotenv files that can supply secrets for the selected config and state roots. */
function listSecretsDotEnvPaths(params) {
	const candidates = [path.join(params.stateDir, ".env"), path.join(path.dirname(params.configPath), ".env")];
	return [...new Map(candidates.map((candidate) => [path.resolve(candidate), candidate])).values()];
}
/**
* Lists deduplicated models.json paths that may contain materialized provider credentials.
* Includes active env override, implicit main agent, discovered state dirs, and configured agents.
*/
function listAgentModelsJsonPaths(config, stateDir, env = process.env) {
	const resolvedStateDir = resolveUserPath(stateDir, env);
	const paths = /* @__PURE__ */ new Set();
	paths.add(path.join(resolvedStateDir, "agents", "main", "agent", "models.json"));
	const override = env.OPENCLAW_AGENT_DIR?.trim() || env.PI_CODING_AGENT_DIR?.trim();
	if (override) paths.add(path.join(resolveUserPath(override, env), "models.json"));
	const agentsRoot = path.join(resolvedStateDir, "agents");
	if (fs.existsSync(agentsRoot)) for (const entry of fs.readdirSync(agentsRoot, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		paths.add(path.join(agentsRoot, entry.name, "agent", "models.json"));
	}
	for (const agentId of listAgentIds(config)) paths.add(path.join(resolveAgentDir(config, agentId, env), "models.json"));
	return [...paths];
}
//#endregion
export { listSecretsDotEnvPaths as n, parseEnvAssignmentValue as r, listAgentModelsJsonPaths as t };
