import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { M as unregisterResolvedAgentDir, a as resolveAgentDir, d as resolveAgentWorkspaceDir, j as resolveRegisteredAgentIdForDir, k as normalizeAgentDirRegistryPath } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { p as resolveSessionTranscriptsDirForAgent } from "./paths-dpReqUI8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { u as readConfigFileSnapshotForWrite } from "./io.runtime-BSum32pK.mjs";
import { s as withConfigMutationExclusive } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { c as resolveSharedAuthStorePath, o as resolveSharedAuthStoreOwnership } from "./path-resolve-CIRhdX6A.mjs";
import { c as readAgentDeletionJournal } from "./agent-deletion-journal-CDljXcnp.mjs";
import { g as resolveAuthProfileDatabasePath } from "./sqlite-CW8wNN4G.mjs";
import { a as validateAgentsDeleteParams, c as validateAgentsFilesSetParams, i as validateAgentsCreateParams, l as validateAgentsListParams, o as validateAgentsFilesGetParams, s as validateAgentsFilesListParams, u as validateAgentsUpdateParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as resolveOperatorRolePolicy, t as authorizeCurrentOperatorRoleScopes } from "./operator-role-policy-BqPaarjx.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-DjFUgH7e.mjs";
import { l as WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME, r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-CPdXB_so.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-B5B8MlNt.mjs";
import { i as isExpectedAbsentBootstrapFile, o as isWorkspaceSetupCompleted, t as ensureAgentWorkspace } from "./workspace-C0xiByg0.mjs";
import { l as prepareLegacyWorkspaceStateReset, u as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-CfAX5lfc.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DCCJC3M9.mjs";
import { a as claimCompletedAgentDeletion, c as withAgentDeletion, n as AgentDeletionCommitUncertainError, t as AgentDeletionAuthorityRollbackError } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { f as withAgentExecApprovalsRemoved } from "./exec-approvals-store-DGp2moY9.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { l as sanitizeAgentIdentityLine, n as createAgentIdentityConfig, s as normalizeIdentityForFile, t as buildIdentityMarkdownForWrite } from "./identity-file-DQ9_U4uO.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import "./sessions-D_sxp1B4.mjs";
import { t as purgeAgentSessionStoreEntries } from "./cleanup-service-C56WP_MJ.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { n as listAgentsForGateway } from "./session-utils-store-DrLraxiU.mjs";
import { n as prepareOperatorModelPresentation } from "./operator-model-presentation-CO5pZsTT.mjs";
import { t as applyAgentConfig } from "./agents.config-CEaxMlw1.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { c as trashAllowedRoots } from "./cleanup-utils-Dw9SRNjJ.mjs";
import { n as createAgent } from "./agent-create-DoXqBJsP.mjs";
import { r as enqueueWorkspaceFileUpdate } from "./workspace-fs-CdJgcGwn.mjs";
import { t as movePathToTrash } from "./browser-trash-BBLAyaRb.mjs";
import "./browser-maintenance-BbSDNJPM.mjs";
import { n as readPreparedServerMethodModelCatalogs, t as readPreparedServerMethodModelCatalog } from "./optional-model-catalog-B-pbmxbf.mjs";
import { i as isSharedAuthStoreOwner, n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner } from "./agent-delete-safety-DmMgHiSV.mjs";
import { a as prepareAgentDeleteDatabases, c as resolveSurvivingDatabaseFilePaths, i as isPathOwnedBySurvivingAgent, l as retireAgentDeleteRuntime, n as assertAgentSessionStoreDeletionSafe, o as prepareJournaledAgentDirOwnership, r as finishAgentDeleteDatabases, s as readAgentDeleteDatabaseRegistry, t as AgentSharedStoreOwnerError } from "./agent-delete-databases-BcYYkGnY.mjs";
import { a as isImplicitAgentModelUpdate, i as isConfiguredAgent, n as AgentModelSelectionError, o as updateAgentConfigEntry, r as deleteAgentConfigEntry, s as validateAgentModelSelectionUpdate, t as AgentConfigPreconditionError } from "./agents-config-mutations-BtuZZQJ2.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-B7cW3IFl.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as resolveConfiguredAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { t as reviveAgentDatabasesAfterConfigCommit } from "./server-reload-agent-databases-BbZ3naJj.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { resolvePathPrefixSync } from "@openclaw/fs-safe/advanced";
//#region src/gateway/server-methods/agents-files.ts
const CORE_FILE_NAMES = WORKSPACE_BOOTSTRAP_FILENAMES.filter((name) => name !== DEFAULT_IDENTITY_FILENAME);
const CORE_FILE_NAMES_POST_ONBOARDING = CORE_FILE_NAMES.filter((name) => name !== DEFAULT_BOOTSTRAP_FILENAME);
const ALLOWED_FILE_NAMES = new Set(WORKSPACE_BOOTSTRAP_FILENAMES);
function resolveAgentWorkspaceFileOrRespondError(params, respond, cfg) {
	const agentId = resolveConfiguredAgentIdOrRespondError(params.agentId, cfg, respond);
	if (!agentId) return null;
	const name = params.name.trim();
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
async function statWorkspaceFileSafely(workspaceRoot, name) {
	try {
		const stat = await workspaceRoot?.stat(name);
		return stat?.isFile && !stat.isSymbolicLink && stat.nlink <= 1 ? {
			size: stat.size,
			updatedAtMs: Math.floor(stat.mtimeMs)
		} : null;
	} catch {
		return null;
	}
}
async function listAgentFiles(workspaceDir, options) {
	const access = getAgentWorkspaceAccess(workspaceDir);
	const workspaceRoot = access ? null : await root(workspaceDir).catch(() => null);
	const names = options?.hideBootstrap ? CORE_FILE_NAMES_POST_ONBOARDING : CORE_FILE_NAMES;
	return await Promise.all(names.map(async (name) => {
		let meta;
		if (access) {
			const stat = await access.bridge.stat({ filePath: name });
			if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while listing Agent documents");
			meta = stat?.type === "file" ? {
				size: stat.size,
				updatedAtMs: Math.floor(stat.mtimeMs)
			} : null;
		} else meta = await statWorkspaceFileSafely(workspaceRoot, name);
		return Object.assign({
			name,
			path: path.join(workspaceDir, name),
			missing: meta === null
		}, meta ?? { expectedAbsent: isExpectedAbsentBootstrapFile(name) });
	}));
}
function respondWorkspaceFileUnsafe(respond, name) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsafe workspace file "${name}"`));
}
async function writeWorkspaceFileOrRespond(params) {
	const access = getAgentWorkspaceAccess(params.workspaceDir);
	if (access) {
		if (Buffer.byteLength(params.content) > 2097152) throw new Error("Workspace document exceeds its write bound");
		params.assertCurrent?.();
		await access.bridge.writeFile({
			filePath: params.name,
			data: params.content,
			mkdir: false
		});
		if (getAgentWorkspaceAccess(params.workspaceDir) !== access) throw new Error("Workspace access changed while saving Agent identity");
		return true;
	}
	params.assertCurrent?.();
	await fs.mkdir(params.workspaceDir, { recursive: true });
	try {
		await (await root(params.workspaceDir)).write(params.name, params.content, {
			encoding: "utf8",
			assertBeforeMutation: params.assertCurrent
		});
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
		return (await (await root(workspaceDir)).read(name, { hardlinks: "reject" })).buffer.toString("utf-8");
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
		const safeRead = await workspaceRoot.read(name, { hardlinks: "reject" });
		return sha256Hex(safeRead.buffer);
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
		const agentId = resolveConfiguredAgentIdOrRespondError(params.agentId, cfg, respond);
		if (!agentId) return;
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
		let file;
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
			file = {
				size: data.length,
				updatedAtMs: Math.floor(stat.mtimeMs),
				hash: sha256Hex(data),
				content: new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(data)
			};
		} else {
			let safeRead;
			try {
				safeRead = await (await root(workspaceDir)).read(name, { hardlinks: "reject" });
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
					respondWorkspaceFileUnsafe(respond, name);
					return;
				}
				throw err;
			}
			file = {
				size: safeRead.stat.size,
				updatedAtMs: Math.floor(safeRead.stat.mtimeMs),
				hash: sha256Hex(safeRead.buffer),
				content: safeRead.buffer.toString("utf-8")
			};
		}
		respond(true, {
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				...file
			}
		}, void 0);
	},
	"agents.files.set": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesSetParams, "agents.files.set", respond)) return;
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		const access = getAgentWorkspaceAccess(workspaceDir);
		const filePath = path.join(workspaceDir, name);
		const content = params.content;
		let workspaceRoot = null;
		let conflict;
		if (access) {
			if (Buffer.byteLength(params.content) > 2097152) throw new Error("Workspace document exceeds its write bound");
			const assertCurrent = () => {
				if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while saving an Agent document");
			};
			const createFileExclusive = access.bridge.createFileExclusive;
			if (params.expectedMissing && !createFileExclusive) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "This workspace host cannot safely create a missing Agent document. Update its workspace provider, or create the file on that host and reload it before saving."));
				return;
			}
			conflict = await enqueueWorkspaceFileUpdate(async () => {
				assertCurrent();
				if (params.expectedMissing && createFileExclusive) {
					const result = await createFileExclusive({
						filePath: name,
						data: content,
						mkdir: true
					});
					assertCurrent();
					return result === "exists" ? { currentHash: void 0 } : void 0;
				}
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
						currentHash = sha256Hex(data);
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
		} else {
			await fs.mkdir(workspaceDir, { recursive: true });
			try {
				workspaceRoot = await root(workspaceDir);
				const writeRoot = workspaceRoot;
				const expectedHash = params.expectedHash?.toLowerCase();
				conflict = await enqueueWorkspaceFileUpdate(async () => {
					if (params.expectedMissing) {
						try {
							await writeRoot.create(name, content, {
								encoding: "utf8",
								atomic: true
							});
						} catch (err) {
							if (err instanceof FsSafeError && err.code === "already-exists") return { currentHash: void 0 };
							throw err;
						}
						return;
					}
					if (expectedHash) {
						const currentHash = await readWorkspaceFileHash(writeRoot, name);
						if (currentHash !== expectedHash) return { currentHash };
					}
					await writeRoot.write(name, content, { encoding: "utf8" });
				});
			} catch (err) {
				if (!(err instanceof FsSafeError)) throw err;
				respondWorkspaceFileUnsafe(respond, name);
				return;
			}
		}
		if (conflict) {
			respondWorkspaceFileConflict(respond, name, conflict.currentHash);
			return;
		}
		const meta = access ? { size: Buffer.byteLength(content) } : await statWorkspaceFileSafely(workspaceRoot, name);
		respond(true, {
			ok: true,
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: false,
				size: meta?.size,
				...!access ? { updatedAtMs: meta?.updatedAtMs } : {},
				hash: sha256Hex(content),
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
	const result = await listAgentsForGateway(cfg, void 0, {
		modelCatalogByAgentId,
		includeSystem: hasGatewayClientCap(client?.connect.caps, GATEWAY_CLIENT_CAPS.AGENT_KIND),
		httpAvatarBasePath: client?.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI ? cfg.gateway?.controlUi?.basePath ?? "" : void 0
	});
	const currentConfig = context.getRuntimeConfig();
	const roleError = authorizeCurrentOperatorRoleScopes(client, currentConfig);
	if (roleError) {
		respond(false, void 0, roleError);
		return;
	}
	const allowedAgents = resolveOperatorRolePolicy(client, currentConfig)?.agents;
	const agents = allowedAgents && allowedAgents !== "*" ? result.agents.filter((agent) => allowedAgents.includes(agent.id)) : result.agents;
	const policy = prepareOperatorModelPresentation({
		cfg: currentConfig,
		policyConfig: context.getCommittedRuntimeConfig?.() ?? currentConfig,
		client
	});
	respond(true, {
		...result,
		agents: policy ? agents.map((agent) => policy.forAgent(agent.id, modelCatalogByAgentId.get(agent.id)?.entries).agent(agent)) : agents
	}, void 0);
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
	const candidate = path.resolve(pathname);
	try {
		return await fs.realpath(candidate);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		const { existingPath, unresolvedSegments } = resolvePathPrefixSync(candidate);
		return path.resolve(existingPath, ...unresolvedSegments);
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
	for (const persistedPath of persistedPaths) {
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
		addPath({
			path: resolvedPath,
			parentPath: path.dirname(resolvedPath),
			canonicalPath,
			trashPath: resolvedPath,
			trashCoversDescendants: targetStat ? !targetStat.isSymbolicLink() : false,
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
const agentsHandlers = {
	"agents.list": agentListHandler,
	"agents.create": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateAgentsCreateParams, "agents.create", respond)) return;
		try {
			const result = await createAgent({
				name: params.name,
				workspace: params.workspace,
				model: params.model,
				emoji: params.emoji,
				avatar: params.avatar,
				assertIdentityInputAllowed: captureGatewayClientUploadCommitGuard({
					method: "agents.create",
					requestParams: params,
					client,
					context
				})
			});
			if (result.status === "error") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.message));
				return;
			}
			await reviveAgentDatabasesAfterConfigCommit([result.agentId], (message) => context.logGateway.warn(message));
			respond(true, {
				ok: true,
				agentId: result.agentId,
				name: result.name,
				workspace: result.workspace,
				...result.model ? { model: result.model } : {}
			}, void 0);
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) {
				respond(false, void 0, error.error);
				return;
			}
			throw error;
		}
	},
	"agents.update": async ({ params, respond, context, client }) => {
		if (!assertValidParams(params, validateAgentsUpdateParams, "agents.update", respond)) return;
		const assertUploadCurrent = captureGatewayClientUploadCommitGuard({
			method: "agents.update",
			requestParams: params,
			client,
			context
		});
		let identityPublished = false;
		const assertUploadAllowed = () => {
			if (!identityPublished) assertUploadCurrent?.();
		};
		const cfg = context.getRuntimeConfig();
		const normalized = normalizeAgentIdStrict(params.agentId);
		if (!normalized.ok) {
			respondAgentNotFound(respond, params.agentId);
			return;
		}
		const agentId = normalized.value;
		const workspace = normalizeOptionalString(params.workspace);
		const workspaceDir = workspace ? resolveUserPath(workspace) : void 0;
		const model = params.model === null ? null : normalizeOptionalString(params.model);
		const name = normalizeOptionalString(params.name);
		const safeName = name ? sanitizeAgentIdentityLine(name) : void 0;
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
		try {
			let ensuredWorkspace;
			if (workspaceDir) {
				const skipBootstrap = Boolean(nextConfig.agents?.defaults?.skipBootstrap);
				ensuredWorkspace = await ensureAgentWorkspace({
					dir: workspaceDir,
					guard: { assertHost: assertUploadAllowed },
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
					assertUploadAllowed?.();
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
					content: identityContent,
					assertCurrent: assertWorkspaceAccessCurrent
				})) return;
				identityPublished = true;
				assertWorkspaceAccessCurrent();
			}
			await updateAgentConfigEntry({
				...agentConfigUpdate,
				assertCurrent: assertUploadAllowed
			});
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) {
				respond(false, void 0, error.error);
				return;
			}
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
		const requestedDeleteFiles = params.deleteFiles ?? true;
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
							deletion.fenceCleanupPaths(cleanupPlan.map((cleanupPath) => {
								const journalPath = {
									path: cleanupPath.path,
									canonicalPath: cleanupPath.trashPath,
									parentPath: cleanupPath.parentPath,
									kind: cleanupPath.kind,
									sourcePaths: cleanupPath.sourcePaths,
									dev: cleanupPath.preparedIdentity?.dev ?? null,
									ino: cleanupPath.preparedIdentity?.ino ?? null,
									coversDescendants: cleanupPath.trashCoversDescendants,
									done: cleanupPath.done
								};
								if (cleanupPath.note) journalPath.note = cleanupPath.note;
								return journalPath;
							}));
						}
					}
					await context.cron.removeAgentJobsTransactional(agentId, () => withAgentExecApprovalsRemoved(agentId, async () => {
						deletion.assertCurrent();
						if (!rosterCommitted) {
							try {
								committed = await deleteAgentConfigEntry({
									agentId,
									allowConfigSizeDrop: true,
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
				await retireAgentDeleteRuntime(lockedConfig, deletion, databasePlan?.agentDirs ?? [journal.agentDir]);
				const deleteResult = committed?.result ?? {
					agentDir: journal.agentDir,
					workspaceDir: journal.workspaceDir,
					sessionsDir: journal.sessionsDir,
					removedBindings: 0
				};
				const nextConfig = committed?.nextConfig ?? lockedConfig;
				const agentDirRegistryPath = normalizeAgentDirRegistryPath(deleteResult.agentDir);
				const purgeFailed = await purgeAgentSessionStoreEntries(lockedConfig, agentId, { runDatabaseCleanup: deletion.runDatabaseCleanup });
				await deletion.assertCurrentAsync();
				const { closeDeletedAgentDatabases } = await import("./openclaw-agent-db-readers-CInaGeKN.mjs");
				await deletion.assertCurrentAsync();
				await closeDeletedAgentDatabases(agentId, databasePlan?.readerPaths ?? []);
				await deletion.assertCurrentAsync();
				const removed = [];
				const failed = [];
				if (deleteFiles && !purgeFailed) {
					const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(readAgentDeleteDatabaseRegistry(), agentId);
					const unclaimedBySurvivor = (pathname) => !isPathOwnedBySurvivingAgent(nextConfig, agentId, pathname, survivingDatabaseFilePaths);
					const workspaceTrashEligible = unclaimedBySurvivor(deleteResult.workspaceDir);
					const agentDirTrashEligible = resolveRegisteredAgentIdForDir(deleteResult.agentDir) === agentId && unclaimedBySurvivor(deleteResult.agentDir);
					const sessionsDirTrashEligible = unclaimedBySurvivor(deleteResult.sessionsDir);
					const databaseFilePaths = [...(agentDirTrashEligible ? databasePlan?.relocatedFileGroups ?? [] : databasePlan?.fileGroups ?? []).flat(), ...journal.databasePaths].filter(unclaimedBySurvivor);
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
						if ("removed" in outcome) {
							removed.push(outcome.removed);
							markCleanupPathDone(cleanupPath);
						} else if ("skipped" in outcome) {
							markCleanupPathDone(cleanupPath, outcome.skipped.reason);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: true,
								note: outcome.skipped.reason
							});
						} else {
							failed.push(outcome.failed);
							protectedCleanupPaths.push({
								cleanupPath,
								protectAliases: true,
								terminal: false
							});
						}
					}
					if (workspaceCleanupPaths.length > 0 && workspaceCleanupPaths.every((cleanupPath) => cleanupPath.done) && legacyPlan && statePlan) try {
						await removeLegacyWorkspaceStateForReset(legacyPlan, { assertCurrent: deletion.assertCurrent });
						deletion.assertCurrent();
						await deleteWorkspaceState(statePlan, { assertCurrent: deletion.assertCurrent });
					} catch {}
					deletion.assertCurrent();
					const agentDirCleanupPaths = cleanupPaths.filter((cleanupPath) => cleanupPathCovers(cleanupPath, deleteResult.agentDir, agentDirRegistryPath));
					if (agentDirCleanupPaths.length > 0 && agentDirCleanupPaths.every((cleanupPath) => cleanupPath.done)) unregisterResolvedAgentDir({
						agentId,
						agentDir: agentDirRegistryPath
					});
				}
				await finishAgentDeleteDatabases({
					deletion,
					databasePlan,
					agentDir: agentDirRegistryPath,
					deleteFiles,
					complete: failed.length === 0 && !purgeFailed
				});
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
