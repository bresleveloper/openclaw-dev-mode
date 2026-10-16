import { c as isRecord, t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { a as createMigrationConfigPatchItem, c as hasMigrationConfigPatchConflict, n as MIGRATION_REASON_TARGET_EXISTS, s as createMigrationManualItem } from "./migration-BeM6IrM8.mjs";
import { a as sanitizeName, r as readJsonObject } from "./helpers-Dp0K3dCk.mjs";
//#region extensions/migrate-claude/config.ts
function mapMcpServers(raw) {
	if (!isRecord(raw)) return;
	const mapped = {};
	for (const [name, value] of Object.entries(raw)) {
		if (!name.trim() || !isRecord(value)) continue;
		const next = {};
		for (const key of [
			"command",
			"args",
			"env",
			"cwd",
			"workingDirectory",
			"url",
			"type",
			"transport",
			"headers",
			"connectionTimeoutMs"
		]) if (value[key] !== void 0) next[key] = value[key];
		if (Object.keys(next).length > 0) mapped[name] = next;
	}
	return Object.keys(mapped).length > 0 ? mapped : void 0;
}
async function collectMcpSources(source) {
	const sources = [];
	const add = (sourceId, sourceLabel, sourcePath, raw) => {
		const servers = mapMcpServers(raw);
		if (servers && sourcePath) sources.push({
			sourceId,
			sourceLabel,
			sourcePath,
			servers
		});
	};
	const projectMcp = await readJsonObject(source.projectMcpPath);
	add("project-mcp", "project .mcp.json", source.projectMcpPath, projectMcp.mcpServers ?? projectMcp);
	const claudeJson = await readJsonObject(source.userClaudeJsonPath);
	add("user-claude-json", "user ~/.claude.json", source.userClaudeJsonPath, claudeJson.mcpServers);
	if (source.projectDir) {
		const projectRecord = asNonArrayRecord(asNonArrayRecord(claudeJson.projects)[source.projectDir]);
		add("user-claude-json-project", "project entry in ~/.claude.json", source.userClaudeJsonPath, projectRecord.mcpServers);
	}
	const desktopConfig = await readJsonObject(source.desktopConfigPath);
	add("desktop", "Claude Desktop config", source.desktopConfigPath, desktopConfig.mcpServers);
	return sources;
}
async function buildConfigItems(params) {
	const items = [];
	const mcpSources = await collectMcpSources(params.source);
	const counts = /* @__PURE__ */ new Map();
	for (const mcpSource of mcpSources) for (const name of Object.keys(mcpSource.servers)) counts.set(name, (counts.get(name) ?? 0) + 1);
	for (const mcpSource of mcpSources) for (const [name, value] of Object.entries(mcpSource.servers)) {
		const patch = { [name]: value };
		const duplicate = (counts.get(name) ?? 0) > 1;
		const conflict = duplicate || !params.ctx.overwrite && hasMigrationConfigPatchConflict(params.ctx.config, ["mcp", "servers"], patch);
		items.push(createMigrationConfigPatchItem({
			id: `config:mcp-server:${sanitizeName(mcpSource.sourceId)}:${sanitizeName(name)}`,
			source: mcpSource.sourcePath,
			target: `mcp.servers.${name}`,
			path: ["mcp", "servers"],
			value: patch,
			message: `Import Claude MCP server "${name}" from ${mcpSource.sourceLabel}.`,
			conflict,
			reason: duplicate ? `multiple Claude MCP sources define "${name}"` : MIGRATION_REASON_TARGET_EXISTS,
			details: { sourceLabel: mcpSource.sourceLabel }
		}));
	}
	for (const settingsPath of [
		params.source.userSettingsPath,
		params.source.userLocalSettingsPath,
		params.source.projectSettingsPath,
		params.source.projectLocalSettingsPath
	]) {
		const settings = await readJsonObject(settingsPath);
		for (const [key, message, recommendation] of [
			[
				"hooks",
				"Claude hooks were found but are not enabled automatically.",
				"Review hook commands before recreating equivalent OpenClaw automation."
			],
			[
				"permissions",
				"Claude permission settings were found but are not translated automatically.",
				"Review deny and allow rules manually. Do not import broad allow rules without a policy review."
			],
			[
				"env",
				"Claude environment defaults were found but are not copied automatically.",
				"Move non-secret values manually and store credentials through OpenClaw credential flows."
			]
		]) if (settingsPath && settings[key] !== void 0) items.push(createMigrationManualItem({
			id: `manual:${key}:${sanitizeName(settingsPath)}`,
			source: settingsPath,
			message,
			recommendation
		}));
	}
	return items;
}
//#endregion
export { buildConfigItems as t };
