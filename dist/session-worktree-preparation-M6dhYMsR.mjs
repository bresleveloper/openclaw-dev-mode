import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { i as collectNestedErrorCandidates } from "./error-coercion-BwMr25F8.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as SessionWorktreeSourceChangedError, o as WorktreeRepositoryError } from "./errors-WYf-uyBk.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import "./config-B3oiWDlr.mjs";
import { n as captureSessionMutationRouting } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { n as captureSessionEntrySourceAssertion } from "./session-entry-source-authority-CY_NaTk4.mjs";
import "./git-CljZIJM8.mjs";
import { i as insideGitCheckout } from "./workspace-git-CiP8oVHR.mjs";
import { i as captureWorktreeRunEndContext } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { p as readSessionWorktreeBinding, s as readLiveRegistryWorktreeByOwner, t as captureWorktreeRegistryReadGuard, u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { n as ManagedWorktreeService } from "./service-BPAgan76.mjs";
import { d as InvalidWorktreeBaseRefError, p as resolveWorktreeBase } from "./service-preparation-BPHRuGZn.mjs";
import { r as slugifyWorktreeTitle } from "./name-C9NcRALZ.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { i as hasInternalHookListeners } from "./internal-hooks-DNLQqCT3.mjs";
import { n as resolveExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { n as generateWorktreeSessionTitle } from "./dashboard-session-title-2wgQueAj.mjs";
import { a as resolveProjectRegistry, c as selectStoredProjectRegistry, d as ProjectCheckoutError, f as resolveProjectCheckout, p as resolveProjectDirectory, s as resolveWorkspaceProject } from "./project-registry-0O0PFE8w.mjs";
import { t as prepareSessionCreateFilesystemRoot } from "./session-create-root-lHgGqSce.mjs";
import { n as withGatewaySessionEntryReadOnly } from "./session-utils-read-lifetime-CQKtyavc.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/session-worktree-preparation.ts
/** Resolve registered sources identically for dashboard and native child sessions. */
async function resolveSessionProjectRoot(cfg, projectId, worktree) {
	const project = await resolveProjectRegistry(cfg, projectId);
	if (!project) return invalidSessionRequest(`unknown project id: ${projectId}`);
	return resolveSessionProjectRootForRecord(project, worktree);
}
async function resolveSessionProjectRootForRecord(project, worktree) {
	try {
		const checkout = worktree ? await resolveProjectCheckout(project.repoRoot) : void 0;
		const root = checkout?.path ?? await resolveProjectDirectory(project.repoRoot);
		if (checkout && project.source !== "workspace" && checkout.path !== checkout.repoRoot) throw new ProjectCheckoutError("project root is no longer a git checkout");
		return ok(root);
	} catch (error) {
		const detail = error instanceof ProjectCheckoutError ? error.message : formatErrorMessage(error);
		return err(errorShape(ErrorCodes.UNAVAILABLE, `project ${project.id} is unavailable (${detail}); update the agent workspace path or re-register the project`));
	}
}
function selectSessionWorktreeProjectSource(projectId, signal) {
	return projectId && !projectId.startsWith("workspace:") ? selectStoredProjectRegistry(projectId, { signal }) : void 0;
}
/** Advisory discovery shares source custody classification with managed creation. */
async function resolveSessionProjectCheckoutOptions(params) {
	params.assertCurrent();
	const pendingSource = selectSessionWorktreeProjectSource(params.projectId, params.signal);
	const source = pendingSource ? await pendingSource : void 0;
	params.assertCurrent();
	const project = source?.project ?? resolveWorkspaceProject(params.cfg, params.projectId);
	if (!project) return {
		current: false,
		worktree: false
	};
	const [direct, managed] = await Promise.all([resolveSessionProjectRootForRecord(project, false), resolveSessionProjectRootForRecord(project, true)]);
	params.assertCurrent();
	const current = direct.ok && prepareSessionCreateFilesystemRoot({
		cfg: params.cfg,
		requestedProjectId: params.projectId,
		targetAgentId: params.targetAgentId,
		sessionCwd: direct.value,
		enforceSandboxContainment: true,
		sandboxRequired: params.resolveSandboxRequired()
	}).ok;
	return {
		current,
		worktree: managed.ok && (current || source !== void 0)
	};
}
async function resolveSpawnParentWorktreeSource(parentSessionKey, agentId, options = {}) {
	return withGatewaySessionEntryReadOnly({
		cfg: readRuntimeConfig(),
		key: parentSessionKey,
		agentId,
		assertActive: () => options.signal?.throwIfAborted()
	}, async (parent) => prepareSpawnParentWorktreeSource(parent, agentId, options));
}
async function prepareSpawnParentWorktreeSource(parent, agentId, options) {
	if (!parent.entry) return;
	const fields = [
		"sessionId",
		"lifecycleRevision",
		"archivedAt",
		"projectId",
		"sessionRoot",
		"worktree"
	];
	const sourceKind = parent.entry.worktree ? "managed worktree" : "project";
	const refuse = () => {
		throw new SessionWorktreeSourceChangedError(`Spawn parent ${sourceKind} changed; retry from its current session`);
	};
	const scope = {
		agentId,
		sessionKey: parent.canonicalKey,
		storePath: parent.storePath
	};
	const assertRouting = captureSessionMutationRouting(parent.cfg, refuse, [scope]);
	const assertHostCurrent = () => {
		options.signal?.throwIfAborted();
		assertRouting(readRuntimeConfig());
	};
	const parentSource = captureSessionEntrySourceAssertion({
		scope,
		readSource: parent.capturedReadSource,
		expected: parent.entry,
		fields,
		assertCurrent: assertHostCurrent,
		assertHostCurrent,
		refuse
	});
	if (!parent.entry.worktree) {
		const projectId = normalizeOptionalString(parent.entry.projectId);
		if (!projectId) return;
		const selection = projectId.startsWith("workspace:") ? void 0 : await selectStoredProjectRegistry(projectId, options);
		const project = selection?.project ?? resolveWorkspaceProject(parent.cfg, projectId);
		if (!project) throw new SessionWorktreeSourceChangedError("Spawn parent project changed; retry from its current session");
		const assertParentCurrent = (storedRoot, assertCheckout) => {
			assertCheckout?.();
			const currentProjectRoot = selection ? storedRoot : resolveWorkspaceProject(readRuntimeConfig(), projectId)?.repoRoot;
			if (parent.entry?.archivedAt !== void 0 || parent.entry?.sessionRoot !== project.repoRoot || currentProjectRoot !== project.repoRoot) throw new SessionWorktreeSourceChangedError("Spawn parent project changed; retry from its current session");
		};
		if (selection) return {
			workspace: project.repoRoot,
			source: {
				kind: "project",
				id: projectId
			},
			withRollback: selection.withRollback,
			withCurrent: async (run) => await selection.withCurrent((current) => {
				return run({
					assertCurrent: composeSessionSourceAssertion([parentSource], (assertSources) => {
						assertSources();
						assertParentCurrent(current.project?.repoRoot, current.assertCurrent);
					}),
					assertCheckoutCurrent: current.assertCheckoutCurrent,
					signal: current.signal
				});
			})
		};
		const assertCurrent = composeSessionSourceAssertion([parentSource], (assertSources) => {
			assertSources();
			assertParentCurrent(void 0);
		});
		assertCurrent();
		return {
			workspace: project.repoRoot,
			source: {
				kind: "project",
				id: projectId
			},
			withCurrent: async (run) => await run({
				assertCurrent,
				signal: options.signal
			})
		};
	}
	const context = captureWorktreeRunEndContext(process.env);
	const accept = captureWorktreeRegistryReadGuard(context, "source-owner");
	const worktree = await readLiveRegistryWorktreeByOwner(context, "session", parent.canonicalKey);
	const assertWorktreeCurrent = accept(worktree);
	options.signal?.throwIfAborted();
	if (!worktree || worktree.id !== parent.entry.worktree.id || parent.entry.archivedAt !== void 0) throw new SessionWorktreeSourceChangedError("Spawn parent managed worktree changed; retry from its current session");
	const assertCurrent = composeSessionSourceAssertion([parentSource], (assertSources) => {
		assertSources();
		assertWorktreeCurrent();
	});
	assertCurrent();
	return {
		workspace: worktree.repoRoot,
		source: {
			kind: "worktree",
			id: worktree.id
		},
		withCurrent: async (run) => await run({
			assertCurrent,
			signal: options.signal,
			workerAuthority: {
				assertCurrent: parentSource,
				predicates: [{
					kind: "source-owner",
					ownerId: parent.canonicalKey,
					id: worktree.id,
					path: worktree.path,
					repoRoot: worktree.repoRoot
				}]
			}
		})
	};
}
/** Resolve explicit session selections through the same typed error boundary. */
async function resolveSessionWorktreeBase(workspace, baseRef, signal, commitGuard) {
	try {
		return ok((await resolveWorktreeBase(workspace, baseRef, signal, commitGuard)).commit);
	} catch (error) {
		commitGuard?.();
		return err(errorShape(error instanceof InvalidWorktreeBaseRefError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
}
/** One worktree preparation owner for synchronous creation and admitted first turns. */
async function prepareSessionWorktree(params) {
	const { target, commitGuard } = params;
	const context = captureWorktreeRunEndContext(process.env);
	const worktrees = new ManagedWorktreeService({ env: {
		...process.env,
		...context.environment
	} });
	const sandboxRequired = target.sandboxRequired === true || target.entry?.sandbox === "required" || resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		agentId: target.agentId,
		sessionKey: target.key,
		preparedSessionEntry: target.entry ?? null
	}).sandboxed;
	let withSource = params.withSource;
	let withRollback = params.withRollback;
	const checkSource = async () => {
		commitGuard?.();
		await withSource?.((current) => {
			commitGuard?.();
			current.assertCurrent();
		});
	};
	try {
		await checkSource();
		const workspace = typeof params.workspace === "string" ? params.workspace : void 0;
		if (sandboxRequired && workspace && !withSource && params.acceptedSource?.kind === "worktree") {
			const accept = captureWorktreeRegistryReadGuard(context, "source-record");
			const source = await readRegistryWorktree(context, params.acceptedSource.id);
			const assertSourceCurrent = accept(source);
			commitGuard?.();
			const root = fs.realpathSync(workspace);
			if (!source || source.ownerKind !== "session" || source.repoRoot !== root) throw new SessionWorktreeSourceChangedError("Accepted managed source is no longer available");
			const assertHostCurrent = () => {
				commitGuard?.();
				if (fs.realpathSync(workspace) !== root) throw new SessionWorktreeSourceChangedError("Accepted managed source changed during preparation");
			};
			const assertCurrent = () => {
				assertHostCurrent();
				assertSourceCurrent();
			};
			withSource = async (run) => {
				assertCurrent();
				return await run({
					assertCurrent,
					signal: params.signal,
					workerAuthority: {
						assertCurrent: assertHostCurrent,
						predicates: [{
							kind: "source-record",
							id: source.id,
							ownerId: source.ownerId,
							repoRoot: root,
							repoFingerprint: source.repoFingerprint
						}]
					}
				});
			};
		}
		if (sandboxRequired && workspace && !withSource) {
			const pendingSource = selectSessionWorktreeProjectSource(target.projectId ?? target.entry?.projectId ?? (params.acceptedSource?.kind === "project" ? params.acceptedSource.id : void 0), params.signal);
			const selected = pendingSource ? await pendingSource : void 0;
			if (selected) {
				const expectedRoot = fs.realpathSync(workspace);
				withSource = async (run) => await selected.withCurrent((current) => {
					const assertCurrent = () => {
						commitGuard?.();
						current.assertCurrent();
						if (!current.project || current.project.repoRoot !== expectedRoot || fs.realpathSync(workspace) !== expectedRoot) throw new SessionWorktreeSourceChangedError("Selected project changed during guest workspace preparation");
					};
					assertCurrent();
					return run({
						...current,
						assertCurrent
					});
				});
				withRollback = selected.withRollback;
			}
		}
		if (sandboxRequired && workspace && !withSource) {
			const root = prepareSessionCreateFilesystemRoot({
				cfg: params.cfg,
				enforceSandboxContainment: true,
				sandboxRequired: true,
				requestedProjectId: target.projectId ?? target.entry?.projectId,
				sessionCwd: workspace,
				sessionKey: target.key,
				targetAgentId: target.agentId
			});
			if (!root.ok) return root;
		}
		const repository = workspace ? await worktrees.resolveRepositoryPaths(workspace) : void 0;
		await checkSource();
		const boundId = normalizeOptionalString(target.entry?.worktree?.id);
		const existing = await readSessionWorktreeBinding(context, boundId, target.key);
		commitGuard?.();
		if (existing && (existing.ownerKind !== "session" || existing.ownerId !== target.key)) return err(errorShape(ErrorCodes.UNAVAILABLE, "session worktree binding has a different owner"));
		let existingDirectory = false;
		if (existing) try {
			existingDirectory = fs.lstatSync(existing.path).isDirectory();
		} catch {}
		if (existing && existingDirectory) {
			if (repository && existing.repoRoot !== repository.canonicalRoot) return invalidSessionRequest("session worktree belongs to a different repository");
			if (params.name && existing.name !== params.name || params.baseRef && existing.baseRef !== params.baseRef) return invalidSessionRequest(`session is already bound to worktree ${existing.name} (${existing.branch})`);
		}
		await checkSource();
		const createParams = {
			ownerKind: "session",
			ownerId: target.key,
			name: params.name,
			suggestedName: slugifyWorktreeTitle(params.label ?? ""),
			signal: params.signal,
			commitGuard,
			withSource,
			withRollback,
			onProgress: params.onProgress,
			...params.onPromptReady && !sandboxRequired && !hasInternalHookListeners("agent", "bootstrap") && repository && workspace === repository.sourceRoot ? { onPromptReady: async (worktree) => {
				commitGuard?.();
				await params.onPromptReady({
					spawnedCwd: worktree.path,
					sessionRoot: worktree.path,
					worktree: {
						id: worktree.id,
						branch: worktree.branch,
						repoRoot: worktree.repoRoot,
						canonicalWorkspaceDir: workspace
					}
				});
				commitGuard?.();
			} } : {}
		};
		const { record: worktree, materialized } = workspace ? await worktrees.createWithOutcome({
			...createParams,
			repoRoot: workspace,
			baseRef: params.baseRef,
			checkoutCommit: params.checkoutCommit,
			runSetupScript: sandboxRequired ? false : params.runSetupScript,
			provisionIgnoredFiles: !sandboxRequired
		}) : await worktrees.createEmptyWithOutcome(createParams);
		const rollback = materialized ? async () => await worktrees.rollbackPreparation(worktree, withRollback) : void 0;
		const accept = (assertSourceCurrent) => {
			commitGuard?.();
			assertSourceCurrent?.();
			let spawnedCwd = worktree.path;
			const relative = repository && workspace ? path.relative(repository.sourceRoot, fs.realpathSync(workspace)) : "";
			const nestedCwd = path.resolve(worktree.path, relative);
			if (relative && isPathInside(worktree.path, nestedCwd)) {
				spawnedCwd = nestedCwd;
				fs.mkdirSync(spawnedCwd, { recursive: true });
			}
			return ok({
				spawnedCwd,
				sessionRoot: fs.realpathSync(worktree.path),
				worktree: {
					id: worktree.id,
					branch: worktree.branch,
					repoRoot: worktree.repoRoot,
					canonicalWorkspaceDir: workspace ?? worktree.repoRoot
				},
				...rollback ? { rollback } : {},
				...withSource ? { withCommit: async (run) => await withSource((current) => run(current.assertCurrent)) } : {}
			});
		};
		try {
			return withSource ? await withSource((current) => accept(current.assertCurrent)) : accept();
		} catch (error) {
			const failures = [error];
			try {
				await rollback?.();
			} catch (cleanupError) {
				failures.push(cleanupError);
			}
			if (failures.length > 1) throw new AggregateError(failures, `${formatErrorMessage(error)}; worktree cleanup failed: ${formatErrorMessage(failures[1])}`, { cause: error });
			throw error;
		}
	} catch (error) {
		commitGuard?.();
		if (collectNestedErrorCandidates(error).some((cause) => cause instanceof SessionWorktreeSourceChangedError)) throw error;
		const invalidRequest = error instanceof WorktreeRepositoryError || error instanceof InvalidWorktreeBaseRefError;
		return err(errorShape(invalidRequest ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
	}
}
/** Select and prepare worktree intent while the existing session lifecycle owns the target. */
async function prepareSessionWorktreeCreation(params) {
	const { cfg, target: lifecycleTarget, signal, commitGuard, name, baseRef } = params;
	commitGuard();
	const acceptedWorktree = params.inheritParentKey ? lifecycleTarget.entry?.worktree : void 0;
	const acceptedPending = params.inheritParentKey ? lifecycleTarget.entry?.pendingWorktree : void 0;
	if (acceptedPending && !acceptedPending.workspace) {
		if (lifecycleTarget.entry?.pendingProjectGitUrl) return ok({});
		return err(errorShape(ErrorCodes.UNAVAILABLE, "Saved worktree workspace is invalid; select the repository and retry."));
	}
	const inheritedSource = params.inheritParentKey && !acceptedWorktree && !acceptedPending ? await resolveSpawnParentWorktreeSource(params.inheritParentKey, lifecycleTarget.agentId, { signal }) : void 0;
	commitGuard();
	const withSource = inheritedSource?.withCurrent;
	const withCommit = withSource ? async (run) => await withSource((current) => {
		current.assertCurrent();
		return run(current.assertCurrent);
	}) : void 0;
	const workspace = params.workspace ?? acceptedWorktree?.canonicalWorkspaceDir ?? acceptedWorktree?.repoRoot ?? acceptedPending?.workspace ?? inheritedSource?.workspace ?? resolveAgentWorkspaceDir(cfg, lifecycleTarget.agentId);
	if (withSource) await withSource((current) => {
		commitGuard();
		current.assertCurrent();
	});
	if (typeof workspace === "string" && !params.projectGitUrl && !insideGitCheckout(workspace)) return invalidSessionRequest("agent workspace is not a git checkout");
	const resolvedBase = typeof workspace === "string" && baseRef && !params.projectGitUrl && !lifecycleTarget.entry?.worktree ? withSource ? await withSource((current) => resolveSessionWorktreeBase(workspace, baseRef, signal, () => {
		commitGuard();
		current.assertCurrent();
	})) : await resolveSessionWorktreeBase(workspace, baseRef, signal, commitGuard) : void 0;
	if (resolvedBase && !resolvedBase.ok) return resolvedBase;
	const baseCommit = resolvedBase?.value;
	if (params.deferWorktree && typeof workspace === "string") return {
		ok: true,
		value: {
			withCommit,
			pendingWorktree: {
				...params.projectGitUrl ? {} : { workspace },
				...inheritedSource?.source || acceptedPending?.source ? { source: inheritedSource?.source ?? acceptedPending?.source } : {},
				name,
				baseRef,
				baseCommit,
				titleSource: params.titleSource
			}
		}
	};
	const title = !name && !params.label && lifecycleTarget.entry && lifecycleTarget.titleModelSelection !== null ? await generateWorktreeSessionTitle({
		cfg,
		agentId: lifecycleTarget.agentId,
		entry: params.useRequestedTitleSelection ? {
			...lifecycleTarget.entry,
			...lifecycleTarget.titleModelSelection
		} : lifecycleTarget.entry,
		sessionId: lifecycleTarget.entry.sessionId,
		sessionKey: lifecycleTarget.key,
		storePath: lifecycleTarget.storePath,
		currentUserMessage: params.currentUserMessage,
		userMessage: params.titleSource,
		commitGuard,
		withSource,
		onError: params.onTitleError,
		onPersisted: params.onTitlePersisted
	}) : void 0;
	const prepared = await prepareSessionWorktree({
		cfg,
		target: lifecycleTarget,
		workspace,
		name,
		baseRef,
		checkoutCommit: baseCommit,
		label: params.label ?? title ?? resolveExplicitSessionName(lifecycleTarget.entry),
		runSetupScript: params.runSetupScript,
		signal,
		commitGuard,
		withSource,
		withRollback: inheritedSource?.withRollback
	});
	return prepared.ok ? ok({
		...prepared.value,
		...withCommit ? { withCommit } : {}
	}) : prepared;
}
//#endregion
export { resolveSessionWorktreeBase as a, resolveSessionProjectRoot as i, prepareSessionWorktreeCreation as n, resolveSessionProjectCheckoutOptions as r, prepareSessionWorktree as t };
