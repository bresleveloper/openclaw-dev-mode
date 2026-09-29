import { a as resolveGatewayRestartLogPath } from "./restart-logs-DcfskF2f.mjs";
import fs from "node:fs";
//#region src/daemon/restart-storm.ts
/** Detect repeated external CLI restarts across Gateway process lifetimes. */
const RESTART_WINDOW_MS = 6e5;
const RESTART_THRESHOLD = 3;
const MAX_HISTORY_BYTES = 131072;
const WARNING_PREFIX = "openclaw gateway restart-storm warning ";
function readGatewayForcedRestartSummary(env) {
	const summary = {
		count: 0,
		windowMs: RESTART_WINDOW_MS
	};
	let fd;
	try {
		fd = fs.openSync(resolveGatewayRestartLogPath(env), fs.constants.O_RDONLY | fs.constants.O_NONBLOCK | fs.constants.O_NOFOLLOW);
		const stat = fs.fstatSync(fd);
		if (!stat.isFile()) return summary;
		const size = stat.size;
		const offset = Math.max(0, size - MAX_HISTORY_BYTES);
		const buffer = Buffer.alloc(Math.min(size, MAX_HISTORY_BYTES));
		const length = fs.readSync(fd, buffer, 0, buffer.length, offset);
		let tail = buffer.toString("utf8", 0, length);
		if (offset > 0) {
			const newline = tail.indexOf("\n");
			tail = newline < 0 ? "" : tail.slice(newline + 1);
		}
		const now = Date.now();
		for (const line of tail.split("\n")) {
			const [, timestampText, body] = /^\[([^\]]+)\] (.*)$/.exec(line) ?? [];
			if (!timestampText || body === void 0) continue;
			const timestamp = Date.parse(timestampText);
			if (!Number.isFinite(timestamp) || timestamp <= now - RESTART_WINDOW_MS || timestamp > now) continue;
			const at = new Date(timestamp).toISOString();
			if (body.startsWith(WARNING_PREFIX)) {
				if (!summary.lastWarningAt || at > summary.lastWarningAt) summary.lastWarningAt = at;
			} else if (/^openclaw gateway lifecycle source=cli action=restart mode=(?:kickstart|bootout)(?: |$)/.test(body)) {
				summary.count += 1;
				if (!summary.lastRestartAt || at > summary.lastRestartAt) summary.lastRestartAt = at;
			}
		}
	} catch {} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
	return summary;
}
/** Emit once per window, retaining the warning in the existing restart log. */
async function warnAboutGatewayRestartStorm(env, warn) {
	let summary = readGatewayForcedRestartSummary(env);
	if (summary.count < RESTART_THRESHOLD || summary.lastWarningAt) return;
	const { findForeignLaunchdJobs } = await import("./launchd-foreign-jobs-_3kXrK8s.mjs");
	const jobs = await findForeignLaunchdJobs(env).catch(() => []);
	summary = readGatewayForcedRestartSummary(env);
	if (summary.count < RESTART_THRESHOLD || summary.lastWarningAt) return;
	const likelyJobs = jobs.filter((job) => job.keepAlive && job.safeToRemove && job.gatewayActions.includes("restart")).map((job) => job.label).toSorted().slice(0, 5);
	const message = [
		`Gateway restart storm: ${summary.count} external CLI restarts in 10 minutes.`,
		likelyJobs.length > 0 ? `Likely stray launchd jobs: ${likelyJobs.join(", ")}.` : "Check for a stray keepalive launchd job invoking openclaw gateway restart.",
		"Run openclaw gateway status to inspect jobs and openclaw doctor --fix to remove eligible stray jobs."
	].join(" ");
	try {
		fs.appendFileSync(resolveGatewayRestartLogPath(env), `[${(/* @__PURE__ */ new Date()).toISOString()}] ${WARNING_PREFIX}${message}\n`, "utf8");
	} catch {}
	warn(message);
}
//#endregion
export { warnAboutGatewayRestartStorm as n, readGatewayForcedRestartSummary as t };
