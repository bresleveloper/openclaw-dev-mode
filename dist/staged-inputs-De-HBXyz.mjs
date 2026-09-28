import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/media/staged-inputs.ts
/** Existing per-file allowance for staging task inputs. */
const STAGED_INPUT_MAX_BYTES = 52428800;
const STAGED_INPUT_DIRECTORY_PREFIX = "media/inbound/openclaw-staged-";
const STAGED_INPUT_GIT_PATHSPEC = `:(glob)${STAGED_INPUT_DIRECTORY_PREFIX}*/**`;
const STAGED_INPUT_GITIGNORE = "# Raw task inputs remain private; copy outputs into the project to publish.\n*\n";
const STAGED_INPUT_GITIGNORE_SHA256 = createHash("sha256").update(STAGED_INPUT_GITIGNORE).digest("hex");
/** A producer-shaped name is only a candidate; the marker establishes ownership. */
function stagedInputPathDirectory(relativePath) {
	if (!relativePath.startsWith(STAGED_INPUT_DIRECTORY_PREFIX)) return;
	const identity = relativePath.slice(30).split("/")[0];
	return /^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/u.exec(identity)?.[0] === identity ? STAGED_INPUT_DIRECTORY_PREFIX + identity : void 0;
}
function isStagedInputPath(relativePath, directories) {
	const directory = stagedInputPathDirectory(relativePath);
	return directory !== void 0 && directories.has(directory);
}
/** Capture-scoped, including negative results: never read the marker once per file. */
function createStagedInputPathMatcher(root) {
	const directories = /* @__PURE__ */ new Map();
	return async (relativePath) => {
		const directory = stagedInputPathDirectory(relativePath);
		if (!directory) return false;
		let owned = directories.get(directory);
		if (!owned) {
			owned = root.readText(`${directory}/.gitignore`, { maxBytes: 78 }).then((text) => text === STAGED_INPUT_GITIGNORE, () => false);
			directories.set(directory, owned);
		}
		return await owned;
	};
}
/** Complete manifests bind the regular marker's exact bytes through their file digest. */
function stagedInputDirectoriesFromEntries(entries) {
	const directories = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const directory = stagedInputPathDirectory(entry.path);
		if (directory && entry.path === `${directory}/.gitignore` && entry.type === "file" && entry.size === 78 && entry.sha256 === STAGED_INPUT_GITIGNORE_SHA256) directories.add(directory);
	}
	return directories;
}
const STAGED_INPUT_PATHS_JS = `
const STAGED_INPUT_DIRECTORY_PREFIX = ${JSON.stringify(STAGED_INPUT_DIRECTORY_PREFIX)};
const STAGED_INPUT_GITIGNORE = ${JSON.stringify(STAGED_INPUT_GITIGNORE)};
const STAGED_INPUT_GITIGNORE_SHA256 = ${JSON.stringify(STAGED_INPUT_GITIGNORE_SHA256)};
const stagedInputPathDirectory = ${stagedInputPathDirectory.toString()};
const isStagedInputPath = ${isStagedInputPath.toString()};
const stagedInputDirectoriesFromEntries = ${stagedInputDirectoriesFromEntries.toString()};`;
function stagedInputDirectory(identity) {
	return `${STAGED_INPUT_DIRECTORY_PREFIX}${identity}`;
}
function stagedInputFileName(name) {
	return sanitizeUntrustedFileName(`input-${name}`, "input-attachment");
}
/** Maps producer-stamped upload handles to exact private paths for the current turn. */
function resolveStagedInputMediaPaths(media) {
	const paths = /* @__PURE__ */ new Map();
	const ambiguous = /* @__PURE__ */ new Set();
	for (const fact of media ?? []) {
		if (fact.staged !== true || !fact.path) continue;
		const directory = stagedInputPathDirectory(fact.path);
		const prefix = directory ? `${directory}/input-` : void 0;
		if (!prefix || !fact.path.startsWith(prefix)) continue;
		const fileName = fact.path.slice(prefix.length);
		if (!/^file_[^/\\]+$/u.test(fileName)) continue;
		const extension = path.posix.extname(fileName);
		const aliases = extension ? [fileName, fileName.slice(0, -extension.length)] : [fileName];
		for (const alias of aliases) {
			if (ambiguous.has(alias)) continue;
			const existing = paths.get(alias);
			if (existing && existing !== fact.path) {
				paths.delete(alias);
				ambiguous.add(alias);
			} else paths.set(alias, fact.path);
		}
	}
	return paths;
}
async function ensureStagedInputDirectory(rootDir, directory, signal) {
	const root$1 = typeof rootDir === "string" ? await root(rootDir) : rootDir;
	const ignorePath = `${directory}/.gitignore`;
	if (await root$1.exists(directory)) {
		if (await root$1.readText(ignorePath, { maxBytes: 1024 }) !== STAGED_INPUT_GITIGNORE) throw new Error("Input staging directory is not owned by OpenClaw");
		return;
	}
	signal?.throwIfAborted();
	await root$1.create(ignorePath, STAGED_INPUT_GITIGNORE, {
		mode: 384,
		assertBeforeMutation: () => signal?.throwIfAborted()
	});
}
//#endregion
export { ensureStagedInputDirectory as a, stagedInputDirectoriesFromEntries as c, stagedInputPathDirectory as d, createStagedInputPathMatcher as i, stagedInputDirectory as l, STAGED_INPUT_MAX_BYTES as n, isStagedInputPath as o, STAGED_INPUT_PATHS_JS as r, resolveStagedInputMediaPaths as s, STAGED_INPUT_GIT_PATHSPEC as t, stagedInputFileName as u };
