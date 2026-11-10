import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { s as withSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { D as getSessionRepositoryWorkspaceStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { r as githubApiToken } from "./github-public-api-Dk3IZSKx.mjs";
import { t as captureSessionEntryMetadataRead } from "./session-entry-source-authority-CY_NaTk4.mjs";
import { s as prepareGitHubReadIdentity } from "./github-tool-identity-BEdbceu6.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { c as seedSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { n as resolveExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { p as resolveProjectDirectory } from "./project-registry-0O0PFE8w.mjs";
import { t as prepareSessionCreateFilesystemRoot } from "./session-create-root-lHgGqSce.mjs";
import { a as resolveSessionWorktreeBase, t as prepareSessionWorktree } from "./session-worktree-preparation-M6dhYMsR.mjs";
import { t as ensureSessionDiffBaseline } from "./session-diff-baseline-8nBnCSXG.mjs";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-5OyxJInq.mjs";
import { t as commitPreparedSessionWorkspace } from "./session-lifecycle-preparation-CelOZMyq.mjs";
import { n as refreshProjectClone, t as materializeProjectClone } from "./project-clone-DK_Wghok.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import { r as hasActiveAgentRuntimeAuthority } from "./agent-runtime-authority-B3KjbGu2.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/skill-library-session.ts
/** Selection is prepared from this request's real principal, never reconstructed from provenance. */
async function prepareSkillLibrarySessionCreation(client, cfg, creation, prepared) {
	if (!client?.authenticatedUserProfile || client.internal?.syntheticClient || creation.via === "spawn") return creation;
	prepared?.assertCurrent();
	return {
		...creation,
		skillLibrarySelections: prepared?.selections ?? await seedSkillLibrarySelection({
			profileId: client.authenticatedUserProfile.profileId,
			scopes: client.connect.scopes ?? [],
			getConfig: typeof cfg === "function" ? cfg : () => cfg,
			assertCurrent: () => {}
		})
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
function validateSessionWorktreeSelection(params) {
	if (params.worktreeSource === "empty" && (params.worktree !== true || params.cwd || params.projectId || params.projectGitUrl || params.repository || params.catalogId || params.execNode || params.worktreeBaseRef)) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktreeSource=empty requires worktree=true and cannot include another workspace source, catalog, execNode, or worktreeBaseRef");
	if (normalizeOptionalString(params.execNode) && params.worktree === true) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktree cannot target execNode");
	if ((normalizeOptionalString(params.worktreeBaseRef) || normalizeOptionalString(params.worktreeName)) && params.worktree !== true) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktreeBaseRef/worktreeName require worktree=true");
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
function prepareSessionWorkspace(params) {
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
	const promptReady = createDeferredCore();
	let preparationFailure;
	let workspaceReady = false;
	const ready = prepareSessionWorkspaceForRun({
		...session,
		entry,
		runId: clientRunId,
		context,
		signal,
		assertCurrent: assertRunOwnership,
		runSetupScript: client?.connect?.scopes?.includes(ADMIN_SCOPE) === true,
		onPromptReady: session.cfg.cloudWorkers?.requiredProfile ? void 0 : () => promptReady.resolve()
	}).then(async () => {
		assertRunOwnership();
		await ensureSessionDiffBaseline({
			agentId: session.agentId,
			cwd: entry.spawnedCwd,
			entry,
			isNewSession: false,
			sessionKey,
			storePath: session.storePath
		});
		assertRunOwnership();
		workspaceReady = true;
		promptReady.resolve();
	}).catch((error) => {
		if (!signal.aborted) {
			preparationFailure = toErrorObject(error, "Workspace preparation failed; check the repository and retry.");
			controller.abort(preparationFailure);
		}
		const failure = preparationFailure ?? error;
		promptReady.reject(failure);
		throw failure;
	});
	ready.catch(() => {});
	promptReady.promise.catch(() => {});
	return {
		sessionKey,
		assertCurrent: assertRunOwnership,
		promptReady: promptReady.promise,
		isReady: () => workspaceReady,
		waitUntilReady: () => ready,
		getFailure: () => preparationFailure
	};
}
/** The admitted turn supplies authority; this owner prepares and binds its saved workspace. */
async function prepareSessionWorkspaceForRun(params) {
	const { entry, cfg, agentId, runId: clientRunId, sessionKey, storePath, context, signal } = params;
	const target = {
		agentId,
		sessionKey,
		storePath
	};
	const metadata = captureSessionEntryMetadataRead(target, params.assertCurrent);
	const assertRunOwnership = composeSessionSourceAssertion([params.assertCurrent], (assertSources) => {
		signal.throwIfAborted();
		assertSources();
		metadata?.assertCurrent();
	});
	assertRunOwnership();
	emitAgentRunStatusEvent({
		runId: clientRunId,
		sessionKey,
		agentId,
		phase: "preparing_workspace"
	});
	const prepare = () => workspacePreparations.enqueue(`${storePath}\0${sessionKey}`, async () => {
		assertRunOwnership();
		const saved = metadata ? metadata.readCurrent() : await readSessionEntryReadOnlyInWorker(target, assertRunOwnership);
		if (!saved || saved.sessionId !== entry.sessionId || saved.lifecycleRevision !== entry.lifecycleRevision) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
		let pending = saved.pendingWorktree;
		const assertSavedWorkspaceIntent = (current) => {
			assertRunOwnership();
			if (!current || current.sessionId !== entry.sessionId || current.lifecycleRevision !== entry.lifecycleRevision || current.projectId !== saved.projectId || current.pendingProjectGitUrl !== saved.pendingProjectGitUrl || !isDeepStrictEqual(current.pendingWorktree, pending)) throw new Error(SESSION_PROJECT_OWNERSHIP_ERROR);
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
			if (metadata) assertSavedWorkspaceIntent(metadata.readCurrent());
			projectIdentity?.assertSelected();
		};
		const cloneOptions = {
			signal,
			token: projectToken,
			assertCurrent: assertProjectCurrent,
			startRun: projectIdentity?.start
		};
		const project = gitUrl ? await materializeProjectClone({
			cfg,
			gitUrl
		}, cloneOptions) : void 0;
		projectIdentity?.assertSelected();
		assertRunOwnership();
		const directory = project ? await resolveProjectDirectory(project.repoRoot) : pending?.workspace;
		assertRunOwnership();
		if (!directory) throw new Error("Saved worktree workspace is invalid; select the repository and retry.");
		const root = prepareSessionCreateFilesystemRoot({
			cfg,
			enforceSandboxContainment: !pending && Boolean(project || saved.projectId),
			sandboxRequired: saved.sandbox === "required",
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
		let prepared = {
			spawnedCwd: root.value.sessionCwd,
			sessionRoot: root.value.sessionRoot
		};
		if (pending) {
			if (pending.baseRef && !pending.baseCommit) {
				let resolved = await resolveSessionWorktreeBase(directory, pending.baseRef, signal);
				if (!resolved.ok && resolved.error.code === ErrorCodes.INVALID_REQUEST && project?.source === "cloned") {
					await refreshProjectClone(project, cloneOptions);
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
					...sessionEntryCommitGuardOptions(assertRunOwnership),
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
				label: resolveExplicitSessionName(saved),
				runSetupScript: !cfg.cloudWorkers?.requiredProfile && params.runSetupScript,
				signal,
				commitGuard: assertProjectCurrent,
				onProgress: (stage) => status(stage === "setup" ? "running_setup" : "creating_worktree"),
				acceptedSource: pending.source,
				onPromptReady: params.onPromptReady ? async (promptWorkspace) => {
					const bound = await commitPreparedSessionWorkspace({
						prepared: promptWorkspace,
						target,
						projectId: project?.id,
						assertCurrent: assertRunOwnership,
						assertEntry: assertSavedWorkspaceIntent,
						missingSessionMessage: "Session disappeared while preparing its workspace; start a new session."
					});
					Object.assign(saved, bound);
					Object.assign(entry, bound);
					params.onPromptReady?.();
				} : void 0
			});
			if (!result.ok) throw new Error(result.error.message);
			prepared = result.value;
		}
		const bound = await commitPreparedSessionWorkspace({
			prepared,
			target,
			projectId: project?.id,
			assertCurrent: assertRunOwnership,
			assertEntry: assertSavedWorkspaceIntent,
			clearPendingIntent: true,
			missingSessionMessage: "Session disappeared while preparing its workspace; start a new session."
		});
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
	if (!await withSessionActorStorage(target, {
		lifetime: {
			assertCurrent: assertRunOwnership,
			assertReadable: assertRunOwnership
		},
		authority: {
			assertCurrent: assertRunOwnership,
			authorize() {}
		}
	}, async () => {
		await prepare();
		return true;
	})) await prepare();
	assertRunOwnership();
}
//#endregion
export { resolveSessionRepositoryCreation as a, prepareSkillLibrarySessionCreation as c, prepareSessionWorkspaceForRun as i, prepareSessionRepositoryWorkspace as n, validateSessionProjectPreparation as o, prepareSessionWorkspace as r, validateSessionWorktreeSelection as s, normalizeSessionProjectGitUrl as t };
