import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as getPluginRegistryVersion } from "./runtime-state-Cd-Ga9cg.mjs";
import { r as getPluginRegistryForContext } from "./gateway-request-scope-BSmCVVpP.mjs";
import { t as isPluginJsonValue } from "./host-hook-json-CvItNyy3.mjs";
import { n as validateJsonSchemaValue } from "./schema-validator-qnYkiHpy.mjs";
import { u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { lr as validatePluginsUiDescriptorsParams, or as validatePluginsSessionActionParams, sr as validatePluginsSessionActionResult, ur as validatePluginsUiDescriptorsResult } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape, p as missingScopeErrorShape } from "./error-codes-Dh56LniQ.mjs";
import { w as formatValidationErrors } from "./worker-protocol-primitives-BajTgPT4.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BrMPjfvW.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Ci099tm9.mjs";
import { a as listControlUiPluginWidgetKinds, i as listControlUiPluginTabs, n as listControlUiPluginDescriptors, t as listControlUiLinkReaders } from "./control-ui-plugin-tabs-Cbijnt6c.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
//#region src/gateway/server-methods/plugin-host-hooks.ts
const log = createSubsystemLogger("gateway/plugin-host-hooks");
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
	"plugins.uiDescriptors": defineValidatedGatewayHandler("plugins.uiDescriptors", validatePluginsUiDescriptorsParams, ({ respond, client, context }) => {
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
	}),
	"plugins.sessionAction": defineValidatedGatewayHandler("plugins.sessionAction", validatePluginsSessionActionParams, async ({ params, client, respond, context }) => {
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
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `plugin session action payload does not match schema: ${validation.errors.map((error) => error.text).join("; ")}`));
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
	})
};
//#endregion
export { pluginHostHookHandlers };
