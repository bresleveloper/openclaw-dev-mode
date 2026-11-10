import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import "./session-key-CSDERtm3.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import { Ng as errorShape, a as validateAgentsDeleteParams, c as validateAgentsFilesSetParams, i as validateAgentsCreateParams, l as validateAgentsListParams, o as validateAgentsFilesGetParams, s as validateAgentsFilesListParams, u as validateAgentsUpdateParams } from "./src-pLJQA6J5.mjs";
import { a as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-FWbk4b3p.mjs";
import { m as readAgentDeletionJournalAsync } from "./agent-deletion-journal-DpYVtbBb.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { C as createRuntimeConfigWriteApplication, x as attachRuntimeConfigWriteApplication } from "./io.runtime-Ds5uC0Bf.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { f as resolveOperatorRolePolicy, t as authorizeCurrentOperatorRoleScopes } from "./operator-role-policy-Coro3qc5.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as prepareOperatorModelPresentation } from "./operator-model-presentation-C1cUPSmr.mjs";
import { l as WORKSPACE_BOOTSTRAP_FILENAMES, n as DEFAULT_BOOTSTRAP_FILENAME, r as DEFAULT_IDENTITY_FILENAME } from "./workspace-bootstrap-policy-wM0DWL3B.mjs";
import { a as loadAgentIdentityFromWorkspaceAsync, l as sanitizeAgentIdentityLine, n as createAgentIdentityConfig, s as normalizeIdentityForFile, t as buildIdentityMarkdownForWrite } from "./identity-file-BFsBDRA6.mjs";
import { n as assertAgentDeletionTargetsUnchanged, t as AgentDeletionTargetsPendingError } from "./agent-workspace-roster-transition-Db3DDtpa.mjs";
import { t as applyAgentConfig } from "./agents.config-B7znCYIL.mjs";
import { n as resolveAgentIdentity } from "./identity-VQc9B4RO.mjs";
import { n as listAgentsForGateway } from "./session-utils-store-lW7Wu3P0.mjs";
import { n as readPreparedServerMethodModelCatalogs, t as readPreparedServerMethodModelCatalog } from "./optional-model-catalog-CdAVHxWe.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-sFz3TNTx.mjs";
import { t as MAX_WORKSPACE_BOOTSTRAP_FILE_BYTES } from "./workspace-bootstrap-read-ClACC-rY.mjs";
import { i as isExpectedAbsentBootstrapFile, o as isWorkspaceSetupCompleted, t as ensureAgentWorkspace } from "./workspace-3xrXOvoY.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { r as enqueueWorkspaceFileUpdate } from "./workspace-fs-B8fFK4si.mjs";
import { t as workerInferenceMetadata } from "./inference-placement-C1SOuYae.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import "./session-utils-CGx9I2of.mjs";
import { n as formatSharedAuthStoreOwnerDeleteError, r as isInheritedAuthStoreOwner } from "./agent-delete-safety-C-K2bAs7.mjs";
import { t as AgentSharedStoreOwnerError } from "./agent-delete-session-store-safety-ChjTvLx2.mjs";
import "./agent-delete-databases-CDNa7990.mjs";
import { a as isConfiguredAgent, c as validateAgentModelSelectionUpdate, n as AgentModelSelectionError, o as isImplicitAgentModelUpdate, r as createAgentConfigEntry, s as updateAgentConfigEntry, t as AgentConfigPreconditionError } from "./agents-config-mutations-DOs6-YyC.mjs";
import { a as captureGatewayClientUploadCommitGuard } from "./upload-policy-Bd2Za3Ho.mjs";
import { n as resolveConfiguredAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { n as agentOwnsSharedAuthStore, r as deleteGatewayAgent, t as AgentSharedAuthStoreOwnerError } from "./agents-delete-BA_fWU_B.mjs";
import { t as reviveAgentDatabasesAfterConfigCommit } from "./server-reload-agent-databases-DJkZH23J.mjs";
import fs from "node:fs/promises";
import path from "node:path";
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
		const access = getAgentWorkspaceAccess(workspaceDir);
		const workspaceRoot = access ? null : await root(workspaceDir).catch(() => null);
		const names = hideBootstrap ? CORE_FILE_NAMES_POST_ONBOARDING : CORE_FILE_NAMES;
		respond(true, {
			agentId,
			workspace: workspaceDir,
			files: await Promise.all(names.map(async (name) => {
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
			}))
		}, void 0);
	},
	"agents.files.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesGetParams, "agents.files.get", respond)) return;
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		const filePath = path.join(workspaceDir, name);
		const respondFile = (file) => respond(true, {
			agentId,
			workspace: workspaceDir,
			file: {
				name,
				path: filePath,
				missing: file === void 0,
				...file ?? { expectedAbsent: isExpectedAbsentBootstrapFile(name) }
			}
		}, void 0);
		const access = getAgentWorkspaceAccess(workspaceDir);
		let file;
		if (access) {
			const stat = await access.bridge.stat({ filePath: name });
			if (getAgentWorkspaceAccess(workspaceDir) !== access) throw new Error("Workspace access changed while reading an Agent document");
			if (!stat) {
				respondFile();
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
					respondFile();
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
		respondFile(file);
	},
	"agents.files.set": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateAgentsFilesSetParams, "agents.files.set", respond)) return;
		const resolved = resolveAgentWorkspaceFileOrRespondError(params, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { agentId, workspaceDir, name } = resolved;
		if (params.expectedWorkspace !== void 0 && params.expectedWorkspace !== workspaceDir) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent workspace changed since "${name}" was read. Your draft is preserved. Reload to use the current workspace file, or Overwrite to save this draft there.`, { details: {
				type: "agent_file_conflict",
				name
			} }));
			return;
		}
		const access = getAgentWorkspaceAccess(workspaceDir);
		const filePath = path.join(workspaceDir, name);
		const content = params.content;
		let workspaceRoot = null;
		let conflict;
		if (Buffer.byteLength(params.content) > 2097152) throw new Error("Workspace document exceeds its write bound");
		if (access) {
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
		if (name === "IDENTITY.md") {
			await loadAgentIdentityFromWorkspaceAsync(workspaceDir);
			context.broadcast("agent.identity.changed", { agentId });
		}
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
	const emptyAgentAllowlist = resolveOperatorRolePolicy(client, cfg)?.agents?.length === 0;
	const agentIds = listAgentIds(cfg);
	const modelCatalogByAgentId = emptyAgentAllowlist ? /* @__PURE__ */ new Map() : context.readPreparedGatewayModelCatalogBatch ? await readPreparedServerMethodModelCatalogs(context, agentIds) : new Map(await Promise.all(agentIds.map(async (agentId) => [agentId, await readPreparedServerMethodModelCatalog(context, { agentId })])));
	const result = await listAgentsForGateway(cfg, {
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
	const allowedAgents = emptyAgentAllowlist ? [] : resolveOperatorRolePolicy(client, currentConfig)?.agents;
	const agents = allowedAgents && allowedAgents !== "*" ? result.agents.filter((agent) => allowedAgents.includes(agent.id)) : result.agents;
	const policy = prepareOperatorModelPresentation({
		cfg: currentConfig,
		policyConfig: context.getCommittedRuntimeConfig?.() ?? currentConfig,
		client
	});
	const required = currentConfig.cloudWorkers?.requiredProfile;
	const profile = required ? currentConfig.cloudWorkers?.profiles?.[required] : void 0;
	respond(true, {
		...params.includeSessionPlacement === true ? {
			...result,
			sessionPlacement: required ? { requiredProfile: {
				id: required,
				...profile ? {
					providerId: profile.provider,
					executionModes: context.workerEnvironmentService?.supportsExecutionMode(required, "worker-turn") === true ? ["worker-turn"] : [],
					...workerInferenceMetadata({
						providerId: profile.provider,
						profileSnapshot: profile
					})
				} : {}
			} } : {}
		} : result,
		agents: policy ? agents.map((agent) => policy.forAgent(agent.id, modelCatalogByAgentId.get(agent.id)?.entries).agent(agent)) : agents
	}, void 0);
};
//#endregion
//#region src/gateway/server-methods/agents.ts
function respondAgentNotFound(respond, agentId) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" not found`));
}
function createAgentConfigApplication(respond) {
	const application = createRuntimeConfigWriteApplication(captureGatewayRootWorkAdmissionContinuationScope()?.run);
	return {
		attach: (options) => attachRuntimeConfigWriteApplication(options, application),
		confirm: async () => {
			const outcome = application.claimed ? await application.result : "unclaimed";
			if (outcome === "applied") return true;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `Agent configuration was saved but its application to the active Gateway was not confirmed (${outcome}); run config.get, then apply the saved config or restart the Gateway.`));
			return false;
		}
	};
}
const agentsHandlers = {
	"agents.list": agentListHandler,
	"agents.create": async (options) => {
		const { params, respond, client, context } = options;
		if (!assertValidParams(params, validateAgentsCreateParams, "agents.create", respond)) return;
		let assertOwnerCurrent;
		try {
			assertOwnerCurrent = params.expectedOwnerId ? captureLocalStateMutationGuard(params.expectedOwnerId, options) : void 0;
		} catch (error) {
			respond(false, void 0, localStateOwnerChangedError(error));
			return;
		}
		const application = createAgentConfigApplication(respond);
		try {
			const result = await createAgentConfigEntry({
				name: params.name,
				workspace: params.workspace,
				model: params.model,
				emoji: params.emoji,
				avatar: params.avatar,
				beforePersistentApply: assertOwnerCurrent,
				assertIdentityInputAllowed: captureGatewayClientUploadCommitGuard({
					method: "agents.create",
					requestParams: params,
					client,
					context
				})
			}, application.attach({}));
			if (result.status === "error") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, result.message));
				return;
			}
			await reviveAgentDatabasesAfterConfigCommit([result.agentId], (message) => context.logGateway.warn(message));
			if (!await application.confirm()) return;
			respond(true, {
				ok: true,
				agentId: result.agentId,
				name: result.name,
				workspace: result.workspace,
				agentDir: result.agentDir,
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
		const application = createAgentConfigApplication(respond);
		try {
			let ensuredWorkspace;
			if (workspaceDir) {
				await assertAgentDeletionTargetsUnchanged(cfg, nextConfig);
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
			}, application.attach({}));
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) {
				respond(false, void 0, error.error);
				return;
			}
			if (error instanceof AgentConfigPreconditionError) {
				respondAgentNotFound(respond, agentId);
				return;
			}
			if (error instanceof AgentModelSelectionError || error instanceof AgentDeletionTargetsPendingError) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
				return;
			}
			throw error;
		}
		if (await application.confirm()) respond(true, {
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
		if (await agentOwnsSharedAuthStore(cfg, agentId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatSharedAuthStoreOwnerDeleteError(agentId)));
			return;
		}
		const existingJournal = await readAgentDeletionJournalAsync(agentId);
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
		const application = createAgentConfigApplication(respond);
		try {
			const result = await deleteGatewayAgent(agentId, requestedDeleteFiles, context, { writeOptions: application.attach({}) });
			if (!await application.confirm()) return;
			if (result.purgeFailed || result.failed?.length) {
				const failures = result.failed?.map(({ path, reason }) => `${path}: ${reason}`) ?? [];
				if (result.purgeFailed) failures.unshift("session-store cleanup failed");
				respond(false, result, errorShape(ErrorCodes.UNAVAILABLE, `Agent "${agentId}" was removed from configuration, but deletion cleanup is still pending: ${failures.join("; ")}. Resolve the cleanup failure, then retry agents.delete.`));
				return;
			}
			respond(true, result, void 0);
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
export { agentsHandlers };
