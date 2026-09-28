import { a as CALL_RECORD_EVENT_META_MAX_ENTRIES, c as buildVoiceCallLegacyJsonlEventKey, h as resolveVoiceCallLegacyCallLogPath, i as CALL_RECORD_EVENT_CHUNKS_NAMESPACE, l as encodeCallRecordEvent, n as CALL_RECORD_CHUNK_MAX_ENTRIES, o as MAX_CALL_RECORD_EVENTS, p as parseVoiceCallRecordLine, r as CALL_RECORD_EVENTS_NAMESPACE, s as buildChunkKey, t as resolveDefaultVoiceCallStoreDir } from "./.setup/store-path-B1j1up4_.mjs";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import fs$1 from "node:fs/promises";
import { archiveLegacyStateSource } from "openclaw/plugin-sdk/runtime-doctor-migrations";
//#region extensions/voice-call/doctor-contract-api.ts
/** Resolve home from doctor env with OS fallback. */
function resolveHome(env) {
	return env.HOME?.trim() || os.homedir();
}
/** Resolve config paths, including "~", against the doctor env home. */
function resolveUserPath(input, env) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, () => resolveHome(env)));
	return path.resolve(trimmed);
}
/** Read the configured voice-call store path from either package id. */
function getVoiceCallConfigStore(config) {
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const rawConfig = config.plugins?.entries?.[pluginId]?.config;
		if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) continue;
		const store = rawConfig.store;
		if (typeof store === "string" && store.trim()) return store.trim();
	}
	return "";
}
/** Return Voice Call agents whose templated core session stores need migration. */
function resolveSessionStoreAgentIds(params) {
	const agentIds = /* @__PURE__ */ new Set();
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const entry = params.cfg.plugins?.entries?.[pluginId];
		if (!entry) continue;
		const config = entry.config === void 0 ? {} : asOptionalRecord(entry.config);
		if (!config) continue;
		agentIds.add(normalizeAgentId(typeof config.agentId === "string" ? config.agentId : void 0));
		const numbers = asOptionalRecord(config.numbers);
		for (const route of Object.values(numbers ?? {})) {
			const agentId = asOptionalRecord(route)?.agentId;
			if (typeof agentId === "string") agentIds.add(normalizeAgentId(agentId));
		}
	}
	return [...agentIds].toSorted();
}
/** Resolve the voice-call store path used by legacy and plugin-state call records. */
function resolveVoiceCallStorePath(params) {
	const configuredStore = getVoiceCallConfigStore(params.config);
	if (configuredStore) return resolveUserPath(configuredStore, params.env);
	return resolveDefaultVoiceCallStoreDir(params.env);
}
function resolveVoiceCallStateDatabaseEnv(params) {
	return {
		...params.env,
		OPENCLAW_STATE_DIR: resolveVoiceCallStorePath(params)
	};
}
function describeVoiceCallSchemaMigration(migration) {
	switch (migration.kind) {
		case "agent-databases-composite-primary-key": return "agent database registry primary key -> agent_id,path";
		case "agent-databases-relative-paths-v9": return "agent database registry paths -> state-relative paths";
		case "audit-events-v2": return "audit event ledger -> versioned message lifecycle schema";
		case "commitments-retirement-v7": return "retired commitments storage -> discarded rows, table, and indexes";
		case "state-table-retirement-v10": return "retired shared-state tables -> removed tables and indexes";
		case "state-table-retirement-v11": return "retired skill curator tables -> removed tables and indexes";
		case "singleton-state-foldin-v12": return "singleton state tables -> shared configuration state";
		case "state-consolidation-v13": return "cron jobs and subagent runs -> canonical JSON storage";
		case "creator-namespace-v14": return "cron creators -> explicit principal namespaces";
		case "conversation-binding-targets-v15": return "conversation bindings -> exact target keys without agent/session projections";
		case "skill-workshop-directory-ownership-v16": return "Skill Workshop proposals -> per-agent Workshop directory ownership";
		case "prepared-worker-ownership-v17": return "prepared workers -> one-use capacity and fixed workspace ownership";
		case "github-publication-requester-authority-v18": return "GitHub publication receipts -> original requesting authority";
		case "worker-placement-execution-mode-v8": return "cloud worker placements -> execution-mode claims";
		case "operator-approvals-system-agent": return "operator approvals -> OpenClaw system changes";
		case "session-watch-cursor-provenance-v4": return "session watch cursors -> provenance column";
		case "strict-tables-v3": return "tables -> SQLite STRICT typing";
	}
	return migration.kind;
}
/** Read and prepare legacy JSONL call records, collecting line-level warnings. */
async function readLegacyCallRecords(filePath) {
	let content;
	try {
		content = await fs$1.readFile(filePath, "utf8");
	} catch {
		return {
			entries: [],
			warnings: []
		};
	}
	const entries = [];
	const warnings = [];
	let index = 0;
	for (const line of content.split("\n")) {
		const parsed = parseVoiceCallRecordLine(line, index);
		if (!parsed) {
			if (line.trim()) warnings.push(`Skipped malformed Voice Call call-log line ${index + 1}`);
			index += 1;
			continue;
		}
		try {
			const prepared = encodeCallRecordEvent(parsed.call);
			const chunks = Array.from({ length: prepared.meta.chunkCount }, (_, chunkIndex) => prepared.chunk(chunkIndex));
			entries.push({
				eventKey: buildVoiceCallLegacyJsonlEventKey(line, index),
				lineNumber: index + 1,
				chunks,
				meta: {
					...prepared.meta,
					persistedAt: parsed.persistedAt,
					sequence: parsed.sequence
				}
			});
		} catch (err) {
			warnings.push(`Skipped Voice Call call-log line ${index + 1}: ${String(err)}`);
		}
		index += 1;
	}
	return {
		entries,
		warnings
	};
}
/** Select newest missing records that fit remaining plugin state capacity. */
async function selectEntriesForImport(params) {
	const existingEventKeys = new Set((await params.eventStore.entries()).map((entry) => entry.key));
	const missingEntries = params.entries.filter((entry) => !existingEventKeys.has(entry.eventKey));
	const existingChunks = await params.chunkStore.entries();
	let eventRoom = Math.max(0, MAX_CALL_RECORD_EVENTS - existingEventKeys.size);
	let chunkRoom = Math.max(0, CALL_RECORD_CHUNK_MAX_ENTRIES - existingChunks.length);
	const selected = [];
	let pruned = 0;
	for (const entry of missingEntries.toReversed()) {
		if (eventRoom <= 0 || entry.chunks.length > chunkRoom) {
			pruned++;
			continue;
		}
		selected.push(entry);
		eventRoom--;
		chunkRoom -= entry.chunks.length;
	}
	if (pruned > 0) params.warnings.push(`Pruned ${pruned} older Voice Call call-log ${pruned === 1 ? "record" : "records"} during migration because plugin state keeps the newest ${MAX_CALL_RECORD_EVENTS} records`);
	return {
		existingEventKeys,
		entries: selected.toReversed()
	};
}
/** Import prepared legacy call records into plugin state. */
async function importLegacyCallRecords(params) {
	const selected = await selectEntriesForImport(params);
	let imported = 0;
	for (const entry of selected.entries) {
		if (selected.existingEventKeys.has(entry.eventKey)) continue;
		try {
			for (const chunk of entry.chunks) await params.chunkStore.register(buildChunkKey(entry.eventKey, chunk.index), chunk);
			await params.eventStore.register(entry.eventKey, entry.meta);
			selected.existingEventKeys.add(entry.eventKey);
			imported++;
		} catch (err) {
			params.warnings.push(`Failed migrating Voice Call call-log line ${entry.lineNumber}: ${String(err)}`);
		}
	}
	return imported;
}
/** Doctor migrations owned by the voice-call plugin. */
const stateMigrations = [{
	id: "voice-call-calls-jsonl-to-plugin-state",
	label: "Voice Call call log",
	async detectLegacyState(params) {
		const storePath = resolveVoiceCallStorePath(params);
		if (!existsSync(storePath)) return null;
		const { detectOpenClawStateDatabaseSchemaMigrations } = await import("openclaw/plugin-sdk/doctor-repair-runtime");
		const { entries } = await readLegacyCallRecords(resolveVoiceCallLegacyCallLogPath(storePath));
		const schemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({ env: resolveVoiceCallStateDatabaseEnv(params) });
		if (entries.length === 0 && schemaMigrations.length === 0) return null;
		return { preview: [...schemaMigrations.map((migration) => `- Voice Call SQLite schema: ${describeVoiceCallSchemaMigration(migration)}`), ...entries.length > 0 ? [`- Voice Call call log: ${entries.length} ${entries.length === 1 ? "record" : "records"} -> plugin state (${CALL_RECORD_EVENTS_NAMESPACE})`] : []] };
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const storePath = resolveVoiceCallStorePath(params);
		if (!existsSync(storePath)) return {
			changes,
			warnings
		};
		const { detectOpenClawStateDatabaseSchemaMigrations, repairOpenClawStateDatabaseSchema } = await import("openclaw/plugin-sdk/doctor-repair-runtime");
		const filePath = resolveVoiceCallLegacyCallLogPath(storePath);
		const { entries, warnings: readWarnings } = await readLegacyCallRecords(filePath);
		warnings.push(...readWarnings);
		const stateDatabaseEnv = resolveVoiceCallStateDatabaseEnv(params);
		if (detectOpenClawStateDatabaseSchemaMigrations({ env: stateDatabaseEnv }).length > 0) {
			const repaired = repairOpenClawStateDatabaseSchema({ env: stateDatabaseEnv });
			warnings.push(...repaired.warnings);
			if (repaired.warnings.length > 0) return {
				changes,
				warnings
			};
			changes.push(...repaired.changes.map((change) => change.replace(/^Migrated shared state /, "Migrated Voice Call SQLite ").replaceAll("→", "->")));
		}
		if (entries.length === 0) return {
			changes,
			warnings
		};
		const env = stateDatabaseEnv;
		const imported = await importLegacyCallRecords({
			entries,
			eventStore: params.context.openPluginStateKeyedStore({
				namespace: CALL_RECORD_EVENTS_NAMESPACE,
				maxEntries: CALL_RECORD_EVENT_META_MAX_ENTRIES,
				env
			}),
			chunkStore: params.context.openPluginStateKeyedStore({
				namespace: CALL_RECORD_EVENT_CHUNKS_NAMESPACE,
				maxEntries: CALL_RECORD_CHUNK_MAX_ENTRIES,
				env
			}),
			warnings
		});
		if (imported > 0) changes.push(`Migrated ${imported} Voice Call call-log ${imported === 1 ? "record" : "records"} -> plugin state`);
		if (warnings.some((warning) => warning.startsWith("Failed migrating Voice Call") || warning.startsWith("Skipped malformed Voice Call call-log line") || warning.startsWith("Skipped Voice Call call-log line") || warning.startsWith("Skipped Voice Call call-log migration"))) {
			warnings.push("Left Voice Call call-log source in place because migration was incomplete");
			return {
				changes,
				warnings
			};
		}
		await archiveLegacyStateSource({
			filePath,
			label: "Voice Call call-log",
			changes,
			warnings
		});
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { resolveSessionStoreAgentIds, stateMigrations };
