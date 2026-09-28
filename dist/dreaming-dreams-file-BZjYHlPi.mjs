import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { g as readRegularFile } from "./fs-safe-BAPek8At.mjs";
import { h as sleep } from "./utils-aKqR_F_U.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { t as replaceManagedMarkdownBlock } from "./memory-host-markdown-mHNl3RAL.mjs";
import { c as SHORT_TERM_LOCK_NAMESPACE, g as memoryCoreWorkspaceStateKey, h as memoryCoreStateReference, s as SHORT_TERM_LOCK_MAX_ENTRIES, v as openMemoryCoreStateStore } from "./dreaming-state-DJfKblhZ.mjs";
import { n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-DqjGDoKP.mjs";
import { a as readStore } from "./short-term-promotion-store-CMmsbVWh.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region extensions/memory-core/src/memory-workspace-lock.ts
const MEMORY_WORKSPACE_LOCK_WAIT_TIMEOUT_MS = 1e4;
const SHORT_TERM_LOCK_STALE_MS = 6e4;
const MEMORY_WORKSPACE_LOCK_RETRY_DELAY_MS = 40;
const inProcessMemoryWorkspaceLocks = new KeyedAsyncQueue();
const activeMemoryWorkspaceLockOwners = /* @__PURE__ */ new Map();
const pendingMemoryWorkspaceLockReleases = /* @__PURE__ */ new Map();
function retainMemoryWorkspaceLockRelease(receipt) {
	const now = Date.now();
	for (const [owner, pending] of pendingMemoryWorkspaceLockReleases) if (now - pending.entry.acquiredAt > SHORT_TERM_LOCK_STALE_MS) pendingMemoryWorkspaceLockReleases.delete(owner);
	if (now - receipt.entry.acquiredAt > SHORT_TERM_LOCK_STALE_MS) return;
	pendingMemoryWorkspaceLockReleases.set(receipt.entry.owner, receipt);
	if (pendingMemoryWorkspaceLockReleases.size > 4096) {
		const oldest = pendingMemoryWorkspaceLockReleases.keys().next().value;
		if (oldest !== void 0) pendingMemoryWorkspaceLockReleases.delete(oldest);
	}
}
var MemoryWorkspaceLockAcquisitionError = class extends Error {
	constructor(lockRef, outcome, cause) {
		super(outcome.kind === "held" ? `Timed out waiting for memory workspace lock at ${lockRef} (held by ${outcome.holder.owner})` : `Memory workspace lock store unavailable at ${lockRef}: ${outcome.reason}`, { cause });
		this.outcome = outcome;
		this.code = outcome.kind === "held" ? "MEMORY_WORKSPACE_LOCK_HELD" : "MEMORY_WORKSPACE_LOCK_STORE_UNAVAILABLE";
	}
};
const memoryWorkspaceLockScopes = new AsyncLocalStorage();
function findActiveWorkspaceLockScope(key) {
	let scope = memoryWorkspaceLockScopes.getStore();
	while (scope) {
		if (!scope.active || !scope.lease.active) return;
		if (scope.lease.key === key) return scope;
		scope = scope.parent;
	}
}
async function runWorkspaceLockScope(lease, task) {
	const scope = {
		lease,
		active: true,
		childTail: Promise.resolve(),
		parent: memoryWorkspaceLockScopes.getStore()
	};
	try {
		return await memoryWorkspaceLockScopes.run(scope, task);
	} finally {
		scope.active = false;
		await scope.childTail;
	}
}
function resolveLockPath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_LOCK_NAMESPACE, workspaceDir);
}
function parseLockOwnerPid(raw) {
	const match = raw.trim().match(/^(\d+):/);
	const pid = Number.parseInt(match?.[1] ?? "", 10);
	return Number.isInteger(pid) && pid > 0 ? pid : null;
}
function isShortTermLockStealable(lockKey, existing, nowMs) {
	if (nowMs - existing.acquiredAt <= SHORT_TERM_LOCK_STALE_MS) return false;
	const ownerPid = parseLockOwnerPid(existing.owner);
	if (ownerPid === null) return true;
	if (ownerPid === process.pid) return activeMemoryWorkspaceLockOwners.get(lockKey) !== existing.owner;
	if (isPidDefinitelyDead(ownerPid)) return true;
	if (existing.ownerStartTime === void 0) return false;
	const currentStartTime = getFileLockProcessStartTime(ownerPid);
	return currentStartTime !== null && currentStartTime !== existing.ownerStartTime;
}
async function deleteShortTermLockEntryIfCurrent(lockStore, lockKey, expected, initialObservation) {
	if (!lockStore.observe || !lockStore.compareAndApply) throw new Error("memory-core short-term lock store requires atomic comparisons");
	const { owner, acquiredAt } = expected;
	const decideDeletion = (current) => ({
		operation: "delete",
		action: current !== void 0 && current.owner === owner && current.acquiredAt === acquiredAt ? "delete" : "keep"
	});
	let observation = initialObservation ?? await lockStore.observe(lockKey);
	while (true) {
		const result = await lockStore.compareAndApply(lockKey, observation.comparison, decideDeletion(observation.value));
		if (result.status !== "conflict") return result.status === "applied";
		observation = result.current;
	}
}
/** Captured input preparation shares local ordering without claiming a durable write lease. */
async function withMemoryWorkspacePreparation(workspaceDir, prepare) {
	const key = memoryCoreWorkspaceStateKey(workspaceDir);
	if (findActiveWorkspaceLockScope(key)) return await withMemoryWorkspaceLock(workspaceDir, prepare);
	return await inProcessMemoryWorkspaceLocks.enqueue(key, prepare);
}
async function withMemoryWorkspaceLock(workspaceDir, task) {
	const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
	const scope = findActiveWorkspaceLockScope(lockKey);
	if (scope) {
		const child = scope.childTail.then(() => runWorkspaceLockScope(scope.lease, task));
		scope.childTail = child.then(() => void 0, () => void 0);
		return await child;
	}
	const lockRef = resolveLockPath(workspaceDir);
	const lockStore = openMemoryCoreStateStore({
		namespace: SHORT_TERM_LOCK_NAMESPACE,
		maxEntries: SHORT_TERM_LOCK_MAX_ENTRIES
	});
	return await inProcessMemoryWorkspaceLocks.enqueue(lockKey, async () => {
		const receipt = await acquireMemoryWorkspaceLock(lockStore, lockKey, lockRef);
		const lease = {
			key: lockKey,
			active: true
		};
		activeMemoryWorkspaceLockOwners.set(lockKey, receipt.entry.owner);
		try {
			return await runWorkspaceLockScope(lease, task);
		} finally {
			lease.active = false;
			activeMemoryWorkspaceLockOwners.delete(lockKey);
			try {
				await deleteShortTermLockEntryIfCurrent(lockStore, lockKey, receipt.entry, receipt.observation);
			} catch {
				retainMemoryWorkspaceLockRelease(receipt);
			}
		}
	});
}
async function acquireMemoryWorkspaceLock(lockStore, lockKey, lockRef) {
	const startedAt = Date.now();
	while (true) {
		let outcome;
		try {
			if (!lockStore.observe || !lockStore.compareAndApply) throw new Error("memory-core short-term lock store requires atomic comparisons");
			const observation = await lockStore.observe(lockKey);
			let existing = observation.value;
			if (existing === void 0) {
				const ownerStartTime = getFileLockProcessStartTime(process.pid);
				const lockEntry = {
					owner: `${process.pid}:${randomUUID()}`,
					acquiredAt: Date.now(),
					...ownerStartTime === null ? {} : { ownerStartTime }
				};
				const receipt = {
					key: lockKey,
					entry: lockEntry,
					observation
				};
				let acquired;
				try {
					acquired = await lockStore.compareAndApply(lockKey, observation.comparison, {
						operation: "update",
						action: "set",
						value: lockEntry
					});
				} catch (error) {
					retainMemoryWorkspaceLockRelease(receipt);
					throw error;
				}
				if (acquired.status === "applied") return receipt;
				if (acquired.status === "conflict") existing = acquired.current.value;
			} else {
				const pending = pendingMemoryWorkspaceLockReleases.get(existing.owner);
				if (pending && Date.now() - pending.entry.acquiredAt > SHORT_TERM_LOCK_STALE_MS) pendingMemoryWorkspaceLockReleases.delete(existing.owner);
				else if (pending?.key === lockKey && pending.entry.acquiredAt === existing.acquiredAt) {
					await deleteShortTermLockEntryIfCurrent(lockStore, lockKey, pending.entry, pending.observation);
					pendingMemoryWorkspaceLockReleases.delete(existing.owner);
					continue;
				}
				if (isShortTermLockStealable(lockKey, existing, Date.now()) && await deleteShortTermLockEntryIfCurrent(lockStore, lockKey, existing, observation)) continue;
			}
			outcome = existing ? {
				kind: "held",
				holder: {
					owner: existing.owner,
					epoch: existing.acquiredAt
				}
			} : {
				kind: "store-unavailable",
				reason: "holder-unobserved"
			};
		} catch (cause) {
			throw new MemoryWorkspaceLockAcquisitionError(lockRef, {
				kind: "store-unavailable",
				reason: "storage-error"
			}, cause);
		}
		if (Date.now() - startedAt >= MEMORY_WORKSPACE_LOCK_WAIT_TIMEOUT_MS) throw new MemoryWorkspaceLockAcquisitionError(lockRef, outcome);
		await sleep(MEMORY_WORKSPACE_LOCK_RETRY_DELAY_MS);
	}
}
//#endregion
//#region extensions/memory-core/src/dreaming-dreams-file.ts
const DREAMS_FILENAMES = ["DREAMS.md", "dreams.md"];
const DEEP_START_MARKER = "<!-- openclaw:dreaming:deep:start -->";
const DEEP_END_MARKER = "<!-- openclaw:dreaming:deep:end -->";
async function resolveDreamsPath(workspaceDir) {
	const files = getMemoryWorkspaceMaintenance(workspaceDir);
	if (files) return await files.resolveDreamsPath();
	for (const name of DREAMS_FILENAMES) {
		const target = path.join(workspaceDir, name);
		try {
			await fs.access(target);
			return target;
		} catch (err) {
			if (extractErrorCode(err) !== "ENOENT") throw err;
		}
	}
	return path.join(workspaceDir, DREAMS_FILENAMES[0]);
}
function isEmptyDreamsReadError(err, code) {
	if (code === "ENOENT" || code === "ENOTDIR" || code === "not-found" || code === "not-file" || code === "path-alias" || code === "path-mismatch" || code === "symlink") return true;
	return err instanceof Error && err.message === "path must be a regular file";
}
async function readDreamsFile(dreamsPath, workspaceDir) {
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.readDreams(dreamsPath);
	try {
		return (await readRegularFile({ filePath: dreamsPath })).buffer.toString("utf-8");
	} catch (err) {
		if (isEmptyDreamsReadError(err, extractErrorCode(err))) return "";
		throw err;
	}
}
async function assertSafeDreamsPath(dreamsPath) {
	const stat = await fs.lstat(dreamsPath).catch((err) => {
		if (extractErrorCode(err) === "ENOENT") return null;
		throw err;
	});
	if (!stat) return;
	if (stat.isSymbolicLink()) throw new Error("Refusing to write symlinked DREAMS.md");
	if (!stat.isFile()) throw new Error("Refusing to write non-file DREAMS.md");
}
async function writeDreamsFileAtomic(dreamsPath, content, workspaceDir) {
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.writeDreams(dreamsPath, content);
	await fs.mkdir(path.dirname(dreamsPath), { recursive: true });
	await assertSafeDreamsPath(dreamsPath);
	await replaceFileAtomic({
		filePath: dreamsPath,
		content,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(dreamsPath)}.dreams`,
		throwOnCleanupError: true
	});
}
async function updateDreamsFile(params) {
	return await withMemoryWorkspaceLock(params.workspaceDir, async () => {
		const dreamsPath = await resolveDreamsPath(params.workspaceDir);
		const existing = await readDreamsFile(dreamsPath, params.workspaceDir);
		const { content, result, shouldWrite = true } = await params.updater(existing, dreamsPath);
		if (shouldWrite) await writeDreamsFileAtomic(dreamsPath, content.endsWith("\n") ? content : `${content}\n`, params.workspaceDir);
		return result;
	});
}
async function updateDeepDreamsFile(params) {
	const body = params.bodyLines.join("\n");
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => ({
			content: replaceManagedMarkdownBlock({
				original: existing,
				heading: "## Deep Sleep",
				startMarker: DEEP_START_MARKER,
				endMarker: DEEP_END_MARKER,
				body
			}),
			result: dreamsPath,
			shouldWrite: params.bodyLines.length > 0
		})
	});
}
const DIARY_START_MARKER = "<!-- openclaw:dreaming:diary:start -->";
const DIARY_END_MARKER = "<!-- openclaw:dreaming:diary:end -->";
const BACKFILL_ENTRY_MARKER = "openclaw:dreaming:backfill-entry";
const RECENT_DIARY_CONTEXT_LIMIT = 3;
const RECENT_DIARY_CONTEXT_MAX_CHARS = 360;
function formatNarrativeDate(epochMs, timezone) {
	const opts = {
		timeZone: timezone ?? process.env.TZ,
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
		timeZoneName: "short"
	};
	return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
function ensureDiarySection(existing) {
	if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) return existing;
	const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}\n${DIARY_END_MARKER}\n`;
	if (existing.trim().length === 0) return diarySection;
	return diarySection + "\n" + existing;
}
function replaceDiaryContent(existing, diaryContent) {
	const ensured = ensureDiarySection(existing);
	const startIdx = ensured.indexOf(DIARY_START_MARKER);
	const endIdx = ensured.indexOf(DIARY_END_MARKER);
	if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return ensured;
	const before = ensured.slice(0, startIdx + 38);
	const after = ensured.slice(endIdx);
	return before + (diaryContent.trim().length > 0 ? `\n${diaryContent.trim()}\n` : "\n") + after;
}
function splitDiaryBlocks(diaryContent) {
	return diaryContent.split(/\n---\n/).map((block) => block.trim()).filter((block) => block.length > 0);
}
function clampDreamDiaryContextEntry(entry) {
	const normalized = entry.replace(/\s+/g, " ").trim();
	if (normalized.length <= RECENT_DIARY_CONTEXT_MAX_CHARS) return normalized;
	return `${truncateUtf16Safe(normalized, RECENT_DIARY_CONTEXT_MAX_CHARS).trimEnd()}...`;
}
function normalizeDiaryBlockBody(block) {
	const bodyLines = [];
	for (const line of block.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("<!--") || trimmed.startsWith("#")) continue;
		if (trimmed.startsWith("*") && trimmed.endsWith("*") && trimmed.length > 2) continue;
		bodyLines.push(trimmed);
	}
	return clampDreamDiaryContextEntry(bodyLines.join(" "));
}
function isOptionalDiaryContextReadError(err) {
	const code = extractErrorCode(err);
	return code === "EACCES" || code === "EPERM" || isEmptyDreamsReadError(err, code);
}
function getDiaryContextEntries(existing) {
	const startIdx = existing.indexOf(DIARY_START_MARKER);
	const endIdx = existing.indexOf(DIARY_END_MARKER);
	if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return [];
	return splitDiaryBlocks(existing.slice(startIdx + 38, endIdx)).map(normalizeDiaryBlockBody).filter((entry) => entry.length > 0);
}
async function readRecentDreamDiaryEntries(params) {
	const limit = Math.max(0, Math.floor(params.limit ?? RECENT_DIARY_CONTEXT_LIMIT));
	if (limit === 0) return [];
	let existing;
	try {
		existing = await readDreamsFile(await resolveDreamsPath(params.workspaceDir), params.workspaceDir);
	} catch (err) {
		if (isOptionalDiaryContextReadError(err)) return [];
		throw err;
	}
	return getDiaryContextEntries(existing).slice(-limit).toReversed();
}
function normalizeDiaryBlockFingerprint(block) {
	const lines = block.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
	let dateLine = "";
	const bodyLines = [];
	for (const line of lines) {
		if (!dateLine && line.startsWith("*") && line.endsWith("*") && line.length > 2) {
			dateLine = line.slice(1, -1).trim();
			continue;
		}
		if (line.startsWith("<!--") || line.startsWith("#")) continue;
		bodyLines.push(line);
	}
	return `${dateLine.replace(/\s+/g, " ").trim()}\n${bodyLines.join("\n").replace(/[ \t]+\n/g, "\n").trim()}`;
}
function joinDiaryBlocks(blocks) {
	if (blocks.length === 0) return "";
	return blocks.map((block) => `---\n\n${block.trim()}\n`).join("\n");
}
function stripBackfillDiaryBlocks(existing) {
	const ensured = ensureDiarySection(existing);
	const startIdx = ensured.indexOf(DIARY_START_MARKER);
	const endIdx = ensured.indexOf(DIARY_END_MARKER);
	if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return {
		updated: ensured,
		removed: 0
	};
	const inner = ensured.slice(startIdx + 38, endIdx);
	const kept = [];
	let removed = 0;
	for (const block of splitDiaryBlocks(inner)) {
		if (block.includes(BACKFILL_ENTRY_MARKER)) {
			removed += 1;
			continue;
		}
		kept.push(block);
	}
	return {
		updated: replaceDiaryContent(ensured, joinDiaryBlocks(kept)),
		removed
	};
}
function formatBackfillDiaryDate(isoDay, _timezone) {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);
	if (!match) return isoDay;
	const [, year, month, day] = match;
	const opts = {
		timeZone: "UTC",
		year: "numeric",
		month: "long",
		day: "numeric"
	};
	const epochMs = Date.UTC(Number(year), Number(month) - 1, Number(day), 12);
	return new Intl.DateTimeFormat("en-US", opts).format(new Date(epochMs));
}
function buildBackfillDiaryEntry(params) {
	const dateStr = formatBackfillDiaryDate(params.isoDay, params.timezone);
	const marker = `<!-- ${BACKFILL_ENTRY_MARKER} day=${params.isoDay}${params.sourcePath ? ` source=${params.sourcePath}` : ""} -->`;
	const body = params.bodyLines.map((line) => line.trimEnd()).join("\n").trim();
	return [
		`*${dateStr}*`,
		marker,
		body
	].filter((part) => part.length > 0).join("\n\n");
}
async function writeBackfillDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const stripped = params.preserveExisting ? {
				updated: existing,
				removed: 0
			} : stripBackfillDiaryBlocks(existing);
			const startIdx = stripped.updated.indexOf(DIARY_START_MARKER);
			const endIdx = stripped.updated.indexOf(DIARY_END_MARKER);
			const preservedBlocks = splitDiaryBlocks(startIdx >= 0 && endIdx > startIdx ? stripped.updated.slice(startIdx + 38, endIdx) : "");
			const additions = params.entries.map((entry) => buildBackfillDiaryEntry({
				isoDay: entry.isoDay,
				bodyLines: entry.bodyLines,
				sourcePath: entry.sourcePath,
				timezone: params.timezone
			}));
			const existingFingerprints = new Set(preservedBlocks.map((block) => normalizeDiaryBlockFingerprint(block)));
			const appended = params.preserveExisting ? additions.filter((block) => {
				const fingerprint = normalizeDiaryBlockFingerprint(block);
				if (existingFingerprints.has(fingerprint)) return false;
				existingFingerprints.add(fingerprint);
				return true;
			}) : additions;
			const nextBlocks = [...preservedBlocks, ...appended];
			return {
				content: replaceDiaryContent(stripped.updated, joinDiaryBlocks(nextBlocks)),
				result: {
					dreamsPath,
					written: appended.length,
					replaced: stripped.removed
				}
			};
		}
	});
}
async function removeBackfillDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const stripped = stripBackfillDiaryBlocks(existing);
			return {
				content: stripped.updated,
				result: {
					dreamsPath,
					removed: stripped.removed
				},
				shouldWrite: stripped.removed > 0 || existing.length > 0
			};
		}
	});
}
async function dedupeDreamDiaryEntries(params) {
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => {
			const ensured = ensureDiarySection(existing);
			const startIdx = ensured.indexOf(DIARY_START_MARKER);
			const endIdx = ensured.indexOf(DIARY_END_MARKER);
			if (startIdx < 0 || endIdx < 0 || endIdx < startIdx) return {
				content: ensured,
				result: {
					dreamsPath,
					removed: 0,
					kept: 0
				},
				shouldWrite: false
			};
			const blocks = splitDiaryBlocks(ensured.slice(startIdx + 38, endIdx));
			const seen = /* @__PURE__ */ new Set();
			const keptBlocks = [];
			let removed = 0;
			for (const block of blocks) {
				const fingerprint = normalizeDiaryBlockFingerprint(block);
				if (seen.has(fingerprint)) {
					removed += 1;
					continue;
				}
				seen.add(fingerprint);
				keptBlocks.push(block);
			}
			return {
				content: replaceDiaryContent(ensured, joinDiaryBlocks(keptBlocks)),
				result: {
					dreamsPath,
					removed,
					kept: keptBlocks.length
				},
				shouldWrite: removed > 0
			};
		}
	});
}
function buildDiaryEntry(narrative, dateStr) {
	return `\n---\n\n*${dateStr}*\n\n${narrative}\n`;
}
async function appendNarrativeEntry(params) {
	const dateStr = formatNarrativeDate(params.nowMs, params.timezone);
	const entry = buildDiaryEntry(params.narrative, dateStr);
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: async (existing, dreamsPath) => {
			const sourceKeys = params.sourceEntryKeys ?? [];
			const currentSources = sourceKeys.length > 0 ? (await readStore(params.workspaceDir, new Date(params.nowMs).toISOString())).entries : void 0;
			const currentDiary = new Set(getDiaryContextEntries(existing));
			if (sourceKeys.some((key) => !currentSources?.[key]) || params.recentDiaryEntries?.some((block) => !currentDiary.has(block))) return {
				content: existing,
				result: void 0,
				shouldWrite: false
			};
			let updated;
			if (existing.includes(DIARY_START_MARKER) && existing.includes(DIARY_END_MARKER)) {
				const endIdx = existing.lastIndexOf(DIARY_END_MARKER);
				updated = existing.slice(0, endIdx) + entry + "\n" + existing.slice(endIdx);
			} else if (existing.includes(DIARY_START_MARKER)) {
				const startIdx = existing.indexOf(DIARY_START_MARKER) + 38;
				updated = existing.slice(0, startIdx) + entry + "\n<!-- openclaw:dreaming:diary:end -->\n" + existing.slice(startIdx);
			} else {
				const diarySection = `# Dream Diary\n\n${DIARY_START_MARKER}${entry}\n${DIARY_END_MARKER}\n`;
				updated = existing.trim().length === 0 ? diarySection : `${diarySection}\n${existing}`;
			}
			return {
				content: updated,
				result: dreamsPath
			};
		}
	});
}
//#endregion
export { withMemoryWorkspacePreparation as _, readDreamsFile as a, resolveDreamsPath as c, writeBackfillDiaryEntries as d, writeDreamsFileAtomic as f, withMemoryWorkspaceLock as g, resolveLockPath as h, dedupeDreamDiaryEntries as i, updateDeepDreamsFile as l, isShortTermLockStealable as m, appendNarrativeEntry as n, readRecentDreamDiaryEntries as o, deleteShortTermLockEntryIfCurrent as p, clampDreamDiaryContextEntry as r, removeBackfillDiaryEntries as s, DREAMS_FILENAMES as t, updateDreamsFile as u };
