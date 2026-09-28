import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as normalizeUpdateFailureFacts } from "./update-failure-facts-DiyYJNo1.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as formatUpdateFailureFact } from "./update-failure-facts-format-Uhxv535Y.mjs";
//#region src/infra/state-migrations.messages.ts
const STARTUP_MIGRATION_FOLLOW_UP = "Run \"openclaw doctor --fix\" against the same state/config, then restart the gateway.";
function formatStartupMigrationFailure(errors) {
	return [
		"OpenClaw startup migrations did not complete cleanly; refusing to report the gateway ready.",
		...errors.map((error) => `- ${error}`),
		STARTUP_MIGRATION_FOLLOW_UP
	].join("\n");
}
let startupMigrationWarning;
/** The running Gateway owns this boot fact; status and Doctor must not rerun migrations to infer it. */
function recordStartupMigrationWarnings(warnings) {
	if (warnings.length === 0) return;
	const details = sanitizeTerminalText(redactSensitiveText([...new Set(warnings)].map((warning) => `- ${warning}`).join("\n"), { mode: "tools" }));
	const summary = `${truncateWithMarker(details, 2e3, {
		marker: "… (see startup log)",
		reserve: 20,
		trimEnd: true
	})}\n${STARTUP_MIGRATION_FOLLOW_UP}`;
	if (startupMigrationWarning !== summary) {
		startupMigrationWarning = summary;
		createSubsystemLogger("state-migrations").warn(`Startup migration warnings; continuing with degraded state.\n${details}\n${STARTUP_MIGRATION_FOLLOW_UP}`);
	}
}
function readStartupMigrationWarning(includeSensitive = true) {
	return startupMigrationWarning && (includeSensitive ? startupMigrationWarning : `Startup migrations need attention. ${STARTUP_MIGRATION_FOLLOW_UP}`);
}
function mergeNotices(sources) {
	return [...new Set(sources.flatMap((source) => source?.notices ? [...source.notices] : []))];
}
function createLegacyStateMigrationStepReceipt(step, result) {
	const refused = result.warnings.length > 0 && result.warningDisposition !== "recoverable";
	return {
		...step,
		outcome: refused ? "refused" : result.outcome ? result.outcome : result.warnings.length > 0 ? "warning" : result.changes.length > 0 ? "completed" : "skipped",
		changes: result.changes,
		warnings: result.warnings,
		...result.deferred?.length ? { deferred: result.deferred } : {},
		...result.sqliteFamilies?.length ? { sqliteFamilies: result.sqliteFamilies } : {},
		...result.refusedAgentDatabasePaths?.length ? { refusedAgentDatabasePaths: result.refusedAgentDatabasePaths } : {},
		...result.recoveredAgentDatabasePaths?.length ? { recoveredAgentDatabasePaths: result.recoveredAgentDatabasePaths } : {},
		...result.notices?.length ? { notices: result.notices } : {},
		...result.rehearsal ? { rehearsal: result.rehearsal } : {},
		...refused ? { refusal: step.refusal ?? {
			code: result.refusedAgentDatabasePaths?.length ? "agent-database-ownership-mismatch" : "step-refused",
			message: result.warnings.join("\n")
		} } : {}
	};
}
var DoctorStateMigrationRefusalError = class extends Error {
	constructor(stepReceipts) {
		const refused = stepReceipts.filter((receipt) => receipt.outcome === "refused");
		const isBlocked = (receipt) => receipt.refusal?.code === "blocked-by-prior-refusal" || receipt.refusal?.code === "blocked-by-agent-database-refusal";
		const failureFacts = normalizeUpdateFailureFacts(refused.toSorted((left, right) => Number(isBlocked(left)) - Number(isBlocked(right))).flatMap((receipt) => receipt.refusal ? [{
			check: receipt.id,
			code: receipt.refusal.code,
			message: receipt.refusal.message
		}] : []));
		const onlyAgentOwnershipRefusals = refused.length > 0 && refused.every((receipt) => receipt.refusal?.code === "agent-database-ownership-mismatch" || receipt.refusal?.code === "blocked-by-agent-database-refusal");
		super([onlyAgentOwnershipRefusals ? "Doctor stopped because an agent database ownership mismatch remains. Independent state repairs were run; repairs requiring the refused database were skipped. Resolve the reported ownership mismatch before retrying." : "Doctor stopped because a state migration refused to continue. Resolve the reported migration failure before retrying. Later repairs were not run.", ...failureFacts.map(formatUpdateFailureFact)].join("\n"));
		this.name = "DoctorStateMigrationRefusalError";
		this.stepReceipts = [...stepReceipts];
		this.failureFacts = failureFacts;
	}
};
/** Call after the writer closes its receipts, never from its per-step callback. */
function throwIfDoctorStateMigrationRefused(stepReceipts = []) {
	if (stepReceipts.some((receipt) => receipt.outcome === "refused")) throw new DoctorStateMigrationRefusalError(stepReceipts);
}
function logStateMigrationResult(result, logger = createSubsystemLogger("state-migrations")) {
	for (const [key, title, level] of [
		[
			"changes",
			"Auto-migrated legacy state",
			"info"
		],
		[
			"warnings",
			"Legacy state migration warnings",
			"warn"
		],
		[
			"notices",
			"Legacy state migration notes",
			"info"
		]
	]) if (result[key]?.length) logger[level](`${title}:\n${result[key].map((entry) => `- ${entry}`).join("\n")}`);
}
//#endregion
export { mergeNotices as a, throwIfDoctorStateMigrationRefused as c, logStateMigrationResult as i, createLegacyStateMigrationStepReceipt as n, readStartupMigrationWarning as o, formatStartupMigrationFailure as r, recordStartupMigrationWarnings as s, DoctorStateMigrationRefusalError as t };
