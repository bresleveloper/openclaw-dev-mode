import "./src-CZ2wJvNB.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
//#region src/commands/sqlite-wal-health.ts
/** Render the maintenance owner's recorded warning without probing the database. */
function formatSqliteWalHealthWarning(health) {
	if (!health?.warning) return;
	const bytes = (value) => value === null ? "unknown" : formatByteSize(value, {
		style: "iec",
		maxUnit: "tera",
		separator: " ",
		fractionDigits: 1
	});
	return [
		`checkpoint ${health.state}`,
		`WAL ${bytes(health.walBytes)}`,
		`database ${bytes(health.databaseBytes)}`,
		`frames ${health.checkpointedFrames ?? "unknown"}/${health.logFrames ?? "unknown"} checkpointed`,
		`last complete ${health.lastCompletedAtMs === null ? "never observed" : new Date(health.lastCompletedAtMs).toISOString()}`,
		`${health.consecutiveBlocked} consecutive blocked observations`,
		`observed ${new Date(health.observedAtMs).toISOString()}`,
		...health.error ? [sanitizeTerminalText(health.error)] : [],
		"Restart the Gateway gracefully with openclaw gateway restart; report with openclaw status --deep output."
	].join(" · ");
}
//#endregion
export { formatSqliteWalHealthWarning as t };
