import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { Ac as validateWorktreesListParams, Dc as validateWorktreesBranchesParams, Mc as validateWorktreesRemoveParams, Nc as validateWorktreesRestoreParams, Oc as validateWorktreesCreateParams, Pc as validateWorktreesRetireSnapshotParams, jc as validateWorktreesRecoverRemovalParams, kc as validateWorktreesGcParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { d as buildMissingScopeErrorDetails, f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import { a as managedWorktrees, o as resolveWorktreeCleanupLimits } from "./service-CeHCpuXV.mjs";
import { _ as WorktreeSnapshotError } from "./removal-git-C1z0ZRNp.mjs";
import { s as resolveRecordedProjectRoot } from "./project-registry-B7e5lNuh.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-qr_FjPfc.mjs";
import { t as formatWorktreeGcResult } from "./gc-result-B4mResXZ.mjs";
import { t as createManagedWorktreeOwnerPolicy } from "./owner-protection-5NAkP9R-.mjs";
import { t as captureLocalStateMutationGuard } from "./local-state-owner-CdeTOsDa.mjs";
//#region src/gateway/server-methods/worktrees.ts
function publicWorktreeRecord({ gcProtection: _gcProtection, ...record }) {
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
		opts.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error), {
			details: {
				reason: "STATE_OWNER_CHANGED",
				mutationAccepted: false
			},
			retryable: false
		}));
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
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": async ({ params, respond }) => {
			if (!validateWorktreesListParams(params)) {
				invalidParams(respond);
				return;
			}
			respond(true, { worktrees: (await service.list()).map(publicWorktreeRecord) }, void 0);
		},
		"worktrees.create": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
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
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error), {
					details: {
						reason: "STATE_OWNER_CHANGED",
						mutationAccepted: false
					},
					retryable: false
				}));
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
			respond(true, params.expectedOwnerId ? record : publicWorktreeRecord(record), void 0);
		},
		"worktrees.remove": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesRemoveParams(params) || [
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
		},
		"worktrees.restore": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesRestoreParams(params)) {
				invalidParams(respond);
				return;
			}
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
			respond(true, params.expectedOwnerId ? record : publicWorktreeRecord(record), void 0);
		},
		"worktrees.branches": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesBranchesParams(params)) {
				invalidParams(respond);
				return;
			}
			const repoRoot = await resolveAuthorizedRepoRoot(params.repoRoot, opts);
			if (!repoRoot) return;
			respond(true, params.includeRepositoryStatus ? await service.listRepositoryBranches(repoRoot, { includeRepositoryStatus: true }) : await service.listRepositoryBranches(repoRoot), void 0);
		},
		"worktrees.gc": async (opts) => {
			const { params, respond, context } = opts;
			if (!validateWorktreesGcParams(params)) {
				invalidParams(respond);
				return;
			}
			const commitGuard = captureWorktreeMutationGuard(params.expectedOwnerId, opts);
			if (commitGuard === null) return;
			const cfg = context.getRuntimeConfig();
			const limits = resolveWorktreeCleanupLimits();
			const result = await service.gc({
				limits,
				retryDeferred: true,
				...createManagedWorktreeOwnerPolicy(cfg),
				...commitGuard ? {
					commitGuard,
					signal: opts.signal
				} : {}
			});
			commitGuard?.();
			if (params.expectedOwnerId) {
				respond(true, result, void 0);
				return;
			}
			if (result.outcome !== "completed") {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatWorktreeGcResult(result), {
					details: result,
					retryable: false
				}));
				return;
			}
			const { removed, orphansDeleted, snapshotsPruned } = result;
			respond(true, {
				removed,
				orphansDeleted,
				snapshotsPruned
			}, void 0);
		},
		"worktrees.recoverRemoval": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesRecoverRemovalParams(params)) {
				invalidParams(respond);
				return;
			}
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
		},
		"worktrees.retireSnapshot": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesRetireSnapshotParams(params)) {
				invalidParams(respond);
				return;
			}
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
		}
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { worktreesHandlers };
