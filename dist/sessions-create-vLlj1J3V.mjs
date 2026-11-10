import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { f as ModelAccountConnectAuthorityError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape, Om as SESSION_CREATE_IDEMPOTENCY_RETENTION_MS, Pg as missingScopeErrorShape, Zi as validateSessionsCreateParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-Bcx3NDQr.mjs";
import { n as runWithoutOwnedSessionTranscriptWrites } from "./transcript-write-context-owner-Dx0JDp93.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { o as sessionEntryForkedFromParent } from "./session-entry-lineage-B7Mubzwj.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { a as resolveSessionCreateAgentId, r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker, t as loadGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { n as bindGatewayDeviceRevocation, t as acceptGatewayDeviceSourceAuthority } from "./device-revocation-DpGQRUdo.mjs";
import { o as projectSessionFastModeEntryResult } from "./operator-model-presentation-C1cUPSmr.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { i as getNodeWorkerSupervisorTransport } from "./node-registry-private-Dv3TwbYd.mjs";
import "./server-constants-B-cmoH_0.mjs";
import { n as resolveOperatorSessionCreation } from "./session-creation-provenance-CZ3I7AOG.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-C4cbCE5S.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { t as assertPreparedSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { a as readGatewayRequestMutationAuthority, t as bindGatewayRequestHandlerMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as buildDashboardSessionTitleSource } from "./dashboard-session-title-2wgQueAj.mjs";
import { a as sessionWorkspaceReuseError, c as prepareRequiredWorkerSessionCreate, d as resolveSessionCreateInitialTurn, f as validateSessionCreateInitialMentions, i as resolveSessionCreateRootParameters, l as prepareSessionDeviceFolder, n as prepareSessionCreateRequestedCwd, o as assertRequiredWorkerSessionCreateCurrent, s as prepareRequiredWorkerCreatedSession, t as prepareSessionCreateFilesystemRoot, u as isFreshChatSendStarted } from "./session-create-root-lHgGqSce.mjs";
import { i as resolveSessionProjectRoot, n as prepareSessionWorktreeCreation } from "./session-worktree-preparation-M6dhYMsR.mjs";
import { t as reportCreatedVisibleWorkSession } from "./visible-work-sessions-BVD8mslg.mjs";
import { a as resolveSessionRepositoryCreation, c as prepareSkillLibrarySessionCreation, n as prepareSessionRepositoryWorkspace, o as validateSessionProjectPreparation, s as validateSessionWorktreeSelection, t as normalizeSessionProjectGitUrl } from "./session-create-project-TKtfF63d.mjs";
import { n as createAgentRuntimeAuthorityGuard } from "./agent-runtime-authority-B3KjbGu2.mjs";
import { o as gatewayClientUploadPolicyError } from "./upload-policy-Bd2Za3Ho.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import { t as captureAgentTurnPrincipal } from "./principal-DazrCi1V.mjs";
import { r as prepareSessionModelAccountAccess } from "./users-model-account-access-CmjctvSj.mjs";
import { n as scheduleCreatedDashboardSessionTitle } from "./chat-send-background-BXQQYKy6.mjs";
import "./sessions-shared-DECO-QN2.mjs";
import { t as resolveRegisteredCatalogCreateTarget } from "./session-catalog-DOBng7uc.mjs";
import { r as resolveSessionCreateCatalogSelectionError, t as createGatewaySession } from "./session-create-service-DUskvb_H.mjs";
import { t as buildDashboardSessionKey } from "./session-create-key-BJp-9Sd1.mjs";
import { n as createSessionModelCatalogWait } from "./session-model-catalog-wait-_D49l19T.mjs";
import { t as registerCommittedSessionCategory } from "./session-create-category-BCvaT6Og.mjs";
import { randomUUID } from "node:crypto";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/gateway/session-create-diagnostics.ts
const diagnosticsChannel = channel("openclaw.session.create");
function startSessionCreateDiagnostics() {
	const logEnabled = areDiagnosticsEnabledForProcess() && sessionLog.isEnabled("warn");
	if (!logEnabled && !diagnosticsChannel.hasSubscribers) return;
	const timing = createStageTimingTracker(() => performance.now());
	let phase = "preflight";
	const mark = (next) => {
		timing.mark(phase);
		phase = next;
	};
	return {
		mark,
		[Symbol.dispose]() {
			mark("handlerExit");
			const snapshot = timing.snapshot();
			const shouldLog = logEnabled && snapshot.totalMs >= 1e3 && areDiagnosticsEnabledForProcess();
			if (!shouldLog && !diagnosticsChannel.hasSubscribers) return;
			const phaseDurationsMs = {};
			for (const stage of snapshot.stages) phaseDurationsMs[stage.name] = (phaseDurationsMs[stage.name] ?? 0) + stage.durationMs;
			const fields = {
				elapsedMs: snapshot.totalMs,
				phaseDurationsMs
			};
			try {
				diagnosticsChannel.publish(fields);
				if (shouldLog) sessionLog.warn("slow session create", fields);
			} catch {}
		}
	};
}
//#endregion
//#region src/gateway/server-methods/session-create-idempotency.ts
const sessionCreatesByContext = /* @__PURE__ */ new WeakMap();
function idempotentSessionCreate(handler) {
	return async (request) => {
		const respond = (...args) => {
			if (args[0] && args.length > 1) args[1] = projectSessionFastModeEntryResult(args[1], request.client);
			request.respond(...args);
		};
		const idempotencyKey = request.params.idempotencyKey;
		if (typeof idempotencyKey !== "string" || !idempotencyKey) {
			await handler(bindGatewayRequestHandlerMutationAuthority(request, {
				...request,
				respond
			}, void 0));
			return;
		}
		const principal = request.client?.authenticatedUserProfile?.profileId ?? request.client?.authenticatedUserId;
		const deviceId = request.client?.connect.device?.id?.trim();
		if (!principal && !deviceId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "idempotent session creation requires an authenticated principal or device identity"));
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
		const requestIdentity = sha256Hex(stableStringify(request.params));
		const authorization = {
			role: request.client?.connect.role ?? null,
			scopes: request.client?.connect.scopes?.toSorted() ?? []
		};
		const existing = entries?.get(idempotencyKey);
		if (existing) {
			if (existing.requestIdentity !== requestIdentity) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session creation idempotency key was reused with different parameters"));
				return;
			}
			if (existing.authorization.role !== authorization.role) {
				respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "session creation authorization changed; start again"));
				return;
			}
			const missingScope = existing.authorization.scopes.find((scope) => !authorization.scopes.includes(scope));
			if (missingScope) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope,
					requiredScopes: existing.authorization.scopes
				}));
				return;
			}
			const result = existing.state.kind === "completed" ? existing.state.result : await existing.state.work;
			respond(result.ok, result.payload, result.error, {
				...result.meta,
				cached: true
			});
			return;
		}
		if ((entries?.size ?? 0) >= 1e3 || retainedEntryCount >= 2e3) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session creation capacity is full; retry later"));
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
		respond(result.ok, result.payload, result.error, result.meta);
	};
}
//#endregion
//#region src/gateway/server-methods/session-create-spawn.ts
async function reportCreatedVisibleSpawn(cfg, creation, session, publicRead) {
	const parentSessionKey = session.entry.parentSessionKey;
	if (creation.via !== "spawn" || creation.requesterSessionKey !== parentSessionKey || !parentSessionKey || session.entry.visibility === "draft" || session.entry.incognito) return;
	const url = resolveControlUiSessionUrl(cfg, {
		sessionKey: session.key,
		fallbackAgentId: session.agentId
	});
	await reportCreatedVisibleWorkSession({
		requesterSessionKey: parentSessionKey,
		sessionKey: session.key,
		...url ? { visibleSession: {
			url,
			...publicRead ? { publicRead: true } : {},
			...session.entry.label ? { label: session.entry.label } : {}
		} } : {}
	});
}
function validateSessionCreateSpawnRequest(creation, params) {
	const parent = normalizeOptionalString(params.parentSessionKey);
	const requester = creation.via === "spawn" ? normalizeOptionalString(creation.requesterSessionKey) : void 0;
	if (creation.inheritedToolPolicy && parent !== requester) return errorShape(ErrorCodes.INVALID_REQUEST, "spawn parent must match the trusted agent caller");
	if (creation.childSessionPublication && (creation.via !== "spawn" || requester !== parent || creation.childSessionPublication.requesterSessionKey !== parent || params.fork === true || params.forkFrom !== void 0 || params.incognito === true || params.visibility === "draft")) return errorShape(ErrorCodes.INVALID_REQUEST, "Public ingress requires a fresh isolated, non-private child.");
}
function resolveSessionCreateSpawnContext(params) {
	const spawnToolPolicy = params.creation.via === "spawn" && params.creation.inheritedToolPolicy ? {
		...params.creation.inheritedToolPolicy,
		...params.creation.completionOwnerSessionKey ? { completionOwnerSessionKey: params.creation.completionOwnerSessionKey } : {}
	} : void 0;
	if (params.creation.via !== "spawn" || !params.creation.inheritedToolPolicy || params.creation.actor?.type !== "agent") {
		if (params.creation.inheritedPermissionMode) throw new Error("Permission inheritance requires a trusted spawn requester.");
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
	if (!requester || requester.sessionKey !== requesterSessionKey || requesterSessionKey !== params.parentSessionKey || normalizeAgentId(params.creation.actor.id) !== normalizeAgentId(requester.agentId)) {
		if (params.creation.inheritedPermissionMode) throw new Error("Permission inheritance requires a current matching spawn requester.");
		if (params.creation.resolvedModel) throw new Error("Resolved model inheritance requires a current same-agent requester.");
		return { spawnToolPolicy };
	}
	const preparedPermissionSelection = params.creation.inheritedPermissionMode ? {
		mode: params.creation.inheritedPermissionMode,
		assertCurrent: requester.assertCurrent
	} : void 0;
	if (normalizeAgentId(requester.agentId) !== params.agentId) {
		if (params.creation.resolvedModel) throw new Error("Resolved model inheritance requires a current same-agent requester.");
		return {
			spawnToolPolicy,
			preparedPermissionSelection
		};
	}
	const resolvedModel = params.creation.resolvedModel;
	if (resolvedModel && params.model !== `${resolvedModel.provider}/${resolvedModel.model}`) throw new Error("Resolved spawn model does not match the requested model.");
	const preparedModelSelection = resolvedModel ? {
		ref: { ...resolvedModel },
		assertCurrent: requester.assertCurrent
	} : void 0;
	if (params.fork !== true || params.forkFrom !== void 0 || params.emitCommandHooks === true) return {
		spawnToolPolicy,
		preparedModelSelection,
		preparedPermissionSelection
	};
	return {
		spawnToolPolicy,
		preparedModelSelection,
		preparedPermissionSelection,
		activeParentFork: {
			requesterSessionKey: requester.sessionKey,
			assertCurrent: requester.assertCurrent
		}
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-create.ts
const loadChatSendExternalEntry = createLazyRuntimeModule(() => import("./chat-send-external-entry-DwfhNXfh.mjs"));
const sessionCreateHandlers = { "sessions.create": idempotentSessionCreate(async (options) => {
	try {
		var _usingCtx$1 = _usingCtx();
		const diagnostics = _usingCtx$1.u(startSessionCreateDiagnostics());
		const { params, respond, context, client, sessionMutationAuthorization, signal, hasCurrentClientAuthority } = options;
		if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond)) return;
		const uploadError = gatewayClientUploadPolicyError({
			method: "sessions.create",
			requestParams: params,
			client,
			context
		});
		if (uploadError) {
			respond(false, void 0, uploadError);
			return;
		}
		const p = structuredClone(params);
		const requiredWorker = prepareRequiredWorkerSessionCreate(p, context.getRuntimeConfig());
		if (requiredWorker.error) {
			respond(false, void 0, requiredWorker.error);
			return;
		}
		const { requiredProfile, automaticEmptyWorkspace } = requiredWorker;
		const requestAuthority = readGatewayRequestMutationAuthority(options);
		const getCurrentConfig = context.getRuntimeConfig;
		const requestingOperatorProfileId = client?.authenticatedUserProfile?.profileId;
		const operatorRoleActor = client?.internal?.operatorRoleActor ? { ...client.internal.operatorRoleActor } : void 0;
		const emptyWorkspace = p.worktreeSource === "empty";
		const worktreeSelectionError = validateSessionWorktreeSelection(p);
		if (worktreeSelectionError) {
			respond(false, void 0, worktreeSelectionError);
			return;
		}
		const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
		const creation = resolveOperatorSessionCreation(client, { allowTrustedHint: true });
		if (p.surface && creation.via !== "operator") {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Dock conversations require operator creation"));
			return;
		}
		const sessionCreation = await prepareSkillLibrarySessionCreation(client, context.getRuntimeConfig, {
			...creation,
			...p.surface ? { surface: p.surface } : {}
		});
		const spawnRequesterSessionKey = sessionCreation.via === "spawn" ? normalizeOptionalString(sessionCreation.requesterSessionKey) : void 0;
		const spawnError = validateSessionCreateSpawnRequest(sessionCreation, p);
		if (spawnError) {
			respond(false, void 0, spawnError);
			return;
		}
		const requestedModel = normalizeOptionalString(p.model);
		let personalAccounts;
		try {
			personalAccounts = await prepareSessionModelAccountAccess(options, requestedModel);
		} catch (error) {
			if (!(error instanceof ModelAccountConnectAuthorityError)) throw error;
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, error.message));
			return;
		}
		const { personalModelSelection, personalAccountDefaults } = personalAccounts;
		const cfg = getCurrentConfig();
		const authority = createAgentRuntimeAuthorityGuard(client, context, respond);
		const assertSessionCreateCurrent = Object.assign(bindGatewayDeviceRevocation(() => {
			requestAuthority.assertCurrent();
			assertRequiredWorkerSessionCreateCurrent(getCurrentConfig(), requiredProfile, p);
			authority.commitGuard?.();
			sessionMutationAuthorization?.assertCurrent();
			assertPreparedSkillLibrarySelection(sessionCreation.skillLibrarySelections);
		}, hasCurrentClientAuthority), { retain: sessionMutationAuthorization?.retain });
		const deviceFolderAuthority = {};
		const commitGuard = () => {
			assertSessionCreateCurrent();
			personalModelSelection?.assertCurrent();
			personalAccountDefaults?.assertCurrent();
			deviceFolderAuthority.assertCurrent?.();
		};
		const operatorCapture = _usingCtx$1.a({
			preparation: captureGatewayOperatorRunAuthority({
				client,
				context,
				hasCurrentClientAuthority,
				invocationAuthority: {
					assertCurrent: commitGuard,
					signal
				}
			}),
			async [Symbol.asyncDispose]() {
				(await this.preparation.catch(() => void 0))?.release();
			}
		});
		operatorCapture.preparation.catch(() => {});
		const catalogId = normalizeOptionalString(p.catalogId);
		const catalogError = resolveSessionCreateCatalogSelectionError(p);
		if (catalogError) {
			respond(false, void 0, catalogError);
			return;
		}
		const explicitlyRequestedKey = normalizeOptionalString(p.key);
		const explicitlyRequestedAgent = resolveSessionCreateAgentId(cfg, {
			key: explicitlyRequestedKey,
			agentId: p.agentId,
			parentSessionKey
		});
		if (!explicitlyRequestedAgent.ok) {
			respond(false, void 0, explicitlyRequestedAgent.error);
			return;
		}
		const catalogAgentId = catalogId ? normalizeAgentId(parseAgentSessionKey(explicitlyRequestedKey ?? "global")?.agentId ?? explicitlyRequestedAgent.agentId) : void 0;
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
			const mentionError = await validateSessionCreateInitialMentions({
				client,
				context,
				agentId: explicitlyRequestedAgent.agentId,
				sessionKey,
				message,
				mentions: p.mentions,
				visibility: p.visibility,
				runId: initialRunId
			});
			if (mentionError) {
				respond(false, void 0, mentionError);
				return;
			}
		}
		const preparedFolder = p.deviceFolder ? await prepareSessionDeviceFolder({
			folder: p.deviceFolder,
			transport: getNodeWorkerSupervisorTransport(context.nodeRegistry),
			assertCurrent: commitGuard,
			signal
		}) : void 0;
		if (preparedFolder && !preparedFolder.ok) {
			respond(false, void 0, preparedFolder.error);
			return;
		}
		const deviceFolder = preparedFolder?.value.deviceFolder;
		deviceFolderAuthority.assertCurrent = preparedFolder?.value.assertCurrent;
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
		const clientScopes = Array.isArray(client?.connect?.scopes) ? [...client.connect.scopes] : [];
		const preparedCwd = await prepareSessionCreateRequestedCwd({
			cfg,
			requestedCwd,
			requestedExecNode,
			permissionMode: p.permissionMode,
			clientPresent: client !== null,
			clientScopes
		});
		if (!preparedCwd.ok) {
			respond(false, void 0, preparedCwd.error);
			return;
		}
		requestedCwd = preparedCwd.value;
		const worktreeBaseRef = normalizeOptionalString(p.worktreeBaseRef);
		const requestedWorktreeName = normalizeOptionalString(p.worktreeName);
		const explicitSessionLabel = normalizeOptionalString(p.label);
		const preparedDisplayName = normalizeOptionalString(p.displayName);
		const titleAgentId = explicitlyRequestedAgent.agentId;
		if (!authority.ensureActive()) return;
		const existingTargetEntry = explicitlyRequestedKey ? (await loadGatewaySessionEntryReadOnlyInWorker({
			cfg,
			key: explicitlyRequestedKey,
			agentId: titleAgentId
		})).entry : void 0;
		const reuseError = sessionWorkspaceReuseError(p, automaticEmptyWorkspace, existingTargetEntry);
		if (reuseError) {
			respond(false, void 0, reuseError);
			return;
		}
		const deferWorktree = p.worktree === true && !emptyWorkspace && hasInitialTurn && !existingTargetEntry;
		let projectRoot;
		if (requestedProjectId) {
			const project = await resolveSessionProjectRoot(cfg, requestedProjectId, p.worktree === true);
			if (!project.ok) {
				respond(false, void 0, project.error);
				return;
			}
			projectRoot = project.value;
		}
		let sessionAgentId = catalogAgentId ?? explicitlyRequestedAgent.agentId;
		if (repository) sessionKey ??= buildDashboardSessionKey(sessionAgentId, { incognito: p.incognito });
		let preparedWorktree;
		const sessionExecCwd = requestedExecNode ? requestedCwd : void 0;
		let sessionCwd = requestedExecNode ? void 0 : projectRoot ?? requestedCwd;
		let prepareLifecycle;
		const preparedRoot = repository || emptyWorkspace || deviceFolder ? void 0 : prepareSessionCreateFilesystemRoot({
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
				const parent = await loadGatewaySessionEntryReadOnlyInWorker({
					cfg,
					key: parentSessionKey,
					agentId: parentRequestedAgent.agentId,
					assertActive: commitGuard
				});
				const parentAgentId = parentRequestedAgent.agentId;
				if (parent.entry?.sessionId && parent.canonicalKey === resolveAgentMainSessionKey({
					cfg,
					agentId: parentAgentId
				})) {
					targetKey = parent.canonicalKey;
					preservesUnspecifiedKey = true;
				}
			}
			targetKey ??= buildDashboardSessionKey(agentId, { incognito: p.incognito });
			const target = await resolveGatewaySessionStoreTargetInWorker({
				cfg,
				key: targetKey,
				agentId,
				assertActive: commitGuard
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
					runSetupScript: !requiredProfile && clientScopes.includes("operator.admin"),
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
		let publicRead = false;
		let runPayload;
		let sessionSourceAccepted = false;
		let runError;
		let runMeta;
		const allowExistingModelSelection = authorizeOperatorScopesForRequiredScope(ADMIN_SCOPE, clientScopes).allowed;
		const catalogWait = createSessionModelCatalogWait([signal, client?.connectionSignal]);
		const createParams = {
			cfg,
			getCurrentConfig,
			onPhase: diagnostics?.mark,
			operatorAuthority: operatorCapture.preparation,
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
			deviceFolder,
			pendingProjectGitUrl: normalizeSessionProjectGitUrl(requestedProjectGitUrl),
			incognito: p.incognito,
			...client?.connect ? { requestingOperatorScopes: clientScopes } : {},
			...requestingOperatorProfileId ? { requestingOperatorProfileId } : {},
			...operatorRoleActor ? { operatorRoleActor } : {},
			visibility: p.visibility,
			allowExistingModelSelection,
			parentSessionKey,
			spawnDepth: p.spawnDepth,
			...resolveSessionCreateRootParameters(p, preparedRoot?.value),
			permissionMode: p.permissionMode,
			...p.toolOverrides !== void 0 ? { toolOverrides: p.toolOverrides } : {},
			...p.communication !== void 0 ? { communication: p.communication } : {},
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
			childSessionPublication: sessionCreation.childSessionPublication,
			authorizedPluginId: normalizeOptionalString(client?.internal?.pluginRuntimeOwnerId),
			armSessionDiffBaselineCapture: !repository && !deviceFolder,
			loadGatewayModelCatalogSnapshot: async () => {
				const captured = await operatorCapture.preparation;
				return catalogWait.run(() => context.loadGatewayModelCatalogSnapshot({ agentId: sessionAgentId }), captured?.authority.signal);
			},
			commitGuard,
			bindSharingCreation: (operation) => sessionMutationAuthorization?.bindCreation?.(p, operation),
			followSharingRegistration: sessionMutationAuthorization?.followRegistration,
			afterSessionCommitted: (entry, source) => registerCommittedSessionCategory(entry.category === normalizeOptionalString(p.category) ? entry.category : void 0, context, source),
			onCreatedSessionCommitted: (committed) => {
				publicRead = Boolean(resolveSessionPublicShare(committed.entry));
				sessionMutationAuthorization?.recordCreatedSession?.({
					agentId: committed.agentId,
					sessionKey: committed.key,
					storePath: committed.storePath,
					sessionId: committed.entry.sessionId,
					entry: committed.entry,
					lifecycleRevision: committed.entry.lifecycleRevision
				});
				if ((hasInitialTurn || requiredProfile) && requestAuthority.family === "worker") sessionSourceAccepted = acceptGatewayDeviceSourceAuthority(hasCurrentClientAuthority);
			},
			afterCreate: async (session) => {
				if (!authority.hasActive()) return;
				await prepareRequiredWorkerCreatedSession({
					requiredProfile,
					pendingWorktree: Boolean(preparedWorktree?.pendingWorktree),
					requestedProjectGitUrl,
					prepare: context.workerPlacementDispatchService?.withRequiredSession,
					session,
					assertCurrent: assertSessionCreateCurrent,
					retainDispatch: sessionMutationAuthorization?.retain,
					signal
				});
				await reportCreatedVisibleSpawn(cfg, sessionCreation, session, publicRead);
				if (!hasInitialTurn) {
					scheduleCreatedDashboardSessionTitle(session, cfg, context, p.titleSource);
					return;
				}
				const { handleDirectExternalChatSend } = await loadChatSendExternalEntry();
				const sendOptions = bindGatewayRequestHandlerMutationAuthority(options, {
					...options,
					client: sessionSourceAccepted ? captureAgentTurnPrincipal(client) : client,
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
				assertSessionCreateCurrent();
				await runWithoutOwnedSessionTranscriptWrites(() => handleDirectExternalChatSend(sendOptions));
			}
		};
		const created = await createGatewaySession(createParams).catch((error) => {
			if (error === catalogWait.unavailable) {
				respond(false, void 0, catalogWait.unavailable.error);
				return;
			}
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
		diagnostics?.mark("response");
		respond(true, {
			ok: true,
			key: created.key,
			sessionId: created.entry.sessionId,
			entry: responseEntry,
			runStarted,
			publicRead,
			...!created.resetExisting && runPayload ? runPayload : {},
			...!created.resetExisting && runError ? { runError } : {},
			resolved: created.resolved,
			...createdWorktree ? { worktree: createdWorktree } : {}
		});
		diagnostics?.mark("handlerExit");
		for (const reason of [created.resetExisting ? "new" : "create", ...runStarted ? ["send"] : []]) emitSessionsChanged(context, {
			sessionKey: created.key,
			agentId: created.agentId,
			reason
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}) };
//#endregion
export { sessionCreateHandlers as t };
