import path from "node:path";
import { escapeHtml } from "openclaw/plugin-sdk/text-utility-runtime";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
//#region extensions/team-reports/src/render/shared.ts
function metric(label, value, detail = "", trend = "") {
	return `<div class="oc-summary-metric"><span class="oc-summary-metric-copy"><small>${escapeHtml(label)}</small><strong>${escapeHtml(String(value))}</strong>${detail ? `<small>${escapeHtml(detail)}</small>` : ""}${trend}</span></div>`;
}
function renderAvatar(login, display, size) {
	const words = (display.trim() || login).split(/\s+/);
	const initials = (words.length > 1 ? `${Array.from(words[0] ?? "")[0] ?? ""}${Array.from(words.at(-1) ?? "")[0] ?? ""}` : Array.from(words[0] ?? "").slice(0, 2).join("")).toUpperCase();
	const pixels = {
		xs: 20,
		sm: 36,
		md: 40,
		xl: 72
	}[size];
	const image = /^[A-Za-z0-9-]{1,39}$/.test(login) ? `<img src="https://avatars.githubusercontent.com/${escapeHtml(login)}?s=${pixels}" width="${pixels}" height="${pixels}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">` : "";
	return `<span class="oc-avatar oc-avatar-${size}" data-initials="${escapeHtml(initials)}">${image}</span>`;
}
function safeExternalUrl(value) {
	try {
		const url = new URL(value);
		if ((url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password) return url.href;
	} catch {
		return;
	}
}
const ITEM_LABELS = {
	commit: "Commit",
	pr_opened: "PR opened",
	pr_merged: "PR merged",
	pr_closed: "PR closed",
	issue_opened: "Issue opened",
	issue_closed: "Issue closed",
	issue_comment: "Issue comment",
	review_comment: "Review comment",
	security_advisory: "Security advisory"
};
function countDescription(counts) {
	return [
		[counts.commits, "commits"],
		[counts.prsOpened, "PRs opened"],
		[counts.prsMerged, "PRs merged"],
		[counts.prsClosed, "PRs closed"],
		[counts.issuesOpened, "issues opened"],
		[counts.issuesClosed, "issues closed"],
		[counts.issueComments, "issue comments"],
		[counts.reviewComments, "review comments"],
		[counts.securityAdvisories, "security advisories"]
	].filter(([count]) => count > 0).map(([count, label]) => `${count} ${label}`).join(" · ") || "No GitHub activity recorded.";
}
function memberSummary(member) {
	return member.summary?.text ?? (member.github.total + member.discord.total === 0 ? "No GitHub activity or Discord messages recorded in this period." : `${member.github.total} GitHub events and ${member.discord.total} Discord messages recorded in this period.`);
}
//#endregion
//#region extensions/team-reports/src/store.ts
var TeamReportsStore = class {
	constructor(worker) {
		this.worker = worker;
		this.closed = false;
	}
	async execute(type, input, options) {
		if (this.closed) throw new Error("Team Reports store is closed.");
		return this.worker.execute({
			type,
			input
		}, options);
	}
	resetActivity() {
		return this.execute("resetActivity", void 0);
	}
	appendActivity(input) {
		return this.execute("appendActivity", input);
	}
	aggregateActivity(input) {
		return this.execute("aggregateActivity", input);
	}
	aggregatePeriod(input) {
		return this.execute("aggregatePeriod", input);
	}
	upsertPeriod(value) {
		return this.execute("upsertPeriod", value);
	}
	getPeriod(period, key) {
		return this.execute("getPeriod", {
			period,
			key
		});
	}
	getPeriodDocument(period, key) {
		return this.execute("getPeriodDocument", {
			period,
			key
		});
	}
	listPeriods(options = {}) {
		return this.execute("listPeriods", options);
	}
	latestSourceWarnings() {
		return this.execute("latestSourceWarnings", void 0);
	}
	latestPeople() {
		return this.execute("latestPeople", void 0);
	}
	getDayReports(sinceMs, untilMs) {
		return this.execute("getDayReports", {
			sinceMs,
			untilMs
		});
	}
	listPersonDays(login, options = {}) {
		return this.execute("listPersonDays", {
			login,
			options
		});
	}
	listPersonDaysSince(since) {
		return this.execute("listPersonDaysSince", since);
	}
	startRun(run) {
		return this.execute("startRun", run);
	}
	finishRun(id, result) {
		return this.execute("finishRun", {
			id,
			result
		});
	}
	listRuns(limit = 20, filter = {}) {
		return this.execute("listRuns", {
			limit,
			filter
		});
	}
	prune(retentionDays, nowMs = Date.now()) {
		return this.execute("prune", {
			retentionDays,
			nowMs
		});
	}
	close() {
		this.closed = true;
		return this.worker.close();
	}
};
async function createTeamReportsStore(options) {
	const databasePath = options.dbPath ?? path.join(options.stateDir ?? resolveStateDir(), "plugins", "team-reports", "team-reports.sqlite");
	const { openSqliteWorkerStore } = await import("openclaw/plugin-sdk/sqlite-runtime");
	return new TeamReportsStore(await openSqliteWorkerStore({
		moduleUrl: options.workerModuleUrl,
		databasePath,
		input: void 0
	}));
}
//#endregion
export { memberSummary as a, safeExternalUrl as c, countDescription as i, createTeamReportsStore as n, metric as o, ITEM_LABELS as r, renderAvatar as s, TeamReportsStore as t };
