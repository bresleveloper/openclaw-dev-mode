//#region packages/ai/src/host.ts
const inertAiTransportHost = {
	buildModelFetch: () => void 0,
	resolveSecretSentinel: (value) => value,
	redactSecrets: (value) => value,
	redactToolPayloadText: (text) => text,
	resolveOpenAIStrictToolSetting: (_model, options) => options?.supportsStrictMode ? false : void 0,
	logDebug: () => {}
};
let activeAiTransportHost = inertAiTransportHost;
/** Installs host implementations for the transport policy ports. */
function configureAiTransportHost(host) {
	activeAiTransportHost = {
		...inertAiTransportHost,
		...host
	};
}
/** Returns the active transport host (inert defaults unless configured). */
function getAiTransportHost() {
	return activeAiTransportHost;
}
/** Resolves sentinel substrings in custom headers at a no-fetch adapter boundary. */
function resolveAiTransportHeaderSentinels(headers) {
	if (!headers) return;
	const host = getAiTransportHost();
	let resolvedHeaders;
	for (const [name, value] of Object.entries(headers)) {
		const resolved = host.resolveSecretSentinel(value);
		if (resolved !== value) {
			resolvedHeaders ??= { ...headers };
			resolvedHeaders[name] = resolved;
		}
	}
	return resolvedHeaders ?? headers;
}
//#endregion
export { getAiTransportHost as n, resolveAiTransportHeaderSentinels as r, configureAiTransportHost as t };
