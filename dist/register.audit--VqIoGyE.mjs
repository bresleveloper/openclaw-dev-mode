import { R as timestampMsToIsoString, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { f as findAuditActivityFilterConflict, i as AUDIT_ACTIVITY_STATUSES, n as AUDIT_ACTIVITY_KINDS, t as AUDIT_ACTIVITY_DIRECTIONS } from "./audit-activity-YfkV8ffO.mjs";
import { a as isExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { t as parseAbsoluteTimeMs } from "./parse-BCmwDHWH.mjs";
import { t as formatHumanList } from "./human-list-Beo_KoiT.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { t as parsePositiveAuditCursor } from "./audit-cursor-x-Oiyo9y.mjs";
//#region src/commands/audit.ts
/** Operator CLI for bounded metadata-only activity audit pages. */
const DEFAULT_AUDIT_LIMIT = 100;
const MAX_AUDIT_LIMIT = 500;
const DEFAULT_AUDIT_DECISION_LIMIT = 50;
const MAX_AUDIT_DECISION_LIMIT = 100;
const MAX_AUDIT_EXECUTION_LIMIT = 50;
function parseAuditTimestamp(value, flag) {
	const trimmed = value?.trim();
	if (trimmed === void 0) return;
	if (/^\d+$/.test(trimmed)) {
		const parsed = Number(trimmed);
		if (Number.isSafeInteger(parsed)) return parsed;
	}
	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed) && parseAbsoluteTimeMs(trimmed) !== null) return parsed;
	throw new Error(`${flag} must be an ISO timestamp or Unix milliseconds.`);
}
function parseAuditLimit(value) {
	if (value === void 0) return DEFAULT_AUDIT_LIMIT;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 || parsed > MAX_AUDIT_LIMIT) throw new Error(`--limit must be between 1 and ${MAX_AUDIT_LIMIT}.`);
	return parsed;
}
function parseAuditDecisionLimit(value) {
	if (value === void 0) return DEFAULT_AUDIT_DECISION_LIMIT;
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 || parsed > MAX_AUDIT_DECISION_LIMIT) throw new Error(`--limit must be between 1 and ${String(MAX_AUDIT_DECISION_LIMIT)} with --explain.`);
	return parsed;
}
function short(value, maxChars) {
	if (!value) return "-";
	const sanitized = sanitizeTerminalText(value);
	if (!sanitized) return "-";
	return sanitized.length <= maxChars ? sanitized : `${truncateUtf16Safe(sanitized, maxChars - 1)}…`;
}
function formatAuditRows(events) {
	const rows = ["TIME	KIND	DIRECTION	CHANNEL	STATUS	AGENT	RUN	ACTION"];
	for (const event of events) rows.push([
		timestampMsToIsoString(event.occurredAt) ?? String(event.occurredAt),
		event.kind,
		short(event.direction, 10),
		short(event.channel, 18),
		event.status,
		short(event.agentId, 18),
		short(event.runId, 18),
		event.toolName ? `${event.action}:${short(event.toolName, 28)}` : event.action
	].join("	"));
	return rows;
}
function isUnsupportedActivityMethodError(value) {
	return value instanceof Error && value.name === "GatewayClientRequestError" && value.gatewayCode === "INVALID_REQUEST" && (value.message === "unknown method: audit.activity.list" || value.message === "missing scope: operator.admin");
}
function isUnsupportedRunInspectMethodError(value) {
	return value instanceof Error && value.name === "GatewayClientRequestError" && value.gatewayCode === "INVALID_REQUEST" && (value.message === "unknown method: audit.run.inspect" || value.message === "missing scope: operator.admin");
}
function hasMessageSpecificFilters(options) {
	return options.kind === "message" || options.direction !== void 0 || options.channel !== void 0;
}
function validateAuditFilter(value, flag, allowed) {
	if (value !== void 0 && !allowed.includes(value)) throw new Error(`${flag} must be ${formatHumanList(allowed)}.`);
}
const AUDIT_FILTER_FLAGS = {
	sessionKey: "--session",
	direction: "--direction",
	channel: "--channel"
};
function validateAuditFilterCombination(options) {
	const conflict = findAuditActivityFilterConflict(options);
	if (!conflict) return;
	const flag = AUDIT_FILTER_FLAGS[conflict.field];
	if (conflict.type === "kind") throw new Error(`${flag} only applies to --kind ${formatHumanList(conflict.supportedKinds)}.`);
	throw new Error(`${flag} cannot be combined with ${AUDIT_FILTER_FLAGS[conflict.conflictingField]}.`);
}
function formatAuditGatewayError(error) {
	if (isExpectedCliError(error)) return error;
	const message = formatErrorMessage(error);
	return new Error(message === "invalid audit.activity.list range or cursor" ? "--cursor must be a continuation token returned by a previous audit result." : message);
}
function toLegacyAuditListParams(params) {
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.runId ? { runId: params.runId } : {},
		...params.kind === "agent_run" || params.kind === "tool_action" ? { kind: params.kind } : {},
		...params.status ? { status: params.status } : {},
		...params.after !== void 0 ? { after: params.after } : {},
		...params.before !== void 0 ? { before: params.before } : {},
		...params.limit !== void 0 ? { limit: params.limit } : {},
		...params.cursor ? { cursor: params.cursor } : {}
	};
}
async function queryAuditActivity(params, options) {
	try {
		return await callGateway({
			method: "audit.activity.list",
			params
		});
	} catch (error) {
		if (!isUnsupportedActivityMethodError(error)) throw formatAuditGatewayError(error);
		if (hasMessageSpecificFilters(options)) throw new Error("The connected Gateway does not support message audit filters. Upgrade the Gateway to use --kind message, --direction, or --channel.", { cause: error });
		return await callGateway({
			method: "audit.list",
			params: toLegacyAuditListParams(params)
		});
	}
}
function unsupportedRunInspection(selector) {
	const missingEvidence = ["identity.context"];
	return {
		schemaVersion: 1,
		run: {
			...selector,
			status: "unknown"
		},
		identity: {
			state: "unsupported",
			reasonCode: "gateway_upgrade_required",
			missingEvidence,
			remediation: [{
				code: "upgrade_gateway",
				text: "Upgrade the Gateway, run the agent again, and repeat this exact-run inspection."
			}]
		},
		decisionDisplays: [],
		coverage: {
			state: "unsupported",
			missingEvidence
		}
	};
}
async function queryAuditRunInspection(params) {
	try {
		return await callGateway({
			method: "audit.run.inspect",
			params
		});
	} catch (error) {
		if (!isUnsupportedRunInspectMethodError(error)) throw formatAuditGatewayError(error);
		return unsupportedRunInspection(typeof params.runId === "string" ? { runId: params.runId } : { executionId: params.executionId });
	}
}
function safe(value) {
	return sanitizeTerminalText(value ?? "") || "-";
}
function principalText(principal) {
	return `${safe(principal.kind)} ${safe(principal.principalRef)} in ${safe(principal.domainRef)}`;
}
function fieldLine(label, state, value) {
	return `  ${label} [${safe(state)}]${value ? `: ${safe(value)}` : ""}`;
}
const IDENTITY_FIELD_LABELS = [
	"Trust domain",
	"Invoker",
	"Ingress",
	"Agent principal",
	"Agent definition",
	"Runtime instance",
	"Represented subject",
	"Sponsor",
	"Applicable grants",
	"Assurance"
];
function contextIdentityLines(context) {
	const grants = context.applicableGrants.map((grant) => `${grant.grantRef} [${grant.state}]`);
	const assurance = context.assurance.map((item) => `${item.kind} ${item.evidenceRef} [${item.strength}]`);
	return [
		fieldLine("Trust domain", context.trustDomain.state, `${context.trustDomain.kind} ${context.trustDomain.domainRef}`),
		fieldLine("Invoker", context.invoker.state, context.invoker.principal ? principalText(context.invoker.principal) : void 0),
		fieldLine("Ingress", context.ingress.state, `${context.ingress.kind} at ${context.ingress.boundary}${context.ingress.sourceRef ? ` (${context.ingress.sourceRef})` : ""}`),
		fieldLine("Agent principal", "present", principalText(context.agentPrincipal)),
		fieldLine("Agent definition", context.agentDefinition.state, `${context.agentDefinition.definitionRef}${context.agentDefinition.revisionRef ? ` @ ${context.agentDefinition.revisionRef}` : ""}`),
		fieldLine("Runtime instance", context.runtimeInstance.state, `${context.runtimeInstance.kind} ${context.runtimeInstance.runtimeRef}`),
		fieldLine("Represented subject", context.representedSubject?.state ?? "absent", context.representedSubject ? principalText(context.representedSubject.principal) : void 0),
		fieldLine("Sponsor", context.sponsor?.state ?? "absent", context.sponsor ? principalText(context.sponsor.principal) : void 0),
		fieldLine("Applicable grants", grants.length > 0 ? "present" : "absent", grants.join(", ")),
		fieldLine("Assurance", assurance.length > 0 ? "present" : "absent", assurance.join(", "))
	];
}
function contextLineageLines(context) {
	const lineage = context.lineage;
	if (!lineage) return [fieldLine("Parent", "absent")];
	return [
		fieldLine("Parent context", lineage.parentContextId ? "present" : "unknown", lineage.parentContextId),
		fieldLine("Parent execution", lineage.parentExecutionId ? "present" : "unknown", lineage.parentExecutionId),
		fieldLine("Parent run", lineage.parentRunId ? "present" : "unknown", lineage.parentRunId),
		fieldLine("Parent agent", lineage.parentAgentPrincipal ? "present" : "unknown", lineage.parentAgentPrincipal ? principalText(lineage.parentAgentPrincipal) : void 0),
		fieldLine("Delegation", lineage.delegationRef ? "present" : "unknown", lineage.delegationRef),
		fieldLine("Depth", "present", String(lineage.depth))
	];
}
function unavailableIdentityLines(state) {
	return IDENTITY_FIELD_LABELS.map((label) => fieldLine(label, state));
}
function decisionLines(receipt) {
	const evidence = receipt.provenance.state === "unverified" ? "producer display contract unverified; receipt prose omitted" : receipt.provenance.producer === "run-admission" ? "admission provenance only; no enforcement decision" : receipt.enforcement.coverageState === "unknown" || receipt.enforcement.coverageState === "unsupported" ? "evidence unavailable or corrupt; do not infer authorization" : receipt.provenance.producer === "operator-approval" ? "authoritative owner-native SQLite record; retained 30 days" : receipt.enforcement.coverageState === "enforced" ? "validated immutable decision fact; retained 30 days" : "attribution record only; no enforcement decision";
	const producer = receipt.provenance.state === "verified" ? receipt.provenance.producer : "unverified";
	return [
		`  ${safe(receipt.action.family)}.${safe(receipt.action.operation)}: ${safe(receipt.decision.outcome)}`,
		`    Coverage: ${safe(receipt.enforcement.coverageState)}`,
		`    Reason: ${safe(receipt.decision.reasonCode)}`,
		`    Display producer: ${safe(producer)}`,
		`    Evidence: ${evidence}`,
		`    Policy refs: ${receipt.enforcement.policyCount}`,
		`    Grant refs: ${receipt.enforcement.grantCount}`,
		`    Context used: ${receipt.enforcement.contextFieldsUsed.length > 0 ? receipt.enforcement.contextFieldsUsed.map(safe).join(", ") : "none"}`,
		...receipt.action.summary ? [`    Summary: ${safe(receipt.action.summary)}`] : []
	];
}
function formatAuditRunInspection(result) {
	const decisionDisplays = result.decisionDisplays;
	const lines = [
		`${result.run.executionId ? `Execution ${safe(result.run.executionId)}${result.run.runId ? ` (run ${safe(result.run.runId)})` : ""}` : `Run ${safe(result.run.runId)}`}: ${safe(result.run.status)} (${safe(result.coverage.state)})`,
		"",
		"Identity"
	];
	if (result.identity.state === "present") {
		const identityLines = contextIdentityLines(result.identity.context);
		lines.push(`  Context: ${safe(result.identity.context.contextId)}`, `  Created: ${timestampMsToIsoString(result.identity.context.createdAt) ?? String(result.identity.context.createdAt)}`, ...identityLines.slice(0, 8), "", "Authority", ...identityLines.slice(8), "", "Lineage", ...contextLineageLines(result.identity.context));
	} else if (result.identity.state === "ambiguous") lines.push(`  Reason: ${safe(result.identity.reasonCode)}`, ...result.identity.candidates.map((candidate) => `  Candidate: ${safe(candidate.executionId)} (context ${safe(candidate.contextId)}, ${timestampMsToIsoString(candidate.createdAt) ?? String(candidate.createdAt)})`), "", "Authority", fieldLine("Selection", "unknown"), "", "Lineage", fieldLine("Parent", "unknown"));
	else lines.push(`  Reason: ${safe(result.identity.reasonCode)}`, ...unavailableIdentityLines(result.identity.state).slice(0, 8), "", "Authority", ...unavailableIdentityLines(result.identity.state).slice(8), "", "Lineage", fieldLine("Parent", result.identity.state));
	lines.push("", "Decisions");
	if (decisionDisplays.length === 0) lines.push("  none [absent]");
	else for (const receipt of decisionDisplays) lines.push(...decisionLines(receipt));
	lines.push("", "Missing evidence");
	lines.push(...result.coverage.missingEvidence.length > 0 ? result.coverage.missingEvidence.map((item) => `  - ${safe(item)}`) : ["  none"]);
	const remediation = [...result.identity.state === "present" ? [] : result.identity.remediation, ...decisionDisplays.flatMap((decision) => decision.remediation)];
	lines.push("", "Next steps");
	lines.push(...remediation.length > 0 ? [...new Map(remediation.map((item) => [item.code, item])).values()].map((item) => `  - ${safe(item.text)}`) : ["  none"]);
	if (result.nextDecisionCursor) lines.push(`  More decisions: --cursor ${safe(result.nextDecisionCursor)}`);
	if (result.nextExecutionCursor) lines.push(`  More executions: --cursor ${safe(result.nextExecutionCursor)}`);
	return lines;
}
function hasExplainIncompatibleFilters(options) {
	return Boolean(options.agentId || options.sessionKey || options.kind || options.status || options.direction || options.channel || options.after || options.before);
}
/** Query one stable page. JSON output is a bounded export with its next cursor. */
async function auditListCommand(options, runtime) {
	if (options.explain) {
		const runId = options.runId?.trim();
		const executionId = options.executionId?.trim();
		if (Boolean(runId) === Boolean(executionId)) throw new Error("Pass exactly one of --run <id> or --execution <id> with --explain.");
		if (hasExplainIncompatibleFilters(options)) throw new Error("--explain accepts only --run or --execution, plus --limit, --cursor, and --json; remove activity-list filters.");
		const decisionLimit = parseAuditDecisionLimit(options.limit);
		const cursor = options.cursor;
		const numericCursor = parsePositiveAuditCursor(cursor);
		const runExecutionCursor = numericCursor !== void 0 && numericCursor !== null ? cursor : void 0;
		const decisionPage = {
			decisionLimit,
			...cursor ? { decisionCursor: cursor } : {}
		};
		const result = await queryAuditRunInspection(executionId ? {
			executionId,
			...decisionPage
		} : {
			runId,
			executionLimit: Math.min(decisionLimit, MAX_AUDIT_EXECUTION_LIMIT),
			...runExecutionCursor ? { executionCursor: runExecutionCursor } : {},
			...decisionPage
		});
		if (options.json) {
			writeRuntimeJson(runtime, result);
			return;
		}
		for (const line of formatAuditRunInspection(result)) runtime.log(line);
		return;
	}
	if (options.executionId) throw new Error("--execution requires --explain.");
	validateAuditFilter(options.kind, "--kind", AUDIT_ACTIVITY_KINDS);
	validateAuditFilter(options.status, "--status", AUDIT_ACTIVITY_STATUSES);
	validateAuditFilter(options.direction, "--direction", AUDIT_ACTIVITY_DIRECTIONS);
	validateAuditFilterCombination(options);
	const after = parseAuditTimestamp(options.after, "--after");
	const before = parseAuditTimestamp(options.before, "--before");
	if (after !== void 0 && before !== void 0 && after > before) throw new Error("--after must not be later than --before.");
	const result = await queryAuditActivity({
		limit: parseAuditLimit(options.limit),
		...options.agentId ? { agentId: options.agentId } : {},
		...options.sessionKey ? { sessionKey: options.sessionKey } : {},
		...options.runId ? { runId: options.runId } : {},
		...options.kind ? { kind: options.kind } : {},
		...options.status ? { status: options.status } : {},
		...options.direction ? { direction: options.direction } : {},
		...options.channel ? { channel: options.channel } : {},
		...after !== void 0 ? { after } : {},
		...before !== void 0 ? { before } : {},
		...options.cursor ? { cursor: options.cursor } : {}
	}, options);
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
	program.command("audit").description("Inspect activity records and exact-run identity context").option("--agent <id>", "Filter by agent id").option("--session <key>", "Filter by exact session key").option("--run <id>", "Filter by run id").option("--execution <id>", "Inspect one exact execution id").option("--kind <kind>", `Filter by kind (${formatHumanList(AUDIT_ACTIVITY_KINDS)})`).option("--status <status>", `Filter by status (${formatHumanList(AUDIT_ACTIVITY_STATUSES)})`).option("--direction <direction>", `Filter message direction (${formatHumanList(AUDIT_ACTIVITY_DIRECTIONS)})`).option("--channel <channel>", "Filter message channel").option("--after <timestamp>", "Include records at/after ISO time or Unix milliseconds").option("--before <timestamp>", "Include records at/before ISO time or Unix milliseconds").option("--cursor <sequence>", "Continue from a previous result cursor").option("--limit <count>", "Maximum records (1-500; decisions 1-100)").option("--explain", "Inspect execution identity and run-admission reasoning", false).option("--json", "Output a bounded JSON page", false).addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/audit", "docs.openclaw.ai/cli/audit")}\n`).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			await auditListCommand({
				agentId: opts.agent,
				sessionKey: opts.session,
				runId: opts.run,
				executionId: opts.execution,
				kind: opts.kind,
				status: opts.status,
				direction: opts.direction,
				channel: opts.channel,
				after: opts.after,
				before: opts.before,
				cursor: opts.cursor,
				limit: opts.limit,
				explain: Boolean(opts.explain),
				json: Boolean(opts.json)
			}, defaultRuntime);
		});
	});
}
//#endregion
export { registerAuditCommand };
