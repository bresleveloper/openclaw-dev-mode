import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { _ as shortenHomePath } from "./utils-BApvfmPs.js";
import { t as resolveAgentSessionDirs } from "./session-dirs-D4v_ujH0.js";
import { a as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath, i as mergeSessionTranscriptTreePaths, l as selectSessionTranscriptTreePathNodes, n as isSessionTranscriptLeafControl, s as scanSessionTranscriptTree } from "./transcript-tree-3cM1TqAJ.js";
import { d as stripInternalRuntimeContext, l as hasInternalRuntimeContext } from "./internal-runtime-context-BH_40W4f.js";
import { t as note } from "./note-DXV6Ywsc.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-session-transcripts.ts
const LEGACY_OPENAI_CODEX_PROVIDER_ID = "openai-codex";
const OPENAI_PROVIDER_ID = "openai";
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
function parseTranscriptEntries(raw) {
	const entries = [];
	for (const line of raw.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const parsed = JSON.parse(line);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) entries.push(parsed);
		} catch {
			return [];
		}
	}
	return entries;
}
function getEntryId(entry) {
	return typeof entry.id === "string" && entry.id.trim() ? entry.id : null;
}
function getParentId(entry) {
	return typeof entry.parentId === "string" && entry.parentId.trim() ? entry.parentId : null;
}
function getMessage(entry) {
	return entry.message && typeof entry.message === "object" && !Array.isArray(entry.message) ? entry.message : null;
}
function withSelectedParent(entry, parentId) {
	return entry.parentId === parentId ? entry : {
		...entry,
		parentId
	};
}
function normalizeLegacyOpenAICodexTranscriptMetadata(entries) {
	let changed = 0;
	for (const entry of entries) {
		const message = getMessage(entry);
		if (!message) continue;
		let touched = false;
		if (message.provider === LEGACY_OPENAI_CODEX_PROVIDER_ID) {
			message.provider = OPENAI_PROVIDER_ID;
			touched = true;
		}
		if (message.api === LEGACY_OPENAI_CODEX_RESPONSES_API) {
			message.api = OPENAI_CHATGPT_RESPONSES_API;
			touched = true;
		}
		if (touched) changed += 1;
	}
	return changed;
}
function textFromContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return null;
	return content.map((part) => part && typeof part === "object" && typeof part.text === "string" ? part.text : "").join("") || null;
}
function selectActivePath(entries) {
	const sessionEntries = entries.filter((entry) => entry.type !== "session");
	const tree = scanSessionTranscriptTree(sessionEntries);
	if (!tree.hasExplicitLeafUpdate) {
		const byId = /* @__PURE__ */ new Map();
		for (const entry of sessionEntries) {
			const id = getEntryId(entry);
			if (id) byId.set(id, entry);
		}
		const active = [];
		const seen = /* @__PURE__ */ new Set();
		let current = sessionEntries.at(-1);
		while (current) {
			const id = getEntryId(current);
			if (!id || seen.has(id)) return null;
			seen.add(id);
			active.unshift(current);
			const parentId = getParentId(current);
			current = parentId ? byId.get(parentId) : void 0;
		}
		return active.length > 0 ? {
			entries: active,
			entriesToPersist: active,
			terminalLeafControl: null,
			appendParentId: getEntryId(active.at(-1) ?? {})
		} : null;
	}
	if (!tree.hasLeafUpdate) return null;
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const appendPath = selectSessionTranscriptTreePathNodes(tree, tree.appendParentId);
	const visibleEntries = mergeSessionTranscriptTreePaths([visiblePath]).map((node) => withSelectedParent(node.entry, node.selectedParentId));
	const persistedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath,
		appendPath,
		appendParentId: tree.appendParentId
	});
	const entriesToPersist = persistedPath.nodes.map((node) => withSelectedParent(node.entry, node.selectedParentId));
	const lastLeafUpdateEntry = tree.nodes.findLast((node) => node.leafId !== void 0)?.entry;
	return {
		entries: visibleEntries,
		entriesToPersist,
		terminalLeafControl: isSessionTranscriptLeafControl(lastLeafUpdateEntry) ? lastLeafUpdateEntry : null,
		appendParentId: persistedPath.appendParentId
	};
}
function hasBrokenPromptRewriteBranch(entries, activePath) {
	const activeIds = new Set(activePath.map(getEntryId).filter((id) => Boolean(id)));
	const activeUserByParentAndText = /* @__PURE__ */ new Set();
	for (const entry of activePath) {
		const id = getEntryId(entry);
		const message = getMessage(entry);
		if (!id || message?.role !== "user") continue;
		const text = textFromContent(message.content);
		if (text !== null) activeUserByParentAndText.add(`${getParentId(entry) ?? ""}\0${text.trim()}`);
	}
	for (const entry of entries) {
		const id = getEntryId(entry);
		if (!id || activeIds.has(id)) continue;
		const message = getMessage(entry);
		if (message?.role !== "user") continue;
		const text = textFromContent(message.content);
		if (!text || !hasInternalRuntimeContext(text)) continue;
		const visibleText = stripInternalRuntimeContext(text).trim();
		if (visibleText && activeUserByParentAndText.has(`${getParentId(entry) ?? ""}\0${visibleText}`)) return true;
	}
	return false;
}
async function writeActiveTranscript(params) {
	const header = params.entries.find((entry) => entry.type === "session");
	if (!header) throw new Error("missing session header");
	const backupPath = `${params.filePath}.pre-doctor-branch-repair-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.bak`;
	await fs.copyFile(params.filePath, backupPath);
	const lastPersistedId = getEntryId(params.activePath.entriesToPersist.at(-1) ?? {});
	const terminalLeafControl = params.activePath.terminalLeafControl ? {
		...params.activePath.terminalLeafControl,
		parentId: lastPersistedId,
		appendParentId: params.activePath.appendParentId
	} : null;
	const next = [
		header,
		...params.activePath.entriesToPersist,
		...terminalLeafControl ? [terminalLeafControl] : []
	].map((entry) => JSON.stringify(entry)).join("\n");
	await fs.writeFile(params.filePath, `${next}\n`, "utf-8");
	return backupPath;
}
async function writeTranscriptEntries(params) {
	const backupPath = `${params.filePath}.pre-doctor-openai-codex-repair-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.bak`;
	await fs.copyFile(params.filePath, backupPath);
	const next = params.entries.map((entry) => JSON.stringify(entry)).join("\n");
	await fs.writeFile(params.filePath, `${next}\n`, "utf-8");
	return backupPath;
}
/** Repairs one transcript file by keeping the active branch and backing up the original file. */
async function repairBrokenSessionTranscriptFile(params) {
	try {
		const entries = parseTranscriptEntries(await fs.readFile(params.filePath, "utf-8"));
		const legacyOpenAICodexEntries = normalizeLegacyOpenAICodexTranscriptMetadata(entries);
		const activePath = selectActivePath(entries);
		if (!activePath) {
			if (legacyOpenAICodexEntries > 0 && params.shouldRepair) {
				const backupPath = await writeTranscriptEntries({
					filePath: params.filePath,
					entries
				});
				return {
					filePath: params.filePath,
					broken: true,
					repaired: true,
					originalEntries: entries.length,
					activeEntries: 0,
					legacyOpenAICodexEntries,
					backupPath,
					reason: "no active branch"
				};
			}
			return {
				filePath: params.filePath,
				broken: legacyOpenAICodexEntries > 0,
				repaired: false,
				originalEntries: entries.length,
				activeEntries: 0,
				legacyOpenAICodexEntries,
				reason: "no active branch"
			};
		}
		const broken = hasBrokenPromptRewriteBranch(entries, activePath.entries);
		if (!broken && legacyOpenAICodexEntries === 0) return {
			filePath: params.filePath,
			broken: false,
			repaired: false,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries
		};
		if (!params.shouldRepair) return {
			filePath: params.filePath,
			broken: true,
			repaired: false,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries
		};
		const backupPath = broken ? await writeActiveTranscript({
			filePath: params.filePath,
			entries,
			activePath
		}) : await writeTranscriptEntries({
			filePath: params.filePath,
			entries
		});
		return {
			filePath: params.filePath,
			broken: true,
			repaired: true,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries,
			backupPath
		};
	} catch (err) {
		return {
			filePath: params.filePath,
			broken: false,
			repaired: false,
			originalEntries: 0,
			activeEntries: 0,
			legacyOpenAICodexEntries: 0,
			reason: String(err)
		};
	}
}
async function listSessionTranscriptFiles(sessionDirs) {
	const files = [];
	for (const sessionsDir of sessionDirs) {
		let entries;
		try {
			entries = await fs.readdir(sessionsDir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(path.join(sessionsDir, entry.name));
	}
	return files.toSorted((a, b) => a.localeCompare(b));
}
/** Scans session transcript files and reports or repairs legacy/broken transcript state. */
async function noteSessionTranscriptHealth(params) {
	const shouldRepair = params?.shouldRepair === true;
	let sessionDirs = params?.sessionDirs;
	try {
		sessionDirs ??= await resolveAgentSessionDirs(resolveStateDir(process.env));
	} catch (err) {
		note(`- Failed to inspect session transcripts: ${String(err)}`, "Session transcripts");
		return;
	}
	const files = await listSessionTranscriptFiles(sessionDirs);
	if (files.length === 0) return;
	const results = [];
	for (const filePath of files) results.push(await repairBrokenSessionTranscriptFile({
		filePath,
		shouldRepair
	}));
	const broken = results.filter((result) => result.broken);
	if (broken.length === 0) return;
	const repairedCount = broken.filter((result) => result.repaired).length;
	const lines = [`- Found ${broken.length} transcript file${broken.length === 1 ? "" : "s"} with legacy state.`, ...broken.slice(0, 20).map((result) => {
		const backup = result.backupPath ? ` backup=${shortenHomePath(result.backupPath)}` : "";
		const status = result.repaired ? "repaired" : "needs repair";
		const metadata = result.legacyOpenAICodexEntries > 0 ? ` openai-codex=${result.legacyOpenAICodexEntries}` : "";
		return `- ${shortenHomePath(result.filePath)} ${status} entries=${result.originalEntries}->${result.activeEntries + 1}${metadata}${backup}`;
	})];
	if (broken.length > 20) lines.push(`- ...and ${broken.length - 20} more.`);
	if (!shouldRepair) lines.push("- Run \"openclaw doctor --fix\" to rewrite affected files to their active branch.");
	else if (repairedCount > 0) lines.push(`- Repaired ${repairedCount} transcript file${repairedCount === 1 ? "" : "s"}.`);
	note(lines.join("\n"), "Session transcripts");
}
//#endregion
export { noteSessionTranscriptHealth };
