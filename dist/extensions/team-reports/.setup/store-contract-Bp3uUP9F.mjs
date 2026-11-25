import { z } from "zod";
// extensions/team-reports/src/limits.ts
const MAX_REPORT_BYTES = 2097152;
// extensions/team-reports/src/periods.ts
const DAY_MS = 864e5;
const periodSchema = z.enum([
	"day",
	"week",
	"month"
]);
function dateKey(ms) {
	return new Date(ms).toISOString().slice(0, 10);
}
function parseDay(value) {
	const ms = Date.parse(`${value}T00:00:00.000Z`);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(ms) || dateKey(ms) !== value) throw new Error(`Invalid UTC day: ${value}`);
	return ms;
}
function weekStart(ms) {
	const day = new Date(ms).getUTCDay();
	return parseDay(dateKey(ms)) - (day + 6) % 7 * DAY_MS;
}
function weekKey(ms) {
	const start = weekStart(ms);
	const year = new Date(start + 3 * DAY_MS).getUTCFullYear();
	const first = weekStart(parseDay(`${year}-01-04`));
	return `${year}-W${String(Math.round((start - first) / (7 * DAY_MS)) + 1).padStart(2, "0")}`;
}
function describePeriod(period, value) {
	let ms;
	if (typeof value === "string") {
		if (period === "week" && /^\d{4}-W\d{2}$/.test(value)) {
			ms = weekStart(parseDay(`${value.slice(0, 4)}-01-04`)) + (Number(value.slice(6)) - 1) * 7 * DAY_MS;
			if (weekKey(ms) !== value) throw new Error(`Invalid ISO week: ${value}`);
		} else if (period === "month" && /^\d{4}-\d{2}$/.test(value)) ms = parseDay(`${value}-01`);
		else ms = parseDay(value);
	} else {
		ms = value instanceof Date ? value.getTime() : value;
		if (!Number.isFinite(ms) || !Number.isFinite(new Date(ms).getTime())) throw new Error("Invalid report date");
	}
	if (period === "day") {
		const key = dateKey(ms);
		const sinceMs = parseDay(key);
		return {
			period,
			key,
			sinceMs,
			untilMs: sinceMs + DAY_MS,
			title: `Daily Report ${key}`
		};
	}
	if (period === "week") {
		const key = weekKey(ms);
		const sinceMs = weekStart(ms);
		return {
			period,
			key,
			sinceMs,
			untilMs: sinceMs + 7 * DAY_MS,
			title: `Weekly Report ${key}`
		};
	}
	const key = dateKey(ms).slice(0, 7);
	const sinceMs = parseDay(`${key}-01`);
	const next = new Date(sinceMs);
	next.setUTCMonth(next.getUTCMonth() + 1);
	return {
		period,
		key,
		sinceMs,
		untilMs: next.getTime(),
		title: `Monthly Report ${key}`
	};
}
function periodDayKeys(period, nowMs = period.untilMs) {
	const keys = [];
	const untilMs = Math.min(period.untilMs, nowMs);
	for (let ms = period.sinceMs; ms < untilMs; ms += DAY_MS) keys.push(dateKey(ms));
	return keys;
}
// extensions/team-reports/src/github-item-kinds.ts
const GITHUB_ITEM_KINDS = {
	commit: {
		field: "commits",
		label: "Commit",
		plural: "commits"
	},
	pr_opened: {
		field: "prsOpened",
		label: "PR opened",
		plural: "PRs opened"
	},
	pr_merged: {
		field: "prsMerged",
		label: "PR merged",
		plural: "PRs merged"
	},
	pr_closed: {
		field: "prsClosed",
		label: "PR closed",
		plural: "PRs closed"
	},
	issue_opened: {
		field: "issuesOpened",
		label: "Issue opened",
		plural: "issues opened"
	},
	issue_closed: {
		field: "issuesClosed",
		label: "Issue closed",
		plural: "issues closed"
	},
	issue_comment: {
		field: "issueComments",
		label: "Issue comment",
		plural: "issue comments"
	},
	review_comment: {
		field: "reviewComments",
		label: "Review comment",
		plural: "review comments"
	},
	security_advisory: {
		field: "securityAdvisories",
		label: "Security advisory",
		plural: "security advisories"
	}
};
// extensions/team-reports/src/store-contract.ts
const TEAM_REPORTS_WRITES = /* @__PURE__ */ new Set([
	"resetActivity",
	"appendActivity",
	"upsertPeriod",
	"startRun",
	"finishRun",
	"prune"
]);
export { periodDayKeys as a, describePeriod as i, GITHUB_ITEM_KINDS as n, periodSchema as o, DAY_MS as r, MAX_REPORT_BYTES as s, TEAM_REPORTS_WRITES as t };
