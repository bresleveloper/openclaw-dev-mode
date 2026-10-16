import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
//#region src/gateway/control-ui-session-prs-checks.ts
const FAILING_CHECK_CONCLUSIONS = /* @__PURE__ */ new Set([
	"failure",
	"timed_out",
	"cancelled",
	"action_required",
	"startup_failure"
]);
const PAGE_SIZE = 100;
const MAX_PAGES = 10;
const PAGE_BYTES = 1048576;
const MAX_ACTIONS_SUITES = 20;
const MAX_STEPS = 200;
function sessionPullRequestCheckState(status, conclusion) {
	if (typeof conclusion === "string" && FAILING_CHECK_CONCLUSIONS.has(conclusion)) return "failed";
	if (status !== "completed" || conclusion === "stale") return "running";
	return conclusion === "skipped" ? "skipped" : "passed";
}
function sessionPullRequestRepositoryApiUrl(target) {
	return `${target.apiBaseUrl}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
}
function incomplete() {
	return new gitHubPublicApi.ControlUiGitHubError(502, "GitHub CI details were incomplete or changed while loading");
}
/** One bounded pagination owner serves both the compact rollup and on-demand detail. */
async function fetchSessionPullRequestCheckRuns(target, request) {
	return fetchPages(`${sessionPullRequestRepositoryApiUrl(target)}/commits/${target.headSha}/check-runs?filter=latest`, "check_runs", request);
}
async function fetchPages(url, field, request) {
	const rows = [];
	let expected;
	for (let page = 1; page <= MAX_PAGES; page += 1) {
		const value = await request(`${url}&per_page=${PAGE_SIZE}&page=${page}`, PAGE_BYTES);
		if (!isRecord(value)) throw incomplete();
		const items = value[field];
		const total = value.total_count;
		if (!Array.isArray(items) || items.length > PAGE_SIZE || typeof total !== "number" || !Number.isSafeInteger(total) || total < 0 || total > 1e3 || expected !== void 0 && expected !== total) throw incomplete();
		expected = total;
		for (const item of items) {
			if (!isRecord(item)) throw incomplete();
			rows.push(item);
		}
		if (rows.length === total) return rows;
		if (rows.length > total || items.length < PAGE_SIZE) throw incomplete();
	}
	throw incomplete();
}
async function fetchSessionPullRequestCheckRollup(item, request) {
	if (!item.headSha || !/^[0-9a-f]{40}$/i.test(item.headSha)) return;
	const runs = await fetchSessionPullRequestCheckRuns({
		...item,
		headSha: item.headSha
	}, request);
	if (runs.length === 0) return;
	const counts = {
		passed: 0,
		failed: 0,
		skipped: 0,
		running: 0
	};
	for (const run of runs) counts[sessionPullRequestCheckState(run.status, run.conclusion)] += 1;
	return {
		state: counts.failed > 0 ? "failing" : counts.running > 0 ? "pending" : "passing",
		...counts
	};
}
function positiveId(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) throw incomplete();
	return value;
}
function text(value, max = 512) {
	const result = readNonBlankString(value);
	if (!result || result.length > max) throw incomplete();
	return result;
}
function timing(value) {
	const timestamp = (raw) => {
		if (raw === null || raw === void 0) return;
		const date = text(raw, 40);
		if (!Number.isFinite(Date.parse(date))) throw incomplete();
		return date;
	};
	return {
		startedAt: timestamp(value.started_at),
		completedAt: timestamp(value.completed_at)
	};
}
function readConclusion(value) {
	return value === null || value === void 0 ? void 0 : text(value, 64);
}
function safeCheckLink(value) {
	if (typeof value !== "string" || value.length > 2048) return;
	const url = URL.parse(value);
	return url?.protocol === "https:" && !url.username && !url.password ? url.href : void 0;
}
function parseChecks(rows, target) {
	const ids = /* @__PURE__ */ new Set();
	return rows.map((row) => {
		const id = positiveId(row.id);
		if (ids.has(id) || row.head_sha !== target.headSha) throw incomplete();
		ids.add(id);
		const source = isRecord(row.app) && row.app.slug === "github-actions" ? "actions" : "check";
		const status = text(row.status, 64);
		const result = readConclusion(row.conclusion);
		return {
			check: {
				id,
				name: text(row.name),
				status,
				conclusion: result,
				state: sessionPullRequestCheckState(status, result),
				source,
				detailsUrl: safeCheckLink(row.details_url ?? row.html_url),
				...timing(row)
			},
			...source === "actions" && isRecord(row.check_suite) ? { suiteId: positiveId(row.check_suite.id) } : {}
		};
	});
}
function parseSteps(value) {
	if (!Array.isArray(value) || value.length > MAX_STEPS) throw incomplete();
	const numbers = /* @__PURE__ */ new Set();
	return value.map((step) => {
		if (!isRecord(step)) throw incomplete();
		const number = positiveId(step.number);
		if (numbers.has(number)) throw incomplete();
		numbers.add(number);
		return {
			number,
			name: text(step.name),
			status: text(step.status, 64),
			conclusion: readConclusion(step.conclusion),
			...timing(step)
		};
	}).toSorted((left, right) => left.number - right.number);
}
async function loadSuiteJobs(target, suiteId, checks, request) {
	const base = sessionPullRequestRepositoryApiUrl(target);
	const runs = await fetchPages(`${base}/actions/runs?head_sha=${target.headSha}&check_suite_id=${suiteId}`, "workflow_runs", request);
	if (runs.length !== 1 || runs[0]?.check_suite_id !== suiteId || runs[0]?.head_sha !== target.headSha) throw incomplete();
	const runId = positiveId(runs[0].id);
	const attempt = runs[0].run_attempt === void 0 ? void 0 : positiveId(runs[0].run_attempt);
	const jobs = await fetchPages(`${base}/actions/runs/${runId}/jobs?filter=all`, "jobs", request);
	const wanted = new Map(checks.filter((row) => row.suiteId === suiteId).map(({ check }) => [`${base}/check-runs/${check.id}`.toLowerCase(), check]));
	const result = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		if (job.run_id !== runId || job.head_sha !== target.headSha || job.run_attempt !== void 0 && attempt !== void 0 && positiveId(job.run_attempt) > attempt) throw incomplete();
		const check = typeof job.check_run_url === "string" ? wanted.get(job.check_run_url.toLowerCase()) : void 0;
		if (!check) continue;
		if (result.has(check.id)) throw incomplete();
		const jobId = positiveId(job.id);
		const status = text(job.status, 64);
		const verdict = readConclusion(job.conclusion);
		result.set(check.id, {
			...check,
			status,
			conclusion: verdict,
			state: sessionPullRequestCheckState(status, verdict),
			...timing(job),
			detailsUrl: `https://${target.host}/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/actions/runs/${runId}/job/${jobId}`,
			steps: parseSteps(job.steps ?? [])
		});
	}
	if ([...wanted.values()].some((check) => check.state !== "skipped" && !result.has(check.id))) throw incomplete();
	return result;
}
/** Checks remain useful when Actions permissions, history, or the bounded detail budget fail. */
async function fetchSessionPullRequestCheckDetails(target, request) {
	const rows = parseChecks(await fetchSessionPullRequestCheckRuns(target, request), target);
	const priority = {
		failed: 0,
		running: 1,
		passed: 2,
		skipped: 3
	};
	const compareChecks = (a, b) => priority[a.state] - priority[b.state] || a.name.localeCompare(b.name) || a.id - b.id;
	const orderedRows = rows.toSorted((a, b) => compareChecks(a.check, b.check));
	const suites = [...new Set(orderedRows.filter(({ check }) => check.source === "actions" && check.state !== "skipped").map(({ suiteId }) => suiteId))];
	let error;
	const details = /* @__PURE__ */ new Map();
	for (const suite of suites.slice(0, MAX_ACTIONS_SUITES)) try {
		if (suite === void 0) throw incomplete();
		const jobs = await loadSuiteJobs(target, suite, rows, request);
		for (const [id, check] of jobs) details.set(id, check);
	} catch (failure) {
		error = failure;
		if (failure instanceof gitHubPublicApi.ControlUiGitHubError && failure.statusCode === 429) break;
	}
	if (suites.length > MAX_ACTIONS_SUITES && !error) error = new gitHubPublicApi.ControlUiGitHubError(502, "Some Actions steps exceeded the CI detail limit; open the job on GitHub");
	if (suites.length > 0 && !error) {
		const latest = parseChecks(await fetchSessionPullRequestCheckRuns(target, request), target);
		const identity = (values) => values.map(({ check, suiteId }) => `${check.id}:${suiteId ?? ""}`).toSorted().join(",");
		if (identity(latest) !== identity(rows)) throw new gitHubPublicApi.ControlUiGitHubError(409, "CI jobs were rerun while loading; reopen CI details");
	}
	return {
		checks: orderedRows.map(({ check }) => details.get(check.id) ?? check).toSorted(compareChecks),
		error
	};
}
//#endregion
export { fetchSessionPullRequestCheckRollup as n, sessionPullRequestRepositoryApiUrl as r, fetchSessionPullRequestCheckDetails as t };
