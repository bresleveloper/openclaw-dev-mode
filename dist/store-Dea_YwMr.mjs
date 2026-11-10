import { d as normalizeStringEntries, h as normalizeUniqueStringEntries } from "./string-normalization-D6DKCpwE.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { r as sha256File } from "./crypto-digest-y6oZN-_F.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { o as ensureAbsoluteDirectory$1 } from "./fs-safe-6Z4UiMS4.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
import { n as runWithOpenClawStateLeaseWorker } from "./openclaw-state-lease-worker-operation-DL82kt2g.mjs";
import { t as isTranscriptArtifactText } from "./transcription-text-DGY3Kmgr.mjs";
import { i as TranscriptsSummaryChangedError, n as parseTranscriptPendingExports, r as TranscriptSessionConflictError, t as parseTranscriptExportManifest } from "./store-export-state-CLAn-a3x.mjs";
import { n as prepareTranscriptDateReader, r as TranscriptLibraryError } from "./store-date-preparation-B2niPXMn.mjs";
import { C as writeTranscriptArtifact, S as transcriptSessionSelector, _ as legacyTranscriptSessionSelector, b as safeTranscriptPathSegment, g as isCaseSensitiveDirectory, h as TRANSCRIPT_EXPORT_FILE_NAMES, u as sessionFromRow, v as normalizeExportText, w as writeTranscriptArtifactFile, x as transcriptSessionExportKey, y as removeTranscriptArtifact } from "./store-sqlite-DPxaUsRY.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
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
//#endregion
//#region src/transcripts/store-export-jsonl.ts
async function writeTranscriptJsonlArtifact(params) {
	const digest = createHash("sha256");
	const session = {
		sessionId: params.session.sessionId,
		startedAt: params.session.startedAt
	};
	await writeTranscriptArtifactFile({
		rootDir: params.sessionDir,
		fileName: "transcript.jsonl",
		assertBeforeMutation: params.assertOwner,
		signal: params.signal,
		write: async (filePath) => {
			const handle = await fs.open(filePath, "wx", 384);
			try {
				await params.operation.streamExport({
					type: "meetingTranscripts.export",
					format: "artifact",
					session
				}, async (chunk, signal) => {
					signal.throwIfAborted();
					if (chunk.format !== "artifact") throw new Error("Unexpected transcript artifact chunk.");
					await handle.writeFile(chunk.jsonl, { signal });
					digest.update(chunk.jsonl);
				}, params.signal);
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
		const stat = await fs.lstat(artifactPath);
		const expectedHash = manifest[canonicalName];
		if (stat.isSymbolicLink() || !stat.isFile() || pending.has(canonicalName) || !expectedHash || await sha256File(artifactPath) !== expectedHash) return false;
	}
	return artifacts.length > 0;
}
async function assertTranscriptExportPathAvailable(params) {
	const { collisions } = params;
	if (collisions.length <= 1) return;
	const ensured = await ensureAbsoluteDirectory$1(params.exportRootDir, {
		mode: 448,
		scopeLabel: "transcript export root"
	});
	if (!ensured.ok) throw ensured.error;
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return;
	let ownerSelector;
	try {
		const metadata = JSON.parse(await fs.readFile(path.join(params.exportRootDir, collisions[0].selector, "metadata.json"), "utf8"));
		ownerSelector = collisions.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt)?.selector;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") && !(error instanceof SyntaxError)) throw error;
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
		await fs.access(params.exportRootDir);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
	if (await isCaseSensitiveDirectory(params.exportRootDir)) return false;
	const sessionDir = path.join(params.exportRootDir, params.selector);
	let entries;
	try {
		entries = await fs.readdir(sessionDir, { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return true;
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
		const metadataStat = await fs.lstat(metadataPath);
		if (metadataStat.isSymbolicLink() || !metadataStat.isFile()) return false;
		try {
			const { buffer } = await readRegularFile({ filePath: metadataPath });
			const metadata = JSON.parse(buffer.toString("utf8"));
			owner = owners.find((row) => row.session_id === metadata.sessionId && row.started_at === metadata.startedAt);
		} catch {
			return false;
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
//#region src/transcripts/store-worker-client.ts
/** One captured database generation spans planning, filesystem work, and persistence. */
function createTranscriptStoreOperation(options, assertOwner) {
	const context = captureOpenClawStateWorkerContext(options);
	const readOnly = options.readOnly;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertOwner?.();
	};
	return {
		assertCurrent,
		databaseOptions: {
			env: context.environment,
			path: context.admission.databasePath,
			readOnly
		},
		async streamExport(command, consume, signal) {
			const input = structuredClone(command);
			if (!context.admission.identity.key.startsWith("file:") && !readOnly) await runOpenClawStateWorkerOperation(context, async () => void 0, { assertCurrent });
			const reply = await executeExistingOpenClawStateRead({
				path: context.admission.databasePath,
				env: context.environment
			}, input, {
				context,
				signal,
				live: true,
				async onChunkAsync(value, chunkSignal) {
					assertCurrent();
					await consume(value, chunkSignal);
					assertCurrent();
				}
			});
			assertCurrent();
			if (!reply?.ok || reply.type !== "meetingTranscripts.export") throw new Error("Transcript export ended before completion.");
			if (!reply.result.ok) {
				const { type, message, maxBytes } = reply.result.error;
				throw new TranscriptLibraryError(type, message, maxBytes);
			}
			return reply.result.read;
		},
		async writeExport(type, request, lease) {
			const input = {
				...structuredClone(request),
				readOnly
			};
			assertCurrent();
			await runWithOpenClawStateLeaseWorker(lease, context, (scope, identity) => scope.execute({
				type,
				input: {
					...input,
					lease: identity
				}
			}));
		},
		async read(type, request) {
			const input = structuredClone(request);
			input.readOnly = readOnly;
			const preparation = type === "transcripts.readEntries" ? prepareTranscriptDateReader(assertCurrent, context.admission.databasePath) : { assertCurrent };
			const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type,
				input
			}), preparation);
			preparation.assertCurrent();
			if (!result.ok) throw new TranscriptLibraryError(result.error.type, result.error.message, result.error.maxBytes);
			return result.value;
		},
		async write(type, request, assertWriteOwner) {
			const input = {
				...structuredClone(request),
				readOnly
			};
			const assertWriteCurrent = () => {
				assertCurrent();
				assertWriteOwner?.();
			};
			return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
				type,
				input
			}), {
				assertCurrent: assertWriteCurrent,
				createAdmission: createSqliteWorkerWriteAdmission(assertWriteCurrent, [context.admission.databasePath])
			});
		}
	};
}
//#endregion
//#region src/transcripts/store.ts
let transcriptListCache;
/** Canonical meeting-capture transcript store. Files are explicit exports only. */
var TranscriptsStore = class {
	constructor(exportRootDir, databaseOptions = {}) {
		this.exportRootDir = exportRootDir;
		this.databaseOptions = databaseOptions;
	}
	sessionDir(session) {
		return path.join(this.exportRootDir, transcriptSessionSelector(session));
	}
	async readWorker(type, request) {
		return createTranscriptStoreOperation(this.databaseOptions).read(type, request);
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
	async readSessionByIdentity({ sessionId, startedAt }, operation) {
		return operation.read("transcripts.session", { params: { session: {
			sessionId,
			startedAt
		} } });
	}
	async expectedExportHashes(session, operation) {
		const storedSession = await this.readSessionByIdentity(session, operation);
		if (!storedSession) return {};
		const hashes = {
			"metadata.json": sha256Hex(`${JSON.stringify(storedSession, null, 2)}\n`),
			"transcript.jsonl": await operation.read("transcripts.exportDigest", { params: { session: {
				sessionId: storedSession.sessionId,
				startedAt: storedSession.startedAt
			} } })
		};
		const summary = await operation.read("transcripts.summary", { params: { session: storedSession } });
		if (summary.summary) hashes["summary.json"] = sha256Hex(`${JSON.stringify(summary.summary, null, 2)}\n`);
		if (summary.markdown !== void 0) hashes["summary.md"] = sha256Hex(normalizeExportText(summary.markdown));
		return hashes;
	}
	async updateExportManifest(session, exportedHashes, removedExports, operation, lease) {
		const input = {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			exportedHashes: { ...exportedHashes },
			removedExports: [...removedExports]
		};
		if (lease) await operation.writeExport("transcripts.recordExportManifest", input, lease);
		else await operation.write("transcripts.recordExportManifest", input);
	}
	async assertExportDestinationOwned(session, sessionDir, operation, lease) {
		let entries;
		try {
			entries = await fs.readdir(sessionDir, { withFileTypes: true });
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		}
		const row = await operation.read("transcripts.exportOwnership", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
		const manifest = row ? parseTranscriptExportManifest(row.export_manifest_json) : {};
		const pending = row ? parseTranscriptPendingExports(row.export_pending_json) : /* @__PURE__ */ new Set();
		const caseSensitive = await isCaseSensitiveDirectory(sessionDir);
		let expectedHashes;
		const repairedHashes = {};
		for (const entry of entries) {
			const canonicalName = caseSensitive ? entry.name : entry.name.toLowerCase();
			if (!TRANSCRIPT_EXPORT_FILE_NAMES.has(canonicalName)) continue;
			const filePath = path.join(sessionDir, entry.name);
			const stat = await fs.lstat(filePath);
			if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			const actualHash = await sha256File(filePath);
			if (manifest[canonicalName] === actualHash || pending.has(canonicalName)) continue;
			expectedHashes ??= await this.expectedExportHashes(session, operation);
			if (expectedHashes[canonicalName] !== actualHash) throw new Error(`legacy transcript artifacts require migration before writing ${sessionDir}; run openclaw doctor --fix`);
			repairedHashes[canonicalName] = actualHash;
		}
		if (Object.keys(repairedHashes).length > 0) await this.updateExportManifest(session, repairedHashes, /* @__PURE__ */ new Set(), operation, lease);
	}
	async listSessionEntries() {
		return (await this.readWorker("transcripts.sessionEntries", { params: void 0 })).map(({ session, selector, hasSummary }) => this.entryFromSession(session, selector, hasSummary));
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
	async streamExport(selector, includeNotes, consume, signal) {
		const result = await createTranscriptStoreOperation(this.databaseOptions).streamExport({
			type: "meetingTranscripts.export",
			format: "library",
			selector,
			includeNotes
		}, async (chunk) => {
			if (chunk.format !== "library") throw new Error("Unexpected transcript export chunk.");
			await consume(chunk.utterances);
		}, signal);
		if (!result) throw new Error("Transcript export ended before completion.");
		return result;
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
		const operation = createTranscriptStoreOperation(this.databaseOptions);
		operation.assertCurrent();
		const writeToken = readSqliteDatabaseWriteTokenForPath(operation.databaseOptions.path);
		const key = JSON.stringify([
			operation.databaseOptions.path,
			operation.databaseOptions.readOnly,
			process.env.TZ,
			options
		]);
		if (writeToken && transcriptListCache?.writeToken === writeToken && transcriptListCache.key === key) return structuredClone(transcriptListCache.page);
		const page = await operation.read("transcripts.readEntries", { params: options });
		if (writeToken) transcriptListCache = {
			key,
			writeToken,
			page: structuredClone(page)
		};
		return page;
	}
	async writeSession(inputSession, condition) {
		const operation = createTranscriptStoreOperation(this.databaseOptions, condition?.assertCurrent);
		const expectedInputRevision = condition?.expectedInputRevision;
		const expectedSessionRevision = condition?.expectedSessionRevision;
		const session = { ...inputSession };
		const selector = transcriptSessionSelector(session);
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
		const owner = await operation.read("transcripts.canonicalSessionRow", { params: { selector } });
		if (owner && (owner.session_id !== session.sessionId || owner.started_at !== session.startedAt)) throw new TranscriptSessionConflictError();
		if (!await this.readSessionByIdentity(session, operation) && !await hasAliasedCanonicalTranscriptExportPathOwner({
			selector: transcriptSessionSelector(session),
			exportRootDir: this.exportRootDir,
			owners: await operation.read("transcripts.exportPathOwners", { params: { exportKey: transcriptSessionExportKey(session) } })
		})) {
			await this.assertExportDestinationOwned(session, this.sessionDir(session), operation);
			const legacySelector = legacyTranscriptSessionSelector(session);
			if (legacySelector !== void 0) {
				const legacySessionDir = path.join(this.exportRootDir, legacySelector);
				const legacyRow = await operation.read("transcripts.canonicalSessionRow", { params: { selector: legacySelector } });
				const legacyOwner = legacyRow ? sessionFromRow(legacyRow) : void 0;
				const legacyPathIsCanonical = legacyOwner !== void 0 && path.resolve(this.sessionDir(legacyOwner)) === path.resolve(legacySessionDir);
				if (path.resolve(legacySessionDir) !== path.resolve(this.sessionDir(session)) && !legacyPathIsCanonical) await this.assertExportDestinationOwned(session, legacySessionDir, operation);
			}
		}
		const result = await operation.write("transcripts.writeSession", {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			sessionValues,
			now: Date.now(),
			expectedInputRevision,
			expectedSessionRevision
		});
		if (!result.ok) throw result.reason === "conflict" ? new TranscriptSessionConflictError() : new TranscriptsSummaryChangedError();
		return {
			inserted: result.inserted,
			inputRevision: result.inputRevision,
			sessionRevision: result.sessionRevision
		};
	}
	async deleteEmptySessionCandidate(session, condition) {
		await createTranscriptStoreOperation(this.databaseOptions, condition.assertCurrent).write("transcripts.deleteEmptySessionCandidate", {
			session: {
				sessionId: session.sessionId,
				startedAt: session.startedAt
			},
			expectedInputRevision: condition.expectedInputRevision
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
		const operation = createTranscriptStoreOperation(this.databaseOptions);
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
		const append = (assertOwner) => operation.write("transcripts.append", input, assertOwner);
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
		const operation = createTranscriptStoreOperation(this.databaseOptions, condition?.assertCurrent);
		const identity = {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		};
		const intendedSummaryPath = path.join(this.sessionDir(session), "summary.md");
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
		if (!(await operation.write("transcripts.writeSummary", input)).ok) throw new TranscriptsSummaryChangedError();
		return intendedSummaryPath;
	}
	async readSummary(session) {
		return this.readWorker("transcripts.summary", { params: { session: {
			sessionId: session.sessionId,
			startedAt: session.startedAt
		} } });
	}
	async materializeSessionArtifacts(sessionOrSelector, kind) {
		const operation = createTranscriptStoreOperation(this.databaseOptions);
		const session = typeof sessionOrSelector === "string" ? await this.readSession(sessionOrSelector) : await this.readSessionByIdentity(sessionOrSelector, operation);
		if (!session) {
			const selector = typeof sessionOrSelector === "string" ? sessionOrSelector : sessionOrSelector.sessionId;
			throw new Error(`transcripts session not found: ${selector}`);
		}
		operation.assertCurrent();
		return await withOpenClawStateLease({
			scope: "meeting-transcript.export",
			key: transcriptSessionExportKey(session),
			database: {
				scope: "shared",
				options: operation.databaseOptions
			},
			leaseMs: 6e4,
			waitMs: 1e4,
			leaseLabel: "meeting transcript export lease",
			operationLabel: "meeting-transcripts.export.lease"
		}, async (lease) => {
			const assertOwner = () => {
				operation.assertCurrent();
				lease.assertOwned();
			};
			const sessionDir = this.sessionDir(session);
			const includeTranscript = kind === "all" || kind === "transcript";
			const includeSummary = kind === "all" || kind === "summary";
			const storedSummary = includeSummary ? await operation.read("transcripts.summary", { params: { session } }) : {};
			const exportedHashes = {};
			const removedExports = /* @__PURE__ */ new Set();
			await assertTranscriptExportPathAvailable({
				selector: transcriptSessionSelector(session),
				exportRootDir: this.exportRootDir,
				collisions: await operation.read("transcripts.exportPathCollisions", { params: { exportKey: transcriptSessionExportKey(session) } })
			});
			await this.assertExportDestinationOwned(session, sessionDir, operation, lease);
			const pendingFiles = [
				"metadata.json",
				...includeTranscript ? ["transcript.jsonl"] : [],
				...includeSummary ? ["summary.json", "summary.md"] : []
			];
			await operation.writeExport("transcripts.markPendingExports", {
				session: {
					sessionId: session.sessionId,
					startedAt: session.startedAt
				},
				fileNames: pendingFiles
			}, lease);
			assertOwner();
			const ensured = await ensureAbsoluteDirectory$1(sessionDir, {
				mode: 448,
				scopeLabel: "transcript export directory"
			});
			if (!ensured.ok) throw ensured.error;
			assertOwner();
			exportedHashes["metadata.json"] = await writeTranscriptArtifact(sessionDir, "metadata.json", `${JSON.stringify(session, null, 2)}\n`, assertOwner);
			if (includeTranscript) {
				assertOwner();
				exportedHashes["transcript.jsonl"] = await writeTranscriptJsonlArtifact({
					sessionDir,
					session,
					operation,
					assertOwner,
					signal: lease.signal
				});
			}
			if (includeSummary) {
				const summaries = {
					"summary.json": storedSummary.summary ? `${JSON.stringify(storedSummary.summary, null, 2)}\n` : void 0,
					"summary.md": storedSummary.markdown === void 0 ? void 0 : normalizeExportText(storedSummary.markdown)
				};
				for (const [fileName, content] of Object.entries(summaries)) {
					assertOwner();
					if (content === void 0) {
						await removeTranscriptArtifact(sessionDir, fileName, assertOwner);
						removedExports.add(fileName);
					} else exportedHashes[fileName] = await writeTranscriptArtifact(sessionDir, fileName, content, assertOwner);
				}
			}
			await this.updateExportManifest(session, exportedHashes, removedExports, operation, lease);
			return {
				sessionDir,
				metadataPath: path.join(sessionDir, "metadata.json"),
				transcriptPath: path.join(sessionDir, "transcript.jsonl"),
				summaryJsonPath: path.join(sessionDir, "summary.json"),
				summaryPath: path.join(sessionDir, "summary.md"),
				hasSummary: storedSummary.summary !== void 0 || storedSummary.markdown !== void 0
			};
		});
	}
};
//#endregion
export { renderTranscriptsMarkdown as n, summarizeTranscripts as r, TranscriptsStore as t };
