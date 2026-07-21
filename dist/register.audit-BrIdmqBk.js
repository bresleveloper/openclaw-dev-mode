import { n as truncateUtf16Safe } from "./utf16-slice-fWbEI5Oy.js";
import { P as timestampMsToIsoString, b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as sanitizeTerminalText } from "./safe-text-Bkz4mOfI.js";
import { c as callGateway } from "./call-5Sj7eTyY.js";
import { n as runCommandWithRuntime } from "./cli-utils-mnoUlc_o.js";
//#region src/commands/audit.ts
/** Operator CLI for bounded metadata-only run/tool audit pages. */
const DEFAULT_AUDIT_LIMIT = 100;
const MAX_AUDIT_LIMIT = 500;
function parseAuditTimestamp(value, flag) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	if (/^\d+$/.test(trimmed)) {
		const parsed = Number(trimmed);
		if (Number.isSafeInteger(parsed)) return parsed;
	}
	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed)) return parsed;
	throw new Error(`${flag} must be an ISO timestamp or Unix milliseconds.`);
}
function parseAuditLimit(value) {
	if (!value) return DEFAULT_AUDIT_LIMIT;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 || parsed > MAX_AUDIT_LIMIT) throw new Error(`--limit must be between 1 and ${MAX_AUDIT_LIMIT}.`);
	return parsed;
}
function short(value, maxChars) {
	if (!value) return "-";
	const sanitized = sanitizeTerminalText(value);
	if (!sanitized) return "-";
	return sanitized.length <= maxChars ? sanitized : `${truncateUtf16Safe(sanitized, maxChars - 1)}…`;
}
function formatAuditRows(events) {
	const rows = ["TIME	KIND	STATUS	AGENT	RUN	ACTION"];
	for (const event of events) rows.push([
		timestampMsToIsoString(event.occurredAt) ?? String(event.occurredAt),
		event.kind,
		event.status,
		short(event.agentId, 18),
		short(event.runId, 18),
		event.toolName ? `${event.action}:${short(event.toolName, 28)}` : event.action
	].join("	"));
	return rows;
}
/** Query one stable page. JSON output is a bounded export with its next cursor. */
async function auditListCommand(options, runtime) {
	const after = parseAuditTimestamp(options.after, "--after");
	const before = parseAuditTimestamp(options.before, "--before");
	if (after !== void 0 && before !== void 0 && after > before) throw new Error("--after must not be later than --before.");
	const result = await callGateway({
		method: "audit.list",
		params: {
			limit: parseAuditLimit(options.limit),
			...options.agentId ? { agentId: options.agentId } : {},
			...options.sessionKey ? { sessionKey: options.sessionKey } : {},
			...options.runId ? { runId: options.runId } : {},
			...options.kind ? { kind: options.kind } : {},
			...options.status ? { status: options.status } : {},
			...after !== void 0 ? { after } : {},
			...before !== void 0 ? { before } : {},
			...options.cursor ? { cursor: options.cursor } : {}
		}
	});
	if (options.json) {
		writeRuntimeJson(runtime, result);
		return;
	}
	for (const row of formatAuditRows(result.events)) runtime.log(row);
	if (result.nextCursor) runtime.log(`More records: --cursor ${result.nextCursor}`);
}
//#endregion
//#region src/cli/program/register.audit.ts
/** Register the bounded operator audit query command. */
function registerAuditCommand(program) {
	program.command("audit").description("Inspect metadata-only agent run and tool action records").option("--agent <id>", "Filter by agent id").option("--session <key>", "Filter by exact session key").option("--run <id>", "Filter by run id").option("--kind <kind>", "Filter by kind (agent_run or tool_action)").option("--status <status>", "Filter by status (started, succeeded, failed, cancelled, timed_out, blocked, unknown)").option("--after <timestamp>", "Include records at/after ISO time or Unix milliseconds").option("--before <timestamp>", "Include records at/before ISO time or Unix milliseconds").option("--cursor <sequence>", "Continue from a previous result cursor").option("--limit <count>", "Maximum records (1-500)", "100").option("--json", "Output a bounded JSON page", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/audit", "docs.openclaw.ai/cli/audit")}\n`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await auditListCommand({
				agentId: opts.agent,
				sessionKey: opts.session,
				runId: opts.run,
				kind: opts.kind,
				status: opts.status,
				after: opts.after,
				before: opts.before,
				cursor: opts.cursor,
				limit: opts.limit,
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
}
//#endregion
export { registerAuditCommand };
