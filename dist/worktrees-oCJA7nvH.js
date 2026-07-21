import { Br as validateWorktreesListParams, Hr as validateWorktreesRestoreParams, Rr as validateWorktreesCreateParams, Vr as validateWorktreesRemoveParams, zr as validateWorktreesGcParams } from "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
import { a as managedWorktrees } from "./service-CZP996nB.js";
//#region src/gateway/server-methods/worktrees.ts
function invalidParams(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid worktrees parameters"));
}
function createWorktreesHandlers(service) {
	return {
		"worktrees.list": async ({ params, respond }) => {
			if (!validateWorktreesListParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, { worktrees: await service.list() }, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.create": async ({ params, respond }) => {
			if (!validateWorktreesCreateParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, await service.create({
					repoRoot: params.repoRoot,
					name: params.name,
					baseRef: params.baseRef,
					ownerKind: "manual"
				}), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.remove": async ({ params, respond }) => {
			if (!validateWorktreesRemoveParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				const result = await service.remove({
					id: params.id,
					reason: "manual-delete",
					force: params.force
				});
				respond(true, {
					removed: result.removed,
					...result.snapshotRef ? { snapshotRef: result.snapshotRef } : {}
				}, void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.restore": async ({ params, respond }) => {
			if (!validateWorktreesRestoreParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, await service.restore({ id: params.id }), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		},
		"worktrees.gc": async ({ params, respond }) => {
			if (!validateWorktreesGcParams(params)) {
				invalidParams(respond);
				return;
			}
			try {
				respond(true, await service.gc(), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			}
		}
	};
}
const worktreesHandlers = createWorktreesHandlers(managedWorktrees);
//#endregion
export { createWorktreesHandlers, worktreesHandlers };
