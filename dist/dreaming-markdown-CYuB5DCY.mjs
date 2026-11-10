import { a as extractErrorCode } from "./error-coercion-BwMr25F8.mjs";
import { _ as formatMemoryDreamingDay } from "./dreaming-D2xE6WEV.mjs";
import "./error-runtime-ikopZs5O.mjs";
import { r as replaceFileAtomic } from "./security-runtime-6domDoE8.mjs";
import { c as readWorkspaceText, n as getMemoryWorkspaceMaintenance } from "./memory-workspace-files-_Z-dpV0O.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import { t as appendMemoryHostEvent } from "./memory-host-events-DBc6Iizu.mjs";
import { n as withTrailingNewline, t as replaceManagedMarkdownBlock } from "./memory-host-markdown-DwzbxsY_.mjs";
import { n as resolveMemoryCoreTimestamp, t as resolveMemoryCoreNowMs } from "./time-BhFVUM0b.mjs";
import { l as updateDeepDreamsFile } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/memory-core/src/dreaming-markdown.ts
const PHASE_TITLES = {
	light: "Light Sleep",
	rem: "REM Sleep",
	deep: "Deep Sleep"
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
async function writeDreamingReport(params) {
	const nowMs = resolveMemoryCoreNowMs(params.nowMs);
	const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : params.phase === "deep" ? "- No durable changes." : "- No notable updates.";
	let inlinePath;
	let reportPath;
	if (params.phase === "deep") {
		if (params.hasContent) inlinePath = await updateDeepDreamsFile(params);
	} else if (shouldWriteInline(params.storage)) {
		const candidatePath = resolveDailyMemoryPath(params.workspaceDir, nowMs, params.timezone);
		const original = await readWorkspaceText(params.workspaceDir, candidatePath).catch((err) => {
			if (extractErrorCode(err) === "ENOENT") return;
			throw err;
		});
		if (params.hasContent || original !== void 0) {
			inlinePath = candidatePath;
			const updated = replaceManagedMarkdownBlock({
				original: original ?? "",
				heading: `## ${PHASE_TITLES[params.phase]}`,
				startMarker: `<!-- openclaw:dreaming:${params.phase}:start -->`,
				endMarker: `<!-- openclaw:dreaming:${params.phase}:end -->`,
				body
			});
			await replaceDreamingMarkdownFile(inlinePath, withTrailingNewline(updated), params.workspaceDir);
		}
	}
	if (params.hasContent && shouldWriteSeparate(params.storage)) {
		reportPath = resolveSeparateReportPath(params.workspaceDir, params.phase, nowMs, params.timezone);
		const report = `# ${PHASE_TITLES[params.phase]}\n\n${body}\n`;
		await replaceDreamingMarkdownFile(reportPath, report, params.workspaceDir);
	}
	await appendMemoryHostEvent(params.workspaceDir, {
		type: "memory.dream.completed",
		timestamp: resolveMemoryCoreTimestamp(nowMs),
		phase: params.phase,
		outcome: "completed",
		...params.phase === "deep" || inlinePath ? { inlinePath } : {},
		...reportPath ? { reportPath } : {},
		lineCount: params.bodyLines.length,
		storageMode: params.storage.mode
	});
	return {
		...inlinePath ? { inlinePath } : {},
		...reportPath ? { reportPath } : {}
	};
}
async function writeDailyDreamingPhaseBlock(params) {
	return await writeDreamingReport(params);
}
async function writeDeepDreamingReport(params) {
	return (await writeDreamingReport({
		...params,
		phase: "deep"
	})).reportPath;
}
//#endregion
export { writeDailyDreamingPhaseBlock as n, writeDeepDreamingReport as r, replaceDreamingMarkdownFile as t };
