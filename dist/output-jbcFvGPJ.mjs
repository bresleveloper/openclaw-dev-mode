import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { h as redactMigrationPlan } from "./migration-Cf1WpRKe.mjs";
import { log } from "@clack/prompts";
//#region src/commands/migrate/output.ts
function formatCount(value, label) {
	return `${value} ${label}${value === 1 ? "" : "s"}`;
}
function formatPlan(plan, mode) {
	const heading = mode === "preview" ? "Migration preview:" : "Migration plan:";
	const lines = [`${theme.heading(heading)} ${plan.providerId}`, `Source: ${plan.source}`];
	if (plan.target) lines.push(`Target: ${plan.target}`);
	lines.push([
		formatCount(plan.items.length, "item"),
		formatCount(plan.summary.conflicts, "conflict"),
		formatCount(plan.summary.sensitive, "sensitive item")
	].join(", "));
	return [
		...lines,
		...formatPlanItems(plan, mode),
		...formatPlanWarnings(plan, mode === "result" ? plan.nextSteps : void 0)
	];
}
const ITEM_GROUPS = [
	{
		kind: "auth",
		heading: "Auth credentials:"
	},
	{
		kind: "skill",
		heading: "Skills:"
	},
	{
		kind: "plugin",
		heading: "Plugins:"
	},
	{
		kind: "config",
		heading: "Config:"
	},
	{
		kind: "memory",
		heading: "Memory:"
	},
	{
		kind: "secret",
		heading: "Secrets:"
	},
	{
		kind: "archive",
		heading: "Archive:"
	},
	{
		kind: "manual",
		heading: "Manual review:"
	}
];
const KNOWN_KINDS = new Set(ITEM_GROUPS.map((group) => group.kind));
function formatPlanItems(plan, mode) {
	const lines = [];
	const buckets = /* @__PURE__ */ new Map();
	for (const item of plan.items) {
		const kind = KNOWN_KINDS.has(item.kind) ? item.kind : "other";
		const items = buckets.get(kind) ?? [];
		items.push(item);
		buckets.set(kind, items);
	}
	for (const group of [...ITEM_GROUPS, {
		kind: "other",
		heading: "Other:"
	}]) {
		const items = buckets.get(group.kind);
		if (!items || items.length === 0) continue;
		lines.push("");
		lines.push(theme.heading(group.heading));
		for (const item of items) lines.push(formatMigrationItem(item, mode));
	}
	return lines;
}
function formatPlanWarnings(plan, visibleElsewhere = []) {
	const warnings = plan.warnings?.filter((warning) => !visibleElsewhere.includes(warning));
	if (!warnings || warnings.length === 0) return [];
	const lines = ["", theme.warn("Warnings:")];
	for (const warning of warnings) lines.push(`⚠️  ${warning}`);
	return lines;
}
/** Formats a redaction-safe migration preview for terminal output. */
function formatMigrationPreview(plan) {
	return formatPlan(redactMigrationPlan(plan), "preview");
}
/** Formats redaction-safe migration apply results for terminal output. */
function formatMigrationResult(plan) {
	const safePlan = redactMigrationPlan(plan);
	const lines = formatPlan(safePlan, "result");
	if (safePlan.nextSteps && safePlan.nextSteps.length > 0) {
		lines.push("");
		lines.push(theme.heading("Next:"));
		for (const step of safePlan.nextSteps) {
			const prefix = safePlan.warnings?.includes(step) ? "⚠️ " : "•";
			lines.push(`${prefix} ${step}`);
		}
	}
	return lines;
}
function formatItemDisplayName(item) {
	return item.id.replace(/^[^:]+:/, "").replace(/:\d+$/, "");
}
const REASON_CODE_MESSAGES = {
	plugin_missing: "Plugin not found in the Codex marketplace",
	marketplace_missing: "Codex marketplace is unavailable",
	disabled: "Plugin is disabled in Codex",
	refresh_failed: "Failed to refresh the Codex plugin marketplace",
	auth_required: "Plugin requires additional authentication",
	already_active: "Plugin is already active in OpenClaw",
	installed: "Plugin is already installed in OpenClaw",
	plugin_install_failed: "Plugin installation failed",
	codex_subscription_required: "Plugin requires an active Codex subscription",
	"not selected for migration": "Skipped because it was not selected for migration"
};
const MIGRATION_CONFLICT_REASON_PHRASES = {
	"target exists": "already installed in workspace",
	"plugin exists": "already installed in workspace"
};
function conflictReasonSentence(reason) {
	const phrase = MIGRATION_CONFLICT_REASON_PHRASES[reason];
	if (!phrase) return;
	return `${phrase.charAt(0).toUpperCase()}${phrase.slice(1)}`;
}
function humanizeReason(reason) {
	if (!reason) return;
	return REASON_CODE_MESSAGES[reason] ?? conflictReasonSentence(reason) ?? reason;
}
function formatItemMessage(item, mode) {
	const installation = item.kind === "skill" && item.action === "copy" || item.kind === "plugin" && item.action === "install";
	if (item.status === "error" || item.status === "conflict" || item.status === "warning" && (mode === "preview" || !installation) || item.status === "skipped" && mode === "preview") return humanizeReason(item.reason) ?? item.message;
	if (installation) {
		if (mode === "preview") return item.kind === "skill" ? "Copy Codex skill into OpenClaw" : "Install Codex plugin into OpenClaw";
		if (item.status === "migrated") return "Migrated";
		if (item.status === "skipped") return "Skipped";
		if (item.status !== "warning") return;
	}
	return item.message ?? humanizeReason(item.reason);
}
const RESULT_STATUS_GLYPHS = {
	migrated: "✅",
	warning: "⚠️ ",
	error: "❌",
	skipped: "⏭️ ",
	conflict: "⚠️ "
};
function formatItemPrefix(item) {
	if (item.kind === "manual") return "🔍 ";
	if (item.kind === "archive") return "📖 ";
	const glyph = RESULT_STATUS_GLYPHS[item.status];
	if (glyph) return `${glyph} `;
	return "• ";
}
function formatMigrationItem(item, mode) {
	const name = formatItemDisplayName(item);
	const message = formatItemMessage(item, mode);
	const messageSuffix = message ? ` ${theme.muted(`(${message})`)}` : "";
	const sensitive = item.sensitive ? " [sensitive]" : "";
	return `${formatItemPrefix(item)}${name}${sensitive}${messageSuffix}`;
}
/** Throws when a plan still contains conflicts that require explicit overwrite. */
function assertConflictFreePlan(plan, providerId) {
	if (plan.summary.conflicts > 0) throw new Error(`Migration has ${formatCount(plan.summary.conflicts, "conflict")}. Re-run with --overwrite after reviewing openclaw migrate plan ${providerId}.`);
}
/** Writes apply results as redacted JSON or terminal text with backup/report paths. */
function writeApplyResult(runtime, opts, result) {
	if (opts.json) {
		writeRuntimeJson(runtime, redactMigrationPlan(result));
		return;
	}
	log.message(formatMigrationResult(result).join("\n"));
	if (result.backupPath) runtime.log(`Backup: ${result.backupPath}`);
	else if (!opts.noBackup) runtime.log("Backup: skipped (no existing OpenClaw state found)");
	if (result.reportDir) runtime.log(`Report: ${result.reportDir}`);
}
/** Throws when apply completed with conflicts or errors. */
function assertApplySucceeded(result) {
	if (result.summary.errors === 0 && result.summary.conflicts === 0) return;
	const reportHint = result.reportDir ? ` See report: ${result.reportDir}.` : "";
	const failureCount = result.summary.errors > 0 ? formatCount(result.summary.errors, "error") : formatCount(result.summary.conflicts, "conflict");
	throw new Error(`Migration finished with ${failureCount}.${reportHint}`);
}
//#endregion
export { formatMigrationResult as a, formatMigrationPreview as i, assertApplySucceeded as n, writeApplyResult as o, assertConflictFreePlan as r, MIGRATION_CONFLICT_REASON_PHRASES as t };
