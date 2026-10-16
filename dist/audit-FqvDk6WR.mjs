import { p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { n as registerSqliteAuditRecordAsync } from "./sqlite-audit-record-store.async-1lh-4o2u.mjs";
import { randomUUID } from "node:crypto";
//#region src/system-agent/audit.ts
const SYSTEM_AGENT_AUDIT_SCOPE = "system-agent-audit";
const SYSTEM_AGENT_AUDIT_MAX_ENTRIES = 5e4;
const SYSTEM_AGENT_AUDIT_STORE_LABEL = "SQLite diagnostic_events/system-agent-audit state (latest 50000 rows)";
/** Append one OpenClaw audit entry and return its SQLite owner label. */
async function appendSystemAgentAuditEntry(entry, opts = {}) {
	const record = redactSecrets({
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		...entry
	});
	await registerSqliteAuditRecordAsync({
		scope: SYSTEM_AGENT_AUDIT_SCOPE,
		maxEntries: SYSTEM_AGENT_AUDIT_MAX_ENTRIES,
		env: opts.env
	}, {
		key: `${record.timestamp}:${randomUUID()}`,
		value: record,
		createdAt: Date.parse(record.timestamp)
	});
	return SYSTEM_AGENT_AUDIT_STORE_LABEL;
}
//#endregion
export { appendSystemAgentAuditEntry as i, SYSTEM_AGENT_AUDIT_SCOPE as n, SYSTEM_AGENT_AUDIT_STORE_LABEL as r, SYSTEM_AGENT_AUDIT_MAX_ENTRIES as t };
