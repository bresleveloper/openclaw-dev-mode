import { O as walkDirectory, d as pathExists, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { M as stripProposalFrontmatterForSkill } from "./store-AlmU8nKC.mjs";
import path from "node:path";
import { isUtf8 } from "node:buffer";
//#region src/skills/workshop/proposal-bundle.ts
const MAX_EVALUATION_FILES = 256;
const MAX_EVALUATION_FILE_BYTES = 1048576;
const MAX_EVALUATION_BUNDLE_BYTES = 8388608;
const MAX_EVALUATION_PATH_DEPTH = 16;
const EXCLUDED_ROOT_DIRS = /* @__PURE__ */ new Set([
	".clawhub",
	".clawdhub",
	".openclaw"
]);
async function buildSkillProposalEvaluationBundles(params) {
	const targetFiles = await readSkillTreeFiles(params.proposal.record.target.skillDir);
	const targetTreeSha256 = hashSkillTree(targetFiles);
	const skillMdPath = params.proposal.record.kind === "create" ? "SKILL.md" : resolveTargetSkillRelativePath(params.proposal, targetFiles, { recordedTargetExists: await pathExists(params.proposal.record.target.skillFile) });
	const candidateSkillMd = fileFromBuffer(skillMdPath, Buffer.from(stripProposalFrontmatterForSkill(params.proposal.content), "utf8"));
	const proposedFiles = params.supportFiles.map((file) => fileFromBuffer(file.path, Buffer.from(file.content, "utf8")));
	let baseline;
	if (params.proposal.record.kind === "create") {
		if (await pathExists(params.proposal.record.target.skillFile)) throw new Error(`Target skill already exists: ${params.proposal.record.target.skillFile}`);
		for (const file of proposedFiles) {
			const targetFile = path.join(params.proposal.record.target.skillDir, file.path);
			if (await pathExists(targetFile)) throw new Error(`Target support file already exists: ${targetFile}`);
		}
	} else baseline = snapshotFromFiles(targetFiles, skillMdPath);
	const candidateFiles = new Map([
		...targetFiles,
		candidateSkillMd,
		...proposedFiles
	].map((file) => [file.path, file]));
	return {
		...baseline ? { baseline } : {},
		candidate: snapshotFromFiles([...candidateFiles.values()], skillMdPath),
		targetTreeSha256
	};
}
async function readSkillProposalTargetTreeSha256(skillDir, options = {}) {
	return hashSkillTree(await readSkillTreeFiles(skillDir, options.includeRootMetadata));
}
async function readSkillTreeFiles(skillDir, includeRootMetadata = false) {
	const include = (entry) => includeRootMetadata || entry.depth > 1 || !EXCLUDED_ROOT_DIRS.has(entry.name);
	const scanned = await walkDirectory(skillDir, {
		maxDepth: 17,
		maxEntries: MAX_EVALUATION_FILES * 2,
		symlinks: "include",
		include,
		descend: include
	});
	if (scanned.truncated || scanned.entries.some((entry) => entry.depth > MAX_EVALUATION_PATH_DEPTH)) throw new Error("Skill evaluation bundle exceeds traversal limits.");
	const failed = scanned.failedDirs[0];
	if (failed) {
		if (!failed.relativePath && hasErrnoCode(failed.error, "ENOENT")) return [];
		throw failed.error;
	}
	const skillRoot = await root(skillDir);
	const files = [];
	let totalBytes = 0;
	for (const entry of scanned.entries.toSorted((a, b) => a.relativePath.localeCompare(b.relativePath))) {
		if (entry.kind === "directory") continue;
		const portablePath = entry.relativePath.split(path.sep).join("/");
		if (entry.kind !== "file") throw new Error(`Skill evaluation bundle contains unsupported entry: ${portablePath}`);
		const read = await skillRoot.read(entry.relativePath, {
			hardlinks: "reject",
			maxBytes: MAX_EVALUATION_FILE_BYTES,
			symlinks: "reject"
		});
		totalBytes += read.buffer.byteLength;
		if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
		files.push(fileFromBuffer(portablePath, read.buffer));
	}
	return files;
}
function fileFromBuffer(relativePath, content) {
	const encoding = !content.includes(0) && isUtf8(content) ? "utf8" : "base64";
	return {
		path: relativePath,
		content: content.toString(encoding),
		encoding,
		sha256: sha256Hex(content),
		sizeBytes: content.byteLength
	};
}
function snapshotFromFiles(inputFiles, skillMdPath) {
	const files = inputFiles.toSorted((a, b) => a.path.localeCompare(b.path));
	assertEvaluationBundleWithinLimits(files);
	const skillMd = files.find((file) => file.path === skillMdPath);
	if (!skillMd) throw new Error(`Skill evaluation bundle is missing ${skillMdPath}.`);
	return {
		skillMd,
		files: files.filter((file) => file.path !== skillMdPath),
		treeSha256: hashSkillTree(files)
	};
}
function assertEvaluationBundleWithinLimits(files) {
	if (files.length > MAX_EVALUATION_FILES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_FILES} files.`);
	let totalBytes = 0;
	for (const file of files) {
		if (file.sizeBytes > MAX_EVALUATION_FILE_BYTES) throw new Error(`Skill evaluation bundle file exceeds ${MAX_EVALUATION_FILE_BYTES} bytes: ${file.path}.`);
		totalBytes += file.sizeBytes;
	}
	if (totalBytes > MAX_EVALUATION_BUNDLE_BYTES) throw new Error(`Skill evaluation bundle exceeds ${MAX_EVALUATION_BUNDLE_BYTES} total bytes.`);
}
function hashSkillTree(files) {
	return sha256Hex(JSON.stringify(files.toSorted((a, b) => a.path.localeCompare(b.path)).map((file) => ({
		path: file.path,
		sha256: file.sha256,
		sizeBytes: file.sizeBytes
	}))));
}
function resolveTargetSkillRelativePath(proposal, targetFiles, options) {
	const relativePath = path.relative(path.resolve(proposal.record.target.skillDir), path.resolve(proposal.record.target.skillFile));
	if (!relativePath || path.isAbsolute(relativePath) || relativePath.startsWith(`..${path.sep}`)) throw new Error("Skill evaluation target file must be inside the skill directory.");
	const portablePath = relativePath.split(path.sep).join("/");
	if (targetFiles.some((file) => file.path === portablePath)) return portablePath;
	if (!options.recordedTargetExists) return portablePath;
	const caseMatches = targetFiles.filter((file) => file.path.toLowerCase() === portablePath.toLowerCase());
	if (caseMatches.length === 1) return caseMatches[0].path;
	if (caseMatches.length > 1) throw new Error(`Skill evaluation target filename is ambiguous: ${portablePath}.`);
	return portablePath;
}
//#endregion
export { readSkillProposalTargetTreeSha256 as n, buildSkillProposalEvaluationBundles as t };
