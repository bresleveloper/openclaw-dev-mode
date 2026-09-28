import { O as resolveMemoryRemDreamingConfig, x as resolveMemoryDeepDreamingConfig } from "./dreaming-Rnb_FGdU.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import { i as listWorkspaceDirectory } from "./memory-workspace-files-DqjGDoKP.mjs";
import { n as previewGroundedRemMarkdown } from "./rem-evidence-B7VE2AkG.mjs";
import { t as rankShortTermPromotionCandidates } from "./short-term-promotion-BpM8flXy.mjs";
import { n as readShortTermRecallEntries, t as filterLiveShortTermRecallEntries } from "./short-term-promotion-record-ClLVoFVX.mjs";
import { n as previewRemDreaming, t as filterRecallEntriesWithinLookback } from "./dreaming-phases-i8uPNMO9.mjs";
import path from "node:path";
//#region extensions/memory-core/src/rem-harness.ts
const DAILY_MEMORY_FILE_NAME_RE = /^\d{4}-\d{2}-\d{2}(?:-[^/]+)?\.md$/i;
function normalizeOptionalPositiveLimit(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	return Math.max(1, Math.floor(value));
}
function resolveRemPreviewLimit(configLimit, cap) {
	if (configLimit <= 0) return 0;
	if (typeof cap !== "number" || !Number.isFinite(cap)) return configLimit;
	return Math.max(0, Math.min(configLimit, Math.floor(cap)));
}
function createSkippedRemPreview() {
	return {
		sourceEntryCount: 0,
		reflections: [],
		candidateTruths: [],
		candidateKeys: [],
		bodyLines: []
	};
}
async function listWorkspaceDailyFiles(workspaceDir, limit) {
	const memoryDir = path.join(workspaceDir, "memory");
	let entries;
	try {
		entries = (await listWorkspaceDirectory(workspaceDir, memoryDir)).filter((entry) => entry.isFile() && DAILY_MEMORY_FILE_NAME_RE.test(entry.name)).map((entry) => entry.name);
	} catch (err) {
		if (err?.code === "ENOENT") return [];
		throw err;
	}
	const files = entries.map((name) => path.join(memoryDir, name)).toSorted((left, right) => left.localeCompare(right));
	if (typeof limit !== "number" || !Number.isFinite(limit) || limit <= 0 || files.length <= limit) return files;
	return files.slice(-Math.floor(limit));
}
function resolveGroundedFileLimit(configLimit, cap) {
	if (typeof cap !== "number" || !Number.isFinite(cap)) return configLimit;
	const normalizedCap = Math.max(1, Math.floor(cap));
	return configLimit > 0 ? Math.min(configLimit, normalizedCap) : normalizedCap;
}
async function previewRemHarness(params) {
	const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
	const remConfig = resolveMemoryRemDreamingConfig({
		pluginConfig: params.pluginConfig,
		cfg: params.cfg
	});
	const deepConfig = resolveMemoryDeepDreamingConfig({
		pluginConfig: params.pluginConfig,
		cfg: params.cfg
	});
	const allRecallEntries = await readShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		nowMs
	});
	const recallEntries = await filterLiveShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		entries: filterRecallEntriesWithinLookback({
			entries: allRecallEntries,
			nowMs,
			lookbackDays: remConfig.lookbackDays
		})
	});
	const remPreviewLimit = resolveRemPreviewLimit(remConfig.limit, params.remPreviewLimit);
	const remSkipped = remConfig.limit <= 0 || remPreviewLimit <= 0;
	const rem = remSkipped ? createSkippedRemPreview() : previewRemDreaming({
		entries: recallEntries,
		limit: remPreviewLimit,
		minPatternStrength: remConfig.minPatternStrength
	});
	let groundedInputPaths = params.groundedInputPaths ?? [];
	let grounded = null;
	if (params.grounded) {
		if (groundedInputPaths.length === 0) groundedInputPaths = await listWorkspaceDailyFiles(params.workspaceDir, resolveGroundedFileLimit(remConfig.limit, params.groundedFileLimit));
		grounded = groundedInputPaths.length > 0 ? await previewGroundedRemMarkdown({
			workspaceDir: params.workspaceDir,
			inputPaths: groundedInputPaths
		}) : null;
	}
	const candidateLimit = normalizeOptionalPositiveLimit(params.candidateLimit);
	const rankedCandidates = await rankShortTermPromotionCandidates({
		workspaceDir: params.workspaceDir,
		minScore: 0,
		minRecallCount: 0,
		minUniqueQueries: 0,
		includePromoted: Boolean(params.includePromoted),
		recencyHalfLifeDays: deepConfig.recencyHalfLifeDays,
		maxAgeDays: deepConfig.maxAgeDays,
		nowMs,
		...candidateLimit ? { limit: candidateLimit + 1 } : {}
	});
	const truncated = typeof candidateLimit === "number" && rankedCandidates.length > candidateLimit;
	const candidates = typeof candidateLimit === "number" ? rankedCandidates.slice(0, candidateLimit) : rankedCandidates;
	return {
		workspaceDir: params.workspaceDir,
		nowMs,
		remConfig,
		deepConfig,
		recallEntryCount: recallEntries.length,
		remSkipped,
		rem,
		groundedInputPaths,
		grounded,
		deep: {
			...candidateLimit ? { candidateLimit } : {},
			candidateCount: candidates.length,
			truncated,
			candidates
		}
	};
}
//#endregion
export { previewRemHarness as t };
