import { p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { randomUUID } from "node:crypto";
//#region src/system-agent/audit.ts
const SYSTEM_AGENT_AUDIT_SCOPE = "system-agent-audit";
const SYSTEM_AGENT_AUDIT_MAX_ENTRIES = 5e4;
const SYSTEM_AGENT_AUDIT_STORE_LABEL = "SQLite diagnostic_events/system-agent-audit state (latest 50000 rows)";
function openSystemAgentAuditStore(env) {
	return createSqliteAuditRecordStore({
		scope: SYSTEM_AGENT_AUDIT_SCOPE,
		maxEntries: SYSTEM_AGENT_AUDIT_MAX_ENTRIES,
		...env ? { env } : {}
	});
}
/** Append one OpenClaw audit entry and return its SQLite owner label. */
async function appendSystemAgentAuditEntry(entry, opts = {}) {
	const record = redactSecrets({
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		...entry
	});
	openSystemAgentAuditStore(opts.env).register(`${record.timestamp}:${randomUUID()}`, record, Date.parse(record.timestamp));
	return SYSTEM_AGENT_AUDIT_STORE_LABEL;
}
//#endregion
export { appendSystemAgentAuditEntry as i, SYSTEM_AGENT_AUDIT_SCOPE as n, SYSTEM_AGENT_AUDIT_STORE_LABEL as r, SYSTEM_AGENT_AUDIT_MAX_ENTRIES as t };
