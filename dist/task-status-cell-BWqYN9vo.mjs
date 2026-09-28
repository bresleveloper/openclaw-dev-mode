import { r as theme } from "./theme-DzaUZY4q.mjs";
function formatTaskStatusCell(status, rich) {
	const padded = status.padEnd(10);
	if (!rich) return padded;
	if (status === "succeeded") return theme.success(padded);
	if (status === "failed" || status === "lost" || status === "timed_out") return theme.error(padded);
	if (status === "running") return theme.accentBright(padded);
	if (status === "blocked") return theme.warn(padded);
	return theme.muted(padded);
}
//#endregion
export { formatTaskStatusCell as t };
