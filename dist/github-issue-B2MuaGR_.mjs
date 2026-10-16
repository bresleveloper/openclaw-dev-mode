import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
//#region src/infra/github-issue.ts
/** Prepares and submits bounded issue content to openclaw/openclaw. */
const GITHUB_REPOSITORY = "github.com/openclaw/openclaw";
const GITHUB_REPOSITORY_ISSUES_API = "repos/openclaw/openclaw/issues";
const GITHUB_ISSUE_CREATE_TIMEOUT_MS = 3e4;
const GITHUB_OUTPUT_MAX_BYTES = 1048576;
const GITHUB_ISSUE_BODY_MAX_BYTES = 2e4;
const GITHUB_ISSUE_TITLE_MAX_BYTES = 512;
const GITHUB_PREFILL_URL_MAX_BYTES = 8e3;
const GITHUB_BODY_TRUNCATED_SUFFIX = "\n\n...<truncated>";
const GITHUB_MARKER_RE = /^openclaw-report:[a-f0-9]{64}$/u;
const GITHUB_AUTH_ARGS = [
	"auth",
	"status",
	"--active",
	"--hostname",
	"github.com"
];
const inflightSubmissions = /* @__PURE__ */ new Map();
function boundUtf8(value, maxBytes, suffix) {
	if (Buffer.byteLength(value, "utf8") <= maxBytes) return value;
	const suffixBytes = Buffer.byteLength(suffix, "utf8");
	return `${truncateUtf8Prefix(value, Math.max(0, maxBytes - suffixBytes))}${suffix}`;
}
/** Builds an exact browser fallback when its encoded request stays within a safe bound. */
function prepareGithubIssueBrowserFallback(title, body) {
	const url = `https://github.com/openclaw/openclaw/issues/new?${new URLSearchParams({
		body,
		title
	}).toString()}`;
	if (Buffer.byteLength(url, "utf8") > GITHUB_PREFILL_URL_MAX_BYTES) return {
		reason: "url-too-long",
		status: "unavailable"
	};
	return {
		status: "available",
		url
	};
}
/** Bounds sanitized content and adds the stable marker used for reconciliation. */
function prepareGithubIssue(input) {
	const title = boundUtf8(input.title, GITHUB_ISSUE_TITLE_MAX_BYTES, GITHUB_BODY_TRUNCATED_SUFFIX);
	const boundedBody = boundUtf8(input.body, GITHUB_ISSUE_BODY_MAX_BYTES, GITHUB_BODY_TRUNCATED_SUFFIX);
	const marker = `openclaw-report:${createHash("sha256").update(title).update("\0").update(boundedBody).digest("hex")}`;
	const markerComment = `\n\n<!-- ${marker} -->\n`;
	const body = `${boundUtf8(boundedBody.trimEnd(), GITHUB_ISSUE_BODY_MAX_BYTES - Buffer.byteLength(markerComment, "utf8"), GITHUB_BODY_TRUNCATED_SUFFIX)}${markerComment}`;
	return {
		body,
		browserFallback: prepareGithubIssueBrowserFallback(title, body),
		marker,
		title
	};
}
function browserFallbackResult(issue, reason) {
	return issue.browserFallback.status === "available" ? {
		reason,
		status: "browser-fallback",
		url: issue.browserFallback.url
	} : {
		cause: reason,
		reason: "fallback-url-too-long",
		status: "fallback-unavailable"
	};
}
function issueCreateArgs() {
	return [
		"api",
		"--hostname",
		"github.com",
		"--include",
		"--method",
		"POST",
		GITHUB_REPOSITORY_ISSUES_API,
		"--input",
		"-",
		"--jq",
		".html_url"
	];
}
function issueLookupArgs(marker) {
	return [
		"issue",
		"list",
		"--repo",
		GITHUB_REPOSITORY,
		"--state",
		"all",
		"--search",
		`"${marker}" in:body`,
		"--limit",
		"100",
		"--json",
		"url,title,body"
	];
}
function createdIssueUrl(value) {
	if (typeof value !== "string") return;
	try {
		const url = new URL(value);
		if (url.origin === "https://github.com" && !url.search && !url.hash && /^\/openclaw\/openclaw\/issues\/\d+$/u.test(url.pathname)) return url.toString();
	} catch {}
}
function issueUrlFromOutput(result) {
	return createdIssueUrl(result.stdout.toString("utf8").trim().split(/\r?\n/u).at(-1));
}
function finalApiHttpStatus(result) {
	const matches = [...result.stdout.toString("utf8").matchAll(/^HTTP\/\S+\s+(\d{3})(?:\s|$)/gmu)];
	const status = Number(matches.at(-1)?.[1]);
	return Number.isInteger(status) ? status : void 0;
}
function browserFallbackReason(result) {
	return result.errorCode === "ENOENT" || result.errorCode === "EACCES" || result.errorCode === "EPERM" ? "cli-unavailable" : "authentication-unavailable";
}
/** Looks up one exact prepared issue without creating or mutating remote state. */
async function reconcileGithubIssue(issue, runGh = runGithubCli, hooks = {}) {
	if (!GITHUB_MARKER_RE.test(issue.marker)) return { status: "unavailable" };
	await hooks.beforeIssueLookup?.();
	const lookup = await runGh(issueLookupArgs(issue.marker), { input: "" });
	if (lookup.errorCode || lookup.status !== 0) return { status: "unavailable" };
	let rows;
	try {
		rows = JSON.parse(lookup.stdout.toString("utf8"));
	} catch {
		return { status: "unavailable" };
	}
	if (!Array.isArray(rows)) return { status: "unavailable" };
	for (const row of rows) {
		if (typeof row !== "object" || row === null || !("body" in row) || row.body !== issue.body || !("title" in row) || row.title !== issue.title || !("url" in row)) continue;
		const url = createdIssueUrl(row.url);
		if (url) return {
			status: "created",
			url
		};
	}
	return { status: "not-found" };
}
async function submitGithubIssueOnce(issue, runGh, hooks) {
	const auth = await runGh(GITHUB_AUTH_ARGS, { input: "" });
	await hooks.afterAuthPreflight?.();
	if (auth.errorCode || auth.status !== 0) return browserFallbackResult(issue, browserFallbackReason(auth));
	(await hooks.beforeIssueCreate?.())?.();
	const created = await runGh(issueCreateArgs(), { input: JSON.stringify({
		body: issue.body,
		title: issue.title
	}) });
	const httpStatus = finalApiHttpStatus(created);
	const directUrl = httpStatus === void 0 || httpStatus === 201 ? issueUrlFromOutput(created) : void 0;
	if (directUrl) return {
		status: "created",
		url: directUrl
	};
	if (!created.started && created.errorCode) return browserFallbackResult(issue, "transport-unavailable");
	if (httpStatus !== void 0 && httpStatus >= 400 && httpStatus < 500 && httpStatus !== 408 && httpStatus !== 499) return browserFallbackResult(issue, httpStatus === 401 ? "authentication-unavailable" : "transport-unavailable");
	const reconciled = await reconcileGithubIssue(issue, runGh, hooks).catch(() => ({ status: "unavailable" }));
	return reconciled.status === "created" ? reconciled : {
		reason: "creation-outcome-unknown",
		status: "outcome-unknown"
	};
}
/** Coalesces unguarded callers; guarded callers own a durable pre-create reservation. */
function submitGithubIssue(issue, runGh = runGithubCli, hooks = {}) {
	if (hooks.beforeIssueCreate) return submitGithubIssueOnce(issue, runGh, hooks);
	const current = inflightSubmissions.get(issue.marker);
	if (current) return current;
	const submission = submitGithubIssueOnce(issue, runGh, hooks).finally(() => {
		if (inflightSubmissions.get(issue.marker) === submission) inflightSubmissions.delete(issue.marker);
	});
	inflightSubmissions.set(issue.marker, submission);
	return submission;
}
async function runGithubCli(args, options) {
	if (process.env.VITEST || false) return {
		errorCode: "EPERM",
		started: false,
		status: null,
		stdout: Buffer.alloc(0)
	};
	return await new Promise((resolve) => {
		const child = spawn("gh", [...args], { stdio: [
			"pipe",
			"pipe",
			"ignore"
		] });
		const stdout = [];
		let stdoutBytes = 0;
		let errorCode;
		let started = false;
		let settled = false;
		const settle = (status) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			resolve({
				...errorCode ? { errorCode } : {},
				started,
				status,
				stdout: Buffer.concat(stdout)
			});
		};
		child.stdout.on("data", (chunk) => {
			const remaining = GITHUB_OUTPUT_MAX_BYTES - stdoutBytes;
			if (remaining > 0) {
				stdout.push(chunk.subarray(0, remaining));
				stdoutBytes += Math.min(chunk.byteLength, remaining);
			}
		});
		child.on("spawn", () => {
			started = true;
		});
		child.on("error", (error) => {
			errorCode = error.code ?? "SPAWN_FAILED";
		});
		child.on("close", settle);
		child.stdin.on("error", () => {});
		const timeout = setTimeout(() => {
			errorCode = "ETIMEDOUT";
			child.kill("SIGKILL");
			child.stdin.destroy();
			child.stdout.destroy();
			child.unref();
			settle(null);
		}, GITHUB_ISSUE_CREATE_TIMEOUT_MS);
		timeout.unref?.();
		child.stdin.end(options.input);
	});
}
//#endregion
export { submitGithubIssue as i, prepareGithubIssue as n, reconcileGithubIssue as r, browserFallbackResult as t };
