import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { A as writeExternalFileWithinRoot, o as ensureAbsoluteDirectory } from "./fs-safe-BAPek8At.mjs";
import { n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { i as sha256File } from "./crypto-digest-D9Nqq3c7.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as iterateOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-H5HXDD9v.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import { C as meetingTranscriptSessionQuery, F as ensureMeetingTranscriptsSchema, L as TranscriptsSummaryChangedError, M as utteranceFromRow, P as prepareTranscriptDateReader, S as meetingTranscriptDb, b as parseTranscriptPendingExports, f as iterateTranscriptExport, i as writeMeetingTranscriptSessionInDatabase, k as sessionFromRow, n as markMeetingTranscriptPendingExportsInDatabase, o as TranscriptLibraryError, p as iterateTranscriptReadEntries, r as updateMeetingTranscriptExportManifestInDatabase, t as assertMeetingTranscriptSelectorAvailableInDatabase, w as meetingTranscriptUtteranceQuery, y as parseTranscriptExportManifest } from "./store-sqlite-write-C8OaAvQF.mjs";
import { t as removePathWithinRoot } from "./fs-safe-remove-voSEe4IL.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/transcripts/summary.ts
const ACTION_PATTERNS = /\b(todo|action|follow up|follow-up|assign|owner|next step|ship|fix|send|schedule)\b/i;
const DECISION_PATTERNS = /\b(decided|decision|we will|we'll|agreed|approved|go with|ship it)\b/i;
const RISK_PATTERNS = /\b(risk|blocked|blocker|concern|issue|problem|unknown|deadline|privacy|security)\b/i;
function firstSentences(utterances, limit) {
	const text = normalizeStringEntries(utterances.map((utterance) => utterance.text)).join(" ");
	const sentences = [];
	for (const match of text.matchAll(/[^.!?]+[.!?]?/g)) {
		sentences.push(match[0]);
		if (sentences.length >= limit) break;
	}
	return normalizeStringEntries(sentences).join(" ");
}
function collectMatches(utterances, pattern) {
	const matches = [];
	utterances.some((utterance) => {
		if (pattern.test(utterance.text)) {
			const line = formatSpeakerLine(utterance);
			if (line) matches.push(line);
		}
		return matches.length >= 12;
	});
	return matches;
}
function sanitizeUtterance(utterance) {
	const sanitized = {
		...utterance,
		text: sanitizeTerminalText(utterance.text)
	};
	if (utterance.speaker) sanitized.speaker = {
		...utterance.speaker,
		label: sanitizeTerminalText(utterance.speaker.label)
	};
	return sanitized;
}
function formatSpeakerLine(utterance) {
	const text = utterance.text.trim();
	if (!text) return "";
	const speaker = utterance.speaker?.label?.trim();
	return speaker ? `${speaker}: ${text}` : text;
}
/** Build a deterministic summary from transcript utterances. */
function summarizeTranscripts(params) {
	const title = sanitizeTerminalText(params.session.title ?? "").trim() || "Transcripts";
	const utterances = params.utterances.map(sanitizeUtterance).filter((utterance) => !isTranscriptArtifactText(utterance.text));
	const overview = firstSentences(utterances, 4) || "No transcript captured yet.";
	return {
		sessionId: params.session.sessionId,
		title,
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		overview,
		participants: normalizeUniqueStringEntries(utterances.map((utterance) => utterance.speaker?.label ?? "")),
		source: "heuristic",
		transcript: utterances.map(formatSpeakerLine).filter(Boolean),
		decisions: collectMatches(utterances, DECISION_PATTERNS),
		actionItems: collectMatches(utterances, ACTION_PATTERNS),
		risks: collectMatches(utterances, RISK_PATTERNS),
		utteranceCount: params.utterances.length
	};
}
function renderList(items) {
	return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None captured";
}
/** Render a transcript summary as markdown for local artifacts. */
function renderTranscriptsMarkdown(summary) {
	return [
		`# ${summary.title}`,
		"",
		`Generated: ${summary.generatedAt}`,
		`Session: ${sanitizeTerminalText(summary.sessionId)}`,
		"",
		"## Overview",
		summary.overview,
		"",
		"## Participants",
		renderList(summary.participants ?? []),
		"",
		"## Decisions",
		renderList(summary.decisions),
		"",
		"## Action Items",
		renderList(summary.actionItems),
		"",
		"## Risks",
		renderList(summary.risks),
		"",
		"## Transcript",
		renderList(summary.transcript),
		"",
		`Transcript utterances: ${summary.utteranceCount}`
	].join("\n");
}
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
		write: async (tempPath) => await fs$1.writeFile(tempPath, content, { mode: 384 })
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
	await (await fs$1.open(probePath, "wx", 384)).close();
	try {
		try {
			await fs$1.access(alternatePath);
			return false;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
			throw error;
		}
	} finally {
		await fs$1.rm(probePath, { force: true });
	}
}
//#endregion
//#region src/transcripts/store-export-jsonl.ts
const TRANSCRIPT_EXPORT_ROW_BATCH_SIZE = 64;
async function writeTranscriptJsonlArtifact(params) {
	ensureMeetingTranscriptsSchema(params.databaseOptions);
	const database = openOpenClawStateDatabase(params.databaseOptions);
	const sequenceHead = executeSqliteQueryTakeFirstSync(database.db, meetingTranscriptSessionQuery(database.db, params.session).select("next_utterance_seq"))?.next_utterance_seq;
	if (sequenceHead === void 0) throw new Error(`transcripts session not found: ${params.session.sessionId}`);
	const digest = createHash("sha256");
	await writeExternalFileWithinRoot({
		rootDir: params.sessionDir,
		path: "transcript.jsonl",
		write: async (tempPath) => {
			const handle = await fs$1.open(tempPath, "w", 384);
			try {
				let nextSequence = 0;
				while (nextSequence < sequenceHead) {
					const rows = executeSqliteQuerySync(database.db, meetingTranscriptUtteranceQuery(database.db, params.session).selectAll().where("sequence", ">=", nextSequence).where("sequence", "<", sequenceHead).orderBy("sequence", "asc").limit(TRANSCRIPT_EXPORT_ROW_BATCH_SIZE)).rows;
					if (rows.length === 0) break;
					nextSequence = rows.at(-1).sequence + 1;
					const lines = rows.map((row) => `${JSON.stringify(utteranceFromRow(row))}\n`);
					for (const line of lines) {
						await handle.writeFile(line);
						digest.update(line);
					}
				}
			} finally {
				await handle.close();
			}
		}
	});
	return digest.digest("hex");
}
//#endregion
//#region src/transcripts/store-export-ownership.ts
async function transcriptArtifactsMatchOwner(sessionDir, artifacts, owner) {
	const manifest = parseTranscriptExportManifest(owner.export_manifest_json);
	const pending = parseTranscriptPendingExports(owner.export_pending_json);
	for (const { entry, canonicalName } of artifacts) {
		const artifactPath = path.join(sessionDir, entry.name);
		const stat = await fs$1.lstat(artifactPath);
		const expectedHash = manifest[canonicalName];
		if (stat.isSymbolicLink() || !stat.isFile() || pending.has(canonicalName) || !expectedHash || await sha256File(artifactPath) !== expectedHash) return false;
	}
	return artifacts.length > 0;
}
async function assertTranscriptExportPathAvailable(params) {
	const { collisions } = params;
	if (collisions.length <= 1) return;
	const ensured = await ensureAbsoluteDirectory(params.exportRootDir, {
		mode: 448,
		scopeLabel: "transcript export root"
	});
	if (!ensured.ok) throw ensured.error;
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return;
	let ownerSelector;
	try {
		const metadata = JSON.parse(await fs$1.readFile(path.join(params.exportRootDir, collisions[0].selector, "metadata.json"), "utf8"));
		ownerSelector = collisions.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt)?.selector;
	} catch (error) {
		if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
			if (!(error instanceof SyntaxError)) throw error;
		}
	}
	if (!ownerSelector) {
		const pendingOwners = collisions.filter((row) => parseTranscriptPendingExports(row.export_pending_json).has("metadata.json"));
		if (pendingOwners.length === 1) ownerSelector = pendingOwners[0]?.selector;
	}
	ownerSelector ??= params.selector;
	if (ownerSelector !== params.selector) throw new Error(`transcript export path collides case-insensitively with another session: ${path.join(params.exportRootDir, params.selector)}`);
}
async function hasAliasedCanonicalTranscriptExportPathOwner(params) {
	const { owners } = params;
	if (owners.length === 0) return false;
	try {
		await fs$1.access(params.exportRootDir);
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return false;
		throw error;
	}
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return false;
	const sessionDir = path.join(params.exportRootDir, params.selector);
	let entries;
	try {
		entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return true;
		throw error;
	}
	const artifactCaseSensitive = await isCaseSensitiveDirectory(sessionDir);
	const artifacts = entries.flatMap((entry) => {
		const canonicalName = artifactCaseSensitive ? entry.name : entry.name.toLowerCase();
		return TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName) ? [{
			entry,
			canonicalName
		}] : [];
	});
	if (artifacts.length === 0) return true;
	let owner;
	const metadataArtifact = artifacts.find(({ canonicalName }) => canonicalName === "metadata.json");
	if (metadataArtifact) {
		const metadataPath = path.join(sessionDir, metadataArtifact.entry.name);
		const metadataStat = await fs$1.lstat(metadataPath);
		if (metadataStat.isSymbolicLink() || !metadataStat.isFile()) return false;
		let handle;
		try {
			handle = await fs$1.open(metadataPath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			const metadata = JSON.parse(await handle.readFile("utf8"));
			owner = owners.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt);
		} catch {
			return false;
		} finally {
			await handle?.close();
		}
	}
	if (!owner && !metadataArtifact) {
		const manifestMatches = [];
		for (const candidate of owners) if (await transcriptArtifactsMatchOwner(sessionDir, artifacts, candidate)) manifestMatches.push(candidate);
		owner = manifestMatches.length === 1 ? manifestMatches[0] : void 0;
	}
	return owner !== void 0 && await transcriptArtifactsMatchOwner(sessionDir, artifacts, owner);
}
//#endregion
//#region src/transcripts/store.ts
/** Canonical meeting-capture transcript store. Files are explicit exports only. */
var TranscriptsStore = class {
	constructor(exportRootDir, databaseOptions = {}) {
		this.exportRootDir = exportRootDir;
		this.databaseOptions = databaseOptions;
	}
	database() {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		return openOpenClawStateDatabase(this.databaseOptions);
	}
	transaction(operationLabel, operation) {
		runOpenClawStateWriteTransaction(operation, this.databaseOptions, { operationLabel });
	}
	sessionDir(session) {
		return path.join(this.exportRootDir, transcriptSessionSelector(session));
	}
	async readWorker(type, request) {
		const context = captureOpenClawStateWorkerContext(this.databaseOptions);
		const input = structuredClone(request);
		input.readOnly = this.databaseOptions.readOnly;
		const preparation = type === "transcripts.readEntries" ? prepareTranscriptDateReader(context.admission.assertCurrent, context.admission.databasePath) : void 0;
		const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type,
			input
		}), preparation);
		context.admission.assertCurrent();
		preparation?.assertCurrent();
		if (!result.ok) throw new TranscriptLibraryError(result.error.type, result.error.message, result.error.maxBytes);
		return result.value;
	}
	entryFromSession(session, selector, hasSummary) {
		const sessionDir = this.sessionDir(session);
		return {
			session,
			sessionDir,
			selector,
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary
		};
	}
	async readExportOwnership(session) {
		const row = await this.readWorker("transcripts.exportOwnership", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
		return row ? {
			manifest: parseTranscriptExportManifest(row.export_manifest_json),
			pending: parseTranscriptPendingExports(row.export_pending_json)
		} : {
			manifest: {},
			pending: /* @__PURE__ */ new Set()
		};
	}
	async readSessionByIdentity({ sessionId, startedAt }) {
		return this.readWorker("transcripts.session", { params: { session: {
			sessionId,
			startedAt
		} } });
	}
	async expectedExportHashes(session) {
		const storedSession = await this.readSessionByIdentity(session);
		if (!storedSession) return {};
		const hashes = {
			"metadata.json": sha256Hex(`${JSON.stringify(storedSession, null, 2)}\n`),
			"transcript.jsonl": await this.readWorker("transcripts.exportDigest", { params: { session: {
				sessionId: storedSession.sessionId,
				startedAt: storedSession.startedAt
			} } })
		};
		const summary = await this.readSummary(storedSession);
		if (summary.summary) hashes["summary.json"] = sha256Hex(`${JSON.stringify(summary.summary, null, 2)}\n`);
		if (summary.markdown !== void 0) hashes["summary.md"] = sha256Hex(normalizeExportText(summary.markdown));
		return hashes;
	}
	updateExportManifest(session, exportedHashes, removedExports = /* @__PURE__ */ new Set()) {
		this.transaction("meeting-transcripts.export.record", ({ db }) => {
			updateMeetingTranscriptExportManifestInDatabase(db, session, exportedHashes, removedExports);
		});
	}
	markPendingExports(session, fileNames) {
		this.transaction("meeting-transcripts.export.pending", ({ db }) => {
			markMeetingTranscriptPendingExportsInDatabase(db, session, fileNames);
		});
	}
	async assertExportDestinationOwned(session, sessionDir = this.sessionDir(session)) {
		let entries;
		try {
			entries = await fs$1.readdir(sessionDir, { withFileTypes: true });
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
			throw error;
		}
		const ownership = await this.readExportOwnership(session);
		const caseSensitive = await isCaseSensitiveDirectory(sessionDir);
		let expectedHashes;
		const repairedHashes = {};
		for (const entry of entries) {
			const canonicalName = caseSensitive ? entry.name : entry.name.toLowerCase();
			if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName)) continue;
			const filePath = path.join(sessionDir, entry.name);
			const stat = await fs$1.lstat(filePath);
			if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			const actualHash = await sha256File(filePath);
			if (ownership.manifest[canonicalName] === actualHash || ownership.pending.has(canonicalName)) continue;
			expectedHashes ??= await this.expectedExportHashes(session);
			if (expectedHashes[canonicalName] !== actualHash) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			repairedHashes[canonicalName] = actualHash;
		}
		if (Object.keys(repairedHashes).length > 0) this.updateExportManifest(session, repairedHashes);
	}
	async listSessionEntries() {
		return (await this.readWorker("transcripts.sessionEntries", { params: void 0 })).map(({ session, selector, hasSummary }) => this.entryFromSession(session, selector, hasSummary));
	}
	async *iterateReadEntries(options = {}) {
		return yield* iterateOpenClawStateDatabaseReadOnly(this.database(), ({ db }) => iterateTranscriptReadEntries(db, options), this.databaseOptions.env);
	}
	async readEntry(selector, purpose = "page") {
		return this.readWorker("transcripts.entry", { params: {
			selector,
			purpose
		} });
	}
	async readLatestEntry() {
		return this.readWorker("transcripts.latest", { params: void 0 });
	}
	async readNotes(session, purpose = "page") {
		return this.readWorker("transcripts.notes", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			purpose
		} });
	}
	async readLibraryEntry(params) {
		return this.readWorker("transcripts.libraryEntry", { params });
	}
	async *iterateExport(selector, includeNotes) {
		return yield* iterateOpenClawStateDatabaseReadOnly(this.database(), ({ db }) => iterateTranscriptExport(db, selector, includeNotes), this.databaseOptions.env);
	}
	async readRecentStoppedSession(source, stoppedAfter, stoppedBefore) {
		return this.readWorker("transcripts.recentStopped", { params: {
			source,
			stoppedAfter,
			stoppedBefore
		} });
	}
	async readSummaryInputRevision(session) {
		return this.readWorker("transcripts.summaryRevision", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
	}
	summaryScope(session) {
		return JSON.stringify([
			path.resolve(this.databaseOptions.path ?? resolveOpenClawStateSqlitePath(this.databaseOptions.env)),
			session.sessionId,
			session.startedAt
		]);
	}
	async readSummarySnapshot(session, maxUtterances) {
		return this.readWorker("transcripts.summarySnapshot", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			maxUtterances
		} });
	}
	async listReadEntries(options) {
		return this.readWorker("transcripts.readEntries", { params: options });
	}
	async writeSession(session, condition) {
		ensureMeetingTranscriptsSchema(this.databaseOptions);
		const selector = transcriptSessionSelector(session);
		assertMeetingTranscriptSelectorAvailableInDatabase(this.database().db, session, selector);
		if (!await this.readSessionByIdentity(session) && !await hasAliasedCanonicalTranscriptExportPathOwner({
			selector: transcriptSessionSelector(session),
			exportRootDir: this.exportRootDir,
			owners: await this.readWorker("transcripts.exportPathOwners", { params: { exportKey: transcriptSessionExportKey(session) } })
		})) {
			await this.assertExportDestinationOwned(session);
			const legacySelector = legacyTranscriptSessionSelector(session);
			if (legacySelector !== void 0) {
				const legacySessionDir = path.join(this.exportRootDir, legacySelector);
				const legacyRow = this.readCanonicalSelectorRow(this.database().db, legacySelector);
				const legacyOwner = legacyRow ? sessionFromRow(legacyRow) : void 0;
				const legacyPathIsCanonical = legacyOwner !== void 0 && path.resolve(this.sessionDir(legacyOwner)) === path.resolve(legacySessionDir);
				if (path.resolve(legacySessionDir) !== path.resolve(this.sessionDir(session)) && !legacyPathIsCanonical) await this.assertExportDestinationOwned(session, legacySessionDir);
			}
		}
		const sessionValues = {
			selector,
			export_key: transcriptSessionExportKey(session),
			session_slug: safeTranscriptPathSegment(session.sessionId),
			provider_id: session.source.providerId,
			title: session.title ?? null,
			source_json: JSON.stringify(session.source),
			stopped_at: session.stoppedAt ?? null,
			metadata_json: session.metadata ? JSON.stringify(session.metadata) : null
		};
		const now = Date.now();
		this.transaction("meeting-transcripts.session.write", ({ db: database }) => {
			condition?.assertCurrent?.();
			writeMeetingTranscriptSessionInDatabase(database, {
				session,
				sessionValues,
				now,
				expectedInputRevision: condition?.expectedInputRevision
			});
		});
	}
	async readSession(sessionSelector) {
		return (await this.readSessionEntry(sessionSelector))?.session;
	}
	async readSessionEntry(sessionSelector) {
		const { qualified, unqualified } = await this.matchSessionEntries(sessionSelector);
		const entries = qualified.length ? qualified : unqualified;
		if (entries.length > 1) throw new Error(`multiple transcripts sessions match ${sessionSelector}; use one of: ${entries.map((entry) => entry.selector).join(", ")}`);
		const matched = entries[0];
		if (!matched) return;
		const { inputRevision: _inputRevision, ...entry } = matched;
		return entry;
	}
	readCanonicalSelectorRow(database, selector) {
		return executeSqliteQueryTakeFirstSync(database, meetingTranscriptDb(database).selectFrom("meeting_transcript_sessions").selectAll().where("selector", "=", selector));
	}
	async matchSessionEntries(value) {
		const matches = await this.readWorker("transcripts.matches", { params: { value } });
		const entry = (matched) => ({
			...this.entryFromSession(matched.session, matched.selector, matched.hasSummary),
			inputRevision: matched.inputRevision
		});
		return {
			qualified: matches.qualified.map(entry),
			unqualified: matches.unqualified.map(entry)
		};
	}
	async appendUtteranceForSession(session, utterance, schedule) {
		const context = captureOpenClawStateWorkerContext(this.databaseOptions);
		const metadataJson = utterance.metadata ? JSON.stringify(utterance.metadata) : null;
		const now = Date.now();
		const speaker = utterance.speaker;
		const input = {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			utterance: {
				id: utterance.id,
				startedAt: utterance.startedAt,
				endedAt: utterance.endedAt,
				speaker: speaker ? {
					id: speaker.id,
					label: speaker.label
				} : void 0,
				text: utterance.text,
				final: utterance.final
			},
			metadataJson,
			now,
			readOnly: this.databaseOptions.readOnly
		};
		const append = (assertOwner) => {
			const assertCurrent = () => {
				context.admission.assertCurrent();
				assertOwner?.();
			};
			return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type: "transcripts.append",
				input
			}), {
				assertCurrent,
				createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
			});
		};
		await (schedule ? schedule(append) : append());
	}
	async readUtterancesForSession(session, options = {}) {
		return this.readWorker("transcripts.utterances", { params: {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			maxUtterances: options.maxUtterances
		} });
	}
	async writeSummary(summary, session, condition) {
		const context = captureOpenClawStateWorkerContext(this.databaseOptions);
		const identity = {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		};
		const intendedSummaryPath = path.join(this.sessionDir(session), "summary.md");
		const assertOwner = condition?.assertCurrent;
		const guard = condition ? {
			inputRevision: condition.guard.inputRevision,
			nextSequence: condition.guard.nextSequence,
			summaryRevision: condition.guard.summaryRevision,
			allowAppends: condition.guard.allowAppends
		} : void 0;
		const summaryJson = JSON.stringify(summary);
		const markdown = renderTranscriptsMarkdown(summary);
		const input = {
			session: identity,
			summaryValues: {
				generated_at: summary.generatedAt,
				summary_json: summaryJson,
				markdown,
				utterance_count: summary.utteranceCount
			},
			guard,
			readOnly: this.databaseOptions.readOnly
		};
		const assertCurrent = () => {
			context.admission.assertCurrent();
			assertOwner?.();
		};
		if (!(await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
			type: "transcripts.writeSummary",
			input
		}), {
			assertCurrent,
			createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
		})).ok) throw new TranscriptsSummaryChangedError();
		return intendedSummaryPath;
	}
	async readSummary(session) {
		return this.readWorker("transcripts.summary", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
	}
	async materializeSessionArtifacts(sessionOrSelector, kind) {
		const session = typeof sessionOrSelector === "string" ? await this.readSession(sessionOrSelector) : await this.readSessionByIdentity(sessionOrSelector);
		if (!session) {
			const selector = typeof sessionOrSelector === "string" ? sessionOrSelector : sessionOrSelector.sessionId;
			throw new Error(`transcripts session not found: ${selector}`);
		}
		return await withOpenClawStateLease({
			scope: "meeting-transcript.export",
			key: transcriptSessionExportKey(session),
			database: {
				scope: "shared",
				options: this.databaseOptions
			},
			leaseMs: 6e4,
			waitMs: 1e4,
			leaseLabel: "meeting transcript export lease",
			operationLabel: "meeting-transcripts.export.lease"
		}, async () => await this.materializeSessionArtifactsOwned(session, kind));
	}
	async materializeSessionArtifactsOwned(session, kind) {
		const sessionDir = this.sessionDir(session);
		const includeTranscript = kind === "all" || kind === "transcript";
		const includeSummary = kind === "all" || kind === "summary";
		const storedSummary = includeSummary ? await this.readSummary(session) : {};
		const exportedHashes = {};
		const removedExports = /* @__PURE__ */ new Set();
		await assertTranscriptExportPathAvailable({
			selector: transcriptSessionSelector(session),
			exportRootDir: this.exportRootDir,
			collisions: await this.readWorker("transcripts.exportPathCollisions", { params: { exportKey: transcriptSessionExportKey(session) } })
		});
		await this.assertExportDestinationOwned(session);
		const pendingFiles = [
			"metadata.json",
			...includeTranscript ? ["transcript.jsonl"] : [],
			...includeSummary ? ["summary.json", "summary.md"] : []
		];
		this.markPendingExports(session, pendingFiles);
		const ensured = await ensureAbsoluteDirectory(sessionDir, {
			mode: 448,
			scopeLabel: "transcript export directory"
		});
		if (!ensured.ok) throw ensured.error;
		exportedHashes["metadata.json"] = await writeTranscriptArtifact(sessionDir, "metadata.json", `${JSON.stringify(session, null, 2)}\n`);
		if (includeTranscript) exportedHashes["transcript.jsonl"] = await writeTranscriptJsonlArtifact({
			sessionDir,
			session,
			databaseOptions: this.databaseOptions
		});
		if (includeSummary) {
			const summaries = {
				"summary.json": storedSummary.summary ? `${JSON.stringify(storedSummary.summary, null, 2)}\n` : void 0,
				"summary.md": storedSummary.markdown === void 0 ? void 0 : normalizeExportText(storedSummary.markdown)
			};
			for (const [fileName, content] of Object.entries(summaries)) if (content === void 0) {
				await removeTranscriptArtifact(sessionDir, fileName);
				removedExports.add(fileName);
			} else exportedHashes[fileName] = await writeTranscriptArtifact(sessionDir, fileName, content);
		}
		this.updateExportManifest(session, exportedHashes, removedExports);
		return {
			sessionDir,
			metadataPath: path.join(sessionDir, "metadata.json"),
			transcriptPath: path.join(sessionDir, "transcript.jsonl"),
			summaryJsonPath: path.join(sessionDir, "summary.json"),
			summaryPath: path.join(sessionDir, "summary.md"),
			hasSummary: storedSummary.summary !== void 0 || storedSummary.markdown !== void 0
		};
	}
};
//#endregion
export { transcriptSessionExportKey as a, summarizeTranscripts as c, safeTranscriptPathSegment as i, TRANSCRIPT_EXPORT_FILE_NAMES as n, transcriptSessionSelector as o, normalizeExportText as r, renderTranscriptsMarkdown as s, TranscriptsStore as t };
