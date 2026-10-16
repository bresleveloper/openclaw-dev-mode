//#region packages/ai/src/transports/session-affinity.ts
function isOpencodeEndpoint(baseUrl) {
	const url = URL.parse(baseUrl);
	return url?.protocol === "https:" && url.hostname.replace(/\.$/, "") === "opencode.ai";
}
/** Required conversation identity is independent of optional prompt caching. */
function resolveOpencodeSessionHeaders(model, options) {
	if (!options?.sessionId || !isOpencodeEndpoint(model.baseUrl)) return options?.headers;
	if (hasOpencodeSessionHeader(model, options)) return options.headers;
	return {
		...options.headers,
		"x-opencode-session": options.sessionId
	};
}
function hasOpencodeSessionHeader(model, options) {
	return [model.headers, options?.headers].some((headers) => Object.keys(headers ?? {}).some((name) => name.toLowerCase() === "x-opencode-session"));
}
//#endregion
export { resolveOpencodeSessionHeaders as n, hasOpencodeSessionHeader as t };
