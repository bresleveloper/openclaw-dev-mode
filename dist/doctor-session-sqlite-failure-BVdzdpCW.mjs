import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { f as readSessionSqliteMigrationManifest, i as canonicalMigrationFilePath, o as filterRestoreManifestTargets, y as writeSessionSqliteMigrationManifest } from "./doctor-session-sqlite-migration-run-Dta_SQ4O.mjs";
import { t as prepareGithubIssue } from "./github-issue-DeOhthiD.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-session-sqlite-failure.ts
/** Sanitized support reports for migration failure recovery. */
function writeSessionSqliteMigrationFailureReports(manifestPath, params) {
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	const { jsonPath, markdownPath } = resolveFailureReportPaths(manifestPath);
	if (manifest?.failureReports?.githubIssue) return {
		jsonPath,
		markdownPath
	};
	const targets = manifest ? params.trustedTargets ? filterRestoreManifestTargets(manifest, params.trustedTargets) : manifest.targets : [];
	const payload = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		manifestPath: sanitizeFailureReportText(shortenFailureReportPath(manifestPath)),
		reason: params.reason,
		recoveryCommand: "openclaw doctor --session-sqlite recover --github-issue",
		restoreStatus: manifest?.restore?.status ?? "not_attempted",
		runId: manifest?.runId ?? path.basename(manifestPath, ".json"),
		targets: targets.map((target) => {
			const { issues, recoveryIssues } = collectFailureReportIssues(target, params.recoveryTargets);
			return {
				agentId: sanitizeFailureReportText(target.agentId),
				completedMoves: target.completedMoves.length,
				issues,
				recoveryIssues,
				plannedMoves: target.plannedMoves.length,
				sqlitePath: sanitizeFailureReportText(shortenFailureReportPath(target.sqlitePath)),
				storePath: sanitizeFailureReportText(shortenFailureReportPath(target.storePath)),
				validationBeforeArchive: target.validationBeforeArchive
			};
		}),
		version: VERSION
	};
	fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, { mode: 384 });
	fs.writeFileSync(markdownPath, renderFailureMarkdown(payload), { mode: 384 });
	if (manifest) {
		manifest.failureReports = {
			...manifest.failureReports?.githubIssue ? { githubIssue: manifest.failureReports.githubIssue } : {},
			jsonPath,
			markdownPath
		};
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
	return {
		jsonPath,
		markdownPath
	};
}
function collectFailureReportIssues(target, recoveryTargets = []) {
	const recoveryTarget = recoveryTargets.find((current) => current.agentId === target.agentId && canonicalMigrationFilePath(current.storePath) === canonicalMigrationFilePath(target.storePath) && canonicalMigrationFilePath(current.sqlitePath) === canonicalMigrationFilePath(target.sqlitePath));
	const issues = /* @__PURE__ */ new Map();
	for (const issue of [...target.issues, ...recoveryTarget?.issues ?? []]) issues.set(JSON.stringify([
		issue.code,
		issue.message,
		issue.sessionKey
	]), issue);
	const sanitize = (issue) => ({
		code: issue.code,
		message: sanitizeFailureIssueMessage(issue, target),
		sessionKey: issue.sessionKey ? redactSessionKey(issue.sessionKey) : void 0
	});
	return {
		issues: [...issues.values()].map(sanitize),
		recoveryIssues: recoveryTarget?.issues.map(sanitize)
	};
}
function createSessionSqliteMigrationFailureIssue(manifestPath, trustedTargets) {
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	if (!manifest) return;
	const title = (manifest.failureReports?.githubIssue)?.title ?? `Session SQLite migration recovery report (${manifest.runId})`;
	const bodyPath = manifest.failureReports ? resolveFailureReportPaths(manifestPath).markdownPath : void 0;
	const targets = trustedTargets ? filterRestoreManifestTargets(manifest, trustedTargets) : manifest.targets;
	const persistedBody = bodyPath ? readFailureMarkdown(bodyPath) : void 0;
	if (bodyPath && !persistedBody) return;
	const body = [
		"OpenClaw doctor generated this sanitized report from a local session SQLite migration recovery.",
		"",
		persistedBody ?? renderFailureMarkdown({
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			manifestPath: sanitizeFailureReportText(shortenFailureReportPath(manifestPath)),
			reason: "session SQLite migration failed",
			recoveryCommand: "openclaw doctor --session-sqlite recover --github-issue",
			restoreStatus: manifest.restore?.status ?? "not_attempted",
			runId: manifest.runId,
			targets: targets.map((target) => ({
				agentId: sanitizeFailureReportText(target.agentId),
				completedMoves: target.completedMoves.length,
				issues: target.issues.map((issue) => ({
					code: issue.code,
					message: sanitizeFailureIssueMessage(issue, target)
				})),
				plannedMoves: target.plannedMoves.length,
				sqlitePath: sanitizeFailureReportText(shortenFailureReportPath(target.sqlitePath)),
				storePath: sanitizeFailureReportText(shortenFailureReportPath(target.storePath)),
				validationBeforeArchive: target.validationBeforeArchive
			})),
			version: VERSION
		})
	].join("\n");
	return {
		body: truncateUtf16Safe(body, 2e4),
		...bodyPath ? { bodyPath } : {},
		title
	};
}
/** Claims one exact support payload before any request or browser handoff can publish it. */
function claimSessionSqliteMigrationGithubIssue(manifestPath, issue, authority) {
	authority.assertCurrent();
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	if (!manifest?.failureReports) return;
	if (manifest.failureReports.githubIssue) return {
		issue: manifest.failureReports.githubIssue,
		status: "existing"
	};
	const currentIssue = createSessionSqliteMigrationFailureIssue(manifestPath);
	if (!currentIssue || prepareGithubIssue(currentIssue).marker !== issue.marker) return;
	const claimed = {
		marker: issue.marker,
		status: "attempted",
		title: issue.title
	};
	manifest.manifestVersion = 4;
	manifest.failureReports.githubIssue = claimed;
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath
	});
	return {
		issue: claimed,
		status: "claimed"
	};
}
/** Releases a claim only after the caller proves no public request or browser handoff occurred. */
function clearSessionSqliteMigrationGithubIssueClaim(manifestPath, marker, authority) {
	authority.assertCurrent();
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	const failureReports = manifest?.failureReports;
	const issue = failureReports?.githubIssue;
	if (!manifest || !failureReports || !issue || issue.marker !== marker || issue.status !== "attempted") return false;
	delete failureReports.githubIssue;
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath
	});
	return true;
}
function readFailureMarkdown(filePath) {
	try {
		return fs.readFileSync(filePath, "utf8");
	} catch {
		return;
	}
}
function resolveFailureReportPaths(manifestPath) {
	return {
		jsonPath: manifestPath.replace(/\.json$/u, ".failure.json"),
		markdownPath: manifestPath.replace(/\.json$/u, ".failure.md")
	};
}
function renderFailureMarkdown(payload) {
	const lines = [
		"# Session SQLite Migration Failure",
		"",
		`- Run: ${payload.runId}`,
		`- Generated: ${payload.generatedAt}`,
		`- OpenClaw version: ${payload.version}`,
		`- Reason: ${sanitizeFailureReportText(payload.reason)}`,
		`- Restore status: ${payload.restoreStatus}`,
		`- Recovery command: \`${payload.recoveryCommand}\``,
		"",
		"## Targets"
	];
	for (const target of payload.targets) {
		lines.push("", `### ${target.agentId}`, "", `- Store: ${target.storePath}`, `- SQLite: ${target.sqlitePath}`, `- Planned moves: ${target.plannedMoves}`, `- Completed moves: ${target.completedMoves}`, `- Validation before archive: ${target.validationBeforeArchive}`);
		const groups = [["Recorded migration and recovery evidence", target.issues]];
		if (target.recoveryIssues) groups.unshift(["Current recovery issues", target.recoveryIssues]);
		else lines.push("- Current recovery: not assessed");
		for (const [label, issues] of groups) {
			lines.push(`- ${label}: ${issues.length}`);
			for (const issue of issues) lines.push(`  - [${issue.code}] ${issue.sessionKey ? `${issue.sessionKey}: ` : ""}${issue.message}`);
		}
	}
	lines.push("");
	return `${lines.join("\n")}\n`;
}
function sanitizeFailureReportText(value) {
	const sanitized = value.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[redacted-email]").replace(/(api[_-]?key|token|secret|password)[=-][A-Za-z0-9._-]+/gi, "$1-[redacted]").replace(/(api[_-]?key|token|secret|password)=\S+/gi, "$1=[redacted]");
	return truncateUtf16Safe(sanitized, 500);
}
function shortenFailureReportPath(filePath) {
	const home = process.env.HOME;
	if (home && filePath.startsWith(`${home}${path.sep}`)) return `~${path.sep}${path.relative(home, filePath)}`;
	return filePath;
}
function sanitizeFailureIssueMessage(issue, target) {
	let message = issue.message;
	for (const filePath of [
		target.storePath,
		target.sqlitePath,
		...target.plannedMoves.flatMap((move) => [move.sourcePath, move.archivePath]),
		...target.completedMoves.flatMap((move) => [move.sourcePath, move.archivePath])
	]) message = message.split(filePath).join(shortenFailureReportPath(filePath));
	if (issue.sessionKey) message = message.split(issue.sessionKey).join(redactSessionKey(issue.sessionKey));
	message = redactAbsoluteHomePaths(message);
	return sanitizeFailureReportText(message);
}
function redactSessionKey(sessionKey) {
	if (!sessionKey.trim()) return "[redacted-session-key]";
	return `[redacted-session-key:${randomUUID().slice(0, 8)}]`;
}
function redactAbsoluteHomePaths(value) {
	const home = process.env.HOME;
	if (!home) return value;
	return value.split(home).join("~");
}
//#endregion
export { writeSessionSqliteMigrationFailureReports as i, clearSessionSqliteMigrationGithubIssueClaim as n, createSessionSqliteMigrationFailureIssue as r, claimSessionSqliteMigrationGithubIssue as t };
