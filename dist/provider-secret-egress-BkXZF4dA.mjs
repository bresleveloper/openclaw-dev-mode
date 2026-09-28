import { u as swapSecretSentinelsInText } from "./sentinel-C86v7W15.mjs";
import { o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport } from "./provider-request-config-DOrVD029.mjs";
//#region src/agents/provider-secret-egress.ts
function unwrapSecretSentinelsForProviderEgress(value, boundary) {
	const swapped = swapSecretSentinelsInText(value);
	const unknown = swapped.unknown[0];
	if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing ${boundary}`);
	return swapped.text;
}
function unwrapHeaderSentinelsForProviderEgress(input, boundary) {
	let headers;
	for (const [name, value] of Object.entries(input)) {
		if (typeof value !== "string") continue;
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers ??= { ...input };
			headers[name] = resolved;
		}
	}
	return headers ? headers : input;
}
function unwrapHeadersInitSentinelsForProviderEgress(input, boundary) {
	if (!input) return input;
	const headers = new Headers(input);
	let changed = false;
	for (const [name, value] of headers) {
		const resolved = unwrapSecretSentinelsForProviderEgress(value, boundary);
		if (resolved !== value) {
			headers.set(name, resolved);
			changed = true;
		}
	}
	return changed ? headers : input;
}
function unwrapRequestTransportSentinelsForProviderEgress(request, boundary) {
	if (!request) return request;
	const headers = request.headers ? unwrapHeaderSentinelsForProviderEgress(request.headers, boundary) : request.headers;
	let auth = request.auth;
	if (auth?.mode === "authorization-bearer") {
		const token = unwrapSecretSentinelsForProviderEgress(auth.token, boundary);
		if (token !== auth.token) auth = {
			...auth,
			token
		};
	} else if (auth?.mode === "header") {
		const value = unwrapSecretSentinelsForProviderEgress(auth.value, boundary);
		if (value !== auth.value) auth = {
			...auth,
			value
		};
	}
	if (headers === request.headers && auth === request.auth) return request;
	return {
		...request,
		...headers ? { headers } : {},
		...auth ? { auth } : {}
	};
}
function unwrapModelHeaderSentinelsForProviderEgress(model, boundary) {
	const headers = model.headers ? unwrapHeaderSentinelsForProviderEgress(model.headers, boundary) : model.headers;
	const request = getModelProviderRequestTransport(model);
	const unwrappedRequest = unwrapRequestTransportSentinelsForProviderEgress(request, boundary);
	if (headers === model.headers && unwrappedRequest === request) return model;
	const next = headers === model.headers ? { ...model } : {
		...model,
		headers
	};
	return unwrappedRequest === request ? next : attachModelProviderRequestTransport(next, unwrappedRequest);
}
//#endregion
export { unwrapSecretSentinelsForProviderEgress as i, unwrapHeadersInitSentinelsForProviderEgress as n, unwrapModelHeaderSentinelsForProviderEgress as r, unwrapHeaderSentinelsForProviderEgress as t };
