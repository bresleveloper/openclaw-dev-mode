import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { $c as validateWorktreesRestoreParams, Jc as validateWorktreesCreateParams, Mg as buildMissingScopeErrorDetails, Ng as errorShape, Pg as missingScopeErrorShape, Qc as validateWorktreesRemoveParams, Xc as validateWorktreesListParams, Yc as validateWorktreesGcParams, Zc as validateWorktreesRecoverRemovalParams, el as validateWorktreesRetireSnapshotParams, qc as validateWorktreesBranchesParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { a as managedWorktrees } from "./service-BPAgan76.mjs";
import { _ as WorktreeSnapshotError } from "./removal-git-BhpnO_Vq.mjs";
import { o as resolveRecordedProjectRoot } from "./project-registry-0O0PFE8w.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-C3E7cQQ3.mjs";
import { n as localStateOwnerChangedError, t as captureLocalStateMutationGuard } from "./local-state-owner-Ces8bTrZ.mjs";
import { n as requestGatewayWorktreeMaintenance } from "./worktree-maintenance-BB4uOVB-.mjs";
//#region src/gateway/server-methods/worktrees.ts
function publicWorktreeRecord({ gcRetry: _gcRetry, ...record }, qualified = false) {
	if (!qualified) delete record.gcProtection;
	return record;
}
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters", { details: { mutationAccepted: false } }));
}
function captureWorktreeMutationGuard(expectedOwnerId, opts, target) {
	if (!expectedOwnerId) return;
	if (!opts.client?.connect.scopes?.includes("operator.admin")) {
		opts.respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, `missing scope: ${ADMIN_SCOPE}`, { details: {
			...buildMissingScopeErrorDetails({
				missingScope: ADMIN_SCOPE,
				requiredScopes: [ADMIN_SCOPE]
			}),
			mutationAccepted: false
		} }));
		return null;
	}
	try {
		return captureLocalStateMutationGuard(expectedOwnerId, opts, target);
	} catch (error) {
		opts.respond(false, void 0, localStateOwnerChangedError(error));
		return null;
	}
}
async function resolveAuthorizedRepoRoot(repoRoot, opts) {
	if ((Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : []).includes("operator.admin")) return repoRoot;
	const authorizedRoot = (await resolveWorkspacePathContainment(repoRoot, opts.context.getRuntimeConfig()))?.path ?? await resolveRecordedProjectRoot(repoRoot);
	if (authorizedRoot) return authorizedRoot;
	opts.respond(false, void 0, missingScopeErrorShape({
		missingScope: ADMIN_SCOPE,
		requiredScopes: [ADMIN_SCOPE]
	}));
}
function worktreeHandler(validate, run) {
	return (options) => {
		const { params, respond } = options;
		if (!validate(params)) {
			invalidParams(respond);
			return;
		}
		return run(options, params);
	};
}
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": worktreeHandler(validateWorktreesListParams, async ({ respond }) => {
			respond(true, { worktrees: (await service.list()).map((record) => publicWorktreeRecord(record)) }, void 0);
		}),
		"worktrees.create": worktreeHandler(validateWorktreesCreateParams, async (opts, params) => {
			const { respond } = opts;
			if (params.expectedRepoIdentity && !params.expectedOwnerId) {
				invalidParams(respond);
				return;
			}
			const scopes = Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : [];
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts, params.expectedRepoIdentity ? {
				path: params.repoRoot,
				identity: params.expectedRepoIdentity
			} : void 0);
			if (commitGuard === null) return;
			let repoRoot;
			try {
				repoRoot = await resolveAuthorizedRepoRoot(params.repoRoot, opts);
				if (!repoRoot) return;
				commitGuard?.();
			} catch (error) {
				respond(false, void 0, localStateOwnerChangedError(error));
				return;
			}
			const record = await service.create({
				repoRoot,
				name: params.name,
				baseRef: params.baseRef,
				...params.profiles?.length ? { profiles: params.profiles } : {},
				...commitGuard ? {
					commitGuard,
					signal: opts.signal
				} : {},
				ownerKind: "manual",
				runSetupScript: scopes.includes(ADMIN_SCOPE)
			});
			commitGuard?.();
			respond(true, publicWorktreeRecord(record, Boolean(params.expectedOwnerId)), void 0);
		}),
		"worktrees.remove": worktreeHandler(validateWorktreesRemoveParams, async (opts, params) => {
			const { respond } = opts;
			if ([
				params.force,
				params.ifLossless,
				params.exactState
			].filter(Boolean).length > 1) {
				invalidParams(respond);
				return;
			}
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (commitGuard === null) return;
			const id = normalizeOptionalString(params.id) ?? params.id;
			const guard = commitGuard ? {
				commitGuard,
				signal: opts.signal
			} : {};
			try {
				if (params.ifLossless) {
					const removed = await service.removeIfLossless(id, guard);
					const cleanup = (await service.listRegistryRecords()).find((record) => record.id === id)?.runEndCleanup;
					commitGuard?.();
					respond(true, {
						removed,
						...cleanup ? { cleanup } : {}
					}, void 0);
					return;
				}
				const result = await service.remove({
					id,
					reason: "manual-delete",
					allowSnapshotLoss: params.force,
					...params.exactState ? { exactState: params.exactState } : {},
					...guard
				});
				commitGuard?.();
				respond(true, params.expectedOwnerId ? result : {
					removed: result.removed,
					...result.snapshotRef ? { snapshotRef: result.snapshotRef } : {},
					...result.snapshotError ? { snapshotError: result.snapshotError } : {}
				}, void 0);
			} catch (error) {
				if (error instanceof WorktreeSnapshotError && !params.expectedOwnerId) {
					respond(true, {
						removed: false,
						snapshotError: error.snapshotError
					}, void 0);
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error), {
					...error instanceof WorktreeSnapshotError ? { details: { snapshotError: error.snapshotError } } : {},
					retryable: false
				}));
			}
		}),
		"worktrees.restore": worktreeHandler(validateWorktreesRestoreParams, async (opts, params) => {
			const { respond } = opts;
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (commitGuard === null) return;
			const id = normalizeOptionalString(params.id) ?? params.id;
			const record = await service.restore({
				id,
				...params.recoverExactState ? { recoverExactState: params.recoverExactState } : {},
				...commitGuard ? {
					commitGuard,
					signal: opts.signal
				} : {}
			});
			commitGuard?.();
			respond(true, publicWorktreeRecord(record, Boolean(params.expectedOwnerId)), void 0);
		}),
		"worktrees.branches": worktreeHandler(validateWorktreesBranchesParams, async (opts, params) => {
			const { respond } = opts;
			const repoRoot = await resolveAuthorizedRepoRoot(params.repoRoot, opts);
			if (!repoRoot) return;
			respond(true, params.includeRepositoryStatus ? await service.listRepositoryBranches(repoRoot, { includeRepositoryStatus: true }) : await service.listRepositoryBranches(repoRoot), void 0);
		}),
		"worktrees.gc": worktreeHandler(validateWorktreesGcParams, async (opts, params) => {
			const { respond, context } = opts;
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (commitGuard === null) return;
			commitGuard?.();
			respond(true, requestGatewayWorktreeMaintenance(context.getRuntimeConfig, {
				jobId: params.jobId,
				retryDeferred: params.retryDeferred
			}), void 0);
		}),
		"worktrees.recoverRemoval": worktreeHandler(validateWorktreesRecoverRemovalParams, async (opts, params) => {
			const { respond } = opts;
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (!commitGuard) return;
			const result = await service.recoverRemoval({
				id: normalizeOptionalString(params.id) ?? params.id,
				snapshot: params.snapshot,
				commitGuard,
				signal: opts.signal
			});
			commitGuard();
			respond(true, result, void 0);
		}),
		"worktrees.retireSnapshot": worktreeHandler(validateWorktreesRetireSnapshotParams, async (opts, params) => {
			const { respond } = opts;
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (!commitGuard) return;
			const { expectedOwnerId: _expectedOwnerId, ...input } = params;
			const result = await service.retireSnapshot({
				...input,
				commitGuard,
				signal: opts.signal
			});
			commitGuard();
			respond(true, result, void 0);
		})
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { worktreesHandlers };
