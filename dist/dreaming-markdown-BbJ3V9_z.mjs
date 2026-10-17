import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { y as formatMemoryDreamingDay } from "./dreaming-D1wokp9N.mjs";
import "./error-runtime-BmospGvZ.mjs";
import { r as replaceFileAtomic } from "./security-runtime-CpTHQYW2.mjs";
import { c as readWorkspaceText, n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-docED8m2.mjs";
import "./memory-core-host-status-Dr95_6D1.mjs";
import { t as appendMemoryHostEvent } from "./memory-host-events-gTbbZe8r.mjs";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-CDZAV0_W.mjs";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-BhFVUM0b.mjs";
import { l as updateDeepDreamsFile } from "./dreaming-dreams-file-V27TxMsY.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/dreaming-markdown.ts
const DAILY_PHASE_HEADINGS = {
	light: "## Light Sleep",
	rem: "## REM Sleep"
};
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
			const updated = replaceManagedMarkdownBlock({
				original: original ?? "",
				heading: DAILY_PHASE_HEADINGS[params.phase],
				startMarker: `<!-- openclaw:dreaming:${params.phase}:start -->`,
				endMarker: `<!-- openclaw:dreaming:${params.phase}:end -->`,
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
