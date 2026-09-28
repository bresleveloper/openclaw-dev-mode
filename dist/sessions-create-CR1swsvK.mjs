import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { cp as SESSION_CREATE_IDEMPOTENCY_RETENTION_MS, vi as validateSessionsCreateParams } from "./src-BRUl7oDv.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { g as resolveOperatorSessionCreation } from "./operator-role-policy-Bt6aG_wj.mjs";
import { D as sessionEntryForkedFromParent } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./server-constants-Dx_kHnY5.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { n as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-C6eaGrAi.mjs";
import { a as resolveGatewaySessionStoreTarget } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DqGvpsY3.mjs";
import { _ as ensureSessionGroupRegistered } from "./session-sharing-C_5FkkwM.mjs";
import "./session-utils-AxixtEyo.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-DRWWbX7-.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-HweUC6hk.mjs";
import { h as resolveProjectDirectory, m as resolveProjectCheckout, p as ProjectCheckoutError, s as resolveProjectRegistry } from "./project-registry-CT4rCnL9.mjs";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-B4IXtY9m.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { a as prepareSkillLibrarySessionCreation } from "./skill-library-authoring-C8vxOQq1.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority--ezHAh8Z.mjs";
import { d as sessionLog } from "./sessions-shared-DPyHwOCR.mjs";
import { t as ModelAccountConnectAuthorityError } from "./model-account-connect-gjbDbUD5.mjs";
import { r as prepareSessionModelAccountAccess } from "./users-model-account-access-DlgTxbVh.mjs";
import { c as prepareSessionRepositoryWorkspace, d as scheduleCreatedDashboardSessionTitle, l as resolveSessionRepositoryCreation, o as normalizeChatSendRequest, s as normalizeSessionProjectGitUrl, u as validateSessionProjectPreparation } from "./chat-send-handler--coYiPWx.mjs";
import { t as buildDashboardSessionTitleSource } from "./dashboard-session-title-CH6MALGs.mjs";
import { r as resolveSessionCreateRootParameters, t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DONGPA9n.mjs";
import { i as validateSessionWorktreeSelection, n as prepareSessionWorktreeCreation } from "./session-worktree-preparation-CsEph5Xk.mjs";
import { t as handleDirectExternalChatSend } from "./chat-send-external-entry-BzWHyhDW.mjs";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-7_RKcklA.mjs";
import { n as createGatewaySession, r as resolveSessionCreateCatalogSelectionError, t as buildDashboardSessionKey } from "./session-create-service-yGvu8Ia2.mjs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/server-methods/session-create-category.ts
async function registerCreatedSessionCategory(category, context) {
	if (!category) return;
	try {
		if (await ensureSessionGroupRegistered(category)) emitSessionsChanged(context, { reason: "groups" });
	} catch (error) {
		sessionLog.warn(`failed to register created session category: ${formatErrorMessage(error)}`);
	}
}
//#endregion
//#region src/gateway/server-methods/session-create-idempotency.ts
const sessionCreatesByContext = /* @__PURE__ */ new WeakMap();
function idempotentSessionCreate(handler) {
	return async (request) => {
		const idempotencyKey = request.params.idempotencyKey;
		if (typeof idempotencyKey !== "string" || !idempotencyKey) {
			await handler(request);
			return;
		}
		const principal = request.client?.authenticatedUserProfile?.profileId ?? request.client?.authenticatedUserId;
		const deviceId = request.client?.connect.device?.id?.trim();
		if (!principal && !deviceId) {
			request.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "idempotent session creation requires an authenticated principal or device identity"));
			return;
		}
		const owner = principal ? `principal:${principal}` : `device:${deviceId}`;
		let entriesByOwner = sessionCreatesByContext.get(request.context);
		if (!entriesByOwner) {
			entriesByOwner = /* @__PURE__ */ new Map();
			sessionCreatesByContext.set(request.context, entriesByOwner);
		}
		const now = Date.now();
		let retainedEntryCount = 0;
		for (const [entryOwner, ownerEntries] of entriesByOwner) {
			for (const [key, entry] of ownerEntries) if (entry.state.kind === "completed" && entry.expiresAt <= now) ownerEntries.delete(key);
			if (ownerEntries.size === 0) entriesByOwner.delete(entryOwner);
			else retainedEntryCount += ownerEntries.size;
		}
		let entries = entriesByOwner.get(owner);
		const requestIdentity = createHash("sha256").update(stableStringify(request.params)).digest("hex");
		const authorization = {
			role: request.client?.connect.role ?? null,
			scopes: request.client?.connect.scopes?.toSorted() ?? []
		};
		const existing = entries?.get(idempotencyKey);
		if (existing) {
			if (existing.requestIdentity !== requestIdentity) {
				request.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session creation idempotency key was reused with different parameters"));
				return;
			}
			if (existing.authorization.role !== authorization.role) {
				request.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "session creation authorization changed; start again"));
				return;
			}
			const missingScope = existing.authorization.scopes.find((scope) => !authorization.scopes.includes(scope));
			if (missingScope) {
				request.respond(false, void 0, missingScopeErrorShape({
					missingScope,
					requiredScopes: existing.authorization.scopes
				}));
				return;
			}
			const result = existing.state.kind === "completed" ? existing.state.result : await existing.state.work;
			request.respond(result.ok, result.payload, result.error, {
				...result.meta,
				cached: true
			});
			return;
		}
		if ((entries?.size ?? 0) >= 1e3 || retainedEntryCount >= 2e3) {
			request.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session creation capacity is full; retry later"));
			return;
		}
		if (!entries) {
			entries = /* @__PURE__ */ new Map();
			entriesByOwner.set(owner, entries);
		}
		const releaseEntry = () => {
			entries.delete(idempotencyKey);
			if (entries.size === 0) entriesByOwner.delete(owner);
		};
		const work = Promise.resolve().then(async () => {
			try {
				let result;
				await handler(bindGatewayRequestHandlerMutationAuthority(request, {
					...request,
					respond: (ok, payload, error, meta) => {
						result = {
							ok,
							payload,
							error,
							meta
						};
					}
				}, void 0));
				result ??= {
					ok: false,
					error: errorShape(ErrorCodes.UNAVAILABLE, "session creation was interrupted")
				};
				if (result.ok) {
					entry.expiresAt = Date.now() + SESSION_CREATE_IDEMPOTENCY_RETENTION_MS;
					entry.state = {
						kind: "completed",
						result
					};
				} else releaseEntry();
				return result;
			} catch (error) {
				releaseEntry();
				throw error;
			}
		});
		const entry = {
			requestIdentity,
			authorization,
			expiresAt: now + SESSION_CREATE_IDEMPOTENCY_RETENTION_MS,
			state: {
				kind: "inflight",
				work
			}
		};
		entries.set(idempotencyKey, entry);
		const result = await work;
		request.respond(result.ok, result.payload, result.error, result.meta);
	};
}
//#endregion
//#region src/gateway/server-methods/session-create-initial-turn.ts
function resolveOptionalInitialSessionMessage(params) {
	if (typeof params.task === "string" && params.task.trim()) return params.task;
	if (typeof params.message === "string" && params.message.trim()) return params.message;
}
function resolveSessionCreateInitialTurn(params) {
	const message = resolveOptionalInitialSessionMessage(params);
	const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.attachments);
	if (params.attachments?.length && !message && normalizedAttachments.length === 0) return null;
	const attachments = normalizedAttachments.length ? normalizedAttachments : void 0;
	return {
		attachments,
		hasInitialTurn: message !== void 0 || attachments !== void 0,
		message
	};
}
function isFreshChatSendStarted(params) {
	if (params.cached) return false;
	return (params.payload && typeof params.payload === "object" ? params.payload.status : void 0) === "started";
}
//#endregion
//#region src/gateway/server-methods/session-create-spawn.ts
function resolveSessionCreateSpawnContext(params) {
	const spawnToolPolicy = params.creation.via === "spawn" && params.creation.inheritedToolPolicy ? {
		...params.creation.inheritedToolPolicy,
		...params.creation.completionOwnerSessionKey ? { completionOwnerSessionKey: params.creation.completionOwnerSessionKey } : {}
	} : void 0;
	if (params.creation.via !== "spawn" || !params.creation.inheritedToolPolicy || params.creation.actor?.type !== "agent") {
		if (params.creation.resolvedModel) throw new Error("Resolved model inheritance requires a trusted spawn requester.");
		return { spawnToolPolicy };
	}
	const toolCaller = params.client?.internal?.agentToolCaller;
	const runtimeIdentity = params.client?.internal?.agentRuntimeIdentity;
	const requester = toolCaller?.assertCurrent ? {
		agentId: toolCaller.agentId,
		sessionKey: toolCaller.sessionKey,
		assertCurrent: toolCaller.assertCurrent
	} : runtimeIdentity && params.assertRuntimeCurrent ? {
		agentId: runtimeIdentity.agentId,
		sessionKey: runtimeIdentity.sessionKey,
		assertCurrent: params.assertRuntimeCurrent
	} : void 0;
	const requesterSessionKey = normalizeOptionalString(params.creation.requesterSessionKey);
	if (!requester || requester.sessionKey !== requesterSessionKey || requesterSessionKey !== params.parentSessionKey || normalizeAgentId(requester.agentId) !== params.agentId || normalizeAgentId(params.creation.actor.id) !== params.agentId) {
		if (params.creation.resolvedModel) throw new Error("Resolved model inheritance requires a current same-agent requester.");
		return { spawnToolPolicy };
	}
	const resolvedModel = params.creation.resolvedModel;
	if (resolvedModel && params.model !== `${resolvedModel.provider}/${resolvedModel.model}`) throw new Error("Resolved spawn model does not match the requested model.");
	const preparedModelSelection = resolvedModel ? {
		ref: { ...resolvedModel },
		assertCurrent: requester.assertCurrent
	} : void 0;
	if (params.fork !== true || params.forkFrom !== void 0 || params.emitCommandHooks === true) return {
		spawnToolPolicy,
		preparedModelSelection
	};
	return {
		spawnToolPolicy,
		preparedModelSelection,
		activeParentFork: {
			requesterSessionKey: requester.sessionKey,
			assertCurrent: requester.assertCurrent
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-create.ts
const sessionCreateHandlers = { "sessions.create": async (options) => {
	const { params, respond, context, client, sessionMutationCommitGuard, sessionMutationAuthorization, signal } = options;
	if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond)) return;
	const p = params;
	const emptyWorkspace = p.worktreeSource === "empty";
	const worktreeSelectionError = validateSessionWorktreeSelection(p);
	if (worktreeSelectionError) {
		respond(false, void 0, worktreeSelectionError);
		return;
	}
	const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
	const sessionCreation = prepareSkillLibrarySessionCreation(client, context.getRuntimeConfig, resolveOperatorSessionCreation(client, { allowTrustedHint: true }));
	const spawnRequesterSessionKey = sessionCreation.via === "spawn" ? normalizeOptionalString(sessionCreation.requesterSessionKey) : void 0;
	if (sessionCreation.inheritedToolPolicy && parentSessionKey !== spawnRequesterSessionKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "spawn parent must match the trusted agent caller"));
		return;
	}
	const requestedModel = normalizeOptionalString(p.model);
	let personalAccounts;
	try {
		personalAccounts = prepareSessionModelAccountAccess(options, requestedModel);
	} catch (error) {
		if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
		respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
		return;
	}
	const { personalModelSelection, personalAccountDefaults } = personalAccounts;
	const cfg = context.getRuntimeConfig();
	const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
	const commitGuard = () => {
		sessionMutationCommitGuard?.();
		authority.commitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
		assertPreparedSkillLibrarySelection(sessionCreation.skillLibrarySelections);
		personalModelSelection?.assertCurrent();
		personalAccountDefaults?.assertCurrent();
	};
	const catalogId = normalizeOptionalString(p.catalogId);
	const catalogError = resolveSessionCreateCatalogSelectionError(p);
	if (catalogError) {
		respond(false, void 0, catalogError);
		return;
	}
	const explicitlyRequestedKey = normalizeOptionalString(p.key);
	const explicitlyRequestedAgent = resolveRequestedSessionAgentId(cfg, explicitlyRequestedKey ?? (p.agentId === void 0 ? "main" : void 0), p.agentId ?? parseAgentSessionKey(explicitlyRequestedKey)?.agentId);
	if (!explicitlyRequestedAgent.ok) {
		respond(false, void 0, explicitlyRequestedAgent.error);
		return;
	}
	const catalogRequestedKey = normalizeOptionalString(p.key) ?? "global";
	const catalogAgentId = catalogId ? normalizeAgentId(parseAgentSessionKey(catalogRequestedKey)?.agentId ?? explicitlyRequestedAgent.agentId) : void 0;
	const catalogTarget = catalogId && catalogAgentId ? resolveRegisteredCatalogCreateTarget(catalogId, catalogAgentId, cfg) : void 0;
	if (catalogTarget && !catalogTarget.ok) {
		respond(false, void 0, errorShape(catalogTarget.unknownCatalog ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, catalogTarget.message));
		return;
	}
	const initialTurn = resolveSessionCreateInitialTurn(p);
	if (!initialTurn) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create attachments require usable content"));
		return;
	}
	const { attachments, hasInitialTurn, message } = initialTurn;
	const repositoryCreation = resolveSessionRepositoryCreation(p, hasInitialTurn);
	if (!repositoryCreation.ok) {
		respond(false, void 0, repositoryCreation.error);
		return;
	}
	const repository = repositoryCreation.value;
	let sessionKey = explicitlyRequestedKey;
	const initialRunId = randomUUID();
	if (p.mentions?.length) {
		if (catalogId || p.incognito) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Human mentions are unavailable for this session mode. Remove the selected mentions to continue."));
			return;
		}
		sessionKey ??= buildDashboardSessionKey(explicitlyRequestedAgent.agentId);
		const normalized = normalizeChatSendRequest({
			params: {
				sessionKey,
				message: message ?? "",
				mentions: p.mentions,
				idempotencyKey: initialRunId
			},
			client
		});
		if (!normalized.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, normalized.error));
			return;
		}
		const eligible = context.mentionInbox?.validateRecipients(client, {
			agentId: explicitlyRequestedAgent.agentId,
			...p.visibility ? { visibility: p.visibility } : {}
		}, p.mentions.map((mention) => mention.profileId));
		if (!eligible?.ok) {
			respond(false, void 0, eligible?.error ?? errorShape(ErrorCodes.UNAVAILABLE, "Human mentions are unavailable; reconnect and retry."));
			return;
		}
	}
	let requestedCwd = normalizeOptionalString(p.cwd);
	const requestedExecNode = normalizeOptionalString(p.execNode);
	const requestedProjectId = normalizeOptionalString(p.projectId);
	const requestedProjectGitUrl = p.projectGitUrl;
	const projectPreparationError = validateSessionProjectPreparation({
		cwd: requestedCwd,
		execNode: requestedExecNode,
		gitUrl: requestedProjectGitUrl,
		hasInitialTurn,
		projectId: requestedProjectId
	});
	if (projectPreparationError) {
		respond(false, void 0, projectPreparationError);
		return;
	}
	if (!(!requestedCwd || (requestedExecNode ? path.isAbsolute(requestedCwd) || path.win32.isAbsolute(requestedCwd) : path.isAbsolute(requestedCwd)))) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd must be absolute"));
		return;
	}
	const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	if (p.permissionMode === "full" && client !== null && !clientScopes.includes("operator.admin")) {
		respond(false, void 0, missingScopeErrorShape({
			missingScope: ADMIN_SCOPE,
			requiredScopes: [ADMIN_SCOPE]
		}));
		return;
	}
	if (requestedCwd && !requestedExecNode && !clientScopes.includes("operator.admin")) {
		const containment = await resolveWorkspacePathContainment(requestedCwd, cfg);
		if (!containment) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}));
			return;
		}
		requestedCwd = containment.path;
	}
	const worktreeBaseRef = normalizeOptionalString(p.worktreeBaseRef);
	const requestedWorktreeName = normalizeOptionalString(p.worktreeName);
	const explicitSessionLabel = normalizeOptionalString(p.label);
	const preparedDisplayName = normalizeOptionalString(p.displayName);
	const titleAgentId = explicitlyRequestedAgent.agentId;
	const existingTargetEntry = explicitlyRequestedKey ? loadGatewaySessionEntryReadOnly(explicitlyRequestedKey, { agentId: titleAgentId }).entry : void 0;
	if (existingTargetEntry?.repositoryWorkspaceId && !repository) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Repository sessions require their original repository source; dispatch the existing session to continue."));
		return;
	}
	const deferWorktree = p.worktree === true && !emptyWorkspace && hasInitialTurn && !existingTargetEntry;
	let projectRoot;
	if (requestedProjectId) {
		const project = await resolveProjectRegistry(cfg, requestedProjectId);
		if (!project) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${requestedProjectId}`));
			return;
		}
		try {
			const checkout = p.worktree === true ? await resolveProjectCheckout(project.repoRoot) : void 0;
			projectRoot = checkout?.path ?? await resolveProjectDirectory(project.repoRoot);
			if (checkout && project.source !== "workspace" && checkout.path !== checkout.repoRoot) throw new ProjectCheckoutError(`project root is no longer a git checkout`);
		} catch (error) {
			const detail = error instanceof ProjectCheckoutError ? error.message : formatErrorMessage(error);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `project ${requestedProjectId} is unavailable (${detail}); update the agent workspace path or re-register the project`));
			return;
		}
	}
	let sessionAgentId = catalogAgentId ?? explicitlyRequestedAgent.agentId;
	if (repository) sessionKey ??= buildDashboardSessionKey(sessionAgentId);
	let preparedWorktree;
	const sessionExecCwd = requestedExecNode ? requestedCwd : void 0;
	let sessionCwd = requestedExecNode ? void 0 : projectRoot ?? requestedCwd;
	let prepareLifecycle;
	const preparedRoot = repository || emptyWorkspace ? void 0 : prepareSessionCreateFilesystemRoot({
		cfg,
		enforceSandboxContainment: Boolean(sessionCwd && !requestedExecNode && p.worktree !== true),
		requestedExecNode,
		requestedProjectId,
		sessionCwd,
		sessionKey,
		targetAgentId: sessionAgentId
	});
	if (preparedRoot && !preparedRoot.ok) {
		respond(false, void 0, preparedRoot.error);
		return;
	}
	sessionCwd = preparedRoot?.value.sessionCwd;
	if (repository) prepareLifecycle = prepareSessionRepositoryWorkspace(repository, {
		runSetupScript: clientScopes.includes(ADMIN_SCOPE),
		assertCurrent: commitGuard
	});
	if (p.worktree === true) {
		const agentId = explicitlyRequestedAgent.agentId;
		let targetKey = sessionKey;
		let preservesUnspecifiedKey = false;
		if (!targetKey && parentSessionKey && p.emitCommandHooks === true && !hasInitialTurn && cfg.session?.dmScope === "main") {
			const parentRequestedAgent = resolveRequestedSessionAgentId(cfg, parentSessionKey, agentId);
			if (!parentRequestedAgent.ok) {
				respond(false, void 0, parentRequestedAgent.error);
				return;
			}
			const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId: parentRequestedAgent.agentId });
			const parentAgentId = parentRequestedAgent.agentId;
			if (parent.entry?.sessionId && parent.canonicalKey === resolveAgentMainSessionKey({
				cfg,
				agentId: parentAgentId
			})) {
				targetKey = parent.canonicalKey;
				preservesUnspecifiedKey = true;
			}
		}
		targetKey ??= buildDashboardSessionKey(agentId);
		const target = resolveGatewaySessionStoreTarget({
			cfg,
			key: targetKey,
			agentId
		});
		sessionKey = preservesUnspecifiedKey ? void 0 : targetKey;
		sessionAgentId = target.agentId;
		const inheritParentWorktree = !emptyWorkspace && !projectRoot && !requestedCwd && !requestedProjectGitUrl && spawnRequesterSessionKey && spawnRequesterSessionKey === parentSessionKey && sessionCreation.actor?.type === "agent" && normalizeAgentId(sessionCreation.actor.id) === target.agentId;
		prepareLifecycle = async (lifecycleTarget) => {
			const prepared = await prepareSessionWorktreeCreation({
				cfg,
				target: lifecycleTarget,
				workspace: emptyWorkspace ? { kind: "empty" } : projectRoot ?? requestedCwd,
				inheritParentKey: inheritParentWorktree ? spawnRequesterSessionKey : void 0,
				projectGitUrl: requestedProjectGitUrl,
				name: requestedWorktreeName,
				baseRef: worktreeBaseRef,
				deferWorktree,
				label: explicitSessionLabel ?? preparedDisplayName,
				titleSource: buildDashboardSessionTitleSource({
					message: message ?? "",
					attachments
				}),
				currentUserMessage: message,
				useRequestedTitleSelection: Boolean(requestedModel && !personalModelSelection),
				runSetupScript: clientScopes.includes(ADMIN_SCOPE),
				signal,
				commitGuard,
				onTitleError: (error) => sessionLog.warn(`worktree title failed: ${formatErrorMessage(error)}`),
				onTitlePersisted: () => emitSessionsChanged(context, {
					sessionKey: lifecycleTarget.key,
					agentId: lifecycleTarget.agentId,
					reason: "chat.title"
				})
			});
			if (prepared.ok) preparedWorktree = prepared.value;
			return prepared;
		};
	}
	let runPayload;
	let runError;
	let runMeta;
	const allowExistingModelSelection = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, clientScopes).allowed;
	if (!authority.ensureActive()) return;
	const created = await createGatewaySession({
		cfg,
		key: sessionKey,
		agentId: sessionAgentId,
		label: p.label,
		displayName: preparedDisplayName,
		category: p.category,
		...catalogTarget ? { catalogTarget: catalogTarget.target } : {
			model: requestedModel,
			agentRuntime: p.agentRuntime
		},
		personalModelSelection,
		personalAccountDefaults,
		contextWindow: p.contextWindow,
		thinkingLevel: p.thinkingLevel,
		fastMode: p.fastMode,
		projectId: requestedProjectId,
		pendingProjectGitUrl: normalizeSessionProjectGitUrl(requestedProjectGitUrl),
		incognito: p.incognito,
		...client?.connect ? { requestingOperatorScopes: clientScopes } : {},
		...client?.authenticatedUserProfile ? { requestingOperatorProfileId: client.authenticatedUserProfile.profileId } : {},
		...client?.internal?.operatorRoleActor ? { operatorRoleActor: client.internal.operatorRoleActor } : {},
		visibility: p.visibility,
		allowExistingModelSelection,
		parentSessionKey,
		spawnDepth: p.spawnDepth,
		...resolveSessionCreateRootParameters(p, preparedRoot?.value),
		permissionMode: p.permissionMode,
		...p.toolOverrides !== void 0 ? { toolOverrides: p.toolOverrides } : {},
		prepareLifecycle,
		onLifecycleCleanupError: (error) => sessionLog.warn(`failed to finalize session worktree lifecycle: ${formatErrorMessage(error)}`),
		execNode: requestedExecNode,
		execCwd: sessionExecCwd,
		clearExecBinding: !requestedExecNode,
		clearSpawnedCwd: p.worktree !== true && !sessionCwd,
		fork: p.fork,
		forkFrom: p.forkFrom,
		...resolveSessionCreateSpawnContext({
			client,
			creation: sessionCreation,
			agentId: sessionAgentId,
			model: requestedModel,
			parentSessionKey,
			fork: p.fork,
			forkFrom: p.forkFrom,
			emitCommandHooks: p.emitCommandHooks,
			assertRuntimeCurrent: authority.commitGuard
		}),
		succeedsParent: p.succeedsParent,
		emitCommandHooks: p.emitCommandHooks,
		resetMainWhenUnspecified: !hasInitialTurn,
		commandSource: "webchat",
		creation: sessionCreation,
		authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
		armSessionDiffBaselineCapture: !repository,
		loadGatewayModelCatalogSnapshot: () => context.loadGatewayModelCatalogSnapshot({ agentId: sessionAgentId }),
		commitGuard,
		onCreatedSessionCommitted: (committed) => {
			sessionMutationAuthorization?.recordCreatedSession?.({
				agentId: committed.agentId,
				sessionKey: committed.key,
				storePath: committed.storePath,
				sessionId: committed.entry.sessionId,
				lifecycleRevision: committed.entry.lifecycleRevision
			});
		},
		afterCreate: async (session) => {
			if (!authority.hasActive()) return;
			if (!hasInitialTurn) {
				scheduleCreatedDashboardSessionTitle(session, cfg, context, p.titleSource);
				return;
			}
			const sendOptions = bindGatewayRequestHandlerMutationAuthority(options, {
				...options,
				params: {
					sessionKey: session.key,
					agentId: session.agentId,
					message: message ?? "",
					idempotencyKey: initialRunId,
					...p.timeoutMs !== void 0 ? { timeoutMs: p.timeoutMs } : {},
					...p.mentions ? { mentions: p.mentions } : {},
					...attachments ? { attachments } : {}
				},
				respond: (ok, payload, error, meta) => {
					if (ok && payload && typeof payload === "object") runPayload = payload;
					else runError = error;
					runMeta = meta;
				}
			}, void 0);
			await handleDirectExternalChatSend(sendOptions);
		}
	}).catch((error) => {
		if (error instanceof ModelAccountConnectAuthorityError) {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
			return;
		}
		return authority.handleClosedError(error);
	});
	if (!created) return;
	if (!created.ok) {
		respond(false, void 0, created.error);
		return;
	}
	if (created.postCommit.status === "failed") runError = errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(created.postCommit.error));
	await registerCreatedSessionCategory(normalizeOptionalString(p.category), context);
	const createdWorktree = preparedWorktree?.worktree ? {
		id: preparedWorktree.worktree.id,
		path: preparedWorktree.sessionRoot,
		branch: preparedWorktree.worktree.branch
	} : void 0;
	const responseEntry = sessionEntryForkedFromParent(created.entry) ? {
		...created.entry,
		forkedFromParent: true
	} : created.entry;
	const runStarted = !created.resetExisting && isFreshChatSendStarted({
		payload: runPayload,
		cached: runMeta?.cached === true
	});
	respond(true, {
		ok: true,
		key: created.key,
		sessionId: created.entry.sessionId,
		entry: responseEntry,
		runStarted,
		...!created.resetExisting && runPayload ? runPayload : {},
		...!created.resetExisting && runError ? { runError } : {},
		resolved: created.resolved,
		...createdWorktree ? { worktree: createdWorktree } : {}
	});
	emitSessionsChanged(context, {
		sessionKey: created.key,
		agentId: created.agentId,
		reason: created.resetExisting ? "new" : "create"
	});
	if (runStarted) emitSessionsChanged(context, {
		sessionKey: created.key,
		agentId: created.agentId,
		reason: "send"
	});
} };
sessionCreateHandlers["sessions.create"] = idempotentSessionCreate(expectDefined(sessionCreateHandlers["sessions.create"], "sessions.create handler"));
//#endregion
export { isFreshChatSendStarted as n, sessionCreateHandlers as t };
