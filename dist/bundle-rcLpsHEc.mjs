import { D as walkDirectory, o as ensureAbsoluteDirectory, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES } from "./skill-library-C7RO5Y8q.mjs";
import { t as parseSkillFrontmatter } from "./frontmatter-2H_F0IFB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { Type } from "typebox";
import { Value } from "typebox/value";
//#region src/skills/library/errors.ts
var SkillLibraryError = class extends Error {
	constructor(code, message, currentRevision, options) {
		super(message, options);
		this.code = code;
		this.currentRevision = currentRevision;
		this.name = "SkillLibraryError";
	}
};
const SKILL_LIBRARY_MAX_TREE_ENTRIES = 512;
/** Identifies the exact directory failure that prevented complete skill-tree traversal. */
var SkillTreeDirectoryError = class extends SkillLibraryError {
	constructor(rootPath, failedPath, cause) {
		super("INVALID_BUNDLE", `Skill tree directory could not be read: root=${JSON.stringify(rootPath)} path=${JSON.stringify(failedPath)} error=${describeSkillTreeFailure(cause)}`, void 0, { cause });
		this.rootPath = rootPath;
		this.failedPath = failedPath;
	}
};
const portableCompare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const manifestSchema = Type.Array(Type.Object({
	path: Type.String({ maxLength: 512 }),
	sha256: Type.String({ pattern: "^[a-f0-9]{64}$" }),
	sizeBytes: Type.Integer({
		minimum: 0,
		maximum: SKILL_LIBRARY_MAX_FILE_BYTES
	}),
	executable: Type.Boolean()
}, { additionalProperties: false }), {
	minItems: 1,
	maxItems: 256
});
/** Published executable flags are portable metadata; host mode bits are not their authority. */
async function readSkillLibraryManifestTree(directory, manifestJson, revision) {
	const manifest = JSON.parse(manifestJson);
	if (!Value.Check(manifestSchema, manifest)) throw new SkillLibraryError("INVALID_BUNDLE", "Published skill manifest is invalid.");
	const safeRoot = await root(directory);
	const files = [];
	let total = 0;
	for (const file of manifest) {
		validateSkillLibraryPath(file.path);
		total += file.sizeBytes;
		if (total > 8388608) throw new SkillLibraryError("INVALID_BUNDLE", "Published skill manifest exceeds bundle limits.");
		const { buffer } = await safeRoot.read(file.path, {
			hardlinks: "reject",
			symlinks: "reject",
			maxBytes: file.sizeBytes
		});
		if (buffer.length !== file.sizeBytes || sha256(buffer) !== file.sha256) throw new SkillLibraryError("INVALID_BUNDLE", `Published skill file failed integrity verification: ${file.path}`);
		files.push({
			path: file.path,
			content: buffer.toString("base64"),
			encoding: "base64",
			executable: file.executable
		});
	}
	if (prepareSkillLibraryBundle(files).revision !== revision) throw new SkillLibraryError("INVALID_BUNDLE", "Published skill revision failed integrity verification.");
	return files;
}
function validateSkillLibraryPath(filePath) {
	validateSkillBundlePath(filePath);
	if (filePath.split("/").some((part) => [
		".git",
		"node_modules",
		".openclaw"
	].includes(part.toLowerCase()))) throw new SkillLibraryError("INVALID_BUNDLE", `Non-portable skill file path: ${filePath}`);
}
function validateSkillBundlePath(filePath) {
	const parts = filePath.split("/");
	if (filePath.length > 512 || Buffer.from(filePath, "utf8").toString("utf8") !== filePath || parts.length > 16 || parts.some((part) => !part || part === "." || part === ".." || /[\\<>:"|?*]/u.test(part) || Array.from(part).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127) || /[ .]$/u.test(part) || part !== part.normalize("NFC") || /^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/iu.test(part) || /^(conin|conout)\$$/iu.test(part))) throw new SkillLibraryError("INVALID_BUNDLE", `Non-portable skill file path: ${filePath}`);
}
function decodeSkillLibraryFile(file) {
	const bytes = Buffer.from(file.content, file.encoding === "base64" ? "base64" : "utf8");
	if (file.encoding === "base64" && bytes.toString("base64") !== file.content) throw new SkillLibraryError("INVALID_BUNDLE", `Invalid base64: ${file.path}`);
	return bytes;
}
/** Validate exact portable artifacts without imposing publication metadata on loaded skills. */
function prepareSkillBundle(files) {
	if (files.length > 256) throw new SkillLibraryError("INVALID_BUNDLE", "Skill bundle exceeds 256 files.");
	const paths = /* @__PURE__ */ new Set();
	let total = 0;
	const prepared = files.map((file) => {
		validateSkillBundlePath(file.path);
		const folded = file.path.toLowerCase();
		if (paths.has(folded)) throw new SkillLibraryError("INVALID_BUNDLE", `Duplicate skill file: ${file.path}`);
		paths.add(folded);
		const bytes = decodeSkillLibraryFile(file);
		total += bytes.length;
		if (bytes.length > 1048576 || total > 8388608) throw new SkillLibraryError("INVALID_BUNDLE", "Skill bundle exceeds file (1 MiB) or total (8 MiB) limit.");
		return {
			path: file.path,
			bytes,
			sha256: sha256(bytes),
			sizeBytes: bytes.length,
			executable: file.executable === true
		};
	}).toSorted((a, b) => portableCompare(a.path, b.path));
	for (const file of prepared) {
		const parts = file.path.toLowerCase().split("/");
		parts.pop();
		while (parts.length) {
			if (paths.has(parts.join("/"))) throw new SkillLibraryError("INVALID_BUNDLE", `File/directory collision: ${file.path}`);
			parts.pop();
		}
	}
	const skillMd = prepared.find((file) => file.path === "SKILL.md");
	if (!skillMd || !Buffer.from(skillMd.bytes.toString("utf8")).equals(skillMd.bytes)) throw new SkillLibraryError("INVALID_BUNDLE", "Bundle requires a UTF-8 SKILL.md.");
	const manifest = prepared.map(({ bytes: _bytes, ...file }) => file);
	return {
		revision: sha256(JSON.stringify(["openclaw.skill-library.tree.v1", manifest])),
		files: prepared
	};
}
function prepareSkillLibraryBundle(files) {
	const bundle = prepareSkillBundle(files);
	for (const file of bundle.files) validateSkillLibraryPath(file.path);
	const frontmatter = parseSkillFrontmatter(bundle.files.find((file) => file.path === "SKILL.md").bytes.toString("utf8"));
	if (!frontmatter.name?.trim() || !frontmatter.description?.trim() || frontmatter.description.length > 1024) throw new SkillLibraryError("INVALID_BUNDLE", "SKILL.md requires name and description (at most 1,024 characters).");
	return {
		...bundle,
		description: frontmatter.description
	};
}
function skillLibraryRevisionDir(skillId, revision, env) {
	if (!/^[a-f0-9-]{36}$/u.test(skillId) || !/^[a-f0-9]{64}$/u.test(revision)) throw new SkillLibraryError("INVALID_BUNDLE", "Invalid skill revision reference.");
	return path.join(resolveStateDir(env), "skill-library", skillId, "revisions", revision);
}
async function syncDirectory(directory) {
	try {
		const handle = await fs.open(directory, "r");
		try {
			await handle.sync();
		} finally {
			await handle.close();
		}
	} catch (error) {
		if (!isErrno(error) || ![
			"EINVAL",
			"ENOTSUP",
			"EISDIR",
			"EPERM"
		].includes(error.code ?? "")) throw error;
	}
}
async function cleanAbandonedSkillStaging(parent) {
	for (const entry of await fs.readdir(parent, { withFileTypes: true })) {
		const match = /^\.staging-([0-9]+)-[a-zA-Z0-9]+$/u.exec(entry.name);
		if (!match || !entry.isDirectory()) continue;
		const staging = path.join(parent, entry.name);
		const stat = await fs.lstat(staging);
		if (Date.now() - stat.mtimeMs < 36e5) continue;
		try {
			process.kill(Number(match[1]), 0);
		} catch (error) {
			if (hasErrnoCode(error, "ESRCH")) await fs.rm(staging, {
				recursive: true,
				force: true
			});
		}
	}
}
async function stageSkillLibraryBundle(skillId, bundle, env) {
	const destination = skillLibraryRevisionDir(skillId, bundle.revision, env);
	const parent = path.dirname(destination);
	const ensured = await ensureAbsoluteDirectory(parent, { mode: 448 });
	if (!ensured.ok) throw ensured.error;
	await cleanAbandonedSkillStaging(parent);
	const staging = await fs.mkdtemp(path.join(parent, `.staging-${process.pid}-`));
	try {
		const directories = /* @__PURE__ */ new Set([staging]);
		for (const file of bundle.files) {
			const target = path.join(staging, file.path);
			await fs.mkdir(path.dirname(target), {
				recursive: true,
				mode: 448
			});
			let directory = path.dirname(target);
			while (directory !== parent) {
				directories.add(directory);
				directory = path.dirname(directory);
			}
			const handle = await fs.open(target, "wx", file.executable ? 320 : 256);
			try {
				await handle.writeFile(file.bytes);
				await handle.sync();
			} finally {
				await handle.close();
			}
		}
		for (const directory of [...directories].toSorted((a, b) => b.length - a.length)) await syncDirectory(directory);
		return {
			staging,
			async publish() {
				try {
					await fs.rename(staging, destination);
				} catch (error) {
					if (!isErrno(error) || !["EEXIST", "ENOTEMPTY"].includes(error.code ?? "")) throw error;
					await readSkillLibraryManifestTree(destination, JSON.stringify(bundle.files.map(({ bytes: _bytes, ...file }) => file)), bundle.revision);
				}
				await syncDirectory(parent);
				await syncDirectory(path.dirname(parent));
				await syncDirectory(path.dirname(path.dirname(parent)));
				await syncDirectory(path.dirname(path.dirname(path.dirname(parent))));
				return destination;
			},
			async cleanup() {
				await fs.rm(staging, {
					recursive: true,
					force: true
				});
			}
		};
	} catch (error) {
		await fs.rm(staging, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
async function readSkillLibraryTree(directory) {
	const files = await readSkillBundleTree(directory);
	for (const file of files) validateSkillLibraryPath(file.path);
	return files;
}
function describeSkillTreeFailure(error) {
	if (isErrno(error) && error.code) return `${error.code}: ${error.message}`;
	return error instanceof Error ? error.message : String(error);
}
async function readSkillBundleTree(directory, includePath, options) {
	const symlinks = options?.symlinks ?? "reject";
	const include = includePath ? (entry) => includePath(entry.path) : void 0;
	const walked = await walkDirectory(directory, {
		maxDepth: 17,
		maxEntries: SKILL_LIBRARY_MAX_TREE_ENTRIES,
		symlinks: "include",
		include,
		descend: include
	});
	if (walked.truncated || walked.entries.some((entry) => entry.depth > 16)) throw new SkillLibraryError("INVALID_BUNDLE", "Skill tree exceeds traversal limits.");
	if (walked.failedDirs.length) {
		const failed = walked.failedDirs[0];
		throw new SkillTreeDirectoryError(directory, failed.path, failed.error);
	}
	const safeRoot = await root(directory).catch((error) => {
		throw new SkillTreeDirectoryError(directory, directory, error);
	});
	const includedFiles = new Set(walked.entries.filter((entry) => entry.kind === "file").map((entry) => entry.relativePath));
	const files = [];
	let total = 0;
	for (const entry of walked.entries) {
		if (entry.kind === "directory") continue;
		if (entry.kind !== "file" && !(entry.kind === "symlink" && symlinks === "follow-within-root")) throw new SkillLibraryError("INVALID_BUNDLE", `Skill trees cannot contain links or special files: root=${JSON.stringify(directory)} path=${JSON.stringify(entry.path)} kind=${entry.kind}.`);
		const portablePath = entry.relativePath.split(path.sep).join("/");
		validateSkillBundlePath(portablePath);
		const read = await safeRoot.read(entry.relativePath, {
			hardlinks: "reject",
			symlinks,
			maxBytes: SKILL_LIBRARY_MAX_FILE_BYTES
		}).catch((error) => {
			throw new SkillLibraryError("INVALID_BUNDLE", `Skill tree file could not be read: root=${JSON.stringify(directory)} path=${JSON.stringify(entry.path)} error=${describeSkillTreeFailure(error)}`, void 0, { cause: error });
		});
		if (symlinks === "follow-within-root" && !includedFiles.has(path.relative(safeRoot.rootReal, read.realPath))) throw new SkillLibraryError("INVALID_BUNDLE", `Skill tree link target is not an included regular file: root=${JSON.stringify(directory)} path=${JSON.stringify(entry.path)}.`);
		options?.assertFileAccess?.(entry.path, read.realPath);
		const { buffer, stat } = read;
		total += buffer.length;
		if (total > 8388608 || files.length >= 256) throw new SkillLibraryError("INVALID_BUNDLE", "Skill tree exceeds bundle limits.");
		files.push({
			path: portablePath,
			content: buffer.toString("base64"),
			encoding: "base64",
			executable: (stat.mode & 73) !== 0
		});
	}
	return files.toSorted((a, b) => portableCompare(a.path, b.path));
}
//#endregion
export { prepareSkillLibraryBundle as a, readSkillLibraryTree as c, validateSkillLibraryPath as d, SkillLibraryError as f, prepareSkillBundle as i, skillLibraryRevisionDir as l, SkillTreeDirectoryError as n, readSkillBundleTree as o, decodeSkillLibraryFile as r, readSkillLibraryManifestTree as s, SKILL_LIBRARY_MAX_TREE_ENTRIES as t, stageSkillLibraryBundle as u };
