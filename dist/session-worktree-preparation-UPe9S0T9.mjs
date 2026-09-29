import { r as collectNestedErrorCandidates } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { c as WorktreeRepositoryError } from "./git-worker-context-Cywc-SH2.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import { a as managedWorktrees, d as resolveWorktreeBase, u as InvalidWorktreeBaseRefError } from "./service-JxB03j7i.mjs";
import { d as getRegistryWorktree } from "./registry-UFMGRqcd.mjs";
import { l as resolveWorkspaceProject, u as selectStoredProjectRegistry } from "./project-registry-CT4rCnL9.mjs";
import { l as slugifyWorktreeTitle } from "./project-registry.kernel-BVX6sQ_I.mjs";
import { n as resolveExplicitSessionName } from "./session-title-state-BQCPqYS_.mjs";
import { n as generateWorktreeSessionTitle } from "./dashboard-session-title-Dfgz25-G.mjs";
import { t as prepareSessionCreateFilesystemRoot } from "./session-create-root-DONGPA9n.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/session-worktree-preparation.ts
function validateSessionWorktreeSelection(params) {
	if (params.worktreeSource === "empty" && (params.worktree !== true || params.cwd || params.projectId || params.projectGitUrl || params.repository || params.catalogId || params.execNode || params.worktreeBaseRef)) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktreeSource=empty requires worktree=true and cannot include another workspace source, catalog, execNode, or worktreeBaseRef");
	if (normalizeOptionalString(params.execNode) && params.worktree === true) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktree cannot target execNode");
	if ((normalizeOptionalString(params.worktreeBaseRef) || normalizeOptionalString(params.worktreeName)) && params.worktree !== true) return errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktreeBaseRef/worktreeName require worktree=true");
}
var SessionWorktreeSourceChangedError = class extends Error {};
async function resolveSpawnParentWorktreeSource(parentSessionKey, agentId, options = {}) {
	const parent = loadGatewaySessionEntryReadOnly(parentSessionKey, { agentId });
	if (!parent.entry) return;
	if (!parent.entry.worktree) {
		const projectId = normalizeOptionalString(parent.entry.projectId);
		if (!projectId) return;
		const selection = projectId.startsWith("workspace:") ? void 0 : await selectStoredProjectRegistry(projectId, options);
		const project = selection?.project ?? resolveWorkspaceProject(parent.cfg, projectId);
		if (!project) throw new SessionWorktreeSourceChangedError("Spawn parent project changed; retry from its current session");
		const parentSessionId = parent.entry.sessionId;
		const assertParentCurrent = (storedRoot, assertCheckout) => {
			assertCheckout?.();
			const current = loadGatewaySessionEntryReadOnly(parent.canonicalKey, { agentId });
			const currentProjectRoot = selection ? storedRoot : resolveWorkspaceProject(current.cfg, projectId)?.repoRoot;
			if (current.entry?.sessionId !== parentSessionId || current.entry.archivedAt !== void 0 || current.entry.projectId !== projectId || current.entry.sessionRoot !== project.repoRoot || current.entry.worktree !== void 0 || currentProjectRoot !== project.repoRoot) throw new SessionWorktreeSourceChangedError("Spawn parent project changed; retry from its current session");
		};
		if (selection) return {
			workspace: project.repoRoot,
			source: {
				kind: "project",
				id: projectId
			},
			withRollback: selection.withRollback,
			withCurrent: async (run) => await selection.withCurrent((current) => {
				const assertCurrent = () => assertParentCurrent(current.project?.repoRoot, current.assertCurrent);
				return run({
					assertCurrent,
					assertCheckoutCurrent: current.assertCheckoutCurrent,
					signal: current.signal
				});
			})
		};
		const assertCurrent = () => assertParentCurrent(void 0);
		assertCurrent();
		return {
			workspace: project.repoRoot,
			source: {
				kind: "project",
				id: projectId
			},
			withCurrent: async (run) => {
				return await run({
					assertCurrent,
					signal: options.signal
				});
			}
		};
	}
	const worktree = managedWorktrees.findLiveByOwner("session", parent.canonicalKey);
	if (!worktree || worktree.id !== parent.entry.worktree.id || parent.entry.archivedAt !== void 0) throw new SessionWorktreeSourceChangedError("Spawn parent managed worktree changed; retry from its current session");
	const parentSessionId = parent.entry.sessionId;
	const assertCurrent = () => {
		const current = loadGatewaySessionEntryReadOnly(parent.canonicalKey, { agentId });
		const currentWorktree = managedWorktrees.findLiveByOwner("session", parent.canonicalKey);
		if (current.entry?.sessionId !== parentSessionId || current.entry.archivedAt !== void 0 || current.entry.worktree?.id !== worktree.id || currentWorktree?.id !== worktree.id || currentWorktree.repoRoot !== worktree.repoRoot || currentWorktree.path !== worktree.path) throw new SessionWorktreeSourceChangedError("Spawn parent managed worktree changed; retry from its current session");
	};
	return {
		workspace: worktree.repoRoot,
		source: {
			kind: "worktree",
			id: worktree.id
		},
		withCurrent: async (run) => {
			return await run({
				assertCurrent,
				signal: options.signal
			});
		}
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
	const sandboxRequired = target.sandboxRequired === true || target.entry?.sandbox === "required" || resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		agentId: target.agentId,
		sessionKey: target.key
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
			const source = getRegistryWorktree(process.env, params.acceptedSource.id);
			const root = fs.realpathSync(workspace);
			if (!source || source.ownerKind !== "session" || source.repoRoot !== root) throw new SessionWorktreeSourceChangedError("Accepted managed source is no longer available");
			const assertCurrent = () => {
				commitGuard?.();
				const current = getRegistryWorktree(process.env, source.id);
				if (current?.ownerId !== source.ownerId || current?.repoRoot !== root || current?.repoFingerprint !== source.repoFingerprint || fs.realpathSync(workspace) !== root) throw new SessionWorktreeSourceChangedError("Accepted managed source changed during preparation");
			};
			withSource = async (run) => {
				assertCurrent();
				return await run({
					assertCurrent,
					signal: params.signal
				});
			};
		}
		if (sandboxRequired && workspace && !withSource) {
			const projectId = target.projectId ?? target.entry?.projectId ?? (params.acceptedSource?.kind === "project" ? params.acceptedSource.id : void 0);
			const selected = projectId && !projectId.startsWith("workspace:") ? await selectStoredProjectRegistry(projectId, { signal: params.signal }) : void 0;
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
		const repository = workspace ? await managedWorktrees.resolveRepositoryPaths(workspace) : void 0;
		await checkSource();
		const boundId = normalizeOptionalString(target.entry?.worktree?.id);
		let existing = boundId ? managedWorktrees.findLiveById(boundId) : void 0;
		if (existing && (existing.ownerKind !== "session" || existing.ownerId !== target.key)) return err(errorShape(ErrorCodes.UNAVAILABLE, "session worktree binding has a different owner"));
		existing ??= managedWorktrees.findLiveByOwner("session", target.key);
		let existingDirectory = false;
		if (existing) try {
			existingDirectory = fs.lstatSync(existing.path).isDirectory();
		} catch {}
		if (existing && existingDirectory) {
			if (repository && existing.repoRoot !== repository.canonicalRoot) return err(errorShape(ErrorCodes.INVALID_REQUEST, "session worktree belongs to a different repository"));
			if (params.name && existing.name !== params.name || params.baseRef && existing.baseRef !== params.baseRef) return err(errorShape(ErrorCodes.INVALID_REQUEST, `session is already bound to worktree ${existing.name} (${existing.branch})`));
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
			onProgress: params.onProgress
		};
		const { record: worktree, materialized } = workspace ? await managedWorktrees.createWithOutcome({
			...createParams,
			repoRoot: workspace,
			baseRef: params.baseRef,
			checkoutCommit: params.checkoutCommit,
			runSetupScript: sandboxRequired ? false : params.runSetupScript,
			provisionIgnoredFiles: !sandboxRequired
		}) : await managedWorktrees.createEmptyWithOutcome(createParams);
		const rollback = materialized ? async () => await managedWorktrees.rollbackPreparation(worktree, withRollback) : void 0;
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
	const { cfg, target: lifecycleTarget, signal, commitGuard } = params;
	commitGuard();
	const acceptedWorktree = params.inheritParentKey ? lifecycleTarget.entry?.worktree : void 0;
	const acceptedPending = params.inheritParentKey ? lifecycleTarget.entry?.pendingWorktree : void 0;
	if (acceptedPending && !acceptedPending.workspace) {
		if (lifecycleTarget.entry?.pendingProjectGitUrl) return {
			ok: true,
			value: {}
		};
		return {
			ok: false,
			error: errorShape(ErrorCodes.UNAVAILABLE, "Saved worktree workspace is invalid; select the repository and retry.")
		};
	}
	const inheritedSource = params.inheritParentKey && !acceptedWorktree && !acceptedPending ? await resolveSpawnParentWorktreeSource(params.inheritParentKey, lifecycleTarget.agentId, { signal }) : void 0;
	commitGuard();
	const withSource = inheritedSource?.withCurrent;
	const withCommit = withSource ? async (run) => await withSource((current) => {
		current.assertCurrent();
		return run(current.assertCurrent);
	}) : void 0;
	const workspace = params.workspace ?? acceptedWorktree?.canonicalWorkspaceDir ?? acceptedWorktree?.repoRoot ?? acceptedPending?.workspace ?? inheritedSource?.workspace ?? resolveAgentWorkspaceDir(cfg, lifecycleTarget.agentId);
	const name = params.name;
	const baseRef = params.baseRef;
	if (withSource) await withSource((current) => {
		commitGuard();
		current.assertCurrent();
	});
	if (typeof workspace === "string" && !params.projectGitUrl && !insideGitCheckout(workspace)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout")
	};
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
	const source = params.titleSource;
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
		userMessage: source,
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
	if (prepared.ok) return {
		ok: true,
		value: {
			...prepared.value,
			...withCommit ? { withCommit } : {}
		}
	};
	return prepared;
}
//#endregion
export { validateSessionWorktreeSelection as i, prepareSessionWorktreeCreation as n, resolveSessionWorktreeBase as r, prepareSessionWorktree as t };
