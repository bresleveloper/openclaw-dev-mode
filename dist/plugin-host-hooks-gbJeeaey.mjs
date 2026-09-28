import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { i as getPluginRegistryVersion } from "./runtime-state-C5tDvNBc.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-G8odGT6Q.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-BdcyDerH.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { _h as formatValidationErrors, ar as validatePluginsSessionActionResult, cr as validatePluginsUiDescriptorsResult, ir as validatePluginsSessionActionParams, sr as validatePluginsUiDescriptorsParams } from "./src-BRUl7oDv.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { a as resolveStoredSessionKeyForAgentStore } from "./session-store-key-BoleEY7N.mjs";
import { a as listControlUiPluginWidgetKinds, i as listControlUiPluginTabs, n as listControlUiPluginDescriptors, t as listControlUiLinkReaders } from "./control-ui-plugin-tabs-DjZIdZqM.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/gateway/server-methods/plugin-host-hooks.ts
const log = createSubsystemLogger("gateway/plugin-host-hooks");
function formatSessionActionPayloadSchemaErrors(errors) {
	return errors.map((error) => error.text).join("; ");
}
/** Ensures plugin action result extension fields stay JSON-compatible on the wire. */
function validatePluginSessionActionJsonFields(result) {
	for (const field of [
		"result",
		"reply",
		"details"
	]) if (result[field] !== void 0 && !isPluginJsonValue(result[field])) return `plugin session action ${field} must be JSON-compatible`;
}
/** Gateway handlers for plugin-declared Control UI descriptors and session actions. */
const pluginHostHookHandlers = {
	"plugins.uiDescriptors": ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validatePluginsUiDescriptorsParams, "plugins.uiDescriptors", respond)) return;
		const methods = context.getGatewayMethodRegistry?.();
		if (!methods) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Gateway plugin capabilities are unavailable in this runtime."));
			return;
		}
		const scopes = client?.connect.scopes ?? [];
		const result = {
			ok: true,
			generation: getPluginRegistryVersion(getPluginRegistryForContext()),
			descriptors: listControlUiPluginDescriptors(scopes),
			methods: methods.listAdvertisedMethods(),
			controlUiTabs: listControlUiPluginTabs(scopes, { requireGatewayAuthGrant: context.getRuntimeConfig().gateway?.auth?.mode !== "none" }),
			controlUiWidgetKinds: listControlUiPluginWidgetKinds(scopes),
			controlUiLinkReaders: listControlUiLinkReaders(scopes, methods),
			pluginSurfaceUrls: client?.pluginSurfaceUrls ?? {}
		};
		if (!validatePluginsUiDescriptorsResult(result)) {
			log.warn("invalid plugins.uiDescriptors result", { errors: validatePluginsUiDescriptorsResult.errors });
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `invalid plugins.uiDescriptors result: ${formatValidationErrors(validatePluginsUiDescriptorsResult.errors)}`));
			return;
		}
		respond(true, result, void 0);
	},
	"plugins.sessionAction": async ({ params, client, respond, context }) => {
		if (!assertValidParams(params, validatePluginsSessionActionParams, "plugins.sessionAction", respond)) return;
		const pluginId = normalizeOptionalString(params.pluginId);
		const actionId = normalizeOptionalString(params.actionId);
		const rawSessionKey = normalizeOptionalString(params.sessionKey);
		const sessionOwner = rawSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), rawSessionKey, normalizeOptionalString(params.agentId)) : void 0;
		if (sessionOwner && !sessionOwner.ok) {
			respond(false, void 0, sessionOwner.error);
			return;
		}
		const sessionKey = rawSessionKey && sessionOwner?.ok ? resolveStoredSessionKeyForAgentStore({
			cfg: context.getRuntimeConfig(),
			agentId: sessionOwner.agentId,
			sessionKey: rawSessionKey
		}) : void 0;
		if (!pluginId || !actionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugins.sessionAction pluginId and actionId must be non-empty"));
			return;
		}
		const registry = getPluginRegistryForContext();
		const pluginLoaded = Boolean(registry?.plugins.some((plugin) => plugin.id === pluginId && plugin.status === "loaded"));
		const registration = (registry?.sessionActions ?? []).find((entry) => entry.pluginId === pluginId && entry.action.id === actionId);
		if (!registration || !pluginLoaded) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `unknown plugin session action: ${pluginId}/${actionId}`));
			return;
		}
		const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
		const requiredScopes = registration.action.requiredScopes && registration.action.requiredScopes.length > 0 ? registration.action.requiredScopes : [WRITE_SCOPE];
		const missingScope = requiredScopes.find((scope) => !authorizeOperatorScopesForRequiredScope(scope, scopes).allowed);
		if (missingScope) {
			respond(false, void 0, missingScopeErrorShape({
				missingScope,
				requiredScopes
			}));
			return;
		}
		try {
			if (params.payload !== void 0 && !isPluginJsonValue(params.payload)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action payload must be JSON-compatible"));
				return;
			}
			if (registration.action.schema !== void 0) {
				if (typeof registration.action.schema !== "boolean" && !isRecord(registration.action.schema)) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action schema must be an object or boolean"));
					return;
				}
				const validation = validateJsonSchemaValue({
					schema: registration.action.schema,
					cacheKey: `plugin-session-action:${pluginId}:${actionId}`,
					value: params.payload
				});
				if (!validation.ok) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `plugin session action payload does not match schema: ${formatSessionActionPayloadSchemaErrors(validation.errors)}`));
					return;
				}
			}
			const result = await registration.action.handler({
				pluginId,
				actionId,
				...sessionKey ? { sessionKey } : {},
				...sessionOwner?.ok ? { agentId: sessionOwner.agentId } : {},
				...params.payload !== void 0 ? { payload: params.payload } : {},
				client: {
					...client?.connId ? { connId: client.connId } : {},
					scopes: [...scopes]
				}
			});
			if (result !== void 0 && !isRecord(result)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "plugin session action result must be an object"));
				return;
			}
			const wireResult = result?.ok === false ? result : {
				ok: true,
				...result
			};
			if (!validatePluginsSessionActionResult(wireResult)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `invalid plugin session action result: ${formatValidationErrors(validatePluginsSessionActionResult.errors)}`));
				return;
			}
			const jsonFieldError = result ? validatePluginSessionActionJsonFields(result) : void 0;
			if (jsonFieldError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, jsonFieldError));
				return;
			}
			if (!wireResult.ok) {
				respond(true, {
					ok: false,
					error: wireResult.error,
					...wireResult.code !== void 0 ? { code: wireResult.code } : {},
					...wireResult.details !== void 0 ? { details: wireResult.details } : {}
				}, void 0);
				return;
			}
			respond(true, {
				ok: true,
				...wireResult.result !== void 0 ? { result: wireResult.result } : {},
				...wireResult.continueAgent !== void 0 ? { continueAgent: wireResult.continueAgent } : {},
				...wireResult.reply !== void 0 ? { reply: wireResult.reply } : {}
			});
		} catch (error) {
			log.warn(`plugin session action failed plugin=${pluginId} action=${actionId}: ${formatErrorMessage(error)}`);
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "plugin session action failed"));
		}
	}
};
//#endregion
export { pluginHostHookHandlers };
