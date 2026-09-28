import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { y as formatMemoryDreamingDay } from "./dreaming-Rnb_FGdU.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import { t as appendMemoryHostEvent } from "./memory-host-events-BnGsdA3l.mjs";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-mHNl3RAL.mjs";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-BhFVUM0b.mjs";
import { c as readWorkspaceText, n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-DqjGDoKP.mjs";
import { l as updateDeepDreamsFile } from "./dreaming-dreams-file-BZjYHlPi.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/dreaming-markdown.ts
const DAILY_PHASE_HEADINGS = {
	light: "## Light Sleep",
	rem: "## REM Sleep"
};
const DAILY_PHASE_LABELS = {
	light: "light",
	rem: "rem"
};
function resolvePhaseMarkers(phase) {
	const label = DAILY_PHASE_LABELS[phase];
	return {
		start: `<!-- openclaw:dreaming:${label}:start -->`,
		end: `<!-- openclaw:dreaming:${label}:end -->`
	};
}
function resolveDailyMemoryPath(workspaceDir, epochMs, timezone) {
	const isoDay = formatMemoryDreamingDay(epochMs, timezone);
	return path.join(workspaceDir, "memory", `${isoDay}.md`);
}
function resolveSeparateReportPath(workspaceDir, phase, epochMs, timezone) {
	const isoDay = formatMemoryDreamingDay(epochMs, timezone);
	return path.join(workspaceDir, "memory", "dreaming", phase, `${isoDay}.md`);
}
function shouldWriteInline(storage) {
	return storage.mode === "inline" || storage.mode === "both";
}
function shouldWriteSeparate(storage) {
	return storage.mode === "separate" || storage.mode === "both" || storage.separateReports;
}
async function replaceDreamingMarkdownFile(filePath, content, workspaceDir) {
	const files = workspaceDir ? getMemoryWorkspaceMaintenance(workspaceDir) : void 0;
	if (files) return await files.replaceReport(filePath, content);
	const directoryPath = path.dirname(filePath);
	await fs.mkdir(directoryPath, { recursive: true });
	const dirMode = (await fs.stat(directoryPath)).mode & 4095;
	await replaceFileAtomic({
		filePath,
		content,
		dirMode,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(filePath)}.dreaming`,
		syncTempFile: true,
		syncParentDir: true,
		throwOnCleanupError: true
	});
}
async function writeDailyDreamingPhaseBlock(params) {
	const nowMs = resolveMemoryCoreNowMs(params.nowMs);
	const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : "- No notable updates.";
	let inlinePath;
	let reportPath;
	if (shouldWriteInline(params.storage)) {
		const candidatePath = resolveDailyMemoryPath(params.workspaceDir, nowMs, params.timezone);
		const original = await readWorkspaceText(params.workspaceDir, candidatePath).catch((err) => {
			if (extractErrorCode(err) === "ENOENT") return;
			throw err;
		});
		if (params.hasContent || original !== void 0) {
			inlinePath = candidatePath;
			const markers = resolvePhaseMarkers(params.phase);
			const updated = replaceManagedMarkdownBlock({
				original: original ?? "",
				heading: DAILY_PHASE_HEADINGS[params.phase],
				startMarker: markers.start,
				endMarker: markers.end,
				body
			});
			await replaceDreamingMarkdownFile(inlinePath, withTrailingNewline(updated), params.workspaceDir);
		}
	}
	if (params.hasContent && shouldWriteSeparate(params.storage)) {
		reportPath = resolveSeparateReportPath(params.workspaceDir, params.phase, nowMs, params.timezone);
		const report = [
			`# ${params.phase === "light" ? "Light Sleep" : "REM Sleep"}`,
			"",
			body,
			""
		].join("\n");
		await replaceDreamingMarkdownFile(reportPath, report, params.workspaceDir);
	}
	await appendMemoryHostEvent(params.workspaceDir, {
		type: "memory.dream.completed",
		timestamp: resolveMemoryCoreTimestamp(nowMs),
		phase: params.phase,
		outcome: "completed",
		...inlinePath ? { inlinePath } : {},
		...reportPath ? { reportPath } : {},
		lineCount: params.bodyLines.length,
		storageMode: params.storage.mode
	});
	return {
		...inlinePath ? { inlinePath } : {},
		...reportPath ? { reportPath } : {}
	};
}
async function writeDeepDreamingReport(params) {
	const nowMs = resolveMemoryCoreNowMs(params.nowMs);
	const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : "- No durable changes.";
	const inlinePath = params.hasContent ? await updateDeepDreamsFile({
		workspaceDir: params.workspaceDir,
		bodyLines: params.bodyLines
	}) : void 0;
	let reportPath;
	if (params.hasContent && shouldWriteSeparate(params.storage)) {
		reportPath = resolveSeparateReportPath(params.workspaceDir, "deep", nowMs, params.timezone);
		await replaceDreamingMarkdownFile(reportPath, `# Deep Sleep\n\n${body}\n`, params.workspaceDir);
	}
	await appendMemoryHostEvent(params.workspaceDir, {
		type: "memory.dream.completed",
		timestamp: resolveMemoryCoreTimestamp(nowMs),
		phase: "deep",
		outcome: "completed",
		inlinePath,
		...reportPath ? { reportPath } : {},
		lineCount: params.bodyLines.length,
		storageMode: params.storage.mode
	});
	return reportPath;
}
//#endregion
export { writeDailyDreamingPhaseBlock as n, writeDeepDreamingReport as r, replaceDreamingMarkdownFile as t };
