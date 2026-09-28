import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as sanitizeGoogleAssistantFirstOrdering } from "./google-turn-ordering-CAKKJfPd.mjs";
//#region src/agents/embedded-agent-helpers/bootstrap.ts
/**
* Builds and sanitizes bootstrap context inserted into embedded-agent sessions.
*/
function isBase64Signature(value) {
	const trimmed = value.trim();
	if (!trimmed) return false;
	const compact = trimmed.replace(/\s+/g, "");
	if (!/^[A-Za-z0-9+/=_-]+$/.test(compact)) return false;
	const isUrl = compact.includes("-") || compact.includes("_");
	try {
		const buf = Buffer.from(compact, isUrl ? "base64url" : "base64");
		if (buf.length === 0) return false;
		const encoded = buf.toString(isUrl ? "base64url" : "base64");
		const normalize = (input) => input.replace(/=+$/g, "");
		return normalize(encoded) === normalize(compact);
	} catch {
		return false;
	}
}
/**
* Strips Claude-style thought_signature fields from content blocks.
*
* Gemini expects thought signatures as base64-encoded bytes, but Claude stores message ids
* like "msg_abc123...". We only strip "msg_*" to preserve any provider-valid signatures.
*/
function stripThoughtSignatures(content, options) {
	if (!Array.isArray(content)) return content;
	const allowBase64Only = options?.allowBase64Only ?? false;
	const includeCamelCase = options?.includeCamelCase ?? false;
	const shouldStripSignature = (value) => {
		if (!allowBase64Only) return typeof value === "string" && value.startsWith("msg_");
		return typeof value !== "string" || !isBase64Signature(value);
	};
	return content.map((block) => {
		if (!block || typeof block !== "object") return block;
		const rec = block;
		const stripSnake = shouldStripSignature(rec.thought_signature);
		const stripCamel = includeCamelCase ? shouldStripSignature(rec.thoughtSignature) : false;
		if (!stripSnake && !stripCamel) return block;
		const next = { ...rec };
		if (stripSnake) delete next.thought_signature;
		if (stripCamel) delete next.thoughtSignature;
		return next;
	});
}
const DEFAULT_BOOTSTRAP_MAX_CHARS = 2e4;
const DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS = 6e4;
const USER_BOOTSTRAP_MAX_CHARS = 4e3;
const MIN_BOOTSTRAP_FILE_BUDGET_CHARS = 64;
const BOOTSTRAP_HEAD_RATIO = .75;
const BOOTSTRAP_TAIL_RATIO = .25;
const MIN_BOOTSTRAP_TRIMMED_CONTENT_CHARS = 16;
const AGENTS_BOOTSTRAP_FILENAME = "AGENTS.md";
const USER_BOOTSTRAP_FILENAME = "USER.md";
const AGENTS_POLICY_DIGEST_RATIO = .35;
const AGENTS_POLICY_HEAD_RATIO = .45;
const AGENTS_POLICY_TAIL_RATIO = .15;
const AGENTS_POLICY_DIGEST_MAX_LINE_CHARS = 240;
const AGENTS_POLICY_DIGEST_CANDIDATE_PATTERN = /\b(?:AGENTS\.md|scoped|required|must|never|do not|before subtree|read scoped|owner|security|secret|credential|test|validation|command|commit|push|github|pr)\b|(?:🔴|禁止|嚴禁|不得|絕不|絕對不|切勿|必須|務必|一律|紅線)/iu;
const AGENTS_POLICY_DIGEST_HIGH_PRIORITY_PATTERN = /\b(?:AGENTS\.md|scoped|required|must|never|do not|before subtree|read scoped|security|secret|credential)\b|(?:🔴|禁止|嚴禁|不得|絕不|絕對不|切勿)/iu;
function resolveBootstrapCharLimit(cfg, agentId, key, fallback) {
	const raw = cfg && agentId ? resolveAgentConfig(cfg, agentId)?.[key] ?? cfg.agents?.defaults?.[key] : cfg?.agents?.defaults?.[key];
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return fallback;
}
function resolveBootstrapMaxChars(cfg, agentId) {
	return resolveBootstrapCharLimit(cfg, agentId, "bootstrapMaxChars", DEFAULT_BOOTSTRAP_MAX_CHARS);
}
function resolveBootstrapTotalMaxChars(cfg, agentId) {
	return resolveBootstrapCharLimit(cfg, agentId, "bootstrapTotalMaxChars", DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS);
}
function isAgentsBootstrapFile(fileName) {
	return fileName?.toLowerCase() === AGENTS_BOOTSTRAP_FILENAME.toLowerCase();
}
function isUserBootstrapFile(fileName) {
	return fileName?.toLowerCase() === USER_BOOTSTRAP_FILENAME.toLowerCase();
}
function isPolicyDigestCandidate(line) {
	if (/^(?:#{1,6}|\s*[-*+]|\s*\d+[.)])\s+\S/u.test(line)) return true;
	return AGENTS_POLICY_DIGEST_CANDIDATE_PATTERN.test(line);
}
function normalizePolicyDigestLine(line) {
	const normalized = line.trim().replace(/\s+/gu, " ");
	if (normalized.length <= AGENTS_POLICY_DIGEST_MAX_LINE_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, 239)}…`;
}
function buildAgentsPolicyDigest(candidates, budget) {
	if (budget <= 0) return {
		text: "",
		omittedLines: 0
	};
	const selected = /* @__PURE__ */ new Set();
	let used = 0;
	const trySelect = (candidate) => {
		const separatorChars = selected.size > 0 ? 1 : 0;
		if (used + separatorChars + candidate.text.length > budget) return;
		selected.add(candidate);
		used += separatorChars + candidate.text.length;
	};
	for (const candidate of candidates) if (candidate.highPriority) trySelect(candidate);
	for (const candidate of candidates) if (!selected.has(candidate)) trySelect(candidate);
	return {
		text: candidates.filter((candidate) => selected.has(candidate)).map((candidate) => candidate.text).join("\n"),
		omittedLines: Math.max(0, candidates.length - selected.size)
	};
}
function trimAgentsBootstrapContent(trimmed, maxChars) {
	let headChars = Math.floor(maxChars * AGENTS_POLICY_HEAD_RATIO);
	let tailChars = Math.floor(maxChars * AGENTS_POLICY_TAIL_RATIO);
	let digestBudget = Math.floor(maxChars * AGENTS_POLICY_DIGEST_RATIO);
	const candidates = [];
	if (!(digestBudget <= 0)) {
		let lastProseLine = null;
		for (const sourceLine of trimmed.split(/\r?\n/u)) {
			const line = normalizePolicyDigestLine(sourceLine);
			if (line.length === 0) {
				lastProseLine = null;
				continue;
			}
			if (/^\s*(?:`{3,}|~{3,})/u.test(line)) lastProseLine = null;
			else if (isPolicyDigestCandidate(line)) {
				candidates.push({
					text: lastProseLine === null ? line : `${lastProseLine}\n${line}`,
					highPriority: AGENTS_POLICY_DIGEST_HIGH_PRIORITY_PATTERN.test(line)
				});
				lastProseLine = null;
			} else lastProseLine = line;
		}
	}
	let digest = buildAgentsPolicyDigest(candidates, digestBudget);
	const render = () => [
		sliceUtf16Safe(trimmed, 0, headChars),
		`[...truncated, read ${AGENTS_BOOTSTRAP_FILENAME} for full content...]`,
		digest.text ? "[Policy digest from AGENTS.md]" : "",
		digest.text,
		digest.omittedLines > 0 ? `[...${digest.omittedLines} more policy lines omitted...]` : "",
		`…(truncated ${AGENTS_BOOTSTRAP_FILENAME}: kept ${headChars}+policy ${digest.text.length}+${tailChars} chars of ${trimmed.length})…`,
		tailChars > 0 ? sliceUtf16Safe(trimmed, -tailChars) : ""
	].filter((part) => part.length > 0).join("\n");
	let rendered = render();
	while (rendered.length > maxChars && (tailChars > 0 || headChars > 1 || digestBudget > 0)) {
		const overflow = rendered.length - maxChars;
		if (tailChars > 0) tailChars = Math.max(0, tailChars - overflow);
		else if (headChars > 1) headChars = Math.max(1, headChars - overflow);
		else {
			digestBudget = Math.max(0, digestBudget - overflow);
			digest = buildAgentsPolicyDigest(candidates, digestBudget);
		}
		rendered = render();
	}
	return {
		content: rendered.length > maxChars ? truncateUtf16Safe(rendered, maxChars) : rendered,
		truncated: true,
		maxChars,
		originalLength: trimmed.length
	};
}
function trimBootstrapContent(content, fileName, maxChars) {
	const trimmed = content.trimEnd();
	if (trimmed.length <= maxChars) return {
		content: trimmed,
		truncated: false,
		maxChars,
		originalLength: trimmed.length
	};
	if (isAgentsBootstrapFile(fileName)) return trimAgentsBootstrapContent(trimmed, maxChars);
	const markerTemplate = (headChars, tailChars) => [
		"",
		`[...truncated, read ${fileName} for full content...]`,
		`…(truncated ${fileName}: kept ${headChars}+${tailChars} chars of ${trimmed.length})…`,
		""
	].join("\n");
	const compactMarkerTemplate = (headChars, tailChars) => `[…truncated ${headChars}+${tailChars}/${trimmed.length}]`;
	const separatorCharsFor = (headCount, tailCount, markerContent) => markerContent.includes("\n") ? Number(headCount > 0) + Number(tailCount > 0) : 0;
	const renderTruncatedContent = (head, markerContent, tail) => [
		head,
		markerContent,
		tail
	].filter((part) => part.length > 0).join(markerContent.includes("\n") ? "\n" : "");
	const resolveMarkerTemplate = () => {
		const fullMarker = markerTemplate(0, 0);
		return maxChars - fullMarker.length - separatorCharsFor(1, 1, fullMarker) >= MIN_BOOTSTRAP_TRIMMED_CONTENT_CHARS ? markerTemplate : compactMarkerTemplate;
	};
	const resolvedMarkerTemplate = resolveMarkerTemplate();
	let headChars = 0;
	let tailChars = 0;
	let marker = resolvedMarkerTemplate(headChars, tailChars);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		const contentBudget = Math.max(0, maxChars - marker.length - separatorCharsFor(headChars, tailChars, marker));
		const nextHeadChars = Math.floor(contentBudget * BOOTSTRAP_HEAD_RATIO);
		const nextTailChars = Math.floor(contentBudget * BOOTSTRAP_TAIL_RATIO);
		const nextMarker = resolvedMarkerTemplate(nextHeadChars, nextTailChars);
		if (nextHeadChars === headChars && nextTailChars === tailChars && nextMarker.length === marker.length) break;
		headChars = nextHeadChars;
		tailChars = nextTailChars;
		marker = nextMarker;
	}
	let renderedLength = headChars + tailChars + marker.length + separatorCharsFor(headChars, tailChars, marker);
	while (renderedLength > maxChars && (tailChars > 0 || headChars > 0)) {
		const overflow = renderedLength - maxChars;
		if (tailChars > 0) tailChars = Math.max(0, tailChars - overflow);
		else headChars = Math.max(0, headChars - overflow);
		marker = resolvedMarkerTemplate(headChars, tailChars);
		renderedLength = headChars + tailChars + marker.length + separatorCharsFor(headChars, tailChars, marker);
	}
	if (headChars === 0 && tailChars === 0 && trimmed.length > 0) {
		const singleHeadMarker = resolvedMarkerTemplate(1, 0);
		if (1 + singleHeadMarker.length + separatorCharsFor(1, 0, singleHeadMarker) <= maxChars) {
			headChars = 1;
			marker = singleHeadMarker;
		}
	}
	const head = sliceUtf16Safe(trimmed, 0, headChars);
	const tail = tailChars > 0 ? sliceUtf16Safe(trimmed, -tailChars) : "";
	const contentWithMarker = renderTruncatedContent(head, marker, tail);
	return {
		content: contentWithMarker.length > maxChars ? truncateUtf16Safe(contentWithMarker, maxChars) : contentWithMarker,
		truncated: true,
		maxChars,
		originalLength: trimmed.length
	};
}
function clampToBudget(content, budget) {
	if (budget <= 0) return "";
	if (content.length <= budget) return content;
	if (budget <= 3) return truncateUtf16Safe(content, budget);
	const safe = budget - 1;
	return `${truncateUtf16Safe(content, safe)}…`;
}
function buildBootstrapContextFiles(files, opts) {
	const maxChars = opts?.maxChars ?? DEFAULT_BOOTSTRAP_MAX_CHARS;
	let remainingTotalChars = Math.max(1, Math.floor(opts?.totalMaxChars ?? Math.max(maxChars, DEFAULT_BOOTSTRAP_TOTAL_MAX_CHARS)));
	const result = [];
	for (const file of files) {
		if (remainingTotalChars <= 0) break;
		const pathValue = normalizeOptionalString(file.path) ?? "";
		if (!pathValue) {
			opts?.warn?.(`skipping bootstrap file "${file.name}" — missing or invalid "path" field (hook may have used "filePath" instead)`);
			continue;
		}
		if (file.missing) {
			const cappedMissingText = clampToBudget(`[MISSING] Expected at: ${pathValue}`, remainingTotalChars);
			if (!cappedMissingText) break;
			remainingTotalChars = Math.max(0, remainingTotalChars - cappedMissingText.length);
			result.push({
				path: pathValue,
				content: cappedMissingText
			});
			continue;
		}
		if (remainingTotalChars < MIN_BOOTSTRAP_FILE_BUDGET_CHARS) {
			opts?.warn?.(`remaining bootstrap budget is ${remainingTotalChars} chars (<${MIN_BOOTSTRAP_FILE_BUDGET_CHARS}); skipping additional bootstrap files`);
			break;
		}
		const fileBudget = isUserBootstrapFile(file.name) ? Math.min(maxChars, USER_BOOTSTRAP_MAX_CHARS) : maxChars;
		const fileMaxChars = Math.max(1, Math.min(fileBudget, remainingTotalChars));
		if (file.personalUser && (file.content ?? "").trimEnd().length > fileMaxChars) {
			opts?.warn?.("Personal USER.md exceeds the bootstrap budget; using shared defaults.");
			continue;
		}
		const trimmed = trimBootstrapContent(file.content ?? "", file.name, fileMaxChars);
		const contentWithinBudget = clampToBudget(trimmed.content, remainingTotalChars);
		if (!contentWithinBudget) continue;
		if (trimmed.truncated || contentWithinBudget.length < trimmed.content.length) opts?.warn?.(`workspace bootstrap file ${file.name} is ${trimmed.originalLength} chars (limit ${trimmed.maxChars}); truncating in injected context`);
		remainingTotalChars = Math.max(0, remainingTotalChars - contentWithinBudget.length);
		result.push({
			path: pathValue,
			content: contentWithinBudget,
			...file.personalUser ? { personalUser: file.personalUser } : {}
		});
	}
	return result;
}
function sanitizeGoogleTurnOrdering(messages) {
	return sanitizeGoogleAssistantFirstOrdering(messages);
}
//#endregion
export { sanitizeGoogleTurnOrdering as a, resolveBootstrapTotalMaxChars as i, buildBootstrapContextFiles as n, stripThoughtSignatures as o, resolveBootstrapMaxChars as r, USER_BOOTSTRAP_MAX_CHARS as t };
