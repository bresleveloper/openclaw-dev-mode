import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { d as pathExists$1, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveRootPathSync } from "@openclaw/fs-safe/advanced";
import { isPathInside } from "@openclaw/fs-safe/path";
//#region src/skills/lifecycle/workspace-skill-write.ts
const ALLOWED_SUPPORT_FILE_ROOTS = new Set("assets examples references scripts templates".split(" "));
const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES = 262144;
function normalizeWorkspaceSkillSupportPath(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Support file path is required.");
	if (trimmed.includes("\\")) throw new Error("Support file paths must use forward slashes.");
	if (path.posix.isAbsolute(trimmed)) throw new Error("Support file paths must be relative.");
	if (trimmed.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))) throw new Error("Support file paths must use plain relative path segments.");
	if (!ALLOWED_SUPPORT_FILE_ROOTS.has(trimmed.split("/")[0] ?? "")) throw new Error(`Support file paths must be under one of: ${[...ALLOWED_SUPPORT_FILE_ROOTS].join(", ")}.`);
	return trimmed;
}
function assertWorkspaceSkillSupportPathSetIsFileOnly(paths) {
	const sorted = paths.toSorted((a, b) => a.localeCompare(b));
	for (const filePath of sorted) {
		if (!filePath.includes("/")) throw new Error("Support file paths must include a file below an allowed support directory.");
		const ancestor = sorted.find((candidate) => filePath.startsWith(`${candidate}/`));
		if (ancestor) throw new Error(`Support file paths cannot overlap: ${ancestor} and ${filePath}`);
	}
}
async function readWorkspaceSkillFile(filePath) {
	return readPreparedWorkspaceFile({
		rootDir: path.dirname(filePath),
		relativePath: path.basename(filePath)
	}, 1048576);
}
async function readWorkspaceSupportFile(params) {
	return readPreparedWorkspaceFile({
		rootDir: params.skillDir,
		relativePath: normalizeWorkspaceSkillSupportPath(params.relativePath)
	}, MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES);
}
async function prepareWorkspaceSkillRestoration(params) {
	assertInsideSkillsRoot(params.skillsRoot, params.skillDir, "skill directory");
	await fs.mkdir(params.skillsRoot, { recursive: true });
	const supportFiles = (params.supportFiles ?? []).map((file) => ({
		path: normalizeWorkspaceSkillSupportPath(file.path),
		previousContent: file.previousContent,
		proposedContentHash: file.proposedContentHash
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(supportFiles.map((file) => file.path));
	const prepareFile = (filePath, file) => ({
		filePath,
		...resolveSkillsRootWriteTarget(params.skillsRoot, filePath),
		previousContent: file.previousContent,
		content: file.previousContent ?? "",
		proposedContentHash: file.proposedContentHash
	});
	const skillFile = prepareFile(params.skillFile, params);
	return {
		mode: params.mode,
		skillFile,
		supportFiles: supportFiles.map((file) => Object.assign({ path: file.path }, prepareFile(path.join(params.skillDir, ...file.path.split("/")), file)))
	};
}
async function restoreWorkspaceSkillMutation(mutation) {
	await restorePreparedWorkspaceFiles(mutation.mode === "create" ? [mutation.skillFile, ...mutation.supportFiles.toReversed()] : [...mutation.supportFiles.toReversed(), mutation.skillFile]);
}
async function restorePreparedWorkspaceFiles(files) {
	const errors = [];
	for (const file of files) try {
		const currentContent = await readPreparedWorkspaceFile(file, 1048576);
		if (currentContent === file.previousContent) continue;
		if (currentContent === null || sha256Hex(currentContent) !== file.proposedContentHash) throw new Error(`Workspace skill target changed before restoration: ${file.filePath}`);
		const targetRoot = await root(file.rootDir);
		if (file.previousContent === null) await targetRoot.remove(file.relativePath).catch((error) => {
			if (error?.code !== "ENOENT") throw error;
		});
		else await targetRoot.write(file.relativePath, file.previousContent, {
			encoding: "utf8",
			mkdir: true,
			overwrite: true
		});
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to restore the previous workspace skill state.");
}
async function readPreparedWorkspaceFile(file, maxBytes) {
	if (!await pathExists$1(path.join(file.rootDir, file.relativePath))) return null;
	return (await (await root(file.rootDir)).read(file.relativePath, {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
function resolveSkillsRootWriteTarget(skillsRoot, filePath) {
	assertInsideSkillsRoot(skillsRoot, filePath, "skill file");
	const rootDir = path.resolve(skillsRoot);
	return {
		rootDir,
		relativePath: path.relative(rootDir, path.resolve(filePath))
	};
}
function assertInsideSkillsRoot(skillsRoot, targetPath, label) {
	const resolvedRoot = path.resolve(skillsRoot);
	const resolvedTarget = path.resolve(targetPath);
	if (resolvedTarget !== resolvedRoot && !isPathInside(resolvedRoot, resolvedTarget)) throw new Error(`${label} must stay inside the Skill Workshop directory.`);
	try {
		resolveRootPathSync({
			rootPath: resolvedRoot,
			absolutePath: resolvedTarget,
			boundaryLabel: "Skill Workshop directory"
		});
	} catch (cause) {
		throw new Error(`${label} must stay inside the Skill Workshop directory.`, { cause });
	}
}
//#endregion
export { readWorkspaceSkillFile as a, prepareWorkspaceSkillRestoration as i, assertInsideSkillsRoot as n, readWorkspaceSupportFile as o, normalizeWorkspaceSkillSupportPath as r, restoreWorkspaceSkillMutation as s, MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES as t };
