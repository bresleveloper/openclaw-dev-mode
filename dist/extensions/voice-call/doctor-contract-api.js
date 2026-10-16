import { n as stateMigrations$1 } from "./.setup/state-retention-api-ONgqE-_V.mjs";
import { n as resolveVoiceCallStorePath } from "./.setup/store-path-Cfwff6j7.mjs";
import { normalizeAgentId } from "openclaw/plugin-sdk/routing";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { existsSync } from "node:fs";
//#region extensions/voice-call/doctor-contract-api.ts
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
/** Doctor migrations owned by the voice-call plugin. */
const stateMigrations = [...stateMigrations$1, {
	id: "voice-call-sqlite-schema",
	label: "Voice Call SQLite schema",
	async detectLegacyState(params) {
		const storePath = resolveVoiceCallStorePath(params);
		if (!existsSync(storePath)) return null;
		const { detectOpenClawStateDatabaseSchemaMigrations } = await import("openclaw/plugin-sdk/doctor-repair-runtime");
		const schemaMigrations = detectOpenClawStateDatabaseSchemaMigrations({ env: resolveVoiceCallStateDatabaseEnv(params) });
		if (schemaMigrations.length === 0) return null;
		return { preview: schemaMigrations.map((migration) => `- Voice Call SQLite schema: ${describeVoiceCallSchemaMigration(migration)}`) };
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
		return {
			changes,
			warnings
		};
	}
}];
//#endregion
export { resolveSessionStoreAgentIds, stateMigrations };
