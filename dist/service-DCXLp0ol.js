import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as isPathInside } from "./path-BlG8lhgR.js";
import { a as walkDirectory, w as pathExists } from "./fs-safe-aqmM_n6V.js";
import { a as root, i as readLocalFileSafely } from "./secure-temp-dir-XAWcZnE2.js";
import { o as tryReadJson } from "./json-files-2umMHm0W.js";
import "./path-safety-CBe_wA_B.js";
import { o as withFileLock } from "./file-lock-BOaqUSu6.js";
import "./file-lock-DQM8YrNh.js";
import { t as resolveSkillWorkshopConfig } from "./config-XlfFMqhc.js";
import { s as parseFrontmatter } from "./config-CUiL6xlQ.js";
import { m as normalizeSkillIndexName } from "./workspace-CD16JXyF.js";
import { n as resolveAllowedSkillSymlinkTargetRealPaths, t as findContainingAllowedSkillSymlinkTarget } from "./symlink-targets-D2Goh3S5.js";
import { n as resolveSkillStatusEntry, t as buildWorkspaceSkillStatus } from "./status-C0XQsYcO.js";
import { t as bumpSkillsSnapshotVersion } from "./refresh-state-DHnXO3IV.js";
import { a as scanSource, i as scanSkillContent } from "./scanner-CEXIvQtC.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region src/skills/lifecycle/workspace-skill-write.ts
const ALLOWED_SUPPORT_FILE_ROOTS = new Set("assets examples references scripts templates".split(" "));
const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES = 256 * 1024;
function normalizeWorkspaceSkillSupportPath(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Support file path is required.");
	if (trimmed.includes("\\")) throw new Error("Support file paths must use forward slashes.");
	if (path.posix.isAbsolute(trimmed)) throw new Error("Support file paths must be relative.");
	if (trimmed.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))) throw new Error("Support file paths must use plain relative path segments.");
	if (!ALLOWED_SUPPORT_FILE_ROOTS.has(trimmed.split("/")[0] ?? "")) throw new Error(`Support file paths must be under one of: ${[...ALLOWED_SUPPORT_FILE_ROOTS].join(", ")}.`);
	if (trimmed === "PROPOSAL.md" || trimmed === "SKILL.md") throw new Error("Support files cannot replace the proposal or skill markdown file.");
	return trimmed;
}
function assertWorkspaceSkillSupportPathSetIsFileOnly(paths) {
	const sorted = paths.toSorted((a, b) => a.localeCompare(b));
	for (const filePath of sorted) if (!filePath.includes("/")) throw new Error("Support file paths must include a file below an allowed support directory.");
	for (let index = 1; index < sorted.length; index += 1) {
		const previous = sorted[index - 1];
		const current = sorted[index];
		if (previous && current?.startsWith(`${previous}/`)) throw new Error(`Support file paths cannot overlap: ${previous} and ${current}`);
	}
}
async function readWorkspaceSkillFile(filePath) {
	if (!await pathExists(filePath)) return null;
	return (await (await root(path.dirname(filePath))).read(path.basename(filePath), {
		hardlinks: "reject",
		maxBytes: 1024 * 1024,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function readWorkspaceSupportFile(params) {
	const relativePath = normalizeWorkspaceSkillSupportPath(params.relativePath);
	if (!await pathExists(path.join(params.skillDir, ...relativePath.split("/")))) return null;
	return (await (await root(params.skillDir)).read(relativePath, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function assertWorkspaceSkillWriteTarget(params) {
	await resolveWorkspaceSkillWriteTarget(params);
}
async function writeWorkspaceSkill(params) {
	assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
	const supportFiles = normalizeSupportFiles(params.supportFiles ?? []);
	const previousSupportFiles = await prepareWorkspaceSkillWrite({
		mode: params.mode,
		workspaceDir: params.workspaceDir,
		skillDir: params.skillDir,
		skillFile: params.skillFile,
		supportFiles,
		symlinkPolicy: params.symlinkPolicy
	});
	const writtenSupportPaths = [];
	try {
		for (const file of supportFiles) {
			await writeWorkspaceFile({
				workspaceDir: params.workspaceDir,
				filePath: path.join(params.skillDir, ...file.path.split("/")),
				content: file.content,
				overwrite: params.mode === "update",
				symlinkPolicy: params.symlinkPolicy
			});
			writtenSupportPaths.push(file.path);
		}
		await writeWorkspaceFile({
			workspaceDir: params.workspaceDir,
			filePath: params.skillFile,
			content: params.content,
			overwrite: params.mode === "update",
			symlinkPolicy: params.symlinkPolicy
		});
	} catch (error) {
		await restoreSupportFilesAfterFailedWrite({
			mode: params.mode,
			workspaceDir: params.workspaceDir,
			skillDir: params.skillDir,
			writtenSupportPaths,
			previousSupportFiles,
			symlinkPolicy: params.symlinkPolicy
		});
		throw error;
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
async function prepareWorkspaceSkillWrite(params) {
	await resolveWorkspaceSkillWriteTarget({
		workspaceDir: params.workspaceDir,
		filePath: params.skillFile,
		symlinkPolicy: params.symlinkPolicy
	});
	const previousContent = await readWorkspaceSkillFile(params.skillFile);
	if (params.mode === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${params.skillFile}`);
	if (params.mode === "update" && previousContent === null) throw new Error(`Target skill is missing: ${params.skillFile}`);
	const previousSupportFiles = [];
	for (const file of params.supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		await resolveWorkspaceSkillWriteTarget({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
		if (params.mode === "update") {
			const previousSupportContent = await readWorkspaceSupportFile({
				skillDir: params.skillDir,
				relativePath: file.path
			});
			previousSupportFiles.push(previousSupportContent === null ? {
				path: file.path,
				existed: false
			} : {
				path: file.path,
				existed: true,
				previousContent: previousSupportContent
			});
		}
	}
	return previousSupportFiles;
}
async function writeWorkspaceFile(params) {
	const target = await resolveWorkspaceSkillWriteTarget(params);
	await (await root(target.rootDir)).write(target.relativePath, params.content, {
		encoding: "utf8",
		mkdir: true,
		overwrite: params.overwrite
	});
}
async function removeWorkspaceFile(params) {
	const target = await resolveWorkspaceSkillWriteTarget(params);
	await (await root(target.rootDir)).remove(target.relativePath).catch((error) => {
		if (error?.code !== "ENOENT") throw error;
	});
}
async function restoreSupportFilesAfterFailedWrite(params) {
	const previousByPath = new Map(params.previousSupportFiles.map((file) => [file.path, file]));
	await Promise.allSettled(params.writtenSupportPaths.toReversed().map(async (relativePath) => {
		const filePath = path.join(params.skillDir, ...relativePath.split("/"));
		const previous = previousByPath.get(relativePath);
		if (params.mode === "update" && previous?.existed) await writeWorkspaceFile({
			workspaceDir: params.workspaceDir,
			filePath,
			content: previous.previousContent ?? "",
			overwrite: true,
			symlinkPolicy: params.symlinkPolicy
		});
		else await removeWorkspaceFile({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
	}));
}
async function resolveWorkspaceSkillWriteTarget(params) {
	assertInsideWorkspace(params.workspaceDir, params.filePath, "skill file");
	const workspaceDir = path.resolve(params.workspaceDir);
	const filePath = path.resolve(params.filePath);
	const aliasTarget = await resolveWorkspaceAliasTarget({
		workspaceDir,
		filePath
	});
	if (!aliasTarget) return {
		rootDir: workspaceDir,
		relativePath: path.relative(workspaceDir, filePath)
	};
	const allowedRoot = params.symlinkPolicy.allowWrites ? findContainingAllowedSkillSymlinkTarget(params.symlinkPolicy.allowedTargetRealPaths, aliasTarget.realTarget) : null;
	if (!allowedRoot) throw new Error(`Skill file resolves through an untrusted symlink target: ${params.filePath}. Configure skills.load.allowSymlinkTargets and enable skills.workshop.allowSymlinkTargetWrites for intentional Skill Workshop symlink writes.`);
	return {
		rootDir: allowedRoot,
		relativePath: path.relative(allowedRoot, aliasTarget.realTarget)
	};
}
async function resolveWorkspaceAliasTarget(params) {
	const workspaceRealPath = await tryRealpath(params.workspaceDir) ?? params.workspaceDir;
	const realTarget = await resolveRealPathThroughExistingAncestors(params.workspaceDir, params.filePath);
	return isPathInside(workspaceRealPath, realTarget) ? null : { realTarget };
}
async function resolveRealPathThroughExistingAncestors(workspaceDir, filePath) {
	const segments = path.relative(workspaceDir, filePath).split(path.sep).filter(Boolean);
	let lexicalCursor = workspaceDir;
	let realCursor = await tryRealpath(workspaceDir) ?? workspaceDir;
	for (const segment of segments) {
		lexicalCursor = path.join(lexicalCursor, segment);
		realCursor = await tryRealpath(lexicalCursor) ?? path.join(realCursor, segment);
	}
	return path.resolve(realCursor);
}
async function tryRealpath(filePath) {
	try {
		return await fs.realpath(filePath);
	} catch {
		return null;
	}
}
function assertInsideWorkspace(workspaceDir, targetPath, label) {
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	const resolvedTarget = path.resolve(targetPath);
	if (resolvedTarget !== resolvedWorkspaceDir && !isPathInside(resolvedWorkspaceDir, resolvedTarget)) throw new Error(`${label} must stay inside the workspace.`);
}
//#endregion
//#region src/skills/workshop/frontmatter.ts
function yamlScalar(value) {
	return JSON.stringify(value);
}
/** Renders proposal markdown while preserving allowed original frontmatter fields. */
function renderProposalMarkdown(params) {
	const originalFrontmatter = extractFrontmatterBlock(params.content) ?? (params.fallbackFrontmatterContent ? extractFrontmatterBlock(params.fallbackFrontmatterContent) : void 0);
	const keptFrontmatter = originalFrontmatter ? filterFrontmatterBlock(originalFrontmatter, [
		"name",
		"description",
		"status",
		"version",
		"date"
	]) : "";
	const body = stripFrontmatterBlock(params.content).trimStart();
	const version = params.version ?? "v1";
	const date = params.date ?? (/* @__PURE__ */ new Date()).toISOString();
	return `---\n${[
		`name: ${yamlScalar(params.name)}`,
		`description: ${yamlScalar(params.description)}`,
		"status: proposal",
		`version: ${yamlScalar(version)}`,
		`date: ${yamlScalar(date)}`,
		keptFrontmatter
	].filter(Boolean).join("\n")}\n---\n\n${body}`;
}
function readProposalFrontmatter(content) {
	const frontmatter = parseFrontmatter(content);
	const name = frontmatter.name?.trim();
	const description = frontmatter.description?.trim();
	const status = frontmatter.status?.trim().toLowerCase();
	if (!name || !description || status !== "proposal") return null;
	return {
		name,
		description
	};
}
function stripProposalFrontmatterForSkill(content) {
	const normalized = normalizeNewlines(content);
	if (!normalized.startsWith("---")) return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
	const endIndex = normalized.indexOf("\n---", 3);
	if (endIndex === -1) return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
	const rawBlock = normalized.slice(4, endIndex);
	const bodyStart = endIndex + 4;
	const body = normalized.slice(bodyStart).replace(/^\n+/, "");
	const keptLines = rawBlock.split("\n").filter((line) => {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		return key !== "status" && key !== "version" && key !== "date";
	}).join("\n").trim();
	const result = keptLines ? `---\n${keptLines}\n---\n\n${body}` : body;
	return result.endsWith("\n") ? result : `${result}\n`;
}
function extractFrontmatterBlock(content) {
	const normalized = normalizeNewlines(content);
	if (!normalized.startsWith("---")) return;
	const endIndex = normalized.indexOf("\n---", 3);
	if (endIndex === -1) return;
	return normalized.slice(4, endIndex);
}
function stripFrontmatterBlock(content) {
	const normalized = normalizeNewlines(content);
	if (extractFrontmatterBlock(normalized) === void 0) return normalized;
	const endIndex = normalized.indexOf("\n---", 3);
	return normalized.slice(endIndex + 4).replace(/^\n+/, "");
}
function filterFrontmatterBlock(block, keysToDrop) {
	const drop = new Set(keysToDrop.map((key) => key.toLowerCase()));
	const lines = block.split("\n");
	const kept = [];
	let dropping = false;
	for (const line of lines) {
		const key = line.match(/^([\w-]+):/)?.[1]?.toLowerCase();
		if (key) dropping = drop.has(key);
		if (!dropping) kept.push(line);
	}
	return kept.join("\n").trim();
}
function normalizeNewlines(content) {
	return content.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
//#endregion
//#region src/skills/workshop/types.ts
/** Schema id for persisted skill workshop proposal records. */
const SKILL_WORKSHOP_SCHEMA = "openclaw.skill-workshop.proposal.v1";
const SKILL_WORKSHOP_MANIFEST_SCHEMA = "openclaw.skill-workshop.proposals-manifest.v1";
const SKILL_WORKSHOP_ROLLBACK_SCHEMA = "openclaw.skill-workshop.rollback.v1";
//#endregion
//#region src/skills/workshop/store.ts
const WORKSHOP_REL_DIR = "skill-workshop";
const PROPOSALS_REL_DIR = path.join(WORKSHOP_REL_DIR, "proposals");
const TARGET_LOCKS_REL_DIR = path.join(WORKSHOP_REL_DIR, "locks");
const MANIFEST_REL_PATH = path.join(WORKSHOP_REL_DIR, "proposals.json");
const MANIFEST_LOCK_REL_PATH = path.join(TARGET_LOCKS_REL_DIR, "proposals-manifest");
const PROPOSAL_RECORD_FILE = "proposal.json";
const PROPOSAL_DRAFT_FILE = "PROPOSAL.md";
const PROPOSAL_ROLLBACK_FILE = "rollback.json";
const MAX_PROPOSAL_BYTES = 1024 * 1024;
const MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES = 2 * 1024 * 1024;
const PROPOSAL_ID_PATTERN = /^[a-z0-9][a-z0-9-]{5,120}$/;
const SKILL_WORKSHOP_LOCK_OPTIONS = {
	retries: {
		retries: 8,
		factor: 1.35,
		minTimeout: 10,
		maxTimeout: 250,
		randomize: true
	},
	stale: 6e4
};
const skillWorkshopProcessLocks = /* @__PURE__ */ new Map();
/** Creates a stable proposal id from skill name, date, and random suffix. */
function createSkillProposalId(name, now = /* @__PURE__ */ new Date()) {
	const normalized = normalizeSkillIndexName(name) || "skill";
	const date = now.toISOString().slice(0, 10).replaceAll("-", "");
	const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
	return `${normalized.slice(0, 60)}-${date}-${suffix}`;
}
function hashSkillProposalContent(content) {
	return crypto.createHash("sha256").update(content).digest("hex");
}
function contentSizeBytes(content) {
	return Buffer.byteLength(content, "utf8");
}
function assertSkillProposalContentSize(content) {
	if (contentSizeBytes(content) > MAX_PROPOSAL_BYTES) throw new Error("Skill proposal is too large.");
}
function resolveSkillWorkshopStateDir(options = {}) {
	return path.resolve(options.stateDir ?? resolveStateDir(options.env));
}
function resolveProposalDir(proposalId, options = {}) {
	assertProposalId(proposalId);
	return path.join(resolveSkillWorkshopStateDir(options), proposalRelativeDir(proposalId));
}
function resolveProposalRecordPath(proposalId, options = {}) {
	return path.join(resolveProposalDir(proposalId, options), PROPOSAL_RECORD_FILE);
}
function prepareSkillProposalSupportFiles(input) {
	if (!input || input.length === 0) return [];
	if (input.length > 64) throw new Error(`A skill proposal can include at most 64 files.`);
	const seen = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	const files = [];
	for (const file of input) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		if (seen.has(filePath)) throw new Error(`Duplicate support file path: ${filePath}`);
		seen.add(filePath);
		const sizeBytes = contentSizeBytes(file.content);
		if (sizeBytes > 262144) throw new Error(`Support file is too large: ${filePath}`);
		if (file.content.includes("\0")) throw new Error(`Support files must be UTF-8 text: ${filePath}`);
		totalBytes += sizeBytes;
		if (totalBytes > MAX_PROPOSAL_SUPPORT_FILES_TOTAL_BYTES) throw new Error("Skill proposal support files exceed the total size limit.");
		files.push({
			path: filePath,
			sizeBytes,
			hash: hashSkillProposalContent(file.content),
			content: file.content
		});
	}
	assertWorkspaceSkillSupportPathSetIsFileOnly(files.map((file) => file.path));
	return files;
}
function resolveSkillProposalTarget(params) {
	const skillKey = normalizeSkillIndexName(params.skillName);
	if (!skillKey) throw new Error("Skill name must contain at least one letter or number.");
	const skillDir = path.resolve(params.workspaceDir, "skills", skillKey);
	const skillFile = path.join(skillDir, "SKILL.md");
	assertInsideWorkspace(params.workspaceDir, skillDir, "skill directory");
	assertInsideWorkspace(params.workspaceDir, skillFile, "skill file");
	return {
		skillKey,
		skillDir,
		skillFile
	};
}
async function readSkillProposal(proposalId, options = {}) {
	const record = await readSkillProposalRecord(proposalId, options);
	if (!record) return null;
	return {
		record,
		content: (await (await root(resolveSkillWorkshopStateDir(options))).read(path.join(proposalRelativeDir(proposalId), PROPOSAL_DRAFT_FILE), {
			hardlinks: "reject",
			maxBytes: MAX_PROPOSAL_BYTES,
			symlinks: "reject"
		})).buffer.toString("utf8")
	};
}
async function readSkillProposalRecord(proposalId, options = {}) {
	return parseSkillProposalRecord(await tryReadJson(resolveProposalRecordPath(proposalId, options)));
}
async function writeSkillProposal(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	await withSkillProposalManifestLock(params.store ?? {}, async () => {
		const manifest = await readSkillProposalManifestUnlocked(params.store);
		await params.beforeWrite?.(manifest);
		await writeSkillProposalFiles(params);
		await refreshSkillProposalManifestUnlocked(params.store);
	});
}
async function writeSkillProposalFiles(params) {
	const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
	const relativeDir = proposalRelativeDir(params.record.id);
	await stateRoot.mkdir(relativeDir);
	await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, { encoding: "utf8" });
	for (const file of params.supportFiles ?? []) await stateRoot.write(path.join(relativeDir, file.path), file.content, {
		encoding: "utf8",
		mkdir: true
	});
	await stateRoot.writeJson(path.join(relativeDir, PROPOSAL_RECORD_FILE), params.record, { trailingNewline: true });
}
async function replaceSkillProposalDraft(params) {
	assertProposalId(params.record.id);
	assertSkillProposalContentSize(params.content);
	const stateRoot = await root(resolveSkillWorkshopStateDir(params.store));
	const relativeDir = proposalRelativeDir(params.record.id);
	await stateRoot.write(path.join(relativeDir, PROPOSAL_DRAFT_FILE), params.content, { encoding: "utf8" });
	const nextSupportPaths = /* @__PURE__ */ new Set();
	for (const file of params.supportFiles ?? []) {
		nextSupportPaths.add(file.path);
		await stateRoot.write(path.join(relativeDir, file.path), file.content, {
			encoding: "utf8",
			mkdir: true
		});
	}
	await stateRoot.writeJson(path.join(relativeDir, PROPOSAL_RECORD_FILE), params.record, { trailingNewline: true });
	for (const file of params.previousSupportFiles ?? []) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		if (!nextSupportPaths.has(filePath)) await stateRoot.remove(path.join(relativeDir, filePath)).catch(() => void 0);
	}
	await refreshSkillProposalManifest(params.store);
}
async function updateSkillProposalRecord(params) {
	assertProposalId(params.record.id);
	await (await root(resolveSkillWorkshopStateDir(params.store))).writeJson(path.join(proposalRelativeDir(params.record.id), PROPOSAL_RECORD_FILE), params.record, { trailingNewline: true });
	await refreshSkillProposalManifest(params.store);
}
async function withSkillProposalTargetLock(record, fn, options = {}) {
	return await withSkillWorkshopLock(path.join(resolveSkillWorkshopStateDir(options), TARGET_LOCKS_REL_DIR, `${hashSkillProposalContent(record.target.skillFile)}.target`), fn);
}
async function writeSkillProposalRollback(params) {
	await (await root(resolveSkillWorkshopStateDir(params.store))).writeJson(path.join(proposalRelativeDir(params.proposalId), PROPOSAL_ROLLBACK_FILE), params.rollback, { trailingNewline: true });
}
async function readSkillProposalManifest(options = {}) {
	return await readSkillProposalManifestUnlocked(options);
}
async function readSkillProposalManifestUnlocked(options = {}) {
	const parsed = parseSkillProposalManifest(await tryReadJson(path.join(resolveSkillWorkshopStateDir(options), MANIFEST_REL_PATH)));
	if (parsed) return parsed;
	return await refreshSkillProposalManifestUnlocked(options);
}
async function refreshSkillProposalManifest(options = {}) {
	return await withSkillProposalManifestLock(options, async () => {
		return await refreshSkillProposalManifestUnlocked(options);
	});
}
async function refreshSkillProposalManifestUnlocked(options = {}) {
	const stateRoot = await root(resolveSkillWorkshopStateDir(options));
	await stateRoot.mkdir(PROPOSALS_REL_DIR);
	const entries = await stateRoot.list(PROPOSALS_REL_DIR, { withFileTypes: true });
	const proposals = [];
	for (const entry of entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
		if (!entry.isDirectory || !PROPOSAL_ID_PATTERN.test(entry.name)) continue;
		const record = await readSkillProposalRecord(entry.name, options);
		if (!record) continue;
		proposals.push(manifestEntryFromRecord(record));
	}
	const manifest = {
		schema: SKILL_WORKSHOP_MANIFEST_SCHEMA,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		proposals: proposals.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
	};
	await stateRoot.writeJson(MANIFEST_REL_PATH, manifest, {
		mkdir: true,
		trailingNewline: true
	});
	return manifest;
}
async function withSkillProposalManifestLock(options, fn) {
	return await withSkillWorkshopLock(path.join(resolveSkillWorkshopStateDir(options), MANIFEST_LOCK_REL_PATH), fn);
}
async function withSkillWorkshopLock(lockFile, fn) {
	const lockKey = path.resolve(lockFile);
	const previous = skillWorkshopProcessLocks.get(lockKey) ?? Promise.resolve();
	let releaseQueued;
	const current = new Promise((resolve) => {
		releaseQueued = resolve;
	});
	const previousDone = previous.catch(() => void 0);
	const queued = previousDone.then(() => current);
	skillWorkshopProcessLocks.set(lockKey, queued);
	await previousDone;
	await fs.mkdir(path.dirname(lockFile), { recursive: true });
	try {
		return await withFileLock(lockFile, SKILL_WORKSHOP_LOCK_OPTIONS, fn);
	} finally {
		releaseQueued();
		if (skillWorkshopProcessLocks.get(lockKey) === queued) skillWorkshopProcessLocks.delete(lockKey);
	}
}
async function readProposalSupportFiles(record, options = {}) {
	const stateRoot = await root(resolveSkillWorkshopStateDir(options));
	const out = [];
	for (const file of record.supportFiles ?? []) {
		const filePath = normalizeWorkspaceSkillSupportPath(file.path);
		const content = (await stateRoot.read(path.join(proposalRelativeDir(record.id), filePath), {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		})).buffer.toString("utf8");
		const sizeBytes = contentSizeBytes(content);
		const hash = hashSkillProposalContent(content);
		if (file.sizeBytes !== sizeBytes || file.hash !== hash) throw new Error(`Proposal support file changed without updating metadata: ${filePath}`);
		out.push({
			path: filePath,
			sizeBytes,
			hash,
			content
		});
	}
	assertWorkspaceSkillSupportPathSetIsFileOnly(out.map((file) => file.path));
	return out;
}
function createSkillProposalRollback(params) {
	return {
		schema: SKILL_WORKSHOP_ROLLBACK_SCHEMA,
		proposalId: params.proposalId,
		writtenAt: (/* @__PURE__ */ new Date()).toISOString(),
		targetSkillFile: params.targetSkillFile,
		action: params.action,
		...params.previousContent !== void 0 ? {
			previousContent: params.previousContent,
			previousContentHash: hashSkillProposalContent(params.previousContent)
		} : {},
		...params.supportFiles && params.supportFiles.length > 0 ? { supportFiles: params.supportFiles } : {}
	};
}
function assertProposalId(proposalId) {
	if (!PROPOSAL_ID_PATTERN.test(proposalId)) throw new Error("Invalid skill proposal id.");
}
function manifestEntryFromRecord(record) {
	return {
		id: record.id,
		kind: record.kind,
		status: record.status,
		title: record.title,
		description: record.description,
		skillName: record.target.skillName,
		skillKey: record.target.skillKey,
		createdAt: record.createdAt,
		updatedAt: record.updatedAt,
		scanState: record.scan.state
	};
}
function parseSkillProposalRecord(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const record = raw;
	if (record.schema !== "openclaw.skill-workshop.proposal.v1" || !PROPOSAL_ID_PATTERN.test(record.id) || record.kind !== "create" && record.kind !== "update" || ![
		"pending",
		"applied",
		"rejected",
		"quarantined",
		"stale"
	].includes(record.status) || typeof record.title !== "string" || typeof record.description !== "string" || typeof record.createdAt !== "string" || typeof record.updatedAt !== "string" || typeof record.draftHash !== "string" || record.draftFile !== PROPOSAL_DRAFT_FILE || !isValidProposalOrigin(record.origin) || !isValidSupportFileList(record.supportFiles) || !record.target || typeof record.target !== "object" || typeof record.target.skillName !== "string" || typeof record.target.skillKey !== "string" || typeof record.target.skillDir !== "string" || typeof record.target.skillFile !== "string" || !record.scan || typeof record.scan !== "object") return null;
	return record;
}
function isValidProposalOrigin(value) {
	if (value === void 0) return true;
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const origin = value;
	for (const key of [
		"agentId",
		"sessionKey",
		"runId",
		"messageId"
	]) {
		const item = origin[key];
		if (item !== void 0 && typeof item !== "string") return false;
	}
	return true;
}
function isValidSupportFileList(value) {
	if (value === void 0) return true;
	if (!Array.isArray(value) || value.length > 64) return false;
	const seen = /* @__PURE__ */ new Set();
	for (const item of value) {
		if (!item || typeof item !== "object" || Array.isArray(item)) return false;
		const file = item;
		if (typeof file.path !== "string" || typeof file.hash !== "string" || !/^[a-f0-9]{64}$/i.test(file.hash) || typeof file.sizeBytes !== "number" || !Number.isSafeInteger(file.sizeBytes) || file.sizeBytes < 0 || file.sizeBytes > 262144 || file.targetExisted !== void 0 && typeof file.targetExisted !== "boolean" || file.targetContentHash !== void 0 && (typeof file.targetContentHash !== "string" || !/^[a-f0-9]{64}$/i.test(file.targetContentHash))) return false;
		let normalized;
		try {
			normalized = normalizeWorkspaceSkillSupportPath(file.path);
		} catch {
			return false;
		}
		if (seen.has(normalized)) return false;
		seen.add(normalized);
	}
	return true;
}
function parseSkillProposalManifest(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
	const manifest = raw;
	if (manifest.schema !== "openclaw.skill-workshop.proposals-manifest.v1" || typeof manifest.updatedAt !== "string" || !Array.isArray(manifest.proposals)) return null;
	const proposals = manifest.proposals.filter((entry) => {
		return entry && typeof entry === "object" && PROPOSAL_ID_PATTERN.test(normalizeOptionalString(entry.id) ?? "") && typeof entry.skillName === "string" && typeof entry.skillKey === "string" && typeof entry.updatedAt === "string";
	});
	return {
		...manifest,
		proposals
	};
}
function proposalRelativeDir(proposalId) {
	assertProposalId(proposalId);
	return path.join(PROPOSALS_REL_DIR, proposalId);
}
//#endregion
//#region src/skills/workshop/service.ts
const WRITABLE_WORKSPACE_SOURCES = new Set(["openclaw-workspace", "agents-skills-project"]);
const MAX_PROPOSAL_DRAFT_BYTES = 1024 * 1024;
const MAX_PROPOSAL_DIRECTORY_ENTRIES = 256;
const MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES = 160;
/** Lists skill workshop proposals, optionally scoped to a workspace. */
async function listSkillProposals(options = {}) {
	const manifest = await readSkillProposalManifest();
	if (!options.workspaceDir) return manifest;
	const proposals = [];
	for (const proposal of manifest.proposals) {
		const record = await readSkillProposalRecord(proposal.id);
		if (record && isProposalInWorkspace(record, options.workspaceDir)) proposals.push(proposal);
	}
	return {
		...manifest,
		proposals
	};
}
async function readSkillProposalDraftFile(filePath) {
	return decodeProposalTextFile((await readLocalFileSafely({
		filePath,
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES
	})).buffer, filePath);
}
async function readSkillProposalDraftDirectory(dirPath) {
	const absoluteDir = path.resolve(dirPath);
	const draftRoot = await root(absoluteDir);
	const proposal = await draftRoot.read("PROPOSAL.md", {
		hardlinks: "reject",
		maxBytes: MAX_PROPOSAL_DRAFT_BYTES,
		symlinks: "reject"
	});
	const scanned = await walkDirectory(absoluteDir, {
		maxDepth: 8,
		maxEntries: MAX_PROPOSAL_DIRECTORY_ENTRIES,
		symlinks: "include"
	});
	if (scanned.truncated) throw new Error("Proposal directory has too many entries.");
	const supportFiles = [];
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		const relativePath = toPortableRelativePath(entry.relativePath);
		if (!relativePath || relativePath === "PROPOSAL.md") continue;
		if (entry.kind === "directory") continue;
		if (entry.kind !== "file") throw new Error(`Proposal support file must be a regular file: ${relativePath}`);
		const supportPath = normalizeWorkspaceSkillSupportPath(relativePath);
		if (((await fs.stat(entry.path)).mode & 73) !== 0) throw new Error(`Proposal support files must not be executable: ${relativePath}`);
		const read = await draftRoot.read(relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
			symlinks: "reject"
		});
		supportFiles.push({
			path: supportPath,
			content: decodeProposalTextFile(read.buffer, relativePath)
		});
	}
	return {
		content: decodeProposalTextFile(proposal.buffer, "PROPOSAL.md"),
		supportFiles
	};
}
function decodeProposalTextFile(buffer, label) {
	const content = buffer.toString("utf8");
	if (!Buffer.from(content, "utf8").equals(buffer) || content.includes("\0")) throw new Error(`Proposal files must be UTF-8 text: ${label}`);
	return content;
}
function normalizeProposalOrigin(origin) {
	const agentId = normalizeOptionalString(origin?.agentId);
	const sessionKey = normalizeOptionalString(origin?.sessionKey);
	const runId = normalizeOptionalString(origin?.runId);
	const messageId = normalizeOptionalString(origin?.messageId);
	if (!agentId && !sessionKey && !runId && !messageId) return;
	return {
		...agentId ? { agentId } : {},
		...sessionKey ? { sessionKey } : {},
		...runId ? { runId } : {},
		...messageId ? { messageId } : {}
	};
}
async function inspectSkillProposal(proposalId, options = {}) {
	const read = await readSkillProposal(proposalId);
	if (!read) return null;
	if (options.workspaceDir && !isProposalInWorkspace(read.record, options.workspaceDir)) return null;
	return await hydrateProposalSupportFiles(read);
}
async function resolvePendingSkillProposal(input) {
	const proposalId = normalizeOptionalString(input.proposalId);
	if (proposalId) {
		const direct = await readRequiredProposal(proposalId, input.workspaceDir);
		if (direct.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${direct.record.status}.`);
		return direct;
	}
	const name = normalizeOptionalString(input.name);
	if (!name) throw new Error("proposal_id or name required.");
	const matches = (await listSkillProposals({ workspaceDir: input.workspaceDir })).proposals.filter((proposal) => proposal.status === "pending" && proposalMatchesName(proposal, name));
	if (matches.length === 0) throw new Error(`No pending skill proposal matched: ${name}`);
	if (matches.length > 1) {
		const candidates = matches.slice(0, 8).map((proposal) => `${proposal.id} (${proposal.skillKey})`).join(", ");
		throw new Error(`Multiple pending skill proposals matched ${name}: ${candidates}`);
	}
	const matched = await readRequiredProposal(matches[0].id, input.workspaceDir);
	if (matched.record.status !== "pending") throw new Error(`Only pending proposals can be revised. Current status: ${matched.record.status}.`);
	return matched;
}
async function proposeCreateSkill(input) {
	const name = normalizeRequired(input.name, "Skill name");
	const description = normalizeRequired(input.description, "Skill description");
	const config = resolveSkillWorkshopConfig(input.config);
	assertProposalDescriptionWithinLimit(description);
	assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
	const target = resolveSkillProposalTarget({
		workspaceDir: input.workspaceDir,
		skillName: name
	});
	if (await readWorkspaceSkillFile(target.skillFile) !== null) throw new Error(`Skill already exists at ${target.skillFile}.`);
	const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const proposalContent = renderProposalMarkdown({
		name: target.skillKey,
		description,
		content: input.content,
		date: now
	});
	const id = createSkillProposalId(name);
	const goal = normalizeOptionalString(input.goal);
	const evidence = normalizeOptionalString(input.evidence);
	const origin = normalizeProposalOrigin(input.origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "create",
		status: "pending",
		title: `Create ${name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...origin ? { origin } : {},
		proposedVersion: "v1",
		draftFile: "PROPOSAL.md",
		draftHash: hashSkillProposalContent(proposalContent),
		target: {
			skillName: name,
			skillKey: target.skillKey,
			skillDir: target.skillDir,
			skillFile: target.skillFile,
			source: "openclaw-workspace"
		},
		scan: scanProposalBundle(proposalContent, supportFiles),
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await writeSkillProposal({
		record,
		content: proposalContent,
		supportFiles,
		beforeWrite: async (manifest) => {
			await assertCanCreatePendingProposal(input.workspaceDir, config, manifest);
		}
	});
	return {
		record,
		content: proposalContent
	};
}
async function proposeUpdateSkill(input) {
	const skillName = normalizeRequired(input.skillName, "Skill name");
	const config = resolveSkillWorkshopConfig(input.config);
	const targetSkill = resolveSkillStatusEntry(buildWorkspaceSkillStatus(input.workspaceDir, {
		config: input.config,
		agentId: input.agentId
	}).skills, skillName);
	if (!targetSkill) throw new Error(`Skill not found: ${skillName}`);
	assertWritableSkillTarget(input.workspaceDir, targetSkill);
	const currentContent = await readWorkspaceSkillFile(targetSkill.filePath);
	if (currentContent === null) throw new Error(`Skill file is missing: ${targetSkill.filePath}`);
	const description = resolveUpdateProposalDescription(input.description, targetSkill.description);
	assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
	const supportFiles = prepareSkillProposalSupportFiles(input.supportFiles);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const proposalContent = renderProposalMarkdown({
		name: targetSkill.skillKey,
		description,
		content: input.content,
		fallbackFrontmatterContent: currentContent,
		date: now
	});
	const id = createSkillProposalId(targetSkill.skillKey || targetSkill.name);
	const goal = normalizeOptionalString(input.goal);
	const evidence = normalizeOptionalString(input.evidence);
	const origin = normalizeProposalOrigin(input.origin);
	const record = {
		schema: SKILL_WORKSHOP_SCHEMA,
		id,
		kind: "update",
		status: "pending",
		title: `Update ${targetSkill.name}`,
		description,
		createdAt: now,
		updatedAt: now,
		createdBy: input.createdBy ?? "skill-workshop",
		...origin ? { origin } : {},
		proposedVersion: "v1",
		draftFile: "PROPOSAL.md",
		draftHash: hashSkillProposalContent(proposalContent),
		target: {
			skillName: targetSkill.name,
			skillKey: targetSkill.skillKey,
			skillDir: targetSkill.baseDir,
			skillFile: targetSkill.filePath,
			source: targetSkill.source,
			currentContentHash: hashSkillProposalContent(currentContent)
		},
		scan: scanProposalBundle(proposalContent, supportFiles),
		...supportFiles.length > 0 ? { supportFiles: await buildSupportFileMetadata(supportFiles, targetSkill.baseDir) } : {},
		...goal ? { goal } : {},
		...evidence ? { evidence } : {}
	};
	await writeSkillProposal({
		record,
		content: proposalContent,
		supportFiles,
		beforeWrite: async (manifest) => {
			await assertCanCreatePendingProposal(input.workspaceDir, config, manifest);
		}
	});
	return {
		record,
		content: proposalContent
	};
}
async function reviseSkillProposal(input) {
	const config = resolveSkillWorkshopConfig(input.config);
	return await withPendingSkillProposalMutation(input, "revised", async (read) => {
		const { record } = read;
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		if (record.kind === "create") {
			if (await readWorkspaceSkillFile(record.target.skillFile) !== null) {
				await markProposalStale(record, "Target skill was created after proposal creation.");
				throw new Error("Target skill was created after proposal creation; proposal marked stale.");
			}
		} else {
			const currentContent = await readWorkspaceSkillFile(record.target.skillFile);
			if (currentContent === null) throw new Error(`Target skill is missing: ${record.target.skillFile}`);
			if (record.target.currentContentHash && hashSkillProposalContent(currentContent) !== record.target.currentContentHash) {
				await markProposalStale(record, "Target skill changed after proposal creation.");
				throw new Error("Target skill changed after proposal creation; proposal marked stale.");
			}
			await assertSupportTargetsUnchanged(record);
		}
		const supportFiles = input.supportFiles === void 0 ? await readProposalSupportFiles(record) : prepareSkillProposalSupportFiles(input.supportFiles);
		assertProposalContentWithinLimit(input.content, config.maxSkillBytes);
		const supportFileMetadata = supportFiles.length > 0 ? await buildSupportFileMetadata(supportFiles, record.kind === "update" ? record.target.skillDir : void 0) : [];
		const nextVersion = nextProposalVersion(record.proposedVersion);
		const description = normalizeOptionalString(input.description) ?? record.description;
		assertProposalDescriptionWithinLimit(description);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const proposalContent = renderProposalMarkdown({
			name: record.target.skillKey,
			description,
			content: input.content,
			fallbackFrontmatterContent: read.content,
			version: nextVersion,
			date: now
		});
		const goal = input.goal === void 0 ? normalizeOptionalString(record.goal) : normalizeOptionalString(input.goal);
		const evidence = input.evidence === void 0 ? normalizeOptionalString(record.evidence) : normalizeOptionalString(input.evidence);
		const previousSupportFiles = record.supportFiles;
		const revised = {
			...record,
			description,
			updatedAt: now,
			proposedVersion: nextVersion,
			draftHash: hashSkillProposalContent(proposalContent),
			scan: scanProposalBundle(proposalContent, supportFiles)
		};
		if (supportFiles.length > 0) revised.supportFiles = supportFileMetadata;
		else delete revised.supportFiles;
		if (goal) revised.goal = goal;
		else delete revised.goal;
		if (evidence) revised.evidence = evidence;
		else delete revised.evidence;
		await replaceSkillProposalDraft({
			record: revised,
			previousSupportFiles,
			content: proposalContent,
			supportFiles
		});
		return {
			record: revised,
			content: proposalContent
		};
	});
}
async function rejectSkillProposal(input) {
	return await markProposal(input, "rejected");
}
async function quarantineSkillProposal(input) {
	return await withPendingSkillProposalMutation(input, "quarantined", async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
			status: "quarantined",
			updatedAt: now,
			quarantinedAt: now,
			statusReason: normalizeOptionalString(input.reason),
			scan: {
				...read.record.scan,
				state: "quarantined"
			}
		};
		await updateSkillProposalRecord({ record });
		return record;
	});
}
async function applySkillProposal(input) {
	return await withPendingSkillProposalMutation(input, "applied", async (read) => {
		const { record, content } = read;
		if (hashSkillProposalContent(content) !== record.draftHash) throw new Error("Proposal draft changed without updating proposal metadata.");
		const supportFiles = await readProposalSupportFiles(record);
		if (!readProposalFrontmatter(content)) throw new Error("Proposal draft must include proposal frontmatter.");
		const scan = scanProposalBundle(content, supportFiles);
		if (scan.state !== "clean") {
			await updateSkillProposalRecord({ record: {
				...record,
				status: "quarantined",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				quarantinedAt: (/* @__PURE__ */ new Date()).toISOString(),
				scan: {
					...scan,
					state: "quarantined"
				},
				statusReason: "Proposal scan failed."
			} });
			throw new Error("Proposal scan failed; proposal was quarantined.");
		}
		assertInsideWorkspace(input.workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(input.workspaceDir, record.target.skillDir, "skill directory");
		const workshopConfig = resolveSkillWorkshopConfig(input.config);
		const symlinkPolicy = {
			allowWrites: workshopConfig.allowSymlinkTargetWrites,
			allowedTargetRealPaths: workshopConfig.allowSymlinkTargetWrites ? resolveAllowedSkillSymlinkTargetRealPaths(input.config) : []
		};
		await assertWorkspaceSkillWriteTarget({
			workspaceDir: input.workspaceDir,
			filePath: record.target.skillFile,
			symlinkPolicy
		});
		const targetState = await readApplyTargetState(record, supportFiles);
		const rollback = createSkillProposalRollback({
			proposalId: record.id,
			targetSkillFile: record.target.skillFile,
			action: record.kind,
			...targetState.previousContent !== null ? { previousContent: targetState.previousContent } : {},
			...targetState.previousSupportFiles.length > 0 ? { supportFiles: targetState.previousSupportFiles } : {}
		});
		await writeSkillProposalRollback({
			proposalId: record.id,
			rollback
		});
		const skillContent = stripProposalFrontmatterForSkill(content);
		await writeWorkspaceSkill({
			workspaceDir: input.workspaceDir,
			skillDir: record.target.skillDir,
			skillFile: record.target.skillFile,
			content: skillContent,
			supportFiles,
			mode: record.kind,
			symlinkPolicy
		});
		bumpSkillsSnapshotVersion({
			workspaceDir: input.workspaceDir,
			reason: "workshop",
			changedPath: record.target.skillFile
		});
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const applied = {
			...record,
			status: "applied",
			updatedAt: now,
			appliedAt: now,
			scan
		};
		await updateSkillProposalRecord({ record: applied });
		await refreshSkillProposalManifest();
		return {
			record: applied,
			targetSkillFile: record.target.skillFile
		};
	});
}
async function readApplyTargetState(record, supportFiles) {
	const previousContent = await readWorkspaceSkillFile(record.target.skillFile);
	if (record.kind === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${record.target.skillFile}`);
	const previousSupportFiles = [];
	for (const file of supportFiles) {
		const supportRecord = record.supportFiles?.find((entry) => entry.path === file.path);
		const previousSupportContent = await readWorkspaceSupportFile({
			skillDir: record.target.skillDir,
			relativePath: file.path
		});
		if (record.kind === "create" && previousSupportContent !== null) throw new Error(`Target support file already exists: ${path.join(record.target.skillDir, file.path)}`);
		if (record.kind === "update" && supportRecord) await assertSupportTargetUnchanged({
			record,
			file: supportRecord,
			currentContent: previousSupportContent
		});
		previousSupportFiles.push(previousSupportContent === null ? {
			path: file.path,
			existed: false
		} : {
			path: file.path,
			existed: true,
			previousContent: previousSupportContent,
			previousContentHash: hashSkillProposalContent(previousSupportContent)
		});
	}
	if (record.kind === "update") {
		if (previousContent === null) throw new Error(`Target skill is missing: ${record.target.skillFile}`);
		if (record.target.currentContentHash && hashSkillProposalContent(previousContent) !== record.target.currentContentHash) {
			await updateSkillProposalRecord({ record: {
				...record,
				status: "stale",
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				staleAt: (/* @__PURE__ */ new Date()).toISOString(),
				statusReason: "Target skill changed after proposal creation."
			} });
			throw new Error("Target skill changed after proposal creation; proposal marked stale.");
		}
	}
	return {
		previousContent,
		previousSupportFiles
	};
}
function scanProposalBundle(content, supportFiles = []) {
	const scannedAt = (/* @__PURE__ */ new Date()).toISOString();
	const findings = [
		...scanSkillContent(content, "PROPOSAL.md"),
		...scanSource(content, "PROPOSAL.md"),
		...supportFiles.flatMap((file) => [...scanSkillContent(file.content, file.path), ...scanSource(file.content, file.path)])
	];
	const critical = findings.filter((finding) => finding.severity === "critical").length;
	const warn = findings.filter((finding) => finding.severity === "warn").length;
	const info = findings.filter((finding) => finding.severity === "info").length;
	return {
		state: critical > 0 ? "failed" : "clean",
		scannedAt,
		critical,
		warn,
		info,
		findings
	};
}
async function assertCanCreatePendingProposal(workspaceDir, config, manifest) {
	if (!manifest) {
		const proposals = (await listSkillProposals({ workspaceDir })).proposals;
		assertPendingProposalCountWithinLimit(proposals.filter((entry) => entry.status === "pending" || entry.status === "quarantined").length, config);
		return;
	}
	let activeProposalCount = 0;
	for (const entry of manifest.proposals) {
		if (entry.status !== "pending" && entry.status !== "quarantined") continue;
		const record = await readSkillProposalRecord(entry.id);
		if (record && isProposalInWorkspace(record, workspaceDir)) activeProposalCount += 1;
	}
	assertPendingProposalCountWithinLimit(activeProposalCount, config);
}
function assertPendingProposalCountWithinLimit(activeProposalCount, config) {
	if (activeProposalCount >= config.maxPending) throw new Error(`Skill Workshop pending proposal limit reached (${config.maxPending}).`);
}
function assertProposalDescriptionWithinLimit(description) {
	const sizeBytes = Buffer.byteLength(description, "utf8");
	if (sizeBytes > MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES) throw new Error(`Skill proposal description is too large (${sizeBytes} bytes, max ${MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES}).`);
}
function resolveUpdateProposalDescription(inputDescription, currentDescription) {
	const supplied = normalizeOptionalString(inputDescription);
	if (supplied) {
		assertProposalDescriptionWithinLimit(supplied);
		return supplied;
	}
	return truncateUtf8(currentDescription.trim(), MAX_SKILL_PROPOSAL_DESCRIPTION_BYTES);
}
function truncateUtf8(value, maxBytes) {
	let out = "";
	let sizeBytes = 0;
	for (const char of value) {
		const charBytes = Buffer.byteLength(char, "utf8");
		if (sizeBytes + charBytes > maxBytes) break;
		out += char;
		sizeBytes += charBytes;
	}
	return out.trimEnd();
}
function assertProposalContentWithinLimit(content, maxSkillBytes) {
	const sizeBytes = Buffer.byteLength(content, "utf8");
	if (sizeBytes > maxSkillBytes) throw new Error(`Skill proposal content is too large (${sizeBytes} bytes, max ${maxSkillBytes}).`);
}
async function buildSupportFileMetadata(files, targetSkillDir) {
	const out = [];
	for (const file of files) {
		const metadata = {
			path: file.path,
			sizeBytes: file.sizeBytes,
			hash: file.hash
		};
		if (targetSkillDir) {
			const targetContent = await readWorkspaceSupportFile({
				skillDir: targetSkillDir,
				relativePath: file.path
			});
			metadata.targetExisted = targetContent !== null;
			if (targetContent !== null) metadata.targetContentHash = hashSkillProposalContent(targetContent);
		}
		out.push(metadata);
	}
	return out;
}
function nextProposalVersion(version) {
	const match = /^v(\d+)$/.exec(version.trim());
	if (!match) return "v2";
	const current = Number.parseInt(match[1] ?? "1", 10);
	return `v${Number.isSafeInteger(current) && current > 0 ? current + 1 : 2}`;
}
async function markProposal(input, status) {
	return await withPendingSkillProposalMutation(input, status, async (read) => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...read.record,
			status,
			updatedAt: now,
			rejectedAt: now,
			statusReason: normalizeOptionalString(input.reason)
		};
		await updateSkillProposalRecord({ record });
		return record;
	});
}
async function withPendingSkillProposalMutation(input, action, fn) {
	return await withSkillProposalTargetLock((await readRequiredProposal(input.proposalId, input.workspaceDir)).record, async () => {
		const read = await readRequiredProposal(input.proposalId, input.workspaceDir);
		if (read.record.status !== "pending") throw new Error(`Only pending proposals can be ${action}. Current status: ${read.record.status}.`);
		return await fn(read);
	});
}
async function assertSupportTargetUnchanged(params) {
	const { record, file, currentContent } = params;
	if (file.targetExisted === false && currentContent !== null) {
		await markProposalStale(record, `Target support file changed after proposal creation: ${file.path}`);
		throw new Error("Target support file changed after proposal creation; proposal marked stale.");
	}
	if (file.targetExisted === true) {
		if ((currentContent === null ? void 0 : hashSkillProposalContent(currentContent)) !== file.targetContentHash) {
			await markProposalStale(record, `Target support file changed after proposal creation: ${file.path}`);
			throw new Error("Target support file changed after proposal creation; proposal marked stale.");
		}
	}
}
async function assertSupportTargetsUnchanged(record) {
	if (record.kind !== "update" || !record.supportFiles) return;
	for (const file of record.supportFiles) {
		if (file.targetExisted === void 0) continue;
		await assertSupportTargetUnchanged({
			record,
			file,
			currentContent: await readWorkspaceSupportFile({
				skillDir: record.target.skillDir,
				relativePath: file.path
			})
		});
	}
}
async function readRequiredProposal(proposalId, workspaceDir) {
	const read = await readSkillProposal(proposalId);
	if (!read || workspaceDir && !isProposalInWorkspace(read.record, workspaceDir)) throw new Error(`Skill proposal not found: ${proposalId}`);
	return read;
}
async function hydrateProposalSupportFiles(read) {
	const supportFiles = await readProposalSupportFiles(read.record);
	if (supportFiles.length === 0) return read;
	return {
		...read,
		supportFiles: supportFiles.map((file) => ({
			path: file.path,
			content: file.content
		}))
	};
}
function isProposalInWorkspace(record, workspaceDir) {
	try {
		assertInsideWorkspace(workspaceDir, record.target.skillFile, "skill file");
		assertInsideWorkspace(workspaceDir, record.target.skillDir, "skill directory");
		return true;
	} catch {
		return false;
	}
}
async function markProposalStale(record, reason) {
	await updateSkillProposalRecord({ record: {
		...record,
		status: "stale",
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		staleAt: (/* @__PURE__ */ new Date()).toISOString(),
		statusReason: reason
	} });
}
function proposalMatchesName(proposal, name) {
	const normalizedName = normalizeSkillIndexName(name);
	return [
		proposal.id,
		proposal.skillName,
		proposal.skillKey,
		proposal.title,
		proposal.description
	].some((candidate) => {
		if (!candidate) return false;
		if (candidate === name || candidate.toLowerCase() === name.toLowerCase()) return true;
		const normalizedCandidate = normalizeSkillIndexName(candidate);
		return Boolean(normalizedName) && Boolean(normalizedCandidate) && (normalizedCandidate === normalizedName || normalizedCandidate.includes(normalizedName) || normalizedName.includes(normalizedCandidate));
	});
}
function assertWritableSkillTarget(workspaceDir, skill) {
	if (!WRITABLE_WORKSPACE_SOURCES.has(skill.source)) throw new Error(`Skill source is not writable by Skill Workshop: ${skill.source}`);
	assertInsideWorkspace(workspaceDir, skill.filePath, "skill file");
	assertInsideWorkspace(workspaceDir, skill.baseDir, "skill directory");
	if (path.basename(skill.filePath) !== "SKILL.md") throw new Error("Skill Workshop can only update SKILL.md targets.");
}
function normalizeRequired(value, label) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) throw new Error(`${label} is required.`);
	return normalized;
}
function toPortableRelativePath(relativePath) {
	return relativePath.split(path.sep).join("/");
}
//#endregion
export { proposeUpdateSkill as a, readSkillProposalDraftFile as c, reviseSkillProposal as d, resolveSkillProposalTarget as f, proposeCreateSkill as i, rejectSkillProposal as l, inspectSkillProposal as n, quarantineSkillProposal as o, readWorkspaceSkillFile as p, listSkillProposals as r, readSkillProposalDraftDirectory as s, applySkillProposal as t, resolvePendingSkillProposal as u };
