import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { Ng as errorShape, Pg as missingScopeErrorShape, _a as validateSessionsGroupsUpdateParams, da as validateSessionsGroupsDeleteParams, fa as validateSessionsGroupsListParams, ga as validateSessionsGroupsRenameParams, ha as validateSessionsGroupsPutParams, la as validateSessionsGroupsDefaultsParams } from "./src-pLJQA6J5.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { i as resolveSessionStoreAgentId } from "./session-store-key-DKpto8R6.mjs";
import { d as isGatewayAdmin } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as readSessionGroupCatalog, t as ensureSessionGroupCatalog } from "./session-group-catalog-DqTqmjvM.mjs";
import { o as prepareProjectedSessionSharing } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { n as resolveWorkspacePathContainment, t as isWorkspacePathContainmentCurrent } from "./workspace-path-containment-C3E7cQQ3.mjs";
import { a as putSessionGroups, n as SessionGroupNotFoundError, o as renameSessionGroup, r as deleteSessionGroup, s as updateSessionGroupDefaults, t as SessionGroupNotEmptyError } from "./session-groups-DoIlzrnm.mjs";
import path from "node:path";
//#region src/gateway/session-group-defaults-access.ts
/** Keep shared group settings visible only where every member session is mutable. */
async function filterMutableSessionGroupRecords(params) {
	if (params.records().length === 0) return [];
	if (isGatewayAdmin(params.client)) return [...params.records()];
	const projection = getSessionRowProjection(params.context);
	if (!projection) throw new Error("Session group membership is unavailable during Gateway startup");
	do
		await projection.prepareMembership();
	while (projection.needsMembershipPreparation());
	const records = params.records();
	const sharing = prepareProjectedSessionSharing({
		cfg: projection.state.policyConfig,
		client: params.client,
		isMember: (target, identityId) => projection.hasMembership(target.storePath, target.storeKey, identityId)
	});
	const allowed = new Set(records.map((record) => record.name));
	for (const [name, targetRefs] of projection.sessionGroupTargets()) {
		if (!allowed.has(name)) continue;
		for (const ref of targetRefs) {
			const agentId = resolveSessionStoreAgentId(projection.state.cfg, ref.sessionKey, ref.agentId);
			const target = projection.sharingTarget({
				agentId,
				key: ref.sessionKey
			});
			if (!target || sharing.authorizeTarget(target)) {
				allowed.delete(name);
				break;
			}
		}
	}
	return records.filter((record) => allowed.has(record.name));
}
//#endregion
//#region src/gateway/server-methods/sessions-groups.ts
function sessionGroupMutationError(error, inputError) {
	if (error instanceof SessionMutationAuthorizationChangedError) throw error;
	return inputError && error instanceof inputError ? errorShape(ErrorCodes.INVALID_REQUEST, error.message) : errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error));
}
const sessionGroupHandlers = {
	"sessions.groups.list": defineValidatedGatewayHandler("sessions.groups.list", validateSessionsGroupsListParams, async ({ respond }) => {
		await ensureSessionGroupCatalog();
		const { groups, sectionOrder } = readSessionGroupCatalog();
		respond(true, {
			groups,
			sectionOrder
		}, void 0);
	}),
	"sessions.groups.defaults": defineValidatedGatewayHandler("sessions.groups.defaults", validateSessionsGroupsDefaultsParams, async ({ respond, client, context }) => {
		await ensureSessionGroupCatalog();
		respond(true, { defaults: await filterMutableSessionGroupRecords({
			client,
			context,
			records: () => readSessionGroupCatalog().defaults
		}) }, void 0);
	}),
	"sessions.groups.put": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsPutParams, "sessions.groups.put", respond)) return;
		try {
			respond(true, {
				ok: true,
				groups: await putSessionGroups({
					cfg: context.getRuntimeConfig(),
					names: params.names,
					sectionOrder: params.sectionOrder,
					assertCurrent: sessionMutationAuthorization?.assertCurrent,
					assertTargetCurrent: sessionMutationAuthorization?.assertTargetCurrent
				}),
				sectionOrder: readSessionGroupCatalog().sectionOrder
			}, void 0);
			emitSessionsChanged(context, { reason: "groups" }, { catalogOnly: true });
		} catch (error) {
			respond(false, void 0, sessionGroupMutationError(error, SessionGroupNotEmptyError));
		}
	},
	"sessions.groups.rename": defineValidatedGatewayHandler("sessions.groups.rename", validateSessionsGroupsRenameParams, async ({ params, respond, context, sessionMutationAuthorization }) => {
		try {
			respond(true, {
				ok: true,
				...await renameSessionGroup({
					cfg: context.getRuntimeConfig(),
					name: params.name,
					to: params.to,
					assertCurrent: sessionMutationAuthorization?.assertCurrent,
					assertTargetCurrent: sessionMutationAuthorization?.assertTargetCurrent
				})
			}, void 0);
		} catch (error) {
			respond(false, void 0, sessionGroupMutationError(error, SessionGroupNotFoundError));
		} finally {
			emitSessionsChanged(context, { reason: "groups" });
		}
	}),
	"sessions.groups.update": defineValidatedGatewayHandler("sessions.groups.update", validateSessionsGroupsUpdateParams, async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (params.cwd && !path.isAbsolute(params.cwd)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session group cwd must be absolute"));
			return;
		}
		const name = normalizeOptionalString(params.name);
		if (!name) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session group name must not be empty"));
			return;
		}
		let cwd = params.cwd;
		const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
		if (cwd && !clientScopes.includes("operator.admin")) {
			const containment = await resolveWorkspacePathContainment(cwd, context.getRuntimeConfig());
			if (!containment || !isWorkspacePathContainmentCurrent(containment, context.getRuntimeConfig())) {
				respond(false, void 0, missingScopeErrorShape({
					missingScope: ADMIN_SCOPE,
					requiredScopes: [ADMIN_SCOPE]
				}));
				return;
			}
			cwd = containment.path;
		}
		const assertCurrent = (currentTargets) => {
			sessionMutationAuthorization?.assertCurrent();
			if (sessionMutationAuthorization) for (const target of currentTargets ?? []) sessionMutationAuthorization.assertTargetCurrent(target);
		};
		if (!await updateSessionGroupDefaults(name, {
			cwd,
			worktree: params.worktree
		}, process.env, assertCurrent, context.getRuntimeConfig())) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session group: ${name}`));
			return;
		}
		respond(true, {
			ok: true,
			defaults: await filterMutableSessionGroupRecords({
				client,
				context,
				records: () => readSessionGroupCatalog().defaults
			})
		}, void 0);
		emitSessionsChanged(context, { reason: "groups" }, { catalogOnly: true });
	}),
	"sessions.groups.delete": defineValidatedGatewayHandler("sessions.groups.delete", validateSessionsGroupsDeleteParams, async ({ params, respond, context, sessionMutationAuthorization }) => {
		try {
			respond(true, {
				ok: true,
				...await deleteSessionGroup({
					cfg: context.getRuntimeConfig(),
					name: params.name,
					assertCurrent: sessionMutationAuthorization?.assertCurrent,
					assertTargetCurrent: sessionMutationAuthorization?.assertTargetCurrent
				})
			}, void 0);
		} catch (error) {
			respond(false, void 0, sessionGroupMutationError(error));
		} finally {
			emitSessionsChanged(context, { reason: "groups" });
		}
	})
};
//#endregion
export { sessionGroupHandlers };
