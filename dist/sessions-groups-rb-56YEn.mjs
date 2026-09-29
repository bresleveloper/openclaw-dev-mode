import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Fi as validateSessionsGroupsPutParams, Ii as validateSessionsGroupsRenameParams, Li as validateSessionsGroupsUpdateParams, Mi as validateSessionsGroupsListParams, ji as validateSessionsGroupsDeleteParams, ki as validateSessionsGroupsDefaultsParams } from "./src-BRUl7oDv.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveSessionStoreAgentId } from "./session-store-key-BoleEY7N.mjs";
import { C as updateSessionGroupDefaults, S as renameSessionGroup, V as isGatewayAdmin, b as listSidebarSectionOrder, g as deleteSessionGroup, h as SessionGroupNotFoundError, m as SessionGroupNotEmptyError, v as listSessionGroupDefaults, x as putSessionGroups, y as listSessionGroups } from "./session-sharing-C4w_but1.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { t as ensureSessionGroupCatalog } from "./session-group-catalog-DLJCfGiI.mjs";
import { i as prepareProjectedSessionPresentation } from "./session-list-read-result-Dqt3tLkp.mjs";
import { n as resolveWorkspacePathContainment, t as isWorkspacePathContainmentCurrent } from "./workspace-path-containment-HweUC6hk.mjs";
import { r as emitSessionsChanged } from "./session-change-event-DF8JnIsM.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
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
	const prepared = prepareProjectedSessionPresentation(projection, params.client);
	const allowed = new Set(records.map((record) => record.name));
	for (const [name, targetRefs] of projection.sessionGroupTargets()) {
		if (!allowed.has(name)) continue;
		for (const ref of targetRefs) {
			const agentId = resolveSessionStoreAgentId(projection.state.cfg, ref.sessionKey, ref.agentId);
			const target = prepared.target({
				agentId,
				key: ref.sessionKey
			});
			if (!target || prepared.sharing.authorizeTarget(target)) {
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
	"sessions.groups.list": async ({ params, respond }) => {
		if (!assertValidParams(params, validateSessionsGroupsListParams, "sessions.groups.list", respond)) return;
		await ensureSessionGroupCatalog();
		respond(true, {
			groups: listSessionGroups(),
			sectionOrder: listSidebarSectionOrder()
		}, void 0);
	},
	"sessions.groups.defaults": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionsGroupsDefaultsParams, "sessions.groups.defaults", respond)) return;
		await ensureSessionGroupCatalog();
		respond(true, { defaults: await filterMutableSessionGroupRecords({
			client,
			context,
			records: () => listSessionGroupDefaults()
		}) }, void 0);
	},
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
				sectionOrder: listSidebarSectionOrder()
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
	"sessions.groups.rename": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsRenameParams, "sessions.groups.rename", respond)) return;
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
	},
	"sessions.groups.update": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsUpdateParams, "sessions.groups.update", respond)) return;
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
				records: () => listSessionGroupDefaults()
			})
		}, void 0);
		emitSessionsChanged(context, { reason: "groups" });
	},
	"sessions.groups.delete": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsGroupsDeleteParams, "sessions.groups.delete", respond)) return;
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
	}
};
//#endregion
export { sessionGroupHandlers };
