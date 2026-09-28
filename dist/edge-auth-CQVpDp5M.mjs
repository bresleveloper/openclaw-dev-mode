import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as coerceSecretRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as findEdgeAuthIssue } from "./gateway-edge-auth-headers-DIemWTJm.mjs";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.mjs";
import { t as materializeSecretInput } from "./resolve-secret-input-string-DtvH9AFh.mjs";
//#region src/gateway/edge-auth.ts
function normalizeEdgeAuthSecretInput(value, headerName) {
	const ref = coerceSecretRef(value);
	if (ref) return ref;
	const literal = normalizeSecretInputString(value);
	if (literal) return literal;
	throw new Error(`invalid gateway.remote.edgeAuth header "${headerName}": expected a non-empty SecretInput`);
}
function normalizeEdgeAuthHeadersConfig(value) {
	if (value === void 0 || value === null) return;
	if (!isRecord(value)) throw new Error("invalid gateway.remote.edgeAuth: expected a header map");
	const shapeIssue = findEdgeAuthIssue(value);
	if (shapeIssue) throw new Error(shapeIssue.message);
	const normalizedEntries = Object.entries(value).map(([headerName, input]) => {
		return [headerName, normalizeEdgeAuthSecretInput(input, headerName)];
	});
	return Object.fromEntries(normalizedEntries);
}
async function resolveEdgeAuthHeaders(params) {
	if (!params.value) return;
	let protocol;
	try {
		protocol = new URL(params.targetUrl).protocol;
	} catch {
		throw new Error("gateway.remote.edgeAuth requires a wss:// connection target");
	}
	if (protocol !== "wss:") throw new Error("gateway.remote.edgeAuth requires a wss:// connection target");
	const resolvedEntries = await Promise.all(Object.entries(params.value).map(async ([headerName, input]) => {
		const value = await materializeSecretInput({
			config: params.config,
			value: input,
			env: params.env
		});
		if (!value) throw new Error(`gateway.remote.edgeAuth header "${headerName}" resolved empty`);
		registerSecretValueForRedaction(value);
		return [headerName, value];
	}));
	return Object.freeze(Object.fromEntries(resolvedEntries));
}
function gatewayEdgeAuthValueForTarget(params) {
	const remote = params.config.gateway?.remote;
	if (!remote?.url || gatewayOriginScope(params.targetUrl) !== gatewayOriginScope(remote.url)) return;
	return remote.edgeAuth;
}
//#endregion
export { normalizeEdgeAuthHeadersConfig as n, resolveEdgeAuthHeaders as r, gatewayEdgeAuthValueForTarget as t };
