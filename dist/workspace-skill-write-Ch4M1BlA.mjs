import { d as pathExists$1, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
async function prepareWorkspaceSkillMutation(params) {
	assertInsideSkillsRoot(params.skillsRoot, params.skillDir, "skill directory");
	await fs.mkdir(params.skillsRoot, { recursive: true });
	const supportFiles = normalizeSupportFiles(params.supportFiles ?? []);
	const skillTarget = await resolveSkillsRootWriteTarget({
		skillsRoot: params.skillsRoot,
		filePath: params.skillFile
	});
	const previousContent = await readWorkspaceSkillFile(params.skillFile);
	if (params.mode === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${params.skillFile}`);
	if (params.mode === "update" && previousContent === null) throw new Error(`Target skill is missing: ${params.skillFile}`);
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveSkillsRootWriteTarget({
			skillsRoot: params.skillsRoot,
			filePath
		});
		const previousSupportContent = await readWorkspaceSupportFile({
			skillDir: params.skillDir,
			relativePath: file.path
		});
		if (params.mode === "create" && previousSupportContent !== null) throw new Error(`Target support file already exists: ${filePath}`);
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: previousSupportContent,
			content: file.content,
			proposedContentHash: sha256Hex(file.content)
		});
	}
	return {
		mode: params.mode,
		skillsRoot: params.skillsRoot,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent,
			content: params.content,
			proposedContentHash: sha256Hex(params.content)
		},
		supportFiles: preparedSupportFiles
	};
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
	const skillTarget = await resolveSkillsRootWriteTarget({
		skillsRoot: params.skillsRoot,
		filePath: params.skillFile
	});
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveSkillsRootWriteTarget({
			skillsRoot: params.skillsRoot,
			filePath
		});
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: file.previousContent,
			content: file.previousContent ?? "",
			proposedContentHash: file.proposedContentHash
		});
	}
	return {
		mode: params.mode,
		skillsRoot: params.skillsRoot,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent: params.previousContent,
			content: params.previousContent ?? "",
			proposedContentHash: params.proposedContentHash
		},
		supportFiles: preparedSupportFiles
	};
}
async function applyWorkspaceSkillMutation(mutation, writeFile = writeWorkspaceSkillFile) {
	const written = [];
	try {
		for (const file of mutation.supportFiles) {
			await writePreparedWorkspaceFile(file, mutation.mode === "update", writeFile);
			written.push(file);
		}
		await writePreparedWorkspaceFile(mutation.skillFile, mutation.mode === "update", writeFile);
	} catch (error) {
		try {
			await restorePreparedWorkspaceFiles(written.toReversed());
		} catch (restoreError) {
			const failure = new Error(`Skill write failed and ${written.length} support file restoration(s) failed.`, { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function restoreWorkspaceSkillMutation(mutation) {
	await restorePreparedWorkspaceFiles(mutation.mode === "create" ? [mutation.skillFile, ...mutation.supportFiles.toReversed()] : [...mutation.supportFiles.toReversed(), mutation.skillFile]);
}
async function isWorkspaceSkillMutationApplied(mutation) {
	return matchesWorkspaceSkillMutation(mutation, "content");
}
async function matchesWorkspaceSkillMutation(mutation, field) {
	if (await readPreparedWorkspaceFile(mutation.skillFile, 1048576) !== mutation.skillFile[field]) return false;
	for (const file of mutation.supportFiles) if (await readPreparedWorkspaceFile(file, 262144) !== file[field]) return false;
	return true;
}
async function isWorkspaceSkillMutationRestored(mutation) {
	try {
		return await matchesWorkspaceSkillMutation(mutation, "previousContent");
	} catch {
		return false;
	}
}
function normalizeSupportFiles(supportFiles) {
	const normalized = supportFiles.map((file) => ({
		...file,
		path: normalizeWorkspaceSkillSupportPath(file.path)
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(normalized.map((file) => file.path));
	return normalized;
}
async function writePreparedWorkspaceFile(file, overwrite, writeFile) {
	try {
		await writeFile(file, overwrite);
	} catch (error) {
		const currentContent = await readPreparedWorkspaceFile(file, 1048576).catch(() => null);
		if (currentContent === file.content && currentContent !== file.previousContent) try {
			await restorePreparedWorkspaceFiles([file]);
		} catch (restoreError) {
			const failure = new Error("Skill write failed after commit and restoration failed.", { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function writeWorkspaceSkillFile(file, overwrite) {
	await (await root(file.rootDir)).write(file.relativePath, file.content, {
		encoding: "utf8",
		mkdir: true,
		overwrite
	});
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
async function resolveSkillsRootWriteTarget(params) {
	assertInsideSkillsRoot(params.skillsRoot, params.filePath, "skill file");
	const skillsRoot = path.resolve(params.skillsRoot);
	const filePath = path.resolve(params.filePath);
	return {
		rootDir: skillsRoot,
		relativePath: path.relative(skillsRoot, filePath)
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
export { isWorkspaceSkillMutationApplied as a, prepareWorkspaceSkillMutation as c, readWorkspaceSupportFile as d, restoreWorkspaceSkillMutation as f, assertWorkspaceSkillSupportPathSetIsFileOnly as i, prepareWorkspaceSkillRestoration as l, applyWorkspaceSkillMutation as n, isWorkspaceSkillMutationRestored as o, assertInsideSkillsRoot as r, normalizeWorkspaceSkillSupportPath as s, MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES as t, readWorkspaceSkillFile as u };
