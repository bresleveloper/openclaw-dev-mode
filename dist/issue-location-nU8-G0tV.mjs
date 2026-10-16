import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as formatConfigIssueLines } from "./issue-format-L1jxHK43.mjs";
import { c as isSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { t as isSensitiveConfigPath } from "./sensitive-paths-CieLU95K.mjs";
import { r as shouldWarnOnTouchedVersion } from "./version-ByD9iTct.mjs";
import path from "node:path";
import JSON5 from "json5";
//#region src/config/issue-location.ts
function skipTrivia(raw, cursor) {
	while (cursor.pos < raw.length) {
		const char = raw[cursor.pos];
		if (/\s/u.test(char ?? "")) {
			cursor.pos++;
			continue;
		}
		if (char === "/" && raw[cursor.pos + 1] === "/") {
			cursor.pos += 2;
			while (cursor.pos < raw.length && !/[\n\r\u2028\u2029]/u.test(raw[cursor.pos] ?? "")) cursor.pos++;
			continue;
		}
		if (char === "/" && raw[cursor.pos + 1] === "*") {
			const close = raw.indexOf("*/", cursor.pos + 2);
			cursor.pos = close === -1 ? raw.length : close + 2;
			continue;
		}
		return;
	}
}
function scanQuoted(raw, cursor) {
	const quote = raw[cursor.pos++];
	while (cursor.pos < raw.length) {
		const char = raw[cursor.pos++];
		if (char === "\\") cursor.pos++;
		else if (char === quote) return;
	}
}
function consume(raw, cursor, expected) {
	skipTrivia(raw, cursor);
	if (raw[cursor.pos] !== expected) return false;
	cursor.pos++;
	return true;
}
function readObjectKey(raw, cursor) {
	skipTrivia(raw, cursor);
	const start = cursor.pos;
	const char = raw[cursor.pos];
	if (char === "\"" || char === "'") scanQuoted(raw, cursor);
	else while (cursor.pos < raw.length && !/[\s:]/u.test(raw[cursor.pos] ?? "") && !(raw[cursor.pos] === "/" && /[/*]/u.test(raw[cursor.pos + 1] ?? ""))) cursor.pos++;
	if (cursor.pos === start) return null;
	const token = raw.slice(start, cursor.pos);
	try {
		if (char === "\"" || char === "'") {
			const parsed = JSON5.parse(token);
			return typeof parsed === "string" ? parsed : null;
		}
		const parsed = JSON5.parse(`{${token}:null}`);
		return Object.keys(parsed)[0] ?? null;
	} catch {
		return null;
	}
}
function skipValue(raw, cursor) {
	skipTrivia(raw, cursor);
	const char = raw[cursor.pos];
	if (char === "\"" || char === "'") {
		scanQuoted(raw, cursor);
		return;
	}
	if (char === "{" || char === "[") {
		const close = char === "{" ? "}" : "]";
		cursor.pos++;
		while (cursor.pos < raw.length) {
			skipTrivia(raw, cursor);
			if (raw[cursor.pos] === close) {
				cursor.pos++;
				return;
			}
			if (char === "{" && (readObjectKey(raw, cursor) === null || !consume(raw, cursor, ":"))) return;
			skipValue(raw, cursor);
			skipTrivia(raw, cursor);
			if (raw[cursor.pos] === ",") cursor.pos++;
		}
		return;
	}
	while (cursor.pos < raw.length && !/[,}\]\s]/u.test(raw[cursor.pos] ?? "") && !(raw[cursor.pos] === "/" && /[/*]/u.test(raw[cursor.pos + 1] ?? ""))) cursor.pos++;
}
function locateValueOffset(raw, cursor, segments, depth) {
	const segment = segments[depth];
	const isLeaf = depth === segments.length - 1;
	if (typeof segment === "number") {
		if (!consume(raw, cursor, "[")) return;
		for (let index = 0; cursor.pos < raw.length; index++) {
			skipTrivia(raw, cursor);
			if (raw[cursor.pos] === "]") return;
			if (index === segment) return isLeaf ? cursor.pos : locateValueOffset(raw, cursor, segments, depth + 1);
			skipValue(raw, cursor);
			if (!consume(raw, cursor, ",")) return;
		}
		return;
	}
	if (!consume(raw, cursor, "{")) return;
	let lastMatch;
	while (cursor.pos < raw.length) {
		skipTrivia(raw, cursor);
		if (raw[cursor.pos] === "}") return lastMatch;
		const key = readObjectKey(raw, cursor);
		if (key === null || !consume(raw, cursor, ":")) return;
		skipTrivia(raw, cursor);
		const valueStart = cursor.pos;
		if (key === segment) lastMatch = isLeaf ? valueStart : locateValueOffset(raw, { pos: valueStart }, segments, depth + 1);
		cursor.pos = valueStart;
		skipValue(raw, cursor);
		skipTrivia(raw, cursor);
		if (raw[cursor.pos] === ",") {
			cursor.pos++;
			continue;
		}
		return lastMatch;
	}
	return lastMatch;
}
function lineAtOffset(raw, offset) {
	let line = 1;
	for (let index = 0; index < offset; index++) {
		const char = raw[index];
		if (char === "\r") {
			line++;
			if (raw[index + 1] === "\n") index++;
		} else if (char === "\n" || char === "\u2028" || char === "\u2029") line++;
	}
	return line;
}
function resolveConfigValueAtPath(root, segments) {
	let current = root;
	for (const segment of segments) {
		if (typeof segment === "number") {
			if (!Array.isArray(current) || segment >= current.length) return;
			current = current[segment];
			continue;
		}
		if (!current || typeof current !== "object" || Array.isArray(current)) return;
		current = current[segment];
	}
	return current;
}
function stringifyReceivedValue(value) {
	if (value === void 0) return null;
	if (typeof value === "number" && (!Number.isFinite(value) || Object.is(value, -0))) return Object.is(value, -0) ? "-0" : String(value);
	try {
		const serialized = JSON.stringify(value);
		if (serialized === void 0) return null;
		return serialized.length > 160 ? `${truncateUtf16Safe(serialized, 157)}...` : serialized;
	} catch {
		return null;
	}
}
function appendReceivedValueHint(message, pathValue, value, pathSegments) {
	if (value === void 0 || isSecretRef(value) || isSensitiveConfigPath(pathValue) || pathSegments[0] === "channels" || pathSegments[0] === "plugins" && pathSegments[1] === "entries" && pathSegments[3] === "config" || typeof value === "object" && value !== null || message.toLowerCase().includes("got:") || /\breceived\b/i.test(message)) return message;
	const label = stringifyReceivedValue(value);
	return label ? `${message}, got: ${label}` : message;
}
function resolveConfigIssueLineInRaw(raw, segments) {
	if (segments.length === 0 || raw.trim().length === 0) return;
	const offset = locateValueOffset(raw, { pos: 0 }, segments, 0);
	return offset === void 0 ? void 0 : lineAtOffset(raw, offset);
}
/** Render invalid config issues with source locations, received values, and version-skew advice. */
function renderConfigValidationIssueLines(snapshot, marker = "-") {
	const raw = typeof snapshot.raw === "string" ? snapshot.raw : null;
	const sourceFile = typeof snapshot.path === "string" && snapshot.path.trim() ? path.basename(snapshot.path) : "openclaw.json";
	const issues = snapshot.issues.map((issue) => {
		const segments = issue.pathSegments;
		if (!segments || segments.length === 0) return issue;
		const literalValue = resolveConfigValueAtPath(snapshot.parsed, segments);
		const effectiveValue = resolveConfigValueAtPath(snapshot.sourceConfig, segments);
		const line = raw === null ? void 0 : resolveConfigIssueLineInRaw(raw, segments);
		const message = line !== void 0 && Object.is(literalValue, effectiveValue) ? appendReceivedValueHint(issue.message, issue.path, effectiveValue, segments) : issue.message;
		return {
			...issue,
			pathSegments: segments,
			message,
			...line === void 0 ? {} : {
				line,
				sourceFile
			}
		};
	});
	const lines = formatConfigIssueLines(issues, marker, { normalizeRoot: true });
	const touchedVersion = snapshot.sourceConfig.meta?.lastTouchedVersion;
	return shouldWarnOnTouchedVersion(VERSION, touchedVersion) ? [...lines, `Config was last written by OpenClaw ${touchedVersion}, but you are running ${VERSION} — upgrade or re-run setup.`] : lines;
}
//#endregion
export { renderConfigValidationIssueLines as t };
