import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as resolveBootstrapTotalMaxChars, r as resolveBootstrapMaxChars, t as USER_BOOTSTRAP_MAX_CHARS } from "./bootstrap-Dvw1-bo8.mjs";
import path from "node:path";
//#region src/agents/bootstrap-budget-warning.ts
const DEFAULT_BOOTSTRAP_PROMPT_WARNING_MAX_FILES = 3;
const DEFAULT_BOOTSTRAP_PROMPT_WARNING_SIGNATURE_HISTORY_MAX = 32;
function formatWarningCause(cause) {
	return cause === "per-file-limit" ? "max/file" : "max/total";
}
function normalizeBootstrapWarningSignatures(signatures) {
	if (!Array.isArray(signatures) || signatures.length === 0) return [];
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const signature of signatures) {
		const value = normalizeOptionalString(signature) ?? "";
		if (!value || seen.has(value)) continue;
		seen.add(value);
		result.push(value);
	}
	return result;
}
function appendSeenSignature(signatures, signature) {
	if (!signature.trim() || signatures.includes(signature)) return signatures;
	const next = [...signatures, signature];
	return next.length <= DEFAULT_BOOTSTRAP_PROMPT_WARNING_SIGNATURE_HISTORY_MAX ? next : next.slice(-32);
}
function buildBootstrapTruncationSignature(analysis) {
	if (!analysis.hasTruncation) return;
	const files = analysis.truncatedFiles.map((file) => ({
		path: file.path || file.name,
		rawChars: file.rawChars,
		injectedChars: file.injectedChars,
		causes: file.causes.toSorted()
	})).toSorted((a, b) => {
		const pathCmp = a.path.localeCompare(b.path);
		if (pathCmp !== 0) return pathCmp;
		if (a.rawChars !== b.rawChars) return a.rawChars - b.rawChars;
		if (a.injectedChars !== b.injectedChars) return a.injectedChars - b.injectedChars;
		return a.causes.join("+").localeCompare(b.causes.join("+"));
	});
	return JSON.stringify({
		bootstrapMaxChars: analysis.totals.bootstrapMaxChars,
		bootstrapTotalMaxChars: analysis.totals.bootstrapTotalMaxChars,
		files
	});
}
function formatBootstrapTruncationWarningLines(params) {
	if (!params.analysis.hasTruncation) return [];
	const maxFiles = typeof params.maxFiles === "number" && Number.isFinite(params.maxFiles) && params.maxFiles > 0 ? Math.floor(params.maxFiles) : DEFAULT_BOOTSTRAP_PROMPT_WARNING_MAX_FILES;
	const lines = [];
	const duplicateNameCounts = params.analysis.truncatedFiles.reduce((acc, file) => {
		acc.set(file.name, (acc.get(file.name) ?? 0) + 1);
		return acc;
	}, /* @__PURE__ */ new Map());
	const topFiles = params.analysis.truncatedFiles.slice(0, maxFiles);
	for (const file of topFiles) {
		const pct = file.rawChars > 0 ? Math.round((file.rawChars - file.injectedChars) / file.rawChars * 100) : 0;
		const causeText = file.causes.length > 0 ? file.causes.map((cause) => formatWarningCause(cause)).join(", ") : "";
		const nameLabel = (duplicateNameCounts.get(file.name) ?? 0) > 1 && file.path.trim().length > 0 ? `${file.name} (${file.path})` : file.name;
		lines.push(`${nameLabel}: ${file.rawChars} raw -> ${file.injectedChars} injected (~${Math.max(0, pct)}% removed${causeText ? `; ${causeText}` : ""}).`);
	}
	if (params.analysis.truncatedFiles.length > topFiles.length) lines.push(`+${params.analysis.truncatedFiles.length - topFiles.length} more truncated file(s).`);
	if (params.analysis.truncatedFiles.some((file) => file.name?.toLowerCase() === "agents.md")) lines.push("AGENTS.md was truncated; read the full AGENTS.md before relying on scoped policy.");
	if (params.analysis.truncatedFiles.some((file) => file.name?.toLowerCase() === "user.md" && file.effectiveFileLimit === 4e3 && file.causes.includes("per-file-limit"))) lines.push(`USER.md has a fixed ${USER_BOOTSTRAP_MAX_CHARS}-character bootstrap cap; keep it compact.`);
	if (params.analysis.truncatedFiles.some((file) => file.name?.toLowerCase() !== "user.md" || file.effectiveFileLimit < 4e3 || file.causes.includes("total-limit"))) lines.push("If unintentional, raise agents.defaults.bootstrapMaxChars and/or agents.defaults.bootstrapTotalMaxChars.");
	return lines;
}
/** Decides whether to show a prompt warning and returns the updated dedupe state. */
function buildBootstrapPromptWarning(params) {
	const signature = buildBootstrapTruncationSignature(params.analysis);
	let seenSignatures = normalizeBootstrapWarningSignatures(params.seenSignatures);
	if (params.previousSignature && !seenSignatures.includes(params.previousSignature)) seenSignatures = appendSeenSignature(seenSignatures, params.previousSignature);
	const hasSeenSignature = Boolean(signature && seenSignatures.includes(signature));
	const warningShown = params.mode !== "off" && Boolean(signature) && (params.mode === "always" || !hasSeenSignature);
	const warningSignaturesSeen = signature && params.mode !== "off" ? appendSeenSignature(seenSignatures, signature) : seenSignatures;
	return {
		signature,
		warningShown,
		lines: warningShown ? formatBootstrapTruncationWarningLines({
			analysis: params.analysis,
			maxFiles: params.maxFiles
		}) : [],
		warningSignaturesSeen
	};
}
//#endregion
//#region src/agents/bootstrap-budget.ts
/**
* Analyzes injected workspace bootstrap files and builds warnings when context
* was truncated before an agent sees it.
*/
const DEFAULT_BOOTSTRAP_NEAR_LIMIT_RATIO = .85;
function normalizePositiveLimit(value) {
	if (!Number.isFinite(value) || value <= 0) return 1;
	return Math.floor(value);
}
function effectiveBootstrapFileLimit(name, bootstrapMaxChars) {
	return name.toLowerCase() === "user.md" ? Math.min(bootstrapMaxChars, USER_BOOTSTRAP_MAX_CHARS) : bootstrapMaxChars;
}
/**
* USER.md carries a deliberate fixed cap: tuning bootstrapMaxChars can only
* lower it, so per-file remediation must never suggest raising that setting
* for it. The effective limit equals the fixed cap exactly when the cap (not
* the configured limit) is the binding constraint.
*/
function isFixedUserCapFile(file) {
	return file.name.toLowerCase() === "user.md" && file.effectiveFileLimit === 4e3;
}
/** Restores prompt-warning dedupe state from a previous bootstrap report. */
function resolveBootstrapWarningSignaturesSeen(report) {
	const truncation = report?.bootstrapTruncation;
	const seenFromReport = normalizeBootstrapWarningSignatures(truncation?.warningSignaturesSeen);
	if (seenFromReport.length > 0) return seenFromReport;
	if (truncation?.warningMode === "off") return [];
	const single = typeof truncation?.promptWarningSignature === "string" ? normalizeOptionalString(truncation.promptWarningSignature) ?? "" : "";
	return single ? [single] : [];
}
/**
* Matches injected content by source path, because basenames can repeat even
* when the total budget drops one of those files. Account before remapping
* source paths into the prompt workspace.
*/
function buildBootstrapInjectionStats(params) {
	const injectedByPath = /* @__PURE__ */ new Map();
	for (const file of params.injectedFiles) {
		const pathValue = normalizeOptionalString(file.path) ?? "";
		if (pathValue && !injectedByPath.has(pathValue)) injectedByPath.set(pathValue, file.content);
	}
	return params.bootstrapFiles.map((file) => {
		const pathValue = normalizeOptionalString(file.path) ?? "";
		const normalizedPath = pathValue.replace(/\\/g, "/");
		const name = normalizeOptionalString(file.name) ?? (normalizedPath ? path.posix.basename(normalizedPath) : "bootstrap");
		const rawChars = file.missing ? 0 : (file.content ?? "").trimEnd().length;
		const injected = pathValue ? injectedByPath.get(pathValue) : void 0;
		const injectedChars = injected ? injected.length : 0;
		const truncated = !file.missing && injectedChars < rawChars;
		return {
			name,
			path: pathValue || name,
			missing: file.missing,
			rawChars,
			injectedChars,
			truncated
		};
	});
}
/** Classifies bootstrap truncation and near-limit pressure for prompt/report output. */
function analyzeBootstrapBudget(params) {
	const bootstrapMaxChars = normalizePositiveLimit(params.bootstrapMaxChars);
	const bootstrapTotalMaxChars = normalizePositiveLimit(params.bootstrapTotalMaxChars);
	const nearLimitRatio = typeof params.nearLimitRatio === "number" && Number.isFinite(params.nearLimitRatio) && params.nearLimitRatio > 0 && params.nearLimitRatio < 1 ? params.nearLimitRatio : DEFAULT_BOOTSTRAP_NEAR_LIMIT_RATIO;
	let rawChars = 0;
	let injectedChars = 0;
	let remainingTotalChars = bootstrapTotalMaxChars;
	const files = params.files.map((file) => {
		const effectiveFileLimit = effectiveBootstrapFileLimit(file.name, bootstrapMaxChars);
		const availableTotalChars = remainingTotalChars;
		remainingTotalChars = Math.max(0, remainingTotalChars - file.injectedChars);
		if (file.missing) return {
			...file,
			effectiveFileLimit,
			nearLimit: false,
			causes: []
		};
		rawChars += file.rawChars;
		injectedChars += file.injectedChars;
		const perFileOverLimit = file.rawChars > effectiveFileLimit;
		const nearLimit = file.rawChars >= Math.ceil(effectiveFileLimit * nearLimitRatio);
		const causes = [];
		if (file.truncated) {
			if (perFileOverLimit) causes.push("per-file-limit");
			if (availableTotalChars < effectiveFileLimit && file.rawChars > availableTotalChars) causes.push("total-limit");
		}
		return {
			...file,
			effectiveFileLimit,
			nearLimit,
			causes
		};
	});
	const truncatedFiles = files.filter((file) => file.truncated);
	return {
		files,
		truncatedFiles,
		nearLimitFiles: files.filter((file) => file.nearLimit),
		totalNearLimit: injectedChars >= Math.ceil(bootstrapTotalMaxChars * nearLimitRatio),
		hasTruncation: truncatedFiles.length > 0,
		totals: {
			rawChars,
			injectedChars,
			truncatedChars: Math.max(0, rawChars - injectedChars),
			bootstrapMaxChars,
			bootstrapTotalMaxChars,
			nearLimitRatio
		}
	};
}
/** Builds the canonical bootstrap budget diagnosis after caller-owned routing. */
function buildBootstrapBudgetState(params) {
	const bootstrapMaxChars = resolveBootstrapMaxChars(params.config, params.agentId);
	const bootstrapTotalMaxChars = resolveBootstrapTotalMaxChars(params.config, params.agentId);
	const bootstrapAnalysis = analyzeBootstrapBudget({
		files: params.files,
		bootstrapMaxChars,
		bootstrapTotalMaxChars
	});
	const bootstrapPromptWarningMode = "always";
	return {
		bootstrapAnalysis,
		bootstrapMaxChars,
		bootstrapPromptWarning: buildBootstrapPromptWarning({
			analysis: bootstrapAnalysis,
			mode: bootstrapPromptWarningMode,
			seenSignatures: params.seenSignatures,
			previousSignature: params.previousSignature
		}),
		bootstrapPromptWarningMode,
		bootstrapTotalMaxChars
	};
}
/** Builds the compact truncation notice mirrored into run metadata. */
function buildBootstrapPromptWarningNotice(warningLines) {
	if (!(warningLines ?? []).some((line) => line.trim().length > 0)) return;
	return [
		"[Bootstrap truncation warning]",
		"Some workspace bootstrap files were truncated before Project Context injection.",
		"Treat Project Context as partial and read the relevant files directly if details seem missing."
	].join("\n");
}
/** Serializes truncation warning state for run reports and future dedupe. */
function buildBootstrapTruncationReportMeta(params) {
	return {
		warningMode: params.warningMode,
		warningShown: params.warning.warningShown,
		promptWarningSignature: params.warning.signature,
		...params.warning.warningSignaturesSeen.length > 0 ? { warningSignaturesSeen: params.warning.warningSignaturesSeen } : {},
		truncatedFiles: params.analysis.truncatedFiles.length,
		nearLimitFiles: params.analysis.nearLimitFiles.length,
		totalNearLimit: params.analysis.totalNearLimit
	};
}
//#endregion
export { buildBootstrapTruncationReportMeta as a, buildBootstrapPromptWarningNotice as i, buildBootstrapBudgetState as n, isFixedUserCapFile as o, buildBootstrapInjectionStats as r, resolveBootstrapWarningSignaturesSeen as s, analyzeBootstrapBudget as t };
