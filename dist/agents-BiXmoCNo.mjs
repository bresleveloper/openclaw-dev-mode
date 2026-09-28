import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-GA8mwdTG.mjs";
import { M as tryResolveSoleAgentId, O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { a as unregisterResolvedAgentDir, i as resolveRegisteredAgentIdForDir, n as normalizeAgentDirRegistryPath, r as registerResolvedAgentDir } from "./agent-dir-registry-QuKJka9m.mjs";
import "./errors-DnjwnOju.mjs";
import { f as resolveSessionTranscriptsDirForAgent } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-B_ICKCYw.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-CZWcIUDk.mjs";
import { s as withConfigMutationExclusive } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { a as validateAgentsDeleteParams, c as validateAgentsFilesSetParams, i as validateAgentsCreateParams, l as validateAgentsListParams, o as validateAgentsFilesGetParams, s as validateAgentsFilesListParams, u as validateAgentsUpdateParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-Bm8Ih2d_.mjs";
import { o as readAgentDeletionJournal } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { a as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { h as resolveAuthProfileDatabasePath } from "./sqlite-BIg_k8qE.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-BNUXOhfF.mjs";
import { l as WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME, r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-DSEIbIS8.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-BRjL0YJr.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DTZ2RTNw.mjs";
import { a as isWorkspaceSetupCompleted, r as isExpectedAbsentBootstrapFile, t as ensureAgentWorkspace } from "./workspace-mlzi3k1x.mjs";
import { d as removeLegacyWorkspaceStateForReset, u as prepareLegacyWorkspaceStateReset } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import { i as claimCompletedAgentDeletion, n as AgentDeletionCommitUncertainError, s as withAgentDeletion, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { _ as withAgentExecApprovalsRemoved } from "./exec-approvals-store-CTT-ox-I.mjs";
import "./exec-approvals-BgZlQ2Qp.mjs";
import "./sessions-Cesa3L0p.mjs";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-DLPk-QoV.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { n as createAgentIdentityConfig, o as normalizeIdentityForFile, s as sanitizeAgentIdentityLine, t as buildIdentityMarkdownForWrite } from "./identity-file-By55_88F.mjs";
import { n as listAgentsForGateway } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as applyAgentConfig } from "./agents.config-BnlRDoFW.mjs";
import { l as trashAllowedRoots } from "./cleanup-utils-MkYk5me2.mjs";
import { n as createAgent } from "./agent-create-DpqSNedE.mjs";
import { r as enqueueWorkspaceFileUpdate } from "./workspace-fs-DfgXp1be.mjs";
import { t as movePathToTrash } from "./browser-trash-BMT-0B2d.mjs";
import "./browser-maintenance-Cok_a5w5.mjs";
import { n as readPreparedServerMethodModelCatalogs, t as readPreparedServerMethodModelCatalog } from "./optional-model-catalog-B-pbmxbf.mjs";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner } from "./agent-delete-safety-Ci4iwiZS.mjs";
import { a as readAgentDeleteDatabaseRegistry, i as prepareAgentDeleteDatabases, n as assertAgentSessionStoreDeletionSafe, o as resolveSurvivingDatabaseFilePaths, r as isPathOwnedBySurvivingAgent, t as AgentSharedStoreOwnerError } from "./agent-delete-databases-CY5IIYgH.mjs";
import { a as isImplicitAgentModelUpdate, i as isConfiguredAgent, n as AgentModelSelectionError, o as updateAgentConfigEntry, r as deleteAgentConfigEntry, s as validateAgentModelSelectionUpdate, t as AgentConfigPreconditionError } from "./agents-config-mutations-Bdz8UoCT.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/agents-files.ts
const CORE_FILE_NAMES = WORKSPACE_BOOTSTRAP_FILENAMES.filter((name) => name !== DEFAULT_IDENTITY_FILENAME);
const CORE_FILE_NAMES_POST_ONBOARDING = CORE_FILE_NAMES.filter((name) => name !== DEFAULT_BOOTSTRAP_FILENAME);
const ALLOWED_FILE_NAMES = new Set(WORKSPACE_BOOTSTRAP_FILENAMES);
function resolveAgentIdOrError(agentIdRaw, cfg) {
	const normalized = normalizeAgentIdStrict(agentIdRaw);
	if (!normalized.ok) return null;
	const agentId = normalized.value;
	if (!new Set(listAgentIds(cfg)).has(agentId)) return null;
	return agentId;
}
function respondAgentNotFound$1(respond, agentId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" not found`));
}
function resolveAgentWorkspaceFileOrRespondError(params, respond, cfg) {
	const rawAgentId = params.agentId;
	const agentId = resolveAgentIdOrError(typeof rawAgentId === "string" || typeof rawAgentId === "number" ? String(rawAgentId) : "", cfg);
	if (!agentId) {
		respondAgentNotFound$1(respond, String(rawAgentId));
		return null;
	}
	const rawName = params.name;
	const name = (typeof rawName === "string" || typeof rawName === "number" ? String(rawName) : "").trim();
	if (!ALLOWED_FILE_NAMES.has(name)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported file "${name}"`));
		return null;
	}
	return {
		agentId,
		workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
		name
	};
}
function isRegularWorkspaceFileStat(stat) {
	const isFile = typeof stat.isFile === "function" ? stat.isFile() : stat.isFile;
	const isSymbolicLink = typeof stat.isSymbolicLink === "function" ? stat.isSymbolicLink() : stat.isSymbolicLink;
	return isFile && !isSymbolicLink && stat.nlink <= 1;
}
function toWorkspaceFileMeta(stat) {
	if (!isRegularWorkspaceFileStat(stat)) return null;
	return {
		size: stat.size,
		updatedAtMs: Math.floor(stat.mtimeMs)
	};
}
async function statWorkspaceFileSafely(workspaceRoot, workspaceDir, name) {
	try {
		return toWorkspaceFileMeta(workspaceRoot ? await workspaceRoot.stat(name) : await fs.lstat(path.join(workspaceDir, name)));
	} catch {
		if (!workspaceRoot) return null;
		try {
			return toWorkspaceFileMeta(await fs.lstat(path.join(workspaceDir, name)));
		} catch {
			return null;
		}
	}
}
async function openWorkspaceRootSafely(workspaceDir) {
	try {
		return await root(workspaceDir);
	} catch {
		return null;
	}
}
async function listAgentFiles(workspaceDir, options) {
	const access = getAgentWorkspaceAccess(workspaceDir);
	if (access) {
		const names = options?.hideBootstrap ? CORE_FILE_NAMES_POST_ONBOARDING : CORE_FILE_NAMES;
		return await Promise.all(names.map(async (name) => {
			const stat = await access.bridge.stat({ filePath: name });
			if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while listing Agent documents");
			const file = stat?.type === "file" ? stat : void 0;
			return {
				name,
				path: path.join(workspaceDir, name),
				missing: file === void 0,
				expectedAbsent: file === void 0 ? isExpectedAbsentBootstrapFile(name) : void 0,
				size: file?.size,
				updatedAtMs: file === void 0 ? void 0 : Math.floor(file.mtimeMs)
			};
		}));
	}
	const files = [];
	const workspaceRoot = await openWorkspaceRootSafely(workspaceDir);
	if (!workspaceRoot) return (options?.hideBootstrap ? CORE_FILE_NAMES_POST_ONBOARDING : CORE_FILE_NAMES).map((name) => ({
		name,
		path: path.join(workspaceDir, name),
		missing: true,
		expectedAbsent: isExpectedAbsentBootstrapFile(name)
	}));
	const coreFileNames = options?.hideBootstrap ? CORE_FILE_NAMES_POST_ONBOARDING : CORE_FILE_NAMES;
	for (const name of coreFileNames) {
		const filePath = path.join(workspaceDir, name);
		const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
		if (meta) files.push({
			name,
			path: filePath,
			missing: false,
			size: meta.size,
			updatedAtMs: meta.updatedAtMs
		});
		else files.push({
			name,
			path: filePath,
			missing: true,
			expectedAbsent: isExpectedAbsentBootstrapFile(name)
		});
	}
	return files;
}
function hashWorkspaceFileContent(content) {
	return createHash("sha256").update(content).digest("hex");
}
function respondWorkspaceFileUnsafe$1(respond, name) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsafe workspace file "${name}"`));
}
function respondWorkspaceFileMissing(params) {
	params.respond(true, {
		agentId: params.agentId,
		workspace: params.workspaceDir,
		file: {
			name: params.name,
			path: params.filePath,
			missing: true,
			expectedAbsent: isExpectedAbsentBootstrapFile(params.name)
		}
	}, void 0);
}
async function readWorkspaceFileHash(workspaceRoot, name) {
	try {
		return hashWorkspaceFileContent((await workspaceRoot.read(name, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer);
	} catch (err) {
		if (isMissingPathError(err)) return;
		throw err;
	}
}
function respondWorkspaceFileConflict(respond, name, currentHash) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent file "${name}" changed since it was read`, { details: {
		type: "agent_file_conflict",
		name,
		...currentHash ? { currentHash } : {}
	} }));
}
const agentFileHandlers = {
	"agents.files.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesListParams, "agents.files.list", respond)) return;
		const cfg = context.getRuntimeConfig();
		const agentId = resolveAgentIdOrError(params.agentId, cfg);
		if (!agentId) {
			respondAgentNotFound$1(respond, params.agentId);
			return;
		}
		const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
		let hideBootstrap = false;
		try {
			hideBootstrap = await isWorkspaceSetupCompleted(workspaceDir);
		} catch {}
		respond(true, {
			agentId,
			workspace: workspaceDir,
			files: await listAgentFiles(workspaceDir, { hideBootstrap })
		}, void 0);
	},
	"agents.files.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesGetParams, "agents.files.get", respond)) return;
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		const filePath = path.join(workspaceDir, name);
		const access = getAgentWorkspaceAccess(workspaceDir);
		if (access) {
			const stat = await access.bridge.stat({ filePath: name });
			if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while reading an Agent document");
			if (!stat) {
				respondWorkspaceFileMissing({
					respond,
					agentId,
					workspaceDir,
					name,
					filePath
				});
				return;
			}
			const data = await access.bridge.readFile({
				filePath: name,
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			if (getAgentWorkspaceAccess(workspaceDir) !== access || data.length > 2097152) throw new Error("Workspace document read is no longer valid");
			respond(true, {
				agentId,
				workspace: workspaceDir,
				file: {
					name,
					path: filePath,
					missing: false,
					size: data.length,
					updatedAtMs: Math.floor(stat.mtimeMs),
					hash: hashWorkspaceFileContent(data),
					content: new TextDecoder("utf-8", {
						fatal: true,
						ignoreBOM: true
					}).decode(data)
				}
			}, void 0);
			return;
		}
		let safeRead;
		try {
			safeRead = await (await root(workspaceDir)).read(name, {
				hardlinks: "reject",
				nonBlockingRead: true
			});
		} catch (err) {
			if (isMissingPathError(err)) {
				respondWorkspaceFileMissing({
					respond,
					agentId,
					workspaceDir,
					name,
					filePath
				});
				return;
			}
			if (err instanceof FsSafeError) {
				respondWorkspaceFileUnsafe$1(respond, name);
				return;
			}
			throw err;
		}
		respond(true, {
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				size: safeRead.stat.size,
				updatedAtMs: Math.floor(safeRead.stat.mtimeMs),
				hash: hashWorkspaceFileContent(safeRead.buffer),
				content: safeRead.buffer.toString("utf-8")
			}
		}, void 0);
	},
	"agents.files.set": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesSetParams, "agents.files.set", respond)) return;
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		const access = getAgentWorkspaceAccess(workspaceDir);
		if (access) {
			if (Buffer.byteLength(params.content) > 2097152) throw new Error("Workspace document exceeds its write bound");
			const assertCurrent = () => {
				if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while saving an Agent document");
			};
			const conflict = await enqueueWorkspaceFileUpdate(async () => {
				assertCurrent();
				const expectedHash = params.expectedHash?.toLowerCase();
				if (expectedHash) {
					const stat = await access.bridge.stat({ filePath: name });
					assertCurrent();
					let currentHash;
					if (stat) {
						const data = await access.bridge.readFile({
							filePath: name,
							maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
						});
						assertCurrent();
						if (data.length > 2097152) throw new Error("Workspace document exceeds its read bound");
						currentHash = hashWorkspaceFileContent(data);
					}
					if (currentHash !== expectedHash) return { currentHash };
				}
				await access.bridge.writeFile({
					filePath: name,
					data: params.content,
					mkdir: true
				});
				assertCurrent();
			});
			if (conflict) {
				respondWorkspaceFileConflict(respond, name, conflict.currentHash);
				return;
			}
			respond(true, {
				ok: true,
				agentId,
				workspace: workspaceDir,
				file: {
					name,
					path: path.join(workspaceDir, name),
					missing: false,
					size: Buffer.byteLength(params.content),
					hash: hashWorkspaceFileContent(params.content),
					content: params.content
				}
			}, void 0);
			return;
		}
		await fs.mkdir(workspaceDir, { recursive: true });
		const filePath = path.join(workspaceDir, name);
		const content = params.content;
		let workspaceRoot;
		let conflict;
		try {
			workspaceRoot = await root(workspaceDir);
			const writeRoot = workspaceRoot;
			const expectedHash = params.expectedHash?.toLowerCase();
			conflict = await enqueueWorkspaceFileUpdate(async () => {
				if (expectedHash) {
					const currentHash = await readWorkspaceFileHash(writeRoot, name);
					if (currentHash !== expectedHash) return { currentHash };
				}
				await writeRoot.write(name, content, { encoding: "utf8" });
			});
		} catch (err) {
			if (!(err instanceof FsSafeError)) throw err;
			respondWorkspaceFileUnsafe$1(respond, name);
			return;
		}
		if (conflict) {
			respondWorkspaceFileConflict(respond, name, conflict.currentHash);
			return;
		}
		const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
		respond(true, {
			ok: true,
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				size: meta?.size,
				updatedAtMs: meta?.updatedAtMs,
				hash: hashWorkspaceFileContent(content),
				content
			}
		}, void 0);
	}
};
//#endregion
//#region src/gateway/server-methods/agents-list.ts
const agentListHandler = async ({ params, respond, context, client }) => {
	if (!assertValidParams(params, validateAgentsListParams, "agents.list", respond)) return;
	const cfg = context.getRuntimeConfig();
	const agentIds = listAgentIds(cfg);
	const modelCatalogByAgentId = context.readPreparedGatewayModelCatalogBatch ? await readPreparedServerMethodModelCatalogs(context, agentIds) : new Map(await Promise.all(agentIds.map(async (agentId) => [agentId, await readPreparedServerMethodModelCatalog(context, { agentId })])));
	respond(true, await listAgentsForGateway(cfg, void 0, {
		modelCatalogByAgentId,
		includeSystem: hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.AGENT_KIND),
		httpAvatarBasePath: client?.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI ? cfg.gateway?.controlUi?.basePath ?? "" : void 0
	}), void 0);
};
//#endregion
//#region src/gateway/server-methods/agents.ts
function respondAgentNotFound(respond, agentId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" not found`));
}
var AgentCleanupIdentityMismatchError = class extends Error {};
var AgentSharedAuthStoreOwnerError = class extends Error {};
function agentOwnsSharedAuthStore(cfg, agentId) {
	const agentDir = resolveAgentDir(cfg, agentId);
	return isSharedAuthStoreOwner({
		ownership: resolveSharedAuthStoreOwnership(),
		agentAuthDbPath: resolveAuthProfileDatabasePath(agentDir),
		sharedAuthDbPath: resolveSharedAuthStorePath()
	});
}
function cleanupFailure(pathname, error) {
	return { failed: {
		path: pathname,
		reason: (error instanceof Error && error.message ? error.message : String(error)) || "unknown error"
	} };
}
function cleanupPathIdentity(stat) {
	if (typeof stat?.dev !== "number" && typeof stat?.dev !== "bigint" || typeof stat.ino !== "number" && typeof stat.ino !== "bigint") return null;
	const dev = Number(stat.dev);
	const ino = Number(stat.ino);
	if (!Number.isSafeInteger(dev) || !Number.isSafeInteger(ino)) throw new Error("cleanup path identity exceeds the safe integer range");
	return {
		dev,
		ino
	};
}
async function statAgentCleanupPath(cleanupPath) {
	const parentPath = cleanupPath.parentPath;
	const parentRoot = await root(parentPath, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	if (path.resolve(parentRoot.rootReal) !== parentPath) throw new FsSafeError("path-mismatch", "cleanup path parent changed before deletion");
	const stat = await parentRoot.stat(path.basename(cleanupPath.trashPath));
	if (stat.isSymbolicLink !== (cleanupPath.kind === "symlink")) throw new AgentCleanupIdentityMismatchError(`cleanup path changed from ${cleanupPath.kind} before deletion`);
	if (stat.isFile && stat.nlink > 1) throw new AgentCleanupIdentityMismatchError("hardlinked cleanup replacement preserved");
	const identity = cleanupPathIdentity(stat);
	if (cleanupPath.preparedIdentity === null) cleanupPath.preparedIdentity = identity;
	else if (identity === null || identity.dev !== cleanupPath.preparedIdentity.dev || identity.ino !== cleanupPath.preparedIdentity.ino) throw new AgentCleanupIdentityMismatchError("cleanup path identity changed before deletion");
}
async function removeAgentPath(cleanupPath, assertCurrent) {
	const pathname = cleanupPath.path;
	const trashPath = cleanupPath.trashPath;
	try {
		await statAgentCleanupPath(cleanupPath);
	} catch (error) {
		if (error instanceof AgentCleanupIdentityMismatchError) return { skipped: {
			path: pathname,
			reason: error.message
		} };
		return isMissingPathError(error) ? { removed: {
			path: pathname,
			method: "missing"
		} } : cleanupFailure(pathname, error);
	}
	try {
		assertCurrent();
		await movePathToTrash(trashPath, { allowedRoots: [
			...trashAllowedRoots(cleanupPath.sourcePaths, cleanupPath.kind === "symlink" ? cleanupPath.canonicalPath : void 0),
			os.homedir(),
			os.tmpdir()
		] });
		return { removed: {
			path: pathname,
			method: "trash"
		} };
	} catch (error) {
		if (!isMissingPathError(error)) return cleanupFailure(pathname, error);
		try {
			await statAgentCleanupPath(cleanupPath);
			return cleanupFailure(pathname, error);
		} catch (statError) {
			return isMissingPathError(statError) ? { removed: {
				path: pathname,
				method: "missing"
			} } : cleanupFailure(pathname, statError);
		}
	}
}
async function resolveAgentDeleteCleanupTarget(pathname) {
	let candidate = path.resolve(pathname);
	const missingSuffix = [];
	while (true) try {
		return path.resolve(await fs.realpath(candidate), ...missingSuffix);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		let candidateStat;
		try {
			candidateStat = await fs.lstat(candidate);
		} catch (statError) {
			if (!isMissingPathError(statError)) throw statError;
		}
		if (candidateStat?.isSymbolicLink()) {
			const linkTarget = await fs.readlink(candidate);
			const resolvedLinkTarget = await resolveAgentDeleteCleanupTarget(path.isAbsolute(linkTarget) ? linkTarget : path.resolve(path.dirname(candidate), linkTarget));
			return path.resolve(resolvedLinkTarget, ...missingSuffix);
		}
		const parent = path.dirname(candidate);
		if (parent === candidate) throw error;
		missingSuffix.unshift(path.basename(candidate));
		candidate = parent;
	}
}
async function prepareAgentDeleteCleanupPaths(paths, persistedPaths = []) {
	const uniquePaths = /* @__PURE__ */ new Map();
	const addPath = (candidate) => {
		const existing = uniquePaths.get(candidate.trashPath);
		if (!existing) {
			uniquePaths.set(candidate.trashPath, candidate);
			return;
		}
		existing.sourcePaths = [.../* @__PURE__ */ new Set([...existing.sourcePaths, ...candidate.sourcePaths])];
		existing.done ||= candidate.done;
		existing.note ??= candidate.note;
		existing.preparationError ??= candidate.preparationError;
		if (candidate.kind === "target") {
			existing.kind = "target";
			existing.canonicalPath = candidate.canonicalPath;
			existing.parentPath = candidate.parentPath;
			existing.trashCoversDescendants ||= candidate.trashCoversDescendants;
		}
	};
	if (persistedPaths.length > 0) for (const persistedPath of persistedPaths) {
		const journalPath = path.resolve(persistedPath.path);
		const trashPath = path.resolve(persistedPath.canonicalPath);
		addPath({
			path: journalPath,
			parentPath: path.resolve(persistedPath.parentPath),
			canonicalPath: normalizeAgentDirRegistryPath(trashPath),
			trashPath,
			trashCoversDescendants: persistedPath.coversDescendants,
			kind: persistedPath.kind,
			preparedIdentity: persistedPath.dev === null || persistedPath.ino === null ? null : {
				dev: persistedPath.dev,
				ino: persistedPath.ino
			},
			done: persistedPath.done,
			note: persistedPath.note,
			sourcePaths: persistedPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))
		});
	}
	for (const pathname of paths) {
		const sourcePath = path.resolve(pathname);
		let sourceParentPath = path.dirname(sourcePath);
		let resolvedPath = sourcePath;
		let preparationError;
		try {
			resolvedPath = await resolveAgentDeleteCleanupTarget(pathname);
			sourceParentPath = await resolveAgentDeleteCleanupTarget(path.dirname(sourcePath));
		} catch (error) {
			preparationError = error;
		}
		let sourceStat;
		try {
			sourceStat = await fs.lstat(pathname);
		} catch (error) {
			if (!isMissingPathError(error)) preparationError ??= error;
		}
		let targetStat = sourceStat;
		if (resolvedPath !== sourcePath) try {
			targetStat = await fs.lstat(resolvedPath);
		} catch (error) {
			if (!isMissingPathError(error)) preparationError ??= error;
			targetStat = void 0;
		}
		const canonicalPath = normalizeAgentDirRegistryPath(resolvedPath);
		let trashCoversDescendants = false;
		if (targetStat) trashCoversDescendants = !targetStat.isSymbolicLink();
		addPath({
			path: resolvedPath,
			parentPath: path.dirname(resolvedPath),
			canonicalPath,
			trashPath: resolvedPath,
			trashCoversDescendants,
			kind: "target",
			preparedIdentity: cleanupPathIdentity(targetStat),
			done: false,
			preparationError,
			sourcePaths: [sourcePath]
		});
		if (sourceStat?.isSymbolicLink() && sourcePath !== resolvedPath) addPath({
			path: sourcePath,
			parentPath: sourceParentPath,
			canonicalPath,
			trashPath: path.join(sourceParentPath, path.basename(sourcePath)),
			trashCoversDescendants: false,
			kind: "symlink",
			preparedIdentity: cleanupPathIdentity(sourceStat),
			done: false,
			sourcePaths: [sourcePath]
		});
	}
	const depth = (pathname) => path.relative(path.parse(pathname).root, pathname).split(path.sep).filter(Boolean).length;
	const cleanupDepth = (cleanupPath) => Math.max(depth(cleanupPath.canonicalPath), depth(cleanupPath.trashPath), ...cleanupPath.sourcePaths.map(depth));
	const compareFallback = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target" ? -1 : 1;
		const depthDifference = cleanupDepth(right) - cleanupDepth(left);
		if (depthDifference !== 0) return depthDifference;
		return depth(right.trashPath) - depth(left.trashPath) || left.trashPath.localeCompare(right.trashPath);
	};
	const mustPrecede = (left, right) => {
		if (left.kind !== right.kind) return left.kind === "target";
		if (isPathInside(right.trashPath, left.trashPath)) return true;
		if (isPathInside(left.trashPath, right.trashPath)) return false;
		const rightRoots = [right.trashPath, ...right.sourcePaths];
		return left.sourcePaths.some((leftSource) => rightRoots.some((rightRoot) => isPathInside(rightRoot, leftSource)));
	};
	const remaining = [...uniquePaths.values()].toSorted(compareFallback);
	const ordered = [];
	while (remaining.length > 0) {
		const nextIndex = remaining.findIndex((candidate, candidateIndex) => remaining.every((other, otherIndex) => otherIndex === candidateIndex || !mustPrecede(other, candidate)));
		ordered.push(...remaining.splice(Math.max(0, nextIndex), 1));
	}
	return ordered;
}
function cleanupPathCovers(cleanupPath, targetPath, canonicalTargetPath) {
	const trashTargetPath = path.resolve(targetPath);
	return cleanupPath.sourcePaths.includes(trashTargetPath) || cleanupPath.trashPath === trashTargetPath || cleanupPath.trashCoversDescendants && (cleanupPath.kind === "target" || isPathInside(cleanupPath.trashPath, trashTargetPath)) && isPathInside(cleanupPath.canonicalPath, canonicalTargetPath);
}
function unregisterAgentDeleteDatabases(agentId, databasePaths) {
	for (const databasePath of databasePaths) unregisterOpenClawAgentDatabase({
		agentId,
		path: databasePath
	});
}
function prepareJournaledAgentDirOwnership(cfg, agentId, agentDir) {
	for (const configuredAgentId of listAgentIds(cfg)) resolveAgentDir(cfg, configuredAgentId);
	if (resolveRegisteredAgentIdForDir(agentDir) !== void 0) return;
	registerResolvedAgentDir({
		agentId,
		agentDir
	});
}
function respondWorkspaceFileUnsafe(respond, name) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsafe workspace file "${name}"`));
}
async function writeWorkspaceFileOrRespond(params) {
	const access = getAgentWorkspaceAccess(params.workspaceDir);
	if (access) {
		if (Buffer.byteLength(params.content) > 2097152) throw new Error("Workspace document exceeds its write bound");
		await access.bridge.writeFile({
			filePath: params.name,
			data: params.content,
			mkdir: false
		});
		if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed while saving Agent identity");
		return true;
	}
	await fs.mkdir(params.workspaceDir, { recursive: true });
	try {
		await (await root(params.workspaceDir)).write(params.name, params.content, { encoding: "utf8" });
	} catch (err) {
		if (err instanceof FsSafeError) {
			respondWorkspaceFileUnsafe(params.respond, params.name);
			return false;
		}
		throw err;
	}
	return true;
}
async function readWorkspaceFileContent(workspaceDir, name) {
	try {
		const access = getAgentWorkspaceAccess(workspaceDir);
		if (access) {
			const data = await access.bridge.readFile({
				filePath: name,
				maxBytes: MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES
			});
			if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while reading Agent identity");
			if (data.length > 2097152) throw new Error("Workspace document exceeds its read bound");
			return new TextDecoder("utf-8", {
				fatal: true,
				ignoreBOM: true
			}).decode(data);
		}
		return (await (await root(workspaceDir)).read(name, {
			hardlinks: "reject",
			nonBlockingRead: true
		})).buffer.toString("utf-8");
	} catch (err) {
		if (isMissingPathError(err)) return;
		throw err;
	}
}
async function buildIdentityMarkdownOrRespondUnsafe(params) {
	try {
		return await buildIdentityMarkdownForWrite({
			...params,
			readWorkspaceFileContent
		});
	} catch (err) {
		if (err instanceof FsSafeError) {
			respondWorkspaceFileUnsafe(params.respond, DEFAULT_IDENTITY_FILENAME);
			return null;
		}
		throw err;
	}
}
const agentsHandlers = {
	"agents.list": agentListHandler,
	"agents.create": async ({ params, respond }) => {
		if (!assertValidParams(params, validateAgentsCreateParams, "agents.create", respond)) return;
		const result = await createAgent({
			name: params.name,
			workspace: params.workspace,
			model: params.model,
			emoji: params.emoji,
			avatar: params.avatar
		});
		if (result.status === "error") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.message));
			return;
		}
		respond(true, {
			ok: true,
			agentId: result.agentId,
			name: result.name,
			workspace: result.workspace,
			...result.model ? { model: result.model } : {}
		}, void 0);
	},
	"agents.update": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsUpdateParams, "agents.update", respond)) return;
		const cfg = context.getRuntimeConfig();
		const normalized = normalizeAgentIdStrict(params.agentId);
		if (!normalized.ok) {
			respondAgentNotFound(respond, params.agentId);
			return;
		}
		const agentId = normalized.value;
		const workspaceDir = typeof params.workspace === "string" && params.workspace.trim() ? resolveUserPath(params.workspace.trim()) : void 0;
		const model = params.model === null ? null : normalizeOptionalString(params.model);
		const safeName = typeof params.name === "string" && params.name.trim() ? sanitizeAgentIdentityLine(params.name.trim()) : void 0;
		const identity = createAgentIdentityConfig({
			name: safeName,
			emoji: params.emoji,
			avatar: params.avatar
		});
		const hasIdentityFields = Boolean(identity);
		const agentConfigUpdate = {
			agentId,
			...safeName ? { name: safeName } : {},
			...workspaceDir ? { workspace: workspaceDir } : {},
			...model !== void 0 ? { model } : {},
			...params.agentRuntime ? { agentRuntime: params.agentRuntime } : {},
			...identity ? { identity } : {}
		};
		const selectionError = validateAgentModelSelectionUpdate(params);
		if (selectionError) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selectionError));
			return;
		}
		const configured = isConfiguredAgent(cfg, agentId);
		if (!configured && !isImplicitAgentModelUpdate(cfg, agentConfigUpdate)) {
			respondAgentNotFound(respond, agentId);
			return;
		}
		const nextConfig = configured ? applyAgentConfig(cfg, agentConfigUpdate) : cfg;
		let ensuredWorkspace;
		if (workspaceDir) {
			const skipBootstrap = Boolean(nextConfig.agents?.defaults?.skipBootstrap);
			ensuredWorkspace = await ensureAgentWorkspace({
				dir: workspaceDir,
				ensureBootstrapFiles: !skipBootstrap,
				skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
			});
		}
		const persistedIdentity = normalizeIdentityForFile(resolveAgentIdentity(nextConfig, agentId));
		if (persistedIdentity && (workspaceDir || hasIdentityFields)) {
			const identityWorkspaceDir = resolveAgentWorkspaceDir(nextConfig, agentId);
			const previousWorkspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
			const fallbackWorkspaceDir = workspaceDir && identityWorkspaceDir !== previousWorkspaceDir ? previousWorkspaceDir : void 0;
			const workspaceAccess = [identityWorkspaceDir, ...fallbackWorkspaceDir ? [fallbackWorkspaceDir] : []].map((dir) => [dir, getAgentWorkspaceAccess(dir)]);
			const assertWorkspaceAccessCurrent = () => {
				for (const [dir, access] of workspaceAccess) if (getAgentWorkspaceAccess(dir) !== access) throw new Error("Workspace access changed while updating Agent identity");
			};
			const identityContent = await buildIdentityMarkdownOrRespondUnsafe({
				respond,
				workspaceDir: identityWorkspaceDir,
				identity: persistedIdentity,
				fallbackWorkspaceDir,
				preferFallbackWorkspaceContent: Boolean(fallbackWorkspaceDir) && ensuredWorkspace?.identityPathCreated === true
			});
			if (identityContent === null) return;
			assertWorkspaceAccessCurrent();
			if (!await writeWorkspaceFileOrRespond({
				respond,
				workspaceDir: identityWorkspaceDir,
				name: "IDENTITY.md",
				content: identityContent
			})) return;
			assertWorkspaceAccessCurrent();
		}
		try {
			await updateAgentConfigEntry(agentConfigUpdate);
		} catch (error) {
			if (error instanceof AgentConfigPreconditionError) {
				respondAgentNotFound(respond, agentId);
				return;
			}
			if (error instanceof AgentModelSelectionError) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
				return;
			}
			throw error;
		}
		respond(true, {
			ok: true,
			agentId
		}, void 0);
	},
	"agents.delete": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsDeleteParams, "agents.delete", respond)) return;
		const cfg = context.getRuntimeConfig();
		const normalized = normalizeAgentIdStrict(params.agentId);
		if (!normalized.ok) {
			respondAgentNotFound(respond, params.agentId);
			return;
		}
		const agentId = normalized.value;
		if (agentOwnsSharedAuthStore(cfg, agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatSharedAuthStoreOwnerDeleteError(agentId)));
			return;
		}
		const existingJournal = readAgentDeletionJournal(agentId);
		if (!isConfiguredAgent(cfg, agentId) && (!existingJournal || existingJournal.cleanupCompleted)) {
			respondAgentNotFound(respond, agentId);
			return;
		}
		if (agentId === tryResolveSoleAgentId(cfg)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${agentId}" is the only configured agent and cannot be deleted.`));
			return;
		}
		if (isInheritedAuthStoreOwner(cfg, agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${agentId}" owns inherited credentials through agents.defaults.authInheritance.agentId and cannot be deleted. Relocate those credentials, then re-point or remove that binding before retrying.`));
			return;
		}
		const requestedDeleteFiles = typeof params.deleteFiles === "boolean" ? params.deleteFiles : true;
		try {
			respond(true, await withAgentDeletion(agentId, async (begin) => withConfigMutationExclusive(async (lockedConfig) => {
				assertAgentSessionStoreDeletionSafe(lockedConfig, agentId);
				let lockedJournal = readAgentDeletionJournal(agentId);
				const configured = isConfiguredAgent(lockedConfig, agentId);
				if (agentOwnsSharedAuthStore(lockedConfig, agentId)) throw new AgentSharedAuthStoreOwnerError(formatSharedAuthStoreOwnerDeleteError(agentId));
				if (!configured && (!lockedJournal || lockedJournal.cleanupCompleted)) throw new AgentConfigPreconditionError(`agent "${agentId}" not found`);
				if (agentId === tryResolveSoleAgentId(lockedConfig)) throw new AgentConfigPreconditionError(`agent "${agentId}" is the only configured agent`);
				if (isInheritedAuthStoreOwner(lockedConfig, agentId)) throw new AgentConfigPreconditionError(`agent "${agentId}" owns agents.defaults.authInheritance.agentId; relocate credentials and re-point it first`);
				if (configured && lockedJournal?.cleanupCompleted) {
					const claimed = claimCompletedAgentDeletion(agentId, lockedJournal.operationId);
					const remainingJournal = readAgentDeletionJournal(agentId);
					if (!claimed && remainingJournal) throw new Error(`agent "${agentId}" deletion tombstone changed before fresh deletion`);
					lockedJournal = void 0;
				}
				const deleteFiles = lockedJournal?.deleteFiles ?? requestedDeleteFiles;
				const deletion = begin(lockedJournal ?? {
					agentId,
					agentDir: resolveAgentDir(lockedConfig, agentId),
					workspaceDir: resolveAgentWorkspaceDir(lockedConfig, agentId),
					sessionsDir: resolveSessionTranscriptsDirForAgent(agentId),
					deleteFiles
				});
				const journal = deletion.entry;
				let rosterCommitted = !configured;
				let committed;
				let databasePlan;
				try {
					prepareJournaledAgentDirOwnership(lockedConfig, agentId, journal.agentDir);
					databasePlan = await prepareAgentDeleteDatabases(lockedConfig, agentId, journal.agentDir);
					deletion.assertCurrent();
					deletion.fenceDatabasePaths([...journal.databasePaths, ...databasePlan.fileGroups.flat()]);
					if (deleteFiles) {
						const fencedSourcePaths = new Set(journal.cleanupPaths.flatMap((cleanupPath) => cleanupPath.sourcePaths.map((sourcePath) => path.resolve(sourcePath))));
						const unfencedSourcePaths = [
							journal.workspaceDir,
							journal.agentDir,
							journal.sessionsDir,
							...journal.databasePaths
						].filter((sourcePath) => !fencedSourcePaths.has(path.resolve(sourcePath)));
						if (unfencedSourcePaths.length > 0) {
							const unfencedSourcePathSet = new Set(unfencedSourcePaths.map((sourcePath) => path.resolve(sourcePath)));
							const cleanupPlan = await prepareAgentDeleteCleanupPaths(unfencedSourcePaths, journal.cleanupPaths);
							const unresolvedPath = cleanupPlan.find((cleanupPath) => cleanupPath.preparationError !== void 0 && cleanupPath.sourcePaths.some((sourcePath) => unfencedSourcePathSet.has(path.resolve(sourcePath))));
							if (unresolvedPath) throw unresolvedPath.preparationError;
							deletion.fenceCleanupPaths(cleanupPlan.map(({ path: cleanupPath, trashPath, parentPath, kind, preparedIdentity, trashCoversDescendants, done, note, sourcePaths }) => {
								const journalPath = {
									path: cleanupPath,
									canonicalPath: trashPath,
									parentPath,
									kind,
									sourcePaths,
									dev: preparedIdentity?.dev ?? null,
									ino: preparedIdentity?.ino ?? null,
									coversDescendants: trashCoversDescendants,
									done
								};
								if (note) journalPath.note = note;
								return journalPath;
							}));
						}
					}
					await context.cron.removeAgentJobsTransactional(agentId, async () => await withAgentExecApprovalsRemoved(agentId, async () => {
						deletion.assertCurrent();
						if (!rosterCommitted) {
							try {
								committed = await deleteAgentConfigEntry({
									agentId,
									assertCurrent: deletion.assertCurrent
								});
							} catch (error) {
								try {
									const persisted = await readConfigFileSnapshotForWrite();
									if (!isConfiguredAgent(persisted.snapshot.sourceConfig, agentId)) {
										rosterCommitted = true;
										throw new AgentDeletionCommitUncertainError(error);
									}
								} catch (readError) {
									if (readError instanceof AgentDeletionCommitUncertainError) throw readError;
									throw new AgentDeletionCommitUncertainError(error);
								}
								throw error;
							}
							if (!committed.result) {
								rosterCommitted = !isConfiguredAgent(committed.nextConfig, agentId);
								const missingResultError = /* @__PURE__ */ new Error("agent delete config mutation did not return its target");
								if (rosterCommitted) throw new AgentDeletionCommitUncertainError(missingResultError);
								throw missingResultError;
							}
							rosterCommitted = true;
						}
					}));
					deletion.assertCurrent();
				} catch (error) {
					let canReleaseFence = !rosterCommitted && !lockedJournal && !(error instanceof AgentDeletionAuthorityRollbackError) && !(error instanceof AgentDeletionCommitUncertainError);
					if (canReleaseFence) try {
						const persisted = await readConfigFileSnapshotForWrite();
						canReleaseFence = isConfiguredAgent(persisted.snapshot.sourceConfig, agentId);
					} catch {
						canReleaseFence = false;
					}
					if (canReleaseFence) deletion.rollback();
					throw error;
				}
				const deleteResult = committed?.result ?? {
					agentDir: journal.agentDir,
					workspaceDir: journal.workspaceDir,
					sessionsDir: journal.sessionsDir,
					removedBindings: 0
				};
				const nextConfig = committed?.nextConfig ?? lockedConfig;
				const agentDirRegistryPath = normalizeAgentDirRegistryPath(deleteResult.agentDir);
				const purgeFailed = await purgeAgentSessionStoreEntries(lockedConfig, agentId, { runDatabaseCleanup: deletion.runDatabaseCleanup });
				deletion.assertCurrent();
				const removed = [];
				const failed = [];
				if (deleteFiles && !purgeFailed) {
					const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(), agentId);
					const workspaceTrashEligible = !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.workspaceDir, survivingDatabaseFilePaths);
					const agentDirTrashEligible = resolveRegisteredAgentIdForDir(deleteResult.agentDir) === agentId && !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.agentDir, survivingDatabaseFilePaths);
					const sessionsDirTrashEligible = !isPathOwnedBySurvivingAgent(nextConfig, agentId, deleteResult.sessionsDir, survivingDatabaseFilePaths);
					const databaseFilePaths = [...(agentDirTrashEligible ? databasePlan?.relocatedFileGroups ?? [] : databasePlan?.fileGroups ?? []).flat(), ...journal.databasePaths].filter((pathname) => !isPathOwnedBySurvivingAgent(nextConfig, agentId, pathname, survivingDatabaseFilePaths));
					const eligibleSourcePaths = new Set([
						...workspaceTrashEligible ? [deleteResult.workspaceDir] : [],
						...agentDirTrashEligible ? [deleteResult.agentDir] : [],
						...sessionsDirTrashEligible ? [deleteResult.sessionsDir] : [],
						...databaseFilePaths
					].map((sourcePath) => path.resolve(sourcePath)));
					const cleanupPaths = (await prepareAgentDeleteCleanupPaths([], journal.cleanupPaths)).filter((cleanupPath) => cleanupPath.sourcePaths.some((sourcePath) => eligibleSourcePaths.has(sourcePath)) && (agentDirTrashEligible || !cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath)));
					const workspaceCanonicalPath = normalizeAgentDirRegistryPath(deleteResult.workspaceDir);
					const workspaceCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.workspaceDir, workspaceCanonicalPath));
					const legacyPlan = workspaceCleanupPaths.length > 0 ? prepareLegacyWorkspaceStateReset(deleteResult.workspaceDir) : void 0;
					const statePlan = workspaceCleanupPaths.length > 0 ? prepareWorkspaceStateDeletion(deleteResult.workspaceDir) : void 0;
					const outcomes = [];
					const completedCleanupPaths = new Set(cleanupPaths.filter((cleanupPath) => cleanupPath.done));
					const markCleanupPathDone = (cleanupPath, note) => {
						const canonicalPath = path.resolve(cleanupPath.trashPath);
						deletion.fenceCleanupPaths(journal.cleanupPaths.map((entry) => {
							if (path.resolve(entry.canonicalPath) !== canonicalPath || entry.kind !== cleanupPath.kind) return entry;
							const updated = Object.assign({}, entry, { done: true });
							if (note) updated.note = note;
							return updated;
						}));
						cleanupPath.done = true;
						cleanupPath.note = note;
						completedCleanupPaths.add(cleanupPath);
					};
					const protectedCleanupPaths = [];
					for (const cleanupPath of cleanupPaths) {
						deletion.assertCurrent();
						if (cleanupPath.done) {
							let replacementPresent = true;
							let note = cleanupPath.note ?? "completed cleanup path is occupied; replacement preserved";
							try {
								await statAgentCleanupPath(cleanupPath);
							} catch (error) {
								if (isMissingPathError(error)) replacementPresent = false;
								else if (!(error instanceof AgentCleanupIdentityMismatchError)) note = "completed cleanup path could not be verified; replacement preserved";
							}
							if (replacementPresent) {
								markCleanupPathDone(cleanupPath, note);
								protectedCleanupPaths.push({
									cleanupPath,
									protectAliases: true,
									terminal: true,
									note
								});
							}
							continue;
						}
						const refreshedDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(), agentId);
						const blockingProtection = protectedCleanupPaths.find(({ cleanupPath: protectedPath, protectAliases }) => (cleanupPath.kind !== "symlink" || protectAliases) && (protectedPath.canonicalPath === cleanupPath.canonicalPath || isPathInside(cleanupPath.canonicalPath, protectedPath.canonicalPath)) || [protectedPath.trashPath, ...protectAliases ? protectedPath.sourcePaths : []].some((protectedSourcePath) => protectedSourcePath === cleanupPath.trashPath || isPathInside(cleanupPath.trashPath, protectedSourcePath)));
						const ownedBySurvivor = isPathOwnedBySurvivingAgent(nextConfig, agentId, cleanupPath.path, refreshedDatabaseFilePaths) || cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath) && resolveRegisteredAgentIdForDir(deleteResult.agentDir) !== agentId;
						if (blockingProtection || ownedBySurvivor) {
							const terminal = ownedBySurvivor || blockingProtection?.terminal === true;
							const note = ownedBySurvivor ? "replacement owned by a surviving agent" : blockingProtection?.note;
							if (terminal) markCleanupPathDone(cleanupPath, note ?? "protected replacement preserved");
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: blockingProtection?.protectAliases ?? false,
								terminal,
								note
							});
							continue;
						}
						const outcome = cleanupPath.preparationError ? cleanupFailure(cleanupPath.path, cleanupPath.preparationError) : await removeAgentPath(cleanupPath, deletion.assertCurrent);
						outcomes.push({
							cleanupPath,
							outcome
						});
						if ("removed" in outcome) markCleanupPathDone(cleanupPath);
						else if ("skipped" in outcome) {
							markCleanupPathDone(cleanupPath, outcome.skipped.reason);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: true,
								note: outcome.skipped.reason
							});
						} else protectedCleanupPaths.push({
							cleanupPath,
							protectAliases: true,
							terminal: false
						});
					}
					for (const { outcome } of outcomes) if ("removed" in outcome) removed.push(outcome.removed);
					else if ("failed" in outcome) failed.push(outcome.failed);
					if (workspaceCleanupPaths.length > 0 && workspaceCleanupPaths.every((cleanupPath) => completedCleanupPaths.has(cleanupPath)) && legacyPlan && statePlan) try {
						await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrent });
						deletion.assertCurrent();
						await deleteWorkspaceState(statePlan, { assertCurrent: deletion.assertCurrent });
					} catch {}
					deletion.assertCurrent();
					const agentDirCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath));
					if (agentDirCleanupPaths.length > 0 && agentDirCleanupPaths.every((cleanupPath) => completedCleanupPaths.has(cleanupPath))) unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
				}
				deletion.assertCurrent();
				if (failed.length === 0 && !purgeFailed) {
					unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
					if (deleteFiles) unregisterAgentDeleteDatabases(agentId, databasePlan?.registrationPaths ?? []);
					deletion.finish();
				}
				return {
					ok: true,
					agentId,
					removedBindings: deleteResult.removedBindings,
					removed,
					failed,
					...purgeFailed ? { purgeFailed: true } : {}
				};
			})), void 0);
		} catch (error) {
			if (error instanceof AgentSharedAuthStoreOwnerError || error instanceof AgentSharedStoreOwnerError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			if (error instanceof AgentConfigPreconditionError) {
				respondAgentNotFound(respond, agentId);
				return;
			}
			throw error;
		}
	},
	...agentFileHandlers
};
//#endregion
export { agentsHandlers as t };
