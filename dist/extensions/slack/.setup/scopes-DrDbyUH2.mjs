import { d as createSlackReadClient, o as formatSlackError } from "./probe-BVlJ3dp0.mjs";
import { isRecord, normalizeOptionalString, normalizeTrimmedStringList, sortUniqueStrings } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/scopes.ts
function collectScopes(value, into) {
	if (Array.isArray(value) || typeof value === "string") {
		for (const scope of normalizeTrimmedStringList(typeof value === "string" ? value.split(/[,\s]+/) : value)) into.push(scope);
		return;
	}
	if (!isRecord(value)) return;
	for (const entry of Object.values(value)) if (Array.isArray(entry) || typeof entry === "string") collectScopes(entry, into);
}
function extractScopes(payload) {
	if (!isRecord(payload)) return [];
	const scopes = [];
	collectScopes(payload.scopes, scopes);
	collectScopes(payload.scope, scopes);
	if (isRecord(payload.response_metadata)) collectScopes(payload.response_metadata.scopes, scopes);
	if (isRecord(payload.info)) {
		collectScopes(payload.info.scopes, scopes);
		collectScopes(payload.info.scope, scopes);
		collectScopes(payload.info.user_scopes, scopes);
		collectScopes(payload.info.bot_scopes, scopes);
	}
	return sortUniqueStrings(scopes);
}
async function callSlack(client, method) {
	try {
		const result = await client.apiCall(method);
		return isRecord(result) ? result : null;
	} catch (err) {
		return {
			ok: false,
			error: formatSlackError(err)
		};
	}
}
async function fetchSlackScopes(token, timeoutMs) {
	const client = createSlackReadClient(token, { timeout: timeoutMs });
	const attempts = [
		"auth.test",
		"auth.scopes",
		"apps.permissions.info"
	];
	const errors = [];
	for (const method of attempts) {
		const result = await callSlack(client, method);
		const scopes = extractScopes(result);
		if (scopes.length > 0) return {
			ok: true,
			scopes,
			source: method
		};
		const error = normalizeOptionalString(result?.error);
		if (error) errors.push(`${method}: ${error}`);
	}
	return {
		ok: false,
		error: errors.length > 0 ? errors.join(" | ") : "no scopes returned"
	};
}
//#endregion
export { fetchSlackScopes };
