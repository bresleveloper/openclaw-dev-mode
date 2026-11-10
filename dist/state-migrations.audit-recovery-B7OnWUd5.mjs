import { i as redactSecrets } from "./redact-BcXJu5HP.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { s as writeFileWindowFully } from "./file-descriptor-BWLpOgrg.mjs";
import { t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-B2RKADOj.mjs";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-qlZuzCbE.mjs";
import { h as sanitizeConfigAuditRecord } from "./io.audit-CCHda99t.mjs";
import { i as recoverLegacyMigrationLinkedMove, n as inspectLegacyMigrationLinkedMove, r as moveLegacyMigrationFileNoReplace, t as LegacyMigrationMoveUnavailableError } from "./state-migrations.no-replace-move-CE5iXCsS.mjs";
import fs from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { readFileWindowFully, statRegularFileSync } from "@openclaw/fs-safe/advanced";
import { sha256FileSync } from "@openclaw/fs-safe/durability";
//#region src/infra/state-migrations.audit-checkpoints.ts
const LEGACY_AUDIT_RAW_CHECKPOINT_SCOPE = "migration.legacy-audit-raw";
const LEGACY_AUDIT_RAW_CHECKPOINT_MAX_ENTRIES = 1e4;
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
		const observed = statRegularFileSync(sourcePath);
		if (observed.missing) return;
		return {
			dev: String(observed.exactIdentity.dev),
			ino: String(observed.exactIdentity.ino),
			mtimeMs: observed.stat.mtimeMs,
			size: observed.stat.size
		};
	} catch {
		return;
	}
}
function auditIdentityMatches(left, right) {
	if (typeof left === "number" || typeof right === "number") {
		const legacy = typeof left === "number" ? left : right;
		const other = typeof left === "number" ? right : left;
		if (!Number.isInteger(legacy)) return false;
		if (typeof other === "number") return Number.isInteger(other) && legacy === other;
		if (!/^(0|-?[1-9][0-9]*)$/u.test(other)) return false;
		const observed = BigInt(other);
		return legacy === Number(observed < 0n ? BigInt.asUintN(64, observed) : observed);
	}
	return /^(0|-?[1-9][0-9]*)$/u.test(left) && left === right;
}
function legacyAuditFileIdentitiesMatch(left, right) {
	return auditIdentityMatches(left.dev, right.dev) && auditIdentityMatches(left.ino, right.ino);
}
function legacyAuditRawCheckpointsMatch(left, right) {
	return left !== void 0 && right !== void 0 && legacyAuditFileIdentitiesMatch(left, right) && left.mtimeMs === right.mtimeMs && left.size === right.size;
}
function legacyAuditRawCheckpointIsCurrent(sourcePath, checkpoint) {
	let fd;
	try {
		fd = fs.openSync(sourcePath, "r");
		const beforeStat = fs.fstatSync(fd);
		const beforeExact = fs.fstatSync(fd, { bigint: true });
		const before = {
			dev: String(beforeExact.dev),
			ino: String(beforeExact.ino),
			mtimeMs: beforeStat.mtimeMs,
			size: beforeStat.size
		};
		if (!beforeStat.isFile() || !legacyAuditRawCheckpointsMatch(checkpoint, before)) return false;
		const hash = sha256FileSync(fd, { maxBytes: checkpoint.size });
		const afterStat = fs.fstatSync(fd);
		const afterExact = fs.fstatSync(fd, { bigint: true });
		return legacyAuditRawCheckpointsMatch(before, {
			dev: String(afterExact.dev),
			ino: String(afterExact.ino),
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
		const generations = (pattern) => directoryEntries.flatMap((entry) => {
			const match = pattern.exec(entry);
			return match ? [{
				entry,
				generation: BigInt(match[1] ?? "1")
			}] : [];
		}).toSorted((left, right) => (left.generation < right.generation ? -1 : left.generation > right.generation ? 1 : 0) || left.entry.localeCompare(right.entry));
		for (const { entry } of generations(rawArchivePattern)) {
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
		for (const { entry, generation } of generations(claimPattern)) {
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
//#region src/infra/state-migrations.audit-moves.ts
/** Destination-first names reserved by the audit migration, in recovery order. */
async function legacyAuditMoveCandidates(root, source) {
	const logical = path.relative(path.resolve(root.rootDir), source.logicalSourcePath);
	const directory = path.dirname(logical);
	const basename = path.basename(logical);
	const escaped = escapeRegExp(basename);
	const generation = "(?:\\.([2-9]|[1-9][0-9]+))?";
	const claimPattern = new RegExp(`^\\.${escaped}\\.doctor-importing${generation}$`, "u");
	const rawPattern = new RegExp(`^${escaped}\\.migrated${generation}\\.raw$`, "u");
	const entries = await fs$1.readdir(await root.resolve(directory));
	const pairs = [];
	const claims = [];
	for (const entry of entries) {
		const raw = rawPattern.exec(entry);
		if (raw) {
			const rawPath = path.join(directory, entry);
			const quarantinePattern = new RegExp(`^${escapeRegExp(entry)}\\.quarantined-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-\\d{3}Z-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`, "u");
			for (const quarantine of entries.filter((candidate) => quarantinePattern.test(candidate))) pairs.push({
				retained: path.join(directory, quarantine),
				removed: rawPath
			});
			pairs.push({
				retained: rawPath,
				removed: path.join(directory, `.${basename}.doctor-importing${raw[1] ? `.${raw[1]}` : ""}`)
			}, {
				retained: rawPath,
				removed: logical
			});
		} else if (claimPattern.test(entry)) claims.push({
			retained: path.join(directory, entry),
			removed: logical
		});
	}
	return [...pairs, ...claims];
}
function formatLegacyAuditMoveWarning(error, stateDir) {
	const command = process.platform === "win32" ? `& { $previous=$env:OPENCLAW_STATE_DIR; try { $env:OPENCLAW_STATE_DIR=${quotePowerShellArg(stateDir)}; openclaw doctor --fix } finally { $env:OPENCLAW_STATE_DIR=$previous } }` : `env OPENCLAW_STATE_DIR=${quoteCliArg(stateDir)} openclaw doctor --fix`;
	return `Skipped legacy audit migration: the filesystem rejects native no-replace rename and hard links (${error.code}). Could not move ${error.sourcePath}; preserved the audit inode without copying. After restoring hard-link support (or moving the complete state directory to a compatible filesystem with the Gateway and all CLI writers stopped), run: ${command}. Other repairs can continue.`;
}
function legacyAuditClaimPathForArchive(sourcePath, sanitizedArchivePath) {
	const archivePrefix = `${sourcePath}.migrated`;
	if (!sanitizedArchivePath.startsWith(archivePrefix)) throw new Error(`Invalid legacy audit archive path ${sanitizedArchivePath}`);
	const generationSuffix = sanitizedArchivePath.slice(archivePrefix.length);
	return path.join(path.dirname(sourcePath), `.${path.basename(sourcePath)}.doctor-importing${generationSuffix}`);
}
async function resolveAuditArchiveRelativePaths(root, sourceRelativePath) {
	const directoryPath = await root.resolve(path.dirname(sourceRelativePath));
	const baseName = escapeRegExp(path.basename(sourceRelativePath));
	const archivePattern = new RegExp(`^${baseName}\\.migrated(?:\\.([2-9]|[1-9][0-9]+))?(?:\\.raw)?$`, "u");
	const claimPattern = new RegExp(`^\\.${baseName}\\.doctor-importing(?:\\.([2-9]|[1-9][0-9]+))?$`, "u");
	let latestGeneration = 0n;
	for (const entry of await fs$1.readdir(directoryPath)) {
		const match = archivePattern.exec(entry) ?? claimPattern.exec(entry);
		if (!match) continue;
		const generation = BigInt(match[1] ?? "1");
		if (generation > latestGeneration) latestGeneration = generation;
	}
	const generation = latestGeneration + 1n;
	const sanitized = `${sourceRelativePath}.migrated${generation === 1n ? "" : `.${generation}`}`;
	return {
		sanitized,
		raw: `${sanitized}.raw`,
		resumeSanitized: false
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
	if (!isExactJournalIdentity(params.target.dev) || !isExactJournalIdentity(params.target.ino)) throw new Error("invalid legacy audit recovery restore identity");
	const journal = {
		schemaVersion: 7,
		rawBase64: params.rawBytes.toString("base64"),
		scrubPatternBase64: params.scrubPattern.toString("base64"),
		target: params.target
	};
	return `${JSON.stringify(journal)}\n`;
}
function isExactJournalIdentity(value) {
	return typeof value === "string" && /^(0|-?[1-9][0-9]*)$/u.test(value);
}
function parseAuditRecoveryRestoreJournal(raw) {
	const parsed = JSON.parse(raw);
	const isPersistedIdentity = (value) => parsed.schemaVersion === 6 ? typeof value === "number" && Number.isInteger(value) : isExactJournalIdentity(value);
	if (parsed.schemaVersion !== 6 && parsed.schemaVersion !== 7 || typeof parsed.rawBase64 !== "string" || typeof parsed.scrubPatternBase64 !== "string" || !parsed.target || !isPersistedIdentity(parsed.target.dev) || !isPersistedIdentity(parsed.target.ino) || typeof parsed.target.size !== "number") throw new Error("invalid legacy audit recovery restore journal");
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
	const scrubbing = progress.direction === "scrubbing";
	const desired = scrubbing ? scrubbed : original;
	const previous = scrubbing ? original : scrubbed;
	const previousEnd = scrubbing ? original.length : progress.extentBytes;
	return current.subarray(0, progress.committedBytes).equals(desired.subarray(0, progress.committedBytes)) && auditRecoveryTransitionMatches(current, previous, desired, progress.committedBytes, progress.pendingEnd) && current.subarray(progress.pendingEnd, previousEnd).equals(previous.subarray(progress.pendingEnd, previousEnd)) && (scrubbing || current.subarray(progress.extentBytes, original.length).equals(original.subarray(progress.extentBytes)));
}
//#endregion
//#region src/infra/state-migrations.audit-recovery.ts
const AUDIT_RECOVERY_RESTORE_SUFFIX = ".doctor-scrub-restore";
const AUDIT_RECOVERY_STAGING_SUFFIX = ".doctor-scrub-staging";
const AUDIT_RECOVERY_PROGRESS_SUFFIX = ".doctor-scrub-progress";
const AUDIT_RECOVERY_SCRUB_PATTERN_BYTES = 32;
function auditRecoveryJournalTargetsSnapshot(snapshot, journal) {
	return legacyAuditFileIdentitiesMatch(snapshot, journal.target) && snapshot.rawBytes.length >= journal.target.size;
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
	const { buffer: rawBytes, stat, exactIdentity } = await root.read(relativePath, { maxBytes: Infinity });
	return {
		dev: String(exactIdentity.dev),
		ino: String(exactIdentity.ino),
		mtimeMs: stat.mtimeMs,
		size: rawBytes.length,
		raw: rawBytes.toString("utf8"),
		rawBytes
	};
}
async function readLegacyAuditSourcePrefixSnapshotForBackup(root, relativePath, linkedPeer) {
	const identity = linkedPeer ? await inspectLegacyMigrationLinkedMove(root, relativePath, linkedPeer) : void 0;
	if (linkedPeer && !identity) throw new FsSafeError("hardlink", "legacy audit backup link pair changed");
	const opened = await root.open(relativePath, { hardlinks: linkedPeer ? "allow" : "reject" });
	try {
		const exact = fs.fstatSync(opened.handle.fd, { bigint: true });
		if (identity && (identity.dev !== exact.dev || identity.ino !== exact.ino)) throw new FsSafeError("path-mismatch", "legacy audit backup linked source changed");
		const before = await opened.handle.stat();
		if (!before.isFile()) throw new Error("legacy audit source is not a regular file");
		const rawBytes = Buffer.allocUnsafe(before.size);
		if (await readFileWindowFully(opened.handle, rawBytes, 0) !== rawBytes.length) throw new Error("legacy audit source was truncated while backup was reading it");
		const after = await opened.handle.stat();
		const afterExact = fs.fstatSync(opened.handle.fd, { bigint: true });
		if (exact.dev !== afterExact.dev || exact.ino !== afterExact.ino || after.size < before.size) throw new Error("legacy audit source changed other than by append during backup");
		if (identity && linkedPeer) {
			const afterPair = await inspectLegacyMigrationLinkedMove(root, relativePath, linkedPeer);
			if (!afterPair || afterPair.dev !== identity.dev || afterPair.ino !== identity.ino) throw new FsSafeError("path-mismatch", "legacy audit backup link pair changed during capture");
		}
		return {
			dev: String(exact.dev),
			ino: String(exact.ino),
			mtimeMs: before.mtimeMs,
			size: before.size,
			raw: rawBytes.toString("utf8"),
			rawBytes
		};
	} finally {
		await opened.handle.close();
	}
}
async function readLegacyAuditRecoverySourceForBackup(root, relativePath, linkedPeer) {
	const current = await readLegacyAuditSourcePrefixSnapshotForBackup(root, relativePath, linkedPeer);
	const restoreRelativePath = `${relativePath}${AUDIT_RECOVERY_RESTORE_SUFFIX}`;
	if (!await root.exists(restoreRelativePath)) return current;
	const stagingRelativePath = `${relativePath}${AUDIT_RECOVERY_STAGING_SUFFIX}`;
	const journal = parseAuditRecoveryRestoreJournal((await readLegacyAuditSourcePrefixSnapshotForBackup(root, restoreRelativePath, await inspectLegacyMigrationLinkedMove(root, restoreRelativePath, stagingRelativePath) ? stagingRelativePath : void 0)).raw);
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
	return Buffer.alloc(rawBytes.length, scrubPattern);
}
const AUDIT_RECOVERY_WRITE_CHUNK_BYTES = 65536;
async function writeAuditRecoveryProgress(params) {
	const progressRelativePath = `${params.relativePath}${AUDIT_RECOVERY_PROGRESS_SUFFIX}`;
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
	const progressRelativePath = `${params.relativePath}${AUDIT_RECOVERY_PROGRESS_SUFFIX}`;
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
	if (progress.pendingEnd > progress.committedBytes) progress = await reconcileAuditRecoveryPendingWrite(params);
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
		progress = await reconcileAuditRecoveryPendingWrite({
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
	const restoreRelativePath = `${params.relativePath}${AUDIT_RECOVERY_RESTORE_SUFFIX}`;
	const stagingRelativePath = `${params.relativePath}${AUDIT_RECOVERY_STAGING_SUFFIX}`;
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
	await params.root.create(stagingRelativePath, journalRaw, {
		mode: 384,
		durable: "file"
	});
	await moveLegacyMigrationFileNoReplace(params.root, stagingRelativePath, restoreRelativePath);
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
	const restoreRelativePath = `${params.relativePath}${AUDIT_RECOVERY_RESTORE_SUFFIX}`;
	const stagingRelativePath = `${params.relativePath}${AUDIT_RECOVERY_STAGING_SUFFIX}`;
	const progressRelativePath = `${params.relativePath}${AUDIT_RECOVERY_PROGRESS_SUFFIX}`;
	if (!await params.root.exists(restoreRelativePath)) {
		await params.root.remove(stagingRelativePath).catch(() => void 0);
		await params.root.remove(progressRelativePath).catch(() => void 0);
		return true;
	}
	try {
		await recoverLegacyMigrationLinkedMove(params.root, restoreRelativePath, stagingRelativePath);
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
			await finalizeLegacyAuditRecoveryArchive(params);
			return true;
		}
		try {
			var _usingCtx$1 = _usingCtx();
			const writable = _usingCtx$1.a(await params.root.openWritable(params.relativePath, {
				mode: 384,
				writeMode: "update"
			}));
			const verification = await readLegacyAuditSourceSnapshot(params.root, params.relativePath);
			if (!legacyAuditFileIdentitiesMatch({
				dev: String(writable.exactIdentity.dev),
				ino: String(writable.exactIdentity.ino)
			}, verification) || !auditRecoveryJournalTargetsSnapshot(verification, journal) || !auditRecoveryStateMatchesJournal({
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
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
		await finalizeLegacyAuditRecoveryArchive(params);
		return true;
	} catch (error) {
		params.warnings.push(`Failed restoring interrupted ${params.label} legacy recovery archive: ${String(error)}`);
		return false;
	}
}
async function finalizeLegacyAuditRecoveryArchive(params) {
	await params.root.remove(`${params.relativePath}${AUDIT_RECOVERY_PROGRESS_SUFFIX}`).catch(() => void 0);
	await params.root.remove(`${params.relativePath}${AUDIT_RECOVERY_STAGING_SUFFIX}`).catch(() => void 0);
	await params.root.remove(`${params.relativePath}${AUDIT_RECOVERY_RESTORE_SUFFIX}`);
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
		if (error instanceof LegacyMigrationMoveUnavailableError) throw error;
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
		try {
			var _usingCtx3 = _usingCtx();
			const opened = _usingCtx3.a(writable);
			if (!legacyAuditRawCheckpointsMatch(params.expectedSnapshot, {
				dev: String(opened.exactIdentity.dev),
				ino: String(opened.exactIdentity.ino),
				mtimeMs: opened.stat.mtimeMs,
				size: opened.stat.size
			})) {
				params.warnings.push(`Skipped scrubbing changed ${params.label} legacy recovery archive; rerun openclaw doctor --fix`);
				return;
			}
			await advanceAuditRecoveryWrite({
				root: params.root,
				relativePath: params.relativePath,
				progress,
				desiredContent: scrubbedContent,
				handle: opened.handle
			});
			await opened.handle.chmod(384);
			await opened.handle.sync();
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			await _usingCtx3.d();
		}
	} catch (error) {
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
			const exact = fs.fstatSync(opened.handle.fd, { bigint: true });
			checkpoint = {
				dev: String(exact.dev),
				ino: String(exact.ino),
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
		openLegacyAuditRawCheckpointStore(params.stateDir).upsert(checkpoint.generationKey, checkpoint);
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
export { hasLegacyAuditRawCheckpointCapacity as _, readLegacyAuditSourcePrefixSnapshotForBackup as a, restoreInterruptedAuditRecoveryArchive as c, serializePreparedAuditRecords as d, formatLegacyAuditMoveWarning as f, detectLegacyAuditLogs as g, resolveAuditArchiveRelativePaths as h, readLegacyAuditRecoverySourceForBackup as i, scrubLegacyAuditRecoveryArchive as l, legacyAuditMoveCandidates as m, finalizeLegacyAuditRecoveryArchive as n, readLegacyAuditSourceSnapshot as o, legacyAuditClaimPathForArchive as p, findPreviousLegacyAuditRawCheckpoint as r, recordLegacyAuditRawCheckpoint as s, auditRecoveryCheckpointPrefixMatches as t, prepareLegacyAuditRecords as u, legacyAuditSourceGenerationKey as v };
