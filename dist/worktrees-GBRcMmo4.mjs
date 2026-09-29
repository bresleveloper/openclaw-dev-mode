import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _c as validateWorktreesRemoveParams, gc as validateWorktreesListParams, hc as validateWorktreesGcParams, mc as validateWorktreesCreateParams, pc as validateWorktreesBranchesParams, vc as validateWorktreesRestoreParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveWorkspacePathContainment } from "./workspace-path-containment-HweUC6hk.mjs";
import { a as managedWorktrees, c as WorktreeSnapshotError, o as resolveWorktreeCleanupLimits } from "./service-JxB03j7i.mjs";
import { t as formatWorktreeGcResult } from "./gc-result-Ba9YFoRv.mjs";
import { t as createManagedWorktreeOwnerPolicy } from "./owner-protection-D5Y9dsxT.mjs";
import { c as resolveRecordedProjectRoot } from "./project-registry-CT4rCnL9.mjs";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
}
async function resolveAuthorizedRepoRoot(method, repoRoot, opts) {
	if ((Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : []).includes("operator.admin")) return repoRoot;
	const authorizedRoot = (await resolveWorkspacePathContainment(repoRoot, opts.context.getRuntimeConfig()))?.path ?? await resolveRecordedProjectRoot(repoRoot);
	if (authorizedRoot) return authorizedRoot;
	opts.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `${method} outside configured agent workspaces requires gateway scope: ${ADMIN_SCOPE}`));
}
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": async ({ params, respond }) => {
			if (!validateWorktreesListParams(params)) {
				invalidParams(respond);
				return;
			}
			respond(true, { worktrees: await service.list() }, void 0);
		},
		"worktrees.create": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
			const repoRoot = await resolveAuthorizedRepoRoot("worktrees.create", params.repoRoot, opts);
			if (!repoRoot) return;
			const scopes = Array.isArray(opts.client?.connect.scopes) ? opts.client.connect.scopes : [];
			respond(true, await service.create({
				repoRoot,
				name: params.name,
				baseRef: params.baseRef,
				ownerKind: "manual",
				runSetupScript: scopes.includes(ADMIN_SCOPE)
			}), void 0);
		},
		"worktrees.remove": async ({ params, respond }) => {
			if (!validateWorktreesRemoveParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				const result = await service.remove({
					id: normalizeOptionalString(params.id) ?? params.id,
					reason: "manual-delete",
					allowSnapshotLoss: params.force
				});
				respond(true, {
					removed: result.removed,
					...result.snapshotRef ? { snapshotRef: result.snapshotRef } : {},
					...result.snapshotError ? { snapshotError: result.snapshotError } : {}
				}, void 0);
			} catch (error) {
				if (error instanceof WorktreeSnapshotError) {
					respond(true, {
						removed: false,
						snapshotError: error.snapshotError
					}, void 0);
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.restore": async ({ params, respond }) => {
			if (!validateWorktreesRestoreParams(params)) {
				invalidParams(respond);
				return;
			}
			const id = normalizeOptionalString(params.id) ?? params.id;
			respond(true, await service.restore({ id }), void 0);
		},
		"worktrees.branches": async (opts) => {
			const { params, respond } = opts;
			if (!validateWorktreesBranchesParams(params)) {
				invalidParams(respond);
				return;
			}
			const repoRoot = await resolveAuthorizedRepoRoot("worktrees.branches", params.repoRoot, opts);
			if (!repoRoot) return;
			respond(true, params.includeRepositoryStatus ? await service.listRepositoryBranches(repoRoot, { includeRepositoryStatus: true }) : await service.listRepositoryBranches(repoRoot), void 0);
		},
		"worktrees.gc": async ({ params, respond, context }) => {
			if (!validateWorktreesGcParams(params)) {
				invalidParams(respond);
				return;
			}
			const cfg = context.getRuntimeConfig();
			const limits = resolveWorktreeCleanupLimits();
			const result = await service.gc({
				limits,
				...createManagedWorktreeOwnerPolicy(cfg)
			});
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
		}
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { worktreesHandlers };
