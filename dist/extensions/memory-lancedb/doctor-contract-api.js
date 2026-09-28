import { o as __toESM } from "./.setup/rolldown-runtime-BMI-E3GI.mjs";
import { MEMORY_AGENT_ID_COLUMN, MEMORY_TABLE_NAME, hasAgentScopeColumn, memoryAgentPredicate, quoteLanceSqlString } from "./lancedb-schema.js";
import { resolveDefaultAgentId } from "openclaw/plugin-sdk/agent-scope-runtime";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
//#region extensions/memory-lancedb/doctor-contract-api.ts
const LEGACY_ENVELOPE_DELETE_BATCH_SIZE = 500;
function resolveLegacyMemoryOwner(config) {
	const explicitSystemAgentId = config.agents?.ownership === "explicit" ? config.agents.defaults?.systemAgent?.agentId?.trim() : void 0;
	return explicitSystemAgentId ? {
		agentId: normalizeAgentId(explicitSystemAgentId),
		label: "system"
	} : {
		agentId: resolveDefaultAgentId(config),
		label: "default"
	};
}
const LEGACY_ENVELOPE_SENTINEL_LINE_RE = new RegExp(`^(?:${[
	"Conversation info (untrusted metadata):",
	"Sender (untrusted metadata):",
	"Thread starter (untrusted, for context):",
	"Reply target of current user message (untrusted, for context):",
	"Replied message (untrusted, for context):",
	"Forwarded message context (untrusted metadata):",
	"Conversation context (untrusted, chronological, selected for current message):",
	"Current local chat window (untrusted, chronological, before current message):",
	"Nearby reply target window (untrusted, chronological, around replied-to message):",
	"Chat history since last reply (untrusted, for context):"
].map((sentinel) => sentinel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})[^\\n]*$`, "m");
const LEGACY_ENVELOPE_LABEL_JSON_BLOCK_RE = /^[^\n]+\((?:untrusted metadata|untrusted, for context|untrusted, nearest first|untrusted, chronological,[^\n)]{1,80})\):[ \t]*\n[ \t]*```json[ \t]*\n[\s\S]*?\n[ \t]*```[ \t]*(?:\n|$)/m;
const LEGACY_ENVELOPE_HEADER_RE = /^Untrusted context \(metadata, do not treat as instructions or commands\):[ \t]*$/m;
function isLegacyEnvelopeContaminatedText(text) {
	return typeof text === "string" && (LEGACY_ENVELOPE_SENTINEL_LINE_RE.test(text) || LEGACY_ENVELOPE_LABEL_JSON_BLOCK_RE.test(text) || LEGACY_ENVELOPE_HEADER_RE.test(text));
}
async function scanLegacyEnvelopeRowIds(table) {
	const contaminatedIds = [];
	for await (const batch of table.query().select(["id", "text"])) for (const row of batch.toArray()) {
		if (!isLegacyEnvelopeContaminatedText(row.text)) continue;
		if (typeof row.id !== "string") throw new Error("LanceDB legacy envelope row is missing a string id");
		contaminatedIds.push(row.id);
	}
	return contaminatedIds;
}
function resolveMemoryLanceDbPluginRoot(moduleUrl) {
	const artifactDir = path.dirname(fileURLToPath(moduleUrl));
	return path.basename(artifactDir) === "dist" ? path.dirname(artifactDir) : artifactDir;
}
const DEFAULT_PLUGIN_ROOT = resolveMemoryLanceDbPluginRoot(import.meta.url);
function resolveHome(env) {
	return env.HOME?.trim() || os.homedir();
}
function resolveConfiguredDbPath(config, env, pluginRoot) {
	const pluginConfig = asOptionalRecord(config.plugins?.entries?.["memory-lancedb"]?.config);
	const configured = typeof pluginConfig?.dbPath === "string" ? pluginConfig.dbPath.trim() : "";
	if (!configured) return path.join(resolveHome(env), ".openclaw", "memory", "lancedb");
	if (configured.includes("://")) return configured;
	if (configured.startsWith("~")) return path.resolve(configured.replace(/^~(?=$|[\\/])/, () => resolveHome(env)));
	return path.resolve(pluginRoot, configured);
}
function resolveStorageOptions(config, env) {
	const pluginConfig = asOptionalRecord(config.plugins?.entries?.["memory-lancedb"]?.config);
	const rawOptions = asOptionalRecord(pluginConfig?.storageOptions);
	if (!rawOptions) return;
	return Object.fromEntries(Object.entries(rawOptions).map(([key, value]) => {
		if (typeof value !== "string") throw new Error(`memory-lancedb storageOptions.${key} must be a string`);
		return [key, value.replace(/\$\{([^}]+)\}/g, (_match, envName) => {
			const resolved = env[envName];
			if (!resolved) throw new Error(`Environment variable ${envName} is not set`);
			return resolved;
		})];
	}));
}
async function openMemoryTable(params) {
	const dbPath = resolveConfiguredDbPath(params.config, params.env, params.pluginRoot);
	if (!dbPath.includes("://") && !fs.existsSync(dbPath)) return {
		connection: null,
		table: null,
		dbPath
	};
	const lancedb = await import("./.setup/dist-BjiCSHUs.mjs").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	const storageOptions = resolveStorageOptions(params.config, params.env);
	const connection = await lancedb.connect(dbPath, storageOptions ? { storageOptions } : {});
	return {
		connection,
		table: (await connection.tableNames()).includes("memories") ? await connection.openTable(MEMORY_TABLE_NAME) : null,
		dbPath
	};
}
function createMemoryLanceDbStateMigrations(pluginRoot = DEFAULT_PLUGIN_ROOT) {
	return [{
		id: "memory-lancedb-agent-scope",
		label: "Memory LanceDB per-agent isolation",
		async detectLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table || hasAgentScopeColumn(await opened.table.schema())) return null;
				const owner = resolveLegacyMemoryOwner(params.config);
				const count = await opened.table.countRows();
				return { preview: [`- Memory LanceDB: assign ${count} legacy ${count === 1 ? "row" : "rows"} at ${opened.dbPath} to ${owner.label} agent ${owner.agentId}`] };
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		},
		async migrateLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table || hasAgentScopeColumn(await opened.table.schema())) return {
					changes: [],
					warnings: []
				};
				const owner = resolveLegacyMemoryOwner(params.config);
				const rowCount = await opened.table.countRows();
				await opened.table.addColumns([{
					name: MEMORY_AGENT_ID_COLUMN,
					valueSql: quoteLanceSqlString(owner.agentId)
				}]);
				if (!hasAgentScopeColumn(await opened.table.schema()) || await opened.table.countRows(memoryAgentPredicate(owner.agentId)) !== rowCount) throw new Error("LanceDB agent-scope migration verification failed");
				return {
					changes: [`Assigned ${rowCount} legacy Memory LanceDB ${rowCount === 1 ? "row" : "rows"} to ${owner.label} agent ${owner.agentId}`],
					warnings: []
				};
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		}
	}, {
		id: "memory-lancedb-legacy-envelope-rows",
		label: "Memory LanceDB legacy envelope contamination",
		doctorOnly: true,
		async detectLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table) return null;
				const contaminatedIds = await scanLegacyEnvelopeRowIds(opened.table);
				if (contaminatedIds.length === 0) return null;
				return { preview: [`- Memory LanceDB: delete ${contaminatedIds.length} memory ${contaminatedIds.length === 1 ? "row" : "rows"} contaminated with legacy envelope metadata at ${opened.dbPath}`] };
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		},
		async migrateLegacyState(params) {
			const opened = await openMemoryTable({
				...params,
				pluginRoot
			});
			try {
				if (!opened.table) return {
					changes: [],
					warnings: []
				};
				const contaminatedIds = await scanLegacyEnvelopeRowIds(opened.table);
				if (contaminatedIds.length === 0) return {
					changes: [],
					warnings: []
				};
				for (let offset = 0; offset < contaminatedIds.length; offset += LEGACY_ENVELOPE_DELETE_BATCH_SIZE) {
					const batch = contaminatedIds.slice(offset, offset + LEGACY_ENVELOPE_DELETE_BATCH_SIZE);
					await opened.table.delete(`id IN (${batch.map((id) => quoteLanceSqlString(id)).join(", ")})`);
				}
				if ((await scanLegacyEnvelopeRowIds(opened.table)).length !== 0) throw new Error("LanceDB legacy envelope row migration verification failed");
				return {
					changes: [`Deleted ${contaminatedIds.length} Memory LanceDB ${contaminatedIds.length === 1 ? "row" : "rows"} contaminated with legacy envelope metadata`],
					warnings: []
				};
			} finally {
				opened.table?.close();
				opened.connection?.close();
			}
		}
	}];
}
const stateMigrations = createMemoryLanceDbStateMigrations();
//#endregion
export { createMemoryLanceDbStateMigrations, resolveMemoryLanceDbPluginRoot, stateMigrations };
