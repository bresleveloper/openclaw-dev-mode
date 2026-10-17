import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { i as getOrCreatePromise, n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { d as pathExists, t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isRootFileMissingFailure } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { f as DuplicateAgentError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { o as resolveCanonicalWorkspacePath, r as WorkspaceVanishedError } from "./workspace-state-identity-EPAs22n_.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { d as withExistingOpenClawStateDatabaseCurrentReadOnly } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { S as isCronSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-BKv26wgx.mjs";
import { r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
import { r as exactWorkspaceEntryExists } from "./root-memory-files-BUq0D-EI.mjs";
import { t as deriveSessionChatTypeFromKey } from "./session-chat-type-shared-BzwKnB1m.mjs";
import { n as assertAgentDeletionRecoveryHoldPredicate } from "./agent-deletion-journal-recovery.kernel-NYQbfJsi.mjs";
import { r as isDevMode } from "./globals-BXbZ1A_g.mjs";
import { l as extractFrontmatterBlock } from "./frontmatter-ByhFzIgC.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { a as DEFAULT_SOUL_FILENAME, c as GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES, f as hasGlobPattern, g as resolveWorkspaceBootstrapPath, h as resolveGlobWalkRoot, i as DEFAULT_MEMORY_FILENAME, l as WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME, p as normalizeWorkspacePatternPath, r as DEFAULT_IDENTITY_FILENAME, s as DEFAULT_USER_FILENAME, t as DEFAULT_AGENTS_FILENAME, u as createBootstrapPatternMatcher } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
import { a as isTransientWorkspaceReadError, n as publishAgentInstructions, o as readWorkspaceFileWithGuards, r as publishBootstrapFile, s as setWorkspaceFileSourceIdentity, t as WorkspaceBootstrapSeedConflictError } from "./workspace-bootstrap-publish-ZP86pZVJ.mjs";
import { o as assertNoUnmigratedWorkspaceState } from "./workspace-legacy-state-CfAX5lfc.mjs";
import { a as readWorkspaceStateSnapshot, c as captureWorkspaceStateFilesystemGuard, o as replaceWorkspaceAttestation, r as mergeWorkspaceSetupState, t as clearExpiredWorkspaceStateForVanishedWorkspace } from "./workspace-state-store-DCCJC3M9.mjs";
import { c as hasWorkspaceSetupStateMarker, d as recentWorkspaceAttestation, s as hasRecentWorkspaceSetupState } from "./workspace-state-store.kernel-0RlWLaF0.mjs";
import { t as resolveWorkspaceTemplateSearchDirs } from "./workspace-templates-SBb56ls8.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
//#region src/agents/workspace-file-mutation-guard.ts
/** Filesystem effects run outside worker grants and retain their current native recovery check. */
function createWorkspaceFileMutationGuard(guard) {
	if (!guard) return;
	return () => {
		guard.assertHost?.();
		guard.beforeLegacyApply?.();
		const predicate = guard.recoveryHoldPredicate;
		if (predicate?.applies) withExistingOpenClawStateDatabaseCurrentReadOnly((database) => assertAgentDeletionRecoveryHoldPredicate(database, predicate), { allowNativeRead: true });
	};
}
//#endregion
//#region src/agents/workspace-git.ts
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
	if (await fs.stat(path.join(dir, ".git")).catch(() => void 0)) return;
	if (!await isGitAvailable()) return;
	beforePersistentApply?.();
	try {
		await runCommandWithTimeout(["git", "init"], {
			cwd: dir,
			timeoutMs: 1e4
		});
	} catch {}
}
//#endregion
//#region src/agents/workspace-preparation.ts
const preparationQueues = resolveGlobalMap(Symbol.for("openclaw.workspacePreparationQueues"));
/** Keep host filesystem preparation and its worker writes in one directory's FIFO interval. */
function runWorkspacePreparation(dir, prepare) {
	const assertFilesystem = captureWorkspaceStateFilesystemGuard(dir, false);
	const canonicalDir = resolveCanonicalWorkspacePath(dir);
	assertFilesystem();
	return runQueuedStoreWrite({
		queues: preparationQueues,
		storePath: canonicalDir,
		label: "Workspace preparation",
		fn: async () => {
			assertFilesystem();
			return await prepare(assertFilesystem);
		}
	});
}
//#endregion
//#region src/agents/workspace-state-read.ts
async function readCanonicalWorkspaceStateSnapshot(dir, options = {}, guard) {
	const snapshot = await readWorkspaceStateSnapshot(dir, {
		...options,
		assertCurrent: guard?.assertHost,
		recoveryHoldPredicate: guard?.recoveryHoldPredicate,
		beforeLegacyApply: guard?.beforeLegacyApply
	});
	guard?.assertHost?.();
	assertNoUnmigratedWorkspaceState({ workspaceDir: dir });
	return snapshot;
}
//#endregion
//#region src/agents/workspace-bootstrap-seed.ts
async function seedWorkspaceBootstrap(params) {
	if (params.content.byteLength > 2097152) throw new WorkspaceBootstrapSeedConflictError(`BOOTSTRAP.md exceeds ${MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES} bytes.`);
	const options = params.stateOptions;
	const captured = {
		...params,
		dir: resolveUserPath(params.dir),
		content: Buffer.from(params.content),
		stateOptions: options && {
			...options,
			env: options.env && { ...options.env },
			initializationAgentPaths: options.initializationAgentPaths && [...options.initializationAgentPaths]
		}
	};
	let text;
	try {
		text = new TextDecoder("utf-8", { fatal: true }).decode(captured.content);
	} catch {
		throw new WorkspaceBootstrapSeedConflictError("BOOTSTRAP.md must be valid UTF-8.");
	}
	if (text.trim().length === 0) throw new WorkspaceBootstrapSeedConflictError("BOOTSTRAP.md must not be empty.");
	return runWorkspacePreparation(captured.dir, (assertCurrent) => seedWorkspaceBootstrapOwned(captured, assertCurrent));
}
async function seedWorkspaceBootstrapOwned(params, assertCurrent) {
	const dir = params.dir;
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	const initialState = (await readCanonicalWorkspaceStateSnapshot(dir, params.stateOptions, { assertHost: assertCurrent })).setup;
	if (initialState.setupCompletedAt) return "consumed";
	const bootstrapExists = await pathExists(bootstrapPath);
	assertCurrent();
	if (initialState.bootstrapSeededAt && !bootstrapExists) return "consumed";
	await fs.mkdir(dir, { recursive: true });
	assertCurrent();
	const workspaceRoot = await root(dir, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES,
		symlinks: "reject"
	});
	let created = false;
	if (!bootstrapExists) try {
		await workspaceRoot.write(DEFAULT_BOOTSTRAP_FILENAME, params.content, {
			overwrite: false,
			assertBeforeMutation: assertCurrent
		});
		created = true;
	} catch (error) {
		if (!(hasErrnoCode(error, "EEXIST") || error instanceof FsSafeError && error.code === "already-exists")) throw error;
	}
	if (!created) {
		const statExistingBootstrap = () => fs.stat(bootstrapPath).catch((error) => {
			throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md could not be read safely.", { cause: error });
		});
		await retryAsync(async () => {
			const statBefore = await statExistingBootstrap();
			const existing = await readWorkspaceFileWithGuards({
				filePath: bootstrapPath,
				workspaceDir: dir,
				useCache: false
			});
			if (!existing.ok) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md could not be read safely.");
			if (!Buffer.from(existing.content, "utf8").equals(params.content)) throw new WorkspaceBootstrapSeedConflictError("Existing BOOTSTRAP.md differs from the consented Claw bootstrap.");
			await setTimeout(20);
			const statAfter = await statExistingBootstrap();
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
	}
	if (!initialState.bootstrapSeededAt) {
		const nowMs = params.nowMs ?? Date.now();
		await mergeWorkspaceSetupState(dir, { bootstrapSeededAt: new Date(nowMs).toISOString() }, nowMs, {
			...params.stateOptions,
			assertCurrent
		});
	}
	assertCurrent();
	return created ? "seeded" : "already-seeded";
}
//#endregion
//#region src/agents/workspace.ts
const GENERATED_WORKSPACE_BOOTSTRAP_FILENAME_SET = new Set(GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES);
const WORKSPACE_ONBOARDING_PROFILE_FILENAMES = [
	DEFAULT_SOUL_FILENAME,
	DEFAULT_IDENTITY_FILENAME,
	DEFAULT_USER_FILENAME
];
const workspaceLogger = createSubsystemLogger("workspace");
const workspaceTemplateCache = /* @__PURE__ */ new Map();
function stripFrontMatter(content) {
	return extractFrontmatterBlock(content)?.body.replace(/^\s+/, "") ?? content;
}
const RETIRED_GENERATED_TEMPLATE_SHA256 = {
	[DEFAULT_AGENTS_FILENAME]: ["1e17784e422c0e47e44c5214d0b37092f7b378bb2d3746976032be3075203c88"],
	[DEFAULT_SOUL_FILENAME]: ["4f9042f259b076e429d0f01ce39340030f47ea5b7f5befe306296c36baf1f60f"]
};
async function isGeneratedTemplateContent(fileName, content) {
	if (content === await loadTemplate(fileName)) return true;
	const retired = RETIRED_GENERATED_TEMPLATE_SHA256[fileName];
	return retired !== void 0 && retired.includes(sha256Hex(content));
}
function loadTemplate(name) {
	return getOrCreatePromise(workspaceTemplateCache, name, async () => {
		const templateDirs = await resolveWorkspaceTemplateSearchDirs();
		const triedPaths = [];
		for (const templateDir of templateDirs) {
			const templatePath = path.join(templateDir, name);
			triedPaths.push(templatePath);
			try {
				return stripFrontMatter(await fs.readFile(templatePath, "utf-8"));
			} catch (error) {
				if (error?.code !== "ENOENT") throw error;
			}
		}
		throw new Error(`Missing workspace template: ${name} (${triedPaths.join(", ")}). Ensure workspace templates are packaged.`);
	}, { cacheRejections: false });
}
const VALID_BOOTSTRAP_NAMES = new Set(WORKSPACE_BOOTSTRAP_FILENAMES);
const OPTIONAL_BOOTSTRAP_FILENAMES = new Set(WORKSPACE_ONBOARDING_PROFILE_FILENAMES);
/**
* Bootstrap files whose absence is a normal workspace state rather than a fault:
* the optional profile files, plus MEMORY.md which only appears once memory is
* written. Editors should offer these for creation instead of flagging them.
*/
function isExpectedAbsentBootstrapFile(name) {
	return OPTIONAL_BOOTSTRAP_FILENAMES.has(name) || name === DEFAULT_MEMORY_FILENAME;
}
async function fileContentDiffersFromTemplate(dir, fileName) {
	try {
		return await retryAsync(async () => !await isGeneratedTemplateContent(fileName, await fs.readFile(path.join(dir, fileName), "utf-8")), {
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
		await fs.access(indicator);
		return true;
	} catch {}
	if (await exactWorkspaceEntryExists(dir, DEFAULT_MEMORY_FILENAME)) return true;
	return await hasWorkspaceSkillEvidence(dir);
}
async function hasWorkspaceSkillEvidence(dir) {
	try {
		const skillEntries = await fs.readdir(path.join(dir, "skills"), { withFileTypes: true });
		for (const entry of skillEntries) {
			if (!entry.isDirectory()) continue;
			try {
				await fs.access(path.join(dir, "skills", entry.name, "SKILL.md"));
				return true;
			} catch {}
		}
	} catch {}
	return false;
}
async function hasSkipBootstrapWorkspaceContentEvidence(dir) {
	try {
		const entries = await fs.readdir(dir, { withFileTypes: true });
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
	return (await Promise.all(WORKSPACE_ONBOARDING_PROFILE_FILENAMES.map(async (fileName) => fileContentDiffersFromTemplate(params.dir, fileName)))).some(Boolean) || await hasWorkspaceUserContentEvidence(params.dir, { includeGit: params.includeGitEvidence });
}
async function workspaceRequiredBootstrapLooksCustomized(dir, opts) {
	const generatedHashes = opts?.generatedHashes;
	if (generatedHashes && generatedHashes.size > 0) try {
		const content = await fs.readFile(path.join(dir, DEFAULT_AGENTS_FILENAME), "utf-8");
		return sha256Hex(content) !== generatedHashes.get("AGENTS.md") && !await isGeneratedTemplateContent("AGENTS.md", content);
	} catch {
		return false;
	}
	return fileContentDiffersFromTemplate(dir, DEFAULT_AGENTS_FILENAME);
}
async function workspaceAttestedGeneratedFilesIntact(dir, generatedHashes) {
	if (!generatedHashes.has("AGENTS.md")) return false;
	for (const [fileName, generatedHash] of generatedHashes) {
		if (!GENERATED_WORKSPACE_BOOTSTRAP_FILENAME_SET.has(fileName)) continue;
		try {
			const content = await fs.readFile(path.join(dir, fileName), "utf-8");
			if (sha256Hex(content) !== generatedHash) return false;
		} catch {
			return false;
		}
	}
	return true;
}
async function reconcileWorkspaceBootstrapCompletionState(params) {
	const assertEvidence = captureWorkspaceStateFilesystemGuard(params.dir);
	const beforeFileMutation = createWorkspaceFileMutationGuard(params.guard);
	const bootstrapExists = params.bootstrapExists ?? await pathExists(params.bootstrapPath);
	if (typeof params.state.setupCompletedAt === "string" && params.state.setupCompletedAt.trim().length > 0) return {
		repaired: false,
		bootstrapExists,
		state: params.state
	};
	if (bootstrapExists ? !await workspaceProfileLooksConfigured({ dir: params.dir }) : !params.state.bootstrapSeededAt) return {
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
	params.guard?.assertHost?.();
	const persistedState = await mergeWorkspaceSetupState(params.dir, repairedState, void 0, {
		recoveryHoldPredicate: params.guard?.recoveryHoldPredicate,
		beforeLegacyApply: params.guard?.beforeLegacyApply,
		assertCurrent: () => {
			params.guard?.assertHost?.();
			assertEvidence();
		}
	});
	params.guard?.assertHost?.();
	assertEvidence();
	if (!bootstrapExists) return {
		repaired: true,
		bootstrapExists: false,
		state: persistedState
	};
	beforeFileMutation?.();
	try {
		await fs.rm(params.bootstrapPath, { force: true });
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
		const content = await fs.readFile(path.join(dir, fileName), "utf-8");
		if (await isGeneratedTemplateContent(fileName, content)) hashes.set(fileName, sha256Hex(content));
	} catch {}
	return hashes;
}
async function maybeWriteWorkspaceAttestation(dir, guard) {
	const assertHost = guard?.assertHost;
	const attestedAtMs = Date.now();
	const generatedHashes = await collectGeneratedBootstrapHashes(dir);
	assertHost?.();
	try {
		await replaceWorkspaceAttestation({
			workspaceDir: dir,
			attestedAtMs,
			generatedHashes,
			assertCurrent: assertHost,
			recoveryHoldPredicate: guard?.recoveryHoldPredicate,
			beforeLegacyApply: guard?.beforeLegacyApply
		});
	} catch (error) {
		if (error instanceof DuplicateAgentError) throw error;
	}
	assertHost?.();
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
	const currentState = await readCanonicalWorkspaceStateSnapshot(params.dir, void 0, params.guard);
	if (currentState.setup.bootstrapSeededAt !== params.initialState.setup.bootstrapSeededAt || currentState.setup.setupCompletedAt !== params.initialState.setup.setupCompletedAt) return true;
	const generatedHashes = await collectGeneratedBootstrapHashes(params.dir);
	return GENERATED_WORKSPACE_BOOTSTRAP_FILENAMES.every((fileName) => generatedHashes.has(fileName));
}
async function isWorkspaceSetupCompleted(dir, options = {}) {
	const state = (await readCanonicalWorkspaceStateSnapshot(dir, options)).setup;
	return typeof state.setupCompletedAt === "string" && state.setupCompletedAt.trim().length > 0;
}
async function resolveWorkspaceBootstrapStatus(dir, options = {}) {
	const resolvedDir = resolveUserPath(dir);
	if (await isWorkspaceSetupCompleted(resolvedDir, options)) return "complete";
	const bootstrapPath = path.join(resolvedDir, DEFAULT_BOOTSTRAP_FILENAME);
	return await pathExists(bootstrapPath) ? "pending" : "complete";
}
async function isWorkspaceBootstrapPending(dir) {
	return await resolveWorkspaceBootstrapStatus(dir) === "pending";
}
function captureWorkspacePreparationGuard(guard) {
	return guard && {
		...guard,
		recoveryHoldPredicate: structuredClone(guard.recoveryHoldPredicate)
	};
}
async function ensureAgentWorkspace(params) {
	const rawDir = params?.dir?.trim() ? params.dir.trim() : DEFAULT_AGENT_WORKSPACE_DIR;
	const dir = resolveUserPath(rawDir);
	const captured = {
		...params,
		dir,
		templates: params?.templates && { ...params.templates },
		skipOptionalBootstrapFiles: params?.skipOptionalBootstrapFiles && [...params.skipOptionalBootstrapFiles],
		guard: captureWorkspacePreparationGuard(params?.guard)
	};
	if (getAgentWorkspaceAccess(dir)) return ensureAgentWorkspaceOwned(captured);
	return runWorkspacePreparation(dir, (assertFilesystem) => {
		captured.guard?.assertHost?.();
		return ensureAgentWorkspaceOwned({
			...captured,
			guard: {
				...captured.guard,
				assertHost: () => {
					captured.guard?.assertHost?.();
					assertFilesystem();
				}
			}
		});
	});
}
async function ensureSandboxWorkspace(workspaceDir, seedFrom, skipBootstrap, skipOptionalBootstrapFiles, guard) {
	const dir = resolveUserPath(workspaceDir);
	const seed = seedFrom ? resolveUserPath(seedFrom) : void 0;
	const skipOptional = skipOptionalBootstrapFiles && [...skipOptionalBootstrapFiles];
	const capturedGuard = captureWorkspacePreparationGuard(guard);
	const beforeMutation = createWorkspaceFileMutationGuard(capturedGuard);
	const assertCallerCurrent = beforeMutation ? retainMutationAuthority(beforeMutation) : void 0;
	await runWorkspacePreparation(dir, async (assertFilesystem) => {
		const assertHost = () => {
			capturedGuard?.assertHost?.();
			assertFilesystem();
		};
		const assertCurrent = () => {
			assertCallerCurrent?.();
			assertFilesystem();
		};
		assertHost();
		const { copyWorkspaceBootstrapFiles } = await import("./workspace-bootstrap-copy-Dnqqt6tU.mjs");
		assertHost();
		await copyWorkspaceBootstrapFiles(dir, seed, assertCurrent);
		await ensureAgentWorkspaceOwned({
			dir,
			ensureBootstrapFiles: !skipBootstrap,
			skipOptionalBootstrapFiles: skipOptional,
			guard: {
				...capturedGuard,
				assertHost
			}
		});
		assertCurrent();
	});
}
async function ensureAgentWorkspaceOwned(params) {
	const dir = params.dir;
	const guard = params?.guard;
	const assertHost = guard?.assertHost;
	const beforeFileMutation = createWorkspaceFileMutationGuard(guard);
	let assertExpiryEvidence;
	const clearExpiredState = async () => {
		assertHost?.();
		if (!await clearExpiredWorkspaceStateForVanishedWorkspace(dir, void 0, {
			recoveryHoldPredicate: guard?.recoveryHoldPredicate,
			beforeLegacyApply: guard?.beforeLegacyApply,
			assertCurrent: () => {
				assertHost?.();
				assertExpiryEvidence();
			}
		})) throw new WorkspaceVanishedError({ workspaceDir: dir });
		assertHost?.();
		assertExpiryEvidence();
	};
	const purpose = params?.purpose?.trim();
	if (purpose && (params?.templates || getAgentWorkspaceAccess(dir))) throw new WorkspaceBootstrapSeedConflictError("A custom agent purpose requires a local workspace without a bundled role.");
	if (getAgentWorkspaceAccess(dir)) return {
		dir,
		bootstrapPending: false
	};
	if (params?.provisioning === "runtime-managed-implicit") {
		beforeFileMutation?.();
		await fs.mkdir(dir, { recursive: true });
		assertHost?.();
		return {
			dir,
			bootstrapPending: false
		};
	}
	let initialState = await readCanonicalWorkspaceStateSnapshot(dir, void 0, guard);
	let reseedingExpiredWorkspaceState = false;
	const recentAttestation = recentWorkspaceAttestation(initialState.attestation);
	const recentSetupState = hasRecentWorkspaceSetupState(initialState);
	assertExpiryEvidence = captureWorkspaceStateFilesystemGuard(dir);
	if (!await pathExists(dir)) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		await clearExpiredState();
	}
	beforeFileMutation?.();
	await fs.mkdir(dir, { recursive: true });
	assertHost?.();
	assertExpiryEvidence = captureWorkspaceStateFilesystemGuard(dir);
	const bootstrapPath = path.join(dir, DEFAULT_BOOTSTRAP_FILENAME);
	if (!params?.ensureBootstrapFiles) {
		const hasContentEvidence = await hasSkipBootstrapWorkspaceContentEvidence(dir);
		if (recentAttestation && !hasContentEvidence) throw new WorkspaceVanishedError({ workspaceDir: dir });
		if (hasWorkspaceSetupStateMarker(initialState.setup) && !initialState.attestation && !await workspaceSetupStateHasSurvivalEvidence({
			dir,
			bootstrapPath,
			initialState,
			guard
		})) {
			if (recentSetupState) throw new WorkspaceVanishedError({ workspaceDir: dir });
			await clearExpiredState();
		}
		if (purpose) await publishAgentInstructions(path.join(dir, DEFAULT_AGENTS_FILENAME), await loadTemplate(DEFAULT_AGENTS_FILENAME), purpose, beforeFileMutation);
		if (hasContentEvidence || purpose) await maybeWriteWorkspaceAttestation(dir, guard);
		return {
			dir,
			bootstrapPending: false
		};
	}
	const agentsPath = path.join(dir, DEFAULT_AGENTS_FILENAME);
	const soulPath = path.join(dir, DEFAULT_SOUL_FILENAME);
	const identityPath = path.join(dir, DEFAULT_IDENTITY_FILENAME);
	const userPath = path.join(dir, DEFAULT_USER_FILENAME);
	const isBrandNewWorkspace = (await Promise.all([
		agentsPath,
		soulPath,
		identityPath,
		userPath,
		path.join(dir, "memory")
	].map((filePath) => fs.access(filePath).then(() => true, () => false)))).every((exists) => !exists) && !await hasWorkspaceUserContentEvidence(dir);
	if (isBrandNewWorkspace) {
		if (recentAttestation) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = initialState.setupExists || Boolean(initialState.attestation);
		await clearExpiredState();
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
			await clearExpiredState();
		}
	} else if (hasWorkspaceSetupStateMarker(initialState.setup) && !isBrandNewWorkspace && !await workspaceSetupStateHasSurvivalEvidence({
		dir,
		bootstrapPath,
		initialState,
		guard
	})) {
		if (recentSetupState) throw new WorkspaceVanishedError({ workspaceDir: dir });
		reseedingExpiredWorkspaceState = true;
		await clearExpiredState();
	}
	const defaultAgentsTemplate = params?.templates?.["AGENTS.md"] ?? await loadTemplate("AGENTS.md");
	const soulTemplate = params?.templates?.["SOUL.md"] ?? await loadTemplate("SOUL.md");
	const identityTemplate = params?.templates?.["IDENTITY.md"] ?? await loadTemplate("IDENTITY.md");
	const userTemplate = await loadTemplate(DEFAULT_USER_FILENAME);
	initialState = await readCanonicalWorkspaceStateSnapshot(dir, void 0, guard);
	const skipOptionalBootstrapFiles = new Set(params?.skipOptionalBootstrapFiles ?? []);
	if (initialState.setup.setupCompletedAt) for (const filename of OPTIONAL_BOOTSTRAP_FILENAMES) skipOptionalBootstrapFiles.add(filename);
	await publishAgentInstructions(agentsPath, defaultAgentsTemplate, purpose, beforeFileMutation);
	if (!skipOptionalBootstrapFiles.has("SOUL.md")) await publishBootstrapFile(soulPath, soulTemplate, beforeFileMutation);
	const identityPathCreated = !skipOptionalBootstrapFiles.has("IDENTITY.md") ? await publishBootstrapFile(identityPath, identityTemplate, beforeFileMutation) : false;
	if (!skipOptionalBootstrapFiles.has("USER.md")) await publishBootstrapFile(userPath, userTemplate, beforeFileMutation);
	let state = (await readCanonicalWorkspaceStateSnapshot(dir, void 0, guard)).setup;
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
			guard
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
			const bootstrapTemplate = await loadTemplate(DEFAULT_BOOTSTRAP_FILENAME);
			bootstrapExists = await publishBootstrapFile(bootstrapPath, bootstrapTemplate, beforeFileMutation) || await pathExists(bootstrapPath);
			if (bootstrapExists && !state.bootstrapSeededAt) markState({ bootstrapSeededAt: nowIso() });
		}
	}
	if (stateDirty) {
		assertHost?.();
		state = await mergeWorkspaceSetupState(dir, state, void 0, {
			assertCurrent: assertHost,
			recoveryHoldPredicate: guard?.recoveryHoldPredicate,
			beforeLegacyApply: guard?.beforeLegacyApply
		});
	}
	if (isDevMode() && state.setupCompletedAt) await publishBootstrapFile(path.join(dir, DEFAULT_MEMORY_FILENAME), "# Memory\n", beforeFileMutation);
	await ensureGitRepo(dir, isBrandNewWorkspace, beforeFileMutation);
	await maybeWriteWorkspaceAttestation(dir, guard);
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
function filterRootMemoryBootstrapFiles(files, workspaceRoot) {
	if (!workspaceRoot) return files.filter((file) => file.name !== DEFAULT_MEMORY_FILENAME);
	const resolvedWorkspaceRoot = resolveUserPath(workspaceRoot);
	const rootMemoryPath = path.join(resolvedWorkspaceRoot, DEFAULT_MEMORY_FILENAME);
	return files.filter((file) => {
		if (typeof file.path !== "string") return true;
		const filePath = file.path.trim();
		if (!filePath) return true;
		return resolveWorkspaceBootstrapPath(resolvedWorkspaceRoot, filePath) !== rootMemoryPath;
	});
}
function filterBootstrapFilesForSession(files, session) {
	const { sessionKey, chatType, workspaceDir } = typeof session === "string" ? { sessionKey: session } : session ?? {};
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
			} else entries = (await fs.readdir(currentDir, { withFileTypes: true })).map((entry) => ({
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
	if (!getAgentWorkspaceAccess(workspaceDir) && typeof fs.glob === "function") try {
		const matches = [];
		for await (const match of fs.glob(pattern, { cwd: workspaceDir })) matches.push(match);
		return matches;
	} catch {}
	if (typeof path.matchesGlob !== "function") return [pattern];
	const normalizedPattern = normalizeWorkspacePatternPath(pattern);
	const matcher = createBootstrapPatternMatcher(normalizedPattern);
	const matches = [];
	for await (const candidate of walkWorkspaceFiles(workspaceDir, resolveGlobWalkRoot(normalizedPattern), matcher)) matches.push(candidate);
	return matches.length > 0 ? matches : [pattern];
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
		if (!isPathInside(resolvedDir, path.resolve(resolvedDir, resolveGlobWalkRoot(pattern)))) {
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
export { isWorkspaceBootstrapPending as a, loadWorkspaceBootstrapFiles as c, runWorkspacePreparation as d, createWorkspaceFileMutationGuard as f, isExpectedAbsentBootstrapFile as i, resolveWorkspaceBootstrapStatus as l, ensureSandboxWorkspace as n, isWorkspaceSetupCompleted as o, filterBootstrapFilesForSession as r, loadExtraBootstrapFilesWithDiagnostics as s, ensureAgentWorkspace as t, seedWorkspaceBootstrap as u };
