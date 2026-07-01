import { r as __exportAll } from "./chunk-CNf5ZN-e.js";
import { n as validateToolCall, t as validateToolArguments } from "./src-M7TBQdDX.js";
import { r as createAssistantMessageEventStream, t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { c as clampReasoning, l as calculateCost, n as transformMessages, o as adjustMaxTokensForThinking, s as buildBaseOptions, t as sanitizeSurrogates, u as clampThinkingLevel } from "./sanitize-unicode-DcA7E1vi.js";
import { c as registerApiProvider, i as streamSimple, l as unregisterApiProviders, n as completeSimple, o as getApiProvider, r as stream, s as getApiProviders, t as complete } from "./stream-Bs1DzXcN.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { n as parseStreamingJson } from "./json-parse-CydVzlvP.js";
import { r as resolveEnvNodeProxyUrlForTarget, t as createFixedNodeProxyAgentPair } from "./node-proxy-agent-CWnkEd0Y.js";
//#region src/llm/utils/node-http-proxy.ts
/** Resolves the environment proxy URL that applies to a target URL. */
function resolveHttpProxyUrlForTarget(targetUrl) {
	return resolveEnvNodeProxyUrlForTarget(targetUrl);
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
function createHttpProxyAgentsForTarget(targetUrl) {
	const proxyUrl = resolveHttpProxyUrlForTarget(targetUrl);
	if (!proxyUrl) return;
	return createFixedNodeProxyAgentPair(proxyUrl);
}
//#endregion
//#region src/plugin-sdk/llm.ts
var llm_exports = /* @__PURE__ */ __exportAll({
	AssistantMessageEventStream: () => AssistantMessageEventStream,
	adjustMaxTokensForThinking: () => adjustMaxTokensForThinking,
	buildBaseOptions: () => buildBaseOptions,
	calculateCost: () => calculateCost,
	clampReasoning: () => clampReasoning,
	clampThinkingLevel: () => clampThinkingLevel,
	complete: () => complete,
	completeSimple: () => completeSimple,
	createAssistantMessageEventStream: () => createAssistantMessageEventStream,
	createHttpProxyAgentsForTarget: () => createHttpProxyAgentsForTarget,
	getApiProvider: () => getApiProvider,
	getApiProviders: () => getApiProviders,
	getEnvApiKey: () => getEnvApiKey,
	parseStreamingJson: () => parseStreamingJson,
	registerApiProvider: () => registerApiProvider,
	sanitizeSurrogates: () => sanitizeSurrogates,
	stream: () => stream,
	streamSimple: () => streamSimple,
	transformMessages: () => transformMessages,
	unregisterApiProviders: () => unregisterApiProviders,
	validateToolArguments: () => validateToolArguments,
	validateToolCall: () => validateToolCall
});
//#endregion
export { createHttpProxyAgentsForTarget as n, llm_exports as t };
