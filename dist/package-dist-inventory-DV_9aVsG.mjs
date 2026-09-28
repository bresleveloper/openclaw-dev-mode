import { v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { s as readFileHandleBounded } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { c as readJsonIfExists } from "./json-files-C0HSMh2Z.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import pLimit from "p-limit";
/**
* Dist paths that contain local build metadata and should not be packaged as source.
* @internal Shared repository-script contract.
*/
const LOCAL_BUILD_METADATA_DIST_PATHS = Object.freeze([`dist/.buildstamp`, `dist/.runtime-postbuildstamp`]);
const LOCAL_BUILD_METADATA_DIST_PATH_SET = new Set(LOCAL_BUILD_METADATA_DIST_PATHS);
/** Return whether a dist-relative path is local build metadata. */
function isLocalBuildMetadataDistPath(relativePath) {
	return LOCAL_BUILD_METADATA_DIST_PATH_SET.has(relativePath);
}
const PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH = "dist/postinstall-content-inventory.json";
function createPackageDistContentInventoryEntry(relativePath, hash, mode) {
	return {
		path: relativePath.replace(/\\/g, "/"),
		sha256: hash.digest,
		mode: mode & 511,
		size: hash.bytes
	};
}
function parsePackageDistContentInventory(value) {
	if (!Array.isArray(value)) throw new Error("Invalid package dist content inventory");
	const seen = /* @__PURE__ */ new Set();
	return value.map((entry) => {
		if (!entry || typeof entry !== "object") throw new Error("Invalid package dist content inventory entry");
		const item = entry;
		if (typeof item.path !== "string" || !item.path.startsWith("dist/") || item.path.includes("\\") || item.path.includes("\0") || item.path.split("/").some((part) => !part || part === "." || part === "..") || item.path === "dist/postinstall-inventory.json" || item.path === "dist/postinstall-content-inventory.json" || typeof item.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(item.sha256) || !Number.isSafeInteger(item.size) || item.size < 0 || !Number.isInteger(item.mode) || item.mode < 0 || item.mode > 511 || seen.has(item.path)) throw new Error("Invalid package dist content inventory entry");
		seen.add(item.path);
		return {
			path: item.path,
			sha256: item.sha256,
			size: item.size,
			mode: item.mode
		};
	}).toSorted((a, b) => a.path.localeCompare(b.path));
}
function comparePackageDistContentInventory(expected, actual) {
	const format = (entry) => `${entry.path}:${entry.sha256}:${entry.size}:${process.platform === "win32" ? "" : Boolean(entry.mode & 73)}`;
	return JSON.stringify(expected.map(format).toSorted()) === JSON.stringify(actual.map(format).toSorted()) ? [] : [`Invalid package dist content inventory at ${PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH}: expected packaged file hashes and executable bits to match current dist files.`];
}
//#endregion
//#region src/infra/package-dist-inventory.ts
const PACKAGE_DIST_INVENTORY_RELATIVE_PATH = "dist/postinstall-inventory.json";
const PACKAGE_DIST_INVENTORY_SCAN_CONCURRENCY = 32;
const PACKAGE_DIST_INVENTORY_BUFFER_BYTES = 65536;
const LEGACY_QA_CHANNEL_DIR = ["qa", "channel"].join("-");
const LEGACY_QA_LAB_DIR = ["qa", "lab"].join("-");
const OMITTED_QA_EXTENSION_PREFIXES = [`dist/extensions/${LEGACY_QA_CHANNEL_DIR}/`, `dist/extensions/${LEGACY_QA_LAB_DIR}/`];
const OMITTED_PRIVATE_QA_PLUGIN_SDK_PREFIXES = [`dist/plugin-sdk/extensions/${LEGACY_QA_CHANNEL_DIR}/`, `dist/plugin-sdk/extensions/${LEGACY_QA_LAB_DIR}/`];
const OMITTED_PRIVATE_QA_PLUGIN_SDK_FILES = /* @__PURE__ */ new Set([
	`dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.d.ts`,
	`dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.js`,
	`dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.d.ts`,
	`dist/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.js`,
	`dist/plugin-sdk/${LEGACY_QA_LAB_DIR}.d.ts`,
	`dist/plugin-sdk/${LEGACY_QA_LAB_DIR}.js`,
	"dist/plugin-sdk/qa-runtime.d.ts",
	"dist/plugin-sdk/qa-runtime.js",
	`dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}.d.ts`,
	`dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_CHANNEL_DIR}-protocol.d.ts`,
	`dist/plugin-sdk/src/plugin-sdk/${LEGACY_QA_LAB_DIR}.d.ts`,
	"dist/plugin-sdk/src/plugin-sdk/qa-runtime.d.ts"
]);
const OMITTED_DEEP_PLUGIN_SDK_DECLARATION_PREFIX = "dist/plugin-sdk/src/";
const OMITTED_PRIVATE_QA_DIST_PREFIXES = ["dist/qa-runtime-"];
const OMITTED_PLUGIN_SDK_TEST_FILES = /* @__PURE__ */ new Set([
	"dist/plugin-sdk/agent-runtime-test-contracts.d.ts",
	"dist/plugin-sdk/agent-runtime-test-contracts.js",
	"dist/plugin-sdk/channel-contract-testing.d.ts",
	"dist/plugin-sdk/channel-contract-testing.js",
	"dist/plugin-sdk/channel-target-testing.d.ts",
	"dist/plugin-sdk/channel-target-testing.js",
	"dist/plugin-sdk/channel-test-helpers.d.ts",
	"dist/plugin-sdk/channel-test-helpers.js",
	"dist/plugin-sdk/plugin-test-api.d.ts",
	"dist/plugin-sdk/plugin-test-api.js",
	"dist/plugin-sdk/plugin-test-contracts.d.ts",
	"dist/plugin-sdk/plugin-test-contracts.js",
	"dist/plugin-sdk/plugin-test-runtime.d.ts",
	"dist/plugin-sdk/plugin-test-runtime.js",
	"dist/plugin-sdk/provider-http-test-mocks.d.ts",
	"dist/plugin-sdk/provider-http-test-mocks.js",
	"dist/plugin-sdk/provider-test-contracts.d.ts",
	"dist/plugin-sdk/provider-test-contracts.js",
	"dist/plugin-sdk/test-env.d.ts",
	"dist/plugin-sdk/test-env.js",
	"dist/plugin-sdk/test-fixtures.d.ts",
	"dist/plugin-sdk/test-fixtures.js",
	"dist/plugin-sdk/test-live.d.ts",
	"dist/plugin-sdk/test-live.js",
	"dist/plugin-sdk/test-live-auth.d.ts",
	"dist/plugin-sdk/test-live-auth.js",
	"dist/plugin-sdk/test-media-generation.d.ts",
	"dist/plugin-sdk/test-media-generation.js",
	"dist/plugin-sdk/test-media-understanding.d.ts",
	"dist/plugin-sdk/test-media-understanding.js",
	"dist/plugin-sdk/test-node-mocks.d.ts",
	"dist/plugin-sdk/test-node-mocks.js"
]);
const OMITTED_PLUGIN_SDK_TEST_PREFIXES = [
	"dist/plugin-sdk/src/agents/test-helpers/",
	"dist/plugin-sdk/src/plugin-sdk/test-helpers/",
	"dist/plugin-sdk/src/test-helpers/",
	"dist/plugin-sdk/src/test-utils/"
];
const OMITTED_DIST_SUBTREE_PATTERNS = [
	/^dist\/extensions\/node_modules(?:\/|$)/u,
	/^dist\/extensions\/[^/]+\/node_modules(?:\/|$)/u,
	/^dist\/plugin-sdk\/src(?:\/|$)/u,
	new RegExp(`^dist/plugin-sdk/extensions/${LEGACY_QA_CHANNEL_DIR}(?:/|$)`, "u"),
	new RegExp(`^dist/plugin-sdk/extensions/${LEGACY_QA_LAB_DIR}(?:/|$)`, "u")
];
function normalizeRelativePath(value) {
	return value.replace(/\\/g, "/");
}
function splitRelativePath(relativePath) {
	return normalizeRelativePath(relativePath).split("/");
}
function isLegacyPluginDependencyDirPath(relativePath) {
	const parts = splitRelativePath(relativePath);
	if (parts[0]?.toLowerCase() !== "dist" || parts[1]?.toLowerCase() !== "extensions") return false;
	if ((parts[2] ?? "").toLowerCase() === "node_modules") return true;
	return (parts[3] ?? "").toLowerCase() === "node_modules";
}
function compilePackageFilesExclusionPattern(pattern) {
	let source = "^";
	for (let index = 0; index < pattern.length; index += 1) {
		const char = pattern[index];
		if (char === "*") {
			if (pattern[index + 1] === "*") {
				if (pattern[index + 2] === "/") {
					source += "(?:[^/]+/)*";
					index += 2;
				} else {
					source += ".*";
					index += 1;
				}
			} else source += "[^/]*";
			continue;
		}
		source += escapeRegExp(char ?? "");
	}
	source += "$";
	return new RegExp(source, "u");
}
function collectPackageDistExclusionRules(rootPackageJson) {
	if (!rootPackageJson || typeof rootPackageJson !== "object") return {
		files: /* @__PURE__ */ new Set(),
		prefixes: [],
		patterns: []
	};
	const files = rootPackageJson.files;
	if (!Array.isArray(files)) return {
		files: /* @__PURE__ */ new Set(),
		prefixes: [],
		patterns: []
	};
	const excludedFiles = /* @__PURE__ */ new Set();
	const excludedPrefixes = /* @__PURE__ */ new Set();
	const excludedPatterns = [];
	for (const entry of files) {
		if (typeof entry !== "string") continue;
		const normalized = normalizeRelativePath(entry);
		const match = /^!dist\/extensions\/([^/]+)\/\*\*$/u.exec(normalized);
		if (match?.[1]) {
			excludedFiles.add(`dist/extensions/${match[1]}`);
			excludedPrefixes.add(`dist/extensions/${match[1]}/`);
		}
		if (!normalized.startsWith("!dist/")) continue;
		const excludedPath = normalized.slice(1);
		if (excludedPath.endsWith("/**") && !excludedPath.slice(0, -3).includes("*")) excludedPrefixes.add(excludedPath.slice(0, -2));
		else if (excludedPath.includes("*")) excludedPatterns.push(compilePackageFilesExclusionPattern(excludedPath));
		else excludedFiles.add(excludedPath);
	}
	return {
		files: excludedFiles,
		prefixes: [...excludedPrefixes].toSorted((left, right) => left.localeCompare(right)),
		patterns: excludedPatterns
	};
}
function isOmittedPluginSdkTestPath(relativePath) {
	return OMITTED_PLUGIN_SDK_TEST_FILES.has(relativePath) || OMITTED_PLUGIN_SDK_TEST_PREFIXES.some((prefix) => relativePath === prefix.slice(0, -1) || relativePath.startsWith(prefix));
}
async function collectPackageDistExclusionRulesForRoot(packageRoot) {
	const packageJsonPath = path.join(packageRoot, "package.json");
	return collectPackageDistExclusionRules(await readJsonIfExists(packageJsonPath));
}
function isPackageFilesExcludedDistPath(relativePath, exclusions) {
	return exclusions.files.has(relativePath) || exclusions.prefixes.some((prefix) => relativePath.startsWith(prefix)) || exclusions.patterns.some((pattern) => pattern.test(relativePath));
}
function isPackagedDistPath(relativePath, rules) {
	if (!relativePath.startsWith("dist/")) return false;
	if (rules.includePackageExcludedFiles) return relativePath !== "dist/postinstall-inventory.json" && !isLegacyPluginDependencyDirPath(relativePath);
	if (isPackageFilesExcludedDistPath(relativePath, rules)) return false;
	if (isLegacyPluginDependencyDirPath(relativePath)) return false;
	if (relativePath === "dist/postinstall-inventory.json") return false;
	if (isLocalBuildMetadataDistPath(relativePath)) return false;
	if (relativePath.endsWith(".map") && !rules.includePackageExcludedFiles) return false;
	if (relativePath === "dist/plugin-sdk/.tsbuildinfo") return false;
	if (isOmittedPluginSdkTestPath(relativePath)) return false;
	if (relativePath.startsWith(OMITTED_DEEP_PLUGIN_SDK_DECLARATION_PREFIX)) return false;
	if (OMITTED_PRIVATE_QA_PLUGIN_SDK_PREFIXES.some((prefix) => relativePath.startsWith(prefix)) || OMITTED_PRIVATE_QA_PLUGIN_SDK_FILES.has(relativePath) || OMITTED_PRIVATE_QA_DIST_PREFIXES.some((prefix) => relativePath.startsWith(prefix))) return false;
	if (OMITTED_QA_EXTENSION_PREFIXES.some((prefix) => relativePath.startsWith(prefix))) return false;
	return true;
}
function isOmittedDistSubtree(relativePath, rules) {
	if (rules.includePackageExcludedFiles) return isLegacyPluginDependencyDirPath(relativePath);
	return isPackageFilesExcludedDistPath(relativePath, rules) || isPackageFilesExcludedDistPath(`${relativePath}/`, rules) || isLegacyPluginDependencyDirPath(relativePath) || isOmittedPluginSdkTestPath(relativePath) || OMITTED_DIST_SUBTREE_PATTERNS.some((pattern) => pattern.test(relativePath));
}
async function collectRelativeFiles(rootDir, baseDir, rules, fsLimit, onDirectory) {
	const rootRelativePath = normalizeRelativePath(path.relative(baseDir, rootDir));
	if (rootRelativePath && isOmittedDistSubtree(rootRelativePath, rules)) return [];
	try {
		const rootStats = await fsLimit(() => fs.lstat(rootDir));
		if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) throw new Error(`Unsafe package dist path: ${normalizeRelativePath(path.relative(baseDir, rootDir))}`);
		await onDirectory?.(rootDir);
		const entries = await fsLimit(() => fs.readdir(rootDir, { withFileTypes: true }));
		return (await Promise.all(entries.map(async (entry) => {
			const entryPath = path.join(rootDir, entry.name);
			const relativePath = normalizeRelativePath(path.relative(baseDir, entryPath));
			if (entry.isSymbolicLink()) throw new Error(`Unsafe package dist path: ${relativePath}`);
			if (entry.isDirectory()) return await collectRelativeFiles(entryPath, baseDir, rules, fsLimit, onDirectory);
			if (entry.isFile()) return isPackagedDistPath(relativePath, rules) ? [relativePath] : [];
			if (rules.includePackageExcludedFiles) throw new Error(`Unsupported local package entry: ${relativePath}`);
			return [];
		}))).flat().toSorted((left, right) => left.localeCompare(right));
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
/** Collects package dist files that should be present after install/update publication. */
async function collectPackageDistInventory(packageRoot, options = {}) {
	const rules = options.includePackageExcludedFiles ? {
		...collectPackageDistExclusionRules({}),
		includePackageExcludedFiles: true
	} : options.packageManifest === void 0 ? await collectPackageDistExclusionRulesForRoot(packageRoot) : collectPackageDistExclusionRules(options.packageManifest);
	const fsLimit = pLimit(PACKAGE_DIST_INVENTORY_SCAN_CONCURRENCY);
	return await collectRelativeFiles(path.join(packageRoot, "dist"), packageRoot, rules, fsLimit, options.onDirectory);
}
/** Reads an existing package dist inventory, returning null when the inventory is absent. */
async function readPackageDistInventoryIfPresent(packageRoot) {
	const parsed = await readPackageDistJsonIfExists(packageRoot, PACKAGE_DIST_INVENTORY_RELATIVE_PATH);
	if (parsed === void 0) return null;
	if (!Array.isArray(parsed) || parsed.some((entry) => typeof entry !== "string")) throw new Error(`Invalid package dist inventory at ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`);
	return sortUniqueStrings(parsed.map(normalizeRelativePath));
}
async function openPackageDistFsRootIfPresent(packageRoot) {
	const packageFs = await root(packageRoot, {
		hardlinks: "allow",
		nonBlockingRead: true,
		symlinks: "reject"
	});
	let distStats;
	try {
		distStats = await fs.lstat(path.join(packageFs.rootReal, "dist"));
	} catch (error) {
		if (isMissingPathError(error)) return null;
		throw error;
	}
	if (!distStats.isDirectory() || distStats.isSymbolicLink()) throw new Error("Unsafe package dist path: dist");
	return packageFs;
}
async function readPackageDistJsonIfExists(packageRoot, relativePath) {
	const packageFs = await openPackageDistFsRootIfPresent(packageRoot);
	if (!packageFs) return;
	try {
		return await packageFs.readJson(relativePath, {
			hardlinks: "allow",
			maxBytes: 16777216,
			nonBlockingRead: true,
			symlinks: "reject"
		});
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
async function collectPackageDistContentInventory(packageRoot, inventory) {
	const files = (inventory ?? await collectPackageDistInventory(packageRoot)).filter((file) => file !== PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH);
	const packageFs = await openPackageDistFsRootIfPresent(packageRoot);
	if (!packageFs) {
		if (files.length === 0) return [];
		throw new Error("Unsafe package dist path: dist");
	}
	const fsLimit = pLimit(PACKAGE_DIST_INVENTORY_SCAN_CONCURRENCY);
	return (await Promise.all(files.map((relativePath) => fsLimit(async () => {
		const opened = await packageFs.open(relativePath, {
			hardlinks: "allow",
			nonBlockingRead: true,
			symlinks: "reject"
		});
		try {
			let hash;
			try {
				if (opened.stat.size <= PACKAGE_DIST_INVENTORY_BUFFER_BYTES) {
					const content = await readFileHandleBounded(opened.handle, PACKAGE_DIST_INVENTORY_BUFFER_BYTES);
					hash = {
						bytes: content.byteLength,
						digest: sha256Hex(content)
					};
				} else hash = await sha256File(opened.handle);
			} catch (error) {
				if (!(error instanceof FsSafeError) || error.code !== "too-large") throw error;
				hash = await sha256File(opened.handle);
			}
			return createPackageDistContentInventoryEntry(relativePath, hash, opened.stat.mode);
		} finally {
			await opened[Symbol.asyncDispose]();
		}
	})))).toSorted((left, right) => left.path.localeCompare(right.path));
}
async function readPackageDistContentInventoryIfPresent(packageRoot) {
	const parsed = await readPackageDistJsonIfExists(packageRoot, PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH);
	if (parsed !== void 0) return parsePackageDistContentInventory(parsed);
	if ((await readPackageDistInventoryIfPresent(packageRoot))?.includes("dist/postinstall-content-inventory.json")) throw new Error(`missing package dist content inventory ${PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH}`);
	return null;
}
async function collectPackageDistContentInventoryErrors(packageRoot) {
	const expected = await readPackageDistContentInventoryIfPresent(packageRoot);
	if (expected === null) return [];
	return comparePackageDistContentInventory(expected, await collectPackageDistContentInventory(packageRoot));
}
//#endregion
export { readPackageDistInventoryIfPresent as a, readPackageDistContentInventoryIfPresent as i, collectPackageDistContentInventoryErrors as n, PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH as o, collectPackageDistInventory as r, PACKAGE_DIST_INVENTORY_RELATIVE_PATH as t };
