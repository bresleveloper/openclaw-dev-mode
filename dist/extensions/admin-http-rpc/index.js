import { l as normalizeOptionalString } from "../../string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "../../record-coerce-TIsquoVR.mjs";
import { o as sendHttpRequestRejection } from "../../http-request-lifecycle-DO9mb9Gu.mjs";
import { a as readJsonBodyWithLimit } from "../../http-body-CgfQBa7S.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-BSmCVVpP.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import "../../plugin-runtime-C3Ot0aFc.mjs";
import { t as dispatchGatewayMethod } from "../../gateway-method-runtime-BsuF0-5n.mjs";
import { t as WEBHOOK_BODY_READ_DEFAULTS } from "../../webhook-request-guards-o9Ex3xOU.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/admin-http-rpc/src/methods.ts
const ADMIN_HTTP_RPC_ALLOWED_METHODS = new Set(Object.values({
	gateway: [
		"health",
		"status",
		"logs.tail",
		"usage.status",
		"usage.cost",
		"gateway.restart.request",
		"gateway.suspend.prepare",
		"gateway.suspend.status",
		"gateway.suspend.resume"
	],
	discovery: ["commands.list"],
	config: [
		"config.get",
		"config.schema",
		"config.schema.lookup",
		"config.set",
		"config.patch",
		"config.apply"
	],
	channels: [
		"channels.status",
		"channels.start",
		"channels.stop",
		"channels.logout"
	],
	web: ["web.login.start", "web.login.wait"],
	models: ["models.list", "models.authStatus"],
	agents: [
		"agents.list",
		"agents.create",
		"agents.update",
		"agents.delete"
	],
	approvals: [
		"exec.approvals.get",
		"exec.approvals.set",
		"exec.approvals.node.get",
		"exec.approvals.node.set"
	],
	cron: [
		"cron.status",
		"cron.list",
		"cron.get",
		"cron.runs",
		"cron.add",
		"cron.update",
		"cron.remove",
		"cron.run"
	],
	devices: [
		"device.pair.list",
		"device.pair.approve",
		"device.pair.reject",
		"device.pair.remove"
	],
	nodes: [
		"node.list",
		"node.describe",
		"node.pair.list",
		"node.pair.approve",
		"node.pair.reject",
		"node.pair.remove",
		"node.rename"
	],
	diagnostics: ["doctor.memory.status", "update.status"]
}).flat());
/** Return whether an admin RPC method is exposed over HTTP. */
function isAdminHttpRpcAllowedMethod(method) {
	return ADMIN_HTTP_RPC_ALLOWED_METHODS.has(method);
}
/** List all admin RPC methods exposed over HTTP. */
function listAdminHttpRpcAllowedMethods() {
	return Array.from(ADMIN_HTTP_RPC_ALLOWED_METHODS);
}
//#endregion
//#region extensions/admin-http-rpc/src/handler.ts
function rpcHttpStatus(response) {
	if (response.ok) return 200;
	switch (response.error.code) {
		case "INVALID_REQUEST": return 400;
		case "APPROVAL_NOT_FOUND": return 404;
		case "UNAVAILABLE": return 503;
		case "AGENT_TIMEOUT": return 504;
		case "NOT_LINKED":
		case "NOT_PAIRED": return 409;
		default: return 500;
	}
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(body));
}
function sendError(res, status, error) {
	sendJson(res, status, {
		ok: false,
		error
	});
}
async function readAdminJsonBody(req) {
	const body = await readJsonBodyWithLimit(req, {
		...WEBHOOK_BODY_READ_DEFAULTS.postAuthResponseFirst,
		emptyObjectOnEmpty: false
	});
	if (body.ok) return body;
	if (body.code === "INVALID_JSON") return {
		ok: false,
		status: 400,
		message: body.error === "empty payload" ? "request body must be JSON" : "request body must be valid JSON"
	};
	return {
		ok: false,
		status: body.code === "PAYLOAD_TOO_LARGE" ? 413 : body.code === "REQUEST_BODY_TIMEOUT" ? 408 : 400,
		message: body.error,
		closeAfterResponse: body.code !== "CONNECTION_CLOSED"
	};
}
function readRpcRequestBody(body) {
	if (!isRecord(body)) return {
		ok: false,
		message: "request body must be an object"
	};
	const method = normalizeOptionalString(body.method);
	if (!method) return {
		ok: false,
		message: "method must be a non-empty string"
	};
	return {
		ok: true,
		request: {
			id: normalizeOptionalString(body.id) ?? randomUUID(),
			method,
			...Object.hasOwn(body, "params") ? { params: body.params } : {}
		}
	};
}
async function dispatchAdminRpc(request) {
	const unavailable = {
		code: "UNAVAILABLE",
		message: "gateway method failed before returning a response"
	};
	try {
		const response = await dispatchGatewayMethod(request.method, request.params);
		if (response.ok) return {
			id: request.id,
			ok: true,
			payload: response.payload,
			...response.meta ? { meta: response.meta } : {}
		};
		return {
			id: request.id,
			ok: false,
			error: response.error ?? unavailable,
			...response.meta ? { meta: response.meta } : {}
		};
	} catch {
		return {
			id: request.id,
			ok: false,
			error: unavailable
		};
	}
}
/** Handle one gateway-authenticated Admin HTTP RPC request. */
async function handleAdminHttpRpcRequest(req, res) {
	if ((req.method ?? "GET").toUpperCase() !== "POST") {
		res.setHeader("Allow", "POST");
		sendError(res, 405, {
			type: "method_not_allowed",
			message: "Method Not Allowed"
		});
		return true;
	}
	const body = await readAdminJsonBody(req);
	if (!body.ok) {
		if (body.closeAfterResponse) {
			if (!res.headersSent) res.setHeader("Cache-Control", "no-store");
			await sendHttpRequestRejection(req, res, body.status, JSON.stringify({
				ok: false,
				error: {
					type: "invalid_request",
					message: body.message
				}
			}), "application/json; charset=utf-8");
		} else sendError(res, body.status, {
			type: "invalid_request",
			message: body.message
		});
		return true;
	}
	const parsed = readRpcRequestBody(body.value);
	if (!parsed.ok) {
		sendError(res, 400, {
			type: "invalid_request",
			message: parsed.message
		});
		return true;
	}
	if (!isAdminHttpRpcAllowedMethod(parsed.request.method)) {
		sendJson(res, 400, {
			id: parsed.request.id,
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: `admin HTTP RPC method is not supported: ${parsed.request.method}`
			}
		});
		return true;
	}
	if (parsed.request.method === "commands.list") {
		sendJson(res, 200, {
			id: parsed.request.id,
			ok: true,
			payload: { methods: listAdminHttpRpcAllowedMethods() }
		});
		return true;
	}
	await getPluginRuntimeGatewayRequestScope()?.revalidate?.();
	const response = await dispatchAdminRpc(parsed.request);
	sendJson(res, rpcHttpStatus(response), response);
	return true;
}
//#endregion
//#region extensions/admin-http-rpc/index.ts
/**
* Admin HTTP RPC plugin entry. It exposes a trusted gateway-authenticated HTTP
* endpoint for the explicit admin method allowlist.
*/
var admin_http_rpc_default = definePluginEntry({
	id: "admin-http-rpc",
	name: "Admin HTTP RPC",
	description: "Expose selected Gateway admin RPC methods over HTTP",
	register(api) {
		api.registerHttpRoute({
			path: "/api/v1/admin/rpc",
			auth: "gateway",
			match: "exact",
			gatewayRuntimeScopeSurface: "trusted-operator",
			handler: handleAdminHttpRpcRequest
		});
	}
});
//#endregion
export { admin_http_rpc_default as default };
