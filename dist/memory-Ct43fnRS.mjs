import { a as canonicalPathFromExistingAncestor } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { n as MIGRATION_REASON_TARGET_EXISTS, o as createMigrationItem } from "./migration-DepQtnwV.mjs";
import { a as readMemoryDir, n as CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES, t as CLAUDE_AUTO_MEMORY_MAX_FILES } from "./source-BEYzxxEE.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/migrate-claude/memory.ts
const MIGRATION_REASON_TARGET_NOT_REGULAR = "target is not a regular file";
async function lstatIfExists(filePath) {
	try {
		return await fs.lstat(filePath);
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? String(error.code) : void 0;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw error;
	}
}
async function addInstructionItem(params) {
	if (!params.source) return;
	const targetNotRegular = (await lstatIfExists(params.target))?.isFile() === false;
	params.items.push(createMigrationItem({
		id: params.id,
		kind: ["AGENTS.md", "USER.md"].includes(path.basename(params.target)) ? "workspace" : "memory",
		action: "append",
		source: params.source,
		target: params.target,
		status: targetNotRegular ? "conflict" : "planned",
		reason: targetNotRegular ? MIGRATION_REASON_TARGET_NOT_REGULAR : void 0,
		details: { sourceLabel: params.sourceLabel }
	}));
}
async function listMarkdownFiles(root, maxFiles) {
	const files = [];
	const pending = [""];
	let visited = 0;
	let truncatedBy;
	scan: while (pending.length > 0) {
		const relativeDir = pending.pop();
		if (relativeDir === void 0) break;
		for (const entry of await readMemoryDir(path.join(root, relativeDir))) {
			visited += 1;
			if (visited > 2e4) {
				truncatedBy = "entries";
				break scan;
			}
			const relativePath = path.join(relativeDir, entry.name);
			if (entry.isDirectory()) pending.push(relativePath);
			else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
				files.push(relativePath);
				if (files.length > maxFiles) {
					truncatedBy = "files";
					break scan;
				}
			}
		}
	}
	return {
		files: files.toSorted((left, right) => left.localeCompare(right)),
		...truncatedBy ? { truncatedBy } : {}
	};
}
function collectionSlug(label, id) {
	return `${label.normalize("NFKD").replaceAll(/[^a-zA-Z0-9._-]+/gu, "-").replaceAll(/^[._-]+|[._-]+$/gu, "").slice(0, 72) || "project"}-${id}`;
}
async function resolveMemoryDestinationBoundary(sourceRoot, workspaceDir) {
	return {
		source: await fs.realpath(sourceRoot),
		workspace: await canonicalPathFromExistingAncestor(workspaceDir)
	};
}
async function assertSafeMemoryDestination(boundary, target) {
	const canonicalTarget = await canonicalPathFromExistingAncestor(target);
	if (!isPathInside(boundary.workspace, canonicalTarget)) throw new Error("Claude Code memory import destination must stay in the selected workspace.");
	if (isPathInside(boundary.source, canonicalTarget) || isPathInside(canonicalTarget, boundary.source)) throw new Error("Claude Code auto-memory source and OpenClaw import destination must be separate directories.");
}
async function buildAutoMemoryItems(params) {
	const items = [];
	for (const collection of params.source.autoMemorySources) {
		const destinationBoundary = await resolveMemoryDestinationBoundary(collection.path, params.targets.workspaceDir);
		const targetRoot = path.join(params.targets.workspaceDir, "memory", "imports", "claude-code", collectionSlug(collection.label, collection.id));
		await assertSafeMemoryDestination(destinationBoundary, targetRoot);
		const remaining = CLAUDE_AUTO_MEMORY_MAX_FILES - items.length;
		const scan = await listMarkdownFiles(collection.path, remaining);
		if (scan.truncatedBy) {
			const limit = scan.truncatedBy === "files" ? `${CLAUDE_AUTO_MEMORY_MAX_FILES} Markdown files across all collections` : `${CLAUDE_AUTO_MEMORY_MAX_SCAN_ENTRIES} filesystem entries in one collection`;
			throw new Error(`Claude Code auto-memory exceeds the safe import limit of ${limit}. Narrow or split the source memory before importing.`);
		}
		const files = scan.files;
		for (const relativePath of files) {
			const source = path.join(collection.path, relativePath);
			const target = path.join(targetRoot, relativePath);
			const targetStat = await lstatIfExists(target);
			const targetExists = targetStat !== void 0;
			const targetNotRegular = targetExists && !targetStat.isFile();
			if (!targetNotRegular) await assertSafeMemoryDestination(destinationBoundary, target);
			const targetConflict = targetNotRegular || targetExists && !params.overwrite;
			items.push(createMigrationItem({
				id: `memory:claude-auto:${collection.id}:${relativePath.replaceAll(path.sep, "/")}`,
				kind: "memory",
				action: "copy",
				source,
				target,
				status: targetConflict ? "conflict" : "planned",
				reason: targetNotRegular ? MIGRATION_REASON_TARGET_NOT_REGULAR : targetConflict ? MIGRATION_REASON_TARGET_EXISTS : void 0,
				message: "Copy Claude Code auto-memory Markdown into the OpenClaw memory index.",
				details: {
					sourceType: "claude-auto-memory",
					sourceLabel: "Claude Code auto-memory",
					collectionId: collection.id,
					collectionLabel: collection.label,
					collectionFileCount: files.length,
					relativePath: relativePath.replaceAll(path.sep, "/")
				}
			}));
		}
	}
	return items;
}
async function buildMemoryItems(params) {
	const items = [];
	if (params.includeInstructions !== false) {
		await addInstructionItem({
			items,
			id: "workspace:CLAUDE.md",
			source: params.source.projectMemoryPath,
			target: path.join(params.targets.workspaceDir, "AGENTS.md"),
			sourceLabel: "project CLAUDE.md"
		});
		await addInstructionItem({
			items,
			id: "workspace:.claude/CLAUDE.md",
			source: params.source.projectDotClaudeMemoryPath,
			target: path.join(params.targets.workspaceDir, "AGENTS.md"),
			sourceLabel: "project .claude/CLAUDE.md"
		});
		await addInstructionItem({
			items,
			id: "memory:user-CLAUDE.md",
			source: params.source.userMemoryPath,
			target: path.join(params.targets.workspaceDir, "USER.md"),
			sourceLabel: "user ~/.claude/CLAUDE.md"
		});
	}
	items.push(...await buildAutoMemoryItems(params));
	return items;
}
//#endregion
export { buildMemoryItems as t };
