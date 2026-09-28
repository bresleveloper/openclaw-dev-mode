import "./fs-safe-BAPek8At.mjs";
import { p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-C_0BsNDD.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-BKe2aOQN.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CJXR3a08.mjs";
import { m as sanitizeConfigAuditRecord } from "./io.audit-CcH6Zt2-.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region src/infra/state-migrations.audit-checkpoints.ts
const LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE = "migration.legacy-audit-raw";
const LEGACY_AUDIT_RAW_CHECKPOINT_MAX_ENTRIES = 1e4;
function legacyAuditRawCheckpointKey(checkpoint) {
	return checkpoint.generationKey;
}
function legacyAuditSourceGenerationKey(rawArchiveRelativePath) {
	return createHash("sha256").update(rawArchiveRelativePath.replace(/\\/gu, "/")).digest("hex").slice(0, 16);
}
function openLegacyAuditRawCheckpointStore(stateDir) {
	return createSqliteAuditRecordStore({
		scope: LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE,
		maxEntries: LEGACY_AUDIT_RAW_CHECKPOINT_MAX_ENTRIES,
		env: {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		}
	});
}
function hasLegacyAuditRawCheckpointCapacity(stateDir, rawArchiveRelativePath) {
	const generationKey = legacyAuditSourceGenerationKey(rawArchiveRelativePath);
	const entries = openLegacyAuditRawCheckpointStore(stateDir).entries();
	return entries.some((entry) => entry.value.generationKey === generationKey) || entries.length < LEGACY_AUDIT_RAW_CHECKPOINT_MAX_ENTRIES;
}
function statLegacyAuditRawCheckpoint(sourcePath) {
	try {
		const stat = fs.lstatSync(sourcePath);
		if (!stat.isFile() || stat.isSymbolicLink()) return;
		return {
			dev: stat.dev,
			ino: stat.ino,
			mtimeMs: stat.mtimeMs,
			size: stat.size
		};
	} catch {
		return;
	}
}
function legacyAuditRawCheckpointsMatch(left, right) {
	return left !== void 0 && right !== void 0 && left.dev === right.dev && left.ino === right.ino && left.mtimeMs === right.mtimeMs && left.size === right.size;
}
function legacyAuditRawCheckpointIsCurrent(sourcePath, checkpoint) {
	let fd;
	try {
		fd = fs.openSync(sourcePath, "r");
		const beforeStat = fs.fstatSync(fd);
		const before = {
			dev: beforeStat.dev,
			ino: beforeStat.ino,
			mtimeMs: beforeStat.mtimeMs,
			size: beforeStat.size
		};
		if (!beforeStat.isFile() || !legacyAuditRawCheckpointsMatch(checkpoint, before)) return false;
		const hash = sha256FileSync(fd, { maxBytes: checkpoint.size });
		const afterStat = fs.fstatSync(fd);
		return legacyAuditRawCheckpointsMatch(before, {
			dev: afterStat.dev,
			ino: afterStat.ino,
			mtimeMs: afterStat.mtimeMs,
			size: afterStat.size
		}) && hash.bytes === checkpoint.size && hash.digest === checkpoint.contentHash;
	} catch {
		return false;
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
function detectLegacyAuditLogs(params) {
	const logicalSources = [
		{
			kind: "config",
			label: "config audit log",
			sourcePath: path.join(params.stateDir, "logs", "config-audit.jsonl")
		},
		{
			kind: "system-agent",
			label: "system-agent audit log",
			sourcePath: path.join(params.stateDir, "audit", "system-agent.jsonl")
		},
		{
			kind: "crestodian",
			label: "Crestodian audit log",
			sourcePath: path.join(params.stateDir, "audit", "crestodian.jsonl")
		}
	];
	if (params.doctorOnlyStateMigrations !== true) return {
		sources: [],
		hasLegacy: false
	};
	let checkpoints;
	const loadCheckpoints = () => {
		if (checkpoints) return checkpoints;
		try {
			checkpoints = openLegacyAuditRawCheckpointStore(params.stateDir).entries().map((entry) => entry.value);
		} catch {
			checkpoints = [];
		}
		return checkpoints;
	};
	const sources = [];
	for (const logical of logicalSources) {
		let directoryEntries = [];
		try {
			directoryEntries = fs.readdirSync(path.dirname(logical.sourcePath));
		} catch {}
		const baseName = path.basename(logical.sourcePath).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		const rawArchivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?\\.raw$`, "u");
		const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
		const rawArchives = directoryEntries.flatMap((entry) => {
			const match = rawArchivePattern.exec(entry);
			return match ? [{
				entry,
				generation: BigInt(match[1] ?? "1")
			}] : [];
		}).toSorted((left, right) => (left.generation < right.generation ? -1 : left.generation > right.generation ? 1 : 0) || left.entry.localeCompare(right.entry));
		for (const { entry } of rawArchives) {
			const rawPath = path.join(path.dirname(logical.sourcePath), entry);
			const generationKey = legacyAuditSourceGenerationKey(path.relative(path.resolve(params.stateDir), rawPath));
			const checkpoint = statLegacyAuditRawCheckpoint(rawPath);
			if (!(statLegacyAuditRawCheckpoint(`${rawPath}.doctor-scrub-restore`) !== void 0) && checkpoint && loadCheckpoints().some((candidate) => candidate.generationKey === generationKey && candidate.phase === "raw" && candidate.recordCount === 0 && legacyAuditRawCheckpointsMatch(candidate, checkpoint) && legacyAuditRawCheckpointIsCurrent(rawPath, candidate))) continue;
			sources.push({
				...logical,
				sourcePath: rawPath,
				logicalSourcePath: logical.sourcePath,
				storage: "raw-archive",
				sanitizedArchivePath: rawPath.slice(0, -4)
			});
		}
		const claims = directoryEntries.flatMap((entry) => {
			const match = claimPattern.exec(entry);
			return match ? [{
				entry,
				generation: BigInt(match[1] ?? "1")
			}] : [];
		}).toSorted((left, right) => (left.generation < right.generation ? -1 : left.generation > right.generation ? 1 : 0) || left.entry.localeCompare(right.entry));
		for (const { entry, generation } of claims) {
			const generationSuffix = generation === 1n ? "" : `.${generation}`;
			const sanitizedArchivePath = `${logical.sourcePath}.migrated${generationSuffix}`;
			sources.push({
				...logical,
				sourcePath: path.join(path.dirname(logical.sourcePath), entry),
				logicalSourcePath: logical.sourcePath,
				storage: "claim",
				sanitizedArchivePath,
				rawArchivePath: `${sanitizedArchivePath}.raw`
			});
		}
		if (fs.existsSync(logical.sourcePath)) sources.push({
			...logical,
			logicalSourcePath: logical.sourcePath,
			storage: "active"
		});
	}
	return {
		sources,
		hasLegacy: sources.length > 0
	};
}
//#endregion
//#region src/infra/state-migrations.audit-records.ts
function serializePreparedAuditRecords(records) {
	return records.length > 0 ? `${records.map((record) => JSON.stringify(record.value)).join("\n")}\n` : "";
}
function legacyAuditRecordCreatedAt(source, value) {
	const timestamp = source.kind === "config" ? value.ts : value.timestamp;
	if (typeof timestamp !== "string") return 0;
	const parsed = Date.parse(timestamp);
	return Number.isFinite(parsed) ? parsed : 0;
}
function prepareLegacyAuditRecords(source, raw, sourceGeneration, sourceOrdinalBase = 0) {
	const records = [];
	const warnings = [];
	for (const [index, line] of raw.split(/\r?\n/u).entries()) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		let parsed;
		try {
			parsed = JSON.parse(trimmed);
		} catch (error) {
			warnings.push(`Failed reading ${source.label} record at ${source.sourcePath}:${index + 1}: ${String(error)}`);
			continue;
		}
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			warnings.push(`Skipped non-object ${source.label} record at ${source.sourcePath}:${index + 1}`);
			continue;
		}
		const value = source.kind === "config" ? sanitizeConfigAuditRecord(parsed) : redactSecrets(parsed);
		const digest = createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
		const recordOrdinal = sourceOrdinalBase + records.length + 1;
		records.push({
			key: `legacy:${source.kind}:${sourceGeneration}:${recordOrdinal}:${digest}`,
			value,
			createdAt: legacyAuditRecordCreatedAt(source, value)
		});
	}
	if (warnings.length > 0) return {
		ok: false,
		warnings
	};
	return {
		ok: true,
		records,
		sanitizedJsonl: serializePreparedAuditRecords(records)
	};
}
//#endregion
//#region src/infra/state-migrations.audit-recovery-protocol.ts
const AUDIT_RECOVERY_SCRUB_PATTERN_BYTES$1 = 32;
function serializeAuditRecoveryRestoreJournal(params) {
	const journal = {
		schemaVersion: 6,
		rawBase64: params.rawBytes.toString("base64"),
		scrubPatternBase64: params.scrubPattern.toString("base64"),
		target: params.target
	};
	return `${JSON.stringify(journal)}\n`;
}
function parseAuditRecoveryRestoreJournal(raw) {
	const parsed = JSON.parse(raw);
	if (parsed.schemaVersion !== 6 || typeof parsed.rawBase64 !== "string" || typeof parsed.scrubPatternBase64 !== "string" || !parsed.target || typeof parsed.target.dev !== "number" || typeof parsed.target.ino !== "number" || typeof parsed.target.size !== "number") throw new Error("invalid legacy audit recovery restore journal");
	const scrubPattern = Buffer.from(parsed.scrubPatternBase64, "base64");
	if (scrubPattern.length !== AUDIT_RECOVERY_SCRUB_PATTERN_BYTES$1 || scrubPattern.some((byte) => byte !== 9 && byte !== 32)) throw new Error("invalid legacy audit recovery scrub pattern");
	const sourceRaw = Buffer.from(parsed.rawBase64, "base64");
	if (sourceRaw.length !== parsed.target.size) throw new Error("invalid legacy audit recovery source size");
	return {
		sourceRaw,
		scrubPattern,
		target: parsed.target,
		journalHash: createHash("sha256").update(raw).digest("hex")
	};
}
function serializeAuditRecoveryProgress(progress) {
	return `${JSON.stringify(progress)}\n`;
}
function parseAuditRecoveryProgress(raw, journal) {
	const parsed = JSON.parse(raw);
	if (parsed.schemaVersion !== 1 || parsed.journalHash !== journal.journalHash || parsed.direction !== "restoring" && parsed.direction !== "scrubbing" || !Number.isSafeInteger(parsed.committedBytes) || !Number.isSafeInteger(parsed.pendingEnd) || !Number.isSafeInteger(parsed.extentBytes) || parsed.committedBytes < 0 || parsed.pendingEnd < parsed.committedBytes || parsed.extentBytes < parsed.pendingEnd || parsed.extentBytes > journal.target.size || parsed.direction === "scrubbing" && parsed.extentBytes !== journal.target.size) throw new Error("invalid legacy audit recovery progress");
	return parsed;
}
function auditRecoveryTransitionMatches(current, previous, desired, start, end) {
	let boundary = start;
	while (boundary < end && current[boundary] === desired[boundary]) boundary += 1;
	return current.subarray(boundary, end).equals(previous.subarray(boundary, end));
}
function auditRecoveryStateMatchesJournal(params) {
	const { current, original, scrubbed, progress } = params;
	if (current.length < original.length) return false;
	if (progress.direction === "scrubbing") return current.subarray(0, progress.committedBytes).equals(scrubbed.subarray(0, progress.committedBytes)) && auditRecoveryTransitionMatches(current, original, scrubbed, progress.committedBytes, progress.pendingEnd) && current.subarray(progress.pendingEnd, original.length).equals(original.subarray(progress.pendingEnd));
	return current.subarray(0, progress.committedBytes).equals(original.subarray(0, progress.committedBytes)) && auditRecoveryTransitionMatches(current, scrubbed, original, progress.committedBytes, progress.pendingEnd) && current.subarray(progress.pendingEnd, progress.extentBytes).equals(scrubbed.subarray(progress.pendingEnd, progress.extentBytes)) && current.subarray(progress.extentBytes, original.length).equals(original.subarray(progress.extentBytes));
}
//#endregion
//#region src/infra/state-migrations.audit-recovery.ts
const AUDIT_RECOVERY_RESTORE_SUFFIX = ".doctor-scrub-restore";
const AUDIT_RECOVERY_STAGING_SUFFIX = ".doctor-scrub-staging";
const AUDIT_RECOVERY_PROGRESS_SUFFIX = ".doctor-scrub-progress";
const AUDIT_RECOVERY_SCRUB_PATTERN_BYTES = 32;
function auditRecoverySiblingPath(relativePath, suffix) {
	return `${relativePath}${suffix}`;
}
function auditRecoveryJournalTargetsSnapshot(snapshot, journal) {
	return snapshot.dev === journal.target.dev && snapshot.ino === journal.target.ino && snapshot.rawBytes.length >= journal.target.size;
}
function auditRecoveryCheckpointPrefixMatches(snapshot, checkpoint) {
	if (snapshot.rawBytes.length < checkpoint.size) return false;
	const prefix = snapshot.rawBytes.subarray(0, checkpoint.size);
	return createHash("sha256").update(prefix).digest("hex") === checkpoint.contentHash || createHash("sha256").update(prefix.toString("utf8")).digest("hex") === checkpoint.contentHash;
}
async function syncAuditRecoveryDirectory(root, relativePath) {
	await syncDirectoryIfSupported(path.join(root.rootReal, path.dirname(relativePath)));
}
async function readLegacyAuditSourceSnapshot(root, relativePath) {
	const opened = await root.open(relativePath);
	try {
		const before = await opened.handle.stat();
		if (!before.isFile()) throw new Error("legacy audit source is not a regular file");
		const rawBytes = await opened.handle.readFile();
		const after = await opened.handle.stat();
		const beforeCheckpoint = {
			dev: before.dev,
			ino: before.ino,
			mtimeMs: before.mtimeMs,
			size: before.size
		};
		const afterCheckpoint = {
			dev: after.dev,
			ino: after.ino,
			mtimeMs: after.mtimeMs,
			size: after.size
		};
		if (!legacyAuditRawCheckpointsMatch(beforeCheckpoint, afterCheckpoint)) throw new Error("legacy audit source changed while Doctor was reading it");
		return {
			...afterCheckpoint,
			raw: rawBytes.toString("utf8"),
			rawBytes
		};
	} finally {
		await opened.handle.close();
	}
}
async function readLegacyAuditSourcePrefixSnapshotForBackup(root, relativePath) {
	const opened = await root.open(relativePath);
	try {
		const before = await opened.handle.stat();
		if (!before.isFile()) throw new Error("legacy audit source is not a regular file");
		const rawBytes = Buffer.allocUnsafe(before.size);
		if (await readFileWindowFully(opened.handle, rawBytes, 0) !== rawBytes.length) throw new Error("legacy audit source was truncated while backup was reading it");
		const after = await opened.handle.stat();
		if (before.dev !== after.dev || before.ino !== after.ino || after.size < before.size) throw new Error("legacy audit source changed other than by append during backup");
		return {
			dev: before.dev,
			ino: before.ino,
			mtimeMs: before.mtimeMs,
			size: before.size,
			raw: rawBytes.toString("utf8"),
			rawBytes
		};
	} finally {
		await opened.handle.close();
	}
}
async function readLegacyAuditRecoverySourceForBackup(root, relativePath) {
	const current = await readLegacyAuditSourcePrefixSnapshotForBackup(root, relativePath);
	const restoreRelativePath = auditRecoverySiblingPath(relativePath, AUDIT_RECOVERY_RESTORE_SUFFIX);
	if (!await root.exists(restoreRelativePath)) return current;
	const journal = parseAuditRecoveryRestoreJournal((await readLegacyAuditSourceSnapshot(root, restoreRelativePath)).raw);
	const progress = await readAuditRecoveryProgress({
		root,
		relativePath,
		journal
	});
	const scrubbedContent = buildScrubbedAuditRecoveryContent(journal.sourceRaw, journal.scrubPattern);
	if (!auditRecoveryJournalTargetsSnapshot(current, journal) || !auditRecoveryStateMatchesJournal({
		current: current.rawBytes,
		original: journal.sourceRaw,
		scrubbed: scrubbedContent,
		progress
	})) return current;
	const rawBytes = Buffer.concat([journal.sourceRaw, current.rawBytes.subarray(journal.sourceRaw.length)]);
	return {
		...current,
		raw: rawBytes.toString("utf8"),
		rawBytes
	};
}
function createAuditRecoveryScrubPattern() {
	const pattern = randomBytes(AUDIT_RECOVERY_SCRUB_PATTERN_BYTES);
	for (let index = 0; index < pattern.length; index += 1) pattern[index] = (pattern[index] & 1) === 0 ? 32 : 9;
	for (let offset = 0; offset < pattern.length; offset += 8) {
		const block = pattern.subarray(offset, offset + 8);
		if (block.every((byte) => byte === 32)) pattern[offset + 7] = 9;
		else if (block.every((byte) => byte === 9)) pattern[offset + 7] = 32;
	}
	return pattern;
}
function buildScrubbedAuditRecoveryContent(rawBytes, scrubPattern) {
	if (rawBytes.length === 0) return Buffer.alloc(0);
	const scrubbed = Buffer.allocUnsafe(rawBytes.length);
	for (let offset = 0; offset < scrubbed.length; offset += scrubPattern.length) scrubPattern.copy(scrubbed, offset, 0, Math.min(scrubPattern.length, scrubbed.length - offset));
	return scrubbed;
}
const AUDIT_RECOVERY_WRITE_CHUNK_BYTES = 65536;
async function writeAuditRecoveryProgress(params) {
	const progressRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_PROGRESS_SUFFIX);
	await params.root.write(progressRelativePath, serializeAuditRecoveryProgress(params.progress), {
		mkdir: false,
		mode: 384
	});
	const opened = await params.root.openWritable(progressRelativePath, { writeMode: "update" });
	try {
		await opened.handle.chmod(384);
		await opened.handle.sync();
	} finally {
		await opened.handle.close();
	}
	await syncAuditRecoveryDirectory(params.root, params.relativePath);
}
async function readAuditRecoveryProgress(params) {
	const progressRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_PROGRESS_SUFFIX);
	if (!await params.root.exists(progressRelativePath)) return {
		schemaVersion: 1,
		journalHash: params.journal.journalHash,
		direction: "scrubbing",
		committedBytes: 0,
		pendingEnd: 0,
		extentBytes: params.journal.target.size
	};
	return parseAuditRecoveryProgress((await readLegacyAuditSourceSnapshot(params.root, progressRelativePath)).raw, params.journal);
}
async function advanceAuditRecoveryWrite(params) {
	let progress = params.progress;
	if (progress.pendingEnd > progress.committedBytes) {
		await writeFileWindowFully(params.handle, params.desiredContent.subarray(progress.committedBytes, progress.pendingEnd), progress.committedBytes);
		await params.handle.sync();
		progress = {
			...progress,
			committedBytes: progress.pendingEnd
		};
		await writeAuditRecoveryProgress({
			...params,
			progress
		});
	}
	while (progress.committedBytes < progress.extentBytes) {
		const end = Math.min(progress.committedBytes + AUDIT_RECOVERY_WRITE_CHUNK_BYTES, progress.extentBytes);
		progress = {
			...progress,
			pendingEnd: end
		};
		await writeAuditRecoveryProgress({
			...params,
			progress
		});
		await writeFileWindowFully(params.handle, params.desiredContent.subarray(progress.committedBytes, end), progress.committedBytes);
		await params.handle.sync();
		progress = {
			...progress,
			committedBytes: end
		};
		await writeAuditRecoveryProgress({
			...params,
			progress
		});
	}
	return progress;
}
async function reconcileAuditRecoveryPendingWrite(params) {
	if (params.progress.pendingEnd === params.progress.committedBytes) return params.progress;
	await writeFileWindowFully(params.handle, params.desiredContent.subarray(params.progress.committedBytes, params.progress.pendingEnd), params.progress.committedBytes);
	await params.handle.sync();
	const progress = {
		...params.progress,
		committedBytes: params.progress.pendingEnd
	};
	await writeAuditRecoveryProgress({
		...params,
		progress
	});
	return progress;
}
async function stageAuditRecoveryRestore(params) {
	const restoreRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_RESTORE_SUFFIX);
	const stagingRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_STAGING_SUFFIX);
	await params.root.remove(stagingRelativePath).catch(() => void 0);
	const journalRaw = serializeAuditRecoveryRestoreJournal({
		rawBytes: params.snapshot.rawBytes,
		scrubPattern: params.scrubPattern,
		target: {
			dev: params.snapshot.dev,
			ino: params.snapshot.ino,
			size: params.snapshot.size
		}
	});
	await params.root.create(stagingRelativePath, journalRaw, { mode: 384 });
	const staged = await params.root.openWritable(stagingRelativePath, { writeMode: "update" });
	try {
		await staged.handle.chmod(384);
		await staged.handle.sync();
	} finally {
		await staged.handle.close();
	}
	await params.root.move(stagingRelativePath, restoreRelativePath);
	await syncAuditRecoveryDirectory(params.root, params.relativePath);
	const journal = parseAuditRecoveryRestoreJournal(journalRaw);
	const progress = {
		schemaVersion: 1,
		journalHash: journal.journalHash,
		direction: "scrubbing",
		committedBytes: 0,
		pendingEnd: 0,
		extentBytes: journal.target.size
	};
	await writeAuditRecoveryProgress({
		root: params.root,
		relativePath: params.relativePath,
		progress
	});
	return progress;
}
async function restoreInterruptedAuditRecoveryArchive(params) {
	const restoreRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_RESTORE_SUFFIX);
	const stagingRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_STAGING_SUFFIX);
	const progressRelativePath = auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_PROGRESS_SUFFIX);
	if (!await params.root.exists(restoreRelativePath)) {
		await params.root.remove(stagingRelativePath).catch(() => void 0);
		await params.root.remove(progressRelativePath).catch(() => void 0);
		return true;
	}
	try {
		const currentSnapshot = await readLegacyAuditSourceSnapshot(params.root, params.relativePath);
		const journal = parseAuditRecoveryRestoreJournal((await readLegacyAuditSourceSnapshot(params.root, restoreRelativePath)).raw);
		let progress = await readAuditRecoveryProgress({
			root: params.root,
			relativePath: params.relativePath,
			journal
		});
		const scrubbedContent = buildScrubbedAuditRecoveryContent(journal.sourceRaw, journal.scrubPattern);
		let completedCheckpoint;
		try {
			completedCheckpoint = findPreviousLegacyAuditRawCheckpoint(params.root.rootReal, params.relativePath);
		} catch {
			completedCheckpoint = void 0;
		}
		if (completedCheckpoint && completedCheckpoint.phase === "raw" && completedCheckpoint.recordCount === 0 && completedCheckpoint.size === journal.sourceRaw.length && auditRecoveryCheckpointPrefixMatches(currentSnapshot, completedCheckpoint)) {
			await params.root.remove(progressRelativePath).catch(() => void 0);
			await params.root.remove(stagingRelativePath).catch(() => void 0);
			await params.root.remove(restoreRelativePath);
			await syncAuditRecoveryDirectory(params.root, params.relativePath);
			return true;
		}
		const writable = await params.root.openWritable(params.relativePath, {
			mode: 384,
			writeMode: "update"
		});
		try {
			const verification = await readLegacyAuditSourceSnapshot(params.root, params.relativePath);
			if (writable.stat.dev !== verification.dev || writable.stat.ino !== verification.ino || !auditRecoveryJournalTargetsSnapshot(verification, journal) || !auditRecoveryStateMatchesJournal({
				current: verification.rawBytes,
				original: journal.sourceRaw,
				scrubbed: scrubbedContent,
				progress
			})) throw new Error("legacy recovery archive no longer matches its restore journal target");
			progress = await reconcileAuditRecoveryPendingWrite({
				root: params.root,
				relativePath: params.relativePath,
				progress,
				desiredContent: progress.direction === "scrubbing" ? scrubbedContent : journal.sourceRaw,
				handle: writable.handle
			});
			if (progress.direction === "scrubbing") {
				progress = {
					schemaVersion: 1,
					journalHash: journal.journalHash,
					direction: "restoring",
					committedBytes: 0,
					pendingEnd: 0,
					extentBytes: progress.committedBytes
				};
				await writeAuditRecoveryProgress({
					root: params.root,
					relativePath: params.relativePath,
					progress
				});
			}
			await advanceAuditRecoveryWrite({
				root: params.root,
				relativePath: params.relativePath,
				progress,
				desiredContent: journal.sourceRaw,
				handle: writable.handle
			});
			await writable.handle.chmod(384);
			await writable.handle.sync();
		} finally {
			await writable.handle.close().catch(() => void 0);
		}
		await params.root.remove(progressRelativePath).catch(() => void 0);
		await params.root.remove(stagingRelativePath).catch(() => void 0);
		await params.root.remove(restoreRelativePath);
		await syncAuditRecoveryDirectory(params.root, params.relativePath);
		return true;
	} catch (error) {
		params.warnings.push(`Failed restoring interrupted ${params.label} legacy recovery archive: ${String(error)}`);
		return false;
	}
}
async function finalizeLegacyAuditRecoveryArchive(params) {
	await params.root.remove(auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_PROGRESS_SUFFIX)).catch(() => void 0);
	await params.root.remove(auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_STAGING_SUFFIX)).catch(() => void 0);
	await params.root.remove(auditRecoverySiblingPath(params.relativePath, AUDIT_RECOVERY_RESTORE_SUFFIX));
	await syncAuditRecoveryDirectory(params.root, params.relativePath);
}
async function scrubLegacyAuditRecoveryArchive(params) {
	const scrubPattern = createAuditRecoveryScrubPattern();
	const scrubbedContent = buildScrubbedAuditRecoveryContent(params.expectedSnapshot.rawBytes, scrubPattern);
	let progress;
	try {
		progress = await stageAuditRecoveryRestore({
			root: params.root,
			relativePath: params.relativePath,
			snapshot: params.expectedSnapshot,
			scrubPattern
		});
	} catch (error) {
		params.warnings.push(`Failed staging ${params.label} legacy recovery restore journal: ${String(error)}`);
		return;
	}
	let writable;
	try {
		writable = await params.root.openWritable(params.relativePath, {
			mode: 384,
			writeMode: "update"
		});
	} catch (error) {
		params.warnings.push(`Failed scrubbing ${params.label} legacy recovery archive: ${String(error)}`);
		return;
	}
	try {
		if (!legacyAuditRawCheckpointsMatch(params.expectedSnapshot, writable.stat)) {
			params.warnings.push(`Skipped scrubbing changed ${params.label} legacy recovery archive; rerun openclaw doctor --fix`);
			return;
		}
		await advanceAuditRecoveryWrite({
			root: params.root,
			relativePath: params.relativePath,
			progress,
			desiredContent: scrubbedContent,
			handle: writable.handle
		});
		await writable.handle.chmod(384);
		await writable.handle.sync();
	} catch (error) {
		await writable.handle.close().catch(() => void 0);
		const recoveryWarnings = [];
		if (await restoreInterruptedAuditRecoveryArchive({
			root: params.root,
			relativePath: params.relativePath,
			label: params.label,
			warnings: recoveryWarnings
		})) params.warnings.push(`Failed scrubbing ${params.label} legacy recovery archive; restored it for Doctor retry: ${String(error)}`);
		else {
			params.warnings.push(...recoveryWarnings);
			params.warnings.push(`Failed scrubbing ${params.label} legacy recovery archive; left its progress journal for Doctor retry: ${String(error)}`);
		}
		return;
	} finally {
		await writable.handle.close().catch(() => void 0);
	}
	let scrubbedSnapshot;
	try {
		scrubbedSnapshot = await readLegacyAuditSourceSnapshot(params.root, params.relativePath);
	} catch (error) {
		params.warnings.push(`Changed ${params.label} legacy recovery archive during scrub verification; rerun openclaw doctor --fix: ${String(error)}`);
		return;
	}
	if (!scrubbedSnapshot.rawBytes.subarray(0, scrubbedContent.length).equals(scrubbedContent)) {
		params.warnings.push(`Failed verifying scrubbed ${params.label} legacy recovery archive; rerun openclaw doctor --fix`);
		return;
	}
	return scrubbedSnapshot;
}
async function recordLegacyAuditRawCheckpoint(params) {
	try {
		const sanitizedSnapshot = await readLegacyAuditSourceSnapshot(params.root, params.sanitizedRelativePath);
		const opened = await params.root.open(params.rawRelativePath);
		let checkpoint;
		try {
			const stat = await opened.handle.stat();
			checkpoint = {
				dev: stat.dev,
				ino: stat.ino,
				mtimeMs: stat.mtimeMs,
				size: stat.size,
				phase: params.phase,
				generationKey: legacyAuditSourceGenerationKey(params.rawRelativePath),
				recordCount: params.recordCount,
				recordOrdinalBase: params.recordOrdinalBase,
				contentHash: createHash("sha256").update(params.snapshot.rawBytes).digest("hex"),
				sanitizedContentHash: createHash("sha256").update(sanitizedSnapshot.rawBytes).digest("hex"),
				sanitizedSize: sanitizedSnapshot.rawBytes.length
			};
		} finally {
			await opened.handle.close();
		}
		if (!legacyAuditRawCheckpointsMatch(checkpoint, params.snapshot)) {
			params.warnings.push(`Retained changed legacy audit backup ${params.rawPath}; rerun openclaw doctor --fix to import its later rows`);
			return false;
		}
		openLegacyAuditRawCheckpointStore(params.stateDir).upsert(legacyAuditRawCheckpointKey(checkpoint), checkpoint);
		return true;
	} catch (error) {
		params.warnings.push(`Failed recording legacy audit backup checkpoint for ${params.rawPath}: ${String(error)}`);
		return false;
	}
}
function findPreviousLegacyAuditRawCheckpoint(stateDir, rawRelativePath) {
	const generationKey = legacyAuditSourceGenerationKey(rawRelativePath);
	return openLegacyAuditRawCheckpointStore(stateDir).entries().toReversed().find((entry) => entry.value.generationKey === generationKey)?.value;
}
//#endregion
//#region src/infra/state-migrations.audit-coordination.ts
const LEGACY_AUDIT_COORDINATION_SCOPE = "migration.legacy-audit";
const LEGACY_AUDIT_COORDINATION_KEY = "filesystem-sqlite-boundary";
function withLegacyAuditMigrationLease(stateDir, run) {
	return withOpenClawStateLease({
		scope: LEGACY_AUDIT_COORDINATION_SCOPE,
		key: LEGACY_AUDIT_COORDINATION_KEY,
		database: {
			scope: "shared",
			options: { env: {
				...process.env,
				OPENCLAW_STATE_DIR: stateDir
			} }
		},
		leaseMs: 6e4,
		waitMs: 5e3,
		leaseLabel: "legacy audit migration lease",
		operationLabel: "migration.legacy-audit.lease"
	}, async () => await run());
}
//#endregion
export { readLegacyAuditRecoverySourceForBackup as a, recordLegacyAuditRawCheckpoint as c, prepareLegacyAuditRecords as d, serializePreparedAuditRecords as f, legacyAuditSourceGenerationKey as g, legacyAuditRawCheckpointKey as h, findPreviousLegacyAuditRawCheckpoint as i, restoreInterruptedAuditRecoveryArchive as l, hasLegacyAuditRawCheckpointCapacity as m, auditRecoveryCheckpointPrefixMatches as n, readLegacyAuditSourcePrefixSnapshotForBackup as o, detectLegacyAuditLogs as p, finalizeLegacyAuditRecoveryArchive as r, readLegacyAuditSourceSnapshot as s, withLegacyAuditMigrationLease as t, scrubLegacyAuditRecoveryArchive as u };
