import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as openOpenClawStateDatabase } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { b as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-BaxMDLZF.mjs";
import { t as assertAgentRunLifecycleGenerationCurrent, u as isAgentEventLifecycleGenerationCurrent } from "./agent-events-GvNTkbe3.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { s as isOperatorUiClient } from "./message-channel-j-k-Nup3.mjs";
import { h as selectResolvedUserProfileMetadataById } from "./user-profiles-internal-DlO1LBbo.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { c as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { d as retainGatewayDeviceRevocation } from "./device-revocation-DeateGFe.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BPRn5nuX.mjs";
import { k as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { a as loadSessionEntry, s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as invalidSessionRequest } from "./session-request-agent-Bxi11ET4.mjs";
import { a as getGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { l as waitForChatAbortTerminalPersistence } from "./chat-abort-lifecycle-internal-t_mR3jTJ.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-DsJ_Zmkt.mjs";
import { t as abortQueuedChatTurnById } from "./chat-queued-turns-Dn_FgmH5.mjs";
import { d as validateSkillLibraryPath } from "./bundle-Cu4zt9nj.mjs";
import { s as seedSkillLibrarySelection } from "./selection-Cr4O9thc.mjs";
import { u as resolveSkillLibraryActor } from "./store-BeSK43aH.mjs";
import { c as prepareGitHubReadIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { n as resolveExplicitSessionName, t as hasExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { n as generateWorktreeSessionTitle } from "./dashboard-session-title-DnKo2TYK.mjs";
import { m as resolveProjectDirectory } from "./project-registry-B7e5lNuh.mjs";
import { t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DZxHdqNB.mjs";
import { i as resolveSessionWorktreeBase, t as prepareSessionWorktree } from "./session-worktree-preparation-CWfBk4O-.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-DOlcA8dE.mjs";
import { r as githubApiToken } from "./github-public-api-COOMiXSo.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-BfEknC6Y.mjs";
import { i as deferAbortedPartialPersistence, r as captureAbortedPartial } from "./chat-aborted-partial-Mg2KV-kb.mjs";
import { n as refreshProjectClone, t as materializeProjectClone } from "./project-clone-C7OBrO47.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import { r as hasActiveAgentRuntimeAuthority } from "./agent-runtime-authority-Bf7e1KZt.mjs";
import { a as mutateSkillLibrary, c as saveSkillLibrary, i as listSkillLibrary, n as libraryAuthority, o as readSkillLibrary, s as resolveSkillLibraryPresentation, t as activateLibrarySelection } from "./skills-library-i_dBp6h1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/skill-library-session.ts
/** Selection is prepared from this request's real principal, never reconstructed from provenance. */
async function prepareSkillLibrarySessionCreation(client, cfg, creation) {
	if (!client?.authenticatedUserProfile || client.internal?.syntheticClient || creation.via === "spawn") return creation;
	return {
		...creation,
		skillLibrarySelections: await seedSkillLibrarySelection({
			profileId: client.authenticatedUserProfile.profileId,
			scopes: client.connect.scopes ?? [],
			getConfig: typeof cfg === "function" ? cfg : () => cfg,
			assertCurrent: () => {}
		})
	};
}
//#endregion
//#region src/gateway/operator-run-cancellation.ts
/** Retain authority before its execution or queue owner can arm cancellation. */
async function retainGatewayOperatorRun(params) {
	const captured = await captureGatewayOperatorRunAuthority(params);
	const releaseSource = captured?.release ?? retainGatewayDeviceRevocation(params.hasCurrentClientAuthority);
	const signal = captured?.authority.signal;
	const cancellation = signal && params.entry ? createGatewayOperatorRunCancellation({
		signal,
		runId: params.runId,
		entry: params.entry,
		context: params.context
	}) : void 0;
	return {
		authority: captured?.authority,
		armCancellation: () => cancellation?.arm(),
		retireCancellation: () => cancellation?.release(),
		release: () => {
			cancellation?.release();
			releaseSource?.();
		}
	};
}
/** Queue retirement detaches cancellation while the original authority can still settle work. */
function createGatewayOperatorRunCancellation(params) {
	const { signal, runId, entry, context } = params;
	const controller = entry.controller;
	const sessionKey = entry.sessionKey;
	const lifecycleGeneration = entry.lifecycleGeneration;
	let released = false;
	let armed = false;
	let cancellationStarted = false;
	const ownsLifetime = () => !released && (!lifecycleGeneration || isAgentEventLifecycleGenerationCurrent(lifecycleGeneration));
	const ownsActiveRun = () => ownsLifetime() && context.chatAbortControllers.get(runId) === entry && entry.controller === controller && entry.sessionKey === sessionKey && !entry.registrationCleanupRequested && entry.projectSessionTerminalPersistence === void 0 && entry.projectSessionTerminalPersisted !== true && isChatAbortControllerEntryAbortable(entry);
	const cancelQueuedTurn = () => {
		const queued = context.chatQueuedTurns.get(runId);
		if (!ownsLifetime() || queued?.controller !== controller || queued.abortable === false) return;
		abortQueuedChatTurnById(context.chatQueuedTurns, {
			runId,
			sessionKey: queued.sessionKey,
			stopReason: "rpc",
			diagnosticReason: "authority-revoked"
		});
	};
	const cancel = async () => {
		if (context.chatQueuedTurns.get(runId)?.controller === controller) {
			cancelQueuedTurn();
			return;
		}
		if (!ownsActiveRun()) return;
		const text = context.chatRunState.resolveBuffer(runId, { final: true }).text;
		const snapshot = entry.controlUiVisible !== false && text.trim() ? captureAbortedPartial({
			runId,
			sessionKey,
			sessionId: entry.sessionId,
			agentId: entry.agentId,
			text,
			abortOrigin: "rpc",
			resolveTerminalProducer: entry.resolveTerminalProducer
		}) : void 0;
		const { aborted } = abortChatRunById(createChatAbortOps(context), {
			runId,
			sessionKey,
			stopReason: "rpc",
			diagnosticReason: "authority-revoked",
			onAbortCommitted: () => deferAbortedPartialPersistence(snapshot, context)
		});
		if (!aborted) return;
		const failures = (await Promise.allSettled([waitForChatAbortTerminalPersistence(entry), ...snapshot ? [import("./chat-transcript-persistence.runtime.js").then((transcript) => transcript.persistAbortedPartials({
			context,
			snapshots: [snapshot]
		}))] : []])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Operator access cancellation did not fully settle");
	};
	const onAbort = () => {
		if (released || cancellationStarted) return;
		cancellationStarted = true;
		context.trackExecution(cancel).catch((error) => {
			context.logGateway.warn(`Operator access cancellation failed: ${formatForLog(error)}`);
		});
	};
	return {
		arm: () => {
			if (released || armed) return;
			armed = true;
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		},
		release: () => {
			released = true;
			signal.removeEventListener("abort", onAbort);
		}
	};
}
//#endregion
//#region src/gateway/session-input-participant.ts
/** Only the live authenticated profile establishes a person; client metadata stays unresolved. */
function resolveGatewayInputParticipant(client, provenance) {
	if (!client || client.internal?.syntheticClient || provenance && provenance.kind !== "external_user") return;
	const profileId = client.authenticatedUserProfile?.profileId;
	if (profileId) return {
		type: "profile",
		id: profileId
	};
	const clientInfo = client.connect?.client;
	return !clientInfo || isOperatorUiClient(clientInfo) ? void 0 : {
		type: "observation",
		pluginId: null,
		accountId: null,
		senderKind: "unknown",
		id: clientInfo.id
	};
}
//#endregion
//#region src/gateway/project-github-identity.ts
/** Prepare the protected native identity only for hosts that explicitly opted projects into it. */
async function prepareGatewayProjectGitHubIdentity(params) {
	if (params.config.gateway?.projects?.nativeGitHubSearch !== true) return;
	return await prepareGitHubReadIdentity({
		config: params.config,
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? params.config,
		agentId: params.agentId,
		env: process.env,
		getCurrentConfig: params.context.getRuntimeConfig,
		assertActive: params.assertActive,
		refresh: async () => {}
	});
}
//#endregion
//#region src/gateway/server-methods/session-create-project.ts
const SESSION_PROJECT_OWNERSHIP_ERROR = "Session changed while preparing its project; retry the task.";
const workspacePreparations = new KeyedAsyncQueue();
function resolveSessionRepositoryCreation(params, hasInitialTurn) {
	if (!params.repository) return ok(void 0);
	const url = normalizeSessionProjectGitUrl(params.repository.url);
	const ref = params.repository.ref?.trim();
	if (!url || ref !== void 0 && (!ref || ref.startsWith("-") || /\s|\0/u.test(ref))) return invalidSessionRequest("Use a GitHub repository URL and a nonempty branch, tag, or commit ref.");
	if (params.cwd || params.execNode || params.projectId || params.projectGitUrl || params.worktree !== void 0 || params.worktreeBaseRef || params.worktreeName || params.catalogId) return invalidSessionRequest("sessions.create repository cannot be combined with local workspace or catalog options.");
	if (hasInitialTurn) return invalidSessionRequest("Create the repository session without an initial turn, dispatch it with sessions.dispatch, then send the message with sessions.send.");
	return ok({
		url,
		...ref ? { ref } : {}
	});
}
function prepareSessionRepositoryWorkspace(repository, options) {
	const { assertCurrent } = options;
	return async (target) => {
		const store = getSessionRepositoryWorkspaceStore();
		const source = captureOpenClawStateWorkerContext({ path: store.path });
		const assertSourceCurrent = () => {
			source.admission.assertCurrent();
			assertCurrent();
		};
		const existing = await store.find({
			agentId: target.agentId,
			sessionKey: target.key
		});
		if (target.entry && (!target.entry.repositoryWorkspaceId || target.entry.repositoryWorkspaceId !== existing?.workspaceId)) return invalidSessionRequest("repository source requires a new repository session");
		if (existing && (existing.url !== repository.url || existing.requestedRef !== (repository.ref ?? null))) return invalidSessionRequest("session repository source cannot be changed");
		assertSourceCurrent();
		const workspace = await store.create({
			agentId: target.agentId,
			sessionKey: target.key,
			url: repository.url,
			requestedRef: repository.ref,
			runSetupScript: options.runSetupScript,
			assertCurrent: assertSourceCurrent
		});
		const withCommit = (run) => runOpenClawStateWorkerOperation(source, () => run(assertSourceCurrent), { assertCurrent: assertSourceCurrent });
		return ok({
			repositoryWorkspaceId: workspace.workspaceId,
			withCommit,
			...!existing ? { rollback: async () => {
				source.admission.assertCurrent();
				const prepared = await store.prepare(workspace.workspaceId);
				await store.delete({
					workspaceId: workspace.workspaceId,
					assertCurrent: () => {
						source.admission.assertCurrent();
						const current = prepared.current();
						if (current && (current.agentId !== target.agentId || current.sessionKey !== target.key || current.revision !== workspace.revision)) throw new Error("Repository preparation changed before rollback");
					}
				});
			} } : {}
		});
	};
}
function normalizeSessionProjectGitUrl(value) {
	return typeof value === "string" && value.length <= 2048 ? parseConfiguredProjectGitUrl(value)?.url : void 0;
}
function validateSessionProjectPreparation(params) {
	if (!params.gitUrl) return params.projectId && (params.cwd || params.execNode) ? errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectId cannot be combined with cwd or execNode") : void 0;
	if (!normalizeSessionProjectGitUrl(params.gitUrl)) return errorShape(ErrorCodes.INVALID_REQUEST, "Use a GitHub HTTPS or git@github.com repository URL. Local paths and file URLs are not accepted.");
	if (params.projectId || params.cwd || params.execNode) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectGitUrl cannot be combined with projectId, cwd, or execNode");
	return params.hasInitialTurn ? void 0 : errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create projectGitUrl requires an initial turn");
}
/** Bind persisted workspace intent only while its exact admitted run remains authoritative. */
async function prepareSessionWorkspace(params) {
	const { admission, client, context, session } = params;
	const { entry, clientRunId, sessionKey } = session;
	if (!entry) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
	const { controller } = admission.activeRunAbort;
	const signal = controller.signal;
	const assertRunOwnership = () => {
		signal.throwIfAborted();
		const activeRun = context.chatAbortControllers.get(clientRunId);
		if (!activeRun || activeRun !== admission.activeRunAbort.entry || activeRun.controller !== controller || activeRun.sessionKey !== sessionKey || activeRun.sessionId !== entry.sessionId || entry.sessionId !== admission.admittedSessionId || activeRun.lifecycleGeneration !== admission.lifecycleGeneration || activeRun.projectSessionActive === false || activeRun.projectSessionTerminalPending === true || activeRun.projectSessionTerminalPersisted === true || !hasActiveAgentRuntimeAuthority(client, context)) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		assertAgentRunLifecycleGenerationCurrent(admission.lifecycleGeneration);
	};
	await prepareSessionWorkspaceForRun({
		...session,
		entry,
		runId: clientRunId,
		context,
		signal,
		assertCurrent: assertRunOwnership,
		runSetupScript: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true
	});
	return assertRunOwnership;
}
/** The admitted turn supplies authority; this owner prepares and binds its saved workspace. */
async function prepareSessionWorkspaceForRun(params) {
	const { entry, cfg, agentId, runId: clientRunId, sessionKey, storePath, context, signal } = params;
	const assertRunOwnership = () => {
		signal.throwIfAborted();
		params.assertCurrent();
	};
	assertRunOwnership();
	emitAgentRunStatusEvent({
		runId: clientRunId,
		sessionKey,
		agentId,
		phase: "preparing_workspace"
	});
	await workspacePreparations.enqueue(`${storePath}\0${sessionKey}`, async () => {
		assertRunOwnership();
		const target = {
			agentId,
			sessionKey,
			storePath
		};
		const saved = loadSessionEntry(target);
		if (!saved || saved.sessionId !== entry.sessionId || saved.lifecycleRevision !== entry.lifecycleRevision) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		let pending = saved.pendingWorktree;
		const assertSavedWorkspaceIntent = (current) => {
			assertRunOwnership();
			if (current.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.projectId !== saved.projectId || current.pendingProjectGitUrl !== saved.pendingProjectGitUrl || !isDeepStrictEqual(current.pendingWorktree, pending)) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		};
		const gitUrl = normalizeSessionProjectGitUrl(saved.pendingProjectGitUrl);
		if (Object.hasOwn(saved, "pendingProjectGitUrl") && (!gitUrl || gitUrl !== saved.pendingProjectGitUrl)) throw new Error("Saved project repository is invalid; select the repository and retry.");
		if (!pending && !gitUrl) {
			Object.assign(entry, saved);
			delete entry.pendingProjectGitUrl;
			delete entry.pendingWorktree;
			return;
		}
		const configuredToken = gitUrl ? githubApiToken(process.env, cfg) : void 0;
		const projectIdentity = gitUrl && !configuredToken ? await prepareGatewayProjectGitHubIdentity({
			agentId,
			assertActive: assertRunOwnership,
			config: cfg,
			context
		}) : void 0;
		const projectToken = configuredToken ?? projectIdentity?.token;
		const assertProjectCurrent = () => {
			assertRunOwnership();
			projectIdentity?.assertSelected();
		};
		const project = gitUrl ? await materializeProjectClone({
			cfg,
			gitUrl
		}, {
			signal,
			token: projectToken,
			assertCurrent: assertProjectCurrent,
			startRun: projectIdentity?.start
		}) : void 0;
		projectIdentity?.assertSelected();
		assertRunOwnership();
		const directory = project ? await resolveProjectDirectory(project.repoRoot) : pending?.workspace;
		assertRunOwnership();
		if (!directory) throw new Error("Saved worktree workspace is invalid; select the repository and retry.");
		const root = prepareSessionCreateFilesystemRoot({
			cfg,
			enforceSandboxContainment: !pending && Boolean(project || saved.projectId),
			requestedProjectId: project?.id ?? saved.projectId,
			sessionCwd: directory,
			sessionKey,
			targetAgentId: agentId
		});
		if (!root.ok) throw new Error(root.error.message);
		const status = (phase) => {
			assertRunOwnership();
			emitAgentRunStatusEvent({
				runId: clientRunId,
				sessionKey,
				agentId,
				phase
			});
		};
		if (pending && !pending.name && !hasExplicitSessionName(saved)) status("naming_worktree");
		const title = pending && !pending.name ? await generateWorktreeSessionTitle({
			cfg,
			agentId,
			entry: saved,
			sessionId: saved.sessionId,
			sessionKey,
			storePath,
			userMessage: pending.titleSource,
			commitGuard: assertRunOwnership,
			onPersisted: () => emitSessionsChanged(context, {
				sessionKey,
				agentId,
				reason: "chat.title"
			}),
			onError: (error) => context.logGateway.warn(`worktree title failed: ${String(error)}`)
		}) : void 0;
		let prepared = {
			spawnedCwd: root.value.sessionCwd,
			sessionRoot: root.value.sessionRoot
		};
		if (pending) {
			if (pending.baseRef && !pending.baseCommit) {
				let resolved = await resolveSessionWorktreeBase(directory, pending.baseRef, signal);
				if (!resolved.ok && resolved.error.code === ErrorCodes.INVALID_REQUEST && project?.source === "cloned") {
					await refreshProjectClone(project, {
						signal,
						token: projectToken,
						assertCurrent: assertProjectCurrent,
						startRun: projectIdentity?.start
					});
					projectIdentity?.assertSelected();
					assertRunOwnership();
					resolved = await resolveSessionWorktreeBase(directory, pending.baseRef, signal);
				}
				if (!resolved.ok) throw new Error(resolved.error.message);
				const next = {
					...pending,
					baseCommit: resolved.value
				};
				const updated = await patchSessionEntryCore(target, (current) => {
					assertSavedWorkspaceIntent(current);
					return { pendingWorktree: next };
				}, {
					assertCommitAllowed: assertRunOwnership,
					requireWriteSuccess: true,
					skipMaintenance: true
				});
				if (!updated) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
				Object.assign(saved, updated);
				pending = next;
			}
			const result = await prepareSessionWorktree({
				cfg,
				target: {
					...target,
					key: sessionKey,
					entry: saved,
					projectId: project?.id ?? saved.projectId,
					sandboxRequired: saved.sandbox === "required"
				},
				workspace: directory,
				name: pending.name,
				baseRef: pending.baseRef,
				checkoutCommit: pending.baseCommit,
				label: title ?? resolveExplicitSessionName(saved),
				runSetupScript: params.runSetupScript,
				signal,
				commitGuard: assertRunOwnership,
				onProgress: (stage) => status(stage === "setup" ? "running_setup" : "creating_worktree"),
				acceptedSource: pending.source
			});
			if (!result.ok) throw new Error(result.error.message);
			prepared = result.value;
		}
		let bound;
		try {
			const bind = async (assertSourceCurrent) => await patchSessionEntryCore(target, (current) => {
				assertSourceCurrent();
				assertSavedWorkspaceIntent(current);
				return {
					...project ? { projectId: project.id } : {},
					sessionRoot: prepared.sessionRoot,
					spawnedCwd: prepared.spawnedCwd,
					...prepared.worktree ? { worktree: prepared.worktree } : {},
					pendingProjectGitUrl: void 0,
					pendingWorktree: void 0
				};
			}, {
				assertCommitAllowed: () => {
					assertRunOwnership();
					assertSourceCurrent();
				},
				requireWriteSuccess: true,
				skipMaintenance: true
			});
			bound = prepared.withCommit ? await prepared.withCommit(bind) : await bind(() => {});
			if (!bound) throw new Error("Session disappeared while preparing its workspace; start a new session.");
		} catch (error) {
			await prepared.rollback?.();
			throw error;
		}
		Object.assign(entry, bound);
		delete entry.pendingProjectGitUrl;
		delete entry.pendingWorktree;
		assertRunOwnership();
		emitSessionsChanged(context, {
			sessionKey,
			agentId,
			reason: "project"
		});
	});
	assertRunOwnership();
}
//#endregion
//#region src/skills/library/authoring.ts
/** Model edits are named changes; unread binary resources retain their exact bytes and modes. */
function mergeSkillLibrarySupportFiles(current, upserts = [], deletes = []) {
	const changed = /* @__PURE__ */ new Set();
	for (const filePath of [...upserts.map((file) => file.path), ...deletes]) {
		validateSkillLibraryPath(filePath);
		const folded = filePath.toLowerCase();
		if (folded === "skill.md" || changed.has(folded)) throw new SkillLibraryError("INVALID_BUNDLE", "Support edits cannot include SKILL.md, duplicate paths, or conflicting upserts and deletes. Use proposal_content for SKILL.md.");
		changed.add(folded);
	}
	const files = new Map(current.map((file) => [file.path, file]));
	for (const filePath of deletes) if (!files.delete(filePath)) throw new SkillLibraryError("INVALID_BUNDLE", `Support file not found: ${filePath}`);
	for (const file of upserts) files.set(file.path, {
		...file,
		executable: file.executable ?? files.get(file.path)?.executable
	});
	return [...files.values()];
}
//#endregion
//#region src/gateway/skill-library-authoring.ts
const active = /* @__PURE__ */ new Map();
/** A mixed-person steer revokes mutation authority without changing the session's committed pins. */
function invalidateSkillAuthoringForOtherRequester(sessionKey, profileId) {
	for (const grant of active.get(sessionKey) ?? []) if (grant.profileId !== profileId) {
		const db = openOpenClawStateDatabase().db;
		if (!profileId || selectResolvedUserProfileMetadataById(db, grant.profileId)?.id !== selectResolvedUserProfileMetadataById(db, profileId)?.id) grant.revoke();
	}
}
/** Only ordinary attributed human ingress may mint a namespace; actions remain normal tool policy. */
async function prepareGatewaySkillAuthoring(options, sessionKey, isHumanTurn) {
	const client = options.client;
	if (!isHumanTurn || !client?.authenticatedUserProfile || client.internal?.syntheticClient || client.internal?.agentRuntimeIdentity || client.internal?.senderAttribution || client.internal?.pluginRuntimeOwnerId || client.internal?.approvalRuntime || client.internal?.cronRunContinuation || client.internal?.delegatedToolPolicyHandoffId) return;
	const authority = libraryAuthority(options);
	const library = await resolveSkillLibraryPresentation(authority);
	if (!library.profileId || library.defaultTarget === "unavailable") return;
	const profileId = library.profileId;
	invalidateSkillAuthoringForOtherRequester(sessionKey, profileId);
	let bound;
	let revoked = false;
	let owner;
	const assertCurrent = () => {
		authority.assertCurrent();
		const caller = getGatewayToolCallerIdentity();
		if (revoked || !bound || !owner || getAdmittedRunDelegatedAuthority(bound) !== owner || caller?.operationalRunInstance !== bound.operationalRunInstance || !caller.receiptAuthority || caller.receiptAuthority() === false) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring authority expired or this turn has mixed requesters. Send a fresh attributed message requesting the change.");
	};
	const currentAuthority = {
		...authority,
		assertCurrent,
		namespace: "personal"
	};
	return {
		target: "personal",
		defaultTarget: library.defaultTarget,
		multipleProfiles: library.multipleProfiles,
		bind(context) {
			if (bound) {
				if (context !== bound) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring cannot move to a replacement run. Send a fresh message.");
				return;
			}
			bound = context;
			owner = getAdmittedRunDelegatedAuthority(context);
			if (!owner) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring run was not admitted.");
			const grant = {
				profileId,
				revoke: () => {
					revoked = true;
				}
			};
			const grants = active.get(sessionKey) ?? /* @__PURE__ */ new Set();
			grants.add(grant);
			active.set(sessionKey, grants);
			const stop = registerAgentRunDelegatedAuthorityClosedHandler((closed) => {
				if (closed !== owner) return;
				revoked = true;
				grants.delete(grant);
				if (!grants.size) active.delete(sessionKey);
				stop();
			});
		},
		assertWorkspaceCurrent() {
			assertCurrent();
			if (!resolveSkillLibraryActor(openOpenClawStateDatabase().db, authority).admin) throw new SkillLibraryError("FORBIDDEN", "Workspace authoring requires current administrator authority.");
		},
		async invoke(input) {
			assertCurrent();
			if (input.action === "list") return listSkillLibrary(currentAuthority);
			if (input.action === "read" || input.action === "activate") {
				if (!input.skillId) throw new SkillLibraryError("INVALID_BUNDLE", "Choose skill_id from list.");
				if (input.action === "read") return readSkillLibrary(currentAuthority, input.skillId, input.revision);
				return activateLibrarySelection({
					...options,
					sessionMutationCommitGuard: assertCurrent
				}, {
					sessionKey,
					action: "attach",
					skillId: input.skillId,
					revision: input.revision
				});
			}
			if (input.action !== "create" && (!input.skillId || !input.expectedRevision)) throw new SkillLibraryError("INVALID_BUNDLE", "Read the skill first; supply skill_id and expected_revision from that read.");
			if (input.action === "create" || input.action === "update") {
				const current = input.action === "update" ? await readSkillLibrary(currentAuthority, input.skillId, input.expectedRevision) : void 0;
				const slug = input.slug ?? current?.entry.slug;
				const content = input.content ?? current?.content;
				if (!slug || !content) throw new SkillLibraryError("INVALID_BUNDLE", "Creating a skill requires name (the human slug) and complete proposal_content.");
				return saveSkillLibrary(currentAuthority, {
					slug,
					content,
					files: mergeSkillLibrarySupportFiles(current?.files ?? [], input.files, input.deleteFiles),
					skillId: input.action === "update" ? input.skillId : void 0,
					expectedRevision: input.action === "create" ? null : input.expectedRevision
				});
			}
			return mutateSkillLibrary(currentAuthority, {
				action: input.action,
				skillId: input.skillId,
				expectedRevision: input.expectedRevision,
				revision: input.revision
			});
		}
	};
}
//#endregion
export { prepareSessionWorkspace as a, validateSessionProjectPreparation as c, prepareSkillLibrarySessionCreation as d, prepareSessionRepositoryWorkspace as i, resolveGatewayInputParticipant as l, prepareGatewaySkillAuthoring as n, prepareSessionWorkspaceForRun as o, normalizeSessionProjectGitUrl as r, resolveSessionRepositoryCreation as s, invalidateSkillAuthoringForOtherRequester as t, retainGatewayOperatorRun as u };
