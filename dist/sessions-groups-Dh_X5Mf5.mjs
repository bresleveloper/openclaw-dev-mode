import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { Ji as validateSessionsGroupsRenameParams, Ui as validateSessionsGroupsDeleteParams, Vi as validateSessionsGroupsDefaultsParams, Wi as validateSessionsGroupsListParams, Yi as validateSessionsGroupsUpdateParams, qi as validateSessionsGroupsPutParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import "./method-scopes-BrMPjfvW.mjs";
import { r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { f as isGatewayAdmin } from "./session-sharing-policy-BVt5saXn.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { u as prepareProjectedSessionSharing } from "./session-sharing-target-read-DUttMvj3.mjs";
import { r as readSessionGroupCatalog, t as ensureSessionGroupCatalog } from "./session-group-catalog-DEO_bQ_M.mjs";
import "./session-sharing-50mq9oo9.mjs";
import { n as resolveWorkspacePathContainment, t as isWorkspacePathContainmentCurrent } from "./workspace-path-containment-qr_FjPfc.mjs";
import { r as emitSessionsChanged } from "./session-change-event-CooG4AKR.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { a as putSessionGroups, n as SessionGroupNotFoundError, o as renameSessionGroup, r as deleteSessionGroup, s as updateSessionGroupDefaults, t as SessionGroupNotEmptyError } from "./session-groups-DIrwSyZ1.mjs";
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
			emitSessionsChanged(context, { reason: "groups" });
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			if (error instanceof SessionGroupNotEmptyError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
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
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			if (error instanceof SessionGroupNotFoundError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
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
		emitSessionsChanged(context, { reason: "groups" });
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
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
		} finally {
			emitSessionsChanged(context, { reason: "groups" });
		}
	})
};
//#endregion
export { sessionGroupHandlers };
