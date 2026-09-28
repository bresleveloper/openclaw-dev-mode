import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { d as sameFileIdentity, p as tempFile } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { d as pathExists, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { a as openRootFile, r as isRootFileMissingFailure } from "./boundary-file-read-D-Aa04On.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { S as isSubagentSessionKey, x as isCronSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-hMJcajDi.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as WorkspaceVanishedError } from "./workspace-state-identity-CmGr5k4K.mjs";
import { r as exactWorkspaceEntryExists } from "./root-memory-files-DBHovRYF.mjs";
import { r as isHardlinkFallbackError } from "./directory-durability-BKe2aOQN.mjs";
import { r as isDevMode } from "./globals-QODkv80i.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { t as retryAsync } from "./retry-C0DLN1oj.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-CThMOjN8.mjs";
import { u as extractFrontmatterBlock } from "./frontmatter-BdjKgRi1.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { a as DEFAULT_SOUL_FILENAME, c as GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES, f as hasGlobPattern, h as resolveGlobWalkRoot, i as DEFAULT_MEMORY_FILENAME, l as WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME, p as normalizeWorkspacePatternPath, r as DEFAULT_IDENTITY_FILENAME, s as DEFAULT_USER_FILENAME, t as DEFAULT_AGENTS_FILENAME, u as createBootstrapPatternMatcher } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { n as readWorkspaceBootstrapFile, t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { _ as writeWorkspaceFileCache, a as readWorkspaceStateSnapshot, c as WORKSPACE_ATTESTATION_RECENT_MS, h as readWorkspaceFileCache, o as replaceWorkspaceAttestation, r as mergeWorkspaceSetupState, t as clearExpiredWorkspaceStateForVanishedWorkspace } from "./workspace-state-store-DTZ2RTNw.mjs";
import { s as assertNoUnmigratedWorkspaceState } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { t as resolveWorkspaceTemplateSearchDirs } from "./workspace-templates-CNRexiYk.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { createHash } from "node:crypto";
//#region src/agents/workspace-file-read.ts
/** Boundary-safe workspace reads and the source identity of the bytes returned. */
const TRANSIENT_WORKSPACE_READ_CODES = /* @__PURE__ */ new Set([
	"EAGAIN",
	"EWOULDBLOCK",
	"EINTR"
]);
const TRANSIENT_WORKSPACE_READ_ERRNOS = /* @__PURE__ */ new Set([-11, -4]);
const TRANSIENT_WORKSPACE_READ_MESSAGE = /Unknown system error -(?:11|4)\b/i;
const workspaceFileSourceIdentities = /* @__PURE__ */ new WeakMap();
function workspaceFileIdentity(stat, canonicalPath) {
	return `${canonicalPath}|${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}:${stat.ctimeMs}`;
}
function setWorkspaceFileSourceIdentity(file, sourceIdentity) {
	workspaceFileSourceIdentities.set(file, sourceIdentity);
}
function getWorkspaceFileSourceIdentity(file) {
	return workspaceFileSourceIdentities.get(file);
}
/** Remote source recorded by the successful read, unavailable on hook-created copies. */
function getWorkspaceFileSourceRelativePath(file) {
	return getWorkspaceFileSourceIdentity(file)?.[3];
}
function workspaceFileSourceIdentitiesMatch(left, right) {
	const leftIdentity = getWorkspaceFileSourceIdentity(left);
	const rightIdentity = getWorkspaceFileSourceIdentity(right);
	return leftIdentity?.[2] === rightIdentity?.[2];
}
function workspaceFilesShareSourceIdentity(left, right) {
	const leftIdentity = getWorkspaceFileSourceIdentity(left);
	const rightIdentity = getWorkspaceFileSourceIdentity(right);
	if (!leftIdentity || !rightIdentity) return false;
	return leftIdentity[0] === rightIdentity[0] || leftIdentity[1] !== void 0 && rightIdentity[1] !== void 0 && sameFileIdentity(leftIdentity[1], rightIdentity[1]);
}
async function readWorkspaceFileWithGuards(params) {
	const access = getAgentWorkspaceAccess(params.workspaceDir);
	if (access) {
		if (!access.bridge.readFileWithSource) throw new Error("Workspace bootstrap source identity is unavailable");
		const filePath = path.relative(params.workspaceDir, params.filePath);
		const assertCurrent = () => {
			if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed while loading bootstrap files");
		};
		try {
			const { data, canonicalPath, workspaceRelativePath } = await access.bridge.readFileWithSource({
				filePath,
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			assertCurrent();
			if (params.rejectAliases && workspaceRelativePath !== filePath.replaceAll(path.sep, "/")) return {
				ok: false,
				reason: "validation"
			};
			if (data.length > 2097152) throw new RangeError(`Workspace bootstrap file exceeds its read bound: ${filePath}`);
			return {
				ok: true,
				content: data.toString("utf-8"),
				sourceIdentity: [
					canonicalPath,
					void 0,
					`${canonicalPath}:${createHash("sha256").update(data).digest("hex")}:${JSON.stringify(workspaceRelativePath)}`,
					workspaceRelativePath
				]
			};
		} catch (error) {
			assertCurrent();
			if (hasErrnoCode(error, "ENOENT")) return {
				ok: false,
				reason: "path",
				error
			};
			return {
				ok: false,
				reason: error instanceof RangeError ? "validation" : "io",
				error
			};
		}
	}
	try {
		return await retryAsync(async () => {
			const opened = await openRootFile({
				absolutePath: params.filePath,
				rootPath: params.workspaceDir,
				boundaryLabel: "workspace root",
				symlinks: params.rejectAliases ? "reject" : "follow-parents-within-root"
			});
			if (!opened.ok) {
				if (isTransientWorkspaceReadError(opened.error)) throw opened.error;
				return opened;
			}
			const identity = workspaceFileIdentity(opened.stat, opened.path);
			const sourceIdentity = [
				opened.path,
				opened.stat,
				identity
			];
			const cached = params.useCache === false ? void 0 : readWorkspaceFileCache(opened.path, identity);
			if (cached !== void 0) {
				fs.closeSync(opened.fd);
				return {
					ok: true,
					content: cached,
					sourceIdentity
				};
			}
			try {
				const content = await readWorkspaceBootstrapFile(opened.fd);
				if (params.useCache !== false) writeWorkspaceFileCache({
					filePath: opened.path,
					content,
					identity
				});
				return {
					ok: true,
					content,
					sourceIdentity
				};
			} finally {
				fs.closeSync(opened.fd);
			}
		}, {
			attempts: 3,
			minDelayMs: 50,
			maxDelayMs: 50,
			shouldRetry: (err) => isTransientWorkspaceReadError(err)
		});
	} catch (error) {
		return {
			ok: false,
			reason: error instanceof RangeError ? "validation" : "io",
			error
		};
	}
}
function isTransientWorkspaceReadError(error) {
	if (error && typeof error === "object") {
		if ("code" in error && typeof error.code === "string" && TRANSIENT_WORKSPACE_READ_CODES.has(error.code)) return true;
		if ("errno" in error && typeof error.errno === "number" && TRANSIENT_WORKSPACE_READ_ERRNOS.has(error.errno)) return true;
	}
	return error instanceof Error && TRANSIENT_WORKSPACE_READ_MESSAGE.test(error.message);
}
//#endregion
//#region src/agents/workspace-bootstrap-publish.ts
var WorkspaceBootstrapSeedConflictError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WorkspaceBootstrapSeedConflictError";
	}
};
async function publishBootstrapFile(filePath, content, beforePersistentApply) {
	const dir = await fs$1.realpath(path.dirname(filePath));
	const targetPath = path.join(dir, path.basename(filePath));
	const existing = await fs$1.lstat(targetPath).catch((error) => {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	});
	beforePersistentApply?.();
	if (existing) return false;
	let cleanupError;
	const staging = await tempFile({
		rootDir: dir,
		prefix: "openclaw-bootstrap",
		fileName: path.basename(filePath),
		onCleanupError: (error) => {
			cleanupError = error;
		}
	});
	let outcome;
	try {
		beforePersistentApply?.();
		await fs$1.writeFile(staging.path, content, {
			flag: "wx",
			flush: true
		});
		beforePersistentApply?.();
		let linked = false;
		try {
			fs.linkSync(staging.path, targetPath);
			linked = true;
			fs.unlinkSync(staging.path);
			outcome = { kind: "created" };
		} catch (error) {
			if (!linked && hasErrnoCode(error, "EEXIST")) outcome = { kind: "exists" };
			else if (!linked && isHardlinkFallbackError(error)) outcome = {
				kind: "failed",
				error: new Error("Workspace filesystem does not support atomic bootstrap publication. Use a workspace on a filesystem with hard-link support.", { cause: error })
			};
			else outcome = {
				kind: "failed",
				error
			};
		}
	} catch (error) {
		outcome = {
			kind: "failed",
			error
		};
	}
	await staging.cleanup();
	if (cleanupError !== void 0) {
		if (outcome.kind !== "failed") throw new Error("Workspace bootstrap staging cleanup failed after publication.", { cause: cleanupError });
		throw new AggregateError([outcome.error, cleanupError], "Workspace bootstrap publication and staging cleanup failed. Remove the incomplete staging directory, then retry.", { cause: cleanupError });
	}
	if (outcome.kind === "failed") throw outcome.error;
	return outcome.kind === "created";
}
async function publishAgentInstructions(filePath, template, purpose, beforePersistentApply) {
	const content = purpose ? `# Agent purpose\n\n${purpose}\n\n${template}` : template;
	const created = await publishBootstrapFile(filePath, content, beforePersistentApply);
	if (purpose && !created) {
		const existing = await readWorkspaceFileWithGuards({
			filePath,
			workspaceDir: path.dirname(filePath),
			useCache: false
		});
		if (!existing.ok || existing.content !== content) throw new WorkspaceBootstrapSeedConflictError("Existing AGENTS.md was preserved. Choose a new workspace to seed the approved custom purpose.");
	}
}
//#endregion
//#region src/agents/workspace.ts
/**
* Workspace bootstrap, template, state, and attestation helpers. This module
* creates and reads AGENTS/SOUL/TOOLS-style bootstrap files while guarding
* filesystem boundaries and recently-attested workspaces.
*/
const GENERATED_WORKSPACE_BOOTSTRAP_FILENAME_SET = new Set(GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES);
const WORKSPACE_ONBOARDING_PROFILE_FILENAMES = [
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
];
const workspaceLogger = createSubsystemLogger("workspace");
const workspaceTemplateCache = /* @__PURE__ */ new Map();
const gitInitializationInFlight = /* @__PURE__ */ new Map();
function stripFrontMatter(content) {
	return extractFrontmatterBlock(content)?.body.replace(/^\s+/, "") ?? content;
}
async function loadTemplate(name) {
	const cached = workspaceTemplateCache.get(name);
	if (cached) return cached;
	const pending = (async () => {
		const templateDirs = await resolveWorkspaceTemplateSearchDirs();
		const triedPaths = [];
		for (const templateDir of templateDirs) {
			const templatePath = path.join(templateDir, name);
			triedPaths.push(templatePath);
			try {
				return stripFrontMatter(await fs$1.readFile(templatePath, "utf-8"));
			} catch (error) {
				if (error?.code !== "ENOENT") throw error;
			}
		}
		throw new Error(`Missing workspace template: ${name} (${triedPaths.join(", ")}). Ensure workspace templates are packaged.`);
	})();
	workspaceTemplateCache.set(name, pending);
	try {
		return await pending;
	} catch (error) {
		workspaceTemplateCache.delete(name);
		throw error;
	}
}
/** Set of recognized bootstrap filenames for runtime validation */
const VALID_BOOTSTRAP_NAMES = new Set(WORKSPACE_BOOTSTRAP_FILENAMES);
const OPTIONAL_BOOTSTRAP_FILENAMES = /* @__PURE__ */ new Set([
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
]);
/**
* Bootstrap files whose absence is a normal workspace state rather than a fault:
* the optional profile files, plus MEMORY.md which only appears once memory is
* written. Editors should offer these for creation instead of flagging them.
*/
function isExpectedAbsentBootstrapFile(name) {
	return OPTIONAL_BOOTSTRAP_FILENAMES.has(name) || name === DEFAULT_MEMORY_FILENAME;
}
async function fileContentDiffersFromTemplate(filePath, template) {
	try {
		return await retryAsync(async () => await fs$1.readFile(filePath, "utf-8") !== template, {
			attempts: 3,
			minDelayMs: 50,
			maxDelayMs: 50,
			shouldRetry: (err) => isTransientWorkspaceReadError(err)
		});
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function hasWorkspaceUserContentEvidence(dir, opts) {
	const indicators = [path.join(dir, "memory")];
	if (opts?.includeGit) indicators.push(path.join(dir, ".git"));
	for (const indicator of indicators) try {
		await fs$1.access(indicator);
		return true;
	} catch {}
	if (await exactWorkspaceEntryExists(dir, DEFAULT_MEMORY_FILENAME)) return true;
	return await hasWorkspaceSkillEvidence(dir);
}
async function hasWorkspaceSkillEvidence(dir) {
	try {
		const skillEntries = await fs$1.readdir(path.join(dir, "skills"), { withFileTypes: true });
		for (const entry of skillEntries) {
			if (!entry.isDirectory()) continue;
			try {
				await fs$1.access(path.join(dir, "skills", entry.name, "SKILL.md"));
				return true;
			} catch {}
		}
	} catch {}
	return false;
}
async function hasSkipBootstrapWorkspaceContentEvidence(dir) {
	try {
		const entries = await fs$1.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.name === ".DS_Store" || entry.name === ".openclaw" || entry.name === "openclaw-workspace-state.json") continue;
			if (entry.name === "skills" && entry.isDirectory()) {
				if (!await hasWorkspaceSkillEvidence(dir)) continue;
			}
			return true;
		}
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	return false;
}
async function workspaceProfileLooksConfigured(params) {
	return (await Promise.all(WORKSPACE_ONBOARDING_PROFILE_FILENAMES.map(async (fileName) => fileContentDiffersFromTemplate(path.join(params.dir, fileName), await loadTemplate(fileName))))).some(Boolean) || await hasWorkspaceUserContentEvidence(params.dir, { includeGit: params.includeGitEvidence });
}
async function workspaceRequiredBootstrapLooksCustomized(dir, opts) {
	const fileNames = [DEFAULT_AGENTS_FILENAME];
	const generatedHashes = opts?.generatedHashes;
	if (generatedHashes && generatedHashes.size > 0) {
		for (const fileName of fileNames) {
			const filePath = path.join(dir, fileName);
			const generatedHash = generatedHashes.get(fileName);
			try {
				const content = await fs$1.readFile(filePath, "utf-8");
				if (createHash("sha256").update(content).digest("hex") !== generatedHash && content !== await loadTemplate(fileName)) return true;
			} catch {}
		}
		return false;
	}
	return (await Promise.all(fileNames.map(async (fileName) => fileContentDiffersFromTemplate(path.join(dir, fileName), await loadTemplate(fileName))))).some(Boolean);
}
async function workspaceAttestedGeneratedFilesIntact(dir, generatedHashes) {
	if (!generatedHashes.has("AGENTS.md")) return false;
	for (const [fileName, generatedHash] of generatedHashes) {
		if (!GENERATED_WORKSPACE_BOOTSTRAP_FILENAME_SET.has(fileName)) continue;
		try {
			const content = await fs$1.readFile(path.join(dir, fileName), "utf-8");
			if (createHash("sha256").update(content).digest("hex") !== generatedHash) return false;
		} catch {
			return false;
		}
	}
	return true;
}
async function workspaceHasBootstrapCompletionEvidence(params) {
	return await workspaceProfileLooksConfigured(params);
}
async function reconcileWorkspaceBootstrapCompletionState(params) {
	const bootstrapExists = params.bootstrapExists ?? await pathExists(params.bootstrapPath);
	if (typeof params.state.setupCompletedAt === "string" && params.state.setupCompletedAt.trim().length > 0) return {
		repaired: false,
		bootstrapExists,
		state: params.state
	};
	if (params.state.bootstrapSeededAt && !bootstrapExists) {
		const completedState = {
			...params.state,
			setupCompletedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		params.beforePersistentApply?.();
		return {
			repaired: true,
			bootstrapExists: false,
			state: await mergeWorkspaceSetupState(params.dir, completedState, void 0, { assertCurrent: params.beforePersistentApply })
		};
	}
	if (!bootstrapExists || !await workspaceHasBootstrapCompletionEvidence({ dir: params.dir })) return {
		repaired: false,
		bootstrapExists,
		state: params.state
	};
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const repairedState = {
		...params.state,
		bootstrapSeededAt: params.state.bootstrapSeededAt ?? now,
		setupCompletedAt: now
	};
	params.beforePersistentApply?.();
	const persistedState = await mergeWorkspaceSetupState(params.dir, repairedState, void 0, { assertCurrent: params.beforePersistentApply });
	params.beforePersistentApply?.();
	try {
		await fs$1.rm(params.bootstrapPath, { force: true });
		return {
			repaired: true,
			bootstrapExists: false,
			state: persistedState
		};
	} catch {
		return {
			repaired: true,
			bootstrapExists: true,
			state: persistedState
		};
	}
}
async function collectGeneratedBootstrapHashes(dir) {
	const hashes = /* @__PURE__ */ new Map();
	for (const fileName of GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES) try {
		const content = await fs$1.readFile(path.join(dir, fileName), "utf-8");
		if (content === await loadTemplate(fileName)) hashes.set(fileName, createHash("sha256").update(content).digest("hex"));
	} catch {}
	return hashes;
}
function recentWorkspaceAttestation(attestation, nowMs = Date.now()) {
	if (!attestation) return;
	if (nowMs - attestation.attestedAtMs > 864e5) return;
	return attestation;
}
async function maybeWriteWorkspaceAttestation(dir, beforePersistentApply) {
	const attestedAtMs = Date.now();
	const generatedHashes = await collectGeneratedBootstrapHashes(dir);
	beforePersistentApply?.();
	try {
		await replaceWorkspaceAttestation({
			workspaceDir: dir,
			attestedAtMs,
			generatedHashes,
			assertCurrent: beforePersistentApply
		});
	} catch {}
	beforePersistentApply?.();
}
function hasWorkspaceSetupStateMarker(state) {
	return Boolean(state.bootstrapSeededAt || state.setupCompletedAt);
}
function hasRecentWorkspaceSetupState(snapshot, nowMs = Date.now()) {
	if (!hasWorkspaceSetupStateMarker(snapshot.setup) || snapshot.setupUpdatedAtMs === void 0) return false;
	return nowMs - snapshot.setupUpdatedAtMs <= WORKSPACE_ATTESTATION_RECENT_MS;
}
async function workspaceAttestationHasSurvivalEvidence(params) {
	if (await pathExists(params.bootstrapPath)) return true;
	if (await workspaceRequiredBootstrapLooksCustomized(params.dir, { generatedHashes: params.attestation.generatedHashes })) return true;
	if (await workspaceProfileLooksConfigured({ dir: params.dir })) return true;
	return hasWorkspaceSetupStateMarker(params.state) && await workspaceAttestedGeneratedFilesIntact(params.dir, params.attestation.generatedHashes);
}
async function workspaceSetupStateHasSurvivalEvidence(params) {
	if (await pathExists(params.bootstrapPath)) return true;
	if (await workspaceProfileLooksConfigured({ dir: params.dir })) return true;
	const currentState = await readCanonicalWorkspaceStateSnapshot(params.dir, void 0, params.beforePersistentApply);
	if (currentState.setup.bootstrapSeededAt !== params.initialState.setup.bootstrapSeededAt || currentState.setup.setupCompletedAt !== params.initialState.setup.setupCompletedAt) return true;
	const generatedHashes = await collectGeneratedBootstrapHashes(params.dir);
	return [
		DEFAULT_AGENTS_FILENAME,
		DEFAULT_SOUL_FILENAME,
		DEFAULT_IDENTITY_FILENAME,
		DEFAULT_USER_FILENAME
	].every((fileName) => generatedHashes.has(fileName));
}
async function readCanonicalWorkspaceStateSnapshot(dir, options = {}, assertCurrent) {
	const snapshot = await readWorkspaceStateSnapshot(dir, {
		...options,
		assertCurrent
	});
	assertNoUnmigratedWorkspaceState({ workspaceDir: dir });
	return snapshot;
}
async function isWorkspaceSetupCompleted(dir, options = {}) {
	const state = (await readCanonicalWorkspaceStateSnapshot(dir, options)).setup;
	return typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0;
}
async function resolveWorkspaceBootstrapStatus(dir, options = {}) {
	const resolvedDir = resolveUserPath(dir);
	const state = (await readCanonicalWorkspaceStateSnapshot(resolvedDir, options)).setup;
	if (typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0) return "complete";
	const bootstrapPath = path.join(resolvedDir, DEFAULT_BOOTSTRAP_FILENAME);
	if (!await pathExists(bootstrapPath)) return "complete";
	return "pending";
}
async function seedWorkspaceBootstrap(params) {
	if (params.content.byteLength > 2097152) throw new WorkspaceBootstrapSeedConflictError(`BOOTSTRAP.md exceeds ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES} bytes.`);
	let text;
	try {
		text = new TextDecoder("utf-8", { fatal: true }).decode(params.content);
	} catch {
		throw new WorkspaceBootstrapSeedConflictError("BOOTSTRAP.md must be valid UTF-8.");
	}
	if (text.trim().length === 0) throw new WorkspaceBootstrapSeedConflictError("BOOTSTRAP.md must not be empty.");
	const dir = resolveUserPath(params.dir);
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	const initialState = (await readCanonicalWorkspaceStateSnapshot(dir, params.stateOptions)).setup;
	if (initialState.setupCompletedAt) return "consumed";
	const bootstrapExists = await pathExists(bootstrapPath);
	if (initialState.bootstrapSeededAt && !bootstrapExists) return "consumed";
	await fs$1.mkdir(dir, { recursive: true });
	const workspaceRoot = await root(dir, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
		symlinks: "reject"
	});
	let created = false;
	if (!bootstrapExists) try {
		await workspaceRoot.write(DEFAULT_BOOTSTRAP_FILENAME, params.content, { overwrite: false });
		created = true;
	} catch (error) {
		if (!(error.code === "EEXIST" || error instanceof FsSafeError && error.code === "already-exists")) throw error;
	}
	if (!created) await retryAsync(async () => {
		let statBefore;
		try {
			statBefore = await fs$1.stat(bootstrapPath);
		} catch (error) {
			throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md could not be read safely.", { cause: error });
		}
		const existing = await readWorkspaceFileWithGuards({
			filePath: bootstrapPath,
			workspaceDir: dir,
			useCache: false
		});
		if (!existing.ok) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md could not be read safely.");
		if (!Buffer.from(existing.content, "utf8").equals(params.content)) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md differs from the consented Claw bootstrap.");
		await setTimeout(20);
		let statAfter;
		try {
			statAfter = await fs$1.stat(bootstrapPath);
		} catch (error) {
			throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md could not be read safely.", { cause: error });
		}
		if (statBefore.size !== statAfter.size || statBefore.mtimeMs !== statAfter.mtimeMs || statAfter.size !== params.content.byteLength) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md write has not stabilized.");
		const stable = await readWorkspaceFileWithGuards({
			filePath: bootstrapPath,
			workspaceDir: dir,
			useCache: false
		});
		if (!stable.ok || !Buffer.from(stable.content, "utf8").equals(params.content)) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md differs from the consented Claw bootstrap.");
	}, {
		attempts: 5,
		minDelayMs: 20,
		maxDelayMs: 80,
		shouldRetry: (error) => error instanceof WorkspaceBootstrapSeedConflictError
	});
	if (!initialState.bootstrapSeededAt) {
		const nowMs = params.nowMs ?? Date.now();
		await mergeWorkspaceSetupState(dir, { bootstrapSeededAt: new Date(nowMs).toISOString() }, nowMs, params.stateOptions);
	}
	return created ? "seeded" : "already-seeded";
}
async function isWorkspaceBootstrapPending(dir) {
	return await resolveWorkspaceBootstrapStatus(dir) === "pending";
}
const isGitAvailable = createLazyPromise(async () => {
	try {
		return (await runCommandWithTimeout(["git", "--version"], { timeoutMs: 2e3 })).code === 0;
	} catch {
		return false;
	}
});
async function ensureGitRepo(dir, isBrandNewWorkspace, beforePersistentApply) {
	if (!isBrandNewWorkspace) return;
	beforePersistentApply?.();
	await getOrCreatePromise(gitInitializationInFlight, dir, async () => {
		if (await fs$1.stat(path.join(dir, ".git")).catch(() => void 0)) return;
		if (!await isGitAvailable()) return;
		beforePersistentApply?.();
		try {
			await runCommandWithTimeout(["git", "init"], {
				cwd: dir,
				timeoutMs: 1e4
			});
		} catch {}
	}, { evictOnSettled: true });
}
async function ensureAgentWorkspace(params) {
	const rawDir = params?.dir?.trim() ? params.dir.trim() : DEFAULT_AGENT_WORKSPACE_DIR;
	const dir = resolveUserPath(rawDir);
	const beforePersistentApply = params?.beforePersistentApply;
	const purpose = params?.purpose?.trim();
	if (purpose && (params?.templates || getAgentWorkspaceAccess(dir))) throw new WorkspaceBootstrapSeedConflictError("A custom agent purpose requires a local workspace without a bundled role.");
	if (getAgentWorkspaceAccess(dir)) return {
		dir,
		bootstrapPending: false
	};
	if (params?.provisioning === "runtime-managed-implicit") {
		beforePersistentApply?.();
		await fs$1.mkdir(dir, { recursive: true });
		return {
			dir,
			bootstrapPending: false
		};
	}
	let initialState = await readCanonicalWorkspaceStateSnapshot(dir, void 0, beforePersistentApply);
	let reseedingExpiredWorkspaceState = false;
	const recentAttestation = recentWorkspaceAttestation(initialState.attestation);
	const recentSetupState = hasRecentWorkspaceSetupState(initialState);
	if (!await pathExists(dir)) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		beforePersistentApply?.();
		if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, { assertCurrent: beforePersistentApply })) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	beforePersistentApply?.();
	await fs$1.mkdir(dir, { recursive: true });
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	if (!params?.ensureBootstrapFiles) {
		const hasContentEvidence = await hasSkipBootstrapWorkspaceContentEvidence(dir);
		if (recentAttestation && !hasContentEvidence) throw new WorkspaceVanishedError({ workspaceDir: dir });
		if (hasWorkspaceSetupStateMarker(initialState.setup) && !initialState.attestation && !await workspaceSetupStateHasSurvivalEvidence({
			dir,
			bootstrapPath,
			initialState,
			beforePersistentApply
		})) {
			if (recentSetupState) throw new WorkspaceVanishedError({ workspaceDir: dir });
			beforePersistentApply?.();
			if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, { assertCurrent: beforePersistentApply })) throw new WorkspaceVanishedError({ workspaceDir: dir });
		}
		if (purpose) await publishAgentInstructions(path.join(dir, DEFAULT_AGENTS_FILENAME), await loadTemplate(DEFAULT_AGENTS_FILENAME), purpose, beforePersistentApply);
		if (hasContentEvidence || purpose) await maybeWriteWorkspaceAttestation(dir, beforePersistentApply);
		return {
			dir,
			bootstrapPending: false
		};
	}
	const agentsPath = path.join(dir, DEFAULT_AGENTS_FILENAME);
	const soulPath = path.join(dir, DEFAULT_SOUL_FILENAME);
	const identityPath = path.join(dir, DEFAULT_IDENTITY_FILENAME);
	const userPath = path.join(dir, DEFAULT_USER_FILENAME);
	const isBrandNewWorkspace = await (async () => {
		const paths = [...[
			agentsPath,
			soulPath,
			identityPath,
			userPath
		], path.join(dir, "memory")];
		return (await Promise.all(paths.map(async (p) => {
			try {
				await fs$1.access(p);
				return true;
			} catch {
				return false;
			}
		}))).every((v) => !v) && !await hasWorkspaceUserContentEvidence(dir);
	})();
	if (isBrandNewWorkspace) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = initialState.setupExists || Boolean(initialState.attestation);
		beforePersistentApply?.();
		if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, { assertCurrent: beforePersistentApply })) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	if (initialState.attestation && !isBrandNewWorkspace) {
		if (!await workspaceAttestationHasSurvivalEvidence({
			dir,
			bootstrapPath,
			state: initialState.setup,
			attestation: initialState.attestation
		})) {
			if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
			reseedingExpiredWorkspaceState = true;
			beforePersistentApply?.();
			if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, { assertCurrent: beforePersistentApply })) throw new WorkspaceVanishedError({ workspaceDir: dir });
		}
	} else if (hasWorkspaceSetupStateMarker(initialState.setup) && !isBrandNewWorkspace && !await workspaceSetupStateHasSurvivalEvidence({
		dir,
		bootstrapPath,
		initialState,
		beforePersistentApply
	})) {
		if (recentSetupState) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = true;
		beforePersistentApply?.();
		if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, { assertCurrent: beforePersistentApply })) throw new WorkspaceVanishedError({ workspaceDir: dir });
	}
	const defaultAgentsTemplate = params?.templates?.["AGENTS.md"] ?? await loadTemplate("AGENTS.md");
	const soulTemplate = params?.templates?.["SOUL.md"] ?? await loadTemplate("SOUL.md");
	const identityTemplate = params?.templates?.["IDENTITY.md"] ?? await loadTemplate("IDENTITY.md");
	const userTemplate = await loadTemplate(DEFAULT_USER_FILENAME);
	initialState = await readCanonicalWorkspaceStateSnapshot(dir, void 0, beforePersistentApply);
	const skipOptionalBootstrapFiles = new Set(params?.skipOptionalBootstrapFiles ?? []);
	if (initialState.setup.setupCompletedAt) for (const filename of OPTIONAL_BOOTSTRAP_FILENAMES) skipOptionalBootstrapFiles.add(filename);
	const shouldWriteBootstrapFile = (fileName) => !OPTIONAL_BOOTSTRAP_FILENAMES.has(fileName) || !skipOptionalBootstrapFiles.has(fileName);
	await publishAgentInstructions(agentsPath, defaultAgentsTemplate, purpose, beforePersistentApply);
	if (shouldWriteBootstrapFile("SOUL.md")) await publishBootstrapFile(soulPath, soulTemplate, beforePersistentApply);
	const identityPathCreated = shouldWriteBootstrapFile("IDENTITY.md") ? await publishBootstrapFile(identityPath, identityTemplate, beforePersistentApply) : false;
	if (shouldWriteBootstrapFile("USER.md")) await publishBootstrapFile(userPath, userTemplate, beforePersistentApply);
	let state = (await readCanonicalWorkspaceStateSnapshot(dir, void 0, beforePersistentApply)).setup;
	let stateDirty = false;
	const markState = (next) => {
		state = {
			...state,
			...next
		};
		stateDirty = true;
	};
	const nowIso = () => (/* @__PURE__ */ new Date()).toISOString();
	let bootstrapExists = await pathExists(bootstrapPath);
	if (!state.bootstrapSeededAt && bootstrapExists) markState({ bootstrapSeededAt: nowIso() });
	if (!state.setupCompletedAt) {
		const repair = await reconcileWorkspaceBootstrapCompletionState({
			dir,
			bootstrapPath,
			state,
			bootstrapExists,
			beforePersistentApply
		});
		if (repair.repaired) {
			state = repair.state;
			stateDirty = false;
			bootstrapExists = repair.bootstrapExists;
		}
	}
	if (!state.bootstrapSeededAt && !state.setupCompletedAt && !bootstrapExists) {
		if ((recentAttestation ? await workspaceRequiredBootstrapLooksCustomized(dir, { generatedHashes: recentAttestation.generatedHashes }) : false) || await workspaceProfileLooksConfigured({
			dir,
			includeGitEvidence: !reseedingExpiredWorkspaceState
		})) markState({ setupCompletedAt: nowIso() });
		else {
			if (!await publishBootstrapFile(bootstrapPath, await loadTemplate(DEFAULT_BOOTSTRAP_FILENAME), beforePersistentApply)) bootstrapExists = await pathExists(bootstrapPath);
			else bootstrapExists = true;
			if (bootstrapExists && !state.bootstrapSeededAt) markState({ bootstrapSeededAt: nowIso() });
		}
	}
	if (stateDirty) {
		beforePersistentApply?.();
		state = await mergeWorkspaceSetupState(dir, state, void 0, { assertCurrent: beforePersistentApply });
	}
	if (isDevMode() && state.setupCompletedAt) await publishBootstrapFile(path.join(dir, DEFAULT_MEMORY_FILENAME), "# Memory\n", beforePersistentApply);
	await ensureGitRepo(dir, isBrandNewWorkspace, beforePersistentApply);
	await maybeWriteWorkspaceAttestation(dir, beforePersistentApply);
	return {
		dir,
		agentsPath,
		soulPath,
		identityPath,
		userPath,
		bootstrapPath,
		bootstrapPending: !state.setupCompletedAt && bootstrapExists,
		identityPathCreated
	};
}
async function loadWorkspaceBootstrapFiles(dir, names) {
	const resolvedDir = resolveUserPath(dir);
	const access = getAgentWorkspaceAccess(resolvedDir);
	const entries = WORKSPACE_BOOTSTRAP_FILENAMES.filter((name) => names === void 0 || names.includes(name)).map((name) => ({
		name,
		filePath: path.join(resolvedDir, name)
	}));
	const result = [];
	for (const entry of entries) {
		if (!access && (entry.name === DEFAULT_MEMORY_FILENAME || entry.name === "USER.md") && !await exactWorkspaceEntryExists(resolvedDir, entry.name)) continue;
		const loaded = await readWorkspaceFileWithGuards({
			filePath: entry.filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) {
			const file = {
				name: entry.name,
				path: entry.filePath,
				content: loaded.content,
				missing: false
			};
			setWorkspaceFileSourceIdentity(file, loaded.sourceIdentity);
			result.push(file);
		} else if (isRootFileMissingFailure(loaded)) {
			if (access && (entry.name === DEFAULT_MEMORY_FILENAME || entry.name === "USER.md")) continue;
			result.push({
				name: entry.name,
				path: entry.filePath,
				missing: true
			});
		} else {
			const fallbackReason = `workspace file could not be read (${loaded.reason})`;
			const rawReason = loaded.error instanceof Error ? loaded.error.message : fallbackReason;
			const reason = truncateUtf16Safe(rawReason.replaceAll(/\s+/gu, " ").trim() || fallbackReason, 300);
			workspaceLogger.warn("Workspace bootstrap file is unreadable.", {
				fileName: entry.name,
				filePath: entry.filePath,
				reason,
				consoleMessage: `Workspace bootstrap file is unreadable: file=${entry.filePath} reason=${reason}`
			});
			result.push({
				name: entry.name,
				path: entry.filePath,
				content: `[UNREADABLE: ${reason}]`,
				missing: false
			});
		}
	}
	return result;
}
const SUBAGENT_BOOTSTRAP_ALLOWLIST = /* @__PURE__ */ new Set([DEFAULT_AGENTS_FILENAME]);
const CRON_BOOTSTRAP_ALLOWLIST = /* @__PURE__ */ new Set([
	DEFAULT_AGENTS_FILENAME,
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
]);
function resolveBootstrapSessionContext(session) {
	return typeof session === "string" ? { sessionKey: session } : session ?? {};
}
function filterRootMemoryBootstrapFiles(files, workspaceRoot) {
	if (!workspaceRoot) return files.filter((file) => file.name !== DEFAULT_MEMORY_FILENAME);
	const resolvedWorkspaceRoot = resolveUserPath(workspaceRoot);
	const rootMemoryPath = path.join(resolvedWorkspaceRoot, DEFAULT_MEMORY_FILENAME);
	return files.filter((file) => {
		if (typeof file.path !== "string") return true;
		const filePath = file.path.trim();
		if (!filePath) return true;
		return (path.isAbsolute(filePath) ? path.resolve(filePath) : filePath.startsWith("~") ? resolveUserPath(filePath) : path.resolve(resolvedWorkspaceRoot, filePath)) !== rootMemoryPath;
	});
}
function filterBootstrapFilesForSession(files, session) {
	const { sessionKey, chatType, workspaceDir } = resolveBootstrapSessionContext(session);
	const isSubagent = isSubagentSessionKey(sessionKey);
	const isCron = isCronSessionKey(sessionKey);
	const effectiveChatType = chatType ?? deriveSessionChatTypeFromKey(sessionKey);
	const privacyFilteredFiles = isSubagent || isCron || effectiveChatType === "group" || effectiveChatType === "channel" ? filterRootMemoryBootstrapFiles(files, workspaceDir) : files;
	if (isSubagent) return privacyFilteredFiles.filter((file) => SUBAGENT_BOOTSTRAP_ALLOWLIST.has(file.name));
	if (isCron) return privacyFilteredFiles.filter((file) => CRON_BOOTSTRAP_ALLOWLIST.has(file.name));
	return privacyFilteredFiles;
}
async function* walkWorkspaceFiles(workspaceDir, initialRelativeDir, matcher) {
	const access = getAgentWorkspaceAccess(workspaceDir);
	const stack = [initialRelativeDir === "." ? "" : initialRelativeDir];
	while (stack.length > 0) {
		const currentRelativeDir = stack.pop() ?? "";
		const currentDir = path.resolve(workspaceDir, currentRelativeDir);
		if (!isPathInside(workspaceDir, currentDir)) continue;
		let entries;
		try {
			if (access) {
				if (!access.bridge.readDirectory) throw new Error("Workspace bootstrap directory listing is unavailable");
				const remoteEntries = await access.bridge.readDirectory({ filePath: currentRelativeDir || "." });
				if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while discovering bootstrap files");
				entries = remoteEntries.map(({ name, isDirectory }) => ({
					name,
					isDirectory,
					isFile: !isDirectory
				}));
			} else entries = (await fs$1.readdir(currentDir, { withFileTypes: true })).map((entry) => ({
				name: entry.name,
				isDirectory: entry.isDirectory(),
				isFile: entry.isFile() || entry.isSymbolicLink()
			}));
		} catch (error) {
			if (access) throw error;
			continue;
		}
		for (const entry of entries) {
			const childRelativePath = currentRelativeDir ? path.join(currentRelativeDir, entry.name) : entry.name;
			const normalizedChildPath = normalizeWorkspacePatternPath(childRelativePath);
			if (entry.isDirectory) {
				if (matcher.match(normalizedChildPath, true)) stack.push(childRelativePath);
				continue;
			}
			if (entry.isFile && matcher.match(normalizedChildPath)) yield normalizedChildPath;
		}
	}
}
async function resolveExtraBootstrapPatternPaths(workspaceDir, pattern) {
	if (!getAgentWorkspaceAccess(workspaceDir) && typeof fs$1.glob === "function") try {
		const matches = [];
		for await (const match of fs$1.glob(pattern, { cwd: workspaceDir })) matches.push(match);
		return matches;
	} catch {}
	if (typeof path.matchesGlob !== "function") return [pattern];
	const normalizedPattern = normalizeWorkspacePatternPath(pattern);
	const matcher = createBootstrapPatternMatcher(normalizedPattern);
	const matches = [];
	for await (const candidate of walkWorkspaceFiles(workspaceDir, resolveGlobWalkRoot(normalizedPattern), matcher)) matches.push(candidate);
	return matches.length > 0 ? matches : [pattern];
}
function patternWalkRootStaysInWorkspace(workspaceDir, pattern) {
	const walkRoot = path.resolve(workspaceDir, resolveGlobWalkRoot(pattern));
	return isPathInside(workspaceDir, walkRoot);
}
async function loadExtraBootstrapFilesWithDiagnostics(dir, extraPatterns) {
	if (!extraPatterns.length) return {
		files: [],
		diagnostics: []
	};
	const resolvedDir = resolveUserPath(dir);
	const diagnostics = [];
	const resolvedPaths = /* @__PURE__ */ new Set();
	for (const pattern of extraPatterns) {
		if (!patternWalkRootStaysInWorkspace(resolvedDir, pattern)) {
			diagnostics.push({
				path: path.resolve(resolvedDir, pattern),
				reason: "security",
				detail: "pattern resolves outside the workspace"
			});
			continue;
		}
		try {
			if (hasGlobPattern(pattern)) {
				const matches = await resolveExtraBootstrapPatternPaths(resolvedDir, pattern);
				for (const match of matches) resolvedPaths.add(match);
			} else resolvedPaths.add(pattern);
		} catch (error) {
			diagnostics.push({
				path: path.resolve(resolvedDir, pattern),
				reason: "io",
				detail: error instanceof Error ? error.message : String(error)
			});
		}
	}
	const files = [];
	for (const relPath of resolvedPaths) {
		const filePath = path.resolve(resolvedDir, relPath);
		const baseName = path.basename(relPath);
		if (!VALID_BOOTSTRAP_NAMES.has(baseName)) {
			diagnostics.push({
				path: filePath,
				reason: "invalid-bootstrap-filename",
				detail: `unsupported bootstrap basename: ${baseName}`
			});
			continue;
		}
		const loaded = await readWorkspaceFileWithGuards({
			filePath,
			workspaceDir: resolvedDir
		});
		if (loaded.ok) {
			const file = {
				name: baseName,
				path: filePath,
				content: loaded.content,
				missing: false
			};
			setWorkspaceFileSourceIdentity(file, loaded.sourceIdentity);
			files.push(file);
			continue;
		}
		const reason = loaded.reason === "validation" ? "security" : loaded.reason === "path" ? "missing" : "io";
		diagnostics.push({
			path: filePath,
			reason,
			detail: loaded.error instanceof Error ? loaded.error.message : typeof loaded.error === "string" ? loaded.error : reason
		});
	}
	return {
		files,
		diagnostics
	};
}
//#endregion
export { isWorkspaceSetupCompleted as a, resolveWorkspaceBootstrapStatus as c, getWorkspaceFileSourceRelativePath as d, readWorkspaceFileWithGuards as f, workspaceFilesShareSourceIdentity as h, isWorkspaceBootstrapPending as i, seedWorkspaceBootstrap as l, workspaceFileSourceIdentitiesMatch as m, filterBootstrapFilesForSession as n, loadExtraBootstrapFilesWithDiagnostics as o, setWorkspaceFileSourceIdentity as p, isExpectedAbsentBootstrapFile as r, loadWorkspaceBootstrapFiles as s, ensureAgentWorkspace as t, publishBootstrapFile as u };
