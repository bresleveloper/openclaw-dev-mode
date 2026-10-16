import { l as isStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { j as writeExternalFileWithinRoot } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/transcripts/store-errors.ts
var TranscriptsSummaryChangedError = class extends Error {
	constructor() {
		super("Transcript changed while generating notes; summarize it again.");
	}
};
var TranscriptSessionConflictError = class extends Error {
	constructor() {
		super("Transcript session ID conflicts with another capture on this date; use a new ID.");
		this.name = "TranscriptSessionConflictError";
	}
};
const TRANSCRIPT_EXPORT_FILE_NAMES = /* @__PURE__ */ new Set([
	"metadata.json",
	"summary.json",
	"summary.md",
	"transcript.jsonl"
]);
function safeTranscriptPathSegment(value) {
	let segment = value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
	if (!segment) return "session";
	if (segment.endsWith(".") || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu.test(segment)) segment = Buffer.from(segment, "utf8").toString("hex").match(/.{2}/gu).map((byte) => `%${byte.toUpperCase()}`).join("");
	if (segment.length > 255) {
		const suffix = `-${sha256Hex(value)}`;
		return `${segment.slice(0, 255 - suffix.length)}${suffix}`;
	}
	return segment;
}
function legacyTranscriptPathSegment(value) {
	return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "session";
}
function dateSegment(value) {
	return value?.match(/^(\d{4}-\d{2}-\d{2})T/)?.[1] ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function transcriptSessionSelector(session) {
	return `${dateSegment(session.startedAt)}/${safeTranscriptPathSegment(session.sessionId)}`;
}
function legacyTranscriptSessionSelector(session) {
	const date = dateSegment(session.startedAt);
	const segment = legacyTranscriptPathSegment(session.sessionId);
	if (segment.length > 255) return;
	if (segment === ".") return date;
	if (segment === "..") return ".";
	return `${date}/${segment}`;
}
function transcriptSessionExportKey(session) {
	return transcriptSessionSelector(session).toLowerCase();
}
function normalizeExportText(value) {
	return value.endsWith("\n") ? value : `${value}\n`;
}
async function writeTranscriptArtifact(rootDir, fileName, content) {
	await writeExternalFileWithinRoot({
		rootDir,
		path: fileName,
		write: async (tempPath) => await fs.writeFile(tempPath, content, { mode: 384 })
	});
	return sha256Hex(content);
}
async function removeTranscriptArtifact(rootDir, fileName) {
	await removePathWithinRoot({
		rootDir,
		relativePath: fileName,
		force: true
	});
}
async function isCaseSensitiveDirectory(directory) {
	const probeName = `.openclaw-case-probe-${randomUUID().toLowerCase()}`;
	const probePath = path.join(directory, probeName);
	const alternatePath = path.join(directory, probeName.toUpperCase());
	await (await fs.open(probePath, "wx", 384)).close();
	try {
		try {
			await fs.access(alternatePath);
			return false;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return true;
			throw error;
		}
	} finally {
		await fs.rm(probePath, { force: true });
	}
}
//#endregion
//#region src/transcripts/store-export-state.ts
function parseTranscriptExportManifest(json) {
	const value = JSON.parse(json);
	if (!isStringRecord(value)) throw new TypeError("Invalid transcript export manifest: expected an object of strings.");
	return value;
}
function parseTranscriptPendingExports(json) {
	const value = JSON.parse(json);
	if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) throw new TypeError("Invalid pending transcript exports: expected an array of strings.");
	return new Set(value);
}
//#endregion
export { legacyTranscriptSessionSelector as a, safeTranscriptPathSegment as c, writeTranscriptArtifact as d, TranscriptSessionConflictError as f, isCaseSensitiveDirectory as i, transcriptSessionExportKey as l, parseTranscriptPendingExports as n, normalizeExportText as o, TranscriptsSummaryChangedError as p, TRANSCRIPT_EXPORT_FILE_NAMES as r, removeTranscriptArtifact as s, parseTranscriptExportManifest as t, transcriptSessionSelector as u };
