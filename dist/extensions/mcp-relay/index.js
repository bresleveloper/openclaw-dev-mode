import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { l as safeError, n as RelayError } from "../../protocol-BGPlkY3T.mjs";
import { r as relayCaller, t as consentAuthority } from "../../caller-DU1i5s6-.mjs";
//#region extensions/mcp-relay/openclaw.plugin.json
var configSchema = {
	"type": "object",
	"additionalProperties": false,
	"properties": {
		"relayUrl": {
			"type": "string",
			"default": "https://mcp.openclaw.ai",
			"pattern": "^(?:https://[^\\s/?#@\\\\]+|http://(?:localhost|127\\.0\\.0\\.1)(?::[0-9]+)?)/?$"
		},
		"agentId": {
			"type": "string",
			"minLength": 1
		}
	}
};
//#endregion
//#region extensions/mcp-relay/src/config.ts
const DEFAULT_RELAY_URL = "https://mcp.openclaw.ai";
function parseMcpRelayConfig(raw) {
	const value = raw === void 0 ? {} : raw;
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("MCP relay config must be an object.");
	if (Object.keys(value).some((key) => key !== "relayUrl" && key !== "agentId")) throw new Error("MCP relay config supports only relayUrl and agentId.");
	const relayUrl = "relayUrl" in value ? value.relayUrl : DEFAULT_RELAY_URL;
	if (typeof relayUrl !== "string" || !new RegExp(configSchema.properties.relayUrl.pattern).test(relayUrl)) throw new Error("relayUrl must be an HTTPS origin without credentials, a path, query, or fragment; use HTTP only with localhost or 127.0.0.1 for development.");
	let url;
	try {
		url = new URL(relayUrl);
	} catch {
		throw new Error("relayUrl must be a valid relay origin. Check its hostname and port.");
	}
	if (url.pathname !== "/" || url.username || url.password || url.search || url.hash) throw new Error("relayUrl must contain only the relay origin. Remove credentials and paths.");
	const agentId = "agentId" in value ? value.agentId : void 0;
	if (agentId !== void 0 && (typeof agentId !== "string" || !agentId.trim())) throw new Error("agentId must be a nonempty agent ID. Omit it to use the Gateway default.");
	return {
		relayUrl: url.origin,
		...agentId === void 0 ? {} : { agentId }
	};
}
const mcpRelayConfigSchema = {
	jsonSchema: configSchema,
	safeParse(value) {
		try {
			return {
				success: true,
				data: parseMcpRelayConfig(value)
			};
		} catch (error) {
			return {
				success: false,
				error: { issues: [{
					path: [],
					message: error instanceof Error ? error.message : "Invalid MCP relay config."
				}] }
			};
		}
	}
};
//#endregion
//#region extensions/mcp-relay/src/gateway-methods.ts
function registerMcpRelayGatewayMethods(api, getService) {
	for (const operation of [
		"status",
		"pair",
		"grants",
		"revoke",
		"authorize.describe",
		"authorize.approve",
		"authorize.deny"
	]) api.registerGatewayMethod(`mcp-relay.${operation}`, async ({ params, client, respond, signal, hasCurrentClientAuthority }) => {
		const assertCurrent = () => {
			signal?.throwIfAborted();
			if (!hasCurrentClientAuthority?.()) throw new RelayError("unavailable", "Gateway authorization ended. Reconnect and retry the command.");
		};
		try {
			assertCurrent();
			const active = getService();
			if (!active) throw new RelayError("unavailable", "MCP relay is not running. Enable mcp-relay and restart the Gateway.");
			const allowed = operation === "revoke" ? ["grantId"] : operation === "pair" ? ["ceiling"] : operation.startsWith("authorize.") ? ["requestId", ...operation === "authorize.approve" ? ["ceiling"] : []] : [];
			if (!isRecord(params) || Object.keys(params).some((key) => !allowed.includes(key))) throw new RelayError("invalid_params", "Use the Connected apps controls or the mcp-relay CLI commands.");
			let result;
			if (operation === "status") result = await active.status();
			else {
				const caller = relayCaller(client, api.runtime.config.current());
				if (operation === "grants") result = await active.grants(caller);
				else if (operation === "revoke") {
					if (typeof params.grantId !== "string" || !params.grantId || params.grantId.length > 200) throw new RelayError("invalid_params", "Choose a connected app to revoke.");
					const { grants } = await active.grants(caller);
					if (!grants.some((grant) => grant.grantId === params.grantId)) throw new RelayError("not_found", "Connected app not found. Refresh the list and choose one of your apps.");
					result = await active.revoke(params.grantId, assertCurrent);
				} else if (operation === "pair") result = await active.pair(assertCurrent, consentAuthority(caller, params.ceiling));
				else {
					if (typeof params.requestId !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(params.requestId)) throw new RelayError("invalid_params", "This connection link is invalid. Start connecting again.");
					if (operation === "authorize.describe") result = {
						...await active.consent.describe(params.requestId, assertCurrent),
						caller
					};
					else if (operation === "authorize.approve") result = await active.consent.approve(params.requestId, consentAuthority(caller, params.ceiling), assertCurrent);
					else result = await active.consent.deny(params.requestId, assertCurrent);
				}
			}
			assertCurrent();
			respond(true, result);
		} catch (error) {
			const safe = safeError(error);
			respond(false, void 0, {
				code: safe.code === "invalid_params" ? "INVALID_REQUEST" : "UNAVAILABLE",
				message: safe.message,
				details: { code: safe.code }
			});
		}
	}, { scope: operation === "status" || operation === "grants" || operation === "authorize.describe" ? "operator.read" : "operator.write" });
}
function registerMcpRelayConnectRoute(api, relayUrl) {
	const base = api.config.gateway?.controlUi?.basePath?.trim().replace(/^\/+|\/+$/gu, "");
	const basePath = base ? `/${base}` : "";
	for (const path of /* @__PURE__ */ new Set(["/mcp-relay/connect", `${basePath}/mcp-relay/connect`])) api.registerHttpRoute({
		path,
		auth: "plugin",
		match: "exact",
		handler(req, res) {
			const url = new URL(req.url ?? "/", "http://gateway.invalid");
			const requestId = url.searchParams.get("request");
			const relay = url.searchParams.get("relay");
			res.setHeader("Cache-Control", "no-store");
			res.setHeader("Referrer-Policy", "no-referrer");
			if (req.method !== "GET" && req.method !== "HEAD" || !requestId || !/^[A-Za-z0-9_-]{43}$/.test(requestId) || relay !== null && relay !== relayUrl) {
				res.statusCode = 400;
				res.end("Invalid connection link. Start connecting again from your app.");
				return;
			}
			const query = new URLSearchParams({
				plugin: "mcp-relay",
				id: "connected-apps",
				"p.request": requestId
			});
			res.statusCode = 303;
			res.setHeader("Location", `${basePath}/plugin?${query}`);
			res.end();
		}
	});
}
//#endregion
//#region extensions/mcp-relay/index.ts
var mcp_relay_default = definePluginEntry({
	id: "mcp-relay",
	name: "MCP Relay",
	description: "Connect remote MCP clients to this Gateway through an outbound relay",
	configSchema: mcpRelayConfigSchema,
	register(api) {
		let service;
		api.registerCli(async (context) => {
			const { registerMcpRelayCli } = await import("../../cli-DpvqTcoW.mjs");
			await registerMcpRelayCli(context);
		}, { descriptors: [{
			name: "mcp-relay",
			description: "Inspect the MCP relay connection and manage client grants",
			hasSubcommands: true
		}] });
		registerMcpRelayGatewayMethods(api, () => service);
		registerMcpRelayConnectRoute(api, parseMcpRelayConfig(api.pluginConfig).relayUrl);
		api.session.controls.registerControlUiDescriptor({
			surface: "tab",
			id: "connected-apps",
			slug: "connected-apps",
			label: "Connected apps",
			icon: "plug",
			group: "control",
			requiredScopes: ["operator.read"]
		});
		api.registerService({
			id: "mcp-relay",
			apiVersion: 2,
			async start(context) {
				const { RelayState } = await import("../../state-CuY_Aao6.mjs");
				const { RelayService: Service } = await import("../../service-CmpBhGyi.mjs");
				const { createOperations } = await import("../../operations-B6wz8-hr.mjs");
				const config = parseMcpRelayConfig(api.pluginConfig);
				const scheduler = context.scheduler;
				const state = new RelayState(api.runtime, config.relayUrl, () => scheduler.signal.throwIfAborted());
				const identity = await state.initialize();
				scheduler.signal.throwIfAborted();
				const gateway = {
					name: "OpenClaw",
					version: api.runtime.version
				};
				service = new Service({
					scheduler,
					state,
					identity,
					relayUrl: config.relayUrl,
					gateway,
					controlUiIngress: context.controlUiIngress,
					config: () => api.runtime.config.current(),
					operations: createOperations({
						logger: api.logger,
						gateway,
						agentId: config.agentId
					})
				});
				service.start();
			},
			async stop() {
				const active = service;
				service = void 0;
				await active?.stop();
			}
		});
	}
});
//#endregion
export { mcp_relay_default as default };
